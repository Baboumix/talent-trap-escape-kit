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

const SITE_URL = "https://kit.monexpansion.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Test du Talent · monExpansion",
    template: "%s · monExpansion",
  },
  description:
    "Un diagnostic gratuit en 5 minutes. Une note sur 10. Et les 6 besoins qui la pilotent.",
  alternates: {
    canonical: "/",
    languages: {
      fr: "/",
      en: "/en",
    },
  },
  openGraph: {
    title: "Test du Talent · monExpansion",
    description:
      "Ton talent activé ? Une note sur 10. Et les 6 besoins qui la pilotent.",
    url: SITE_URL,
    siteName: "monExpansion",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Test du Talent · monExpansion",
    description: "Une note sur 10. Et les 6 besoins qui la pilotent.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
