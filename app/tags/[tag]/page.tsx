"use client";

import { m, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import FilterDropdown from "@/app/components/FilterDropdown";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FilterOptions, Product } from "@/app/types/product";
import { useFilter } from "@/app/context/FilterContext";
import LogoImage from "@/public/assets/Bixright.png"


export default function Page() {
  const params = useParams<{ tag: string }>();
  const tag = params?.tag;
  const searchParams = useSearchParams();
  const tagId = searchParams.get("Id");
  const [showMore, setShowMore] = useState<Record<string, boolean>>({});

  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filterOption, setOpenFilterOption] = useState<
    FilterOptions | undefined
  >(undefined);

  const { filterString } = useFilter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/product/get-active-product?tagId=${tagId}&page=1&limit=12&${filterString}`,
          { cache: "no-store" }
        );

        const data = await res.json();

        if (data.success) {
          setProducts(data.data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.log("Product Fetch Error:", error);
      }
    };

    fetchProducts();
  }, [tag, filterString]);

  useEffect(() => {
    const fetchFilter = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/product/fetch-filter`
        );
        const data = await res.json();

        if (data.success) {
          setOpenFilterOption(data.data);
        } else {
          setOpenFilterOption(undefined);
        }
      } catch (error) {
        console.log("Filter Fetch Error:", error);
      }
    };

    fetchFilter();
  }, []);

  const toggleFilter = (key: string) => {
    setOpenFilter(openFilter === key ? null : key);
  };

  const closeFilter = () => setOpenFilter(null);

  return (
    <div className="pt-20 md:pt-30 bg-gray-100 text-gray-900">
      <div className="w-full max-w-7xl mx-auto px-4 pb-6">
        <h1 className="text-3xl font-semibold capitalize">
          {tag?.split("-").join(" ") || "Collection"}
        </h1>

        <div className="relative flex gap-6 text-sm mt-4 overflow-visible border-b border-gray-200 pb-3 z-10 uppercase">
          <FilterDropdown
            title="size"
            type="options"
            options={filterOption?.size}
            open={openFilter === "size"}
            onToggle={() => toggleFilter("size")}
            onClose={closeFilter}
          />

          <FilterDropdown
            title="color"
            type="options"
            options={filterOption?.color}
            open={openFilter === "color"}
            onToggle={() => toggleFilter("color")}
            onClose={closeFilter}
          />

          <FilterDropdown
            title="brand"
            type="options"
            options={filterOption?.brand}
            open={openFilter === "brand"}
            onToggle={() => toggleFilter("brand")}
            onClose={closeFilter}
          />

          <FilterDropdown
            title="Price"
            type="price"
            priceOption={filterOption?.price}
            open={openFilter === "price"}
            onToggle={() => toggleFilter("price")}
            onClose={closeFilter}
          />
        </div>

        {products.length === 0 && (
          <div className="text-lg mt-10">No products found.</div>
        )}

        <m.div
          className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {products.map((item) => {
            const fallback = LogoImage
            const img =
              item.images?.[0]?.imageUrl &&
                item.images[0].imageUrl.trim() !== ""
                ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${item.images[0].imageUrl}`
                : fallback;

            return (
              <div key={item._id}>
                <Link href={`/product/${item._id}`}>
                  <m.div className="cursor-pointer">
                    <m.div
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-white"
                    >
                      <Image
                        src={img}
                        alt={item.title}
                        fill
                        className="object-cover object-top"
                      />
                    </m.div>

                    {/* ONE LINE TITLE WITH ... */}
                    <h2 className="text-lg font-semibold mt-2 leading-snug line-clamp-1">
                      {item.title}
                    </h2>

                    {/* <p className="font-semibold mt-1">₹{item.basePrice}</p> */}
                    <div className="mt-1 flex items-center gap-2">
                      {/* Selling Price */}
                      <span className="text-lg font-semibold text-gray-900">
                        ₹{typeof item.discountedPrice === 'number' ? item.discountedPrice.toFixed(2) : (item.basePrice ?? 0).toFixed(2)}
                      </span>

                      {/* Cut Price (if exists and greater than base price) */}
                      {typeof item.discountedPrice === 'number' &&
                        item.discountedPrice < item.basePrice && (
                          <span className="text-sm line-through text-gray-400">
                            ₹{(item.basePrice ?? 0).toFixed(2)}
                          </span>
                        )}

                      {/* Discount % */}
                      {item.discount && (
                        <span className="text-green-600 text-sm font-semibold">
                          {item.discount}% off
                        </span>
                      )}
                    </div>
                  </m.div>
                </Link>
              </div>
            );
          })}
        </m.div>
      </div>
    </div>
  );
}
