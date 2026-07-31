-- Keep CMS-managed content from drifting back to starter values.
-- site_settings is intended to be a singleton. Older rows are archived before
-- enforcing that shape so accidental duplicate inserts cannot become the
-- newest public settings source.

create table if not exists public.site_settings_archive (
  id uuid primary key default gen_random_uuid(),
  original_id uuid,
  archived_payload jsonb not null,
  archived_at timestamptz not null default now(),
  reason text not null default 'duplicate site_settings row'
);

alter table public.site_settings_archive enable row level security;

with ranked_settings as (
  select
    id,
    to_jsonb(public.site_settings.*) as payload,
    row_number() over (
      order by updated_at desc nulls last, created_at desc nulls last, id desc
    ) as row_number
  from public.site_settings
)
insert into public.site_settings_archive (original_id, archived_payload)
select id, payload
from ranked_settings
where row_number > 1
on conflict do nothing;

with ranked_settings as (
  select
    id,
    row_number() over (
      order by updated_at desc nulls last, created_at desc nulls last, id desc
    ) as row_number
  from public.site_settings
)
delete from public.site_settings
where id in (
  select id
  from ranked_settings
  where row_number > 1
);

create unique index if not exists site_settings_singleton_idx
  on public.site_settings ((true));

create or replace function public.get_public_site_settings()
returns jsonb
language sql
volatile
security definer
set search_path = public
as $$
  select coalesce(
    (
      select to_jsonb(settings_row) - 'integrations'
      from public.site_settings as settings_row
      order by settings_row.updated_at desc nulls last,
               settings_row.created_at desc nulls last,
               settings_row.id desc
      limit 1
    ),
    '{}'::jsonb
  );
$$;

revoke all on function public.get_public_site_settings() from public;
grant execute on function public.get_public_site_settings() to anon, authenticated;

notify pgrst, 'reload schema';
