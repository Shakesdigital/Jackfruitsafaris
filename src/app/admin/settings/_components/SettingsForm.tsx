"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const STORAGE_KEY = "jackfruit-admin-settings-draft";

interface SettingsFormProps {
  initialSettings: Record<string, unknown>;
  action: (formData: FormData) => Promise<void>;
  children: React.ReactNode;
}

export function SettingsForm({ initialSettings, action, children }: SettingsFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(searchParams.get("success") || null);
  const initializedRef = useRef(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    try {
      const draft = localStorage.getItem(STORAGE_KEY);
      if (draft) {
        const parsed = JSON.parse(draft);
        // Merge draft with initial settings (draft takes precedence)
        setFormData({ ...initialSettings, ...parsed });
      } else {
        setFormData(initialSettings);
      }
    } catch {
      setFormData(initialSettings);
    }
  }, [initialSettings]);

  // Save to localStorage on change
  useEffect(() => {
    if (!initializedRef.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch {
      // Ignore storage errors
    }
  }, [formData]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formDataToSubmit = new FormData(event.currentTarget);
      await action(formDataToSubmit);
      // If we get here without redirect, clear draft
      localStorage.removeItem(STORAGE_KEY);
      setSuccess("Settings saved successfully!");
      router.refresh();
    } catch (err) {
      if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) {
        // This is a redirect from the server action - clear draft
        localStorage.removeItem(STORAGE_KEY);
        throw err; // Re-throw to let Next.js handle redirect
      }
      setError(err instanceof Error ? err.message : "Failed to save settings");
      setIsSubmitting(false);
    }
  };

  const handleClearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData(initialSettings);
    setSuccess("Draft cleared. Form reset to saved settings.");
  };

  const hasDraft = () => {
    try {
      return !!localStorage.getItem(STORAGE_KEY);
    } catch {
      return false;
    }
  };

  const getValue = (name: string) => {
    const val = formData[name];
    if (val === null || val === undefined) return "";
    if (typeof val === "object") return JSON.stringify(val, null, 2);
    return String(val);
  };

  const handleChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6" encType="multipart/form-data">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 flex items-center justify-between">
          {success}
          {hasDraft() && (
            <button
              type="button"
              onClick={handleClearDraft}
              className="text-xs text-green-700 underline hover:text-green-900"
            >
              Clear draft notice
            </button>
          )}
        </div>
      )}

      {hasDraft() && !success && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 flex items-center justify-between">
          <span>You have unsaved changes from a previous session.</span>
          <button
            type="button"
            onClick={handleClearDraft}
            className="text-xs text-blue-700 underline hover:text-blue-900"
          >
            Discard draft
          </button>
        </div>
      )}

      <input type="hidden" name="id" value={String(formData.id || initialSettings.id || "")} />

      <SettingsFormContext.Provider value={{ formData, getValue, handleChange }}>
        {children}
      </SettingsFormContext.Provider>
    </form>
  );
}

// Context for form fields
const SettingsFormContext = React.createContext<{
  formData: Record<string, unknown>;
  getValue: (name: string) => string;
  handleChange: (name: string, value: unknown) => void;
} | null>(null);

export function useFormField(name: string) {
  const context = React.useContext(SettingsFormContext);
  if (!context) {
    throw new Error("useFormField must be used within SettingsForm");
  }
  const { getValue, handleChange } = context;
  return {
    value: getValue(name),
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { type } = event.target;
      let parsedValue: unknown = event.target.value;

      if (type === "checkbox") {
        parsedValue = (event.target as HTMLInputElement).checked;
      } else if (name === "nav_items" || name === "social_links" || name === "seo" || name === "integrations") {
        try {
          parsedValue = JSON.parse(event.target.value);
        } catch {
          parsedValue = event.target.value;
        }
      }

      handleChange(name, parsedValue);
    },
  };
}