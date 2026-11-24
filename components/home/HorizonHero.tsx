import Link from "next/link";
import type { SiteContent } from "@/lib/content";
import { siteConfig } from "@/lib/config";
import { Countdown } from "@/components/common/Countdown";
import { Button } from "@/components/ui/Button";

// ============================================================
// Home hero. Night over the Gulf of Antalya: the sun sets into the
// "0" of 2027, behind the line of the Taurus mountains, and a small
// label marks the city on the shore. Drawn in CSS and SVG so it
// loads instantly on slow connections.
// ============================================================

type Hero = SiteContent["home"]["hero"];
type Labels = SiteContent["home"]["countdown"];

// Two ridges of the Taurus range seen from Konyaaltı beach.
function Mountains() {
  return (
    <svg
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      className="absolute inset-x-0 bottom-0 w-full h-[0.34em] pointer-events-none"
      aria-hidden="true"
    >
      <path
        d="M0 120 L80 96 L150 108 L230 70 L300 92 L360 60 L420 84 L470 74 L540 104 L610 88 L700 112 L780 94 L860 58 L930 80 L990 46 L1050 72 L1120 64 L1190 92 L1260 76 L1330 98 L1440 84 L1440 200 L0 200 Z"
        fill="#2B1316"
      />
      <path
        d="M0 150 L70 138 L140 146 L210 124 L290 140 L380 118 L450 136 L520 130 L600 148 L690 136 L760 150 L840 132 L920 144 L1000 120 L1080 140 L1160 128 L1240 146 L1320 134 L1440 142 L1440 200 L0 200 Z"
        fill="#170C0E"
      />
      <rect x="0" y="186" width="1440" height="14" fill="#0E0909" />
    </svg>
  );
}

export function HorizonHero({ hero, countdown }: { hero: Hero; countdown: Labels }) {
  return (
    <section
      className="relative bg-[#0E0909] text-[#F4EDE2] overflow-hidden flex flex-col lg:min-h-[100svh] pt-16 lg:pt-20"
      aria-label="EUROXPRO'27 in Antalya"
    >
      {/* Afterglow over the horizon and a scatter of stars. */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(70%_55%_at_50%_78%,rgba(125,26,48,0.6),rgba(14,9,9,0)_70%)]" />
      <div
        className="absolute inset-x-0 top-0 h-2/3 pointer-events-none opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 12% 22%, #F4EDE2 50%, transparent 51%), radial-gradient(1px 1px at 27% 8%, #F4EDE2 50%, transparent 51%), radial-gradient(1.5px 1.5px at 41% 31%, #F4EDE2 50%, transparent 51%), radial-gradient(1px 1px at 63% 14%, #F4EDE2 50%, transparent 51%), radial-gradient(1px 1px at 78% 27%, #F4EDE2 50%, transparent 51%), radial-gradient(1.5px 1.5px at 88% 9%, #F4EDE2 50%, transparent 51%), radial-gradient(1px 1px at 6% 44%, #F4EDE2 50%, transparent 51%), radial-gradient(1px 1px at 94% 41%, #F4EDE2 50%, transparent 51%), radial-gradient(1px 1px at 53% 4%, #F4EDE2 50%, transparent 51%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 text-center px-4 pt-10 sm:pt-14">
        <p className="text-sm text-[#D6C8BC]">{hero.eyebrow}</p>
        <h1 className="mt-4 font-sans-body font-light uppercase tracking-[0.32em] sm:tracking-[0.42em] text-base min-[400px]:text-lg sm:text-2xl lg:text-3xl leading-snug text-[#F4EDE2] max-w-4xl mx-auto">
          {hero.titleLine1} {hero.titleLine2}
          {hero.themeNote && <sup className="text-[0.6em] text-[#D6C8BC] tracking-normal ml-1">*</sup>}
        </h1>
      </div>

      {/* 2 [sun] 2 7 sitting on the horizon. */}
      <div className="relative flex-1 flex items-end justify-center mt-10 sm:mt-12 text-[33vw] sm:text-[30vw] lg:text-[min(27vw,46vh)]" aria-hidden="true">
        <div className="relative isolate flex items-end leading-none select-none pb-[0.1em]">
          <span className="horizon-digits horizon-digits-in">2</span>
          <span className="relative inline-block w-[0.6em] h-[0.6em] mx-[0.03em] -mb-[0.09em]">
            <span className="horizon-halo absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1.42em] h-[1.42em] rounded-full -z-10" />
            <span className="horizon-sun absolute inset-0 rounded-full" />
          </span>
          <span className="horizon-digits horizon-digits-in">27</span>
        </div>
        <Mountains />

        {/* "You are here" pin on the shore. */}
        <div className="horizon-late hidden lg:flex absolute bottom-[0.2em] right-[3%] flex-col items-center">
          <span className="whitespace-nowrap text-[clamp(10px,1.1vw,14px)] tracking-[0.12em] text-[#E8D5B5] mb-1.5">Antalya, you are here</span>
          <span className="w-px h-[clamp(20px,3vw,44px)] bg-[#E8D5B5]/70" />
          <span className="w-2 h-2 rounded-full bg-[#E0647D] shadow-[0_0_10px_2px_rgba(224,100,125,0.7)]" />
        </div>
      </div>

      {/* The sea, with the sun's reflection, and the practical details. */}
      <div className="relative z-10 bg-[#0E0909]">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[46vw] max-w-[520px] h-24 sm:h-32 bg-[radial-gradient(50%_100%_at_50%_0%,rgba(224,100,125,0.35),rgba(14,9,9,0)_70%)] pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 sm:pb-12 grid gap-8 lg:grid-cols-12 lg:items-end border-t border-[#3A2A2A]">
          <div className="lg:col-span-4">
            <p className="font-serif-title text-3xl sm:text-4xl leading-none">{siteConfig.datesLabel}</p>
            <p className="mt-2 text-[#D6C8BC]">{siteConfig.venueCity}</p>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base sm:text-lg text-[#E9DED2] leading-relaxed max-w-md">{hero.supportingLine}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 mt-5">
              <Link href="/congress">
                <Button size="lg" variant="primary">{hero.primaryButton}</Button>
              </Link>
              <Link href="/delegate-guide" className="text-base font-semibold text-[#F4EDE2] link-underline decoration-[#F4EDE2]/40 hover:decoration-[#F4EDE2]">
                {hero.secondaryButton}
              </Link>
            </div>
          </div>
          <div className="lg:col-span-3">
            <Countdown start={siteConfig.startDate.toISOString()} end={siteConfig.endDate.toISOString()} labels={countdown} />
          </div>
        </div>
        {hero.themeNote && (
          <p className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 text-xs text-[#A8968D]">* {hero.themeNote}</p>
        )}
      </div>
    </section>
  );
}
