import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cloudinary is the production image source. Product/editorial imagery
    // is referenced by { url, alt } pairs in the data layer (see lib/data)
    // and rendered through components/ui/media-image.tsx — once real
    // Cloudinary URLs replace the placeholder markers there, no component
    // code needs to change.
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
