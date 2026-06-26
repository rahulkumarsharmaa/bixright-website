"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle, ShieldCheck, Truck, Headphones } from "lucide-react";
import { useSite } from "../context/siteSetting";

export default function AboutUs() {
  const { siteData } = useSite();
  return (
    <div className="bg-brand-light text-brand font-sans">
      <title>{siteData.siteName ? `${siteData.siteName} | About Us` : "Bixright | About Us"}</title>
      <meta name="description" content={`Learn more about ${siteData.siteName || "Bixright"} Software Private Limited, our mission, values, secure shopping services, fast delivery, and customer-first support.`} />
      <meta property="og:title" content={siteData.siteName ? `${siteData.siteName} | About Us` : "Bixright | About Us"} />
      <meta property="og:description" content={`Learn more about ${siteData.siteName || "Bixright"} Software Private Limited, our mission, values, secure shopping services, and customer support.`} />

      {/* 1. HERO / TITLE SECTION */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-12 md:pb-20 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <m.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-sm text-brand mb-8"
          >
            <Link href="/" className="hover:text-brand transition-colors">Home</Link>
            <span>&rarr;</span>
            <span className="text-brand font-medium">About Us</span>
          </m.nav>

          <m.h1
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            initial="hidden"
            animate="visible"
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-black mb-6"
          >
            Welcome To <span className="text-brand"> {siteData?.siteName}</span>
            <br />
            Software Private Limited
          </m.h1>

          <m.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-24 h-1.5 bg-brand mx-auto rounded-full"
          />
        </div>
      </section>

      {/* 2. MAIN CONTENT GRID */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <m.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20"
        >

          {/* LEFT COLUMN: Who We Are & Mission */}
          <div className="space-y-12">
            <m.div variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }} className="bg-brand-light p-8 rounded-4xl border border-brand/20 shadow-sm transition-shadow duration-300">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-sm">01</span>
                Who We Are
              </h2>
              <p className="text-brand leading-relaxed text-lg">
                {siteData?.siteName} is a dynamic eCommerce platform designed to provide a seamless and trustworthy online shopping experience. Founded with a vision to simplify the digital marketplace, we bring together the latest technology and user-centric design to serve thousands of customers across the country.
              </p>
            </m.div>

            <m.div variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }} className="bg-brand-light p-8 rounded-4xl border border-brand/20 shadow-sm transition-shadow duration-300">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-brand text-brand-light flex items-center justify-center text-sm">02</span>
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Our mission is to deliver high-quality products at competitive prices while offering top-notch customer service. We believe in creating value, ensuring transparency, and building long-term relationships with our customers and vendors.
              </p>
            </m.div>
          </div>

          {/* RIGHT COLUMN: What We Offer */}
          <div>
            <m.div variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }} className="bg-black text-brand-light p-8 lg:p-10 rounded-4xl shadow-sm h-full relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-8 border-b border-gray-800 pb-4">What We Offer</h2>

                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-4xl bg-brand/50 flex items-center justify-center shrink-0 text-brand-light">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Secure Shopping</h3>
                      <p className="text-gray-400 leading-relaxed">
                        With advanced SSL protection and reliable payment gateways, your transactions are always safe with us.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-4xl bg-brand/50 flex items-center justify-center shrink-0 text-brand-light">
                      <Truck size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Fast Delivery</h3>
                      <p className="text-gray-400 leading-relaxed">
                        We ensure timely delivery of your orders with our strong logistics and tracking support.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-4xl bg-brand/50 flex items-center justify-center shrink-0 text-brand-light">
                      <Headphones size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Customer Support</h3>
                      <p className="text-gray-400 leading-relaxed">
                        Our support team is here 24/7 to help you with any queries or issues you may face.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </m.div>
          </div>

        </m.div>
      </section>

      {/* 3. WHY CHOOSE US & CTA */}
      <section className="bg-brand-light py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">Why Choose Us?</h2>
            <p className="text-xl text-black/80 leading-relaxed max-w-2xl mx-auto mb-10">
              Because we care. From order to delivery – we make every step simple, secure, and satisfying. <span className="font-bold text-brand"> {siteData.siteName}</span> is more than a platform; it's your trusted shopping companion.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <m.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-brand text-brand-light font-bold rounded-4xl shadow-sm cursor-pointer transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  CONTACT US
                  <ArrowRight size={20} />
                </m.button>
              </Link>
            </div>
          </m.div>
        </div>
      </section>

    </div>
  );
}
