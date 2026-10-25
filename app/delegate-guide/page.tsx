import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DelegateChecklist } from "@/components/delegate/DelegateChecklist";
import { Badge } from "@/components/ui/Badge";
import { siteConfig } from "@/lib/config";
import {
  Plane, Hotel, CreditCard, HeartPulse, CheckSquare,
  FileText, Wifi, Zap, Clock, ExternalLink, ShieldCheck,
  Bus, Train, Info, AlertTriangle
} from "lucide-react";

export const metadata: Metadata = {
  title: "Delegate Guide & Travel Hub",
  description: "Comprehensive guide for international EUROXPRO'27 delegates: airports (IST & SAW), e-Visa links, public transport, currency, healthcare, emergency contacts, and packing checklist.",
};

const guideSections = [
  { id: "travel-visa", label: "Travel & e-Visa", icon: FileText },
  { id: "airports-transit", label: "Airports & Transit", icon: Plane },
  { id: "accommodation", label: "Accommodation Status", icon: Hotel },
  { id: "weather-seasons", label: "Seasonal Climate", icon: Clock },
  { id: "money-banking", label: "Currency & Banking", icon: CreditCard },
  { id: "connectivity", label: "SIM, eSIM & Power", icon: Wifi },
  { id: "health-safety", label: "Health & Emergency", icon: HeartPulse },
  { id: "checklist", label: "Packing Checklist", icon: CheckSquare },
];

