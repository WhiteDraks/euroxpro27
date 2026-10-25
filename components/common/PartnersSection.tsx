import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { content } from "@/lib/content";

export function PartnersSection() {
  const text = content.partners;
  return (
    <section className="py-20 sm:py-28 bg-[#F7F3ED] text-[#101B35]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="reveal lg:col-span-5">
          <p className="kicker mb-4">{text.eyebrow}</p>
          <h2 className="font-serif-title text-[2.25rem] sm:text-5xl lg:text-6xl font-normal leading-[1.02]">
            {text.title}
          </h2>
          <p className="mt-6 text-base sm:text-lg text-[#4B5563] leading-relaxed">{text.intro}</p>

          <div className="mt-8 border-l-2 border-[#741F3D] pl-5">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#741F3D]">{text.statusBadge}</p>
            <h3 className="font-serif-title text-xl sm:text-2xl font-normal mt-2">{text.statusTitle}</h3>
            <p className="mt-2 text-sm text-[#4B5563] leading-relaxed">{text.statusText}</p>
          </div>

          <Link href="/contact" className="inline-block mt-8">
            <Button size="lg" variant="primary" className="text-sm font-semibold">
              {text.buttonText} <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        <ol className="lg:col-span-7 lg:pt-14">
          {text.items.map(({ title, desc }, i) => (
            <li key={i} className="reveal border-t border-[#101B35] py-7 last:border-b grid grid-cols-[2.5rem_1fr] gap-x-4">
              <span className="font-serif-title italic text-2xl text-[#741F3D] leading-none">{i + 1}.</span>
              <div>
                <h3 className="font-serif-title text-2xl font-normal leading-snug">{title}</h3>
                <p className="mt-2 text-base text-[#4B5563] leading-relaxed">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
