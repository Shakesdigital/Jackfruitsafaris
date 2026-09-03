"use client";

import { useMemo, useState } from "react";
import { WysiwygEditor } from "@/app/admin/_components/cms-form-controls";

type JsonObject = Record<string, unknown>;

type PageContentEditorProps = {
  initialContent: JsonObject;
  sectionType?: string;
};

// Known field layouts for each section type.  Each field is rendered with an
// appropriate input — WysiwygEditor for long text, plain input for short text.
type SectionField = {
  name: string;
  label: string;
  type: "wysiwyg" | "text" | "url";
};

const SECTION_FIELDS: Record<string, SectionField[]> = {
  hero: [
    { name: "subtitle", label: "Hero Description", type: "wysiwyg" },
    { name: "cta_primary", label: "Primary Button Text", type: "text" },
    { name: "cta_secondary", label: "Secondary Button Text", type: "text" },
  ],
  why_uganda: [
    { name: "section_title", label: "Section Title", type: "text" },
    { name: "intro", label: "Intro Text", type: "wysiwyg" },
    { name: "paragraph", label: "Body Text", type: "wysiwyg" },
  ],
  cta: [
    { name: "box_title", label: "Box Title", type: "wysiwyg" },
    { name: "button_label", label: "Button Label", type: "text" },
  ],
  travel_guide: [
    { name: "link_href", label: "Guide Link URL", type: "url" },
    { name: "link_label", label: "Link Label", type: "text" },
    { name: "link_text", label: "Link Text", type: "text" },
  ],
  cta_panel: [
    { name: "intro", label: "Intro Text", type: "wysiwyg" },
    { name: "primary_label", label: "Primary Button Label", type: "text" },
    { name: "primary_href", label: "Primary Button Link", type: "url" },
    { name: "secondary_label", label: "Secondary Button Label", type: "text" },
  ],
  content_split: [
    { name: "intro", label: "Intro Text", type: "wysiwyg" },
    { name: "body", label: "Body Text", type: "wysiwyg" },
  ],
  feature_split_with_quote_form: [
    { name: "intro", label: "Intro Text", type: "wysiwyg" },
    { name: "body", label: "Body Text", type: "wysiwyg" },
  ],
  testimonials: [
    { name: "intro", label: "Intro Text", type: "wysiwyg" },
    { name: "more_link_label", label: "More Link Label", type: "text" },
    { name: "more_link_href", label: "More Link URL", type: "url" },
  ],
  stats: [
    { name: "title_prefix", label: "Title Prefix", type: "text" },
    { name: "body", label: "Description", type: "wysiwyg" },
  ],
  entity_card_grid: [
    { name: "fallback_items", label: "Fallback Items (JSON array)", type: "text" },
    { name: "card_fields", label: "Card Fields (JSON)", type: "text" },
  ],
  gallery: [
    { name: "columns", label: "Columns", type: "text" },
  ],
};

const RICH_TEXT_KEYS = new Set([
  "intro",
  "body",
  "card_body",
  "paragraph",
  "box_title",
  "description",
]);

const hiddenTechnicalKeys = new Set([
  "entity_source",
  "fallback_source",
  "items_source",
  "features_source",
  "layout",
  "card_fields",
  "icon",
  "form_source_page",
  "variant",
  "style",
  "secondary_source",
]);

function humanizeKey(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

const labelMap: Record<string, string> = {
  body: "Body",
  button_href: "Button Link",
  button_label: "Button Label",
  card_body: "Card Body",
  cta_href: "CTA Link",
  cta_label: "CTA Label",
  fallback_features: "Fallback Feature Topics",
  fallback_items: "Fallback Items",
  filters: "Filter Chips",
  href: "Link",
  intro: "Intro Text",
  items: "Cards",
  link_href: "Guide Link",
  primary_href: "Primary Button Link",
  primary_label: "Primary Button Label",
  secondary_label: "Secondary Button Label",
  subtitle: "Subtitle / Eyebrow",
  title: "Title",
};

/** Build the list of editable fields for a given section type + content. */
function resolveFields(
  sectionType: string | undefined,
  content: JsonObject,
): SectionField[] {
  if (sectionType && SECTION_FIELDS[sectionType]) {
    return SECTION_FIELDS[sectionType];
  }

  // Fallback: dynamically build fields from the content object.
  return Object.entries(content)
    .filter(([key]) => !hiddenTechnicalKeys.has(key))
    .map(([key, value]) => {
      const isRich =
        typeof value === "string" &&
        (value.length > 90 || RICH_TEXT_KEYS.has(key));
      return {
        name: key,
        label: labelMap[key] || humanizeKey(key),
        type: (isRich ? "wysiwyg" : "text") as SectionField["type"],
      };
    });
}

export function PageContentEditor({
  initialContent,
  sectionType = "",
}: PageContentEditorProps) {
  const [content, setContent] = useState<JsonObject>(() => {
    const initial: JsonObject = {};
    if (initialContent && typeof initialContent === "object") {
      for (const [key, value] of Object.entries(initialContent)) {
        if (typeof value === "string") {
          initial[key] = value;
        } else if (value === null || value === undefined) {
          initial[key] = "";
        } else {
          initial[key] = JSON.stringify(value);
        }
      }
    }
    return initial;
  });

  const fields = useMemo(
    () => resolveFields(sectionType, content),
    [sectionType, content],
  );

  const updateField = (name: string, value: string) => {
    setContent((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* The serialized content is submitted as a hidden JSON field. */}
      <input type="hidden" name="content" value={JSON.stringify(content)} />

      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          {sectionType
            ? `Section Content (${labelMap[sectionType] || humanizeKey(sectionType)})`
            : "Section Content"}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Edit the fields below. Rich text boxes support bold, italic, lists,
          headings, links, and images.
        </p>
      </div>

      {fields.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-6 text-sm text-gray-500">
          This section type has no editable content fields. The section will
          pull content from related CMS entities (safari packages, experiences,
          reviews, etc.).
        </div>
      ) : (
        <div className="grid gap-5">
          {fields.map((field) => {
            const value = content[field.name];
            const stringValue =
              typeof value === "string"
                ? value
                : value === null || value === undefined
                  ? ""
                  : JSON.stringify(value);

            if (field.type === "wysiwyg") {
              return (
                <WysiwygEditor
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  initialValue={stringValue}
                  placeholder={`${field.label}...`}
                  onChange={(val) => updateField(field.name, val)}
                />
              );
            }

            return (
              <label key={field.name} className="block">
                <span className="text-sm font-medium text-gray-700">
                  {field.label}
                </span>
                <input
                  type={field.type === "url" ? "url" : "text"}
                  name={field.name}
                  defaultValue={stringValue}
                  onChange={(event) =>
                    updateField(field.name, event.target.value)
                  }
                  placeholder={field.label}
                  className="mt-1 block w-full rounded-md border-gray-300 text-sm font-mono"
                />
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
