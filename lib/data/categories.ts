import type { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "women",
    name: "Women",
    description: "Tailoring and eveningwear built on precise construction.",
    image: { url: "placeholder:category-women", alt: "Women's collection" },
  },
  {
    slug: "men",
    name: "Men",
    description: "Considered tailoring for everyday and occasion.",
    image: { url: "placeholder:category-men", alt: "Men's collection" },
  },
  {
    slug: "accessories",
    name: "Accessories",
    description: "The finishing details — leather, silk, and metal.",
    image: { url: "placeholder:category-accessories", alt: "Accessories collection" },
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
