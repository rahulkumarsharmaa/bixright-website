"use client";

import HomeTopSlider from "@/app/components/Home/HomeTopslider";
import RecentlyAddedProducts from "@/app/components/Home/RecentlyAddedProducts";
import HomeShopButtons from "@/app/components/Home/HomeShopButtons";
import BestSellers from "@/app/components/Home/BestSellers";
import PromoBanner from "@/app/components/Home/PromoBanner";
import FlashDeals from "@/app/components/Home/FlashDeals";
import TrendingItems from "@/app/components/Home/TrendingItems";
// import ServiceFeatures from "@/app/components/Home/ServiceFeatures";
// import Newsletter from "@/app/components/Home/Newsletter";

const HomeLayout = () => {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-12 md:gap-10 bg-gray-50/50">

      {/* 1. Category Row */}
      <div className="relative z-10">
        <HomeTopSlider />
      </div>

      {/* 2. Flash Deals Section */}
      <FlashDeals />

      {/* 3. Best Sellers Carousel */}
      {/* <BestSellers /> */}

      {/* 4. Promotional Banners */}
      {/* <PromoBanner /> */}

      {/* 5. Trending Items (Bento Grid) */}
      <TrendingItems />

      {/* 6. Recently Added / New Arrivals Grid */}
      <div className="relative z-0">
        <RecentlyAddedProducts />
      </div>

      {/* 7. Browse Categories Grid (Visual Navigation) */}
      <div className="pt-2 border-t border-gray-200">
        <HomeShopButtons />
      </div>

      {/* 8. Service Features (Trust Signals) */}
      {/* <ServiceFeatures /> */}

      {/* 9. Newsletter Subscription */}
      {/* <Newsletter /> */}

    </div>
  );
};

export default HomeLayout;
