import { Button } from "@/components/ui/button";
import { MediaImage } from "@/components/ui/media-image";
import { Reveal } from "@/components/ui/reveal";

export function BespokeTeaser() {
  return (
    <section className="grid grid-cols-1 items-stretch bg-background lg:grid-cols-2">
      <Reveal className="order-2 flex flex-col justify-center gap-6 px-6 py-20 sm:px-10 lg:order-1 lg:py-0 lg:pr-16 lg:pl-16 xl:pl-20">
        <p className="font-sans text-xs font-medium tracking-[0.35em] text-burgundy uppercase">The Bespoke Service</p>
        <h2 className="max-w-md font-serif text-4xl leading-[1.05] font-light text-foreground sm:text-5xl">
          Made for you.
        </h2>
        <p className="max-w-md text-base leading-relaxed text-foreground/60 sm:text-lg">
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
        <MediaImage image={{ url: "placeholder:bespoke-teaser-01", alt: "Bespoke tailoring at OnPoint" }} sizes="(min-width: 1024px) 50vw, 100vw" />
      </div>
    </section>
  );
}
