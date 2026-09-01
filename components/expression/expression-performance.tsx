"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { MediaImage } from "@/components/ui/media-image";
import { Reveal } from "@/components/ui/reveal";
import { ExpressionLightbox } from "@/components/expression/expression-lightbox";
import { onPointExpression } from "@/lib/data/onpoint-expression";

// Every source photo is a portrait crop, so size variation here comes from
// deliberate grid spans (with object-cover accepting the crop) rather than
// from each image's native aspect ratio — one anchor image plus two smaller
// beats and a closing wide band, instead of a uniform grid.
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
        <SectionHeading
          eyebrow="Performance"
          title="The stage, at full volume."
          description="Sound and spectacle, staged like the rest of the night with the same attention as the clothes."
        />

        <div className="mt-14 grid grid-flow-row-dense grid-cols-2 gap-3 sm:mt-20 sm:grid-cols-4 sm:gap-4">
          {images.map((image, index) => (
            <Reveal key={image.publicId} delayMs={(index % 4) * 60} className={SPANS[index % SPANS.length]}>
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-label={`Open image: ${image.alt}`}
                className="group relative block h-full w-full overflow-hidden bg-foreground/5"
              >
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                  <MediaImage image={image} sizes="(min-width: 640px) 25vw, 50vw" />
                </div>
                <div className="absolute inset-0 bg-burgundy-deep/0 transition-colors duration-300 group-hover:bg-burgundy-deep/15" />
              </button>
            </Reveal>
          ))}
        </div>
      </Container>

      {openIndex !== null ? (
        <ExpressionLightbox images={images} index={openIndex} onClose={() => setOpenIndex(null)} onNavigate={setOpenIndex} />
      ) : null}
    </section>
  );
}
