import type { Collection } from "@/lib/types";

export const collections: Collection[] = [
  {
    slug: "the-tailored-edit",
    name: "The Tailored Edit",
    season: "Season Two",
    description:
      "Structured outerwear and precise tailoring, built to move between the office and the evening.",
    image: { publicId: "placeholder:collection-tailored-01", alt: "The Tailored Edit" },
    productSlugs: [
      "tailored-wool-overcoat",
      "structured-wool-blazer",
      "straight-leg-wool-trouser",
      "wool-tailored-blazer",
      "pleated-midi-skirt",
      "tailored-wide-leg-trouser",
    ],
  },
  {
    slug: "essential-layers",
    name: "Essential Layers",
    season: "Season Two",
    description: "Fine-gauge knitwear and everyday cloth, made to sit under tailoring or stand alone.",
    image: { publicId: "placeholder:collection-layers-01", alt: "Essential Layers" },
    productSlugs: ["merino-crewneck-sweater", "oxford-cotton-shirt", "cashmere-turtleneck"],
  },
  {
    slug: "evening-hours",
    name: "Evening Hours",
    season: "Season Two",
    description: "Fluid silk and matte crepe for occasions after dark.",
    image: { publicId: "placeholder:collection-evening-01", alt: "Evening Hours" },
    productSlugs: ["silk-wrap-blouse", "column-evening-dress", "silk-twill-scarf", "structured-leather-tote"],
  },
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((collection) => collection.slug === slug);
}
