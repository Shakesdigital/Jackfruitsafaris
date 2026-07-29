"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin CMS render error", error);
  }, [error]);

  return (
    <div className="max-w-3xl rounded-lg border border-red-200 bg-red-50 p-6">
      <h1 className="text-xl font-semibold text-red-950">
        This CMS tab could not be loaded
      </h1>
      <p className="mt-3 text-sm leading-6 text-red-900">
        The admin page hit a server render error. I have added safer Supabase
        record loading for the main CMS edit tabs, but this boundary keeps the
        dashboard usable if another tab still has a hidden production-only
        error.
      </p>
      {error.digest && (
        <p className="mt-3 font-mono text-xs text-red-800">
          Digest: {error.digest}
        </p>
      )}
      <button
        type="button"
        onClick={reset}
        className="mt-5 rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
      >
        Try again
      </button>
    </div>
  );
}
