"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
  startTransition,
} from "react";
import type { CartItemType } from "@/app/types/cart";
import { toast } from "sonner";

export type CartItem = CartItemType;

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  increaseQty: (item: CartItem) => Promise<void>;
  decreaseQty: (item: CartItem) => Promise<void>;
  removeFromCart: (item: CartItem) => Promise<void>;
  fetchCart: () => Promise<void>;
  cartTotalQuantity: number;
  cartItemCount: number;
  cartItems: CartItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ----------------- API Wrapper -----------------
  const api = async (url: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      ...options,
      headers,
    });

    return res.json();
  };

  // ----------------- Fetch Cart -----------------
  const fetchCart = useCallback(async () => {
    if (token) {
      try {
        const data = await api("/cart/get-cart");
        setCart(data.data || []);
      } catch (err) {
        console.log("Failed to load cart.", err);
      }
    } else {
      const stored = localStorage.getItem("cart");
      if (stored) {
        setCart(JSON.parse(stored));
      }
    }
  }, [token]);

  // useEffect(() => {
  //   startTransition(() => {
  //     fetchCart();
  //   });
  // }, [fetchCart]);

  // ----------------- Sync guest cart to localStorage -----------------
  useEffect(() => {
    if (!token) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, token]);

  // ----------------- Add To Cart -----------------
  const addToCart = useCallback(
    async (item: CartItem) => {
      // const toastId = toast.loading("Adding item...");
      if (token) {
        try {
          const { productId, quantity } = item;
          console.log("CartContext: Adding item via API", { productId, quantity, item });
          await api("/cart/add-to-cart", {
            method: "POST",
            body: JSON.stringify({ productId, quantity }),
          });
          await fetchCart();
        } catch { }
      } else {
        setCart((prev) => {
          const exists = prev.find((p) => (p.productId) === (item.productId));

          if (exists) {
            return prev.map((p) =>
              (p.productId) === (item.productId)
                ? {
                  ...p,
                  quantity: Math.min(p.quantity + item.quantity, 10),
                }
                : p
            );
          }

          return [...prev, item];
        });
      }
    },
    [token, fetchCart]
  );

  // ----------------- Increase Qty -----------------
  const increaseQty = useCallback(
    async (item: CartItem) => {
      if (token) {
        try {
          const data = await api(`/cart/update-cart`, {
            method: "PATCH",
            body: JSON.stringify({
              action: "increase",
              productId: item.productId,
            }),
          });
          console.log(data, "data");
          await fetchCart();
        } catch (err) {
          console.log(err);
        }
      } else {
        setCart((prev) =>
          prev.map((p) =>
            p.productId === item.productId
              ? { ...p, quantity: Math.min(p.quantity + 1, 10) }
              : p
          )
        );
      }
    },
    [token, fetchCart]
  );

  // ----------------- Decrease Qty -----------------
  const decreaseQty = useCallback(
    async (item: CartItem) => {
      if (token) {
        try {
          await api(`/cart/update-cart`, {
            method: "PATCH",
            body: JSON.stringify({
              action: "decrease",
              productId: item.productId,
            }),
          });
          await fetchCart();
        } catch { }
      } else {
        setCart((prev) =>
          prev.map((p) =>
            p.productId === item.productId
              ? { ...p, quantity: Math.max(p.quantity - 1, 1) }
              : p
          )
        );
      }
    },
    [token, fetchCart]
  );

  // ----------------- Remove Item -----------------

  const removeFromCart = useCallback(
    async (item: CartItem) => {
      const toastId = toast.loading("Removing...");

      if (token) {
        try {
          await api(`/cart/update-cart`, {
            method: "PATCH",
            body: JSON.stringify({
              action: "delete",
              productId: item.productId,
            }),
          });
          await fetchCart();
          toast.success("Item removed!", { id: toastId });
        } catch {
          toast.error("Failed to remove item.", { id: toastId });
        }
      } else {
        setCart((prev) => prev.filter((p) => p.productId !== item.productId));
        toast.success("Item removed!", { id: toastId });
      }
    },
    [token, fetchCart]
  );

  // ----------------- Totals -----------------
  const cartTotalQuantity = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        fetchCart,
        cartTotalQuantity,
        cartItems: cart,
        cartItemCount: cartTotalQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
