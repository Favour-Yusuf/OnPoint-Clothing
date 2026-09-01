"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { MediaImage } from "@/components/ui/media-image";
import { Reveal } from "@/components/ui/reveal";
import { ExpressionLightbox } from "@/components/expression/expression-lightbox";
import { onPointExpression } from "@/lib/data/onpoint-expression";

export function ExpressionRedCarpet() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const images = onPointExpression.redCarpet;
  const [wide, ...rest] = images;

  function open(image: (typeof images)[number]) {
    setOpenIndex(images.indexOf(image));
  }

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading title="Arrival" />
      </Container>

      <Reveal className="relative mt-14 aspect-3/2 w-full sm:aspect-21/9">
        <button type="button" onClick={() => open(wide)} aria-label={`Open image: ${wide.alt}`} className="absolute inset-0 block">
          <MediaImage image={wide} sizes="100vw" />
          <div className="absolute inset-0 bg-linear-to-t from-background/70 via-transparent to-transparent" />
        </button>
      </Reveal>

      <Container className="mt-16 sm:mt-24">
        <div className="grid grid-cols-2 items-end gap-4 sm:gap-6 lg:grid-cols-4">
          {rest.map((image, i) => (
            <Reveal key={image.publicId} delayMs={i * 90} className={`relative aspect-4/5 w-full ${i === 1 ? "lg:-mt-12" : ""}`}>
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
