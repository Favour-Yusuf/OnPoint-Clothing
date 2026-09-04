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
  // Baseline hardening. Deliberately no Content-Security-Policy here: this
  // site loads Paystack's inline checkout script (js.paystack.co) plus its
  // own iframe/connect endpoints for payment, and a wrong CSP risks silently
  // breaking checkout — that needs its own careful pass with live payment
  // testing, not a blanket header added alongside everything else here.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
