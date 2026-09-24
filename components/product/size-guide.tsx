"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CloseIcon } from "@/components/ui/icons";
import {
  CAP_MEASURE_TIP,
  CAP_SIZES,
  GARMENT_MEASURE_TIPS,
  GARMENT_SIZES,
  formatCm,
  formatInches,
  getSizeGuideKind,
  toCm,
} from "@/lib/data/size-guide";

const TH = "py-3 pr-4 text-left font-sans text-[11px] font-light tracking-[0.15em] text-foreground/50 uppercase";
const TD = "py-3 pr-4 font-sans text-sm text-foreground/80";

function Measurement({ range }: { range: readonly [number, number] }) {
  return (
    <>
      <span>{formatInches(range)} in</span>
      <span className="block text-xs text-foreground/40">{formatCm(range)} cm</span>
    </>
  );
}

export function SizeGuide({ sizes }: { sizes: string[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const kind = getSizeGuideKind(sizes);

  // Keep the native <dialog> in sync with `open` and lock page scroll while
  // it's showing. The cleanup restores scroll on close AND on unmount (e.g.
  // navigating away with the guide open), so the page can't get stuck.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!kind) return null;

  const garmentRows = GARMENT_SIZES.filter((row) => sizes.includes(row.size));
  const shownGarmentRows = garmentRows.length > 0 ? garmentRows : GARMENT_SIZES;
  const capRows = CAP_SIZES.filter((row) => sizes.includes(row.size));
  const shownCapRows = capRows.length > 0 ? capRows : CAP_SIZES;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-sans text-xs text-foreground/50 underline hover:text-foreground"
      >
        Size Guide
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="size-guide-title"
        // Escape and other native closes fire `close`; mirror them into state.
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setOpen(false);
        }}
        className="m-0 mt-auto max-h-[85dvh] w-full max-w-none overflow-hidden border border-foreground/15 bg-background p-0 text-foreground backdrop:bg-black/60 sm:m-auto sm:max-h-[80dvh] sm:max-w-xl"
      >
        <div className="flex max-h-[85dvh] flex-col sm:max-h-[80dvh]">
          <div className="flex items-center justify-between border-b border-foreground/10 px-6 py-5">
            <h2 id="size-guide-title" className="font-display text-xl font-light text-foreground">
              Size Guide
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close size guide"
              className="flex h-9 w-9 items-center justify-center text-foreground/70 hover:text-foreground"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="overflow-y-auto px-6 py-6">
            {kind === "garment" ? (
              <>
                <p className="font-sans text-sm leading-relaxed text-foreground/60">
                  Body measurements, not garment measurements. If you are between sizes, we suggest sizing up for a
                  relaxed fit.
                </p>
                <table className="mt-5 w-full border-collapse">
                  <thead>
                    <tr className="border-b border-foreground/15">
                      <th className={TH}>Size</th>
                      <th className={TH}>Chest</th>
                      <th className={TH}>Waist</th>
                      <th className={TH}>Hip</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shownGarmentRows.map((row) => (
                      <tr key={row.size} className="border-b border-foreground/10">
                        <td className={`${TD} text-foreground`}>{row.size}</td>
                        <td className={TD}>
                          <Measurement range={row.chest} />
                        </td>
                        <td className={TD}>
                          <Measurement range={row.waist} />
                        </td>
                        <td className={TD}>
                          <Measurement range={row.hip} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-8 font-sans text-xs font-light tracking-[0.15em] text-foreground/60 uppercase">
                  How to measure
                </p>
                <ul className="mt-3 flex flex-col gap-2 font-sans text-sm leading-relaxed text-foreground/60">
                  {GARMENT_MEASURE_TIPS.map((tip) => (
                    <li key={tip.label}>
                      <span className="text-foreground">{tip.label}:</span> {tip.text}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {kind === "cap" ? (
              <>
                <p className="font-sans text-sm leading-relaxed text-foreground/60">{CAP_MEASURE_TIP}</p>
                <table className="mt-5 w-full border-collapse">
                  <thead>
                    <tr className="border-b border-foreground/15">
                      <th className={TH}>Size</th>
                      <th className={TH}>Head circumference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shownCapRows.map((row) => (
                      <tr key={row.size} className="border-b border-foreground/10">
                        <td className={`${TD} text-foreground`}>{row.size}</td>
                        <td className={TD}>
                          {row.head} in ({toCm(row.head)} cm)
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : null}

            {kind === "custom" ? (
              <>
                <p className="font-sans text-sm leading-relaxed text-foreground/60">
                  This piece is made to your measurements rather than to a standard size, so there is no size chart to
                  choose from. You supply your measurements and we build the garment to them.
                </p>
                <Link
                  href="/bespoke"
                  onClick={() => setOpen(false)}
                  className="mt-5 inline-block font-sans text-xs tracking-[0.18em] text-foreground/80 uppercase underline decoration-burgundy decoration-2 underline-offset-8 hover:text-burgundy-light"
                >
                  See how bespoke works
                </Link>
              </>
            ) : null}

            {kind === "one-size" ? (
              <p className="font-sans text-sm leading-relaxed text-foreground/60">
                This piece comes in a single size, so there is nothing to choose. If you have a question about fit,
                message us on WhatsApp.
              </p>
            ) : null}
          </div>
        </div>
      </dialog>
    </>
  );
}
