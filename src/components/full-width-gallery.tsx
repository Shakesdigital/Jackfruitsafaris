/* eslint-disable @next/next/no-img-element */
import { Camera } from "lucide-react";
import type { GalleryImage } from "@/components/related-gallery";

/**
 * Full-width responsive image gallery displayed at the bottom of safari
 * detail pages. Renders all related gallery media in a responsive grid.
 * Each tile shows caption and photographer on hover.
 */
type FullWidthGalleryProps = {
  images: GalleryImage[];
  title?: string;
};

export function FullWidthGallery({ images, title = "Safari photo gallery" }: FullWidthGalleryProps) {
  if (!images.length) {
    return null;
  }

  const openInNewTab = (url: string) => {
    window.open(url, "_blank", "noopener,noref");
  };

  return (
    <section className="border-t border-black/5 py-10 sm:py-12">
      <div className="container-responsive">
        <h2 className="mb-6 text-fluid-2xl font-black text-[var(--foreground)]">
          {title}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => {
            const isImage = image.media_type === "image" || !image.media_type;
            return (
              <button
                key={image.id}
                type="button"
                onClick={() => isImage && openInNewTab(image.media_url)}
                aria-label={isImage ? `View full size: ${image.alt_text}` : image.alt_text || "Gallery item"}
                className="group relative overflow-hidden rounded-[var(--brand-radius)] border border-black/10 bg-[#eef7f0] text-left align-top focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
              >
                {isImage ? (
                  <img
                    src={image.media_url}
                    alt=""
                    className="h-36 w-full object-cover sm:h-40"
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                ) : (
                  <div className="flex h-36 w-full items-center justify-center bg-gray-100 sm:h-40">
                    <Camera size={28} className="text-gray-400" aria-hidden="true" />
                  </div>
                )}
                <div className="p-3">
                  {image.caption && (
                    <p className="text-fluid-sm font-bold leading-6 text-[var(--foreground)]">
                      {image.caption}
                    </p>
                  )}
                  {image.photographer && !image.caption && (
                    <p className="text-fluid-xs text-[var(--brand-muted-text)]">
                      Photo: {image.photographer}
                    </p>
                  )}
                </div>
                <div className="absolute inset-0 rounded-[var(--brand-radius)] bg-black/0 group-hover:bg-black/5 transition-colors duration-200" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
