"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown, ArrowUp, ExternalLink, ImageUp, LogOut, Plus, Save, Trash2,
} from "lucide-react";
import type { SiteContent } from "@/lib/content";
import { cn } from "@/lib/utils";

// ============================================================
// /admin content editor. Renders a form for every text and photo in
// content/site.json, so new fields show up here automatically.
// ============================================================

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
type Path = (string | number)[];
type PendingUpload = { path: string; sha: string };
type StorageMode = "github" | "filesystem" | "unconfigured";

const TABS: { key: keyof SiteContent; label: string; href: string }[] = [
  { key: "home", label: "Ana Sayfa", href: "/" },
  { key: "congress", label: "The Congress", href: "/congress" },
  { key: "exploreAntalya", label: "Explore Antalya", href: "/explore-antalya" },
  { key: "gallery", label: "Galeri (Ana Sayfa)", href: "/" },
  { key: "previousEditions", label: "Önceki Edisyonlar", href: "/congress" },
  { key: "partners", label: "Partnerler", href: "/" },
  { key: "team", label: "Ekip", href: "/team" },
  { key: "faq", label: "SSS ve Ulaşım", href: "/faq" },
];

// Tabs whose top-level keys are page sections (shown as collapsible cards).
const SECTIONED_TABS = new Set<keyof SiteContent>(["home", "congress", "exploreAntalya"]);

const SECTION_LABELS: Record<string, string> = {
  hero: "Giriş bölümü (büyük fotoğraf ve başlık)",
  bulletin: "Duyuru şeridi",
  dimensions: "Üç boyut kartları",
  pillars: "Dört sütun",
  destination: "Antalya tanıtım kartları",
  delegatePrep: "Delege hazırlık bandı",
  merch: "Merch önizleme",
  closing: "Kapanış ve iletişim",
  about: "Kongre hakkında ve hedefler",
  schedule: "Program (gün gün)",
  evenings: "Akşam etkinlikleri",
  tabs: "Sekme adları",
  attractions: "Gezilecek yerler",
  food: "Yemek ve kültür",
  phrases: "Türkçe ifadeler",
  map: "Harita ve konumlar",
  weather: "İklim",
  countdown: "Geri sayım sayacı",
};

