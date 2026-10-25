"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Check, Trash2, Send, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { Product, CartItem, ProductSize, ProductColor } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";

export function MerchStore({
  products,
  categories,
}: {
  products: Product[];
  categories: { id: string; label: string }[];
  instructions: string;
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  // Variant selection states in modal
  const [selectedSize, setSelectedSize] = useState<ProductSize | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<ProductColor | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  // Order submission state
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    entity: "",
    notes: "",
  });

  const filteredProducts = products.filter(
    (p) => selectedCategory === "all" || p.category === selectedCategory
  );

  const openProductModal = (product: Product) => {
    setActiveModalProduct(product);
    setSelectedSize(product.sizes ? product.sizes[0] : undefined);
    setSelectedColor(product.colors ? product.colors[0] : undefined);
    setQuantity(1);
  };

  const addToCart = () => {
    if (!activeModalProduct) return;
    const existingIndex = cart.findIndex(
      (item) =>
        item.product.id === activeModalProduct.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor?.name === selectedColor?.name
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          product: activeModalProduct,
          quantity,
          selectedSize,
          selectedColor,
        },
      ]);
    }
    setActiveModalProduct(null);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    // No order backend yet: hand the request to the visitor's email app.
    const lines = cart.map(
      (item) =>
        `- ${item.quantity} × ${item.product.name}` +
        (item.selectedSize ? `, size ${item.selectedSize}` : "") +
        (item.selectedColor ? `, ${item.selectedColor.name}` : "")
    );
    const body = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Entity: ${formData.entity}`,
      "",
      "Items:",
      ...lines,
      "",
      formData.notes,
    ].join("\n");
    window.location.href = `mailto:${siteConfig.supportEmail}?subject=${encodeURIComponent("EUROXPRO'27 merch pre-order interest")}&body=${encodeURIComponent(body)}`;
    setOrderSubmitted(true);
  };

  return (
    <div className="pb-20 sm:pb-28 bg-[#F7F3ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Notice on illustrative nature */}
        <div className="mb-10 pl-4 border-l-2 border-[#741F3D] max-w-3xl text-base text-[#374151] leading-relaxed">
          <p>
            <strong className="font-semibold text-[#101B35]">This is a preview, not a shop yet.</strong> Designs and prices
            are still being worked on. Sending a pre-order request just tells the Organizing Committee what you would like;
            nothing is charged here, and AIESEC in Türkiye will share how to pay once the collection is final.
          </p>
        </div>

        {/* Categories */}
        <div className="flex gap-x-6 mb-10 border-b border-[#D9D2C5] overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={selectedCategory === c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={cn(
                "whitespace-nowrap py-3 -mb-px text-sm border-b-2 transition-colors",
                selectedCategory === c.id
                  ? "border-[#741F3D] text-[#101B35] font-semibold"
                  : "border-transparent text-[#5A6478] hover:text-[#101B35]"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Products Grid */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-x-8 gap-y-12">
            {filteredProducts.map((p) => (
              <Card key={p.id} className="bg-transparent border-0 rounded-none flex flex-col justify-between group">
                <div>
                  <div className="aspect-[4/3] bg-[#EFE9DF] overflow-hidden relative">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="object-cover object-center img-zoom"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag size={28} className="text-[#741F3D]" />
                      </div>
                    )}

                  </div>
                  <div className="pt-4">
                    <p className="text-xs text-[#741F3D]">
                      {categories.find((c) => c.id === p.category)?.label ?? p.category}
                      {p.badge && <> · {p.badge}</>} · Sample design
                    </p>
                    <div className="flex items-baseline justify-between gap-4 mt-1">
                      <h3 className="font-serif-title text-xl text-[#101B35] font-normal">{p.name}</h3>
                      <span className="text-base text-[#101B35] tabular-nums whitespace-nowrap">
                        {formatPrice(p.price)}
                      </span>
                    </div>
                    <p className="text-sm text-[#4B5563] leading-relaxed line-clamp-2 mt-2 mb-4">
                      {p.description}
                    </p>
                  </div>
                </div>
                <div>
                  <Button
                    onClick={() => openProductModal(p)}
                    variant="outline"
                    className="w-full text-xs py-2 font-medium"
                  >
                    Select &amp; Configure
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Cart & Expression of Interest Drawer */}
          <div className="bg-white border border-[#E5E1DA] rounded-sm p-6 sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E1DA] mb-4">
              <h3 className="font-serif-title text-xl text-[#101B35]">Pre-Order Cart</h3>
              <Badge variant="burgundy">{cart.reduce((n, i) => n + i.quantity, 0)} items</Badge>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-[#A7AFBF] text-xs leading-relaxed">
                Your cart is empty. Select products from the collection above to configure your pre-order interest.
              </div>
            ) : orderSubmitted ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check size={24} />
                </div>
                <h4 className="font-serif-title font-bold text-lg text-[#101B35] mb-2">Almost done</h4>
                <p className="text-xs text-[#5A6478] leading-relaxed mb-4">
                  Thank you, {formData.name}. Your email app should have opened with your pre-order request ready to send. Press send there to register your interest with the Organizing Committee (no payment is taken), or write to {siteConfig.supportEmail}.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setOrderSubmitted(false);
                    setCart([]);
                  }}
                >
                  Start New Request
                </Button>
              </div>
            ) : (
              <div>
                <div className="space-y-4 max-h-64 overflow-y-auto mb-4 pr-1">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 text-xs pb-3 border-b border-[#E5E1DA]">
                      <div className="min-w-0">
                        <p className="font-medium text-[#101B35] truncate">{item.product.name}</p>
                        <p className="text-[11px] text-[#A7AFBF]">
                          {item.quantity}x @ {formatPrice(item.product.price)}
                          {item.selectedSize && ` · ${item.selectedSize}`}
                          {item.selectedColor && ` · ${item.selectedColor.name}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#741F3D]">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeFromCart(idx)}
                          className="text-[#A7AFBF] hover:text-red-600 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#E5E1DA] mb-6">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-semibold text-[#101B35] uppercase tracking-wide">Estimated Subtotal:</span>
                    <span className="text-xl font-bold text-[#741F3D]">{formatPrice(cartSubtotal)}</span>
                  </div>
                  <span className="text-[10px] text-[#A7AFBF] block">
                    No payment is collected at this stage.
                  </span>
                </div>

                {/* Reservation Form */}
                <form onSubmit={handleOrderSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#101B35] mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Maria Rossi"
                      className="w-full text-xs px-3 py-2 border border-[#E5E1DA] rounded-sm focus:outline-none focus:border-[#741F3D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#101B35] mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="maria@aiesec.net"
                      className="w-full text-xs px-3 py-2 border border-[#E5E1DA] rounded-sm focus:outline-none focus:border-[#741F3D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#101B35] mb-1">AIESEC Entity / LC</label>
                    <input
                      type="text"
                      value={formData.entity}
                      onChange={(e) => setFormData({ ...formData, entity: e.target.value })}
                      placeholder="e.g. AIESEC in Italy"
                      className="w-full text-xs px-3 py-2 border border-[#E5E1DA] rounded-sm focus:outline-none focus:border-[#741F3D]"
                    />
                  </div>
                  <Button type="submit" variant="primary" className="w-full text-xs py-2.5 mt-2">
                    <Send size={13} /> Submit Pre-Order Expression
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Modal for Variant Configuration */}
        {activeModalProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white rounded-sm max-w-lg w-full p-6 relative border border-[#E5E1DA] shadow-2xl">
              <button
                onClick={() => setActiveModalProduct(null)}
                className="absolute top-4 right-4 text-[#A7AFBF] hover:text-[#101B35] transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              {activeModalProduct.image && (
                <div className="aspect-[16/9] relative overflow-hidden rounded-sm mb-4 bg-[#101B35]">
                  <Image
                    src={activeModalProduct.image}
                    alt={activeModalProduct.name}
                    fill
                    sizes="480px"
                    className="object-cover object-center"
                  />
                </div>
              )}

              <h3 className="font-serif-title text-2xl text-[#101B35] mb-1">
                {activeModalProduct.name}
              </h3>
              <p className="text-xs text-[#5A6478] mb-3 leading-relaxed">{activeModalProduct.description}</p>
              <p className="text-xl font-bold text-[#741F3D] mb-5">
                {formatPrice(activeModalProduct.price)}
              </p>

              {activeModalProduct.sizes && (
                <div className="mb-4">
                  <label className="block text-[11px] font-semibold text-[#101B35] mb-2 uppercase tracking-wide">
                    Select Size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {activeModalProduct.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={cn(
                          "px-3 py-1.5 text-xs font-semibold border rounded-sm transition-colors",
                          selectedSize === s
                            ? "border-[#741F3D] bg-[#741F3D] text-white"
                            : "border-[#E5E1DA] text-[#5A6478] hover:border-[#101B35]"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeModalProduct.colors && (
                <div className="mb-5">
                  <label className="block text-[11px] font-semibold text-[#101B35] mb-2 uppercase tracking-wide">
                    Select Color: <span className="text-[#741F3D] normal-case">{selectedColor?.name}</span>
                  </label>
                  <div className="flex gap-2">
                    {activeModalProduct.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        title={c.name}
                        className={cn(
                          "w-7 h-7 rounded-full border-2 transition-transform",
                          selectedColor?.name === c.name ? "ring-2 ring-[#741F3D] scale-110" : "border-gray-300"
                        )}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <label className="text-[11px] font-semibold text-[#101B35] uppercase tracking-wide">
                  Quantity:
                </label>
                <div className="flex items-center border border-[#E5E1DA] rounded-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-sm text-[#5A6478] hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-sm font-semibold text-[#101B35]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-sm text-[#5A6478] hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={addToCart} variant="primary" className="flex-1 text-xs">
                  Add to Pre-Order Cart
                </Button>
                <Button onClick={() => setActiveModalProduct(null)} variant="outline" className="text-xs">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
