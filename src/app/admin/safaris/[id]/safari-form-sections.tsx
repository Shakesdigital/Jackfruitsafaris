"use client";

import { useState } from "react";
import { ListEditor, ImageUploadField } from "@/app/admin/_components/cms-form-controls";
import type {
  HighlightWithImage,
  ImageAlignment,
  SafariPageSection,
} from "@/lib/content";

type SafariDay = {
  day?: string;
  title?: string;
  body?: string;
  meals?: string;
  image_url?: string | null;
  image_alignment?: string | null;
};

type AccommodationOption = {
  tier?: string;
  options?: string;
};

type SafariFaq = {
  question?: string;
  answer?: string;
};

type SafariRecord = {
  id?: string;
  slug?: string | null;
  status?: string | null;
  title?: string | null;
  duration?: string | null;
  route?: string | null;
  start_point?: string | null;
  end_point?: string | null;
  price_from?: string | number | null;
  comfort_levels?: unknown;
  summary?: string | null;
  featured_image_url?: string | null;
  itinerary?: unknown;
  accommodation_options?: unknown;
  highlights?: unknown;
  highlights_content?: unknown;
  page_sections?: unknown;
  included?: unknown;
  excluded?: unknown;
  faq?: unknown;
  meta_title?: string | null;
  meta_description?: string | null;
  permit_rate_warning?: string | null;
  related_destinations?: unknown;
};

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value : [];
}

function fieldValue(value: string | number | null | undefined) {
  return value ?? "";
}

export { asArray, fieldValue };
export type { SafariRecord, SafariDay, AccommodationOption, SafariFaq };

