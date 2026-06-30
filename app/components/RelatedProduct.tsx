import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/app/types/product";
import LogoImage from "@/public/assets/Bixright.png";
import WishlistButton from "./WishlistButton";

interface Props {
  categoryId: string;
  subcategoryId?: string;
  currentProductId: string;
}

async function fetchRelatedProducts(
  categoryId: string,
  subcategoryId?: string
): Promise<Product[]> {
  try {
    // Build the URL with optional subcategory filter
    let url = `${process.env.NEXT_PUBLIC_API_URL}/product/get-active-product?categoryId=${categoryId}&page=1&limit=10`;

    if (subcategoryId) {
      url += `&subcategoryId=${subcategoryId}`;
    }

    const res = await fetch(url, { cache: "no-store" });

    const data = await res.json();
    if (!data.success) return [];

    return data.data as Product[];
  } catch {
    return [];
  }
}

export default async function RelatedProducts({
  categoryId,
  subcategoryId,
  currentProductId,
}: Props) {
  const products = await fetchRelatedProducts(categoryId, subcategoryId);

  const related = products.filter((p) => p._id !== currentProductId);

  if (related.length === 0) return null;

  return (
    <section className="text-brand py-16">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6">
        <h2 className="font-semibold mb-6 text-3xl text-center">
          Related Products
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {related.map((item) => {
            const fallback = LogoImage;

            const img =
              item.images?.[0]?.imageUrl &&
                item.images[0].imageUrl.trim() !== ""
                ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${item.images[0].imageUrl}`
                : fallback;

            return (
              <Link
                key={item._id}
                href={`/product/${item._id}`}
                className="group bg-brand/3 hover:bg-brand/5 border border-brand/10 hover:border-brand/30 hover:shadow-md rounded-2xl sm:rounded-3xl p-3 transition-all duration-300 flex flex-col h-full"
              >
                {/* Image */}
                <div className="relative aspect-square bg-white overflow-hidden mb-3.5 rounded-xl sm:rounded-2xl flex-shrink-0 flex items-center justify-center">
                  <Image
                    src={img}
                    alt={item.title}
                    fill
                      className="object-contain group-hover:scale-102 transition-transform duration-500"
                  />
                  {item.discount > 0 && (
                    <span className="absolute top-2 left-2 bg-brand text-brand-light text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm">
                      -{item.discount}%
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-grow flex flex-col px-0.5">
                  <p className="text-[10px] text-brand/50 font-bold uppercase tracking-wider mb-1 line-clamp-1">
                    {item.subTitle || item.categoryName || "Generic"}
                  </p>
                  <h3 className="text-brand/90 font-bold text-xs sm:text-sm md:text-base leading-snug line-clamp-2 mb-3 group-hover:text-brand transition-colors capitalize min-h-[2.2rem] sm:min-h-[2.5rem]" title={item.title}>
                    {item.title}
                  </h3>

                  {/* Price & Wishlist */}
                  <div className="mt-auto pt-3 border-t border-brand/5 flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-sm sm:text-base md:text-lg font-extrabold text-brand">₹{typeof item.discountedPrice === 'number' ? item.discountedPrice.toFixed(2) : (item.basePrice ?? 0).toFixed(2)}</span>
                      {item.discount > 0 && (
                        <span className="text-[10px] sm:text-xs text-brand/40 line-through">₹{(item.basePrice ?? 0).toFixed(2)}</span>
                      )}
                    </div>
                    <WishlistButton productId={item._id} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
