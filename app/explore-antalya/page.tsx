import type { Metadata } from "next";
import Image from "next/image";
import { AntalyaGuide } from "@/components/antalya/AntalyaGuide";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "Explore Antalya — The Mediterranean Host City",
  description: "A delegate guide to Antalya and the Turkish Riviera: historic Kaleiçi, Düden waterfalls, Taurus mountain panoramas, Mediterranean gastronomy, and transport routes.",
  alternates: { canonical: "/explore-antalya" },
};

export default function ExploreAntalyaPage() {
  const { hero, ...guide } = content.exploreAntalya;

  return (
    <div className="pt-16 lg:pt-20">
      {/* ── EDITORIAL TRAVEL MAGAZINE HERO ── */}
      <section className="relative min-h-[55vh] flex items-center bg-[#101B35] text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bosphorus-grid-dark">
        {/* Full-bleed scenic Antalya Mediterranean background */}
        <div className="absolute inset-0 z-0 opacity-35">
          <Image
            src={hero.image}
            alt={hero.imageAlt}
            fill
            preload
            quality={60}
            sizes="100vw"
            className="object-cover object-center filter brightness-95"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#101B35] via-[#101B35]/85 to-[#101B35]/65 z-0" />
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#741F3D]/25 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-[0.25em] text-[#741F3D] uppercase mb-4">
            <span className="w-8 h-px bg-[#741F3D]" />
            {hero.eyebrow}
          </div>
          <h1 className="font-serif-title font-normal text-4xl sm:text-6xl lg:text-7xl text-white max-w-4xl leading-tight">
            {hero.title}
          </h1>
          <p className="mt-4 text-[#A7AFBF] text-lg sm:text-xl max-w-2xl font-light leading-relaxed">
            {hero.intro}
          </p>
        </div>
      </section>

      <AntalyaGuide guide={guide} />
    </div>
  );
}

