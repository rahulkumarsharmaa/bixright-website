"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Filter, ChevronDown, Grid, X, ArrowRight } from "lucide-react";
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
    <AnimatePresence mode="wait">
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="font-sans text-brand"
      >
        <title>{categoryName ? `Bixright | Buy ${categoryName}` : "Bixright | Shop Categories"}</title>
        <meta name="description" content={categoryName ? `Explore the best deals on premium ${categoryName} online at Bixright.` : "Browse premium product categories at Bixright."} />
        <meta property="og:title" content={categoryName ? `Bixright | Buy ${categoryName}` : "Bixright | Shop Categories"} />
        <meta property="og:description" content={categoryName ? `Explore the best deals on premium ${categoryName} online at Bixright.` : "Browse premium product categories at Bixright."} />

        {/* HEADER STRIP */}
        <div className="bg-brand-light border-b border-brand/10 pt-4">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-3 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-brand/70 text-xs md:text-sm">
              <Link href="/" className="hover:text-brand transition-colors font-medium">Home</Link>
              <span>/</span>
              <span className="font-semibold text-brand capitalize">{categoryName}</span>
            </div>
            <p className="hidden md:block text-brand/50 text-xs">
              Showing <span className="font-bold text-brand">{totalResults}</span> results
            </p>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6 flex gap-8 relative ">

          {/* LEFT SIDEBAR (Desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8 overflow-y-auto custom-scrollbar pr-2">
            <div>
              <h3 className="font-bold text-brand mb-4 px-1">Filters</h3>
              <FilterSidebar options={filterOption} />
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1">
            {/* TOOLBAR */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
              <h1 className="text-xl md:text-2xl font-bold text-brand capitalize hidden sm:block">
                {categoryName}
              </h1>

              {/* Mobile Filters and Sort Dropdown Side-by-Side */}
              <div className="flex items-center gap-3 w-full lg:hidden">
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand/3 border border-brand/10 rounded-full font-bold text-sm hover:bg-brand/10 transition-colors shadow-sm text-brand"
                >
                  <Filter size={16} /> Filters
                </button>

                <div className="flex-1 relative">
                  <select
                    className="w-full appearance-none bg-brand/3 border border-brand/10 text-brand py-2.5 px-4 pr-8 rounded-full text-sm font-semibold focus:outline-none cursor-pointer shadow-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="default">Featured</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="newest">Newest Arrivals</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand pointer-events-none" size={16} />
                </div>
              </div>

              {/* Desktop Sort Dropdown */}
              <div className="hidden lg:flex items-center gap-2 w-auto">
                <span className="text-sm text-brand/60 whitespace-nowrap">Sort by:</span>
                <div className="relative w-48">
                  <select
                    className="w-full appearance-none bg-brand/3 border border-brand/10 text-brand py-2 px-3 pr-8 rounded-full text-sm font-semibold focus:outline-none hover:border-brand/30 cursor-pointer shadow-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="default">Featured</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="newest">Newest Arrivals</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-brand/50 pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            {/* LOADING / EMPTY */}
            {products.length === 0 && (
              <div className="py-20 text-center">
                <div className="inline-block p-4 rounded-4xl bg-brand-light mb-4">
                  <Grid size={32} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-brand">No products found</h3>
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
                  <Link
                    href={`/product/${item._id}`}
                    key={item._id}
                    className="group bg-brand/3 border border-brand/10 rounded-2xl md:rounded-4xl overflow-hidden p-1.5 sm:p-2 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="relative h-full flex flex-col justify-between">
                      <div>
                        {/* Image */}
                        <div className="relative aspect-square bg-white overflow-hidden mb-3 rounded-2xl md:rounded-3xl flex-shrink-0">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${img}`}
                            alt={item.title}
                            fill
                            className="object-contain group-hover:scale-102 transition-transform duration-500"
                          />
                          {item.discount > 0 && (
                            <span className="absolute top-2 left-2 bg-brand text-brand-light text-[9px] md:text-[10px] font-bold px-2 py-0.5 md:py-1 rounded-full">
                              -{item.discount}%
                            </span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="px-1">
                          <p className="text-[10px] text-brand/80 font-semibold uppercase tracking-wider mb-1">
                            {item.brandName || "Generic"}
                          </p>
                          <h3 className="text-brand/90 font-bold text-xs sm:text-sm leading-snug line-clamp-2 mb-1.5 min-h-[2rem] sm:min-h-[2.5rem] group-hover:text-brand transition-colors" title={item.title}>
                            {item.title}
                          </h3>

                          {/* Ratings */}
                          {/* <div className="flex items-center gap-1 mb-2">
                            <div className="flex text-yellow-500 text-[10px] sm:text-xs">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill={i < Math.round(item.rating || 0) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={i < Math.round(item.rating || 0) ? "fill-current w-2.5 h-2.5 sm:w-3 sm:h-3" : "text-gray-300 w-2.5 h-2.5 sm:w-3 sm:h-3"}>
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                              ))}
                            </div>
                            <span className="text-[10px] sm:text-xs text-brand/60">
                              ({item.reviewCount || 4.5})
                            </span>
                          </div> */}
                        </div>
                      </div>

                      {/* Price Block */}
                      <div className="px-1 mt-auto">
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm sm:text-lg font-bold text-brand">₹{item.discountedPrice?.toLocaleString()}</span>
                            {typeof item.basePrice === 'number' && typeof item.discountedPrice === 'number' && item.basePrice > item.discountedPrice && (
                              <span className="text-[10px] md:text-xs text-brand/50 line-through">₹{item.basePrice?.toLocaleString()}</span>
                            )}
                          </div>
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-brand/10 flex items-center justify-center group-hover:bg-brand group-hover:text-brand-light transition-all">
                            <ArrowRight size={12} className="sm:w-3.5 sm:h-3.5" />
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
                className="fixed top-0 right-0 w-[85%] max-w-sm h-full bg-brand-light z-50 shadow-2xl flex flex-col"
              >
                <div className="p-4 border-b border-brand/10 flex items-center justify-between flex-shrink-0 bg-brand-light">
                  <h2 className="font-bold text-lg text-brand">Filters</h2>
                  <button onClick={() => setMobileFilterOpen(false)} className="p-2 hover:bg-brand/10 rounded-full text-brand">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                  <FilterSidebar options={filterOption} />
                </div>

                <div className="p-4 border-t border-brand-light bg-brand-light pb-safe flex-shrink-0">
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="w-full bg-brand text-brand-light font-bold p-2 md:py-3 rounded-full hover:bg-brand/90 transition-colors shadow-lg"
                  >
                    Show {products.length} Results
                  </button>
                </div>
              </m.div>
            </>
          )}
        </AnimatePresence>
      </m.div>
    </AnimatePresence>
  );
}
