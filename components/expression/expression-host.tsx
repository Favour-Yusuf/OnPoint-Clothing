"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { MediaImage } from "@/components/ui/media-image";
import { Reveal } from "@/components/ui/reveal";
import { ExpressionLightbox } from "@/components/expression/expression-lightbox";
import { onPointExpression } from "@/lib/data/onpoint-expression";

export function ExpressionHost() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const images = onPointExpression.host;
  const [primary, ...rest] = images;

  function open(index: number) {
    setOpenIndex(index);
  }

  return (
    <section className="bg-foreground py-24 text-background sm:py-32">
      <Container>
        <SectionHeading title="Host" />

        <Reveal className="relative mx-auto mt-16 aspect-4/5 w-full max-w-md sm:mt-20">
          <button
            type="button"
            onClick={() => open(0)}
            aria-label={`Open image: ${primary.alt}`}
            className="group absolute inset-0 block overflow-hidden"
          >
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
              <MediaImage image={primary} sizes="(min-width: 640px) 448px, 100vw" />
            </div>
          </button>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:mt-20 sm:gap-5 lg:grid-cols-4">
          {rest.map((image, i) => (
            <Reveal
              key={image.publicId}
              delayMs={(i % 4) * 80}
              className={`relative aspect-4/5 w-full ${i % 4 === 1 || i % 4 === 2 ? "lg:mt-10" : ""}`}
            >
              <button
                type="button"
                onClick={() => open(i + 1)}
                aria-label={`Open image: ${image.alt}`}
                className="group absolute inset-0 block overflow-hidden"
              >
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
