"use server";

import { createClient } from "@/lib/supabase/server";

export type BespokeFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
};

const REQUIRED_FIELDS = ["name", "email", "garmentType", "notes"] as const;

export async function submitBespokeRequest(
  _prevState: BespokeFormState,
  formData: FormData
): Promise<BespokeFormState> {
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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("bespoke_requests").insert({
    customer_id: user?.id ?? null,
    name: String(formData.get("name")),
    email,
    phone: String(formData.get("phone") ?? "") || null,
    garment_type: String(formData.get("garmentType")),
    notes: String(formData.get("notes")),
  });

  if (error) {
    return { status: "error", message: "We couldn't submit your enquiry. Please try again." };
  }

  // No CRM/inbox is connected yet — the OnPoint team currently follows up
  // from the admin dashboard's Bespoke section rather than an email alert.
  return { status: "success", message: "Your enquiry has been received. Our bespoke team will be in touch within two business days." };
}
