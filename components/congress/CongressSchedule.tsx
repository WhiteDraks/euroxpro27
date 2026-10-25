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
        <div className="bg-[#172443] border border-[#2A3556] rounded-lg p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#2A3556]">
            <div>
              <h3 className="font-display font-bold text-white text-xl">{currentDay.label}</h3>
              <p className="text-[#A7AFBF] text-sm">{currentDay.date}</p>
            </div>
            <Clock size={18} className="text-[#741F3D]" />
          </div>
          <div>
            {currentDay.sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
