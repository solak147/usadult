import type { Metadata } from "next";
import "./globals.css";
import AgeGate from "./ui/age-gate";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://afterhours.example";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  other: { "page-type": "software", "site-kind": "software" },
  title: { default: "Afterhours — Adult Video Discovery", template: "%s | Afterhours" },
  description: "Browse a carefully indexed collection of adult videos. Find scenes by category, performer, studio, and more.",
  applicationName: "Afterhours",
  robots: { index: true, follow: true },
  openGraph: { type: "website", siteName: "Afterhours", title: "Afterhours — Adult Video Discovery", description: "A considered way to discover adult video." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-type="software" data-radius="small" data-buttons="solid" data-motion="quiet"><body><a className="skip-link" href="#main">Skip to content</a><AgeGate />{children}</body></html>;
}
