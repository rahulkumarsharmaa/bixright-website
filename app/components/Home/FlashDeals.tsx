"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Zap, Clock } from "lucide-react"; // Import icons

interface ProductItem {
  _id: string;
  title: string;
  basePrice: number;
  discountedPrice: number;
  discount: number;
  images: { imageUrl: string; isCover: boolean }[];
}

export default function FlashDeals() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/get-recently-added-products?page=1&limit=4`, { cache: "no-store" });
        const json = await res.json();
        if (json.success) setProducts(json.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 md:p-8 my-8 border border-red-100">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-red-500 p-2 rounded-full text-white animate-pulse">
            <Zap size={24} fill="currentColor" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Flash Deals</h2>
            <p className="text-red-600 font-semibold capitalize text-sm">Save big on the latest audio gear. Shop Best Earbuds and Headphones</p>
          </div>
        </div>

        {/* <Link href="/deals" className="px-6 py-2 bg-white text-red-600 font-bold rounded-full border border-red-200 hover:bg-red-50 transition">
          View All Deals
        </Link> */}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          // Skeleton Loader
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-3 shadow-sm animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-2 w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : (
          products.map(product => {
            const img = product.images.find(i => i.isCover)?.imageUrl || "";
            return (
              <Link key={product._id} href={`/product/${product._id}`} className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition group">
                <div className="relative aspect-square mb-2 bg-gray-50 rounded-lg overflow-hidden">
                  {img && <Image src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${img}`} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform" />}
                  {product.discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                      -{product.discount}%
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium line-clamp-1 mb-1">{product.title}</h3>
                  <div className="flex items-center gap-2">
                    {product.discount > 0 && (
                      <span className="text-xs text-gray-400 line-through">₹{product.basePrice}</span>
                    )}
                    <span className="text-lg font-bold text-red-600">₹{product.discountedPrice}</span>
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
