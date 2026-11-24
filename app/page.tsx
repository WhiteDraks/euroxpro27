import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, Landmark, Mail, Megaphone, MessageCircleQuestion, Plane, type LucideIcon } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { content } from "@/lib/content";
import { announcements } from "@/lib/announcements";
import { formatDate } from "@/lib/utils";
import { Countdown } from "@/components/common/Countdown";
import { EventStructuredData } from "@/components/common/EventStructuredData";

export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.name} — Antalya, Türkiye | 31 March – 4 April 2027`,
  },
  description: siteConfig.shortDescription,
  alternates: { canonical: "/" },
};

// One icon per destination, picked by link so editors can reword freely.
const tileIcons: Record<string, LucideIcon> = {
  "/congress": CalendarDays,
  "/explore-antalya": Landmark,
  "/delegate-guide": Plane,
  "/faq": MessageCircleQuestion,
  "/announcements": Megaphone,
  "/contact": Mail,
};

export default function HomePage() {
  const { hero, countdown, tiles, city, news } = content.home;
  const latest = announcements.slice(0, 3);

  return (
    <div className="pt-16 lg:pt-20">
      <EventStructuredData />

      {/* ── 1. HELLO ── */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6">
        <div className="bg-[#7D1A30] text-[#FBF7F0] rounded-3xl overflow-hidden grid lg:grid-cols-2">
          <div className="relative aspect-[4/3] lg:aspect-auto lg:order-2 min-h-[240px]">
            <Image src={hero.image} alt={hero.imageAlt} fill preload quality={65} sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-center" />
          </div>
          <div className="p-6 sm:p-10 lg:p-14 flex flex-col justify-center">
            <p className="inline-flex self-start rounded-full bg-[#0E0909] text-[#FBF7F0] text-sm font-semibold px-4 py-1.5">
              {siteConfig.datesLabel}
            </p>
            <h1 className="mt-5 text-[3.2rem] sm:text-7xl lg:text-[5.5rem] leading-[0.92]">{hero.title}</h1>
            <p className="mt-4 text-lg sm:text-xl text-[#F4EDE2] max-w-md">{hero.text}</p>

            <div className="mt-7">
              <Countdown start={siteConfig.startDate.toISOString()} end={siteConfig.endDate.toISOString()} labels={countdown} />
            </div>

            <Link
              href="/congress"
              className="mt-8 self-start inline-flex items-center gap-3 rounded-full bg-[#F4EDE2] text-[#140D0E] font-bold text-lg px-7 py-4 hover:bg-[#E8D5B5] transition-colors"
            >
              {hero.button} <ArrowRight size={20} aria-hidden="true" />
            </Link>
          </div>
        </div>
        {hero.themeNote && <p className="mt-3 px-2 text-xs text-[#6B5B55]">{hero.themeNote}</p>}
      </section>

      {/* ── 2. WHAT DO YOU NEED? Big, plain buttons to every part of the site ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl text-[#7D1A30]">{tiles.title}</h2>
        <ul className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {tiles.items.map((t) => {
            const Icon = tileIcons[t.link] ?? ArrowRight;
            return (
              <li key={t.link}>
                <Link
                  href={t.link}
                  className="group h-full flex flex-col rounded-2xl border-2 border-[#7D1A30] bg-[#FBF7F0] p-5 sm:p-7 hover:bg-[#7D1A30] hover:text-[#FBF7F0] transition-colors"
                >
                  <Icon size={34} strokeWidth={2} className="text-[#7D1A30] group-hover:text-[#FBF7F0] transition-colors" aria-hidden="true" />
                  <span className="mt-6 sm:mt-10 font-serif-title text-2xl sm:text-3xl leading-none">{t.title}</span>
                  <span className="mt-2 text-sm sm:text-base text-[#6B5B55] group-hover:text-[#F4EDE2]">{t.text}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── 3. ANTALYA ── */}
      <section className="bg-[#7D1A30] text-[#FBF7F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <h2 className="text-5xl sm:text-6xl lg:text-7xl">{city.title}</h2>
              <p className="mt-3 text-lg text-[#F4EDE2] max-w-md">{city.text}</p>
            </div>
            <Link
              href="/explore-antalya"
              className="self-start sm:self-auto inline-flex items-center gap-3 rounded-full bg-[#F4EDE2] text-[#7D1A30] font-bold px-6 py-3.5 hover:bg-[#E8D5B5] transition-colors"
            >
              {city.button} <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <ul className="mt-10 grid sm:grid-cols-3 gap-4">
            {city.items.map((item, i) => (
              <li key={i}>
                <div className="relative aspect-[4/3] sm:aspect-[3/4] rounded-2xl overflow-hidden bg-[#64142A]">
                  <Image src={item.image} alt={item.imageAlt} fill quality={60} sizes="(max-width: 640px) 100vw, 33vw" className="object-cover object-center" />
                </div>
                <p className="mt-3 font-serif-title text-xl">{item.title}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 4. NEWS ── */}
      {latest.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-4xl sm:text-5xl text-[#7D1A30]">{news.title}</h2>
            <Link href="/announcements" className="font-semibold text-[#7D1A30] link-underline whitespace-nowrap">
              {news.linkText}
            </Link>
          </div>
          <ul className="mt-8 grid md:grid-cols-3 gap-4">
            {latest.map((a) => (
              <li key={a.id}>
                <Link href="/announcements" className="block h-full rounded-2xl bg-[#FBF7F0] border border-[#DCCFBE] p-6 hover:border-[#140D0E] transition-colors">
                  <time dateTime={a.publishedAt} className="text-sm text-[#6B5B55]">{formatDate(a.publishedAt)}</time>
                  <h3 className="mt-2 text-xl leading-snug">{a.title}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
