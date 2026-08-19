import type { ImageLoaderProps } from "next/image";
import { getCloudinaryUrl } from "@/lib/cloudinary/image";

/**
 * Custom next/image loader for Cloudinary-hosted images. Bypasses Next's
 * built-in image optimizer (which would otherwise re-fetch and re-encode an
 * already-optimized Cloudinary URL) and lets Cloudinary do the resizing
 * directly — this is the pattern Next.js recommends for third-party CDNs.
 * `src` here is a Cloudinary public ID, not a URL.
 */
export function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  return getCloudinaryUrl(src, width, quality ?? "auto");
}
