import "./globals.css";
import type { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ClientProviders } from "./providers";
import { Toaster } from "sonner";
import { fedraSans, ibmPlexSans } from "./fonts";

export const metadata: Metadata = {
  title: "Bixright | Premium Electronics Store",
  description: "Shop the latest electronics, gadgets, and accessories at the best prices.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${fedraSans.variable}`}>
      <body className="antialiased scroll-smooth custom-scrollbar font-sans bg-gray-50 text-gray-900">
        <ClientProviders>
          <header>
            <Header />
          </header>

          <main className="pt-24 md:pt-40 min-h-screen">{children}</main>

          <footer>
            <Footer />
          </footer>

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
