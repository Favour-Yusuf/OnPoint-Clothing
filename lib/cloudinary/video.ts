// Gallery videos never display wider than roughly half a large desktop
// viewport (the product page's two-column layout) — capping delivery to
// this width, plus the more aggressive "eco" quality tier, keeps the
// buffered file small enough to autoplay quickly instead of fetching a
// phone/camera source at its native resolution and bitrate. One source
// video measured at ~16MB uncompressed dropped to ~8MB at q_auto:eco —
// still plenty sharp for a preview-sized autoplay clip.
const GALLERY_VIDEO_WIDTH = 720;

/**
 * Builds an optimized Cloudinary video delivery URL for a stored public ID.
 *
 * f_auto picks the best codec/container for the requesting browser
 * (mirrors lib/cloudinary/image.ts's getCloudinaryUrl); q_auto:eco biases
 * toward a smaller file over maximum fidelity, appropriate for a preview
 * clip that needs to start playing quickly rather than a hero asset judged
 * frame-by-frame. c_limit,w_720 caps delivery to what the gallery slot
 * actually needs, never scaling a smaller source up. The trailing .mp4 is
 * the requested base format — Cloudinary transcodes any source (including
 * a .mov upload) into it on the fly, so the original upload format never
 * matters here.
 */
export function getCloudinaryVideoUrl(publicId: string): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set");
  }
  const transforms = `f_auto,q_auto:eco,c_limit,w_${GALLERY_VIDEO_WIDTH}`;
  return `https://res.cloudinary.com/${cloudName}/video/upload/${transforms}/${publicId}.mp4`;
}

/**
 * A still frame from the video, shown as the <video>'s poster while it
 * loads. Cloudinary generates this from the same public ID via the image
 * delivery type — a well-known Cloudinary capability, not a separate asset.
 */
export function getCloudinaryVideoPosterUrl(publicId: string): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set");
  }
  const transforms = `f_auto,q_auto,c_limit,w_${GALLERY_VIDEO_WIDTH}`;
  return `https://res.cloudinary.com/${cloudName}/video/upload/${transforms}/${publicId}.jpg`;
}
