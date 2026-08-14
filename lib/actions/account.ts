"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AddressState = {
  status: "idle" | "error";
  message?: string;
};

const REQUIRED_FIELDS = ["fullName", "address1", "city", "state", "postalCode", "country"] as const;

export async function addAddress(_prevState: AddressState, formData: FormData): Promise<AddressState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "You must be signed in." };

  for (const field of REQUIRED_FIELDS) {
    if (!String(formData.get(field) ?? "").trim()) {
      return { status: "error", message: "Please complete all required fields." };
    }
  }

  const { error } = await supabase.from("addresses").insert({
    customer_id: user.id,
    label: String(formData.get("label") ?? "") || null,
    full_name: String(formData.get("fullName")),
    address1: String(formData.get("address1")),
    address2: String(formData.get("address2") ?? "") || null,
    city: String(formData.get("city")),
    state: String(formData.get("state")),
    postal_code: String(formData.get("postalCode")),
    country: String(formData.get("country")),
    phone: String(formData.get("phone") ?? "") || null,
  });

  if (error) return { status: "error", message: "Could not save address. Please try again." };

  revalidatePath("/account");
  return { status: "idle" };
}

export async function deleteAddress(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const addressId = String(formData.get("addressId") ?? "");
  if (!addressId) return;

  // RLS also enforces this, but scoping the delete to the current user here
  // keeps the intent explicit and avoids relying on RLS alone.
  await supabase.from("addresses").delete().eq("id", addressId).eq("customer_id", user.id);

  revalidatePath("/account");
}
