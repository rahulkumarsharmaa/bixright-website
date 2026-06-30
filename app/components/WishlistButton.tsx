"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/app/context/WishlistContext";
import React from "react";

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: number;
}

export default function WishlistButton({ productId, className, size = 12 }: WishlistButtonProps) {
  const { isInWishlist, addWishlist, removeWishlist } = useWishlist();

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(productId)) {
      await removeWishlist(productId);
    } else {
      await addWishlist({ productId });
    }
  };

  const active = isInWishlist(productId);

  return (
    <button
      onClick={toggleWishlist}
      className={className || `w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-brand/10 flex items-center justify-center transition-all ${active ? 'bg-red-50 text-red-500 border-red-200 hover:scale-105 active:scale-95 shadow-xs' : 'bg-brand/10 text-brand hover:bg-brand hover:text-brand-light'}`}
      title="Add to wishlist"
    >
      <Heart size={size} className={`${active ? 'fill-current text-red-500' : ''}`} />
    </button>
  );
}
