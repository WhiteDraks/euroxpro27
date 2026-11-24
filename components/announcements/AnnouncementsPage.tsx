"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import type { Announcement } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

function AnnouncementCard({ ann }: { ann: Announcement }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <article className="border-t border-white/25 py-8 grid sm:grid-cols-[11rem_1fr] gap-x-8 gap-y-2">
      <div className="text-sm text-[#B8A69C]">
        <time dateTime={ann.publishedAt}>{formatDate(ann.publishedAt)}</time>
        <p className="text-[#E0647D] mt-0.5">
          {ann.isPinned && <>Pinned · </>}
          {ann.category.charAt(0).toUpperCase() + ann.category.slice(1)}
        </p>
      </div>
      <div>
        <h2 className="font-serif-title font-normal text-[#FBF7F0] text-2xl sm:text-3xl leading-snug">{ann.title}</h2>
        <p className="text-[#D6C8BC] text-base leading-relaxed mt-2">{ann.summary}</p>
        {expanded && (
          <div className="mt-4 text-[#D6C8BC] text-base leading-relaxed whitespace-pre-line">
            {ann.content}
          </div>
        )}
        <div className="mt-4 flex items-center gap-6">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            className="text-[#E0647D] text-sm font-semibold link-underline"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
          {ann.externalLink && (
            <a
              href={ann.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#B8A69C] text-sm hover:text-[#E0647D] transition-colors"
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
    <section className="pb-20 sm:pb-28 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filter */}
        <div className="flex gap-x-6 mb-4 border-b border-white/15 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              aria-pressed={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "whitespace-nowrap py-3 -mb-px text-sm border-b-2 transition-colors",
                activeCategory === cat.id
                  ? "border-[#7D1A30] text-[#FBF7F0] font-semibold"
                  : "border-transparent text-[#B8A69C] hover:text-white"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 border-t border-white/25">
            <h2 className="font-serif-title text-xl text-[#FBF7F0] mb-2">No Announcements in this Category</h2>
            <p className="text-base text-[#B8A69C] max-w-md leading-relaxed">
              Nothing here yet. Try &ldquo;All&rdquo;, or check back closer to the congress.
            </p>
          </div>
        ) : (
          <div className="border-b border-white/25">
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
