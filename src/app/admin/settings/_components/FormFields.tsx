"use client";

import { useFormField } from "./SettingsForm";

interface TextFieldProps {
  name: string;
  label: string;
  type?: "text" | "email" | "url" | "number" | "tel";
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function TextField({ name, label, type = "text", placeholder, required, className }: TextFieldProps) {
  const { value, onChange } = useFormField(name);

  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`mt-1 block w-full rounded-md border-gray-300 ${className || ""}`}
      />
    </label>
  );
}

interface TextAreaFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  className?: string;
}

export function TextAreaField({ name, label, placeholder, rows = 3, required, className }: TextAreaFieldProps) {
  const { value, onChange } = useFormField(name);

  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className={`mt-1 block w-full rounded-md border-gray-300 ${className || ""}`}
      />
    </label>
  );
}

interface SelectFieldProps {
  name: string;
  label: string;
  options: Array<[string, string]>;
  fallback: string;
  required?: boolean;
  className?: string;
}

export function SelectField({ name, label, options, fallback, required, className }: SelectFieldProps) {
  const { value, onChange } = useFormField(name);
  const effectiveValue = value || fallback;

  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <select
        name={name}
        value={effectiveValue}
        onChange={onChange}
        required={required}
        className={`mt-1 block w-full rounded-md border-gray-300 ${className || ""}`}
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

interface ColorInputFieldProps {
  name: string;
  label: string;
  fallback: string;
  className?: string;
}

export function ColorInputField({ name, label, fallback, className }: ColorInputFieldProps) {
  const { value, onChange } = useFormField(name);
  const effectiveValue = value || fallback;

  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="mt-1 flex items-center gap-3">
        <input
          type="color"
          name={name}
          value={effectiveValue}
          onChange={onChange}
          className="size-10 rounded border border-gray-300 cursor-pointer"
        />
        <input
          type="text"
          name={`${name}_text`}
          value={effectiveValue}
          onChange={(event) => onChange(event.target.value)}
          className="flex-1 rounded-md border-gray-300 font-mono text-sm"
          placeholder="#rrggbb"
        />
      </div>
    </label>
  );
}

interface ImageUploadFieldProps {
  name: string;
  fileName: string;
  label: string;
  currentUrl?: string | null;
  className?: string;
}

export function ImageUploadField({ name, fileName, label, currentUrl, className }: ImageUploadFieldProps) {
  const { value, onChange } = useFormField(name);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || value || null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (currentUrl) {
      setPreviewUrl(currentUrl);
    }
  }, [currentUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      // Also update the form data with the file for upload
      onChange(selectedFile);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setFile(null);
    onChange("");
  };

  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="mt-2 space-y-2">
        <input
          type="file"
          name={fileName}
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {previewUrl && (
          <div className="flex items-center gap-4">
            <img src={previewUrl} alt="Preview" className="size-20 rounded-lg object-cover border border-gray-200" />
            <button
              type="button"
              onClick={handleRemove}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </label>
  );
}

import { useEffect, useState } from "react";

interface KeyValueEditorProps {
  name: string;
  label: string;
  value?: Record<string, unknown> | null;
  keyPlaceholder: string;
  valuePlaceholder: string;
  className?: string;
}

export function KeyValueEditor({ name, label, value, keyPlaceholder, valuePlaceholder, className }: KeyValueEditorProps) {
  const { value: formValue, onChange: handleChange } = useFormField(name);
  const [pairs, setPairs] = useState<Array<{ key: string; value: string }>>([]);

  useEffect(() => {
    const source = value || (typeof formValue === "object" && formValue !== null ? formValue : {});
    if (typeof source === "object" && source !== null) {
      setPairs(Object.entries(source).map(([k, v]) => ({ key: k, value: String(v) })));
    } else {
      setPairs([]);
    }
  }, [value, formValue]);

  const updatePairs = (newPairs: Array<{ key: string; value: string }>) => {
    setPairs(newPairs);
    const obj = Object.fromEntries(newPairs.filter((p) => p.key.trim()).map((p) => [p.key.trim(), p.value]));
    handleChange(obj);
  };

  const handleKeyChange = (index: number, key: string) => {
    const newPairs = [...pairs];
    newPairs[index] = { ...newPairs[index], key };
    updatePairs(newPairs);
  };

  const handleValueChange = (index: number, value: string) => {
    const newPairs = [...pairs];
    newPairs[index] = { ...newPairs[index], value };
    updatePairs(newPairs);
  };

  const addPair = () => {
    updatePairs([...pairs, { key: "", value: "" }]);
  };

  const removePair = (index: number) => {
    updatePairs(pairs.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="block">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className="mt-2 space-y-2">
          {pairs.map((pair, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={pair.key}
                onChange={(e) => handleKeyChange(index, e.target.value)}
                placeholder={keyPlaceholder}
                className="flex-1 rounded-md border-gray-300"
              />
              <input
                type="text"
                value={pair.value}
                onChange={(e) => handleValueChange(index, e.target.value)}
                placeholder={valuePlaceholder}
                className="flex-1 rounded-md border-gray-300"
              />
              <button
                type="button"
                onClick={() => removePair(index)}
                className="p-2 text-red-600 hover:text-red-800"
                aria-label="Remove"
              >
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button type="button" onClick={addPair} className="text-sm text-blue-600 hover:text-blue-800">
            + Add
          </button>
        </div>
      </label>
    </div>
  );
}
