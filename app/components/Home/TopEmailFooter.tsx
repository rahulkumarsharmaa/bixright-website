"use client";

import { useState } from "react";

export default function TopEmailFooter() {
  const [email, setEmail] = useState("");

  const submit = () => {
    if (!email.trim()) return;
    setEmail("");
  };

  return (
    <section className="w-full bg-zinc-200 py-6 md:py-14 mt-10 rounded-4xl">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-black">
          Stay Updated
        </h2>

        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Sign up for our newsletter and get exclusive offers & new arrivals.
        </p>

        <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full md:w-96 px-4 py-3 border border-gray-300 rounded-lg outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-black bg-white"
          />

          <button
            onClick={submit}
            className="px-8 py-3 bg-black text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}
