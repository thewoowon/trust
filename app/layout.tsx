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
  title: "Trust - AI-Native Security for Indie Devs",
  description:
    "Secure your vibe with AI-native security scanning for individual developers and small teams. Detect vulnerabilities, API leaks, and privacy risks.",
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
    title: "트로스트",
    description: "인디 개발자를 위한 AI 기반 보안 솔루션",
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
