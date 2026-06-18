"use client";

import { Mail, ArrowRight } from "lucide-react";

export default function Newsletter() {
  return (
    <div className="relative bg-neutral-900 rounded-3xl p-8 md:p-16 my-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gray-600 rounded-full blur-[120px] opacity-40"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full blur-[120px] opacity-40"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
        <div className="text-center md:text-left max-w-xl">
          <span className="inline-block px-3 py-1 bg-white/10 text-white text-xs font-bold rounded-full mb-4 backdrop-blur-md border border-white/10 uppercase tracking-wider">
            Join Our Community
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Get the latest updates & <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-purple-400">exclusive deals</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Subscribe to our newsletter and be the first to know about new arrivals, sales, and special events. Unsubscribe anytime.
          </p>
        </div>

        <div className="w-full max-w-md">
          <div className="flex flex-col gap-3">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-white transition-colors" size={20} />
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500/50 hover:bg-white/10 transition-all"
              />
            </div>
            <button className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              Subscribe Now <ArrowRight size={18} />
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              By subscribing you agree to our <a href="#" className="underline hover:text-gray-400">Terms & Conditions</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
