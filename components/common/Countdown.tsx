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
      <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-[#741F3D] rounded-sm text-sm font-semibold text-white">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        {now < endAt ? labels.liveText : labels.endedText}
      </div>
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
      <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#A7AFBF] mb-2.5">{labels.label}</p>
      <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md">
        {units.map(({ label, value }, i) => (
          <div
            key={i}
            className="bg-[#101B35]/80 border border-[#233152] backdrop-blur-sm rounded-sm px-2 py-3 text-center"
          >
            <span className="block font-serif-title text-2xl sm:text-4xl text-white tabular-nums leading-none">
              {value === null ? "--" : String(value).padStart(2, "0")}
            </span>
            <span className="block mt-2 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-[#A7AFBF]">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
