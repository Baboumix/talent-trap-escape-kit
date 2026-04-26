import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-PHQMQHQK";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Profil du Talent Coincé · monExpansion",
  description:
    "Un diagnostic gratuit en 5 minutes pour voir ton angle mort et sortir du piège.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${dmSans.variable}`}>
      <GoogleTagManager gtmId={GTM_ID} />
      <body className="font-sans bg-ink text-white antialiased">{children}</body>
    </html>
  );
}
