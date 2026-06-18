"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { m } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

type CategoryItem = {
  _id: string;
  image: string;
  title: string;
  description: string;
  slug: string;
};

const SectionShopButtons = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/category/get-active-category?page=1&limit=4`,
        { cache: "no-store" }
      );

      const json = await res.json();

      if (json?.data && Array.isArray(json.data)) {
        setCategories(json.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("CATEGORY API ERROR:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-80 bg-gray-100 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-10">
      <div className="flex items-center justify-between mb-8 px-2">
        <div>
          <span className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Collections</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-none">
            Shop by <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-violet-600">Category</span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {categories.map((item, index) => (
          <m.div
            key={item._id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative cursor-pointer"
          >
            <Link
              href={`/category/${item._id}?categoryName=${encodeURIComponent(item.title)}`}
              className="block h-full w-full"
            >
              <div className="relative h-[300px] md:h-[400px] w-full rounded-[2rem] overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-500 border border-gray-100 bg-gray-50">

                {/* Image Scale Effect */}
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.image}`}
                    alt={item.title}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                {/* Content */}
                <div className="absolute bottom-0 inset-x-0 px-6 py-4 flex flex-col items-start justify-end h-full">

                  <h3 className="text-2xl font-bold text-white leading-tight group-hover:translate-x-1 transition-transform duration-300">{item.title}</h3>
                  {/* <p className="text-gray-300 text-sm line-clamp-2 opacity-80 mb-4 group-hover:opacity-100 transition-opacity duration-300">{item.description}</p> */}

                  <div className="w-full flex items-center justify-between text-white border-t border-white/20 pt-1 mt-2">
                    <span className="font-semibold text-sm">Explore Collection</span>
                    <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-transform duration-500">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </m.div>
        ))}
      </div>
    </section>
  );
};

export default SectionShopButtons;
