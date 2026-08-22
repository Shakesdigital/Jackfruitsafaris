-- Seed gallery_media linked to experiences so the experience detail sidebar
-- gallery has curated photos and a sample video to showcase.
-- Uses known-good Unsplash photos already referenced by the project and a
-- sample video URL (replace via the gallery admin if a different video is wanted).

INSERT INTO public.gallery_media
  (experience_id, media_url, media_type, alt_text, caption, photographer, order_column, permission_status, status)
SELECT
  exp.id,
  seed.media_url,
  seed.media_type,
  seed.alt_text,
  seed.caption,
  seed.photographer,
  seed.order_column,
  'approved',
  'published'
FROM public.experiences exp
JOIN (
  VALUES
    -- Gorilla Trekking (gorilla-trekking) - Bwindi / Mgahinga mountain gorillas
    ('gorilla-trekking',
      'https://images.unsplash.com/photo-1549366021-9f761d040a94?auto=format&fit=crop&w=1600&q=82',
      'image',
      'Silverback gorilla family in Bwindi mist',
      'A silverback rests with his family in the dense Bwindi forest.',
      'Jackfruit Safaris', 1),
    ('gorilla-trekking',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=82',
      'image',
      'Forest canopy trail to the gorilla family',
      'Through the misty canopy toward the habituated gorilla group.',
      'Jackfruit Safaris', 2),
    ('gorilla-trekking',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=82',
      'image',
      'Group trekking through the fern-lined trail',
      'Travelers follow ranger-guided trails toward the gorilla sector.',
      'Jackfruit Safaris', 3),
    ('gorilla-trekking',
      'https://www.w3schools.com/html/movie.mp4',
      'video',
      'Gorilla trekking in Bwindi National Park',
      'A short sample of what a mountain gorilla encounter feels like. Replace with your own footage via the gallery admin.',
      NULL, 4),

    -- Jinja Activities & Nile Adventures (jinja-adventures)
    ('jinja-adventures',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=82',
      'image',
      'White water rafting on the Nile near Jinja',
      'Rafting through the powerful rapids where the Nile begins.',
      'Jackfruit Safaris', 1),
    ('jinja-adventures',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=82',
      'image',
      'Sunrise over the Source of the Nile',
      'The calm pool where the River Nile begins its journey north.',
      'Jackfruit Safaris', 2),
    ('jinja-adventures',
      'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1600&q=82',
      'image',
      'Village cycling through Ugandan highlands',
      'Pedal past farms, trading centers, and traditional homesteads.',
      'Jackfruit Safaris', 3),
    ('jinja-adventures',
      'https://www.w3schools.com/html/mov_bbb.mp4',
      'video',
      'Jinja Source of the Nile activities',
      'A short sample of Jinja adventure activities. Replace with your own footage via the gallery admin.',
      NULL, 4),

    -- Cultural Experiences (cultural-experiences)
    ('cultural-experiences',
      'https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&w=1600&q=82',
      'image',
      'Traditional homestead in the Ugandan highlands',
      'Homegrown meals and community walks near Bwindi.',
      'Jackfruit Safaris', 1),
    ('cultural-experiences',
      'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1600&q=82',
      'image',
      'Local craft market stall',
      'Hand-carved souvenirs and local crafts in a Jinja market.',
      'Jackfruit Safaris', 2),
    ('cultural-experiences',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=82',
      'image',
      'Community guide sharing storytelling',
      'Elder community guides share traditions and conservation stories.',
      'Jackfruit Safaris', 3),
    ('cultural-experiences',
      'https://www.w3schools.com/html/movie.mp4',
      'video',
      'Cultural experiences with local communities',
      'A short sample of community-based cultural encounters. Replace with your own footage via the gallery admin.',
      NULL, 4),

    -- Wildlife Safaris (wildlife-safaris) - Murchison, Queen Elizabeth, savannah
    ('wildlife-safaris',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=82',
      'image',
      'Savannah wildlife crossing',
      'Elephants, giraffes, and buffalo across the Ugandan savannah.',
      'Jackfruit Safaris', 1),
    ('wildlife-safaris',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=82',
      'image',
      'Nile boat cruise at Murchison Falls',
      'Approaching the thunderous Murchison Falls by boat.',
      'Jackfruit Safaris', 2),
    ('wildlife-safaris',
      'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1600&q=82',
      'image',
      'Elephants at a waterhole',
      'A herd of elephants drinking during a morning game drive.',
      'Jackfruit Safaris', 3),
    ('wildlife-safaris',
      'https://www.w3schools.com/html/mov_bbb.mp4',
      'video',
      'Wildlife safari game drive highlights',
      'A short sample of savannah wildlife from a private game drive. Replace with your own footage via the gallery admin.',
      NULL, 4)
  ) AS seed(slug, media_url, media_type, alt_text, caption, photographer, order_column)
WHERE exp.slug = seed.slug
  AND NOT EXISTS (
    SELECT 1 FROM public.gallery_media gm
    WHERE gm.experience_id = exp.id
      AND gm.media_url = seed.media_url
  );
