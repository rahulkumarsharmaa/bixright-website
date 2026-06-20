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
    <section className="py-16 overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-end justify-between mb-10 px-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
              <Flame size={18} fill="currentColor" />
            </div>
            <span className="text-sm font-bold text-orange-600 uppercase tracking-widest">Hot Right Now</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">

            Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Products</span>
          </h2>
        </div>

        <Link href="/category/all" className="group hidden md:flex items-center gap-2 text-sm font-bold text-gray-900 border-b-2 border-transparent hover:border-black transition-all pb-0.5">
          Explore Collection <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
        </Link>
      </div>

      {loading ? (
        // Skeleton Loader
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 min-h-[500px] animate-pulse">
          {/* Large Item Skeleton */}
          <div className="lg:col-span-5 bg-gray-200 rounded-[2rem] h-[500px] w-full"></div>

          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Wide Item Skeleton */}
            <div className="bg-gray-200 rounded-[2rem] h-[250px] w-full"></div>
            {/* Bottom Row Skeletons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
              <div className="bg-gray-200 rounded-[2rem] h-[220px] w-full"></div>
              <div className="bg-gray-200 rounded-[2rem] h-[220px] w-full"></div>
            </div>
          </div>
        </div>
      ) : (
        /* Main Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 min-h-[500px]">

          {/* Large Featured Item (Left) */}
          {products[0] && (
            <m.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 relative group cursor-pointer"
            >
              <Link href={`/product/${products[0]._id}`} className="block h-full w-full">
                <div className="h-full w-full bg-gray-100 rounded-[2rem] overflow-hidden relative border border-gray-200 shadow-sm transition-all duration-500">
                  {/* Background Gradient Blob */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="relative h-[65%] w-full p-8 flex items-center justify-center bg-white/50">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${products[0].images.find(img => img.isCover)?.imageUrl || products[0].images[0]?.imageUrl}`}
                      alt={products[0].title}
                      fill
                      className="object-cover object-top group-hover:scale-102 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-6 left-6 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full z-10">
                      #1 Best Seller
                    </div>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-8 bg-white/80 backdrop-blur-xl border-t border-gray-100 h-[35%] flex flex-col justify-center transition-all duration-500">
                    <h3 className="text-2xl font-bold text-gray-900 line-clamp-1 mb-2 group-hover:text-purple-600 transition-colors">{products[0].title}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                      </div>
                      <span className="text-xs text-gray-400 font-medium">(4.9 Reviews)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-gray-900">₹{products[0].discountedPrice}</span>
                        <span className="text-sm text-gray-500 line-through decoration-red-500/50">₹{products[0].basePrice}</span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-purple-600 transition-colors shadow-lg group-hover:scale-102 duration-300">
                        <ShoppingBag size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </m.div>
          )}

          {/* Right Side Stack */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Top Item (Wide) */}
            {products[1] && (
              <m.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex-1 bg-black rounded-[2rem] overflow-hidden relative group cursor-pointer"
              >
                <Link href={`/product/${products[1]._id}`} className="flex flex-col md:flex-row h-full w-full">
                  <div className="md:w-1/2 p-8 flex flex-col justify-center relative z-10">
                    <span className="text-purple-400 font-bold text-sm tracking-wider mb-2">Editor's Choice</span>
                    <h3 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-purple-300 transition-colors">{products[1].title}</h3>
                    <div className="flex items-baseline gap-3 mb-6">
                      <span className="text-3xl font-bold text-white">₹{products[1].discountedPrice}</span>
                      <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded">- {products[1].discount}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm font-medium group-hover:text-white transition-colors">
                      Shop Now <ArrowRight size={16} />
                    </div>
                  </div>
                  <div className="md:w-1/2 relative bg-gray-900/50 h-[200px] md:h-auto">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${products[1].images.find(img => img.isCover)?.imageUrl || products[1].images[0]?.imageUrl}`}
                      alt={products[1].title}
                      fill
                      className="object-cover object-top mix-blend-lighten opacity-90 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500"
                    />
                    {/* Background Burst */}
                    <div className="absolute inset-0 bg-gradient-to-l from-purple-900/40 to-transparent" />
                  </div>
                </Link>
              </m.div>
            )}

            {/* Bottom Row of 2 Small Items */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products.slice(2, 4).map((item, i) => (
                <m.div
                  key={item._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  className="group"
                >
                  <Link href={`/product/${item._id}`} className="block h-full bg-gray-50 rounded-[1.5rem] border border-gray-100 hover:border-gray-300 overflow-hidden relative transition-colors duration-300 hover:bg-white">
                    <div className="relative aspect-[4/3] p-6 bg-white overflow-hidden">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.images.find(img => img.isCover)?.imageUrl || item.images[0]?.imageUrl}`}
                        alt={item.title}
                        fill
                        className="object-cover object-top  group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <h4 className="font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-purple-600 transition-colors">{item.title}</h4>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-1">{item.subCategoryName}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">₹{item.discountedPrice}</span>
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </m.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
