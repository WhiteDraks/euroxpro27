"use client";

import { useState } from "react";
import { Pin, ExternalLink, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { Announcement } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, "burgundy" | "navy" | "muted" | "success" | "warning"> = {
  general: "muted",
  registration: "success",
  schedule: "navy",
  accommodation: "navy",
  travel: "muted",
  merch: "burgundy",
  important: "warning",
};

function AnnouncementCard({ ann }: { ann: Announcement }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card className={cn("transition-all duration-300", ann.isPinned && "border-[#741F3D]/30 ring-1 ring-[#741F3D]/20")}>
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {ann.isPinned && (
              <span className="flex items-center gap-1 text-[#741F3D] text-xs font-semibold">
                <Pin size={11} fill="currentColor" /> Pinned
              </span>
            )}
            <Badge variant={categoryColors[ann.category] || "muted"}>
              {ann.category.charAt(0).toUpperCase() + ann.category.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-[#A7AFBF] text-xs flex-shrink-0">
            <Calendar size={11} />
            {formatDate(ann.publishedAt)}
          </div>
        </div>
        <h3 className="font-serif-title font-normal text-[#101B35] text-xl mb-2">{ann.title}</h3>
        <p className="text-[#5A6478] text-sm leading-relaxed">{ann.summary}</p>
        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[#741F3D] text-sm font-medium hover:underline"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
          {ann.externalLink && (
            <a
              href={ann.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#5A6478] text-sm hover:text-[#741F3D] transition-colors"
            >
              <ExternalLink size={13} /> Link
            </a>
          )}
        </div>
        {expanded && (
          <div className="mt-4 pt-4 border-t border-[#E3E0DC]">
            <div className="text-[#5A6478] text-sm leading-relaxed whitespace-pre-line">
              {ann.content}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export function AnnouncementsPage({
  announcements,
  categories,
}: {
  announcements: Announcement[];
  categories: { id: string; label: string }[];
}) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = announcements.filter(
    (a) => activeCategory === "all" || a.category === activeCategory
  );

  const pinned = filtered.filter((a) => a.isPinned);
  const rest = filtered.filter((a) => !a.isPinned);

  return (
    <section className="py-16 bg-[#F7F3ED]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-4 py-2 rounded-sm text-sm font-medium transition-colors",
                activeCategory === cat.id
                  ? "bg-[#741F3D] text-white"
                  : "bg-white border border-[#E3E0DC] text-[#5A6478] hover:text-[#101B35]"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#E3E0DC] rounded-sm p-10">
            <div className="w-12 h-12 bg-[#F7F3ED] rounded-full flex items-center justify-center mx-auto mb-4 text-[#741F3D]">
              <Calendar size={22} />
            </div>
            <h4 className="font-serif-title text-xl text-[#101B35] mb-2">No Announcements in this Category</h4>
            <p className="text-xs text-[#5A6478] max-w-sm mx-auto leading-relaxed">
              There are no announcements currently published under this filter. Please check &ldquo;All Updates&rdquo; or return closer to the congress dates.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {pinned.map((ann) => (
              <AnnouncementCard key={ann.id} ann={ann} />
            ))}
            {rest.length > 0 && pinned.length > 0 && (
              <div className="border-t border-[#E3E0DC] pt-6">
                <p className="text-[#A7AFBF] text-xs uppercase tracking-widest mb-4">Earlier Announcements</p>
              </div>
            )}
            {rest.map((ann) => (
              <AnnouncementCard key={ann.id} ann={ann} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
