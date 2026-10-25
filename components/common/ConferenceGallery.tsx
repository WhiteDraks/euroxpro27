"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/ui/RichText";
import type { SiteContent } from "@/lib/content";

type FilterCategory = "all" | "conferences" | "antalya";

// Only the first few photos render until the visitor asks for more,
// so slow connections are not flooded with gallery images.
const INITIAL_VISIBLE = 6;

type ConferenceGalleryProps = {
  text: SiteContent["gallery"];
};

export function ConferenceGallery({ text }: ConferenceGalleryProps) {
  const galleryItems = text.items;
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [showAll, setShowAll] = useState(false);

  const filteredItems = galleryItems.filter((item) => {
    if (activeFilter === "all") return true;
    return item.category === activeFilter;
  });
  const visibleItems = showAll ? filteredItems : filteredItems.slice(0, INITIAL_VISIBLE);

  return (
    <section className="py-24 bg-[#101B35] text-white relative overflow-hidden bosphorus-grid-dark">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[400px] bg-[#741F3D]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#233152] pb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-[0.25em] text-[#741F3D] uppercase mb-3">
              <Camera size={14} />
              {text.eyebrow}
            </div>
            <h2 className="font-serif-title text-4xl sm:text-5xl text-white font-normal leading-tight">
              {text.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#A7AFBF] mt-3 max-w-xl leading-relaxed font-light">
              {text.intro}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "all", label: text.filterAll, count: galleryItems.length },
                {
                  id: "conferences",
                  label: text.filterConferences,
                  count: galleryItems.filter((g) => g.category === "conferences").length,
                },
                {
                  id: "antalya",
                  label: text.filterAntalya,
                  count: galleryItems.filter((g) => g.category === "antalya").length,
                },
              ] as const
            ).map(({ id, label, count }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveFilter(id);
                  setShowAll(false);
                }}
                className={cn(
                  "px-4 py-2 text-xs font-mono rounded-sm transition-all duration-200 border",
                  activeFilter === id
                    ? "bg-[#741F3D] text-white border-[#741F3D]"
                    : "bg-[#172443] text-[#A7AFBF] border-[#233152] hover:text-white hover:border-[#741F3D]"
                )}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Informative Disclaimer Pill */}
        <div className="mb-10 flex items-center gap-3 px-4 py-3 bg-[#172443]/70 border border-[#233152] rounded-sm text-xs text-[#A7AFBF]">
          <Info size={16} className="text-[#741F3D] flex-shrink-0" />
          <span>
            <RichText text={text.notice} />
          </span>
        </div>

        {/* Gallery Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#172443] border border-[#233152] rounded-sm overflow-hidden group hover:border-[#741F3D] transition-colors duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] relative overflow-hidden bg-[#101B35]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    quality={60}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center img-zoom filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101B35]/90 via-transparent to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={cn(
                        "text-[10px] font-mono px-2.5 py-1 rounded-sm uppercase tracking-wider",
                        item.isHistorical
                          ? "bg-[#741F3D] text-white"
                          : "bg-[#101B35]/90 backdrop-blur-sm text-[#E5E1DA] border border-[#233152]"
                      )}
                    >
                      {item.yearOrArea}
                    </span>
                  </div>

                  {/* Location Stamp */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-mono tracking-widest text-[#A7AFBF] uppercase block">
                      {item.location}
                    </span>
                    <h3 className="font-serif-title text-lg font-normal text-white">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-xs text-[#A7AFBF] leading-relaxed font-light">
                    {item.caption}
                  </p>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-[#233152] bg-[#101B35]/40 flex items-center justify-between text-[10px] font-mono text-[#8F9AA0]">
                <span>{item.isHistorical ? "Conference Moments" : "Antalya Host Destination"}</span>
                <span className="text-[#E5E1DA]">{item.isHistorical ? "Illustrative" : "Antalya, Türkiye"}</span>
              </div>
            </div>
          ))}
        </div>

        {!showAll && filteredItems.length > INITIAL_VISIBLE && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="px-6 py-3 text-xs font-mono uppercase tracking-wider rounded-sm border border-[#233152] bg-[#172443] text-[#E5E1DA] hover:border-[#741F3D] hover:text-white transition-colors"
            >
              {text.showMoreButton} ({filteredItems.length - INITIAL_VISIBLE})
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
