import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve the smallest format each browser supports (AVIF, then WebP).
    formats: ["image/avif", "image/webp"],
    // 60 is used for photos, 75 (the default) for the logo.
    qualities: [60, 75],
    // Photos never change behind the same address (uploads get unique
    // names), so optimized copies can be cached for a long time.
    minimumCacheTTL: 2678400, // 31 days
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        // Editor uploads get a unique file name, so they never change.
        source: "/uploads/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
      {
        // Always check for a new service worker so offline copies never get stuck.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        ],
      },
      {
        source: "/admin",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
