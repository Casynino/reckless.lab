import type { Metadata } from "next";
import { Syne, Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import { shopConfig } from "@/lib/shop/config";
import { ConditionalChrome } from "@/components/layout/conditional-chrome";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// Absolute base for OG/social image URLs + canonical links. Must be the LIVE
// origin or link previews (WhatsApp etc.) can't fetch the og:image. The live
// custom domain is the default; override with NEXT_PUBLIC_SITE_URL if it ever
// changes.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://recklesslab.shop";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${shopConfig.brand.name} — ${shopConfig.brand.tagline}`,
    template: `%s · ${shopConfig.brand.name}`,
  },
  description: shopConfig.brand.manifesto,
  openGraph: {
    title: shopConfig.brand.name,
    description: shopConfig.brand.manifesto,
    url: SITE_URL,
    siteName: shopConfig.brand.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: shopConfig.brand.name,
    description: shopConfig.brand.manifesto,
  },
  // Icons resolved from the App Router file convention:
  //   app/icon.svg (tab), app/apple-icon.tsx (iOS), app/favicon.ico (legacy).
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${inter.variable} ${spaceMono.variable} h-full`}
    >
      <head>
        {/* Set theme before paint to avoid a flash. Defaults to dark. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('rl-theme');document.documentElement.dataset.theme=(t==='light'||t==='dark')?t:'dark';}catch(e){document.documentElement.dataset.theme='dark';}})();`,
          }}
        />
      </head>
      <body className="grain min-h-full flex flex-col bg-ink text-bone">
        <ConditionalChrome>{children}</ConditionalChrome>
      </body>
    </html>
  );
}
