"use client";
import ProductImages from "./product/ProductImages";
import { ProductDetails } from "./product/ProductDetails";
import { notFound } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/app/types/product";
import ProductRating from "./product/ProductRating";

interface Props {
  product: Product;
}

const ProductMain = ({ product }: Props) => {
  const [selectedColor, setSelectedColor] = useState<string | undefined>();

  if (!product) notFound();

  return (
    <div>
      <div className="max-w-[85rem] mx-auto px-4 pb-10 pt-4 md:pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="md:sticky md:top-24">
            <ProductImages
              onClose={() => { }}
              product={product}
              selectedColor={selectedColor}
            />
          </div>
          <div>
            <ProductDetails
              product={product}
              onColorSelect={(color) => setSelectedColor(color)}
            />
            <ProductRating productId={product._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductMain;
