"use client";

import { m, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Gift, ShoppingBag, Plus, Minus, Tag, X } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePolicy } from "../components/PolicyProvider";

export default function CartPage() {
  const router = useRouter();
  const { cart, increaseQty, decreaseQty, removeFromCart } = useCart();

  const [promo, setPromo] = useState("");
  const [applied, setApplied] = useState(false);
  const { policy } = usePolicy();
  const calculateTotals = () => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.discountedPrice * item.quantity,
      0
    );
    const shipping =
      subtotal > policy.minFreeShippingAmount ? 0 : policy.shippingCharge;
    const tax = 0;
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  const { subtotal, shipping, tax, total } = calculateTotals();

  const handleProceed = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/user/login");
      return;
    }

    router.push("/checkout");
  };

  return (
    <div className="bg-brand-light text-brand py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-brand tracking-tight">
            Shopping Cart
            <span className="ml-3 text-sm font-bold text-brand/60 bg-brand/5 border border-brand/10 px-3 py-1 rounded-full align-middle">
              {cart.length} item{cart.length !== 1 && 's'}
            </span>
          </h1>
          <button
            onClick={() => router.push('/')}
            className="hidden md:flex items-center text-sm font-semibold text-brand/70 hover:text-brand transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        {cart.length === 0 ? (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 bg-brand/5 rounded-3xl border border-dashed border-brand/20 shadow-sm"
          >
            <div className="w-24 h-24 bg-brand/10 text-brand/50 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-brand mb-2">Your cart is empty</h2>
            <p className="text-brand/60 mb-8 max-w-sm text-center font-semibold text-sm">Looks like you haven't added anything to your cart yet.</p>
            <button
              onClick={() => router.push("/")}
              className="px-8 py-3.5 bg-brand hover:bg-brand/90 text-brand-light rounded-full font-bold transition-all duration-200 shadow-sm"
            >
              Start Shopping
            </button>
          </m.div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">
            {/* Cart Items List */}
            <section className="lg:col-span-8">
              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {cart.map((item, index) => {
                    const img = `${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.images?.[0]?.imageUrl}`
                    const totalPrice = (item.discountedPrice * item.quantity).toFixed(2);

                    return (
                      <m.div
                        layout
                        key={`${item._id}-${item.variantId}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                        transition={{ delay: index * 0.05 }}
                        className="relative flex flex-col sm:flex-row bg-brand/5 rounded-2xl sm:rounded-4xl p-5 border border-brand/10 transition-all duration-300 shadow-sm"
                      >
                        {/* Image */}
                        <div
                          className="relative h-32 w-full sm:w-32 sm:h-32 flex-shrink-0 overflow-hidden rounded-xl bg-white border border-brand/10 cursor-pointer flex items-center justify-center"
                          onClick={() => router.push(`/product/${item._id}`)}
                        >
                          <Image
                            src={img}
                            alt={item.title}
                            fill
                            className="h-full w-full object-contain p-1.5 transition-transform duration-500"
                          />
                        </div>

                        {/* Content */}
                        <div className="mt-4 sm:ml-6 sm:mt-0 flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3
                                onClick={() => router.push(`/product/${item._id}`)}
                                className="text-lg font-bold text-brand hover:text-brand/70 transition-colors cursor-pointer line-clamp-1"
                              >
                                {item.title}
                              </h3>
                              <p className="mt-1 text-sm text-brand/60 font-semibold line-clamp-1">{item.subTitle}</p>

                              <div className="mt-2 flex flex-wrap gap-2">
                                {item.size && (
                                  <span className="inline-flex items-center rounded-md bg-brand/5 px-2.5 py-1 text-xs font-semibold text-brand/80 ring-1 ring-inset ring-brand/10">
                                    Size: {item.size}
                                  </span>
                                )}
                                {item.color && (
                                  <span className="inline-flex items-center rounded-md bg-brand/5 px-2.5 py-1 text-xs font-semibold text-brand/80 ring-1 ring-inset ring-brand/10">
                                    Color: {item.color}
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={() => removeFromCart(item)}
                              className="text-brand/40 hover:text-red-500 p-2 rounded-full hover:bg-red-50/50 transition-colors -mr-2 cursor-pointer"
                              aria-label="Remove item"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="mt-4 flex items-end justify-between">
                            <div className="flex items-center rounded-full border border-brand/10 bg-brand-light p-0.5">
                              <button
                                onClick={() => decreaseQty(item)}
                                disabled={item.quantity <= 1}
                                className="p-2 text-brand/60 hover:text-brand disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center text-sm font-bold text-brand">{item.quantity}</span>
                              <button
                                onClick={() => increaseQty(item)}
                                className="p-2 text-brand/60 hover:text-brand transition-colors cursor-pointer"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <p className="flex flex-col items-end">
                              <span className="text-xl font-black text-brand">₹{parseFloat(totalPrice).toLocaleString()}</span>
                              <span className="text-xs text-brand/50 font-semibold">₹{item.discountedPrice.toLocaleString()} each</span>
                            </p>
                          </div>
                        </div>
                      </m.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </section>

            {/* Summary Sidebar */}
            <section className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-brand/5 rounded-2xl sm:rounded-4xl border border-brand/10 p-6 sm:p-8 sticky top-24 shadow-sm">
                <h2 className="text-xl font-bold text-brand mb-6 tracking-tight">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span className="text-brand/60">Subtotal</span>
                    <span className="text-brand">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span className="text-brand/60">Shipping</span>
                    <span className="text-brand">
                      {shipping === 0 ? <span className="text-green-600 font-bold">Free</span> : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span className="text-brand/60">Tax</span>
                    <span className="text-brand">₹{tax.toFixed(2)}</span>
                  </div>

                  <div className="pt-4 border-t border-brand/10 flex items-center justify-between">
                    <span className="text-base font-bold text-brand">Total</span>
                    <span className="text-2xl font-black text-brand tracking-tight">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={handleProceed}
                    className="w-full bg-brand text-brand-light py-3.5 rounded-full font-bold text-base hover:bg-brand/90 hover:shadow-lg transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Checkout <Tag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
