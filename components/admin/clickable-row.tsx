"use client";

import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

/**
 * A <tr> that navigates to `href` when clicked anywhere in the row — not
 * just the one linked cell. Clicks that land on a real interactive element
 * inside the row (a link, button, form control — e.g. a quick-action button)
 * are left alone so that element's own behavior runs instead of navigating.
 */
export function ClickableRow({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  const router = useRouter();

  function handleClick(event: MouseEvent<HTMLTableRowElement>) {
    const target = event.target as HTMLElement;
    if (target.closest("button, a, input, select, textarea")) return;
    router.push(href);
  }

  return (
    <tr
      onClick={handleClick}
      className={`cursor-pointer border-b border-foreground/5 transition-colors hover:bg-foreground/6 ${className}`}
    >
      {children}
    </tr>
  );
}
