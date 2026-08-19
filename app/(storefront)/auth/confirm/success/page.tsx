import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { CheckIcon } from "@/components/ui/icons";
import { VerifiedRedirect } from "@/components/account/verified-redirect";

export const metadata: Metadata = {
  title: "Email Verified",
};

export default async function EmailVerifiedPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  // Only ever follow a same-origin relative path here too.
  const destination = next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";

  return (
    <div className="flex min-h-[70vh] items-center bg-background pt-16 lg:pt-20">
      <Container className="flex flex-col items-center gap-6 py-24 text-center">
        <VerifiedRedirect to={destination} />
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-burgundy-light">
          <CheckIcon className="h-6 w-6 text-burgundy-light" />
        </span>
        <div>
          <h1 className="font-display text-3xl font-light text-foreground sm:text-4xl">Email Verified</h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-foreground/60">
            Your account is now verified. Taking you onward&hellip;
          </p>
        </div>
        <Link
          href={destination}
          className="font-sans text-xs font-light tracking-[0.18em] text-foreground/70 uppercase underline-offset-4 hover:text-foreground hover:underline"
        >
          Continue
        </Link>
      </Container>
    </div>
  );
}
