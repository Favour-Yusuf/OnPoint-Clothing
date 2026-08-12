"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { Logo } from "@/components/layout/logo";

const SHOP_LINKS = [
  { label: "New Arrivals", href: "/shop/new-arrivals" },
  { label: "Men", href: "/shop/men" },
  { label: "Women", href: "/shop/women" },
  { label: "Accessories", href: "/shop/accessories" },
  { label: "Collections", href: "/collections" },
];

const HOUSE_LINKS = [
  { label: "About OnPoint", href: "/about" },
  { label: "Bespoke", href: "/bespoke" },
  { label: "Contact", href: "mailto:hello@justonpointng.com" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const pathname = usePathname();

  if (pathname.startsWith("/checkout")) {
    return (
      <footer className="border-t border-foreground/10 bg-background">
        <Container className="flex flex-col items-center gap-2 py-6 font-sans text-xs tracking-[0.15em] text-foreground/45 uppercase sm:flex-row sm:justify-between">
          <p>&copy; {year} OnPoint Clothing</p>
          <p>Secure Checkout</p>
        </Container>
      </footer>
    );
  }

  return (
    <footer className="border-t border-foreground/10 bg-background">
      <Container className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:py-20">
        <div className="flex flex-col items-start gap-5">
          <Logo className="h-7 w-auto" />
          <p className="max-w-xs text-sm leading-relaxed text-foreground/55">
            Nineteen years of tailoring, craft, and considered design. OnPoint Clothing is currently rebuilding its
            digital home.
          </p>
        </div>

        <nav aria-label="Shop">
          <p className="font-sans text-xs font-medium tracking-[0.25em] text-foreground/45 uppercase">Shop</p>
          <ul className="mt-5 flex flex-col gap-3">
            {SHOP_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-foreground/70 transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="The House">
          <p className="font-sans text-xs font-medium tracking-[0.25em] text-foreground/45 uppercase">The House</p>
          <ul className="mt-5 flex flex-col gap-3">
            {HOUSE_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-foreground/70 transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-sans text-xs font-medium tracking-[0.25em] text-foreground/45 uppercase">Stay Informed</p>
          <p className="mt-5 text-sm text-foreground/60">New collections and bespoke openings, occasionally.</p>
          <div className="mt-5">
            <NewsletterForm />
          </div>
        </div>
      </Container>

      <div className="border-t border-foreground/10">
        <Container className="flex flex-col items-center gap-2 py-6 font-sans text-xs tracking-[0.15em] text-foreground/45 uppercase sm:flex-row sm:justify-between">
          <p>&copy; {year} OnPoint Clothing</p>
          <p>19 Years of Craft</p>
        </Container>
      </div>
    </footer>
  );
}
