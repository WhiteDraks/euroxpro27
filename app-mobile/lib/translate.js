// Automatic translation for chat messages and agenda texts.
// Provider is picked from environment variables, first match wins:
//   DEEPL_API_KEY            -> DeepL (best quality for Polish and Turkish)
//   LIBRETRANSLATE_URL (+ LIBRETRANSLATE_API_KEY) -> self-hosted LibreTranslate
//   otherwise                -> MyMemory free API (no key, daily limit;
//                               set MYMEMORY_EMAIL to raise the limit)
// If the provider fails, the original text is returned and marked untranslated.
"use strict";

const fs = require("fs");
const path = require("path");

const LANGS = ["tr", "en", "pl"];
const MAX_CACHE = 20000;
const CACHE_FILE = path.join(path.resolve(__dirname, "..", process.env.DATA_DIR || "data"), "translations.json");

// Translations are kept on disk so a restart does not spend the provider's
// quota again on the same agenda texts.
const cache = new Map(); // `${to}\u0000${text}` -> translated
try {
  for (const [k, v] of Object.entries(JSON.parse(fs.readFileSync(CACHE_FILE, "utf8")))) cache.set(k, v);
} catch {}
let saveTimer = null;
function persist() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    try {
      fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
      fs.writeFileSync(CACHE_FILE + ".tmp", JSON.stringify(Object.fromEntries(cache)));
      fs.renameSync(CACHE_FILE + ".tmp", CACHE_FILE);
    } catch (e) {
      console.warn("[translate] cache not saved:", e.message);
    }
  }, 2000);
}

function remember(key, value) {
  if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value);
  cache.set(key, value);
  persist();
}

// At most 4 requests to the provider at a time.
let active = 0;
const waiting = [];
async function slot(fn) {
  if (active >= 4) await new Promise((r) => waiting.push(r));
  active++;
  try {
    return await fn();
  } finally {
    active--;
    waiting.shift()?.();
  }
}

async function postJson(url, body, headers = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`translate ${res.status}`);
  return res.json();
}

async function viaDeepL(text, from, to) {
  const key = process.env.DEEPL_API_KEY;
  const host = key.endsWith(":fx") ? "api-free.deepl.com" : "api.deepl.com";
  const target = to === "en" ? "EN-GB" : to.toUpperCase();
  const data = await postJson(
    `https://${host}/v2/translate`,
    { text: [text], target_lang: target },
    { authorization: `DeepL-Auth-Key ${key}` }
  );
  return data.translations[0].text;
}

async function viaLibre(text, from, to) {
  const data = await postJson(`${process.env.LIBRETRANSLATE_URL.replace(/\/$/, "")}/translate`, {
    q: text,
    source: "auto",
    target: to,
    format: "text",
    api_key: process.env.LIBRETRANSLATE_API_KEY || undefined,
  });
  return data.translatedText;
}

async function viaMyMemory(text, from, to) {
  const u = new URL("https://api.mymemory.translated.net/get");
  u.searchParams.set("q", text.slice(0, 500));
  u.searchParams.set("langpair", `${from}|${to}`);
  if (process.env.MYMEMORY_EMAIL) u.searchParams.set("de", process.env.MYMEMORY_EMAIL);
  const res = await fetch(u, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`translate ${res.status}`);
  const data = await res.json();
  if (data.responseStatus !== 200) throw new Error("translate quota");
  return data.responseData.translatedText;
}

// Local testing only: TRANSLATE_MOCK=1 tags text instead of calling a service.
async function viaMock(text, from, to) {
  return `[${to}] ${text}`;
}

function provider() {
  if (process.env.TRANSLATE_MOCK === "1") return viaMock;
  if (process.env.DEEPL_API_KEY) return viaDeepL;
  if (process.env.LIBRETRANSLATE_URL) return viaLibre;
  if (process.env.TRANSLATE_DISABLED === "1") return null;
  return viaMyMemory;
}

// Returns { text, translated }.
async function translate(text, from, to) {
  if (!text || from === to || !LANGS.includes(to)) return { text, translated: false };
  const key = `${to}\u0000${text}`;
  if (cache.has(key)) return { text: cache.get(key), translated: true };
  const fn = provider();
  if (!fn) return { text, translated: false };
  try {
    const out = await slot(() => fn(text, from, to));
    if (!out) throw new Error("empty");
    remember(key, out);
    return { text: out, translated: true };
  } catch (err) {
    console.warn("[translate]", err.message);
    return { text, translated: false };
  }
}

// Cached translation or null, without calling the provider.
function peek(text, from, to) {
  if (!text || from === to) return text;
  return cache.get(`${to}\u0000${text}`) ?? null;
}

function providerName() {
  if (process.env.TRANSLATE_MOCK === "1") return "mock";
  if (process.env.DEEPL_API_KEY) return "DeepL";
  if (process.env.LIBRETRANSLATE_URL) return "LibreTranslate";
  if (process.env.TRANSLATE_DISABLED === "1") return "off";
  return "MyMemory";
}

module.exports = { translate, peek, LANGS, providerName };
