"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global render error:", error, error.digest);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Error - Jackfruit Safaris</title>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var errorData = ${JSON.stringify({
                    message: error.message,
                    stack: error.stack,
                    digest: error.digest,
                    name: error.name,
                  })};
                  console.error("Global Error Captured:", errorData);
                  // Store in localStorage for debugging
                  localStorage.setItem("last_render_error", JSON.stringify(errorData));
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-2xl w-full">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <h1 className="text-xl font-semibold text-red-950">
              This page couldn't load
            </h1>
            <p className="mt-3 text-sm leading-6 text-red-900">
              A server render error occurred. Details below:
            </p>
            {error.digest && (
              <p className="mt-3 font-mono text-xs text-red-800 break-all">
                Digest: {error.digest}
              </p>
            )}
            {error.message && (
              <pre className="mt-3 text-xs text-red-700 bg-red-100 p-3 rounded overflow-auto whitespace-pre-wrap max-h-64">
                {error.message}
              </pre>
            )}
            <button
              type="button"
              onClick={reset}
              className="mt-5 rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}