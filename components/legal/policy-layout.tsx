import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";

export function PolicyLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-background pt-16 lg:pt-20">
      <Container className="py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-4xl leading-tight font-light text-foreground sm:text-5xl">{title}</h1>
          <p className="mt-3 font-sans text-xs font-light tracking-[0.2em] text-foreground/45 uppercase">
            Last updated {updated}
          </p>

          <div className="mt-12 flex flex-col gap-8">{children}</div>
        </div>
      </Container>
    </div>
  );
}

export function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-sans text-sm font-semibold tracking-[0.1em] text-foreground uppercase">{title}</h2>
      <div className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-foreground/65">{children}</div>
    </section>
  );
}
