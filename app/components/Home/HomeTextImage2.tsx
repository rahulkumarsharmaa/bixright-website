"use client";

import { startTransition, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { start } from "repl";
import type { TagItem } from "@/app/types/tag";

interface HomeTextImageProps {
  page: number;
}

const HomeTextImage = ({ page }: HomeTextImageProps) => {
  const router = useRouter();
  const [tag, setTag] = useState<TagItem | null>(null);
  const [loading, setLoading] = useState(true);

  const isEven = page % 2 === 0;

  // const fetchTags = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/tags/get-tags?page=${page}&limit=1`,
  //       { cache: "no-store" }
  //     );

  //     const json = await res.json();

  //     if (json?.data && json.data.length > 0) {
  //       setTag(json.data[0]);
  //     } else {
  //       setTag(null);
  //     }
  //   } catch (error) {
  //     console.error("TAG API ERROR:", error);
  //     setTag(null);
  //   }
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   startTransition(() => {
  //     setTimeout(() => {
  //       fetchTags();
  //     }, 0);
  //   });
  // }, [page]);

  const handleClick = () => {
    if (!tag) return;
    const slug = (tag.title || "").trim().toLowerCase().replace(/\s+/g, "-");
    router.push(`/tags/${slug}?Id=${tag._id}`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-4 md:gap-6 mt-12">
        <div className="animate-pulse bg-gradient-to-br from-gray-200 to-gray-300  h-64 col-span-1" />
        <div className="animate-pulse bg-gradient-to-br from-gray-200 to-gray-300  aspect-[3/4]" />
        <div className="animate-pulse bg-gradient-to-br from-gray-200 to-gray-300  aspect-[3/4]" />
      </div>
    );
  }

  if (!tag) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-4 md:gap-6 mt-12 mb-12">
      {/* TEXT BLOCK */}
      <m.div
        initial={{ opacity: 0, x: isEven ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`relative p-6 sm:p-8 lg:p-10  h-full min-h-[220px] 
                    bg-gradient-to-br from-gray-50 to-gray-100
                    flex flex-col justify-center
                    col-span-1 sm:col-span-2 md:col-span-1 
                    cursor-pointer group
                   transition-all duration-500
                    border border-gray-200/50
                    ${isEven ? "md:order-last" : "md:order-first"}`}
        onClick={handleClick}
      >
        <div className="space-y-4">
          <div className="inline-block">
            <span className="px-4 py-1.5 bg-black/5 text-black/70  text-xs font-medium tracking-wide uppercase">
              Collection
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 capitalize leading-tight tracking-tight">
            {tag.title}
          </h2>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-md">
            {tag.subTitle}
          </p>

          <div className="pt-2">
            <button
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 
                             group-hover:gap-3 transition-all duration-300"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Decorative corner element */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-200/30 to-transparent" />
      </m.div>

      {/* IMAGE 1 */}
      {tag.images[0] && (
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          onClick={handleClick}
          className={`relative aspect-[3/4] overflow-hidden cursor-pointer 
                      shadow-lg hover:shadow-xl transition-all duration-150 group
                      ${isEven ? "md:order-first" : "md:order-last"}`}
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${tag.images[0]}`}
            alt={tag.title}
            fill
            className="object-cover object-top group-hover:scale-101 transition-transform duration-700 ease-out"
          />

          {/* Shine effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                            -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
            />
          </div>
        </m.div>
      )}

      {/* IMAGE 2 */}
      {tag.images[1] && (
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          onClick={handleClick}
          className={`relative aspect-[3/4] overflow-hidden cursor-pointer 
                      shadow-lg hover:shadow-xl transition-all duration-500 group
                      ${isEven ? "md:order-2" : "md:order-last"}`}
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${tag.images[1]}`}
            alt={tag.images[1]}
            fill
            className="object-cover object-top group-hover:scale-101 transition-transform duration-700 ease-in-out"
          />

          {/* Shine effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                            -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
            />
          </div>
        </m.div>
      )}
    </div>
  );
};

export default HomeTextImage;
