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
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Shopping Cart
            <span className="ml-3 text-lg font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full align-middle">
              {cart.length} item{cart.length !== 1 && 's'}
            </span>
          </h1>
          <button
            onClick={() => router.push('/')}
            className="hidden md:flex items-center text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        {cart.length === 0 ? (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm"
          >
            <div className="w-24 h-24 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-sm text-center">Looks like you haven't added anything to your cart yet.</p>
            <button
              onClick={() => router.push("/")}
              className="px-8 py-3 bg-black text-white rounded-full font-semibold hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-black/20"
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
                    const totalPrice = (item.price * item.quantity).toFixed(2);

                    return (
                      <m.div
                        layout
                        key={`${item._id}-${item.variantId}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative flex flex-col sm:flex-row bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300"
                      >
                        {/* Image */}
                        <div
                          className="relative h-32 w-full sm:w-32 sm:h-32 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 cursor-pointer"
                          onClick={() => router.push(`/product/${item._id}`)}
                        >
                          <Image
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${img}`}
                            alt={item.title}
                            fill
                            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        {/* Content */}
                        <div className="mt-4 sm:ml-6 sm:mt-0 flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3
                                onClick={() => router.push(`/product/${item._id}`)}
                                className="text-lg font-bold text-gray-900 hover:text-gray-600 transition-colors cursor-pointer line-clamp-1"
                              >
                                {item.title}
                              </h3>
                              <p className="mt-1 text-sm text-gray-500 line-clamp-1">{item.subTitle}</p>

                              <div className="mt-2 flex flex-wrap gap-2">
                                {item.size && (
                                  <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-500/10">
                                    Size: {item.size}
                                  </span>
                                )}
                                {item.color && (
                                  <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-500/10">
                                    Color: {item.color}
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={() => removeFromCart(item)}
                              className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors -mr-2"
                              aria-label="Remove item"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="mt-4 flex items-end justify-between">
                            <div className="flex items-center rounded-full border border-gray-200 bg-white shadow-sm">
                              <button
                                onClick={() => decreaseQty(item)}
                                disabled={item.quantity <= 1}
                                className="p-2 text-gray-600 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
                              <button
                                onClick={() => increaseQty(item)}
                                className="p-2 text-gray-600 hover:text-black transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <p className="flex flex-col items-end">
                              <span className="text-lg font-bold text-gray-900">₹{totalPrice}</span>
                              <span className="text-xs text-gray-500">₹{item.discountedPrice} each</span>
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
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-6 sm:p-8 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-900">
                      {shipping === 0 ? <span className="text-green-600">Free</span> : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium text-gray-900">₹{tax.toFixed(2)}</span>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={handleProceed}
                    className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-900 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xl shadow-black/10 flex items-center justify-center gap-2"
                  >
                    Checkout <Tag className="w-4 h-4" />
                  </button>
                  <p className="mt-4 text-center text-xs text-gray-500 flex items-center justify-center gap-1">
                    <Gift className="w-3 h-3" /> Secure Checkout
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
