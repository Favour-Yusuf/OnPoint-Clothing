import Image from "next/image";
import type { CloudinaryImage } from "@/lib/types";

const PLACEHOLDER_PREFIX = "placeholder:";

/**
 * Renders product/editorial imagery from the { url, alt } shape used
 * throughout lib/data. Until real photography is shot, `url` holds a
 * "placeholder:<key>" marker and this renders an art-directed placeholder
 * instead of a broken image. Once a real Cloudinary delivery URL is written
 * into the data layer, this same component renders it through next/image —
 * no call sites change.
 */
export function MediaImage({
  image,
  className = "",
  sizes = "100vw",
  priority = false,
}: {
  image: CloudinaryImage;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (image.url.startsWith(PLACEHOLDER_PREFIX)) {
    return <PlaceholderArt label={image.url.slice(PLACEHOLDER_PREFIX.length)} caption={image.alt} className={className} />;
  }

  return (
    <Image
      src={image.url}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}

function PlaceholderArt({ label, caption, className = "" }: { label: string; caption: string; className?: string }) {
  return (
    <div
      className={`absolute inset-0 flex flex-col justify-between overflow-hidden bg-linear-to-br from-[#1a1815] via-[#2a2622] to-[#0a0a0a] ${className}`}
    >
      <div aria-hidden="true" className="bg-noise pointer-events-none absolute inset-0 opacity-[0.08]" />

      {/* Registration / crop marks — a tech-pack motif that reads as "photography pending" rather than broken */}
      <CornerMark className="top-4 left-4" />
      <CornerMark className="top-4 right-4 rotate-90" />
      <CornerMark className="bottom-4 left-4 -rotate-90" />
      <CornerMark className="right-4 bottom-4 rotate-180" />

      <div className="relative flex flex-1 items-center justify-center p-8">
        <span className="font-serif text-6xl font-light text-foreground/20 select-none sm:text-7xl">
          {label.charAt(0).toUpperCase()}
        </span>
      </div>

      <div className="relative flex items-end justify-between gap-4 p-4">
        <p className="font-mono text-[10px] tracking-[0.15em] text-foreground/35 uppercase">{label}</p>
        <p className="max-w-[60%] truncate text-right font-mono text-[10px] tracking-[0.1em] text-foreground/25 uppercase">
          {caption}
        </p>
      </div>
    </div>
  );
}

function CornerMark({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={`absolute h-3 w-3 text-foreground/20 ${className}`}
    >
      <path d="M0 0 H16 M0 0 V16" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  );
}
