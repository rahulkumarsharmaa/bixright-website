"use client";

import { m } from "framer-motion";
import { useSite } from "@/app/context/siteSetting";

export default function PrivacyPolicyPage() {
  const { siteData } = useSite();

  const siteName = siteData.siteName || "Bixright";
  const siteEmail = siteData.email || "support@Bixright.com";
  const sitePhone = siteData.phone || "+91 0000000000";
  const siteAddress = siteData.address || "India";

  return (
    <main className="min-h-screen bg-brand-light text-brand py-12 px-4 sm:px-6 font-sans">
      <title>{siteName ? `${siteName} | Privacy Policy` : "Bixright | Privacy Policy"}</title>
      <meta name="description" content={`Read ${siteName}'s Privacy Policy. Learn how we collect, protect, and process your personal information.`} />
      <meta property="og:title" content={siteName ? `${siteName} | Privacy Policy` : "Bixright | Privacy Policy"} />
      <meta property="og:description" content={`Read ${siteName}'s Privacy Policy. Learn how we collect, protect, and process your personal information.`} />

      <div className="max-w-4xl mx-auto bg-white border border-brand/10 rounded-3xl p-6 md:p-10 shadow-sm">
        <m.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-3xl sm:text-4xl font-black text-brand mb-10"
        >
          Privacy Policy
        </m.h1>

        <div className="space-y-8 text-brand/80 leading-relaxed text-[15px] sm:text-base">
          <section>
            <p>
              {siteName} is dedicated to protecting your personal information and appreciates your right to privacy. This privacy policy describes what details we collect, how we use and keep them secure. By using our website, you agree to the rules outlined in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand mb-2">1. Information We Collect</h2>
            <p className="mb-2">
              When you visit our website or contact us, we may collect certain details, including:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-brand/70 mb-2">
              <li>Your Email Address</li>
              <li>Your Name</li>
              <li>Contact Number</li>
              <li>Billing and Shipping Details</li>
              <li>Payment-related Information is processed securely by trusted payment providers</li>
              <li>Device Information, IP address, browser type, and website usage data</li>
            </ul>
            <p>
              We collect this detail only when you freely provide it or when it is necessary to enhance your browsing experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand mb-2">2. How We Use Your Information</h2>
            <p className="mb-2">
              The information we collect helps us:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-brand/70 mb-2">
              <li>Handle and deliver your orders</li>
              <li>Respond to your inquiries and requests for customer service</li>
              <li>Enhance our services, goods, and website</li>
              <li>Send important updates and order confirmations</li>
              <li>Notify you about promotions, deals, and new products</li>
              <li>Prevent fraud and keep your website safe</li>
              <li>Fulfill legal and regulatory obligations</li>
            </ul>
            <p>
              We only utilize your personal data for authorized business needs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand mb-2">3. Cookies and Tracking Technologies</h2>
            <p>
              Cookies and related technologies are used on our website to enhance your online experience. Cookies enable us to track your preferences, evaluate website traffic, and improve website functionality. Cookies can be turned off via your browser's settings. If cookies are turned off, some website features might not work as intended.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand mb-2">4. Sharing of Information</h2>
            <p className="mb-2">
              We don't trade, sell, or rent your personal information because we value your privacy. Your information may only be disclosed to reliable outside service providers who help us with:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-brand/70 mb-2">
              <li>Processing of payments</li>
              <li>Delivery and shipping</li>
              <li>Hosting of websites</li>
              <li>Analytics and performance tracking</li>
              <li>Customer service</li>
            </ul>
            <p>
              These partners must safeguard your data and utilize it exclusively for the services they offer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand mb-2">5. Data Security</h2>
            <p>
              To prevent unauthorized access, loss, misuse, or exposure of your personal information, we take reasonable organizational and technical protection measures. Even though we work hard to uphold robust security procedures, no electronic storage or internet transmission method is totally safe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand mb-2">6. Third Party Links</h2>
            <p>
              For your convenience, links to other websites may be found on our website. We are not responsible for the privacy practices or content of those websites. We advise users to check the privacy rules of any websites they visit from outside sources.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand mb-2">7. Your Rights</h2>
            <p className="mb-2">
              Depending on where you live and the laws that apply, you might be able to:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-brand/70 mb-2">
              <li>Get access to your private data
              </li>
              <li>Request modification of inaccurate information</li>
              <li>Hosting of websites</li>
              <li>Request that your personal data be deleted</li>
              <li>Retract permission for marketing communications</li>
              <li>Find out how your information is being used</li>
            </ul>
            <p>
              Simply get in touch with us using the information on our website to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand mb-2">8. Changes to this Privacy Policy</h2>
            <p>
              This Privacy Policy may be updated to reflect modifications to our services, legal requirements, or business procedures. The updated effective date and any updates will be posted on this page. We advise users to periodically review this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand mb-2">9. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests about this policy or the handling of your personal information. Kindly contact us {siteEmail} . We are dedicated to keeping your trust and promptly resolving your concerns.
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
