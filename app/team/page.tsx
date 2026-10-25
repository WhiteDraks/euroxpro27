import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Info, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "Organizing Committee — The Team",
  description: "Meet the EUROXPRO'27 Organizing Committee preparing the AIESEC in Europe congress in Antalya, Türkiye.",
  alternates: { canonical: "/team" },
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toLocaleUpperCase("tr"))
    .join("");
}

export default function TeamPage() {
  const { hero, notice, comingSoonLabel, members, contactTitle, contactText, contactButton } = content.team;
  const hasPlaceholders = members.some((m) => !m.name.trim() || !m.image);

  return (
    <div className="pt-16 lg:pt-20">
      <section className="bg-[#101B35] text-white py-24 px-4 sm:px-6 lg:px-8 border-b border-[#233152] bosphorus-grid-dark relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2.5 h-2.5 bg-[#741F3D] rounded-full animate-pulse" />
            <span className="text-[#E5E1DA] text-xs font-mono tracking-[0.25em] uppercase">{hero.eyebrow}</span>
          </div>
          <h1 className="font-serif-title font-normal text-4xl sm:text-6xl text-white max-w-4xl leading-tight">
            {hero.title}
          </h1>
          <p className="mt-4 text-[#A7AFBF] text-lg sm:text-xl max-w-2xl font-light leading-relaxed">{hero.intro}</p>
        </div>
      </section>

      <section className="py-20 bg-[#F7F3ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {hasPlaceholders && notice && (
            <div className="mb-10 bg-white border border-[#E5E1DA] rounded-sm p-4 flex items-start gap-3 text-sm text-[#374151]">
              <Info size={16} className="text-[#741F3D] mt-0.5 flex-shrink-0" />
              <p>{notice}</p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member, i) => {
              const name = member.name.trim();
              return (
                <article
                  key={i}
                  className="reveal bg-white border border-[#E5E1DA] rounded-sm overflow-hidden shadow-sm flex flex-col group hover:border-[#741F3D] transition-colors"
                >
                  <div className="aspect-[4/3] relative overflow-hidden bg-[#101B35] bosphorus-grid-dark">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={name || member.role}
                        fill
                        quality={60}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-top img-zoom"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-[#172443] border border-[#233152] flex items-center justify-center">
                          {name ? (
                            <span className="font-serif-title text-4xl text-[#E5E1DA]">{initials(name)}</span>
                          ) : (
                            <User size={40} className="text-[#741F3D]" />
                          )}
                        </div>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 text-[10px] bg-[#101B35]/90 text-white px-2.5 py-1 rounded-sm font-mono uppercase tracking-wider">
                      {member.department}
                    </span>
                  </div>
                  <div className="p-6 flex-1">
                    <p className="text-xs font-mono tracking-widest uppercase text-[#741F3D] mb-1.5">{member.role}</p>
                    <h2 className="font-serif-title font-normal text-2xl text-[#101B35] mb-3">
                      {name || <span className="text-[#8F9AA0] italic text-lg">{comingSoonLabel}</span>}
                    </h2>
                    <p className="text-sm text-[#5A6478] leading-relaxed">{member.bio}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="reveal mt-16 bg-[#101B35] rounded-sm p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="font-serif-title font-normal text-2xl sm:text-3xl text-white mb-2">{contactTitle}</h2>
              <p className="text-sm text-[#A7AFBF] max-w-xl leading-relaxed">{contactText}</p>
            </div>
            <Link href="/contact" className="flex-shrink-0">
              <Button variant="primary" size="lg">
                {contactButton} <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
