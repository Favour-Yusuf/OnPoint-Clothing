"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";

export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  trigger,
  onConfirm,
  pending,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  trigger: React.ReactNode;
  onConfirm: () => void;
  pending?: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <span onClick={() => dialogRef.current?.showModal()}>{trigger}</span>
      <dialog
        ref={dialogRef}
        className="m-auto w-full max-w-sm border border-foreground/15 bg-background p-6 text-foreground backdrop:bg-black/60"
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <h2 className="font-serif text-xl font-light text-foreground">{title}</h2>
        <p className="mt-3 font-sans text-sm leading-relaxed text-foreground/60">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" size="md" onClick={() => dialogRef.current?.close()}>
            Cancel
          </Button>
          <Button
            type="button"
            size="md"
            disabled={pending}
            onClick={() => {
              onConfirm();
              dialogRef.current?.close();
            }}
          >
            {pending ? "Working…" : confirmLabel}
          </Button>
        </div>
      </dialog>
    </>
  );
}
