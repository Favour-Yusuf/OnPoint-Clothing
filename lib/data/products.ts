import type { Product, ProductColor, ProductVariant } from "@/lib/types";

function buildVariants(
  productId: string,
  sizes: string[],
  colors: ProductColor[],
  soldOut: string[] = []
): ProductVariant[] {
  const variants: ProductVariant[] = [];
  for (const color of colors) {
    for (const size of sizes) {
      const id = `${productId}-${color.name}-${size}`.toLowerCase().replace(/\s+/g, "-");
      variants.push({
        id,
        size,
        color: color.name,
        sku: id.toUpperCase(),
        inStock: !soldOut.includes(id),
      });
    }
  }
  return variants;
}

const BLACK: ProductColor = { name: "Black", hex: "#0a0a0a" };
const NAVY: ProductColor = { name: "Navy", hex: "#1c2333" };
const GREY: ProductColor = { name: "Grey", hex: "#84807a" };
const WHITE: ProductColor = { name: "White", hex: "#fbfaf8" };
const OFFWHITE: ProductColor = { name: "Off White", hex: "#f0ece2" };
const RED: ProductColor = { name: "Red", hex: "#b3202f" };
const GREEN: ProductColor = { name: "Green", hex: "#1f4d36" };
const YELLOW: ProductColor = { name: "Yellow", hex: "#d4a017" };
const CUSTOM_BURGUNDY: ProductColor = { name: "Custom", hex: "#6d0f1f" };

const KAFTAN_SIZES = ["M", "L", "XL", "2XL", "3XL", "4XL"];
const FILA_SIZES = ["20", "21", "22", "23", "24", "25", "25.5"];

