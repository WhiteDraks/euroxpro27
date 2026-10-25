import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/config";
import { content } from "@/lib/content";
import { RichText } from "@/components/ui/RichText";
import { announcements } from "@/lib/announcements";
import { products, productCategories, CURRENCY_SYMBOL } from "@/lib/products";
import { PreviousEditions } from "@/components/common/PreviousEditions";
import { ConferenceGallery } from "@/components/common/ConferenceGallery";
import { PartnersSection } from "@/components/common/PartnersSection";
import { Countdown } from "@/components/common/Countdown";
import { EventStructuredData } from "@/components/common/EventStructuredData";

export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.name} — Antalya, Türkiye | Where Europe Meets the Mediterranean`,
  },
  description: siteConfig.shortDescription,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const pinnedAnnouncement = announcements.find((a) => a.isPinned);
  const featuredProducts = products.slice(0, 3);
  const { hero, countdown, bulletin, dimensions, pillars, destination, delegatePrep, merch, closing } = content.home;
  const [leadPlace, ...otherPlaces] = destination.items;

  return (
    <div className="flex flex-col min-h-screen">
      <EventStructuredData />

      {/* ── 1. HERO: the photograph of Antalya leads, the type sits on it ── */}
      <section
        className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden bg-[#101B35] text-white"
        aria-label="EUROXPRO'27 in Antalya"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src={hero.image}
            alt={hero.imageAlt}
            fill
            preload
            quality={60}
            sizes="100vw"
            className="object-cover object-center hero-zoom"
          />
          {/* Darken only where the text sits so the photo stays visible. */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1428] via-[#0B1428]/45 to-[#0B1428]/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1428]/70 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pb-10 sm:pb-14">
          <p className="text-sm text-white/85 mb-6 max-w-md">{hero.eyebrow}</p>

          <div className="relative w-44 sm:w-56 aspect-[1024/320] mb-8">
            <Image
              src="/images/euroxpro-logo.png"
              alt="EUROXPRO Türkiye Official Logo"
              fill
              sizes="224px"
              className="object-contain object-left"
            />
          </div>

          <h1 className="font-serif-title font-normal text-[3rem] leading-[0.95] sm:text-7xl lg:text-[7.5rem] lg:leading-[0.92] tracking-[-0.03em] max-w-5xl">
            {hero.titleLine1}
            <br />
            <em className="text-[#F2D7C6]">{hero.titleLine2}</em>
            {hero.themeNote && <sup className="text-2xl sm:text-4xl text-white/70 not-italic align-super">*</sup>}
          </h1>

          <div className="mt-10 sm:mt-14 grid lg:grid-cols-12 gap-8 lg:gap-12 items-end border-t border-white/25 pt-8">
            <div className="lg:col-span-6">
              <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-xl">
                {hero.supportingLine}
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4 mt-7">
                <Link href="/congress">
                  <Button size="lg" variant="primary" className="text-sm font-semibold">
                    {hero.primaryButton} <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link href="/delegate-guide" className="text-sm font-semibold text-white link-underline decoration-white/40 hover:decoration-white">
                  {hero.secondaryButton}
                </Link>
                <Link href="/explore-antalya" className="text-sm font-semibold text-white link-underline decoration-white/40 hover:decoration-white">
                  {hero.tertiaryButton}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 lg:justify-self-end lg:text-right">
              <p className="font-serif-title text-3xl sm:text-4xl leading-tight">{siteConfig.datesLabel}</p>
              <p className="text-white/80 mt-1">{siteConfig.venueCity}</p>
              <div className="mt-5 lg:flex lg:justify-end">
                <Countdown
                  start={siteConfig.startDate.toISOString()}
                  end={siteConfig.endDate.toISOString()}
                  labels={countdown}
                />
              </div>
            </div>
          </div>

          {hero.themeNote && <p className="mt-8 text-xs text-white/60">* {hero.themeNote}</p>}
        </div>
      </section>

      {/* ── 2. LATEST ANNOUNCEMENT ── */}
      {pinnedAnnouncement && (
        <section className="bg-[#741F3D] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/announcements" className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-4 group">
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-white/75 flex-shrink-0">
                {bulletin.label}
              </span>
              <span className="text-sm sm:text-base font-medium flex-1 min-w-0">
                {pinnedAnnouncement.title}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-white/85 group-hover:text-white font-semibold">
                {bulletin.linkText} <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
        </section>
      )}

      {/* ── 3. WHAT EUROXPRO IS ── */}
      <section className="py-20 sm:py-28 bg-[#F7F3ED] text-[#101B35]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="reveal lg:col-span-5 lg:sticky lg:top-28 self-start">
            <p className="kicker mb-4">{dimensions.eyebrow}</p>
            <h2 className="font-serif-title text-[2.25rem] sm:text-5xl lg:text-6xl font-normal leading-[1.02]">
              {dimensions.title}
            </h2>
            <p className="mt-6 text-base sm:text-lg text-[#374151] leading-relaxed">
              {dimensions.intro}
            </p>
          </div>

          <ol className="lg:col-span-7">
            {dimensions.items.map((item, i) => (
              <li key={i} className="reveal border-t border-[#101B35] py-8 sm:py-10 last:pb-0 grid sm:grid-cols-[5rem_1fr] gap-x-6 gap-y-3">
                <span className="font-serif-title italic text-4xl sm:text-5xl text-[#741F3D] leading-none">{i + 1}</span>
                <div>
                  <p className="text-xs uppercase tracking-[0.08em] text-[#5A6478] mb-2">{item.label}</p>
                  <h3 className="font-serif-title text-2xl sm:text-3xl font-normal leading-snug">{item.title}</h3>
                  <p className="mt-3 text-base text-[#4B5563] leading-relaxed">
                    <RichText text={item.text} />
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 4. ANTALYA: one big photograph and two smaller ones ── */}
      <section className="py-20 sm:py-28 bg-white text-[#101B35]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal grid lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-10 sm:mb-14">
            <div className="lg:col-span-7">
              <p className="kicker mb-4">{destination.eyebrow}</p>
              <h2 className="font-serif-title text-[2.25rem] sm:text-5xl lg:text-6xl font-normal leading-[1.02]">
                {destination.title}
              </h2>
            </div>
            <p className="lg:col-span-5 text-base sm:text-lg text-[#4B5563] leading-relaxed">
              {destination.intro}
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
            {leadPlace && (
              <figure className="reveal lg:col-span-7 group">
                <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-auto lg:h-[640px] overflow-hidden bg-[#101B35]">
                  <Image
                    src={leadPlace.image}
                    alt={leadPlace.imageAlt}
                    fill
                    quality={60}
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover object-center img-zoom"
                  />
                </div>
                <figcaption className="mt-4 max-w-lg">
                  <p className="text-xs uppercase tracking-[0.08em] text-[#741F3D]">{leadPlace.label}</p>
                  <h3 className="font-serif-title text-2xl mt-1">{leadPlace.title}</h3>
                  <p className="text-sm text-[#4B5563] leading-relaxed mt-1">{leadPlace.text}</p>
                </figcaption>
              </figure>
            )}

            <div className="lg:col-span-5 grid sm:grid-cols-2 lg:grid-cols-1 gap-8 lg:gap-10">
              {otherPlaces.map((item, i) => (
                <figure key={i} className="reveal group">
                  <div className="relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden bg-[#101B35]">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      quality={60}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                      className="object-cover object-center img-zoom"
                    />
                  </div>
                  <figcaption className="mt-4">
                    <p className="text-xs uppercase tracking-[0.08em] text-[#741F3D]">{item.label}</p>
                    <h3 className="font-serif-title text-xl mt-1">{item.title}</h3>
                    <p className="text-sm text-[#4B5563] leading-relaxed mt-1">{item.text}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="mt-12 border-t border-[#E5E1DA] pt-6">
            <Link href="/explore-antalya" className="inline-flex items-center gap-2 text-base font-semibold text-[#101B35] link-underline decoration-[#741F3D] hover:text-[#741F3D]">
              {destination.buttonText} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. WHAT HAPPENS AT THE CONGRESS ── */}
      <section className="py-20 sm:py-28 bg-[#101B35] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-10 sm:mb-14">
            <div className="lg:col-span-7">
              <p className="kicker text-[#e58aa6] mb-4">{pillars.eyebrow}</p>
              <h2 className="font-serif-title text-[2.25rem] sm:text-5xl lg:text-6xl font-normal leading-[1.02]">
                {pillars.title}
              </h2>
            </div>
            <p className="lg:col-span-5 text-base sm:text-lg text-[#C9CED8] leading-relaxed">
              {pillars.intro}
            </p>
          </div>

          <ol className="border-b border-[#2A3556]">
            {pillars.items.map(({ title, desc }, i) => (
              <li
                key={i}
                className="reveal grid grid-cols-[3rem_1fr] md:grid-cols-[6rem_1fr_1.2fr] gap-x-4 md:gap-x-10 gap-y-2 border-t border-[#2A3556] py-7 sm:py-9"
              >
                <span className="font-serif-title italic text-2xl sm:text-3xl text-[#e58aa6] leading-none tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif-title text-2xl sm:text-3xl font-normal leading-tight">{title}</h3>
                <p className="col-start-2 md:col-start-3 text-base text-[#C9CED8] leading-relaxed">{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 6. PREVIOUS EDITIONS ── */}
      <PreviousEditions />

      {/* ── 7. PHOTOGRAPHS ── */}
      <ConferenceGallery text={content.gallery} />

      {/* ── 8. PARTNERS ── */}
      <PartnersSection />

      {/* ── 9. DELEGATE PREPARATION ── */}
      <section className="bg-[#741F3D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-white/75 mb-4">{delegatePrep.eyebrow}</p>
            <h2 className="font-serif-title text-[2.25rem] sm:text-5xl lg:text-6xl font-normal leading-[1.02]">
              {delegatePrep.title}
            </h2>
            <p className="mt-6 text-base sm:text-lg text-white/85 leading-relaxed max-w-2xl">
              {delegatePrep.text}
            </p>
          </div>
          <ul className="lg:col-span-5 border-t border-white/30">
            {[
              { href: "/delegate-guide", label: delegatePrep.primaryButton },
              { href: "/delegate-guide#checklist", label: delegatePrep.secondaryButton },
            ].map(({ href, label }) => (
              <li key={href} className="border-b border-white/30">
                <Link href={href} className="flex items-center justify-between gap-4 py-5 font-serif-title text-xl sm:text-2xl group">
                  {label}
                  <ArrowRight size={20} className="flex-shrink-0 transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 10. MERCH PREVIEW ── */}
      <section className="py-20 sm:py-28 bg-white text-[#101B35]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
            <div>
              <p className="kicker mb-4">{merch.eyebrow}</p>
              <h2 className="font-serif-title text-[2rem] sm:text-5xl font-normal leading-[1.05]">
                {merch.title}
              </h2>
            </div>
            <Link href="/merch" className="text-sm font-semibold text-[#741F3D] link-underline inline-flex items-center gap-1.5">
              {merch.linkText} <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-x-8 gap-y-12">
            {featuredProducts.map((p) => (
              <Link key={p.id} href="/merch" className="reveal group block">
                <div className="aspect-[4/3] sm:aspect-[4/5] bg-[#EFE9DF] overflow-hidden relative">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      quality={60}
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover object-center img-zoom"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag size={32} className="text-[#101B35]/40" />
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <h3 className="font-serif-title text-xl font-normal group-hover:text-[#741F3D] transition-colors">{p.name}</h3>
                  <span className="text-base text-[#101B35] tabular-nums">{CURRENCY_SYMBOL}{p.price}</span>
                </div>
                <p className="mt-1 text-sm text-[#5A6478]">
                  {productCategories.find((c) => c.id === p.category)?.label ?? p.category}
                  {merch.badge && <> · {merch.badge}</>}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. QUESTIONS ── */}
      <section className="py-20 sm:py-28 bg-[#EFE9DF] text-[#101B35]">
        <div className="reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-8 lg:gap-16 items-end">
          <div className="lg:col-span-8">
            <p className="kicker mb-4">{closing.eyebrow}</p>
            <h2 className="font-serif-title text-[2.25rem] sm:text-6xl lg:text-7xl font-normal leading-[1]">
              {closing.title}
            </h2>
            <p className="mt-6 text-base sm:text-lg text-[#374151] leading-relaxed max-w-2xl">
              {closing.text}
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col items-start gap-5">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="text-sm font-semibold">
                {closing.primaryButton} <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/faq" className="text-sm font-semibold text-[#101B35] link-underline decoration-[#741F3D] hover:text-[#741F3D]">
              {closing.secondaryButton}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
