"use client";

import { useEffect, useRef, useState } from "react";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  Play,
  X,
} from "lucide-react";

export type GalleryMedia = {
  id: string;
  media_url: string;
  media_type: string;
  alt_text: string;
  caption?: string | null;
  photographer?: string | null;
  order_column?: number;
  created_at?: string;
};

export type ExperienceGalleryProps = {
  /** Ordered list of approved, published gallery media for an experience. */
  images: GalleryMedia[];
  /** Experience name, used for accessible labels and headings. */
  experienceTitle?: string;
};

const VIDEO_HOSTS = ["youtube.com", "youtu.be", "vimeo.com"];
const PREVIEW_COUNT = 8;

function isVideo(media: GalleryMedia): boolean {
  if (media.media_type === "video") return true;
  const url = (media.media_url || "").toLowerCase();
  if (VIDEO_HOSTS.some((host) => url.includes(host))) return true;
  return /\.((mp4|webm|ogg|ogv|mov|avi))(\?|$)/i.test(url);
}

function getYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return parsed.pathname.slice(1);
    if (host === "youtube.com" || host === "m.youtube.com") {
      const fromParam = parsed.searchParams.get("v");
      if (fromParam) return fromParam;
      const match = parsed.pathname.match(/\/(?:embed|shorts|v)\/([^/?#]+)/);
      if (match) return match[1];
    }
    return null;
  } catch {
    return null;
  }
}

function isDirectVideo(url: string): boolean {
  return /\.((mp4|webm|ogg|ogv|mov|avi))(\?|$)/i.test(url);
}

/**
 * ExperienceGallery
 * A modern, clean showcase of photos and videos from a past safari experience,
 * built for the sidebar column of an experience landing page.
 *
 * Interaction model:
 *  - A compact preview (thumbnail strip) lives in the sidebar.
 *  - "View full gallery" opens a modal grid of every photo/video.
 *  - Selecting any item opens a lightboxed viewer with prev/next and video support.
 */
export function ExperienceGallery({
  images,
  experienceTitle,
}: ExperienceGalleryProps) {
  const media = (images || []).slice().sort((a, b) => {
    const ao = a.order_column ?? 0;
    const bo = b.order_column ?? 0;
    return ao - bo || (a.created_at ?? "").localeCompare(b.created_at ?? "");
  });

  const [isGridOpen, setIsGridOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const openViewer = (index: number) => setActiveIndex(index);
  const closeViewer = () => setActiveIndex(null);

  const prev = () =>
    setActiveIndex((i) =>
      i === null ? null : (i - 1 + media.length) % media.length,
    );
  const next = () =>
    setActiveIndex((i) => (i === null ? null : (i + 1) % media.length));

  // Prevent background scroll while any overlay is open
  useEffect(() => {
    const open = isGridOpen || activeIndex !== null;
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isGridOpen, activeIndex]);

  // Lightbox keyboard navigation
  useEffect(() => {
    if (activeIndex === null) return;
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
      else if (e.key === "ArrowRight")
        setActiveIndex((i) => (i === null ? null : (i + 1) % media.length));
      else if (e.key === "ArrowLeft")
        setActiveIndex((i) =>
          i === null ? null : (i - 1 + media.length) % media.length,
        );
    };
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, [activeIndex, media.length]);

  if (!media.length) return null;

  return (
    <>
      <SidebarPreview
        media={media}
        experienceTitle={experienceTitle}
        onPreviewClick={(index, isMoreTile) => {
          if (isMoreTile) setIsGridOpen(true);
          else openViewer(index);
        }}
        onOpenGrid={() => setIsGridOpen(true)}
      />

      {isGridOpen && (
        <GridModal
          media={media}
          experienceTitle={experienceTitle}
          onClose={() => {
            setIsGridOpen(false);
            setActiveIndex(null);
          }}
          onOpenViewer={openViewer}
        />
      )}

      {activeIndex !== null && (
        <LightboxViewer
          media={media}
          index={activeIndex}
          experienceTitle={experienceTitle}
          onClose={closeViewer}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  );
}

type SidebarPreviewProps = {
  media: GalleryMedia[];
  experienceTitle?: string;
  onPreviewClick: (index: number, isMoreTile: boolean) => void;
  onOpenGrid: () => void;
};

function SidebarPreview({
  media,
  experienceTitle,
  onPreviewClick,
  onOpenGrid,
}: SidebarPreviewProps) {
  const visible = media.slice(0, PREVIEW_COUNT);
  const hiddenCount = media.length - visible.length;
  const hasMore = hiddenCount > 0;

  return (
    <aside
      aria-label={experienceTitle ? `${experienceTitle} gallery` : "Experience gallery"}
      className="rounded-[var(--brand-radius)] border border-black/10 bg-white p-5 shadow-sm"
    >
      <header className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-fluid-sm font-black text-[var(--foreground)]">
          <Camera size={16} aria-hidden="true" />
          Experience gallery
        </h2>
        <span className="text-fluid-xs font-medium text-[var(--brand-muted-text)]">
          {media.length} {media.length === 1 ? "photo" : "photos"}
        </span>
      </header>

      <ul className="grid grid-cols-3 gap-2">
        {media.slice(0, PREVIEW_COUNT).map((item, index) => {
          const video = isVideo(item);
          const isMoreTile = hasMore && index === visible.length - 1;

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onPreviewClick(index, isMoreTile)}
                aria-label={
                  isMoreTile
                    ? `View all ${media.length} photos`
                    : video
                      ? `View video ${index + 1} of ${media.length}`
                      : `View photo ${index + 1} of ${media.length}`
                }
                className="group relative aspect-square overflow-hidden rounded-[var(--brand-radius)] border border-black/5 bg-cover bg-center align-top transition-all duration-200 hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
                style={{
                  backgroundImage: video
                    ? undefined
                    : `url(${item.media_url})`,
                  backgroundColor: video ? "var(--background)" : undefined,
                }}
              >
                {video && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-[inherit] bg-black/35">
                    <Play size={18} className="text-white" aria-hidden="true" />
                  </span>
                )}

                {isMoreTile && hasMore && (
                  <span className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 rounded-[inherit] bg-black/55 text-white">
                    <Grid2X2 size={20} aria-hidden="true" />
                    <span className="text-xs font-medium">
                      +{hiddenCount} more
                    </span>
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={onOpenGrid}
        className="mt-4 btn-h-responsive inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-4 py-2.5 text-fluid-sm font-black text-white transition-colors hover:bg-[var(--brand-primary)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
      >
        <Grid2X2 size={16} aria-hidden="true" />
        View full gallery ({media.length})
      </button>
    </aside>
  );
}

type GridModalProps = {
  media: GalleryMedia[];
  experienceTitle?: string;
  onClose: () => void;
  onOpenViewer: (index: number) => void;
};

function GridModal({ media, experienceTitle, onClose, onOpenViewer }: GridModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      aria-label="Gallery grid"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 outline-none"
      onClick={(e) => e.target === backdropRef.current && onClose()}
    >
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[var(--brand-radius)] bg-[var(--brand-surface)] p-5 shadow-xl">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-fluid-lg font-black text-[var(--foreground)]">
            {experienceTitle
              ? `${experienceTitle} gallery`
              : "Experience gallery"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close gallery"
            className="flex size-9 items-center justify-center rounded-full border border-black/10 bg-white text-[var(--foreground)] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
          >
            <X size={18} />
          </button>
        </header>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {media.map((item, index) => {
            const video = isVideo(item);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onOpenViewer(index)}
                  aria-label={
                    video
                      ? `Open video ${index + 1}`
                      : `Open photo ${index + 1}`
                  }
                  className="group relative block aspect-video w-full cursor-zoom-in rounded-[var(--brand-radius)] border border-black/10 bg-cover bg-center shadow-sm transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
                  style={{
                    backgroundColor: video ? "var(--background)" : undefined,
                    backgroundImage: video ? undefined : `url(${item.media_url})`,
                  }}
                >
                  {video && (
                    <span className="absolute inset-0 flex items-center justify-center rounded-[inherit] bg-black/35">
                      <Play size={24} className="text-white drop-shadow" />
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 text-center text-fluid-xs text-[var(--brand-muted-text)]">
          {media.length} {media.length === 1 ? "item" : "items"} — tap any
          thumbnail to view full screen
        </p>
      </div>
    </div>
  );
}

type LightboxViewerProps = {
  media: GalleryMedia[];
  index: number;
  experienceTitle?: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

function LightboxViewer({
  media,
  index,
  experienceTitle,
  onClose,
  onPrev,
  onNext,
}: LightboxViewerProps) {
  const item = media[index];
  const video = isVideo(item);
  const youTubeId = video ? getYouTubeId(item.media_url) : null;
  const directVideo = video && isDirectVideo(item.media_url);
  const showArrows = media.length > 1;
  const backdropRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      aria-label="Media preview"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 outline-none"
      onClick={(e) => e.target === backdropRef.current && onClose()}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close preview"
        className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
      >
        <X size={20} />
      </button>

      {showArrows && (
        <>
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous media"
            className="absolute left-4 top-1/2 -translate-y-1/2 flex size-11 items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Next media"
            className="absolute right-4 top-1/2 -translate-y-1/2 flex size-11 items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      <div className="relative flex max-h-[85vh] max-w-[90vw] items-center justify-center">
        {video && directVideo ? (
          <video
            src={item.media_url}
            controls
            autoPlay
            playsInline
            className="max-h-[85vh] max-w-[90vw] rounded-[var(--brand-radius)]"
            aria-label={item.alt_text || item.caption || "Video"}
          />
        ) : video && youTubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${youTubeId}?autoplay=1&rel=0`}
            title={item.alt_text || "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-[60vh] w-[90vw] max-w-3xl rounded-[var(--brand-radius)]"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.media_url}
            alt={item.alt_text || ""}
            className="max-h-[85vh] max-w-[90vw] rounded-[var(--brand-radius)] object-contain"
            loading="lazy"
            draggable={false}
          />
        )}
      </div>

      <div className="absolute bottom-4 left-4 right-4 mx-auto max-w-2xl text-center text-white/80">
        {item.caption && <p className="text-sm">{item.caption}</p>}
        {item.photographer && (
          <p className="text-xs opacity-70">Photo: {item.photographer}</p>
        )}
        <p className="mt-1 text-[10px] opacity-50">
          {(index + 1)}/{media.length}
          {experienceTitle ? ` · ${experienceTitle}` : ""}
        </p>
      </div>
    </div>
  );
}
