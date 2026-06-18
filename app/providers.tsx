"use client";

import { CartProvider } from "@/app/context/CartContext";
import { AuthProvider } from "@/app/context/AuthContext";
import { WishlistProvider } from "@/app/context/WishlistContext";
import { FilterProvider } from "./context/FilterContext";
import { PolicyProvider } from "./components/PolicyProvider";
import { SiteProvider } from "./context/siteSetting";

import { LazyMotion, domAnimation } from "framer-motion";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <SiteProvider>
        <PolicyProvider>
          <AuthProvider>
            <FilterProvider>
              <CartProvider>
                <WishlistProvider>{children}</WishlistProvider>
              </CartProvider>
            </FilterProvider>
          </AuthProvider>
        </PolicyProvider>
      </SiteProvider>
    </LazyMotion>
  );
}
