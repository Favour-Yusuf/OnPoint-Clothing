import { Reveal } from "@/components/ui/reveal";
import { Container } from "@/components/ui/container";

export function BrandStatement() {
  return (
    <section className="relative overflow-hidden bg-foreground py-24 text-background sm:py-32">
      <p
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-6 -z-0 select-none font-display text-[16rem] leading-none font-light text-burgundy/[0.06] italic sm:text-[22rem]"
      >
        &rdquo;
      </p>

      <Container className="relative">
        <Reveal className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-20">
          <div className="flex flex-col gap-4 lg:w-2/5">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-burgundy" aria-hidden="true" />
              <p className="font-sans text-xs font-light tracking-[0.35em] text-burgundy uppercase">Multiple Award-Winning</p>
            </div>
            <h2 className="font-display text-4xl leading-[1.05] font-light sm:text-5xl lg:text-6xl">
              Many Honors.
              <br />
              <span className="text-burgundy italic">One Standard.</span>
            </h2>
          </div>
          <div className="flex flex-col gap-6 lg:w-2/5">
            <div className="h-[3px] w-16 bg-burgundy" aria-hidden="true" />
            <p className="text-lg leading-relaxed text-background/75">
              OnPoint Clothing has built its name on the same premise: that clothing made with care outlasts
              clothing made for a season. Every piece is still measured against that standard; construction over
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
