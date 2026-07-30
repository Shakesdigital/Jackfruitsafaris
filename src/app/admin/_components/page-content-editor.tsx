"use client";

import { useMemo, useState } from "react";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type JsonObject = { [key: string]: JsonValue };

type PageContentEditorProps = {
  initialContent: Record<string, unknown>;
};

const richTextKeys = new Set([
  "intro",
  "body",
  "card_body",
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

const labelMap: Record<string, string> = {
  body: "Body",
  button_href: "Button Link",
  button_label: "Button Label",
  card_body: "Card Body",
  cta_href: "CTA Link",
  cta_label: "CTA Label",
  fallback_articles: "Fallback Article Topics",
  fallback_features: "Fallback Features",
  fallback_items: "Fallback Items",
  filters: "Filter Chips",
  href: "Link",
  intro: "Intro Text",
  items: "Cards",
  link_href: "Guide Link",
  primary_href: "Primary Button Link",
  primary_label: "Primary Button Label",
  secondary_label: "Secondary Button Label",
};

function humanizeKey(key: string) {
  return labelMap[key] || key.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function isJsonObject(value: JsonValue): value is JsonObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function toJsonValue(value: unknown): JsonValue {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => toJsonValue(item));
  }

  if (typeof value === "object" && value) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, toJsonValue(item)]),
    );
  }

  return "";
}

function toJsonObject(value: Record<string, unknown>): JsonObject {
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, toJsonValue(item)]),
  );
}

function cloneContent(content: JsonObject) {
  return JSON.parse(JSON.stringify(content)) as JsonObject;
}

function updateValueAtPath(content: JsonObject, path: Array<string | number>, value: JsonValue) {
  const next = cloneContent(content);
  let cursor: JsonObject | JsonValue[] = next;

  for (let index = 0; index < path.length - 1; index += 1) {
    const segment = path[index];
    cursor = Array.isArray(cursor)
      ? (cursor[segment as number] as JsonObject | JsonValue[])
      : (cursor[segment as string] as JsonObject | JsonValue[]);
  }

  const lastSegment = path[path.length - 1];
  if (Array.isArray(cursor)) {
    cursor[lastSegment as number] = value;
  } else {
    cursor[lastSegment as string] = value;
  }

  return next;
}

function removeArrayItem(content: JsonObject, path: Array<string | number>, itemIndex: number) {
  const next = cloneContent(content);
  let cursor: JsonObject | JsonValue[] = next;

  for (const segment of path) {
    cursor = Array.isArray(cursor)
      ? (cursor[segment as number] as JsonObject | JsonValue[])
      : (cursor[segment as string] as JsonObject | JsonValue[]);
  }

  if (Array.isArray(cursor)) {
    cursor.splice(itemIndex, 1);
  }

  return next;
}

function addArrayItem(content: JsonObject, path: Array<string | number>, sample: JsonValue) {
  const next = cloneContent(content);
  let cursor: JsonObject | JsonValue[] = next;

  for (const segment of path) {
    cursor = Array.isArray(cursor)
      ? (cursor[segment as number] as JsonObject | JsonValue[])
      : (cursor[segment as string] as JsonObject | JsonValue[]);
  }

  if (Array.isArray(cursor)) {
    cursor.push(isJsonObject(sample) ? Object.fromEntries(Object.keys(sample).map((key) => [key, ""])) : "");
  }

  return next;
}

function FieldShell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function RichTextField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [html, setHtml] = useState(value);

  function runCommand(command: string) {
    document.execCommand(command);
  }

  return (
    <div className="rounded-md border border-gray-300 bg-white">
      <div className="flex flex-wrap gap-2 border-b border-gray-200 bg-gray-50 px-3 py-2">
        {[
          ["bold", "Bold"],
          ["italic", "Italic"],
          ["insertUnorderedList", "Bullets"],
        ].map(([command, label]) => (
          <button
            key={command}
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              runCommand(command);
            }}
            className="rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
          >
            {label}
          </button>
        ))}
      </div>
      <div
        contentEditable
        suppressContentEditableWarning
        className="min-h-28 w-full px-3 py-2 text-sm leading-6 outline-none"
        dangerouslySetInnerHTML={{ __html: html }}
        onInput={(event) => {
          const nextHtml = event.currentTarget.innerHTML;
          setHtml(nextHtml);
          onChange(nextHtml);
        }}
      />
    </div>
  );
}

function PrimitiveField({
  fieldKey,
  value,
  onChange,
}: {
  fieldKey: string;
  value: JsonValue;
  onChange: (value: JsonValue) => void;
}) {
  if (typeof value === "boolean") {
    return (
      <FieldShell label={humanizeKey(fieldKey)}>
        <select
          value={String(value)}
          onChange={(event) => onChange(event.target.value === "true")}
          className="block w-full rounded-md border-gray-300"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </FieldShell>
    );
  }

  if (typeof value === "number") {
    return (
      <FieldShell label={humanizeKey(fieldKey)}>
        <input
          type="number"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="block w-full rounded-md border-gray-300"
        />
      </FieldShell>
    );
  }

  const stringValue = typeof value === "string" ? value : "";
  const isLong = stringValue.length > 90 || richTextKeys.has(fieldKey);

  return (
    <FieldShell label={humanizeKey(fieldKey)}>
      {isLong ? (
        <RichTextField value={stringValue} onChange={(nextValue) => onChange(nextValue)} />
      ) : (
        <input
          value={stringValue}
          onChange={(event) => onChange(event.target.value)}
          className="block w-full rounded-md border-gray-300"
        />
      )}
    </FieldShell>
  );
}

