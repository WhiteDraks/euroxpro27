// ============================================================
// Approvals league, as shown in the delegate app, for the public
// website. The numbers live in the delegate app; this site asks
// for them at most once every 30 seconds (see REVALIDATE) and
// serves everyone else the cached copy, so a big crowd on the
// website never reaches the app or its database.
// ============================================================

export const REVALIDATE = 30;

export const PRODUCTS = ["GV", "GTa", "GTe"] as const;
export const METRICS = ["apd", "re", "co"] as const;
export type Product = (typeof PRODUCTS)[number];
export type Metric = (typeof METRICS)[number];

export type Lc = {
  id: string;
  name: string;
  mc: string;
  goal: number;
  p: Partial<Record<Product, Partial<Record<Metric, number>>>>;
};

export type League = { demo: boolean; updatedAt: number; lcs: Lc[] };

const APP_URL = (process.env.DELEGATE_APP_URL || "https://app-mobile-murex.vercel.app").replace(/\/$/, "");

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) && v > 0 ? v : 0);

// Keep only what the league needs, so nothing else from the app ends up
// in this site's pages.
function clean(raw: unknown): League | null {
  if (!raw || typeof raw !== "object" || !Array.isArray((raw as League).lcs)) return null;
  const d = raw as League;
  const lcs = d.lcs
    .filter((x) => x && typeof x.name === "string")
    .map((x) => ({
      id: String(x.id),
      name: String(x.name).slice(0, 80),
      mc: String(x.mc || "").slice(0, 60),
      goal: num(x.goal),
      p: Object.fromEntries(
        PRODUCTS.map((k) => [k, Object.fromEntries(METRICS.map((m) => [m, num(x.p?.[k]?.[m])]))])
      ) as Lc["p"],
    }));
  return { demo: !!d.demo, updatedAt: num(d.updatedAt), lcs };
}

export async function getLeague(): Promise<League | null> {
  try {
    const res = await fetch(`${APP_URL}/api/approvals`, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return clean(await res.json());
  } catch {
    return null;
  }
}

export const metricLabel: Record<Metric, string> = { apd: "Approvals", re: "Realizations", co: "Completes" };

export function metricVal(x: Lc, m: Metric, prod: Product | "all") {
  return prod === "all" ? PRODUCTS.reduce((a, k) => a + (x.p[k]?.[m] || 0), 0) : x.p[prod]?.[m] || 0;
}

export const shortLc = (name: string) => name.replace(/^AIESEC in /i, "");

export type Row = Lc & { n?: number };

export function groupByMc(lcs: Lc[]): Row[] {
  const by = new Map<string, Row>();
  for (const x of lcs) {
    const g: Row = by.get(x.mc) || {
      id: "mc:" + x.mc,
      name: x.mc,
      mc: "",
      goal: 0,
      n: 0,
      p: Object.fromEntries(PRODUCTS.map((k) => [k, { apd: 0, re: 0, co: 0 }])),
    };
    g.goal += x.goal;
    g.n = (g.n || 0) + 1;
    for (const k of PRODUCTS) for (const m of METRICS) g.p[k]![m] = (g.p[k]![m] || 0) + (x.p[k]?.[m] || 0);
    by.set(x.mc, g);
  }
  return [...by.values()];
}

// Ties share a place (1, 2, 2, 4).
export function ranked<T extends { name: string }>(items: T[], val: (x: T) => number) {
  const sorted = items.slice().sort((a, b) => val(b) - val(a) || a.name.localeCompare(b.name));
  let place = 0;
  return sorted.map((x, i) => {
    if (i === 0 || val(x) !== val(sorted[i - 1])) place = i + 1;
    return { x, v: val(x), place };
  });
}
