"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { m } from "framer-motion";
import { TrendingUp, ArrowRight, Star, ShoppingBag, Flame } from "lucide-react";

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
  rating?: number; // Added optional rating for UI
}

export default function TrendingItems() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/product/get-recently-added-products?page=3&limit=4`,
          { cache: "no-store" }
        );
        const json = await res.json();
        if (json.success) setProducts(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-0 md:py-16 overflow-hidden">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8 px-4 gap-4">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
          Trending <span className="text-brand">Products</span>
        </h2>
        <Link href="/category/all" className="group flex items-center gap-1.5 text-xs md:text-sm font-bold text-gray-900 border-b-2 border-transparent hover:border-black transition-all pb-0.5 whitespace-nowrap shrink-0">
          Explore <span className="hidden sm:inline">Collection</span> <ArrowRight className="group-hover:translate-x-1 transition-transform" size={14} />
        </Link>
      </div>

      {loading ? (
        // Skeleton Loader
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 min-h-[500px] animate-pulse">
          {/* Large Item Skeleton */}
          <div className="lg:col-span-5 bg-brand/10 rounded-2xl lg:rounded-4xl h-[300px] sm:h-[400px] lg:h-auto w-full"></div>

          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Wide Item Skeleton */}
            <div className="bg-brand/10 rounded-2xl lg:rounded-4xl h-[200px] sm:h-[250px] w-full"></div>
            {/* Bottom Row Skeletons */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 flex-1">
              <div className="bg-brand/10 rounded-2xl lg:rounded-4xl h-[180px] w-full"></div>
              <div className="bg-brand/10 rounded-2xl lg:rounded-4xl h-[180px] w-full"></div>
            </div>
          </div>
        </div>
      ) : (
        /* Main Grid Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:min-h-[400px]">

          {/* Large Featured Item (Left) */}
          {products[0] && (
            <m.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 relative group flex flex-col"
            >
              <Link
                href={`/product/${products[0]._id}`}
                className="flex-1 bg-brand/3 rounded-2xl lg:rounded-4xl border border-brand/10 overflow-hidden relative transition-colors duration-300 hover:bg-brand/3 hover:text-brand flex flex-col justify-between"
              >
                {/* Background Gradient Blob */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative aspect-square w-full bg-white overflow-hidden flex-shrink-0">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${products[0].images.find(img => img.isCover)?.imageUrl || products[0].images[0]?.imageUrl}`}
                    alt={products[0].title}
                    fill
                    className="object-contain group-hover:scale-102 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4 bg-brand text-brand-light text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full z-10">
                    #1 Best Seller
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-3.5 border-t border-brand/10">
                  <h3 className="text-sm sm:text-base md:text-2xl font-bold text-brand/90 line-clamp-1 md:line-clamp-2 group-hover:text-brand transition-colors">{products[0].title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5 md:gap-2">
                      <span className="text-base sm:text-lg md:text-3xl font-black text-brand">₹{products[0].discountedPrice}</span>
                      {products[0].discountedPrice < products[0].basePrice && (
                        <span className="text-[10px] sm:text-xs md:text-sm text-brand/50 line-through decoration-red-500/50">₹{products[0].basePrice}</span>
                      )}
                    </div>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-brand/10 flex items-center justify-center group-hover:bg-brand group-hover:text-brand-light transition-all">
                      <ArrowRight size={12} className="sm:w-3.5 sm:h-3.5" />
                    </div>
                    
                  </div>
                </div>
              </Link>
            </m.div>
          )}

          {/* Right Side Stack */}
          <div className="lg:col-span-7 flex flex-col gap-6">

            {/* Bottom Row of 2 Small Items */}
            <div className="lg:flex-1 grid grid-cols-2 gap-4 md:gap-6">
              {[products[2], products[1]].filter(Boolean).map((item, i) => (
                <m.div
                  key={item._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  className="group"
                >
                  <Link href={`/product/${item._id}`} className="h-full bg-brand/3 rounded-2xl lg:rounded-4xl border border-brand/10 overflow-hidden relative transition-colors duration-300 hover:bg-brand/3 hover:text-brand flex flex-col justify-between">
                    <div className="relative aspect-square bg-white overflow-hidden flex-shrink-0">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.images.find(img => img.isCover)?.imageUrl || item.images[0]?.imageUrl}`}
                        alt={item.title}
                        fill
                        className="object-contain group-hover:scale-102 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow justify-between gap-1.5">
                      <div>
                        <h4 className="font-bold text-brand/90 text-xs sm:text-base line-clamp-1 mb-0.5 group-hover:text-brand transition-colors">{item.title}</h4>
                        <p className="text-[10px] sm:text-sm text-brand/90 line-clamp-1">{item.subCategoryName}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-lg font-bold text-brand">₹{item.discountedPrice}</span>
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-brand/10 flex items-center justify-center group-hover:bg-brand group-hover:text-brand-light transition-all">
                          <ArrowRight size={12} className="sm:w-3.5 sm:h-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </m.div>
              ))}
            </div>

            {products[3] && (
              <m.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="lg:flex-1 bg-black rounded-2xl lg:rounded-4xl overflow-hidden relative group cursor-pointer"
              >
                <Link href={`/product/${products[3]._id}`} className="flex flex-col sm:flex-row h-full w-full">
                  <div className="sm:w-1/2 p-5 sm:py-5 sm:px-8 flex flex-col justify-center relative z-10">
                    <span className="text-brand-light font-bold text-xs tracking-wider mb-1">Editor's Choice</span>
                    <h3 className="text-sm sm:text-base md:text-2xl font-bold text-brand-light mb-2 sm:mb-3 leading-tight group-hover:text-brand-light transition-colors line-clamp-2">{products[3].title}</h3>
                    <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
                      <span className="text-lg sm:text-xl md:text-3xl font-bold text-brand-light">₹{products[3].discountedPrice}</span>
                      {products[3].discount > 0 && (
                        <span className="px-2 py-0.5 bg-green-600 text-brand-light text-[9px] md:text-xs font-bold rounded-full">- {products[3].discount}%</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-brand-light/90 text-xs md:text-sm font-medium group-hover:text-brand-light transition-colors">
                      Shop Now <ArrowRight size={14} className="md:w-4 md:h-4" />
                    </div>
                  </div>
                  <div className="sm:w-1/2 relative bg-gray-900/50 aspect-[16/10] overflow-hidden flex-shrink-0">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${products[3].images.find(img => img.isCover)?.imageUrl || products[3].images[0]?.imageUrl}`}
                      alt={products[3].title}
                      fill
                      className="object-cover object-center mix-blend-lighten opacity-90 group-hover:scale-102 group-hover:opacity-100 transition-all duration-500"
                    />
                    {/* Background Burst */}
                    <div className="absolute inset-0 bg-gradient-to-l from-purple-900/40 to-transparent" />
                  </div>
                </Link>
              </m.div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
