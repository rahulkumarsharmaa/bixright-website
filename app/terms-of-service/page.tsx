"use client";

import { m } from "framer-motion";
import { useSite } from "@/app/context/siteSetting";

export default function TermsOfServicePage() {
  const { siteData } = useSite();
  return (
    <main className="min-h-screen bg-white px-4 sm:px-6 py-14  lg:pt-2 lg:pb-20">
      <div className="max-w-4xl mx-auto">
        <m.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10"
        >
          Terms of Service
        </m.h1>

        <div className="space-y-8 text-gray-800 leading-relaxed text-[15px] sm:text-base">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
            <p>
              Welcome to {siteData?.siteName}. By accessing or using our website, you agree
              to follow these Terms of Service. If you do not agree with any
              part of these terms, you must not use our website.
            </p>  
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Use of Website</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>You will use the website only for lawful purposes.</li>
              <li>
                You will not attempt to disrupt or misuse any feature of the
                site.
              </li>
              <li>
                You will not create fake accounts or submit false information.
              </li>
              <li>
                You will not copy or misuse our content without permission.
              </li>
            </ul>
            <p className="mt-2">
              We may suspend or block access if we detect suspicious or harmful
              activity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              3. Product Information
            </h2>
            <p className="mb-2">
              We try to provide accurate details for all products, but:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Colors may vary slightly due to screen settings.</li>
              <li>Measurements may differ slightly based on manufacturing.</li>
              <li>Availability may change at any time.</li>
            </ul>
            <p className="mt-2">
              If an item becomes unavailable after your order, we will notify
              you and issue a refund or provide alternatives.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              4. Pricing and Payments
            </h2>
            <p className="mb-2">
              All prices are listed in INR (₹). Prices may change without
              notice.
            </p>
            <p>
              Payments are securely handled by trusted payment partners. We do
              not store or access your card information at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              5. Orders and Acceptance
            </h2>
            <p className="mb-2">
              After placing an order, you will receive a confirmation email.
              This does not guarantee order acceptance.
            </p>
            <p className="mb-2">Your order is confirmed only after:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Successful payment verification</li>
              <li>Product availability check</li>
            </ul>
            <p className="mt-2">
              We may cancel an order due to stock issues, payment failure, or
              suspicion of fraudulent activity. Refunds will be processed
              accordingly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              6. Shipping and Delivery
            </h2>
            <p>
              Delivery timelines are estimates and may vary due to courier
              delays, location, or external factors. We are not responsible for
              delays caused by courier partners or unforeseen events.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              7. Returns and Refunds
            </h2>
            <p>
              Returns and refunds are handled according to our Return and Refund
              Policy. Please review that policy before making a purchase.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              8. Account Responsibility
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account information. Any activity performed using your account
              will be considered your responsibility.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              9. Intellectual Property
            </h2>
            <p>
              All images, graphics, content, logos, and product designs belong
              to Bixright or our licensors. Copying or redistribution without
              permission is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              10. Limitation of Liability
            </h2>
            <p>
              We are not liable for any indirect, incidental, or consequential
              damages arising from the use of our website, products, or
              services. Your use of the website is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">11. Changes to Terms</h2>
            <p>
              We may update these Terms of Service from time to time. Updates
              will be posted on this page with the latest revision date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              12. Contact Information
            </h2>
            <p>Email: {siteData?.email?.toLowerCase()}</p>
            <p>Phone: {siteData?.phone}</p>
            <p>Address: {siteData?.address}</p>
          </section>
        </div>
      </div>
    </main>
  );
}
