import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { MediaImage } from "@/components/ui/media-image";
import { Reveal } from "@/components/ui/reveal";
import { onPointExpression } from "@/lib/data/onpoint-expression";
import type { ExpressionLook } from "@/lib/data/onpoint-expression";

export function ExpressionLooks() {
  return (
    <section className="bg-foreground py-24 text-background sm:py-32">
      <Container>
        <SectionHeading
          tone="on-light"
          eyebrow="The Looks"
          title="Let the clothes talk."
          description="A first look at what walked into the room — captured as it happened, not staged after the fact."
        />

        <div className="mt-16 flex flex-col gap-20 sm:gap-28">
          {onPointExpression.looks.map((look, index) => (
            <LookBlock key={look.name} look={look} reverse={index % 2 === 1} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function LookBlock({ look, reverse }: { look: ExpressionLook; reverse: boolean }) {
  const [primary, ...rest] = look.images;

  return (
    <Reveal className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
      <div
        className={`relative aspect-4/5 w-full lg:col-span-7 ${reverse ? "lg:order-2" : ""}`}
      >
        <MediaImage image={primary} sizes="(min-width: 1024px) 55vw, 100vw" />
      </div>

      <div className={`flex flex-col gap-6 lg:col-span-5 ${reverse ? "lg:order-1" : ""}`}>
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-burgundy" aria-hidden="true" />
          <h3 className="font-sans text-xs font-light tracking-[0.35em] text-burgundy uppercase">{look.name}</h3>
        </div>
        <p className="max-w-sm border-l border-burgundy/30 pl-4 text-sm leading-relaxed text-background/50 italic">
          {look.description}
        </p>

        {rest.length > 0 ? (
          <div className="mt-2 grid grid-cols-2 gap-3">
            {rest.map((image) => (
              <div key={image.publicId} className="relative aspect-4/5 w-full">
                <MediaImage image={image} sizes="(min-width: 1024px) 20vw, 45vw" />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}
