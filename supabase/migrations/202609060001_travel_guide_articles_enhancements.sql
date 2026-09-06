-- Travel Guide Insights: extend travel_guide_articles with columns needed for a
-- blog-style CMS.  Uses IF NOT EXISTS / coalesce so it is safe to re-run.

alter table public.travel_guide_articles add column if not exists featured_image_url text;
alter table public.travel_guide_articles add column if not exists order_column int not null default 0;

-- Backfill articles that were created before this column existed so the
-- public page has a stable, deterministic ordering.
do $$
declare
  r record;
  i int := 0;
begin
  for r in
    select id from public.travel_guide_articles
    where order_column = 0
    order by created_at nulls last, id
  loop
    i := i + 1;
    update public.travel_guide_articles
    set order_column = i
    where id = r.id;
  end loop;
end $$;

create index if not exists travel_guide_articles_order_idx on public.travel_guide_articles(order_column);
create index if not exists travel_guide_articles_status_published_idx on public.travel_guide_articles(status, published_at desc);