const FIELD_LABELS: Record<string, string> = {
  hero: "Sayfa başı",
  image: "Fotoğraf",
  imageAlt: "Fotoğraf açıklaması (alt metin)",
  eyebrow: "Üst etiket",
  kicker: "Küçük üst başlık",
  title: "Başlık",
  titleLine1: "Başlık – 1. satır",
  titleLine2: "Başlık – 2. satır (italik)",
  supportingLine: "Destek cümlesi",
  themeNote: "Tema notu",
  intro: "Giriş metni",
  description: "Açıklama",
  desc: "Açıklama",
  text: "Metin",
  items: "Öğeler",
  label: "Etiket",
  focus: "Alt not",
  cardFooter: "Kart alt yazısı",
  buttonText: "Buton yazısı",
  primaryButton: "Birinci buton",
  secondaryButton: "İkinci buton",
  tertiaryButton: "Üçüncü buton",
  linkText: "Bağlantı yazısı",
  itemLinkText: "Ürün bağlantı yazısı",
  badge: "Rozet yazısı",
  notice: "Bilgi notu",
  paragraphs: "Paragraflar",
  objectivesTitle: "Hedefler başlığı",
  objectives: "Hedefler",
  datesLabel: "Tarih etiketi",
  cityLabel: "Şehir etiketi",
  venueLabel: "Mekân etiketi",
  showDraftNotice: "Taslak program uyarısını göster",
  draftNotice: "Taslak program uyarısı",
  days: "Günler",
  day: "Gün numarası",
  date: "Tarih",
  sessions: "Oturumlar",
  time: "Saat",
  endTime: "Bitiş saati",
  type: "Tür",
  location: "Yer",
  speaker: "Konuşmacı",
  dressCode: "Kıyafet kuralı",
  dressCodeLabel: "Kıyafet kuralı etiketi",
  dress: "Kıyafet kuralı",
  tag: "Etiket",
  name: "Ad",
  category: "Kategori",
  period: "Dönem",
  tips: "Öneri",
  tipLabel: "Öneri etiketi",
  area: "Bölge",
  etiquetteTitle: "Görgü kuralları başlığı",
  etiquette: "Görgü kuralları",
  pronunciationLabel: "Okunuş etiketi",
  tr: "Türkçe",
  en: "İngilizce",
  pronunciation: "Okunuş",
  locations: "Konumlar",
  address: "Adres",
  mapUrl: "Google Maps bağlantısı",
  placeholder: "Adres henüz kesin değil",
  routingTitle: "Rota kutusu başlığı",
  routingText: "Rota kutusu metni",
  overviewTitle: "Harita kutusu başlığı",
  overviewText: "Harita kutusu metni",
  season: "Dönem",
  temp: "Sıcaklık",
  notes: "Notlar",
  filterAll: "Filtre: tümü",
  filterConferences: "Filtre: konferanslar",
  filterAntalya: "Filtre: Antalya",
  showMoreButton: "“Daha fazla” butonu",
  yearOrArea: "Yıl / bölge rozeti",
  caption: "Alt yazı",
  isHistorical: "Geçmiş konferans fotoğrafı",
  disclaimerTitle: "Uyarı başlığı",
  disclaimer: "Uyarı metni",
  year: "Yıl",
  country: "Ülke",
  delegatesMetric: "Delege sayısı yazısı",
  delegatesCount: "Delege sayısı",
  countriesCount: "Ülke sayısı",
  partnersCount: "Partner sayısı",
  theme: "Tema",
  summary: "Özet",
  highlights: "Öne çıkanlar",
  statusBadge: "Durum rozeti",
  statusTitle: "Durum başlığı",
  statusText: "Durum metni",
  daysLabel: "Gün etiketi",
  hoursLabel: "Saat etiketi",
  minutesLabel: "Dakika etiketi",
  secondsLabel: "Saniye etiketi",
  liveText: "Kongre sırasında gösterilen yazı",
  endedText: "Kongre bittikten sonra gösterilen yazı",
  comingSoonLabel: "İsim boşken gösterilen yazı",
  members: "Ekip üyeleri",
  role: "Görev",
  department: "Birim",
  bio: "Kısa tanıtım",
  contactTitle: "İletişim kutusu başlığı",
  contactText: "İletişim kutusu metni",
  contactButton: "İletişim butonu",
  travel: "Ulaşım bilgileri (havalimanı, otel, vize)",
  link: "Bağlantı adresi",
  categories: "Soru kategorileri",
  question: "Soru",
  answer: "Cevap",
  searchPlaceholder: "Arama kutusu yazısı",
  allLabel: "Filtre: tümü",
  emptyTitle: "Sonuç yok başlığı",
  emptyText: "Sonuç yok metni",
  ctaTitle: "Alt kutu başlığı",
  ctaText: "Alt kutu metni",
  ctaButton: "Alt kutu butonu",
};

const ENUM_OPTIONS: Record<string, string[]> = {
  "congress.schedule.days[].sessions[].type": ["plenary", "workshop", "networking", "social", "break", "logistics"],
  "gallery.items[].category": ["conferences", "antalya"],
  "exploreAntalya.map.locations[].category": ["accommodation", "venue", "transport", "attraction"],
};

const LONG_TEXT_KEYS = new Set([
  "intro", "description", "desc", "text", "notice", "draftNotice", "summary", "caption",
  "disclaimer", "statusText", "tips", "notes", "routingText", "supportingLine",
  "bio", "answer", "contactText", "ctaText", "emptyText",
]);

const SUMMARY_KEYS = ["title", "name", "role", "question", "label", "season", "tr", "date", "time"];
const HIDDEN_KEYS = new Set(["id"]);
// Lists whose photo may stay empty (a placeholder is shown on the site).
const OPTIONAL_IMAGE_LISTS = new Set(["team.members"]);
const MAX_IMAGE_SIDE = 2000;

function isImageKey(key: string | number | undefined) {
  return typeof key === "string" && /image$/i.test(key);
}

