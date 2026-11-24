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
    <div>
      <PageHero
        eyebrow="Pre-order preview"
        title="Merch"
        intro="Hoodies, tees and more. Tell us what you want."
      />

      <MerchStore
        products={products}
        categories={productCategories}
        instructions={orderInstructions}
      />
    </div>
  );
}
