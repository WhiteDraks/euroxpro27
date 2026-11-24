import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/config";
import { content } from "@/lib/content";
import { RichText } from "@/components/ui/RichText";
import { announcements } from "@/lib/announcements";
import { products, productCategories, CURRENCY_SYMBOL } from "@/lib/products";
import { formatDate } from "@/lib/utils";
import { PreviousEditions } from "@/components/common/PreviousEditions";
import { ConferenceGallery } from "@/components/common/ConferenceGallery";
import { PartnersSection } from "@/components/common/PartnersSection";
import { EventStructuredData } from "@/components/common/EventStructuredData";
import { HorizonHero } from "@/components/home/HorizonHero";

export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.name} — Antalya, Türkiye | Where Europe Meets the Mediterranean`,
  },
  description: siteConfig.shortDescription,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const latest = announcements.slice(0, 3);
  const featuredProducts = products.slice(0, 3);
  const { hero, countdown, news, dimensions, pillars, destination, delegatePrep, merch, closing } = content.home;
  const [leadPlace, ...otherPlaces] = destination.items;

  return (
    <div className="flex flex-col">
      <EventStructuredData />

      {/* ── 1. HERO: the sun setting into 2027 over Antalya ── */}
      <HorizonHero hero={hero} countdown={countdown} />

      {/* ── 2. ARRIVAL: the city itself ── */}
      <figure className="relative bg-[#140D0E]">
        <div className="relative h-[62vh] min-h-[360px] max-h-[760px]">
          <Image
            src={hero.image}
            alt={hero.imageAlt}
            fill
            preload
            quality={65}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        {hero.photoCaption && (
          <figcaption className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-[#D6C8BC]">
            {hero.photoCaption}
          </figcaption>
        )}
      </figure>

      {/* ── 3. WHAT EUROXPRO IS ── */}
      <section className="py-20 sm:py-28 bg-[#FBF7F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-6">
            <h2 className="text-[2.6rem] sm:text-6xl lg:text-7xl leading-[0.95]">{dimensions.title}</h2>
            <p className="mt-6 text-lg text-[#374151] leading-relaxed max-w-xl">{dimensions.intro}</p>
          </div>
          <ul className="lg:col-span-6 lg:pt-3 space-y-8">
            {dimensions.items.map((item, i) => (
              <li key={i} className="border-l-4 border-[#7D1A30] pl-5">
                <h3 className="text-2xl sm:text-3xl">{item.title}</h3>
                <p className="mt-2 text-base text-[#4B5563] leading-relaxed max-w-lg">
                  <RichText text={item.text} />
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 4. WHAT THE WEEK IS BUILT AROUND ── */}
      <section className="py-20 sm:py-24 bg-[#ECE1D1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10 sm:mb-12">
            <h2 className="text-[2.4rem] sm:text-5xl lg:text-6xl leading-[0.95]">{pillars.title}</h2>
            <p className="mt-4 text-lg text-[#374151] leading-relaxed">{pillars.intro}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#CDBDA8] border border-[#CDBDA8]">
            {pillars.items.map(({ title, desc }, i) => (
              <div key={i} className="bg-[#ECE1D1] p-6 sm:p-7">
                <h3 className="text-2xl leading-tight">{title}</h3>
                <p className="mt-3 text-[15px] text-[#374151] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <Link href="/congress#schedule" className="inline-block mt-8 text-base font-semibold text-[#140D0E] link-underline decoration-[#7D1A30] hover:text-[#7D1A30]">
            See the congress page
          </Link>
        </div>
      </section>

      {/* ── 5. ANTALYA ── */}
      <section className="py-20 sm:py-28 bg-[#FBF7F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-10 sm:mb-14">
            <h2 className="lg:col-span-7 text-[2.6rem] sm:text-6xl lg:text-7xl leading-[0.95]">{destination.title}</h2>
            <p className="lg:col-span-5 text-lg text-[#4B5563] leading-relaxed">{destination.intro}</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
            {leadPlace && (
              <figure className="lg:col-span-7">
                <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-auto lg:h-[620px] overflow-hidden rounded-xl bg-[#140D0E]">
                  <Image src={leadPlace.image} alt={leadPlace.imageAlt} fill quality={60} sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover object-center" />
                </div>
                <figcaption className="mt-4 max-w-lg">
                  <h3 className="text-2xl">{leadPlace.title}</h3>
                  <p className="text-[15px] text-[#4B5563] leading-relaxed mt-1">{leadPlace.text}</p>
                </figcaption>
              </figure>
            )}
            <div className="lg:col-span-5 grid sm:grid-cols-2 lg:grid-cols-1 gap-8 lg:gap-10">
              {otherPlaces.map((item, i) => (
                <figure key={i}>
                  <div className="relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden rounded-xl bg-[#140D0E]">
                    <Image src={item.image} alt={item.imageAlt} fill quality={60} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw" className="object-cover object-center" />
                  </div>
                  <figcaption className="mt-4">
                    <h3 className="text-xl sm:text-2xl">{item.title}</h3>
                    <p className="text-[15px] text-[#4B5563] leading-relaxed mt-1">{item.text}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <Link href="/explore-antalya">
              <Button size="lg" variant="outline">{destination.buttonText}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. BEFORE YOU FLY ── */}
      <section className="bg-[#140D0E] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <div className="lg:col-span-6">
            <h2 className="text-[2.6rem] sm:text-6xl lg:text-7xl leading-[0.95]">{delegatePrep.title}</h2>
            <p className="mt-6 text-lg text-[#E9DED2] leading-relaxed max-w-xl">{delegatePrep.text}</p>
          </div>
          <ul className="lg:col-span-6 border-t border-white/25">
            {[
              { href: "/delegate-guide", label: delegatePrep.primaryButton },
              { href: "/delegate-guide#checklist", label: delegatePrep.secondaryButton },
              { href: "/faq#travel", label: delegatePrep.tertiaryButton },
            ].filter((l) => l.label).map(({ href, label }) => (
              <li key={href} className="border-b border-white/25">
                <Link href={href} className="flex items-center justify-between gap-4 py-5 font-serif-title text-2xl sm:text-3xl hover:text-[#E0647D] transition-colors">
                  {label}
                  <span aria-hidden="true" className="text-[#E0647D] text-base font-sans-body font-semibold">Open</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 7. NEWS ── */}
      {latest.length > 0 && (
        <section className="py-20 sm:py-24 bg-[#FBF7F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <h2 className="text-[2.4rem] sm:text-5xl lg:text-6xl leading-[0.95]">{news.title}</h2>
              <Link href="/announcements" className="text-base font-semibold text-[#7D1A30] link-underline">
                {news.linkText}
              </Link>
            </div>
            <ul className="border-t-2 border-[#140D0E]">
              {latest.map((a) => (
                <li key={a.id} className="border-b border-[#DCCFBE]">
                  <Link href="/announcements" className="grid md:grid-cols-12 gap-x-8 gap-y-2 py-6 group">
                    <time dateTime={a.publishedAt} className="md:col-span-3 text-sm text-[#6B5B55] tabular-nums pt-1">
                      {formatDate(a.publishedAt)}
                    </time>
                    <div className="md:col-span-9">
                      <h3 className="text-2xl group-hover:text-[#7D1A30] transition-colors">{a.title}</h3>
                      <p className="mt-2 text-[15px] text-[#4B5563] leading-relaxed max-w-3xl line-clamp-2">{a.summary}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── 8. PREVIOUS EDITIONS ── */}
      <PreviousEditions />

      {/* ── 9. PHOTOGRAPHS ── */}
      <ConferenceGallery text={content.gallery} />

      {/* ── 10. PARTNERS ── */}
      <PartnersSection />

      {/* ── 11. MERCH ── */}
      <section className="py-20 sm:py-24 bg-[#FBF7F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <h2 className="text-[2.4rem] sm:text-5xl leading-[0.95]">{merch.title}</h2>
            <Link href="/merch" className="text-base font-semibold text-[#7D1A30] link-underline">
              {merch.linkText}
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-x-8 gap-y-10">
            {featuredProducts.map((p) => (
              <Link key={p.id} href="/merch" className="group block">
                <div className="aspect-[4/3] sm:aspect-square bg-[#ECE1D1] overflow-hidden relative rounded-lg">
                  {p.image ? (
                    <Image src={p.image} alt={p.name} fill quality={60} sizes="(max-width: 640px) 100vw, 33vw" className="object-cover object-center" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag size={32} className="text-[#140D0E]/40" />
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <h3 className="text-xl group-hover:text-[#7D1A30] transition-colors">{p.name}</h3>
                  <span className="text-base font-semibold tabular-nums">{CURRENCY_SYMBOL}{p.price}</span>
                </div>
                <p className="mt-1 text-sm text-[#6B5B55]">
                  {productCategories.find((c) => c.id === p.category)?.label ?? p.category}
                  {merch.badge && <>, {merch.badge}</>}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. QUESTIONS ── */}
      <section className="py-20 sm:py-24 bg-[#ECE1D1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-8 lg:gap-16 items-end">
          <div className="lg:col-span-8">
            <h2 className="text-[2.6rem] sm:text-6xl lg:text-7xl leading-[0.95]">{closing.title}</h2>
            <p className="mt-6 text-lg text-[#374151] leading-relaxed max-w-2xl">{closing.text}</p>
          </div>
          <div className="lg:col-span-4 flex flex-wrap items-center gap-x-6 gap-y-4 lg:justify-end">
            <Link href="/contact">
              <Button size="lg" variant="secondary">{closing.primaryButton}</Button>
            </Link>
            <Link href="/faq" className="text-base font-semibold text-[#140D0E] link-underline decoration-[#7D1A30]">
              {closing.secondaryButton}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
