import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

const PILLARS = [
  {
    title: "Multiple Award-Winning",
    description: "A fashion company recognized for excellence.",
  },
  {
    title: "Nigeria's Most Desirable",
    description: "One of the country's most sought-after fashion houses.",
  },
  {
    title: "A Game Changer",
    description: "A top celebrity clothier, redefining what's next.",
  },
] as const;

export function Recognition() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <Container>
        <Reveal className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-burgundy" aria-hidden="true" />
            <p className="font-sans text-xs font-light tracking-[0.35em] text-burgundy-light uppercase">Recognition</p>
            <span className="h-px w-8 bg-burgundy" aria-hidden="true" />
          </div>
          <h2 className="max-w-lg font-display text-3xl leading-tight font-light text-foreground sm:text-4xl">
            Innovative, influential, <em className="text-burgundy-light italic">progressive.</em>
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 divide-y divide-foreground/10 border-y border-foreground/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {PILLARS.map((pillar, index) => (
            <Reveal key={pillar.title} delayMs={index * 100} className="flex flex-col items-center gap-3 px-6 py-10 text-center">
              <p className="font-display text-2xl font-light text-burgundy-light italic sm:text-3xl">{pillar.title}</p>
              <p className="max-w-[220px] text-sm leading-relaxed text-stone">{pillar.description}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
