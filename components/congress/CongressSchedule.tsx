"use client";

import { useState } from "react";
import { Clock, MapPin, User, Coffee, Users, Presentation, PartyPopper, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScheduleDay, ScheduleSession } from "@/lib/types";

const sessionTypeConfig = {
  plenary: { icon: Presentation, color: "text-blue-400", bg: "bg-blue-500/10", label: "Plenary" },
  workshop: { icon: Users, color: "text-green-400", bg: "bg-green-500/10", label: "Workshop" },
  networking: { icon: Users, color: "text-purple-400", bg: "bg-purple-500/10", label: "Networking" },
  social: { icon: PartyPopper, color: "text-[#741F3D]", bg: "bg-[#741F3D]/10", label: "Social" },
  break: { icon: Coffee, color: "text-amber-400", bg: "bg-amber-500/10", label: "Break" },
  logistics: { icon: Truck, color: "text-[#A7AFBF]", bg: "bg-white/5", label: "Logistics" },
};

function SessionCard({ session }: { session: ScheduleSession }) {
  const config = sessionTypeConfig[session.type] || sessionTypeConfig.plenary;
  const Icon = config.icon;
  return (
    <div className="flex gap-4 py-5 border-b border-[#2A3556] last:border-0">
      <div className="w-20 flex-shrink-0">
        <span className="text-[#A7AFBF] text-sm font-mono">{session.time}</span>
        {session.endTime && (
          <span className="block text-[#A7AFBF]/50 text-xs font-mono">{session.endTime}</span>
        )}
      </div>
      <div className={cn("w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5", config.bg)}>
        <Icon size={14} className={config.color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-white font-medium leading-snug">{session.title}</h4>
          <span className={cn("text-xs px-2 py-0.5 rounded-sm flex-shrink-0", config.bg, config.color)}>
            {config.label}
          </span>
        </div>
        {session.description && (
          <p className="text-[#A7AFBF] text-sm mt-2 leading-relaxed">{session.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-3 mt-2">
          {session.location && (
            <span className="flex items-center gap-1 text-[#A7AFBF] text-xs">
              <MapPin size={11} /> {session.location}
            </span>
          )}
          {session.speaker && (
            <span className="flex items-center gap-1 text-[#A7AFBF] text-xs">
              <User size={11} /> {session.speaker}
            </span>
          )}
          {session.dressCode && (
            <span className="text-xs text-[#741F3D] font-medium">
              Dress: {session.dressCode}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function CongressSchedule({ days }: { days: ScheduleDay[] }) {
  const [activeDay, setActiveDay] = useState(0);
  const currentDay = days[activeDay];

  return (
    <div>
      {/* Official Program Status Banner */}
      <div className="mb-8 p-5 bg-[#172443] border border-[#2A3556] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
          <div>
            <span className="text-xs font-mono font-bold tracking-wider text-amber-300 uppercase block">
              Program Status: Indicative Schedule Framework
            </span>
            <p className="text-xs text-[#A7AFBF] mt-0.5 font-light">
              Official detailed program, keynote speakers, and room allocations to be announced.
            </p>
          </div>
        </div>
        <div className="text-left sm:text-right flex-shrink-0">
          <span className="inline-block px-3 py-1 bg-[#101B35] border border-[#2A3556] rounded-sm text-[11px] font-mono text-[#E5E1DA]">
            5-Day Congress Framework
          </span>
        </div>
      </div>

      {/* Day Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {days.map((day, index) => (
          <button
            key={day.day}
            onClick={() => setActiveDay(index)}
            className={cn(
              "px-5 py-2.5 text-sm font-medium rounded-sm transition-all duration-200",
              activeDay === index
                ? "bg-[#741F3D] text-white"
                : "bg-[#172443] text-[#A7AFBF] hover:text-white border border-[#2A3556]"
            )}
          >
            <span className="block text-xs font-normal opacity-70">Day {day.day}</span>
            {day.label}
          </button>
        ))}
      </div>

      {/* Day Content */}
      {currentDay && (
        <div className="bg-[#172443] border border-[#2A3556] rounded-sm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#2A3556]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#741F3D] block mb-1">
                Day {currentDay.day} Focus
              </span>
              <h3 className="font-serif-title text-white text-2xl font-normal">{currentDay.label}</h3>
              <p className="text-[#A7AFBF] text-xs font-mono mt-1">{currentDay.date}</p>
            </div>
            <Clock size={18} className="text-[#741F3D]" />
          </div>
          <div>
            {currentDay.sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-[#2A3556] flex items-center justify-between text-[11px] font-mono text-[#8F9AA0]">
            <span>Times and flow subject to minor operational adjustments</span>
            <span className="text-[#A7AFBF]">Antalya Local Time (UTC+3)</span>
          </div>
        </div>
      )}
    </div>
  );
}
