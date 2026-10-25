import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PageHero } from "@/components/ui/PageHero";
import { CongressSchedule } from "@/components/congress/CongressSchedule";
import { PreviousEditions } from "@/components/common/PreviousEditions";
import { PartnersSection } from "@/components/common/PartnersSection";
import { siteConfig } from "@/lib/config";
import { schedule, isDraftSchedule, isSchedulePublished } from "@/lib/schedule";
import { content } from "@/lib/content";
import { RichText } from "@/components/ui/RichText";
import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "The Congress — Purpose & Agenda",
  description: "Explore the EUROXPRO'27 congress purpose in Antalya: regional alignment for AIESEC in Europe, leadership capacity tracks, and the upcoming agenda (coming soon).",
  alternates: { canonical: "/congress" },
};

export default function CongressPage() {
  const { hero, about, schedule: scheduleText, evenings } = content.congress;

  return (
    <div className="pt-16 lg:pt-20">
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        intro={hero.intro}
        image={hero.image}
        imageAlt={hero.imageAlt}
      >
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-8">
          {[
            { label: hero.datesLabel, value: siteConfig.datesLabel },
            { label: hero.cityLabel, value: siteConfig.venueCity },
            { label: hero.venueLabel, value: siteConfig.venueName },
          ].map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs text-[#5A6478]">{label}</dt>
              <dd className="font-serif-title text-xl sm:text-2xl text-[#101B35] mt-0.5">{value}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      {/* ── ABOUT & OBJECTIVES (EDITORIAL TWO-COLUMN) ── */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            <div className="lg:col-span-6 space-y-6">
              <SectionHeader
                eyebrow={about.eyebrow}
                title={about.title}
                description={about.description}
              />
              <div className="space-y-4 text-base text-[#374151] leading-relaxed">
                {about.paragraphs.map((paragraph, i) => (
                  <p key={i}>
                    <RichText text={paragraph} />
                  </p>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 lg:pt-2">
              <p className="kicker mb-2">{about.objectivesTitle}</p>
              <ol>
                {about.objectives.map(({ title, desc }, i) => (
                  <li key={i} className="reveal grid grid-cols-[2.5rem_1fr] gap-x-3 border-t border-[#D9D2C5] py-6 last:border-b">
                    <span className="font-serif-title italic text-2xl text-[#741F3D] leading-none tabular-nums">{i + 1}.</span>
                    <div>
                      <h3 className="font-serif-title text-xl sm:text-2xl text-[#101B35] font-normal leading-snug">{title}</h3>
                      <p className="mt-2 text-sm text-[#5A6478] leading-relaxed">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
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
            <div className="reveal grid lg:grid-cols-12 gap-6 lg:gap-12 border-t border-[#2A3556] pt-10">
              <p className="lg:col-span-4 font-serif-title italic text-2xl text-[#e58aa6]">{scheduleText.comingSoonBadge}</p>
              <div className="lg:col-span-8 max-w-2xl">
                <h3 className="font-serif-title text-3xl sm:text-4xl text-white font-normal leading-tight">
                  {scheduleText.comingSoonTitle}
                </h3>
                <p className="mt-4 text-base text-[#C9CED8] leading-relaxed">
                  <RichText text={scheduleText.comingSoonText} />
                </p>
                <Link
                  href="/announcements"
                  className="mt-8 inline-flex items-center gap-2 text-white font-semibold link-underline decoration-[#e58aa6] hover:decoration-white"
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
      {/* Part of the programme, so hidden until the agenda is published. */}
      {isSchedulePublished && (
      <section className="py-24 bg-[#F7F3ED] border-t border-[#E5E1DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow={evenings.eyebrow}
            title={evenings.title}
            description={evenings.description}
          />

          <div className="grid md:grid-cols-3 gap-8">
            {evenings.items.map((event, i) => (
              <div key={i} className="reveal bg-white border border-[#E5E1DA] rounded-sm overflow-hidden flex flex-col justify-between group">
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
                      <span className="text-[10px] uppercase bg-[#101B35]/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-sm">
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
                  <span className="text-[#8F9AA0] uppercase tracking-wider text-[10px]">{evenings.dressCodeLabel}</span>
                  <span className="font-semibold text-[#741F3D]">{event.dress}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── PARTNERS SECTION ── */}
      <PartnersSection />
    </div>
  );
}
