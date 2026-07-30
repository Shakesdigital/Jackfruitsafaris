-- Older production databases may have page_heroes without the optional
-- extended content object used by the About page.
alter table public.page_heroes
  add column if not exists content jsonb not null default '{}'::jsonb;

-- Prompt PostgREST to refresh its schema cache immediately after this migration.
notify pgrst, 'reload schema';
