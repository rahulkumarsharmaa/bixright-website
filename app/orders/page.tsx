"use client";

import { useEffect, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import Image from "next/image";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ChevronDown,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Calendar,
  CreditCard,
  AlertTriangle
} from "lucide-react";
import type { Order } from "@/app/types/product";
import FilterProduct from "@/app/components/FilterProduct";
import { toast } from "sonner";
import { LuSquareSplitHorizontal } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { useSite } from "@/app/context/siteSetting";

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};


// --- TYPES ---
interface Props {
  setSidebarOpen?: (value: boolean) => void;
  isEmbedded?: boolean;
}

interface CancelPayload {
  orderId: string;
  remark: string;
}

// --- COMPONENTS ---

// 1. ORDER TRACKER (Visual Stepper)
const OrderTracker = ({ status }: { status: string }) => {
  const steps = [
    { key: "pending", label: "Pending", icon: Clock },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: Package },
  ];

  if (status === "cancelled") {
    return (
      <div className="w-full bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-700 mt-4 mb-2 animate-in fade-in slide-in-from-bottom-2">
        <div className="bg-red-100 p-2 rounded-full">
          <XCircle size={20} />
        </div>
        <div>
          <p className="font-bold text-sm">Order Cancelled</p>
          <p className="text-xs opacity-80">This order has been cancelled and will not be processed.</p>
        </div>
      </div>
    );
  }

  let activeIndex = 0;
  if (status === 'confirmed') activeIndex = 1;
  if (status === 'shipped') activeIndex = 2;
  if (status === 'delivered') activeIndex = 3;

  return (
    <>
      {/* DESKTOP HORIZONTAL STEPPER */}
      <div className="hidden sm:block relative w-full mt-8 mb-10 px-4">
        {/* Background Line */}
        <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-100 -translate-y-1/2 rounded-full z-0" />

        {/* Active Progress Line */}
        <m.div
          initial={{ width: 0 }}
          animate={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute top-1/2 left-4 h-1 bg-brand -translate-y-1/2 rounded-full z-0 origin-left"
          style={{ maxWidth: 'calc(100% - 2rem)' }}
        />

        <div className="relative z-10 flex justify-between w-full text-center">
          {steps.map((step, idx) => {
            const isCompleted = idx <= activeIndex;
            const isCurrent = idx === activeIndex;
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex flex-col items-center gap-3 relative">
                <m.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.2 : 1,
                    backgroundColor: isCompleted ? "var(--brand-primary)" : "#ffffff",
                    borderColor: isCompleted ? "var(--brand-primary)" : "#e5e7eb",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`w-10 h-10 rounded-full border-4 flex items-center justify-center relative z-10
                    ${isCompleted ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'bg-white text-gray-300 border-gray-200'}
                  `}
                >
                  {isCurrent && (
                    <m.div
                      layoutId="pulse"
                      className="absolute inset-0 rounded-full border-4 border-brand/10 -z-10"
                      animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}

                  {idx < activeIndex ? (
                    <m.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <CheckCircle size={16} fill="white" className="text-brand bg-white rounded-full" />
                    </m.div>
                  ) : (
                    <Icon size={16} strokeWidth={2.5} />
                  )}
                </m.div>

                <div className="absolute top-12 left-1/2 -translate-x-1/2 min-w-[80px]">
                  <p className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${isCompleted ? 'text-brand' : 'text-gray-400'}`}>
                    {step.label}
                  </p>
                  {isCurrent && (
                    <m.p
                      initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] text-gray-500 font-medium leading-tight mt-0.5"
                    >
                      Processing
                    </m.p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOBILE VERTICAL STEPPER */}
      <div className="sm:hidden relative w-full mt-6 mb-8 pl-8 flex flex-col gap-6">
        {/* Background Vertical Line */}
        <div className="absolute left-[50px] top-2 bottom-2 w-1 bg-gray-100 rounded-full z-0" />

        {/* Active Progress Line */}
        <m.div
          initial={{ height: 0 }}
          animate={{ height: `${(activeIndex / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute left-[50px] top-2 w-1 bg-brand rounded-full z-0 origin-top"
          style={{ maxHeight: 'calc(100% - 1rem)' }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx <= activeIndex;
          const isCurrent = idx === activeIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex items-center gap-4 relative z-10">
              <m.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.15 : 1,
                  backgroundColor: isCompleted ? "var(--brand-primary)" : "#ffffff",
                  borderColor: isCompleted ? "var(--brand-primary)" : "#e5e7eb",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`w-9 h-9 rounded-full border-4 flex items-center justify-center relative flex-shrink-0
                  ${isCompleted ? 'bg-brand text-white shadow-md shadow-brand/10' : 'bg-white text-gray-300 border-gray-200'}
                `}
              >
                {isCurrent && (
                  <m.div
                    className="absolute inset-0 rounded-full border-4 border-brand/10 -z-10"
                    animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                  />
                )}

                {idx < activeIndex ? (
                  <m.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckCircle size={14} fill="white" className="text-brand bg-white rounded-full" />
                  </m.div>
                ) : (
                  <Icon size={14} strokeWidth={2.5} />
                )}
              </m.div>

              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-brand' : 'text-gray-400'}`}>
                  {step.label}
                </p>
                {isCurrent && (
                  <p className="text-[10px] text-gray-500 font-medium mt-0.5">
                    Processing
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

// 2. STATUS BADGE
const ModernStatusBadge = ({ status }: { status: string }) => {
  const config = {
    pending: { bg: "bg-amber-50/80 border-amber-200/50", text: "text-amber-700", label: "Pending" },
    confirmed: { bg: "bg-brand-light/70 border-brand/20", text: "text-brand", label: "Confirmed" },
    shipped: { bg: "bg-purple-50/80 border-purple-200/50", text: "text-purple-700", label: "Shipped" },
    delivered: { bg: "bg-emerald-50/80 border-emerald-200/50", text: "text-emerald-700", label: "Delivered" },
    cancelled: { bg: "bg-rose-50/80 border-rose-200/50", text: "text-rose-700", label: "Cancelled" },
    returned: { bg: "bg-gray-50/80 border-gray-200/50", text: "text-gray-600", label: "Returned" },
  };
  const c = config[status as keyof typeof config] || config.pending;

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
};


// --- MAIN PAGE COMPONENT ---
export default function OrdersPage({ setSidebarOpen, isEmbedded = false }: Props) {
  const router = useRouter();
  const { siteData } = useSite();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [openOrder, setOpenOrder] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState("");


  const formatDate = (value: string) => {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const fetchOrders = async (status: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const endpoint = status === "all"
        ? `${process.env.NEXT_PUBLIC_API_URL}/order/fetch-orders`
        : `${process.env.NEXT_PUBLIC_API_URL}/order/fetch-orders?status=${status}`;

      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const json = await res.json();
      setOrders(json.success ? json.orders : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(filter);
  }, [filter]);

  const handleCancel = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/cancel-order`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId: selectedOrderId, remark: reason }),
      });

      const data = await res.json();
      if (data.success || res.ok) {
        toast.success("Order cancelled successfully");
        setIsCancelOpen(false);
        setReason("");
        fetchOrders(filter);
      } else {
        toast.error(data.message || "Failed to cancel order");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // Helper to fetch image as base64
  const getImageData = async (url: string): Promise<string | null> => {
    try {
      if (!url) return null;
      const res = await fetch(url);
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error loading image for PDF", error);
      return null;
    }
  };

  const handleDownloadInvoice = async (order: Order) => {
    const toastId = toast.loading("Generating Invoice...");
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // --- CONSTANTS ---
      const margin = 15;
      const primaryColor = "#000000";
      const secondaryColor = "#555555";
      const lineColor = "#E0E0E0";

      // --- HEADER ---
      // Company Details (Left)
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(siteData?.siteName || "Bixright Electronics", margin, 20);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(secondaryColor);
      const rawAddress = siteData?.address || "123, Tech Plaza, Silicon Valley\nIndia - 400001";
      const addressLines = rawAddress.split('\n').map(line => line.trim()).filter(Boolean);
      let currentY = 26;
      addressLines.forEach((line) => {
        doc.text(line, margin, currentY);
        currentY += 5;
      });
      doc.text(`Email: ${siteData?.email || "support@Bixright.com"}`, margin, currentY);
      currentY += 5;
      if (siteData?.phone) {
        doc.text(`Phone: +91 ${siteData.phone}`, margin, currentY);
        currentY += 5;
      }
      doc.text("GSTIN: 27ABCDE1234F1Z5", margin, currentY);

      // Invoice Label (Right)
      doc.setFontSize(16);
      doc.setTextColor(primaryColor);
      doc.text("TAX INVOICE", pageWidth - margin, 20, { align: "right" });

      doc.setFontSize(10);
      doc.text(`Invoice #: INV-${order.orderId.substring(order.orderId.length - 6)}`, pageWidth - margin, 28, { align: "right" });
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, pageWidth - margin, 34, { align: "right" });

      // Divider
      doc.setDrawColor(lineColor);
      doc.line(margin, 46, pageWidth - margin, 46);

      // --- ADDRESS SECTION ---
      // Billing Address
      const billY = 55;
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor);
      doc.text("Billing Address:", margin, billY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(secondaryColor);
      const billAddr = order.billingAddress || {};
      let billText = [
        billAddr?.fullName || "Guest User",
        billAddr?.street || "",
        `${billAddr?.city || ''} ${billAddr?.state || ''} ${billAddr?.zipCode || ''}`.trim(),
        billAddr?.country || "",
        billAddr?.phone ? `Phone: ${billAddr.phone}` : ""
      ].filter(Boolean).join("\n");
      doc.text(billText, margin, billY + 6);

      // Shipping Address
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor);
      doc.text("Shipping Address:", pageWidth / 2 + 10, billY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(secondaryColor);
      const shipAddr = order.shippingAddress || {};
      let shipText = [
        shipAddr?.fullName || "Guest User",
        shipAddr?.street || "",
        `${shipAddr?.city || ''} ${shipAddr?.state || ''} ${shipAddr?.zipCode || ''}`.trim(),
        shipAddr?.country || "",
        shipAddr?.phone ? `Phone: ${shipAddr.phone}` : ""
      ].filter(Boolean).join("\n");
      doc.text(shipText, pageWidth / 2 + 10, billY + 6);

      // --- ORDER INFO BOX ---
      const infoY = 85;
      doc.setFillColor("#F9FAFB");
      doc.roundedRect(margin, infoY, pageWidth - (margin * 2), 16, 2, 2, "F");

      doc.setFontSize(9);
      doc.setTextColor(primaryColor);
      doc.text("Order ID:", margin + 5, infoY + 6);
      doc.setFont("helvetica", "bold");
      doc.text(order.orderId, margin + 5, infoY + 11);

      doc.setFont("helvetica", "normal");
      doc.text("Payment Method:", margin + 60, infoY + 6);
      doc.setFont("helvetica", "bold");
      doc.text(order.paymentMethod.toUpperCase() || "ONLINE", margin + 60, infoY + 11);

      doc.setFont("helvetica", "normal");
      doc.text("Order Status:", margin + 120, infoY + 6);
      doc.setFont("helvetica", "bold");
      doc.text(order.orderStatus.toUpperCase(), margin + 120, infoY + 11);


      // --- PRODUCTS TABLE ---

      // Prepare Table Data (Wait for images)
      const tableRows: {
        index: number;
        image: string | null;
        desc: string;
        qty: number;
        price: string;
        total: string;
      }[] = [];
      for (let i = 0; i < order.products.length; i++) {
        const item = order.products[i];
        let productDesc = item.title;
        if (item.color || item.size) {
          productDesc += `\nVar: ${[item.color, item.size].filter(Boolean).join(", ")}`;
        }

        // Fetch Image
        let imgData = null;
        if (item.image) {
          imgData = await getImageData(item.image);
        }

        tableRows.push({
          index: i + 1,
          image: imgData, // Helper prop
          desc: productDesc,
          qty: item.quantity,
          price: `Rs.${(item.price || 0).toLocaleString()}`,
          total: `Rs.${(item.total || 0).toLocaleString()}`
        });
      }

      // Draw Table
      autoTable(doc, {
        startY: 110,
        head: [['#', 'Image', 'Description', 'Qty', 'Unit Price', 'Total']],
        body: tableRows.map(row => [row.index, '', row.desc, row.qty, row.price, row.total]),
        theme: 'plain',
        styles: {
          fontSize: 9,
          cellPadding: 4,
          valign: 'middle',
          lineColor: [224, 224, 224],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [0, 0, 0], // Black Header
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'left'
        },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 20, minCellHeight: 20 }, // Image col
          2: { cellWidth: 'auto' },
          3: { cellWidth: 15, halign: 'center' },
          4: { cellWidth: 25, halign: 'right' },
          5: { cellWidth: 30, halign: 'right' },
        },
        didDrawCell: (data) => {
          if (data.section === 'body' && data.column.index === 1) {
            const rowData = tableRows[data.row.index];
            if (rowData && rowData.image) {
              const imgSize = 16;
              const xPos = data.cell.x + 2;
              const yPos = data.cell.y + 2;
              doc.addImage(rowData.image, 'JPEG', xPos, yPos, imgSize, imgSize);
            }
          }
        },
      });

      // --- TOTALS ---
      // @ts-ignore
      const finalY = doc.lastAutoTable.finalY + 10;
      const rightColX = pageWidth - margin - 60;

      // Subtotals
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Subtotal:", rightColX, finalY);
      doc.text(`Rs.${(order.totalAmount).toLocaleString()}`, pageWidth - margin, finalY, { align: "right" });

      doc.text("Shipping:", rightColX, finalY + 6);
      doc.text("Rs.0.00", pageWidth - margin, finalY + 6, { align: "right" }); // Assuming free or incl.

      doc.text("Tax (Incl.):", rightColX, finalY + 12);
      doc.text("Rs.0.00", pageWidth - margin, finalY + 12, { align: "right" });

      // Divider
      doc.setDrawColor(lineColor);
      doc.line(rightColX, finalY + 16, pageWidth - margin, finalY + 16);

      // Grand Total
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Grand Total:", rightColX, finalY + 24);
      doc.text(`Rs.${(order.totalAmount).toLocaleString()}`, pageWidth - margin, finalY + 24, { align: "right" });


      // --- FOOTER ---
      const footerY = doc.internal.pageSize.getHeight() - 30;

      doc.setDrawColor(lineColor);
      doc.line(margin, footerY, pageWidth - margin, footerY);

      doc.setFontSize(10);
      doc.text("Authorized Signatory", pageWidth - margin, footerY + 20, { align: "right" });

      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.text("This is a computer generated invoice.", margin, footerY + 10);
      doc.text("Thank you for your business!", margin, footerY + 20);

      // Save
      doc.save(`Invoice_${order.orderId}.pdf`);
      toast.dismiss(toastId);
      toast.success("Invoice downloaded successfully");

    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error("Failed to generate invoice");
    }
  };

  return (
    <main className={`relative ${isEmbedded ? '' : 'min-h-screen'} bg-transparent px-4 sm:px-6 py-6 font-sans`}>
      <div className="max-w-5xl mx-auto md:px-6">

        {/* HEADER SECTION */}
        <div className="flex flex-row items-center justify-between gap-4 mb-8 w-full">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Trigger */}
            {setSidebarOpen && (
              <div className="lg:hidden">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-light border border-gray-200 shadow-sm text-gray-700"
                >
                  <LuSquareSplitHorizontal size={20} />
                </button>
              </div>
            )}
            <div>
              <h1 className=" text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Your Orders</h1>
              <p className="hidden sm:block text-sm text-gray-500">Track, manage and return your orders</p>
            </div>
          </div>

          {/* Filter Component */}
          <div className="flex-shrink-0 w-32 sm:w-auto">
            <FilterProduct filter={filter} setFilter={setFilter} />
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl md:rounded-4xl h-40 w-full animate-pulse border border-gray-100 shadow-sm" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center bg-brand-light rounded-2xl md:rounded-4xl border border-dashed border-brand/20 p-12 text-center"
          >
            <div className="w-16 h-16 bg-brand-light/30 rounded-2xl md:rounded-4xl flex items-center justify-center mb-4 text-brand/40">
              <Package size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No orders found</h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">It looks like you haven't placed any orders with this filter yet.</p>
          </m.div>
        ) : (
          <m.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-5"
          >
            <AnimatePresence mode="popLayout">
              {orders.map((order) => {
                const isOpen = openOrder === order._id;

                return (
                  <m.div
                    key={order._id}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
                    }}
                    className={`bg-brand-light rounded-2xl md:rounded-4xl border overflow-hidden ${isOpen ? ' shadow-sm' : 'border-brand/10 shadow-sm hover:border-brand/30'}`}
                  >
                    {/* CARD HEADER */}
                    <div
                      onClick={() => setOpenOrder(isOpen ? null : order._id)}
                      className="p-4 sm:p-5 cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative z-20 bg-brand-light"
                    >
                      {/* Order Info & Images Preview */}
                      <div className="md:col-span-5 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</span>
                          <span className="text-xs font-mono text-gray-600 bg-brand/10 px-2 py-0.5 rounded-full">{order.orderId}</span>
                        </div>

                        {/* Collapsed Images Preview */}
                        {!isOpen && (
                          <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex -space-x-3 overflow-hidden py-1"
                          >
                            {order.products.slice(0, 4).map((item, idx) => (
                              <m.div
                                layoutId={`img-${order._id}-${item.variantId}`}
                                key={item.variantId}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="relative w-12 h-12 rounded-xl border-2 border-white bg-gray-100 overflow-hidden shadow-sm z-10"
                                style={{ zIndex: 10 - idx }}
                              >
                                {item.image ? (
                                  <Image src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.image}`} alt={item.title} fill className="object-cover object-top" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-300"><Package size={12} /></div>
                                )}
                              </m.div>
                            ))}
                            {order.products.length > 4 && (
                              <div className="w-10 h-10 rounded-xl border-2 border-white bg-gray-500 flex items-center justify-center text-[10px] font-bold text-gray-500 z-0">
                                +{order.products.length - 4}
                              </div>
                            )}
                          </m.div>
                        )}

                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                          <Calendar size={14} className="text-gray-400" />
                          {formatDate(order.createdAt)}
                        </div>
                      </div>

                      {/* Amount & Status */}
                      <div className="md:col-span-3 flex flex-col md:flex-row md:items-center md:justify-center gap-2 md:gap-8">
                        <div>
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Total Amount</span>
                          <span className="text-lg font-bold text-gray-900">₹{order.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="md:col-span-3 flex md:justify-end items-center gap-3">
                        <ModernStatusBadge status={order.orderStatus} />
                      </div>

                      {/* Toggle Icon */}
                      <div className="md:col-span-1 flex justify-end">
                        <m.div animate={{ rotate: isOpen ? 180 : 0 }}>
                          <ChevronDown className="text-gray-400" size={20} />
                        </m.div>
                      </div>
                    </div>

                    {/* CARD EXPANDED DETAILS */}
                    <AnimatePresence>
                      {isOpen && (
                        <m.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        >
                          <div className="px-6 pb-6 pt-2 border-t border-brand/10">

                            {/* 1. Tracker */}
                            <OrderTracker status={order.orderStatus} />

                            {/* 2. Grid Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 bg-brand-light/20 p-4 rounded-3xl border border-brand/10">
                              <div>
                                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                  <MapPin size={14} /> Delivery Address
                                </h4>
                                {order.courierCompany ? (
                                  <div className="text-sm text-gray-600 space-y-1">
                                    <p><span className="font-medium text-gray-900">Courier:</span> {order.courierCompany}</p>
                                    <p><span className="font-medium text-gray-900">Tracking ID:</span> {order.trackingNumber || "N/A"}</p>
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500 italic">Tracking details will be updated once shipped.</p>
                                )}
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                  <CreditCard size={14} /> Payment Info
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Method: <span className="font-medium text-gray-900 capitalize">{order.paymentMethod}</span>
                                </p>
                                <p className={`text-xs mt-1 font-medium ${order.isPaid ? 'text-green-600' : 'text-orange-600'}`}>
                                  {order.isPaid ? 'Payment Complete' : 'Payment Pending'}
                                </p>
                              </div>
                            </div>

                            {/* 3. Product List */}
                            <div className="space-y-4">
                              {order.products.map((item) => (
                                <div
                                  key={item.variantId}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Navigate to product page using productId
                                    if (item.productId) {
                                      router.push(`/product/${item.productId}`);
                                    } else {
                                      // Fallback to title slug if productId is missing (legacy orders)
                                      const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                                      router.push(`/product/${slug}`);
                                    }
                                  }}
                                  className="group flex items-start gap-4 p-3 bg-brand-light rounded-3xl border border-brand/10 hover:border-brand/30 hover:bg-brand-light/10 transition-all cursor-pointer"
                                >
                                  <m.div
                                    layoutId={`img-${order._id}-${item.variantId}`}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="w-16 h-16 shrink-0 bg-gray-100 rounded-xl overflow-hidden relative group-hover:scale-105 transition-transform duration-300"
                                  >
                                    {item.image ? (
                                      <Image src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.image}`} alt={item.title} fill className="object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-300"><Package size={20} /></div>
                                    )}
                                  </m.div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight mb-1 group-hover:text-amber-600 transition-colors">{item.title}</h4>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                      <span className="bg-gray-100 px-2 py-0.5 rounded-full group-hover:bg-white transition-colors">Qty: {item.quantity}</span>
                                      {item.color && <span>Color: {item.color}</span>}
                                      {item.size && <span>Size: {item.size}</span>}
                                    </div>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <p className="text-sm font-bold text-gray-900">₹{item.total.toLocaleString()}</p>
                                    <span className="text-xs text-amber-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 inline-block duration-300">View Details &rarr;</span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* 4. Action Buttons */}
                            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                              {order.orderStatus === "delivered" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadInvoice(order);
                                  }}
                                  className="w-full sm:w-auto px-5 py-2.5 bg-brand text-white rounded-full text-sm font-medium hover:bg-brand/90 transition-all flex items-center justify-center gap-2 shadow-sm"
                                >
                                  <Package size={16} />
                                  Download Invoice
                                </button>
                              )}

                              {!["shipped", "delivered", "cancelled", "returned"].includes((order.orderStatus || "").toLowerCase()) && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedOrderId(order._id);
                                    setIsCancelOpen(true);
                                  }}
                                  className="w-full sm:w-auto px-5 py-2.5 bg-white text-red-600 border border-red-200 rounded-full text-sm font-medium hover:bg-red-50 hover:border-red-300 transition-all flex items-center justify-center gap-2"
                                >
                                  <XCircle size={16} />
                                  Cancel Order
                                </button>
                              )}
                            </div>

                          </div>
                        </m.div>
                      )}
                    </AnimatePresence>
                  </m.div>
                );
              })}
            </AnimatePresence>
          </m.div>
        )
        }
      </div >

      {/* CANCEL ORD ER MODAL */}
      <AnimatePresence>
        {
          isCancelOpen && (
            <div className="fixed inset-0 z-[99] flex items-center justify-center px-4">
              {/* Backdrop */}
              <m.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsCancelOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />

              {/* Modal Content */}
              <m.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative z-10"
              >
                <div className="bg-red-50 p-6 border-b border-red-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-0.5">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-900">Cancel Order</h3>
                    <p className="text-xs text-red-700">This action is irreversible.</p>
                  </div>
                </div>

                <div className="p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for cancellation</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g., I changed my mind, found a better price..."
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none min-h-[100px] resize-none"
                  />
                </div>

                <div className="p-6 pt-0 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setIsCancelOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    Keep Order
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={!reason.trim()}
                    className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                  >
                    Confirm Cancellation
                  </button>
                </div>
              </m.div>
            </div>
          )
        }
      </AnimatePresence >
    </main >
  );
}
