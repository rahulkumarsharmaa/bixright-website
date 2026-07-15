"use client";

import { m } from "framer-motion";
import { useSite } from "@/app/context/siteSetting";

export default function TermsOfServicePage() {
  const { siteData } = useSite();

  const siteName = siteData.siteName || "Bixright";
  const siteEmail = siteData.email || "support@Bixright.com";
  const sitePhone = siteData.phone || "+91 0000000000";
  const siteAddress = siteData.address || "India";

  return (
    <main className="min-h-screen bg-brand-light text-brand py-12 px-4 sm:px-6 font-sans">
      <title>{siteName ? `${siteName} | Terms & Conditions` : "Bixright | Terms & Conditions"}</title>
      <meta name="description" content={`Read ${siteName}'s Terms and Conditions. Understand the terms, conditions, user agreements, and rules governing the use of the website.`} />
      <meta property="og:title" content={siteName ? `${siteName} | Terms & Conditions` : "Bixright | Terms & Conditions"} />
      <meta property="og:description" content={`Read ${siteName}'s Terms and Conditions. Understand the terms, conditions, user agreements, and rules governing the use of the website.`} />

      <div className="max-w-4xl mx-auto bg-white border border-brand/10 rounded-3xl p-6 md:p-10 shadow-sm">
        <m.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-3xl sm:text-4xl font-black text-brand mb-10"
        >
          Terms and Conditions
        </m.h1>

        <div className="space-y-8 text-brand/80 leading-relaxed text-[15px] sm:text-base">
          <section>
            <h2 className="text-xl font-bold text-brand mb-2">1. Welcome to Bixright (T&C)</h2>
            <p>
              Welcome to {siteName}. You agree to accept these Terms and Conditions by using the {siteName} website. Please carefully read the terms and conditions before using our website or making any purchases. Please refrain from using our website if you do not accept these terms.
            </p>  
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand mb-2">2. Product Information</h2>
            <p>
              All of our products' descriptions, images, specifications, and prices are as accurate as possible. However, mistakes may sometimes occur. {siteName} reserves the right to correct any error, update product information, or cancel orders if incorrect pricing or details have been indicated.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand mb-2">3. Order and Payments</h2>
            <p>
              Acceptance and product availability are both conditions for all online orders. You will receive an email confirming your order once it has been confirmed. All payments must be made through the safe payment options on our website. If we have reason to believe that any order has been fraudulent or unauthorized, we reserve the right to cancel or deny it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand mb-2">4. Shipping and Delivery</h2>
            <p>
              Our goal is to finish orders as soon as possible. Based on your location and shipping partner, delivery times may change. We make every effort to deliver your products on time. We have no control over delays brought on by courier services or bad weather.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand mb-2">5. Return and Refunds</h2>
            <p>
              In accordance with our Return & Refund Policy, customers may request a return or a replacement. The returned products should be unused, in their original packaging, and meet the eligibility requirements stated in the policy. Once the returned item has been analyzed and approved, refunds will be processed in 3-4 working days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand mb-2">6. User Responsibilities</h2>
            <p>
              When placing orders or setting up an account, you commit to giving accurate information. You are in charge of keeping your account information private and of all actions taken using your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand mb-2">7. Limitation of Liability</h2>
            <p>
              Any indirect, incidental, or consequential damages resulting from the use of our website, goods, or services are not the responsibility of {siteName}. Our maximum liability is limited to the purchase price of the item.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand mb-2">8. Contact Us</h2>
            <p>
              Please use the contact details on {siteName}'s contact us (email address: {siteEmail}) if you have any questions about these terms and conditions. We are dedicated to addressing your problems and making your shopping experience seamless.
            </p>
          </section>

          <section className="border-t border-brand/10 pt-6">
            <h2 className="text-xl font-bold text-brand mb-2">
              Contact Information
            </h2>
            <p>Email: {siteEmail}</p>
            <p>Phone: {sitePhone}</p>
            <p>Address: {siteAddress}</p>
          </section>
        </div>
      </div>
    </main>
  );
}
