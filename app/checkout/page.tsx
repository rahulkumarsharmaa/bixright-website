"use client";

import React, { useEffect, useMemo, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  CreditCard,
  Truck,
  MapPin,
  AlertCircle,
  Trash2,
  Plus,
  Minus,
  Copy,
} from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { copyToClipboard } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { countries } from "@/app/types/countries";
import { usePolicy } from "../components/PolicyProvider";

interface Props {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

type Address = {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

type ShippingForm = Address;
type BillingForm = Address;

type PaymentForm = {
  method: "card" | "cod";
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
};

type ValidationErrors<T> = Partial<Record<keyof T, string>>;

type CartImage = { imageUrl?: string } | null | undefined;

type CartItem = {
  _id: string;
  productId?: string;
  title: string;
  brandName?: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  images?: CartImage[];
  image?: string;
};

export default function CheckoutPage(): React.ReactElement {
  const router = useRouter();
  const { cart, removeFromCart, increaseQty, decreaseQty, fetchCart } =
    useCart();

  const [shippingAddress, setShippingAddress] = useState<ShippingForm>({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
  });

  const [billing, setBilling] = useState<BillingForm>({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
  });

  const [sameAsShipping, setSameAsShipping] = useState<boolean>(true);

  const [payment, setPayment] = useState<PaymentForm>({
    method: "card",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const validatePayment = (data: typeof payment) => {
    const errors = {
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
    };

    if (!/^\d{16}$/.test(data.cardNumber.replace(/\s+/g, ""))) {
      errors.cardNumber = "Enter a valid 16-digit card number";
    }

    if (!/^[A-Za-z ]{3,}$/.test(data.cardName.trim())) {
      errors.cardName = "Enter card holder name (letters only)";
    }

    if (!/^\d{2}\/\d{2}$/.test(data.expiryDate)) {
      errors.expiryDate = "Enter valid expiry (MM/YY)";
    } else {
      const [mm, yy] = data.expiryDate.split("/").map(Number);
      if (mm < 1 || mm > 12) {
        errors.expiryDate = "Invalid month";
      } else {
        const now = new Date();
        const currentYear = Number(now.getFullYear().toString().slice(2));
        const currentMonth = now.getMonth() + 1;

        if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
          errors.expiryDate = "Card expired";
        }
      }
    }

    if (!/^\d{3}$/.test(data.cvv)) {
      errors.cvv = "Enter a valid 3-digit CVV";
    }

    return errors;
  };

  const [shipErrors, setShipErrors] = useState<ValidationErrors<ShippingForm>>(
    {}
  );
  const [billErrors, setBillErrors] = useState<ValidationErrors<BillingForm>>(
    {}
  );
  const [payErrors, setPayErrors] = useState<ValidationErrors<PaymentForm>>({});

  const [coupon, setCoupon] = useState<string>("");
  const [couponApplied, setCouponApplied] = useState<number>(0);
  const [couponMsg, setCouponMsg] = useState<string>("");
  const { policy } = usePolicy();
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string>("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/customer/get-profile`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }
        );

        const json = await res.json();
        const profile = json?.data;

        if (!profile) return;

        const addr = profile.shippingAddress ??
          profile.address ?? {
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
        };

        const validCountry = countries.includes(addr.country) ? addr.country : "India";

        setShippingAddress({
          addressLine1: addr.addressLine1,
          addressLine2: addr.addressLine2 ?? "",
          city: addr.city,
          state: addr.state,
          country: validCountry,
          postalCode: addr.postalCode,
        });

        setBilling({
          addressLine1: addr.addressLine1,
          addressLine2: addr.addressLine2 ?? "",
          city: addr.city,
          state: addr.state,
          country: validCountry,
          postalCode: addr.postalCode,
        });

        setSameAsShipping(true);
      } catch (err) {
        console.error("profile prefill failed", err);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    if (sameAsShipping) {
      setBilling({ ...shippingAddress });
    }
  }, [sameAsShipping, shippingAddress]);

  const placeOrder = async () => {
    if (!Array.isArray(cart) || cart.length === 0) return;

    const shipOk = validateShipping();
    const billOk = sameAsShipping ? true : validateBilling();

    const paymentValidation = validatePayment(payment);
    setPayErrors(paymentValidation);

    const hasPaymentErrors = Object.values(paymentValidation).some(
      (msg) => msg && msg.length > 0
    );

    if (!shipOk || !billOk || (payment.method === "card" && hasPaymentErrors)) {
      return;
    }

    setLoading(true);
    setApiError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        sessionStorage.setItem("prev-url", window.location.pathname);
        router.push("/user/login");

        return;
      }

      const payload = {
        shippingAddress: { ...shippingAddress },
        billingAddress: sameAsShipping
          ? { ...shippingAddress }
          : { ...billing },
        paymentMethod: payment.method,
        products: cart.map((it: CartItem) => ({
          productId: it.productId,
          quantity: it.quantity,
        })),
        coupounDiscount: couponApplied,
        couponCode: coupon,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order/place-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();

      if (json.success) {
        if (token) {
          fetchCart();
        } else {
          cart.forEach((it) => removeFromCart(it));
        }

        // Capture the Order ID if returned by the backend
        const newOrderId = json.orderId || json.order?.orderId || json.order?.orderNumber || json.data?.orderId || json.data?.orderNumber || null;
        setCreatedOrderId(newOrderId);

        setPlaced(true);
      } else {
        setApiError(
          json.message ||
          "Your payment could not be processed. Please try again."
        );
      }
    } catch {
      setApiError("Network error — please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = useMemo(
    () =>
      Array.isArray(cart)
        ? cart.reduce((s, it) => s + it.price * it.quantity, 0)
        : 0,
    [cart]
  );
  const discountedSubtotal = useMemo(
    () =>
      Array.isArray(cart)
        ? cart.reduce((s, it) => s + it.discountedPrice * it.quantity, 0)
        : 0,
    [cart]
  );
  const shipping =
    subtotal == 0
      ? 0
      : subtotal > policy.minFreeShippingAmount
        ? 0
        : policy.shippingCharge;
  const discountAmount = subtotal - discountedSubtotal;

  const total = +(subtotal + shipping - discountAmount - couponApplied).toFixed(
    2
  );

  function handleShipChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setShippingAddress((s) => ({ ...s, [name]: value }));
    setShipErrors((p) => ({ ...p, [name]: "" }));
  }

  function handleBillChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setBilling((s) => ({ ...s, [name]: value }));
    setBillErrors((p) => ({ ...p, [name]: "" }));
  }

