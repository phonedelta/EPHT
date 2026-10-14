import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";

import { defaultLocale } from "@/i18n/config";
import { dataOr, getSiteSettings } from "@/lib/api/queries";
import { siteMetadata } from "@/lib/seo";

import "./globals.css";

// Titres éditoriaux.
const display = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
  display: "swap",
});

// Navigation, paragraphes et formulaires.
const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata(dataOr(await getSiteSettings(), null));
}

export const viewport: Viewport = {
  themeColor: "#fcfdfe",
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
