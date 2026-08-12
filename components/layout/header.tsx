"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useUI } from "@/lib/ui-context";
import { BagIcon, MenuIcon, SearchIcon, UserIcon } from "@/components/ui/icons";
import { NAV_LINKS } from "@/components/layout/nav-links";
import { Logo } from "@/components/layout/logo";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isCheckout = pathname.startsWith("/checkout");
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useCart();
  const { openCart, openSearch, openMobileNav } = useUI();

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const solid = !isHome || scrolled;

  if (isCheckout) {
    return (
      <header className="fixed inset-x-0 top-0 z-40 border-b border-foreground/10 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-[1680px] items-center justify-between px-6 sm:px-10 lg:h-20 lg:px-16 xl:px-20">
          <Link href="/" aria-label="OnPoint Clothing — Home">
            <Logo priority className="h-6 w-auto sm:h-7" />
          </Link>
          <p className="font-sans text-xs font-medium tracking-[0.3em] text-foreground/60 uppercase">Secure Checkout</p>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        solid ? "border-b border-foreground/10 bg-background/95 backdrop-blur-md" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1680px] items-center justify-between px-6 sm:px-10 lg:h-20 lg:px-16 xl:px-20">
        <Link href="/" aria-label="OnPoint Clothing — Home" className="shrink-0">
          <Logo priority className="h-6 w-auto sm:h-7" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-xs font-medium tracking-[0.16em] text-foreground/75 uppercase transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center text-foreground/80 transition-colors hover:text-foreground"
          >
            <SearchIcon className="h-[18px] w-[18px]" />
          </button>
          <Link
            href="/account"
            aria-label="Account"
            className="hidden h-10 w-10 items-center justify-center text-foreground/80 transition-colors hover:text-foreground sm:flex"
          >
            <UserIcon className="h-[18px] w-[18px]" />
          </Link>
          <button
            type="button"
            onClick={openCart}
            aria-label={`Bag, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
            className="relative flex h-10 w-10 items-center justify-center text-foreground/80 transition-colors hover:text-foreground"
          >
            <BagIcon className="h-[18px] w-[18px]" />
            {itemCount > 0 ? (
              <span className="absolute top-1.5 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-burgundy px-1 font-sans text-[10px] font-medium text-foreground tabular-nums">
                {itemCount}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={openMobileNav}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center text-foreground/80 transition-colors hover:text-foreground lg:hidden"
          >
            <MenuIcon className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </header>
  );
}
