"use client";
import { useState } from "react";
import { Trash2, Heart, ArrowRight, ShoppingCart, Loader2, Sparkles } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/app/context/WishlistContext";
import { useCart } from "@/app/context/CartContext";
import { CartItemType } from "@/app/types/cart";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

export default function Wishlist() {
  const { items, removeWishlist } = useWishlist();
  const { addToCart } = useCart();
  const router = useRouter();

  const [addingMap, setAddingMap] = useState<Record<string, boolean>>({});
  const [movingAll, setMovingAll] = useState(false);

  const handleAddToCart = async (item: any) => {
    const key = item.productId;
    setAddingMap((prev) => ({ ...prev, [key]: true }));
    try {
      const cartItem: CartItemType = {
        productId: item.productId,
        _id: item.productId,
        title: item.title,
        price: item.basePrice ?? item.price ?? 0,
        discountedPrice: item.discountedPrice ?? item.price ?? 0,
        images: [{ imageUrl: item.image, imageId: "", isCover: true, sortOrder: 0, _id: "" }],
        brandName: item.brandName ?? "",
        subTitle: item.subTitle ?? "",
        stock: 99,
        variantId: item.variantId,
        color: item.color ?? "",
        size: item.size ?? "",
        quantity: 1,
        image: item.image,
      };
      await addToCart(cartItem);
      toast.success(`${item.title} added to cart!`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add item to cart.");
    } finally {
      setAddingMap((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleMoveAllToCart = async () => {
    if (items.length === 0) return;
    setMovingAll(true);
    let successCount = 0;

    for (const item of items) {
      try {
        const cartItem: CartItemType = {
          productId: item.productId,
          _id: item.productId,
          title: item.title,
          price: item.basePrice ?? item.price ?? 0,
          discountedPrice: item.discountedPrice ?? item.price ?? 0,
          images: [{ imageUrl: item.image, imageId: "", isCover: true, sortOrder: 0, _id: "" }],
          brandName: item.brandName ?? "",
          subTitle: item.subTitle ?? "",
          stock: 99,
          variantId: item.variantId,
          color: item.color ?? "",
          size: item.size ?? "",
          quantity: 1,
          image: item.image,
        };
        await addToCart(cartItem);
        successCount++;
      } catch (error) {
        console.error("Error moving item to cart:", item.title, error);
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully moved ${successCount} item(s) to cart!`);
    } else {
      toast.error("Failed to move items to cart.");
    }
    setMovingAll(false);
  };

  return (
    <div className="min-h-screen bg-brand-light text-brand py-12 px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 relative overflow-hidden font-sans">

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 md:mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-brand tracking-tight flex items-center gap-3">
              My Wishlist
              <span className="text-sm font-bold text-brand/60 bg-brand/5 border border-brand/10 px-3 py-1 rounded-full">
                {items.length} item{items.length !== 1 && 's'}
              </span>
            </h1>
            <p className="text-sm text-brand/60 font-semibold mt-1">Keep track of products you love and purchase them directly.</p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            {items.length > 0 && (
              <button
                onClick={handleMoveAllToCart}
                disabled={movingAll}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand/90 text-brand-light font-bold text-sm rounded-full disabled:bg-brand/35 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                {movingAll ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {movingAll ? "Moving All..." : "Move All to Cart"}
              </button>
            )}

            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-brand/5 hover:bg-brand/10 border border-brand/20 text-brand font-semibold text-sm rounded-full transition-all active:scale-95 cursor-pointer"
            >
              Continue Shopping &rarr;
            </button>
          </div>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 bg-brand/5 rounded-3xl border border-dashed border-brand/20 shadow-sm"
          >
            <div className="w-20 h-20 bg-brand/10 text-brand rounded-full flex items-center justify-center mb-6 relative">
              <span className="absolute inset-0 rounded-full bg-brand/10 animate-ping opacity-25"></span>
              <Heart className="w-8 h-8 fill-current" />
            </div>
            <h2 className="text-2xl font-bold text-brand mb-2">Your wishlist is empty</h2>
            <p className="text-brand/60 mb-8 max-w-xs text-center text-sm font-semibold leading-relaxed">
              Explore our collection and save your favorite electronics items for later.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-8 py-3.5 bg-brand hover:bg-brand/90 text-brand-light rounded-full font-bold transition-all duration-200 shadow-sm cursor-pointer"
            >
              Start Exploring
            </button>
          </m.div>
        ) : (
          /* Wishlist Grid */
          <m.div
            layout
            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => {
                const key = item.variantId || item._id;

                return (
                  <m.div
                    layout
                    key={key}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-brand/5 rounded-2xl sm:rounded-4xl border border-brand/10 shadow-sm hover:shadow-md hover:border-brand/35 transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-square overflow-hidden bg-white p-4 flex items-center justify-center border-b border-brand/10">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.image}`}
                        alt={item.title}
                        fill
                        className="object-contain p-2 group-hover:scale-102 transition-transform duration-500"
                      />

                      {/* Floating Actions */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          removeWishlist(item.productId);
                        }}
                        className="absolute top-3 right-3 p-2.5 bg-brand-light/90 backdrop-blur-xs rounded-full text-brand/50 hover:text-red-500 hover:bg-brand-light hover:scale-110 active:scale-95 shadow-sm hover:shadow-md transition-all duration-200 z-10 border border-brand/10 cursor-pointer"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Overlay Button */}
                      <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-10">
                        <Link
                          href={`/product/${item.productId}`}
                          className="flex items-center justify-center w-full py-2.5 bg-brand hover:bg-brand/90 text-brand-light font-bold text-xs rounded-full shadow-sm transition-colors"
                        >
                          View Details <ArrowRight className="w-4 h-4 ml-1.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-4 md:p-5 flex-1 flex flex-col justify-between">
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1.5">
                          {item.categoryName && (
                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-brand/50">
                              {item.categoryName}
                            </span>
                          )}
                          <div className="flex items-center gap-1.5 text-[10px] text-brand/50 font-semibold uppercase">
                            {item.size && <span>{item.size}</span>}
                            {item.color && item.size && <span>•</span>}
                            {item.color && <span>{item.color}</span>}
                          </div>
                        </div>
                        <Link
                          href={`/product/${item.productId}`}
                          className="text-sm md:text-base font-bold text-brand hover:text-brand/70 transition-colors line-clamp-2 block leading-tight min-h-[2.5rem]"
                        >
                          {item.title}
                        </Link>
                        {item.subTitle && (
                          <p className="text-xs text-brand/60 font-semibold line-clamp-1 mt-1 leading-snug">{item.subTitle}</p>
                        )}
                      </div>

                      {/* Price & Add to Cart button */}
                      <div className="mt-auto pt-3 border-t border-brand/10 flex flex-col gap-3">
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs font-semibold text-brand/50">Price</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-base md:text-lg font-black text-brand">
                              ₹{(item.discountedPrice !== undefined ? item.discountedPrice : (item.price ?? 0)).toLocaleString()}
                            </span>
                            {item.basePrice && item.discountedPrice && item.discountedPrice < item.basePrice && (
                              <span className="text-xs text-brand/40 line-through">
                                ₹{item.basePrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(item);
                          }}
                          disabled={addingMap[item.productId]}
                          className="w-full h-11 bg-brand hover:bg-brand/90 text-brand-light disabled:bg-brand/30 font-bold text-xs rounded-4xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm hover:shadow-md cursor-pointer"
                        >
                          {addingMap[item.productId] ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <ShoppingCart className="w-3.5 h-3.5" />
                          )}
                          {addingMap[item.productId] ? "Adding to Cart..." : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </m.div>
                );
              })}
            </AnimatePresence>
          </m.div>
        )}
      </div>
    </div>
  );
}
