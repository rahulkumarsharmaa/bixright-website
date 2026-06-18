"use client";

import { startTransition, useEffect, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Instagram, Facebook, MessageCircle, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { json } from "stream/consumers";
import type { TagItem } from "@/app/types/tag";

type popupData = {
  _id: string;
  title: string;
  description: string;
  image: string;
  otherText: string;
};

export default function Page() {
  const router = useRouter();
  const [tags, setTags] = useState<TagItem[]>([]);
  const [popupData, setPopUpData] = useState<popupData>({} as popupData);
  const [open, setOpen] = useState<boolean>(false);

  // const fetchPopupData = async () => {
  //   try {
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/popup/get`, {
  //       cache: "no-store",
  //     });
  //     const json = await res.json();
  //     if (json?.popup && json.success) {
  //       setPopUpData(json.popup);
  //     } else {
  //       setPopUpData({
  //         _id: "",
  //         title: "",
  //         description: "",
  //         image: "",
  //         otherText: "",
  //       });
  //     }
  //   } catch {
  //     setPopUpData({
  //       _id: "",
  //       title: "",
  //       description: "",
  //       image: "",
  //       otherText: "",
  //     });
  //   }
  // };

  // const fetchTags = async () => {
  //   try {
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/tags/get-tags?page=1&limit=2`,
  //       { cache: "no-store" }
  //     );
  //     const json = await res.json();
  //     if (Array.isArray(json.data)) {
  //       setTags(json.data);
  //     } else {
  //       setTags([]);
  //     }
  //   } catch {
  //     setTags([]);
  //   }
  // };

  // useEffect(() => {
  //   startTransition(() => {
  //     fetchPopupData();
  //     fetchTags();
  //   });
  // }, []);

  const handleClick = (tag: TagItem) => {
    const slug = tag.title.trim().toLowerCase().replace(/\s+/g, "-");
    router.push(`/tags/${slug}?Id=${tag._id}`);
  };

  useEffect(() => {
    const escHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    if (open) document.body.style.overflow = "hidden";

    window.addEventListener("keydown", escHandler);
    return () => {
      window.removeEventListener("keydown", escHandler);
      document.body.style.overflow = "unset";
    };
  }, [open]);

  useEffect(() => {
    const sessionShown = sessionStorage.getItem("popupShown");

    if (!sessionShown) {
      setTimeout(() => {
        startTransition(() => setOpen(true));
      }, 1000);

      sessionStorage.setItem("popupShown", "true");
    } else {
      startTransition(() => setOpen(false));
    }
  }, []);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />
      {!(popupData.image === "") && (
        <AnimatePresence mode="wait">
          {open && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center p-3 sm:p-4"
              onClick={() => setOpen(false)}
            >
              <m.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 24,
                  mass: 0.8,
                }}
                className="relative bg-gradient-to-br from-[#f8f3ef] via-[#f6efe9] to-[#f4ebe5] w-[350px] sm:w-[360px] md:w-[560px] lg:w-[600px] xl:w-[850px] max-w-[850px] h-[650px] sm:h-[660px] md:h-[580px] lg:h-[560px] xl:h-[480px] max-h-[650px] overflow-hidden flex flex-col md:flex-row"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-3 right-3 sm:top-2 sm:right-2 z-50 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full  text-gray-900 hover:scale-110 transition-all duration-200 cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <m.div
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="w-full md:w-1/2 h-[40vh] sm:h-[45vh] md:h-auto relative overflow-hidden"
                >
                  <Image
                    src={popupData.image || ""}
                    alt={popupData.title || "Bixright Electronics"}
                    fill
                    className="object-cover object-top hover:scale-105 transition-transform duration-700 ease-out"
                    priority
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent md:hidden"
                  />
                </m.div>

                <div
                  className="w-full md:w-1/2 p-5 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-center overflow-y-auto hide-scrollbar space-y-3 sm:space-y-1"
                >
                  <m.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="inline-block px-3 py-1.5 border border-gray-800/70 text-[10px] sm:text-xs font-medium tracking-wide rounded-full w-fit"
                  >
                    Bixright Electronics shop
                  </m.span>

                  <m.h1
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light leading-tight tracking-tight text-gray-900"
                  >
                    {popupData.title || (
                      <span className="inline-block animate-pulse bg-gray-300 h-6 w-3/4 rounded"></span>
                    )}
                  </m.h1>

                  <m.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                    className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed"
                  >
                    {popupData.description || (
                      <span className="inline-block animate-pulse bg-gray-300 h-4 w-full rounded "></span>
                    )}
                  </m.p>

                  {popupData.otherText && (
                    <m.p
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="text-gray-600 text-xs sm:text-sm leading-relaxed"
                    >
                      {popupData.otherText}
                    </m.p>
                  )}

                  <m.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                    className="flex flex-col md:inline-flex-row gap-3 pt-1"
                  >
                    {tags.length > 0 ? (
                      tags.map((tag, index) => (
                        <m.button
                          key={tag._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          onClick={() => handleClick(tag)}
                          className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-900 hover:text-gray-600 transition-all duration-200 "
                        >
                          <span className="underline underline-offset-4 capitalize cursor-pointer">
                            {tag.title}
                          </span>
                          <span className="inline-block group-hover:translate-x-1 transition-transform duration-200">
                            →
                          </span>
                        </m.button>
                      ))
                    ) : (
                      <span className="text-xs sm:text-sm text-gray-500 animate-pulse">
                        Loading collections...
                      </span>
                    )}
                  </m.div>

                  <m.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="flex gap-4 sm:gap-5 pt-2 sm:pt-3"
                  >
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:scale-110 transition-transform duration-200 cursor-pointer"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-5 h-5 text-gray-900 hover:text-gray-600 transition-colors" />
                    </a>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:scale-110 transition-transform duration-200"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-5 h-5 text-gray-900 hover:text-gray-600 transition-colors cursor-pointer" />
                    </a>
                    <a
                      href="https://wa.me/919999999999"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:scale-110 transition-transform duration-200"
                      aria-label="WhatsApp"
                    >
                      <MessageCircle className="w-5 h-5 text-gray-900 hover:text-gray-600 transition-colors cursor-pointer" />
                    </a>
                  </m.div>
                </div>
              </m.div>
            </m.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
