import { content as bundledContent } from "@/lib/content";
import type { PendingUpload } from "./store";

// ============================================================
// Server-side checks for content saved from /admin, so a bad save
// can never break the build or the pages.
// ============================================================

const REMOTE_IMAGE_HOSTS = ["images.unsplash.com"];
const UPLOAD_PATH = /^public\/uploads\/[a-z0-9-]+\.(webp|jpg|png)$/;

export function isAllowedImageSrc(src: string) {
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const url = new URL(src);
    return url.protocol === "https:" && REMOTE_IMAGE_HOSTS.includes(url.hostname);
  } catch {
    return false;
  }
}

// Links the editor can change must stay on this site or use https/mailto,
// so a saved "javascript:" address can never run code for visitors.
const LINK_KEY = /^(link|href|url|mapUrl)$/;

export function isAllowedLink(href: string) {
  if (href === "") return true;
  if ((href.startsWith("/") && !href.startsWith("//")) || href.startsWith("#")) return true;
  try {
    const url = new URL(href);
    return url.protocol === "https:" || url.protocol === "http:" || url.protocol === "mailto:";
  } catch {
    return false;
  }
}

function kind(value: unknown) {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
}

// Compares the saved value against the shape of the content shipped with the
// site: same value types, and every image field must point somewhere next/image
// can load.
function check(value: unknown, template: unknown, at: string, errors: string[], listItem = false) {
  if (template !== undefined && kind(value) !== kind(template)) {
    errors.push(`${at}: expected ${kind(template)}, got ${kind(value)}`);
    return;
  }
  if (Array.isArray(value)) {
    const sample = Array.isArray(template) ? template[0] : undefined;
    value.forEach((item, i) => check(item, sample, `${at}[${i}]`, errors, true));
    return;
  }
  if (value && typeof value === "object") {
    const shape = (template ?? {}) as Record<string, unknown>;
    // List items may leave out optional keys, plain sections may not.
    if (!listItem) {
      for (const key of Object.keys(shape)) {
        if (!(key in value)) errors.push(`${at}.${key}: missing`);
      }
    }
    for (const [key, child] of Object.entries(value)) {
      // Team members may have no photo yet; the site shows a placeholder.
      const optional = child === "" && /^content\.team\.members\[\d+\]$/.test(at);
      if (/image$/i.test(key) && typeof child === "string" && !optional && !isAllowedImageSrc(child)) {
        errors.push(`${at}.${key}: unsupported image address "${child.slice(0, 80)}"`);
      }
      if (LINK_KEY.test(key) && typeof child === "string" && !isAllowedLink(child)) {
        errors.push(`${at}.${key}: unsupported link "${child.slice(0, 80)}"`);
      }
      check(child, shape[key], `${at}.${key}`, errors);
    }
    return;
  }
  if (typeof value === "string" && value.length > 20000) {
    errors.push(`${at}: text is too long`);
  }
}

export function validateContent(value: unknown): string[] {
  const errors: string[] = [];
  if (kind(value) !== "object") return ["content must be an object"];
  check(value, bundledContent, "content", errors);
  return errors.slice(0, 20);
}

export function validateUploads(value: unknown): PendingUpload[] | null {
  if (!Array.isArray(value) || value.length > 50) return null;
  const uploads: PendingUpload[] = [];
  for (const item of value) {
    if (
      !item ||
      typeof item.path !== "string" ||
      typeof item.sha !== "string" ||
      !UPLOAD_PATH.test(item.path) ||
      !/^[0-9a-f]{40}$/.test(item.sha)
    ) {
      return null;
    }
    uploads.push({ path: item.path, sha: item.sha });
  }
  return uploads;
}
