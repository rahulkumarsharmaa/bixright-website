"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import { m } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";

type CategoryType = {
  categoryId: string;
  _id: string;
  categoryName: string;
  title: string;
  slug: string;
  image: string;
};

const SectionTop = () => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [showLeftArrow, setShowLeftArrow] = useState<boolean>(false);
  const [showRightArrow, setShowRightArrow] = useState<boolean>(true);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/category/get-active-subCategory?page=-1&limit=20`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await res.json();
      setCategories(data.data);
      setError("");
    } catch {
      setError("Unable to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  const checkScrollPosition = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  const handleScroll = useCallback(() => {
    requestAnimationFrame(checkScrollPosition);
  }, [checkScrollPosition]);

  const scrollTo = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 300;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkScrollPosition, 100);
    };

    const timer = setTimeout(checkScrollPosition, 200);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
      clearTimeout(timer);
    };
  }, [checkScrollPosition]);

  return (
    <div className="relative pt-0 md:pt-6 group">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate pr-2">Electronics & Computer Accessories</h2>
        <Link href="/category/all" className="text-sm text-gray-600 hover:text-gray-700 font-medium shrink-0">View All</Link>
      </div>

      {showLeftArrow && (
        <button
          onClick={() => scrollTo("left")}
          className="hidden md:flex absolute -left-4 top-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 w-10 h-10 items-center justify-center rounded-full shadow-lg border border-gray-100 transition-all duration-300 hover:scale-110"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-4 md:gap-5 pb-4 hide-scrollbar"
        onScroll={handleScroll}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          scrollBehavior: "smooth",
        }}
      >
        {loading && (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-20 sm:w-28 animate-pulse text-center">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gray-200 mb-2 mx-auto"></div>
              <div className="w-14 h-4 bg-gray-200 rounded mx-auto"></div>
            </div>
          ))
        )}

        {!loading &&
          !error &&
          categories.map((item, index) => (
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              key={item.slug}
              className="flex-shrink-0 w-20 sm:w-28 flex flex-col items-center hover:opacity-100 transition-opacity"
            >
              <Link
                href={`/category/${item.categoryId}/subcategory/${item._id}?categoryName=${item.categoryName}&subCategoryName=${item.title}`}
                className="group flex flex-col items-center text-center gap-2 w-full"
              >
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-transparent hover:border-gray-600 transition-all duration-300 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden relative bg-gray-100">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.image}`}
                      alt={item.title}
                      fill
                      className="object-cover object-center transition-transform duration-500"
                    />
                  </div>
                </div>

                <h3 className="text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-gray-600 transition-colors line-clamp-2 max-w-full">
                  {item.title}
                </h3>
              </Link>
            </m.div>
          ))}
      </div>

      {showRightArrow && (
        <button
          onClick={() => scrollTo("right")}
          className="hidden md:flex absolute -right-4 top-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 w-10 h-10 items-center justify-center rounded-full shadow-lg border border-gray-100 transition-all duration-300 hover:scale-110"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SectionTop;
