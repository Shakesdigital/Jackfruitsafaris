export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminPageHeroes } from "@/lib/cms-data";
import { ImageUploadField } from "@/app/admin/_components/cms-form-controls";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ slug?: string }>;
};

type PageHero = {
  id?: string;
  page_slug?: string;
  eyebrow?: string | null;
  badge_text?: string | null;
  title?: string | null;
  subtitle?: string | null;
  intro?: string | null;
  background_image?: string | null;
  cta_primary?: string | null;
  cta_secondary?: string | null;
  cta_primary_href?: string | null;
  cta_secondary_href?: string | null;
  quick_links?: Array<{ label: string; href: string }> | null;
  content?: Record<string, string | null | undefined>;
  status?: string | null;
};

export const metadata: Metadata = {
  title: "Edit Page Hero",
};

export default async function PageHeroEdit({ params, searchParams }: Props) {
  const { id } = await params;
  const { slug } = await searchParams;
  const isNew = id === "new";

  const heroes = await getAdminPageHeroes();
  const hero = isNew
    ? null
    : heroes?.find((pageHero: PageHero) => pageHero.id === id);

  const pageSlug = hero?.page_slug || slug || "/";
  const aboutContent = hero?.content || {};

  if (!hero && !isNew) {
    notFound();
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? "New Page Hero" : "Edit Page Hero"}
        </h1>
        <p className="mt-2 text-sm text-gray-500">Page: {pageSlug}</p>
      </div>

      <form
        action="/admin/pages/heroes/actions/upsert"
        method="post"
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6"
        encType="multipart/form-data"
      >
        <input type="hidden" name="id" value={hero?.id} />
        <input type="hidden" name="page_slug" value={pageSlug} />

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Eyebrow</span>
          <input
            name="eyebrow"
            defaultValue={hero?.eyebrow}
            placeholder="Page section label"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Badge Text</span>
          <input
            name="badge_text"
            defaultValue={hero?.badge_text || hero?.eyebrow || ""}
            placeholder="Badge pill text (e.g. 'Local safari experts from Jinja')"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">CTA Primary</span>
            <input
              name="cta_primary"
              defaultValue={hero?.cta_primary || "Plan My Safari"}
              placeholder="Primary button text"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">CTA Primary Href</span>
            <input
              name="cta_primary_href"
              defaultValue={hero?.cta_primary_href || "/request-quote"}
              placeholder="/request-quote"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">CTA Secondary</span>
            <input
              name="cta_secondary"
              defaultValue={hero?.cta_secondary || "View Safari Packages"}
              placeholder="Secondary button text"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">CTA Secondary Href</span>
            <input
              name="cta_secondary_href"
              defaultValue={hero?.cta_secondary_href || "/safaris"}
              placeholder="/safaris"
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Quick Links</span>
          <textarea
            name="quick_links"
            rows={4}
            placeholder='JSON array: [{"label":"Gorilla Trekking","href":"/experiences/gorilla-trekking"}, ...]'
            className="mt-1 block w-full rounded-md border-gray-300 font-mono text-sm"
          >
            {hero?.quick_links ? JSON.stringify(hero.quick_links, null, 2) : ""}
          </textarea>
          <p className="mt-1 text-xs text-gray-500">Enter quick links as JSON. Leave blank to use defaults.</p>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Title (h1)</span>
          <input
            name="title"
            defaultValue={hero?.title}
            placeholder="Page title (h1)"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Subtitle (h2)</span>
          <input
            name="subtitle"
            defaultValue={hero?.subtitle ?? ""}
            placeholder="Sub-title rendered as h2 between title and intro"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Intro Text</span>
          <textarea
            name="intro"
            defaultValue={hero?.intro}
            rows={3}
            placeholder="Page description/introduction"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>

        <ImageUploadField
          name="background_image"
          fileName="background_image_file"
          label="Background Image"
          currentUrl={hero?.background_image}
        />

        {pageSlug === "/about" && (
          <div className="border-t pt-6">
            <h2 className="mb-4 text-lg font-medium">About Page Content</h2>
            <div className="grid gap-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Intro Body</span>
                <textarea
                  name="intro_body"
                  defaultValue={aboutContent.intro_body}
                  rows={5}
                  placeholder="Founder's story and give-back narrative shown below the hero"
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Mission</span>
                <textarea
                  name="mission"
                  defaultValue={aboutContent.mission}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Vision</span>
                <textarea
                  name="vision"
                  defaultValue={aboutContent.vision}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Give Back</span>
                <textarea
                  name="give_back"
                  defaultValue={aboutContent.give_back}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </label>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <select
              name="status"
              defaultValue={hero?.status || "published"}
              className="mt-1 block w-full rounded-md border-gray-300"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <Link
            href="/admin/pages/heroes"
            className="rounded-md border border-gray-300 min-h-[44px] px-4 py-3 text-sm hover:bg-gray-50 flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-md bg-blue-600 min-h-[44px] px-4 py-3 text-sm text-white hover:bg-blue-700 flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
          >
            Save Hero
          </button>
        </div>
      </form>
    </div>
  );
}
