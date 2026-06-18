"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PromoBanner() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 my-8">
      {/* Card 1 */}
      <div className="relative overflow-hidden rounded-2xl bg-black text-white h-[200px] md:h-[280px] group">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 z-0"></div>
        {/* Abstract Circle decoration */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 md:w-60 md:h-60 rounded-full bg-gray-600/20 blur-3xl group-hover:bg-gray-600/30 transition-colors"></div>

        <div className="relative z-10 p-6 md:p-10 h-full flex flex-col justify-center items-start">
          <span className="bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded mb-3">NEW ARRIVAL</span>
          <h3 className="text-2xl md:text-3xl font-bold mb-2">Smart Wearables</h3>
          <p className="text-gray-300 mb-6 text-sm md:text-base max-w-[80%]">Track fitness, notifications & more with premium smartwatches.</p>
          <Link href="/category/smartwatches" className="flex items-center gap-2 font-semibold hover:gap-3 transition-all text-gray-400 hover:text-gray-300">
            Shop Now <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Card 2 */}
      <div className="relative overflow-hidden rounded-2xl bg-gray-100 text-gray-900 h-[200px] md:h-[280px] group">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 z-0"></div>
        <div className="absolute -left-10 -top-10 w-40 h-40 md:w-60 md:h-60 rounded-full bg-orange-500/10 blur-3xl group-hover:bg-orange-500/20 transition-colors"></div>

        <div className="relative z-10 p-6 md:p-10 h-full flex flex-col justify-center items-start">
          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded mb-3">LIMITED OFFER</span>
          <h3 className="text-2xl md:text-3xl font-bold mb-2">Audio Gear</h3>
          <p className="text-gray-600 mb-6 text-sm md:text-base max-w-[80%]">Immersive sound with noise cancellation technology.</p>
          <Link href="/category/audio" className="flex items-center gap-2 font-semibold hover:gap-3 transition-all text-orange-600 hover:text-orange-700">
            Explore Deals <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
