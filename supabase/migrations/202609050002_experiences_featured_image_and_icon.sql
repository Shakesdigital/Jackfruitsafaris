-- Add featured_image_url and icon columns to the experiences table.
-- The frontend and admin form have always expected these columns, but the
-- base schema (202606270001) never included them — only gallery JSONB and
-- meta_image_url existed.  This brings the table in line with the
-- destinations / safari_packages convention of having a dedicated
-- featured_image_url text column.

alter table public.experiences
  add column if not exists featured_image_url text,
  add column if not exists icon text check (icon in ('binoculars','calendar','camera','car','cash','compass','heart','map','message','mountain','shield','sparkles','star','trees','waves'));

-- Backfill icon from content.ts fallback values for existing rows by slug.
-- (The seed data in the migrations does not yet populate icon; this is a
--  no-op when no rows match — the admin UI can set the icon going forward.)
update public.experiences
set icon = case
  when slug = 'gorilla-trekking'      then 'trees'
  when slug = 'jinja-adventures'      then 'waves'
  when slug = 'cultural-experiences'   then 'heart'
  when slug = 'wildlife-safaris'       then 'binoculars'
  else icon
end
where icon is null;

-- Re-assert the realtime + refresh-event trigger on experiences if the
-- base migration didn't add them (idempotent).
drop trigger if exists cms_emit_refresh_event on public.experiences;
create trigger cms_emit_refresh_event
  after insert or update or delete on public.experiences
  for each statement execute function public.emit_cms_refresh_event();