  function handlePayChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setPayment((s) => ({ ...s, [name]: value }));
    setPayErrors((p) => ({ ...p, [name]: "" }));
  }

  async function applyCoupon() {
    try {
      const code = coupon.trim().toUpperCase();
      if (!code) {
        setCouponMsg("Please enter a coupon code");
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        router.push("/user/login");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order/check-coupons?code=${code}&total=${discountedSubtotal}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setCouponApplied(data.data.discountValue);
        setCouponMsg(`✓ ${data.data.discountValue} discount applied`);
      } else {
        setCouponApplied(0);
        setCouponMsg(data.message || "Invalid coupon");
      }
    } catch (error) {
      console.error("Error validating coupon:", error);
      setCouponApplied(0);
      setCouponMsg("Error validating coupon");
    }
  }

  function validateAddress(addr: Address) {
    const errors: ValidationErrors<Address> = {};
    if (!addr.addressLine1) errors.addressLine1 = "Required";
    if (!addr.city) errors.city = "Required";
    if (!addr.state) errors.state = "Required";
    if (!addr.country) errors.country = "Required";
    if (!addr.postalCode) errors.postalCode = "Required";
    return errors;
  }

  function validateShipping() {
    const errors = validateAddress(shippingAddress);
    setShipErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function validateBilling() {
    const errors = validateAddress(billing);
    setBillErrors(errors);
    return Object.keys(errors).length === 0;
  }

  if (placed) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-[#FAFAFA] text-black font-sans">
        <m.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center max-w-lg w-full border border-gray-100"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-extrabold mb-3 tracking-tight text-gray-900">Order Placed!</h2>
          <p className="text-gray-500 mb-8 text-lg">Thank you for your purchase. Your order is confirmed.</p>

          {createdOrderId && (
            <div
              onClick={() => {
                copyToClipboard(createdOrderId);
                // toast.success("Order ID copied!"); // If you had toast
                // Simple visual feedback could be state based, but for now just copy
                const el = document.getElementById("copy-icon-feedback");
                if (el) {
                  el.style.color = "green";
                  setTimeout(() => {
                    if (el) el.style.color = "gray";
                  }, 1000);
                }
              }}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-8 relative overflow-hidden group cursor-pointer hover:bg-gray-100 transition-colors"
              title="Click to copy Order ID"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-black group-hover:h-[80%] transition-all duration-500" />
              <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-widest">Order ID</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-mono font-bold text-gray-900 tracking-wider">
                  {createdOrderId}
                </span>
                <Copy id="copy-icon-feedback" className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
              </div>
              <p className="text-xs text-gray-400 mt-2">Click to copy ID to track your shipment</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => router.push("/")}
              className="w-full py-3.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
            >
              Back to Home
            </button>
            <button
              onClick={() => router.push(createdOrderId ? `/track-order?id=${createdOrderId}` : "/profile?tab=orders")}
              className="w-full py-3.5 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 shadow-md"
            >
              {createdOrderId ? "Track Order" : "View Orders"}
            </button>
          </div>
        </m.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-black pb-20">
      <div className="max-w-7xl mx-auto pt-6 px-4 md:px-6 lg:px-8">

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
        >
          {/* LEFT SIDE — FORM SECTIONS */}
          <div className="lg:col-span-8 space-y-8">
            <div className="text-center md:text-left mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mb-4">
                <CheckCircle className="w-3.5 h-3.5" />
                Secure Checkout
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 mb-2">
                Checkout
              </h1>
              <p className="text-gray-500 font-medium">
                Complete your order by providing your payment details.
              </p>
            </div>

            {/* SHIPPING */}
            <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
                  <p className="text-sm text-gray-500">Where should we detect your order?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Address Line 1"
                  name="addressLine1"
                  placeholder="Street, house number"
                  value={shippingAddress.addressLine1}
                  onChange={handleShipChange}
                  error={shipErrors.addressLine1}
                  className="md:col-span-2"
                />
                <Input
                  label="Address Line 2 (Optional)"
                  name="addressLine2"
                  placeholder="Apartment, suite, etc."
                  value={shippingAddress.addressLine2 ?? ""}
                  onChange={handleShipChange}
                  className="md:col-span-2"
                />
                <Input
                  label="City"
                  name="city"
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={handleShipChange}
                  error={shipErrors.city}
                />
                <Input
                  label="State / Province"
                  name="state"
                  placeholder="State"
                  value={shippingAddress.state}
                  onChange={handleShipChange}
                  error={shipErrors.state}
                />
                <CountrySelect
                  label="Country"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleShipChange}
                  error={shipErrors.country}
                />
                <Input
                  label="Postal Code"
                  name="postalCode"
                  placeholder="ZIP Code"
                  value={shippingAddress.postalCode}
                  onChange={handleShipChange}
                  error={shipErrors.postalCode}
                />
              </div>
            </section>

            {/* BILLING */}
            <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Billing Address</h2>
                    <p className="text-sm text-gray-500">Matches your payment method</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors group">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${sameAsShipping ? "bg-black border-black" : "border-gray-300 bg-white"}`}>
                    {sameAsShipping && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={() => setSameAsShipping(!sameAsShipping)}
                    className="hidden"
                  />
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-black">Same as shipping address</span>
                </label>
              </div>

              <AnimatePresence>
                {!sameAsShipping && (
                  <m.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-5 overflow-hidden"
                  >
                    <Input
                      label="Address Line 1"
                      name="addressLine1"
                      placeholder="Street address"
                      value={billing.addressLine1}
                      onChange={handleBillChange}
                      error={billErrors.addressLine1}
                      className="md:col-span-2"
                    />
                    <Input
                      label="Address Line 2"
                      placeholder="Apartment, suite, etc."
                      name="addressLine2"
                      value={billing.addressLine2 ?? ""}
                      onChange={handleBillChange}
                      className="md:col-span-2"
                    />
                    <Input
                      label="City"
                      name="city"
                      value={billing.city}
                      onChange={handleBillChange}
                      error={billErrors.city}
                    />
                    <Input
                      label="State"
                      name="state"
                      value={billing.state}
                      onChange={handleBillChange}
                      error={billErrors.state}
                    />
                    <CountrySelect
                      label="Country"
                      name="country"
                      value={billing.country}
                      onChange={handleBillChange}
                      error={billErrors.country}
                    />
                    <Input
                      label="Postal Code"
                      name="postalCode"
                      value={billing.postalCode}
                      onChange={handleBillChange}
                      error={billErrors.postalCode}
                    />
                  </m.div>
                )}
              </AnimatePresence>
            </section>

            {/* PAYMENT */}
            <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                  <p className="text-sm text-gray-500">Secure encrypted transaction</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <MethodButton
                  active={payment.method === "card"}
                  label="Credit / Debit Card"
                  subLabel="Pay securely with card"
                  icon={<CreditCard className="w-6 h-6" />}
                  onClick={() => setPayment({ ...payment, method: "card" })}
                />
                <MethodButton
                  active={payment.method === "cod"}
                  label="Cash on Delivery"
                  subLabel="Pay when you receive"
                  icon={<Truck className="w-6 h-6" />}
                  onClick={() => setPayment({ ...payment, method: "cod" })}
                />
              </div>

              <AnimatePresence mode="wait">
                {payment.method === "card" && (
                  <m.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 bg-gray-50 rounded-2xl border border-gray-100"
                  >
                    <Input
                      label="Card Number"
                      name="cardNumber"
                      placeholder="0000 0000 0000 0000"
                      value={payment.cardNumber}
                      onChange={handlePayChange}
                      error={payErrors.cardNumber}
                      className="md:col-span-2"
                      icon={<CreditCard className="w-4 h-4 text-gray-400" />}
                    />
                    <Input
                      label="Card Holder Name"
                      name="cardName"
                      placeholder="Name on card"
                      value={payment.cardName}
                      onChange={handlePayChange}
                      error={payErrors.cardName}
                      className="md:col-span-2"
                    />
                    <Input
                      label="Expiry Date"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={payment.expiryDate}
                      onChange={handlePayChange}
                      error={payErrors.expiryDate}
                    />
                    <Input
                      label="CVV"
                      type="password"
                      name="cvv"
                      placeholder="123"
                      value={payment.cvv}
                      onChange={handlePayChange}
                      error={payErrors.cvv}
                    />
                  </m.div>
                )}
              </AnimatePresence>
            </section>
          </div>

          {/* RIGHT SIDE — ORDER SUMMARY */}
          <div className="lg:col-span-4 pl-0 lg:pl-4">
            <aside className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8 sticky top-28">
              <h2 className="text-xl font-bold mb-6 tracking-tight text-gray-900 border-b border-gray-100 pb-4">
                Order Summary
              </h2>

              <div className="max-h-[350px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {Array.isArray(cart) && cart.length > 0 ? (
                  cart.map((it) => (
                    <div key={it._id} className="flex gap-4 group">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                        {it.image ? (
                          <Image src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${it.image}`} alt={it.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">{it.title}</h3>
                          <p className="font-bold text-sm text-gray-900">₹{(it.discountedPrice * it.quantity).toFixed(0)}</p>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{it.brandName}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-0.5 border border-gray-200">
                            <button
                              onClick={() => decreaseQty(it)}
                              disabled={it.quantity <= 1}
                              className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white text-gray-500 hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-semibold w-4 text-center">{it.quantity}</span>
                            <button
                              onClick={() => increaseQty(it)}
                              disabled={it.quantity >= 10}
                              className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white text-gray-500 hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button onClick={() => removeFromCart(it)} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">Your cart is empty</div>
                )}
              </div>

              {/* COUPON */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex gap-2 mb-4">
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    placeholder="Promo Code"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-black transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponMsg && (
                  <div className={`text-xs font-semibold mb-4 px-3 py-2 rounded-lg flex items-center gap-2 ${couponMsg.startsWith("✓") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    <m.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      {couponMsg.startsWith("✓") ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    </m.span>
                    {couponMsg.replace("✓ ", "")}
                  </div>
                )}
              </div>

              {/* TOTALS */}
              <div className="space-y-3 pb-6 border-b border-gray-100">
                <Row label="Subtotal" value={`₹${subtotal.toFixed(2)}`} />
                {discountAmount > 0 && <Row label="Discount" value={`-₹${discountAmount.toFixed(2)}`} highlightClass="text-green-600" />}
                {couponApplied > 0 && <Row label="Coupon" value={`-₹${couponApplied.toFixed(2)}`} highlightClass="text-green-600" />}
                <Row label="Shipping" value={shipping === 0 ? "Free" : `₹${shipping}`} highlightClass={shipping === 0 ? "text-green-600" : ""} />
              </div>

              <div className="flex justify-between items-center py-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-gray-900 tracking-tight">₹{total.toFixed(2)}</span>
              </div>

              {apiError && (
                <div className="flex bg-red-50 border border-red-100 p-4 rounded-xl mb-4 gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700 font-medium">{apiError}</p>
                </div>
              )}

              <button
                disabled={loading || cart.length === 0}
                onClick={placeOrder}
                className="w-full bg-black text-white h-14 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group cursor-pointer"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Pay Securely</span>
                    <m.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                      <Truck className="w-5 h-5" />
                    </m.span>
                  </>
                )}
              </button>
              <div className="text-center mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
                <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> SSL Secured</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span>Money Back Guarantee</span>
              </div>
            </aside>
          </div>

        </m.div>
      </div>
    </main>
  );
}

/* ------------------ SUB COMPONENTS ------------------ */

export function CountrySelect({ label, name, value, onChange, error }: Props) {
  const handleValueChange = (val: string) => {
    onChange({
      target: { name, value: val },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">{label}</label>
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className={`w-full h-12 bg-white border rounded-xl px-4 text-sm font-medium transition-all ${error ? "border-red-300 ring-2 ring-red-50" : "border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-black/5 focus:border-black"}`}>
          <SelectValue placeholder="Select Country" />
        </SelectTrigger>
        <SelectContent className="max-h-60 rounded-xl shadow-xl border-gray-100">
          {countries.map((country) => (
            <SelectItem key={country} value={country} className="cursor-pointer focus:bg-gray-50 py-3">{country}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-red-500 font-medium ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
    </div>
  );
}

function Input({ label, name, value, onChange, error, type = "text", placeholder, className, icon }: any) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">{icon}</div>}
        <input
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          className={`w-full h-12 bg-white border rounded-xl px-4 text-sm font-medium outline-none transition-all placeholder:text-gray-400
                 ${icon ? "pl-11" : ""}
                 ${error
              ? "border-red-300 ring-2 ring-red-50 focus:border-red-500"
              : "border-gray-200 hover:border-gray-300 focus:border-black focus:ring-4 focus:ring-black/5"
            }
              `}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-medium ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
    </div>
  );
}

function MethodButton({ active, onClick, label, icon, subLabel }: any) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-start gap-3 p-5 rounded-2xl border-2 transition-all duration-200 w-full text-left cursor-pointer group
        ${active
          ? "border-black bg-gray-50 shadow-md ring-1 ring-black/5"
          : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm"
        }
      `}
    >
      <div className={`p-2 rounded-full transition-colors ${active ? "bg-black text-white" : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"}`}>
        {icon}
      </div>
      <div>
        <p className={`font-bold text-sm ${active ? "text-black" : "text-gray-700"}`}>{label}</p>
        <p className="text-xs text-gray-400 mt-0.5 font-medium">{subLabel}</p>
      </div>
      {active && (
        <div className="absolute top-4 right-4 text-black">
          <CheckCircle className="w-5 h-5 fill-black text-white" />
        </div>
      )}
    </button>
  );
}

function Row({ label, value, highlightClass }: any) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className={`font-bold ${highlightClass || "text-gray-900"}`}>{value}</span>
    </div>
  );
}
