"use client";

import { useState } from "react";
import { m } from "framer-motion";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { countries } from "@/app/types/countries";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 text-black px-4 py-30">
      <m.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
        style={{ transition: "none" }}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 border border-gray-200"
      >
        <h2 className="text-xl font-semibold text-center mb-4">
          Create Your Account
        </h2>

        {/* NAME */}
        <div className="mb-3">
          <label className="text-sm font-medium">Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-1 focus:ring-black"
          />
          {errors.name && (
            <p className="text-red-600 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* COUNTRY */}
        <div className="mb-3">
          <label className="text-sm font-medium">Country</label>

          <Select
            value={form.country}
            onValueChange={(value) => handleChange("country", value)}
          >
            <SelectTrigger className="w-full mt-1 h-10 border rounded-lg ">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>

            <SelectContent position="popper" className="max-h-60">
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {errors.country && (
            <p className="text-red-600 text-xs mt-1">{errors.country}</p>
          )}
        </div>

        {/* EMAIL */}
        <div className="mb-3">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-1 focus:ring-black"
          />
          {errors.email && (
            <p className="text-red-600 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* PHONE */}
        <div className="mb-3">
          <label className="text-sm font-medium">Phone Number</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-1 focus:ring-black"
          />
          {errors.phone && (
            <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <label className="text-sm font-medium">Password</label>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-1 focus:ring-black pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-600 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-2 bg-black text-white rounded-lg text-sm font-semibold transition ${loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
            }`}
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <p className="text-center text-sm text-gray-700">
          Already have an account?{" "}
          <Link href="/user/login" className="font-semibold hover:underline">
            Login
          </Link>
        </p>
      </m.div>
    </div>
  );
}
