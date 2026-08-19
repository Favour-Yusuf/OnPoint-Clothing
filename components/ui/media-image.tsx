"use client";

import Image from "next/image";
import { useState } from "react";
import type { CloudinaryImage } from "@/lib/types";
import { cloudinaryLoader } from "@/lib/cloudinary/loader";
import { isPlaceholder, placeholderLabel } from "@/lib/cloudinary/image";

/**
 * Renders product/editorial imagery from the { publicId, alt } shape used
 * throughout lib/data. Until real photography is shot, `publicId` holds a
 * "placeholder:<key>" marker and this renders an art-directed placeholder
 * instead of a broken image. A real Cloudinary public ID renders through
 * next/image via the Cloudinary loader (lib/cloudinary/loader.ts); if that
 * image fails to load, this falls back to the same placeholder treatment
 * rather than showing a broken-image icon.
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
  const [failed, setFailed] = useState(false);

  if (failed || isPlaceholder(image.publicId)) {
    return <PlaceholderArt label={placeholderLabel(image.publicId)} caption={image.alt} className={className} />;
  }

  return (
    <Image
      src={image.publicId}
      loader={cloudinaryLoader}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  );
}

function PlaceholderArt({ label, caption, className = "" }: { label: string; caption: string; className?: string }) {
  return (
    <div
      className={`absolute inset-0 flex flex-col justify-between overflow-hidden bg-linear-to-br from-[#3a0a12] via-[#210509] to-[#0d0808] ${className}`}
    >
      <div aria-hidden="true" className="bg-noise pointer-events-none absolute inset-0 opacity-[0.08]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-1/3 -right-1/4 h-2/3 w-2/3 rounded-full bg-burgundy-light/10 blur-[80px]"
      />

      {/* Registration / crop marks — a tech-pack motif that reads as "photography pending" rather than broken */}
      <CornerMark className="top-4 left-4" />
      <CornerMark className="top-4 right-4 rotate-90" />
      <CornerMark className="bottom-4 left-4 -rotate-90" />
      <CornerMark className="right-4 bottom-4 rotate-180" />

      <div className="relative flex flex-1 items-center justify-center p-8">
        <span className="font-display text-6xl font-light text-burgundy-light/25 select-none sm:text-7xl">
          {label.charAt(0).toUpperCase()}
        </span>
      </div>

      <div className="relative flex items-end justify-between gap-4 p-4">
        <p className="font-mono text-[10px] tracking-[0.15em] text-burgundy-light/45 uppercase">{label}</p>
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
      className={`absolute h-3 w-3 text-burgundy-light/30 ${className}`}
    >
      <path d="M0 0 H16 M0 0 V16" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  );
}
