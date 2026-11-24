"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  METRICS,
  PRODUCTS,
  groupByMc,
  metricLabel,
  metricVal,
  ranked,
  shortLc,
  type League,
  type Metric,
  type Product,
  type Row,
} from "@/lib/approvals";

// Like the delegate app, the league shows places and bars only, no figures.
// While the page is visible it asks this site (not the app) for fresh
// numbers once a minute; that answer is cached, so it stays cheap.
const REFRESH_MS = 60000;

function Tabs<T extends string>({ value, options, onChange, label }: { value: T; options: [T, string][]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-full bg-[#ECE1D1] p-1 max-w-full overflow-x-auto">
      {options.map(([v, text]) => (
        <button
          key={v}
          type="button"
          aria-pressed={value === v}
          onClick={() => onChange(v)}
          className={cn(
            "whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors",
            value === v ? "bg-[#140D0E] text-white" : "text-[#374151] hover:text-[#7D1A30]"
          )}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

function Chips<T extends string>({ value, options, onChange, label }: { value: T; options: [T, string][]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="flex gap-2 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
      {options.map(([v, text]) => (
        <button
          key={v}
          type="button"
          aria-pressed={value === v}
          onClick={() => onChange(v)}
          className={cn(
            "whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm transition-colors",
            value === v ? "border-[#7D1A30] bg-[#7D1A30] text-white" : "border-[#CDBDA8] text-[#374151] hover:border-[#7D1A30]"
          )}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

export function ApprovalsLeague({ initial }: { initial: League | null }) {
  const [data, setData] = useState(initial);
  const [metric, setMetric] = useState<Metric>("apd");
  const [prod, setProd] = useState<Product | "all">("all");
  const [mode, setMode] = useState<"lc" | "mc">("lc");
  const [mc, setMc] = useState("all");

  useEffect(() => {
    let alive = true;
    const load = () => {
      if (document.visibilityState !== "visible") return;
      fetch("/api/league")
        .then((r) => (r.ok ? r.json() : null))
        .then((d: League | null) => alive && d?.lcs && setData(d))
        .catch(() => {});
    };
    const timer = setInterval(load, REFRESH_MS);
    document.addEventListener("visibilitychange", load);
    return () => {
      alive = false;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", load);
    };
  }, []);

  const lcs = useMemo(() => data?.lcs ?? [], [data]);
  const mcs = useMemo(() => [...new Set(lcs.map((x) => x.mc))].sort(), [lcs]);
  const rows = useMemo(() => {
    const items: Row[] = mode === "mc" ? groupByMc(lcs) : lcs.filter((x) => mc === "all" || x.mc === mc);
    return ranked(items, (x) => metricVal(x, metric, prod));
  }, [lcs, mode, mc, metric, prod]);

  if (!data || !lcs.length) {
    return (
      <section className="bg-[#F4EDE2] pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="border-t border-[#140D0E] pt-8 text-[#4B5563]">The league will appear here once the organizers open it. Check back soon.</p>
        </div>
      </section>
    );
  }

  const top = Math.max(1, rows[0]?.v || 0);
  const podium = rows.length >= 3 ? rows.slice(0, 3) : [];
  const rest = rows.slice(podium.length);
  const name = (x: Row) => (mode === "mc" ? x.name : shortLc(x.name));
  const sub = (x: Row) => (mode === "mc" ? `${x.n} LCs` : x.mc);

  return (
    <section className="bg-[#F4EDE2] pb-20 sm:pb-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {data.demo && (
          <p className="mb-6 rounded-xl bg-[#ECE1D1] px-4 py-3 text-sm text-[#6B5B55]">Sample data: the organizers will replace it with the real numbers.</p>
        )}

        <div className="space-y-4">
          <Tabs label="Metric" value={metric} onChange={setMetric} options={METRICS.map((m) => [m, metricLabel[m]])} />
          <Chips label="Product" value={prod} onChange={setProd} options={[["all", "All products"], ...PRODUCTS.map((p) => [p, p] as [Product, string])]} />
          <div className="flex flex-wrap items-center gap-3">
            <Tabs label="Rank by" value={mode} onChange={setMode} options={[["lc", "Local committees"], ["mc", "Countries"]]} />
          </div>
          {mode === "lc" && <Chips label="Country" value={mc} onChange={setMc} options={[["all", "All"], ...mcs.map((m) => [m, m] as [string, string])]} />}
        </div>

        {podium.length === 3 && (
          <div className="mt-10 grid grid-cols-3 items-end gap-2 sm:gap-4" aria-label="Top three">
            {[podium[1], podium[0], podium[2]].map((r) => (
              <div key={r.x.id} className="flex min-w-0 flex-col items-center text-center">
                <span className={cn("font-serif-title text-[#140D0E] leading-tight break-words max-w-full", r.place === 1 ? "text-xl sm:text-2xl" : "text-base sm:text-xl")}>{name(r.x)}</span>
                <span className="mt-0.5 mb-2 text-xs text-[#6B5B55] truncate max-w-full">{sub(r.x)}</span>
                <span
                  className={cn(
                    "flex w-full items-start justify-center rounded-t-xl pt-3 font-serif-title text-3xl sm:text-4xl",
                    r.place === 1 ? "h-32 sm:h-40 bg-[#7D1A30] text-white" : r.place === 2 ? "h-24 sm:h-28 bg-[#140D0E] text-white" : "h-16 sm:h-20 bg-[#CDBDA8] text-[#140D0E]"
                  )}
                >
                  {r.place}
                </span>
              </div>
            ))}
          </div>
        )}

        <ol className="mt-6 space-y-2">
          {rest.map((r) => (
            <li key={r.x.id} className="flex items-center gap-3 rounded-xl bg-[#FBF7F0] px-4 py-3">
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#ECE1D1] text-sm font-semibold text-[#140D0E]">{r.place}</span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="truncate font-semibold text-[#140D0E]">{name(r.x)}</span>
                  <span className="flex-none text-xs text-[#6B5B55]">{sub(r.x)}</span>
                </span>
                <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-[#ECE1D1]">
                  <span className="block h-full rounded-full bg-[#7D1A30] transition-[width] duration-700" style={{ width: `${Math.max(2, (r.v / top) * 100)}%` }} />
                </span>
              </span>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-sm text-[#6B5B55]">
          Delegates at the congress follow the league in the EUROXPRO&apos;27 app. This page refreshes on its own every minute.
        </p>
      </div>
    </section>
  );
}
