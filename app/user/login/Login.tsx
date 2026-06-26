"use client";

import { useState, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { useSite } from "@/app/context/siteSetting";
import { toast } from "sonner";
import { Mail, Lock, ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import LogoImage from "@/public/assets/Bixright.png";

interface CartItem {
  productId: string;
  quantity: number;
  variantId?: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
}

export default function Login() {
  const { fetchCart, cart } = useCart();
  const { fetchWishlist } = useWishlist();
  const { siteData } = useSite();
  const router = useRouter();
  const searchparams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    email: searchparams.get("email") || "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const safeRedirect = (url: string | null): string => {
    if (!url || typeof url !== "string") return "/";

    const cleaned = url.trim();

    // URLs we should NEVER redirect back to
    const blocked = ["/user/login", "/user/signup"];

    // Do NOT block /checkout
    if (
      blocked.includes(cleaned) ||
      blocked.some((r) => cleaned.startsWith(r))
    ) {
      return "/";
    }

    // Must start with "/" to be safe
    if (!cleaned.startsWith("/")) return "/";

    return cleaned;
  };

  async function syncCartItems(
    cartItems: CartItem[],
    token: string
  ): Promise<void> {
    if (cartItems.length === 0) return;

    for (const item of cartItems) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/add-to-cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(item),
        }
      );

      const data: { success: boolean; message?: string } = await res.json();

      if (data.success) {
        localStorage.removeItem("cart");
      }
    }
  }

  const handleSubmit = async (): Promise<void> => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customer/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const json: LoginResponse = await res.json();

      if (!res.ok || !json.success) {
        setLoading(false);
        const msg = json.message || "Invalid credentials";
        setError(msg);
        return;
      }

      const token = json.token || "";
      localStorage.setItem("token", token);

      await syncCartItems(cart, token);

      fetchCart();
      fetchWishlist();

      setLoading(false);

      const prevUrl = sessionStorage.getItem("prev-url");
      router.push(safeRedirect(prevUrl));
    } catch {
      setLoading(false);
      setError("Something went wrong. Try again.");
      toast.error("Something went wrong. Try again.");
    }
  };

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 3000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      if (!form.password.trim()) {
        passwordRef.current?.focus();
        return;
      }
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-brand-light text-brand p-4 relative">

      {/* Back button */}
      <div className="absolute top-6 left-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand/80 hover:text-brand transition-colors group">
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Store
        </Link>
      </div>

      <m.div
        initial={{ opacity: 0, y: 12, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm bg-brand/5 backdrop-blur-md rounded-3xl shadow-sm p-8 border border-brand/10 relative animate-fade-in"
      >
        <AnimatePresence>
          {error && (
            <m.div
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute w-[calc(100%-3rem)] top-3 left-6 bg-red-500 text-center text-white text-xs px-4 py-2 rounded-4xl shadow-md z-20 font-medium"
            >
              {error}
            </m.div>
          )}
        </AnimatePresence>

        {/* Dynamic Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/">
            <Image
              src={siteData?.logoUrl ? (
                siteData.logoUrl.startsWith("http")
                  ? siteData.logoUrl
                  : `${process.env.NEXT_PUBLIC_IMAGE_URL || ""}${siteData.logoUrl.startsWith("/") ? "" : "/"}${siteData.logoUrl}`
              ) : LogoImage}
              alt={siteData?.siteName || "Bixright"}
              width={120}
              height={36}
              className="h-8 w-auto object-contain"
            />
          </Link>
        </div>

        <h2 className="text-lg font-bold text-center text-brand tracking-tight mb-5">
          Welcome Back
        </h2>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-bold text-brand/80 capitalize tracking-wider ml-1">Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onKeyDown={handleKeyPress}
              placeholder="name@example.com"
              className="w-full h-11 px-6 border border-brand/10 hover:border-brand/30 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-4xl outline-none text-xs placeholder:text-brand/40 text-brand transition-all bg-brand-light"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-bold text-brand/80 capitalize tracking-wider ml-1">Password</label>
            <div className="relative">
              <input
                ref={passwordRef}
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={handleKeyPress}
                placeholder="••••••••"
                className="w-full h-11 px-6 border border-brand/10 hover:border-brand/30 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-4xl outline-none text-xs placeholder:text-brand/40 text-brand transition-all bg-brand-light pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand/50 hover:text-brand transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-11 bg-brand hover:bg-brand/90 text-brand-light rounded-4xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-6"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Logging in...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </div>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-brand/30" />
          <span className="text-brand text-[10px] font-bold tracking-wider uppercase">OR</span>
          <div className="flex-1 h-px bg-brand/30" />
        </div>

        <p className="text-center text-xs text-brand/80">
          Don’t have an account?{" "}
          <Link href="/user/signup" className="text-brand font-bold hover:underline">
            Create Account
          </Link>
        </p>
      </m.div>
    </div>
  );
}
