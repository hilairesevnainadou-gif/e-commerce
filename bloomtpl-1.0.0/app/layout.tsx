import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { CartProvider } from "@/context/CartContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { ToastProvider } from "@/context/ToastContext";
import { getSettings } from "@/lib/api";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    title: settings.tagline
      ? `${settings.site_name} - ${settings.tagline}`
      : settings.site_name,
    description: settings.description || undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <html lang="fr">
      <body
        className={`${inter.className}  antialiased flex flex-col min-h-screen`}
      >
        <SettingsProvider settings={settings}>
          <ToastProvider>
            <CartProvider>
              <AnnouncementBar />
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </CartProvider>
            <WhatsAppButton />
          </ToastProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
