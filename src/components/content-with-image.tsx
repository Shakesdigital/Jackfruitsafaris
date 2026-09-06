/* eslint-disable @next/next/no-img-element */
import { CmsRichText } from "@/components/cms-rich-text";
import type { ImageAlignment } from "@/lib/content";

/**
 * Renders a text body with an optional related image positioned left,
 * right, or center. When no image is provided or alignment is null,
 * only the body text renders — so content stays intact without a CMS image.
 */
type ContentWithImageProps = {
  /** HTML or plain text body content */
  body: string;
  /** Image URL (optional) */
  imageUrl?: string | null;
  /** Image alignment relative to the body text */
  alignment?: ImageAlignment;
  /** Alt text for the image (for accessibility) */
  altText?: string;
  /** Extra classes for the wrapper */
  className?: string;
};

export function ContentWithImage({
  body,
  imageUrl,
  alignment = null,
  altText = "",
  className = "",
}: ContentWithImageProps) {
  const hasImage = Boolean(imageUrl);

  // No image — render body text alone
  if (!hasImage || alignment === null) {
    return (
      <CmsRichText
        className={`text-fluid-lg leading-fluid-relaxed text-[var(--brand-muted-text)] ${className}`}
        html={body}
      />
    );
  }

  const sharedImgClasses =
    "w-full h-auto rounded-[var(--brand-radius)] object-cover shadow-sm border border-black/5";

  const bodyCol = (
    <CmsRichText
      className="text-fluid-lg leading-fluid-relaxed text-[var(--brand-muted-text)]"
      html={body}
    />
  );

  const imgElement = (
    <img
      src={imageUrl!}
      alt={altText}
      className={sharedImgClasses}
      loading="lazy"
      decoding="async"
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  );

  if (alignment === "center") {
    // Image full-width above text
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="mx-auto max-w-4xl">{imgElement}</div>
        {bodyCol}
      </div>
    );
  }

  // left or right: two-column grid
  // left  → image col is first, text col is second
  // right → text col is first, image col is second
  const isLeft = alignment === "left";

  return (
    <div
      className={`grid gap-5 sm:gap-6 md:gap-8 items-start lg:grid-cols-2 ${className}`}
    >
      {isLeft && imgElement}
      {bodyCol}
      {!isLeft && imgElement}
    </div>
  );
}
