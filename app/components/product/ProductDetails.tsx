"use client";

import { m, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import AuthPopup from "@/app/components/AuthPopup";
import { useCart } from "@/app/context/CartContext";
import type { CartItemType } from "@/app/types/cart";
import { useState, useMemo, useEffect, useRef } from "react";
import { ShoppingCart, Zap, Heart, Check, TruckIcon } from "lucide-react";
import Image from "next/image";
import { useWishlist } from "@/app/context/WishlistContext";
import type { Product } from "@/app/types/product";
import ProductDescription from "@/app/components/ProductDescription";
import { copyToClipboard } from "@/lib/utils";

import { FaWhatsapp } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { FiCopy, FiPhone, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useSite } from "@/app/context/siteSetting";
import { usePathname } from "next/navigation";
import { ShareButton } from "@/app/components/ShareButton";
import type { TagItem } from "@/app/types/tag";



interface Props {
  product: Product;
  onColorSelect?: (color: string) => void;
}

export interface HandleWishlistParams {
  productId: string;
  variantId?: string;
}

export function ProductDetails({ product, onColorSelect }: Props) {
  const { siteData } = useSite();

  const pathname = usePathname();
  const [tags, setTags] = useState<TagItem[]>([]);
  const router = useRouter();
  const { addToCart, cart } = useCart();
  const paramsSearch = useSearchParams();
  const color = paramsSearch.get("color") || "";
  const size = paramsSearch.get("size") || "";

  const { isInWishlist, addWishlist, removeWishlist } = useWishlist();

  const [qty, setQty] = useState<number>(1);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);
  const [added, setAdded] = useState(false);
  const [addError, setAddError] = useState<string>("");

  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const [selectedColor, setSelectedColor] = useState<string>("");
  const [showStockOnQty, setShowStockOnQty] = useState<boolean>(false);
  const [variantStockError, setVariantStockError] = useState<boolean>(false);

  const [showBar, setShowBar] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  const [showFullTitle, setShowFullTitle] = useState(false);
  const [showFullSubtitle, setShowFullSubtitle] = useState(false);


  const [openDetails, setOpenDetails] = useState(false);
  const [openWhy, setOpenWhy] = useState(false);

  const [highlightMax, setHighlightMax] = useState(false);

  const fetchTags = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tags/get-tags?page=1&limit=5`,
        { cache: "no-store" }
      );

      const json = await res.json();

      if (json?.data && Array.isArray(json.data)) {
        setTags(json.data);
      } else {
        setTags([]);
      }
    } catch (error) {
      console.error("TAG API ERROR:", error);
      setTags([]);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchTags();
    }, 0);
  }, []);

  useEffect(() => {
    if (!addError) return;
    const timer = setTimeout(() => setAddError(""), 4000);
    return () => clearTimeout(timer);
  }, [addError]);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;

      if (current > lastScroll) {
        setShowBar(false);
      } else {
        setShowBar(true);
      }

      setLastScroll(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);

  }, [lastScroll]);

  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const footerElement = document.querySelector("footer");

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: "0px"
      }
    );

    if (footerElement) {
      observer.observe(footerElement);
    }

    return () => {
      if (footerElement) {
        observer.unobserve(footerElement);
      }
    };
  }, []);

  // Simplification: No variants logic needed as per user request.
  const stock = product.stock || product.quantity || 0;

  const maxQty = stock > 0 ? Math.min(stock, 10) : 1;

  const clearErrorsInstantly = () => {
    setAddError("");
  };

  const handleAdd = async () => {
    clearErrorsInstantly();

    if (addingToCart) return;

    if (stock <= 0) {
      setAddError("This product is out of stock.");
      return;
    }

    const maxAllowed = Math.min(stock, 10);
    // Prevent exceeding stock or limit
    if (qty > maxAllowed) {
      if (stock < 10) {
        setAddError(`Only ${stock} units available in stock.`);
      } else {
        setAddError(
          "You already added the maximum allowed quantity for this item."
        );
      }
      return;
    }

    try {
      setAddingToCart(true);
      await new Promise((r) => setTimeout(r, 300));

      const cartItem: CartItemType = {
        productId: product._id,
        _id: product._id,
        title: product.title,
        price: product.basePrice ?? product.price ?? 0,
        discountedPrice: typeof product.discountedPrice === 'number' ? product.discountedPrice : product.price ?? 0,
        images: product.images,
        brandName: product.brandName ?? "",
        subTitle: product.subTitle ?? "",
        stock: stock,
        variantId: undefined,
        color: "",
        size: "",
        quantity: qty,
        image: product.images?.[0]?.imageUrl ?? "",
      };

      console.log("Adding to cart:", cartItem);
      await addToCart(cartItem);
      setAddingToCart(false);
      setAdded(true);

      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error(err);
      setAddingToCart(false);
      setAddError("Something went wrong. Try again later.");
    }
  };

  const handleBuy = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      sessionStorage.setItem("prev-url", pathname);
      router.push("/user/login?b=true");
      return;
    }

    if (stock <= 0) {
      setAddError("This product is out of stock.");
      return;
    }

    await handleAdd();

    router.push("/checkout");
  };

  // Selling price (variant or base price) -> 'price' in variant is usually MRP in this codebase based on usage
  const basePrice = product.basePrice;

  // Original MRP (cut price) -> 'discountedPrice' is usually selling price
  const discountedPrice = product.discountedPrice;

  // Discount %
  const discountPercent = product.discount;

  const handleWishlist = ({ productId }: HandleWishlistParams): void => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthOpen(true);
      return;
    }

    isInWishlist(productId)
      ? removeWishlist(productId)
      : addWishlist({ productId });
  };

  const isOutOfStock = stock === 0;
  const remainingStock = stock - qty;

  return (
    <>
      <div className="overflow-hidden">
        {/*  TITLE + SUBTITLE (UPDATED) */}
        <div className="mb-1">
          {/* TITLE with show more/less */}
          <div>
            {/* <h1
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal leading-relaxed sm:leading-snug md:leading-tight text-gray-900 cursor-pointer select-none break-words overflow-hidden tracking-tight capitalize"
              onClick={() =>
                product.title.length > 70 && setShowFullTitle(!showFullTitle)
              }
            >
              {showFullTitle || product.title.length <= 70
                ? product.title
                : product.title.slice(0, 70) + "..."}
            </h1> */}

            <h1
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold leading-relaxed sm:leading-snug md:leading-tight text-brand cursor-pointer select-none break-words overflow-hidden tracking-tight capitalize"
            >
              {product.title}
            </h1>



          </div>

          {/* SUBTITLE */}
          {product.subTitle && (
            <div className="relative">
              <p
                className="text-sm sm:text-base md:text-lg text-brand/70 leading-relaxed sm:leading-snug max-w-full lg:max-w-3xl xl:max-w-4xl break-words cursor-pointer transition-colors duration-200 hover:text-brand capitalize"
                onClick={() =>
                  product.subTitle.length > 80 &&
                  setShowFullSubtitle(!showFullSubtitle)
                }
              >
                {showFullSubtitle || product.subTitle.length <= 70
                  ? product.subTitle
                  : product.subTitle.slice(0, 70) + "..."}
              </p>
            </div>
          )}
        </div>

        {/* Prices */}

        <div className=" flex items-center justify-between pr-4">
          <div className="flex items-center gap-3">
            {/* Selling Price */}
            <span className="text-xl font-bold text-brand">
              ₹{typeof discountedPrice === 'number' ? discountedPrice.toFixed(2) : (basePrice ?? 0).toFixed(2)}
            </span>

            {/* Cut Price */}
            {discountPercent > 0 && (
              <span className="text-lg line-through text-brand/40">
                ₹{(basePrice ?? 0).toFixed(2)}
              </span>
            )}

            {discountPercent > 0 && (
              <span className="text-brand font-semibold text-lg">
                {discountPercent}% off
              </span>
            )}
          </div>

          {/* STOCK STATUS (with animated alert when error exists) */}
          <div className="text-right">
            {(remainingStock <= 0) && (
              <p className="text-red-600 text-base animate-pulse">
                Out of Stock
              </p>
            )}
          </div>
        </div>

        <div className="text-sm text-brand/60 my-2">Inclusive of all taxes</div>
        {/* COLOUR */}

        <div className="flex items-center justify-end mb-2">
          {/* LEFT */}
          <div className="text-sm text-gray-500 capitalize">
          </div>

          {/* RIGHT */}
          <div className="flex flex-col items-center gap-5">
            <ShareButton />
          </div>
        </div>

        <div className="text-sm text-brand/60 my-2">
          Dispatch timelines may vary, select a size for details
        </div>
        {/* QUANTITY */}
        <div className="relative">
          {/* Quantity Label */}
          <h3 className="text-sm font-bold text-brand mb-2">Quantity</h3>

          <div className="flex items-center justify-between gap-4">
            {/* Left side: Quantity Selector */}
            <div className="flex flex-col">
              <div className="flex items-center bg-brand/3 border border-brand/10 rounded-full p-1 w-fit shadow-xs gap-1">
                {/* Decrease */}
                <button
                  onClick={() => {
                    setQty((prev) => Math.max(1, prev - 1));
                  }}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer text-sm font-bold text-brand hover:bg-brand hover:text-brand-light active:scale-90 transition shadow-xs"
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                {/* Quantity Number */}
                <div className="w-10 text-center text-sm font-extrabold text-brand">
                  {qty}
                </div>

                {/* Increase */}
                <button
                  onClick={() => {
                    if (isOutOfStock) return;
                    if (qty >= maxQty) {
                      setHighlightMax(true);
                      setTimeout(() => setHighlightMax(false), 1200);
                      return;
                    }
                    setShowStockOnQty(true);
                    setQty((prev) => Math.min(maxQty, prev + 1));
                  }}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer text-sm font-bold text-brand hover:bg-brand hover:text-brand-light active:scale-90 transition shadow-xs"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Max note - positioned below quantity selector */}
              <p
                className={`text-xs transition-all duration-300 mt-2 ml-1 capitalize ${highlightMax ? "text-red-600 font-semibold" : "text-brand/50"}`}
              >
                Max allowed: 10
              </p>
            </div>

            {/* Right side: Ready To Ship */}
            <div className="flex items-center gap-1 text-sm font-medium text-brand/80">
              <TruckIcon className="w-4 h-4 text-brand/60" />
              Ready To Ship
            </div>
          </div>
        </div>
        {/* desktop buttons  */}
        <div
          className={`hidden sm:block z-20 py-4 transition-all duration-300`}
        >
          <div className="relative w-full max-w-lg flex gap-3">
            {/* add extra variants product error  */}
            <AnimatePresence>
              {addError && (
                <m.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: -50, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="absolute left-1/3 -translate-x-1/2 bg-red-500 text-white text-xs font-normal px-3 py-2 rounded-4xl shadow-sm z-50"
                >
                  {addError}
                </m.div>
              )}
            </AnimatePresence>

            <div className="flex-1 flex gap-3">
              <button
                onClick={handleAdd}
                disabled={addingToCart || added}
                className={`flex-1 rounded-full px-5 py-2 font-semibold transition-all duration-300 flex items-center justify-center cursor-pointer gap-2 border border-brand/20 text-brand text-base bg-brand/3 hover:bg-brand/10 disabled:opacity-50 disabled:cursor-not-allowed min-w-0`}
              >
                {addingToCart ? (
                  <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                ) : added ? (
                  <Check className="w-5 h-5 text-brand" />
                ) : (
                  <ShoppingCart className="w-5 h-5 text-brand" />
                )}

                <span className="truncate">
                  {addingToCart ? "Adding..." : added ? "Added" : "Add to Bag"}
                </span>
              </button>

              <button
                onClick={handleBuy}
                className={`flex-1 rounded-full px-5 py-2.5 font-semibold text-base bg-brand text-brand-light transition-all duration-300 flex items-center justify-center cursor-pointer gap-2 hover:bg-brand/90 shadow-sm hover:shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed min-w-0`}
              >
                <Zap className="w-5 h-5" />
                <span className="truncate">Buy Now</span>
              </button>
            </div>

            <button
              onClick={() => handleWishlist({ productId: product._id })}
              className={`px-2 py-2 rounded-full border-2 flex items-center justify-center cursor-pointer transition duration-300 flex-shrink-0 ${isInWishlist(product._id) ? "bg-red-50 border-red-300 text-red-600 hover:bg-red-100" : "bg-brand/3 border-brand/10 text-brand/70 hover:bg-brand/10 hover:border-brand/30"}`}
            >
              <Heart
                className={`w-6 h-6 ${isInWishlist(product._id) ? "fill-current" : ""}`}
              />
            </button>
          </div>

          {/* CONTACT BUTTONS BELOW ADD/BUY SECTION (DESKTOP ONLY) */}
          <div className="hidden sm:flex max-w-xl mt-4 gap-3">
            {/* WhatsApp */}
            <a
              href="https://wa.me/7340582197"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-initial shrink-0 flex items-center justify-center gap-2 px-5 py-2 rounded-full border border-brand/10 bg-brand/3 hover:bg-brand/10 transition-all duration-300 text-xs sm:text-sm font-bold text-brand/70 shadow-sm hover:shadow"
            >
              <FaWhatsapp className="text-green-500 text-base sm:text-lg" />
              <span>Chat</span>
            </a>

            {/* Call */}
            <a
              href={`tel:${siteData.phone}`}
              className="flex-initial shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-brand/10 bg-brand/3 hover:bg-brand/10 transition-all duration-300 text-xs sm:text-sm font-bold text-brand/70 shadow-sm hover:shadow"
            >
              <FiPhone className="text-blue-500 text-sm sm:text-base" />
              <span className="truncate">{siteData.phone || "Call"}</span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${siteData.email || "support@example.com"}`}
              className="flex-1 min-w-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-brand/10 bg-brand/3 hover:bg-brand/10 transition-all duration-300 text-xs sm:text-sm font-bold text-brand/70 shadow-sm hover:shadow"
            >
              <HiOutlineMail className="text-red-500 text-base" />
              <span className="truncate">{siteData.email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BAR — ALWAYS VISIBLE */}
      <m.div
        initial={{ y: 0 }}
        animate={{ y: isFooterVisible ? "100%" : "0%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="sm:hidden fixed bottom-0 left-0 right-0 z-[30] p-4 bg-brand-light/95 backdrop-blur-md border-t border-brand/10"
      >
        <AnimatePresence>
          {(addError) && (
            <m.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute -top-24 left-4 right-4 bg-gray-900/95 backdrop-blur-xl border border-white/10 text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-center gap-3 z-50"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
              <p className="text-[0.9rem] font-medium leading-tight">{addError}</p>
            </m.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 max-w-md mx-auto">
          <button
            onClick={handleAdd}
            className="w-full text-[.845rem] bg-brand/10 border border-brand/20 hover:bg-brand/20 text-brand px-4 py-3 rounded-full font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md transition duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {addingToCart ? (
              <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShoppingCart className="w-5 h-5" />
            )}
            {addingToCart ? "Adding..." : "Add Cart"}
          </button>

          <button
            onClick={handleBuy}
            disabled={isOutOfStock}
            className="w-full bg-brand hover:bg-brand/90 text-brand-light px-4 py-3 rounded-full font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer hover:shadow-xl transition duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Zap className="w-4 h-4" />
            Buy Now
          </button>

          <button
            onClick={() => handleWishlist({ productId: product._id })}
            className={`w-full max-w-[4rem] py-3 rounded-full border-2 flex items-center justify-center shadow-md transition duration-300 ${isInWishlist(product._id)
              ? "bg-red-50 border-red-300 text-red-600 hover:bg-red-100"
              : "bg-brand/3 border-brand/10 text-brand/70 hover:bg-brand/10"
              }`}
          >
            <Heart
              className={`w-4 h-5 ${isInWishlist(product._id) ? "fill-current" : ""
                }`}
            />
          </button>
        </div>
      </m.div>
      <ProductDescription description={product.description ?? ""} />
      <AuthPopup isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
