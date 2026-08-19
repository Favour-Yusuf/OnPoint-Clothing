"use server";

import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { notifyAdminOfBespokeRequest } from "@/lib/notifications/bespoke";

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

  const name = String(formData.get("name"));
  const phone = String(formData.get("phone") ?? "") || null;
  const garmentType = String(formData.get("garmentType"));
  const notes = String(formData.get("notes"));

  const { data: inserted, error } = await supabase
    .from("bespoke_requests")
    .insert({
      customer_id: user?.id ?? null,
      name,
      email,
      phone,
      garment_type: garmentType,
      notes,
    })
    .select("id")
    .single();

  if (error || !inserted) {
    return { status: "error", message: "We couldn't submit your enquiry. Please try again." };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  after(() =>
    notifyAdminOfBespokeRequest({
      name,
      email,
      phone,
      garmentType,
      notes,
      adminUrl: `${siteUrl}/admin/bespoke/${inserted.id}`,
    })
  );

  return { status: "success", message: "Your enquiry has been received. Our bespoke team will be in touch within two business days." };
}
