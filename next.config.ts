import type { NextConfig } from "next";

// Sent with every response: blocks framing (clickjacking), MIME sniffing,
// and plain-HTTP access, and limits what the browser shares with other sites.
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'" },
];

// The delegate app (/app, files in public/app) is a single-page app: every
// /app/... address that is not a file loads its index.html. It may ask for
// the visitor's location (map) and only loads code from this site.
const delegateAppHeaders = [
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), payment=(), usb=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "img-src 'self' data: https://*.basemaps.cartocdn.com",
      "style-src 'self'",
      "script-src 'self'",
      "connect-src 'self'",
      "manifest-src 'self'",
      "worker-src 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async rewrites() {
    // Default (after-files) rewrites: real files in public/app are served first.
    return [
      { source: "/app", destination: "/app/index.html" },
      { source: "/app/:path*", destination: "/app/index.html" },
    ];
  },
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
      { source: "/app", headers: delegateAppHeaders },
      { source: "/app/:path*", headers: delegateAppHeaders },
      {
        // The app shell and its worker must be revalidated on every load.
        source: "/app/:file(index.html|sw.js|app.js|app.css|i18n.js|places.js|theme-init.js|manifest.webmanifest)",
        headers: [{ key: "Cache-Control", value: "no-cache" }],
      },
      {
        source: "/api/app/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store" }],
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
