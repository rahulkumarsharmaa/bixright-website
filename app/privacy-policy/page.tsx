"use client";

import { m } from "framer-motion";
import { useSite } from "@/app/context/siteSetting";

export default function PrivacyPolicyPage() {
  const { siteData } = useSite();

  return (
    <main className="min-h-screen bg-white px-4 sm:px-6 py-14 lg:pt-2 lg:pb-20">
      <div className="max-w-4xl mx-auto">
        <m.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10"
        >
          Privacy Policy
        </m.h1>

        <div className="space-y-8 text-gray-800 leading-relaxed text-[15px] sm:text-base">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Overview</h2>
            <p>
              Welcome to {siteData.siteName || "Bixright"}. Your privacy is important to us. We
              collect only the information required to process your orders,
              improve your shopping experience, and communicate with you in a
              transparent way.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              2. Information We Collect
            </h2>
            <p className="mb-2">
              We collect the following types of information:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Full Name, Email, Mobile Number</li>
              <li>Shipping & Billing Address</li>
              <li>Payment details (processed securely, not stored by us)</li>
              <li>Device info, IP address, browser details</li>
              <li>Pages viewed, actions on site, and cookies</li>
              <li>Wishlist items, reviews, account details</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Process and deliver your orders</li>
              <li>Send order updates and support messages</li>
              <li>Improve website performance and personalization</li>
              <li>Prevent fraudulent activity</li>
              <li>Show relevant offers or product recommendations</li>
              <li>Send marketing updates (only if you opt-in)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              4. Sharing Your Information
            </h2>
            <p className="mb-2">
              We share information only with trusted partners:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Payment gateways</li>
              <li>Delivery and courier partners</li>
              <li>Hosting, analytics, and security providers</li>
            </ul>
            <p className="mt-2">We never sell or rent your data to anyone.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Data Security</h2>
            <p>
              We use secure servers, SSL encryption, and industry-standard
              protection to keep your data safe. While we take all precautions,
              no online system is completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Cookies</h2>
            <p>
              Cookies help us improve website speed, remember preferences, and
              offer personalized content. You may disable cookies in browser
              settings, but some features may not work correctly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">7. Your Rights</h2>
            <p className="mb-2">You can request the following at any time:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access or update your data</li>
              <li>Delete your account</li>
              <li>Opt-out of marketing messages</li>
              <li>Withdraw consent</li>
            </ul>
            <p className="mt-2">
              Contact us at {siteData.email || "support@Bixright.com"} for any requests.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              8. Children’s Privacy
            </h2>
            <p>
              Our website is not intended for children under 13. We do not
              knowingly collect data from minors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">9. Third-Party Links</h2>
            <p>
              Our website may include links to other sites. We are not
              responsible for the privacy practices of those websites.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              10. Updates to This Policy
            </h2>
            <p>
              We may update this policy from time to time. Changes will be
              posted on this page with the updated date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              12. Contact Information
            </h2>
            <p>Email: {siteData.email || "support@Bixright.com"}</p>
            <p>Phone: {siteData.phone || "+91 0000000000"}</p>
            <p>Address: {siteData.address || "India"}</p>
          </section>
        </div>
      </div>
    </main>
  );
}
