import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { MobileCta } from "@/components/mobile-cta";
import { CmsLiveRefresh } from "@/components/cms-live-refresh";
import { OrganizationJsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteSettings } from "@/lib/cms-data";
import type { PublicSiteSettings } from "@/lib/site-settings";
import "./globals.css";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = (await getSiteSettings()) as PublicSiteSettings | null;
  const seo = settings?.seo || {};
  const title =
    (typeof seo.title === "string" && seo.title) ||
    "Uganda Safaris, Gorilla Trekking and Jinja Tours | Jackfruit Safaris";
  const description =
    (typeof seo.description === "string" && seo.description) ||
    "Plan private Uganda safaris with Jackfruit Safaris, a Jinja-based tour company offering gorilla trekking, Murchison Falls, 10-day Uganda itineraries, Jinja adventures, cultural tours, and airport transfers.";

  return {
    metadataBase: new URL("https://www.jackfruitsafaris.org"),
    title: {
      default: title,
      template: `%s | ${settings?.business_name || "Jackfruit Safaris"}`,
    },
    description,
    icons: settings?.favicon_url ? { icon: settings.favicon_url } : undefined,
    openGraph: {
      title,
      description,
      url: "https://www.jackfruitsafaris.org",
      siteName: settings?.business_name || "Jackfruit Safaris Uganda",
      locale: "en_US",
      type: "website",
    },
  };
}

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

function buildAestheticStyle(settings: PublicSiteSettings | null): AestheticStyle {
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
    "--footer-background": settingValue(settings?.footer_background_color, "#10251b"),
    "--footer-text": settingValue(settings?.brand_text_color, "#ffffff"),
    "--footer-muted-text": settingValue(settings?.brand_muted_text_color, "#ffffff"),
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
  const settings = (await getSiteSettings()) as PublicSiteSettings | null;
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
        <CmsLiveRefresh />
        <OrganizationJsonLd />
        <await SiteHeader settings={settings} />
        <main>{children}</main>
        <await SiteFooter settings={settings} />
        <MobileCta settings={settings} />
      </body>
    </html>
  );
}
