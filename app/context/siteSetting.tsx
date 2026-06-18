"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
} from "react";

// Interface for social links
interface SocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  youtube: string;
}

// Interface for site settings
interface SiteSetting {
  socialLinks: SocialLinks;
  siteName: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  email: string;
  phone: string;
  address: string;
  aboutUs: string;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  footerText: string;
}

// Context type
interface SiteContextType {
  siteData: SiteSetting;
  refreshSite: () => Promise<void>;
}

// Default context
const siteContext = createContext<SiteContextType>({
  siteData: {
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      youtube: "",
    },
    siteName: "",
    logoUrl: null,
    faviconUrl: null,
    email: "",
    phone: "",
    address: "",
    aboutUs: "",
    defaultMetaTitle: "",
    defaultMetaDescription: "",
    footerText: "",
  },
  refreshSite: async () => {},
});

export const useSite = () => useContext(siteContext);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [siteData, setSiteData] = useState<SiteSetting>({
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      youtube: "",
    },
    siteName: "",
    logoUrl: null,
    faviconUrl: null,
    email: "",
    phone: "",
    address: "",
    aboutUs: "",
    defaultMetaTitle: "",
    defaultMetaDescription: "",
    footerText: "",
  });

  // Fetch site settings from API
  const fetchSiteSetting = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/site-setting/get`
      );
      const data = await res.json();

      if (data.success && data.settings) {
        setSiteData(data.settings);
      }
    } catch (err) {
      console.error("Site Setting API Error:", err);
    }
  };

  // Load from localStorage or fetch from API
  useEffect(() => {
    startTransition(() => {
      fetchSiteSetting();
    });
  }, []);

  return (
    <siteContext.Provider value={{ siteData, refreshSite: fetchSiteSetting }}>
      {children}
    </siteContext.Provider>
  );
}
