"use client";

import { useState } from "react";
import { ShoppingBag, Check, Trash2, AlertCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { Product, CartItem, ProductSize, ProductColor } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";

export function MerchStore({
  products,
  categories,
  instructions,
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
    setOrderSubmitted(true);
  };

  return (
    <div className="py-16 bg-[#F7F3ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Notice on illustrative nature */}
        <div className="mb-10 bg-amber-500/10 border border-amber-500/30 rounded-lg p-5 flex items-start gap-4">
          <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900 leading-relaxed">
            <strong className="font-semibold block mb-1">Illustrative Preview &amp; Pre-Order Interest System</strong>
            The official EUROXPRO&apos;27 merchandise collection is in active development. All items, designs, and prices below are illustrative representations. Submitting an order here records your interest with the Organizing Committee — no payment or financial transaction occurs until official pre-orders open.
            {instructions && (
              <p className="mt-2 text-xs text-amber-800 border-t border-amber-500/20 pt-2">
                {instructions.trim().split("\n")[0]}
              </p>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={cn(
                "px-4 py-2 rounded-sm text-sm font-medium transition-colors",
                selectedCategory === c.id
                  ? "bg-[#741F3D] text-white"
                  : "bg-white border border-[#E3E0DC] text-[#5A6478] hover:text-[#101B35]"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Products Grid */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            {filteredProducts.map((p) => (
              <Card key={p.id} className="bg-white flex flex-col justify-between group hover:shadow-md transition-shadow">
                <div>
                  <div className="aspect-[4/3] bg-[#101B35]/5 flex items-center justify-center relative p-6">
                    <div className="w-20 h-20 bg-[#101B35] rounded-md flex items-center justify-center text-white">
                      <ShoppingBag size={28} className="text-[#741F3D]" />
                    </div>
                    {p.badge && (
                      <div className="absolute top-3 left-3">
                        <Badge variant="burgundy">{p.badge}</Badge>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge variant="muted">Sample Design</Badge>
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] text-[#A7AFBF] tracking-widest uppercase block mb-1">
                      {p.category}
                    </span>
                    <h3 className="font-display font-bold text-lg text-[#101B35] mb-2">{p.name}</h3>
                    <p className="text-xs text-[#5A6478] leading-relaxed line-clamp-2 mb-3">
                      {p.description}
                    </p>
                    <div className="flex items-baseline justify-between pt-2 border-t border-[#E3E0DC]">
                      <span className="text-lg font-bold text-[#741F3D]">
                        {formatPrice(p.price)}
                      </span>
                      <span className="text-[11px] text-[#A7AFBF]">TBC</span>
                    </div>
                  </div>
                </div>
                <div className="p-5 pt-0">
                  <Button
                    onClick={() => openProductModal(p)}
                    variant="outline"
                    className="w-full text-xs py-2"
                  >
                    Select &amp; Configure
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Cart & Expression of Interest Drawer */}
          <div className="bg-white border border-[#E3E0DC] rounded-lg p-6 sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-[#E3E0DC] mb-4">
              <h3 className="font-display font-bold text-xl text-[#101B35]">Your Pre-Order Cart</h3>
              <Badge variant="burgundy">{cart.reduce((n, i) => n + i.quantity, 0)} items</Badge>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-[#A7AFBF] text-sm">
                Your cart is empty. Choose items from the catalog to configure sizes and quantities.
              </div>
            ) : orderSubmitted ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check size={24} />
                </div>
                <h4 className="font-display font-bold text-lg text-[#101B35] mb-2">Order Request Recorded!</h4>
                <p className="text-xs text-[#5A6478] leading-relaxed mb-4">
                  Thank you, {formData.name}. Your expression of interest has been saved locally. The Organizing Committee will contact {formData.email} when official congress merchandise orders open.
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
                    <div key={idx} className="flex items-center justify-between gap-3 text-sm pb-3 border-b border-[#E3E0DC]">
                      <div className="min-w-0">
                        <p className="font-medium text-[#101B35] truncate">{item.product.name}</p>
                        <p className="text-xs text-[#A7AFBF]">
                          {item.quantity}x @ {formatPrice(item.product.price)}
                          {item.selectedSize && ` · ${item.selectedSize}`}
                          {item.selectedColor && ` · ${item.selectedColor.name}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-[#741F3D]">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeFromCart(idx)}
                          className="text-[#A7AFBF] hover:text-red-600 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#E3E0DC] mb-6">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-semibold text-[#101B35]">Estimated Total:</span>
                    <span className="text-xl font-bold text-[#741F3D]">{formatPrice(cartSubtotal)}</span>
                  </div>
                  <span className="text-[11px] text-[#A7AFBF] block">
                    Estimated congress collection pricing. No payment due now.
                  </span>
                </div>

                {/* Reservation Form */}
                <form onSubmit={handleOrderSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#101B35] mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Maria Rossi"
                      className="w-full text-xs px-3 py-2 border border-[#E3E0DC] rounded-sm focus:outline-none focus:border-[#741F3D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#101B35] mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="maria@aiesec.net"
                      className="w-full text-xs px-3 py-2 border border-[#E3E0DC] rounded-sm focus:outline-none focus:border-[#741F3D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#101B35] mb-1">AIESEC Entity / LC</label>
                    <input
                      type="text"
                      value={formData.entity}
                      onChange={(e) => setFormData({ ...formData, entity: e.target.value })}
                      placeholder="e.g. AIESEC in Italy"
                      className="w-full text-xs px-3 py-2 border border-[#E3E0DC] rounded-sm focus:outline-none focus:border-[#741F3D]"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <div className="bg-white rounded-lg max-w-lg w-full p-6 relative">
              <h3 className="font-display font-bold text-2xl text-[#101B35] mb-2">
                {activeModalProduct.name}
              </h3>
              <p className="text-sm text-[#5A6478] mb-4">{activeModalProduct.description}</p>
              <p className="text-lg font-bold text-[#741F3D] mb-6">
                {formatPrice(activeModalProduct.price)}
              </p>

              {activeModalProduct.sizes && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-[#101B35] mb-2 uppercase tracking-wide">
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
                            : "border-[#E3E0DC] text-[#5A6478] hover:border-[#101B35]"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeModalProduct.colors && (
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-[#101B35] mb-2 uppercase tracking-wide">
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
                <label className="text-xs font-semibold text-[#101B35] uppercase tracking-wide">
                  Quantity:
                </label>
                <div className="flex items-center border border-[#E3E0DC] rounded-sm">
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
                <Button onClick={addToCart} variant="primary" className="flex-1">
                  Add to Pre-Order Cart
                </Button>
                <Button onClick={() => setActiveModalProduct(null)} variant="outline">
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
