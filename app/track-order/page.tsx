"use client";

import { useState, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Search, Package, Truck, CheckCircle, MapPin, ArrowRight, Clock, ChevronRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Order } from "@/app/types/product";


export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Helper to map status to timeline step index
  // Helper to map status to timeline step index
  const getStatusIndex = (status: string) => {
    const s = status.toLowerCase();
    const statuses = ["pending", "confirmed", "processing", "shipped", "delivered"];
    return statuses.indexOf(s);
  };

  const performSearch = async (id: string) => {
    let cleanId = id.trim();
    // Ensure # is present for order IDs (skip if it's a 24-char MongoDB ID)
    if (cleanId && !cleanId.startsWith("#") && !/^[0-9a-fA-F]{24}$/.test(cleanId)) {
      cleanId = "#" + cleanId;
    }

    if (!cleanId || cleanId === "#") {
      toast.error("Please enter your Order ID");
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    setOrderData(null);

    try {
      // API Call to fetch real order
      const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/order/get-order-by-id/${encodeURIComponent(cleanId)}`;
      const res = await fetch(endpoint);

      // Check for JSON response
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();

      if (data.success && data.data) {
        // Add artificial delay for smoothness
        setTimeout(() => {
          setOrderData(data.data);
          toast.success("Order details fetched successfully");
          setIsSearching(false);
        }, 800);
      } else {
        throw new Error(data.message || "Order not found");
      }

    } catch (error: any) {
      console.log("Direct lookup failed, attempting fallback...", error);
      await attemptFallbackFetch(cleanId, error);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(orderId);
  };

  // Automatically track if id param is in the URL on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const idParam = params.get("id");
      if (idParam) {
        let cleanId = idParam.trim();
        if (cleanId && !cleanId.startsWith("#") && !/^[0-9a-fA-F]{24}$/.test(cleanId)) {
          cleanId = "#" + cleanId;
        }
        setOrderId(cleanId);
        performSearch(cleanId);
      }
    }
  }, []);

  /*
  // Polling Effect - keeps order status updated
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (orderData && orderData.orderId) {
      intervalId = setInterval(async () => {
        try {
          const token = localStorage.getItem("token");

          if (token) {
            // Authenticated: Poll fetch-orders list
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/fetch-orders`, {
              headers: { Authorization: `Bearer ${token}` },
              cache: "no-store"
            });

            if (res.headers.get("content-type")?.includes("application/json")) {
              const json = await res.json();
              if (json.success && Array.isArray(json.orders)) {
                const updatedOrder = json.orders.find((o: Order) =>
                  (o.orderId && o.orderId === orderData.orderId) || o._id === orderData._id
                );

                if (updatedOrder) {
                  setOrderData(updatedOrder);
                }
              }
            }
          } else {
            // Guest: Poll by ID
            let idToPoll = orderData.orderId;
            if (!idToPoll.startsWith("#") && !/^[0-9a-fA-F]{24}$/.test(idToPoll)) {
              idToPoll = "#" + idToPoll;
            }
            const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/order/get-order-by-id/${encodeURIComponent(idToPoll)}`;
            const res = await fetch(endpoint);
            if (res.headers.get("content-type")?.includes("application/json")) {
              const json = await res.json();
              if (json.success && json.data) {
                setOrderData(json.data);
              }
            }
          }
        } catch (err) {
          console.error("Polling failed", err);
        }
      }, 1000); // Poll every 1 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [orderData?.orderId]);
  */

  const attemptFallbackFetch = async (id: string, originalError: any) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw originalError;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/fetch-orders`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store"
      });
      const data = await res.json();

      if (data.success && Array.isArray(data.orders)) {
        const found = data.orders.find((o: Order) => {
          const oId = o.orderId ? o.orderId.toUpperCase() : "";
          const searchId = id.toUpperCase();
          const searchIdWithHash = searchId.startsWith("#") ? searchId : "#" + searchId;
          const searchIdWithoutHash = searchId.startsWith("#") ? searchId.slice(1) : searchId;

          return oId === searchId || oId === searchIdWithHash || oId === searchIdWithoutHash || o._id === id;
        });

        if (found) {
          setTimeout(() => {
            setOrderData(found);
            toast.success("Order found in your history");
            setIsSearching(false);
          }, 800);
          return;
        }
      }
      throw originalError;
    } catch {
      setIsSearching(false);
      console.error("Tracking Failed:", originalError);
      toast.error("Could not find order. Please check the ID.");
      setOrderData(null);
    }
  };


  // Modern Timeline Component
  const renderTimeline = (order: Order) => {
    const steps = [
      { key: "pending", label: "Order Placed", desc: "We have received your order", icon: Package },
      { key: "confirmed", label: "Confirmed", desc: "Order details verified", icon: CheckCircle },
      { key: "processing", label: "Processing", desc: "Your order is being prepared", icon: Clock },
      { key: "shipped", label: "Shipped", desc: "Order has been shipped", icon: Truck },
      { key: "delivered", label: "Delivered", desc: "Package delivered", icon: MapPin },
    ];

    const currentIdx = getStatusIndex(order.orderStatus);
    const isCancelled = order.orderStatus.toLowerCase() === 'cancelled';

    if (isCancelled) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center text-red-600">
          <AlertCircle size={48} className="mb-4" />
          <h3 className="text-xl font-bold uppercase tracking-wider">Order Cancelled</h3>
          <p className="text-sm mt-2 text-gray-500">This order has been cancelled.</p>
        </div>
      );
    }

    return (
      <div className="relative">
        {/* Desktop Horizontal Line */}
        <div className="hidden md:block absolute top-[28px] left-0 w-full h-1 bg-brand/10 rounded-full overflow-hidden">
          <m.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 1, ease: "circOut" }}
            className="h-full bg-brand rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 relative z-10">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <m.div
                key={step.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                className={`flex flex-row md:flex-col items-center md:text-center gap-4 md:gap-4 ${isCompleted ? 'opacity-100' : 'opacity-40'}`}
              >
                {/* Icon Circle */}
                <div className={`
                   w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-500 shadow-md
                   ${isCompleted ? 'bg-brand border-brand text-brand-light scale-100' : 'bg-white border-brand/10 text-brand/35 scale-90'}
                   ${isCurrent ? 'ring-4 ring-brand/10' : ''}
                `}>
                  <step.icon size={20} strokeWidth={2.5} />
                </div>

                {/* Text Info */}
                <div className="flex-1 md:flex-none">
                  <h3 className={`text-[11px] md:text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-brand' : 'text-brand/30'}`}>
                    {step.label}
                  </h3>
                  <p className="text-[10px] md:text-[11px] text-brand/50 font-semibold leading-tight mt-1 max-w-[120px] mx-auto hidden md:block">
                    {step.desc}
                  </p>

                  {/* Mobile Description */}
                  <p className="text-xs text-brand/50 font-semibold mt-0.5 md:hidden">
                    {step.desc}
                  </p>
                </div>
              </m.div>
            )
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-brand-light text-brand font-sans selection:bg-brand/10">

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-24 md:pt-20 md:pb-20 px-4 overflow-hidden">

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-brand">
              Track your Order
            </h1>
            <p className="text-lg text-brand/80 mb-10 font-semibold max-w-lg mx-auto">
              Enter your unique Order ID to see the current status and estimated delivery of your package.
            </p>
          </m.div>

          {/* SEARCH BAR */}
          <m.form
            onSubmit={handleTrack}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={`
              relative flex items-center rounded-full bg-white border transition-all duration-300 shadow-sm
              ${isSearching ? 'scale-[0.98] border-brand ring-4 ring-brand/10' : 'border-brand/10 hover:border-brand/30 hover:shadow-md'}
            `}
          >
            <div className="pl-5 text-brand/50">
              {isSearching ? <div className="w-5 h-5 border-2 border-brand/30 border-t-brand rounded-full animate-spin" /> : <Search size={22} />}
            </div>
            <input
              type="text"
              placeholder="e.g. ORD-1025B"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              disabled={isSearching}
              className="flex-1 py-3.5 px-6 bg-transparent text-lg font-semibold placeholder:text-brand/40 text-brand outline-none w-full"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-3.5 bg-brand hover:bg-brand/90 text-brand-light font-bold rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hidden sm:flex items-center gap-2 mr-1.5"
            >
              Track <ArrowRight size={16} />
            </button>
            {/* Mobile Button */}
            <button type="submit" disabled={isSearching} className="w-12 h-12 bg-brand text-brand-light rounded-full flex sm:hidden items-center justify-center active:scale-95 mr-1.5">
              <ArrowRight size={20} />
            </button>
          </m.form>
        </div>
      </section>


      {/* 2. RESULTS SECTION */}
      <section className="max-w-6xl mx-auto px-4 pb-32 min-h-[400px]">
        <AnimatePresence mode="wait">



          {/* B. LOADING SKELETON */}
          {isSearching && (
            <m.div
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <div className="h-40 bg-brand/5 rounded-3xl border border-brand/10 shadow-sm animate-pulse" />
              <div className="h-64 bg-brand/5 rounded-3xl border border-brand/10 shadow-sm animate-pulse" />
            </m.div>
          )}

          {/* C. ORDER CARD */}
          {orderData && !isSearching && (
            <m.div
              layout
              key="result"
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="max-w-5xl mx-auto"
            >

              {/* MAIN CARD */}
              <div className="bg-brand/5 rounded-3xl border border-brand/10 shadow-sm overflow-hidden relative">

                {/* Header Strip */}
                <div className="bg-brand/3 border-b border-brand/10 p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${orderData.orderStatus === 'delivered' ? 'bg-green-500' : 'bg-brand animate-pulse'}`} />
                      <span className="text-sm font-bold uppercase tracking-wider text-brand/60">{(orderData.orderStatus || "Pending").replace('_', ' ')}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-brand tracking-tight">
                      {orderData.orderId}
                    </h2>
                    <p className="text-brand/50 font-semibold mt-1 text-sm">
                      Placed on {new Date(orderData.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-sm font-bold uppercase tracking-wider text-brand/40 mb-1">Estimated Delivery</p>
                    <p className="text-2xl md:text-3xl font-black text-brand">
                      {orderData.deliveryDate ? new Date(orderData.deliveryDate).toLocaleDateString("en-US", { month: 'short', day: 'numeric' }) : "Pending"}
                    </p>
                  </div>
                </div>

                {/* Timeline Area */}
                <div className="p-8 md:p-14 border-b border-brand/10 bg-transparent">
                  {renderTimeline(orderData)}
                </div>

                {/* Split Content */}
                <div className="flex flex-col lg:flex-row">

                  {/* Left: Products */}
                  <div className="lg:w-2/3 p-8 md:p-10">
                    <h4 className="flex items-center gap-2 font-bold text-brand text-lg mb-6">
                      <Package size={20} className="text-brand/40" /> Package Contents
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {orderData.products.map((item, idx) => (
                        <m.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + (idx * 0.1) }}
                          className="group flex p-4 bg-brand/3 hover:bg-brand/5 rounded-2xl border border-brand/10 transition-all duration-300"
                        >
                          <div className="w-20 h-20 bg-white rounded-xl shadow-sm border border-brand/10 overflow-hidden relative flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                            {item.image ? (
                              <Image src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.image}`} alt={item.title} fill className="object-contain" />
                            ) : (<div className="w-full h-full flex items-center justify-center text-brand/20"><Package size={24} /></div>)}
                          </div>
                          <div className="ml-4 flex flex-col justify-center">
                            <h5 className="font-bold text-brand line-clamp-1 mb-1">{item.title}</h5>
                            <div className="flex items-center gap-3 text-xs font-semibold text-brand/60">
                              <span>Qty: {item.quantity}</span>
                              <span className="w-1 h-1 bg-brand/20 rounded-full" />
                              <span className="text-price font-bold">₹{item.total.toLocaleString()}</span>
                            </div>
                          </div>
                        </m.div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Address & Summary */}
                  <div className="lg:w-1/3 bg-brand/3 p-8 md:p-10 border-t lg:border-t-0 lg:border-l border-brand/10">
                    <div className="space-y-8">
                      <div>
                        <h4 className="flex items-center gap-2 font-bold text-brand text-lg mb-4">
                          <MapPin size={20} className="text-brand/40" /> Shipping To
                        </h4>
                        {orderData.shippingAddress && (
                          <div className="text-brand/80 text-sm leading-relaxed font-semibold">
                            <p className="text-brand font-bold text-base mb-1">{orderData.shippingAddress.fullName || "Guest User"}</p>
                            <p>{orderData.shippingAddress.street}</p>
                            <p>{orderData.shippingAddress.city} {orderData.shippingAddress.zipCode && ` - ${orderData.shippingAddress.zipCode}`}</p>
                            <p>{orderData.shippingAddress.state}, {orderData.shippingAddress.country}</p>
                            {orderData.shippingAddress.phone && <p className="mt-2 text-xs bg-white inline-block px-2.5 py-1 rounded-xl border border-brand/10 text-brand">Phone: {orderData.shippingAddress.phone}</p>}
                          </div>
                        )}
                      </div>

                      <div className="pt-8 border-t border-brand/15">
                        <div className="flex justify-between items-center text-sm mb-2 font-medium">
                          <span className="text-brand/60">Subtotal</span>
                          <span className="font-bold text-brand">₹{orderData.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mb-4 font-medium">
                          <span className="text-brand/60">Shipping</span>
                          <span className="font-bold text-green-600">Free</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-black border-t border-brand/10 pt-4">
                          <span className="text-brand">Total</span>
                          <span className="text-brand">₹{orderData.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Footer Strip */}
                <div className="bg-brand text-brand-light p-4 text-center text-xs font-bold uppercase tracking-widest cursor-default">
                  Official Receipt • Bixright Ecommerce
                </div>

              </div>

              {/* Help Link */}
              <div className="mt-12 text-center">
                <Link href="/contact" className="inline-flex items-center gap-2 text-brand/60 hover:text-brand transition-colors font-bold text-sm">
                  Need help with this order? <span className="underline">Contact Support</span> <ChevronRight size={14} />
                </Link>
              </div>

            </m.div>
          )}

        </AnimatePresence>
      </section>

      {/* Global CSS for blob animation */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

    </div>
  );
}
