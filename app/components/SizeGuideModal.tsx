// "use client";

// import Image from "next/image";
// import { m, AnimatePresence } from "framer-motion";
// import Portal from "./Portal";
// import { Check, ChevronDown, ShoppingCart, X } from "lucide-react";
// import type { Product } from "@/app/types/product";
// import { useEffect, useMemo, useState } from "react";
// import { useCart } from "../context/CartContext";
// import type { CartItemType } from "../types/cart";

// interface Props {
//   discountedPrice?: number;
//   product: Product;
//   open: boolean;
//   onClose: () => void;
// }

// interface SizeRow {
//   size: string;
//   bust: number;
//   shoulder: number;
//   arm: number;
//   hip: number;
//   waist: number;
// }

// const rows: SizeRow[] = [
//   { size: "XS", bust: 32, shoulder: 14.5, arm: 11, hip: 36, waist: 26 },
//   { size: "S", bust: 34, shoulder: 14.5, arm: 12, hip: 38, waist: 28 },
//   { size: "M", bust: 36, shoulder: 15, arm: 13, hip: 40, waist: 30 },
//   { size: "L", bust: 38, shoulder: 15.5, arm: 14, hip: 42, waist: 32 },
//   { size: "XL", bust: 40, shoulder: 16, arm: 15, hip: 44, waist: 34 },
//   { size: "2XL", bust: 42, shoulder: 16.5, arm: 16, hip: 46, waist: 36 },
//   { size: "3XL", bust: 44, shoulder: 17, arm: 17, hip: 48, waist: 38 },
// ];

// export default function SizeGuideModal({
//   open,
//   onClose,
//   product,
//   discountedPrice,
// }: Props) {
//   const { addToCart } = useCart();

//   const [unit, setUnit] = useState<"in" | "cm">("in");
//   const [showSizeDropdown, setShowSizeDropdown] = useState(false);
//   const [selectedSize, setSelectedSize] = useState("Select Size");
//   const [added] = useState(false);
//   const [sizeError, setSizeError] = useState(false);
//   const [addingToCart, setAddingToCart] = useState(false);

//   // ESC CLOSE HANDLER
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [onClose]);

//   const availableSizes = Array.from(
//     new Set(product.variants?.map((v) => v.size))
//   );

//   const selectedVariant = useMemo(() => {
//     if (!selectedSize) return undefined;
//     return product.variants.find((v) => v.size === selectedSize);
//   }, [selectedSize, product.variants]);

//   const convert = (value: number) => (unit === "in" ? value : value * 2.54);

//   if (!open) return null;

//   const handleAddToBag = async () => {
//     if (selectedSize === "Select Size") {
//       setSizeError(true);
//       return;
//     }

//     if (!selectedVariant) {
//       setSizeError(true);
//       return;
//     }

//     if (selectedVariant.quantity <= 0) {
//       alert("Out of stock");
//       return;
//     }

//     const item: CartItemType = {
//       _id: product._id,
//       productId: product._id,
//       title: product.title,
//       price: product.price,
//       discountedPrice: typeof product.discountedPrice === 'number' ? product.discountedPrice : product.price,
//       images: product.images,
//       image: product.images?.[0]?.imageUrl,
//       brandName: product.brandName || "",
//       subTitle: product.subTitle,
//       variantId: selectedVariant._id,
//       color: selectedVariant.color || "",
//       size: selectedVariant.size,
//       quantity: 1,
//       stockCount: selectedVariant.quantity,
//     };

//     setAddingToCart(true);
//     await addToCart(item);
//     setAddingToCart(false);
//     onClose();
//   };

//   return (
//     <Portal>
//       <AnimatePresence>
//         <m.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           onClick={onClose}
//           className="fixed inset-0 z-60 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
//         >
//           <m.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.9, opacity: 0 }}
//             onClick={(e) => e.stopPropagation()}
//             transition={{ duration: 0.25 }}
//             className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto p-6 relative"
//           >
//             {/* CLOSE BUTTON */}
//             <button
//               onClick={onClose}
//               className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded-full"
//             >
//               <X size={18} />
//             </button>

//             {/* HEADER */}
//             <h2 className="text-center text-2xl font-semibold mb-6">
//               Size Guide
//             </h2>

//             {/* CONTENT GRID */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* IMAGE + INFO */}
//               <div className="flex gap-6 items-start">
//                 <div className="relative w-full aspect-[3/4] rounded-md overflow-hidden">
//                   <Image
//                     src={product.images?.[0]?.imageUrl || ""}
//                     alt={product.title}
//                     fill
//                     className="object-cover object-top"
//                   />
//                 </div>

//                 <div className="flex flex-col gap-2">
//                   <h2 className="text-2xl font-light line-clamp-2 cursor-pointer">
//                     {product.title}
//                   </h2>

//                   <p className="text-gray-600 max-w-[300px] leading-snug line-clamp-2 cursor-pointer">
//                     {product.subTitle}
//                   </p>

//                   <span className="text-xl text-gray-900">
//                     ₹{discountedPrice}
//                   </span>

