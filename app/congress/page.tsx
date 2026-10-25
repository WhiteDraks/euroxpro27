import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CongressSchedule } from "@/components/congress/CongressSchedule";
import { PreviousEditions } from "@/components/common/PreviousEditions";
import { PartnersSection } from "@/components/common/PartnersSection";
import { siteConfig } from "@/lib/config";
import { schedule, isDraftSchedule, isSchedulePublished } from "@/lib/schedule";
import { content } from "@/lib/content";
import { RichText } from "@/components/ui/RichText";
import Link from "next/link";
import { Calendar, MapPin, Target, AlertTriangle, Sparkles, Compass, Globe2, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "The Congress — Purpose, Schedule & Evenings",
  description: "Explore the EUROXPRO'27 congress purpose in Antalya: regional alignment for AIESEC in Europe, leadership capacity tracks, the upcoming agenda, and signature evening galas.",
  alternates: { canonical: "/congress" },
};

export default function CongressPage() {
  const { hero, about, schedule: scheduleText, evenings } = content.congress;
  const objectiveIcons = [Target, Globe2, Compass, Sparkles];

  return (
    <div className="pt-16 lg:pt-20">
      {/* ── CINEMATIC CONGRESS HERO ── */}
      <section className="relative min-h-[60vh] flex items-center bg-[#101B35] text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bosphorus-grid-dark">
        {/* Ambient auditorium background with deep gradient overlay */}
        <div className="absolute inset-0 z-0 opacity-25">
          <Image
            src={hero.image}
            alt={hero.imageAlt}
            fill
            preload
            quality={60}
            sizes="100vw"
            className="object-cover object-center filter brightness-90"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#101B35] via-[#101B35]/85 to-[#101B35]/70 z-0" />
        <div className="absolute -top-24 right-10 w-96 h-96 bg-[#741F3D]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-[0.25em] text-[#741F3D] uppercase">
              <span className="w-8 h-px bg-[#741F3D]" />
              {hero.eyebrow}
            </div>
            <div className="relative w-48 sm:w-60 aspect-[1024/320] drop-shadow-lg">
              <Image
                src="/images/euroxpro-logo.png"
                alt="EUROXPRO Türkiye Official Logo"
                fill
                sizes="240px"
                className="object-contain object-left sm:object-right"
              />
            </div>
          </div>
          <h1 className="font-serif-title font-normal text-4xl sm:text-6xl lg:text-7xl text-white max-w-4xl leading-tight">
            {hero.title}
          </h1>
          <p className="mt-6 text-[#A7AFBF] text-lg sm:text-xl max-w-2xl font-light leading-relaxed">
            {hero.intro}
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mt-12 max-w-3xl">
            {[
              { icon: Calendar, label: hero.datesLabel, value: siteConfig.datesLabel },
              { icon: MapPin, label: hero.cityLabel, value: siteConfig.venueCity },
              { icon: MapPin, label: hero.venueLabel, value: siteConfig.venueName },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-[#172443]/80 border border-[#233152] rounded-sm p-5 backdrop-blur-sm">
                <Icon size={16} className="text-[#741F3D] mb-2" />
                <p className="text-[#8F9AA0] text-[10px] font-mono uppercase tracking-wider">{label}</p>
                <p className="text-white font-medium text-sm mt-1">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT & OBJECTIVES (EDITORIAL TWO-COLUMN) ── */}
      <section className="py-24 bg-[#F7F3ED] border-b border-[#E5E1DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            <div className="lg:col-span-6 space-y-6">
              <SectionHeader
                eyebrow={about.eyebrow}
                title={about.title}
                description={about.description}
              />
              <div className="space-y-4 text-sm text-[#374151] leading-relaxed font-light">
                {about.paragraphs.map((paragraph, i) => (
                  <p key={i}>
                    <RichText text={paragraph} />
                  </p>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-[#741F3D] uppercase block mb-4">
                {about.objectivesTitle}
              </span>

              {about.objectives.map(({ title, desc }, i) => {
                const Icon = objectiveIcons[i % objectiveIcons.length];
                return (
                  <div key={i} className="reveal p-6 bg-white border border-[#E5E1DA] rounded-sm shadow-sm space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#101B35] rounded-sm flex items-center justify-center text-[#741F3D] flex-shrink-0">
                        <Icon size={16} />
                      </div>
                      <h3 className="font-serif-title text-lg text-[#101B35] font-normal">{title}</h3>
                    </div>
                    <p className="text-xs text-[#5A6478] leading-relaxed pl-11">{desc}</p>
                  </div>
                  );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* ── PREVIOUS EDITIONS RETROSPECTIVE ── */}
      <PreviousEditions />

      {/* ── CONGRESS SCHEDULE & TIMETABLE (DEEP NAVY) ── */}
      <section id="schedule" className="py-24 bg-[#101B35] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow={scheduleText.eyebrow}
            title={scheduleText.title}
            description={isSchedulePublished ? scheduleText.description : undefined}
            light
          />

          {!isSchedulePublished && (
            <div className="reveal relative overflow-hidden bg-[#172443] border border-[#2A3556] rounded-sm p-6 sm:p-12 text-center">
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#741F3D]/25 rounded-full blur-3xl pointer-events-none" />
              <div className="relative max-w-2xl mx-auto">
                <div className="w-12 h-12 mx-auto mb-5 rounded-sm bg-[#741F3D]/20 flex items-center justify-center">
                  <Clock size={22} className="text-[#e58aa6]" />
                </div>
                <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-[0.25em] bg-[#741F3D] text-white px-3 py-1 rounded-sm">
                  {scheduleText.comingSoonBadge}
                </span>
                <h3 className="mt-5 font-serif-title text-2xl sm:text-4xl text-white font-normal leading-tight">
                  {scheduleText.comingSoonTitle}
                </h3>
                <p className="mt-4 text-sm sm:text-base text-[#A7AFBF] leading-relaxed font-light">
                  <RichText text={scheduleText.comingSoonText} />
                </p>
                <Link
                  href="/announcements"
                  className="mt-8 inline-flex items-center gap-2 bg-white text-[#101B35] text-sm font-semibold px-6 py-3 rounded-sm hover:bg-[#F7F3ED] transition-colors"
                >
                  {scheduleText.comingSoonButton} <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}

          {isSchedulePublished && isDraftSchedule && (
            <div className="mb-10 flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-sm p-4">
              <AlertTriangle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200 leading-relaxed">
                <RichText text={scheduleText.draftNotice} />
              </div>
            </div>
          )}

          {isSchedulePublished && <CongressSchedule days={schedule} />}
        </div>
      </section>

      {/* ── EVENING SOCIAL EVENTS WITH RICH PHOTOGRAPHY ── */}
      <section className="py-24 bg-[#F7F3ED] border-t border-[#E5E1DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow={evenings.eyebrow}
            title={evenings.title}
            description={evenings.description}
          />

          <div className="grid md:grid-cols-3 gap-8">
            {evenings.items.map((event, i) => (
              <div key={i} className="reveal bg-white border border-[#E5E1DA] rounded-sm overflow-hidden shadow-sm flex flex-col justify-between group">
                <div>
                  <div className="aspect-[16/10] relative overflow-hidden bg-[#101B35]">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      quality={60}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center img-zoom"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-mono uppercase bg-[#101B35]/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-sm">
                        {event.tag}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif-title text-xl text-[#101B35] font-normal mb-2">{event.title}</h3>
                    <p className="text-xs text-[#5A6478] leading-relaxed mb-4 font-light">{event.desc}</p>
                  </div>
                </div>
                <div className="px-6 py-3.5 bg-[#F7F3ED]/80 border-t border-[#E5E1DA] flex items-center justify-between text-xs">
                  <span className="text-[#8F9AA0] uppercase font-mono tracking-wider text-[10px]">{evenings.dressCodeLabel}</span>
                  <span className="font-semibold text-[#741F3D]">{event.dress}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNERS SECTION ── */}
      <PartnersSection />
    </div>
  );
}
