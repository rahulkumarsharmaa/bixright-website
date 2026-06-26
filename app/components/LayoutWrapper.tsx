"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide header and footer on login & signup pages
  const isAuthRoute = pathname === "/user/login" || pathname === "/user/signup";

  if (isAuthRoute) {
    return <main className="min-h-screen bg-brand-light">{children}</main>;
  }

  return (
    <>
      <header>
        <Header />
      </header>
      <main className="pt-20 md:pt-32 min-h-screen">{children}</main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
