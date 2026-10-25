import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CongressSchedule } from "@/components/congress/CongressSchedule";
import { siteConfig } from "@/lib/config";
import { schedule, isDraftSchedule } from "@/lib/schedule";
import { Calendar, MapPin, Users, Target, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "The Congress",
  description: "Learn about EUROXPRO'27 — the congress programme, schedule, sessions, and what to expect.",
};

export default function CongressPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-[#101B35] py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#741F3D]" />
            <span className="text-[#741F3D] text-xs font-semibold tracking-[0.3em] uppercase">The Congress</span>
          </div>
          <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl text-white leading-tight">
            EUROXPRO&apos;27
          </h1>
          <p className="mt-6 text-[#A7AFBF] text-xl max-w-2xl leading-relaxed">
            {siteConfig.longDescription}
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mt-12">
            {[
              { icon: Calendar, label: "Dates", value: siteConfig.datesLabel },
              { icon: MapPin, label: "City", value: siteConfig.venueCity },
              { icon: MapPin, label: "Venue", value: siteConfig.venueName },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-[#172443] border border-[#2A3556] rounded-lg p-5">
                <Icon size={16} className="text-[#741F3D] mb-2" />
                <p className="text-[#A7AFBF] text-xs uppercase tracking-wide">{label}</p>
                <p className="text-white font-semibold mt-1">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 bg-[#F7F3ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <SectionHeader
                eyebrow="About"
                title="What is EUROXPRO'27?"
              />
              <div className="space-y-4 text-[#5A6478] leading-relaxed">
                <p>EUROXPRO&apos;27 is an international congress organized within the AIESEC network, bringing together motivated young leaders from across Europe and beyond. The congress is a multi-day immersive experience combining leadership development, cross-cultural exchange, and genuine friendship.</p>
                <p>Through a rich programme of plenary sessions, interactive workshops, networking activities, and cultural experiences, delegates leave with expanded perspectives, new skills, and a global network of peers.</p>
                <p>Hosted in Istanbul, Türkiye, EUROXPRO&apos;27 takes place in one of the world&apos;s most extraordinary cities — a place where history, culture, and modernity intersect in a way that is uniquely its own.</p>
              </div>
            </div>
            <div>
              <SectionHeader eyebrow="Congress Objectives" title="What We Aim to Achieve" />
              <div className="space-y-4">
                {[
                  { icon: Target, title: "Develop Leadership", desc: "Equip delegates with practical leadership skills and frameworks they can apply in their home entities and professional lives." },
                  { icon: Users, title: "Build Global Networks", desc: "Create lasting connections between young leaders from diverse cultural, academic, and professional backgrounds." },
                  { icon: MapPin, title: "Celebrate Culture", desc: "Use Istanbul as a canvas to explore Turkish culture, history, and the richness of our shared global heritage." },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4 p-4 bg-white border border-[#E3E0DC] rounded-lg">
                    <div className="w-10 h-10 bg-[#741F3D]/10 rounded-sm flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-[#741F3D]" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-[#101B35]">{title}</h3>
                      <p className="text-[#5A6478] text-sm mt-1 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is It For */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Eligibility" title="Who Is EUROXPRO'27 For?" centered />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              "AIESEC members and alumni from European local committees",
              "Young leaders passionate about global development",
              "Delegates seeking cross-cultural experiences",
              "Future AIESEC leaders building their global networks",
              "Anyone committed to AIESEC's mission of peace and development",
              "Participants selected through their national or regional process",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 p-4 bg-[#F7F3ED] rounded-lg">
                <div className="w-2 h-2 bg-[#741F3D] rounded-full mt-2 flex-shrink-0" />
                <p className="text-[#101B35] text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section id="schedule" className="py-20 bg-[#101B35]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Programme"
            title="Congress Schedule"
            description="A day-by-day overview of the EUROXPRO'27 programme."
            light
          />
          {isDraftSchedule && (
            <div className="mb-8 flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <AlertTriangle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-amber-200 text-sm">
                <strong>Draft Schedule</strong> — This is a preliminary programme outline. The official, confirmed schedule will be published by the Organizing Committee. Times, sessions, and speakers are subject to change.
              </p>
            </div>
          )}
          <CongressSchedule days={schedule} />
        </div>
      </section>

      {/* Dress Codes & Events */}
      <section className="py-20 bg-[#F7F3ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Evening Events" title="Social Events & Cultural Experiences" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Welcome Dinner", desc: "An informal welcome dinner on arrival day — a warm introduction to the congress and your fellow delegates.", dress: "Smart Casual" },
              { title: "Bosphorus Night", desc: "An evening social event with views of the iconic Bosphorus strait connecting Europe and Asia.", dress: "Smart Casual" },
              { title: "Turkish Night Gala", desc: "The signature evening of EUROXPRO'27. A formal gala celebrating Turkish culture with music, cuisine, and performances.", dress: "Formal / Traditional" },
            ].map(({ title, desc, dress }) => (
              <div key={title} className="bg-white border border-[#E3E0DC] rounded-lg p-6">
                <h3 className="font-display font-bold text-[#101B35] text-xl mb-3">{title}</h3>
                <p className="text-[#5A6478] text-sm leading-relaxed mb-4">{desc}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#A7AFBF] uppercase tracking-wide">Dress Code:</span>
                  <span className="text-xs font-semibold text-[#741F3D]">{dress}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
