"use server";

import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateCartItems, type CartValidationIssue } from "@/lib/cart/validate";
import { getShippingZone, SHIPPING_RATES, NIGERIA } from "@/lib/shipping";
import type { CartItem, ShippingAddress } from "@/lib/types";

export type CheckoutState = {
  status: "idle" | "error" | "ready" | "bank_transfer";
  message?: string;
  errors?: Record<string, string>;
  payment?: {
    reference: string;
    amount: number; // minor units — what the inline popup must charge
    email: string;
    orderId: string;
  };
  bankTransfer?: {
    orderNumber: string;
    total: number; // minor units
  };
};

const REQUIRED_FIELDS = ["email", "fullName", "address1", "city", "state", "postalCode", "country"] as const;

const ORDER_CURRENCY = "NGN";

function describeIssue(issue: CartValidationIssue): string {
  switch (issue.type) {
    case "unavailable":
      return "An item in your bag is no longer available.";
    case "insufficient_stock":
      return `Only ${issue.available} left of an item in your bag, please adjust the quantity.`;
    case "price_changed":
      return "The price of an item in your bag has changed. Please review your bag and try again.";
  }
}

export async function placeOrder(_prevState: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const errors: Record<string, string> = {};
  for (const field of REQUIRED_FIELDS) {
    if (!String(formData.get(field) ?? "").trim()) errors[field] = "Required";
  }

  const email = String(formData.get("email") ?? "").trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email";
  }

  const country = String(formData.get("country") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim();
  const lagosAreaRaw = String(formData.get("lagosArea") ?? "").trim();
  const lagosArea = lagosAreaRaw === "island" || lagosAreaRaw === "mainland" ? lagosAreaRaw : undefined;
  // The Lagos Island/Mainland choice only renders in the form once country
  // + state resolve to Lagos, Nigeria — enforced again here since a server
  // action can't rely on the client having shown it.
  if (country === NIGERIA && state === "Lagos" && !lagosArea) {
    errors.lagosArea = "Required";
  }

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please complete the required fields.", errors };
  }

  let cartItems: CartItem[];
  try {
    cartItems = JSON.parse(String(formData.get("cartItems") ?? "[]"));
  } catch {
    return { status: "error", message: "Your bag data was invalid. Please refresh and try again." };
  }
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return { status: "error", message: "Your bag is empty." };
  }

  const validation = await validateCartItems(cartItems);
  if (!validation.valid) {
    const message = validation.issues[0] ? describeIssue(validation.issues[0]) : "Your bag needs a second look.";
    return { status: "error", message: `${message} Please review your bag before continuing.` };
  }

  const shippingZone = getShippingZone(country, state, lagosArea);
  const shippingFee = SHIPPING_RATES[shippingZone].fee ?? 0;
  const subtotal = validation.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const total = subtotal + shippingFee;

  const shippingAddress: ShippingAddress = {
    fullName: String(formData.get("fullName")),
    address1: String(formData.get("address1")),
    address2: String(formData.get("address2") ?? "") || undefined,
    city: String(formData.get("city")),
    state,
    postalCode: String(formData.get("postalCode")),
    country,
    phone: String(formData.get("phone") ?? "") || undefined,
    shippingZone,
  };

  const paymentMethod = String(formData.get("paymentMethod") ?? "paystack");
  const isBankTransfer = paymentMethod === "bank_transfer";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const admin = createAdminClient();
  // Paystack reads this reference to open the correct transaction; a bank
  // transfer has no external processor, so its reference just identifies the
  // payments row (and is prefixed distinctly for admin-side scanability).
  const reference = isBankTransfer ? `onpt_bank_${randomUUID()}` : `onpt_${randomUUID()}`;

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      customer_name: shippingAddress.fullName,
      customer_email: email,
      customer_phone: shippingAddress.phone ?? null,
      subtotal,
      shipping_fee: shippingFee,
      total,
      currency: ORDER_CURRENCY,
      shipping_address: shippingAddress,
      // Only a real Paystack attempt gets a paystack_reference — a bank
      // transfer order has nothing for the Paystack verify/webhook flow to
      // match against, so this stays null and payment confirmation is
      // manual (admin marks it paid once the receipt/transfer is checked).
      paystack_reference: isBankTransfer ? null : reference,
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    return { status: "error", message: "We couldn't place your order. Please try again." };
  }

  const orderItemRows = validation.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    variant_id: item.variantId,
    product_name: item.productName,
    size: item.size,
    color: item.color,
    sku: item.sku,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    total_price: item.unitPrice * item.quantity,
  }));

  const { error: itemsError } = await admin.from("order_items").insert(orderItemRows);
  const { error: paymentError } = await admin.from("payments").insert({
    order_id: order.id,
    provider: isBankTransfer ? "bank_transfer" : "paystack",
    reference,
    amount: total,
    currency: ORDER_CURRENCY,
  });

  if (itemsError || paymentError) {
    await admin.from("orders").delete().eq("id", order.id);
    return { status: "error", message: "We couldn't place your order. Please try again." };
  }

  if (isBankTransfer) {
    // No admin notification fires here on purpose — the customer is sent
    // straight to WhatsApp with their order number to send the receipt,
    // which is the actual real-time signal to the OnPoint team. The order
    // still sits in admin as a normal pending/unpaid order either way.
    return {
      status: "bank_transfer",
      bankTransfer: { orderNumber: order.order_number, total },
    };
  }

  // No server-side Paystack call here — the inline popup creates the
  // transaction itself when the customer submits their card details,
  // using this reference/amount. Confirmation (verify + webhook) happens
  // after that, never before.
  return {
    status: "ready",
    payment: { reference, amount: total, email, orderId: order.id },
  };
}
