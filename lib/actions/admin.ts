"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BespokeStatus, OrderStatus, PaymentStatus } from "@/lib/types";

const VALID_ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "ready_for_delivery",
  "shipped",
  "delivered",
  "cancelled",
];

const VALID_PAYMENT_STATUSES: PaymentStatus[] = ["pending", "paid", "failed", "refunded"];

const VALID_BESPOKE_STATUSES: BespokeStatus[] = [
  "new",
  "contacted",
  "consultation",
  "in_progress",
  "completed",
  "cancelled",
];

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: customer } = await supabase.from("customers").select("is_admin").eq("id", user.id).maybeSingle();
  if (!customer?.is_admin) return null;

  return supabase;
}

export type AdminActionState = {
  status: "idle" | "error";
  message?: string;
};

export async function updateOrderStatus(_prevState: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const supabase = await requireAdmin();
  if (!supabase) return { status: "error", message: "Not authorized." };

  const orderId = String(formData.get("orderId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!orderId || !VALID_ORDER_STATUSES.includes(status as OrderStatus)) {
    return { status: "error", message: "Invalid status." };
  }

  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) return { status: "error", message: "Could not update the order. Please try again." };

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return { status: "idle" };
}

// Marks a payment paid/failed/refunded — the counterpart to the automatic
// Paystack webhook, used when a payment was confirmed some other way (a bank
// transfer receipt sent over WhatsApp, most often). RLS only grants admins
// SELECT on payments (see 0004_rls.sql), so this writes through the
// service-role client — safe here because requireAdmin() already confirmed
// the caller is an admin before either write runs.
export async function updateOrderPaymentStatus(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const supabase = await requireAdmin();
  if (!supabase) return { status: "error", message: "Not authorized." };

  const orderId = String(formData.get("orderId") ?? "");
  const paymentStatus = String(formData.get("paymentStatus") ?? "");
  if (!orderId || !VALID_PAYMENT_STATUSES.includes(paymentStatus as PaymentStatus)) {
    return { status: "error", message: "Invalid payment status." };
  }

  const admin = createAdminClient();
  const paidAt = paymentStatus === "paid" ? new Date().toISOString() : null;

  const { error: orderError } = await admin.from("orders").update({ payment_status: paymentStatus }).eq("id", orderId);
  if (orderError) return { status: "error", message: "Could not update the order. Please try again." };

  const { error: paymentError } = await admin
    .from("payments")
    .update({ status: paymentStatus, paid_at: paidAt })
    .eq("order_id", orderId);
  if (paymentError) {
    return { status: "error", message: "Order was updated, but the payment record couldn't be updated." };
  }

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin/payments");
  revalidatePath("/admin");
  return { status: "idle" };
}

export async function updateBespokeStatus(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const supabase = await requireAdmin();
  if (!supabase) return { status: "error", message: "Not authorized." };

  const requestId = String(formData.get("requestId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!requestId || !VALID_BESPOKE_STATUSES.includes(status as BespokeStatus)) {
    return { status: "error", message: "Invalid status." };
  }

  const { error } = await supabase.from("bespoke_requests").update({ status }).eq("id", requestId);
  if (error) return { status: "error", message: "Could not update the request. Please try again." };

  revalidatePath(`/admin/bespoke/${requestId}`);
  revalidatePath("/admin/bespoke");
  revalidatePath("/admin");
  return { status: "idle" };
}
