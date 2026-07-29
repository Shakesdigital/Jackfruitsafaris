"use client";

/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react";

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
  return (
    <div className="grid gap-3 rounded-md border border-gray-200 p-4 sm:grid-cols-[1fr_180px]">
      <label className="block">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <input
          type="url"
          name={name}
          defaultValue={currentUrl ?? ""}
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
          className="mt-1 block w-full text-sm text-gray-700"
        />
      </label>
      {currentUrl ? (
        <img
          src={currentUrl}
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
