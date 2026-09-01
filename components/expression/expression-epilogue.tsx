import { Container } from "@/components/ui/container";
import { MediaImage } from "@/components/ui/media-image";
import { Reveal } from "@/components/ui/reveal";
import { onPointExpression } from "@/lib/data/onpoint-expression";

/**
 * The closing chapter: the legacy marquee image with a single trimmed line
 * of copy, followed by the two backstage shots the photo survey judged
 * worth keeping. Deliberately non-interactive (no lightbox) — this is a
 * quiet closing beat, not another gallery to click through.
 */
export function ExpressionEpilogue() {
  const { legacy, backstage } = onPointExpression.epilogue;

  return (
    <section className="relative overflow-hidden bg-burgundy-deep">
      <div className="grid grid-cols-1 items-stretch lg:grid-cols-2">
        <div className="relative order-1 aspect-4/5 w-full lg:aspect-auto lg:min-h-[560px]">
          <MediaImage image={legacy} sizes="(min-width: 1024px) 50vw, 100vw" />
          <div className="absolute inset-0 bg-linear-to-l from-burgundy-deep/40 to-transparent" />
        </div>

        <Reveal className="relative order-2 flex flex-col justify-center gap-6 px-6 py-20 sm:px-10 lg:py-0 lg:pr-16 lg:pl-16 xl:pr-20">
          <span className="h-px w-16 bg-burgundy-light" aria-hidden="true" />
          <h2 className="max-w-md font-display text-4xl leading-[1.05] font-light text-foreground sm:text-5xl">
            Not a departure. A continuation.
          </h2>
        </Reveal>
      </div>

      <Container className="relative py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {backstage.map((image) => (
            <Reveal
              key={image.publicId}
              className={`relative w-full overflow-hidden ${image.orientation === "landscape" ? "aspect-3/2" : "aspect-4/5"}`}
            >
              <MediaImage image={image} sizes="(min-width: 640px) 50vw, 100vw" />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
