"use client";

/* eslint-disable @next/next/no-img-element */

import { useMemo, useRef, useState } from "react";

type ListEditorProps = {
  name: string;
  label: string;
  values?: string[];
  placeholder?: string;
  emptyRows?: number;
};

type KeyValueEditorProps = {
  name: string;
  label: string;
  value?: Record<string, unknown> | null;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
};

type ImageUploadFieldProps = {
  name: string;
  fileName: string;
  label: string;
  currentUrl?: string | null;
};

type ColorInputFieldProps = {
  name: string;
  label: string;
  value?: string | null;
  fallback: string;
};

function coerceList(values?: string[]) {
  const rows = values?.filter((value) => value?.trim()) ?? [];
  return rows.length ? rows : [""];
}

export function ListEditor({
  name,
  label,
  values,
  placeholder,
  emptyRows = 1,
}: ListEditorProps) {
  const initialRows = useMemo(() => {
    const rows = coerceList(values);
    while (rows.length < emptyRows) rows.push("");
    return rows;
  }, [emptyRows, values]);
  const [rows, setRows] = useState(initialRows);
  const jsonValue = JSON.stringify(rows.map((row) => row.trim()).filter(Boolean));

  return (
    <fieldset className="block">
      <legend className="text-sm font-medium text-gray-700">{label}</legend>
      <input type="hidden" name={name} value={jsonValue} />
      <div className="mt-2 space-y-2">
        {rows.map((row, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={row}
              onChange={(event) => {
                const next = [...rows];
                next[index] = event.target.value;
                setRows(next);
              }}
              placeholder={placeholder}
              className="block w-full rounded-md border-gray-300 text-sm"
            />
            <button
              type="button"
              onClick={() => setRows(rows.filter((_, rowIndex) => rowIndex !== index))}
              className="rounded-md border border-gray-300 px-3 text-sm hover:bg-gray-50"
              aria-label={`Remove ${label} item ${index + 1}`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setRows([...rows, ""])}
        className="mt-3 rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
      >
        Add Item
      </button>
    </fieldset>
  );
}

export function KeyValueEditor({
  name,
  label,
  value,
  keyPlaceholder = "name",
  valuePlaceholder = "value",
}: KeyValueEditorProps) {
  const initialRows = useMemo(() => {
    const entries = Object.entries(value ?? {}).map(([key, entryValue]) => ({
      key,
      value: typeof entryValue === "string" ? entryValue : JSON.stringify(entryValue),
    }));
    return entries.length ? entries : [{ key: "", value: "" }];
  }, [value]);
  const [rows, setRows] = useState(initialRows);
  const jsonValue = JSON.stringify(
    Object.fromEntries(
      rows
        .map((row) => [row.key.trim(), row.value.trim()])
        .filter(([key, entryValue]) => key && entryValue),
    ),
  );

  return (
    <fieldset className="block">
      <legend className="text-sm font-medium text-gray-700">{label}</legend>
      <input type="hidden" name={name} value={jsonValue} />
      <div className="mt-2 space-y-2">
        {rows.map((row, index) => (
          <div key={index} className="grid gap-2 sm:grid-cols-[0.5fr_1fr_auto]">
            <input
              value={row.key}
              onChange={(event) => {
                const next = [...rows];
                next[index] = { ...row, key: event.target.value };
                setRows(next);
              }}
              placeholder={keyPlaceholder}
              className="rounded-md border-gray-300 text-sm"
            />
            <input
              value={row.value}
              onChange={(event) => {
                const next = [...rows];
                next[index] = { ...row, value: event.target.value };
                setRows(next);
              }}
              placeholder={valuePlaceholder}
              className="rounded-md border-gray-300 text-sm"
            />
            <button
              type="button"
              onClick={() => setRows(rows.filter((_, rowIndex) => rowIndex !== index))}
              className="rounded-md border border-gray-300 px-3 text-sm hover:bg-gray-50"
              aria-label={`Remove ${label} row ${index + 1}`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setRows([...rows, { key: "", value: "" }])}
        className="mt-3 rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
      >
        Add Row
      </button>
    </fieldset>
  );
}

export function ImageUploadField({
  name,
  fileName,
  label,
  currentUrl,
}: ImageUploadFieldProps) {
  const [manualUrl, setManualUrl] = useState(currentUrl ?? "");
  const [previewUrl, setPreviewUrl] = useState(currentUrl ?? "");
  const [fileStatus, setFileStatus] = useState(
    currentUrl ? "Current image loaded from CMS." : "No image selected yet.",
  );

  return (
    <div className="grid gap-3 rounded-md border border-gray-200 p-4 sm:grid-cols-[1fr_180px]">
      <label className="block">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <input
          type="url"
          name={name}
          value={manualUrl}
          onChange={(event) => {
            setManualUrl(event.target.value);
            setPreviewUrl(event.target.value);
            setFileStatus(event.target.value ? "Previewing image URL." : "No image selected yet.");
          }}
          placeholder="https://..."
          className="mt-1 block w-full rounded-md border-gray-300"
        />
        <span className="mt-3 block text-sm font-medium text-gray-700">
          Upload from computer
        </span>
        <input
          type="file"
          name={fileName}
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) {
              setPreviewUrl(manualUrl);
              setFileStatus(manualUrl ? "Previewing image URL." : "No image selected yet.");
              return;
            }

            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            setFileStatus(`${file.name} selected and ready to upload when you save.`);
          }}
          className="mt-1 block w-full text-sm text-gray-700"
        />
        <span className="mt-2 block rounded-md bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">
          {fileStatus}
        </span>
      </label>
      {previewUrl ? (
        <img
          src={previewUrl}
          alt=""
          className="h-32 w-full rounded-md object-cover"
        />
      ) : (
        <div className="flex h-32 items-center justify-center rounded-md bg-gray-100 text-sm text-gray-500">
          No image
        </div>
      )}
    </div>
  );
}

export function ColorInputField({
  name,
  label,
  value,
  fallback,
}: ColorInputFieldProps) {
  const [color, setColor] = useState(value || fallback);

  function updateColor(nextColor: string) {
    setColor(nextColor);
  }

  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input type="hidden" name={name} value={color} />
      <div className="mt-1 flex gap-2">
        <input
          type="color"
          value={/^#([A-Fa-f0-9]{6})$/.test(color) ? color : fallback}
          onChange={(event) => updateColor(event.target.value)}
          className="h-10 w-12 rounded-md border border-gray-300 bg-white p-1"
        />
        <input
          value={color}
          onChange={(event) => updateColor(event.target.value)}
          pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
          placeholder={fallback}
          className="block w-full rounded-md border-gray-300 font-mono text-sm"
        />
      </div>
      <span className="mt-1 block text-xs text-gray-500">
        Pick a color or type a hex code, then save settings.
      </span>
    </label>
  );
}

// ---------------------------------------------------------------------------
// WysiwygEditor — a lightweight, dependency-free rich-text editor built on
// contentEditable + document.execCommand.  Provides bold / italic / underline /
// strikethrough / headings / lists / link insertion — enough for CMS body copy
// without pulling in a heavy bundling library.
// ---------------------------------------------------------------------------

const FORMAT_COMMANDS: Array<{
  label: string;
  command: string;
  value?: string;
  title: string;
}> = [
  { label: "B", command: "bold", title: "Bold (Ctrl+B)" },
  { label: "I", command: "italic", title: "Italic (Ctrl+I)" },
  { label: "U", command: "underline", title: "Underline (Ctrl+U)" },
  { label: "S", command: "strikeThrough", title: "Strikethrough" },
  { label: "•", command: "insertUnorderedList", title: "Bullet list" },
  { label: "1.", command: "insertOrderedList", title: "Numbered list" },
  { label: "H1", command: "formatBlock", value: "h1", title: "Heading 1" },
  { label: "H2", command: "formatBlock", value: "h2", title: "Heading 2" },
  { label: "H3", command: "formatBlock", value: "h3", title: "Heading 3" },
  { label: "¶", command: "formatBlock", value: "p", title: "Paragraph" },
];

type WysiwygEditorProps = {
  name: string;
  label: string;
  initialValue?: string;
  placeholder?: string;
  minHeight?: number;
  /** Called with the current HTML value whenever it changes. */
  onChange?: (value: string) => void;
};

export function WysiwygEditor({
  name,
  label,
  initialValue = "",
  placeholder = "Enter content...",
  minHeight = 160,
  onChange,
}: WysiwygEditorProps) {
  const [html, setHtml] = useState(initialValue);
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    // Sync hidden input after command
    setHtml(editorRef.current?.innerHTML || "");
  };

  const handleInput = () => {
    const next = editorRef.current?.innerHTML || "";
    if (next !== html) {
      setHtml(next);
      onChange?.(next);
    }
  };

  const insertLink = () => {
    const url = window.prompt("Enter URL:", "https://");
    if (url) execCommand("createLink", url);
  };

  const insertImage = () => {
    const url = window.prompt("Enter image URL:", "https://");
    if (url) execCommand("insertImage", url);
  };

  const insertHorizontalRule = () => {
    execCommand("insertHorizontalRule");
  };

  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input type="hidden" name={name} value={html} />
      <div className="mt-1 rounded-md border border-gray-300 bg-white">
        <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 p-1.5">
          {FORMAT_COMMANDS.map((cmd) => (
            <button
              key={cmd.command + (cmd.value || "")}
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                execCommand(cmd.command, cmd.value);
              }}
              title={cmd.title}
              className="rounded border border-gray-300 bg-white px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
            >
              {cmd.label}
            </button>
          ))}
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              insertLink();
            }}
            title="Insert link"
            className="rounded border border-gray-300 bg-white px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
          >
            🔗
          </button>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              insertImage();
            }}
            title="Insert image"
            className="rounded border border-gray-300 bg-white px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
          >
            🖼
          </button>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              insertHorizontalRule();
            }}
            title="Insert horizontal rule"
            className="rounded border border-gray-300 bg-white px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
          >
            ≡
          </button>
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          data-placeholder={placeholder}
          className="wysiwyg-editor w-full resize-none border-0 bg-white px-3 py-2 text-sm leading-6 outline-none empty-before:content-[attr(data-placeholder)]"
          style={{ minHeight }}
        />
        {/* Ensure the placeholder pseudo-element works */}
        <style>{`
          .wysiwyg-editor[data-placeholder]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            pointer-events: none;
          }
        `}</style>
      </div>
    </label>
  );
}