export function ItinerarySection({ safari }: { safari: SafariRecord | null }) {
  const itinerary = asArray<SafariDay>(safari?.itinerary);
  const rows: Array<SafariDay | null> =
    itinerary.length > 0 ? itinerary : [null, null, null];

  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-lg font-medium">Day-by-Day Itinerary</h3>
      <input type="hidden" name="days_count" value={rows.length} />
      {rows.map((day, i) => (
        <div key={i} className="mb-4 grid gap-3 rounded-md border p-3">
          <div className="grid gap-2 sm:grid-cols-3">
            <input
              name={`day_${i + 1}_number`}
              defaultValue={day?.day || `Day ${i + 1}`}
              placeholder="Day 1"
              className="rounded-md border-gray-300 text-sm"
            />
            <input
              name={`day_${i + 1}_title`}
              defaultValue={day?.title}
              placeholder="Day title"
              className="rounded-md border-gray-300 text-sm sm:col-span-2"
            />
            <textarea
              name={`day_${i + 1}_body`}
              defaultValue={day?.body}
              placeholder="Description..."
              rows={2}
              className="rounded-md border-gray-300 text-sm sm:col-span-3"
            />
            <input
              name={`day_${i + 1}_meals`}
              defaultValue={day?.meals}
              placeholder="Meals: Breakfast, lunch, dinner"
              className="rounded-md border-gray-300 text-sm sm:col-span-3"
            />
            <input
              name={`day_${i + 1}_image_url`}
              defaultValue={day?.image_url || ""}
              placeholder="Image URL (optional)"
              className="rounded-md border-gray-300 text-sm sm:col-span-3"
            />
            <select
              name={`day_${i + 1}_image_alignment`}
              defaultValue={day?.image_alignment || ""}
              className="rounded-md border-gray-300 text-sm sm:col-span-3"
            >
              <option value="">No image alignment</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="center">Center</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AccommodationsSection({ safari }: { safari: SafariRecord | null }) {
  const acc = asArray<AccommodationOption>(safari?.accommodation_options);
  const rows: Array<AccommodationOption | null> =
    acc.length > 0 ? acc : [null, null, null];

  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-lg font-medium">Accommodation Options</h3>
      {rows.map((item, i) => (
        <div key={i} className="mb-3 grid gap-2 sm:grid-cols-2">
          <input
            name={`acc_${i + 1}_tier`}
            defaultValue={item?.tier}
            placeholder="Luxury / Mid-range / Budget"
            className="rounded-md border-gray-300 text-sm"
          />
          <input
            name={`acc_${i + 1}_options`}
            defaultValue={item?.options}
            placeholder="Lodge options..."
            className="rounded-md border-gray-300 text-sm"
          />
        </div>
      ))}
    </div>
  );
}

// Highlights Section — image-aware editor
export function HighlightsSection({ safari }: { safari: SafariRecord | null }) {
  const highlightsContent = asArray<HighlightWithImage>(safari?.highlights_content);
  const highlightsText = asArray<string>(safari?.highlights);
  const rows: Array<HighlightWithImage> =
    highlightsContent.length > 0
      ? highlightsContent
      : highlightsText.map((t) => ({ text: t, image_url: null, image_alignment: null }));

  while (rows.length < 4) {
    rows.push({ text: "", image_url: null, image_alignment: null });
  }

  const [clientRows, setClientRows] = useState(rows);
  const jsonValue = JSON.stringify(
    clientRows.map((r) => ({
      text: r.text?.trim() || "",
      image_url: r.image_url || null,
      image_alignment: r.image_alignment || null,
    })).filter((r) => r.text),
  );

  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-lg font-medium">Highlights</h3>
      <p className="mb-3 text-xs text-gray-500">
        Each highlight can have an optional image with alignment.
      </p>
      <input type="hidden" name="highlights_content" value={jsonValue} />
      {/* Keep the original text[] highlights in sync for fallback/data integrity */}
      <input
        type="hidden"
        name="highlights"
        value={JSON.stringify(clientRows.map((r) => r.text?.trim()).filter(Boolean))}
      />
      <div className="space-y-4">
        {clientRows.map((row, i) => (
          <div key={i} className="grid gap-3 rounded-md border p-3">
            <input
              name={`highlight_${i + 1}_text`}
              defaultValue={row?.text || ""}
              placeholder="Scenic drive through western Uganda"
              className="rounded-md border-gray-300 text-sm"
              onChange={(e) => {
                const next = [...clientRows];
                next[i] = { ...next[i], text: e.target.value };
                setClientRows(next);
              }}
            />
            <input
              name={`highlight_${i + 1}_image_url`}
              defaultValue={row?.image_url || ""}
              placeholder="Image URL (optional)"
              className="rounded-md border-gray-300 text-sm"
              onChange={(e) => {
                const next = [...clientRows];
                next[i] = { ...next[i], image_url: e.target.value };
                setClientRows(next);
              }}
            />
            <select
              name={`highlight_${i + 1}_image_alignment`}
              defaultValue={row?.image_alignment || ""}
              className="rounded-md border-gray-300 text-sm"
              onChange={(e) => {
                const next = [...clientRows];
                next[i] = { ...next[i], image_alignment: (e.target.value as ImageAlignment) || null };
                setClientRows(next);
              }}
            >
              <option value="">No alignment</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="center">Center</option>
            </select>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setClientRows([...clientRows, { text: "", image_url: null, image_alignment: null }])}
        className="mt-3 rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
      >
        Add Highlight
      </button>
    </div>
  );
}

// Page Sections Section — CMS-managed arbitrary content sections with images
export function PageSectionsSection({ safari }: { safari: SafariRecord | null }) {
  const sections = asArray<SafariPageSection>(safari?.page_sections);
  const [clientSections, setClientSections] = useState<SafariPageSection[]>(
    sections.length > 0 ? sections : [{ key: "", title: "", body: "", image_url: null, image_alignment: null }],
  );

  const jsonValue = JSON.stringify(
    clientSections
      .map((s, idx) => ({
        key: s.key?.trim() || `section_${idx + 1}`,
        title: s.title?.trim() || null,
        body: s.body?.trim() || null,
        image_url: s.image_url || null,
        image_alignment: s.image_alignment || null,
      }))
      .filter((s) => s.key || s.title || s.body),
  );

  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-lg font-medium">Page Sections (Images & Content)</h3>
      <p className="mb-3 text-xs text-gray-500">
        Add content sections that appear on the safari detail page between FAQs and the customization box. Each section can have a title, body text, and an optional image with alignment.
      </p>
      <input type="hidden" name="page_sections" value={jsonValue} />
      <div className="space-y-4">
        {clientSections.map((section, i) => (
          <div key={i} className="grid gap-3 rounded-md border p-3">
            <input
              name={`page_section_${i + 1}_key`}
              defaultValue={section?.key || ""}
              placeholder="Section key (e.g. 'wildlife_insider')"
              className="rounded-md border-gray-300 text-sm font-mono"
              onChange={(e) => {
                const next = [...clientSections];
                next[i] = { ...next[i], key: e.target.value };
                setClientSections(next);
              }}
            />
            <input
              name={`page_section_${i + 1}_title`}
              defaultValue={section?.title || ""}
              placeholder="Section title (optional)"
              className="rounded-md border-gray-300 text-sm"
              onChange={(e) => {
                const next = [...clientSections];
                next[i] = { ...next[i], title: e.target.value };
                setClientSections(next);
              }}
            />
            <textarea
              name={`page_section_${i + 1}_body`}
              defaultValue={section?.body || ""}
              placeholder="Body text..."
              rows={2}
              className="rounded-md border-gray-300 text-sm"
              onChange={(e) => {
                const next = [...clientSections];
                next[i] = { ...next[i], body: e.target.value };
                setClientSections(next);
              }}
            />
            <input
              name={`page_section_${i + 1}_image_url`}
              defaultValue={section?.image_url || ""}
              placeholder="Image URL (optional)"
              className="rounded-md border-gray-300 text-sm"
              onChange={(e) => {
                const next = [...clientSections];
                next[i] = { ...next[i], image_url: e.target.value };
                setClientSections(next);
              }}
            />
            <select
              name={`page_section_${i + 1}_image_alignment`}
              defaultValue={section?.image_alignment || ""}
              className="rounded-md border-gray-300 text-sm"
              onChange={(e) => {
                const next = [...clientSections];
                next[i] = { ...next[i], image_alignment: (e.target.value as ImageAlignment) || null };
                setClientSections(next);
              }}
            >
              <option value="">No alignment</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="center">Center</option>
            </select>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          setClientSections([
            ...clientSections,
            { key: "", title: "", body: "", image_url: null, image_alignment: null },
          ])
        }
        className="mt-3 rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
      >
        Add Section
      </button>
    </div>
  );
}

// Related Destinations Section
export function RelatedDestinationsSection({ safari }: { safari: SafariRecord | null }) {
  const destinations: string[] = asArray<string>(safari?.related_destinations);
  return (
    <div className="border-t pt-6">
      <ListEditor
        name="related_destinations"
        label="Related Destinations"
        values={destinations}
        placeholder="bwindi-impenetrable-national-park"
        emptyRows={3}
      />
    </div>
  );
}

// Included/Excluded Section
export function IncludedExcludedSection({ safari }: { safari: SafariRecord | null }) {
  const included = asArray<string>(safari?.included);
  const excluded = asArray<string>(safari?.excluded);

  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-lg font-medium">Inclusions & Exclusions</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <ListEditor
          name="included"
          label="Included"
          values={included}
          placeholder="Private 4x4 safari vehicle"
          emptyRows={4}
        />
        <ListEditor
          name="excluded"
          label="Excluded"
          values={excluded}
          placeholder="International flights"
          emptyRows={4}
        />
      </div>
    </div>
  );
}

// FAQs Section
export function FAQsSection({ safari }: { safari: SafariRecord | null }) {
  const faqs = asArray<SafariFaq>(safari?.faq);
  const rows: Array<SafariFaq | null> =
    faqs.length > 0 ? faqs : [null, null, null];

  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-lg font-medium">FAQs</h3>
      {rows.map((faq, i) => (
        <div key={i} className="mb-4 grid gap-2">
          <input
            name={`faq_${i + 1}_question`}
            defaultValue={faq?.question}
            placeholder="Question"
            className="rounded-md border-gray-300 text-sm"
          />
          <textarea
            name={`faq_${i + 1}_answer`}
            defaultValue={faq?.answer}
            placeholder="Answer"
            rows={2}
            className="rounded-md border-gray-300 text-sm"
          />
        </div>
      ))}
    </div>
  );
}

// SEO Fields
export function SEOFields({ safari }: { safari: SafariRecord | null }) {
  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-lg font-medium">SEO</h3>
      <div className="grid gap-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Meta Title</span>
          <input
            name="meta_title"
            defaultValue={fieldValue(safari?.meta_title)}
            placeholder="SEO page title"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Meta Description</span>
          <textarea
            name="meta_description"
            defaultValue={fieldValue(safari?.meta_description)}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Permit Rate Warning</span>
          <input
            name="permit_rate_warning"
            defaultValue={fieldValue(safari?.permit_rate_warning)}
            placeholder="Optional warning about permit rates"
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </label>
      </div>
    </div>
  );
}
