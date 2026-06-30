"use client";

import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
  Share2,
  X,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Check,
  MessageCircle,
  Send,
} from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

export function ShareButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const url = typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const copyLink = async () => {
    await copyToClipboard(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setOpen(false);
    }, 1000);
  };

  const mobileVariants = {
    hidden: { y: "100%" },
    visible: { y: 0 },
    exit: { y: "100%" },
  };

  const desktopVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 8, scale: 0.98 },
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-1.5 px-4 py-2 bg-brand/5 hover:bg-brand/10 border border-brand/10 hover:border-brand/30 rounded-full font-bold text-xs sm:text-sm text-brand transition-all duration-300 active:scale-95 cursor-pointer shadow-xs"
      >
        <Share2 className="w-3.5 h-3.5" />
        Share
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* BACKDROP */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[9998] bg-black/45 md:z-40 md:fixed md:bg-transparent md:backdrop-blur-none"
              onClick={() => setOpen(false)}
            />

            {/* POPUP / DRAWER */}
            <m.div
              variants={isMobile ? mobileVariants : desktopVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={
                isMobile
                  ? { type: "tween", ease: "easeOut", duration: 0.18 }
                  : { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
              }
              className={`bg-white border border-brand/10 shadow-2xl md:bg-white/95 md:backdrop-blur-md will-change-transform
                ${isMobile
                  ? "fixed bottom-0 inset-x-0 w-full rounded-t-3xl p-6 pb-8 border-b-0 z-[9999]"
                  : "absolute top-10 right-0 w-60 rounded-2xl p-4 z-50"
                }`}
            >
              {/* Drag Handle on Mobile */}
              {isMobile && (
                <div className="w-12 h-1 bg-brand/10 rounded-full mx-auto mb-5" />
              )}

              {/* Header */}
              <div className="flex items-center justify-between mb-4 px-0.5">
                <span className="text-sm md:text-base font-extrabold text-brand/90">Share Product</span>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-full hover:bg-brand/5 text-brand/60 hover:text-brand transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 md:w-3.5 md:h-3.5" />
                </button>
              </div>

              {/* Social Icons Row */}
              <div className="flex flex-wrap items-center justify-center gap-3.5 md:gap-2.5 mb-5 md:mb-4">
                <ShareIcon
                  icon={MessageCircle}
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`}
                  hoverClass="hover:bg-[#25D366] hover:text-white text-[#25D366] bg-[#25D366]/5 border-[#25D366]/10"
                  title="WhatsApp"
                />
                <ShareIcon
                  icon={Send}
                  href={`https://t.me/share/url?url=${encodeURIComponent(url)}`}
                  hoverClass="hover:bg-[#0088cc] hover:text-white text-[#0088cc] bg-[#0088cc]/5 border-[#0088cc]/10"
                  title="Telegram"
                />
                <ShareIcon
                  icon={Facebook}
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                  hoverClass="hover:bg-[#1877F2] hover:text-white text-[#1877F2] bg-[#1877F2]/5 border-[#1877F2]/10"
                  title="Facebook"
                />
                <ShareIcon
                  icon={Twitter}
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`}
                  hoverClass="hover:bg-black hover:text-white text-black bg-black/5 border-black/10"
                  title="Twitter"
                />
                <ShareIcon
                  icon={Linkedin}
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                  hoverClass="hover:bg-[#0A66C2] hover:text-white text-[#0A66C2] bg-[#0A66C2]/5 border-[#0A66C2]/10"
                  title="LinkedIn"
                />
                <ShareIcon
                  icon={Mail}
                  href={`mailto:?body=${encodeURIComponent(url)}`}
                  hoverClass="hover:bg-[#EA4335] hover:text-white text-[#EA4335] bg-[#EA4335]/5 border-[#EA4335]/10"
                  title="Email"
                />
              </div>

              {/* Copy Link Button */}
              <button
                onClick={copyLink}
                className={`w-full flex items-center justify-center gap-1.5 px-4 py-2.5 md:px-3 md:py-2 text-sm md:text-xs font-bold border rounded-full transition-all duration-300 active:scale-[0.97] cursor-pointer
                  ${copied
                    ? "bg-green-50 text-green-700 border-green-200 shadow-xs"
                    : "border-brand/10 bg-white hover:bg-brand/5 text-brand hover:border-brand/30"
                  }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 md:w-3 md:h-3" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 md:w-3 md:h-3" />
                    Copy Link
                  </>
                )}
              </button>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ShareIcon({
  icon: Icon,
  href,
  hoverClass,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  hoverClass: string;
  title: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      className={`w-11 h-11 md:w-9 md:h-9 flex items-center justify-center rounded-full border transition-all duration-300 ${hoverClass}`}
    >
      <Icon className="w-5 h-5 md:w-4 md:h-4" />
    </a>
  );
}
