import Image from "next/image";
import { historicalEditions } from "@/lib/historical";
import { content } from "@/lib/content";
import { Users2, Globe2, Briefcase, Info } from "lucide-react";

export function PreviousEditions() {
  const text = content.previousEditions;
  return (
    <section className="py-24 bg-[#F7F3ED] border-b border-[#E5E1DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#E5E1DA] pb-8">
          <div>
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#741F3D] uppercase block mb-3">
              {text.eyebrow}
            </span>
            <h2 className="font-serif-title text-4xl sm:text-5xl text-[#101B35] font-normal leading-tight">
              {text.title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5A6478] max-w-md mt-4 md:mt-0 leading-relaxed font-light">
            {text.intro}
          </p>
        </div>

        {/* Essential Historical Attribution Disclaimer */}
        <div className="mb-12 bg-white border border-[#E5E1DA] rounded-sm p-5 shadow-sm flex items-start gap-3.5">
          <Info size={20} className="text-[#741F3D] flex-shrink-0 mt-0.5" />
          <div className="text-xs text-[#5A6478] leading-relaxed">
            <strong className="text-[#101B35] font-semibold block mb-0.5">
              {text.disclaimerTitle}
            </strong>
            {text.disclaimer}
          </div>
        </div>

        {/* Edition Cards Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {historicalEditions.map((edition) => (
            <div
              key={edition.year}
              className="bg-white border border-[#E5E1DA] rounded-sm overflow-hidden flex flex-col justify-between shadow-sm hover:border-[#741F3D] transition-colors duration-300 group"
            >
              <div>
                {/* Archival Photography Header */}
                <div className="aspect-[16/10] relative overflow-hidden bg-[#101B35]">
                  <Image
                    src={edition.image}
                    alt={`EUROXPRO ${edition.year} in ${edition.location}, ${edition.country}`}
                    fill
                    quality={60}
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover object-center img-zoom filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101B35]/90 via-transparent to-transparent" />
                  
                  {/* Badge Pills */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-[#101B35]/90 backdrop-blur-sm text-white text-[11px] font-mono font-bold tracking-wider rounded-sm">
                      EUROXPRO {edition.year}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-mono tracking-widest text-[#E5E1DA] uppercase block">
                      {edition.location === edition.country ? edition.country : `${edition.location}, ${edition.country}`}
                    </span>
                    {edition.theme && (
                      <p className="font-serif-title text-base italic text-[#F7F3ED]">
                        &ldquo;{edition.theme}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6">
                  {/* Highlight Metrics */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F7F3ED] border border-[#E5E1DA] rounded-sm text-[11px] font-mono text-[#101B35] font-semibold">
                      <Users2 size={12} className="text-[#741F3D]" />
                      {edition.delegatesMetric}
                    </span>
                    {edition.countriesCount && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F7F3ED] border border-[#E5E1DA] rounded-sm text-[11px] font-mono text-[#101B35]">
                        <Globe2 size={12} className="text-[#741F3D]" />
                        {edition.countriesCount}+ Countries
                      </span>
                    )}
                    {edition.partnersCount && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F7F3ED] border border-[#E5E1DA] rounded-sm text-[11px] font-mono text-[#101B35]">
                        <Briefcase size={12} className="text-[#741F3D]" />
                        {edition.partnersCount}+ Partners
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#5A6478] leading-relaxed mb-5 font-light">
                    {edition.summary}
                  </p>

                  <div className="space-y-2 border-t border-[#E5E1DA] pt-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8F9AA0] block">
                      Documented Focus:
                    </span>
                    {edition.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#374151]">
                        <span className="text-[#741F3D] font-bold mt-0.5">•</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-3 bg-[#F7F3ED]/70 border-t border-[#E5E1DA] flex items-center justify-between text-[11px] text-[#8F9AA0] font-mono">
                <span>Past Conference Record</span>
                <span className="text-[#741F3D] font-semibold uppercase tracking-wider">
                  Past Edition
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
