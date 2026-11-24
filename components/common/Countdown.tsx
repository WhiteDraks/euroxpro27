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
      <p className="glass inline-flex rounded-full px-5 py-2 text-lg font-semibold text-[#FBF7F0]">
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
    <div role="timer" aria-label={labels.label} className="w-full max-w-lg">
      <p className="text-sm font-medium text-[#F4EDE2]/70 mb-3">{labels.label}</p>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {units.map(({ label, value }, i) => {
          const shown = value === null ? "--" : i === 0 ? String(value) : String(value).padStart(2, "0");
          return (
            <div key={i} className="glass rounded-[20px] text-[#FBF7F0] text-center py-3 sm:py-4 overflow-hidden">
              <span key={shown} className="tick block font-serif-title text-3xl sm:text-5xl leading-none tabular-nums">
                {shown}
              </span>
              <span className="block text-[11px] sm:text-xs text-[#F4EDE2]/60 mt-1.5">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
