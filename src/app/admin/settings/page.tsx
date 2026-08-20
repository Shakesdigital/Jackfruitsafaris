import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { upsertSiteSettings } from "@/lib/server/cms-actions";
import { SettingsForm } from "./_components/SettingsForm";
import {
  TextField,
  TextAreaField,
  SelectField,
  ColorInputField,
  ImageUploadField,
  KeyValueEditor,
} from "./_components/FormFields";

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
    .order("updated_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const initialSettings = settings || {};

  return (
    <div className="max-w-4xl container-responsive">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
        <h1 className="text-fluid-2xl font-bold text-gray-900">Site Settings</h1>
        <div className="flex gap-2">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-fluid-sm text-red-700" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-fluid-sm text-green-700" role="alert">
              {success}
            </div>
          )}
        </div>
      </div>

      <SettingsForm initialSettings={initialSettings} action={upsertSiteSettings}>
        <div className="border-b pb-6 mb-6">
          <h2 className="mb-4 text-fluid-lg font-medium">Business Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              name="business_name"
              label="Business Name"
              required
              placeholder="Jackfruit Safaris"
            />
            <TextField
              name="contact_email"
              label="Contact Email"
              type="email"
              placeholder="jackfruitsafarisuganda@gmail.com"
            />
            <TextField
              name="phone"
              label="Phone"
              placeholder="+256 772 550 268"
            />
            <TextField
              name="alternate_phone"
              label="Alternate Phone"
              placeholder="+256 752 550 268"
            />
            <TextField
              name="address"
              label="Address"
              className="sm:col-span-2"
              placeholder="Craft Village, Jinja, Uganda"
            />
            <TextField
              name="operating_hours"
              label="Operating Hours"
              className="sm:col-span-2"
              placeholder="9 AM - 5 PM, with WhatsApp support for travel inquiries"
            />
          </div>
        </div>

        <div className="border-b pb-6 mb-6">
          <h2 className="mb-4 text-fluid-lg font-medium">WhatsApp</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              name="whatsapp_number"
              label="WhatsApp Number"
              placeholder="256772550268 (no + or spaces)"
            />
            <TextAreaField
              name="whatsapp_message"
              label="Default Message"
              rows={2}
              placeholder="Hello Jackfruit Safaris, I would like help planning a Uganda trip."
              className="sm:col-span-2"
            />
          </div>
        </div>

        {/* Homepage Content Settings */}
        <div className="border-b pb-6 mb-6">
          <h2 className="mb-4 text-fluid-lg font-medium">Homepage - Hero Section</h2>
          <div className="grid gap-4">
            <TextField
              name="hero_title"
              label="Hero Title"
              placeholder="Explore Uganda With Local Safari Experts"
            />
            <TextField
              name="hero_subtitle"
              label="Hero Subtitle"
              placeholder="Private Uganda safaris..."
            />
            <TextField
              name="badge_text"
              label="Badge Text"
              placeholder="Local safari experts from Jinja"
            />
            <TextField
              name="cta_primary"
              label="CTA Primary Button"
              placeholder="Plan My Safari"
            />
            <TextField
              name="cta_secondary"
              label="CTA Secondary Button"
              placeholder="View Safari Packages"
            />
            <ImageUploadField
              name="hero_image"
              fileName="hero_image_file"
              label="Homepage Hero Image"
              currentUrl={initialSettings.hero_image as string | null}
            />
          </div>
        </div>

        <div className="border-b pb-6 mb-6">
          <h2 className="mb-4 text-fluid-lg font-medium">Homepage - Why Uganda Section</h2>
          <div className="grid gap-4">
            <TextField
              name="why_uganda_eyebrow"
              label="Eyebrow"
              placeholder="Why Uganda"
            />
            <TextField
              name="why_uganda_title"
              label="Title"
              placeholder="One compact country, many safari worlds"
            />
            <TextAreaField
              name="why_uganda_intro"
              label="Intro"
              rows={2}
              placeholder="Uganda can take you from the River Nile..."
            />
            <TextAreaField
              name="why_uganda_paragraph"
              label="Paragraph"
              rows={3}
              placeholder="Jackfruit Safaris helps you experience Uganda smoothly..."
            />
          </div>
        </div>

        <div className="border-b pb-6 mb-6">
          <h2 className="mb-4 text-fluid-lg font-medium">Homepage - CTA Section</h2>
          <div className="grid gap-4">
            <TextField
              name="cta_eyebrow"
              label="Eyebrow"
              placeholder="Ready to plan?"
            />
            <TextField
              name="cta_title"
              label="Title"
              placeholder="Tell us your dates, group size, budget, and dream experiences."
            />
            <TextAreaField
              name="cta_intro"
              label="Intro Text"
              rows={2}
              placeholder="Jackfruit Safaris will recommend the best route and quote..."
            />
            <TextField
              name="cta_button"
              label="Button Text"
              placeholder="Request a Custom Quote"
            />
          </div>
        </div>

        <div className="border-b pb-6 mb-6">
          <h2 className="mb-4 text-fluid-lg font-medium">Branding</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <ImageUploadField
              name="logo_url"
              fileName="logo_file"
              label="Logo"
              currentUrl={initialSettings.logo_url as string | null}
            />
            <ImageUploadField
              name="favicon_url"
              fileName="favicon_file"
              label="Favicon"
              currentUrl={initialSettings.favicon_url as string | null}
            />
          </div>
        </div>

        <div className="border-b pb-6 mb-6">
          <h2 className="mb-2 text-fluid-lg font-medium">Site Aesthetics</h2>
          <p className="mb-4 text-fluid-sm text-gray-500">
            Control the global website palette, typography, shape, spacing, and visual feel.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-fluid-sm font-semibold uppercase tracking-wide text-gray-500">
                Brand Colors
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <ColorInputField name="brand_primary_color" label="Primary Brand Color" fallback="#143c2d" />
                <ColorInputField name="brand_secondary_color" label="Secondary Brand Color" fallback="#2d6f55" />
                <ColorInputField name="brand_accent_color" label="Accent / Highlight Color" fallback="#f5bf2f" />
                <ColorInputField name="brand_background_color" label="Website Background" fallback="#fbfaf5" />
                <ColorInputField name="brand_surface_color" label="Card / Surface Color" fallback="#ffffff" />
                <ColorInputField name="brand_text_color" label="Main Text Color" fallback="#10251b" />
                <ColorInputField name="brand_muted_text_color" label="Muted Text Color" fallback="#536154" />
                <ColorInputField name="footer_background_color" label="Footer Background Color" fallback="#10251b" />
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-fluid-sm font-semibold uppercase tracking-wide text-gray-500">
                Text Format
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SelectField
                  name="heading_font_family"
                  label="Heading Font"
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
              <h3 className="mb-3 text-fluid-sm font-semibold uppercase tracking-wide text-gray-500">
                Layout Feel
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SelectField
                  name="border_radius_style"
                  label="Corner Radius"
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

        <div className="border-b pb-6 mb-6">
          <h2 className="mb-4 text-fluid-lg font-medium">Social Links</h2>
          <KeyValueEditor
            name="social_links"
            label="Social Links"
            value={initialSettings.social_links as Record<string, unknown> | null}
            keyPlaceholder="facebook"
            valuePlaceholder="https://..."
          />
        </div>

        <div className="border-b pb-6 mb-6">
          <h2 className="mb-4 text-fluid-lg font-medium">Footer</h2>
          <div className="mb-4 grid gap-4">
            <TextAreaField
              name="footer_tagline"
              label="Footer Tagline"
              rows={2}
              placeholder="Private Uganda safaris, gorilla trekking, Nile adventures..."
            />
            <TextAreaField
              name="footer_note"
              label="Footer Note"
              rows={2}
              placeholder="Prices are shown as planning guidance..."
            />
          </div>
          <TextAreaField
            name="footer_copy"
            label="Footer Copyright"
            rows={3}
            placeholder="© 2024 Jackfruit Safaris. All rights reserved."
          />
        </div>

        <div className="border-b pb-6 mb-6">
          <h2 className="mb-4 text-fluid-lg font-medium">Navigation (Legacy JSON)</h2>
          <TextAreaField
            name="nav_items"
            label="Main Navigation JSON"
            rows={10}
            placeholder={`[
  { "label": "Home", "href": "/" },
  { "label": "Safaris", "href": "/safaris" }
]`}
            className="font-mono text-fluid-sm"
          />
          <p className="mt-2 text-fluid-xs text-gray-500">
            Use an array of menu items with label and href. For full navigation management, use the
            <a href="/admin/navigation" className="text-blue-600 underline">Navigation page</a>.
          </p>
        </div>

        <div className="border-b pb-6 mb-6">
          <h2 className="mb-4 text-fluid-lg font-medium">SEO Defaults</h2>
          <KeyValueEditor
            name="seo"
            label="SEO Defaults"
            value={initialSettings.seo as Record<string, unknown> | null}
            keyPlaceholder="title"
            valuePlaceholder="Default SEO value"
          />
        </div>

        <div className="border-b pb-6 mb-6">
          <h2 className="mb-4 text-fluid-lg font-medium">Integrations & Tracking</h2>
          <KeyValueEditor
            name="integrations"
            label="Integration Settings"
            value={initialSettings.integrations as Record<string, unknown> | null}
            keyPlaceholder="google_analytics_id"
            valuePlaceholder="G-XXXXXXXXXX"
          />
          <p className="mt-2 text-fluid-xs text-gray-500">
            Store safe editable integration metadata here, such as analytics IDs, pixel IDs, or public widget IDs. Keep private API secrets in environment variables.
          </p>
        </div>

        <button
          type="submit"
          className="btn-h-responsive rounded-md bg-blue-600 px-4 py-2 text-fluid-sm text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
        >
          Save Settings
        </button>
      </SettingsForm>
    </div>
  );
}