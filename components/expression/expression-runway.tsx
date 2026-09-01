"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { MediaImage } from "@/components/ui/media-image";
import { Reveal } from "@/components/ui/reveal";
import { ExpressionLightbox } from "@/components/expression/expression-lightbox";
import { onPointExpression } from "@/lib/data/onpoint-expression";
import type { ExpressionImage } from "@/lib/data/onpoint-expression";

export function ExpressionRunway() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { opener, hero, wall } = onPointExpression.runway;
  const images: ExpressionImage[] = [opener, ...hero, ...wall];

  function open(image: ExpressionImage) {
    setOpenIndex(images.indexOf(image));
  }

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading title="Runway" />
      </Container>

      <Reveal className="relative mt-14 aspect-16/9 w-full">
        <button type="button" onClick={() => open(opener)} aria-label={`Open image: ${opener.alt}`} className="absolute inset-0 block">
          <MediaImage image={opener} sizes="100vw" />
          <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent" />
        </button>
      </Reveal>

      {/* Hero band: the standout shots at large scale. Landscape entries span
          both columns so the four wide cinematic frames break up the mostly
          portrait grid instead of clustering together. */}
      <Container className="mt-4 sm:mt-5">
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {hero.map((image) => (
            <Reveal
              key={image.publicId}
              className={`relative w-full ${
                image.orientation === "landscape" ? "col-span-2 aspect-16/9" : "aspect-4/5"
              }`}
            >
              <button type="button" onClick={() => open(image)} aria-label={`Open image: ${image.alt}`} className="group absolute inset-0 block overflow-hidden">
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                  <MediaImage
                    image={image}
                    sizes={
                      image.orientation === "landscape"
                        ? "(min-width: 1024px) 92vw, 100vw"
                        : "(min-width: 1024px) 23vw, 46vw"
                    }
                  />
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        {/* Wall: the dense "contact sheet" of every remaining runway shot. */}
        <div className="mt-16 grid grid-cols-2 gap-3 sm:mt-24 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {wall.map((image) => (
            <Reveal
              key={image.publicId}
              className={`relative w-full ${
                image.orientation === "landscape" ? "col-span-2 aspect-16/9 sm:col-span-3 lg:col-span-2" : "aspect-4/5"
              }`}
            >
              <button type="button" onClick={() => open(image)} aria-label={`Open image: ${image.alt}`} className="group absolute inset-0 block overflow-hidden bg-foreground/5">
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                  <MediaImage image={image} sizes="(min-width: 1024px) 23vw, (min-width: 640px) 32vw, 46vw" />
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
