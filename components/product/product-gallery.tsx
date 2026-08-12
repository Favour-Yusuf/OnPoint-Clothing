"use client";

import { useRef, useState } from "react";
import type { CloudinaryImage } from "@/lib/types";
import { MediaImage } from "@/components/ui/media-image";

export function ProductGallery({ images }: { images: CloudinaryImage[] }) {
  const [active, setActive] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  function handleScroll() {
    const node = scrollerRef.current;
    if (!node) return;
    const index = Math.round(node.scrollLeft / node.clientWidth);
    setActive(index);
  }

  return (
    <div>
      {/* Mobile: swipeable single-image carousel */}
      <div className="lg:hidden">
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          className="scrollbar-hidden flex snap-x snap-mandatory overflow-x-auto"
        >
          {images.map((image, index) => (
            <div key={index} className="relative aspect-4/5 w-full shrink-0 snap-start bg-foreground/5">
              <MediaImage image={image} priority={index === 0} sizes="100vw" />
            </div>
          ))}
        </div>
        {images.length > 1 ? (
          <div className="mt-4 flex items-center justify-center gap-2">
            {images.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${index === active ? "bg-burgundy" : "bg-foreground/20"}`}
              />
            ))}
          </div>
        ) : null}
      </div>

      {/* Desktop: stacked editorial gallery */}
      <div className="hidden flex-col gap-4 lg:flex">
        {images.map((image, index) => (
          <div key={index} className="relative aspect-4/5 w-full bg-foreground/5">
            <MediaImage image={image} priority={index === 0} sizes="50vw" />
          </div>
        ))}
      </div>
    </div>
  );
}
