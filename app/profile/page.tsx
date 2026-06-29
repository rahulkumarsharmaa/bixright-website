"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
  User,
  ShoppingBag,
  Heart,
  LogOut,
  Camera,
  MapPin,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Menu,
  X
} from "lucide-react";
import Image from "next/image";
import { LuSquareSplitHorizontal } from "react-icons/lu";
import Wishlist from "../wishlist/page";
import OrdersPage from "../orders/page";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useSite } from "../context/siteSetting";

// --- TYPES ---
type Address = {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

type BankDetail = {
  bankName: string;
  accountNumber: string;
  ifsc?: string;
};

type UserProfile = {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  gender?: string;
  dob?: string;
  avatar?: string;
  address?: Address;
  shippingAddress?: Address;
  bankDetails?: BankDetail[];
};

const AVATAR_SRC = "/avatar.png";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
};

function ProfileContent() {
  const router = useRouter();
  const { siteData } = useSite();
  const searchParams = useSearchParams();
  const tabValue = searchParams.get("tab");
  const [selectedNav, setSelectedNav] = useState(tabValue ?? "profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateField("avatar", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    setSelectedNav(tabValue ?? "profile");
  }, [tabValue]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/user/login");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customer/get-profile`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }
      );

      const data = await res.json();
      const received: UserProfile | null = data?.data ?? null;
      setProfile(received);
      setForm(received);
    } catch (err) {
      setProfile(null);
      setForm(null);
      console.error("fetchProfile error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set loading true initially
    fetchProfile();
  }, []);

  function updateField<K extends keyof UserProfile>(
    field: K,
    value: UserProfile[K]
  ) {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  function updateAddressField<K extends keyof Address>(
    key: K,
    value: Address[K]
  ) {
    setForm((prev) => {
      if (!prev) return prev;
      const addr: Address = { ...(prev.address ?? ({} as Address)) };
      addr[key] = value;
      return { ...prev, address: addr };
    });
  }

  function updateShippingField<K extends keyof Address>(
    key: K,
    value: Address[K]
  ) {
    setForm((prev) => {
      if (!prev) return prev;
      const addr: Address = { ...(prev.shippingAddress ?? ({} as Address)) };
      addr[key] = value;
      return { ...prev, shippingAddress: addr };
    });
  }

  const saveProfile = async () => {
    if (!form) return;

    // Check payload size
    const payload = JSON.stringify(form);
    const sizeInBytes = new TextEncoder().encode(payload).length;
    const sizeInMB = sizeInBytes / (1024 * 1024);

    if (sizeInMB > 2) {
      toast.error(`Image too large (${sizeInMB.toFixed(1)}MB). Please select an image under 2MB.`);
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customer/update-profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: payload,
        }
      );

      // Handle non-JSON responses (e.g., HTML error pages)
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Server Response Not JSON:", text.substring(0, 100));
        throw new Error("Server returned an invalid response");
      }

      if (data?.success) {
        setProfile(form);
        setEditMode(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error(data?.message || "Failed to update profile");
        console.error("saveProfile failed", data);
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong saving profile");
      console.error("saveProfile error", err);
    } finally {
      setSaving(false);
    }
  };

  const navItems = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "orders", label: "My Orders", icon: ShoppingBag },
    { id: "wishlist", label: "My Wishlist", icon: Heart },
  ];

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          <p className="text-brand/60 text-sm font-medium">Loading profile...</p>
        </div>
      </div>
    );

  if (!form || !profile)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-red-600 font-medium">Unable to load profile. Please try logging in again.</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-brand-light/50 pb-20 pt-8 px-4 font-sans text-gray-900">
      <title>{siteData.siteName ? `${siteData.siteName} | My Profile` : "Bixright | My Profile"}</title>
      <meta name="description" content={`View and manage your profile details, orders, and wishlist on ${siteData.siteName || "Bixright"}.`} />
      <meta property="og:title" content={siteData.siteName ? `${siteData.siteName} | My Profile` : "Bixright | My Profile"} />
      <meta property="og:description" content={`View and manage your profile details, orders, and wishlist on ${siteData.siteName || "Bixright"}.`} />
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* SIDEBAR (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            {/* Profile Brief */}
            <div className="bg-brand-light rounded-2xl md:rounded-4xl p-6 border border-brand/10 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-brand-light border border-brand/20">
                <Image
                  src={AVATAR_SRC}
                  alt="avatar"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 truncate">{profile.firstName} {profile.lastName}</p>
                <p className="text-xs text-gray-500 truncate">{profile.email}</p>
              </div>
            </div>

            {/* Nav Menu */}
            <nav className="bg-brand-light rounded-2xl md:rounded-4xl p-4 border border-brand/10 shadow-sm space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = selectedNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedNav(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-4xl transition-all duration-200 cursor-pointer
                                ${isActive
                        ? "bg-brand text-white shadow-md shadow-brand/20"
                        : "text-gray-600 hover:bg-brand/5 hover:text-brand"
                      }`}
                  >
                    <Icon size={18} className={isActive ? "text-white" : "text-gray-400"} />
                    {item.label}
                  </button>
                )
              })}

              <div className="pt-4 mt-2 border-t border-brand/10">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </nav>
          </aside>


          {/* MAIN CONTENT Area */}
          <main className="lg:col-span-9">
            {/* Mobile Header trigger */}
            <div className="lg:hidden mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-bold">
                  {profile.firstName[0]}
                </div>
                <div>
                  <h1 className="text-lg font-bold">My Account</h1>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 border border-brand/10 rounded-lg bg-white shadow-sm cursor-pointer"
              >
                <LuSquareSplitHorizontal size={20} />
              </button>
            </div>

            <AnimatePresence mode="wait">
              <m.div
                key={selectedNav}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {selectedNav === "profile" && (
                  <div className="space-y-6">
                    {/* Profile Header Card */}
                    <div className="bg-brand-light rounded-2xl md:rounded-4xl border border-brand/10 shadow-sm p-6 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-24 overflow-hidden">
                        <Image
                          src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop"
                          alt="Electronics banner"
                          fill
                          className="object-cover"
                          priority
                        />
                        <div className="absolute inset-0 bg-black/50" />
                      </div>

                      <div className="relative pt-12 flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
                        <div className="flex items-end gap-5">
                          <div className="relative">
                            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                              <Image
                                src={form.avatar || AVATAR_SRC}
                                alt="avatar"
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {editMode && (
                              <>
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  className="hidden"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                />
                                <button
                                  onClick={triggerFileInput}
                                  className="absolute bottom-0 right-0 p-1.5 bg-brand text-white rounded-full border-2 border-white shadow-sm hover:scale-105 transition-transform cursor-pointer"
                                >
                                  <Camera size={14} />
                                </button>
                              </>
                            )}
                          </div>
                          <div className="pb-2">
                            <h1 className="text-2xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h1>
                            <p className="text-sm text-gray-500">{profile.email}</p>
                          </div>
                        </div>

                        <div className="flex gap-3 pb-2 w-full md:w-auto">
                          {editMode ? (
                            <>
                              <button
                                onClick={() => {
                                  setForm(profile);
                                  setEditMode(false);
                                }}
                                className="flex-1 md:flex-none px-4 py-2 text-sm font-medium text-gray-600 bg-brand-light border border-gray-300 rounded-4xl hover:bg-gray-50 transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={saveProfile}
                                disabled={saving}
                                className="flex-1 md:flex-none px-6 py-2 text-sm font-medium text-white bg-brand rounded-4xl hover:bg-brand/90 transition-colors shadow-sm cursor-pointer"
                              >
                                {saving ? "Saving..." : "Save Changes"}
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setEditMode(true)}
                              className="flex-1 md:flex-none px-6 py-2 text-sm font-medium text-white bg-brand rounded-4xl hover:bg-brand/90 transition-colors shadow-sm cursor-pointer"
                            >
                              Edit Profile
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-brand-light rounded-2xl md:rounded-4xl border border-brand/10 shadow-sm p-6 md:p-8">
                      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <User size={20} className="text-gray-400" />
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <InputField
                          label="First Name"
                          value={form.firstName}
                          onChange={(v) => updateField("firstName", v)}
                          editMode={editMode}
                        />
                        <InputField
                          label="Last Name"
                          value={form.lastName}
                          onChange={(v) => updateField("lastName", v)}
                          editMode={editMode}
                        />
                        <InputField
                          label="Email Address"
                          value={form.email}
                          onChange={(v) => updateField("email", v)}
                          editMode={editMode}
                          icon={Mail}
                        />
                        <InputField
                          label="Phone Number"
                          value={form.phone}
                          onChange={(v) => updateField("phone", v)}
                          editMode={editMode}
                          icon={Phone}
                        />
                        <InputField
                          label="Date of Birth"
                          value={form.dob?.slice(0, 10) ?? ""}
                          onChange={(v) => updateField("dob", v)}
                          editMode={editMode}
                          type="date"
                          icon={Calendar}
                        />
                        <SelectField
                          label="Gender"
                          value={form.gender ?? ""}
                          onChange={(v) => updateField("gender", v)}
                          editMode={editMode}
                          options={["Male", "Female", "Other"]}
                        />
                      </div>
                    </div>

                    {/* Addresses Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Billing Address */}
                      <div className="bg-brand-light rounded-2xl md:rounded-4xl border border-brand/10 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                          <MapPin size={20} className="text-gray-400" />
                          Billing Address
                        </h3>
                        <div className="space-y-4">
                          <InputField
                            label="Address Line 1"
                            value={form.address?.addressLine1 ?? ""}
                            onChange={(v) => updateAddressField("addressLine1", v)}
                            editMode={editMode}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <InputField
                              label="City"
                              value={form.address?.city ?? ""}
                              onChange={(v) => updateAddressField("city", v)}
                              editMode={editMode}
                            />
                            <InputField
                              label="State"
                              value={form.address?.state ?? ""}
                              onChange={(v) => updateAddressField("state", v)}
                              editMode={editMode}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div className="bg-brand-light rounded-2xl md:rounded-4xl border border-brand/10 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                          <MapPin size={20} className="text-gray-400" />
                          Shipping Address
                        </h3>
                        <div className="space-y-4">
                          <InputField
                            label="Address Line 1"
                            value={form.shippingAddress?.addressLine1 ?? ""}
                            onChange={(v) => updateShippingField("addressLine1", v)}
                            editMode={editMode}
                          />
                          <InputField
                            label="Address Line 2"
                            value={form.shippingAddress?.addressLine2 ?? ""}
                            onChange={(v) => updateShippingField("addressLine2", v)}
                            editMode={editMode}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <InputField
                              label="City"
                              value={form.shippingAddress?.city ?? ""}
                              onChange={(v) => updateShippingField("city", v)}
                              editMode={editMode}
                            />
                            <InputField
                              label="Postal Code"
                              value={form.shippingAddress?.postalCode ?? ""}
                              onChange={(v) => updateShippingField("postalCode", v)}
                              editMode={editMode}
                            />
                          </div>
                          <InputField
                            label="Country"
                            value={form.shippingAddress?.country ?? ""}
                            onChange={(v) => updateShippingField("country", v)}
                            editMode={editMode}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedNav === "orders" && (
                  <div className="bg-brand-light rounded-2xl md:rounded-4xl border border-brand/10 shadow-sm overflow-hidden min-h-[600px]">
                    <div className="p-0">
                      <OrdersPage setSidebarOpen={setSidebarOpen} isEmbedded={true} />
                    </div>
                  </div>
                )}

                {selectedNav === "wishlist" && (
                  <div className="bg-brand-light rounded-2xl md:rounded-4xl border border-brand/10 shadow-sm p-6 min-h-[600px]">
                    <Wishlist isEmbedded={true} />
                  </div>
                )}
              </m.div>
            </AnimatePresence>

          </main>
        </div>

        {/* MOBILE SIDEBAR MODAL */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
              />
              <m.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 left-0 h-full w-80 bg-white z-[51] shadow-2xl p-6 lg:hidden flex flex-col"
              >
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
                >
                  <X size={20} />
                </button>

                <div className="flex items-center gap-4 mb-8 pt-4">
                  <div className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
                    <Image
                      src={AVATAR_SRC}
                      alt="avatar"
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 truncate max-w-[150px]">{profile.firstName} {profile.lastName}</h3>
                    <p className="text-xs text-gray-500 truncate max-w-[150px]">{profile.email}</p>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedNav(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all cursor-pointer
                                        ${selectedNav === item.id
                          ? "bg-brand text-white"
                          : "text-gray-600 hover:bg-gray-50 hover:text-brand"
                        }`}
                    >
                      <item.icon size={20} />
                      {item.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-red-600 bg-red-50 hover:bg-red-100 mt-auto cursor-pointer"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </m.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function InputField({
  label,
  value,
  onChange,
  editMode,
  type = "text",
  icon: Icon
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  editMode: boolean;
  type?: string;
  icon?: any;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-500 capitalize tracking-wide mb-1">{label}</label>
      <div className={`relative transition-all duration-200 ${editMode ? "" : "opacity-80"}`}>
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={16} />
          </div>
        )}
        {editMode ? (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full bg-brand/5 border border-brand/25 text-gray-900 text-sm rounded-4xl focus:ring-2 focus:ring-brand focus:border-transparent block p-3 transition-shadow ${Icon ? 'pl-10' : ''}`}
            placeholder={`Enter ${label}`}
          />
        ) : (
          <div className={`w-full bg-brand-light/10 border border-brand/5 text-gray-900 text-sm rounded-4xl block p-3 font-medium ${Icon ? 'pl-10' : ''}`}>
            {value || "-"}
          </div>
        )}
      </div>
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  editMode,
  options
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  editMode: boolean;
  options: string[];
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-500 capitalize tracking-wide mb-1">{label}</label>
      <div className="relative">
        {editMode ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-brand/5 border border-brand/25 text-gray-900 text-sm rounded-4xl focus:ring-2 focus:ring-brand focus:border-transparent block p-3 transition-shadow appearance-none"
          >
            <option value="">Select {label}</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        ) : (
          <div className="w-full bg-brand-light/10 border border-brand/5 text-gray-900 text-sm rounded-xl block p-3 font-medium">
            {value || "-"}
          </div>
        )}
        {editMode && (
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        )}
      </div>
    </div>
  )
}


export default function ProfileIntegrated() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
