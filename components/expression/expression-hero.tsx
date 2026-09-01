"use client";

import { useEffect, useRef } from "react";
import { MediaImage } from "@/components/ui/media-image";
import { onPointExpression } from "@/lib/data/onpoint-expression";

/**
 * A slow, capped translateY on the hero image as the page scrolls past it —
 * skipped entirely under prefers-reduced-motion. rAF-throttled and clamped
 * to the hero's own height so it never runs once the section scrolls out of
 * view, keeping the listener cheap for the rest of the page.
 */
function useHeroParallax() {
  const imageLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = imageLayerRef.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    let sectionHeight = node.parentElement?.getBoundingClientRect().height ?? 0;

    function update() {
      if (!node) return;
      const progress = Math.min(1, Math.max(0, window.scrollY / (sectionHeight || 1)));
      node.style.transform = `translateY(${progress * 60}px)`;
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    function onResize() {
      if (!node) return;
      sectionHeight = node.parentElement?.getBoundingClientRect().height ?? 0;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return imageLayerRef;
}

export function ExpressionHero() {
  const imageLayerRef = useHeroParallax();

  return (
    <section className="relative flex h-dvh min-h-[640px] w-full flex-col justify-end overflow-hidden bg-background">
      <div ref={imageLayerRef} className="absolute inset-0 -top-[60px] h-[calc(100%+60px)] will-change-transform">
        <MediaImage image={onPointExpression.hero} priority sizes="100vw" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-burgundy-deep/30" />
        <div className="absolute inset-0 bg-linear-to-r from-background/60 via-transparent to-background/40" />
      </div>

      <div className="animate-fade-in-up relative z-10 flex flex-col gap-6 px-6 pb-16 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24 xl:px-20">
        <div className="animate-reveal-line animation-delay-200 h-[3px] w-16 bg-burgundy sm:w-24" aria-hidden="true" />

        <div className="flex flex-col gap-3">
          <p className="font-sans text-xs font-light tracking-[0.4em] text-burgundy-light uppercase">OnPoint Clothing Presents</p>
          <h1 className="max-w-4xl font-display text-6xl leading-[0.95] font-light text-foreground sm:text-8xl lg:text-9xl">
            Expression
          </h1>
        </div>

        <p className="max-w-lg font-display text-2xl leading-tight font-light text-burgundy-light sm:text-3xl">
          Where fashion finds its voice.
        </p>
      </div>

      <div
        aria-hidden="true"
        className="animate-fade-in-up animation-delay-1100 absolute right-6 bottom-8 z-10 hidden items-center gap-3 sm:right-10 lg:flex lg:right-16 xl:right-20"
      >
        <span className="font-sans text-[10px] font-light tracking-[0.3em] text-foreground/50 uppercase [writing-mode:vertical-rl]">
          Scroll
        </span>
        <span className="h-10 w-px bg-linear-to-b from-burgundy-light to-transparent" />
      </div>
    </section>
  );
}
