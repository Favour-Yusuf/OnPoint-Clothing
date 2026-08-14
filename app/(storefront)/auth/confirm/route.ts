import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { EmailOtpType } from "@supabase/supabase-js";

// Reached from the "Confirm signup" link in the verification email. Requires
// the Supabase project's email template to link here with token_hash/type
// params (Dashboard → Authentication → Email Templates → Confirm signup),
// and this route added to the Redirect URLs allowlist — see docs/COMMERCE_SETUP.md.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (tokenHash && type) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });

    if (!error && data.user) {
      const { data: customer } = await supabase
        .from("customers")
        .select("is_admin")
        .eq("id", data.user.id)
        .maybeSingle();

      const destination = customer?.is_admin ? "/admin" : "/account";
      redirect(`/auth/confirm/success?next=${encodeURIComponent(destination)}`);
    }
  }

  redirect("/account?error=verification_failed");
}
