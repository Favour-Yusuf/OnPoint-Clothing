import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ExpressionHero } from "@/components/expression/expression-hero";
import { ExpressionIntro } from "@/components/expression/expression-intro";
import { ExpressionRedCarpet } from "@/components/expression/expression-red-carpet";
import { ExpressionRunway } from "@/components/expression/expression-runway";
import { ExpressionHost } from "@/components/expression/expression-host";
import { ExpressionPerformance } from "@/components/expression/expression-performance";
import { ExpressionBehindTheScenes } from "@/components/expression/expression-behind-the-scenes";
import { ExpressionLegacy } from "@/components/expression/expression-legacy";

export const metadata: Metadata = {
  title: "OnPoint Expression",
  description: "Where fashion finds its voice. Inside OnPoint Clothing's flagship fashion event.",
};

export default function ExpressionPage() {
  return (
    <div className="bg-background">
      <ExpressionHero />
      <ExpressionIntro />
      <ExpressionRedCarpet />
      <ExpressionRunway />
      <ExpressionHost />
      <ExpressionPerformance />
      <ExpressionBehindTheScenes />
      <ExpressionLegacy />

      <section className="relative overflow-hidden border-t border-burgundy/25 bg-background py-28 sm:py-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 h-160 w-160 -translate-x-1/2 -translate-y-1/2 rounded-full bg-burgundy/20 blur-[160px]"
        />
        <Container className="relative z-10 flex flex-col items-center gap-8 text-center">
          <span className="h-px w-12 bg-burgundy" aria-hidden="true" />
          <h2 className="font-display text-4xl leading-[1.05] font-light text-foreground sm:text-6xl">
            Discover <em className="text-burgundy-light italic">the collection.</em>
          </h2>
          <p className="max-w-md text-base leading-relaxed text-foreground/65">
            Expression is the stage. The clothes are always waiting on the other side of it.
          </p>
          <Button href="/shop" size="lg">
            Shop OnPoint
          </Button>
        </Container>
      </section>
    </div>
  );
}
