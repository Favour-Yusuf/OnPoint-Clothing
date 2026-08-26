import type { Collection } from "@/lib/types";

/**
 * `productSlugs` here is for humans reading this file — the actual
 * product↔collection link seeded into Supabase comes from each product's
 * own `collectionSlugs` in lib/data/products.ts (see scripts/seed.ts).
 * Keep the two in sync by hand; nothing enforces it automatically.
 */
export const collections: Collection[] = [
  {
    slug: "the-tailored-edit",
    name: "The Tailored Edit",
    season: "Season Two",
    description: "Architectural silhouettes in ivory, black, and grey: precise tailoring worn with quiet authority.",
    image: { publicId: "DSC02738", alt: "OnPoint model in the Aura White Kaftan, architectural tailoring in luminous ivory" },
    productSlugs: [
      "aura-monolith-vslit-set",
      "black-senator-kaftan",
      "aura-white-kaftan",
      "sovereign-jacquard-tunic",
      "white-flow-tunic",
    ],
  },
  {
    slug: "the-regalia-edit",
    name: "The Regalia Edit",
    season: "Season Two",
    description: "Beadwork, gold embroidery, and ceremonial detail: ensembles built for the moments that call for a crown.",
    image: { publicId: "full-shot", alt: "OnPoint model in the Crown Legacy ensemble, burgundy jacquard with hand-applied beadwork" },
    productSlugs: ["crown-legacy", "imperial-noir", "ezego", "itego-collection", "royal-crown-fila"],
  },
  {
    slug: "onpoint-active",
    name: "OnPoint Active",
    season: "Ongoing",
    description: "Performance activewear for movement, training, and everyday wear.",
    image: { publicId: "_DPR7522.jpg.jpg", alt: "CORE SET, cropped performance top and sculpting leggings in burgundy, front view" },
    productSlugs: [
      "rita-romper",
      "rita-romper-long",
      "monalisa-sculptfit-romper",
      "verdant-motion-set",
      "velora-3-piece-active-set",
      "core-set",
      "blush-sculpt-set",
    ],
  },
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((collection) => collection.slug === slug);
}
