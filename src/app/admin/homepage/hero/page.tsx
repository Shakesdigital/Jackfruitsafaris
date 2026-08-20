export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { getAdminHomepageSections } from "@/lib/cms-data";
import { ImageUploadField } from "@/app/admin/_components/cms-form-controls";

export const metadata: Metadata = {
  title: "Hero Section",
};

type HomepageSection = {
  id?: string;
  section_type?: string;
  title?: string | null;
  subtitle?: string | null;
  content?: Record<string, string | null | undefined>;
};

export default async function HeroEditPage() {
  const sections = await getAdminHomepageSections();
  const hero = sections?.find(
    (section: HomepageSection) => section.section_type === "hero",
  );
  const content = hero?.content || {};

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hero Section</h1>
      </div>

      <form
        action="/admin/homepage/hero/actions/upsert"
        method="post"
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6"
        encType="multipart/form-data"
      >
        <input type="hidden" name="id" value={hero?.id} />
        <input type="hidden" name="section_type" value="hero" />

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Hero Title</span>
          <input
            required
            name="title"
            defaultValue={hero?.title || "Explore Uganda With Local Safari Experts"}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Hero Subtitle</span>
          <input
            required
            name="subtitle"
            defaultValue={hero?.subtitle || "Local safari experts from Jinja"}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Hero Description</span>
          <textarea
            name="content_subtitle"
            rows={3}
            defaultValue={
              content.subtitle ||
              "Private Uganda safaris, gorilla trekking, Jinja adventures, cultural experiences, and reliable airport transfers planned by Jackfruit Safaris from Jinja."
            }
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Primary Button Text</span>
            <input
              name="content_cta_primary"
              defaultValue={content.cta_primary || "Plan My Safari"}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Secondary Button Text</span>
            <input
              name="content_cta_secondary"
              defaultValue={content.cta_secondary || "View Safari Packages"}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>
        </div>

        <ImageUploadField
          name="background_image"
          fileName="background_image_file"
          label="Hero Background Image"
          currentUrl={content.background_image}
        />

        <div className="flex gap-3 pt-4">
          <Link
            href="/admin/homepage"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Back
          </Link>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Save Hero
          </button>
        </div>
      </form>
    </div>
  );
}
