import { Button } from "@/components/ui/button";
import { MediaImage } from "@/components/ui/media-image";
import { Reveal } from "@/components/ui/reveal";
import { editorialImages } from "@/lib/data/editorial";

export function ActiveTeaser() {
  return (
    <section className="relative grid grid-cols-1 items-stretch overflow-hidden bg-burgundy-deep lg:grid-cols-2">
      <p
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -right-10 select-none font-display text-[14rem] leading-none font-light text-foreground/[0.04] sm:text-[18rem]"
      >
        &deg;
      </p>

      <div className="relative order-1 aspect-4/5 w-full lg:order-1 lg:aspect-auto lg:min-h-[560px]">
        <MediaImage image={editorialImages.activeTeaser} sizes="(min-width: 1024px) 50vw, 100vw" position="50% 15%" />
        <div className="absolute inset-0 bg-linear-to-l from-burgundy-deep/40 to-transparent lg:bg-linear-to-r" />
      </div>

      <Reveal className="relative order-2 flex flex-col justify-center gap-6 px-6 py-20 sm:px-10 lg:order-2 lg:py-0 lg:pr-16 lg:pl-16 xl:pl-20">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-burgundy-light" aria-hidden="true" />
          <p className="font-sans text-xs font-light tracking-[0.35em] text-burgundy-light uppercase">OnPoint Active</p>
        </div>
        <h2 className="max-w-md font-display text-4xl leading-[1.05] font-light text-foreground sm:text-5xl">
          Built <span className="italic">to move.</span>
        </h2>
        <p className="max-w-md text-base leading-relaxed text-foreground/75 sm:text-lg">
          Performance activewear from OnPoint — sculpting fits, breathable stretch fabric, and the same attention to
          detail as the rest of the house.
        </p>
        <div>
          <Button href="/active" variant="outline">
            Shop OnPoint Active
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
