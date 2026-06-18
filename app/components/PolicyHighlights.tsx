"use client";

import { Truck, RotateCcw } from "lucide-react";

interface PolicyProps {
  shippingContent: string;
  minFreeShippingAmount: number;
  shippingCharge: number;
  shippingNote: string;
  returnContent: string;
  returnPeriodDays: number;
  returnConditions: string;
}

export default function PolicyHighlights({
  shippingContent,
  minFreeShippingAmount,
  shippingCharge,
  shippingNote,
  returnContent,
  returnPeriodDays,
  returnConditions,
}: PolicyProps) {
  return (
    <div className="w-full py-6 my-2 border-y border-gray-200 ">
      <div className="flex flex-col gap-4">
        {/* Shipping Section */}
        <div className="flex items-start gap-4 p-5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 shadow-sm hover:shadow-md cursor-default">
          <div className="p-3 rounded-lg bg-gray-200 text-gray-700">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Shipping Policy</h4>
            <p className="text-sm text-gray-600 mt-1">{shippingContent}</p>
            <p className="text-sm text-gray-700 mt-1 font-medium">
              Free Shipping: ₹{minFreeShippingAmount}+
            </p>
            <p className="text-sm text-gray-500 mt-1">{shippingNote}</p>
            <p className="text-sm text-gray-600 mt-1">
              Standard Charge: ₹{shippingCharge}
            </p>
          </div>
        </div>

        {/* Return Section */}
        <div className="flex items-start gap-4 p-5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 shadow-sm hover:shadow-md cursor-default">
          <div className="p-3 rounded-lg bg-gray-200 text-gray-700">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Return Policy</h4>
            <p className="text-sm text-gray-600 mt-1">{returnContent}</p>
            <p className="text-sm text-gray-700 mt-1 font-medium">
              Return Period: {returnPeriodDays} Days
            </p>
            <p className="text-sm text-gray-600 mt-1">{returnConditions}</p>
          </div>
        </div>

        {/* Order Support / Extra Block */}
        
      </div>
    </div>
  );
}
