"use client";

import { useSyncExternalStore } from "react";
import type { SiteContent } from "@/lib/content";

// ============================================================
// Live countdown to the congress opening, shown in the home hero.
// The server renders dashes; the numbers appear once the page is
// interactive, so the static HTML never shows a stale time.
// ============================================================

type Labels = SiteContent["home"]["countdown"];

function subscribe(onTick: () => void) {
  const id = window.setInterval(onTick, 1000);
  return () => window.clearInterval(id);
}

const nowInSeconds = () => Math.floor(Date.now() / 1000);
const noTimeOnServer = () => null;

export function Countdown({ start, end, labels }: { start: string; end: string; labels: Labels }) {
  const now = useSyncExternalStore(subscribe, nowInSeconds, noTimeOnServer);
  const startAt = Math.floor(new Date(start).getTime() / 1000);
  const endAt = Math.floor(new Date(end).getTime() / 1000);

  if (now !== null && now >= startAt) {
    return (
      <p className="text-sm font-semibold text-[#E0647D]">
        {now < endAt ? labels.liveText : labels.endedText}
      </p>
    );
  }

  const left = now === null ? null : startAt - now;
  const units = [
    { label: labels.daysLabel, value: left === null ? null : Math.floor(left / 86400) },
    { label: labels.hoursLabel, value: left === null ? null : Math.floor((left % 86400) / 3600) },
    { label: labels.minutesLabel, value: left === null ? null : Math.floor((left % 3600) / 60) },
    { label: labels.secondsLabel, value: left === null ? null : left % 60 },
  ];

  return (
    <div role="timer" aria-label={labels.label} className="sm:text-right">
      <p className="text-xs text-[#A8968D] mb-1">{labels.label}</p>
      <div className="flex items-baseline gap-3 sm:justify-end">
        {units.map(({ label, value }, i) => (
          <div key={i} className="flex items-baseline gap-1">
            <span className="text-lg sm:text-xl font-semibold text-white tabular-nums leading-none">
              {value === null ? "--" : i === 0 ? value : String(value).padStart(2, "0")}
            </span>
            <span className="text-[11px] text-[#A8968D]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
