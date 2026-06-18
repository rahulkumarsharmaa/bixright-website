import HeroCarousel from "@/app/components/Home/Hero-carousel";
import HomeLayout from "@/app/components/Home/HomeLayout";

export default function Home() {
  return (
    <div className="bg-gray-100 font-sans max-w-full overflow-x-hidden">
      <HeroCarousel />
      <HomeLayout />
    </div>
  );
}
