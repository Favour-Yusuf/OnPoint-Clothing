import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cloudinary is the production image source. Product/editorial imagery
    // is referenced by { publicId, alt } pairs in the data layer (see
    // lib/data) and rendered through components/ui/media-image.tsx, which
    // resolves publicId -> an optimized delivery URL via the custom loader
    // in lib/cloudinary/loader.ts (bypassing this remotePatterns-gated
    // built-in optimizer). Kept here as a safety net for any future direct
    // next/image usage against a raw res.cloudinary.com URL.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
