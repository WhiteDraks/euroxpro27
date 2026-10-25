import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { IstanbulGuide } from "@/components/istanbul/IstanbulGuide";

export const metadata: Metadata = {
  title: "Explore Istanbul",
  description: "A delegate guide to Istanbul — must-see attractions, culture, culinary highlights, maps, and practical city advice.",
};

export default function ExploreIstanbulPage() {
  return (
    <div className="pt-20">
      <section className="bg-[#101B35] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-[#741F3D]" />
            <span className="text-[#741F3D] text-xs font-semibold tracking-[0.3em] uppercase">Host City</span>
          </div>
          <h1 className="font-display font-bold text-5xl md:text-6xl text-white">Explore Istanbul</h1>
          <p className="mt-4 text-[#A7AFBF] text-xl max-w-2xl leading-relaxed">
            Where continents meet and centuries converge. Discover the historic landmarks, rich culinary traditions, and vibrant pulse of Türkiye&apos;s cultural capital.
          </p>
        </div>
      </section>

      <IstanbulGuide />
    </div>
  );
}
