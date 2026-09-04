-- Migration: Add image-aware content columns to safari_packages
-- Supports per-highlight images with alignment, arbitrary page sections with images,
-- and itinerary day images (itinerary is already JSONB — just needs fields in the form).

-- 1. Add new JSONB columns to safari_packages
alter table public.safari_packages
  add column if not exists highlights_content jsonb not null default '[]'::jsonb,
  add column if not exists page_sections jsonb not null default '[]'::jsonb;

-- 2. Backfill highlights_content from the existing text[] highlights column.
--    Each existing highlight string becomes an object with text only (no image).
--    This preserves existing data so the frontend can use highlights_content
--    as the source of truth while still rendering the text content.
update public.safari_packages
set highlights_content = (
  select jsonb_agg(jsonb_build_object(
    'text', elem,
    'image_url', null,
    'image_alignment', null
  ))
  from unnest(highlights) as elem
)
where (highlights_content is null or highlights_content = '[]'::jsonb)
  and highlights is not null
  and array_length(highlights, 1) > 0;
