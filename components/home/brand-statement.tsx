import { Reveal } from "@/components/ui/reveal";
import { Container } from "@/components/ui/container";

export function BrandStatement() {
  return (
    <section className="bg-foreground py-24 text-background sm:py-32">
      <Container>
        <Reveal className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-20">
          <div className="flex flex-col gap-4 lg:w-2/5">
            <p className="font-sans text-xs font-medium tracking-[0.35em] text-burgundy uppercase">Since 2007</p>
            <h2 className="font-serif text-4xl leading-[1.05] font-light sm:text-5xl lg:text-6xl">
              19 Years.
              <br />
              One Standard.
            </h2>
          </div>
          <div className="flex flex-col gap-6 lg:w-2/5">
            <div className="h-px w-16 bg-burgundy" aria-hidden="true" />
            <p className="text-lg leading-relaxed text-background/70">
              OnPoint Clothing has spent nineteen years on the same premise: that clothing built with care outlasts
              clothing built for a season. Every piece is still measured against that standard — construction over
              trend, fit over flourish.
            </p>
            <p className="text-base leading-relaxed text-background/55">
              This site is the newest expression of that standard. The clothes haven&rsquo;t changed. The way you
              find them has.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
