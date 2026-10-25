import type { Metadata } from "next";
import { AntalyaGuide } from "@/components/antalya/AntalyaGuide";
import { content } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";

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
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        intro={hero.intro}
        image={hero.image}
        imageAlt={hero.imageAlt}
      />

      <AntalyaGuide guide={guide} />
    </div>
  );
}

