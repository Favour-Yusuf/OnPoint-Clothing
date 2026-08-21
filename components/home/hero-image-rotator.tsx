"use client";

import { useEffect, useState } from "react";
import type { CloudinaryImage } from "@/lib/types";
import { MediaImage } from "@/components/ui/media-image";

const DISPLAY_MS = 6500;
const FADE_MS = 1600;

/**
 * Crossfades through `images` on a slow interval. Frozen on the first image
 * under prefers-reduced-motion, so the rotation itself never becomes the
 * motion a sensitive user is trying to avoid.
 */
export function HeroImageRotator({ images }: { images: CloudinaryImage[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % images.length);
    }, DISPLAY_MS);
    return () => window.clearInterval(id);
  }, [images.length]);

  return (
    <>
      {images.map((image, index) => (
        <div
          key={image.publicId}
          aria-hidden={index !== active}
          className="absolute inset-0 transition-opacity ease-in-out"
          style={{ opacity: index === active ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
        >
          <div className="animate-hero-drift absolute inset-0">
            {/* This section is h-dvh — on phones that's a very tall, narrow box
                (e.g. ~390x844, aspect ~0.46) holding a much-less-extreme portrait
                photo. object-cover fits the taller dimension, which inflates the
                effective rendered width well past the box's own CSS width — a
                plain "100vw"/"110vw" hint under-requests on mobile specifically
                (fine on desktop, where the box is landscape and no inflation
                happens). Bump mobile further to cover that, plus the 1.08x
                hero-drift scale on top. */}
            <MediaImage image={image} priority={index === 0} sizes="(min-width: 768px) 110vw, 180vw" />
          </div>
        </div>
      ))}
    </>
  );
}
