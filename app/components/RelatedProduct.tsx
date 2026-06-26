import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/app/types/product";
import LogoImage from "@/public/assets/Bixright.png";

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
                className="group bg-brand/3 border border-brand/10 rounded-2xl md:rounded-4xl overflow-hidden p-1.5 sm:p-2 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative h-full flex flex-col justify-between">
                  {/* Image */}
                  <div className="relative aspect-square bg-white overflow-hidden mb-3 rounded-3xl flex-shrink-0">
                    <Image
                      src={img}
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
                  <div className="p-2">

                    {/* Info */}
                    <div className="px-1">
                      <h3 className="text-brand/90 font-bold text-xs sm:text-base md:text-lg leading-snug line-clamp-2  group-hover:text-brand transition-colors" title={item.title}>
                        {item.title}
                      </h3>
                      <p className="text-[10px] text-brand/80 font-semibold uppercase tracking-wider mb-1 line-clamp-2">
                        {item.subTitle || item.categoryName || "Generic"}
                      </p>
                    </div>

                    {/* Price & Arrow */}
                    <div className="px-1 mt-auto">
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm sm:text-lg font-bold text-brand">₹{item.discountedPrice}</span>
                          {item.discount > 0 && (
                            <span className="text-[10px] md:text-xs text-brand/50 line-through">₹{item.basePrice}</span>
                          )}
                        </div>
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-brand/10 flex items-center justify-center group-hover:bg-brand group-hover:text-brand-light transition-all">
                          <ArrowRight size={12} className="sm:w-3.5 sm:h-3.5" />
                        </div>
                      </div>
                    </div>
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
