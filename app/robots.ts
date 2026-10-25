import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

// Served at /robots.txt. The editor and API stay out of search results.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
