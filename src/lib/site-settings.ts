export type PublicSiteSettings = Record<string, unknown> & {
  business_name?: string | null;
  logo_url?: string | null;
  favicon_url?: string | null;
  contact_email?: string | null;
  phone?: string | null;
  alternate_phone?: string | null;
  whatsapp_number?: string | null;
  whatsapp_message?: string | null;
  address?: string | null;
  operating_hours?: string | null;
  social_links?: Record<string, string> | null;
  nav_items?: Array<{ label: string; href: string }> | null;
  footer_copy?: string | null;
  footer_tagline?: string | null;
  footer_note?: string | null;
  seo?: Record<string, unknown> | null;
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
  badge_text?: string | null;
  hero_title?: string | null;
  hero_subtitle?: string | null;
  hero_image?: string | null;
  cta_primary?: string | null;
  cta_secondary?: string | null;
  why_uganda_eyebrow?: string | null;
  why_uganda_title?: string | null;
  why_uganda_intro?: string | null;
  why_uganda_paragraph?: string | null;
  cta_eyebrow?: string | null;
  cta_title?: string | null;
  cta_intro?: string | null;
  cta_button?: string | null;
};

export function buildWhatsAppHref(settings?: PublicSiteSettings | null) {
  const number = String(settings?.whatsapp_number || "256772550268").replace(
    /\D/g,
    "",
  );
  const message =
    settings?.whatsapp_message ||
    "Hello Jackfruit Safaris, I would like help planning a Uganda trip.";

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
