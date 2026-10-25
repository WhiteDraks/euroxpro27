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
    name: "Kaleiçi (Historic Old Town & Roman Marina)",
    category: "Historic Walled Quarter",
    period: "Roman, Seljuk & Ottoman",
    image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80",
    description: "Antalya's ancient walled heart perched atop sea cliffs. Cobblestone alleyways lined with restored Ottoman mansions descend into the 2nd-century BC Roman harbor with traditional sailing boats.",
    tips: "Walk through the marble arches of Hadrian's Gate and take the panoramic glass elevator down to the harbor.",
    area: "Muratpaşa / Old Town",
  },
  {
    name: "Lower Düden Waterfalls (Aşağı Düden)",
    category: "Natural Wonder",
    period: "Timeless Coastal Geology",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    description: "One of the Mediterranean's most dramatic natural sights: the Düden River cascades 40 meters straight over rocky cliffs directly into the turquoise Mediterranean sea.",
    tips: "Visit the Düden Park clifftop promenade at sunset for breathtaking coastal photography and sea spray breezes.",
    area: "Lara Coastal Park",
  },
  {
    name: "Konyaaltı Coast & Taurus Mountains",
    category: "Mediterranean Shoreline",
    period: "Coastal Boulevard",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    description: "A sweeping 7-kilometer Mediterranean pebble beach framed dramatically by the snow-capped Beydağları (Taurus) mountain range plunging directly into crystal azure waters.",
    tips: "The pedestrian promenade features modern seaside cafes, cycling paths, and open-air seating for delegates.",
    area: "Konyaaltı",
  },
  {
    name: "Ancient Aspendos Amphitheater",
    category: "Classical Antiquity",
    period: "Roman (155 AD)",
    image: "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=800&q=80",
    description: "Widely regarded as the best-preserved ancient Roman theater in the entire Mediterranean world, engineered with peerless acoustics that are still celebrated today.",
    tips: "Stand at the center of the orchestra floor to test the whispering acoustics carrying up to the 41st tier.",
    area: "Serik / Greater Antalya",
  },
  {
    name: "Hadrian's Gate (Üçkapılar)",
    category: "Monumental Gateway",
    period: "Roman (130 AD)",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
    description: "A triumphal triple-arched marble gateway constructed to honor Roman Emperor Hadrian's visit to Antalya. Deep ruts in the stone floor still bear the marks of ancient chariot wheels.",
    tips: "The gate serves as the grand pedestrian threshold transitioning modern Antalya into historic Kaleiçi.",
    area: "City Center Entrance",
  },
  {
    name: "Antalya Archaeological Museum",
    category: "World-Class Museum",
    period: "Pamphylian, Lycian & Roman",
    image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80",
    description: "One of Türkiye's premier antiquities museums, showcasing stunning classical Roman marble statues from Perge, monumental sarcophagi, and Bronze Age artifacts.",
    tips: "Accessible via the heritage Nostalgic Tram terminus right across from Konyaaltı beach.",
    area: "Bahçelievler",
  },
];

