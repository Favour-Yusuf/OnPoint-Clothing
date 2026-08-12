"use server";

export type CheckoutState = {
  status: "idle" | "success" | "error";
  message?: string;
  orderId?: string;
  errors?: Record<string, string>;
};

const REQUIRED_FIELDS = ["email", "fullName", "address1", "city", "state", "postalCode", "country"] as const;

export async function placeOrder(_prevState: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const errors: Record<string, string> = {};

  for (const field of REQUIRED_FIELDS) {
    if (!String(formData.get(field) ?? "").trim()) {
      errors[field] = "Required";
    }
  }

  const email = String(formData.get("email") ?? "");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email";
  }

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please complete the required fields.", errors };
  }

  // No payment provider is connected yet. This records the order intent only —
  // it does not charge a card or guarantee fulfillment. Once a processor
  // (e.g. Stripe) is chosen, its charge call belongs here, gated on its result.
  const orderId = `ONPT-${Date.now().toString(36).toUpperCase()}`;

  return {
    status: "success",
    orderId,
    message: "Your order details have been received.",
  };
}
