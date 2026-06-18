"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { m } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface ProductImage {
  imageUrl: string;
  isCover: boolean;
}

interface ProductItem {
  _id: string;
  title: string;
  basePrice: number;
  discountedPrice: number;
  discount: number;
  subCategoryName: string;
  images: ProductImage[];
  rating?: number; // Optional if not available
}

export default function BestSellers() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetching a different page/limit to simulate "Best Sellers"
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/product/get-recently-added-products?page=2&limit=8`,
          { cache: "no-store" }
        );
        const json = await res.json();
        if (json.success) setProducts(json.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === "left" ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-6 px-1">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Best Sellers</h2>
          <p className="text-sm text-gray-500 mt-1">Top rated electronics chosen by you</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => scroll("left")} className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 hidden md:flex"><ChevronLeft size={20} /></button>
          <button onClick={() => scroll("right")} className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 hidden md:flex"><ChevronRight size={20} /></button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="min-w-[200px] md:min-w-[240px] h-80 bg-gray-100 rounded-xl animate-pulse" />
          ))
        ) : (
          products.map((product) => {
            const cover = product.images.find(img => img.isCover) || product.images[0];
            return (
              <m.div
                key={product._id}
                className="min-w-[200px] md:min-w-[240px] snap-start"
                whileHover={{ y: -5 }}
              >
                <Link href={`/product/${product._id}`} className="block bg-white border border-gray-100 rounded-xl p-3 hover:shadow-lg transition-all h-full flex flex-col">
                  <div className="relative aspect-square mb-3 bg-gray-50 rounded-lg overflow-hidden">
                    {cover && (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${cover.imageUrl}`}
                        alt={product.title}
                        fill
                        className="object-cover object-top  hover:scale-110 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute top-2 right-2 bg-yellow-400 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      4.8 <Star size={10} fill="currentColor" />
                    </div>
                  </div>

                  <div className="mt-auto">
                    <p className="text-xs text-gray-600 font-semibold uppercase">{product.subCategoryName}</p>
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2 my-1 min-h-[40px]">{product.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-bold text-gray-900">₹{product.discountedPrice}</span>
                      {product.discountedPrice < product.basePrice && (
                        <span className="text-xs text-gray-400 line-through">₹{product.basePrice}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </m.div>
            )
          })
        )}
      </div>
    </div>
  );
}
