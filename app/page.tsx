import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Compass, Sparkles, ShoppingBag, BookOpen, Layers, ShieldCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { siteConfig } from "@/lib/config";
import { announcements } from "@/lib/announcements";
import { products, CURRENCY_SYMBOL } from "@/lib/products";

export const metadata: Metadata = {
  title: `${siteConfig.name} — One City. Different Perspectives. One Shared Future.`,
  description: siteConfig.shortDescription,
};

export default function HomePage() {
  const pinnedAnnouncement = announcements.find((a) => a.isPinned);
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── CINEMATIC EDITORIAL HERO ── */}
      <section className="relative min-h-[92vh] flex items-center bg-[#101B35] text-white pt-24 pb-20 overflow-hidden bosphorus-grid-dark">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 right-0 w-[550px] h-[550px] bg-[#741F3D]/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[420px] h-[420px] bg-[#172443] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Headline Column */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-3 px-3 py-1.5 border border-[#233152] bg-[#172443]/60 backdrop-blur-sm rounded-sm">
                <span className="w-2 h-2 rounded-full bg-[#741F3D] animate-pulse" />
                <span className="text-[11px] font-medium tracking-[0.25em] text-[#E5E1DA] uppercase">
                  Official International Congress · Istanbul
                </span>
              </div>

              <div>
                <p className="text-[#A7AFBF] text-sm tracking-[0.3em] uppercase font-mono mb-2">
                  AIESEC Regional Leadership Gathering
                </p>
                <h1 className="font-serif-title text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-white leading-[1.02]">
                  EUROX<span className="text-[#741F3D] font-bold">PRO</span>
                  <span className="text-3xl sm:text-5xl lg:text-6xl text-[#A7AFBF] font-light block mt-1 sm:inline sm:ml-2">
                    &apos;27
                  </span>
                </h1>
              </div>

              <div className="border-l-2 border-[#741F3D] pl-5 max-w-xl">
                <p className="text-xl sm:text-2xl text-[#E5E1DA] font-serif-title italic font-normal leading-relaxed">
                  &ldquo;{siteConfig.tagline}&rdquo;
                </p>
                <p className="text-sm text-[#A7AFBF] mt-3 leading-relaxed">
                  Gathering hundreds of ambitious international delegates where Europe meets Asia. A transformative forum of cross-border dialogue, global leadership, and cultural unity.
                </p>
              </div>

              {/* Status Meta Badges */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#172443] border border-[#233152] rounded-sm text-[#E5E1DA]">
                  <Calendar size={14} className="text-[#741F3D]" />
                  <span>{siteConfig.datesLabel}</span>
                </div>
                <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#172443] border border-[#233152] rounded-sm text-[#E5E1DA]">
                  <MapPin size={14} className="text-[#741F3D]" />
                  <span>Istanbul, Türkiye</span>
                </div>
              </div>

              {/* Primary Call to Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/congress">
                  <Button size="lg" variant="primary" className="shadow-lg shadow-[#741F3D]/25">
                    Explore Congress Agenda <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link href="/delegate-guide">
                  <Button size="lg" variant="outline" className="border-[#233152] text-[#E5E1DA] hover:bg-[#172443] hover:text-white">
                    Delegate Hub &amp; Guide
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Architectural Editorial Card */}
            <div className="lg:col-span-5">
              <div className="relative border border-[#233152] bg-[#172443]/80 p-8 sm:p-10 rounded-sm shadow-2xl backdrop-blur-md">
                {/* Decorative corner accent */}
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-[#741F3D]" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-[#741F3D]" />

                <div className="flex items-center justify-between border-b border-[#233152] pb-5 mb-8">
                  <div>
                    <span className="text-[10px] tracking-widest uppercase text-[#741F3D] font-mono block">Curated Edition</span>
                    <span className="font-serif-title text-2xl text-white">Istanbul Hub</span>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-[#101B35] border border-[#233152] text-[#A7AFBF] rounded-sm font-mono">
                    2027
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <span className="text-[#741F3D] font-mono font-bold text-sm">01</span>
                    <div>
                      <h4 className="text-white font-medium text-sm">Transcontinental Dialogue</h4>
                      <p className="text-xs text-[#A7AFBF] mt-1 leading-relaxed">
                        Workshops on international youth leadership, multilateral cooperation, and social innovation.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="text-[#741F3D] font-mono font-bold text-sm">02</span>
                    <div>
                      <h4 className="text-white font-medium text-sm">The Bosphorus Forum</h4>
                      <p className="text-xs text-[#A7AFBF] mt-1 leading-relaxed">
                        An extraordinary cultural backdrop bridging civilizations, history, and modern perspectives.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="text-[#741F3D] font-mono font-bold text-sm">03</span>
                    <div>
                      <h4 className="text-white font-medium text-sm">Turkish Night Gala</h4>
                      <p className="text-xs text-[#A7AFBF] mt-1 leading-relaxed">
                        An evening dedicated to authentic music, culinary traditions, and lifelong memories.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#233152] flex items-center justify-between text-xs text-[#A7AFBF]">
                  <span>Status: Preparations Live</span>
                  <Link href="/contact" className="text-[#741F3D] hover:underline flex items-center gap-1 font-semibold">
                    Contact OC <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── PINNED ANNOUNCEMENT STRIP ── */}
      {pinnedAnnouncement && (
        <section className="bg-[#741F3D] text-white py-3.5 border-y border-[#51152D]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/announcements" className="flex items-center justify-between gap-4 group">
              <div className="flex items-center gap-3 min-w-0">
                <span className="px-2 py-0.5 bg-white text-[#741F3D] text-[10px] font-bold tracking-wider uppercase rounded-sm flex-shrink-0">
                  Update
                </span>
                <span className="text-sm font-medium truncate text-[#F7F3ED]">
                  {pinnedAnnouncement.title}
                </span>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-[#F7F3ED]/80 group-hover:text-white transition-colors">
                Read notice <ArrowRight size={13} />
              </span>
            </Link>
          </div>
        </section>
      )}

      {/* ── EDITORIAL CONGRESS STATEMENT ── */}
      <section className="py-24 bg-[#F7F3ED] border-b border-[#E5E1DA] bosphorus-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-baseline">
            <div className="lg:col-span-4">
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#741F3D] uppercase block mb-3 font-mono">
                The Vision
              </span>
              <h2 className="font-serif-title text-4xl sm:text-5xl text-[#101B35] font-normal leading-tight">
                Shaping the Horizon of European Youth Leadership
              </h2>
            </div>
            <div className="lg:col-span-8 space-y-6 text-[#374151] leading-relaxed text-base sm:text-lg">
              <p>
                EUROXPRO’27 is not just another convention; it represents an international crossroad in Istanbul where young changemakers gather to challenge conventional thinking, exchange regional insights, and build enduring collaborations.
              </p>
              <div className="grid sm:grid-cols-3 gap-6 pt-6 border-t border-[#E5E1DA]">
                <div>
                  <h3 className="font-serif-title text-2xl text-[#101B35] font-normal">Cross-Border</h3>
                  <p className="text-xs text-[#6B7280] mt-2">Dozens of national and local entities represented across Europe and beyond.</p>
                </div>
                <div>
                  <h3 className="font-serif-title text-2xl text-[#101B35] font-normal">Authentic</h3>
                  <p className="text-xs text-[#6B7280] mt-2">Carefully planned cultural integrations rather than detached conference halls.</p>
                </div>
                <div>
                  <h3 className="font-serif-title text-2xl text-[#101B35] font-normal">Impact-Led</h3>
                  <p className="text-xs text-[#6B7280] mt-2">Actionable frameworks designed to enhance local committee development.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE DELEGATE RESOURCES ── */}
      <section className="py-24 bg-[#101B35] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-[#233152] pb-8">
            <div>
              <span className="text-xs font-mono tracking-widest text-[#741F3D] uppercase block mb-2">Essential Tools</span>
              <h2 className="font-serif-title text-4xl sm:text-5xl font-normal text-white">Delegate Hub</h2>
            </div>
            <p className="text-sm text-[#A7AFBF] max-w-md mt-4 md:mt-0 leading-relaxed">
              Carefully structured tools and resources to prepare delegates for seamless travel, stay, and participation.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Delegate Guide",
                desc: "Checklist, arrival logistics at IST/SAW, visa information, currency, and emergency numbers.",
                href: "/delegate-guide",
                cta: "Read Guide"
              },
              {
                icon: Compass,
                title: "Explore Istanbul",
                desc: "Landmarks, Turkish gastronomy etiquette, practical phrases, and city transport guidance.",
                href: "/explore-istanbul",
                cta: "Explore City"
              },
              {
                icon: Layers,
                title: "Congress Agenda",
                desc: "Day-by-day timetable, plenary themes, workshops, and Turkish Night Gala details.",
                href: "/congress#schedule",
                cta: "View Timetable"
              },
              {
                icon: ShoppingBag,
                title: "Merch Collection",
                desc: "Limited-edition congress apparel, accessories, and pre-order interest catalog.",
                href: "/merch",
                cta: "View Store"
              },
            ].map(({ icon: Icon, title, desc, href, cta }) => (
              <Link key={href} href={href} className="group block">
                <div className="h-full border border-[#233152] bg-[#172443]/60 p-7 rounded-sm hover:border-[#741F3D] transition-colors duration-200 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 border border-[#233152] bg-[#101B35] rounded-sm flex items-center justify-center mb-6 text-[#741F3D]">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-serif-title text-xl text-white font-normal mb-3">{title}</h3>
                    <p className="text-xs text-[#A7AFBF] leading-relaxed mb-6">{desc}</p>
                  </div>
                  <span className="text-xs font-semibold text-[#741F3D] flex items-center gap-1 group-hover:gap-2 transition-all">
                    {cta} <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOST CITY IMMERSION SECTION ── */}
      <section className="py-24 bg-[#F7F3ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono font-semibold tracking-[0.25em] text-[#741F3D] uppercase block">
                The Transcontinental City
              </span>
              <h2 className="font-serif-title text-4xl sm:text-5xl text-[#101B35] font-normal leading-tight">
                Two Continents. Thousands of Years of Living History.
              </h2>
              <div className="w-12 h-0.5 bg-[#741F3D]" />
              <p className="text-[#374151] leading-relaxed text-sm sm:text-base">
                From the domed majesty of the Byzantine Hagia Sophia to the lively coffee culture along the Karaköy waterfront, Istanbul creates a congress atmosphere unlike any typical conference center in the world.
              </p>
              <div className="pt-2">
                <Link href="/explore-istanbul">
                  <Button variant="secondary" size="md">
                    Read the City &amp; Culture Guide <ArrowRight size={15} />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="border border-[#E5E1DA] bg-white p-8 rounded-sm shadow-sm space-y-5">
                <h3 className="font-serif-title text-2xl text-[#101B35]">What to Anticipate</h3>
                <div className="divide-y divide-[#E5E1DA]">
                  {[
                    { place: "The Bosphorus Strait", detail: "Witness Europe and Asia concurrently from the congress gathering points." },
                    { place: "Authentic Gastronomy", detail: "Experience rich serpme kahvaltı, warm simit, and traditional çay rituals." },
                    { place: "Historic Grand Bazaar", detail: "Explore centuries-old trading alleyways just moments from modern transit." },
                    { place: "Hospitality & Warmth", detail: "The welcoming ethos of Turkish culture shared by our dedicated local committee." }
                  ].map((item) => (
                    <div key={item.place} className="py-3.5 first:pt-0 last:pb-0">
                      <h4 className="text-sm font-semibold text-[#101B35]">{item.place}</h4>
                      <p className="text-xs text-[#6B7280] mt-1">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── MERCHANDISE PREVIEW ── */}
      <section className="py-24 bg-white border-t border-[#E5E1DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 border-b border-[#E5E1DA] pb-6">
            <div>
              <span className="text-xs font-mono font-semibold tracking-widest text-[#741F3D] uppercase block mb-1">
                Congress Souvenirs
              </span>
              <h2 className="font-serif-title text-3xl sm:text-4xl text-[#101B35]">
                Limited-Edition Congress Collection
              </h2>
            </div>
            <Link href="/merch" className="text-xs font-semibold text-[#741F3D] hover:underline flex items-center gap-1 mt-4 sm:mt-0">
              Browse full collection <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {featuredProducts.map((p) => (
              <div key={p.id} className="border border-[#E5E1DA] rounded-sm p-6 flex flex-col justify-between hover:border-[#741F3D] transition-colors">
                <div>
                  <div className="aspect-[4/3] bg-[#F7F3ED] flex items-center justify-center mb-5 rounded-sm relative">
                    <ShoppingBag size={32} className="text-[#101B35]" />
                    <span className="absolute top-3 right-3 text-[10px] bg-[#101B35] text-white px-2 py-0.5 rounded-sm font-mono">
                      Preview
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8F9AA0] uppercase font-mono tracking-wider block mb-1">
                    {p.category}
                  </span>
                  <h3 className="font-serif-title text-lg text-[#101B35] font-normal mb-2">{p.name}</h3>
                  <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed mb-4">{p.description}</p>
                </div>
                <div className="pt-4 border-t border-[#E5E1DA] flex items-center justify-between">
                  <span className="font-bold text-[#741F3D] text-sm">{CURRENCY_SYMBOL}{p.price}</span>
                  <Link href="/merch" className="text-xs text-[#101B35] hover:text-[#741F3D] font-medium">
                    Configure &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONGRESS SUPPORT BANNER ── */}
      <section className="py-20 bg-[#101B35] text-white border-t border-[#233152]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <span className="text-xs font-mono tracking-widest text-[#741F3D] uppercase block">
            We Are Here For You
          </span>
          <h2 className="font-serif-title text-3xl sm:text-5xl font-normal text-white">
            Questions Regarding Participation?
          </h2>
          <p className="text-sm sm:text-base text-[#A7AFBF] max-w-xl mx-auto leading-relaxed">
            The EUROXPRO’27 Organizing Committee is actively available to guide delegate coordinators and individual attendees.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/contact">
              <Button size="lg" variant="primary">
                Reach the Organizing Committee
              </Button>
            </Link>
            <Link href="/faq">
              <Button size="lg" variant="outline" className="border-[#233152] text-[#E5E1DA] hover:bg-[#172443]">
                Frequently Asked Questions
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
