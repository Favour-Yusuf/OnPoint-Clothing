"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { MediaImage } from "@/components/ui/media-image";
import { Reveal } from "@/components/ui/reveal";
import { ExpressionLightbox } from "@/components/expression/expression-lightbox";
import { onPointExpression } from "@/lib/data/onpoint-expression";

export function ExpressionBehindTheScenes() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const images = onPointExpression.behindTheScenes;

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Behind the Scenes"
          title="What the room doesn't see."
          description="The ring light, the steaming rack, the last stitch before the walk; the part of the night that makes the rest of it possible."
        />

        {/* Deliberately narrower and smaller-scale than the sections around
            it — this is the one part of the night meant to feel glimpsed,
            not presented. */}
        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-3 gap-3 sm:mt-20 sm:gap-4">
          {images.map((image, index) => (
            <Reveal
              key={image.publicId}
              delayMs={(index % 3) * 70}
              className={`relative w-full ${image.orientation === "landscape" ? "aspect-4/3" : "aspect-4/5"} ${
                index === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-label={`Open image: ${image.alt}`}
                className="group absolute inset-0 block overflow-hidden bg-foreground/5 grayscale-[15%] transition-[filter] duration-500 hover:grayscale-0"
              >
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                  {/* Grid stays 3-up (grid-cols-3) at every breakpoint, capped by the
                      max-w-4xl container — tile widths don't shrink at sm the way the
                      old "22vw" implied, and the first tile spans 2 columns. */}
                  <MediaImage
                    image={image}
                    sizes={index === 0 ? "(min-width: 896px) 580px, 66vw" : "(min-width: 896px) 280px, 33vw"}
                  />
                </div>
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
