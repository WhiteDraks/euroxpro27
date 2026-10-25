import type { Metadata } from "next";
import { MerchStore } from "@/components/merch/MerchStore";
import { products, productCategories, orderInstructions } from "@/lib/products";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Merch Store — Official Capsule Collection",
  description: "EUROXPRO'27 Limited Edition Congress Merchandise — preview items, configure sizes and colors, and register pre-order interests.",
  alternates: { canonical: "/merch" },
};

export default function MerchPage() {
  return (
    <div className="pt-16 lg:pt-20">
      <PageHero
        eyebrow="Pre-order preview"
        title="Congress Merch"
        intro="Hoodies, tees, totes and a few small things to take home from Antalya. Pick a size and colour and let us know what you would like to pre-order."
      />

      <MerchStore
        products={products}
        categories={productCategories}
        instructions={orderInstructions}
      />
    </div>
  );
}
