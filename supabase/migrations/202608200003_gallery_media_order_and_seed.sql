-- Add order_column to gallery_media for proper image ordering
-- and seed related safari image galleries for existing safari packages.

-- Add order_column for image ordering
ALTER TABLE public.gallery_media ADD COLUMN IF NOT EXISTS order_column int not null default 0;
CREATE INDEX IF NOT EXISTS gallery_media_order_idx ON public.gallery_media(order_column);

-- Seed gallery media for each safari package (only insert if not already present)
INSERT INTO public.gallery_media (safari_package_id, media_url, media_type, alt_text, caption, order_column, permission_status, status)
SELECT
  sp.id,
  seed.media_url,
  'image',
  seed.alt_text,
  seed.caption,
  seed.order_column,
  'approved',
  'published'
FROM public.safari_packages sp
JOIN (
  VALUES
  -- Gorilla Tracking Safari (3-days-gorilla-tracking)
  ('3-days-gorilla-tracking', 'https://images.unsplash.com/photo-1549366021-9f761d040a94?auto=format&fit=crop&w=1600&q=82', 'Close-up of mountain gorillas in Bwindi mist', 'A silverback gorilla family in the dense Bwindi forest', 1),
  ('3-days-gorilla-tracking', 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=82', 'Bwindi Impenetrable Forest canopy', 'Through the misty forest canopy toward the gorilla family', 2),
  ('3-days-gorilla-tracking', 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1600&q=82', 'Uganda highlands landscape', 'Rolling hills and tea plantations on the drive to Bwindi', 3),
  ('3-days-gorilla-tracking', 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=82', 'Private 4x4 safari vehicle', 'Our private 4x4 Land Cruiser ready for the journey', 4),

  -- Murchison Falls Safari (3-days-murchison-falls)
  ('3-days-murchison-falls', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=82', 'Nile boat cruise at Murchison Falls', 'Approaching the thunderous Murchison Falls by boat', 1),
  ('3-days-murchison-falls', 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1600&q=82', 'Murchison Falls thundering over rocks', 'The dramatic cascade where the Nile explodes through the gorge', 2),
  ('3-days-murchison-falls', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=82', 'Savannah wildlife in Murchison', 'Elephants and giraffes on the savannah plains', 3),
  ('3-days-murchison-falls', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=82', 'Lake Albert from the falls viewpoint', 'Lake Albert visible from the Top of the Falls trail', 4),

  -- 10 Days Uganda Safari (10-days-uganda-safari)
  ('10-days-uganda-safari', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=82', 'Savannah wildlife crossing', 'Elephants, giraffes, and buffalo across the Ugandan savannah', 1),
  ('10-days-uganda-safari', 'https://images.unsplash.com/photo-1549366021-9f761d040a94?auto=format&fit=crop&w=1600&q=82', 'Mountain gorilla family', 'Silverback gorillas in Bwindi Impenetrable National Park', 2),
  ('10-days-uganda-safari', 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1600&q=82', 'Murchison Falls cascade', 'The powerful waterfall on the Albert Nile', 3),
  ('10-days-uganda-safari', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=82', 'Lake Bunyonyi terraces', 'The stunning crater lake with surrounding hills', 4),
  ('10-days-uganda-safari', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=82', 'Kazinga Channel boat cruise', 'Hippos and birds on the Kazinga Channel', 5),

  -- Custom Uganda Safari (custom-uganda-safari)
  ('custom-uganda-safari', 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=82', 'Custom 4x4 safari vehicle', 'Fully equipped safari Land Cruiser ready for any Uganda route', 1),
  ('custom-uganda-safari', 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&w=1600&q=82', 'Ugandan highlands village', 'Traditional homesteads in the rolling Ugandan highlands', 2),
  ('custom-uganda-safari', 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=82', 'Bwindi rainforest trail', 'Guided trek through the misty Bwindi forest', 3),
  ('custom-uganda-safari', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=82', 'Savannah sunset game drive', 'Sunset over the savannah during a private game drive', 4),
  ('custom-uganda-safari', 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1600&q=82', 'Waterfall and crater lake', 'Aerial view of Uganda crater lakes and waterfalls', 5)
) AS seed(slug, media_url, alt_text, caption, order_column)
WHERE sp.slug = seed.slug
  AND NOT EXISTS (
    SELECT 1 FROM public.gallery_media gm
    WHERE gm.safari_package_id = sp.id
      AND gm.media_url = seed.media_url
  );
