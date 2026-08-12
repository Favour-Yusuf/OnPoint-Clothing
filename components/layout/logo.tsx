import Image from "next/image";

// Intrinsic size kept close to actual display size (~24-36px tall everywhere
// the mark is used) so the browser isn't asked to downscale the full
// 2025x873 source by 70x+, which visibly aliased the wordmark's thin strokes.
const LOGO_WIDTH = 253;
const LOGO_HEIGHT = 109;

export function Logo({ className = "h-7 w-auto", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/onpointTradeMarkWhite.png"
      alt="OnPoint Clothing"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      className={className}
    />
  );
}
