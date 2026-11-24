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
            <p className="-mt-6 mb-10 text-sm text-[#B8A69C] italic max-w-3xl">
              <RichText text={attractions.notice} />
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {attractions.items.map((item, i) => (
                <article key={i} className="reveal flex flex-col group">
                  <div className="aspect-[4/3] relative overflow-hidden bg-[#141012]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      quality={60}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center img-zoom"
                    />
                  </div>
                  <p className="mt-4 text-xs text-[#E0647D]">
                    {item.area} · {item.period}
                  </p>
                  <h3 className="font-serif-title text-2xl text-[#FBF7F0] font-normal mt-1 leading-snug">{item.name}</h3>
                  <p className="text-sm text-[#D6C8BC] leading-relaxed mt-2 flex-1">{item.description}</p>
                  <p className="mt-4 pt-3 border-t border-white/15 text-sm text-[#FBF7F0]">
                    <span className="font-semibold">{attractions.tipLabel}</span> {item.tips}
                  </p>
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
              {food.items.map((dish, i) => (
                <div key={i} className="bg-[#141012] border border-white/10 rounded-xl p-6">
                  <span className="text-[10px] text-[#E0647D] block mb-2">
                    {dish.category}
                  </span>
                  <h3 className="font-serif-title text-xl text-[#FBF7F0] font-normal mb-2">{dish.name}</h3>
                  <p className="text-sm text-[#D6C8BC] leading-relaxed">{dish.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-14 bg-[#1C1416] p-6 sm:p-10">
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
                    <span className="font-serif-title italic text-2xl text-[#E0647D]">{phrase.tr}</span>
                    <span className="text-sm font-semibold text-[#FBF7F0]">{phrase.en}</span>
                  </div>
                  <span className="text-xs text-[#8C7A72] italic">{phrases.pronunciationLabel} {phrase.pronunciation}</span>
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
                  <p className="text-sm text-[#D6C8BC] mb-3 leading-relaxed">{loc.description}</p>
                  <p className="text-[11px] text-[#8C7A72] mb-3">{loc.address}</p>
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

            <div className="bg-[#141012] p-6 sm:p-10 text-white grid lg:grid-cols-12 gap-6 lg:gap-12">
              <div className="lg:col-span-5">
                <h4 className="font-serif-title text-2xl sm:text-3xl font-normal text-white">{map.routingTitle}</h4>
                <p className="text-base text-[#D6C8BC] mt-3 leading-relaxed">{map.routingText}</p>
              </div>
              <div className="lg:col-span-7 border-t lg:border-t-0 lg:border-l border-[#3A2A2A] pt-6 lg:pt-0 lg:pl-12">
                <p className="font-serif-title italic text-xl text-white">{map.overviewTitle}</p>
                <p className="text-sm text-[#D6C8BC] mt-2 leading-relaxed">{map.overviewText}</p>
              </div>
            </div>
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
            <p className="-mt-6 mb-10 text-sm text-[#B8A69C] italic max-w-3xl">
              <RichText text={weather.notice} />
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
              {weather.items.map((w, i) => (
                <div key={i} className="border-t border-white/25 pt-5">
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
