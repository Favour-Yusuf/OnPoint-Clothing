"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useUI } from "@/lib/ui-context";
import { signOut } from "@/lib/actions/auth";
import { useCurrentAccount } from "@/lib/use-current-account";
import { BagIcon, MenuIcon, SearchIcon, UserIcon } from "@/components/ui/icons";
import { NAV_LINKS } from "@/components/layout/nav-links";
import { Logo } from "@/components/layout/logo";

export function Header() {
  const { isSignedIn, isAdmin } = useCurrentAccount();
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

          <div className="hidden sm:block">
            {isSignedIn ? (
              <AccountMenu isAdmin={isAdmin} />
            ) : (
              <Link
                href="/account"
                aria-label="Account"
                className="flex h-10 w-10 items-center justify-center text-foreground/80 transition-colors hover:text-foreground"
              >
                <UserIcon className="h-[18px] w-[18px]" />
              </Link>
            )}
          </div>

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

function AccountMenu({ isAdmin }: { isAdmin: boolean }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex h-10 w-10 items-center justify-center text-foreground/80 transition-colors hover:text-foreground"
      >
        <UserIcon className="h-[18px] w-[18px]" />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute top-full right-0 mt-2 w-48 border border-foreground/10 bg-background py-2 shadow-lg"
        >
          <MenuLink href="/account" onSelect={() => setOpen(false)}>
            My Account
          </MenuLink>
          <MenuLink href="/account/orders" onSelect={() => setOpen(false)}>
            Orders
          </MenuLink>
          {isAdmin ? (
            <MenuLink href="/admin" onSelect={() => setOpen(false)}>
              Admin Dashboard
            </MenuLink>
          ) : null}
          <form action={signOut}>
            <button
              type="submit"
              role="menuitem"
              className="w-full px-4 py-2 text-left font-sans text-sm text-foreground/70 hover:bg-foreground/[0.04] hover:text-foreground"
            >
              Sign Out
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function MenuLink({ href, onSelect, children }: { href: string; onSelect: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onSelect}
      className="block px-4 py-2 font-sans text-sm text-foreground/70 hover:bg-foreground/[0.04] hover:text-foreground"
    >
      {children}
    </Link>
  );
}
