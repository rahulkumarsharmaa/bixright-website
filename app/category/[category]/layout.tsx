"use client";

import { m, AnimatePresence } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
}

export default function CategoryLayout({ children }: LayoutProps) {
  return (
    <AnimatePresence mode="wait">
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-100 text-black "
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}
