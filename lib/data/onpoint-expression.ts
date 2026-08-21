import type { CloudinaryImage } from "@/lib/types";

/**
 * Photography for the OnPoint Expression page and its homepage teaser, all
 * verified against the live "onpoint/OnPoint Expression" Cloudinary folder
 * (154 assets total — run `npm run cloudinary:list` to see the full set).
 * The page organizes its curated subset into five real event moments —
 * red carpet, runway, host, performance, behind the scenes — rather than one
 * undifferentiated gallery. Swap or extend any entry below with another
 * public ID from that folder; keep each entry in the section its content
 * actually belongs to.
 */

/**
 * Orientation is recorded per image (rather than derived at render time) so
 * layouts can size each item's aspect ratio without an image fetch —
 * matches each asset's real Cloudinary dimensions.
 */
export type ExpressionImage = CloudinaryImage & { orientation: "landscape" | "portrait" };

export const onPointExpression = {
  hero: {
    publicId: "ON_POINT_EXPRESSION_-106",
    alt: "The illuminated OnPoint Expression marquee sign glowing magenta against the night sky",
  } satisfies CloudinaryImage,

  homepageTeaser: {
    publicId: "Web_14",
    alt: "A guest in an embroidered kaftan and wide-brimmed hat, standing before a backdrop of ornate framed portraits",
  } satisfies CloudinaryImage,

  redCarpet: [
    {
      publicId: "ON_POINT_EXPRESSION_-72",
      alt: "The red carpet arrivals path, lined with step-and-repeat banners and palm fronds",
      orientation: "landscape",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-86",
      alt: "A guest arriving in a vivid printed dress, flanked by security on the red carpet",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-55",
      alt: "OnPoint Expression's security detail lined up along the red carpet",
      orientation: "landscape",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-62",
      alt: "The security line holding position as guests arrive",
      orientation: "landscape",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-173",
      alt: "A couple posing for a portrait beside the illuminated marquee sign at night",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-176",
      alt: "A guest in a beaded cap and embroidered kaftan posing beside the marquee sign",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-192",
      alt: "A guest in a burgundy and green striped kaftan arriving beside the sign",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-203",
      alt: "A guest settled into the lounge under neon light, holding a branded cup",
      orientation: "landscape",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-80",
      alt: "A guest in an embroidered kaftan and wide-brimmed hat, standing before a backdrop of ornate framed portraits",
      orientation: "landscape",
    },
  ] satisfies ExpressionImage[],

  runway: {
    cinematic: [
      {
        publicId: "Web_9",
        alt: "A model in an angular geometric-print wrap walking the runway, GLITZ Fashion Week signage behind",
        orientation: "landscape",
      },
      {
        publicId: "Web_13",
        alt: "A model in a dark beaded caftan and fur hat walking the runway past a seated audience",
        orientation: "landscape",
      },
      {
        publicId: "Web_14",
        alt: "The hosts walking the runway together in matching black regalia",
        orientation: "landscape",
      },
      {
        publicId: "Web_15",
        alt: "A model in a full-face helmet and dark robe walking alone through fog and light",
        orientation: "landscape",
      },
      {
        publicId: "Web_16",
        alt: "A helmeted model walking toward the camera, screens reading ACE ONPOINT behind",
        orientation: "landscape",
      },
    ] satisfies ExpressionImage[],
    looks: [
      {
        publicId: "J11A7496",
        alt: "A model in a fur-trimmed ivory jacquard vest and beaded cap on the runway",
        orientation: "portrait",
      },
      {
        publicId: "J11A7508",
        alt: "A model in a dark beaded caftan and velvet hat on the runway",
        orientation: "portrait",
      },
      {
        publicId: "J11A7562",
        alt: "A model in a cream cutout crop top and matching trousers on the runway",
        orientation: "portrait",
      },
      {
        publicId: "J11A7570",
        alt: "A model in a chartreuse wrap top on the runway",
        orientation: "portrait",
      },
    ] satisfies ExpressionImage[],
  },

  host: [
    {
      publicId: "ON_POINT_EXPRESSION_-224",
      alt: "The hosts sharing a warm handshake on stage, both dressed in black regal kaftans",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-253",
      alt: "A close portrait of the host in beaded regalia, microphone in hand",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-228",
      alt: "The hosts mid-conversation, microphones in hand",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-267",
      alt: "A close portrait of the host mid-address, softly lit",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-233",
      alt: "The female host mid-sentence, addressing the crowd",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-430",
      alt: "The hosts walking through the crowd together",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-497",
      alt: "The hosts greeting a guest as they move through the venue",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-507",
      alt: "The hosts mid-stride, working the room together",
      orientation: "portrait",
    },
  ] satisfies ExpressionImage[],

  performance: [
    {
      publicId: "ON_POINT_EXPRESSION_-272",
      alt: "A performer under stage lights, sleeve aflame, reading a Guinness World Records book",
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
  ] satisfies ExpressionImage[],

  behindTheScenes: [
    {
      publicId: "ON_POINT_EXPRESSION_-69",
      alt: "A styling table set with tools and finishing touches ahead of the show",
      orientation: "landscape",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-81",
      alt: "A backstage makeup artist applying lashes under a ring light",
      orientation: "landscape",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-82",
      alt: "A stylist finishing a guest's braids backstage",
      orientation: "landscape",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-85",
      alt: "Garments hanging on a rack, detail of embroidery and beadwork",
      orientation: "landscape",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-84",
      alt: "Garments hanging on a backstage rack, lit low ahead of the show",
      orientation: "landscape",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-95",
      alt: "A warm embrace backstage before the show",
      orientation: "landscape",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-71",
      alt: "Crew members sharing a high-five backstage",
      orientation: "landscape",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-31",
      alt: "A guest posing in an OnPoint Expression T-shirt at the branding booth",
      orientation: "portrait",
    },
  ] satisfies ExpressionImage[],

  legacy: {
    publicId: "ON_POINT_EXPRESSION_-105",
    alt: "The OnPoint Expression marquee glowing at dusk",
  } satisfies CloudinaryImage,
};
