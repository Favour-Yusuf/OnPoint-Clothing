"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useUI } from "@/lib/ui-context";
import { CloseIcon, SearchIcon, UserIcon } from "@/components/ui/icons";
import { NAV_LINKS } from "@/components/layout/nav-links";

export function MobileNav() {
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
    <div className="fixed inset-0 z-50 flex flex-col bg-background lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="flex h-16 items-center justify-between px-6">
        <p className="font-sans text-xs font-medium tracking-[0.35em] text-foreground/70 uppercase">Menu</p>
        <button
          type="button"
          onClick={closeMobileNav}
          aria-label="Close menu"
          className="flex h-10 w-10 items-center justify-center text-foreground/80 hover:text-foreground"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      <nav aria-label="Primary" className="flex flex-1 flex-col justify-center gap-2 px-6">
        {NAV_LINKS.map((link, index) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={closeMobileNav}
            className="animate-fade-in-up border-b border-foreground/10 py-4 font-serif text-3xl font-light text-foreground"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center justify-between border-t border-foreground/10 px-6 py-6">
        <button
          type="button"
          onClick={() => {
            closeMobileNav();
            openSearch();
          }}
          className="flex items-center gap-2 font-sans text-xs font-medium tracking-[0.18em] text-foreground/70 uppercase hover:text-foreground"
        >
          <SearchIcon className="h-4 w-4" /> Search
        </button>
        <Link
          href="/account"
          onClick={closeMobileNav}
          className="flex items-center gap-2 font-sans text-xs font-medium tracking-[0.18em] text-foreground/70 uppercase hover:text-foreground"
        >
          <UserIcon className="h-4 w-4" /> Account
        </Link>
      </div>
    </div>
  );
}
