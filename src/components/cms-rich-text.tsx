const allowedTags = new Set([
  "p",
  "div",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "ul",
  "ol",
  "li",
]);

function sanitizeCmsHtml(value: string) {
  return value.replace(
    /<(\/?)([a-z0-9-]+)(?:\s[^>]*)?>/gi,
    (_match, closing: string, tagName: string) => {
      const tag = tagName.toLowerCase();
      return allowedTags.has(tag) ? `<${closing}${tag}>` : "";
    },
  );
}

export function CmsRichText({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(html) }}
    />
  );
}
