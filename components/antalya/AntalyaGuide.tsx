"use client";

import { useState } from "react";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RichText } from "@/components/ui/RichText";
import type { SiteContent } from "@/lib/content";
import { ExternalLink, Check } from "lucide-react";

type TabId = "attractions" | "food" | "phrases" | "map" | "weather";

type AntalyaGuideProps = {
  guide: Omit<SiteContent["exploreAntalya"], "hero">;
};

export function AntalyaGuide({ guide }: AntalyaGuideProps) {
  const [activeTab, setActiveTab] = useState<TabId>("attractions");
  const { tabs, attractions, food, phrases, map, weather } = guide;
  const locations = map.locations;

  return (
    <div className="pb-20 sm:pb-28 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Tabs */}
        <div className="flex gap-x-6 sm:gap-x-8 mb-12 sm:mb-14 border-b border-white/15 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0" role="tablist">
          {[
            { id: "attractions" as TabId, label: tabs.attractions },
            { id: "food" as TabId, label: tabs.food },
            { id: "phrases" as TabId, label: tabs.phrases },
            { id: "map" as TabId, label: tabs.map },
            { id: "weather" as TabId, label: tabs.weather },
          ].map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`whitespace-nowrap py-3 -mb-px text-sm border-b-2 transition-colors ${
                activeTab === id
                  ? "border-[#7D1A30] text-[#FBF7F0] font-semibold"
                  : "border-transparent text-[#B8A69C] hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab 1: Attractions with Photography */}
        {activeTab === "attractions" && (
          <div>
            <SectionHeader
              eyebrow={attractions.eyebrow}
              title={attractions.title}
              description={attractions.description}
            />
            {attractions.notice && (
              <p className="-mt-6 mb-10 text-sm text-[#B8A69C] max-w-3xl">
                <RichText text={attractions.notice} />
              </p>
            )}
            <div data-stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10">
              {attractions.items.map((item, i) => (
                <article key={i} className="reveal flex flex-col group">
                  <div className="aspect-[4/3] relative overflow-hidden rounded-[24px] border border-white/10 bg-[#141012]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      quality={60}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center img-zoom"
                    />
                  </div>
                  <h3 className="font-serif-title text-2xl text-[#FBF7F0] mt-4 leading-snug">{item.name}</h3>
                  <p className="text-base text-[#D6C8BC] mt-1">{item.description}</p>
                  {item.tips && (
                    <p className="mt-3 text-sm text-[#B8A69C]">
                      <span className="font-semibold">{attractions.tipLabel}</span> {item.tips}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Food & Culture */}
        {activeTab === "food" && (
          <div>
            <SectionHeader
              eyebrow={food.eyebrow}
              title={food.title}
              description={food.description}
            />
            <div data-stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {food.items.map((dish, i) => (
                <div key={i} className="reveal spot glass rounded-[24px] p-6">
                  <h3 className="font-serif-title text-2xl text-[#FBF7F0] mb-1">{dish.name}</h3>
                  <p className="text-base text-[#D6C8BC]">{dish.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-[24px] bg-[#1C1416] border border-white/10 p-6 sm:p-8">
              <h3 className="font-serif-title text-2xl text-[#FBF7F0] mb-4">{food.etiquetteTitle}</h3>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-sm text-[#D6C8BC] leading-relaxed">
                {food.etiquette.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Check size={15} className="text-[#E0647D] mt-0.5 flex-shrink-0" />
                    <span><RichText text={tip} /></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Useful Phrases */}
        {activeTab === "phrases" && (
          <div>
            <SectionHeader
              eyebrow={phrases.eyebrow}
              title={phrases.title}
              description={phrases.description}
            />
            <div className="grid sm:grid-cols-2 gap-x-10">
              {phrases.items.map((phrase, i) => (
                <div key={i} className="border-t border-white/15 py-4">
                  <div className="flex flex-wrap justify-between items-baseline gap-x-4 mb-1">
                    <span className="font-serif-title text-2xl text-[#E0647D]">{phrase.tr}</span>
                    <span className="text-sm font-semibold text-[#FBF7F0]">{phrase.en}</span>
                  </div>
                  <span className="text-sm text-[#8C7A72]">{phrase.pronunciation}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Map & Locations */}
        {activeTab === "map" && (
          <div>
            <SectionHeader
              eyebrow={map.eyebrow}
              title={map.title}
              description={map.description}
            />
            <div className="grid lg:grid-cols-3 gap-x-8 gap-y-8 mb-12">
              {locations.map((loc, i) => (
                <div key={loc.id || i} className="border-t border-white/25 pt-5">
                  <p className="text-xs text-[#E0647D] mb-1">
                    {loc.placeholder ? "Address to be confirmed" : loc.category}
                  </p>
                  <h3 className="font-serif-title text-xl text-[#FBF7F0] mb-1">{loc.name}</h3>
                  <p className="text-base text-[#D6C8BC] mb-3">{loc.description}</p>
                  <a
                    href={loc.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#E0647D] font-semibold hover:underline"
                  >
                    Open in Google Maps <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>

            <p className="rounded-[24px] bg-[#1C1416] border border-white/10 px-6 py-5 text-base text-[#D6C8BC]">{map.routingText}</p>
          </div>
        )}

        {/* Tab 5: Seasonal Weather */}
        {activeTab === "weather" && (
          <div>
            <SectionHeader
              eyebrow={weather.eyebrow}
              title={weather.title}
              description={weather.description}
            />
            {weather.notice && (
              <p className="-mt-6 mb-10 text-sm text-[#B8A69C] max-w-3xl">
                <RichText text={weather.notice} />
              </p>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {weather.items.map((w, i) => (
                <div key={i} className="glass rounded-[24px] p-6">
                  <h4 className="font-serif-title text-xl text-[#FBF7F0]">{w.season}</h4>
                  <p className="font-serif-title text-3xl text-[#E0647D] mt-2 mb-3">{w.temp}</p>
                  <p className="text-sm text-[#D6C8BC] leading-relaxed">{w.notes}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
