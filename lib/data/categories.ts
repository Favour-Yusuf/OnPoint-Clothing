import type { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "women",
    name: "Women",
    description: "Tailoring and eveningwear built on precise construction.",
    image: { publicId: "placeholder:category-women", alt: "Women's collection" },
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
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
