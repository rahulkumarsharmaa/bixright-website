"use client";

import Link from "next/link";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Phone,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  MapPin
} from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { useMediaQuery } from "react-responsive";
import { useSite } from "../context/siteSetting";
import type { Product } from "@/app/types/product";
import LogoImage from "@/public/assets/Bixright.png"

interface MainCategory {
  _id: string;
  title: string;
}

interface SubCategory {
  _id: string;
  title: string;
}

export default function Header() {
  const { cart } = useCart();
  const { siteData } = useSite();
  const { cartItemCount } = useCart();
  const { wishlistItemCount } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const closeTimeoutRef = useRef<any>(null);

  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
  const [subMap, setSubMap] = useState<Record<string, SubCategory[]>>({});
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeCategoryTitle, setActiveCategoryTitle] = useState<string | null>(null);

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isDesktop, setIsDesktop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  // USER DROPDOWN
  const [userDropdown, setUserDropdown] = useState<boolean>(false);
  const userRef = useRef<HTMLDivElement>(null);
  const mobile = useMediaQuery({ maxWidth: 760 });

  const [dropdownPosition, setDropdownPosition] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const catRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdown(false);
      }
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setActiveMenu(null);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMobileClick = () => {
    router.push("/cart");
  };

  const handleAccount = () => {
    setUserDropdown((p) => !p);
    setMobileMenuOpen(false);
  };

  const handleMobileAccount = () => {
    if (localStorage.getItem("token")) {
      router.push("/profile");
    } else {
      router.push("/user/login");
    }
    setMobileMenuOpen(false);
  };

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const checkIsDesktop = () => setIsDesktop(window.innerWidth >= 768);
    const handleScroll = () => setIsScrolled(window.scrollY > 10);

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", checkIsDesktop);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/category/get-active-category`
        );
        const json = await res.json();
        if (json.success) setMainCategories(json.data);
      } catch { }
    };
    fetchCategories();
  }, []);

  // Search Debounce Effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchText.trim().length > 2) {
        setIsSearching(true);
        setShowSuggestions(true);
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/product/get-active-product?search=${encodeURIComponent(searchText.trim())}&limit=5`
          );
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setSearchResults(json.data);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error("Search API Error:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowSuggestions(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  useEffect(() => {
    const timer = setTimeout(() => setActiveMenu(null), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  const fetchSubFor = async (catId: string): Promise<SubCategory[]> => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/category/get-active-subCategory?categoryId=${catId}&page=-1&limit=100`
      );
      const json = await res.json();
      const data = json.success ? json.data : [];
      setSubMap((prev) => ({
        ...prev,
        [catId]: data,
      }));
      return data;
    } catch {
      setSubMap((prev) => ({ ...prev, [catId]: [] }));
      return [];
    }
  };

  // Preload subcats on hover/init if needed, 
  // but for performance we might just load on hover as implemented

  const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchText.trim() !== "") {
      router.push(`/search?query=${encodeURIComponent(searchText.trim())}`);
      setMobileSearchOpen(false);
    }
  };

  const goToSub = useCallback(
    (catId: string, catTitle: string, sub: SubCategory) => {
      router.push(
        `/category/${catId}/subcategory/${sub._id
        }?categoryName=${encodeURIComponent(
          catTitle
        )}&subCategoryName=${encodeURIComponent(sub.title)}`
      );
      setMobileSearchOpen(false);
      setMobileMenuOpen(false);
      setActiveMenu(null);
    },
    [router]
  );

  const openMobileMenu = useCallback(() => setMobileMenuOpen(true), []);
  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    setActiveMenu(null);
  }, []);

  const handleCategoryClick = useCallback(
    async (cat: MainCategory) => {
      let subs = subMap[cat._id];
      if (!subs) {
        subs = await fetchSubFor(cat._id);
      }

      const subcategories = subs || [];
      if (subcategories.length === 0) {
        router.push(`/category/${cat._id}?categoryName=${encodeURIComponent(cat.title)}`);
        setMobileMenuOpen(false);
        setActiveMenu(null);
      } else {
        setActiveMenu((prev) => (prev === cat._id ? null : cat._id));
      }
    },
    [subMap, router]
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const renderSearchResults = () => {
    if (!showSuggestions || searchText.length <= 2) return null;

    return (
      <div className="absolute top-full left-0 right-0 bg-white shadow-xl rounded-b-lg border border-gray-100 mt-1 max-h-[60vh] overflow-y-auto z-50">
        {isSearching ? (
          <div className="p-4 text-center">
            <div className="w-6 h-6 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-400 text-xs">Searching...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div>
            {searchResults.map((p) => (
              <>
                {process.env.NEXT_PUBLIC_IMAGE_URL}${p.images?.[0]?.imageUrl}

                <Link
                  href={`/product/${p._id}`}
                  key={p._id}
                  onClick={() => {
                    setShowSuggestions(false);
                    setMobileSearchOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group">
                    <div className="w-10 h-10 relative flex-shrink-0 bg-gray-100 rounded overflow-hidden border border-gray-200">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${p.images?.[0]?.imageUrl}`}
                        alt={p.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate group-hover:text-gray-600 transition-colors">
                        {p.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 font-bold">₹{p.discountedPrice}</span>
                        {typeof p.discountedPrice === 'number' && p.basePrice > p.discountedPrice && (
                          <span className="text-[10px] text-gray-400 line-through">₹{p.basePrice}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </>
            ))}
            <button
              onClick={() => {
                router.push(`/search?query=${encodeURIComponent(searchText)}`);
                setShowSuggestions(false);
                setMobileSearchOpen(false);
              }}
              className="w-full py-2.5 text-xs font-bold text-center text-gray-600 hover:bg-gray-50 transition-colors uppercase tracking-wide border-t border-gray-100"
            >
              See All Results
            </button>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-400 text-sm">
            <p>No results found for "{searchText}"</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <header className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex flex-col`}>
      {/* TOP BAR - PROMO */}
      <div className="bg-gray-900 text-white text-[10px] md:text-xs py-2 px-4 md:px-8 flex justify-between items-center z-50 relative">
        <div className="hidden md:flex items-center gap-4">
          <span className="flex items-center gap-1 opacity-80 hover:opacity-100 cursor-pointer">
            <Phone size={12} /> +91 98765 43210
          </span>
          <span className="flex items-center gap-1 opacity-80 hover:opacity-100 cursor-pointer">
            <HelpCircle size={12} /> Help Center
          </span>
        </div>
        <div className="flex-1 text-center md:text-right md:flex-none font-medium tracking-wide">
          Free Shipping on all Electronics orders over ₹499! 🚀
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className={`w-full bg-white transition-shadow duration-200 ${isScrolled ? "shadow-md" : "border-b border-gray-100"} relative z-40`}>
        <div className="container mx-auto max-w-[1400px] px-4 md:px-8 py-5 flex items-center gap-4 md:gap-8 justify-between">

          {/* MOBILE HAMBURGER */}
          <button
            onClick={openMobileMenu}
            className="md:hidden p-2 -ml-2 text-gray-700 hover:text-black"
          >
            <Menu size={22} />
          </button>

          {/* LOGO */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src={LogoImage}
              alt="Bixright"
              width={140}
              height={40}
              priority
              className="w-28 md:w-30 h-auto object-contain"
            />
          </Link>

          {/* SEARCH BAR - DESKTOP (Centralized) */}
          <div className="hidden md:flex flex-1 max-w-2xl relative">
            <div className="relative w-full" ref={searchRef}>
              <input
                type="text"
                placeholder="Search for laptop, mobile, accessories..."
                className="w-full bg-gray-100 text-gray-900 px-4 py-2.5 pl-10 rounded-full outline-none focus:ring-2 focus:ring-gray-100 focus:bg-white transition-all border border-transparent focus:border-gray-600 text-sm placeholder:text-gray-500"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleSearchEnter}
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              {renderSearchResults()}
            </div>
          </div>

          {/* ICONS - DESKTOP */}
          <div className="flex items-center gap-2 md:gap-6">

            {/* SEARCH - MOBILE ONLY */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              <Search size={22} />
            </button>

            {/* USER */}
            <div ref={userRef} className="relative hidden md:block">
              <button
                onClick={handleAccount}
                className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <User size={22} className="text-gray-700" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] text-gray-500 font-medium">
                    {isMounted && token ? "Welcome" : "Sign In"}
                  </span>
                  <span className="text-xs font-bold text-gray-900">Account</span>
                </div>
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              <AnimatePresence>
                {userDropdown && (
                  <m.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1 z-50"
                  >
                    {!token ? (
                      <>
                        <button onClick={() => { router.push("/user/login"); setUserDropdown(false); }} className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 font-medium">Login</button>
                        <button onClick={() => { router.push("/user/signup"); setUserDropdown(false); }} className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 font-medium">Register</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { router.push("/profile"); setUserDropdown(false); }} className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 font-medium">My Profile</button>
                        <button onClick={() => { router.push("/orders"); setUserDropdown(false); }} className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 font-medium">My Orders</button>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium">Logout</button>
                      </>
                    )}
                  </m.div>
                )}
              </AnimatePresence>
            </div>

            {/* WISHLIST */}
            <Link
              href="/wishlist"
              className="hidden md:flex p-2 hover:bg-gray-50 rounded-full relative transition-colors group"
            >
              <Heart size={22} className="text-gray-700 group-hover:text-red-500 transition-colors" />
              {wishlistItemCount > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">{wishlistItemCount}</span>}
            </Link>

            {/* CART */}
            <Link
              href="/cart"
              className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition-colors group"
            >
              <div className="relative">
                <ShoppingBag size={22} className="text-gray-700 group-hover:text-gray-600 transition-colors" />
                {cartItemCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-gray-600 text-white text-[10px] flex items-center justify-center rounded-full font-bold">{cartItemCount}</span>}
              </div>
              <span className="hidden md:block text-sm font-bold text-gray-900 max-w-[80px] truncate">
                {cartItemCount > 0 ? "Cart" : "Cart"}
              </span>
            </Link>

          </div>
        </div>

        {/* BOTTOM NAV - CATEGORIES (Desktop) */}
        <div className="hidden md:block border-t border-gray-100 bg-white">
          <div className="container mx-auto max-w-[1400px] px-8">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-700 overflow-x-auto hide-scrollbar">
              {mainCategories.map((cat) => (
                <div
                  key={cat._id}
                  className="group py-3 cursor-pointer  "
                  ref={(el) => { catRefs.current[cat._id] = el; }}
                  onClick={() => {
                    // Always navigate on click
                    router.push(`/category/${cat._id}?categoryName=${encodeURIComponent(cat.title)}`);
                    setActiveMenu(null);
                  }}
                  onMouseEnter={async () => {
                    if (closeTimeoutRef.current) {
                      clearTimeout(closeTimeoutRef.current);
                      closeTimeoutRef.current = null;
                    }

                    // 1. Fetch if missing
                    let subs = subMap[cat._id];
                    if (subs === undefined) {
                      subs = await fetchSubFor(cat._id);
                    }

                    // 2. If empty, DON'T open menu
                    if (subs && subs.length === 0) {
                      setActiveMenu(null);
                    } else {
                      // Has items -> Show menu
                      setActiveMenu(cat._id);
                      setActiveCategoryTitle(cat.title);
                      const el = catRefs.current[cat._id];
                      if (el) {
                        const rect = el.getBoundingClientRect();
                        setDropdownPosition({ left: rect.left, top: rect.bottom });
                      }
                    }
                  }}
                  onMouseLeave={() => {
                    closeTimeoutRef.current = setTimeout(() => {
                      setActiveMenu(null);
                    }, 200);
                  }}
                >
                  <span className={`transition-colors whitespace-nowrap hover:bg-gray-100 rounded-full px-4 py-2 transition-colors duration-300 ${activeMenu === cat._id ? "text-gray-600" : "group-hover:text-gray-600"}`}>
                    {cat.title}
                  </span>
                  {activeMenu === cat._id && (
                    <m.div layoutId="activeNavLine" className="h-0.5 w-full bg-gray-600 absolute bottom-0 left-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MEGA MENU DROPDOWN */}
        <AnimatePresence>
          {activeMenu && isDesktop && (
            <m.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed z-30"
              style={{ left: dropdownPosition?.left || 0, top: dropdownPosition?.top || 0 }}
              onMouseEnter={() => {
                if (closeTimeoutRef.current) {
                  clearTimeout(closeTimeoutRef.current);
                  closeTimeoutRef.current = null;
                }
              }}
              onMouseLeave={() => {
                closeTimeoutRef.current = setTimeout(() => {
                  setActiveMenu(null);
                }, 200);
              }}
            >
              <div className="bg-white/95 backdrop-blur-lg rounded-b-xl shadow-2xl border border-gray-100 py-3 min-w-[240px] bg-gray-100">
                {(subMap[activeMenu] ?? []).length > 0 ? (
                  (subMap[activeMenu] ?? []).map((sub, idx) => (
                    <m.button
                      key={sub._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03, duration: 0.2 }}
                      onClick={() => {
                        if (activeCategoryTitle) goToSub(activeMenu, activeCategoryTitle, sub);
                      }}
                      className="block w-full text-left px-5 py-2.5 text-sm text-gray-600 hover:text-gray-600 hover:bg-gray-50 transition-colors font-medium relative group"
                    >
                      {sub.title}
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-gray-600 group-hover:h-1/2 transition-all duration-300 rounded-r-md"></span>
                    </m.button>
                  ))
                ) : (
                  <div className="px-5 py-3 text-gray-400 text-xs flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-200 border-t-gray-600 animate-spin"></div>
                    Loading...
                  </div>
                )}
              </div>
            </m.div>
          )}
        </AnimatePresence>

        {/* MOBILE SEARCH BAR (Expandable) */}
        <AnimatePresence>
          {mobileSearchOpen && (
            <m.div
              initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
              className="md:hidden border-t border-gray-100 overflow-hidden bg-white"
            >
              <div className="p-4 relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-gray-100 px-4 py-3 pl-10 rounded-lg text-sm outline-none focus:bg-white focus:ring-1 focus:ring-gray-600 transition-all border border-transparent focus:border-gray-600"
                  autoFocus
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={handleSearchEnter}
                />
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                {renderSearchResults()}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* MOBILE SIDE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <m.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 w-[80%] max-w-[320px] h-full bg-white shadow-2xl z-50 overflow-y-auto"
            >
              {/* Mobile Menu Header */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <User size={20} />
                  {token ? "Hello, User" : "Welcome Guest"}
                </div>
                <button onClick={closeMobileMenu} className="p-2 bg-white rounded-full shadow-sm"><X size={18} /></button>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4 p-5 border-b border-gray-100">
                {!token ? (
                  <>
                    <button onClick={() => { router.push("/user/login"); closeMobileMenu(); }} className="bg-gray-600 text-white py-2.5 rounded-lg text-sm font-semibold shadow-gray-200 shadow-md">Login</button>
                    <button onClick={() => { router.push("/user/signup"); closeMobileMenu(); }} className="bg-white border border-gray-200 text-gray-900 py-2.5 rounded-lg text-sm font-semibold">Sign Up</button>
                  </>
                ) : (
                  <button onClick={handleLogout} className="col-span-2 bg-red-50 text-red-600 py-2.5 rounded-lg text-sm font-semibold">Logout</button>
                )}
              </div>

              {/* Categories */}
              <div className="p-5">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Shop By Category</h3>
                <div className="space-y-2">
                  {mainCategories.map(cat => (
                    <div key={cat._id} className="border-b border-gray-100 last:border-0 pb-2">
                      <div className="flex items-center justify-between w-full py-2">
                        <button
                          onClick={() => {
                            router.push(`/category/${cat._id}?categoryName=${encodeURIComponent(cat.title)}`);
                            closeMobileMenu();
                          }}
                          className="text-[15px] font-medium text-gray-800 flex-1 text-left"
                        >
                          {cat.title}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCategoryClick(cat);
                          }}
                          className="p-2"
                        >
                          <ChevronDown size={16} className={`transition-transform duration-200 ${activeMenu === cat._id ? "rotate-180" : ""}`} />
                        </button>
                      </div>

                      <AnimatePresence>
                        {activeMenu === cat._id && (
                          <m.div
                            initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                            className="overflow-hidden bg-gray-50 rounded-lg"
                          >
                            {(subMap[cat._id] ?? []).map(sub => (
                              <button
                                key={sub._id}
                                onClick={() => goToSub(cat._id, cat.title, sub)}
                                className="block w-full text-left px-4 py-3 text-sm text-gray-600 border-b border-white last:border-0"
                              >
                                {sub.title}
                              </button>
                            ))}
                          </m.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Links */}
              <div className="bg-gray-50 p-5 mt-auto">
                <div className="space-y-4 text-sm text-gray-600">
                  <Link href="/profile" className="flex items-center gap-3"><User size={18} /> Account Settings</Link>
                  <Link href="/wishlist" className="flex items-center gap-3"><Heart size={18} /> My Wishlist</Link>
                  <Link href="/orders" className="flex items-center gap-3"><ShoppingBag size={18} /> My Orders</Link>
                  <div className="flex items-center gap-3"><HelpCircle size={18} /> Help Center</div>
                </div>
              </div>

            </m.div>
            <m.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
              onClick={closeMobileMenu}
            />
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
