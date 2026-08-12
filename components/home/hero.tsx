import { Button } from "@/components/ui/button";
import { MediaImage } from "@/components/ui/media-image";
import type { CloudinaryImage } from "@/lib/types";

const HERO_IMAGE: CloudinaryImage = { url: "placeholder:hero-campaign-01", alt: "OnPoint Clothing campaign" };

export function Hero() {
  return (
    <section className="relative flex h-dvh min-h-[640px] w-full flex-col justify-end overflow-hidden bg-background">
      <div className="absolute inset-0">
        <MediaImage image={HERO_IMAGE} priority sizes="100vw" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-background/10" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 h-[36rem] w-[36rem] rounded-full bg-burgundy/20 blur-[150px]"
      />

      <div className="animate-fade-in-up relative z-10 flex flex-col gap-8 px-6 pb-16 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24 xl:px-20">
        <div className="animate-reveal-line animation-delay-200 h-px w-16 bg-burgundy sm:w-24" aria-hidden="true" />

        <div className="flex flex-col gap-2">
          <p className="font-sans text-xs font-medium tracking-[0.4em] text-foreground/70 uppercase">
            Est. 2007 &middot; Nineteen Years
          </p>
          <h1 className="max-w-3xl font-serif text-5xl leading-[1.05] font-light text-foreground sm:text-7xl lg:text-8xl">
            Defining the way forward.
          </h1>
        </div>

        <p className="max-w-md text-base leading-relaxed text-foreground/65 sm:text-lg">
          Nineteen years of tailoring and considered design, now built for the way you shop today.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button href="/shop">Shop the Collection</Button>
          <Button href="/bespoke" variant="outline">
            Explore Bespoke
          </Button>
        </div>
      </div>
    </section>
  );
}
