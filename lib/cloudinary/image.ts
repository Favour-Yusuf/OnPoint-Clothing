import type { CloudinaryImage } from "@/lib/types";

const PLACEHOLDER_PREFIX = "placeholder:";
const FALLBACK_IMAGE: CloudinaryImage = { publicId: "placeholder:no-image", alt: "Image coming soon" };

/** True for an unset/empty public ID or the "placeholder:<key>" mock marker. */
export function isPlaceholder(publicId: string): boolean {
  return !publicId || publicId.startsWith(PLACEHOLDER_PREFIX);
}

export function placeholderLabel(publicId: string): string {
  return publicId.startsWith(PLACEHOLDER_PREFIX) ? publicId.slice(PLACEHOLDER_PREFIX.length) : "image";
}

/** First image in a product's gallery, or a shared fallback if it has none. */
export function getPrimaryImage(images: CloudinaryImage[]): CloudinaryImage {
  return images[0] ?? FALLBACK_IMAGE;
}

/**
 * Builds an optimized Cloudinary delivery URL for a stored public ID.
 *
 * f_auto/q_auto let Cloudinary pick the best format (AVIF/WebP/etc) and
 * compression for the requesting browser. c_limit only ever scales an image
 * down to `width`, never up and never crops — visual cropping to a target
 * aspect ratio is handled by `object-cover` on the rendered <Image>, which
 * already knows its container's shape, so Cloudinary doesn't need to.
 */
export function getCloudinaryUrl(publicId: string, width: number, quality: number | "auto" = "auto"): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set");
  }
  const transforms = ["f_auto", `q_${quality}`, "dpr_auto", "c_limit", `w_${width}`].join(",");
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}/${publicId}`;
}