function labelFor(key: string | number) {
  if (typeof key === "number") return `${key + 1}.`;
  if (FIELD_LABELS[key]) return FIELD_LABELS[key];
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

function schemaPath(path: Path) {
  return path.map((p) => (typeof p === "number" ? "[]" : p)).join(".").replace(/\.\[\]/g, "[]");
}

function setIn(target: Json, path: Path, value: Json): Json {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  if (Array.isArray(target)) {
    const copy = [...target];
    copy[head as number] = setIn(copy[head as number], rest, value);
    return copy;
  }
  const obj = target as Record<string, Json>;
  return { ...obj, [head]: setIn(obj[head as string], rest, value) };
}

// Builds an empty list item with every field the existing items use.
function blankItem(siblings: Json[], emptyImages = false): Json {
  const sample = siblings[0];
  if (typeof sample === "string" || sample === undefined) return "";
  if (typeof sample === "number") return 0;
  if (typeof sample === "boolean") return sample;
  if (Array.isArray(sample)) return [];
  if (sample === null) return null;
  const item: Record<string, Json> = {};
  for (const sibling of siblings) {
    if (!sibling || typeof sibling !== "object" || Array.isArray(sibling)) continue;
    for (const [key, value] of Object.entries(sibling)) {
      if (key in item) continue;
      if (key === "id") item[key] = `item-${Date.now().toString(36)}`;
      else if (isImageKey(key)) item[key] = emptyImages ? "" : value; // otherwise keep a valid photo until a new one is uploaded
      else if (typeof value === "string") item[key] = "";
      else if (typeof value === "number") item[key] = 0;
      else if (typeof value === "boolean") item[key] = value;
      else if (Array.isArray(value)) item[key] = [];
      else item[key] = value;
    }
  }
  return item;
}

async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const encode = (type: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.82));
  const webp = await encode("image/webp");
  if (webp && webp.type === "image/webp") return webp;
  const jpeg = await encode("image/jpeg");
  if (!jpeg) throw new Error("encode failed");
  return jpeg;
}

type EditorContext = {
  update: (path: Path, value: Json) => void;
  previews: Record<string, string>;
  onUploaded: (src: string, preview: string, pending: PendingUpload | null) => void;
  uploadsEnabled: boolean;
};

