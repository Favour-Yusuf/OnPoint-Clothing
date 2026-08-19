import { Button } from "@/components/ui/button";
import { MediaImage } from "@/components/ui/media-image";
import { Reveal } from "@/components/ui/reveal";
import { editorialImages } from "@/lib/data/editorial";

export function BespokeTeaser() {
  return (
    <section className="relative grid grid-cols-1 items-stretch overflow-hidden bg-burgundy-deep lg:grid-cols-2">
      <p
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-10 select-none font-display text-[14rem] leading-none font-light text-foreground/[0.04] sm:text-[18rem]"
      >
        &amp;
      </p>

      <Reveal className="relative order-2 flex flex-col justify-center gap-6 px-6 py-20 sm:px-10 lg:order-1 lg:py-0 lg:pr-16 lg:pl-16 xl:pl-20">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-burgundy-light" aria-hidden="true" />
          <p className="font-sans text-xs font-light tracking-[0.35em] text-burgundy-light uppercase">The Bespoke Service</p>
        </div>
        <h2 className="max-w-md font-display text-4xl leading-[1.05] font-light text-foreground sm:text-5xl">
          Made <span>for you.</span>
        </h2>
        <p className="max-w-md text-base leading-relaxed text-foreground/75 sm:text-lg">
          Beyond ready-to-wear, OnPoint offers a bespoke service — garments built to your measure, from a
          consultation through to final fitting.
        </p>
        <div>
          <Button href="/bespoke" variant="outline">
            Discover Bespoke
          </Button>
        </div>
      </Reveal>

      <div className="relative order-1 aspect-4/5 w-full lg:order-2 lg:aspect-auto lg:min-h-[560px]">
        <MediaImage image={editorialImages.bespokeTeaser} sizes="(min-width: 1024px) 50vw, 100vw" />
        <div className="absolute inset-0 bg-linear-to-r from-burgundy-deep/40 to-transparent lg:bg-linear-to-l" />
      </div>
    </section>
  );
}
