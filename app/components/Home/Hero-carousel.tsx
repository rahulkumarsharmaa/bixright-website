"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Popup from "@/app/popup/page";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  _id: string;
  image: string;
  title: string;
  subtitle?: string;
}

const HeroCarousel = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch slides
  useEffect(() => {
    const loadSlides = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/banner/get-active-hero-banner`,
          { cache: "no-store" }
        );
        const response = await res.json();

        if (response && Array.isArray(response.data)) {
          const mappedSlides = response.data.map(
            (item: { _id: string; title: string; subTitle?: string; imageUrl: string }) => ({
              _id: item._id,
              title: item.title,
              subtitle: item.subTitle,
              image: item.imageUrl,
            })
          );
          setSlides(mappedSlides);
        } else {
          setSlides([]);
        }
      } catch (err) {
        setError("Failed to load banners");
        setSlides([]);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSlides();
  }, []);

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = slides.length - 1;
      if (nextIndex >= slides.length) nextIndex = 0;
      return nextIndex;
    });
  }, [slides.length]);

  // Autoplay
  useEffect(() => {
    if (slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      paginate(1);
    }, 6000); // 6 seconds per slide
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length, paginate]);

  // Pause on hover
  const pauseAutoPlay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const resumeAutoPlay = () => {
    if (slides.length <= 1) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => paginate(1), 6000);
  };


  if (error || (slides.length === 0 && !loading)) {
    return null;
  }

  if (loading) {
    return (
      <div className="w-full h-[50vh] md:h-[60vh] lg:h-[80vh] bg-gray-100 flex items-center justify-center animate-pulse">
        <div className="w-10 h-10 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-[50vh] xs:h-[55vh] md:h-[65vh] lg:h-[80vh] xl:h-[85vh] overflow-hidden bg-black group"
      onMouseEnter={pauseAutoPlay}
      onMouseLeave={resumeAutoPlay}
    >
      <Popup />

      {/* Slides */}
      <div className="absolute inset-0 w-full h-full pt-[inherit]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <m.div
            key={currentIndex}
            custom={direction}
            variants={{
              enter: {
                opacity: 0,
                scale: 1.05,
              },
              center: {
                opacity: 1,
                scale: 1,
                transition: {
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1] // Apple-like ease
                }
              },
              exit: {
                opacity: 0,
                scale: 1,
                transition: {
                  duration: 0.6,
                  ease: "easeIn"
                }
              }
            }} // Using Fade/Scale instead of slide for smoother feel
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image */}
            <div className="relative w-full h-full">
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${slides[currentIndex].image}`}
                alt={slides[currentIndex].title}
                fill
                priority={true}
                className="object-cover object-center"
                sizes="100vw"
              />
            </div>
          </m.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows (Desktop) */}
      <button
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-black hover:scale-110 focus:outline-none"
        onClick={() => paginate(-1)}
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      <button
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-black hover:scale-110 focus:outline-none"
        onClick={() => paginate(1)}
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2 md:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`transition-all duration-300 rounded-full h-1.5 md:h-2 ${index === currentIndex
              ? "w-8 md:w-10 bg-white"
              : "w-1.5 md:w-2 bg-white/40 hover:bg-white/70"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
