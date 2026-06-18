"use client";

import { useState, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { toast } from "sonner";

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
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 text-black p-6">
      <m.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 relative"
      >
        <AnimatePresence>
          {error && (
            <m.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute w-80 top-3 left-1/2 -translate-x-1/2 bg-red-500 text-center text-white text-sm px-4 py-2 rounded-lg shadow-lg"
            >
              {error}
            </m.div>
          )}
        </AnimatePresence>

        <h2 className="text-2xl font-semibold text-center mb-6 mt-6">
          Welcome Back
        </h2>

        <div className="mb-4">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onKeyDown={handleKeyPress}
            className="w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Password</label>
          <div className="relative mt-1">
            <input
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={handleKeyPress}
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-1 focus:ring-black pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-600"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-2 bg-black text-white rounded-lg text-sm font-semibold transition cursor-pointer ${loading ? "opacity-50 " : "hover:opacity-90"
            }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <p className="text-center text-sm text-gray-700">
          Don’t have an account?{" "}
          <Link href="/user/signup" className="font-semibold hover:underline">
            Create Account
          </Link>
        </p>
      </m.div>
    </div>
  );
}
