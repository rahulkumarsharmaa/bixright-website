"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { m } from "framer-motion";
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-1">
            Shop Smart Electronics & Premium Accessories
          </h2>
          <p className="text-sm text-gray-500">Top gadgets at the best prices</p>
        </div>
        {/* <Link href="/products" className="hidden md:block text-sm font-bold text-gray-600 hover:text-gray-700 transition">
          View All Products
        </Link> */}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-4">
        {loading &&
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-4 w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
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
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <Link
                  href={`/product/${product._id}?categoryName=${product.subCategoryName}&subCategoryName=${product.subCategoryName}`}
                  className="block relative p-3"
                >
                  <div className="relative aspect-[4/5] md:aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3">
                    {cover ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${cover.imageUrl}`}
                        alt={product.title}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}

                    {product.discount > 0 && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                        -{product.discount}%
                      </span>
                    )}
                  </div>

                  <div className="px-1">
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1">
                      {product.subCategoryName}
                    </p>
                    <h3 className="text-gray-900 font-bold text-sm md:text-base leading-snug line-clamp-2 mb-2 min-h-[2.5rem]">
                      {product.title}
                    </h3>

                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <span className="text-lg font-bold text-gray-900">₹{product.discountedPrice}</span>
                        {product.discountedPrice < product.basePrice && (
                          <span className="text-xs text-gray-400 line-through ml-2">₹{product.basePrice}</span>
                        )}
                      </div>
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
