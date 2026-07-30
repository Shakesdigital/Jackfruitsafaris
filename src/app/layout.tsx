import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { MobileCta } from "@/components/mobile-cta";
import { OrganizationJsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteSettings } from "@/lib/cms-data";
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

type SiteAestheticsSettings = {
  brand_primary_color?: string | null;
  brand_secondary_color?: string | null;
  brand_accent_color?: string | null;
  brand_background_color?: string | null;
  brand_surface_color?: string | null;
  brand_text_color?: string | null;
  brand_muted_text_color?: string | null;
  heading_font_family?: string | null;
  body_font_family?: string | null;
  base_font_size?: string | null;
  heading_weight?: string | null;
  body_weight?: string | null;
  line_height?: string | null;
  letter_spacing?: string | null;
  border_radius_style?: string | null;
  button_style?: string | null;
  section_spacing?: string | null;
  card_shadow_style?: string | null;
};

type AestheticStyle = CSSProperties & Record<`--${string}`, string>;

const radiusMap: Record<string, string> = {
  sharp: "0px",
  rounded: "8px",
  soft: "18px",
};

const buttonRadiusMap: Record<string, string> = {
  square: "0px",
  rounded: "10px",
  pill: "999px",
};

const spacingMap: Record<string, string> = {
  compact: "3rem",
  comfortable: "5rem",
  spacious: "7rem",
};

const shadowMap: Record<string, string> = {
  none: "none",
  soft: "0 12px 30px rgb(16 37 27 / 0.08)",
  strong: "0 18px 48px rgb(16 37 27 / 0.18)",
};

function settingValue(value: string | null | undefined, fallback: string) {
  return value || fallback;
}

function buildAestheticStyle(settings: SiteAestheticsSettings | null): AestheticStyle {
  const radiusStyle = settingValue(settings?.border_radius_style, "rounded");
  const buttonStyle = settingValue(settings?.button_style, "pill");
  const sectionSpacing = settingValue(settings?.section_spacing, "comfortable");
  const cardShadow = settingValue(settings?.card_shadow_style, "soft");

  return {
    "--background": settingValue(settings?.brand_background_color, "#fbfaf5"),
    "--foreground": settingValue(settings?.brand_text_color, "#10251b"),
    "--brand-primary": settingValue(settings?.brand_primary_color, "#143c2d"),
    "--brand-secondary": settingValue(settings?.brand_secondary_color, "#2d6f55"),
    "--brand-accent": settingValue(settings?.brand_accent_color, "#f5bf2f"),
    "--brand-surface": settingValue(settings?.brand_surface_color, "#ffffff"),
    "--brand-muted-text": settingValue(settings?.brand_muted_text_color, "#536154"),
    "--font-heading": settingValue(settings?.heading_font_family, "var(--font-geist-sans)"),
    "--font-body": settingValue(settings?.body_font_family, "var(--font-geist-sans)"),
    "--base-font-size": settingValue(settings?.base_font_size, "16px"),
    "--heading-weight": settingValue(settings?.heading_weight, "900"),
    "--body-weight": settingValue(settings?.body_weight, "400"),
    "--body-line-height": settingValue(settings?.line_height, "1.6"),
    "--body-letter-spacing": settingValue(settings?.letter_spacing, "normal"),
    "--brand-radius": radiusMap[radiusStyle] || radiusMap.rounded,
    "--brand-button-radius": buttonRadiusMap[buttonStyle] || buttonRadiusMap.pill,
    "--section-spacing": spacingMap[sectionSpacing] || spacingMap.comfortable,
    "--card-shadow": shadowMap[cardShadow] || shadowMap.soft,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const aestheticStyle = buildAestheticStyle(settings);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full bg-[var(--background)] text-[var(--foreground)]"
        style={aestheticStyle}
      >
        <OrganizationJsonLd />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <MobileCta />
      </body>
    </html>
  );
}
