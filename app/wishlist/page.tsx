"use client";
import { Trash2, Heart, ArrowRight } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/app/context/WishlistContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Wishlist() {
  const { items, removeWishlist } = useWishlist();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 pt-24 md:pt-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            My Wishlist
            <span className="ml-3 text-lg font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full align-middle">
              {items.length} item{items.length !== 1 && 's'}
            </span>
          </h1>
          <button
            onClick={() => router.push('/')}
            className="hidden md:flex items-center text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm"
          >
            <div className="w-24 h-24 bg-red-50 text-red-400 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 max-w-sm text-center">
              Explore our collection and save your favorite items for later.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-8 py-3 bg-black text-white rounded-full font-semibold hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-black/20"
            >
              Start Exploring
            </button>
          </m.div>
        ) : (
          /* Wishlist Grid */
          <m.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => {
                const key = item.variantId || item._id;

                return (
                  <m.div
                    layout
                    key={key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.image}`}
                        alt={item.title}
                        fill
                        className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                      />

                      {/* Floating Actions */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          removeWishlist(item.productId);
                        }}
                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white shadow-sm transition-all duration-200 z-10"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Overlay Button */}
                      <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        <Link
                          href={`/product/${item.productId}`}
                          className="flex items-center justify-center w-full py-3 bg-white text-black font-bold text-sm rounded-xl shadow-lg hover:bg-black hover:text-white transition-colors"
                        >
                          View Product <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="mb-2">
                        {item.categoryName && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1 block">
                            {item.categoryName}
                          </span>
                        )}
                        <Link
                          href={`/product/${item.productId}`}
                          className="text-base font-bold text-gray-900 hover:text-gray-600 transition-colors line-clamp-1 block"
                        >
                          {item.title}
                        </Link>
                        {item.subTitle && (
                          <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{item.subTitle}</p>
                        )}
                      </div>

                      <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500 font-medium">
                        <div className="flex gap-2">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && item.size && <span>•</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                      </div>
                    </div>
                  </m.div>
                );
              })}
            </AnimatePresence>
          </m.div>
        )
        }
      </div>
    </div>
  );
}
