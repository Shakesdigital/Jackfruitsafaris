"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Minimal top-loading progress bar that shows whenever navigation starts.
// Uses Next.js routing events to track progress, with a fallback timeout
// for slow navigations so users always see movement.
export function LoadingBar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleStart = () => {
      setLoading(true);
    };

    const handleComplete = () => {
      timeoutId = setTimeout(() => setLoading(false), 800);
    };

    // Next.js uses pushState for link clicks; listen for anchor clicks that
    // trigger a client-side navigation.
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement)?.closest("a[href]");
      if (anchor && !e.defaultPrevented && !isModifiedClick(e)) {
        const href = anchor.getAttribute("href");
        if (href && !href.startsWith("#") && !href.startsWith("mailto:") && !href.startsWith("tel:")) {
          handleStart();
        }
      }
    }

    function isModifiedClick(e: MouseEvent) {
      return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
    }

    // When the pathname changes, navigation completed (or this is initial load).
    handleComplete();

    document.addEventListener("click", handleClick, true);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClick, true);
    };
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 overflow-hidden bg-gray-100/50">
      <div className="h-full w-1/2 animate-loading-bar bg-[var(--brand-accent)]" />
    </div>
  );
}
