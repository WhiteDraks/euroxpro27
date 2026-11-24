import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { content } from "@/lib/content";

export function PartnersSection() {
  const text = content.partners;
  return (
    <section className="py-20 sm:py-28 bg-black text-[#FBF7F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="reveal lg:col-span-5">
          <p className="kicker mb-4">{text.eyebrow}</p>
          <h2 className="font-serif-title text-[2.25rem] sm:text-5xl lg:text-6xl font-normal leading-[1.02]">
            {text.title}
          </h2>
          <p className="mt-6 text-base sm:text-lg text-[#D6C8BC] leading-relaxed">{text.intro}</p>

          <div className="mt-8 border-l-2 border-[#7D1A30] pl-5">
            <p className="text-xs font-semibold text-[#E0647D]">{text.statusBadge}</p>
            <h3 className="font-serif-title text-xl sm:text-2xl font-normal mt-2">{text.statusTitle}</h3>
            <p className="mt-2 text-sm text-[#D6C8BC] leading-relaxed">{text.statusText}</p>
          </div>

          <Link href="/contact" className="inline-block mt-8">
            <Button size="lg" variant="primary" className="text-sm font-semibold">
              {text.buttonText} <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        <ol className="lg:col-span-7 lg:pt-14">
          {text.items.map(({ title, desc }, i) => (
            <li key={i} className="border-t border-white/25 py-7 last:border-b">
              <div>
                <h3 className="font-serif-title text-2xl font-normal leading-snug">{title}</h3>
                <p className="mt-2 text-base text-[#D6C8BC] leading-relaxed">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
