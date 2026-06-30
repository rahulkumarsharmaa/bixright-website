"use client";

import { m } from "framer-motion";
import { useSite } from "@/app/context/siteSetting";
import { usePolicy } from "@/app/components/PolicyProvider";
import { Truck } from "lucide-react";

export default function ShippingPolicyPage() {
  const { siteData } = useSite();
  const { policy } = usePolicy();

  return (
    <main className="min-h-screen bg-brand-light text-brand py-12 px-4 sm:px-6 font-sans">
      <title>{siteData.siteName ? `${siteData.siteName} | Shipping Policy` : "Bixright | Shipping Policy"}</title>
      <meta name="description" content="Read our shipping policy. Learn about delivery charges, timelines, and tracking information." />

      <div className="max-w-4xl mx-auto bg-white border border-brand/10 rounded-3xl p-6 md:p-10 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-brand/5 text-brand rounded-2xl">
            <Truck className="w-8 h-8" />
          </div>
          <m.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900"
          >
            Shipping & Delivery Policy
          </m.h1>
        </div>

        <div className="space-y-8 text-gray-800 leading-relaxed text-[15px] sm:text-base">
          {/* Overview Section */}
          <section className="bg-brand/5 rounded-3xl p-6 border border-brand/10 mb-8">
            <h2 className="text-lg font-bold text-brand mb-4 flex items-center gap-2">
              Shipping Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="bg-white p-4 rounded-2xl border border-brand/10">
                <span className="text-gray-400 font-semibold block uppercase text-[10px] tracking-wider mb-1">Shipping Charge</span>
                <span className="text-xl font-bold text-brand">₹{(policy.shippingCharge ?? 0).toFixed(2)}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-brand/10">
                <span className="text-gray-400 font-semibold block uppercase text-[10px] tracking-wider mb-1">Free Shipping Order Minimum</span>
                <span className="text-xl font-bold text-brand">₹{(policy.minFreeShippingAmount ?? 0).toFixed(2)}+</span>
              </div>
            </div>
          </section>

          {/* Dynamic Content */}
          {policy.shippingContent ? (
            <section className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-3">1. Delivery Process & Timelines</h2>
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {policy.shippingContent}
              </div>
            </section>
          ) : (
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Delivery Process & Timelines</h2>
              <p>
                We process and ship orders securely to ensure they reach you in pristine condition.
                Once your order is accepted, we verify product availability and prepare it for dispatch.
              </p>
            </section>
          )}

          {policy.shippingNote && (
            <section className="border-t border-gray-100 pt-6">
              <h2 className="text-xl font-semibold mb-3">2. Important Delivery Notes</h2>
              <div className="p-4 bg-yellow-50/50 rounded-2xl border border-yellow-200/50 text-sm text-gray-700 whitespace-pre-wrap">
                {policy.shippingNote}
              </div>
            </section>
          )}

          <section className="border-t border-gray-100 pt-6">
            <h2 className="text-xl font-semibold mb-3">3. Courier & Tracking</h2>
            <p>
              Once your package is shipped, you will receive a tracking ID. You can track your order using the link in your email updates or by visiting our <a href="/track-order" className="text-brand font-bold hover:underline">Track Order page</a>.
            </p>
          </section>

          <section className="border-t border-gray-100 pt-6">
            <h2 className="text-xl font-semibold mb-3">4. Contact Information</h2>
            <p>If you have any questions regarding your package shipment, please contact us at:</p>
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
