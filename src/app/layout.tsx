import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MobileCta } from "@/components/mobile-cta";
import { OrganizationJsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jackfruitsafaris.org"),
  title: {
    default: "Uganda Safaris, Gorilla Trekking and Jinja Tours | Jackfruit Safaris",
    template: "%s | Jackfruit Safaris",
  },
  description:
    "Plan private Uganda safaris with Jackfruit Safaris, a Jinja-based tour company offering gorilla trekking, Murchison Falls, 10-day Uganda itineraries, Jinja adventures, cultural tours, and airport transfers.",
  openGraph: {
    title: "Jackfruit Safaris Uganda",
    description:
      "Private Uganda safaris, gorilla trekking, Jinja adventures, cultural experiences, and airport transfers planned by local experts.",
    url: "https://www.jackfruitsafaris.org",
    siteName: "Jackfruit Safaris Uganda",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#fbfaf5] text-[#10251b]">
        <OrganizationJsonLd />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <MobileCta />
      </body>
    </html>
  );
}
