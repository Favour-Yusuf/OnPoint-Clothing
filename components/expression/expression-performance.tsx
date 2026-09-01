"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { MediaImage } from "@/components/ui/media-image";
import { Reveal } from "@/components/ui/reveal";
import { ExpressionLightbox } from "@/components/expression/expression-lightbox";
import { onPointExpression } from "@/lib/data/onpoint-expression";

// Every source photo is (mostly) a portrait crop, so size variation here
// comes from deliberate grid spans rather than each image's native aspect
// ratio. The 4-tile unit (anchor, small, small, wide) repeats via
// `index % SPANS.length` to tile however many images the section holds.
const SPANS = [
  "col-span-2 row-span-2 aspect-4/5 sm:aspect-auto",
  "aspect-4/5",
  "aspect-4/5",
  "col-span-2 aspect-16/9 sm:aspect-16/9",
];

export function ExpressionPerformance() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const images = onPointExpression.performance;

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading title="Performance" />

        <div className="mt-14 grid grid-flow-row-dense grid-cols-2 gap-3 sm:mt-20 sm:grid-cols-4 sm:gap-4">
          {images.map((image, index) => {
            const span = SPANS[index % SPANS.length];
            // The wide 16:9 tile only suits a genuinely landscape source photo —
            // forcing a portrait crop into it cuts the subject's head off.
            const isWideSlot = span.includes("aspect-16/9");
            const className = isWideSlot && image.orientation !== "landscape" ? "aspect-4/5" : span;
            const isBigTile = className.includes("col-span-2");

            return (
              <Reveal key={image.publicId} delayMs={(index % 4) * 60} className={className}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  aria-label={`Open image: ${image.alt}`}
                  className="group relative block h-full w-full overflow-hidden bg-foreground/5"
                >
                  <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                    <MediaImage image={image} sizes={isBigTile ? "(min-width: 640px) 50vw, 100vw" : "(min-width: 640px) 25vw, 50vw"} />
                  </div>
                  <div className="absolute inset-0 bg-burgundy-deep/0 transition-colors duration-300 group-hover:bg-burgundy-deep/15" />
                </button>
              </Reveal>
            );
          })}
        </div>
      </Container>

      {openIndex !== null ? (
        <ExpressionLightbox images={images} index={openIndex} onClose={() => setOpenIndex(null)} onNavigate={setOpenIndex} />
      ) : null}
    </section>
  );
}
