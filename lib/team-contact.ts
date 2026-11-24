// ============================================================
// Team member contact details, entered in /admin and shown on /team.
// The same rules check a save on the server and build the links on
// the page, so a saved value can only ever become a safe link.
// ============================================================

export type TeamContactKey = "email" | "phone" | "linkedin" | "instagram";

export const TEAM_CONTACT_KEYS: TeamContactKey[] = ["email", "phone", "linkedin", "instagram"];

const EMAIL = /^[^\s@<>()"',;:\\]+@[^\s@<>()"',;:\\]+\.[a-z]{2,}$/i;
const PHONE = /^\+?[0-9 ()\-.]{6,24}$/;
const INSTAGRAM_HANDLE = /^@?([A-Za-z0-9._]{1,30})$/;

function httpsUrl(value: string, hosts: string[]): URL | null {
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (url.username || url.password || url.port) return null;
    if (!hosts.some((h) => host === h || host.endsWith(`.${h}`))) return null;
    url.protocol = "https:";
    return url;
  } catch {
    return null;
  }
}

// Returns the link to put on the page, or null when the value is empty or not valid.
export function teamContactHref(key: TeamContactKey, raw: string): string | null {
  const value = raw.trim();
  if (!value || value.length > 200) return null;
  switch (key) {
    case "email":
      return EMAIL.test(value) ? `mailto:${value}` : null;
    case "phone":
      return PHONE.test(value) && value.replace(/\D/g, "").length >= 6 ? `tel:${value.replace(/[^\d+]/g, "")}` : null;
    case "linkedin": {
      const url = httpsUrl(value, ["linkedin.com"]);
      return url && url.pathname.length > 1 ? url.toString() : null;
    }
    case "instagram": {
      const handle = value.match(INSTAGRAM_HANDLE);
      if (handle) return `https://www.instagram.com/${handle[1]}/`;
      const url = httpsUrl(value, ["instagram.com"]);
      return url && url.pathname.length > 1 ? url.toString() : null;
    }
  }
}

// Short text shown beside the icon (screen readers and the admin hint).
export function teamContactLabel(key: TeamContactKey, raw: string): string {
  const value = raw.trim();
  if (key === "instagram") {
    const handle = value.match(INSTAGRAM_HANDLE);
    if (handle) return `@${handle[1]}`;
    const path = value.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").split(/[/?#]/)[0];
    return path ? `@${path}` : value;
  }
  return value;
}

// Server-side check for /admin saves. Returns a Turkish message for the editor, or null.
export function teamContactError(key: TeamContactKey, raw: unknown): string | null {
  if (typeof raw !== "string") return "metin olmalı";
  if (raw.trim() === "") return null;
  if (teamContactHref(key, raw)) return null;
  switch (key) {
    case "email":
      return "geçerli bir e-posta adresi değil";
    case "phone":
      return "geçerli bir telefon numarası değil (yalnızca rakam, boşluk, + ( ) -)";
    case "linkedin":
      return "linkedin.com profil adresi olmalı";
    case "instagram":
      return "Instagram kullanıcı adı veya instagram.com adresi olmalı";
  }
}
