"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { m } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import { useWishlist } from "@/app/context/WishlistContext";

interface ProductImage {
  imageUrl: string;
  imageId: string;
  isCover: boolean;
  sortOrder: number;
  _id: string;
}

interface ProductItem {
  _id: string;
  title: string;
  subTitle: string;
  basePrice: number;
  discountedPrice: number;
  discount: number;
  subCategoryName: string;
  images: ProductImage[];
}

export default function RecentlyAddedProducts() {
  const { isInWishlist, addWishlist, removeWishlist } = useWishlist();

  const toggleWishlist = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(productId)) {
      await removeWishlist(productId);
    } else {
      await addWishlist({ productId });
    }
  };

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/product/get-recently-added-products?page=1&limit=8`,
          { cache: "no-store" } // Increase limit slightly to fill grid
        );

        const json: { success: boolean; data: ProductItem[] } =
          await res.json();

        if (json.success) setProducts(json.data);
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    };

    fetchNewProducts();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between mb-8 px-1">
        <div>
          <h2 className="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-1">
            Smart Electronics & Premium Accessories
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 capitalize font-semibold">Top gadgets at the best prices</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mt-4">
        {loading &&
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-brand/3 border border-brand/10 rounded-2xl lg:rounded-4xl p-3 md:p-4 shadow-sm animate-pulse">
              <div className="bg-brand/10 aspect-square rounded-xl md:rounded-2xl mb-4 w-full"></div>
              <div className="h-3.5 bg-brand/10 rounded-full w-3/4 mb-2"></div>
              <div className="h-3.5 bg-brand/10 rounded-full w-1/2"></div>
              <div className="h-8 bg-brand/10 rounded-full w-full mt-4"></div>
            </div>
          ))}

        {!loading &&
          products.slice(0, 8).map((product, index) => {
            const cover = product.images.find((img) => img && img.isCover);

            return (
              <m.div
                key={product._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group bg-brand/3 hover:bg-brand/5 border border-brand/10 hover:border-brand/30 hover:shadow-md rounded-2xl sm:rounded-3xl p-3 transition-all duration-300 flex flex-col h-full"
              >
                <Link
                  href={`/product/${product._id}?categoryName=${product.subCategoryName}&subCategoryName=${product.subCategoryName}`}
                  className="flex flex-col h-full"
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-white overflow-hidden mb-3.5 rounded-xl sm:rounded-2xl flex-shrink-0 flex items-center justify-center">
                    {cover ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${cover.imageUrl}`}
                        alt={product.title}
                        fill
                          className="object-contain group-hover:scale-102 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-brand/5 flex items-center justify-center text-brand/40 text-xs">
                        No Image
                      </div>
                    )}

                    {product.discount > 0 && (
                      <span className="absolute top-2 left-2 bg-brand text-brand-light text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm">
                        -{product.discount}%
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col px-0.5">
                    <p className="text-[10px] text-brand/50 font-bold uppercase tracking-wider mb-1">
                      {product.subCategoryName}
                    </p>
                    <h3 className="text-brand/90 font-bold text-xs sm:text-sm md:text-base leading-snug line-clamp-2 mb-3 group-hover:text-brand transition-colors capitalize min-h-[2.2rem] sm:min-h-[2.5rem]" title={product.title}>
                      {product.title}
                    </h3>

                    {/* Price Block */}
                    <div className="mt-auto pt-3 border-t border-brand/5 flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-sm sm:text-base md:text-lg font-extrabold text-brand">₹{product.discountedPrice.toFixed(2)}</span>
                        {product.discountedPrice < product.basePrice && (
                          <span className="text-[10px] sm:text-xs text-brand/40 line-through">₹{product.basePrice.toFixed(2)}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => toggleWishlist(e, product._id)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-brand/10 flex items-center justify-center transition-all ${isInWishlist(product._id) ? 'bg-red-50 text-red-500 border-red-200 hover:scale-105 active:scale-95 shadow-xs' : 'bg-brand/10 text-brand hover:bg-brand hover:text-brand-light'}`}
                        title="Add to wishlist"
                      >
                        <Heart size={12} className={`sm:w-3.5 sm:h-3.5 ${isInWishlist(product._id) ? 'fill-current text-red-500' : ''}`} />
                      </button>
                    </div>
                  </div>
                </Link>
              </m.div>
            );
          })}
      </div>
    </>
  );
}
