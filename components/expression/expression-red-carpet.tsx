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
  const [wide, arrival, securityA, securityB, coupleAtSign, capAtSign, kaftanAtSign, lounge, kaftanHat] = images;

  function open(image: (typeof images)[number]) {
    setOpenIndex(images.indexOf(image));
  }

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Arrivals"
          title="The carpet, walked with intention."
          description="Before the show starts, the room already knows what OnPoint stands for — security in formation, the marquee lit, every entrance a statement."
        />
      </Container>

      <Reveal className="relative mt-14 aspect-3/2 w-full sm:aspect-21/9">
        <button type="button" onClick={() => open(wide)} aria-label={`Open image: ${wide.alt}`} className="absolute inset-0 block">
          <MediaImage image={wide} sizes="100vw" />
          <div className="absolute inset-0 bg-linear-to-t from-background/70 via-transparent to-transparent" />
        </button>
      </Reveal>

      <Container className="mt-4 sm:mt-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {[securityA, securityB].map((image) => (
            <Reveal key={image.publicId} className="relative aspect-3/2 w-full">
              <button type="button" onClick={() => open(image)} aria-label={`Open image: ${image.alt}`} className="group absolute inset-0 block overflow-hidden">
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                  <MediaImage image={image} sizes="(min-width: 640px) 50vw, 100vw" />
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </Container>

      <Container className="mt-16 sm:mt-24">
        <div className="grid grid-cols-2 items-end gap-4 sm:gap-6 lg:grid-cols-3">
          {[arrival, coupleAtSign, capAtSign].map((image, i) => (
            <Reveal
              key={image.publicId}
              delayMs={i * 90}
              className={`relative aspect-4/5 w-full ${i === 1 ? "col-span-2 lg:col-span-1 lg:-mt-16" : ""}`}
            >
              <button type="button" onClick={() => open(image)} aria-label={`Open image: ${image.alt}`} className="group absolute inset-0 block overflow-hidden">
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                  <MediaImage image={image} sizes="(min-width: 1024px) 33vw, 50vw" />
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </Container>

      <Container className="mt-16 sm:mt-24">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-6">
          <Reveal className="relative aspect-4/5 w-full lg:col-span-5">
            <button type="button" onClick={() => open(kaftanAtSign)} aria-label={`Open image: ${kaftanAtSign.alt}`} className="group absolute inset-0 block overflow-hidden">
              <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                <MediaImage image={kaftanAtSign} sizes="(min-width: 1024px) 42vw, 100vw" />
              </div>
            </button>
          </Reveal>
          <Reveal delayMs={100} className="flex flex-col gap-5 lg:col-span-7">
            <div className="h-[3px] w-16 bg-burgundy" aria-hidden="true" />
            <h3 className="font-display text-2xl leading-tight font-light text-foreground sm:text-3xl">
              Every arrival is announced.
            </h3>
            <p className="max-w-md text-base leading-relaxed text-foreground/60">
              The sign, the carpet, the line of security — the same theatre a fashion house builds for the runway,
              built first for the door.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:mt-24 sm:grid-cols-2 sm:gap-5">
          {[lounge, kaftanHat].map((image) => (
            <Reveal key={image.publicId} className="relative aspect-3/2 w-full">
              <button type="button" onClick={() => open(image)} aria-label={`Open image: ${image.alt}`} className="group absolute inset-0 block overflow-hidden">
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                  <MediaImage image={image} sizes="(min-width: 640px) 50vw, 100vw" />
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
