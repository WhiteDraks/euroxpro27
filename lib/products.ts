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
      "Premium heavyweight hoodie in deep navy. Features embroidered EUROXPRO'27 wordmark on the chest and Istanbul skyline graphic on the back. Made from 80% organic cotton, 20% recycled polyester.",
    price: 45,
    currency: CURRENCY,
    category: "hoodies",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Deep Navy", hex: "#101B35" },
      { name: "Burgundy", hex: "#741F3D" },
    ],
    stockStatus: "coming-soon",
    isIllustrative: true,
    badge: "Limited Edition",
  },
  {
    id: "tshirt-white",
    name: "EUROXPRO'27 Graphic T-Shirt",
    description:
      "100% organic cotton tee with the EUROXPRO'27 typographic crest. Soft, sustainable, and perfect for casual wear or as a congress souvenir.",
    price: 25,
    currency: CURRENCY,
    category: "tshirts",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Warm Ivory", hex: "#F7F3ED" },
      { name: "Deep Navy", hex: "#101B35" },
    ],
    stockStatus: "coming-soon",
    isIllustrative: true,
  },
  {
    id: "tote-bag",
    name: "Congress Canvas Tote Bag",
    description:
      "Heavy-duty raw canvas tote bag with the EUROXPRO'27 wordmark and tagline. Spacious enough for your congress materials, laptop, and city exploration essentials.",
    price: 18,
    currency: CURRENCY,
    category: "tote-bags",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    colors: [
      { name: "Natural Canvas", hex: "#E8DFD0" },
      { name: "Navy", hex: "#172443" },
    ],
    stockStatus: "coming-soon",
    isIllustrative: true,
  },
  {
    id: "notebook",
    name: "EUROXPRO'27 Delegate Hardcover Journal",
    description:
      "Hardcover A5 notebook with ivory lined pages and the embossed EUROXPRO'27 cover motif. Elastic closure, ribbon bookmark, and pen loop. Perfect for congress notes and reflections.",
    price: 15,
    currency: CURRENCY,
    category: "notebooks",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    colors: [{ name: "Navy", hex: "#101B35" }],
    stockStatus: "coming-soon",
    isIllustrative: true,
  },
  {
    id: "pin-set",
    name: "Istanbul Enamel Pin Set",
    description:
      "A set of 3 collectible enamel pins featuring iconic Istanbul motifs: the Bosphorus bridge, a tulip, and the EUROXPRO'27 crest. Gold-plated with hard enamel finish.",
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
      "A pack of 6 weather-resistant vinyl stickers featuring the EUROXPRO'27 wordmark, Istanbul architectural illustrations, and congress graphic tokens.",
    price: 6,
    currency: CURRENCY,
    category: "stickers",
    image: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=800&q=80",
    stockStatus: "coming-soon",
    isIllustrative: true,
  },
  {
    id: "keychain",
    name: "Istanbul Metal Silhouette Keychain",
    description:
      "Premium brushed metal keychain with the EUROXPRO'27 logo and Istanbul skyline silhouette. A durable, elegant memento of your congress experience.",
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
      "Classic 6-panel structured cotton twill cap in deep navy with tonal embroidered EUROXPRO'27 logo. Brass buckle adjustable strap.",
    price: 22,
    currency: CURRENCY,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    colors: [
      { name: "Deep Navy", hex: "#101B35" },
      { name: "Burgundy", hex: "#741F3D" },
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

Questions? Contact [support@euroxpro27.com]
`;
