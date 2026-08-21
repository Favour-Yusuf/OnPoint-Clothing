"use client";

import { useEffect, useRef } from "react";
import { MediaImage } from "@/components/ui/media-image";
import { CloseIcon, ArrowRightIcon } from "@/components/ui/icons";
import type { ExpressionImage } from "@/lib/data/onpoint-expression";

export function ExpressionLightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: ExpressionImage[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<Element | null>(null);

  // Body scroll lock + focus management: move focus into the dialog on open,
  // return it to whatever gallery thumbnail opened it on close (matches the
  // pattern in search-overlay.tsx / mobile-nav.tsx).
  useEffect(() => {
    triggerRef.current = document.activeElement;
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
    };
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onNavigate((index + 1) % images.length);
      if (event.key === "ArrowLeft") onNavigate((index - 1 + images.length) % images.length);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [index, images.length, onClose, onNavigate]);

  const image = images[index];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-background/98 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="OnPoint Expression gallery"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex items-center justify-between px-6 py-5 sm:px-10">
        <p className="font-sans text-xs font-light tracking-[0.25em] text-foreground/50 uppercase tabular-nums">
          {index + 1} / {images.length}
        </p>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="flex h-10 w-10 items-center justify-center text-foreground/70 hover:text-foreground"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center gap-1 px-2 pb-8 sm:gap-6 sm:px-10">
        <button
          type="button"
          onClick={() => onNavigate((index - 1 + images.length) % images.length)}
          aria-label="Previous image"
          className="flex h-11 w-11 shrink-0 items-center justify-center text-foreground/60 transition-colors hover:text-burgundy-light"
        >
          <ArrowRightIcon className="h-5 w-5 rotate-180" />
        </button>

        <figure className="flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-4">
          <div
            className={`relative w-full max-w-3xl ${
              image.orientation === "landscape" ? "aspect-3/2" : "aspect-4/5 max-h-[65vh]"
            }`}
          >
            <MediaImage image={image} sizes="90vw" fit="contain" />
          </div>
          <figcaption className="max-w-xl px-4 text-center text-sm leading-relaxed text-foreground/55">
            {image.alt}
          </figcaption>
        </figure>

        <button
          type="button"
          onClick={() => onNavigate((index + 1) % images.length)}
          aria-label="Next image"
          className="flex h-11 w-11 shrink-0 items-center justify-center text-foreground/60 transition-colors hover:text-burgundy-light"
        >
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
