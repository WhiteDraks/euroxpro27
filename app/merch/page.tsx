import type { Metadata } from "next";
import { MerchStore } from "@/components/merch/MerchStore";
import { products, productCategories, orderInstructions } from "@/lib/products";

export const metadata: Metadata = {
  title: "Merch Store",
  description: "EUROXPRO'27 Limited Edition Congress Merchandise — preview items, configure variants, and submit order requests.",
};

export default function MerchPage() {
  return (
    <div className="pt-20">
      <section className="bg-[#101B35] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-[#741F3D]" />
            <span className="text-[#741F3D] text-xs font-semibold tracking-[0.3em] uppercase">Limited Edition</span>
          </div>
          <h1 className="font-display font-bold text-5xl md:text-6xl text-white">Merch Store</h1>
          <p className="mt-4 text-[#A7AFBF] text-xl max-w-2xl leading-relaxed">
            Commemorate your EUROXPRO&apos;27 experience. Browse our curated collection of sustainable congress apparel, stationery, and souvenirs.
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
