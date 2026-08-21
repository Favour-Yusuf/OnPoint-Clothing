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
          description="The clothes, presented the way they were built to be seen — one walk, one look, one argument at a time."
        />
      </Container>

      <Reveal className="relative mt-14 aspect-16/9 w-full">
        <button type="button" onClick={() => open(opener)} aria-label={`Open image: ${opener.alt}`} className="absolute inset-0 block">
          <MediaImage image={opener} sizes="100vw" />
          <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent" />
        </button>
      </Reveal>

      {/* Horizontal procession: the runway walk continues past the edge of the
          screen, mirroring how the looks actually moved through the room. */}
      <div className="scrollbar-hidden mt-6 flex gap-4 overflow-x-auto px-6 pb-2 sm:mt-8 sm:gap-5 sm:px-10 lg:px-16 xl:px-20">
        {rail.map((image) => (
          <button
            key={image.publicId}
            type="button"
            onClick={() => open(image)}
            aria-label={`Open image: ${image.alt}`}
            className="group relative aspect-16/9 w-[78vw] shrink-0 overflow-hidden bg-foreground/5 sm:w-[46vw] lg:w-[32vw]"
          >
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
              <MediaImage image={image} sizes="(min-width: 1024px) 32vw, (min-width: 640px) 46vw, 78vw" />
            </div>
          </button>
        ))}
        {looks.map((image) => (
          <button
            key={image.publicId}
            type="button"
            onClick={() => open(image)}
            aria-label={`Open image: ${image.alt}`}
            className="group relative aspect-4/5 w-[58vw] shrink-0 overflow-hidden bg-foreground/5 sm:w-[30vw] lg:w-[19vw]"
          >
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
              <MediaImage image={image} sizes="(min-width: 1024px) 19vw, (min-width: 640px) 30vw, 58vw" />
            </div>
          </button>
        ))}
      </div>

      {openIndex !== null ? (
        <ExpressionLightbox images={images} index={openIndex} onClose={() => setOpenIndex(null)} onNavigate={setOpenIndex} />
      ) : null}
    </section>
  );
}
