"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Zap, Clock, ShoppingCart } from "lucide-react"; // Import icons
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";

interface ProductItem {
  _id: string;
  title: string;
  basePrice: number;
  discountedPrice: number;
  discount: number;
  images: { imageUrl: string; isCover: boolean }[];
}

export default function FlashDeals() {
  const { addToCart } = useCart();
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

  const handleAddToCart = async (product: ProductItem) => {
    try {
      const cartItem = {
        productId: product._id,
        _id: product._id,
        title: product.title,
        price: product.basePrice,
        discountedPrice: product.discountedPrice,
        images: product.images.map((img, index) => ({
          ...img,
          imageId: String(index),
          sortOrder: index,
          _id: String(index)
        })),
        brandName: "",
        subTitle: "",
        stock: 10,
        variantId: undefined,
        color: "",
        size: "",
        quantity: 1,
        image: product.images?.[0]?.imageUrl ?? "",
      };
      await addToCart(cartItem);
      toast.success("Added to cart!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="bg-brand/10 rounded-2xl md:rounded-4xl p-4 md:p-8 border border-red-100/80">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-brand p-2 rounded-full text-white animate-pulse shrink-0">
            <Zap size={20} fill="currentColor" className="md:w-6 md:h-6" />
          </div>
          <div>
            <h2 className="text-lg md:text-2xl font-bold text-brand">Flash Deals</h2>
            <p className="text-brand font-semibold capitalize text-xs md:text-sm">Save big on the latest audio gear. Shop Best Earbuds and Headphones</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {loading ? (
          // Skeleton Loader
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-sm animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-xl md:rounded-2xl mb-2 w-full"></div>
              <div className="h-3.5 bg-gray-200 rounded-full w-full mb-1"></div>
              <div className="h-3.5 bg-gray-200 rounded-full w-1/2"></div>
            </div>
          ))
        ) : (
          products.map(product => {
            const img = product.images.find(i => i.isCover)?.imageUrl || "";
            return (
              <Link key={product._id} href={`/product/${product._id}`} className="bg-white rounded-2xl md:rounded-3xl p-3 md:p-4 transition group flex flex-col justify-between">
                <div>
                  <div className="relative aspect-square mb-2 bg-gray-50 rounded-xl md:rounded-2xl overflow-hidden">
                    {img && <Image src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${img}`} alt={product.title} fill className="object-cover group-hover:scale-102 transition-transform duration-300" />}
                    {product.discount > 0 && (
                      <span className="absolute top-2 right-2 bg-discount text-white text-[9px] md:text-[10px] font-bold px-2 py-0.5 md:py-1 rounded-full">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs md:text-sm font-medium line-clamp-1 mb-1">{product.title}</h3>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-col items-start leading-tight">
                      {product.discount > 0 && (
                        <span className="text-[10px] md:text-xs text-gray-400 line-through font-semibold">₹{product.basePrice}</span>
                      )}
                      <span className="text-base md:text-lg font-bold text-price">₹{product.discountedPrice}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="w-10 h-10 bg-brand/90 hover:bg-brand text-brand-light rounded-full  flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
                      title="Add to Cart"
                    >
                      <ShoppingCart size={20} strokeWidth={2.5} />
                    </button>
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
