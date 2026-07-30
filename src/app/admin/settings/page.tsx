import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { upsertSiteSettings } from "@/lib/server/cms-actions";
import {
  ColorInputField,
  ImageUploadField,
  KeyValueEditor,
} from "@/app/admin/_components/cms-form-controls";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Site Settings",
};

type SettingsPageProps = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const { error, success } = await searchParams;
  const supabase = await createClient();

  const { data: settings, error: settingsError } = await supabase
    .from("site_settings")
    .select("*")
    .maybeSingle();

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Site Settings</h1>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          {success}
        </div>
      )}

      {settingsError && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Settings could not be loaded from Supabase: {settingsError.message}
        </div>
      )}

      <form
        action={upsertSiteSettings}
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6"
        encType="multipart/form-data"
      >
        <input type="hidden" name="id" value={settings?.id} />

        <div className="border-b pb-6">
          <h2 className="mb-4 text-lg font-medium">Business Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Business Name</span>
              <input
                required
                name="business_name"
                defaultValue={settings?.business_name || "Jackfruit Safaris Uganda"}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Contact Email</span>
              <input
                type="email"
                name="contact_email"
                defaultValue={settings?.contact_email || "jackfruitsafarisuganda@gmail.com"}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Phone</span>
              <input
                name="phone"
                defaultValue={settings?.phone || "+256 772 550 268"}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Alternate Phone</span>
              <input
                name="alternate_phone"
                defaultValue={settings?.alternate_phone || "+256 752 550 268"}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-gray-700">Address</span>
              <input
                name="address"
                defaultValue={settings?.address || "Craft Village, Jinja, Uganda"}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-gray-700">Operating Hours</span>
              <input
                name="operating_hours"
                defaultValue={settings?.operating_hours || "9 AM - 5 PM, with WhatsApp support for travel inquiries"}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </label>
          </div>
        </div>

        <div className="border-b pb-6">
          <h2 className="mb-4 text-lg font-medium">WhatsApp</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">WhatsApp Number</span>
              <input
                name="whatsapp_number"
                defaultValue={settings?.whatsapp_number || "256772550268"}
                placeholder="256772550268 (no + or spaces)"
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-gray-700">Default Message</span>
              <textarea
                name="whatsapp_message"
                defaultValue={settings?.whatsapp_message}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </label>
          </div>
        </div>

        {/* Homepage Content Settings */}
        <div className="border-b pb-6">
          <h2 className="mb-4 text-lg font-medium">Homepage - Hero Section</h2>
          <div className="grid gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Hero Title</span>
              <input
                name="hero_title"
                defaultValue={settings?.hero_title}
                placeholder="Explore Uganda With Local Safari Experts"
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Hero Subtitle</span>
              <input
                name="hero_subtitle"
                defaultValue={settings?.hero_subtitle}
                placeholder="Private Uganda safaris..."
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Badge Text</span>
              <input
                name="badge_text"
                defaultValue={settings?.badge_text}
                placeholder="Local safari experts from Jinja"
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">CTA Primary Button</span>
              <input
                name="cta_primary"
                defaultValue={settings?.cta_primary}
                placeholder="Plan My Safari"
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">CTA Secondary Button</span>
              <input
                name="cta_secondary"
                defaultValue={settings?.cta_secondary}
                placeholder="View Safari Packages"
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </label>

            <ImageUploadField
              name="hero_image"
              fileName="hero_image_file"
              label="Homepage Hero Image"
              currentUrl={settings?.hero_image}
            />
          </div>
        </div>

        <div className="border-b pb-6">
          <h2 className="mb-4 text-lg font-medium">Homepage - Why Uganda Section</h2>
          <div className="grid gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Eyebrow</span>
              <input
                name="why_uganda_eyebrow"
                defaultValue={settings?.why_uganda_eyebrow}
                placeholder="Why Uganda"
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Title</span>
              <input
                name="why_uganda_title"
                defaultValue={settings?.why_uganda_title}
                placeholder="One compact country, many safari worlds"
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Intro</span>
              <textarea
                name="why_uganda_intro"
                defaultValue={settings?.why_uganda_intro}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Paragraph</span>
              <textarea
                name="why_uganda_paragraph"
                defaultValue={settings?.why_uganda_paragraph}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </label>
          </div>
        </div>

        <div className="border-b pb-6">
          <h2 className="mb-4 text-lg font-medium">Homepage - CTA Section</h2>
          <div className="grid gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Eyebrow</span>
              <input
                name="cta_eyebrow"
                defaultValue={settings?.cta_eyebrow}
                placeholder="Ready to plan?"
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Title</span>
              <input
                name="cta_title"
                defaultValue={settings?.cta_title}
                placeholder="Tell us your dates..."
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Intro Text</span>
              <textarea
                name="cta_intro"
                defaultValue={settings?.cta_intro}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Button Text</span>
              <input
                name="cta_button"
                defaultValue={settings?.cta_button}
                placeholder="Request a Custom Quote"
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </label>
          </div>
        </div>

        <div className="border-b pb-6">
          <h2 className="mb-4 text-lg font-medium">Branding</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <ImageUploadField
              name="logo_url"
              fileName="logo_file"
              label="Logo"
              currentUrl={settings?.logo_url}
            />

            <ImageUploadField
              name="favicon_url"
              fileName="favicon_file"
              label="Favicon"
              currentUrl={settings?.favicon_url}
            />
          </div>
        </div>

        <div className="border-b pb-6">
          <h2 className="mb-2 text-lg font-medium">Site Aesthetics</h2>
          <p className="mb-4 text-sm text-gray-500">
            Control the global website palette, typography, shape, spacing, and visual feel.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Brand Colors
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <ColorInputField
                  name="brand_primary_color"
                  label="Primary Brand Color"
                  value={settings?.brand_primary_color}
                  fallback="#143c2d"
                />
                <ColorInputField
                  name="brand_secondary_color"
                  label="Secondary Brand Color"
                  value={settings?.brand_secondary_color}
                  fallback="#2d6f55"
                />
                <ColorInputField
                  name="brand_accent_color"
                  label="Accent / Highlight Color"
                  value={settings?.brand_accent_color}
                  fallback="#f5bf2f"
                />
                <ColorInputField
                  name="brand_background_color"
                  label="Website Background"
                  value={settings?.brand_background_color}
                  fallback="#fbfaf5"
                />
                <ColorInputField
                  name="brand_surface_color"
                  label="Card / Surface Color"
                  value={settings?.brand_surface_color}
                  fallback="#ffffff"
                />
                <ColorInputField
                  name="brand_text_color"
                  label="Main Text Color"
                  value={settings?.brand_text_color}
                  fallback="#10251b"
                />
                <ColorInputField
                  name="brand_muted_text_color"
                  label="Muted Text Color"
                  value={settings?.brand_muted_text_color}
                  fallback="#536154"
                />
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Text Format
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  name="heading_font_family"
                  label="Heading Font"
                  value={settings?.heading_font_family}
                  fallback="Geist"
                  options={[
                    ["Geist", "Geist"],
                    ["Arial", "Arial"],
                    ["Georgia", "Georgia"],
                    ["Inter", "Inter"],
                    ["system-ui", "System UI"],
                  ]}
                />
                <SelectField
                  name="body_font_family"
                  label="Body Font"
                  value={settings?.body_font_family}
                  fallback="Geist"
                  options={[
                    ["Geist", "Geist"],
                    ["Arial", "Arial"],
                    ["Georgia", "Georgia"],
                    ["Inter", "Inter"],
                    ["system-ui", "System UI"],
                  ]}
                />
                <SelectField
                  name="base_font_size"
                  label="Base Text Size"
                  value={settings?.base_font_size}
                  fallback="16px"
                  options={[
                    ["15px", "Compact"],
                    ["16px", "Comfortable"],
                    ["17px", "Large"],
                    ["18px", "Extra Large"],
                  ]}
                />
                <SelectField
                  name="heading_weight"
                  label="Heading Weight"
                  value={settings?.heading_weight}
                  fallback="900"
                  options={[
                    ["700", "Bold"],
                    ["800", "Extra Bold"],
                    ["900", "Black"],
                  ]}
                />
                <SelectField
                  name="body_weight"
                  label="Body Weight"
                  value={settings?.body_weight}
                  fallback="400"
                  options={[
                    ["400", "Regular"],
                    ["500", "Medium"],
                    ["600", "Semi Bold"],
                  ]}
                />
                <SelectField
                  name="line_height"
                  label="Body Line Height"
                  value={settings?.line_height}
                  fallback="1.6"
                  options={[
                    ["1.45", "Tight"],
                    ["1.6", "Comfortable"],
                    ["1.75", "Airy"],
                  ]}
                />
                <SelectField
                  name="letter_spacing"
                  label="Letter Spacing"
                  value={settings?.letter_spacing}
                  fallback="normal"
                  options={[
                    ["normal", "Normal"],
                    ["0.01em", "Slightly Open"],
                    ["0.02em", "Open"],
                  ]}
                />
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Layout Feel
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  name="border_radius_style"
                  label="Corner Radius"
                  value={settings?.border_radius_style}
                  fallback="rounded"
                  options={[
                    ["sharp", "Sharp"],
                    ["rounded", "Rounded"],
                    ["soft", "Soft"],
                  ]}
                />
                <SelectField
                  name="button_style"
                  label="Button Style"
                  value={settings?.button_style}
                  fallback="pill"
                  options={[
                    ["square", "Square"],
                    ["rounded", "Rounded"],
                    ["pill", "Pill"],
                  ]}
                />
                <SelectField
                  name="section_spacing"
                  label="Section Spacing"
                  value={settings?.section_spacing}
                  fallback="comfortable"
                  options={[
                    ["compact", "Compact"],
                    ["comfortable", "Comfortable"],
                    ["spacious", "Spacious"],
                  ]}
                />
                <SelectField
                  name="card_shadow_style"
                  label="Card Shadow"
                  value={settings?.card_shadow_style}
                  fallback="soft"
                  options={[
                    ["none", "None"],
                    ["soft", "Soft"],
                    ["strong", "Strong"],
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-b pb-6">
          <h2 className="mb-4 text-lg font-medium">Social Links</h2>
          <KeyValueEditor
            name="social_links"
            label="Social Links"
            value={settings?.social_links}
            keyPlaceholder="facebook"
            valuePlaceholder="https://..."
          />
        </div>

        <div className="border-b pb-6">
          <h2 className="mb-4 text-lg font-medium">Footer</h2>
          <div className="mb-4 grid gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Footer Tagline</span>
              <textarea
                name="footer_tagline"
                defaultValue={settings?.footer_tagline}
                rows={2}
                placeholder="Private Uganda safaris, gorilla trekking, Nile adventures..."
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Footer Note</span>
              <textarea
                name="footer_note"
                defaultValue={settings?.footer_note}
                rows={2}
                placeholder="Prices are shown as planning guidance..."
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </label>
          </div>
          <textarea
            name="footer_copy"
            defaultValue={settings?.footer_copy}
            rows={3}
            placeholder="© 2024 Jackfruit Safaris Uganda. All rights reserved."
            className="block w-full rounded-md border-gray-300"
          />
        </div>

        <div className="border-b pb-6">
          <h2 className="mb-4 text-lg font-medium">Navigation Items</h2>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              Main Navigation JSON
            </span>
            <textarea
              name="nav_items"
              defaultValue={JSON.stringify(settings?.nav_items || [], null, 2)}
              rows={10}
              spellCheck={false}
              placeholder={`[
  { "label": "Home", "href": "/" },
  { "label": "Safaris", "href": "/safaris" }
]`}
              className="mt-1 block w-full rounded-md border-gray-300 font-mono text-sm"
            />
          </label>
          <p className="mt-2 text-xs text-gray-500">
            Use an array of menu items with label and href. This keeps the CMS aligned with the existing JSON navigation setting.
          </p>
        </div>

        <div className="border-b pb-6">
          <h2 className="mb-4 text-lg font-medium">SEO Defaults</h2>
          <KeyValueEditor
            name="seo"
            label="SEO Defaults"
            value={settings?.seo}
            keyPlaceholder="title"
            valuePlaceholder="Default SEO value"
          />
        </div>

        <div className="border-b pb-6">
          <h2 className="mb-4 text-lg font-medium">Integrations & Tracking</h2>
          <KeyValueEditor
            name="integrations"
            label="Integration Settings"
            value={settings?.integrations}
            keyPlaceholder="google_analytics_id"
            valuePlaceholder="G-XXXXXXXXXX"
          />
          <p className="mt-2 text-xs text-gray-500">
            Store safe editable integration metadata here, such as analytics IDs, pixel IDs, or public widget IDs. Keep private API secrets in environment variables.
          </p>
        </div>

        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}

function SelectField({
  name,
  label,
  value,
  fallback,
  options,
}: {
  name: string;
  label: string;
  value?: string | null;
  fallback: string;
  options: Array<[string, string]>;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <select
        name={name}
        defaultValue={value || fallback}
        className="mt-1 block w-full rounded-md border-gray-300"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
