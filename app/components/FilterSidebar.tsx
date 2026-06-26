"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Star } from "lucide-react";
import { Option, priceOption } from "../types/product";
import { useFilter } from "@/app/context/FilterContext";
import { m, AnimatePresence } from "framer-motion";

interface Props {
  options?: {
    size?: Option[];
    color?: Option[];
    brand?: Option[];
    price?: priceOption;
  };
}

export default function FilterSidebar({ options }: Props) {
  return (
    <div className="w-full space-y-6">
      {/* Price Filter */}
      <FilterSection title="Price" defaultOpen={true}>
        <PriceFilter range={options?.price} />
      </FilterSection>

      {/* Brand Filter */}
      {options?.brand && options.brand.length > 0 && (
        <FilterSection title="Brands" defaultOpen={true}>
          <CheckboxGroup type="brand" options={options.brand} />
        </FilterSection>
      )}

      {/* Color Filter */}
      {options?.color && options.color.length > 0 && (
        <FilterSection title="Colors" defaultOpen={true}>
          <ColorGroup type="color" options={options.color} />
        </FilterSection>
      )}

      {/* Size Filter */}
      {options?.size && options.size.length > 0 && (
        <FilterSection title="Size" defaultOpen={true}>
          <CheckboxGroup type="size" options={options.size} />
        </FilterSection>
      )}

      {/* Example Rating (Static for visual "Amazon feel" if data not available) */}
      {/* <FilterSection title="Avg. Customer Review" defaultOpen={true}>
        <div className="space-y-2 cursor-pointer">
          {[4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded">
              <div className="flex text-yellow-500 text-sm">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < stars ? "currentColor" : "none"} className={i < stars ? "" : "text-gray-300"} />
                ))}
              </div>
              <span className="text-sm text-gray-600">& Up</span>
            </div>
          ))}
        </div>
      </FilterSection> */}
    </div>
  );
}

// ---------------- SUB-COMPONENTS ---------------- //

function FilterSection({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 pb-5 last:border-0 last:pb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full font-bold text-sm text-brand/90 mb-2 hover:text-brand transition-colors"
      >
        {title}
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-1">
              {children}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckboxGroup({ type, options }: { type: string, options: Option[] }) {
  const { createSelectedObject } = useFilter();
  const [selected, setSelected] = useState<string[]>([]);
  // If list is long, show first 5 and "Show more" button
  const [showAll, setShowAll] = useState(false);

  const visibleOptions = showAll ? options : options.slice(0, 6);

  useEffect(() => {
    createSelectedObject(type, selected);
  }, [selected, type]);

  const handleChange = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-1.5">
      {visibleOptions.map(opt => (
        <label key={opt.id} className="flex items-start gap-2.5 cursor-pointer group hover:bg-brand-light p-1 rounded -ml-1">
          <div className="relative flex items-center mt-0.5">
            <input
              type="checkbox"
              className="peer h-4 w-4 shrink-0 rounded-sm border-gray-400 text-gray-600 focus:ring-gray-600 focus:ring-offset-0 cursor-pointer"
              checked={selected.includes(opt.id)}
              onChange={() => handleChange(opt.id)}
            />
          </div>
          <span className={`text-sm select-none ${selected.includes(opt.id) ? "font-semibold text-gray-900" : "text-gray-700 group-hover:text-gray-900"}`}>
            {opt.name}
          </span>
        </label>
      ))}

      {options.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs font-medium text-gray-600 hover:text-gray-800 flex items-center gap-1 mt-2 pl-6"
        >
          {showAll ? <><ChevronUp size={12} /> Show Less</> : <><ChevronDown size={12} /> See {options.length - 6} more</>}
        </button>
      )}
    </div>
  );
}

function ColorGroup({ type, options }: { type: string, options: Option[] }) {
  const { createSelectedObject } = useFilter();
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    createSelectedObject(type, selected);
  }, [selected, type]);

  const handleChange = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        // Try to infer color code from name, or default to gray
        // In a real app, `opt` should probably have a `hex` or `code` property.
        // Assuming opt.name contains the color name.
        const colorMap: Record<string, string> = {
          "black": "#000000", "white": "#ffffff", "red": "#ef4444",
          "blue": "#3b82f6", "green": "#22c55e", "yellow": "#eab308",
          "purple": "#a855f7", "pink": "#ec4899", "gray": "#6b7280",
          "grey": "#6b7280", "orange": "#f97316", "silver": "#C0C0C0", "gold": "#FFD700"
        };
        const bg = colorMap[opt.name.toLowerCase()] || "#e5e7eb";
        const isWhite = opt.name.toLowerCase() === "white";

        return (
          <button
            key={opt.id}
            onClick={() => handleChange(opt.id)}
            className={`w-8 h-8 rounded-full border shadow-sm flex items-center justify-center transition-all ${selected.includes(opt.id)
              ? "ring-2 ring-gray-600 ring-offset-2 scale-110"
              : "hover:ring-2 hover:ring-gray-300 hover:scale-105"
              }`}
            style={{ backgroundColor: bg }}
            title={opt.name}
          >
            {/* Checkmark for contrast */}
            {selected.includes(opt.id) && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={isWhite ? "black" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
                <path d="M3.5 6L5 8.5L9 3.5" />
              </svg>
            )}
          </button>
        )
      })}
    </div>
  );
}

