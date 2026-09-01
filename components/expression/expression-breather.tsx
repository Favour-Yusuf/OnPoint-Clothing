import { MediaImage } from "@/components/ui/media-image";
import { Reveal } from "@/components/ui/reveal";
import type { ExpressionImage } from "@/lib/data/onpoint-expression";

/**
 * A full-bleed, text-free image used only as a pacing beat between chapters —
 * no heading, no lightbox, nothing to interact with. It exists purely to let
 * the page breathe before the next named chapter starts.
 */
export function ExpressionBreather({ image }: { image: ExpressionImage }) {
  return (
    <Reveal className="relative aspect-3/2 w-full sm:aspect-21/9">
      <MediaImage image={image} sizes="100vw" />
    </Reveal>
  );
}
