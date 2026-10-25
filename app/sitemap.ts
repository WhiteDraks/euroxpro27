import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

// Served at /sitemap.xml so search engines find every public page.
const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/congress", priority: 0.9, changeFrequency: "weekly" },
  { path: "/delegate-guide", priority: 0.8, changeFrequency: "monthly" },
  { path: "/explore-antalya", priority: 0.8, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
  { path: "/announcements", priority: 0.7, changeFrequency: "weekly" },
  { path: "/team", priority: 0.6, changeFrequency: "monthly" },
  { path: "/merch", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return pages.map(({ path, priority, changeFrequency }) => ({
    url: `${siteConfig.siteUrl}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
