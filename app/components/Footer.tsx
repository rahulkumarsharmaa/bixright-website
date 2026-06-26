"use client";

import { useEffect, useState } from "react";
import { m } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
import LogoImage from "@/public/assets/Bixright.png";

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
    { name: "Shipping Policy", href: "/shipping-policy" },
    { name: "Return Policy", href: "/return-policy" },
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


    <footer className="bg-black text-brand-light pt-16 pb-8 font-sans">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">

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
            <Link href="/" className="inline-block mb-6 group">
              <Image
                src={siteData?.logoUrl ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${siteData.logoUrl}` : LogoImage}
                alt={siteData.siteName || "Bixright"}
                width={140}
                height={40}
                className="w-32 h-auto object-contain group-hover:opacity-100 transition-opacity duration-300"
              />
            </Link>
            <div className="space-y-4 text-sm text-brand-light/80">
              <p className="leading-relaxed max-w-xs">
                Your premium destination for the latest electronics, gadgets, and tech accessories. Quality guaranteed.
              </p>

              <div className="pt-4 space-y-3">
                <a href={`mailto:${siteData.email}`} className="flex items-center gap-3 hover:text-brand-light transition-colors">
                  <div className="w-8 h-8 rounded-full bg-brand/60 flex items-center justify-center">
                    <Mail size={14} />
                  </div>
                  {siteData.email}
                </a>
                <a href={`tel:+91${siteData.phone}`} className="flex items-center gap-3 hover:text-brand-light transition-colors">
                  <div className="w-8 h-8 rounded-full bg-brand/60 flex items-center justify-center">
                    <Phone size={14} />
                  </div>
                  +91 {siteData.phone}
                </a>
                <div className="flex items-start gap-3 hover:text-brand-light transition-colors">
                  <div className="w-8 h-8 rounded-full bg-brand/60 flex items-center justify-center shrink-0">
                    <MapPin size={14} />
                  </div>
                  <span className="capitalize mt-1">{siteData.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Shop (Dynamic) */}
          <div>
            <h4 className="text-brand-light/95 font-bold mb-6">Trending Categories</h4>
            <ul className="space-y-3 text-sm">
              {categories.length > 0 ? categories.map((cat) => (
                <m.li key={cat._id} whileHover={{ x: 5 }}>
                  <button
                    onClick={() => handleClick(cat)}
                    className="group text-brand-light/80 hover:text-brand-light/80 transition-colors flex items-center gap-2 capitalize"
                  >
                    {cat.title}
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100" />
                  </button>
                </m.li>
              )) : (
                <li className="text-brand/50">Loading categories...</li>
              )}
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 className="text-brand-light/95 font-bold mb-6">Customer Care</h4>
            <ul className="space-y-3 text-sm">
              {customerService.map((link, i) => (
                <m.li key={i} whileHover={{ x: 5 }}>
                  <a href={link.href} className="text-brand-light/80 hover:text-brand-light/80 transition-colors">
                    {link.name}
                  </a>
                </m.li>
              ))}
              <li>
                <a href="/track-order" className="text-brand-light/80 hover:text-brand-light/80 transition-colors">Track Your Order</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Social & Newsletter Info */}
          <div>
            <h4 className="text-brand-light/95 font-bold mb-6">Stay Connected</h4>
            <p className="text-brand-light/80 text-sm mb-6">
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
                    className="w-10 h-10 rounded-full bg-brand/60 text-brand-light flex items-center justify-center transition-all"
                  >
                    <Icon size={18} />
                  </m.a>
                );
              })}
            </div>
          </div>
        </m.div>

        {/* Bottom Bar */}
        <div className="border-t border-brand-light/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-brand-light/80 text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} {siteData.footerText || "Bixright. All rights reserved."}
          </div>

          {/* Payment Icons */}
          {/* <div className="flex items-center gap-3">
            {paymentMethods.map(method => (
              <div key={method} className="bg-white px-2 py-1 rounded text-[10px] font-bold text-gray-800 border border-brand-light">
                {method}
              </div>
            ))}
          </div> */}

          {/* Legal Links */}
          <div className="flex gap-4 sm:gap-6">
            {legalLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-xs text-brand-light/80 hover:text-white transition-colors">
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