const culinaryHighlights = [
  {
    name: "Antalya-Style Piyaz",
    desc: "A regional culinary masterpiece: tender white beans tossed with a rich dressing of crushed sesame tahini, lemon juice, garlic, vinegar, and boiled farm eggs.",
    category: "Signature Regional Dish",
  },
  {
    name: "Fresh Mediterranean Catch (Levrek & Çipura)",
    desc: "Fresh sea bass or sea bream grilled over olive-wood coals, drizzled with local extra virgin olive oil and wild herbs.",
    category: "Mediterranean Seafood",
  },
  {
    name: "Citrus Preserves & Bergamot Jam",
    desc: "Antalya's citrus groves are legendary. Enjoy whole sweet orange, bitter orange, and bergamot jams served with morning cheeses.",
    category: "Breakfast Specialty",
  },
  {
    name: "Mediterranean Serpme Kahvaltı",
    desc: "An elaborate coastal breakfast spread with goat cheeses, garden-grown tomatoes, cucumbers, fresh olives, honey, and hot Turkish tea.",
    category: "Morning Experience",
  },
  {
    name: "Yanık Dondurma (Caramelized Goat Milk Ice Cream)",
    desc: "A historic Antalya dessert made from goat milk subtly scorched during boiling to create a complex, smoky caramel note.",
    category: "Traditional Sweet",
  },
  {
    name: "Turkish Tea & Coffee in the Roman Marina",
    desc: "Sipping traditional tea in delicate tulip glasses overlooking fishing sloops and cliffs as Mediterranean twilight descends.",
    category: "Beverages",
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

export function AntalyaGuide() {
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
            { id: "weather" as TabId, label: "Mediterranean Climate", icon: CloudSun },
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
              eyebrow="Turkish Riviera Heritage"
              title="Must-See Sights in Antalya"
              description="A curated selection of the most significant ancient, coastal, and cultural landmarks easily accessible to delegates."
            />
            <div className="mb-8 p-4 bg-white border border-[#E5E1DA] rounded-sm flex items-start gap-3 text-xs text-[#5A6478]">
              <Info size={16} className="text-[#741F3D] flex-shrink-0 mt-0.5" />
              <span>
                <strong>Cultural Exploration Notice:</strong> The landmarks, museums, and natural sites below are curated suggestions for delegates seeking to experience Antalya independently before, during leisure periods, or following the congress. They are not mandatory excursions or included activities within the official conference fee.
              </span>
            </div>
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
              title="Flavours of the Turkish Riviera"
              description="Mediterranean flavors meet classical Anatolian culinary mastery. From citrus orchards to fresh harbor seafood, here is what delegates should sample."
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
              <h3 className="font-serif-title text-2xl text-[#101B35] mb-4">Dining Etiquette & Hospitality in Antalya</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-xs text-[#5A6478] font-light leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-[#741F3D] mt-0.5 flex-shrink-0" />
                  <span>Saying <em>&ldquo;Afiyet olsun&rdquo;</em> (Bon appétit) before or after sharing food is polite and appreciated.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-[#741F3D] mt-0.5 flex-shrink-0" />
                  <span>Mediterranean hospitality is legendary: complimentary Turkish tea (çay) is customarily offered after meals.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-[#741F3D] mt-0.5 flex-shrink-0" />
                  <span>Local olive oils, citrus, and fresh seafood are seasonal staples celebrated along the Mediterranean coast.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-[#741F3D] mt-0.5 flex-shrink-0" />
                  <span>Tipping around 10% in sit-down restaurants is standard and polite practice.</span>
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
              description="Locals in Antalya genuinely appreciate when international delegates use basic Turkish pleasantries."
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
              title="Congress &amp; Antalya Locations"
              description="Important navigational reference points for delegates during EUROXPRO'27 in Antalya."
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
                <h4 className="font-serif-title text-2xl font-normal text-white">Interactive Venue &amp; Coast Routing</h4>
              </div>
              <p className="text-xs text-[#A7AFBF] mb-6 max-w-2xl font-light leading-relaxed">
                Full interactive routing and venue-to-hotel directions will be enabled once official congress resort properties are formally ratified by the OC.
              </p>
              <div className="aspect-[21/9] w-full rounded-sm overflow-hidden bg-[#172443] border border-[#233152] flex items-center justify-center relative">
                <div className="text-center p-6">
                  <MapPin size={36} className="text-[#741F3D] mx-auto mb-3" />
                  <p className="text-white font-medium text-sm">Antalya, Türkiye Overview</p>
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
              title="Antalya Early Spring Climate Guide (31 March – 4 April)"
              description="What to expect and how to pack for Antalya during the congress period."
            />
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-sm p-4 mb-8 flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <strong>Confirmed Dates Notice:</strong> EUROXPRO&apos;27 takes place <strong>31 March – 4 April 2027</strong>. Early April on the Turkish Riviera features glorious, sunny Mediterranean spring weather with daytime highs averaging 20°C–22°C.
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { season: "Congress Window (Late Mar–Early Apr)", temp: "18°C – 23°C", notes: "Sunny, mild coastal climate. Ideal for outdoor plenaries, walking Kaleiçi, and sea breezes. Light jacket for evening socials." },
                { season: "Spring (Apr–May)", temp: "20°C – 26°C", notes: "Warm, blossoming orange trees, pleasant humidity, long daylight hours." },
                { season: "Summer (Jun–Aug)", temp: "30°C – 38°C", notes: "Hot and sunny Mediterranean summer. High SPF and coastal swimming weather." },
                { season: "Autumn (Sep–Nov)", temp: "22°C – 28°C", notes: "Warm sea temperatures, golden autumn light, comfortable evening air." },
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
