import type { NextConfig } from "next";

// Content Security Policy: the site only loads code, styles, fonts and
// data from itself, and photos from itself or Unsplash. If a bad link or
// text ever slipped through, the browser would still refuse to load or
// send anything to another site. Next.js needs inline scripts and styles
// for its own page data, so those stay allowed.
const isDev = process.env.NODE_ENV === "development";
// Vercel's comment toolbar runs on preview deployments only.
const isPreview = process.env.VERCEL_ENV === "preview";
const vercelLive = isPreview ? " https://vercel.live https://*.vercel.live" : "";
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${vercelLive}`,
  `style-src 'self' 'unsafe-inline'${vercelLive}`,
  `img-src 'self' data: blob: https://images.unsplash.com${isPreview ? " https://vercel.live https://vercel.com https://*.pusher.com" : ""}`,
  `font-src 'self' data:${vercelLive}`,
  `connect-src 'self'${isDev ? " ws:" : ""}${isPreview ? " https://vercel.live https://*.pusher.com wss://*.pusher.com" : ""}`,
  `frame-src ${isPreview ? "https://vercel.live" : "'none'"}`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "media-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

// Sent with every response: blocks framing (clickjacking), MIME sniffing,
// and plain-HTTP access, and limits what the browser shares with other sites.
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
  async redirects() {
    // Old address from an earlier draft; keep it working for shared links.
    return [{ source: "/explore-istanbul", destination: "/explore-antalya", permanent: true }];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
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
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
      {
        source: "/api/admin/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store" }],
      },
    ];
  },
};

export default nextConfig;
