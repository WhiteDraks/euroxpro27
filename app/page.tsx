import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, Calendar, MapPin, ShoppingBag,
  BookOpen, ChevronDown, CheckSquare, Globe2,
  Landmark, Waves, Target
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/config";
import { announcements } from "@/lib/announcements";
import { products, CURRENCY_SYMBOL } from "@/lib/products";
import { PreviousEditions } from "@/components/common/PreviousEditions";
import { ConferenceGallery } from "@/components/common/ConferenceGallery";
import { PartnersSection } from "@/components/common/PartnersSection";

export const metadata: Metadata = {
  title: `${siteConfig.name} — Antalya, Türkiye | Where Europe Meets the Mediterranean`,
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
            className="object-cover object-center filter brightness-[0.72] contrast-[1.08] scale-105 transition-transform duration-10000"
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
                AIESEC in Europe Regional Conference · MC Türkiye Host
              </span>
            </div>

            {/* Confident Large Display Headline */}
            <div>
              <p className="text-[#A7AFBF] text-xs font-mono tracking-[0.35em] uppercase mb-4 flex items-center gap-2">
                <span className="w-8 h-px bg-[#741F3D]" />
                EUROXPRO&apos;27
              </p>
              <h1 className="font-serif-title text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1.06]">
                WHERE EUROPE MEETS
                <br />
                <span className="text-[#F7F3ED] italic font-light">THE MEDITERRANEAN.</span>
              </h1>
            </div>

            {/* Editorial Supporting Line */}
            <div className="space-y-3">
              <p className="text-base sm:text-xl text-[#E5E1DA] font-light max-w-2xl leading-relaxed">
                {siteConfig.proposedSupportingLine}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-sm text-[10px] font-mono uppercase tracking-widest text-[#A7AFBF]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#741F3D]" />
                Proposed Creative Direction · Unconfirmed Official Theme
              </div>
            </div>

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
                  Explore Congress Vision <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/delegate-guide">
                <Button size="lg" variant="outline" className="border-[#E5E1DA]/40 text-[#E5E1DA] hover:bg-white/10 hover:text-white backdrop-blur-sm text-sm font-semibold tracking-wide">
                  Delegate Preparation Hub
                </Button>
              </Link>
              <Link href="/explore-antalya">
                <Button size="lg" variant="ghost" className="text-[#E5E1DA] hover:text-white hover:bg-white/5 text-sm font-semibold tracking-wide">
                  Destination Guide &rarr;
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
                  Official Bulletin
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

      {/* ── 3. RESEARCH-INFORMED MESSAGING: THE THREE PILLARS (IVORY SECTION) ── */}
      <section className="py-28 bg-[#F7F3ED] text-[#101B35] border-b border-[#E5E1DA] bosphorus-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-[0.25em] text-[#741F3D] uppercase mb-3">
              <span className="w-6 h-px bg-[#741F3D]" />
              Conference Foundation &amp; Identity
            </div>
            <h2 className="font-serif-title text-4xl sm:text-5xl font-normal leading-[1.12]">
              Three Dimensions Defining EUROXPRO&apos;27
            </h2>
            <div className="w-12 h-1 bg-[#741F3D] my-4" />
            <p className="text-base sm:text-lg text-[#374151] leading-relaxed font-light">
              EUROXPRO is not a holiday or casual gathering; it is the strategic powerhouse of AIESEC in Europe. It combines purpose-driven leadership development, meaningful regional collaboration, and the authentic cultural atmosphere of the Mediterranean.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Pillar 1: Purpose */}
            <div className="bg-white border border-[#E5E1DA] p-8 rounded-sm shadow-sm flex flex-col justify-between group hover:border-[#741F3D] transition-colors">
              <div>
                <div className="w-12 h-12 bg-[#101B35] text-[#741F3D] rounded-sm flex items-center justify-center mb-6">
                  <Target size={22} />
                </div>
                <span className="text-[10px] font-mono tracking-widest text-[#741F3D] uppercase block mb-2">
                  Dimension 01 · Purpose
                </span>
                <h3 className="font-serif-title text-2xl font-normal text-[#101B35] mb-3">
                  Strengthening AIESEC in Europe
                </h3>
                <p className="text-xs sm:text-sm text-[#5A6478] leading-relaxed font-light mb-4">
                  Aligning national leadership teams and local committees on regional priorities. Scaling cross-border exchange opportunities (*Global Volunteer, Global Talent, Global Teacher*) to create real impact.
                </p>
              </div>
              <div className="pt-4 border-t border-[#E5E1DA]">
                <span className="text-[11px] font-mono text-[#8F9AA0]">Focus: Operations &amp; Strategy</span>
              </div>
            </div>

            {/* Pillar 2: Destination */}
            <div className="bg-white border border-[#E5E1DA] p-8 rounded-sm shadow-sm flex flex-col justify-between group hover:border-[#741F3D] transition-colors">
              <div>
                <div className="w-12 h-12 bg-[#101B35] text-[#741F3D] rounded-sm flex items-center justify-center mb-6">
                  <Waves size={22} />
                </div>
                <span className="text-[10px] font-mono tracking-widest text-[#741F3D] uppercase block mb-2">
                  Dimension 02 · Destination
                </span>
                <h3 className="font-serif-title text-2xl font-normal text-[#101B35] mb-3">
                  Antalya: Mediterranean Crossroads
                </h3>
                <p className="text-xs sm:text-sm text-[#5A6478] leading-relaxed font-light mb-4">
                  Where centuries of maritime history meet sweeping sea cliffs, historic Kaleiçi, and the dramatic Taurus mountains. A peerless setting that inspires visionary perspectives and forward momentum.
                </p>
              </div>
              <div className="pt-4 border-t border-[#E5E1DA]">
                <span className="text-[11px] font-mono text-[#8F9AA0]">Focus: Heritage &amp; Inspiration</span>
              </div>
            </div>

            {/* Pillar 3: Experience */}
            <div className="bg-white border border-[#E5E1DA] p-8 rounded-sm shadow-sm flex flex-col justify-between group hover:border-[#741F3D] transition-colors">
              <div>
                <div className="w-12 h-12 bg-[#101B35] text-[#741F3D] rounded-sm flex items-center justify-center mb-6">
                  <Globe2 size={22} />
                </div>
                <span className="text-[10px] font-mono tracking-widest text-[#741F3D] uppercase block mb-2">
                  Dimension 03 · Experience
                </span>
                <h3 className="font-serif-title text-2xl font-normal text-[#101B35] mb-3">
                  Youth Unity &amp; Turkish Hospitality
                </h3>
                <p className="text-xs sm:text-sm text-[#5A6478] leading-relaxed font-light mb-4">
                  Connecting hundreds of young leaders across 50+ countries. Experiencing the legendary warmth of Turkish culture, bilateral synergy, and building lifelong international friendships.
                </p>
              </div>
              <div className="pt-4 border-t border-[#E5E1DA]">
                <span className="text-[11px] font-mono text-[#8F9AA0]">Focus: Culture &amp; Community</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 4. HISTORICAL EDITIONS RETROSPECTIVE (IVORY SECTION) ── */}
      <PreviousEditions />

      {/* ── 5. THE FOUR PILLARS OF REGIONAL IMPACT (NAVY EDITORIAL SECTION) ── */}
      <section className="py-28 bg-[#101B35] text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#741F3D]/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-[#233152] pb-8">
            <div>
              <span className="text-xs font-mono font-semibold tracking-widest text-[#741F3D] uppercase block mb-2">
                Congress Architecture
              </span>
              <h2 className="font-serif-title text-4xl sm:text-5xl font-normal text-white">
                Four Pillars of EUROXPRO&apos;27
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#A7AFBF] max-w-md mt-4 md:mt-0 leading-relaxed font-light">
              Carefully engineered to maximize regional alignment, organizational capacity, leadership growth, and cross-cultural unity.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: "01",
                icon: Globe2,
                title: "Regional Alignment",
                desc: "Bringing together national governing teams (MCs) and local presidents from over 50 entities to align on regional European priorities."
              },
              {
                num: "02",
                icon: Target,
                title: "Exchange Expansion",
                desc: "Scaling operational capacity and delivery standards across Global Volunteer, Global Talent, and Global Teacher programs."
              },
              {
                num: "03",
                icon: Waves,
                title: "Mediterranean Plenaries",
                desc: "Inspiring keynote sessions and external partner symposia hosted along the Turkish Riviera coastline."
              },
              {
                num: "04",
                icon: Landmark,
                title: "Turkish Night & Gala",
                desc: "The celebratory formal evening honoring regional leadership achievements, traditional Turkish cuisine, and cultural folklore."
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
                    Core Conference Area
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. IMAGE-LED GALLERY: CONFERENCES & ANTALYA ── */}
      <ConferenceGallery />

      {/* ── 7. PARTNERS & SPONSORSHIP SECTION ── */}
      <PartnersSection />

      {/* ── 8. DESTINATION MAGAZINE FEATURE (ANTALYA SPREAD) ── */}
      <section className="py-28 bg-[#F7F3ED] border-b border-[#E5E1DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#741F3D] uppercase block mb-3">
              Destination Feature
            </span>
            <h2 className="font-serif-title text-4xl sm:text-5xl text-[#101B35] font-normal leading-tight">
              Antalya: The Host Destination
            </h2>
            <p className="text-sm sm:text-base text-[#5A6478] mt-4 leading-relaxed font-light">
              From the morning citrus scents to the turquoise waves lapping against ancient Roman harbors, Antalya welcomes international delegates with world-class hospitality and breathtaking coastal panoramas.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Feature 1: Kaleiçi */}
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

            {/* Feature 2: Düden */}
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

            {/* Feature 3: Konyaaltı */}
            <div className="bg-white border border-[#E5E1DA] rounded-sm overflow-hidden group shadow-sm">
              <div className="aspect-[4/3] relative overflow-hidden bg-[#101B35]">
                <Image
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                  alt="Konyaaltı Beach and Taurus Mountains"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover object-center img-zoom"
                />
              </div>
              <div className="p-6">
                <span className="text-[10px] font-mono tracking-widest text-[#741F3D] uppercase block mb-1">
                  Alpine &amp; Coastal Panorama
                </span>
                <h3 className="font-serif-title text-xl text-[#101B35] mb-2">Konyaaltı &amp; Taurus Range</h3>
                <p className="text-xs text-[#5A6478] leading-relaxed">
                  Sweeping Mediterranean shoreline framed by snow-capped limestone peaks plunging straight into the azure sea.
                </p>
              </div>
            </div>

          </div>

          <div className="mt-12 text-center">
            <Link href="/explore-antalya">
              <Button variant="secondary" size="lg">
                View Full Antalya Destination &amp; Cultural Guide <ArrowRight size={16} />
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* ── 9. DELEGATE PREPARATION (DEEP BURGUNDY FEATURE STRIP) ── */}
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

      {/* ── 10. MERCHANDISE CAPSULE PREVIEW (DEMO NOTICE) ── */}
      <section className="py-28 bg-white border-t border-[#E5E1DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 border-b border-[#E5E1DA] pb-6">
            <div>
              <span className="text-xs font-mono font-semibold tracking-widest text-[#741F3D] uppercase block mb-1">
                Souvenirs &amp; Memorabilia
              </span>
              <h2 className="font-serif-title text-3xl sm:text-4xl text-[#101B35]">
                Limited-Edition Congress Collection
              </h2>
            </div>
            <Link href="/merch" className="text-xs font-semibold text-[#741F3D] hover:underline flex items-center gap-1.5 mt-4 sm:mt-0">
              Browse full demo storefront <ArrowRight size={14} />
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
                    Configure Pre-Order Interest &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. CLOSING CALLOUT & OC SUPPORT ── */}
      <section className="py-24 bg-[#101B35] text-white border-t border-[#233152] relative overflow-hidden bosphorus-grid-dark">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <span className="text-xs font-mono tracking-widest text-[#741F3D] uppercase block">
            Organizing Committee Secretariat
          </span>
          <h2 className="font-serif-title text-3xl sm:text-5xl font-normal text-white">
            Have Questions Regarding Participation?
          </h2>
          <p className="text-sm sm:text-base text-[#A7AFBF] max-w-xl mx-auto leading-relaxed font-light">
            The EUROXPRO’27 Organizing Committee is actively available to assist national Member Committees, Local Committee presidents, and prospective partners.
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
