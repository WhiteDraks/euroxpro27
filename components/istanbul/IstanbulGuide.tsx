"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { usefulLocations } from "@/lib/config";
import {
  Compass, Utensils, MapPin, CloudSun, ExternalLink,
  Info, AlertCircle, Clock, Check
} from "lucide-react";

const attractions = [
  {
    name: "Hagia Sophia (Ayasofya)",
    category: "Historic Landmark",
    period: "Byzantine / Ottoman",
    description: "Built in 537 AD as the patriarchal cathedral of Constantinople, Hagia Sophia is one of the greatest surviving architectural marvels in the world. Famous for its massive dome and stunning gold mosaics.",
    tips: "Dress modestly (shoulders & knees covered; headscarf required for women). Footwear is removed at entrance.",
    area: "Sultanahmet",
  },
  {
    name: "The Blue Mosque (Sultanahmet Camii)",
    category: "Mosque",
    period: "Ottoman (1616)",
    description: "Known for its six minarets and interior walls adorned with more than 20,000 hand-painted Iznik ceramic tiles in shades of blue. It remains an active place of worship.",
    tips: "Closed to visitors during prayer times (approximately 30-45 mins 5 times a day). Modest dress mandatory.",
    area: "Sultanahmet",
  },
  {
    name: "Galata Tower (Galata Kulesi)",
    category: "Tower / Viewpoint",
    period: "Genoese (1348)",
    description: "A medieval stone tower dominating the skyline north of the Golden Horn. Offers panoramic 360-degree views of historic Istanbul, the Bosphorus, and the Marmara Sea.",
    tips: "Visit early morning or near sunset for the best light and shorter queues. Elevator to the top gallery.",
    area: "Beyoğlu / Karaköy",
  },
  {
    name: "The Grand Bazaar (Kapalıçarşı)",
    category: "Historic Market",
    period: "Ottoman (1461)",
    description: "One of the oldest and largest covered markets in the world, spanning 61 streets with over 4,000 shops selling carpets, jewelry, ceramics, spices, lanterns, and leather goods.",
    tips: "Polite bargaining is customary and part of the experience. Closed on Sundays.",
    area: "Beyazıt",
  },
  {
    name: "Basilica Cistern (Yerebatan Sarnıcı)",
    category: "Historic Subterranean",
    period: "Byzantine (532 AD)",
    description: "An ancient subterranean cistern built by Emperor Justinian with 336 marble columns rising from shallow water, including two famed Medusa head column bases.",
    tips: "Atmospheric dim lighting and wooden walkways. Book tickets online in advance to avoid queues.",
    area: "Sultanahmet",
  },
  {
    name: "The Bosphorus Waterfront & Ferry",
    category: "Scenic Experience",
    period: "Timeless",
    description: "The 32-km strait separating Europe and Asia. Taking a public ferry (Şehir Hatları) across the Bosphorus between Eminönü and Kadıköy is an essential, classic Istanbul experience.",
    tips: "You can tap your Istanbulkart on standard public ferries. Enjoy hot Turkish tea and simit on board.",
    area: "Eminönü / Kadıköy",
  },
];

