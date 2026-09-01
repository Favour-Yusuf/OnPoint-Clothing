"use client";

import { useRef, useState } from "react";
import type { CloudinaryImage, CloudinaryVideo } from "@/lib/types";
import { MediaImage } from "@/components/ui/media-image";
import { VideoSlide } from "@/components/product/video-slide";

type GalleryItem = { type: "video"; video: CloudinaryVideo } | { type: "image"; image: CloudinaryImage };

export function ProductGallery({ images, videos = [] }: { images: CloudinaryImage[]; videos?: CloudinaryVideo[] }) {
  const [active, setActive] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Videos lead the gallery, photos follow — see product-video design decision.
  const items: GalleryItem[] = [
    ...videos.map((video): GalleryItem => ({ type: "video", video })),
    ...images.map((image): GalleryItem => ({ type: "image", image })),
  ];

  function handleScroll() {
    const node = scrollerRef.current;
    if (!node) return;
    const index = Math.round(node.scrollLeft / node.clientWidth);
    setActive(index);
  }

  return (
    <div>
      {/* Mobile: swipeable single-item carousel */}
      <div className="lg:hidden">
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          className="scrollbar-hidden flex snap-x snap-mandatory overflow-x-auto"
        >
          {items.map((item, index) => (
            <div key={index} className="relative aspect-4/5 w-full shrink-0 snap-start bg-foreground/5">
              {item.type === "video" ? (
                <VideoSlide video={item.video} priority={index === 0} />
              ) : (
                <MediaImage image={item.image} priority={index === 0} sizes="100vw" />
              )}
            </div>
          ))}
        </div>
        {items.length > 1 ? (
          <div className="mt-4 flex items-center justify-center gap-2">
            {items.map((_, index) => (
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
        {items.map((item, index) => (
          <div key={index} className="relative aspect-4/5 w-full bg-foreground/5">
            {item.type === "video" ? (
              <VideoSlide video={item.video} priority={index === 0} />
            ) : (
              <MediaImage image={item.image} priority={index === 0} sizes="50vw" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
