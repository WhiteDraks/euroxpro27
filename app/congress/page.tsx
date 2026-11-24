import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PageHero } from "@/components/ui/PageHero";
import { CongressSchedule } from "@/components/congress/CongressSchedule";
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
    <div>
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
              <dt className="text-xs text-[#B8A69C]">{label}</dt>
              <dd className="font-serif-title text-xl sm:text-2xl text-[#FBF7F0] mt-0.5">{value}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      {/* ── ABOUT ── */}
      <section className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="reveal px-1 max-w-2xl">
          <h2 className="text-4xl sm:text-5xl">{about.title}</h2>
          <p className="mt-3 text-lg sm:text-xl text-[#D6C8BC]">
            {about.description}{" "}
            {about.paragraphs.map((paragraph, i) => (
              <RichText key={i} text={paragraph} />
            ))}
          </p>
        </div>
        <ul data-stagger className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {about.objectives.map(({ title, desc }, i) => (
            <li key={i} className="reveal spot glass rounded-[24px] p-5 sm:p-6">
              <h3 className="text-xl sm:text-2xl">{title}</h3>
              <p className="mt-2 text-sm sm:text-base text-[#B8A69C]">{desc}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── PROGRAMME ── */}
      <section id="schedule" className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pb-12 sm:pb-20 scroll-mt-24">
          {!isSchedulePublished && (
            <div className="reveal relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(140deg,#A3304A_0%,#7D1A30_50%,#2A0A14_100%)] p-6 sm:p-10">
              <h2 className="text-4xl sm:text-5xl">{scheduleText.title}</h2>
              <p className="mt-3 text-lg text-[#F4EDE2]/85">
                {scheduleText.comingSoonTitle}. <RichText text={scheduleText.comingSoonText} />
              </p>
              <Link
                href="/announcements"
                className="sheen mt-6 inline-flex items-center gap-2 rounded-full bg-[#F4EDE2] text-[#7D1A30] font-semibold px-6 h-12"
              >
                {scheduleText.comingSoonButton} <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          )}

          {isSchedulePublished && (
            <h2 className="reveal px-1 mb-8 text-4xl sm:text-5xl">{scheduleText.title}</h2>
          )}

          {isSchedulePublished && isDraftSchedule && (
            <div className="mb-10 flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <AlertTriangle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200 leading-relaxed">
                <RichText text={scheduleText.draftNotice} />
              </div>
            </div>
          )}

          {isSchedulePublished && <CongressSchedule days={schedule} />}
      </section>

      {/* ── EVENING SOCIAL EVENTS WITH RICH PHOTOGRAPHY ── */}
      {/* Part of the programme, so hidden until the agenda is published. */}
      {isSchedulePublished && (
      <section className="py-24 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow={evenings.eyebrow}
            title={evenings.title}
            description={evenings.description}
          />

          <div className="grid md:grid-cols-3 gap-8">
            {evenings.items.map((event, i) => (
              <div key={i} className="reveal bg-[#141012] border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between group">
                <div>
                  <div className="aspect-[16/10] relative overflow-hidden bg-[#141012]">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      quality={60}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center img-zoom"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] bg-[#140D0E]/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-xl">
                        {event.tag}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif-title text-xl text-[#FBF7F0] font-normal mb-2">{event.title}</h3>
                    <p className="text-xs text-[#B8A69C] leading-relaxed mb-4 font-light">{event.desc}</p>
                  </div>
                </div>
                <div className="px-6 py-3.5 bg-black/80 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[#8C7A72] text-[10px]">{evenings.dressCodeLabel}</span>
                  <span className="font-semibold text-[#E0647D]">{event.dress}</span>
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
