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
                className="group"
              >
                <div className="relative w-full aspect-[3/4]  overflow-hidden bg-white">
                  <Image
                    src={img}
                    alt={item.title}
                    fill
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-105 rounded-lg"
                  />
                </div>

                <h3 className="text-xl font-semibold mt-2 line-clamp-1">
                  {item.brandName}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {item.subTitle}
                </p>
                <p className="font-semibold mt-1">₹{item.basePrice}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
