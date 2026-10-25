"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import type { Announcement } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

function AnnouncementCard({ ann }: { ann: Announcement }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <article className="border-t border-[#101B35] py-8 grid sm:grid-cols-[11rem_1fr] gap-x-8 gap-y-2">
      <div className="text-sm text-[#5A6478]">
        <time dateTime={ann.publishedAt}>{formatDate(ann.publishedAt)}</time>
        <p className="text-[#741F3D] mt-0.5">
          {ann.isPinned && <>Pinned · </>}
          {ann.category.charAt(0).toUpperCase() + ann.category.slice(1)}
        </p>
      </div>
      <div>
        <h3 className="font-serif-title font-normal text-[#101B35] text-2xl sm:text-3xl leading-snug">{ann.title}</h3>
        <p className="text-[#4B5563] text-base leading-relaxed mt-2">{ann.summary}</p>
        {expanded && (
          <div className="mt-4 text-[#374151] text-base leading-relaxed whitespace-pre-line">
            {ann.content}
          </div>
        )}
        <div className="mt-4 flex items-center gap-6">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            className="text-[#741F3D] text-sm font-semibold link-underline"
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
      </div>
    </article>
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
    <section className="pb-20 sm:pb-28 bg-[#F7F3ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filter */}
        <div className="flex gap-x-6 mb-4 border-b border-[#D9D2C5] overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              aria-pressed={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "whitespace-nowrap py-3 -mb-px text-sm border-b-2 transition-colors",
                activeCategory === cat.id
                  ? "border-[#741F3D] text-[#101B35] font-semibold"
                  : "border-transparent text-[#5A6478] hover:text-[#101B35]"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 border-t border-[#101B35]">
            <h4 className="font-serif-title text-xl text-[#101B35] mb-2">No Announcements in this Category</h4>
            <p className="text-base text-[#5A6478] max-w-md leading-relaxed">
              Nothing here yet. Try &ldquo;All&rdquo;, or check back closer to the congress.
            </p>
          </div>
        ) : (
          <div className="border-b border-[#101B35]">
            {pinned.map((ann) => (
              <AnnouncementCard key={ann.id} ann={ann} />
            ))}
            {rest.map((ann) => (
              <AnnouncementCard key={ann.id} ann={ann} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
