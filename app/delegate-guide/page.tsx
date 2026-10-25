import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PageHero } from "@/components/ui/PageHero";
import { DelegateChecklist } from "@/components/delegate/DelegateChecklist";
import { Badge } from "@/components/ui/Badge";
import { siteConfig } from "@/lib/config";
import { ExternalLink, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Delegate Guide & Travel Hub — Antalya",
  description: "Comprehensive guide for international EUROXPRO'27 delegates: Antalya Airport (AYT), e-Visa links, AntRay transit, currency, healthcare, emergency contacts, and packing checklist.",
  alternates: { canonical: "/delegate-guide" },
};

const guideSections = [
  { id: "registration-info", label: "Registration & Profile" },
  { id: "travel-visa", label: "Travel & e-Visa" },
  { id: "airports-transit", label: "Airports & Transit" },
  { id: "accommodation", label: "Accommodation Status" },
  { id: "weather-seasons", label: "Seasonal Climate" },
  { id: "money-banking", label: "Currency & Banking" },
  { id: "connectivity", label: "SIM, eSIM & Power" },
  { id: "health-safety", label: "Health & Emergency" },
  { id: "checklist", label: "Packing Checklist" },
  { id: "announcements-faq", label: "Bulletins & FAQ" },
];

export default function DelegateGuidePage() {
  return (
    <div className="pt-16 lg:pt-20">
      <PageHero
        eyebrow="Before you travel"
        title="Delegate Handbook"
        intro="Everything you need for the trip to Antalya: entry rules and e-Visa, getting in from the airport, money, phones, health, and a packing list you can tick off."
      >
        <nav aria-label="Guide contents">
          <p className="kicker text-[#101B35] mb-3">Contents</p>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 text-sm">
            {guideSections.map(({ id, label }, i) => (
              <li key={id} className="border-t border-[#E5E1DA]">
                <a href={`#${id}`} className="flex items-baseline gap-3 py-2.5 text-[#101B35] hover:text-[#741F3D] transition-colors">
                  <span className="font-serif-title italic text-[#741F3D] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </PageHero>

      {/* ── 0. REGISTRATION & PARTICIPATION INFORMATION ── */}
      <section id="registration-info" className="py-20 bg-white border-b border-[#E5E1DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Delegation Process"
            title="Registration &amp; Participation Criteria"
            description="Guidelines on who attends EUROXPRO'27, national allocation procedures, and pre-conference accreditation."
          />

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="border-t border-[#101B35] pt-6 space-y-4">
              <span className="text-[11px] tracking-[0.08em] text-[#741F3D] uppercase block">
                Delegate Profile
              </span>
              <h3 className="font-serif-title text-xl text-[#101B35] font-normal">
                Who Attends EUROXPRO?
              </h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                EUROXPRO is convened specifically for <strong>AIESEC in Europe</strong> entity leadership:
              </p>
              <ul className="space-y-1.5 text-sm text-[#374151]">
                <li className="flex items-center gap-2">
                  <span className="text-[#741F3D] font-bold">•</span>
                  <span>Member Committee (MC) Presidents &amp; VPs</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#741F3D] font-bold">•</span>
                  <span>Local Committee (LC) Presidents &amp; Executive Boards</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#741F3D] font-bold">•</span>
                  <span>National functional managers &amp; team leaders</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#741F3D] font-bold">•</span>
                  <span>Invited international partners, trainers &amp; alumni</span>
                </li>
              </ul>
            </div>

            <div className="border-t border-[#101B35] pt-6 space-y-4">
              <span className="text-[11px] tracking-[0.08em] text-[#741F3D] uppercase block">
                Application Flow
              </span>
              <h3 className="font-serif-title text-xl text-[#101B35] font-normal">
                National Quotas &amp; Allocations
              </h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Participation spots are managed via national delegations. Individual members apply through their respective <strong>Member Committee</strong> delegation manager:
              </p>
              <div className="pl-4 border-l-2 border-[#741F3D] text-sm text-[#374151] space-y-1">
                <span className="font-semibold block text-[#101B35]">Status: Registration Opening Soon</span>
                <p className="text-[#4B5563]">
                  Official registration fees, rooming tiers, and national allocation quotas will be announced in official communiqués to all MCs.
                </p>
              </div>
            </div>

            <div className="border-t border-[#101B35] pt-6 space-y-4">
              <span className="text-[11px] tracking-[0.08em] text-[#741F3D] uppercase block">
                Package Inclusions
              </span>
              <h3 className="font-serif-title text-xl text-[#101B35] font-normal">
                Standard Delegate Package
              </h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Once confirmed, official delegate packages typically cover:
              </p>
              <ul className="space-y-1.5 text-sm text-[#374151]">
                <li className="flex items-center gap-2">
                  <span className="text-[#741F3D] font-bold">•</span>
                  <span>Accreditation &amp; access to all plenary and breakout tracks</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#741F3D] font-bold">•</span>
                  <span>Congress accommodation according to chosen tier</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#741F3D] font-bold">•</span>
                  <span>Daily meals (breakfast, lunch, dinner &amp; coffee breaks)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#741F3D] font-bold">•</span>
                  <span>Official congress social evenings</span>
                </li>
              </ul>
            </div>
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
            <div className="border-t border-[#101B35] pt-6 space-y-4">
              <div className="flex items-center gap-2.5 text-[#101B35]">
                <h3 className="font-serif-title text-xl font-normal">Passport Validity Rules</h3>
              </div>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Turkish immigration requires ordinary passports to have at least <strong className="text-[#101B35]">6 months of validity</strong> remaining from your planned date of entry, with at least one blank page for entry/exit stamps.
              </p>
              <div className="pl-4 border-l-2 border-[#741F3D] text-sm text-[#374151]">
                <strong>Rule of Thumb:</strong> If your passport expires within 6 months of the congress, renew it before traveling.
              </div>
            </div>

            {/* Official e-Visa Portal */}
            <div className="border-t border-[#101B35] pt-6 space-y-4">
              <div className="flex items-center gap-2.5 text-[#101B35]">
                <h3 className="font-serif-title text-xl font-normal">Official e-Visa Portal</h3>
              </div>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Many European and worldwide citizens can obtain an electronic visa online in approximately 3 minutes.
              </p>
              <div className="space-y-2">
                <a
                  href="https://www.evisa.gov.tr/en/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between w-full p-2.5 bg-[#101B35] text-white text-sm font-semibold rounded-sm hover:bg-[#741F3D] transition-colors"
                >
                  <span>Official e-Visa Portal (evisa.gov.tr)</span>
                  <ExternalLink size={13} />
                </a>
                <a
                  href="https://www.mfa.gov.tr/visa-information-for-foreigners.en.mfa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between w-full p-2.5 border border-[#E5E1DA] text-[#101B35] text-sm font-semibold rounded-sm hover:border-[#101B35] transition-colors"
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
            <div className="border-t border-[#101B35] pt-6 space-y-4">
              <div className="flex items-center gap-2.5 text-[#101B35]">
                <h3 className="font-serif-title text-xl font-normal">Congress Visa Letters</h3>
              </div>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                If your consular authority requires an official invitation or visa support document from the host entity:
              </p>
              <ul className="text-sm text-[#4B5563] space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-[#741F3D] mt-2 flex-shrink-0" />
                  <span>Obtain your confirmed registration receipt</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-[#741F3D] mt-2 flex-shrink-0" />
                  <span>Contact the OC via the <a href="/contact" className="text-[#741F3D] font-semibold underline">Contact page</a> specifying passport details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-[#741F3D] mt-2 flex-shrink-0" />
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
            title="Navigating Antalya Airport & Ground Transit"
            description="Antalya Airport (AYT) is the primary international gateway to the Turkish Riviera. Here is how to plan your arrival and transfers."
          />

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* AYT Airport Card */}
            <div className="border-t border-[#101B35] pt-6 sm:pt-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-[11px] tracking-[0.08em] text-[#741F3D] uppercase block">Primary Gateway</span>
                  <h3 className="font-serif-title text-2xl text-[#101B35]">Antalya Airport (AYT)</h3>
                </div>
                <Badge variant="navy">International Hub</Badge>
              </div>
              <p className="text-sm text-[#4B5563] leading-relaxed mb-6">
                Located ~13 km northeast of central Antalya. AYT features two modern International Terminals (T1 and T2) and a dedicated Domestic Terminal with frequent European flights.
              </p>
              <div className="space-y-3 text-sm text-[#374151]">
                <div className="pl-4 border-l-2 border-[#741F3D]">
                  <strong className="block text-[#101B35] mb-1 flex items-center gap-1.5">
                    AntRay Light Rail Tram:
                  </strong>
                  The airport tram station (directly opposite Terminal 1 / Domestic) connects straight into central Antalya (İsmetpaşa / Kaleiçi), Meydan, and the intercity bus terminal (Otogar). Contactless bank cards and AntalyaKart accepted.
                </div>
                <div className="pl-4 border-l-2 border-[#741F3D]">
                  <strong className="block text-[#101B35] mb-1 flex items-center gap-1.5">
                    Havaş Airport Express Coaches:
                  </strong>
                  Scheduled express coaches depart after incoming flights, running via the central coastal highway to 5M Migros in Konyaaltı. Tickets purchased curbside before boarding.
                </div>
              </div>
            </div>

            {/* OC Welcome Desk & Shuttles Card */}
            <div className="border-t border-[#101B35] pt-6 sm:pt-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-[11px] tracking-[0.08em] text-[#741F3D] uppercase block">Arrival Operations</span>
                  <h3 className="font-serif-title text-2xl text-[#101B35]">Arrival Day Welcome &amp; Shuttles</h3>
                </div>
                <Badge variant="burgundy">31 March 2027</Badge>
              </div>
              <p className="text-sm text-[#4B5563] leading-relaxed mb-6">
                On 31 March, the Organizing Committee will operate greeting desks at AYT arrivals to welcome international delegations.
              </p>
              <div className="space-y-3 text-sm text-[#374151]">
                <div className="pl-4 border-l-2 border-[#741F3D]">
                  <strong className="block text-[#101B35] mb-1 flex items-center gap-1.5">
                    Coordinated Hotel Shuttles:
                  </strong>
                  Designated delegate group transfers from AYT directly to the congress resort will operate throughout arrival day for registered delegate flights.
                </div>
                <div className="pl-4 border-l-2 border-[#741F3D]">
                  <strong className="block text-[#101B35] mb-1 flex items-center gap-1.5">
                    Flight Scheduling Advice:
                  </strong>
                  Direct flights to AYT operate from major European hubs. Alternatively, book connecting flights via Istanbul (IST or SAW) with a short 1-hour domestic transfer.
                </div>
              </div>
            </div>
          </div>

          {/* AntalyaKart & Taxi Rules */}
          <div className="border border-[#233152] bg-[#101B35] text-white p-6 sm:p-8 rounded-sm">
            <h4 className="font-serif-title text-xl text-white mb-4">Essential Antalya Public Transit Guidelines</h4>
            <div className="grid sm:grid-cols-3 gap-6 text-sm text-[#A7AFBF] leading-relaxed">
              <div>
                <strong className="text-white block mb-1">AntalyaKart &amp; Contactless:</strong>
                A reloadable smart card accepted across all AntRay trams, the nostalgic tramway, and city buses. Contactless Visa/Mastercard bank cards can also be tapped directly at turnstiles.
              </div>
              <div>
                <strong className="text-white block mb-1">Official Taxis (Sarı Taksi):</strong>
                Always take official licensed yellow cabs with digital taximeters from designated ranks. Verify that the meter starts when the vehicle pulls away.
              </div>
              <div>
                <strong className="text-white block mb-1">Ride-Hailing (BiTaksi):</strong>
                The <strong className="text-[#E5E1DA]">BiTaksi</strong> smartphone app connects you with licensed yellow taxis across Antalya, offering upfront fare estimates and in-app cashless payment.
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
            description="What is already fixed, and what we are still confirming."
          />

          <p className="mb-10 pl-4 border-l-2 border-[#741F3D] text-base text-[#374151] leading-relaxed max-w-3xl">
            The hotel and congress venue are still being finalised with partners in Antalya. As soon as the contracts are signed, we will email booking details and room arrangements to every registered delegate.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Host Hotel", val: siteConfig.hotelName, status: "To Be Confirmed" },
              { label: "Hotel Address", val: siteConfig.hotelAddress, status: "To Be Confirmed" },
              { label: "Check-in / Check-out", val: "Standard 14:00 In / 12:00 Out", status: "Indicative Policy" },
              { label: "Congress Venue", val: siteConfig.venueName, status: "To Be Confirmed" }
            ].map((item) => (
              <div key={item.label} className="border-t border-[#101B35] pt-5">
                <span className="text-[10px] text-[#741F3D] tracking-wider uppercase block mb-1">
                  {item.status}
                </span>
                <p className="text-xs text-[#8F9AA0] uppercase font-semibold">{item.label}</p>
                <p className="text-sm font-semibold text-[#101B35] mt-1">{item.val}</p>
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
            title="Antalya Mediterranean Climate Guide (31 March – 4 April)"
            description="What the weather is like in Antalya, so you know what to pack."
          />

          <div className="pl-4 border-l-2 border-[#741F3D] mb-10 text-base text-[#374151] max-w-3xl">
            EUROXPRO&apos;27 runs from <strong>31 March to 4 April 2027</strong>. Early April in Antalya is usually sunny and mild, warm enough for a walk by the sea in the afternoon, cool enough for a jacket in the evening.
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                season: "Congress Window (31 Mar – 4 Apr)",
                temp: "18°C – 23°C (64°F – 73°F)",
                climate: "Sunny Mediterranean days, pleasant coastal breezes, mild evenings.",
                packing: "Sunglasses, high SPF sunscreen, lightweight layers, light jacket for coastal evenings."
              },
              {
                season: "Spring (Apr – May)",
                temp: "20°C – 26°C (68°F – 79°F)",
                climate: "Warm and bright with blossoming citrus trees and comfortable humidity.",
                packing: "Breathable clothing, trainers, casual evening wear."
              },
              {
                season: "Summer (Jun – Aug)",
                temp: "30°C – 38°C (86°F – 100°F)",
                climate: "Hot and sunny Mediterranean summer with high sea temperatures.",
                packing: "Swimwear, sun protection, linen and cotton garments."
              },
              {
                season: "Autumn (Sep – Nov)",
                temp: "22°C – 28°C (72°F – 82°F)",
                climate: "Golden autumn warmth, calm coastal waters, pleasant walking weather.",
                packing: "Light cardigans, layered daytime wear, comfortable shoes."
              }
            ].map((w) => (
              <div key={w.season} className="border-t border-[#101B35] pt-6">
                <h4 className="font-serif-title text-xl text-[#101B35] mb-1">{w.season}</h4>
                <p className="text-sm font-bold text-[#741F3D] mb-3">{w.temp}</p>
                <p className="text-sm text-[#4B5563] mb-3 leading-relaxed">{w.climate}</p>
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
            description="Clear guidance on using foreign cards, ATMs, and local currency in Antalya."
          />

          <div className="grid md:grid-cols-3 gap-6">
            <div className="border-t border-[#101B35] pt-6 space-y-3">
              <h4 className="font-serif-title text-lg text-[#101B35]">Currency: Turkish Lira (TRY / ₺)</h4>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                All daily expenses in Antalya are billed in Turkish Lira. While some bazaar stores accept Euros or USD, payment in local TRY avoids disadvantageous merchant conversion rates.
              </p>
            </div>

            <div className="border-t border-[#101B35] pt-6 space-y-3">
              <h4 className="font-serif-title text-lg text-[#101B35]">Credit &amp; Debit Cards</h4>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Contactless Visa and Mastercard are nearly universal in supermarkets, transit, hotels, and cafes. Always select <strong>&ldquo;Pay in TRY&rdquo;</strong> on card terminals to avoid dynamic currency conversion (DCC) markups.
              </p>
            </div>

            <div className="border-t border-[#101B35] pt-6 space-y-3">
              <h4 className="font-serif-title text-lg text-[#101B35]">ATMs &amp; Cash Exchange</h4>
              <p className="text-sm text-[#4B5563] leading-relaxed">
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
            <div className="border-t border-[#101B35] pt-6 space-y-4">
              <h4 className="font-serif-title text-xl text-[#101B35] flex items-center gap-2">
                Mobile Data &amp; Local eSIM
              </h4>
              <ul className="text-sm text-[#4B5563] space-y-3 leading-relaxed">
                <li>
                  <strong className="text-[#101B35]">eSIM (Recommended):</strong> Providers like Airalo, Maya Mobile, or Holafly allow you to purchase a prepaid Turkish data package before landing without swapping physical cards.
                </li>
                <li>
                  <strong className="text-[#101B35]">Physical Tourist SIM:</strong> Available at AYT arrival halls and official operator stores (Turkcell, Vodafone, Türk Telekom). Passport registration is legally required.
                </li>
                <li>
                  <strong className="text-[#101B35]">EU Roaming:</strong> Note that Türkiye is outside the European Union. Standard &ldquo;Roam Like at Home&rdquo; rules generally do not apply unless your carrier explicitly includes Türkiye.
                </li>
              </ul>
            </div>

            <div className="border-t border-[#101B35] pt-6 space-y-4">
              <h4 className="font-serif-title text-xl text-[#101B35] flex items-center gap-2">
                Electricity &amp; Voltage
              </h4>
              <div className="space-y-3 text-sm text-[#4B5563] leading-relaxed">
                <p>
                  <strong className="text-[#101B35]">Plug Type:</strong> Type C and Type F (standard European two-round-pin sockets).
                </p>
                <p>
                  <strong className="text-[#101B35]">Standard Voltage:</strong> 220V, 50Hz. Delegates from the UK, US, or other regions will require a plug pin adapter. Dual-voltage laptop/phone chargers operate automatically.
                </p>
                <div className="pl-4 border-l-2 border-[#741F3D] text-[11px] text-[#374151]">
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
            <div className="border-t border-[#2A3556] pt-6 space-y-4">
              <span className="text-[11px] tracking-[0.08em] text-[#741F3D] uppercase block">Unified Emergency</span>
              <div className="flex items-baseline gap-3">
                <span className="font-serif-title text-5xl text-white font-bold">112</span>
                <span className="text-sm text-[#A7AFBF]">Toll-Free 24/7 Dispatch</span>
              </div>
              <p className="text-sm text-[#A7AFBF] leading-relaxed">
                In Türkiye, <strong>112</strong> serves as the unified emergency hotline covering Ambulance, Police (Polis), Fire (İtfaiye), and Coast Guard. English-speaking dispatchers are available.
              </p>
            </div>

            {/* Pharmacies (Eczane) */}
            <div className="border-t border-[#2A3556] pt-6 space-y-4">
              <span className="text-[11px] tracking-[0.08em] text-[#741F3D] uppercase block">Medical Services</span>
              <h4 className="font-serif-title text-xl text-white">Pharmacies (Eczane)</h4>
              <p className="text-sm text-[#A7AFBF] leading-relaxed">
                Turkish pharmacies are easily identified by a red illuminated <strong>&ldquo;E&rdquo;</strong> sign. Pharmacists can dispense many common remedies. Outside business hours and on Sundays, a designated <em>&ldquo;Nöbetçi Eczane&rdquo;</em> (Duty Pharmacy) in each neighborhood remains open all night.
              </p>
            </div>

            {/* Dietary & Allergies */}
            <div className="border-t border-[#2A3556] pt-6 space-y-4">
              <span className="text-[11px] tracking-[0.08em] text-[#741F3D] uppercase block">Nutrition &amp; Dietary</span>
              <h4 className="font-serif-title text-xl text-white">Dietary &amp; Food Allergens</h4>
              <p className="text-sm text-[#A7AFBF] leading-relaxed">
                Turkish cuisine widely utilizes nuts (pistachios, walnuts), gluten, and dairy. Halal meat is standard nationwide. If you have severe celiac, vegan, or anaphylactic allergies, inform the OC via registration forms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. INTERACTIVE PACKING CHECKLIST ── */}
      <section id="checklist" className="py-20 bg-[#F7F3ED] border-b border-[#E5E1DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Interactive Preparation"
            title="Delegate Packing & Readiness Checklist"
            description="Interactive progress tracker stored safely in your device browser storage. Check off requirements as you pack."
          />
          <DelegateChecklist />
        </div>
      </section>

      {/* ── 9. IMPORTANT ANNOUNCEMENTS & FAQ LINKS ── */}
      <section id="announcements-faq" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Support & Updates"
            title="Official Bulletins & Knowledge Base"
            description="Stay informed with real-time communiqués and find answers to all delegate operations questions."
          />

          <div className="grid sm:grid-cols-2 gap-8">
            <div className="border-t border-[#101B35] pt-6 flex flex-col justify-between">
              <div>
                <h3 className="font-serif-title text-2xl text-[#101B35] font-normal mb-2">
                  Official Announcements Bulletin
                </h3>
                <p className="text-sm text-[#4B5563] leading-relaxed mb-6">
                  Read official circulars from the Organizing Committee, including host destination updates, schedule releases, and logistics briefings.
                </p>
              </div>
              <div>
                <a
                  href="/announcements"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#741F3D] hover:underline"
                >
                  View all announcements <ArrowRight size={14} />
                </a>
              </div>
            </div>

            <div className="border-t border-[#101B35] pt-6 flex flex-col justify-between">
              <div>
                <h3 className="font-serif-title text-2xl text-[#101B35] font-normal mb-2">
                  Frequently Asked Questions
                </h3>
                <p className="text-sm text-[#4B5563] leading-relaxed mb-6">
                  Browse categorized answers covering travel visas, Antalya Airport transit, card payments, packing necessities, and emergency contacts.
                </p>
              </div>
              <div>
                <a
                  href="/faq"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#741F3D] hover:underline"
                >
                  Search delegate FAQ <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