export const products: Product[] = [
  {
    id: "p-01",
    slug: "aura-monolith-vslit-set",
    name: "Aura Monolith V-Slit Set",
    price: 300000,
    currency: "NGN",
    categorySlug: "men",
    collectionSlugs: [],
    images: [
      { publicId: "front", alt: "Aura Monolith V-Slit Set, front view" },
      { publicId: "full", alt: "Aura Monolith V-Slit Set, full length" },
      { publicId: "detail", alt: "Aura Monolith V-Slit Set, fabric detail" },
      { publicId: "full-style", alt: "Aura Monolith V-Slit Set, styled full look" },
    ],
    shortDescription: "A grey linen V-slit tunic and wide-leg trouser set.",
    description:
      "Redefine modern luxury with the Aura Monolith V-Slit Set, masterfully crafted for the contemporary tastemaker. This ensemble seamlessly blends rich cultural heritage with avant-garde streetwear aesthetics. Cut from a premium, tactile grey linen, the set features a striking deep V-neckline tunic paired with effortlessly draped, wide-leg trousers — built for a high-end cultural gathering or a bold statement at a day event.",
    details: ["Premium tactile linen", "Deep V-neckline tunic", "Wide-leg trousers", "Two-piece set"],
    care: ["Dry clean only", "Steam to refresh", "Store on a broad-shouldered hanger"],
    sizes: KAFTAN_SIZES,
    colors: [GREY, BLACK],
    variants: buildVariants("p-01", KAFTAN_SIZES, [GREY, BLACK]),
    availability: "in-stock",
    isNew: true,
  },
  {
    id: "p-02",
    slug: "black-senator-kaftan",
    name: "Black Senator Kaftan",
    price: 400000,
    currency: "NGN",
    categorySlug: "men",
    collectionSlugs: [],
    images: [
      { publicId: "OJM09891", alt: "Black Senator Kaftan, fabric detail" },
      { publicId: "OJM09875", alt: "Black Senator Kaftan, full length" },
      { publicId: "OJM09882", alt: "Black Senator Kaftan, half shot" },
      { publicId: "OJM09904", alt: "Black Senator Kaftan, seated shot" },
    ],
    shortDescription: "A sleek black kaftan in the finest Irish cotton.",
    description:
      "Expertly tailored from the finest Irish cotton, this sleek kaftan delivers ultimate comfort and effortless luxury for the modern gentleman.",
    details: ["100% Irish cotton", "Senator-style silhouette", "Relaxed, tailored fit"],
    care: ["Machine wash cold", "Iron on medium heat"],
    sizes: KAFTAN_SIZES,
    colors: [BLACK, WHITE, OFFWHITE, NAVY],
    variants: buildVariants("p-02", KAFTAN_SIZES, [BLACK, WHITE, OFFWHITE, NAVY]),
    availability: "in-stock",
    isNew: true,
  },
  {
    id: "p-03",
    slug: "aura-white-kaftan",
    name: "Aura White Kaftan",
    price: 400000,
    currency: "NGN",
    categorySlug: "men",
    collectionSlugs: [],
    images: [
      { publicId: "DSC02764", alt: "Aura White Kaftan, fabric detail" },
      { publicId: "DSC02738", alt: "Aura White Kaftan, full length" },
      { publicId: "DSC02735", alt: "Aura White Kaftan, styled look" },
    ],
    shortDescription: "A luminous white kaftan with architectural tailoring.",
    description:
      "A refined expression of contemporary African luxury. Crafted in a luminous textured fabric, this impeccably tailored ensemble blends relaxed elegance with architectural detailing, creating a silhouette that feels effortlessly regal. Designed for the man who commands attention through subtlety, the Aura White Kaftan embodies sophistication, movement, and timeless presence.",
    details: ["Luminous textured fabric", "Architectural tailored detailing", "Relaxed, regal silhouette"],
    care: ["Dry clean only"],
    sizes: KAFTAN_SIZES,
    colors: [WHITE, BLACK, NAVY],
    variants: buildVariants("p-03", KAFTAN_SIZES, [WHITE, BLACK, NAVY]),
    availability: "in-stock",
    isNew: true,
  },
  {
    id: "p-04",
    slug: "crown-legacy",
    name: "Crown Legacy",
    price: 2500000,
    currency: "NGN",
    categorySlug: "men",
    collectionSlugs: [],
    images: [
      { publicId: "full-shot", alt: "Crown Legacy, full shot" },
      { publicId: "close-knit", alt: "Crown Legacy, close knit detail" },
      { publicId: "side-shot", alt: "Crown Legacy, side shot" },
      { publicId: "close-shot", alt: "Crown Legacy, close detail" },
    ],
    shortDescription: "A custom burgundy jacquard ensemble with hand-applied beadwork.",
    description:
      "A regal expression of African heritage, power, and refined craftsmanship. The Crown Legacy ensemble is meticulously crafted in rich burgundy jacquard, lavishly embellished with intricate beadwork, crystal detailing, layered pearl chains, and ornate metallic accents. Made for those who don't simply wear tradition, but inherit its crown.",
    details: [
      "Rich burgundy jacquard",
      "Hand-applied beadwork and crystal detailing",
      "Layered pearl chain embellishment",
      "Ornate metallic accents",
      "Made to custom measure",
    ],
    care: ["Dry clean only", "Handle beadwork and embellishment with care", "Store flat or on a padded hanger"],
    sizes: ["Custom"],
    colors: [CUSTOM_BURGUNDY],
    variants: buildVariants("p-04", ["Custom"], [CUSTOM_BURGUNDY]),
    availability: "made-to-order",
    isNew: true,
    isBespokeEligible: true,
  },
  {
    id: "p-05",
    slug: "royal-crown-fila",
    name: "Royal Crown Fila",
    price: 250000,
    currency: "NGN",
    categorySlug: "accessories",
    collectionSlugs: [],
    images: [
      { publicId: "BD8F5E61-DE64-4E8E-8C7C-4395F5451E1C", alt: "Royal Crown Fila, red and white beaded cap pair" },
      { publicId: "94737712-FBAC-4546-A765-5491A43293A5", alt: "Royal Crown Fila, white and gold beaded cap detail" },
      { publicId: "615069C3-EEDF-4EFA-B42F-E00BCF8A614D", alt: "Royal Crown Fila, white and gold beaded cap, side view" },
      { publicId: "BCC70D09-A5D7-41E1-AEB4-5BC5DB060F4A", alt: "Royal Crown Fila, white and gold beaded cap, angled view" },
      { publicId: "8C146C77-4A4F-4FC9-AA5F-A7680B5003BF", alt: "Royal Crown Fila, three beaded colorways displayed together" },
      { publicId: "9cba55a7-2984-4022-bec9-632bcda038c5.JPG.jpg", alt: "Royal Crown Fila styled with a white agbada" },
      { publicId: "32090019-07b4-4896-9e3d-7d8b3e193afc.JPG.jpg", alt: "Royal Crown Fila styled for father and son" },
      { publicId: "39cf1774-dd32-4c36-8166-9424c7b24dbe.JPG.jpg", alt: "Royal Crown Fila styled with a white agbada, full length" },
      { publicId: "3525621c-b79c-4670-8499-7b1223ce7222.JPG.jpg", alt: "Royal Crown Fila styled with a white agbada, campaign portrait" },
    ],
    shortDescription: "Handcrafted, exquisite, unmistakably distinctive.",
    description:
      "Exquisitely handcrafted headpieces featuring rich textures, intricate embroidery, crystals, beads, and refined gold embellishments. Designed to elevate traditional and contemporary looks with a distinctive touch of luxury.",
    details: ["Hand-applied crystals and beadwork", "Intricate embroidery", "Refined gold embellishments"],
    care: ["Wipe clean", "Store flat or on a padded stand", "Handle beadwork and embellishment with care"],
    sizes: FILA_SIZES,
    colors: [WHITE, OFFWHITE, BLACK, RED, GREEN, YELLOW, GREY, NAVY],
    variants: buildVariants("p-05", FILA_SIZES, [WHITE, OFFWHITE, BLACK, RED, GREEN, YELLOW, GREY, NAVY]),
    availability: "in-stock",
    isNew: true,
  },
];
