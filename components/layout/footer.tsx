"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { NewsletterForm } from "@/components/layout/newsletter-form";

// Trimmed from public/signature-.png (which has heavy transparent padding
// baked into its 500x500 canvas) so it renders crisp at footer size instead
// of shrinking to near-invisible. Footer-only — the header keeps the Logo mark.
const SIGNATURE_WIDTH = 227;
const SIGNATURE_HEIGHT = 124;

const SHOP_LINKS = [
  { label: "New Arrivals", href: "/shop/new-arrivals" },
  { label: "Men", href: "/shop/men" },
  { label: "Women", href: "/shop/women" },
  { label: "Accessories", href: "/shop/accessories" },
  { label: "Collections", href: "/collections" },
];

const HOUSE_LINKS = [
  { label: "About OnPoint", href: "/about" },
  { label: "OnPoint Expression", href: "/expression" },
  { label: "Bespoke", href: "/bespoke" },
  { label: "OnPoint Active", href: "/active" },
  { label: "Contact", href: "/about#contact" },
];


const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1FfKqGFJrR/?mibextid=wwXIfr",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M14 8h3V4h-3c-3.314 0-5 1.686-5 5v3H6v4h3v8h4v-8h3l1-4h-4V9c0-.667.333-1 1-1z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/onpointclothingng?utm_source=qr",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@onpointclothingng?_r=1&_t=ZS-99QXxl6NmgD",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M15.5 3c.3 1.7 1.3 3 3.1 3.6.5.2 1 .3 1.4.3v3.1c-1.4 0-2.8-.4-4-1.1v6.8c0 3.4-2.3 5.8-5.7 5.8-3.2 0-5.5-2.2-5.5-5.2 0-3.1 2.5-5.4 5.7-5.4.3 0 .6 0 .9.1v3.2c-.3-.1-.6-.2-.9-.2-1.4 0-2.5.9-2.5 2.3 0 1.2.9 2.2 2.3 2.2 1.5 0 2.6-1 2.6-2.8V3h2.6z" />
      </svg>
    ),
  },
  {
    label: "Snapchat",
    href: "https://snapchat.com/t/BBFcer0r",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.5c-3.3 0-5.7 2.5-5.7 6.1v3.1c0 .6-.3 1.1-.9 1.4l-1.5.7c-.5.2-.7.7-.5 1.2.2.5.7.7 1.2.7.7 0 1.4.2 2 .5-.1.6-.4 1.1-.8 1.5-.3.3-.2.8.2 1 .7.4 1.5.6 2.4.7.3 1.1 1.2 1.8 2.4 1.8.5 0 1-.1 1.4-.3.4-.2.9-.2 1.3 0 .4.2.9.3 1.4.3 1.2 0 2.1-.7 2.4-1.8.9-.1 1.7-.3 2.4-.7.4-.2.5-.7.2-1-.4-.4-.7-.9-.8-1.5.6-.3 1.3-.5 2-.5.5 0 1-.2 1.2-.7.2-.5 0-1-.5-1.2l-1.5-.7c-.6-.3-.9-.8-.9-1.4V8.6c0-3.6-2.4-6.1-5.7-6.1z" />
      </svg>
    ),
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  const pathname = usePathname();

  if (pathname.startsWith("/checkout")) {
    return (
      <footer className="border-t border-foreground/10 bg-background">
        <Container className="flex flex-col items-center gap-2 py-6 font-sans text-xs font-light tracking-[0.15em] text-foreground/45 uppercase sm:flex-row sm:justify-between">
          <p>&copy; {year} OnPoint Clothing</p>
          <p>Secure Checkout</p>
        </Container>
      </footer>
    );
  }

  return (
    <footer className="border-t border-burgundy/20 bg-background">
      <Container className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:py-20">
        <div className="flex flex-col items-start gap-5">
          <Image
            src="/signature-footer.png"
            alt="OnPoint Clothing"
            width={SIGNATURE_WIDTH}
            height={SIGNATURE_HEIGHT}
            className="h-12 w-auto"
          />
          <p className="max-w-xs text-sm leading-relaxed text-foreground/55">
            A multiple award-winning fashion house. Redefining luxury for the 21st century.
          </p>
          <div className="flex items-center gap-4">
    {SOCIAL_LINKS.map((social) => (
      <a
        key={social.label}
        href={social.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`OnPoint Clothing on ${social.label}`}
        className="flex h-9 w-9 items-center justify-center text-foreground/55 transition-colors hover:text-burgundy-light"
      >
        <span className="h-[18px] w-[18px]">
          {social.icon}
        </span>
      </a>
    ))}
  </div>
        </div>

        

        <nav aria-label="Shop">
          <p className="font-sans text-xs font-light tracking-[0.25em] text-foreground/45 uppercase">Shop</p>
          <ul className="mt-5 flex flex-col gap-3">
            {SHOP_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-foreground/70 transition-colors hover:text-burgundy-light">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="The House">
          <p className="font-sans text-xs font-light tracking-[0.25em] text-foreground/45 uppercase">The House</p>
          <ul className="mt-5 flex flex-col gap-3">
            {HOUSE_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-foreground/70 transition-colors hover:text-burgundy-light">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-sans text-xs font-light tracking-[0.25em] text-foreground/45 uppercase">Stay Informed</p>
          <p className="mt-5 text-sm text-foreground/60">New collections and bespoke openings, occasionally.</p>
          <div className="mt-5">
            <NewsletterForm />
          </div>
        </div>
      </Container>

      <div className="border-t border-foreground/10">
        <Container className="flex flex-col items-center gap-3 py-6 font-sans text-xs font-light tracking-[0.15em] text-foreground/45 uppercase sm:flex-row sm:justify-between">
          <p>&copy; {year} OnPoint Clothing</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-burgundy-light">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-burgundy-light">
              Terms of Service
            </Link>
            <Link href="/returns" className="hover:text-burgundy-light">
              Returns
            </Link>
          </div>
          <p className="text-burgundy-light">Multiple Award-Winning</p>
        </Container>
      </div>
    </footer>
  );
}
