"use client";

import { useEffect, useRef, useState } from "react";
import type { HeroSlide } from "@/lib/types";
import { MediaImage } from "@/components/ui/media-image";
import { getHeroVideoUrl, getHeroVideoPosterUrl } from "@/lib/cloudinary/video";

const DISPLAY_MS = 6500;
const FADE_MS = 1600;

/** This section is h-dvh — on phones that's a very tall, narrow box (e.g.
    ~390x844, aspect ~0.46) holding a much-less-extreme landscape/portrait
    source. object-cover fits the taller dimension, which inflates the
    effective rendered width well past the box's own CSS width — a plain
    "100vw"/"110vw" hint under-requests on mobile specifically (fine on
    desktop, where the box is landscape and no inflation happens). Bump
    mobile further to cover that, plus the 1.08x hero-drift scale on top. */
const HERO_SIZES = "(min-width: 768px) 110vw, 180vw";

/**
 * Crossfades through `slides` on a slow, fixed interval — each slide gets
 * the same `DISPLAY_MS` regardless of whether it's a still image or a
 * short autoplaying video. Frozen on the first slide under
 * prefers-reduced-motion (and any video slide stays paused on its poster
 * frame in that case), so the rotation itself never becomes the motion a
 * sensitive user is trying to avoid.
 */
export function HeroImageRotator({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (slides.length < 2 || reducedMotionRef.current) return;

    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, DISPLAY_MS);
    return () => window.clearInterval(id);
  }, [slides.length]);

  return (
    <>
      {slides.map((slide, index) => (
        <div
          key={slide.publicId}
          aria-hidden={index !== active}
          className="absolute inset-0 transition-opacity ease-in-out"
          style={{ opacity: index === active ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
        >
          <div className="animate-hero-drift absolute inset-0">
            {slide.kind === "video" ? (
              <HeroVideoSlide slide={slide} isActive={index === active} priority={index === 0} />
            ) : (
              <MediaImage image={slide} priority={index === 0} sizes={HERO_SIZES} />
            )}
          </div>
        </div>
      ))}
    </>
  );
}

/**
 * A single hero video slide: autoplays muted and loops only while it's the
 * active slide (an inactive slide sits on its poster frame, not mid-frame
 * from a paused decode). Ambient background motion, not content the visitor
 * is meant to watch deliberately — unlike the product gallery's videos,
 * there's no sound control here.
 */
function HeroVideoSlide({ slide, isActive, priority }: { slide: Extract<HeroSlide, { kind: "video" }>; isActive: boolean; priority: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    if (isActive && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      videoEl.play().catch(() => {
        // Autoplay can still be blocked in some contexts even when muted — the poster frame stands in for it.
      });
    } else {
      videoEl.pause();
    }
  }, [isActive]);

  return (
    <video
      ref={videoRef}
      src={getHeroVideoUrl(slide.publicId, slide.endSeconds)}
      poster={getHeroVideoPosterUrl(slide.publicId)}
      aria-label={slide.alt}
      muted
      loop
      playsInline
      preload={priority ? "auto" : "metadata"}
      className="h-full w-full object-cover"
    />
  );
}
