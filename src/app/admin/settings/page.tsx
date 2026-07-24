import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { upsertSiteSettings } from "@/lib/server/cms-actions";

export const metadata: Metadata = {
  title: "Site Settings",
};

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .single();

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Site Settings</h1>

      <form
        action={upsertSiteSettings}
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6"
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
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Logo URL</span>
              <input
                type="url"
                name="logo_url"
                defaultValue={settings?.logo_url}
                placeholder="https://..."
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Favicon URL</span>
              <input
                type="url"
                name="favicon_url"
                defaultValue={settings?.favicon_url}
                placeholder="https://..."
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </label>
          </div>
        </div>

        <div className="border-b pb-6">
          <h2 className="mb-4 text-lg font-medium">Social Links</h2>
          <p className="mb-4 text-sm text-gray-500">Enter as JSON key-value pairs</p>
          <textarea
            name="social_links"
            defaultValue={JSON.stringify(settings?.social_links || {}, null, 2)}
            rows={4}
            placeholder='{"facebook": "https://...", "instagram": "https://...", "tripadvisor": "https://..."}'
            className="block w-full rounded-md border-gray-300 font-mono text-sm"
          />
        </div>

        <div className="border-b pb-6">
          <h2 className="mb-4 text-lg font-medium">Footer</h2>
          <textarea
            name="footer_copy"
            defaultValue={settings?.footer_copy}
            rows={3}
            placeholder="© 2024 Jackfruit Safaris Uganda. All rights reserved."
            className="block w-full rounded-md border-gray-300"
          />
        </div>

        <div className="border-b pb-6">
          <h2 className="mb-4 text-lg font-medium">SEO Defaults</h2>
          <textarea
            name="seo"
            defaultValue={JSON.stringify(settings?.seo || {}, null, 2)}
            rows={4}
            placeholder='{"title": "...", "description": "...", "keywords": "..."}'
            className="block w-full rounded-md border-gray-300 font-mono text-sm"
          />
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