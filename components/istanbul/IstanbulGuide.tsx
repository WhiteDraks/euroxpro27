"use client";

import { useState } from "react";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { usefulLocations } from "@/lib/config";
import {
  Compass, Utensils, MapPin, CloudSun, ExternalLink,
  Info, AlertCircle, Check
} from "lucide-react";

const attractions = [
  {
    name: "Hagia Sophia (Ayasofya)",
    category: "Historic Monument",
    period: "Byzantine / Ottoman",
    image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80",
    description: "Built in 537 AD as the patriarchal cathedral of Constantinople, Hagia Sophia is one of the greatest surviving architectural marvels in human history. Renowned for its colossal dome and gold mosaics.",
    tips: "Dress modestly (shoulders & knees covered; headscarf provided for women). Footwear is removed at entrance.",
    area: "Sultanahmet",
  },
  {
    name: "The Blue Mosque (Sultanahmet)",
    category: "Mosque",
    period: "Ottoman (1616)",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80",
    description: "Distinguished by its six slender minarets and interior walls adorned with more than 20,000 hand-painted Iznik ceramic tiles in shades of turquoise and cobalt blue.",
    tips: "Closed to non-worshipers during scheduled daily prayer times. Modest attire mandatory.",
    area: "Sultanahmet",
  },
  {
    name: "Galata Tower (Galata Kulesi)",
    category: "Tower / Panoramic View",
    period: "Genoese (1348)",
    image: "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80",
    description: "A medieval stone watchtower dominating the skyline above Karaköy and the Golden Horn. Provides unmatched 360-degree vistas across both the European and Asian continents.",
    tips: "Arrive around golden hour or early morning to experience the best light across the historic peninsula.",
    area: "Beyoğlu / Karaköy",
  },
  {
    name: "The Grand Bazaar (Kapalıçarşı)",
    category: "Historic Covered Market",
    period: "Ottoman (1461)",
    image: "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=800&q=80",
    description: "One of the oldest and largest covered bazaars in the world, encompassing 61 vaulted streets with over 4,000 merchants offering carpets, ceramics, teas, and leathercraft.",
    tips: "Polite bargaining is customary and welcomed. The Grand Bazaar is closed on Sundays.",
    area: "Beyazıt",
  },
  {
    name: "The Bosphorus Waterfront & Ferry",
    category: "Scenic Navigation",
    period: "Timeless",
    image: "https://images.unsplash.com/photo-1567527259232-3a7fcd490c55?auto=format&fit=crop&w=800&q=80",
    description: "The historic 32-km maritime strait connecting the Sea of Marmara with the Black Sea. Boarding a traditional city commuter ferry (Şehir Hatları) is an indispensable Istanbul ritual.",
    tips: "Tap your Istanbulkart at the turnstiles. Order a hot glass of Turkish tea and simit from the onboard tea master.",
    area: "Eminönü / Kadıköy",
  },
  {
    name: "Istiklal Avenue & Pera",
    category: "Urban Boulevard",
    period: "19th Century Pera",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
    description: "A pedestrian avenue lined with late Ottoman neoclassical architecture, bookshops, art venues, and the historic red nostalgic tramway terminating at Taksim Square.",
    tips: "Explore the passage arcades (Çiçek Pasajı, Suriye Pasajı) branching off the main avenue.",
    area: "Beyoğlu",
  },
];

const culinaryHighlights = [
  {
    name: "Turkish Breakfast (Serpme Kahvaltı)",
    desc: "A banquet of regional cheeses (kaşar, beyaz peynir), olives, tomatoes, clotted cream (kaymak) with honey, eggs (menemen), warm bread, and unlimited black tea.",
    category: "Dining Experience",
  },
  {
    name: "Simit & Street Pastries",
    desc: "The iconic circular bread crusted with roasted sesame seeds. Fresh, crispy, and purchased hot from red street carts across the city.",
    category: "Street Food",
  },
  {
    name: "Kebabs & Grilled Meats",
    desc: "From hand-minced spicy Adana kebabs to slow-stacked döner wrapped in fresh lavash flatbread with sumac onions and herbs.",
    category: "Main Course",
  },
  {
    name: "Turkish Tea (Çay) & Coffee",
    desc: "Served boiling hot in delicate tulip glasses. Traditional Turkish coffee is unfiltered, brewed in a copper cezve, and enjoyed slowly.",
    category: "Beverages",
  },
  {
    name: "Antep Baklava & Desserts",
    desc: "Dozens of layers of translucent pastry dough layered with emerald green Antep pistachios and light syrup.",
    category: "Sweets",
  },
  {
    name: "Meze Culture & Waterfront Dining",
    desc: "Cold small plates including smoked eggplant, creamy haydari, garlic labneh, and seasonal seafood by the water.",
    category: "Evening Dining",
  },
];

