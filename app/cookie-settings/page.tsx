"use client";

import { useState, useMemo } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Globe,
  MousePointer2,
  Smartphone,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";

const COOKIE_TYPES = [
  {
    id: "necessary",
    title: "Essential",
    subtitle: "Core Features",
    icon: ShieldCheck,
    description:
      "Required for the website to function. Handles logins, security, and shopping cart.",
    examples: ["Auth tokens", "CSRF protection", "Cart memory"],
    locked: true,
  },
  {
    id: "functional",
    title: "Functional",
    subtitle: "Preferences",
    icon: Globe,
    description:
      "Remember your choices like language, theme, and region settings.",
    examples: ["Language", "Theme", "Region"],
    locked: false,
  },
  {
    id: "analytics",
    title: "Analytics",
    subtitle: "Performance Data",
    icon: MousePointer2,
    description:
      "Help improve performance by anonymously tracking user interactions.",
    examples: ["Page views", "Clicks", "Load speed"],
    locked: false,
  },
  {
    id: "marketing",
    title: "Marketing",
    subtitle: "Ads & Targeting",
    icon: Smartphone,
    description:
      "Used for personalized ads, retargeting, and cross-site personalization.",
    examples: ["Ads", "Retargeting", "Personalized offers"],
    locked: false,
  },
];

export default function CookiePage() {
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });

  const router = useRouter();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const activeCount = Object.values(preferences).filter(Boolean).length;

  const privacyLevel = useMemo(() => {
    if (activeCount === 1)
      return { label: "Strict", color: "text-green-600", dot: "bg-green-600" };
    if (activeCount === 2)
      return { label: "Moderate", color: "text-gray-600", dot: "bg-gray-600" };
    if (activeCount === 3)
      return {
        label: "Balanced",
        color: "text-purple-600",
        dot: "bg-purple-600",
      };
    return {
      label: "Permissive",
      color: "text-yellow-600",
      dot: "bg-yellow-600",
    };
  }, [activeCount]);

  const toggleCookie = (id: string) => {
    if (id === "necessary") return;
    setPreferences((prev) => ({
      ...prev,
      [id as keyof typeof prev]: !prev[id as keyof typeof prev],
    }));
  };

  const savePrefs = (settings?: typeof preferences) => {
    const finalSettings = settings || preferences;
    localStorage.setItem("cookie-preferences", JSON.stringify(finalSettings));

    if (settings) {
      setPreferences(settings);
    }

    setIsSaved(true);
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 pt-2 lg:pt-2 lg:pb-20 pb-10">
        <h1 className="text-4xl font-bold">Privacy Control</h1>
        <p className="text-gray-600 mt-2 max-w-md">
          Adjust how we use cookies to improve your shopping experience.
        </p>

        {/* Privacy Badge */}
        <div className="flex items-center gap-2 mt-6 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm">
          <span className="text-xs text-gray-500 uppercase">Mode</span>
          <span
            className={`flex items-center gap-1 font-semibold ${privacyLevel.color}`}
          >
            <span className={`w-2 h-2 rounded-full ${privacyLevel.dot}`} />
            {privacyLevel.label}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-3xl mx-auto px-4 space-y-4 pb-32">
        {COOKIE_TYPES.map((item) => {
          const isActive = preferences[item.id as keyof typeof preferences];
          const isExpanded = expandedId === item.id;
          const Icon = item.icon;

          return (
            <m.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white border border-gray-200 rounded-xl shadow-sm transition ${isActive ? "ring-1 ring-gray-300" : ""
                }`}
            >
              {/* Card Header */}
              <div
                className="flex items-center gap-5 p-5 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-xl transition ${isActive
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-500"
                    }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    {item.locked && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200 uppercase font-bold">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm">{item.subtitle}</p>
                </div>

                {/* Toggle */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCookie(item.id);
                  }}
                  className={`relative w-14 h-7 flex items-center rounded-full transition-colors cursor-pointer
    ${item.locked
                      ? "opacity-50 cursor-not-allowed bg-gray-200"
                      : isActive
                        ? "bg-gray-900"
                        : "bg-gray-300"
                    }`}
                >
                  <m.div
                    animate={{ x: isActive ? 28 : 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    className="w-5 h-5 bg-white rounded-full shadow flex items-center justify-center"
                  >
                    {isActive && (
                      <Check
                        className="w-3 h-3 text-gray-900"
                        strokeWidth={3}
                      />
                    )}
                  </m.div>
                </div>
              </div>

              {/* Expandable Section */}
              <AnimatePresence>
                {isExpanded && (
                  <m.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden bg-gray-50 border-t border-gray-200 rounded-b-xl"
                  >
                    <div className="p-5 pl-24">
                      <p className="text-sm text-gray-600 mb-3">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.examples.map((ex, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-white border border-gray-200 text-gray-600 rounded-md text-xs shadow-sm"
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </m.div>
          );
        })}
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4">
        <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-3 flex gap-3 max-w-md w-full">
          <button
            onClick={() =>
              savePrefs({
                necessary: true,
                functional: false,
                analytics: false,
                marketing: false,
              })
            }
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Reject All
          </button>

          <button
            onClick={() => savePrefs()}
            className="flex-1 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 hover:bg-gray-100 transition"
          >
            Save
          </button>

          <button
            onClick={() =>
              savePrefs({
                necessary: true,
                functional: true,
                analytics: true,
                marketing: true,
              })
            }
            className="flex-1 py-3 rounded-xl bg-gray-900 text-white hover:bg-black transition"
          >
            Accept All
          </button>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {isSaved && (
          <m.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-2 rounded-full shadow-lg"
          >
            Preferences Updated
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
