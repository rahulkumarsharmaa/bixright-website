"use client";

import Link from "next/link";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Search,
  User,
  Heart,
  ShoppingCart,
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
  const [isFooterExpanded, setIsFooterExpanded] = useState(true);

  const [isDesktop, setIsDesktop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

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

  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, [pathname, mobileMenuOpen]);

  useEffect(() => {
    if (!token) {
      setUserName(null);
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/customer/get-profile`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }
        );
        const data = await res.json();
        if (data?.success && data?.data) {
          const profile = data.data;
          setUserName(profile.firstName || profile.lastName || "User");
        }
      } catch (err) {
        console.error("fetchProfile error in header", err);
      }
    };
    fetchProfile();
  }, [token]);

  useEffect(() => {
    const checkIsDesktop = () => setIsDesktop(window.innerWidth >= 768);
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);

      if (currentScrollY <= 5) {
        setVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      const diff = currentScrollY - lastScrollY.current;
      if (diff > 2) {
        if (!mobileMenuOpen && !mobileSearchOpen && !userDropdown && !activeMenu && !showSuggestions) {
          setVisible(false);
        }
        lastScrollY.current = currentScrollY;
      } else if (diff < -1) {
        setVisible(true);
        lastScrollY.current = currentScrollY;
      }
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", checkIsDesktop);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mobileMenuOpen, mobileSearchOpen, userDropdown, activeMenu, showSuggestions]);

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

  const openMobileMenu = useCallback(() => {
    setMobileMenuOpen(true);
    setIsFooterExpanded(true);
  }, []);
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
    setToken(null);
    setUserName(null);
    window.location.href = "/";
  };

  const renderSearchResults = () => {
    if (!showSuggestions || searchText.length <= 2) return null;

    return (
      <div className="absolute top-full left-0 right-0 bg-brand-light shadow-sm rounded-b-2xl overflow-hidden z-50">
        <div className="max-h-[60vh] overflow-y-auto py-2 custom-scrollbar">
          {isSearching ? (
            <div className="p-4 text-center">
              <div className="w-6 h-6 border-2 border-brand/50 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-brand/20 text-xs">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div>
              {searchResults.map((p) => (
                <Link
                  href={`/product/${p._id}`}
                  key={p._id}
                  onClick={() => {
                    setShowSuggestions(false);
                    setMobileSearchOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3 p-2 hover:bg-brand-light transition-colors border-b border-brand-light last:border-0 group">
                    <div className="w-10 h-10 relative p-2 flex-shrink-0 bg-brand-light rounded-4xl overflow-hidden border border-brand-light/90">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${p.images?.[0]?.imageUrl}`}
                        alt={p.title}
                        fill
                        className="object-contain group-hover:scale-102 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-brand/90 truncate group-hover:text-brand transition-colors">
                        {p.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-brand font-bold">₹{typeof p.discountedPrice === 'number' ? p.discountedPrice.toFixed(2) : (p.basePrice ?? 0).toFixed(2)}</span>
                        {typeof p.discountedPrice === 'number' && p.basePrice > p.discountedPrice && (
                          <span className="text-[10px] text-brand/80 line-through">₹{(p.basePrice ?? 0).toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              <button
                onClick={() => {
                  router.push(`/search?query=${encodeURIComponent(searchText)}`);
                  setShowSuggestions(false);
                  setMobileSearchOpen(false);
                }}
                className="w-full py-2 text-xs font-bold text-center text-brand hover:bg-brand-light transition-colors uppercase tracking-wide border-t border-brand-light"
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
      </div>
    );
  };

  return (
    <m.header
      className={`w-full fixed top-0 left-0 right-0 flex flex-col ${mobileMenuOpen ? "z-[9999]" : "z-50"}`}
    >
      {/* TOP BAR - PROMO */}
      <div className="bg-black  text-brand-light text-[10px] md:text-xs py-2 px-4 md:px-8  z-50 relative">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="hidden md:flex items-center gap-4">
            <span className="flex items-center gap-1 opacity-80 hover:opacity-100 cursor-pointer">
              <Phone size={12} />+91 {siteData.phone}
            </span>
            <span className="flex items-center gap-1 opacity-80 hover:opacity-100 cursor-pointer">
              <HelpCircle size={12} /> Help Center
            </span>
          </div>
          <div className="flex-1 text-center md:text-right md:flex-none font-medium tracking-wide">
            Free Shipping on all Electronics orders over ₹999! 🚀
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className={`w-full bg-brand-light transition-shadow duration-200 ${isScrolled ? "shadow-md" : "border-b border-brand-light"} relative z-40`}>
        <div className="container mx-auto max-w-[1600px] px-4 md:px-8 py-4 flex items-center gap-4 md:gap-8 justify-between">

          {/* MOBILE HAMBURGER */}
          <button
            onClick={openMobileMenu}
            className="md:hidden p-2 -ml-2 text-brand/80 hover:text-brand"
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
                className="w-full bg-brand/5 text-brand px-4 py-2.5 pl-10 rounded-full outline-none transition-all border border-brand/10  text-sm placeholder:text-brand/40"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleSearchEnter}
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand/70" size={18} />
              {renderSearchResults()}
            </div>
          </div>

          {/* ICONS - DESKTOP */}
          <div className="flex items-center gap-2 md:gap-6">

            {/* SEARCH - MOBILE ONLY */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 text-brand"
            >
              <Search size={22} />
            </button>

            {/* USER */}
            <div ref={userRef} className="relative hidden md:block">
              <button
                onClick={handleAccount}
                className="flex items-center gap-2 hover:bg-brand/5 p-2 rounded-4xl transition-colors"
              >
                <User size={22} className="text-brand" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] text-brand/90 font-medium">
                    {isMounted && token ? "" : "Sign In"}
                  </span>
                  <span className="text-xs font-bold text-brand">Account</span>
                </div>
                <ChevronDown size={14} className="text-brand" />
              </button>

              <AnimatePresence>
                {userDropdown && (
                  <m.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-brand-light rounded-b-xl shadow-xl overflow-hidden z-50"
                  >
                    {!token ? (
                      <>
                        <button onClick={() => { router.push("/user/login"); setUserDropdown(false); }} className="block w-full text-left px-4 py-3 text-sm hover:bg-brand/5 font-medium">Login</button>
                        <button onClick={() => { router.push("/user/signup"); setUserDropdown(false); }} className="block w-full text-left px-4 py-3 text-sm hover:bg-brand/5 font-medium">Register</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { router.push("/profile"); setUserDropdown(false); }} className="block w-full text-left px-4 py-3 text-sm hover:bg-brand/5 font-medium">My Profile</button>
                        <button onClick={() => { router.push("/orders"); setUserDropdown(false); }} className="block w-full text-left px-4 py-3 text-sm hover:bg-brand/5 font-medium">My Orders</button>
                        <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-sm hover:bg-brand/5 font-medium hover:text-red-500">Logout</button>
                      </>
                    )}
                  </m.div>
                )}
              </AnimatePresence>
            </div>

            {/* WISHLIST */}
            <Link
              href="/wishlist"
              className="hidden md:flex p-2 hover:bg-brand/5 rounded-full relative transition-colors group"
            >
              <Heart size={22} className="text-brand/80 group-hover:text-brand transition-colors" />
              {wishlistItemCount > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-brand/70 text-brand-light text-[10px] flex items-center justify-center rounded-full font-bold">{wishlistItemCount}</span>}
            </Link>

            {/* CART */}
            <Link
              href="/cart"
              className="flex items-center gap-2 hover:bg-brand/5 p-2 rounded-4xl transition-colors group"
            >
              <div className="relative">
                <ShoppingCart size={22} className="text-brand/80 group-hover:text-brand transition-colors" />
                {cartItemCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand/70 text-brand-light text-[10px] flex items-center justify-center rounded-full font-bold">{cartItemCount}</span>}
              </div>
              <span className="hidden md:block text-sm font-bold text-brand/90 max-w-[80px] truncate">
                {cartItemCount > 0 ? "Cart" : "Cart"}
              </span>
            </Link>

          </div>
        </div>

        {/* BOTTOM NAV - CATEGORIES (Desktop) */}
        <m.div
          initial={{ height: "auto", opacity: 1, borderTopWidth: "1px" }}
          animate={{
            height: visible ? "auto" : 0,
            opacity: visible ? 1 : 0,
            borderTopWidth: visible ? "1px" : "0px"
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="hidden md:block border border-brand/5 bg-brand-light overflow-hidden"
        >
          <div className="container mx-auto max-w-[1600px] px-6">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand overflow-x-auto hide-scrollbar">
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
                  <span className={`whitespace-nowrap hover:bg-brand/5 rounded-full px-4 py-2 capitalize transition-colors duration-300 ${activeMenu === cat._id ? "text-brand/90" : "group-hover:text-brand"}`}>
                    {cat.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </m.div>

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
              <div className="bg-brand-light backdrop-blur-lg rounded-b-xl shadow-lg border border-brand-5 py-2 min-w-[50px] max-w-2xl">
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
                      className="block w-full text-left px-5 py-2 text-sm text-brand/80 hover:text-brand hover:bg-brand/5 transition-colors font-medium relative group cursor-pointer"
                    >
                      {sub.title}
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-brand group-hover:h-1/2 transition-all duration-300 rounded-r-md"></span>
                    </m.button>
                  ))
                ) : (
                  <div className="px-5 py-3 text-brand/20 text-xs flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-brand/5 border-t-brand/15 animate-spin"></div>
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
              className="md:hidden border-t border-brand/10 bg-brand-light"
            >
              <div className="p-4 relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-brand/5 px-4 py-3 pl-10 rounded-4xl text-sm outline-none focus:bg-brand/5 focus:ring-1 focus:ring-brand/50 transition-all border border-transparent focus:border-brand/50"
                  autoFocus
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={handleSearchEnter}
                />
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-brand" size={18} />
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
              transition={{ type: "tween", ease: "easeOut", duration: 0.25 }}
              className="fixed top-0 left-0 w-[80%] max-w-[320px] h-full bg-brand-light shadow-2xl z-[50] flex flex-col will-change-transform"
            >
              {/* Mobile Menu Header */}
              <div className="p-5 border-b border-brand/40 flex items-center justify-between bg-brand-light/80 flex-shrink-0">
                <div className="font-bold text-lg text-black flex items-center gap-2">
                  <User size={20} className="text-brand"/>
                  {token ? `Hello, ${userName || "User"}` : "Welcome Guest"}
                </div>
                <button onClick={closeMobileMenu} className="p-2 bg-brand/5 text-brand rounded-full"><X size={18} /></button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Quick Actions (only visible when guest/logged-out) */}
                {!token && (
                  <div className="grid grid-cols-2 gap-4 p-5 border-b border-brand-light/80">
                    <button onClick={() => { router.push("/user/login"); closeMobileMenu(); }} className="bg-brand text-brand-light py-2.5 rounded-lg text-sm font-semibold">Login</button>
                    <button onClick={() => { router.push("/user/signup"); closeMobileMenu(); }} className="bg-brand-light text-brand border border-brand py-2.5 rounded-lg text-sm font-semibold">Sign Up</button>
                  </div>
                )}

                {/* Categories */}
                <div className="p-5">
                  <h3 className="text-xs font-bold text-black uppercase tracking-wider mb-2">Shop By Category</h3>
                  <div className="space-y-1">
                    {mainCategories.map(cat => (
                      <div key={cat._id} className="border-b border-brand/5 last:border-0">
                        <div className="flex items-center justify-between w-full py-2">
                          <button
                            onClick={() => {
                              router.push(`/category/${cat._id}?categoryName=${encodeURIComponent(cat.title)}`);
                              closeMobileMenu();
                            }}
                            className="text-[15px] font-medium text-black flex-1 text-left"
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
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="overflow-hidden bg-brand/5 rounded-lg"
                            >
                              {(subMap[cat._id] ?? []).map(sub => (
                                <button
                                  key={sub._id}
                                  onClick={() => goToSub(cat._id, cat.title, sub)}
                                  className="block w-full text-left px-4 py-3 text-sm text-brand border-b border-brand/10 last:border-0"
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
              </div>

              {/* Footer Links & Logout */}
              {token && (
                <div className="bg-brand/5 border-t border-brand/10 flex-shrink-0 rounded-4xl relative pt-6 pb-5 px-5">
                  <button
                    onClick={() => setIsFooterExpanded(!isFooterExpanded)}
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-light text-brand rounded-full p-1.5 shadow-md border border-brand/10 hover:scale-105 active:scale-95 transition-all cursor-pointer z-10"
                  >
                    <ChevronDown size={14} className={`transition-transform duration-300 ${isFooterExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isFooterExpanded && (
                      <m.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
                        className="overflow-hidden animate-none"
                      >
                        <div className="space-y-4 text-sm text-gray-600 mb-5 pt-1">
                          <Link href="/profile" onClick={closeMobileMenu} className="flex items-center gap-3"><User size={18} /> Account Settings</Link>
                          <Link href="/wishlist" onClick={closeMobileMenu} className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                              <Heart size={18} />
                              <span>My Wishlist</span>
                            </div>
                            {wishlistItemCount > 0 && (
                              <span className="bg-brand text-brand-light text-[10px] font-extrabold px-2 py-0.5 rounded-full min-w-[1.25rem] text-center shadow-xs">
                                {wishlistItemCount}
                              </span>
                            )}
                          </Link>
                          <Link href="/orders" onClick={closeMobileMenu} className="flex items-center gap-3"><ShoppingCart size={18} /> My Orders</Link>
                          <div className="flex items-center gap-3"><HelpCircle size={18} /> Help Center</div>
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className="w-full bg-brand/80 hover:bg-brand text-brand-light transition-colors py-2 sm:py-3 rounded-4xl text-sm font-semibold flex items-center justify-center gap-2 mt-2"
                  >
                    Logout
                  </button>
                </div>
              )}

            </m.div>
            <m.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-[40]"
              onClick={closeMobileMenu}
            />
          </>
        )}
      </AnimatePresence>
    </m.header>
  );
}
