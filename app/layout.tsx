import React from "react";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Pixelify_Sans } from "next/font/google";
import "./globals.css";

const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-pixelify-sans",
});

export const metadata: Metadata = {
  title: "Trust - Sercure your Vibe",
  description:
    "바이브 코더의, 바이브 코더에 의한, 바이브 코더를 위한 단 5분, 원클릭 보안 스캐너",
  generator: "StonesLab",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://trust-ochre.vercel.app",
    siteName: "트러스트",
    images: [
      {
        url: "https://trust-ochre.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "트러스트",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@trust",
    siteId: "1467726470533754880",
    creatorId: "1467726470533754880",
    creator: "@stoneslab",
    title: "Trust - Sercure your Vibe",
    description: "바이브 코더의, 바이브 코더에 의한, 바이브 코더를 위한 단 5분, 원클릭 보안 스캐너",
    images: "",
  },
};

export const viewport: Viewport = {
  themeColor: "#00f3ff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${pixelifySans.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
