// ============================================================
// Automatic translation for chat messages and agenda texts.
// Provider is picked from environment variables, first match wins:
//   DEEPL_API_KEY       -> DeepL (best for Polish and Turkish; free plan 500k chars/month)
//   LIBRETRANSLATE_URL  -> self-hosted LibreTranslate (+ LIBRETRANSLATE_API_KEY)
//   otherwise           -> MyMemory free API (no key, daily limit; MYMEMORY_EMAIL raises it)
// Results are cached in storage, so the same text is only paid for once.
// If the provider fails, the original text is shown.
// ============================================================
import { createHash } from "crypto";
import { cmd, pipe } from "./kv";

export const LANGS = ["tr", "en", "pl"] as const;
export type Lang = (typeof LANGS)[number];
export const isLang = (v: unknown): v is Lang => LANGS.includes(v as Lang);

const TTL = 60 * 60 * 24 * 120; // 120 days
const key = (text: string, to: string) => `dt:${to}:${createHash("sha1").update(text).digest("base64url")}`;

async function postJson(url: string, body: unknown, headers: Record<string, string> = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`translate ${res.status}`);
  return res.json();
}

type Provider = (text: string, from: string, to: string) => Promise<string>;

const deepl: Provider = async (text, _from, to) => {
  const k = process.env.DEEPL_API_KEY!;
  const host = k.endsWith(":fx") ? "api-free.deepl.com" : "api.deepl.com";
  const data = await postJson(
    `https://${host}/v2/translate`,
    { text: [text], target_lang: to === "en" ? "EN-GB" : to.toUpperCase() },
    { authorization: `DeepL-Auth-Key ${k}` }
  );
  return data.translations[0].text;
};

const libre: Provider = async (text, _from, to) => {
  const data = await postJson(`${process.env.LIBRETRANSLATE_URL!.replace(/\/$/, "")}/translate`, {
    q: text,
    source: "auto",
    target: to,
    format: "text",
    api_key: process.env.LIBRETRANSLATE_API_KEY || undefined,
  });
  return data.translatedText;
};

const mymemory: Provider = async (text, from, to) => {
  const u = new URL("https://api.mymemory.translated.net/get");
  u.searchParams.set("q", text.slice(0, 500));
  u.searchParams.set("langpair", `${from}|${to}`);
  if (process.env.MYMEMORY_EMAIL) u.searchParams.set("de", process.env.MYMEMORY_EMAIL);
  const res = await fetch(u, { signal: AbortSignal.timeout(8000), cache: "no-store" });
  if (!res.ok) throw new Error(`translate ${res.status}`);
  const data = await res.json();
  if (data.responseStatus !== 200) throw new Error("translate quota");
  return data.responseData.translatedText;
};

// Local testing only: tags text instead of calling a service.
const mock: Provider = async (text, _from, to) => `[${to}] ${text}`;

function provider(): Provider | null {
  if (process.env.TRANSLATE_MOCK === "1") return mock;
  if (process.env.DEEPL_API_KEY) return deepl;
  if (process.env.LIBRETRANSLATE_URL) return libre;
  if (process.env.TRANSLATE_DISABLED === "1") return null;
  return mymemory;
}

// At most 4 provider requests at a time per server instance.
let active = 0;
const waiting: (() => void)[] = [];
async function slot<T>(fn: () => Promise<T>): Promise<T> {
  if (active >= 4) await new Promise<void>((r) => waiting.push(r));
  active++;
  try {
    return await fn();
  } finally {
    active--;
    waiting.shift()?.();
  }
}

// Cached translations for many texts at once (null where missing).
export async function peekMany(items: { text: string; from: string }[], to: string): Promise<(string | null)[]> {
  const todo = items.map((it, i) => ({ ...it, i })).filter((it) => it.text && it.from !== to);
  const out: (string | null)[] = items.map((it) => (it.text && it.from !== to ? null : it.text));
  if (!todo.length) return out;
  const res = (await cmd("MGET", ...todo.map((it) => key(it.text, to)))) as (string | null)[];
  todo.forEach((it, j) => (out[it.i] = res[j]));
  return out;
}

export async function translate(text: string, from: string, to: string): Promise<{ text: string; translated: boolean }> {
  if (!text || from === to || !isLang(to)) return { text, translated: false };
  const k = key(text, to);
  const hit = (await cmd("GET", k)) as string | null;
  if (hit) return { text: hit, translated: true };
  const fn = provider();
  if (!fn) return { text, translated: false };
  try {
    const out = await slot(() => fn(text, from, to));
    if (!out) throw new Error("empty");
    await pipe(["SET", k, out, "EX", TTL]);
    return { text: out, translated: true };
  } catch (err) {
    console.warn("[translate]", (err as Error).message);
    return { text, translated: false };
  }
}

export function providerName() {
  if (process.env.TRANSLATE_MOCK === "1") return "mock";
  if (process.env.DEEPL_API_KEY) return "DeepL";
  if (process.env.LIBRETRANSLATE_URL) return "LibreTranslate";
  if (process.env.TRANSLATE_DISABLED === "1") return "off";
  return "MyMemory";
}
