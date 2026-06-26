"use client";

import { m } from "framer-motion";
import { useSite } from "@/app/context/siteSetting";
import { usePolicy } from "@/app/components/PolicyProvider";
import { RotateCcw } from "lucide-react";

export default function ReturnPolicyPage() {
  const { siteData } = useSite();
  const { policy } = usePolicy();

  return (
    <main className="min-h-screen bg-brand-light text-brand py-12 px-4 sm:px-6 font-sans">
      <title>{siteData.siteName ? `${siteData.siteName} | Return Policy` : "Bixright | Return Policy"}</title>
      <meta name="description" content="Read our return and refund policy. Learn about eligible periods, return conditions, and refund procedures." />

      <div className="max-w-4xl mx-auto bg-white border border-brand/10 rounded-3xl p-6 md:p-10 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-brand/5 text-brand rounded-2xl">
            <RotateCcw className="w-8 h-8" />
          </div>
          <m.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900"
          >
            Returns & Refund Policy
          </m.h1>
        </div>

        <div className="space-y-8 text-gray-800 leading-relaxed text-[15px] sm:text-base">
          {/* Overview Section */}
          <section className="bg-brand/5 rounded-3xl p-6 border border-brand/10 mb-8">
            <h2 className="text-lg font-bold text-brand mb-4">
              Return Policy Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="bg-white p-4 rounded-2xl border border-brand/10">
                <span className="text-gray-400 font-semibold block uppercase text-[10px] tracking-wider mb-1">Return Period</span>
                <span className="text-xl font-bold text-brand">{policy.returnPeriodDays ?? 10} Days</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-brand/10">
                <span className="text-gray-400 font-semibold block uppercase text-[10px] tracking-wider mb-1">Refund Type</span>
                <span className="text-xl font-bold text-brand">Secure Direct Refund</span>
              </div>
            </div>
          </section>

          {/* Dynamic Content */}
          {policy.returnContent ? (
            <section className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-3">1. Return Eligibility & Guidelines</h2>
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {policy.returnContent}
              </div>
            </section>
          ) : (
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Return Eligibility & Guidelines</h2>
              <p>
                We accept returns on products within {policy.returnPeriodDays ?? 10} days of receipt.
                Please ensure products are unused, in original packaging, and contain all manuals, accessories, and promotional gifts received.
              </p>
            </section>
          )}

          {policy.returnConditions && (
            <section className="border-t border-gray-100 pt-6">
              <h2 className="text-xl font-semibold mb-3">2. Specific Return Conditions</h2>
              <div className="p-5 bg-brand-light/50 rounded-2xl border border-brand/10 text-gray-700 whitespace-pre-wrap leading-relaxed">
                {policy.returnConditions}
              </div>
            </section>
          )}

          <section className="border-t border-gray-100 pt-6">
            <h2 className="text-xl font-semibold mb-3">3. How to Initiate a Return</h2>
            <p>
              To return a product, please contact our support team. Provide your Order ID, proof of purchase, and images showing product condition. Once approved, we will arrange for a pickup or guide you on return shipment steps.
            </p>
          </section>

          <section className="border-t border-gray-100 pt-6">
            <h2 className="text-xl font-semibold mb-3">4. Support Details</h2>
            <p>For return assistance and queries, reach out directly at:</p>
            <div className="mt-4 space-y-1 font-semibold text-brand">
              <p>Email: {siteData?.email?.toLowerCase()}</p>
              <p>Phone: {siteData?.phone}</p>
              <p>Address: {siteData?.address}</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
