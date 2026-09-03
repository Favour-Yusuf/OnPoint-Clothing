import type { CloudinaryImage, HeroSlide } from "@/lib/types";

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
  /**
   * The homepage hero cycles through these, in order. First entry matches
   * `hero` above and is always an image (kept fast for first paint/LCP —
   * see priority handling in HeroImageRotator). Two short video slides are
   * mixed in further along for motion; each is trimmed to `endSeconds` at
   * delivery time (lib/cloudinary/video.ts) rather than by re-editing the
   * source clip, so a longer source still fits the rotator's fixed
   * per-slide display duration.
   */
  heroRotation: [
    {
      kind: "image",
      publicId: "Web_7",
      alt: "OnPoint model in a white embroidered kaftan with coral beadwork",
    },
    {
      kind: "image",
      publicId: "DSC05331",
      alt: "Two OnPoint models in matching coral two-piece sets, seated on driftwood at the beach",
    },
    {
      kind: "video",
      publicId: "On_Point_motion_2",
      alt: "OnPoint brand motion reel",
      endSeconds: 6,
    },
    {
      kind: "image",
      publicId: "Web_9",
      alt: "A model in an angular geometric-print wrap walking the runway, GLITZ Fashion Week signage behind",
    },
    {
      kind: "image",
      publicId: "DSC05254",
      alt: "Two OnPoint models in matching coral two-piece sets, walking together on the beach",
    },
    {
      kind: "image",
      publicId: "Web_6",
      alt: "OnPoint model in a regal red beaded kaftan and crown, holding a fur-trimmed staff, studio portrait on a red backdrop",
    },
    {
      kind: "video",
      publicId: "ONPOINT_FOR_WEBSITE_squished",
      alt: "OnPoint garment detail and movement reel",
      endSeconds: 6,
    },
    {
      kind: "image",
      publicId: "DSC05179",
      alt: "Two OnPoint models in matching coral two-piece sets, standing together on the beach",
    },
    {
      kind: "image",
      publicId: "Web_11",
      alt: "Two OnPoint models in matching sage-green printed co-ord sets, studio portrait on a red backdrop",
    },
    {
      kind: "video",
      publicId: "WEBSITE_squished",
      alt: "Close-up of a black floral-textured agbada with red beaded buttons, beach backdrop",
      // Untrimmed on purpose — this source is 11s and should be delivered
      // in full, unlike the other two hero video slides above.
    },
  ] satisfies HeroSlide[],
  aboutHero: {
    publicId: "Pato_web",
    alt: "The OnPoint atelier",
  } satisfies CloudinaryImage,
  bespokeHero: {
    publicId: "Pato_web",
    alt: "OnPoint Bespoke client in a regal beaded cap and black brocade cape, studio portrait",
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
