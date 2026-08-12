import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { UserIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Account",
};

export default function AccountPage() {
  return (
    <div className="flex min-h-[70vh] items-center bg-background pt-16 lg:pt-20">
      <Container className="flex flex-col items-center gap-6 py-24 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-foreground/20">
          <UserIcon className="h-6 w-6 text-foreground/60" />
        </span>
        <h1 className="font-serif text-3xl font-light text-foreground sm:text-4xl">Accounts Are Coming Soon</h1>
        <p className="max-w-sm text-sm leading-relaxed text-foreground/55">
          Sign-in isn&rsquo;t available yet. In the meantime, browse the collection or reach out directly.
        </p>
        <div className="flex gap-4">
          <Button href="/shop">Shop OnPoint</Button>
          <Button href="mailto:hello@justonpointng.com" variant="outline">
            Contact Us
          </Button>
        </div>
      </Container>
    </div>
  );
}
