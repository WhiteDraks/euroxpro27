import type { Metadata } from "next";
import Image from "next/image";
import { AntalyaGuide } from "@/components/antalya/AntalyaGuide";

export const metadata: Metadata = {
  title: "Explore Antalya — The Mediterranean Host City | EUROXPRO'27",
  description: "A delegate guide to Antalya and the Turkish Riviera: historic Kaleiçi, Düden waterfalls, Taurus mountain panoramas, Mediterranean gastronomy, and transport routes.",
};

export default function ExploreAntalyaPage() {
  return (
    <div className="pt-20">
      {/* ── EDITORIAL TRAVEL MAGAZINE HERO ── */}
      <section className="relative min-h-[55vh] flex items-center bg-[#101B35] text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bosphorus-grid-dark">
        {/* Full-bleed scenic Antalya Mediterranean background */}
        <div className="absolute inset-0 z-0 opacity-35">
          <Image
            src="https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=2400&q=85"
            alt="Antalya Mediterranean coastline, cliffs, and ancient Roman harbor"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center filter brightness-95"
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
            Explore Antalya
          </h1>
          <p className="mt-4 text-[#A7AFBF] text-lg sm:text-xl max-w-2xl font-light leading-relaxed">
            Where the azure Mediterranean touches the soaring peaks of the Taurus Mountains. An editorial delegate guide to ancient Roman harbors, clifftop waterfalls, and the rich culinary heritage of the Turkish Riviera.
          </p>
        </div>
      </section>

      <AntalyaGuide />
    </div>
  );
}

