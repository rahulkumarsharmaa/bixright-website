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
            {/* POPUP */}
            <m.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-8 z-50 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold">Share</h4>
                <button onClick={() => setOpen(false)}>
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-4">
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
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-gray-50 transition"
              >
                <Copy className="w-4 h-4" />
                Copy link
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
