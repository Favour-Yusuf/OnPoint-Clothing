import Image from "next/image";

// Matches the real aspect ratio of public/ONPOINTlogo.png (2624x3815, ~0.688:1
// — a tall stacked mark, not a wide wordmark). Scaled down while preserving
// that ratio, with headroom for 2x DPR at the largest size the mark is
// displayed at (~56px tall), so the browser never has to guess and never
// stretches it into the wrong shape.
const LOGO_WIDTH = 124;
const LOGO_HEIGHT = 180;

export function Logo({ className = "h-7 w-auto", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/ONPOINTlogo.png"
      alt="OnPoint Clothing"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      className={className}
    />
  );
}
