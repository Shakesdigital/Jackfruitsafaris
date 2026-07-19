create table public.media_metadata (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  bucket_name text not null default 'cms-media',
  alt_text text,
  caption text,
  photographer text,
  media_type text not null default 'image',
  content_status public.content_status not null default 'published',
  permission_status text not null default 'approved',
  entity_type text not null,
  entity_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index media_entity_idx on public.media_metadata(entity_type, entity_id);
create index media_status_idx on public.media_metadata(content_status, permission_status);