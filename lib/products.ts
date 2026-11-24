import type { Product } from "./types";

// ============================================================
// EUROXPRO'27 — Merchandise Catalog
// All products are illustrative until the real collection is confirmed
// ============================================================

export const CURRENCY = "EUR";
export const CURRENCY_SYMBOL = "€";

export const products: Product[] = [
  {
    id: "hoodie-navy",
    name: "EUROXPRO'27 Congress Hoodie",
    description:
      "Warm hoodie with the EUROXPRO'27 logo.",
    price: 45,
    currency: CURRENCY,
    category: "hoodies",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Deep Navy", hex: "#140D0E" },
      { name: "Burgundy", hex: "#7D1A30" },
    ],
    stockStatus: "coming-soon",
    isIllustrative: true,
    badge: "Limited Edition",
  },
  {
    id: "tshirt-white",
    name: "EUROXPRO'27 Graphic T-Shirt",
    description:
      "Soft cotton tee with the EUROXPRO'27 logo.",
    price: 25,
    currency: CURRENCY,
    category: "tshirts",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Warm Ivory", hex: "#F4EDE2" },
      { name: "Deep Navy", hex: "#140D0E" },
    ],
    stockStatus: "coming-soon",
    isIllustrative: true,
  },
  {
    id: "tote-bag",
    name: "Congress Canvas Tote Bag",
    description:
      "Strong canvas bag for your laptop and notes.",
    price: 18,
    currency: CURRENCY,
    category: "tote-bags",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    colors: [
      { name: "Natural Canvas", hex: "#E8DFD0" },
      { name: "Navy", hex: "#1F1415" },
    ],
    stockStatus: "coming-soon",
    isIllustrative: true,
  },
  {
    id: "notebook",
    name: "EUROXPRO'27 Delegate Hardcover Journal",
    description:
      "A5 notebook for congress notes.",
    price: 15,
    currency: CURRENCY,
    category: "notebooks",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    colors: [{ name: "Navy", hex: "#140D0E" }],
    stockStatus: "coming-soon",
    isIllustrative: true,
  },
  {
    id: "pin-set",
    name: "Antalya Enamel Pin Set",
    description:
      "Three pins with Antalya designs.",
    price: 12,
    currency: CURRENCY,
    category: "pins",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
    stockStatus: "coming-soon",
    isIllustrative: true,
    badge: "Collector's Item",
  },
  {
    id: "sticker-pack",
    name: "EUROXPRO'27 Holographic Sticker Pack",
    description:
      "Six stickers with Antalya designs.",
    price: 6,
    currency: CURRENCY,
    category: "stickers",
    image: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=800&q=80",
    stockStatus: "coming-soon",
    isIllustrative: true,
  },
  {
    id: "keychain",
    name: "Antalya Metal Silhouette Keychain",
    description:
      "Metal keychain with the Antalya harbour.",
    price: 8,
    currency: CURRENCY,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=800&q=80",
    stockStatus: "coming-soon",
    isIllustrative: true,
  },
  {
    id: "cap-navy",
    name: "EUROXPRO'27 Structured Twill Cap",
    description:
      "Cotton cap with the EUROXPRO'27 logo.",
    price: 22,
    currency: CURRENCY,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    colors: [
      { name: "Deep Navy", hex: "#140D0E" },
      { name: "Burgundy", hex: "#7D1A30" },
    ],
    sizes: ["ONE SIZE"],
    stockStatus: "coming-soon",
    isIllustrative: true,
    badge: "New",
  },
];

export const productCategories: Array<{
  id: string;
  label: string;
}> = [
  { id: "all", label: "All Products" },
  { id: "hoodies", label: "Hoodies" },
  { id: "tshirts", label: "T-Shirts" },
  { id: "tote-bags", label: "Tote Bags" },
  { id: "notebooks", label: "Notebooks" },
  { id: "pins", label: "Pins" },
  { id: "stickers", label: "Stickers" },
  { id: "accessories", label: "Accessories" },
];

export const orderInstructions = `
**How to Order**

The EUROXPRO'27 merch collection is currently in final production. Availability and exact pricing will be confirmed closer to the congress.

To express your interest in specific items:
1. Select your desired products and fill in the order form below.
2. Your order request will be logged and you will be contacted by the Organizing Committee when orders officially open.
3. No payment is collected at this stage — this is an expression of interest only.

Orders will be available for collection at the congress registration desk. Shipping may be available for select items post-congress, subject to confirmation.

Questions? Contact support@euroxpro27.com
`;
