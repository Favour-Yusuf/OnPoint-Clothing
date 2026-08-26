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
  /** The homepage hero cycles through these, in order. First entry matches `hero` above. */
  heroRotation: [
    {
      publicId: "Web_7",
      alt: "OnPoint model in a white embroidered kaftan with coral beadwork",
    },
    {
      publicId: "DSC05331",
      alt: "Two OnPoint models in matching coral two-piece sets, seated on driftwood at the beach",
    },
    {
      publicId: "Web_9",
      alt: "A model in an angular geometric-print wrap walking the runway, GLITZ Fashion Week signage behind",
    },
    {
      publicId: "DSC05254",
      alt: "Two OnPoint models in matching coral two-piece sets, walking together on the beach",
    },
    {
      publicId: "Web_6",
      alt: "OnPoint model in a regal red beaded kaftan and crown, holding a fur-trimmed staff, studio portrait on a red backdrop",
    },
    {
      publicId: "DSC05179",
      alt: "Two OnPoint models in matching coral two-piece sets, standing together on the beach",
    },
    {
      publicId: "Web_11",
      alt: "Two OnPoint models in matching sage-green printed co-ord sets, studio portrait on a red backdrop",
    },
  ] satisfies CloudinaryImage[],
  aboutHero: {
    publicId: "Pato_web",
    alt: "The OnPoint atelier",
  } satisfies CloudinaryImage,
  bespokeHero: {
    publicId: "_DPR0496.jpg",
    alt: "OnPoint Bespoke atelier",
  } satisfies CloudinaryImage,
  bespokeTeaser: {
    publicId: "IGHALO_WEB",
    alt: "OnPoint Bespoke client in a tailored cape and crown, studio portrait",
  } satisfies CloudinaryImage,
  activeHero: {
    publicId: "_DPR7522.jpg.jpg",
    alt: "CORE SET, cropped performance top and sculpting leggings in burgundy, front view",
  } satisfies CloudinaryImage,
  activeTeaser: {
    publicId: "_DPR0246",
    alt: "VERDANT MOTION SET, deep-green crop top and leggings, side pose",
  } satisfies CloudinaryImage,
  categoryTiles: {
    newArrivals: {
      publicId: "Web_7",
      alt: "OnPoint model in a white embroidered kaftan with coral beadwork",
    } satisfies CloudinaryImage,
    collections: {
      publicId: "close-knit",
      alt: "Crown Legacy, close knit detail",
    } satisfies CloudinaryImage,
    bespoke: {
      publicId: "Pato_web",
      alt: "OnPoint Bespoke client in a custom cape with layered chains and a crown",
    } satisfies CloudinaryImage,
    active: {
      publicId: "_DPR7522.jpg.jpg",
      alt: "CORE SET, cropped performance top and sculpting leggings in burgundy, front view",
    } satisfies CloudinaryImage,
  },
};