const turkishPhrases = [
  { tr: "Merhaba", en: "Hello", pronunciation: "mehr-hah-bah" },
  { tr: "Günaydın", en: "Good morning", pronunciation: "goo-nahy-duhn" },
  { tr: "Teşekkür ederim", en: "Thank you", pronunciation: "teh-shek-kur eh-deh-reem" },
  { tr: "Sağol / Sağolun", en: "Thanks / Thank you (polite)", pronunciation: "sah-ol / sah-ol-oon" },
  { tr: "Lütfen", en: "Please", pronunciation: "loot-fehn" },
  { tr: "Evet / Hayır", en: "Yes / No", pronunciation: "eh-vet / hah-yuhr" },
  { tr: "Ne kadar?", en: "How much?", pronunciation: "neh kah-dahr" },
  { tr: "Hesap, lütfen", en: "The bill, please", pronunciation: "heh-sahp loot-fehn" },
  { tr: "Afiyet olsun", en: "Bon appétit / Enjoy your meal", pronunciation: "ah-fee-yet ohl-soon" },
  { tr: "Kolay gelsin", en: "May it be easy (courtesy greeting)", pronunciation: "koh-ly gehl-sin" },
];

type TabId = "attractions" | "food" | "phrases" | "map" | "weather";

export function IstanbulGuide() {
  const [activeTab, setActiveTab] = useState<TabId>("attractions");

  return (
    <div className="py-20 bg-[#F7F3ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-14 border-b border-[#E5E1DA] pb-4">
          {[
            { id: "attractions" as TabId, label: "Iconic Landmarks", icon: Compass },
            { id: "food" as TabId, label: "Gastronomy & Culture", icon: Utensils },
            { id: "phrases" as TabId, label: "Useful Phrases", icon: Info },
            { id: "map" as TabId, label: "Congress & City Map", icon: MapPin },
            { id: "weather" as TabId, label: "Seasonal Climate", icon: CloudSun },
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
              eyebrow="Architectural Marvels"
              title="Must-See Sights in Istanbul"
              description="A curated selection of the most significant architectural, cultural, and historic landmarks easily reached by delegates."
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {attractions.map((item) => (
                <Card key={item.name} className="flex flex-col h-full bg-white border border-[#E5E1DA] rounded-sm overflow-hidden shadow-sm group">
                  <div className="aspect-[16/10] relative overflow-hidden bg-[#101B35]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
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
                      <p className="text-[11px] text-[#101B35] font-semibold mb-0.5">Delegate Recommendation:</p>
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
              eyebrow="Culinary Heritage"
              title="Flavours of Istanbul"
              description="Turkish culinary culture is renowned worldwide. From historic bakeries to waterside meze establishments, here is what not to miss."
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {culinaryHighlights.map((dish) => (
                <div key={dish.name} className="bg-white border border-[#E5E1DA] rounded-sm p-6 shadow-sm">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-[#741F3D] block mb-2">
                    {dish.category}
                  </span>
                  <h3 className="font-serif-title text-lg text-[#101B35] font-normal mb-2">{dish.name}</h3>
                  <p className="text-xs text-[#5A6478] leading-relaxed font-light">{dish.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-white border border-[#E5E1DA] rounded-sm p-8 shadow-sm">
              <h3 className="font-serif-title text-2xl text-[#101B35] mb-4">Dining Etiquette in Türkiye</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-xs text-[#5A6478] font-light leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-[#741F3D] mt-0.5 flex-shrink-0" />
                  <span>Saying <em>&ldquo;Afiyet olsun&rdquo;</em> (Bon appétit) before or after a meal is polite and appreciated.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-[#741F3D] mt-0.5 flex-shrink-0" />
                  <span>Turkish hospitality is legendary: complimentary tea (çay) is frequently offered after meals as a welcoming gesture.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-[#741F3D] mt-0.5 flex-shrink-0" />
                  <span>Sealed water bottles on tables in sit-down restaurants may be billed; confirm if complimentary.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-[#741F3D] mt-0.5 flex-shrink-0" />
                  <span>Tipping roughly 10% in sit-down table service restaurants is customary practice.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Useful Phrases */}
        {activeTab === "phrases" && (
          <div>
            <SectionHeader
              eyebrow="Language Essentials"
              title="Helpful Turkish Expressions"
              description="Locals in Istanbul genuinely appreciate when international delegates use basic Turkish pleasantries."
            />
            <div className="grid sm:grid-cols-2 gap-4">
              {turkishPhrases.map((phrase) => (
                <div key={phrase.tr} className="bg-white border border-[#E5E1DA] rounded-sm p-5 shadow-sm">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-serif-title text-xl font-bold text-[#741F3D]">{phrase.tr}</span>
                    <span className="text-sm font-semibold text-[#101B35]">{phrase.en}</span>
                  </div>
                  <span className="text-xs text-[#8F9AA0] font-mono italic">Pronunciation: {phrase.pronunciation}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Map & Locations */}
        {activeTab === "map" && (
          <div>
            <SectionHeader
              eyebrow="Key Locations"
              title="Congress &amp; City Locations"
              description="Important navigational reference points for delegates during EUROXPRO'27."
            />
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              {usefulLocations.map((loc) => (
                <div key={loc.id} className="bg-white border border-[#E5E1DA] rounded-sm p-5 shadow-sm">
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
                <h4 className="font-serif-title text-2xl font-normal text-white">Interactive Venue Routing</h4>
              </div>
              <p className="text-xs text-[#A7AFBF] mb-6 max-w-2xl font-light leading-relaxed">
                Full interactive routing and venue-to-hotel directions will be enabled once official congress venues and hotel properties are formally ratified by the OC.
              </p>
              <div className="aspect-[21/9] w-full rounded-sm overflow-hidden bg-[#172443] border border-[#233152] flex items-center justify-center relative">
                <div className="text-center p-6">
                  <MapPin size={36} className="text-[#741F3D] mx-auto mb-3" />
                  <p className="text-white font-medium text-sm">Istanbul, Türkiye Overview</p>
                  <p className="text-xs text-[#A7AFBF] mt-1 font-light">Official geo-pins will sync when addresses are released.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Seasonal Weather */}
        {activeTab === "weather" && (
          <div>
            <SectionHeader
              eyebrow="Climate &amp; Packing"
              title="Istanbul Seasonal Weather Profiles"
              description="What to expect and how to pack for Istanbul throughout the calendar year."
            />
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-sm p-4 mb-8 flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <strong>Live Forecast Notice:</strong> Real-time 7-day weather feeds activate closer to the confirmed congress dates. Refer to the historical seasonal climate profile below for current packing planning.
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { season: "Spring (Apr–May)", temp: "15°C – 22°C", notes: "Pleasant days, occasional showers. Layers and light jackets recommended." },
                { season: "Summer (Jun–Aug)", temp: "25°C – 32°C", notes: "Warm, sunny, humid near the water. Breathable fabrics, sunscreen, and sunglasses essential." },
                { season: "Autumn (Sep–Oct)", temp: "18°C – 24°C", notes: "Ideal travel weather. Mild evenings, comfortable walking conditions." },
                { season: "Winter (Nov–Feb)", temp: "6°C – 12°C", notes: "Cold, windy near the Bosphorus, occasional rain or light snow. Warm coats required." },
              ].map((w) => (
                <div key={w.season} className="bg-white border border-[#E5E1DA] rounded-sm p-5 shadow-sm">
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
