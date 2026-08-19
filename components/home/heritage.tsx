import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export function Heritage() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <Container>
        <Reveal className="flex flex-col items-center gap-10 text-center">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-burgundy" aria-hidden="true" />
            <p className="font-sans text-xs font-light tracking-[0.35em] text-burgundy-light uppercase">Nineteen Years</p>
            <span className="h-px w-8 bg-burgundy" aria-hidden="true" />
          </div>

          <div className="flex w-full max-w-3xl items-center gap-6 sm:gap-10">
            <span className="font-display text-4xl font-light text-foreground sm:text-5xl">2007</span>
            <span className="relative h-px flex-1 bg-foreground/15">
              <span className="animate-reveal-line absolute inset-y-0 left-0 w-full origin-left bg-burgundy" />
            </span>
            <span className="font-display text-4xl font-light text-burgundy-light sm:text-5xl">2026</span>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-stone">
            Two decades of craft, told properly — the full story of the house is coming soon.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
