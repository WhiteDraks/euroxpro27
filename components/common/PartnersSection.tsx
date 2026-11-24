import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { content } from "@/lib/content";

// Partner card: what a partner gets, where the 2027 partner list stands and
// how to reach us. Every text here is editable under /admin → Partnerler.
export function PartnersSection() {
  const text = content.partners;
  const items = (text.items || []).filter((item) => item.title);
  return (
    <section className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pb-20 sm:pb-28">
      <div className="reveal spot glass rounded-[28px] p-6 sm:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            {text.eyebrow && <p className="kicker mb-3">{text.eyebrow}</p>}
            <h2 className="text-3xl sm:text-4xl">{text.title}</h2>
            <p className="mt-2 text-lg text-[#D6C8BC]">{text.intro}</p>
          </div>
          <Link
            href="/contact?topic=partnerships"
            className="sheen self-start sm:self-auto inline-flex items-center gap-2 rounded-full bg-[#7D1A30] text-white font-semibold px-6 h-12 whitespace-nowrap hover:bg-[#A3304A] transition-colors"
          >
            {text.buttonText} <ChevronRight size={18} aria-hidden="true" />
          </Link>
        </div>

        {items.length > 0 && (
          <ul className="mt-8 grid sm:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
            {items.map((item) => (
              <li key={item.title} className="bg-[#141012] p-5">
                <h3 className="font-serif-title text-xl text-[#FBF7F0] font-normal">{item.title}</h3>
                {item.desc && <p className="mt-1 text-sm text-[#B8A69C] leading-relaxed">{item.desc}</p>}
              </li>
            ))}
          </ul>
        )}

        {(text.statusBadge || text.statusTitle) && (
          <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[#B8A69C]">
            {text.statusBadge && (
              <span className="inline-flex items-center gap-2 rounded-full border border-[#E0647D]/40 px-3 py-1 text-xs font-semibold text-[#E0647D]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E0647D]" aria-hidden="true" />
                {text.statusBadge}
              </span>
            )}
            <span>{[text.statusTitle, text.statusText].filter(Boolean).join(" · ")}</span>
          </p>
        )}
      </div>
    </section>
  );
}
