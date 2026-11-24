import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { content } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Organizing Committee — The Team",
  description: "Meet the EUROXPRO'27 Organizing Committee preparing the AIESEC in Europe congress in Antalya, Türkiye.",
  alternates: { canonical: "/team" },
};

// First and last name, so "Berfin Türkü Dağlı" becomes "BD".
function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  const picked = parts.length > 1 ? [parts[0], parts[parts.length - 1]] : parts;
  return picked.map((part) => part[0].toLocaleUpperCase("tr")).join("");
}

export default function TeamPage() {
  const { hero, notice, comingSoonLabel, members, contactTitle, contactText, contactButton } = content.team;
  const hasPlaceholders = members.some((m) => !m.name.trim());

  return (
    <div>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} intro={hero.intro} />

      <section className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-12 sm:py-20">
        {hasPlaceholders && notice && <p className="mb-8 px-1 text-base text-[#B8A69C]">{notice}</p>}

        <ul data-stagger className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {members.map((member, i) => {
            const name = member.name.trim();
            const lead = i === 0;
            return (
              <li
                key={i}
                className={cn(
                  "reveal",
                  lead && "col-span-2 lg:col-span-4",
                  // An odd last card on phones fills the row instead of sitting alone.
                  !lead && i === members.length - 1 && (members.length - 1) % 2 === 1 && "col-span-2 lg:col-span-1"
                )}
              >
                <article
                  className={cn(
                    "spot h-full rounded-[28px] p-5 sm:p-6 flex flex-col",
                    lead
                      ? "bg-[linear-gradient(140deg,#A3304A_0%,#7D1A30_55%,#4A0F1F_100%)] sm:flex-row sm:items-center sm:gap-6"
                      : "glass"
                  )}
                >
                  <div
                    className={cn(
                      "relative flex-shrink-0 overflow-hidden rounded-full flex items-center justify-center",
                      lead ? "w-20 h-20 sm:w-28 sm:h-28 bg-white/15" : "w-16 h-16 sm:w-20 sm:h-20 bg-[#7D1A30]"
                    )}
                  >
                    {member.image ? (
                      <Image src={member.image} alt={name || member.role} fill quality={60} sizes="112px" className="object-cover object-top" />
                    ) : (
                      <span className={cn("font-serif-title text-white", lead ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl")}>
                        {name ? initials(name) : member.department.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className={cn("mt-4", lead && "sm:mt-0")}>
                    <h2 className={cn("leading-tight", lead ? "text-3xl sm:text-5xl" : "text-xl sm:text-2xl")}>
                      {name || <span className="text-[#8C7A72]">{comingSoonLabel}</span>}
                    </h2>
                    <p className={cn("mt-1 font-semibold", lead ? "text-lg text-[#F4EDE2]" : "text-sm sm:text-base text-[#E0647D]")}>
                      {member.role}
                    </p>
                    {member.bio && <p className="mt-2 text-sm text-[#B8A69C]">{member.bio}</p>}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        <div className="reveal spot glass mt-10 rounded-[28px] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <h2 className="text-2xl sm:text-3xl">{contactTitle}</h2>
            <p className="mt-1 text-base text-[#D6C8BC]">{contactText}</p>
          </div>
          <Link
            href="/contact"
            className="sheen self-start sm:self-auto inline-flex items-center gap-2 rounded-full bg-[#7D1A30] text-white font-semibold px-6 h-12 whitespace-nowrap hover:bg-[#A3304A] transition-colors"
          >
            {contactButton} <ChevronRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
