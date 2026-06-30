import type { Product } from "@/app/types/product";
import { notFound } from "next/navigation";
import ProductMain from "@/app/components/ProductMain";
import RelatedProducts from "@/app/components/RelatedProduct";
import type { Metadata } from "next";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Product Not Found | Bixright",
    };
  }

  const title = `Bixright | Buy ${product.title} Online`;
  const cleanDescription = product.description
    ? product.description.replace(/<[^>]*>/g, "").slice(0, 160)
    : `Buy ${product.title} online at Bixright. High quality, premium specifications, and fast delivery.`;

  const images = product.images?.[0]?.imageUrl
    ? [{ url: `${process.env.NEXT_PUBLIC_IMAGE_URL}${product.images[0].imageUrl}` }]
    : [];

  return {
    title,
    description: cleanDescription,
    openGraph: {
      title,
      description: cleanDescription,
      images,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: cleanDescription,
      images: product.images?.[0]?.imageUrl ? [`${process.env.NEXT_PUBLIC_IMAGE_URL}${product.images[0].imageUrl}`] : [],
    }
  };
}

interface Props {
  params: Promise<{ id: string }>;
}

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/product/get-product-by-id`;

async function getProduct(id: string): Promise<Product | null> {
  try {
    const url = `${BASE_URL}/${id}`;
    // console.log("Fetching product from URL:", url);
    const res = await fetch(url, { cache: "no-store" });
    // console.log("Fetch response status:", res.status);
    if (!res.ok) {
      console.error("Fetch response was not OK");
      return null;
    }

    const json = await res.json();
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
