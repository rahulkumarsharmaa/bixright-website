import type { Product } from "@/app/types/product";
import { notFound } from "next/navigation";
import ProductMain from "@/app/components/ProductMain";
import RelatedProducts from "@/app/components/RelatedProduct";

interface Props {
  params: Promise<{ id: string }>;
}

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/product/get-product-by-id`;

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, { cache: "no-store" });
    if (!res.ok) return null;

    const json = await res.json();
    if (json.success && json.data) {
      return json.data as Product;
    }

    return null;
  } catch {
    return null;
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return (
    <div>
      <ProductMain product={product} />
      <RelatedProducts
        categoryId={product.categoryId ?? ""}
        currentProductId={product._id}
        subcategoryId={product.subCategoryId ?? ""}
      />
    </div>
  );
}
