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
    const url = `${BASE_URL}/${id}`;
    console.log("Fetching product from URL:", url);
    const res = await fetch(url, { cache: "no-store" });
    console.log("Fetch response status:", res.status);
    if (!res.ok) {
      console.error("Fetch response was not OK");
      return null;
    }

    const json = await res.json();
    console.log("Fetch response JSON:", json);
    if (json.success && json.data) {
      return json.data as Product;
    }

    console.error("Fetch returned success=false or no data:", json);
    return null;
  } catch (err: any) {
    console.error("Fetch threw an error:", err);
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
