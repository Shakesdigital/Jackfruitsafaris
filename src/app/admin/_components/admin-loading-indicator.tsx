"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function findAnchor(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;
  return target.closest("a[href]") as HTMLAnchorElement | null;
}

export function AdminLoadingIndicator() {
  const pathname = usePathname();
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoadingMessage(null);
  }, [pathname]);

  useEffect(() => {
    if (!loadingMessage) return;

    const timer = window.setTimeout(() => {
      setLoadingMessage(null);
    }, 30000);

    return () => window.clearTimeout(timer);
  }, [loadingMessage]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || isModifiedClick(event)) return;

      const submitButton = event.target instanceof Element
        ? event.target.closest("button[type='submit'], input[type='submit']") as HTMLElement | null
        : null;

      if (submitButton) {
        const text = submitButton.textContent?.trim().toLowerCase() || "";
        if (text.includes("delete")) return;
        setLoadingMessage(text.includes("save") ? "Saving content..." : "Working...");
        return;
      }

      const anchor = findAnchor(event.target);
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      const text = anchor.textContent?.trim().toLowerCase() || "";
      const action = text.includes("cancel") || text.includes("close")
        ? "Closing editor..."
        : text.includes("edit") || text.includes("open") || text.includes("new") || text.includes("create")
          ? "Opening content..."
          : "Loading...";
      setLoadingMessage(action);
    }

    function handleSubmit(event: SubmitEvent) {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      if (!form.checkValidity()) return;

      const submitter = event.submitter instanceof HTMLElement ? event.submitter : null;
      const text = submitter?.textContent?.trim().toLowerCase() || "";
      setLoadingMessage(text.includes("delete") ? "Deleting content..." : "Saving content...");
    }

    function handleInvalid() {
      setLoadingMessage(null);
    }

    function handleBeforeUnload() {
      setLoadingMessage("Loading...");
    }

    document.addEventListener("click", handleClick, true);
    document.addEventListener("submit", handleSubmit, true);
    document.addEventListener("invalid", handleInvalid, true);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("submit", handleSubmit, true);
      document.removeEventListener("invalid", handleInvalid, true);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  if (!loadingMessage) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[9999]">
      <div className="h-1 overflow-hidden bg-blue-100">
        <div className="h-full w-1/2 animate-pulse bg-blue-600" />
      </div>
      <div className="pointer-events-none fixed inset-0 flex items-start justify-center bg-gray-900/15 px-4 pt-6">
        <div className="flex items-center gap-3 rounded-full bg-white px-4 py-3 text-sm font-semibold text-gray-800 shadow-lg ring-1 ring-black/10">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          {loadingMessage}
        </div>
      </div>
    </div>
  );
}
