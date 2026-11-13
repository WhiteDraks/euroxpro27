// ============================================================
// Automatic translation for chat messages and agenda texts.
// Provider is picked from environment variables, first match wins:
//   DEEPL_API_KEY             -> DeepL (best for Polish and Turkish; free plan 500k chars/month)
//   GOOGLE_TRANSLATE_API_KEY  -> Google Cloud Translation (official, 500k chars/month free)
//   LIBRETRANSLATE_URL        -> self-hosted LibreTranslate (+ LIBRETRANSLATE_API_KEY)
//   otherwise                 -> Google Translate's free web endpoint, with MyMemory as backup
// The source language is detected from the text itself, so a delegate who
// writes in another language than their app language is still translated right.
// Results are cached in storage, so the same text is only paid for once.
// If the provider fails, the original text is shown.
// ============================================================
import { createHash } from "crypto";
import { cmd, pipe } from "./kv.js";
export const LANGS = ["tr", "en", "pl"];
export const isLang = (v) => LANGS.includes(v);
const TTL = 60 * 60 * 24 * 120; // 120 days
// "dt2": cache from the better providers; old MyMemory results ("dt:") are ignored.
const key = (text, to) => `dt2:${to}:${createHash("sha1").update(text).digest("base64url")}`;
async function postJson(url, body, headers = {}) {
    const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json", ...headers },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(8000),
        cache: "no-store",
    });
    if (!res.ok)
        throw new Error(`translate ${res.status}`);
    return res.json();
}
const deepl = async (text, _from, to) => {
    const k = process.env.DEEPL_API_KEY;
    const host = k.endsWith(":fx") ? "api-free.deepl.com" : "api.deepl.com";
    const data = await postJson(`https://${host}/v2/translate`, { text: [text], target_lang: to === "en" ? "EN-GB" : to.toUpperCase() }, { authorization: `DeepL-Auth-Key ${k}` });
    const t = data.translations[0];
    return { text: t.text, detected: String(t.detected_source_language || "").toLowerCase() };
};
const googleCloud = async (text, _from, to) => {
    const data = await postJson(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(process.env.GOOGLE_TRANSLATE_API_KEY)}`, { q: text, target: to, format: "text" });
    const t = data.data.translations[0];
    return { text: t.translatedText, detected: t.detectedSourceLanguage };
};
// The endpoint Google's own web widgets use. No key; good quality for TR/PL/EN.
const googleFree = async (text, _from, to) => {
    const u = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${to}&dt=t`;
    const res = await fetch(u, {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: new URLSearchParams({ q: text }),
        signal: AbortSignal.timeout(8000),
        cache: "no-store",
    });
    if (!res.ok)
        throw new Error(`translate ${res.status}`);
    const data = await res.json();
    const out = (data[0] || []).map((part) => part[0] || "").join("");
    if (!out)
        throw new Error("translate empty");
    return { text: out, detected: typeof data[2] === "string" ? data[2] : "" };
};
const libre = async (text, _from, to) => {
    const data = await postJson(`${process.env.LIBRETRANSLATE_URL.replace(/\/$/, "")}/translate`, {
        q: text,
        source: "auto",
        target: to,
        format: "text",
        api_key: process.env.LIBRETRANSLATE_API_KEY || undefined,
    });
    return { text: data.translatedText, detected: data.detectedLanguage?.language || "" };
};
const mymemory = async (text, from, to) => {
    const u = new URL("https://api.mymemory.translated.net/get");
    u.searchParams.set("q", text.slice(0, 500));
    u.searchParams.set("langpair", `${from}|${to}`);
    if (process.env.MYMEMORY_EMAIL)
        u.searchParams.set("de", process.env.MYMEMORY_EMAIL);
    const res = await fetch(u, { signal: AbortSignal.timeout(8000), cache: "no-store" });
    if (!res.ok)
        throw new Error(`translate ${res.status}`);
    const data = await res.json();
    if (data.responseStatus !== 200)
        throw new Error("translate quota");
    return { text: data.responseData.translatedText, detected: "" };
};
const googleThenMyMemory = async (text, from, to) => {
    try {
        return await googleFree(text, from, to);
    }
    catch (err) {
        console.warn("[translate] google free failed, using MyMemory:", err.message);
        return mymemory(text, from, to);
    }
};
// Local testing only: tags text instead of calling a service.
const mock = async (text, _from, to) => ({ text: `[${to}] ${text}`, detected: "" });
function provider() {
    if (process.env.TRANSLATE_MOCK === "1")
        return mock;
    if (process.env.DEEPL_API_KEY)
        return deepl;
    if (process.env.GOOGLE_TRANSLATE_API_KEY)
        return googleCloud;
    if (process.env.LIBRETRANSLATE_URL)
        return libre;
    if (process.env.TRANSLATE_DISABLED === "1")
        return null;
    return googleThenMyMemory;
}
// At most 4 provider requests at a time per server instance.
let active = 0;
const waiting = [];
async function slot(fn) {
    if (active >= 4)
        await new Promise((r) => waiting.push(r));
    active++;
    try {
        return await fn();
    }
    finally {
        active--;
        waiting.shift()?.();
    }
}
// Cached translations for many texts at once (null where missing).
export async function peekMany(items, to) {
    const todo = items.map((it, i) => ({ ...it, i })).filter((it) => it.text && it.from !== to);
    const out = items.map((it) => (it.text && it.from !== to ? null : it.text));
    if (!todo.length)
        return out;
    const res = (await cmd("MGET", ...todo.map((it) => key(it.text, to))));
    todo.forEach((it, j) => (out[it.i] = res[j]));
    return out;
}
export async function translate(text, from, to) {
    if (!text || from === to || !isLang(to))
        return { text, translated: false };
    const k = key(text, to);
    const hit = (await cmd("GET", k));
    if (hit)
        return { text: hit, translated: true };
    const fn = provider();
    if (!fn)
        return { text, translated: false };
    try {
        const r = await slot(() => fn(text, from, to));
        // Already in the reader's language (detected from the text): keep it as written.
        const out = r.detected && r.detected.slice(0, 2) === to ? text : r.text;
        if (!out)
            throw new Error("empty");
        await pipe(["SET", k, out, "EX", TTL]);
        return { text: out, translated: out !== text };
    }
    catch (err) {
        console.warn("[translate]", err.message);
        return { text, translated: false };
    }
}
export function providerName() {
    if (process.env.TRANSLATE_MOCK === "1")
        return "mock";
    if (process.env.DEEPL_API_KEY)
        return "DeepL";
    if (process.env.GOOGLE_TRANSLATE_API_KEY)
        return "Google Cloud";
    if (process.env.LIBRETRANSLATE_URL)
        return "LibreTranslate";
    if (process.env.TRANSLATE_DISABLED === "1")
        return "off";
    return "Google";
}