export default function DelegateGuidePage() {
  return (
    <div className="pt-20">
      {/* ── HERO BANNER ── */}
      <section className="bg-[#101B35] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-[#233152] bosphorus-grid-dark relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2.5 h-2.5 bg-[#741F3D] rounded-full animate-pulse" />
            <span className="text-[#E5E1DA] text-xs font-mono tracking-[0.25em] uppercase">
              Official Delegate Preparation Hub
            </span>
          </div>
          
          <h1 className="font-serif-title font-normal text-4xl sm:text-6xl text-white max-w-4xl leading-tight">
            International Delegate Handbook
          </h1>
          <p className="mt-4 text-[#A7AFBF] text-base sm:text-lg max-w-3xl leading-relaxed">
            Essential operational briefings for international attendees traveling to Istanbul, Türkiye for EUROXPRO’27. Curated to ensure your journey, stay, and congress experience are smooth and well-planned.
          </p>

          {/* Quick Anchor Navigation */}
          <div className="flex flex-wrap gap-2.5 mt-10">
            {guideSections.map(({ id, label, icon: Icon }) => (
              <a
                key={id}
                href={`#${id}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#172443]/80 border border-[#233152] rounded-sm text-xs font-medium text-[#E5E1DA] hover:text-white hover:border-[#741F3D] transition-colors"
              >
                <Icon size={13} className="text-[#741F3D]" />
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── 1. TRAVEL & VISA RESOURCES ── */}
      <section id="travel-visa" className="py-20 bg-[#F7F3ED] border-b border-[#E5E1DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Entry Formalities"
            title="Passport, Immigration & Official e-Visa"
            description="Verified official guidance for entering the Republic of Türkiye. Check your national requirements well in advance."
          />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Passport Validity Card */}
            <div className="bg-white border border-[#E5E1DA] p-6 rounded-sm space-y-4">
              <div className="flex items-center gap-2.5 text-[#101B35]">
                <FileText size={18} className="text-[#741F3D]" />
                <h3 className="font-serif-title text-xl font-normal">Passport Validity Rules</h3>
              </div>
              <p className="text-xs text-[#5A6478] leading-relaxed">
                Turkish immigration requires ordinary passports to have at least <strong className="text-[#101B35]">6 months of validity</strong> remaining from your planned date of entry, with at least one blank page for entry/exit stamps.
              </p>
              <div className="p-3 bg-[#F7F3ED] rounded-sm border border-[#E5E1DA] text-xs text-[#374151]">
                <strong>Rule of Thumb:</strong> If your passport expires within 6 months of the congress, renew it before traveling.
              </div>
            </div>

            {/* Official e-Visa Portal */}
            <div className="bg-white border border-[#E5E1DA] p-6 rounded-sm space-y-4">
              <div className="flex items-center gap-2.5 text-[#101B35]">
                <ShieldCheck size={18} className="text-[#741F3D]" />
                <h3 className="font-serif-title text-xl font-normal">Official e-Visa Portal</h3>
              </div>
              <p className="text-xs text-[#5A6478] leading-relaxed">
                Many European and worldwide citizens can obtain an electronic visa online in approximately 3 minutes.
              </p>
              <div className="space-y-2">
                <a
                  href="https://www.evisa.gov.tr/en/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between w-full p-2.5 bg-[#101B35] text-white text-xs font-semibold rounded-sm hover:bg-[#741F3D] transition-colors"
                >
                  <span>Official e-Visa Portal (evisa.gov.tr)</span>
                  <ExternalLink size={13} />
                </a>
                <a
                  href="https://www.mfa.gov.tr/visa-information-for-foreigners.en.mfa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between w-full p-2.5 border border-[#E5E1DA] text-[#101B35] text-xs font-semibold rounded-sm hover:border-[#101B35] transition-colors"
                >
                  <span>MFA Visa Requirements Directory</span>
                  <ExternalLink size={13} />
                </a>
              </div>
              <p className="text-[11px] text-[#8F9AA0] italic">
                *Caution: Always apply through official Republic of Türkiye government portals (.gov.tr) to avoid third-party agency surcharges.
              </p>
            </div>

            {/* OC Support Letters */}
            <div className="bg-white border border-[#E5E1DA] p-6 rounded-sm space-y-4">
              <div className="flex items-center gap-2.5 text-[#101B35]">
                <Info size={18} className="text-[#741F3D]" />
                <h3 className="font-serif-title text-xl font-normal">Congress Visa Letters</h3>
              </div>
              <p className="text-xs text-[#5A6478] leading-relaxed">
                If your consular authority requires an official invitation or visa support document from the host entity:
              </p>
              <ul className="text-xs text-[#5A6478] space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#741F3D] mt-1.5 flex-shrink-0" />
                  <span>Obtain your confirmed registration receipt</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#741F3D] mt-1.5 flex-shrink-0" />
                  <span>Contact the OC via the <a href="/contact" className="text-[#741F3D] font-semibold underline">Contact page</a> specifying passport details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#741F3D] mt-1.5 flex-shrink-0" />
                  <span>Allow at least 7-10 business days for processing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. AIRPORTS & GROUND TRANSPORTATION ── */}
      <section id="airports-transit" className="py-20 bg-white border-b border-[#E5E1DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Arrival Logistics"
            title="Navigating Istanbul Airports & Public Transit"
            description="Istanbul operates two modern international airports on separate continents. Here is how to plan your ground transfer."
          />

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* IST Card */}
            <div className="border border-[#E5E1DA] p-6 sm:p-8 rounded-sm bg-[#F7F3ED]/40">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#741F3D] uppercase block">European Side</span>
                  <h3 className="font-serif-title text-2xl text-[#101B35]">Istanbul Airport (IST)</h3>
                </div>
                <Badge variant="navy">Primary Hub</Badge>
              </div>
              <p className="text-xs text-[#5A6478] leading-relaxed mb-6">
                Located in Arnavutköy on the European side. Modern, massive international terminal serving major global carriers.
              </p>
              <div className="space-y-3 text-xs text-[#374151]">
                <div className="p-3 bg-white border border-[#E5E1DA] rounded-sm">
                  <strong className="block text-[#101B35] mb-1 flex items-center gap-1.5">
                    <Bus size={14} className="text-[#741F3D]" /> Havaist Airport Express Buses:
                  </strong>
                  Frequent coach lines depart directly from Floor -2 to major transit hubs across Istanbul (Taksim, Kadıköy, Yenikapı). Credit/debit cards accepted on board.
                </div>
                <div className="p-3 bg-white border border-[#E5E1DA] rounded-sm">
                  <strong className="block text-[#101B35] mb-1 flex items-center gap-1.5">
                    <Train size={14} className="text-[#741F3D]" /> Metro Line M11:
                  </strong>
                  Connects airport directly with Gayrettepe and Kağıthane interchange stations for easy transfer to lines M2 and M7.
                </div>
              </div>
            </div>

            {/* SAW Card */}
            <div className="border border-[#E5E1DA] p-6 sm:p-8 rounded-sm bg-[#F7F3ED]/40">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#741F3D] uppercase block">Asian / Anatolian Side</span>
                  <h3 className="font-serif-title text-2xl text-[#101B35]">Sabiha Gökçen Airport (SAW)</h3>
                </div>
                <Badge variant="muted">Secondary Hub</Badge>
              </div>
              <p className="text-xs text-[#5A6478] leading-relaxed mb-6">
                Located in Pendik on the Asian side. Popular hub for regional European low-cost carriers (e.g. Pegasus Airlines, AJet).
              </p>
              <div className="space-y-3 text-xs text-[#374151]">
                <div className="p-3 bg-white border border-[#E5E1DA] rounded-sm">
                  <strong className="block text-[#101B35] mb-1 flex items-center gap-1.5">
                    <Bus size={14} className="text-[#741F3D]" /> Havabüs Express Coaches:
                  </strong>
                  Regular airport coach service directly to Kadıköy and Taksim Square. Tickets purchased curbside before boarding.
                </div>
                <div className="p-3 bg-white border border-[#E5E1DA] rounded-sm">
                  <strong className="block text-[#101B35] mb-1 flex items-center gap-1.5">
                    <Train size={14} className="text-[#741F3D]" /> Metro Line M4:
                  </strong>
                  Provides seamless subway connection from airport arrivals hall directly into Kadıköy and Marmaray rail lines.
                </div>
              </div>
            </div>
          </div>

          {/* Istanbulkart & Taxi Rules */}
          <div className="border border-[#233152] bg-[#101B35] text-white p-6 sm:p-8 rounded-sm">
            <h4 className="font-serif-title text-xl text-white mb-4">Essential Istanbul Public Transit Rules</h4>
            <div className="grid sm:grid-cols-3 gap-6 text-xs text-[#A7AFBF] leading-relaxed">
              <div>
                <strong className="text-white block mb-1">Istanbulkart (Card):</strong>
                A single reloadable smartcard accepted on all Metros, Trams (T1/T4), City Ferries (Şehir Hatları), and public buses. Purchase at yellow Biletmatik kiosks at airport stations.
              </div>
              <div>
                <strong className="text-white block mb-1">Official Taxis (Sarı Taksi):</strong>
                Only take official licensed yellow cabs from designated taxi ranks. Always check that the digital taximeter is turned on at the start of your journey.
              </div>
              <div>
                <strong className="text-white block mb-1">Ride-Hailing Apps:</strong>
                Both <strong className="text-[#E5E1DA]">BiTaksi</strong> and <strong className="text-[#E5E1DA]">Uber</strong> operate safely in Istanbul, hailing standard metered yellow or turquoise taxis with cashless in-app payment.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. ACCOMMODATION TRANSPARENCY STATUS ── */}
      <section id="accommodation" className="py-20 bg-[#F7F3ED] border-b border-[#E5E1DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Lodging & Venue"
            title="Accommodation & Location Status"
            description="Clear distinction between confirmed congress logistical framework and pending venue negotiations."
          />

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-sm p-5 mb-8 flex items-start gap-3">
            <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong>Official Status Disclosure:</strong> Exact congress hotel and venue addresses are currently undergoing final contract negotiations with Istanbul hospitality partners. To prevent misinformation, no unconfirmed property names are fabricated. Verified booking links and rooming layouts will be emailed directly to registered delegates.
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Host Hotel", val: siteConfig.hotelName, status: "To Be Confirmed" },
              { label: "Hotel Address", val: siteConfig.hotelAddress, status: "To Be Confirmed" },
              { label: "Check-in / Check-out", val: "Standard 14:00 In / 12:00 Out", status: "Indicative Policy" },
              { label: "Congress Venue", val: siteConfig.venueName, status: "To Be Confirmed" }
            ].map((item) => (
              <div key={item.label} className="bg-white border border-[#E5E1DA] p-5 rounded-sm">
                <span className="text-[10px] text-[#741F3D] font-mono tracking-wider uppercase block mb-1">
                  {item.status}
                </span>
                <p className="text-xs text-[#8F9AA0] uppercase font-semibold">{item.label}</p>
                <p className="text-sm font-semibold text-[#101B35] mt-1 font-mono">{item.val}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. SEASONAL WEATHER GUIDANCE ── */}
      <section id="weather-seasons" className="py-20 bg-white border-b border-[#E5E1DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Meteorology & Planning"
            title="Seasonal Istanbul Climate Guide"
            description="Accurate seasonal weather profiles for Istanbul to help international delegates pack appropriately."
          />

          <div className="p-4 bg-[#F7F3ED] border border-[#E5E1DA] rounded-sm mb-8 text-xs text-[#5A6478]">
            <span className="font-semibold text-[#101B35]">Live Weather Note:</span> Real-time 7-day live weather API feeds will become active closer to the official congress dates once confirmed on the calendar.
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                season: "Spring (Apr – May)",
                temp: "15°C – 22°C (59°F – 72°F)",
                climate: "Mild days, cool coastal breezes, occasional brief spring rain.",
                packing: "Light trench coat, cardigan, umbrella, comfortable trainers."
              },
              {
                season: "Summer (Jun – Aug)",
                temp: "25°C – 32°C (77°F – 90°F)",
                climate: "Warm and sunny with noticeable humidity near the waterfront.",
                packing: "Breathable linen/cotton, sunscreen, sunglasses, hat."
              },
              {
                season: "Autumn (Sep – Oct)",
                temp: "18°C – 24°C (64°F – 75°F)",
                climate: "Crisp and pleasant, prime weather for urban exploration.",
                packing: "Light jackets, layered outfits, sturdy walking shoes."
              },
              {
                season: "Winter (Nov – Feb)",
                temp: "6°C – 12°C (43°F – 54°F)",
                climate: "Chilly winds along the Bosphorus, rain and occasional snow.",
                packing: "Thermal underlayers, warm winter coat, scarf, gloves."
              }
            ].map((w) => (
              <div key={w.season} className="border border-[#E5E1DA] p-6 rounded-sm bg-[#F7F3ED]/30">
                <h4 className="font-serif-title text-xl text-[#101B35] mb-1">{w.season}</h4>
                <p className="text-sm font-bold text-[#741F3D] mb-3 font-mono">{w.temp}</p>
                <p className="text-xs text-[#5A6478] mb-3 leading-relaxed">{w.climate}</p>
                <div className="pt-3 border-t border-[#E5E1DA] text-[11px] text-[#374151]">
                  <strong>What to Pack:</strong> {w.packing}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. CURRENCY, CARDS & BANKING ── */}
      <section id="money-banking" className="py-20 bg-[#F7F3ED] border-b border-[#E5E1DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Financial Practicalities"
            title="Currency, Cards, Cash & Tipping in Türkiye"
            description="Clear guidance on using foreign cards, ATMs, and local currency in Istanbul."
          />

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#E5E1DA] p-6 rounded-sm space-y-3">
              <h4 className="font-serif-title text-lg text-[#101B35]">Currency: Turkish Lira (TRY / ₺)</h4>
              <p className="text-xs text-[#5A6478] leading-relaxed">
                All daily expenses in Istanbul are billed in Turkish Lira. While some bazaar stores accept Euros or USD, payment in local TRY avoids disadvantageous merchant conversion rates.
              </p>
            </div>

            <div className="bg-white border border-[#E5E1DA] p-6 rounded-sm space-y-3">
              <h4 className="font-serif-title text-lg text-[#101B35]">Credit &amp; Debit Cards</h4>
              <p className="text-xs text-[#5A6478] leading-relaxed">
                Contactless Visa and Mastercard are nearly universal in supermarkets, transit, hotels, and cafes. Always select <strong>&ldquo;Pay in TRY&rdquo;</strong> on card terminals to avoid dynamic currency conversion (DCC) markups.
              </p>
            </div>

            <div className="bg-white border border-[#E5E1DA] p-6 rounded-sm space-y-3">
              <h4 className="font-serif-title text-lg text-[#101B35]">ATMs &amp; Cash Exchange</h4>
              <p className="text-xs text-[#5A6478] leading-relaxed">
                Withdraw TRY directly from major bank ATMs (İşbank, Garanti BBVA, Akbank, Yapı Kredi) rather than independent standalone kiosks that impose hefty non-client withdrawal commissions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. CONNECTIVITY, ESIM & ELECTRICAL PLUGS ── */}
      <section id="connectivity" className="py-20 bg-white border-b border-[#E5E1DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Technical Readiness"
            title="Staying Connected & Device Compatibility"
            description="Mobile data connectivity, international eSIM suggestions, and power specifications."
          />

          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-[#E5E1DA] p-6 rounded-sm bg-[#F7F3ED]/30 space-y-4">
              <h4 className="font-serif-title text-xl text-[#101B35] flex items-center gap-2">
                <Wifi size={18} className="text-[#741F3D]" /> Mobile Data &amp; Local eSIM
              </h4>
              <ul className="text-xs text-[#5A6478] space-y-3 leading-relaxed">
                <li>
                  <strong className="text-[#101B35]">eSIM (Recommended):</strong> Providers like Airalo, Maya Mobile, or Holafly allow you to purchase a prepaid Turkish data package before landing without swapping physical cards.
                </li>
                <li>
                  <strong className="text-[#101B35]">Physical Tourist SIM:</strong> Available at IST/SAW arrival halls and official operator stores (Turkcell, Vodafone, Türk Telekom). Passport registration is legally required.
                </li>
                <li>
                  <strong className="text-[#101B35]">EU Roaming:</strong> Note that Türkiye is outside the European Union. Standard &ldquo;Roam Like at Home&rdquo; rules generally do not apply unless your carrier explicitly includes Türkiye.
                </li>
              </ul>
            </div>

            <div className="border border-[#E5E1DA] p-6 rounded-sm bg-[#F7F3ED]/30 space-y-4">
              <h4 className="font-serif-title text-xl text-[#101B35] flex items-center gap-2">
                <Zap size={18} className="text-[#741F3D]" /> Electricity &amp; Voltage
              </h4>
              <div className="space-y-3 text-xs text-[#5A6478] leading-relaxed">
                <p>
                  <strong className="text-[#101B35]">Plug Type:</strong> Type C and Type F (standard European two-round-pin sockets).
                </p>
                <p>
                  <strong className="text-[#101B35]">Standard Voltage:</strong> 220V, 50Hz. Delegates from the UK, US, or other regions will require a plug pin adapter. Dual-voltage laptop/phone chargers operate automatically.
                </p>
                <div className="p-3 bg-white border border-[#E5E1DA] rounded-sm text-[11px] text-[#374151]">
                  <strong>Congress Pro-Tip:</strong> Bring a compact portable power bank (10,000–20,000 mAh) for full-day congress sessions and city transit.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. HEALTH, SAFETY & EMERGENCY SERVICES ── */}
      <section id="health-safety" className="py-20 bg-[#101B35] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Delegate Welfare"
            title="Health, Safety & Critical Emergency Numbers"
            description="24/7 emergency dispatch services in Türkiye and healthcare protocols for congress participants."
            light
          />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 112 Unified Service */}
            <div className="border border-[#233152] bg-[#172443] p-6 rounded-sm space-y-4">
              <span className="text-[10px] font-mono tracking-widest text-[#741F3D] uppercase block">Unified Emergency</span>
              <div className="flex items-baseline gap-3">
                <span className="font-serif-title text-5xl text-white font-bold">112</span>
                <span className="text-xs text-[#A7AFBF]">Toll-Free 24/7 Dispatch</span>
              </div>
              <p className="text-xs text-[#A7AFBF] leading-relaxed">
                In Türkiye, <strong>112</strong> serves as the unified emergency hotline covering Ambulance, Police (Polis), Fire (İtfaiye), and Coast Guard. English-speaking dispatchers are available.
              </p>
            </div>

            {/* Pharmacies (Eczane) */}
            <div className="border border-[#233152] bg-[#172443] p-6 rounded-sm space-y-4">
              <span className="text-[10px] font-mono tracking-widest text-[#741F3D] uppercase block">Medical Services</span>
              <h4 className="font-serif-title text-xl text-white">Pharmacies (Eczane)</h4>
              <p className="text-xs text-[#A7AFBF] leading-relaxed">
                Turkish pharmacies are easily identified by a red illuminated <strong>&ldquo;E&rdquo;</strong> sign. Pharmacists can dispense many common remedies. Outside business hours and on Sundays, a designated <em>&ldquo;Nöbetçi Eczane&rdquo;</em> (Duty Pharmacy) in each neighborhood remains open all night.
              </p>
            </div>

            {/* Dietary & Allergies */}
            <div className="border border-[#233152] bg-[#172443] p-6 rounded-sm space-y-4">
              <span className="text-[10px] font-mono tracking-widest text-[#741F3D] uppercase block">Nutrition &amp; Dietary</span>
              <h4 className="font-serif-title text-xl text-white">Dietary &amp; Food Allergens</h4>
              <p className="text-xs text-[#A7AFBF] leading-relaxed">
                Turkish cuisine widely utilizes nuts (pistachios, walnuts), gluten, and dairy. Halal meat is standard nationwide. If you have severe celiac, vegan, or anaphylactic allergies, inform the OC via registration forms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. INTERACTIVE PACKING CHECKLIST ── */}
      <section id="checklist" className="py-20 bg-[#F7F3ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Interactive Preparation"
            title="Delegate Packing & Readiness Checklist"
            description="Interactive progress tracker stored safely in your device browser storage. Check off requirements as you pack."
          />
          <DelegateChecklist />
        </div>
      </section>
    </div>
  );
}
