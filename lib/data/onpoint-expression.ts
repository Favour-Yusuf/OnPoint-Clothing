import type { CloudinaryImage } from "@/lib/types";

/**
 * Photography for the OnPoint Expression page and its homepage teaser, all
 * verified against the live "onpoint/OnPoint Expression" Cloudinary folder
 * (49 assets total — run `npm run cloudinary:list` to see the full set).
 * This page only draws on a curated subset; swap or extend any entry below
 * with another public ID from that folder to bring in more photography.
 */

export type ExpressionLook = {
  name: string;
  description: string;
  images: CloudinaryImage[];
};

/**
 * Orientation is recorded per gallery image (rather than derived at render
 * time) so the masonry layout can size each item's aspect ratio without an
 * image fetch — matches each asset's real Cloudinary dimensions.
 */
export type ExpressionGalleryImage = CloudinaryImage & { orientation: "landscape" | "portrait" };

export const onPointExpression = {
  hero: {
    publicId: "ON_POINT_EXPRESSION_-106",
    alt: "The illuminated OnPoint Expression marquee sign glowing magenta against the night sky",
  } satisfies CloudinaryImage,

  homepageTeaser: {
    publicId: "ON_POINT_EXPRESSION_-80",
    alt: "A guest in an embroidered kaftan and wide-brimmed hat, standing before a backdrop of ornate framed portraits",
  } satisfies CloudinaryImage,

  experience: {
    atmosphere: {
      publicId: "ON_POINT_EXPRESSION_-100",
      alt: "A Hennessy-branded lounge installation with velvet seating and stage trussing, wrapped in evening haze",
    } satisfies CloudinaryImage,
    performance: {
      publicId: "ON_POINT_EXPRESSION_-272",
      alt: "A performer under stage lights, sleeve aflame, reading a Guinness World Records book",
    } satisfies CloudinaryImage,
    style: {
      publicId: "ON_POINT_EXPRESSION_-87",
      alt: "A guest in a vivid orange and pink printed dress being photographed backstage",
    } satisfies CloudinaryImage,
    detail: {
      publicId: "ON_POINT_EXPRESSION_-84",
      alt: "Garments hanging on a backstage rack, lit low ahead of the show",
    } satisfies CloudinaryImage,
  },

  looks: [
    {
      name: "Look One",
      description: "[Add designer, fabric, or story details for this look.]",
      images: [
        {
          publicId: "ON_POINT_EXPRESSION_-91",
          alt: "A guest in a vivid orange and pink abstract-print dress in conversation backstage",
        },
        {
          publicId: "ON_POINT_EXPRESSION_-89",
          alt: "The same abstract-print dress seen from behind, sculptural sleeves catching the light",
        },
        {
          publicId: "ON_POINT_EXPRESSION_-98",
          alt: "The guest in the printed dress walking through the venue with a companion",
        },
      ],
    },
    {
      name: "Look Two",
      description: "[Add designer, fabric, or story details for this look.]",
      images: [
        {
          publicId: "ON_POINT_EXPRESSION_-80",
          alt: "A guest in an embroidered kaftan and wide-brimmed hat, standing before a backdrop of ornate framed portraits",
        },
      ],
    },
  ] satisfies ExpressionLook[],

  gallery: [
    {
      publicId: "ON_POINT_EXPRESSION_-104",
      alt: "The OnPoint Expression marquee sign in daylight, palm fronds framing the letters",
      orientation: "landscape",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-69",
      alt: "A styling table set with tools and finishing touches ahead of the show",
      orientation: "landscape",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-74",
      alt: "Three members of the OnPoint team seated together, reviewing notes",
      orientation: "landscape",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-96",
      alt: "A quiet backstage exchange beside the clothing racks",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-101",
      alt: "A glass-and-light Hennessy x OnPoint Expression booth structure at dusk",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-256",
      alt: "A performer commanding the stage, microphone in hand",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-271",
      alt: "A performer in a bejeweled white jacket, caught mid-thought onstage",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-279",
      alt: "A performer engaging the crowd from the illuminated stage",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-394",
      alt: "Two performers reflected in mirrored stage panels",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-400",
      alt: "A performer's silhouette against the illuminated OnPoint Expression booth",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-71",
      alt: "Crew members sharing a high-five backstage",
      orientation: "landscape",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-82",
      alt: "A backstage makeup artist at work ahead of the show",
      orientation: "landscape",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-92",
      alt: "A warm embrace backstage before the show",
      orientation: "landscape",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-94",
      alt: "A crew member in an OnPoint Expression T-shirt",
      orientation: "landscape",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-275",
      alt: "A performer reading a newspaper onstage, lit in amber",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-397",
      alt: "Performers framed within illuminated mirrored panels",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-401",
      alt: "A performer and backing vocalist beneath the OnPoint Expression sign",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-405",
      alt: "A vocalist in a black gown performing beneath the marquee",
      orientation: "portrait",
    },
  ] satisfies ExpressionGalleryImage[],

  legacy: {
    publicId: "ON_POINT_EXPRESSION_-105",
    alt: "The OnPoint Expression marquee glowing at dusk",
  } satisfies CloudinaryImage,
};
