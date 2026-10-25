import type { Metadata } from "next";
import Image from "next/image";
import { IstanbulGuide } from "@/components/istanbul/IstanbulGuide";

export const metadata: Metadata = {
  title: "Explore Istanbul — The Transcontinental Host City",
  description: "A delegate guide to Istanbul: must-see Byzantine and Ottoman landmarks, Turkish culinary culture, language essentials, and city transport maps.",
};

export default function ExploreIstanbulPage() {
  return (
    <div className="pt-20">
      {/* ── EDITORIAL TRAVEL MAGAZINE HERO ── */}
      <section className="relative min-h-[55vh] flex items-center bg-[#101B35] text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bosphorus-grid-dark">
        {/* Full-bleed scenic Bosphorus background */}
        <div className="absolute inset-0 z-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=2000&q=80"
            alt="Bosphorus strait and Ortaköy Mosque at twilight"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center filter brightness-90"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#101B35] via-[#101B35]/85 to-[#101B35]/65 z-0" />
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#741F3D]/25 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-[0.25em] text-[#741F3D] uppercase mb-4">
            <span className="w-8 h-px bg-[#741F3D]" />
            Host Destination Feature
          </div>
          <h1 className="font-serif-title font-normal text-4xl sm:text-6xl lg:text-7xl text-white max-w-4xl leading-tight">
            Explore Istanbul
          </h1>
          <p className="mt-4 text-[#A7AFBF] text-lg sm:text-xl max-w-2xl font-light leading-relaxed">
            Where continents meet and civilizations converge. An editorial guide to historical landmarks, culinary rituals, and the living pulse of Türkiye’s cultural capital.
          </p>
        </div>
      </section>

      <IstanbulGuide />
    </div>
  );
}
