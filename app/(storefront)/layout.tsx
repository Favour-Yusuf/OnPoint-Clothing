import type { Metadata } from "next";
import { Montserrat, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "../globals.css";
import { CartProvider } from "@/lib/cart-context";
import { UIProvider } from "@/lib/ui-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchOverlay } from "@/components/layout/search-overlay";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { CartDrawer } from "@/components/cart/cart-drawer";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const description =
  "OnPoint Clothing — a multiple award-winning fashion house. Shop ready-to-wear and bespoke.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.justonpointng.com"),
  title: {
    default: "OnPoint Clothing — Multiple Award-Winning Fashion House",
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
    title: "OnPoint Clothing — Multiple Award-Winning Fashion House",
    description,
    url: "/",
    siteName: "OnPoint Clothing",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "OnPoint Clothing — Multiple Award-Winning Fashion House",
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${geistMono.variable} ${cormorantGaramond.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <CartProvider>
          <UIProvider>
            <WishlistProvider>
              <Header />
              <MobileNav />
              <SearchOverlay />
              <CartDrawer />
              <main className="flex-1">{children}</main>
              <Footer />
              <WhatsAppButton />
            </WishlistProvider>
          </UIProvider>
        </CartProvider>
      </body>
    </html>
  );
}
