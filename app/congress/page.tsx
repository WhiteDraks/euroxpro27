import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CongressSchedule } from "@/components/congress/CongressSchedule";
import { PreviousEditions } from "@/components/common/PreviousEditions";
import { PartnersSection } from "@/components/common/PartnersSection";
import { siteConfig } from "@/lib/config";
import { schedule, isDraftSchedule } from "@/lib/schedule";
import { Calendar, MapPin, Target, AlertTriangle, Sparkles, Compass, Globe2 } from "lucide-react";

export const metadata: Metadata = {
  title: "The Congress — Purpose, Schedule & Evenings | EUROXPRO'27",
  description: "Explore the EUROXPRO'27 congress purpose in Antalya: regional alignment for AIESEC in Europe, leadership capacity tracks, indicative schedule, and signature evening galas.",
};

export default function CongressPage() {
  return (
    <div className="pt-20">
      {/* ── CINEMATIC CONGRESS HERO ── */}
      <section className="relative min-h-[60vh] flex items-center bg-[#101B35] text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bosphorus-grid-dark">
        {/* Ambient auditorium background with deep gradient overlay */}
        <div className="absolute inset-0 z-0 opacity-25">
          <Image
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2000&q=80"
            alt="International congress auditorium in session"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center filter brightness-90"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#101B35] via-[#101B35]/85 to-[#101B35]/70 z-0" />
        <div className="absolute -top-24 right-10 w-96 h-96 bg-[#741F3D]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-[0.25em] text-[#741F3D] uppercase mb-4">
            <span className="w-8 h-px bg-[#741F3D]" />
            Official Congress Dossier
          </div>
          <h1 className="font-serif-title font-normal text-4xl sm:text-6xl lg:text-7xl text-white max-w-4xl leading-tight">
            The Congress Experience
          </h1>
          <p className="mt-6 text-[#A7AFBF] text-lg sm:text-xl max-w-2xl font-light leading-relaxed">
            {siteConfig.longDescription}
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mt-12 max-w-3xl">
            {[
              { icon: Calendar, label: "Congress Dates", value: siteConfig.datesLabel },
              { icon: MapPin, label: "Host City", value: siteConfig.venueCity },
              { icon: MapPin, label: "Congress Venue", value: siteConfig.venueName },
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
                eyebrow="Vision &amp; Mandate"
                title="What is EUROXPRO'27?"
                description="An immersive transcontinental forum convening youth leadership from across Europe and the global AIESEC network."
              />
              <div className="space-y-4 text-sm text-[#374151] leading-relaxed font-light">
                <p>
                  <strong>EUROXPRO</strong> is the premier annual regional conference for <strong>AIESEC in Europe</strong>. It convenes national leadership teams (Member Committees), Local Committee presidents, functional vice presidents, and alumni from more than 50 participating entities.
                </p>
                <p>
                  The congress serves as the regional engine for strategic alignment, organizational performance, and youth leadership development. Delegates participate in functional breakout tracks to establish multilateral exchange partnerships (*Global Volunteer, Global Talent, Global Teacher*) and refine operational standards.
                </p>
                <p>
                  Hosted by <strong>MC Türkiye</strong> in Antalya, the 2027 edition draws inspiration from the Mediterranean crossroads under the proposed creative direction: <em>&ldquo;Where Europe Meets the Mediterranean.&rdquo;</em>
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-[#741F3D] uppercase block mb-4">
                Core Conference Objectives
              </span>

              {[
                {
                  icon: Target,
                  title: "Actionable Leadership Development",
                  desc: "Intensive functional tracks designed to build strategic thinking, crisis resilience, people management, and operational acumen."
                },
                {
                  icon: Globe2,
                  title: "Pan-European Exchange Scaling",
                  desc: "Forging bilateral partnerships between national committees to expand cross-border mobility and youth exchange volume."
                },
                {
                  icon: Compass,
                  title: "Regional Alignment & Governance",
                  desc: "Uniting entity leadership to tackle common regional challenges, align on strategic priorities, and vote on legislative motions."
                },
                {
                  icon: Sparkles,
                  title: "Cultural Unity & Mediterranean Immersion",
                  desc: "Experiencing authentic Turkish hospitality and Antalya’s rich historical crossroads through curated social evenings and Global Village."
                }
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-6 bg-white border border-[#E5E1DA] rounded-sm shadow-sm space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#101B35] rounded-sm flex items-center justify-center text-[#741F3D] flex-shrink-0">
                      <Icon size={16} />
                    </div>
                    <h3 className="font-serif-title text-lg text-[#101B35] font-normal">{title}</h3>
                  </div>
                  <p className="text-xs text-[#5A6478] leading-relaxed pl-11">{desc}</p>
                </div>
              ))}
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
            eyebrow="Congress Programme"
            title="Congress Timetable & Agenda"
            description="Day-by-day sequence of plenaries, breakout workshops, networking sessions, and social events."
            light
          />

          {isDraftSchedule && (
            <div className="mb-10 flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-sm p-4">
              <AlertTriangle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200 leading-relaxed">
                <strong>Preliminary Timetable Notice:</strong> The timetable below represents the indicative draft schedule structure. Final session timings, room assignments, and confirmed guest speakers will be ratified and published by the Organizing Committee.
              </div>
            </div>
          )}

          <CongressSchedule days={schedule} />
        </div>
      </section>

      {/* ── EVENING SOCIAL EVENTS WITH RICH PHOTOGRAPHY ── */}
      <section className="py-24 bg-[#F7F3ED] border-t border-[#E5E1DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Evenings &amp; Culture"
            title="Social Events &amp; Gala Evenings"
            description="Carefully designed evening gatherings celebrating Mediterranean cultural richness and delegates' shared journey."
          />

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Mediterranean Welcome Dinner",
                tag: "Day 1 Evening",
                dress: "Smart Casual",
                image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
                desc: "An informal welcoming dinner and icebreaking evening on arrival day. A warm, relaxed coastal setting to reconnect with colleagues and meet delegates from across the European network."
              },
              {
                title: "Global Village & Entity Night",
                tag: "Day 2 Evening",
                dress: "National / Cultural Attire",
                image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
                desc: "The celebratory AIESEC Global Village with national booths, culinary delicacies, folklore, and country pride from across Europe."
              },
              {
                title: "Turkish Night & Awards Gala",
                tag: "Day 4 Evening",
                dress: "Black Tie / Formal / Traditional",
                image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80",
                desc: "The signature formal evening of EUROXPRO'27 on Saturday, 3 April. A grand banquet celebrating Turkish heritage, regional cuisine, folkloric performances, and European Leadership Awards."
              }
            ].map((event) => (
              <div key={event.title} className="bg-white border border-[#E5E1DA] rounded-sm overflow-hidden shadow-sm flex flex-col justify-between group">
                <div>
                  <div className="aspect-[16/10] relative overflow-hidden bg-[#101B35]">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
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
                  <span className="text-[#8F9AA0] uppercase font-mono tracking-wider text-[10px]">Dress Code:</span>
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
