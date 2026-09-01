import { MediaImage } from "@/components/ui/media-image";
import { Reveal } from "@/components/ui/reveal";
import { onPointExpression } from "@/lib/data/onpoint-expression";

export function ExpressionLegacy() {
  return (
    <section className="relative grid grid-cols-1 items-stretch overflow-hidden bg-burgundy-deep lg:grid-cols-2">
      <div className="relative order-1 aspect-4/5 w-full lg:aspect-auto lg:min-h-[560px]">
        <MediaImage image={onPointExpression.legacy} sizes="(min-width: 1024px) 50vw, 100vw" />
        <div className="absolute inset-0 bg-linear-to-l from-burgundy-deep/40 to-transparent" />
      </div>

      <Reveal className="relative order-2 flex flex-col justify-center gap-6 px-6 py-20 sm:px-10 lg:py-0 lg:pr-16 lg:pl-16 xl:pr-20">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-burgundy-light" aria-hidden="true" />
          <p className="font-sans text-xs font-light tracking-[0.35em] text-burgundy-light uppercase">Multiple Award-Winning</p>
        </div>
        <h2 className="max-w-md font-display text-4xl leading-[1.05] font-light text-foreground sm:text-5xl">
          Not a departure. A continuation.
        </h2>
        <p className="max-w-md text-base leading-relaxed text-foreground/75 sm:text-lg">
          OnPoint Expression didn&rsquo;t appear from nowhere. It&rsquo;s what construction over trend, fit over
          flourish, eventually earns the right to say out loud.
        </p>
        <p className="max-w-md text-base leading-relaxed text-foreground/55">
          The workroom builds the house. Expression is where the house shows its work.
        </p>
      </Reveal>
    </section>
  );
}
