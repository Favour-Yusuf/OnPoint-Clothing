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
  const { cinematic, looks } = onPointExpression.runway;
  const [opener, ...rail] = cinematic;
  const images: ExpressionImage[] = [...cinematic, ...looks];

  function open(image: ExpressionImage) {
    setOpenIndex(images.indexOf(image));
  }

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="The Runway"
          title="This is what recognition sounds like."
          description="The clothes, presented the way they were built to be seen: one walk, one look, one argument at a time."
        />
      </Container>

      <Reveal className="relative mt-14 aspect-16/9 w-full">
        <button type="button" onClick={() => open(opener)} aria-label={`Open image: ${opener.alt}`} className="absolute inset-0 block">
          <MediaImage image={opener} sizes="100vw" />
          <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent" />
        </button>
      </Reveal>

      <Container className="mt-4 sm:mt-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {rail.map((image) => (
            <Reveal key={image.publicId} className="relative aspect-16/9 w-full">
              <button type="button" onClick={() => open(image)} aria-label={`Open image: ${image.alt}`} className="group absolute inset-0 block overflow-hidden">
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                  <MediaImage image={image} sizes="(min-width: 640px) 50vw, 100vw" />
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:mt-24 sm:gap-5 lg:grid-cols-4">
          {looks.map((image, i) => (
            <Reveal
              key={image.publicId}
              delayMs={(i % 4) * 80}
              className={`relative aspect-4/5 w-full ${i % 4 === 1 || i % 4 === 2 ? "lg:-mt-10" : ""}`}
            >
              <button type="button" onClick={() => open(image)} aria-label={`Open image: ${image.alt}`} className="group absolute inset-0 block overflow-hidden">
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                  <MediaImage image={image} sizes="(min-width: 1024px) 23vw, 46vw" />
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