export function ContentEditor({ initialContent, mode }: { initialContent: SiteContent; mode: StorageMode }) {
  const router = useRouter();
  const [data, setData] = useState<Json>(initialContent as unknown as Json);
  const [savedData, setSavedData] = useState<Json>(initialContent as unknown as Json);
  const [tab, setTab] = useState<keyof SiteContent>("home");
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ kind: "ok" | "error" | "info"; text: string; details?: string[]; link?: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const dirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(savedData), [data, savedData]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const ctx: EditorContext = {
    update: (path, value) => setData((current) => setIn(current, path, value)),
    previews,
    onUploaded: (src, preview, upload) => {
      setPreviews((p) => ({ ...p, [src]: preview }));
      if (upload) setPending((p) => [...p, upload]);
    },
    uploadsEnabled: mode !== "unconfigured",
  };

  async function save() {
    setSaving(true);
    setStatus({ kind: "info", text: "Kaydediliyor…" });
    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: data, uploads: pending }),
    }).catch(() => null);
    setSaving(false);
    const result = await response?.json().catch(() => null);
    if (!response || !response.ok) {
      setStatus({
        kind: "error",
        text: result?.error ?? "Kaydedilemedi. İnternet bağlantınızı kontrol edip tekrar deneyin.",
        details: result?.details,
      });
      return;
    }
    setSavedData(data);
    setPending([]);
    setStatus(
      result.mode === "github"
        ? {
            kind: "ok",
            text: "Kaydedildi. Site yeniden yayınlanıyor; değişiklikler 1–3 dakika içinde canlıda görünür.",
            link: result.commitUrl ?? undefined,
          }
        : { kind: "ok", text: "Kaydedildi." }
    );
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  const activeTab = TABS.find((t) => t.key === tab)!;
  const tabData = (data as Record<string, Json>)[tab];

  return (
    <div className="pt-16 lg:pt-20 bg-[#F7F3ED] min-h-screen">
      {/* Toolbar */}
      <div className="sticky top-16 lg:top-20 z-30 bg-white/95 backdrop-blur border-b border-[#E5E1DA]">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <h1 className="font-serif-title text-lg text-[#101B35] mr-auto">İçerik Editörü</h1>
          {dirty && <span className="text-xs text-amber-700 font-mono">Kaydedilmemiş değişiklikler var</span>}
          <button
            type="button"
            onClick={save}
            disabled={!dirty || saving || mode === "unconfigured"}
            className="inline-flex items-center gap-2 bg-[#741F3D] text-white text-sm font-semibold px-4 py-2 rounded-sm disabled:opacity-40"
          >
            <Save size={15} /> {saving ? "Kaydediliyor…" : "Kaydet"}
          </button>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 text-xs text-[#5A6478] hover:text-[#101B35] px-2 py-2"
          >
            <LogOut size={14} /> Çıkış
          </button>
        </div>
        <div className="max-w-5xl mx-auto px-4 pb-2 flex gap-1.5 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "whitespace-nowrap px-3 py-1.5 text-xs font-mono rounded-sm border",
                tab === t.key
                  ? "bg-[#101B35] text-white border-[#101B35]"
                  : "bg-white text-[#5A6478] border-[#E5E1DA] hover:text-[#101B35]"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        {mode === "unconfigured" && (
          <Notice kind="error" text="Kaydetme kapalı: sunucuda GITHUB_TOKEN ayarlanmamış. Kurulum adımları README dosyasında." />
        )}
        {status && <Notice {...status} />}

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#5A6478]">
          <p>
            Metinlerde <strong>**kalın**</strong> ve <em>*italik*</em> yazabilirsiniz. Yüklenen fotoğraflar
            otomatik küçültülür ve sıkıştırılır.
          </p>
          <a
            href={activeTab.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#741F3D] font-semibold hover:underline"
          >
            Sayfayı aç <ExternalLink size={12} />
          </a>
        </div>

        {SECTIONED_TABS.has(tab) ? (
          Object.entries(tabData as Record<string, Json>).map(([section, value]) => (
            <details key={section} className="bg-white border border-[#E5E1DA] rounded-sm shadow-sm group" open={section === "hero"}>
              <summary className="cursor-pointer select-none px-5 py-4 font-serif-title text-base text-[#101B35] flex items-center justify-between">
                {SECTION_LABELS[section] ?? labelFor(section)}
                <span className="text-xs font-mono text-[#8F9AA0] group-open:hidden">düzenle</span>
              </summary>
              <div className="px-5 pb-5 border-t border-[#E5E1DA] pt-4">
                <FieldGroup value={value} path={[tab, section]} ctx={ctx} />
              </div>
            </details>
          ))
        ) : (
          <div className="bg-white border border-[#E5E1DA] rounded-sm shadow-sm p-5">
            <FieldGroup value={tabData} path={[tab]} ctx={ctx} />
          </div>
        )}
      </div>
    </div>
  );
}

function Notice({ kind, text, details, link }: { kind: "ok" | "error" | "info"; text: string; details?: string[]; link?: string }) {
  return (
    <div
      className={cn(
        "rounded-sm border px-4 py-3 text-sm",
        kind === "ok" && "bg-green-50 border-green-200 text-green-900",
        kind === "error" && "bg-red-50 border-red-200 text-red-900",
        kind === "info" && "bg-white border-[#E5E1DA] text-[#374151]"
      )}
    >
      <p>{text}</p>
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-xs underline">
          Değişikliği GitHub&apos;da gör
        </a>
      )}
      {details && details.length > 0 && (
        <ul className="mt-2 list-disc pl-5 text-xs font-mono space-y-0.5">
          {details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FieldGroup({ value, path, ctx }: { value: Json; path: Path; ctx: EditorContext }) {
  if (Array.isArray(value)) return <ListField items={value} path={path} ctx={ctx} />;
  if (value && typeof value === "object") {
    return (
      <div className="space-y-4">
        {Object.entries(value)
          .filter(([key]) => !HIDDEN_KEYS.has(key))
          .map(([key, child]) => (
            <Field key={key} name={key} value={child} path={[...path, key]} ctx={ctx} />
          ))}
      </div>
    );
  }
  return <Field name={path[path.length - 1]} value={value} path={path} ctx={ctx} />;
}

function Field({ name, value, path, ctx }: { name: string | number; value: Json; path: Path; ctx: EditorContext }) {
  const label = labelFor(name);

  if (Array.isArray(value) || (value && typeof value === "object")) {
    return (
      <fieldset className="border border-[#E5E1DA] rounded-sm p-4">
        <legend className="px-1.5 text-xs font-mono uppercase tracking-wider text-[#741F3D]">{label}</legend>
        <FieldGroup value={value} path={path} ctx={ctx} />
      </fieldset>
    );
  }

  if (typeof value === "boolean") {
    return (
      <label className="flex items-center gap-2 text-sm text-[#374151]">
        <input type="checkbox" checked={value} onChange={(e) => ctx.update(path, e.target.checked)} />
        {label}
      </label>
    );
  }

  if (typeof value === "number") {
    return (
      <label className="block">
        <span className="block text-xs font-semibold text-[#101B35] mb-1">{label}</span>
        <input
          type="number"
          value={value}
          onChange={(e) => ctx.update(path, e.target.value === "" ? 0 : Number(e.target.value))}
          className="w-40 border border-[#E5E1DA] rounded-sm px-3 py-2 text-sm focus:border-[#741F3D] outline-none"
        />
      </label>
    );
  }

  if (isImageKey(name)) {
    return <ImageField label={label} value={value ?? ""} path={path} ctx={ctx} />;
  }

  const text = value ?? "";
  const options = ENUM_OPTIONS[schemaPath(path)];
  if (options) {
    return (
      <label className="block">
        <span className="block text-xs font-semibold text-[#101B35] mb-1">{label}</span>
        <select
          value={text}
          onChange={(e) => ctx.update(path, e.target.value)}
          className="border border-[#E5E1DA] rounded-sm px-3 py-2 text-sm bg-white focus:border-[#741F3D] outline-none"
        >
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </label>
    );
  }

  const long = text.length > 70 || (typeof name === "string" && LONG_TEXT_KEYS.has(name)) || typeof name === "number";
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-[#101B35] mb-1">{label}</span>
      {long ? (
        <textarea
          value={text}
          rows={Math.min(10, Math.max(2, Math.ceil(text.length / 90) + 1))}
          onChange={(e) => ctx.update(path, e.target.value)}
          className="w-full border border-[#E5E1DA] rounded-sm px-3 py-2 text-sm leading-relaxed focus:border-[#741F3D] outline-none"
        />
      ) : (
        <input
          type="text"
          value={text}
          onChange={(e) => ctx.update(path, e.target.value)}
          className="w-full border border-[#E5E1DA] rounded-sm px-3 py-2 text-sm focus:border-[#741F3D] outline-none"
        />
      )}
    </label>
  );
}

function ListField({ items, path, ctx }: { items: Json[]; path: Path; ctx: EditorContext }) {
  const move = (from: number, to: number) => {
    const copy = [...items];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    ctx.update(path, copy);
  };
  const remove = (index: number) => {
    if (!window.confirm("Bu öğe silinsin mi?")) return;
    ctx.update(path, items.filter((_, i) => i !== index));
  };
  const add = () => ctx.update(path, [...items, blankItem(items, OPTIONAL_IMAGE_LISTS.has(schemaPath(path)))]);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isObject = item !== null && typeof item === "object" && !Array.isArray(item);
        const summaryKey = isObject ? SUMMARY_KEYS.find((k) => {
          const v = (item as Record<string, Json>)[k];
          return typeof v === "string" && v.trim() !== "";
        }) : undefined;
        const summary = summaryKey ? String((item as Record<string, Json>)[summaryKey]) : "";
        const controls = (
          <div className="flex items-center gap-1 flex-shrink-0">
            <IconButton title="Yukarı taşı" disabled={index === 0} onClick={() => move(index, index - 1)}>
              <ArrowUp size={13} />
            </IconButton>
            <IconButton title="Aşağı taşı" disabled={index === items.length - 1} onClick={() => move(index, index + 1)}>
              <ArrowDown size={13} />
            </IconButton>
            <IconButton title="Sil" onClick={() => remove(index)} danger>
              <Trash2 size={13} />
            </IconButton>
          </div>
        );

        if (!isObject) {
          return (
            <div key={index} className="flex items-start gap-2">
              <div className="flex-1">
                <Field name={index} value={item} path={[...path, index]} ctx={ctx} />
              </div>
              <div className="pt-5">{controls}</div>
            </div>
          );
        }

        return (
          <details key={index} className="border border-[#E5E1DA] rounded-sm bg-[#FBF9F6]">
            <summary className="cursor-pointer select-none px-3 py-2.5 flex items-center justify-between gap-3">
              <span className="text-sm text-[#101B35] truncate">
                <span className="font-mono text-xs text-[#8F9AA0] mr-2">{index + 1}.</span>
                {summary || "(başlıksız)"}
              </span>
              {controls}
            </summary>
            <div className="p-4 border-t border-[#E5E1DA]">
              <FieldGroup value={item} path={[...path, index]} ctx={ctx} />
            </div>
          </details>
        );
      })}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#741F3D] border border-dashed border-[#741F3D]/50 rounded-sm px-3 py-2 hover:bg-[#741F3D]/5"
      >
        <Plus size={13} /> Yeni ekle
      </button>
    </div>
  );
}

