import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { content } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";

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
      <PageHero eyebrow={hero.eyebrow} title={hero.title} intro={hero.intro} />

      <section className="pb-20 sm:pb-28 bg-[#F7F3ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {hasPlaceholders && notice && (
            <p className="mb-10 text-sm text-[#5A6478] italic">{notice}</p>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-12">
            {members.map((member, i) => {
              const name = member.name.trim();
              return (
                <article key={i} className="reveal flex flex-col group">
                  <div className="aspect-square relative overflow-hidden bg-[#E6DED1]">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={name || member.role}
                        fill
                        quality={60}
                        sizes="(max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-top img-zoom"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-serif-title italic text-6xl sm:text-8xl text-[#101B35]/20">
                          {name ? initials(name) : member.department.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="mt-4 text-xs text-[#741F3D] font-semibold">{member.department}</p>
                  <h2 className="font-serif-title font-normal text-xl sm:text-2xl text-[#101B35] mt-1 leading-snug">
                    {name || <span className="italic text-[#8F9AA0]">{comingSoonLabel}</span>}
                  </h2>
                  <p className="text-sm text-[#101B35] mt-0.5">{member.role}</p>
                  <p className="text-sm text-[#5A6478] leading-relaxed mt-2 hidden sm:block">{member.bio}</p>
                </article>
              );
            })}
          </div>

          <div className="reveal mt-20 border-t border-[#101B35] pt-8 grid md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-8">
              <h2 className="font-serif-title font-normal text-3xl sm:text-4xl text-[#101B35]">{contactTitle}</h2>
              <p className="text-base text-[#4B5563] max-w-xl leading-relaxed mt-3">{contactText}</p>
            </div>
            <Link href="/contact" className="md:col-span-4 md:justify-self-end">
              <Button variant="secondary" size="lg">
                {contactButton} <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
