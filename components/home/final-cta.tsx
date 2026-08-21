import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-burgundy/25 bg-background py-28 sm:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-160 w-160 -translate-x-1/2 -translate-y-1/2 rounded-full bg-burgundy/20 blur-[160px]"
      />
      <Reveal className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-8 px-6 text-center">
        <span className="h-px w-12 bg-burgundy" aria-hidden="true" />
        <h2 className="font-display text-4xl leading-[1.05] font-light text-foreground sm:text-6xl">
          Find your next <em className="text-burgundy-light italic">signature.</em>
        </h2>
        <Button href="/shop" size="lg">
          Shop OnPoint
        </Button>
      </Reveal>
    </section>
  );
}