function ArrayField({
  fieldKey,
  value,
  path,
  content,
  setContent,
}: {
  fieldKey: string;
  value: JsonValue[];
  path: Array<string | number>;
  content: JsonObject;
  setContent: (content: JsonObject) => void;
}) {
  const firstItem = value[0] ?? "";
  const objectItems = value.every((item) => isJsonObject(item));

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900">{humanizeKey(fieldKey)}</h3>
        <button
          type="button"
          onClick={() => setContent(addArrayItem(content, path, firstItem))}
          className="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium hover:bg-gray-100"
        >
          Add item
        </button>
      </div>

      <div className="space-y-3">
        {value.map((item, itemIndex) => (
          <div key={itemIndex} className="rounded-md border border-gray-200 bg-white p-3">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Item {itemIndex + 1}
              </span>
              <button
                type="button"
                onClick={() => setContent(removeArrayItem(content, path, itemIndex))}
                className="text-xs font-medium text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>

            {objectItems && isJsonObject(item) ? (
              <div className="grid gap-3">
                {Object.entries(item).map(([childKey, childValue]) => (
                  <PrimitiveField
                    key={childKey}
                    fieldKey={childKey}
                    value={childValue}
                    onChange={(nextValue) => setContent(updateValueAtPath(content, [...path, itemIndex, childKey], nextValue))}
                  />
                ))}
              </div>
            ) : (
              <PrimitiveField
                fieldKey={fieldKey}
                value={item}
                onChange={(nextValue) => setContent(updateValueAtPath(content, [...path, itemIndex], nextValue))}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ObjectField({
  fieldKey,
  value,
  path,
  content,
  setContent,
}: {
  fieldKey: string;
  value: JsonObject;
  path: Array<string | number>;
  content: JsonObject;
  setContent: (content: JsonObject) => void;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">{humanizeKey(fieldKey)}</h3>
      <div className="grid gap-4">
        {Object.entries(value).map(([childKey, childValue]) => (
          <EditableField
            key={childKey}
            fieldKey={childKey}
            value={childValue}
            path={[...path, childKey]}
            content={content}
            setContent={setContent}
          />
        ))}
      </div>
    </div>
  );
}

function EditableField({
  fieldKey,
  value,
  path,
  content,
  setContent,
}: {
  fieldKey: string;
  value: JsonValue;
  path: Array<string | number>;
  content: JsonObject;
  setContent: (content: JsonObject) => void;
}) {
  if (Array.isArray(value)) {
    return (
      <ArrayField
        fieldKey={fieldKey}
        value={value}
        path={path}
        content={content}
        setContent={setContent}
      />
    );
  }

  if (isJsonObject(value)) {
    return (
      <ObjectField
        fieldKey={fieldKey}
        value={value}
        path={path}
        content={content}
        setContent={setContent}
      />
    );
  }

  return (
    <PrimitiveField
      fieldKey={fieldKey}
      value={value}
      onChange={(nextValue) => setContent(updateValueAtPath(content, path, nextValue))}
    />
  );
}

export function PageContentEditor({ initialContent }: PageContentEditorProps) {
  const [content, setContent] = useState<JsonObject>(() => toJsonObject(initialContent || {}));

  const editableEntries = useMemo(
    () => Object.entries(content).filter(([key]) => !hiddenTechnicalKeys.has(key)),
    [content],
  );

  const technicalEntries = useMemo(
    () => Object.entries(content).filter(([key]) => hiddenTechnicalKeys.has(key)),
    [content],
  );

  return (
    <div className="space-y-6">
      <input type="hidden" name="content" value={JSON.stringify(content)} />

      <div>
        <h2 className="text-lg font-semibold text-gray-900">Editable Component Content</h2>
        <p className="mt-1 text-sm text-gray-500">
          Use these fields instead of editing raw JSON. Rich text boxes support bold,
          italic, and bullet lists where longer page copy appears.
        </p>
      </div>

      {editableEntries.length ? (
        <div className="grid gap-5">
          {editableEntries.map(([key, value]) => (
            <EditableField
              key={key}
              fieldKey={key}
              value={value}
              path={[key]}
              content={content}
              setContent={setContent}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 p-6 text-sm text-gray-500">
          This component has no editable copy fields yet. Technical settings are preserved below.
        </div>
      )}

      {technicalEntries.length > 0 && (
        <details className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-gray-700">
            Component wiring settings
          </summary>
          <div className="mt-4 grid gap-4">
            {technicalEntries.map(([key, value]) => (
              <EditableField
                key={key}
                fieldKey={key}
                value={value}
                path={[key]}
                content={content}
                setContent={setContent}
              />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
