import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DelegateChecklist } from "@/components/delegate/DelegateChecklist";
import { siteConfig } from "@/lib/config";
import {
  Plane, Hotel, CreditCard, HeartPulse, CheckSquare,
  FileText, Phone, Wifi, Zap, AlertCircle
} from "lucide-react";

export const metadata: Metadata = {
  title: "Delegate Guide",
  description: "Everything you need to know to prepare for EUROXPRO'27 in Istanbul: travel, documents, accommodation, money, and safety.",
};

const sections = [
  { id: "before-you-travel", label: "Before You Travel", icon: Plane },
  { id: "accommodation", label: "Accommodation", icon: Hotel },
  { id: "money-connectivity", label: "Money & Connectivity", icon: CreditCard },
  { id: "health-safety", label: "Health & Safety", icon: HeartPulse },
  { id: "checklist", label: "Packing Checklist", icon: CheckSquare },
];

export default function DelegateGuidePage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-[#101B35] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-[#741F3D]" />
            <span className="text-[#741F3D] text-xs font-semibold tracking-[0.3em] uppercase">Delegate Hub</span>
          </div>
          <h1 className="font-display font-bold text-5xl md:text-6xl text-white">Delegate Guide</h1>
          <p className="mt-4 text-[#A7AFBF] text-xl max-w-2xl">
            Your complete guide to preparing for EUROXPRO&apos;27. Everything you need to know before, during, and after the congress.
          </p>
          {/* Quick Nav */}
          <div className="flex flex-wrap gap-3 mt-10">
            {sections.map(({ id, label, icon: Icon }) => (
              <a
                key={id}
                href={`#${id}`}
                className="flex items-center gap-2 px-4 py-2 bg-[#172443] border border-[#2A3556] rounded-sm text-sm text-[#A7AFBF] hover:text-white hover:border-[#741F3D]/50 transition-all"
              >
                <Icon size={14} className="text-[#741F3D]" />
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Before You Travel */}
      <section id="before-you-travel" className="py-20 bg-[#F7F3ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Preparation" title="Before You Travel" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: "Travel Documents",
                items: [
                  "Valid passport (6+ months validity beyond travel dates)",
                  "Visa or e-Visa if required for your nationality",
                  "Check visa requirements at evisa.gov.tr or mfa.gov.tr",
                  "Congress registration confirmation",
                  "Travel insurance documents",
                  "Printed or digital flight tickets",
                ],
              },
              {
                icon: Plane,
                title: "Arriving in Istanbul",
                items: [
                  "Istanbul Airport (IST) — European side, main hub",
                  "Sabiha Gökçen Airport (SAW) — Asian side",
                  "Havaist airport buses connect both airports to the city",
                  "Metro lines serve Istanbul Airport",
                  "Taxis and ride-hailing apps (BiTaksi, Uber) available",
                  "OC transfer arrangements: [TO BE CONFIRMED]",
                ],
              },
              {
                icon: CheckSquare,
                title: "Preparation Checklist",
                items: [
                  "Check passport expiry date now",
                  "Research visa requirements for your nationality",
                  "Book flights early for best prices",
                  "Arrange travel insurance",
                  "Notify your bank of travel dates",
                  "Download the Google Maps offline map of Istanbul",
                ],
              },
            ].map(({ icon: Icon, title, items }) => (
              <div key={title} className="bg-white border border-[#E3E0DC] rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-[#741F3D]/10 rounded-sm flex items-center justify-center">
                    <Icon size={16} className="text-[#741F3D]" />
                  </div>
                  <h3 className="font-display font-bold text-[#101B35] text-lg">{title}</h3>
                </div>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#5A6478]">
                      <span className="w-1.5 h-1.5 bg-[#741F3D] rounded-full mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accommodation */}
      <section id="accommodation" className="py-20 bg-[#101B35]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Stay" title="Accommodation" light />
          <div className="bg-[#172443] border border-[#2A3556] rounded-lg p-8">
            <div className="flex items-start gap-4 mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <AlertCircle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-amber-200 text-sm">
                Hotel details have not yet been confirmed. The information below will be updated as soon as the Organizing Committee announces accommodation arrangements.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: "Hotel Name", value: siteConfig.hotelName },
                { label: "Address", value: siteConfig.hotelAddress },
                { label: "Check-in", value: siteConfig.hotelCheckIn },
                { label: "Check-out", value: siteConfig.hotelCheckOut },
                { label: "Included Meals", value: "[TO BE CONFIRMED]" },
                { label: "Wi-Fi", value: "[TO BE CONFIRMED]" },
              ].map(({ label, value }) => (
                <div key={label} className="border-l-2 border-[#741F3D] pl-4">
                  <p className="text-[#A7AFBF] text-xs uppercase tracking-wide">{label}</p>
                  <p className="text-white font-medium mt-1">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-[#2A3556]">
              <h4 className="text-white font-semibold mb-3">Hotel Tips</h4>
              <ul className="space-y-2">
                {[
                  "We strongly recommend staying at the official congress hotel to be close to all activities",
                  "Room sharing arrangements will be communicated by the OC",
                  "Keep the hotel address saved on your phone for taxi/directions",
                  "For special room needs or accessibility requirements, contact the OC early",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm text-[#A7AFBF]">
                    <span className="w-1.5 h-1.5 bg-[#741F3D] rounded-full mt-2 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Money & Connectivity */}
      <section id="money-connectivity" className="py-20 bg-[#F7F3ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Practical" title="Money & Connectivity" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#E3E0DC] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard size={18} className="text-[#741F3D]" />
                <h3 className="font-display font-bold text-[#101B35] text-xl">Money in Türkiye</h3>
              </div>
              <div className="space-y-4 text-sm text-[#5A6478] leading-relaxed">
                <p><strong className="text-[#101B35]">Currency:</strong> Turkish Lira (TRY / ₺). Exchange rates fluctuate — check closer to your travel date.</p>
                <p><strong className="text-[#101B35]">ATMs:</strong> Widely available throughout Istanbul. Use bank ATMs for reliable service; avoid non-bank ATMs that may charge excessive fees.</p>
                <p><strong className="text-[#101B35]">Card payments:</strong> Visa and Mastercard are widely accepted in hotels, restaurants, and shops. Inform your bank before travelling.</p>
                <p><strong className="text-[#101B35]">Cash:</strong> Carry some Turkish Lira for markets, small cafes, and local transport. The Grand Bazaar and some street vendors prefer cash.</p>
                <p><strong className="text-[#101B35]">Tipping:</strong> A 10–15% tip is customary in sit-down restaurants. Tipping is appreciated but not always mandatory.</p>
              </div>
            </div>
            <div className="bg-white border border-[#E3E0DC] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Wifi size={18} className="text-[#741F3D]" />
                <h3 className="font-display font-bold text-[#101B35] text-xl">Connectivity</h3>
              </div>
              <div className="space-y-4 text-sm text-[#5A6478] leading-relaxed">
                <p><strong className="text-[#101B35]">Mobile data:</strong> Check if your home provider offers roaming in Türkiye. Many European plans include Türkiye.</p>
                <p><strong className="text-[#101B35]">Turkish SIM card:</strong> Available at the airport and in city shops (Turkcell, Vodafone, Türk Telekom). Requires your passport for registration.</p>
                <p><strong className="text-[#101B35]">eSIM:</strong> An international eSIM is a convenient alternative — purchase and activate before your flight.</p>
                <p><strong className="text-[#101B35]">Hotel Wi-Fi:</strong> Will be confirmed along with hotel details.</p>
                <div className="flex items-center gap-3 mt-3 p-3 bg-[#F7F3ED] rounded-lg">
                  <Zap size={16} className="text-[#741F3D]" />
                  <div>
                    <p className="font-semibold text-[#101B35] text-xs">Electrical info</p>
                    <p className="text-xs text-[#5A6478]">Türkiye uses Type F/C plugs (standard European 2-pin). Voltage: 220V, 50Hz.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 bg-white border border-[#E3E0DC] rounded-lg p-6">
            <h3 className="font-display font-bold text-[#101B35] text-xl mb-4">Time Zone</h3>
            <p className="text-[#5A6478]">Türkiye uses <strong className="text-[#101B35]">Turkey Time (TRT) — UTC+3</strong>. Türkiye does not observe daylight saving time, so the offset from European time zones varies seasonally. Plan your travel and meeting times accordingly.</p>
          </div>
        </div>
      </section>

      {/* Health & Safety */}
      <section id="health-safety" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Wellbeing" title="Health, Safety & Accessibility" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-100 rounded-lg p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Phone size={18} className="text-red-600" />
                  <h3 className="font-bold text-red-800 text-lg">Emergency Numbers</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "General Emergency", number: "112" },
                    { label: "Police", number: "155" },
                    { label: "Ambulance", number: "112" },
                    { label: "Fire", number: "110" },
                    { label: "OC Emergency", number: "[TO BE SHARED ON ARRIVAL]" },
                  ].map(({ label, number }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-red-100 last:border-0">
                      <span className="text-red-700 text-sm">{label}</span>
                      <span className="font-bold text-red-800">{number}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#F7F3ED] border border-[#E3E0DC] rounded-lg p-5">
                <h3 className="font-bold text-[#101B35] mb-3">Healthcare Access</h3>
                <ul className="space-y-2 text-sm text-[#5A6478]">
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-[#741F3D] rounded-full mt-2 flex-shrink-0" />Pharmacies (Eczane) are widely available and staff often speak some English</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-[#741F3D] rounded-full mt-2 flex-shrink-0" />Emergency rooms (Acil Servis) at hospitals are open 24/7</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-[#741F3D] rounded-full mt-2 flex-shrink-0" />Travel insurance with medical coverage is strongly recommended</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-[#741F3D] rounded-full mt-2 flex-shrink-0" />EU health insurance cards (EHIC/GHIC) may provide coverage — check with your provider</li>
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-[#F7F3ED] border border-[#E3E0DC] rounded-lg p-5">
                <h3 className="font-bold text-[#101B35] mb-3">Safety Tips</h3>
                <ul className="space-y-2 text-sm text-[#5A6478]">
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-[#741F3D] rounded-full mt-2 flex-shrink-0" />Keep a copy of your passport and important documents separately from the originals</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-[#741F3D] rounded-full mt-2 flex-shrink-0" />Be aware of pickpockets in crowded tourist areas and markets</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-[#741F3D] rounded-full mt-2 flex-shrink-0" />Use official taxis (yellow cabs) or metered apps (BiTaksi, Uber) — ensure meter is running</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-[#741F3D] rounded-full mt-2 flex-shrink-0" />Share your daily plans with fellow delegates if exploring independently</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-[#741F3D] rounded-full mt-2 flex-shrink-0" />The OC will provide a full safety briefing on arrival day</li>
                </ul>
              </div>
              <div className="bg-[#F7F3ED] border border-[#E3E0DC] rounded-lg p-5">
                <h3 className="font-bold text-[#101B35] mb-3">Dietary & Accessibility</h3>
                <ul className="space-y-2 text-sm text-[#5A6478]">
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-[#741F3D] rounded-full mt-2 flex-shrink-0" />Declare all dietary requirements (halal, vegetarian, vegan, allergies) during registration</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-[#741F3D] rounded-full mt-2 flex-shrink-0" />Halal food is standard across Istanbul</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-[#741F3D] rounded-full mt-2 flex-shrink-0" />For accessibility accommodations, inform the OC early so arrangements can be made</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Checklist */}
      <section id="checklist" className="py-20 bg-[#101B35]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Pack Smart"
            title="Delegate Packing Checklist"
            description="Tick off items as you prepare. Your progress is saved in your browser."
            light
          />
          <DelegateChecklist />
        </div>
      </section>
    </div>
  );
}