// ---------------------------------------------------------------------------
// SocialLinkEditor — replaces the raw JSON KeyValueEditor for social_links.
// Renders a fixed set of known platforms with URL inputs and a preview.
// ---------------------------------------------------------------------------

const SOCIAL_PLATFORMS = [
  { key: "facebook", label: "Facebook", icon: "f" },
  { key: "instagram", label: "Instagram", icon: "ig" },
  { key: "twitter", label: "X / Twitter", icon: "tw" },
  { key: "linkedin", label: "LinkedIn", icon: "in" },
  { key: "youtube", label: "YouTube", icon: "yt" },
  { key: "tiktok", label: "TikTok", icon: "tt" },
  { key: "whatsapp", label: "WhatsApp", icon: "wa" },
  { key: "tripadvisor", label: "TripAdvisor", icon: "ta" },
  { key: "safaribookings", label: "SafariBookings", icon: "sb" },
];

type SocialLinkEditorProps = {
  name: string;
  label: string;
  value?: Record<string, string> | null;
  className?: string;
};

export function SocialLinkEditor({
  name,
  label,
  value,
  className,
}: SocialLinkEditorProps) {
  const pairs = useMemo(() => {
    const source = value || {};
    return SOCIAL_PLATFORMS.map((platform) => ({
      key: platform.key,
      label: platform.label,
      value: typeof source[platform.key] === "string" ? source[platform.key] : "",
    }));
  }, [value]);

  const [rows, setRows] = useState(pairs);

  const jsonValue = JSON.stringify(
    Object.fromEntries(
      rows
        .filter((row) => row.value.trim())
        .map((row) => [row.key, row.value.trim()]),
    ),
  );

  return (
    <fieldset className={className || "block"}>
      <legend className="text-sm font-medium text-gray-700">{label}</legend>
      <input type="hidden" name={name} value={jsonValue} />
      <div className="mt-2 space-y-2">
        {rows.map((row, index) => (
          <div key={row.key} className="flex items-center gap-3">
            <span className="w-32 text-sm text-gray-600">{row.label}</span>
            <input
              type="url"
              value={row.value}
              onChange={(event) => {
                const next = [...rows];
                next[index] = { ...row, value: event.target.value };
                setRows(next);
              }}
              placeholder="https://..."
              className="block w-full rounded-md border-gray-300 text-sm"
            />
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Enter full URLs (e.g. https://facebook.com/jackfruitsafaris).
        Leave blank to hide a platform.
      </p>
    </fieldset>
  );
}

// ---------------------------------------------------------------------------
// SectionTypeSelector — a simple dropdown for known page-content section types,
// replacing free-text entry that could produce invalid values.
// ---------------------------------------------------------------------------

export const SECTION_TYPE_OPTIONS = [
  { value: "hero", label: "Hero" },
  { value: "why_uganda", label: "Why Uganda" },
  { value: "featured_safaris", label: "Featured Safaris" },
  { value: "experiences", label: "Experiences" },
  { value: "reviews", label: "Reviews" },
  { value: "travel_guide", label: "Travel Guide Links" },
  { value: "cta", label: "Call to Action" },
  { value: "cta_panel", label: "Quote CTA Panel" },
  { value: "content_split", label: "Content Split" },
  { value: "feature_split_with_quote_form", label: "Feature Split + Quote Form" },
  { value: "testimonials", label: "Testimonials Slider" },
  { value: "entity_card_grid", label: "Entity Card Grid" },
  { value: "stats", label: "Stats / Numbers" },
  { value: "gallery", label: "Image Gallery" },
  { value: "map", label: "Map Embed" },
];

type SectionTypeSelectorProps = {
  name: string;
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  allowCustom?: boolean;
};

export function SectionTypeSelector({
  name,
  label,
  value = "",
  onChange,
  allowCustom = false,
}: SectionTypeSelectorProps) {
  const [customValue, setCustomValue] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const effectiveValue = isCustom ? customValue : (value || "");

  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="mt-1 flex items-center gap-2">
        <select
          name={name}
          value={isCustom ? "__custom__" : (value || "")}
          onChange={(event) => {
            if (event.target.value === "__custom__") {
              setIsCustom(true);
            } else {
              setIsCustom(false);
              onChange?.(event.target.value);
            }
          }}
          className="block w-full rounded-md border-gray-300 text-sm"
        >
          <option value="">— Select a section type —</option>
          {SECTION_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          {allowCustom && <option value="__custom__">Custom…</option>}
        </select>
        {isCustom && allowCustom && (
          <input
            type="text"
            value={customValue}
            onChange={(event) => {
              setCustomValue(event.target.value);
              onChange?.(event.target.value);
            }}
            name={name}
            placeholder="section_type"
            className="w-32 rounded-md border-gray-300 text-sm font-mono"
          />
        )}
      </div>
    </label>
  );
}
