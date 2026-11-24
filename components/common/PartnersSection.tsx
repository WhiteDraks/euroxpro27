import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { content } from "@/lib/content";

// One short card: who we are looking for and how to reach us.
export function PartnersSection() {
  const text = content.partners;
  return (
    <section className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pb-20 sm:pb-28">
      <div className="reveal spot glass rounded-[28px] p-6 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl">{text.title}</h2>
          <p className="mt-2 text-lg text-[#D6C8BC]">{text.intro}</p>
        </div>
        <Link
          href="/contact"
          className="sheen self-start sm:self-auto inline-flex items-center gap-2 rounded-full bg-[#7D1A30] text-white font-semibold px-6 h-12 whitespace-nowrap hover:bg-[#A3304A] transition-colors"
        >
          {text.buttonText} <ChevronRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
