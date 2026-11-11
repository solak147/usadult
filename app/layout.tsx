import type { Metadata } from "next";
import "./globals.css";
import AgeGate from "./ui/age-gate";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://afterhours.example";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Afterhours — Adult Video Discovery", template: "%s | Afterhours" },
  description: "Browse a carefully indexed collection of adult videos. Find scenes by category, performer, studio, and more.",
  applicationName: "Afterhours",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Afterhours",
    title: "Afterhours — Adult Video Discovery",
    description: "A considered way to discover adult video.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Afterhours — Adult Video Discovery",
    description: "A considered way to discover adult video.",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    rating: "RTA-5042-1996-1400-1577-RTA",
    "rating-type": "adult",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-type="software" data-radius="small" data-buttons="solid" data-motion="quiet"><body><a className="skip-link" href="#main">Skip to content</a><AgeGate />{children}</body></html>;
}
