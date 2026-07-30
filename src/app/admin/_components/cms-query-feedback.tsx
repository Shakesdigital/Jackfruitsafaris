"use client";

import { useSearchParams } from "next/navigation";

export function CmsQueryFeedback() {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");
  const success = searchParams?.get("success");

  if (!error && !success) return null;

  return (
    <div
      role={error ? "alert" : "status"}
      className={`mb-6 rounded-lg border px-4 py-3 text-sm font-medium ${
        error
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-green-200 bg-green-50 text-green-800"
      }`}
    >
      {error || success}
    </div>
  );
}
