import type { Metadata } from "next";
import { MerchStore } from "@/components/merch/MerchStore";
import { products, productCategories, orderInstructions } from "@/lib/products";

export const metadata: Metadata = {
  title: "Merch Store — Official Capsule Collection",
  description: "EUROXPRO'27 Limited Edition Congress Merchandise — preview items, configure sizes and colors, and register pre-order interests.",
  alternates: { canonical: "/merch" },
};

export default function MerchPage() {
  return (
    <div className="pt-16 lg:pt-20">
      <section className="bg-[#101B35] text-white py-24 px-4 sm:px-6 lg:px-8 border-b border-[#233152] bosphorus-grid-dark relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2.5 h-2.5 bg-[#741F3D] rounded-full animate-pulse" />
            <span className="text-[#E5E1DA] text-xs font-mono tracking-[0.25em] uppercase">
              Limited Edition Capsule
            </span>
          </div>
          <h1 className="font-serif-title font-normal text-4xl sm:text-6xl text-white">
            Congress Merch Store
          </h1>
          <p className="mt-4 text-[#A7AFBF] text-lg sm:text-xl max-w-2xl font-light leading-relaxed">
            Commemorate your EUROXPRO&apos;27 transcontinental experience. Browse our curated collection of organic congress apparel, bespoke stationery, and collectible souvenirs.
          </p>
        </div>
      </section>

      <MerchStore
        products={products}
        categories={productCategories}
        instructions={orderInstructions}
      />
    </div>
  );
}
