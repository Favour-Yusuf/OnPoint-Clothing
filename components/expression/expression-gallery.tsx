"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { MediaImage } from "@/components/ui/media-image";
import { Reveal } from "@/components/ui/reveal";
import { ExpressionLightbox } from "@/components/expression/expression-lightbox";
import { onPointExpression } from "@/lib/data/onpoint-expression";

export function ExpressionGallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const images = onPointExpression.gallery;

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="The Gallery"
          title="As it happened."
          description="Unposed, unfiltered — the night from the room, backstage, and the stage itself."
        />

        {/* CSS multi-column masonry: each item keeps its real aspect ratio
            (set per image in lib/data/onpoint-expression.ts) so heights vary
            naturally, without a JS layout library. */}
        <div className="mt-14 columns-2 gap-4 sm:columns-3 lg:columns-4">
          {images.map((image, index) => (
            <Reveal key={image.publicId} delayMs={(index % 4) * 60} className="mb-4 break-inside-avoid">
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-label={`Open image: ${image.alt}`}
                className={`group relative block w-full overflow-hidden bg-foreground/5 ${
                  image.orientation === "landscape" ? "aspect-3/2" : "aspect-4/5"
                }`}
              >
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                  <MediaImage image={image} sizes="(min-width: 1024px) 24vw, (min-width: 640px) 33vw, 50vw" />
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
