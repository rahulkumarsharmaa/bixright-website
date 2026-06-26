"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { toast } from "sonner";

export type WishlistItem = {
  _id: string;
  productId: string;
  variantId?: string;
  title: string;
  image: string;
  price: number;
  basePrice?: number;
  discountedPrice?: number;
  discount?: number;
  color?: string;
  size?: string;
  brandName?: string;
  subTitle?: string;
  categoryName:string;
  subCategoryName:string;
};

export type AddWishlistRequest = {
  productId: string;
};

type WishlistContextType = {
  items: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  addWishlist: (body: AddWishlistRequest) => Promise<void>;
  removeWishlist: (productId: string) => Promise<void>;
  fetchWishlist: () => Promise<void>;
  wishlistItemCount: number;
};

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const wishlistItemCount = items.length;

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchWishlist = useCallback(async (): Promise<void> => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wishlist/get-wishlist`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch wishlist");
      }

      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.wishlist || [];
      setItems(list);
    } catch (err: unknown) {
      toast.error("Failed to load wishlist. Please try again.");
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = (productId: string) => {
    return items.some((i) => i.productId === productId);
  };

  const addWishlist = async (body: AddWishlistRequest): Promise<void> => {
    const token = getToken();

    if (!token) {
      toast.warning("Please log in to use wishlist");
      return;
    }

    const toastId = toast.loading("Adding to wishlist...");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wishlist/add-to-wishlist`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to add");
      }

      await res.json();
      await fetchWishlist();
      toast.success("Added to wishlist!", { id: toastId });
    } catch (err: unknown) {
      toast.error("Could not add to wishlist", { id: toastId });
    }
  };

  const removeWishlist = async (productId: string): Promise<void> => {
    const token = getToken();

    if (!token) {
      toast.warning("Please log in to manage wishlist");
      return;
    }

    const toastId = toast.loading("Removing from wishlist...");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wishlist/delete-wishlist-item/${productId}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to remove");
      }

      await fetchWishlist();
      toast.success("Removed from wishlist!", { id: toastId });
    } catch (err: unknown) {
      toast.error("Failed to remove item", { id: toastId });
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        isInWishlist,
        addWishlist,
        removeWishlist,
        fetchWishlist,
        wishlistItemCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside provider");
  return ctx;
};
