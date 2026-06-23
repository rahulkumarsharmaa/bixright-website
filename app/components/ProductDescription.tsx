"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription({
  description,
}: ProductDescriptionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const timeoutRef = useRef<any>(null);

  const points = description
    ? description
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
    : [];

  const handleScroll = () => {
    setIsScrolling(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 800); // Hide scrollbar after 800ms of inactivity
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full py-6 my-2 border-y border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left focus:outline-none"
      >
        <h4 className="text-lg font-semibold text-gray-900">
          Product Description
        </h4>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        onScroll={handleScroll}
        className={`text-sm text-gray-600 leading-7 whitespace-pre-line pr-2 transition-all duration-300 overflow-y-auto ${
          isOpen ? "h-48 mt-3 opacity-100" : "h-0 opacity-0 overflow-hidden"
        } ${isScrolling ? "custom-scrollbar" : "hide-scrollbar"}`}
      >
        {points.length > 1 ? (
          <ul className="space-y-3">
            {points.map((point, index) => {
              const cleanPoint = point.replace(/^[•\-\*\s]+/, "");
              return (
                <li key={index} className="flex items-start gap-2.5">
                  <span className="text-brand mt-1.5 flex-shrink-0 text-[10px]">•</span>
                  <span className="text-sm text-gray-600 leading-6">{cleanPoint}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          description
        )}
      </div>
    </div>
  );
}