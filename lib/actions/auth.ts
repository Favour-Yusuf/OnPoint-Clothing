"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  status: "idle" | "error";
  message?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Only ever redirect to a same-origin relative path — a `next` value from
// the client is untrusted input, and honoring an absolute/protocol-relative
// URL here would be an open redirect.
function safeNextPath(next: FormDataEntryValue | null): string | null {
  const value = String(next ?? "");
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

export async function signUp(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim();

  if (!EMAIL_RE.test(email)) return { status: "error", message: "Enter a valid email address." };
  if (password.length < 8) return { status: "error", message: "Password must be at least 8 characters." };
  if (!fullName) return { status: "error", message: "Enter your full name." };

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${siteUrl}/auth/confirm`,
    },
  });

  if (error) return { status: "error", message: error.message };

  // No session means Supabase requires email confirmation before the
  // account is usable — the common/default configuration. Send them to a
  // dedicated "check your email" state instead of silently landing back on
  // the sign-in form with no explanation.
  if (!data.session) {
    redirect(`/account/verify-email?email=${encodeURIComponent(email)}`);
  }

  redirect("/account");
}

export async function signIn(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("next"));

  if (!EMAIL_RE.test(email) || !password) {
    return { status: "error", message: "Enter your email and password." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Supabase returns a generic invalid-credentials error both when the
    // password is wrong and when the account is unconfirmed; check status
    // explicitly so an unverified customer gets sent back to the right
    // place instead of a confusing "incorrect password".
    if (error.code === "email_not_confirmed") {
      redirect(`/account/verify-email?email=${encodeURIComponent(email)}`);
    }
    return { status: "error", message: "Incorrect email or password." };
  }

  const { data: customer } = await supabase
    .from("customers")
    .select("is_admin")
    .eq("id", data.user.id)
    .maybeSingle();

  // Admins always land on the dashboard — signing into an admin-enabled
  // account signals intent to manage the business, not to shop.
  if (customer?.is_admin) redirect("/admin");

  // A non-admin should never be bounced toward /admin even if that's where
  // they were headed before signing in — the admin guard would immediately
  // redirect them back out anyway, so just skip the pointless round trip.
  redirect(next && !next.startsWith("/admin") ? next : "/account");
}

export async function resendVerificationEmail(email: string): Promise<{ ok: boolean; message: string }> {
  if (!EMAIL_RE.test(email)) return { ok: false, message: "Invalid email address." };

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: `${siteUrl}/auth/confirm` },
  });

  if (error) {
    // Supabase itself rate-limits this endpoint — surface its message
    // (e.g. "you can only request this after 34 seconds") rather than a
    // generic failure.
    return { ok: false, message: error.message };
  }

  return { ok: true, message: "Verification email sent." };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/account");
}
