"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import type { SiteContent } from "@/lib/content";
import { cn } from "@/lib/utils";
import Link from "next/link";

type FAQText = Omit<SiteContent["faq"], "hero" | "travel">;

export function FAQPage({ text }: { text: FAQText }) {
  const { categories } = text;
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return categories
      .filter((cat) => activeCategory === "all" || cat.id === activeCategory)
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            !q ||
            item.question.toLowerCase().includes(q) ||
            item.answer.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [categories, search, activeCategory]);

  const totalResults = filtered.reduce((acc, cat) => acc + cat.items.length, 0);

  const filterButton = (id: string, label: string) => (
    <button
      key={id}
      type="button"
      aria-pressed={activeCategory === id}
      onClick={() => setActiveCategory(id)}
      className={cn(
        "whitespace-nowrap text-left py-2 lg:py-1.5 text-sm transition-colors border-b-2 lg:border-b-0 lg:border-l-2 lg:pl-3",
        activeCategory === id
          ? "border-[#741F3D] text-[#101B35] font-semibold"
          : "border-transparent text-[#5A6478] hover:text-[#101B35]"
      )}
    >
      {label}
    </button>
  );

  return (
    <section className="py-16 sm:py-24 bg-[#F7F3ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-16">
        <aside className="min-w-0 lg:col-span-4 lg:sticky lg:top-28 self-start">
          {/* Search */}
          <div className="relative mb-6">
            <Search size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-[#5A6478]" />
            <input
              type="text"
              placeholder={text.searchPlaceholder}
              aria-label={text.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-2 py-3 bg-transparent border-b border-[#101B35] text-[#101B35] placeholder-[#8F9AA0] focus:outline-none focus:border-[#741F3D] transition-colors text-base"
            />
          </div>

          {/* Category Filter */}
          <div className="flex lg:flex-col gap-x-5 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-[#D9D2C5] lg:border-b-0">
            {filterButton("all", text.allLabel)}
            {categories.map((cat) => filterButton(cat.id, cat.label))}
          </div>
        </aside>

        <div className="min-w-0 lg:col-span-8">
          {/* Results */}
          {search && (
            <p className="text-[#5A6478] text-sm mb-6">
              {totalResults} result{totalResults !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
            </p>
          )}

          {filtered.length === 0 ? (
            <div className="py-12 border-t border-[#101B35]">
              <p className="font-serif-title text-2xl text-[#101B35] mb-2">{text.emptyTitle}</p>
              <p className="text-[#5A6478] text-base mb-6">{text.emptyText}</p>
              <Link href="/contact">
                <Button variant="primary">{text.ctaButton}</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-14">
              {filtered.map((cat) => (
                <div key={cat.id}>
                  <h2 className="font-serif-title font-normal text-[#101B35] text-3xl pb-3 border-b border-[#101B35]">
                    {cat.label}
                  </h2>
                  <Accordion items={cat.items} />
                </div>
              ))}
            </div>
          )}

          {/* Contact CTA */}
          <div className="mt-20 border-t border-[#101B35] pt-8">
            <h3 className="font-serif-title font-normal text-[#101B35] text-3xl mb-3">{text.ctaTitle}</h3>
            <p className="text-[#4B5563] text-base mb-6 max-w-xl">{text.ctaText}</p>
            <Link href="/contact">
              <Button variant="secondary" size="lg">{text.ctaButton}</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
