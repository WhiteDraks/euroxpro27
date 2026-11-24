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
      <p className="text-lg font-semibold text-[#E0647D]">
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
      <p className="text-sm text-[#D6C8BC] mb-2">{labels.label}</p>
      <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md">
        {units.map(({ label, value }, i) => {
          const shown = value === null ? "--" : i === 0 ? String(value) : String(value).padStart(2, "0");
          return (
            <div key={i} className="rounded-xl bg-[#F4EDE2] text-[#140D0E] text-center py-2.5 sm:py-3 overflow-hidden">
              <span key={shown} className="tick block font-serif-title text-2xl sm:text-4xl leading-none tabular-nums">
                {shown}
              </span>
              <span className="block text-[11px] sm:text-xs text-[#6B5B55] mt-1">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