function IconButton({
  children, title, onClick, disabled, danger,
}: { children: React.ReactNode; title: string; onClick: () => void; disabled?: boolean; danger?: boolean }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={cn(
        "w-7 h-7 inline-flex items-center justify-center rounded-sm border border-[#E5E1DA] bg-white disabled:opacity-30",
        danger ? "text-red-700 hover:bg-red-50" : "text-[#5A6478] hover:text-[#101B35]"
      )}
    >
      {children}
    </button>
  );
}

function ImageField({ label, value, path, ctx }: { label: string; value: string; path: Path; ctx: EditorContext }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const preview = ctx.previews[value] ?? value;

  async function upload(file: File) {
    setBusy(true);
    setError("");
    try {
      const compressed = await compressImage(file);
      const form = new FormData();
      form.append("file", compressed, file.name);
      const response = await fetch("/api/admin/upload", { method: "POST", body: form });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error ?? "Yükleme başarısız.");
      ctx.onUploaded(result.src, URL.createObjectURL(compressed), result.pending);
      ctx.update(path, result.src);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yükleme başarısız.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div>
      <span className="block text-xs font-semibold text-[#101B35] mb-1">{label}</span>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-48 aspect-[16/10] bg-[#101B35] rounded-sm overflow-hidden flex-shrink-0">
          {preview && (
            // A plain <img> previews new uploads before they are published.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="w-full h-full object-cover" loading="lazy" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <button
            type="button"
            disabled={busy || !ctx.uploadsEnabled}
            onClick={() => input.current?.click()}
            className="inline-flex items-center gap-2 bg-[#101B35] text-white text-xs font-semibold px-3 py-2 rounded-sm disabled:opacity-40"
          >
            <ImageUp size={14} /> {busy ? "Yükleniyor…" : "Yeni fotoğraf yükle"}
          </button>
          <input
            ref={input}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
          <input
            type="text"
            value={value}
            onChange={(e) => ctx.update(path, e.target.value)}
            placeholder="/uploads/... veya https://images.unsplash.com/..."
            className="w-full border border-[#E5E1DA] rounded-sm px-3 py-1.5 text-xs font-mono text-[#5A6478] focus:border-[#741F3D] outline-none"
          />
          <p className="text-[11px] text-[#8F9AA0]">
            Bilgisayarınızdan veya telefonunuzdan yükleyin ya da bir Unsplash adresi yapıştırın.
          </p>
          {error && <p className="text-xs text-red-700">{error}</p>}
        </div>
      </div>
    </div>
  );
}
