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
  "h1",
  "h2",
  "h3",
  "hr",
  "img",
  "a",
]);

// Void elements that have no closing tag
const voidElements = new Set(["br", "hr", "img"]);

// Safe attributes allowed per tag — everything else is stripped so that
// content coming from the admin WYSIWYG editor cannot inject scripts.
const safeAttributes: Record<string, Set<string>> = {
  img: new Set(["src", "alt", "width", "height"]),
  a: new Set(["href", "target", "rel"]),
};

/**
 * Strip a single tag's attributes down to only those whitelisted for that tag.
 * Returns the cleaned attribute string (e.g. `src="..." alt="..."`).
 */
function filterAttributes(tagName: string, rawAttrs: string): string {
  const allowed = safeAttributes[tagName.toLowerCase()];
  if (!allowed) return "";

  // Match each attribute pair: name="value", name='value', or name=value
  const attrRegex = /([\w-]+)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
  const keep: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = attrRegex.exec(rawAttrs)) !== null) {
    const name = match[1].toLowerCase();
    if (allowed.has(name)) {
      keep.push(match[0]);
    }
  }

  return keep.length ? ` ${keep.join(" ")}` : "";
}

/**
 * Lightweight, safe HTML sanitizer for CMS-managed rich-text content.
 *
 * Allows a whitelist of structural tags (paragraphs, lists, formatting) and,
 * for blog-style content, images (with `src`/`alt`) and links (with `href`).
 * Disallowed tags are unwrapped — their text content is preserved — while any
 * attribute not on the per-tag whitelist is removed.
 */
function sanitizeCmsHtml(value: string) {
  if (!value) return "";
  return value.replace(
    /<(\/?)([a-z0-9-]+)([^>]*)>/gi,
    (_match, closing: string, tagName: string, attrs: string) => {
      const tag = tagName.toLowerCase();

      if (!allowedTags.has(tag)) {
        // Disallowed tag: unwrap it so inner text survives
        return "";
      }

      // Void elements never get a closing tag
      if (voidElements.has(tag)) {
        const safeAttrs = filterAttributes(tag, attrs || "");
        return `<${tag}${safeAttrs} />`;
      }

      return `<${closing}${tag}${filterAttributes(tag, attrs || "")}>`;
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
