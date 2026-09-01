"use client";

import { useEffect, useRef, useState } from "react";
import type { CloudinaryVideo } from "@/lib/types";
import { getCloudinaryVideoUrl, getCloudinaryVideoPosterUrl } from "@/lib/cloudinary/video";
import { SpeakerIcon, SpeakerMuteIcon } from "@/components/ui/icons";

/**
 * A single autoplaying gallery video. Plays only while its container is
 * substantially in view (own IntersectionObserver, not the parent
 * carousel's active-slide index) so it behaves correctly in both the
 * mobile swipe carousel and the desktop stacked gallery, and so a product
 * with multiple videos never has more than one playing at once.
 */
export function VideoSlide({ video, priority = false }: { video: CloudinaryVideo; priority?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    const videoEl = videoRef.current;
    if (!container || !videoEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoEl.play().catch(() => {
            // Autoplay can still be blocked in some contexts even when muted
            // (e.g. reduced-data mode) — the poster frame stands in for it.
          });
        } else {
          videoEl.pause();
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <video
        ref={videoRef}
        src={getCloudinaryVideoUrl(video.publicId)}
        poster={getCloudinaryVideoPosterUrl(video.publicId)}
        muted={muted}
        loop
        playsInline
        preload={priority ? "auto" : "metadata"}
        className="h-full w-full object-cover"
      />
      <button
        type="button"
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "Unmute video" : "Mute video"}
        className="absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur-sm transition-colors hover:text-burgundy-light"
      >
        {muted ? <SpeakerMuteIcon className="h-4 w-4" /> : <SpeakerIcon className="h-4 w-4" />}
      </button>
    </div>
  );
}
