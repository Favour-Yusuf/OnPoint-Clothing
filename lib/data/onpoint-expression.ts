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
      publicId: "ON_POINT_EXPRESSION_-206",
      alt: "A close portrait of a guest in an ornate gold Egyptian-style collar necklace and beige suit, holding a red cup",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-193",
      alt: "A guest in a burgundy-and-green striped kaftan posing dramatically beside the illuminated ON POINT EXPRESSION marquee letters",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-216",
      alt: "A guest in a black plunging halter jumpsuit checking her phone on a lounge cushion, holding a Hennessy cup",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-90",
      alt: "A guest's back view showing the vivid print of her tie-dye kaftan, in conversation with another guest",
      orientation: "portrait",
    },
  ] satisfies ExpressionImage[],

  breathers: {
    intoRunway: {
      publicId: "ON_POINT_EXPRESSION_-50",
      alt: "OnPoint Expression's security detail lined up in suits and sunglasses before the step-and-repeat wall",
      orientation: "landscape",
    },
    intoHost: {
      publicId: "ON_POINT_EXPRESSION_-240",
      alt: "The hosts walking the runway, the female host's cape caught mid-motion",
      orientation: "landscape",
    },
  } satisfies { intoRunway: ExpressionImage; intoHost: ExpressionImage },

  runway: {
    opener: {
      publicId: "Web_9",
      alt: "A model in an angular geometric-print wrap walking the runway, GLITZ Fashion Week signage behind",
      orientation: "landscape",
    } satisfies ExpressionImage,

    hero: [
      {
        publicId: "Web_13",
        alt: "A model in a dark beaded caftan and fur hat walking the runway past a seated audience",
        orientation: "landscape",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-376",
        alt: "A model in a black cropped top and pencil skirt walking through stage fog past an \"ACTIVE ONPOINT\" screen, confident stride",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-443",
        alt: "A man in a dark trench-style robe and wide-brimmed hat walking alone down the runway path, moody amber lighting",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-307",
        alt: "A man in a red embroidered kaftan and cap walking alone down the runway path through smoke",
        orientation: "portrait",
      },
      {
        publicId: "Web_14",
        alt: "The hosts walking the runway together in matching black regalia",
        orientation: "landscape",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-236",
        alt: "The hosts walking the runway together in matching dark regalia, big screen behind",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-475",
        alt: "A black-and-white shot of a plus-size model in a jacquard tunic standing inside an illuminated runway frame",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-237",
        alt: "The hosts walking the runway in red-trimmed regalia, TRACE screen behind",
        orientation: "portrait",
      },
      {
        publicId: "Web_15",
        alt: "A model in a full-face helmet and dark robe walking alone through fog and light",
        orientation: "landscape",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-470",
        alt: "A model in a white plunging embellished blazer and matching shorts, voluminous hair, striking pose on the runway",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-377",
        alt: "A black-and-white shot of a model in a fitted romper with twin space-buns, mid-stride on the runway",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-481",
        alt: "A model in a dark textured mini set and dramatic feathered hat, side profile inside an illuminated mirrored runway frame",
        orientation: "portrait",
      },
      {
        publicId: "Web_16",
        alt: "A helmeted model walking toward the camera, screens reading ACE ONPOINT behind",
        orientation: "landscape",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-464",
        alt: "A plus-size model in a sage jacquard kaftan on the runway, a model in black-and-gold following behind",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-445",
        alt: "A black-and-white close shot of a model in a wide-brimmed hat, sunglasses, and netted gloves on the runway",
        orientation: "portrait",
      },
    ] satisfies ExpressionImage[],

    wall: [
      {
        publicId: "ON_POINT_EXPRESSION_-351",
        alt: "A model in a fur-trimmed black-and-white graphic-print caftan walking past a sculptural silver chair prop",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-235",
        alt: "A black-and-white shot of the hosts walking the runway toward camera, disco ball prop in the foreground",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-433",
        alt: "The hosts walking the runway past a \"Just Onpoint\" script screen amid festive lighting",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-439",
        alt: "A man in an embroidered ivory agbada and sunglasses on the runway, red slides, ON POINT EXPRESSION signage behind",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-442",
        alt: "A man in a black kaftan and velvet cap with layered red beads, smiling as he walks the runway",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-480",
        alt: "A model in a black fringed crop top and shorts walking past the Hennessy-branded illuminated runway installation",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-296",
        alt: "Two men in ceremonial red and black velvet robes walking the runway together",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-332",
        alt: "Two models on the runway past a mirrored installation, one in a dark bejeweled robe walking, one standing still in green",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-317",
        alt: "A model in a dark embellished kaftan and cap posed still inside an illuminated mirrored runway box, crowd reflected behind",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-320",
        alt: "A model in a black velvet embroidered kaftan and red cap standing in profile inside an illuminated runway box",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-324",
        alt: "A model in a white tie-dye ruffled tunic and dark wide-leg trousers walking between illuminated runway panels",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-352",
        alt: "A man in a rust agbada walking barefoot down the runway path, disco ball prop in the foreground",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-363",
        alt: "A model in a mustard sleeveless dress walking through an illuminated glass runway installation, seated guests visible behind",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-358",
        alt: "A man in a rust kaftan and cap standing still inside an illuminated runway box, crew and photographers visible at the edges",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-362",
        alt: "A man in a blue-and-white graphic plaid top and cornrows walking the runway past the Expression entrance signage",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-375",
        alt: "A black-and-white long shot of a model in a white crop set walking through heavy stage fog past a repeating mural",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-437",
        alt: "A man in a dark brown agbada, cap, and sunglasses walking the runway past red stage lighting",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-472",
        alt: "A black-and-white side-profile shot of a model in a jacquard cape walking the runway",
        orientation: "portrait",
      },
      {
        publicId: "J11A7557",
        alt: "A model's back view in white Onpoint-branded activewear crop top and biker shorts, hair in braided buns",
        orientation: "portrait",
      },
      {
        publicId: "J11A7554",
        alt: "A model in a black top and dark maxi skirt walking off the runway into stage fog, jacket in hand",
        orientation: "portrait",
      },
      {
        publicId: "ON_POINT_EXPRESSION_-239",
        alt: "A black-and-white candid shot of the hosts walking and conversing along the runway",
        orientation: "landscape",
      },
      {
        publicId: "J11A7578",
        alt: "Two models crossing paths on the runway, one in a white cutout bodysuit, one in a matching cream crop set",
        orientation: "portrait",
      },
      {
        publicId: "J11A7566",
        alt: "A model in a white cutout bodysuit, back to the camera, carrying a white helmet",
        orientation: "portrait",
      },
      {
        publicId: "J11A7496",
        alt: "A model in a fur-trimmed ivory jacquard vest and beaded cap on the runway, side profile",
        orientation: "portrait",
      },
      {
        publicId: "J11A7502",
        alt: "A model in a fur-trimmed ivory jacquard vest and beaded cap, close portrait",
        orientation: "portrait",
      },
      {
        publicId: "J11A7570",
        alt: "A model in a chartreuse wrap top on the runway",
        orientation: "portrait",
      },
      {
        publicId: "J11A7562",
        alt: "A model in a cream cutout crop top and matching trousers on the runway",
        orientation: "portrait",
      },
      {
        publicId: "J11A7552",
        alt: "A model in a black draped, sheer-layered look walking through a fog-lit doorway",
        orientation: "portrait",
      },
      {
        publicId: "J11A7508",
        alt: "A model in a dark beaded caftan and velvet hat on the runway",
        orientation: "portrait",
      },
    ] satisfies ExpressionImage[],
  },

  host: [
    {
      publicId: "ON_POINT_EXPRESSION_-259",
      alt: "The hosts sharing the stage beside a disco ball prop, a red-dress campaign image glowing on the screen behind",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-260",
      alt: "The hosts mid-address together in front of an ACTIVE ONPOINT screen",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-264",
      alt: "A close portrait of the male host mid-gesture, gold beetle brooch and beaded necklaces visible",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-263",
      alt: "A close profile portrait of the female host, statement earring catching the light",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-266",
      alt: "The hosts face to face mid-exchange, warm smile, dramatic backlighting",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-428",
      alt: "A black-and-white full-length shot of the female host walking with a microphone past a sculptural white installation",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-225",
      alt: "The hosts sharing a warm laugh together, full body, in front of an orange stage curtain",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-230",
      alt: "The hosts full body with arms open mid-gesture, colorful seated crowd and disco ball prop behind",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-243",
      alt: "The hosts sharing a joyful high-five moment, disco ball prop in the foreground",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-245",
      alt: "A black-and-white shot of the hosts fist-bumping mid-address",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-255",
      alt: "A black-and-white close portrait of the male host, fist raised, \"Just Onpoint\" script glowing behind",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-444",
      alt: "The female host mid-dance move, playful energy, \"Just Onpoint\" screen behind",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-250",
      alt: "A black-and-white shot of the hosts both addressing the crowd side by side",
      orientation: "portrait",
    },
  ] satisfies ExpressionImage[],

  performance: [
    {
      publicId: "ON_POINT_EXPRESSION_-291",
      alt: "The performer presenting the jeweled crown toward camera, a CROWN title screen glowing behind",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-299",
      alt: "A man in a black velvet cape performing a crowning gesture on another, the pale performer looking on",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-304",
      alt: "A man in a red cap and black cape raising a curved horn triumphantly overhead amid smoke",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-487",
      alt: "Three men in dark ceremonial robes on stage, one raising a fist triumphantly",
      orientation: "landscape",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-404",
      alt: "A performer with platinum hair and a shiny graphic bomber jacket singing into a microphone onstage",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-396",
      alt: "A black-and-white shot of two performers trading vocals face to face on the runway stage",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-395",
      alt: "A performer in a leather jacket and skirt singing on the illuminated stage, colorful seated audience behind",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-274",
      alt: "A performer in a cream jacket gesturing dramatically with a newspaper prop, campaign graphic glowing on the screen behind",
      orientation: "portrait",
    },
    {
      publicId: "ON_POINT_EXPRESSION_-277",
      alt: "A black-and-white shot of the performer reading a newspaper prop with a comic flourish onstage",
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
      publicId: "ON_POINT_EXPRESSION_-91",
      alt: "A model in a vivid orange and pink tie-dye dress sharing a quiet moment backstage, garment racks in the background",
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
