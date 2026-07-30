-- Create the CMS media storage bucket used by admin image uploads.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cms-media',
  'cms-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public read cms media" on storage.objects;
drop policy if exists "authenticated upload cms media" on storage.objects;
drop policy if exists "authenticated update cms media" on storage.objects;
drop policy if exists "authenticated delete cms media" on storage.objects;

create policy "public read cms media" on storage.objects
  for select using (bucket_id = 'cms-media');

create policy "authenticated upload cms media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'cms-media');

create policy "authenticated update cms media" on storage.objects
  for update to authenticated
  using (bucket_id = 'cms-media')
  with check (bucket_id = 'cms-media');

create policy "authenticated delete cms media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'cms-media');
