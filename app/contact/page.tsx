"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { Send, Phone, Mail, MapPin, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

// --- VALIDATION HELPERS ---
const validateEmail = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const validatePhone = (phone: string) => {
  const re = /^[0-9]{10}$/; // Strictly 10 digits for this example
  return re.test(phone);
};

const validateName = (name: string) => {
  return name.length >= 3 && /^[a-zA-Z\s]+$/.test(name);
};

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// const itemVariants = ;

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- HANDLE INPUT CHANGE ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error on change
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // --- STRICT VALIDATION ---
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    else if (!validateName(formData.name)) newErrors.name = "Name must be at least 3 letters and contain only alphabets";

    if (!formData.email.trim()) newErrors.email = "Email Address is required";
    else if (!validateEmail(formData.email)) newErrors.email = "Please enter a valid email address";

    if (!formData.phone.trim()) newErrors.phone = "Phone Number is required";
    else if (!validatePhone(formData.phone)) newErrors.phone = "Phone number must be exactly 10 digits";

    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    else if (formData.subject.length < 5) newErrors.subject = "Subject must be at least 5 characters long";

    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.length < 20) newErrors.message = "Message must be at least 20 characters long to provide sufficient detail";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- SUBMIT HANDLER ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);

    if (!validateForm()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    setIsSubmitting(true);

    // ==========================================
    // API INTEGRATION SECTION
    // ==========================================
    /*
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Something went wrong");
      }
      
      // Success handling is below
    } catch (error) {
      console.error("Contact Form Error:", error);
      toast.error("Failed to send message. Please try again later.");
      setIsSubmitting(false);
      return;
    }
    */
    // ==========================================
    // END API SECTION
    // ==========================================

    // SIMULATED SUCCESS RESPONSE
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      toast.success("Message sent successfully!");
    }, 2000);
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 font-sans">

      {/* HEADER SECTION */}
      <section className="bg-black text-white pt-24 pb-20 px-4 md:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Touch</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              We'd love to hear from you. Whether you have a question about our products, orders, or just want to say hi, our team is ready to answer all your questions.
            </p>
          </m.div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gray-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-10 pb-20 relative z-20">
        <m.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 shadow-2xl rounded-3xl overflow-hidden bg-white"
        >

          {/* LEFT: CONTACT INFO */}
          <div className="bg-gray-900 text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <p className="text-gray-400 mb-10">
                Fill up the form and our Team will get back to you within 24 hours.
              </p>

              <div className="space-y-8">
                <m.div variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
                }} className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Phone</h4>
                    <p className="text-gray-400 text-sm mt-1">+91 98765 43210</p>
                    <p className="text-gray-400 text-sm">+91 12345 67890</p>
                  </div>
                </m.div>

                <m.div variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
                }} className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-gray-500 group-hover:bg-gray-600 group-hover:text-white transition-all duration-300">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Email</h4>
                    <p className="text-gray-400 text-sm mt-1">support@Bixright.com</p>
                    <p className="text-gray-400 text-sm">sales@Bixright.com</p>
                  </div>
                </m.div>

                <m.div variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
                }} className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-green-500 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Address</h4>
                    <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                      123, Tech Plaza, Silicon Valley,<br />
                      Bangalore, India - 560001
                    </p>
                  </div>
                </m.div>
              </div>
            </div>

            {/* Decorative Circles on Left Panel */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl translate-x-1/3 translate-y-1/3" />
          </div>

          {/* RIGHT: FORM */}
          <div className="lg:col-span-2 p-8 md:p-12 bg-white">
            {isSuccess ? (
              <m.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-10"
              >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
                <p className="text-gray-500 max-w-md">
                  Thank you for contacting us. We have received your message and will respond to you shortly.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-8 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  Send Another Message
                </button>
              </m.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                      Full Name
                      {errors.name && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} /> {errors.name}</span>}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-gray-200 focus:border-black'} focus:ring-4 transition-all outline-none bg-gray-50/50`}
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                      Phone Number
                      {errors.phone && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} /> {errors.phone}</span>}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => {
                        // Only allow numbers
                        const val = e.target.value.replace(/\D/g, '');
                        // Max 10 chars
                        if (val.length <= 10) {
                          handleChange({ ...e, target: { ...e.target, name: 'phone', value: val } });
                        }
                      }}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-gray-200 focus:border-black'} focus:ring-4 transition-all outline-none bg-gray-50/50`}
                      placeholder="9876543210"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                    Email Address
                    {errors.email && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} /> {errors.email}</span>}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-gray-200 focus:border-black'} focus:ring-4 transition-all outline-none bg-gray-50/50`}
                    placeholder="john@example.com"
                  />
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                    Subject
                    {errors.subject && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} /> {errors.subject}</span>}
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.subject ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-gray-200 focus:border-black'} focus:ring-4 transition-all outline-none bg-gray-50/50 appearance-none`}
                  >
                    <option value="" disabled>Select a subject</option>
                    <option value="Order Issue">Order Issue</option>
                    <option value="Product Inquiry">Product Inquiry</option>
                    <option value="Payment Issue">Payment Issue</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                    Message
                    {errors.message && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} /> {errors.message}</span>}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-gray-200 focus:border-black'} focus:ring-4 transition-all outline-none bg-gray-50/50 resize-none`}
                    placeholder="Write your message here..."
                  />
                  <p className="text-xs text-gray-400 text-right">{formData.message.length} / 20 characters min</p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} /> Sending...
                    </>
                  ) : (
                    <>
                      Send Message <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </m.div>
      </section>
    </div>
  );
}
