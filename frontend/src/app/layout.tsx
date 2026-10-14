import type { Metadata, Viewport } from "next";
import { DM_Sans, Plus_Jakarta_Sans } from "next/font/google";

import { defaultLocale } from "@/i18n/config";
import { dataOr, getSiteSettings } from "@/lib/api/queries";
import { siteMetadata } from "@/lib/seo";

import "./globals.css";

// Titres, surtitres et chiffres.
const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

// Navigation, paragraphes et formulaires.
const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata(dataOr(await getSiteSettings(), null));
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={defaultLocale} className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {/* Sans JavaScript, les éléments animés à l'apparition restent visibles. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}[data-reveal-curtain]{display:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
