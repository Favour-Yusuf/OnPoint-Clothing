import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { MediaImage } from "@/components/ui/media-image";
import { Reveal } from "@/components/ui/reveal";
import { onPointExpression } from "@/lib/data/onpoint-expression";

export function ExpressionExperience() {
  const { atmosphere, performance, style, detail } = onPointExpression.experience;

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="The Experience"
          title="A night built like a set."
          description="Every corner of the venue is art-directed — the room, the stage, the crowd, the clothes. Nothing about it is left to chance."
        />
      </Container>

      <Reveal className="relative mt-14 aspect-3/2 w-full sm:aspect-21/9">
        <MediaImage image={atmosphere} sizes="100vw" />
        <div className="absolute inset-0 bg-linear-to-t from-background/70 via-transparent to-transparent" />
      </Reveal>

      <Container className="mt-16 sm:mt-24">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-6">
          <Reveal className="flex flex-col gap-5 lg:col-span-5">
            <div className="h-[3px] w-16 bg-burgundy" aria-hidden="true" />
            <h3 className="font-display text-2xl leading-tight font-light text-foreground sm:text-3xl">
              The room is staged, not just decorated.
            </h3>
            <p className="max-w-md text-base leading-relaxed text-foreground/60">
              Light, texture, and sound are tuned like a set, because for one night, it is one — a lounge built for
              the crowd to become part of the show.
            </p>
          </Reveal>
          <Reveal delayMs={100} className="relative aspect-4/5 w-full lg:col-span-7 lg:-mt-20">
            <MediaImage image={performance} sizes="(min-width: 1024px) 58vw, 100vw" />
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 items-end gap-8 lg:mt-24 lg:grid-cols-12 lg:gap-6">
          <Reveal className="relative aspect-4/5 w-full lg:col-span-6">
            <MediaImage image={style} sizes="(min-width: 1024px) 48vw, 100vw" />
          </Reveal>
          <div className="flex flex-col gap-8 lg:col-span-6">
            <Reveal delayMs={100} className="relative aspect-3/2 w-full">
              <MediaImage image={detail} sizes="(min-width: 1024px) 48vw, 100vw" />
            </Reveal>
            <Reveal delayMs={150} className="flex flex-col gap-5">
              <div className="h-[3px] w-16 bg-burgundy" aria-hidden="true" />
              <h3 className="font-display text-2xl leading-tight font-light text-foreground sm:text-3xl">
                Every entrance starts on a rack.
              </h3>
              <p className="max-w-md text-base leading-relaxed text-foreground/60">
                The same hands that cut for the shop floor cut for the stage — construction first, spectacle second.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
