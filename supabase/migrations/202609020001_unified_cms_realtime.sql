-- Unified CMS Realtime Publication
-- Ensures every CMS-managed table is in the supabase_realtime publication
-- so that the CmsLiveRefresh / CmsRealtimeProvider can subscribe and push
-- changes to the public frontend immediately after an admin save.
--
-- In a fresh Supabase project the publication `supabase_realtime` is created
-- automatically, but tables are NOT added to it by default.  Each table that
-- the public frontend subscribes to must be added explicitly.

do $$
declare
  t  text;
  tables text[] := array[
    'cms_refresh_events',
    'site_settings',
    'site_settings_archive',
    'menus',
    'menu_items',
    'pages',
    'page_heroes',
    'page_content_sections',
    'modules',
    'modulables',
    'safari_packages',
    'destinations',
    'experiences',
    'reviews',
    'gallery_media',
    'faqs',
    'partners',
    'accommodations',
    'transfer_services',
    'travel_guide_articles',
    'homepage_sections',
    'homepage_quick_links',
    'homepage_trust_items',
    'homepage_features',
    'homepage_guide_articles',
    'redirects',
    'inquiry_leads'
  ];
begin
  foreach t in array tables loop
    if to_regclass(format('public.%I', t)) is not null
      and not exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = t
      )
    then
      begin
        execute format('alter publication supabase_realtime add table public.%I', t);
      exception
        when duplicate_object then
          -- Table was added to the publication by another concurrent process.
          null;
      end;
    end if;
  end loop;
end
$$;

-- Re-assert the refresh-event trigger set so that any table added since the
-- original realtime migration also emits a cms_refresh_events row.
do $$
declare
  cms_table text;
  cms_tables text[] := array[
    'site_settings',
    'page_heroes',
    'page_content_sections',
    'pages',
    'safari_packages',
    'destinations',
    'experiences',
    'reviews',
    'homepage_sections',
    'homepage_quick_links',
    'homepage_trust_items',
    'homepage_features',
    'homepage_guide_articles',
    'gallery_media',
    'faqs',
    'partners',
    'menus',
    'menu_items',
    'travel_guide_articles',
    'redirects',
    'inquiry_leads'
  ];
begin
  foreach cms_table in array cms_tables loop
    if to_regclass(format('public.%I', cms_table)) is not null then
      execute format(
        'drop trigger if exists cms_emit_refresh_event on public.%I',
        cms_table
      );
      execute format(
        'create trigger cms_emit_refresh_event '
        || 'after insert or update or delete on public.%I '
        || 'for each statement execute function public.emit_cms_refresh_event()',
        cms_table
      );
    end if;
  end loop;
end
$$;