const culinaryHighlights = [
  {
    name: "Turkish Breakfast (Serpme Kahvaltı)",
    desc: "A banquet of cheeses, olives, tomatoes, cucumbers, honey with clotted cream (kaymak), eggs (menemen), fresh bread, and endless black tea.",
    category: "Experience",
  },
  {
    name: "Simit",
    desc: "The quintessential Istanbul street food — circular bread encrusted with sesame seeds. Crispy on the outside, soft inside, sold from iconic red carts.",
    category: "Street Food",
  },
  {
    name: "Döner & Kebabs",
    desc: "From thinly sliced döner to spicy Adana kebab, Turkish grilled meats are seasoned with sumac, onions, and wrapped in warm lavash.",
    category: "Main Dishes",
  },
  {
    name: "Turkish Tea (Çay) & Coffee",
    desc: "Served in delicate tulip-shaped glasses, çay is a social ritual. Turkish coffee is unfiltered, brewed in a cezve, and served with a piece of Turkish delight.",
    category: "Beverages",
  },
  {
    name: "Baklava & Desserts",
    desc: "Layers of paper-thin phyllo dough filled with crushed Antep pistachios and drenched in light syrup. Pair with Turkish ice cream (maraş dondurması).",
    category: "Sweets",
  },
  {
    name: "Meze & Seafood",
    desc: "Small plates including hummus, haydari (garlic yogurt), roasted eggplant (şakşuka), and freshly grilled Black Sea sea bass or anchovies (hamsi).",
    category: "Dining",
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
  { tr: "Kolay gelsin", en: "May it be easy (wishing good work)", pronunciation: "koh-ly gehl-sin" },
];

export function IstanbulGuide() {
  const [activeTab, setActiveTab] = useState<"attractions" | "food" | "phrases" | "map" | "weather">("attractions");

  return (
    <div className="py-16 bg-[#F7F3ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-12 border-b border-[#E3E0DC] pb-4">
          {[
            { id: "attractions", label: "Must-See Attractions", icon: Compass },
            { id: "food", label: "Food & Culture", icon: Utensils },
            { id: "phrases", label: "Useful Phrases", icon: Info },
            { id: "map", label: "Congress & City Map", icon: MapPin },
            { id: "weather", label: "Seasonal Weather", icon: CloudSun },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-medium transition-colors ${
                activeTab === id
                  ? "bg-[#741F3D] text-white"
                  : "bg-white border border-[#E3E0DC] text-[#5A6478] hover:text-[#101B35]"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab 1: Attractions */}
        {activeTab === "attractions" && (
          <div>
            <SectionHeader
              eyebrow="Iconic Landmarks"
              title="Must-See Places in Istanbul"
              description="A curated selection of the most significant architectural, cultural, and historic sites within easy reach."
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {attractions.map((item) => (
                <Card key={item.name} className="flex flex-col h-full bg-white">
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <Badge variant="burgundy">{item.category}</Badge>
                      <span className="text-xs text-[#A7AFBF] flex items-center gap-1 font-mono">
                        <MapPin size={11} /> {item.area}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-xl text-[#101B35] mb-2">{item.name}</h3>
                    <p className="text-xs text-[#741F3D] font-medium mb-3">{item.period}</p>
                    <p className="text-sm text-[#5A6478] leading-relaxed mb-4 flex-1">{item.description}</p>
                    <div className="pt-3 border-t border-[#E3E0DC] bg-[#F7F3ED]/50 -mx-6 -mb-6 p-4">
                      <p className="text-xs text-[#101B35] font-semibold mb-1">Delegate Tip:</p>
                      <p className="text-xs text-[#5A6478]">{item.tips}</p>
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
              description="Turkish culinary culture is renowned worldwide. From street side carts to riverside meze tables, here is what not to miss."
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {culinaryHighlights.map((dish) => (
                <Card key={dish.name} className="bg-white p-6">
                  <Badge variant="navy" className="mb-3">{dish.category}</Badge>
                  <h3 className="font-display font-bold text-lg text-[#101B35] mb-2">{dish.name}</h3>
                  <p className="text-sm text-[#5A6478] leading-relaxed">{dish.desc}</p>
                </Card>
              ))}
            </div>

            <div className="mt-12 bg-white border border-[#E3E0DC] rounded-lg p-8">
              <h3 className="font-display font-bold text-2xl text-[#101B35] mb-4">Dining Etiquette in Türkiye</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-[#5A6478]">
                <div className="flex items-start gap-2">
                  <Check size={16} className="text-[#741F3D] mt-0.5 flex-shrink-0" />
                  <span>Saying <em>&ldquo;Afiyet olsun&rdquo;</em> (Bon appétit) before or after a meal is polite and appreciated.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={16} className="text-[#741F3D] mt-0.5 flex-shrink-0" />
                  <span>Turkish hospitality is genuine — complimentary tea (çay) is often offered after a meal as a gesture of welcome.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={16} className="text-[#741F3D] mt-0.5 flex-shrink-0" />
                  <span>Water served in sealed bottles at tables may be charged; check if complimentary or billed.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={16} className="text-[#741F3D] mt-0.5 flex-shrink-0" />
                  <span>Tipping around 10% is standard in table-service restaurants.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Useful Phrases */}
        {activeTab === "phrases" && (
          <div>
            <SectionHeader
              eyebrow="Language Basics"
              title="Helpful Turkish Expressions"
              description="Locals in Istanbul appreciate when international guests use basic Turkish courtesies. Here are essentials for your stay."
            />
            <div className="grid sm:grid-cols-2 gap-4">
              {turkishPhrases.map((phrase) => (
                <div key={phrase.tr} className="bg-white border border-[#E3E0DC] rounded-lg p-5">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-display font-bold text-xl text-[#741F3D]">{phrase.tr}</span>
                    <span className="text-sm font-semibold text-[#101B35]">{phrase.en}</span>
                  </div>
                  <span className="text-xs text-[#A7AFBF] font-mono italic">Pronunciation: {phrase.pronunciation}</span>
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
              title="Congress & City Locations"
              description="Important reference points for delegates during EUROXPRO'27."
            />
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              {usefulLocations.map((loc) => (
                <div key={loc.id} className="bg-white border border-[#E3E0DC] rounded-lg p-5">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={loc.placeholder ? "warning" : "navy"}>
                      {loc.placeholder ? "Address Pending" : loc.category}
                    </Badge>
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#101B35] mb-1">{loc.name}</h3>
                  <p className="text-sm text-[#5A6478] mb-3">{loc.description}</p>
                  <p className="text-xs text-[#A7AFBF] mb-3 font-mono">{loc.address}</p>
                  <a
                    href={loc.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#741F3D] font-semibold hover:underline"
                  >
                    Open in Google Maps <ExternalLink size={11} />
                  </a>
                </div>
              ))}
            </div>

            {/* Embedded Directions Map */}
            <div className="bg-[#101B35] rounded-lg p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={18} className="text-[#741F3D]" />
                <h4 className="font-display font-bold text-lg">Interactive Map Integration</h4>
              </div>
              <p className="text-sm text-[#A7AFBF] mb-4">
                Full interactive routing and venue-to-hotel directions will be enabled once official congress venues and hotel properties are formally ratified by the OC.
              </p>
              <div className="aspect-[16/9] w-full rounded-md overflow-hidden bg-[#172443] border border-[#2A3556] flex items-center justify-center">
                <div className="text-center p-6">
                  <MapPin size={36} className="text-[#741F3D] mx-auto mb-3" />
                  <p className="text-white font-medium text-sm">Istanbul, Türkiye Overview</p>
                  <p className="text-xs text-[#A7AFBF] mt-1">Official pins will sync when addresses are released.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Seasonal Weather */}
        {activeTab === "weather" && (
          <div>
            <SectionHeader
              eyebrow="Climate & Attire"
              title="Istanbul Seasonal Weather Guidance"
              description="What to expect and how to pack for Istanbul throughout the year."
            />
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-8 flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <strong>Live Weather Integration Notice:</strong> Live 7-day meteorological forecasts require official congress dates to be confirmed. In the interim, refer to the seasonal climate guide below for packing guidance.
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { season: "Spring (Apr–May)", temp: "15°C – 22°C", notes: "Pleasant days, occasional showers. Layers and light jackets recommended." },
                { season: "Summer (Jun–Aug)", temp: "25°C – 32°C", notes: "Warm, sunny, humid near the water. Breathable fabrics, sunscreen, and sunglasses essential." },
                { season: "Autumn (Sep–Oct)", temp: "18°C – 24°C", notes: "Ideal travel weather. Mild evenings, comfortable walking conditions." },
                { season: "Winter (Nov–Feb)", temp: "6°C – 12°C", notes: "Cold, windy near the Bosphorus, occasional rain or light snow. Warm coats required." },
              ].map((w) => (
                <div key={w.season} className="bg-white border border-[#E3E0DC] rounded-lg p-5">
                  <h4 className="font-display font-bold text-lg text-[#101B35] mb-2">{w.season}</h4>
                  <p className="text-xl font-bold text-[#741F3D] mb-3">{w.temp}</p>
                  <p className="text-xs text-[#5A6478] leading-relaxed">{w.notes}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
