import "./globals.css";
import type { Metadata } from "next";
import LayoutWrapper from "./components/LayoutWrapper";
import { ClientProviders } from "./providers";
import { Toaster } from "sonner";
import { fedraSans, ibmPlexSans } from "./fonts";

export const metadata: Metadata = {
  title: "Bixright | Premium Electronics Store | Buy Electronics & Accessories Online | Best Deals on Gadgets",
  description: "Get the best electronics and accessories online. Buy Best EarBuds, CPU, smart gadgets, audio devices, headphones, and office essentials from Bixright.",
  icons: {
    icon: "/assets/Bixright-fevicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${fedraSans.variable}`}>
      <body className="antialiased scroll-smooth custom-scrollbar font-sans bg-brand-light text-black">
        <ClientProviders>
          <LayoutWrapper>{children}</LayoutWrapper>

          <Toaster
            position="bottom-right"
            richColors
            expand={true}
            closeButton
            theme="light"
            toastOptions={{
              className: "bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-4 gap-4",
              descriptionClassName: "text-slate-500 font-medium",
              style: {
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(226, 232, 240, 0.6)',
                padding: '16px',
                borderRadius: '16px',
                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)'
              }
            }}
          />
        </ClientProviders>
      </body>
    </html>
  );
}
