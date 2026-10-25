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
      <p className="font-serif-title italic text-xl text-white">
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
    <div role="timer" aria-label={labels.label}>
      <p className="text-xs text-white/70 mb-2">{labels.label}</p>
      <div className="flex items-baseline gap-4 sm:gap-6 lg:justify-end">
        {units.map(({ label, value }, i) => (
          <div key={i} className="flex items-baseline gap-1.5">
            <span className="font-serif-title text-2xl sm:text-3xl text-white tabular-nums leading-none">
              {value === null ? "--" : i === 0 ? value : String(value).padStart(2, "0")}
            </span>
            <span className="text-xs text-white/70">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
