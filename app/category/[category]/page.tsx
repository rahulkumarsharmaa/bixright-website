"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Filter, ChevronDown, Grid, X } from "lucide-react";
import type { Product, FilterOptions } from "@/app/types/product";
import { useFilter } from "@/app/context/FilterContext";
import FilterSidebar from "@/app/components/FilterSidebar";

export default function CategoryOnlyPage() {
  const params = useParams();
  const category = params.category as string;
  const paramsSearch = useSearchParams();
  const categoryName = paramsSearch.get("categoryName");

  const [products, setProducts] = useState<Product[]>([]);
  const [filterOption, setFilterOption] = useState<FilterOptions | undefined>(undefined);
  const { filterString } = useFilter();

  // Sort State
  const [sortBy, setSortBy] = useState("default");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return;

      let sortQuery = "";
      if (sortBy === "price_asc") sortQuery = "&sort=price_asc";
      if (sortBy === "price_desc") sortQuery = "&sort=price_desc";
      if (sortBy === "newest") sortQuery = "&sort=createdAt_desc";

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/product/get-active-product?categoryId=${category}&page=1&limit=50${filterString}${sortQuery}`
        );
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.log("Category Product Fetch Error:", error);
      }
    };
    fetchProducts();
  }, [category, filterString, sortBy]);

  // FETCH FILTERS
  useEffect(() => {
    const fetchFilter = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/product/fetch-filter?categoryId=${category}`
        );
        const data = await res.json();
        if (data.success) {
          setFilterOption(data.data);
        } else {
          setFilterOption(undefined);
        }
      } catch (error) {
        console.log("filter Fetch Error:", error);
      }
    };
    fetchFilter();
  }, [category]);

  const totalResults = products.length;

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 mt-6 md:mt-10">
      {/* HEADER STRIP */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm">
            <Link href="/" className="hover:text-black">Home</Link>
            <span>/</span>
            <span className="font-semibold text-black capitalize">{categoryName}</span>
          </div>
          <p className="hidden md:block text-gray-500 text-xs">
            Showing <span className="font-bold text-gray-900">{totalResults}</span> results
          </p>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-6 flex gap-8 relative">

        {/* LEFT SIDEBAR (Desktop) */}
        <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8 sticky top-48 h-fit max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar pr-2">
          <div>
            <h3 className="font-bold text-gray-900 mb-4 px-1">Filters</h3>
            <FilterSidebar options={filterOption} />
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0">

          {/* TOOLBAR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 capitalize hidden sm:block">
              {categoryName}
            </h1>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors w-full sm:w-auto shadow-sm"
            >
              <Filter size={16} /> Filters
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-gray-500 whitespace-nowrap hidden sm:inline-block">Sort by:</span>
              <div className="relative w-full sm:w-48">
                <select
                  className="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 hover:border-gray-400 cursor-pointer shadow-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {/* LOADING / EMPTY */}
          {products.length === 0 && (
            <div className="py-20 text-center">
              <div className="inline-block p-4 rounded-full bg-gray-50 mb-4">
                <Grid size={32} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
              <p className="text-gray-500 mt-1">Try changing your filters or check back later.</p>
              <button onClick={() => window.location.reload()} className="mt-6 text-gray-600 font-medium hover:underline">
                Reset Filters
              </button>
            </div>
          )}

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {products.map((item) => {
              const fallback = "/placeholder.png";
              const img = item.images?.[0]?.imageUrl && item.images[0].imageUrl.trim() !== ""
                ? item.images[0].imageUrl : fallback;

              return (
                <Link href={`/product/${item._id}`} key={item._id} className="group flex flex-col h-full">
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full relative">
                    {/* Image */}
                    <div className="relative bg-white aspect-square p-4">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${img}`}
                        alt={item.title}
                        fill
                        className="object-cover object-top mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                      />
                      {item.discount > 0 && (
                        <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          {item.discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4 flex flex-col flex-1 border-t border-gray-50">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                        {item.brandName || "Generic"}
                      </h3>
                      <h2 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-gray-600 transition-colors leading-snug" title={item.title}>
                        {item.title}
                      </h2>

                      {/* Ratings */}
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex text-yellow-500 text-xs">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill={i < Math.round(item.rating || 0) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={i < Math.round(item.rating || 0) ? "fill-current" : "text-gray-300"}>
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-600 hover:underline">
                          ({item.reviewCount || 4.5})
                        </span>
                      </div>
                      <div className="mt-auto pt-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-gray-900">₹{item.discountedPrice?.toLocaleString()}</span>
                          {typeof item.basePrice === 'number' && typeof item.discountedPrice === 'number' && item.basePrice > item.discountedPrice && (
                            <span className="text-xs text-gray-500 line-through">₹{item.basePrice?.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </main>
      </div>

      {/* MOBILE FILTER DRAWER */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              onClick={() => setMobileFilterOpen(false)}
            />
            <m.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 w-[85%] max-w-sm h-full bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0 bg-white">
                <h2 className="font-bold text-lg">Filters</h2>
                <button onClick={() => setMobileFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <FilterSidebar options={filterOption} />
              </div>

              <div className="p-4 border-t border-gray-100 bg-white pb-safe flex-shrink-0">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full bg-black text-white font-bold py-3.5 rounded-lg hover:bg-gray-800 transition-colors shadow-lg"
                >
                  Show {products.length} Results
                </button>
              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