function PriceFilter({ range }: { range?: priceOption }) {
  const { createSelectedObject } = useFilter();
  // Default range if not provided
  const minLimit = range?.min ?? 0;
  const maxLimit = range?.max ?? 100000;

  const [minVal, setMinVal] = useState<number>(minLimit);
  const [maxVal, setMaxVal] = useState<number>(maxLimit);
  const minValRef = useState(minLimit); // visual tracking if needed, simplified here

  // Update local state when options change
  useEffect(() => {
    if (range) {
      setMinVal(range.min ?? 0);
      setMaxVal(range.max ?? 100000);
    }
  }, [range]);

  const handleApply = () => {
    createSelectedObject("minPrice", [minVal]);
    createSelectedObject("maxPrice", [maxVal]);
  };

  // Convert to percentage for slider
  const getPercent = (value: number) => {
    return Math.round(((value - minLimit) / (maxLimit - minLimit)) * 100);
  };

  return (
    <div className="space-y-6 pt-2">
      <style jsx>{`
        .range-slider {
          position: relative;
          width: 100%;
          height: 4px; /* Track height matched to h-1 */
        }
        .thumb-input {
          position: absolute;
          width: 100%;
          height: 0;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          outline: none;
          -webkit-appearance: none;
          z-index: 30;
        }
        .thumb-input::-webkit-slider-thumb {
          pointer-events: auto;
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          border: 2px solid black;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          /* Adjusted centering: Move down slightly from -8px */
          margin-top: -4px; 
        }
        .thumb-input::-moz-range-thumb {
          pointer-events: auto;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          border: 2px solid black;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border: none;
          border: 2px solid black;
          /* Mozilla might behave differently, usually centers automatically but let's check */
          transform: translateY(0); 
        }
        .thumb-z-40 { z-index: 40; }
        /* Remove default track */
        .thumb-input::-webkit-slider-runnable-track { -webkit-appearance: none; background: transparent; }
        .thumb-input::-moz-range-track { background: transparent; }
      `}</style>

      {/* Slider Visuals */}
      <div className="range-slider bg-brand-light rounded-full h-1 mt-4 mb-8 relative flex items-center">
        {/* Active Range Bar */}
        <div
          className="absolute h-full bg-brand rounded-full z-10"
          style={{
            left: `${getPercent(minVal)}%`,
            width: `${getPercent(maxVal) - getPercent(minVal)}%`,
          }}
        />

        {/* Left Input */}
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={minVal}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), maxVal - 1);
            setMinVal(value);
          }}
          className="thumb-input"
        />

        {/* Right Input */}
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={maxVal}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), minVal + 1);
            setMaxVal(value);
          }}
          className="thumb-input thumb-z-40"
        />
      </div>

      {/* Manual Inputs */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand text-xs">₹</span>
            <input
              type="number"
              min={minLimit}
              max={maxLimit}
              value={minVal}
              onChange={(e) => {
                const val = Math.max(minLimit, Math.min(Number(e.target.value), maxLimit));
                setMinVal(val);
              }}
              className="w-full pl-6 pr-2 py-2 border border-brand/50 rounded-4xl text-xs font-medium  outline-none transition-all bg-gray-50/50"
            />
          </div>
          <span className="text-gray-300">-</span>
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand text-xs">₹</span>
            <input
              type="number"
              min={minLimit}
              max={maxLimit}
              value={maxVal}
              onChange={(e) => {
                const val = Math.min(maxLimit, Math.max(Number(e.target.value), minLimit));
                setMaxVal(val);
              }}
              className="w-full pl-6 pr-2 py-2 border border-brand/50 rounded-4xl text-xs font-medium  outline-none transition-all bg-gray-50/50"
            />
          </div>
        </div>
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-brand text-brand-light text-xs font-bold rounded-4xl hover:bg-brand active:scale-95 transition-all shadow-sm"
        >
          GO
        </button>
      </div>
    </div>
  )
}
