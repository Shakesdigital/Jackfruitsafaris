"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";

export type GalleryImage = {
  id: string;
  media_url: string;
  media_type: string;
  alt_text: string;
  caption?: string | null;
  order_column?: number;
  photographer?: string | null;
};

type RelatedGalleryProps = {
  images: GalleryImage[];
  safariTitle?: string;
};

/**
 * Safari Film Strip Gallery
 *
 * A distinctive gallery UI featuring a prominent hero image card surrounded
 * by a horizontal scroll of circular thumbnails with snap-scrolling.
 * Inspired by vintage safari contact sheets and 35mm film strips.
 */
export function RelatedGallery({ images, safariTitle }: RelatedGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Keyboard navigation between thumbnails
  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (!thumbRefs.current[activeIndex]) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((prev) => (prev + 1) % images.length);
        thumbRefs.current[(activeIndex + 1) % images.length]?.scrollIntoView({
          block: "center",
          inline: "nearest",
          behavior: "smooth",
        });
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
        thumbRefs.current[(activeIndex - 1 + images.length) % images.length]?.scrollIntoView({
          block: "center",
          inline: "nearest",
          behavior: "smooth",
        });
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [activeIndex, images.length]);

  if (!images.length) {
    return null;
  }

  const activeImage = images[activeIndex];

  return (
    <aside
      aria-label="Safari photo gallery"
      className="mt-8 border-t border-black/10 pt-8"
    >
      <header className="mb-5 flex items-center justify-between">
        <h2 className="text-fluid-lg font-black text-[var(--foreground)]">
          Related safari image gallery
        </h2>
        {safariTitle && (
          <span className="text-fluid-xs font-medium text-[var(--brand-muted-text)]">
            {activeIndex + 1} / {images.length}
          </span>
        )}
      </header>

      {/* Hero image card — the memorable signature element */}
      <div className="group relative">
        <div
          className="relative overflow-hidden rounded-[var(--brand-radius)] border border-black/10 bg-cover bg-center shadow-sm"
          style={{
            backgroundImage: `url(${activeImage.media_url})`,
            aspectRatio: "16/9",
          }}
          aria-label={activeImage.alt_text}
        />
        {/* Photo info overlay on hover */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="p-4">
            {activeImage.caption && (
              <p className="text-fluid-sm font-medium text-white/90">
                {activeImage.caption}
              </p>
            )}
            {activeImage.photographer && (
              <p className="text-fluid-xs text-white/60">
                Photo: {activeImage.photographer}
              </p>
            )}
          </div>
        </div>
        {/* Navigation arrows overlay on hero */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
              }
              aria-label="Previous image"
              className="absolute top-1/2 -left-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/85 text-[var(--foreground)] opacity-0 shadow-sm transition-all duration-200 hover:bg-white hover:shadow group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)] sm:-left-4"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
              aria-label="Next image"
              className="absolute top-1/2 -right-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/85 text-[var(--foreground)] opacity-0 shadow-sm transition-all duration-200 hover:bg-white hover:shadow group-hover:opacity-100 focus:opacity-100 focus:ring-2 focus:ring-[var(--brand-accent)] sm:-right-4"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail film strip — horizontal scroll with snap */}
      <div
        ref={trackRef}
        className="mt-3 flex gap-3 overflow-x-auto scroll-px-1 scroll-p-1 snap-x snap-mandatory [-webkit-scrollbar:_].scrollbar-thin scrollbar-thumb-[var(--brand-muted-text)]/30 scrollbar-track-transparent"
      >
        {images.map((image, index) => {
          const isActive = index === activeIndex;
          const isImage = image.media_type === "image";

          return (
            <button
              key={image.id}
              ref={(el) => {
                thumbRefs.current[index] = el;
              }}
              type="button"
              onClick={() => {
                setActiveIndex(index);
                // Ensure the active thumb is visible in the scroll track
                thumbRefs.current[index]?.scrollIntoView({
                  block: "center",
                  inline: "center",
                  behavior: "smooth",
                });
              }}
              aria-label={`View photo ${index + 1} of ${images.length}: ${image.alt_text}`}
              className={
                "relative flex shrink-0 flex-col items-center justify-start gap-1 " +
                "snap-start first:pl-1 last:pr-1 " +
                "outline-none transition-all duration-200"
              }
            >
              {/* Active ring accent */}
              <span
                className={
                  "flex size-16 items-center justify-center rounded-full border-2 " +
                  "bg-cover bg-center object-cover transition-all duration-200 " +
                  (isActive
                    ? "border-[var(--brand-accent)] ring-2 ring-[var(--brand-accent)]"
                    : "border-white hover:border-[var(--brand-accent)]")
                }
                style={{
                  backgroundImage: isImage ? `url(${image.media_url})` : undefined,
                  backgroundColor: isImage ? undefined : "var(--background)",
                  ...(isActive
                    ? { "--tw-ring-opacity": 0.2 }
                    : { "--tw-border-opacity": 0.6 }),
                }}
              >
                {!isImage && (
                  <Camera
                    size={16}
                    className="text-[var(--brand-muted-text)]"
                    aria-hidden="true"
                  />
                )}
                {/* Status dot for active image */}
                {isActive && (
                  <span className="absolute bottom-0 right-0 block size-2.5 rounded-full border-2 border-white bg-[var(--brand-accent)]" />
                )}
              </span>

              {/* Caption under active thumbnail */}
              {isActive && image.caption && (
                <span
                  className="block max-w-[120px] truncate text-center text-fluid-xs font-medium text-[var(--foreground)]"
                  title={image.caption}
                >
                  {image.caption}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
