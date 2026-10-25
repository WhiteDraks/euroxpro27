import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, Calendar, MapPin, ShoppingBag,
  BookOpen, ChevronDown, CheckSquare, Globe2,
  Users2, Landmark, Waves
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/config";
import { announcements } from "@/lib/announcements";
import { products, CURRENCY_SYMBOL } from "@/lib/products";

export const metadata: Metadata = {
  title: `${siteConfig.name} — Antalya, Türkiye | 31 March – 4 April 2027`,
  description: siteConfig.shortDescription,
};

export default function HomePage() {
  const pinnedAnnouncement = announcements.find((a) => a.isPinned);
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── 1. CINEMATIC FULL-SCREEN HERO WITH REAL ANTALYA PHOTOGRAPHY ── */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#101B35] text-white pt-24 pb-20"
        aria-label="Congress Hero"
      >
        {/* Full-bleed high-resolution Antalya Mediterranean background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=2400&q=85"
            alt="Antalya Mediterranean coastline and historic Roman harbor"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center filter brightness-[0.75] contrast-[1.08] scale-105 transition-transform duration-10000"
          />
          {/* Deep Navy & Midnight Tonal Gradient Overlays for High Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#101B35] via-[#101B35]/75 to-[#101B35]/50 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101B35] via-[#101B35]/80 to-transparent" />
          {/* Subtle burgundy ambient warmth */}
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-[#741F3D]/25 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute -bottom-20 left-10 w-[500px] h-[500px] bg-[#51152D]/30 rounded-full blur-[130px] pointer-events-none" />
          {/* Subtle architectural grid watermark */}
          <div className="absolute inset-0 bosphorus-grid-dark opacity-40 pointer-events-none" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
          <div className="max-w-4xl space-y-8">
            
            {/* Top Eyebrow Tag */}
            <div className="inline-flex items-center gap-3 px-4 py-2 border border-[#233152] bg-[#101B35]/80 backdrop-blur-md rounded-sm">
              <span className="w-2 h-2 rounded-full bg-[#741F3D] animate-pulse" />
              <span className="text-[11px] font-mono tracking-[0.28em] text-[#E5E1DA] uppercase">
                International AIESEC Congress · Antalya, Türkiye
              </span>
            </div>

            {/* Confident Large Display Headline */}
            <div>
              <p className="text-[#A7AFBF] text-xs font-mono tracking-[0.35em] uppercase mb-4 flex items-center gap-2">
                <span className="w-8 h-px bg-[#741F3D]" />
                EUROXPRO&apos;27
              </p>
              <h1 className="font-serif-title text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-white leading-[1.03]">
                ONE HORIZON.
                <br />
                <span className="text-[#F7F3ED] italic font-light">DIFFERENT PERSPECTIVES.</span>
                <br />
                <span className="text-[#741F3D] font-bold">ONE SHARED FUTURE.</span>
              </h1>
            </div>

            {/* Editorial Lead In */}
            <p className="text-base sm:text-xl text-[#E5E1DA] font-light max-w-2xl leading-relaxed">
              Where the azure Mediterranean meets the dramatic Taurus Mountains. Hundreds of ambitious European youth leaders converging for a defining congress of dialogue, cross-border development, and lasting unity.
            </p>

            {/* Date & Location Badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#172443]/90 border border-[#233152] rounded-sm text-[#E5E1DA] backdrop-blur-sm">
                <Calendar size={14} className="text-[#741F3D]" />
                <span>{siteConfig.datesLabel}</span>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#172443]/90 border border-[#233152] rounded-sm text-[#E5E1DA] backdrop-blur-sm">
                <MapPin size={14} className="text-[#741F3D]" />
                <span>{siteConfig.venueCity}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/congress">
                <Button size="lg" variant="primary" className="shadow-xl shadow-[#741F3D]/30 text-sm font-semibold tracking-wide">
                  Explore Congress Agenda <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/delegate-guide">
                <Button size="lg" variant="outline" className="border-[#E5E1DA]/40 text-[#E5E1DA] hover:bg-white/10 hover:text-white backdrop-blur-sm text-sm font-semibold tracking-wide">
                  Delegate Preparation Guide
                </Button>
              </Link>
            </div>

          </div>
        </div>

        {/* Animated Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-80 pointer-events-none">
          <span className="text-[10px] text-[#A7AFBF] tracking-[0.3em] uppercase font-mono">Scroll</span>
          <div className="animate-scroll-bounce">
            <ChevronDown size={18} className="text-[#741F3D]" />
          </div>
        </div>
      </section>

      {/* ── 2. PINNED OFFICIAL NOTICE TICKER ── */}
      {pinnedAnnouncement && (
        <section className="bg-[#741F3D] text-white py-3.5 border-y border-[#51152D] relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/announcements" className="flex items-center justify-between gap-4 group">
              <div className="flex items-center gap-3 min-w-0">
                <span className="px-2 py-0.5 bg-white text-[#741F3D] text-[10px] font-bold tracking-wider uppercase rounded-sm flex-shrink-0">
                  Official Update
                </span>
                <span className="text-sm font-medium truncate text-[#F7F3ED]">
                  {pinnedAnnouncement.title}
                </span>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#F7F3ED]/80 group-hover:text-white font-semibold transition-colors">
                Read communiqué <ArrowRight size={13} />
              </span>
            </Link>
          </div>
        </section>
      )}

      {/* ── 3. EDITORIAL MANIFESTO: THE MEDITERRANEAN CROSSROADS ── */}
      <section className="py-28 bg-[#F7F3ED] text-[#101B35] border-b border-[#E5E1DA] bosphorus-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-[0.25em] text-[#741F3D] uppercase">
                <span className="w-6 h-px bg-[#741F3D]" />
                The Congress Philosophy
              </div>
              <h2 className="font-serif-title text-4xl sm:text-5xl font-normal leading-[1.12]">
                Where Mediterranean Horizons Inspire Tomorrow’s Leadership
              </h2>
              <div className="w-12 h-1 bg-[#741F3D]" />
              <p className="text-base sm:text-lg text-[#374151] leading-relaxed font-light">
                For millennia, the Mediterranean coast of Antalya has stood as the crossroads of seafaring civilizations, cultural dialogue, and enduring ideas. EUROXPRO’27 channels this timeless coastal energy to create an extraordinary gathering distinct from standard conference halls.
              </p>
              <p className="text-sm text-[#5A6478] leading-relaxed">
                Over five transformative days, delegates will participate in rigorous plenary discussions, skill-building breakout tracks, and profound cultural exchanges tailored to strengthen local committees across the international network.
              </p>
              <div className="pt-2">
                <Link href="/congress">
                  <Button variant="secondary" size="md">
                    Read Congress Vision &amp; Pillars <ArrowRight size={15} />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Asymmetrical Photography Composition */}
            <div className="lg:col-span-6 relative">
              <div className="relative border border-[#E5E1DA] bg-white p-3 sm:p-4 rounded-sm shadow-xl group">
                <div className="aspect-[4/3] relative overflow-hidden rounded-sm bg-[#101B35]">
                  <Image
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
                    alt="Antalya Mediterranean cliffs and coastline"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center img-zoom"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101B35]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] font-mono tracking-widest text-[#E5E1DA] uppercase block">
                      Mediterranean Coast · Antalya Riviera
                    </span>
                    <p className="font-serif-title text-lg font-normal">Classical Pamphylian &amp; Mediterranean Heritage</p>
                  </div>
                </div>
              </div>

              {/* Overlapping Floating Detail Card */}
              <div className="hidden sm:block absolute -bottom-8 -left-8 bg-[#101B35] text-white p-6 rounded-sm border border-[#233152] shadow-2xl max-w-xs">
                <span className="text-[10px] font-mono tracking-widest text-[#741F3D] uppercase block mb-1">
                  Riviera Dimension
                </span>
                <p className="text-xs text-[#E5E1DA] font-serif-title italic leading-relaxed">
                  &ldquo;Where the turquoise sea meets towering peaks, inspiring leaders who bridge cultures.&rdquo;
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. THE FOUR PILLARS (DEEP NAVY EDITORIAL SECTION) ── */}
      <section className="py-28 bg-[#101B35] text-white relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#741F3D]/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-[#233152] pb-8">
            <div>
              <span className="text-xs font-mono font-semibold tracking-widest text-[#741F3D] uppercase block mb-2">
                Congress Architecture
              </span>
              <h2 className="font-serif-title text-4xl sm:text-5xl font-normal text-white">
                The Four Pillars of EUROXPRO&apos;27
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#A7AFBF] max-w-md mt-4 md:mt-0 leading-relaxed font-light">
              Structured to maximize delegate learning, peer networking, leadership capability, and unforgettable memories.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: "01",
                icon: Globe2,
                title: "Pan-European Gathering",
                desc: "Connecting local committee presidents, vice presidents, and alumni from dozens of European territories."
              },
              {
                num: "02",
                icon: Users2,
                title: "Impact Workshops",
                desc: "Action-oriented parallel breakout tracks focusing on operational resilience, marketing, and leadership."
              },
              {
                num: "03",
                icon: Waves,
                title: "Mediterranean Forum",
                desc: "Plenary discussions and leadership symposia overlooking the turquoise waters of the Turkish Riviera."
              },
              {
                num: "04",
                icon: Landmark,
                title: "Turkish Night Gala",
                desc: "The celebratory signature gala highlighting authentic Turkish cuisine, regional rhythms, and traditional attire."
              }
            ].map(({ num, icon: Icon, title, desc }) => (
              <div
                key={num}
                className="border border-[#233152] bg-[#172443]/70 p-8 rounded-sm hover:border-[#741F3D] transition-colors duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-2xl font-bold text-[#741F3D]">{num}</span>
                    <div className="w-9 h-9 bg-[#101B35] border border-[#233152] rounded-sm flex items-center justify-center text-[#E5E1DA] group-hover:text-[#741F3D] transition-colors">
                      <Icon size={16} />
                    </div>
                  </div>
                  <h3 className="font-serif-title text-xl text-white font-normal mb-3">{title}</h3>
                  <p className="text-xs text-[#A7AFBF] leading-relaxed font-light">{desc}</p>
                </div>
                <div className="pt-6 border-t border-[#233152] mt-6">
                  <span className="text-[10px] font-mono tracking-widest text-[#E5E1DA] uppercase">
                    Core Experience
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. DESTINATION MAGAZINE FEATURE (ANTALYA SPREAD) ── */}
      <section className="py-28 bg-[#F7F3ED] border-b border-[#E5E1DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#741F3D] uppercase block mb-3">
              Destination Magazine Feature
            </span>
            <h2 className="font-serif-title text-4xl sm:text-5xl text-[#101B35] font-normal leading-tight">
              The Turkish Riviera: An Unrivaled Host Destination
            </h2>
            <p className="text-sm sm:text-base text-[#5A6478] mt-4 leading-relaxed font-light">
              From the morning citrus scents of orange groves to the turquoise waves lapping against ancient Roman harbors, Antalya welcomes international delegates with world-class hospitality and breathtaking coastal panoramas.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Feature 1: Kaleiçi Roman Marina */}
            <div className="bg-white border border-[#E5E1DA] rounded-sm overflow-hidden group shadow-sm">
              <div className="aspect-[4/3] relative overflow-hidden bg-[#101B35]">
                <Image
                  src="https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80"
                  alt="Kaleiçi Roman marina in Antalya"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover object-center img-zoom"
                />
              </div>
              <div className="p-6">
                <span className="text-[10px] font-mono tracking-widest text-[#741F3D] uppercase block mb-1">
                  Historic Walled Quarter
                </span>
                <h3 className="font-serif-title text-xl text-[#101B35] mb-2">Kaleiçi &amp; Roman Marina</h3>
                <p className="text-xs text-[#5A6478] leading-relaxed">
                  Restored Ottoman mansions and ancient stone bastions looking out over classical Roman sailing harbors.
                </p>
              </div>
            </div>

            {/* Feature 2: Düden Coastal Waterfalls */}
            <div className="bg-white border border-[#E5E1DA] rounded-sm overflow-hidden group shadow-sm">
              <div className="aspect-[4/3] relative overflow-hidden bg-[#101B35]">
                <Image
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
                  alt="Düden Waterfalls cascading into Mediterranean sea"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover object-center img-zoom"
                />
              </div>
              <div className="p-6">
                <span className="text-[10px] font-mono tracking-widest text-[#741F3D] uppercase block mb-1">
                  Natural Wonder
                </span>
                <h3 className="font-serif-title text-xl text-[#101B35] mb-2">Düden Coastal Cascades</h3>
                <p className="text-xs text-[#5A6478] leading-relaxed">
                  Spectacular cascades tumbling 40 meters directly from clifftop gardens into azure Mediterranean waters.
                </p>
              </div>
            </div>

            {/* Feature 3: Youth Collaboration */}
            <div className="bg-white border border-[#E5E1DA] rounded-sm overflow-hidden group shadow-sm">
              <div className="aspect-[4/3] relative overflow-hidden bg-[#101B35]">
                <Image
                  src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80"
                  alt="Young leaders collaborating in an international congress"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover object-center img-zoom"
                />
              </div>
              <div className="p-6">
                <span className="text-[10px] font-mono tracking-widest text-[#741F3D] uppercase block mb-1">
                  Youth Collaboration
                </span>
                <h3 className="font-serif-title text-xl text-[#101B35] mb-2">Global Community</h3>
                <p className="text-xs text-[#5A6478] leading-relaxed">
                  A dynamic, supportive environment where lifelong friendships and cross-cultural leadership networks are forged.
                </p>
              </div>
            </div>

          </div>

          <div className="mt-12 text-center">
            <Link href="/explore-antalya">
              <Button variant="secondary" size="lg">
                View Full Antalya City &amp; Culture Guide <ArrowRight size={16} />
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* ── 6. DELEGATE PREPARATION (DEEP BURGUNDY FEATURE STRIP) ── */}
      <section className="py-24 bg-gradient-to-r from-[#51152D] via-[#741F3D] to-[#51152D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#F7F3ED]/80 uppercase block">
                Delegate Preparedness
              </span>
              <h2 className="font-serif-title text-3xl sm:text-5xl font-normal text-white leading-tight">
                Preparing for Your Journey to Antalya
              </h2>
              <p className="text-sm sm:text-base text-[#F7F3ED]/90 leading-relaxed font-light max-w-2xl">
                Access verified entry requirements, official Turkish e-Visa links, Antalya Airport transit options (AYT), currency guidance, and an interactive packing checklist stored directly in your browser.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
              <Link href="/delegate-guide">
                <Button size="lg" className="w-full bg-white text-[#741F3D] hover:bg-[#F7F3ED] font-semibold text-sm">
                  <BookOpen size={16} /> Open Delegate Handbook
                </Button>
              </Link>
              <Link href="/delegate-guide#checklist">
                <Button size="lg" variant="outline" className="w-full border-white/40 text-white hover:bg-white/10 text-sm font-semibold">
                  <CheckSquare size={16} /> Interactive Packing Checklist
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── 7. MERCHANDISE CAPSULE PREVIEW ── */}
      <section className="py-28 bg-white border-t border-[#E5E1DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 border-b border-[#E5E1DA] pb-6">
            <div>
              <span className="text-xs font-mono font-semibold tracking-widest text-[#741F3D] uppercase block mb-1">
                Official Souvenirs
              </span>
              <h2 className="font-serif-title text-3xl sm:text-4xl text-[#101B35]">
                Limited-Edition Congress Collection
              </h2>
            </div>
            <Link href="/merch" className="text-xs font-semibold text-[#741F3D] hover:underline flex items-center gap-1.5 mt-4 sm:mt-0">
              Browse full storefront <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {featuredProducts.map((p) => (
              <div key={p.id} className="border border-[#E5E1DA] rounded-sm p-6 flex flex-col justify-between hover:border-[#741F3D] transition-colors group">
                <div>
                  <div className="aspect-[4/3] bg-[#F7F3ED] overflow-hidden mb-5 rounded-sm relative">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-center img-zoom"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag size={32} className="text-[#101B35]" />
                      </div>
                    )}
                    <span className="absolute top-3 right-3 text-[10px] bg-[#101B35]/90 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-sm font-mono">
                      Sample Preview
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8F9AA0] uppercase font-mono tracking-wider block mb-1">
                    {p.category}
                  </span>
                  <h3 className="font-serif-title text-lg text-[#101B35] font-normal mb-2">{p.name}</h3>
                  <p className="text-xs text-[#5A6478] line-clamp-2 leading-relaxed mb-4">{p.description}</p>
                </div>
                <div className="pt-4 border-t border-[#E5E1DA] flex items-center justify-between">
                  <span className="font-bold text-[#741F3D] text-sm">{CURRENCY_SYMBOL}{p.price}</span>
                  <Link href="/merch" className="text-xs text-[#101B35] hover:text-[#741F3D] font-semibold">
                    Configure Pre-Order &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. CLOSING ARCHITECTURAL BANNER ── */}
      <section className="py-24 bg-[#101B35] text-white border-t border-[#233152] relative overflow-hidden bosphorus-grid-dark">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <span className="text-xs font-mono tracking-widest text-[#741F3D] uppercase block">
            The Organizing Committee
          </span>
          <h2 className="font-serif-title text-3xl sm:text-5xl font-normal text-white">
            Have Questions Regarding Participation?
          </h2>
          <p className="text-sm sm:text-base text-[#A7AFBF] max-w-xl mx-auto leading-relaxed font-light">
            The EUROXPRO’27 Organizing Committee is actively available to assist national delegates, local committee presidents, and international participants.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/contact">
              <Button size="lg" variant="primary" className="text-sm font-semibold">
                Contact Organizing Committee
              </Button>
            </Link>
            <Link href="/faq">
              <Button size="lg" variant="outline" className="border-[#233152] text-[#E5E1DA] hover:bg-[#172443] text-sm font-semibold">
                Browse FAQ
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
