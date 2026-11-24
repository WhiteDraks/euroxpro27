import Image from "next/image";
import { historicalEditions } from "@/lib/historical";
import { content } from "@/lib/content";

// Past editions read like an archive: one row per year, the year set
// large, a photo beside it and the figures written out as plain text.
export function PreviousEditions() {
  const text = content.previousEditions;
  return (
    <section className="py-20 sm:py-28 bg-black text-[#FBF7F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal grid lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-10 sm:mb-14">
          <div className="lg:col-span-7">
            <p className="kicker mb-4">{text.eyebrow}</p>
            <h2 className="font-serif-title text-[2.25rem] sm:text-5xl lg:text-6xl font-normal leading-[1.02]">
              {text.title}
            </h2>
          </div>
          <p className="lg:col-span-5 text-base sm:text-lg text-[#D6C8BC] leading-relaxed">
            {text.intro}
          </p>
        </div>

        <div className="border-b border-white/25">
          {historicalEditions.map((edition) => {
            const place = edition.location === edition.country ? edition.country : `${edition.location}, ${edition.country}`;
            const figures = [
              edition.delegatesMetric,
              edition.countriesCount ? `${edition.countriesCount}+ countries` : null,
              edition.partnersCount ? `${edition.partnersCount}+ partners` : null,
            ].filter(Boolean);
            return (
              <article
                key={edition.year}
                className="reveal grid md:grid-cols-12 gap-x-8 lg:gap-x-12 gap-y-5 border-t border-white/25 py-8 sm:py-12"
              >
                <div className="md:col-span-3">
                  <p className="font-serif-title text-6xl sm:text-7xl leading-none tabular-nums">{edition.year}</p>
                  <p className="mt-3 text-sm text-[#D6C8BC]">{place}</p>
                </div>

                <div className="md:col-span-4 relative aspect-[3/2] overflow-hidden bg-[#141012]">
                  <Image
                    src={edition.image}
                    alt={`EUROXPRO ${edition.year} in ${place}`}
                    fill
                    quality={60}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center"
                  />
                </div>

                <div className="md:col-span-5">
                  {edition.theme && (
                    <h3 className="font-serif-title italic text-2xl sm:text-3xl font-normal leading-snug">
                      &ldquo;{edition.theme}&rdquo;
                    </h3>
                  )}
                  <p className="mt-2 text-sm font-semibold text-[#E0647D]">{figures.join(" · ")}</p>
                  <p className="mt-3 text-base text-[#D6C8BC] leading-relaxed">{edition.summary}</p>
                  {edition.highlights.length > 0 && (
                    <ul className="mt-4 space-y-1.5 text-sm text-[#D6C8BC]">
                      {edition.highlights.map((h, i) => (
                        <li key={i} className="pl-4 relative before:content-['–'] before:absolute before:left-0 before:text-[#E0647D]">
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {text.disclaimer && (
          <p className="mt-6 text-xs text-[#B8A69C] leading-relaxed max-w-3xl">{text.disclaimer}</p>
        )}
      </div>
    </section>
  );
}
