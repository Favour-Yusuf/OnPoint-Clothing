import type { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "women",
    name: "Women",
    description: "Tailoring and eveningwear built on precise construction.",
    image: { publicId: "_DPR0490", alt: "VELORA 3 Piece Active Set, full look, front view" },
  },
  {
    slug: "men",
    name: "Men",
    description: "Considered tailoring for everyday and occasion.",
    image: { publicId: "_DPR0419__2", alt: "OnPoint model in the White Flow Tunic, full look" },
  },
  {
    slug: "accessories",
    name: "Accessories",
    description: "The finishing details: leather, silk, and metal.",
    image: { publicId: "IMG_8699", alt: "ONPOINT BLACK Signature Trucker Cap, held up in hands" },
  },
  // "bespoke" is a real taxonomy category (every product needs one — see
  // PRODUCT_SELECT's `categories!inner` in lib/products.ts) but is NOT part
  // of the storefront's shop-category grid: it gets its own dedicated page/
  // homepage teaser instead (see BespokeTeaser and CategoryDiscovery's
  // SHOP_TILE_SLUGS filter), so its `image` here is unused chrome, not a real
  // product photo pick.
  //
  // OnPoint Active isn't a separate category — those products are genuinely
  // women's activewear (categorySlug: "women") and are additionally tagged
  // with the "onpoint-active" collection (lib/data/collections.ts) so the
  // dedicated /active page and homepage teaser can pull them independently
  // of category.
  {
    slug: "bespoke",
    name: "Bespoke",
    description: "Made-to-measure pieces, built one at a time.",
    image: { publicId: "close-shot", alt: "Crown Legacy, close detail" },
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
