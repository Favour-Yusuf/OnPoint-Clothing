import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { VerifyEmailView } from "@/components/account/verify-email-view";

export const metadata: Metadata = {
  title: "Check Your Email",
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  if (!email) redirect("/account");

  return (
    <div className="flex min-h-[70vh] items-center bg-background pt-16 lg:pt-20">
      <Container className="py-24">
        <VerifyEmailView email={email} />
      </Container>
    </div>
  );
}
