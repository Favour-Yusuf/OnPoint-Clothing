"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Gives the user a moment to see the confirmation before moving on, while
// still respecting reduced-motion/attention needs via the manual "Continue"
// link rendered alongside this (see verify-email success page) — this isn't
// the only way to proceed.
export function VerifiedRedirect({ to, delayMs = 3000 }: { to: string; delayMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push(to), delayMs);
    return () => clearTimeout(timer);
  }, [to, delayMs, router]);

  return null;
}
