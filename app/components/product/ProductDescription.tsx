"use client";

import { useState } from "react";
import type { Product } from "@/app/types/product";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  product: Product;
}

export function ProductDescription({ product }: Props) {
  const [tab, setTab] = useState<"description" | "features" | "specs">(
    "description"
  );

  const [open, setOpen] = useState({
    description: true,
    features: false,
    specs: false,
  });

  return (
    <div className="my-8">
      <div className="hidden sm:flex gap-8 border-b mb-6">
        <button
          onClick={() => setTab("description")}
          className={`pb-4 ${tab === "description"
              ? "border-b-2 border-gray-600 text-gray-600"
              : ""
            }`}
        >
          Description
        </button>

        <button
          onClick={() => setTab("features")}
          className={`pb-4 ${tab === "features" ? "border-b-2 border-gray-600 text-gray-600" : ""
            }`}
        >
          Features
        </button>

        <button
          onClick={() => setTab("specs")}
          className={`pb-4 ${tab === "specs" ? "border-b-2 border-gray-600 text-gray-600" : ""
            }`}
        >
          Specifications
        </button>
      </div>

      <div className="hidden sm:block">
        {tab === "description" && <p>{product.description}</p>}

        {tab === "features" && (
          <ul className="space-y-2">
            {product.features.map((f) => (
              <li key={f} className="flex gap-2 items-start">
                <span className="text-gray-600">✓</span>
                {f}
              </li>
            ))}
          </ul>
        )}

        {tab === "specs" && (
          <dl className="grid sm:grid-cols-2 gap-4">
            {Object.entries(product.specifications).map(([k, v]) => (
              <div key={k} className="flex justify-between border-b py-3">
                <dt className="font-medium">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <div className="sm:hidden space-y-4">
        <div className="border rounded-lg">
          <button
            onClick={() =>
              setOpen((s) => ({ ...s, description: !s.description }))
            }
            className="w-full flex justify-between p-4"
          >
            Description
            {open.description ? <ChevronUp /> : <ChevronDown />}
          </button>

          {open.description && <div className="p-4">{product.description}</div>}
        </div>

        <div className="border rounded-lg">
          <button
            onClick={() => setOpen((s) => ({ ...s, features: !s.features }))}
            className="w-full flex justify-between p-4"
          >
            Features
            {open.features ? <ChevronUp /> : <ChevronDown />}
          </button>

          {open.features && (
            <ul className="p-4 space-y-2">
              {product.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-gray-600">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border rounded-lg">
          <button
            onClick={() => setOpen((s) => ({ ...s, specs: !s.specs }))}
            className="w-full flex justify-between p-4"
          >
            Specifications
            {open.specs ? <ChevronUp /> : <ChevronDown />}
          </button>

          {open.specs && (
            <dl className="p-4 space-y-3">
              {Object.entries(product.specifications).map(([k, v]) => (
                <div key={k} className="flex justify-between border-b pb-2">
                  <dt className="font-medium">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}
