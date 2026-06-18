"use client";

import { useRef, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Option, priceOption } from "../types/product";
import { useFilter } from "@/app/context/FilterContext";

interface Props {
  title: string;
  type?: "options" | "price";
  options?: Option[];
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  priceOption?: priceOption;
}

export default function FilterDropdown({
  title,
  type = "options",
  options = [],
  open,
  onToggle,
  onClose,
  priceOption,
}: Props) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const { createSelectedObject } = useFilter();
  useEffect(() => {
    // createSelectedObject(title, selected);
    createSelectedObject(title, selected);
  }, [selected]);

  const toggleSelection = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };
  // console.log(selected);
  // CLICK OUTSIDE CLOSE
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  const stopInsideClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="relative inline-block ">
      <button
        onClick={handleButtonClick}
        className="text-sm flex items-center gap-1 py-1 font-medium text-black capitalize"
      >
        {title}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          ref={dropdownRef}
          onClick={stopInsideClick}
          className="absolute left-0 mt-2 bg-white shadow-xl border border-gray-200 rounded-md 
                     w-[180px] max-h-[260px] overflow-y-auto custom-scrollbar 
                     z-9999 p-3"
        >
          {type === "options" &&
            options.map((opt) => (
              <label
                key={opt.id}
                className="flex items-center gap-2 py-1 text-sm cursor-pointer hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  onChange={() => toggleSelection(opt.id)}
                />

                <span>{opt.name}</span>
              </label>
            ))}

          {type === "price" && priceOption && (
            <PriceUI priceOption={priceOption} />
          )}
        </div>
      )}
    </div>
  );
}

function PriceUI({ priceOption }: { priceOption: priceOption }) {
  const [min, setMin] = useState<number>(priceOption.min);
  const max = priceOption.max;
  const { createSelectedObject } = useFilter();

  useEffect(() => {
    createSelectedObject("minPrice", [min]);
  }, [min]);

  return (
    <>
      <div className="flex justify-between text-xs font-semibold mb-2">
        <span>Minimum</span>
        <span>Maximum</span>
      </div>

      <div className="flex justify-between mb-4 gap-4">
        <div className="flex items-center border rounded px-2 py-1 w-full">
          <span className="text-xs">₹</span>
          <input
            type="text"
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
            className="w-full text-sm outline-none ml-1"
          />
        </div>

        <div className="flex items-center border rounded px-2 py-1 w-full opacity-50 pointer-events-none">
          <span className="text-xs">₹</span>
          <input
            type="text"
            value={max}
            readOnly
            className="w-full text-sm outline-none ml-1"
          />
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={max}
        value={min}
        onChange={(e) => setMin(Number(e.target.value))}
        className="w-full mb-1"
      />

      <div className="flex justify-between text-xs text-gray-600">
        <span>₹{min}</span>
        <span>₹{max}</span>
      </div>
    </>
  );
}
