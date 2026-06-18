"use client";

import { useEffect, useState } from "react";
import { m } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import { useSite } from "../context/siteSetting";

const socialItems = [
  { Icon: Facebook, key: "facebook" },
  { Icon: Twitter, key: "twitter" },
  { Icon: Instagram, key: "instagram" },
  { Icon: Linkedin, key: "linkedin" },
] as const;

const Footer = () => {
  const router = useRouter();
  const { siteData } = useSite();

  const [email, setEmail] = useState<string>("");
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [subscribing, setSubscribing] = useState<boolean>(false);
  const [categories, setCategories] = useState<{ _id: string; title: string }[]>([]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };

  const customerService = [
    { name: "About Us", href: "/about" },
    { name: "Shipping & Delivery", href: "#" },
    { name: "Returns & Exchanges", href: "#" },
    { name: "Contact Us", href: "/contact" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms-of-service" },
    { name: "Cookie Settings", href: "/cookie-settings" },
  ];

  const paymentMethods = [
    "Visa",
    "Mastercard",
    "PayPal",
    "Apple Pay",
    "Google Pay",
  ];

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) return;

    setSubscribing(true);

    setTimeout(() => {
      setIsSubscribed(true);
      setEmail("");
      setSubscribing(false);

      setTimeout(() => setIsSubscribed(false), 2000);
    }, 1500);
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/category/get-active-category`,
        { cache: "no-store" }
      );

      const json = await res.json();

      if (json?.data && Array.isArray(json.data)) {
        setCategories(json.data.slice(0, 5));
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("CATEGORY API ERROR:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchCategories();
    }, 0);
  }, []);

  const handleClick = (cat: { _id: string; title: string }) => {
    router.push(`/category/${cat._id}?categoryName=${encodeURIComponent(cat.title)}`);
  };
  return (

    
    <footer className="bg-black text-gray-300 border-t border-gray-900 pt-16 pb-8 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">

        {/* Main Grid */}
        <m.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
        >
          {/* Column 1: Company Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6 flex items-center gap-2">
              {siteData.siteName}
            </h3>
            <div className="space-y-4 text-sm text-gray-400">
              <p className="leading-relaxed max-w-xs">
                Your premium destination for the latest electronics, gadgets, and tech accessories. Quality guaranteed.
              </p>

              <div className="pt-4 space-y-3">
                <a href={`mailto:${siteData.email}`} className="flex items-center gap-3 hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
                    <Mail size={14} />
                  </div>
                  {siteData.email}
                </a>
                <a href={`tel:+91${siteData.phone}`} className="flex items-center gap-3 hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
                    <Phone size={14} />
                  </div>
                  +91 {siteData.phone}
                </a>
                <div className="flex items-start gap-3 hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
                    <MapPin size={14} />
                  </div>
                  <span className="capitalize mt-1">{siteData.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Shop (Dynamic) */}
          <div>
            <h4 className="text-white font-bold mb-6">Trending Categories</h4>
            <ul className="space-y-3 text-sm">
              {categories.length > 0 ? categories.map((cat) => (
                <m.li key={cat._id} whileHover={{ x: 5 }}>
                  <button
                    onClick={() => handleClick(cat)}
                    className="text-gray-400 hover:text-gray-400 transition-colors flex items-start gap-2 capitalize"
                  >
                    <ArrowRight size={12} className="opacity-0 hover:opacity-100" />
                    {cat.title}
                  </button>
                </m.li>
              )) : (
                <li className="text-gray-600">Loading categories...</li>
              )}
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 className="text-white font-bold mb-6">Customer Care</h4>
            <ul className="space-y-3 text-sm">
              {customerService.map((link, i) => (
                <m.li key={i} whileHover={{ x: 5 }}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </a>
                </m.li>
              ))}
              <li>
                <a href="/track-order" className="text-gray-400 hover:text-white transition-colors">Track Your Order</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Social & Newsletter Info */}
          <div>
            <h4 className="text-white font-bold mb-6">Stay Connected</h4>
            <p className="text-gray-400 text-sm mb-6">
              Follow us on social media for updates and exclusive offers.
            </p>

            <div className="flex gap-3 mb-8">
              {socialItems.map(({ Icon, key }) => {
                let link = siteData.socialLinks[key] || "#";
                if (typeof link === "string" && link !== "#") {
                  link = link.trim();
                  if (!link.startsWith("http")) {
                    link = `https://${link}`;
                  }
                }
                return (
                  <m.a
                    key={key}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3 }}
                    className="w-10 h-10 rounded-lg bg-gray-900 hover:bg-gray-600 text-white flex items-center justify-center transition-all"
                  >
                    <Icon size={18} />
                  </m.a>
                );
              })}
            </div>
          </div>
        </m.div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-500 text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} {siteData.footerText || "Bixright. All rights reserved."}
          </div>

          {/* Payment Icons */}
          <div className="flex items-center gap-3">
            {paymentMethods.map(method => (
              <div key={method} className="bg-white px-2 py-1 rounded text-[10px] font-bold text-gray-800 border border-gray-200">
                {method}
              </div>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex gap-4 sm:gap-6">
            {legalLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-xs text-gray-500 hover:text-white transition-colors">
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
