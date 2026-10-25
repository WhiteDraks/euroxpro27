"use client";

import { useState, useMemo } from "react";
import { Search, MessageCircle } from "lucide-react";
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

  return (
    <section className="py-16 bg-[#F7F3ED]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="relative mb-8">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A7AFBF]" />
          <input
            type="text"
            placeholder={text.searchPlaceholder}
            aria-label={text.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#E3E0DC] rounded-lg text-[#101B35] placeholder-[#A7AFBF] focus:outline-none focus:border-[#741F3D] transition-colors text-sm"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "px-4 py-2 rounded-sm text-sm font-medium transition-colors",
              activeCategory === "all"
                ? "bg-[#741F3D] text-white"
                : "bg-white border border-[#E3E0DC] text-[#5A6478] hover:text-[#101B35]"
            )}
          >
            {text.allLabel}
          </button>
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

        {/* Results */}
        {search && (
          <p className="text-[#5A6478] text-sm mb-6">
            {totalResults} result{totalResults !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
          </p>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#5A6478] text-lg mb-4">{text.emptyTitle}</p>
            <p className="text-[#5A6478] text-sm mb-6">{text.emptyText}</p>
            <Link href="/contact">
              <Button variant="primary">{text.ctaButton}</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {filtered.map((cat) => (
              <div key={cat.id}>
                <h2 className="font-serif-title font-normal text-[#101B35] text-xl mb-4 pb-2 border-b border-[#E3E0DC]">
                  {cat.label}
                </h2>
                <div className="bg-white rounded-lg border border-[#E3E0DC] px-6">
                  <Accordion items={cat.items} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-16 bg-[#101B35] rounded-lg p-8 text-center">
          <MessageCircle size={24} className="text-[#741F3D] mx-auto mb-4" />
          <h3 className="font-serif-title font-normal text-white text-2xl mb-3">{text.ctaTitle}</h3>
          <p className="text-[#A7AFBF] mb-6">{text.ctaText}</p>
          <Link href="/contact">
            <Button variant="primary" size="lg">{text.ctaButton}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
