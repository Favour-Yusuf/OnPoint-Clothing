"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { resendVerificationEmail } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { MailIcon } from "@/components/ui/icons";

const COOLDOWN_SECONDS = 30;
const STORAGE_PREFIX = "onpoint:verify-cooldown:";

function cooldownEndFor(email: string): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(STORAGE_PREFIX + email);
  return raw ? Number(raw) : 0;
}

export function VerifyEmailView({ email }: { email: string }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((cooldownEndFor(email) - Date.now()) / 1000));
      setSecondsLeft(remaining);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [email]);

  function handleResend() {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const result = await resendVerificationEmail(email);
      if (result.ok) {
        setMessage(result.message);
        window.localStorage.setItem(STORAGE_PREFIX + email, String(Date.now() + COOLDOWN_SECONDS * 1000));
        setSecondsLeft(COOLDOWN_SECONDS);
      } else {
        setError(result.message);
      }
    });
  }

  const disabled = isPending || secondsLeft > 0;

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-foreground/20">
        <MailIcon className="h-6 w-6 text-foreground/60" />
      </span>

      <div>
        <h1 className="font-serif text-3xl font-light text-foreground sm:text-4xl">Check Your Email</h1>
        <p className="mt-3 text-sm leading-relaxed text-foreground/60">
          We&rsquo;ve sent a verification link to your email address. Verify your email to finish setting up your
          account.
        </p>
      </div>

      <p className="font-sans text-sm text-foreground/80">
        Verification email sent to <span className="text-foreground">{email}</span>
      </p>

      <div className="flex flex-col items-center gap-2">
        <Button type="button" variant="outline" size="md" disabled={disabled} onClick={handleResend}>
          {isPending ? "Sending…" : "Resend Email"}
        </Button>
        <p aria-live="polite" className="font-sans text-xs text-foreground/45">
          {error
            ? error
            : message
              ? message
              : secondsLeft > 0
                ? `Resend available in ${secondsLeft}s`
                : null}
        </p>
      </div>

      <Link
        href="/account"
        className="font-sans text-xs text-foreground/50 underline-offset-4 hover:text-foreground hover:underline"
      >
        Back to Sign In
      </Link>
    </div>
  );
}
