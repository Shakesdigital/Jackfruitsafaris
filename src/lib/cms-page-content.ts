export type CmsPageContentSection = {
  id?: string;
  page_slug: string;
  section_key: string;
  section_type: string;
  title?: string | null;
  subtitle?: string | null;
  content?: Record<string, unknown> | null;
  order_index?: number;
  status?: string;
};

export function getPageSection(
  sections: CmsPageContentSection[],
  sectionKey: string,
) {
  return sections.find((section) => section.section_key === sectionKey);
}

export function getSectionText(
  section: CmsPageContentSection | undefined,
  key: string,
  fallback: string,
) {
  const value = section?.content?.[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

export function getSectionStringList(
  section: CmsPageContentSection | undefined,
  key: string,
  fallback: string[],
) {
  const value = section?.content?.[key];
  if (!Array.isArray(value)) return fallback;

  const items = value.filter(
    (item): item is string => typeof item === "string" && Boolean(item.trim()),
  );
  return items.length ? items : fallback;
}

export function getSectionObjectList<T extends Record<string, unknown>>(
  section: CmsPageContentSection | undefined,
  key: string,
  fallback: T[],
) {
  const value = section?.content?.[key];
  if (!Array.isArray(value)) return fallback;

  const items = value.filter(
    (item): item is T => Boolean(item) && typeof item === "object" && !Array.isArray(item),
  );
  return items.length ? items : fallback;
}

export function getSectionLink(
  section: CmsPageContentSection | undefined,
  key: string,
  fallback: string,
) {
  const value = getSectionText(section, key, fallback);
  return value.startsWith("/") || value.startsWith("http://") || value.startsWith("https://")
    ? value
    : fallback;
}
