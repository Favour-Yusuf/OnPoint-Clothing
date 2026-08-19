"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useUI } from "@/lib/ui-context";
import { useCurrentAccount } from "@/lib/use-current-account";
import { CloseIcon, SearchIcon, UserIcon } from "@/components/ui/icons";
import { NAV_LINKS } from "@/components/layout/nav-links";

export function MobileNav() {
  const { isAdmin } = useCurrentAccount();
  const { isMobileNavOpen, closeMobileNav, openSearch } = useUI();

  useEffect(() => {
    if (!isMobileNavOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileNavOpen]);

  if (!isMobileNavOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-background lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-burgundy-deep/60 blur-[110px]"
      />

      <div className="relative flex h-16 items-center justify-between px-6">
        <p className="font-sans text-xs font-light tracking-[0.35em] text-burgundy-light uppercase">Menu</p>
        <button
          type="button"
          onClick={closeMobileNav}
          aria-label="Close menu"
          className="flex h-10 w-10 items-center justify-center text-foreground/80 hover:text-burgundy-light"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      <nav aria-label="Primary" className="relative flex flex-1 flex-col justify-center gap-2 px-6">
        {NAV_LINKS.map((link, index) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={closeMobileNav}
            className="group animate-fade-in-up flex items-center justify-between border-b border-foreground/10 py-4 font-display text-3xl font-light text-foreground transition-colors hover:text-burgundy-light hover:border-burgundy/40"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            {link.label}
            <span className="text-burgundy-light opacity-0 transition-opacity group-hover:opacity-100">&rarr;</span>
          </Link>
        ))}
      </nav>

      <div className="relative flex items-center justify-between border-t border-foreground/10 px-6 py-6">
        <button
          type="button"
          onClick={() => {
            closeMobileNav();
            openSearch();
          }}
          className="flex items-center gap-2 font-sans text-xs font-light tracking-[0.18em] text-foreground/70 uppercase hover:text-burgundy-light"
        >
          <SearchIcon className="h-4 w-4" /> Search
        </button>
        <div className="flex items-center gap-5">
          {isAdmin ? (
            <Link
              href="/admin"
              onClick={closeMobileNav}
              className="font-sans text-xs font-light tracking-[0.18em] text-foreground/70 uppercase hover:text-burgundy-light"
            >
              Admin
            </Link>
          ) : null}
          <Link
            href="/account"
            onClick={closeMobileNav}
            className="flex items-center gap-2 font-sans text-xs font-light tracking-[0.18em] text-foreground/70 uppercase hover:text-burgundy-light"
          >
            <UserIcon className="h-4 w-4" /> Account
          </Link>
        </div>
      </div>
    </div>
  );
}
