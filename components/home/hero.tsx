import { Button } from "@/components/ui/button";
import { HeroImageRotator } from "@/components/home/hero-image-rotator";
import { editorialImages } from "@/lib/data/editorial";

export function Hero() {
  return (
    <section className="relative flex h-dvh min-h-[640px] w-full flex-col justify-end overflow-hidden bg-background">
      <div className="absolute inset-0">
        <HeroImageRotator slides={editorialImages.heroRotation} />
        {/* Burgundy-tinted wash, not a neutral black fade — the color carries the hero. */}
        <div className="absolute inset-0 bg-linear-to-t from-burgundy-deep via-background/75 to-background/20" />
        <div className="absolute inset-0 bg-linear-to-r from-background/50 via-transparent to-transparent" />
      </div>

      <div className="animate-fade-in-up relative z-10 flex flex-col gap-8 px-6 pb-16 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24 xl:px-20">
        <div className="animate-reveal-line animation-delay-200 h-[3px] w-16 bg-burgundy sm:w-24" aria-hidden="true" />

        <div className="flex flex-col gap-2">
          <p className="font-sans text-xs font-light tracking-[0.4em] text-burgundy-light uppercase">
            Multiple Award-Winning Fashion House
          </p>
          <h1 className="max-w-3xl font-display text-5xl leading-[1.05] font-light text-foreground sm:text-7xl lg:text-8xl">
            Defining the way <em className="text-burgundy-light italic">forward.</em>
          </h1>
        </div>

        {/* <p className="max-w-md text-base leading-relaxed text-foreground/70 sm:text-lg">
          A top celebrity clothier and genuine game changer, redefining luxury for the 21st century.
        </p> */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button href="/shop">Shop the Collection</Button>
          <Button href="/bespoke" variant="outline">
            Explore Bespoke
          </Button>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="animate-fade-in-up animation-delay-1100 absolute right-6 bottom-8 z-10 hidden items-center gap-3 sm:right-10 lg:flex lg:right-16 xl:right-20"
      >
        <span className="font-sans text-[10px] font-light tracking-[0.3em] text-foreground/50 uppercase [writing-mode:vertical-rl]">
          Scroll
        </span>
        <span className="h-10 w-px bg-linear-to-b from-burgundy-light to-transparent" />
      </div>
    </section>
  );
}
