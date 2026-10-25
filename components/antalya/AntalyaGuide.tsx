"use client";

import { useState } from "react";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { RichText } from "@/components/ui/RichText";
import type { SiteContent } from "@/lib/content";
import {
  Compass, Utensils, MapPin, CloudSun, ExternalLink,
  Info, AlertCircle, Check
} from "lucide-react";

type TabId = "attractions" | "food" | "phrases" | "map" | "weather";

type AntalyaGuideProps = {
  guide: Omit<SiteContent["exploreAntalya"], "hero">;
};

export function AntalyaGuide({ guide }: AntalyaGuideProps) {
  const [activeTab, setActiveTab] = useState<TabId>("attractions");
  const { tabs, attractions, food, phrases, map, weather } = guide;
  const locations = map.locations;

  return (
    <div className="py-20 bg-[#F7F3ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-14 border-b border-[#E5E1DA] pb-4">
          {[
            { id: "attractions" as TabId, label: tabs.attractions, icon: Compass },
            { id: "food" as TabId, label: tabs.food, icon: Utensils },
            { id: "phrases" as TabId, label: tabs.phrases, icon: Info },
            { id: "map" as TabId, label: tabs.map, icon: MapPin },
            { id: "weather" as TabId, label: tabs.weather, icon: CloudSun },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-sm text-xs font-mono font-medium tracking-wide uppercase transition-colors ${
                activeTab === id
                  ? "bg-[#741F3D] text-white"
                  : "bg-white border border-[#E5E1DA] text-[#5A6478] hover:text-[#101B35]"
              }`}
            >
              <Icon size={14} />
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
            <div className="mb-8 p-4 bg-white border border-[#E5E1DA] rounded-sm flex items-start gap-3 text-xs text-[#5A6478]">
              <Info size={16} className="text-[#741F3D] flex-shrink-0 mt-0.5" />
              <span>
                <RichText text={attractions.notice} />
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {attractions.items.map((item, i) => (
                <Card key={i} className="reveal flex flex-col h-full bg-white border border-[#E5E1DA] rounded-sm overflow-hidden shadow-sm group">
                  <div className="aspect-[16/10] relative overflow-hidden bg-[#101B35]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      quality={60}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center img-zoom"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-mono uppercase bg-[#101B35]/90 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-sm">
                        {item.area}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-[10px] text-[#741F3D] font-mono tracking-wider uppercase block mb-1">
                      {item.period}
                    </span>
                    <h3 className="font-serif-title text-xl text-[#101B35] font-normal mb-2">{item.name}</h3>
                    <p className="text-xs text-[#5A6478] leading-relaxed mb-4 flex-1 font-light">{item.description}</p>
                    <div className="pt-3 border-t border-[#E5E1DA] bg-[#F7F3ED]/60 -mx-6 -mb-6 p-4">
                      <p className="text-[11px] text-[#101B35] font-semibold mb-0.5">{attractions.tipLabel}</p>
                      <p className="text-xs text-[#5A6478] font-light">{item.tips}</p>
                    </div>
                  </div>
                </Card>
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {food.items.map((dish, i) => (
                <div key={i} className="bg-white border border-[#E5E1DA] rounded-sm p-6 shadow-sm">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-[#741F3D] block mb-2">
                    {dish.category}
                  </span>
                  <h3 className="font-serif-title text-lg text-[#101B35] font-normal mb-2">{dish.name}</h3>
                  <p className="text-xs text-[#5A6478] leading-relaxed font-light">{dish.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-white border border-[#E5E1DA] rounded-sm p-8 shadow-sm">
              <h3 className="font-serif-title text-2xl text-[#101B35] mb-4">{food.etiquetteTitle}</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-xs text-[#5A6478] font-light leading-relaxed">
                {food.etiquette.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Check size={15} className="text-[#741F3D] mt-0.5 flex-shrink-0" />
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
            <div className="grid sm:grid-cols-2 gap-4">
              {phrases.items.map((phrase, i) => (
                <div key={i} className="bg-white border border-[#E5E1DA] rounded-sm p-5 shadow-sm">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-serif-title text-xl font-bold text-[#741F3D]">{phrase.tr}</span>
                    <span className="text-sm font-semibold text-[#101B35]">{phrase.en}</span>
                  </div>
                  <span className="text-xs text-[#8F9AA0] font-mono italic">{phrases.pronunciationLabel} {phrase.pronunciation}</span>
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
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              {locations.map((loc, i) => (
                <div key={loc.id || i} className="bg-white border border-[#E5E1DA] rounded-sm p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={loc.placeholder ? "warning" : "navy"}>
                      {loc.placeholder ? "Address Pending" : loc.category}
                    </Badge>
                  </div>
                  <h3 className="font-serif-title text-lg text-[#101B35] mb-1">{loc.name}</h3>
                  <p className="text-xs text-[#5A6478] mb-3 font-light leading-relaxed">{loc.description}</p>
                  <p className="text-[11px] text-[#8F9AA0] mb-3 font-mono">{loc.address}</p>
                  <a
                    href={loc.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#741F3D] font-semibold hover:underline"
                  >
                    Open in Google Maps <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>

            <div className="bg-[#101B35] rounded-sm p-8 text-white border border-[#233152]">
              <div className="flex items-center gap-2.5 mb-3">
                <MapPin size={20} className="text-[#741F3D]" />
                <h4 className="font-serif-title text-2xl font-normal text-white">{map.routingTitle}</h4>
              </div>
              <p className="text-xs text-[#A7AFBF] mb-6 max-w-2xl font-light leading-relaxed">
                {map.routingText}
              </p>
              <div className="aspect-[21/9] w-full rounded-sm overflow-hidden bg-[#172443] border border-[#233152] flex items-center justify-center relative">
                <div className="text-center p-6">
                  <MapPin size={36} className="text-[#741F3D] mx-auto mb-3" />
                  <p className="text-white font-medium text-sm">{map.overviewTitle}</p>
                  <p className="text-xs text-[#A7AFBF] mt-1 font-light">{map.overviewText}</p>
                </div>
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
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-sm p-4 mb-8 flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <RichText text={weather.notice} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {weather.items.map((w, i) => (
                <div key={i} className="bg-white border border-[#E5E1DA] rounded-sm p-5 shadow-sm">
                  <h4 className="font-serif-title text-lg text-[#101B35] mb-2">{w.season}</h4>
                  <p className="text-xl font-bold text-[#741F3D] mb-3 font-mono">{w.temp}</p>
                  <p className="text-xs text-[#5A6478] leading-relaxed font-light">{w.notes}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
