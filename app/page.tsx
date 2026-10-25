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
import { content } from "@/lib/content";
import { RichText } from "@/components/ui/RichText";
import { announcements } from "@/lib/announcements";
import { products, CURRENCY_SYMBOL } from "@/lib/products";
import { PreviousEditions } from "@/components/common/PreviousEditions";
import { ConferenceGallery } from "@/components/common/ConferenceGallery";
import { PartnersSection } from "@/components/common/PartnersSection";
import { Countdown } from "@/components/common/Countdown";

export const metadata: Metadata = {
  title: `${siteConfig.name} — Antalya, Türkiye | Where Europe Meets the Mediterranean`,
  description: siteConfig.shortDescription,
};

export default function HomePage() {
  const pinnedAnnouncement = announcements.find((a) => a.isPinned);
  const featuredProducts = products.slice(0, 3);
  const { hero, countdown, bulletin, dimensions, pillars, destination, delegatePrep, merch, closing } = content.home;
  const dimensionIcons = [Target, Waves, Globe2];
  const pillarIcons = [Globe2, Target, Waves, Landmark];

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
            src={hero.image}
            alt={hero.imageAlt}
            fill
            preload
            quality={60}
            sizes="100vw"
            className="object-cover object-center filter brightness-[0.72] contrast-[1.08] hero-zoom"
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
                {hero.eyebrow}
              </span>
            </div>

            {/* Official EUROXPRO Türkiye Logo Banner */}
            <div className="pt-2">
              <div className="relative w-64 sm:w-80 md:w-96 aspect-[1024/320] drop-shadow-2xl">
                <Image
                  src="/images/euroxpro-logo.png"
                  alt="EUROXPRO Türkiye Official Logo"
                  fill
                  sizes="(max-width: 640px) 256px, (max-width: 768px) 320px, 384px"
                  className="object-contain object-left"
                />
              </div>
            </div>

            {/* Confident Large Display Headline */}
            <div>
              <p className="text-[#A7AFBF] text-xs font-mono tracking-[0.35em] uppercase mb-4 flex items-center gap-2">
                <span className="w-8 h-px bg-[#741F3D]" />
                {hero.kicker}
              </p>
              <h1 className="font-serif-title text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1.06]">
                {hero.titleLine1}
                <br />
                <span className="text-[#F7F3ED] italic font-light">{hero.titleLine2}</span>
              </h1>
            </div>

            {/* Countdown to the opening day */}
            <Countdown
              start={siteConfig.startDate.toISOString()}
              end={siteConfig.endDate.toISOString()}
              labels={countdown}
            />

            {/* Editorial Supporting Line */}
            <div className="space-y-3">
              <p className="text-base sm:text-xl text-[#E5E1DA] font-light max-w-2xl leading-relaxed">
                {hero.supportingLine}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-sm text-[10px] font-mono uppercase tracking-widest text-[#A7AFBF]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#741F3D]" />
                {hero.themeNote}
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
                  {hero.primaryButton} <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/delegate-guide">
                <Button size="lg" variant="outline" className="border-[#E5E1DA]/40 text-[#E5E1DA] hover:bg-white/10 hover:text-white backdrop-blur-sm text-sm font-semibold tracking-wide">
                  {hero.secondaryButton}
                </Button>
              </Link>
              <Link href="/explore-antalya">
                <Button size="lg" variant="ghost" className="text-[#E5E1DA] hover:text-white hover:bg-white/5 text-sm font-semibold tracking-wide">
                  {hero.tertiaryButton}
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
                  {bulletin.label}
                </span>
                <span className="text-sm font-medium truncate text-[#F7F3ED]">
                  {pinnedAnnouncement.title}
                </span>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#F7F3ED]/80 group-hover:text-white font-semibold transition-colors">
                {bulletin.linkText} <ArrowRight size={13} />
              </span>
            </Link>
          </div>
        </section>
      )}

      {/* ── 3. RESEARCH-INFORMED MESSAGING: THE THREE PILLARS (IVORY SECTION) ── */}
      <section className="py-28 bg-[#F7F3ED] text-[#101B35] border-b border-[#E5E1DA] bosphorus-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="reveal max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-[0.25em] text-[#741F3D] uppercase mb-3">
              <span className="w-6 h-px bg-[#741F3D]" />
              {dimensions.eyebrow}
            </div>
            <h2 className="font-serif-title text-4xl sm:text-5xl font-normal leading-[1.12]">
              {dimensions.title}
            </h2>
            <div className="w-12 h-1 bg-[#741F3D] my-4" />
            <p className="text-base sm:text-lg text-[#374151] leading-relaxed font-light">
              {dimensions.intro}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {dimensions.items.map((item, i) => {
              const Icon = dimensionIcons[i % dimensionIcons.length];
              return (
                <div key={i} className="reveal bg-white border border-[#E5E1DA] p-8 rounded-sm shadow-sm flex flex-col justify-between group hover:border-[#741F3D] transition-colors">
                  <div>
                    <div className="w-12 h-12 bg-[#101B35] text-[#741F3D] rounded-sm flex items-center justify-center mb-6">
                      <Icon size={22} />
                    </div>
                    <span className="text-[10px] font-mono tracking-widest text-[#741F3D] uppercase block mb-2">
                      {item.label}
                    </span>
                    <h3 className="font-serif-title text-2xl font-normal text-[#101B35] mb-3">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5A6478] leading-relaxed font-light mb-4">
                      <RichText text={item.text} />
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#E5E1DA]">
                    <span className="text-[11px] font-mono text-[#8F9AA0]">{item.focus}</span>
                  </div>
                </div>
              );
            })}

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
                {pillars.eyebrow}
              </span>
              <h2 className="font-serif-title text-4xl sm:text-5xl font-normal text-white">
                {pillars.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#A7AFBF] max-w-md mt-4 md:mt-0 leading-relaxed font-light">
              {pillars.intro}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.items.map(({ title, desc }, i) => {
              const num = String(i + 1).padStart(2, "0");
              const Icon = pillarIcons[i % pillarIcons.length];
              return (
                <div
                  key={num}
                  className="reveal border border-[#233152] bg-[#172443]/70 p-8 rounded-sm hover:border-[#741F3D] transition-colors duration-300 flex flex-col justify-between group"
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
                      {pillars.cardFooter}
                    </span>
                  </div>
                </div>
                );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. IMAGE-LED GALLERY: CONFERENCES & ANTALYA ── */}
      <ConferenceGallery text={content.gallery} />

      {/* ── 7. PARTNERS & SPONSORSHIP SECTION ── */}
      <PartnersSection />

      {/* ── 8. DESTINATION MAGAZINE FEATURE (ANTALYA SPREAD) ── */}
      <section className="py-28 bg-[#F7F3ED] border-b border-[#E5E1DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="reveal max-w-2xl mb-16">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#741F3D] uppercase block mb-3">
              {destination.eyebrow}
            </span>
            <h2 className="font-serif-title text-4xl sm:text-5xl text-[#101B35] font-normal leading-tight">
              {destination.title}
            </h2>
            <p className="text-sm sm:text-base text-[#5A6478] mt-4 leading-relaxed font-light">
              {destination.intro}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {destination.items.map((item, i) => (
              <div key={i} className="reveal bg-white border border-[#E5E1DA] rounded-sm overflow-hidden group shadow-sm">
                <div className="aspect-[4/3] relative overflow-hidden bg-[#101B35]">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    quality={60}
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover object-center img-zoom"
                  />
                </div>
                <div className="p-6">
                  <span className="text-[10px] font-mono tracking-widest text-[#741F3D] uppercase block mb-1">
                    {item.label}
                  </span>
                  <h3 className="font-serif-title text-xl text-[#101B35] mb-2">{item.title}</h3>
                  <p className="text-xs text-[#5A6478] leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}

          </div>

          <div className="mt-12 text-center">
            <Link href="/explore-antalya">
              <Button variant="secondary" size="lg">
                {destination.buttonText} <ArrowRight size={16} />
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
                {delegatePrep.eyebrow}
              </span>
              <h2 className="font-serif-title text-3xl sm:text-5xl font-normal text-white leading-tight">
                {delegatePrep.title}
              </h2>
              <p className="text-sm sm:text-base text-[#F7F3ED]/90 leading-relaxed font-light max-w-2xl">
                {delegatePrep.text}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
              <Link href="/delegate-guide">
                <Button size="lg" className="w-full bg-white text-[#741F3D] hover:bg-[#F7F3ED] font-semibold text-sm">
                  <BookOpen size={16} /> {delegatePrep.primaryButton}
                </Button>
              </Link>
              <Link href="/delegate-guide#checklist">
                <Button size="lg" variant="outline" className="w-full border-white/40 text-white hover:bg-white/10 text-sm font-semibold">
                  <CheckSquare size={16} /> {delegatePrep.secondaryButton}
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
                {merch.eyebrow}
              </span>
              <h2 className="font-serif-title text-3xl sm:text-4xl text-[#101B35]">
                {merch.title}
              </h2>
            </div>
            <Link href="/merch" className="text-xs font-semibold text-[#741F3D] hover:underline flex items-center gap-1.5 mt-4 sm:mt-0">
              {merch.linkText} <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {featuredProducts.map((p) => (
              <div key={p.id} className="reveal border border-[#E5E1DA] rounded-sm p-6 flex flex-col justify-between hover:border-[#741F3D] transition-colors group">
                <div>
                  <div className="aspect-[4/3] bg-[#F7F3ED] overflow-hidden mb-5 rounded-sm relative">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        quality={60}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-center img-zoom"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag size={32} className="text-[#101B35]" />
                      </div>
                    )}
                    <span className="absolute top-3 right-3 text-[10px] bg-[#101B35]/90 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-sm font-mono">
                      {merch.badge}
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
                    {merch.itemLinkText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. CLOSING CALLOUT & OC SUPPORT ── */}
      <section className="py-24 bg-[#101B35] text-white border-t border-[#233152] relative overflow-hidden bosphorus-grid-dark">
        <div className="reveal max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <span className="text-xs font-mono tracking-widest text-[#741F3D] uppercase block">
            {closing.eyebrow}
          </span>
          <h2 className="font-serif-title text-3xl sm:text-5xl font-normal text-white">
            {closing.title}
          </h2>
          <p className="text-sm sm:text-base text-[#A7AFBF] max-w-xl mx-auto leading-relaxed font-light">
            {closing.text}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/contact">
              <Button size="lg" variant="primary" className="text-sm font-semibold">
                {closing.primaryButton}
              </Button>
            </Link>
            <Link href="/faq">
              <Button size="lg" variant="outline" className="border-[#233152] text-[#E5E1DA] hover:bg-[#172443] text-sm font-semibold">
                {closing.secondaryButton}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
