// put these imports at top of the file (if not already present)
import { useState, useRef, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";

// easing definition (tweak if you want)
const easeOut = [0.22, 1, 0.36, 1];

// ...and the FILTERS const you already have
const FILTERS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

// Replace your current filter buttons block with this:
export default function FilterDropdown({
  filter,
  setFilter,
}: {
  filter: string;
  setFilter: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const focusedIndexRef = useRef<number>(-1);

  // close on outside click
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (
        !menuRef.current ||
        !btnRef.current ||
        menuRef.current.contains(e.target as Node) ||
        btnRef.current.contains(e.target as Node)
      )
        return;
      setOpen(false);
      focusedIndexRef.current = -1;
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        focusedIndexRef.current = Math.min(
          (focusedIndexRef.current ?? -1) + 1,
          FILTERS.length - 1
        );
        const el =
          menuRef.current?.querySelectorAll<HTMLButtonElement>(
            "button.filter-item"
          )[focusedIndexRef.current];
        el?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        focusedIndexRef.current = Math.max(
          (focusedIndexRef.current ?? 0) - 1,
          0
        );
        const el =
          menuRef.current?.querySelectorAll<HTMLButtonElement>(
            "button.filter-item"
          )[focusedIndexRef.current];
        el?.focus();
      } else if (e.key === "Enter") {
        const el = document.activeElement as HTMLElement | null;
        if (el?.dataset?.value) {
          const val = el.dataset.value;
          setFilter(val);
          setOpen(false);
          btnRef.current?.focus();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setFilter]);

  return (
    <>
      {/* MOBILE: native select for best responsiveness */}
      <div className="block md:hidden mb-2 ">
        <label className="sr-only">Filter orders</label>
        <select
          className="w-full border border-gray-300 text-gray-800 rounded-lg px-3 py-2 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* DESKTOP: custom dropdown */}
      <div className="hidden md:flex justify-center mb-2">
        <div className="relative">
          <button
            ref={btnRef}
            onClick={() => {
              setOpen((s) => !s);
              focusedIndexRef.current = FILTERS.findIndex(
                (x) => x.value === filter
              );
            }}
            aria-haspopup="menu"
            aria-expanded={open}
            className="inline-flex items-center justify-center  px-4 py-2 rounded-full text-sm w-38 font-medium transition-all bg-brand-light border border-gray-300 hover:shadow-sm focus:shadow-outline"
          >
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium text-black`}
            >
              {FILTERS.find((f) => f.value === filter)?.label ?? "Filter"}
            </span>
            <svg
              className={`w-4 h-4  transform transition-transform text-black ${
                open ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M10 12a1 1 0 01-.7-.3l-4-4a1 1 0 111.4-1.4L10 9.58l3.3-3.28a1 1 0 111.4 1.42l-4 4A1 1 0 0110 12z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <AnimatePresence>
            {open && (
              <>
                <m.div
                  ref={menuRef}
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute left-1/2 -translate-x-[60%] mt-1 w-[min(160px,70vw)] bg-brand-light  border border-gray-200 rounded-3xl shadow-lg z-50 overflow-hidden"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="p-3 grid gap-2">
                    {FILTERS.map((f, i) => {
                      const active = filter === f.value;
                      return (
                        <button
                          key={f.value}
                          data-value={f.value}
                          onClick={() => {
                            setFilter(f.value);
                            setOpen(false);
                            btnRef.current?.focus();
                          }}
                          onMouseEnter={() => (focusedIndexRef.current = i)}
                          className={`filter-item w-full  text-left px-4 py-2 rounded-4xl text-sm transition-all flex items-center justify-start ${
                            active
                              ? "bg-brand text-brand-light shadow-lg"
                              : "bg-brand-light text-brand hover:bg-brand/10"
                          }`}
                        >
                          <span>{f.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </m.div>

                {/* subtle backdrop to catch clicks (optional) */}
                <m.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.0 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40"
                  onClick={() => setOpen(false)}
                />
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
