"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
  Share2,
  X,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
} from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

export function ShareButton() {
  const [open, setOpen] = useState(false);

  const url = typeof window !== "undefined" ? window.location.href : "";

  const copyLink = async () => {
    await copyToClipboard(url);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-sm font-medium text-gray-800 hover:text-black transition"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* BACKDROP (to close on outside click) */}
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:fixed md:bg-transparent md:backdrop-blur-none"
              onClick={() => setOpen(false)}
            />

            {/* POPUP */}
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:absolute md:top-8 md:bottom-auto md:left-auto md:translate-x-0 md:translate-y-0 md:right-0 z-50 w-[90%] max-w-xs md:w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-semibold text-gray-900">Share Product</h4>
                <button 
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-5">
                <ShareIcon
                  icon={Facebook}
                  href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
                />
                <ShareIcon
                  icon={Twitter}
                  href={`https://twitter.com/intent/tweet?url=${url}`}
                />
                <ShareIcon
                  icon={Linkedin}
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
                />
                <ShareIcon icon={Mail} href={`mailto:?body=${url}`} />
              </div>

              <button
                onClick={copyLink}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all duration-200"
              >
                <Copy className="w-4 h-4" />
                Copy Link
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
}: {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center p-2 rounded-full border hover:bg-gray-100 transition"
    >
      <Icon className="w-4 h-4" />
    </a>
  );
}
