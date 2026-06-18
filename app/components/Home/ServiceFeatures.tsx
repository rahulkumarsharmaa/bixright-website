"use client";

import { Truck, ShieldCheck, RefreshCw, Headphones, CreditCard, Gift } from "lucide-react";

export default function ServiceFeatures() {
  const features = [
    {
      icon: <Truck className="w-8 h-8 md:w-10 md:h-10 text-white" />,
      bg: "bg-gray-500",
      title: "Free Delivery",
      desc: "Orders over ₹499"
    },
    {
      icon: <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-white" />,
      bg: "bg-green-500",
      title: "Secure Payment",
      desc: "100% secure payment"
    },
    {
      icon: <RefreshCw className="w-8 h-8 md:w-10 md:h-10 text-white" />,
      bg: "bg-purple-500",
      title: "Easy Return",
      desc: "10 days return policy"
    },
    {
      icon: <Headphones className="w-8 h-8 md:w-10 md:h-10 text-white" />,
      bg: "bg-orange-500",
      title: "24/7 Support",
      desc: "Dedicated support"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 py-8">
      {features.map((f, i) => (
        <div key={i} className="flex flex-col md:flex-row items-center md:items-start lg:items-center gap-4 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 text-center md:text-left">
          <div className={`${f.bg} p-3 rounded-full md:rounded-xl shadow-lg shadow-gray-200`}>
            {f.icon}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm md:text-base">{f.title}</h3>
            <p className="text-xs md:text-sm text-gray-500 mt-1">{f.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
