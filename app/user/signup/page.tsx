"use client";

import { useState } from "react";
import { m } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { countries } from "@/app/types/countries";
import { useSite } from "@/app/context/siteSetting";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Mail, Lock, User, Globe, Phone, ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import LogoImage from "@/public/assets/Bixright.png";

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  country: z.string().min(2, "Country is required"),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .min(10, "Phone must be 10 digits")
    .max(10, "Phone must be 10 digits")
    .regex(/^[0-9]+$/, "Phone must contain only numbers"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormType = z.infer<typeof schema>;

export default function SignupPage() {
  const router = useRouter();
  const { siteData } = useSite();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState<FormType>({
    name: "",
    country: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof FormType, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const result = schema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customer/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            country: form.country,
            email: form.email,
            phone: Number(form.phone),
            password: form.password,
          }),
        }
      );

      const json: { success: boolean; message?: string } = await res.json();

      if (!res.ok || !json.success) {
        setLoading(false);
        toast.error(json.message || "Signup failed");
        return;
      }

      toast.success("Signup successful!");
      setLoading(false);
      router.push(`/user/login?email=${form.email}`);
    } catch {
      setLoading(false);
      setErrors({ email: "Something went wrong. Try again." });
    }
  };

  return (
    <div className=" w-full flex items-center justify-center bg-brand-light text-brand px-4 py-16 relative">

      {/* Back button */}
      <div className="absolute top-8 left-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-brand/80 hover:text-brand transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Store
        </Link>
      </div>

      <m.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
        className="w-full max-w-md bg-brand/5 backdrop-blur-md rounded-3xl shadow-sm p-8 border border-brand/10 relative animate-fade-in"
      >
        {/* Dynamic Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/">
            <Image
              src={siteData?.logoUrl ? (
                siteData.logoUrl.startsWith("http")
                  ? siteData.logoUrl
                  : `${process.env.NEXT_PUBLIC_IMAGE_URL || ""}${siteData.logoUrl.startsWith("/") ? "" : "/"}${siteData.logoUrl}`
              ) : LogoImage}
              alt={siteData?.siteName || "Bixright"}
              width={140}
              height={40}
              className="h-10 w-auto object-contain"
            />
          </Link>
        </div>

        <h2 className="text-lg font-bold text-center text-brand mb-6">
          Create Your Account
        </h2>

        {/* NAME */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs sm:text-sm font-bold text-brand/80 capitalize tracking-wider ml-1">Full Name</label>
            {errors.name && (
              <p className="text-red-500 text-xs font-semibold">{errors.name}</p>
            )}
          </div>
          <input
            type="text"
            value={form.name}
            placeholder="Enter your full name"
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full h-11 px-6 border border-brand/10 hover:border-brand/30 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-4xl outline-none text-xs placeholder:text-brand/40 text-brand transition-all bg-brand-light"
          />
        </div>

        {/* COUNTRY */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs sm:text-sm font-bold text-brand/80 capitalize tracking-wider ml-1">Country</label>
            {errors.country && (
              <p className="text-red-500 text-xs font-semibold">{errors.country}</p>
            )}
          </div>

          <Select
            value={form.country}
            onValueChange={(value) => handleChange("country", value)}
          >
            <SelectTrigger className="w-full h-11 border border-brand/10 hover:border-brand/30 focus:ring-4 focus:ring-brand/10 focus:border-brand bg-brand-light rounded-4xl text-xs text-brand/80 px-6 text-left">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>

            <SelectContent position="popper" className="max-h-60 bg-white border border-brand/10 rounded-2xl">
              {countries.map((country) => (
                <SelectItem key={country} value={country} className="focus:bg-brand/10 hover:bg-brand/10 cursor-pointer text-xs">
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs sm:text-sm font-bold text-brand/80 capitalize tracking-wider ml-1">Email</label>
            {errors.email && (
              <p className="text-red-500 text-xs font-semibold">{errors.email}</p>
            )}
          </div>
          <input
            type="email"
            value={form.email}
            placeholder="Enter your email address"
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full h-11 px-6 border border-brand/10 hover:border-brand/30 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-4xl outline-none text-xs placeholder:text-brand/40 text-brand transition-all bg-brand-light"
          />
        </div>

        {/* PHONE */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs sm:text-sm font-bold text-brand/80 capitalize tracking-wider ml-1">Phone Number</label>
            {errors.phone && (
              <p className="text-red-500 text-xs font-semibold">{errors.phone}</p>
            )}
          </div>
          <input
            type="text"
            value={form.phone}
            placeholder="Enter 10-digit phone number"
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              if (val.length <= 10) {
                handleChange("phone", val);
              }
            }}
            className="w-full h-11 px-6 border border-brand/10 hover:border-brand/30 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-4xl outline-none text-xs placeholder:text-brand/40 text-brand transition-all bg-brand-light"
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs sm:text-sm font-bold text-brand/80 capitalize tracking-wider ml-1">Password</label>
            {errors.password && (
              <p className="text-red-500 text-xs font-semibold">{errors.password}</p>
            )}
          </div>
          <div className="relative mt-1.5">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              placeholder="Min 6 characters"
              onChange={(e) => handleChange("password", e.target.value)}
              className="w-full h-11 px-6 border border-brand/10 hover:border-brand/30 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-4xl outline-none text-xs placeholder:text-brand/40 text-brand transition-all bg-brand-light pr-10"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-brand/50 hover:text-brand transition-colors cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-11 bg-brand hover:bg-brand/90 text-brand-light rounded-4xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Creating...
            </>
          ) : (
            "Create Account"
          )}
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-brand/30" />
          <span className="text-brand text-xs font-bold tracking-wider">OR</span>
          <div className="flex-1 h-px bg-brand/30" />
        </div>

        <p className="text-center text-xs text-brand/80">
          Already have an account?{" "}
          <Link href="/user/login" className="text-brand font-bold hover:underline">
            Login
          </Link>
        </p>
      </m.div>
    </div>
  );
}
