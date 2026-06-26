import HeroCarousel from "@/app/components/Home/Hero-carousel";
import HomeLayout from "@/app/components/Home/HomeLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bixright | Premium Electronics & Smart Accessories Store",
  description: "Shop premium electronics, audio devices, best earbuds, gaming cabinets, CPUs, and office essentials at Bixright. Great deals, secure checkout & free shipping!",
  openGraph: {
    title: "Bixright | Premium Electronics & Smart Accessories Store",
    description: "Shop premium electronics, audio devices, best earbuds, gaming cabinets, CPUs, and office essentials at Bixright.",
    url: "https://bixright.com",
    siteName: "Bixright",
    images: [
      {
        url: "/assets/Bixright.png",
        width: 800,
        height: 600,
        alt: "Bixright Store Logo",
      },
    ],
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="bg-brand-light font-sans max-w-full overflow-x-hidden">
      <HeroCarousel />
      <HomeLayout />
    </div>
  );
}
