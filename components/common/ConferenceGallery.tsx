"use client";

import { useState } from "react";
import Image from "next/image";
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
    <section className="py-20 sm:py-28 bg-white text-[#101B35]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-8">
          <div className="lg:col-span-7">
            <p className="kicker mb-4">{text.eyebrow}</p>
            <h2 className="font-serif-title text-[2.25rem] sm:text-5xl lg:text-6xl font-normal leading-[1.02]">
              {text.title}
            </h2>
          </div>
          <p className="lg:col-span-5 text-base sm:text-lg text-[#4B5563] leading-relaxed">
            {text.intro}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-y border-[#E5E1DA] py-3 mb-10">
          <div className="flex flex-wrap gap-x-6 gap-y-2" role="group" aria-label="Filter photos">
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
                type="button"
                aria-pressed={activeFilter === id}
                onClick={() => {
                  setActiveFilter(id);
                  setShowAll(false);
                }}
                className={cn(
                  "text-sm py-1 transition-colors border-b-2",
                  activeFilter === id
                    ? "text-[#101B35] font-semibold border-[#741F3D]"
                    : "text-[#5A6478] border-transparent hover:text-[#101B35]"
                )}
              >
                {label} <span className="text-[#8F9AA0] font-normal">{count}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-[#5A6478] italic sm:text-right sm:max-w-sm">
            <RichText text={text.notice} />
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {visibleItems.map((item, i) => {
            const feature = i % 6 === 0;
            return (
              <figure
                key={item.id}
                className={cn("reveal group flex flex-col", feature && "sm:col-span-2 lg:row-span-2")}
              >
                <div
                  className={cn(
                    "relative overflow-hidden bg-[#101B35]",
                    feature ? "aspect-[4/3] lg:aspect-auto lg:flex-1 lg:min-h-[360px]" : "aspect-[4/3]"
                  )}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    quality={60}
                    sizes={feature ? "(max-width: 640px) 100vw, 66vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
                    className="object-cover object-center img-zoom"
                  />
                </div>
                <figcaption className="mt-3">
                  <p className="text-xs text-[#741F3D]">
                    {item.yearOrArea} · {item.location}
                  </p>
                  <h3 className={cn("font-serif-title font-normal mt-0.5", feature ? "text-2xl" : "text-lg")}>{item.title}</h3>
                  <p className="text-sm text-[#5A6478] leading-relaxed mt-1">{item.caption}</p>
                </figcaption>
              </figure>
            );
          })}
        </div>

        {!showAll && filteredItems.length > INITIAL_VISIBLE && (
          <div className="mt-12 border-t border-[#E5E1DA] pt-6">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="text-sm font-semibold text-[#101B35] link-underline decoration-[#741F3D] hover:text-[#741F3D]"
            >
              {text.showMoreButton} ({filteredItems.length - INITIAL_VISIBLE})
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
