import type { CloudinaryImage } from "@/lib/types";

/**
 * Homepage imagery that isn't sourced from the product/category/collection
 * tables — hero, bespoke teaser, and the non-category discovery tiles.
 * Centralized here (rather than inline in each component) so a developer
 * adding real Cloudinary photography has one place to look.
 */
export const editorialImages = {
  hero: {
    publicId: "Web_7",
    alt: "OnPoint model in a white embroidered kaftan with coral beadwork",
  } satisfies CloudinaryImage,
  aboutHero: { publicId: "placeholder:about-hero-01", alt: "The OnPoint atelier" } satisfies CloudinaryImage,
  bespokeHero: {
    publicId: "placeholder:bespoke-hero-01",
    alt: "OnPoint Bespoke atelier",
  } satisfies CloudinaryImage,
  bespokeTeaser: {
    publicId: "IGHALO_WEB",
    alt: "OnPoint Bespoke client in a tailored cape and crown, studio portrait",
  } satisfies CloudinaryImage,
  categoryTiles: {
    newArrivals: {
      publicId: "Web_7",
      alt: "OnPoint model in a white embroidered kaftan with coral beadwork",
    } satisfies CloudinaryImage,
    collections: {
      publicId: "Web_6.jpg.jpg",
      alt: "OnPoint presenting on stage at a brand event",
    } satisfies CloudinaryImage,
    bespoke: {
      publicId: "Pato_web",
      alt: "OnPoint Bespoke client in a custom cape with layered chains and a crown",
    } satisfies CloudinaryImage,
  },
};
