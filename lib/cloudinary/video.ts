// Gallery videos never display wider than roughly half a large desktop
// viewport (the product page's two-column layout) — capping delivery to
// this width, plus the more aggressive "eco" quality tier, keeps the
// buffered file small enough to autoplay quickly instead of fetching a
// phone/camera source at its native resolution and bitrate. One source
// video measured at ~16MB uncompressed dropped to ~8MB at q_auto:eco —
// still plenty sharp for a preview-sized autoplay clip.
const GALLERY_VIDEO_WIDTH = 720;

// The homepage hero is full-bleed (up to the viewport width), unlike the
// product gallery's half-width slot, so it gets its own, wider cap.
const HERO_VIDEO_WIDTH = 1920;

type VideoUrlOptions = {
  /** Delivery width cap; defaults to the product-gallery width. */
  width?: number;
  /** Trims delivery to this many seconds from the start (Cloudinary `eo_`), so a longer source can be shortened without re-encoding the file. */
  endSeconds?: number;
};

/**
 * Builds an optimized Cloudinary video delivery URL for a stored public ID.
 *
 * f_auto picks the best codec/container for the requesting browser
 * (mirrors lib/cloudinary/image.ts's getCloudinaryUrl); q_auto:eco biases
 * toward a smaller file over maximum fidelity, appropriate for a preview
 * clip that needs to start playing quickly rather than a hero asset judged
 * frame-by-frame. c_limit,w_<width> caps delivery to what the slot actually
 * needs, never scaling a smaller source up. The trailing .mp4 is the
 * requested base format — Cloudinary transcodes any source (including a
 * .mov upload) into it on the fly, so the original upload format never
 * matters here.
 */
export function getCloudinaryVideoUrl(publicId: string, options: VideoUrlOptions = {}): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set");
  }
  const width = options.width ?? GALLERY_VIDEO_WIDTH;
  const trim = options.endSeconds !== undefined ? `,eo_${options.endSeconds}` : "";
  const transforms = `f_auto,q_auto:eco,c_limit,w_${width}${trim}`;
  return `https://res.cloudinary.com/${cloudName}/video/upload/${transforms}/${publicId}.mp4`;
}

/**
 * A still frame from the video, shown as the <video>'s poster while it
 * loads. Cloudinary generates this from the same public ID via the image
 * delivery type — a well-known Cloudinary capability, not a separate asset.
 */
export function getCloudinaryVideoPosterUrl(publicId: string, options: Pick<VideoUrlOptions, "width"> = {}): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set");
  }
  const width = options.width ?? GALLERY_VIDEO_WIDTH;
  const transforms = `f_auto,q_auto,c_limit,w_${width}`;
  return `https://res.cloudinary.com/${cloudName}/video/upload/${transforms}/${publicId}.jpg`;
}

/** Hero-specific convenience wrapper: full-bleed width, trimmed to `endSeconds`. */
export function getHeroVideoUrl(publicId: string, endSeconds: number): string {
  return getCloudinaryVideoUrl(publicId, { width: HERO_VIDEO_WIDTH, endSeconds });
}

/** Hero-specific poster wrapper, matching {@link getHeroVideoUrl}'s width. */
export function getHeroVideoPosterUrl(publicId: string): string {
  return getCloudinaryVideoPosterUrl(publicId, { width: HERO_VIDEO_WIDTH });
}