//                   <div className="flex items-center gap-3 mt-4">
//                     {/* SIZE DROPDOWN */}
//                     <div className="relative">
//                       <button
//                         className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm border transition
//                           ${sizeError
//                             ? "border-red-500 text-red-600"
//                             : "border-gray-300 text-gray-700 hover:bg-gray-100"
//                           }
//                         `}
//                         onClick={() => {
//                           setShowSizeDropdown((prev) => !prev);
//                           setSizeError(false);
//                         }}
//                       >
//                         {selectedSize}
//                         <ChevronDown size={16} />
//                       </button>

//                       {sizeError && (
//                         <p className="text-red-600 text-xs mt-2">
//                           Please select a size
//                         </p>
//                       )}

//                       {showSizeDropdown && (
//                         <div className="absolute left-0 w-30 mt-1 bg-white border shadow-md rounded-md z-60">
//                           {availableSizes.length > 0 ? (
//                             availableSizes.map((size) => (
//                               <button
//                                 key={size}
//                                 className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
//                                 onClick={() => {
//                                   setSelectedSize(size);
//                                   setShowSizeDropdown(false);
//                                   setSizeError(false);
//                                 }}
//                               >
//                                 {size}
//                               </button>
//                             ))
//                           ) : (
//                             <p className="px-3 py-2 text-sm text-gray-500">
//                               No sizes available
//                             </p>
//                           )}
//                         </div>
//                       )}
//                     </div>

//                     {/* ADD TO CART BUTTON */}
//                     <button
//                       onClick={handleAddToBag}
//                       disabled={addingToCart}
//                       className="flex-1 select-none w-20 relative overflow-hidden rounded-full font-medium flex items-center justify-center gap-2 px-6 py-3 text-white bg-gray-900 shadow-[0_4px_14px_rgba(0,0,0,0.25)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:scale-[1.02] active:scale-[0.98]"
//                     >
//                       {addingToCart ? (
//                         <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                       ) : added ? (
//                         <Check className="w-5 h-5 text-white" />
//                       ) : (
//                         <ShoppingCart className="w-5 h-5" />
//                       )}

//                       <span className="tracking-wide">
//                         {addingToCart ? "Adding..." : "Add to Cart"}
//                       </span>
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* SIZE TABLE */}
//               <div>
//                 <div className="flex items-center justify-end gap-3 text-sm mb-2">
//                   <span
//                     className={
//                       unit === "in" ? "font-semibold" : "text-gray-500"
//                     }
//                   >
//                     Inches
//                   </span>

//                   <button
//                     onClick={() => setUnit(unit === "in" ? "cm" : "in")}
//                     className="relative w-10 h-5 bg-gray-300 rounded-full transition"
//                   >
//                     <div
//                       className={`absolute top-[2px] h-4 w-4 rounded-full bg-white shadow transition-all ${unit === "in" ? "left-[2px]" : "left-[22px]"
//                         }`}
//                     />
//                   </button>

//                   <span
//                     className={
//                       unit === "cm" ? "font-semibold" : "text-gray-500"
//                     }
//                   >
//                     Centimeters
//                   </span>
//                 </div>

//                 <table className="w-full border mt-4 text-center text-sm">
//                   <thead className="bg-gray-100">
//                     <tr>
//                       <th className="border p-2">Size</th>
//                       <th className="border p-2">Bust</th>
//                       <th className="border p-2">Shoulder</th>
//                       <th className="border p-2">Arm</th>
//                       <th className="border p-2">Hip</th>
//                       <th className="border p-2">Waist</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {rows.map((row) => (
//                       <tr key={row.size}>
//                         <td className="border p-2">{row.size}</td>
//                         <td className="border p-2">
//                           {convert(row.bust).toFixed(1)}
//                         </td>
//                         <td className="border p-2">
//                           {convert(row.shoulder).toFixed(1)}
//                         </td>
//                         <td className="border p-2">
//                           {convert(row.arm).toFixed(1)}
//                         </td>
//                         <td className="border p-2">
//                           {convert(row.hip).toFixed(1)}
//                         </td>
//                         <td className="border p-2">
//                           {convert(row.waist).toFixed(1)}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* FOOTER SECTION */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
//               <div className="bg-gray-50 p-6 rounded-md text-center">
//                 <h3 className="text-lg font-semibold">Can’t find your size?</h3>
//                 <p className="text-gray-600 mt-2">
//                   Select Custom from the size options and get it made for you.
//                 </p>

//                 <h4 className="font-semibold mt-4">Contact Us</h4>

//                 <div className="flex justify-center gap-4 mt-4">
//                   <button className="px-4 py-2 border rounded-full">
//                     Chat
//                   </button>
//                   <button className="px-4 py-2 border rounded-full">
//                     +91 88828800619
//                   </button>
//                   <button className="px-4 py-2 border rounded-full">
//                     Email
//                   </button>
//                 </div>
//               </div>

//               <Image
//                 src="/women_size_guide.gif"
//                 alt="size measure"
//                 width={500}
//                 height={400}
//                 className="rounded-md w-full object-cover"
//               />
//             </div>
//           </m.div>
//         </m.div>
//       </AnimatePresence>
//     </Portal>
//   );
// }
