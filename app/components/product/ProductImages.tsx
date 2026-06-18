"use client";

import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import type { Product } from "@/app/types/product";
import Portal from "../Portal";

interface Props {
  product: Product;
  alt?: string;
  fallbackImage?: string;
  selectedColor?: string;
  onClose: () => void;
}

interface DisplayImage {
  _id: string;
  imageUrl: string;
  isCover: boolean;
  color?: string;
}

export default function ProductImages({
  product,
  onClose,
  alt = "product",
  fallbackImage = "https://images.unsplash.com/photo-1563770661066-9f1ec46b747a?w=500&auto=format&fit=crop&q=60",
  selectedColor,
}: Props) {
  const [active, setActive] = useState<DisplayImage | null>(null);
  const [prevColor, setPrevColor] = useState<string | undefined>(selectedColor);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!openModal) return; // attach only when popup is open

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openModal]);

  const allImages = useMemo<DisplayImage[]>(() => {
    if (!product) return [];

    const mainImages: DisplayImage[] = (product.images || []).map(
      (img, index) => ({
        _id: img._id || img.imageId || `main-img-${index}`,
        imageUrl: img.imageUrl,
        isCover: img.isCover || false,
      })
    );

    const variantImages: DisplayImage[] = [];

    if (Array.isArray(product.variants)) {
      product.variants.forEach((v) => {
        if (v.image) {
          variantImages.push({
            _id: `var-${v._id}`,
            imageUrl: v.image,
            isCover: false,
            color: v.color,
          });
        }
      });
    }

    const combined = [...mainImages, ...variantImages];

    const uniqueImages = combined.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.imageUrl === item.imageUrl)
    );

    const uniqueColors = new Set<string>();
    const result: DisplayImage[] = [];

    const images: DisplayImage[] =
      uniqueImages.length > 0
        ? uniqueImages
        : [
          {
            _id: "fallback-img",
            imageUrl: fallbackImage,
            isCover: true,
          },
        ];

    for (const img of images) {
      if (!img.color) {
        result.push(img);
        continue;
      }

      if (!uniqueColors.has(img.color)) {
        uniqueColors.add(img.color);
        result.push(img);
      }
    }

    return result;
  }, [product, fallbackImage]);

  const showImages = useMemo<DisplayImage[]>(() => {
    if (!product) return [];

    const mainImages: DisplayImage[] = (product.images || []).map(
      (img, index) => ({
        _id: img._id || img.imageId || `main-img-${index}`,
        imageUrl: img.imageUrl,
        isCover: img.isCover || false,
      })
    );

    return [...mainImages];
  }, [product, fallbackImage]);

  useEffect(() => {
    if (selectedColor !== prevColor) {
      setTimeout(() => {
        setPrevColor(selectedColor);
      }, 0);

      if (selectedColor && allImages.length > 0) {
        const matchedImage = allImages.find(
          (img) =>
            img.color && img.color.toLowerCase() === selectedColor.toLowerCase()
        );
        if (matchedImage) {
          setTimeout(() => {
            setActive(matchedImage);
          }, 0);
        }
      }
    }
  }, [selectedColor, allImages, prevColor]);

  const displayImage =
    active || allImages.find((i) => i.isCover) || allImages[0];

  if (!displayImage) return null;

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 sticky top-[160px] self-start">
      {/* Thumbnail List (Left side on Desktop, Bottom on Mobile) */}
      {allImages.length > 0 && (
        <m.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[600px] py-1 px-1 custom-scrollbar snap-mandatory snap-x md:snap-y shrink-0"
        >
          {showImages.map((img, index) => {
            const isActive = displayImage._id === img._id;
            return (
              <m.button
                key={img._id}
                type="button"
                onMouseEnter={() => setActive(img)} // Amazon style hover to switch
                onClick={() => setActive(img)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
                className={`w-14 h-14 md:w-16 md:h-16 relative overflow-hidden rounded-md flex-shrink-0 snap-start transition-all duration-200 border-2
                           ${isActive
                    ? "border-black shadow-sm"
                    : "border-gray-200 hover:border-gray-400"
                  }`}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${img.imageUrl}`}
                  alt={alt}
                  fill
                  className="object-contain p-1"
                />
              </m.button>
            );
          })}
        </m.div>
      )}

      {/* Main Image Display */}
      <m.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex-1 relative bg-white border border-gray-100 rounded-xl overflow-hidden cursor-zoom-in group w-full"
        style={{ aspectRatio: "3/4", maxHeight: "700px" }}
        onClick={() => setOpenModal(true)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setZoomPos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
          });
        }}
      >
        <AnimatePresence mode="wait">
          <m.div
            key={displayImage._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center p-4 bg-white"
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${displayImage.imageUrl}`}
              alt={alt}
              fill
              priority
              className="object-contain"
            />
          </m.div>
        </AnimatePresence>

        {/* Hover Zoom Hint */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300" />
      </m.div>

      <Portal>
        <AnimatePresence>
          {openModal && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-4"
              onClick={() => setOpenModal(false)} // outside click closes popup
            >
              <m.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-white max-w-[60rem] w-full h-[85vh] flex overflow-hidden relative p-0 rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()} // prevent overlay close when clicking inside
              >
                <button
                  onClick={() => setOpenModal(false)}
                  className="absolute top-4 right-4 z-[70] bg-white/10 hover:bg-black text-black hover:text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md border border-gray-200 transition-all"
                >
                  Close
                </button>

                <div className="w-1/4 bg-gray-50 border-r overflow-y-auto custom-scrollbar p-3 space-y-3">
                  {allImages
                    .filter((img) => img.color)
                    .map((img) => (
                      <button
                        key={img._id}
                        type="button"
                        onClick={() => setActive(img)}
                        className={`w-full aspect-[3/4] relative rounded-md overflow-hidden border ${active?._id === img._id
                          ? "border-black"
                          : "border-gray-300"
                          }`}
                      >
                        <Image
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${img.imageUrl}`}
                          alt={alt}
                          fill
                          className="object-cover object-top"
                        />
                      </button>
                    ))}
                </div>

                <div className="flex-1 bg-white flex items-center justify-center relative overflow-hidden">
                  <div
                    className="relative w-full h-full cursor-zoom-in"
                    onMouseMove={(e) => {
                      const rect = (
                        e.currentTarget as HTMLDivElement
                      ).getBoundingClientRect();
                      setZoomPos({
                        x: ((e.clientX - rect.left) / rect.width) * 100,
                        y: ((e.clientY - rect.top) / rect.height) * 100,
                      });
                    }}
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${active?.imageUrl || displayImage.imageUrl}`}
                      alt={alt}
                      fill
                      className="object-contain"
                      style={{
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                        transform: isZoomed ? "scale(1.5)" : "scale(1)",
                        transition: "transform 0.25s ease-out",
                      }}
                    />
                  </div>
                </div>
              </m.div>
            </m.div>
          )}
        </AnimatePresence>
      </Portal>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to right, #d1d5db, #9ca3af);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to right, #9ca3af, #6b7280);
        }
      `}</style>
    </div>
  );
}
