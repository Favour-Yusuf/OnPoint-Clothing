"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center bg-background pt-16 lg:pt-20">
      <Container className="flex flex-col items-center gap-6 py-24 text-center">
        <p className="font-sans text-xs font-medium tracking-[0.3em] text-burgundy uppercase">Something Went Wrong</p>
        <h1 className="font-serif text-3xl font-light text-foreground sm:text-4xl">We hit a snag.</h1>
        <p className="max-w-sm text-sm leading-relaxed text-foreground/55">
          Please try again. If the issue continues, come back a little later.
        </p>
        <div className="flex gap-4">
          <Button type="button" onClick={reset}>
            Try Again
          </Button>
          <Button href="/" variant="outline">
            Return Home
          </Button>
        </div>
      </Container>
    </div>
  );
}
