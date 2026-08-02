"use client";

import { useEffect, useState } from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [error, setError] = useState<Error | null>(null);
  const [errorInfo, setErrorInfo] = useState<React.ErrorInfo | null>(null);

  useEffect(() => {
    // Log error to console for debugging
    if (error) {
      console.error("ErrorBoundary caught:", error, errorInfo);
    }
  }, [error, errorInfo]);

  if (error) {
    if (fallback) {
      return fallback;
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <details className="text-left bg-gray-100 p-4 rounded text-sm">
            <summary className="font-medium mb-2">Error Details</summary>
            <pre className="whitespace-pre-wrap">{error.stack}</pre>
          </details>
          <button
            onClick={() => {
              setError(null);
              window.location.reload();
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return children;
}