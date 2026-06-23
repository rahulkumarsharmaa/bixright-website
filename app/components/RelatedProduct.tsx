import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/app/types/product";
import LogoImage from "@/public/assets/Bixright.png"

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
    <section className="text-black py-16">
      <div className="max-w-7xl mx-auto px-4">
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
                className="bg-white rounded-4xl p-4 transition-all duration-300 group relative hover:z-10 border border-gray-100/80 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square mb-3 bg-gray-50 rounded-xl overflow-hidden">
                    <Image
                      src={img}
                      alt={item.title}
                      fill
                      className="object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    {item.discount > 0 && (
                      <span className="absolute top-2 right-2 bg-discount text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                        -{item.discount}%
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 mb-1 capitalize">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                    {item.subTitle || item.categoryName}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-auto">
                  {item.discount > 0 && (
                    <span className="text-xs text-gray-400 line-through">₹{item.basePrice}</span>
                  )}
                  <span className="text-lg font-bold text-price">₹{item.discountedPrice}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
