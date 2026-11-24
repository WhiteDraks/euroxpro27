import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, ChevronRight, Landmark, Mail, Megaphone, MessageCircleQuestion, Plane, type LucideIcon } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { content } from "@/lib/content";
import { announcements } from "@/lib/announcements";
import { formatDate, cn } from "@/lib/utils";
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

const tickerWords = [siteConfig.name, "Antalya, Türkiye", siteConfig.datesLabel, "AIESEC in Europe", "Mediterranean"];

export default function HomePage() {
  const { hero, countdown, tiles, city, news } = content.home;
  const latest = announcements.slice(0, 3);

  return (
    <div className="pt-14 lg:pt-16 bg-black text-[#FBF7F0]">
      <EventStructuredData />

      {/* ── 1. HELLO: large title over a slow burgundy light ── */}
      <section className="relative">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="glow absolute left-1/2 top-[-160px] h-[680px] w-[1000px] max-w-none -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,#A3304A_0%,#7D1A30_38%,rgba(125,26,48,0.3)_62%,transparent_100%)]" />
          <div className="drift-a absolute left-[8%] top-[10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(224,100,125,0.35),transparent)] blur-2xl" />
          <div className="drift-b absolute right-[6%] top-[28%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(closest-side,rgba(100,20,42,0.7),transparent)] blur-2xl" />
          <div className="grid-floor absolute left-1/2 top-[300px] sm:top-[360px] h-[520px] w-[220%] sm:w-[160%] -translate-x-1/2" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 lg:pt-24 text-center flex flex-col items-center">
          <p className="rise glass inline-flex rounded-full text-sm font-semibold px-4 py-1.5">{siteConfig.datesLabel}</p>
          <h1 className="rise rise-2 title-gradient mt-6 text-[3.4rem] sm:text-8xl lg:text-[8.5rem] leading-[0.9] tracking-[-0.045em]">
            {hero.title}
          </h1>
          <p className="rise rise-3 mt-5 text-lg sm:text-2xl text-[#F4EDE2]/85 max-w-xl">{hero.text}</p>

          <div className="rise rise-4 mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              href="/congress"
              className="sheen inline-flex items-center justify-center gap-2 rounded-full bg-[#F4EDE2] text-[#7D1A30] font-semibold text-[17px] px-7 h-[52px] hover:bg-white transition-colors"
            >
              {hero.button} <ArrowRight size={19} aria-hidden="true" />
            </Link>
            <Link
              href="/delegate-guide"
              className="glass inline-flex items-center justify-center rounded-full font-semibold text-[17px] px-7 h-[52px] hover:bg-white/15 transition-colors"
            >
              {tiles.items.find((t) => t.link === "/delegate-guide")?.title ?? "Travel guide"}
            </Link>
          </div>

          <div className="rise rise-5 mt-10 w-full flex justify-center">
            <Countdown start={siteConfig.startDate.toISOString()} end={siteConfig.endDate.toISOString()} labels={countdown} />
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 mt-12 sm:mt-16">
          <div className="tilt-in relative aspect-[4/3] sm:aspect-[21/9] rounded-[28px] sm:rounded-[36px] overflow-hidden border border-white/10 bg-[#1C1416] shadow-[0_40px_120px_-30px_rgba(163,48,74,0.7)]">
            <Image src={hero.image} alt={hero.imageAlt} fill preload quality={65} sizes="(max-width: 1280px) 100vw, 1200px" className="object-cover object-center" />
          </div>
          {hero.themeNote && <p className="mt-3 px-2 text-xs text-[#B8A69C] text-center">{hero.themeNote}</p>}
        </div>
      </section>

      {/* ── Ticker ── */}
      <div className="mt-16 sm:mt-20 border-y border-white/10 py-4 overflow-hidden" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {[...tickerWords, ...tickerWords].map((word, i) => (
                <span key={i} className="flex items-center font-serif-title text-2xl sm:text-4xl whitespace-nowrap text-[#FBF7F0]/85">
                  {word}
                  <span className="mx-6 sm:mx-10 inline-block w-2.5 h-2.5 rounded-full bg-[#E0647D]" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. WHAT DO YOU NEED? Bento of big, plain buttons ── */}
      <section className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pt-16 sm:pt-24">
        <h2 className="reveal px-1 text-4xl sm:text-6xl">{tiles.title}</h2>
        <ul data-stagger className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {tiles.items.map((t, i) => {
            const Icon = tileIcons[t.link] ?? ArrowRight;
            const wide = i === 0 || i === tiles.items.length - 1;
            const featured = i === 0;
            return (
              <li key={t.link} className={cn("reveal", wide && "col-span-2")}>
                <Link
                  href={t.link}
                  className={cn(
                    "spot group relative h-full min-h-[168px] sm:min-h-[210px] flex flex-col rounded-[28px] p-5 sm:p-7 overflow-hidden transition-transform duration-300 hover:-translate-y-1",
                    featured
                      ? "bg-[linear-gradient(140deg,#A3304A_0%,#7D1A30_55%,#4A0F1F_100%)]"
                      : "glass hover:bg-white/10"
                  )}
                >
                  <span
                    className={cn(
                      "w-12 h-12 rounded-[14px] flex items-center justify-center",
                      featured ? "bg-white/15" : "bg-[#7D1A30]"
                    )}
                  >
                    <Icon size={24} className="text-white" aria-hidden="true" />
                  </span>
                  <span className="mt-auto pt-6 flex items-end justify-between gap-3">
                    <span>
                      <span className={cn("block font-serif-title leading-none", wide ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl")}>
                        {t.title}
                      </span>
                      <span className="block mt-2 text-sm sm:text-base text-[#F4EDE2]/70">{t.text}</span>
                    </span>
                    <ChevronRight size={22} className="flex-shrink-0 text-white/50 group-hover:text-white transition-colors" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── 3. ANTALYA: swipeable cards on phones, a row on bigger screens ── */}
      <section className="pt-20 sm:pt-28">
        <div className="reveal max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div>
            <h2 className="text-5xl sm:text-7xl">{city.title}</h2>
            <p className="mt-3 text-lg text-[#F4EDE2]/80 max-w-md">{city.text}</p>
          </div>
          <Link
            href="/explore-antalya"
            className="self-start sm:self-auto inline-flex items-center gap-2 rounded-full bg-[#7D1A30] text-white font-semibold px-6 h-12 hover:bg-[#A3304A] transition-colors"
          >
            {city.button} <ChevronRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <ul className="reveal mt-8 max-w-6xl mx-auto flex sm:grid sm:grid-cols-3 gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory px-4 sm:px-6 lg:px-8 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {city.items.map((item, i) => (
            <li key={i} className="snap-start flex-shrink-0 w-[78%] sm:w-auto">
              <Link href="/explore-antalya" className="group relative block aspect-[3/4] rounded-[28px] overflow-hidden bg-[#1C1416] border border-white/10">
                <Image src={item.image} alt={item.imageAlt} fill quality={60} sizes="(max-width: 640px) 80vw, 33vw" className="object-cover object-center transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 to-transparent" aria-hidden="true" />
                <span className="absolute left-5 right-5 bottom-5 font-serif-title text-2xl leading-tight">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 4. NEWS: an inset grouped list, like iOS Settings ── */}
      {latest.length > 0 && (
        <section className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-20 sm:pb-28">
          <div className="reveal px-1 flex items-end justify-between gap-4">
            <h2 className="text-4xl sm:text-5xl">{news.title}</h2>
            <Link href="/announcements" className="font-semibold text-[#E0647D] hover:text-white whitespace-nowrap">
              {news.linkText}
            </Link>
          </div>
          <ul className="reveal mt-6 rounded-[24px] bg-[#1C1416] border border-white/10 divide-y divide-white/10 overflow-hidden">
            {latest.map((a) => (
              <li key={a.id}>
                <Link href="/announcements" className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors">
                  <span className="flex-1 min-w-0">
                    <time dateTime={a.publishedAt} className="block text-sm text-[#B8A69C]">{formatDate(a.publishedAt)}</time>
                    <span className="block mt-0.5 text-[17px] font-semibold leading-snug">{a.title}</span>
                  </span>
                  <ChevronRight size={18} className="flex-shrink-0 text-white/40" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
