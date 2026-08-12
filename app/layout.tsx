import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { UIProvider } from "@/lib/ui-context";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchOverlay } from "@/components/layout/search-overlay";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const description =
  "OnPoint Clothing — nineteen years of tailoring and considered design. Shop ready-to-wear and bespoke.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.justonpointng.com"),
  title: {
    default: "OnPoint Clothing — 19 Years of Craft",
    template: "%s | OnPoint Clothing",
  },
  description,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "OnPoint Clothing — 19 Years of Craft",
    description,
    url: "/",
    siteName: "OnPoint Clothing",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "OnPoint Clothing — 19 Years of Craft",
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <CartProvider>
          <UIProvider>
            <Header />
            <MobileNav />
            <SearchOverlay />
            <CartDrawer />
            <main className="flex-1">{children}</main>
            <Footer />
          </UIProvider>
        </CartProvider>
      </body>
    </html>
  );
}
