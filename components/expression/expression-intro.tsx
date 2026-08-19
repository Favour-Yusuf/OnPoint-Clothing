import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export function ExpressionIntro() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-burgundy" aria-hidden="true" />
            <p className="font-sans text-xs font-light tracking-[0.35em] text-burgundy-light uppercase">The Idea</p>
            <span className="h-px w-8 bg-burgundy" aria-hidden="true" />
          </div>
          <h2 className="font-display text-3xl leading-tight font-light text-foreground sm:text-5xl">
            Not a showcase. A statement.
          </h2>
          <p className="text-lg leading-relaxed text-foreground/70">
            OnPoint Expression is the one night a year the house stops making clothes and starts making an argument
            — that fashion, done properly, is culture, not commerce.
          </p>
          <p className="max-w-lg text-base leading-relaxed text-stone">
            Every look, every set piece, every guest in the room is part of the same sentence: craftsmanship worn as
            confidence. It is where OnPoint tells you, in public, what nineteen years in the workroom were building
            toward.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
