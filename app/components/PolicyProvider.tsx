"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface PolicyType {
  shippingContent: string;
  minFreeShippingAmount: number;
  shippingCharge: number;
  shippingNote: string;
  returnContent: string;
  returnPeriodDays: number;
  returnConditions: string;
}

interface PolicyContextType {
  policy: PolicyType;
  refreshPolicy: () => Promise<void>;
}

const PolicyContext = createContext<PolicyContextType>({
  policy: {
    shippingContent: "",
    minFreeShippingAmount: 0,
    shippingCharge: 0,
    shippingNote: "",
    returnContent: "",
    returnPeriodDays: 0,
    returnConditions: "",
  },
  refreshPolicy: async () => {},
});

export const usePolicy = () => useContext(PolicyContext);

export function PolicyProvider({ children }: { children: React.ReactNode }) {
  const [policy, setPolicy] = useState<PolicyType>({
    shippingContent: "",
    minFreeShippingAmount: 0,
    shippingCharge: 0,
    shippingNote: "",
    returnContent: "",
    returnPeriodDays: 0,
    returnConditions: "",
  });

  // Fetch policy from API (only when needed)
  const fetchPolicy = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/policy/get-policy`
      );
      const data = await res.json();

      if (data.policy) {
        setPolicy(data.policy);
        localStorage.setItem("policy_data", JSON.stringify(data.policy));
      }
    } catch (err) {
      console.log("Policy API Error:", err);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("policy_data");

    if (stored) {
      setTimeout(() => {
        setPolicy(JSON.parse(stored));
      }, 0);
    } else {
      setTimeout(() => {
        fetchPolicy();
      }, 0);
    }
  }, []);

  return (
    <PolicyContext.Provider value={{ policy, refreshPolicy: fetchPolicy }}>
      {children}
    </PolicyContext.Provider>
  );
}
