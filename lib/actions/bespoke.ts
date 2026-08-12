"use server";

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

  // No CRM/inbox is connected yet — this is where the enquiry would be
  // forwarded to the bespoke team once a provider is chosen.
  return { status: "success", message: "Your enquiry has been received. Our bespoke team will be in touch within two business days." };
}
