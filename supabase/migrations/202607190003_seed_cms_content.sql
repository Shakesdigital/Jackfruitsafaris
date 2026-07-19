-- Seed site settings
insert into public.site_settings (
  business_name,
  contact_email,
  phone,
  alternate_phone,
  address,
  operating_hours,
  social_links,
  footer_copy
) values (
  'Jackfruit Safaris Uganda',
  'jackfruitsafarisuganda@gmail.com',
  '+256 772 550 268',
  '+256 752 550 268',
  'Craft Village, Jinja, Uganda',
  '9 AM - 5 PM, with WhatsApp support for travel inquiries',
  '{"tripadvisor": "https://tripadvisor.com", "facebook": "https://facebook.com"}'::jsonb,
  '© 2024 Jackfruit Safaris Uganda. All rights reserved.'
);

-- Seed destinations
insert into public.destinations (
  slug, name, region, overview, why_go, top_experiences, wildlife, best_time, recommended_nights, status, order_column
) values
('bwindi-impenetrable-national-park', 'Bwindi Impenetrable National Park', 'Southwestern Uganda',
 'Uganda''s iconic mountain gorilla trekking destination, with forest trails, sector-sensitive lodge choices, community visits, and powerful conservation value.',
 '{"Mountain gorillas", "Rainforest trekking", "Batwa and community experiences"}',
 '{"Gorilla trekking", "Community walks"}',
 '{"Mountain gorillas", "Primates", "Forest birds"}',
 'Drier months usually make trekking footing easier, while greener months can be scenic and quieter.',
 '2-3 nights depending on route and comfort', 'published', 1),

('murchison-falls-national-park', 'Murchison Falls National Park', 'Northwestern Uganda',
 'A strong short-safari choice with Nile boat cruises, big game, giraffes, elephants, hippos, crocodiles, and the dramatic Top of the Falls.',
 '{"Nile boat cruise", "Game drives", "Ziwa rhino pairing"}',
 '{"Game drives", "Boat cruise", "Rhino tracking"}',
 '{"Elephants", "Giraffes", "Lions", "Buffaloes", "Hippos", "Crocodiles", "Birds"}',
 'Wildlife viewing is good much of the year; road and river timing should be planned around season and park operations.',
 '2-3 nights', 'published', 2),

('queen-elizabeth-national-park', 'Queen Elizabeth National Park', 'Western Uganda',
 'A varied park for game drives, Kazinga Channel cruises, crater scenery, and Ishasha tree-climbing lion searches.',
 '{"Kazinga Channel", "Ishasha sector", "Crater landscapes"}',
 '{"Game drives", "Boat cruise", "Tree climbing lions"}',
 '{"Lions", "Elephants", "Hippos", "Birds"}',
 'Excellent as part of a Kibale-Bwindi circuit; lodge choice should match your priority sector.',
 '2-3 nights', 'published', 3),

('kibale-forest-national-park', 'Kibale Forest National Park', 'Western Uganda',
 'Uganda''s leading chimpanzee tracking forest, often paired with Bigodi Wetland and Queen Elizabeth National Park.',
 '{"Chimpanzee tracking", "Bigodi Wetland", "Forest birding"}',
 '{"Chimpanzee tracking", "Birding"}',
 '{"Chimpanzees", "Primates", "Forest birds"}',
 'Book chimp permits early and stay near the activity sector for easier morning logistics.',
 '1-2 nights', 'published', 4),

('lake-mburo-national-park', 'Lake Mburo National Park', 'Western Uganda',
 'A compact park with zebras, impala, giraffes, nature walks, boat trips, and useful routing between Entebbe and the southwest.',
 '{"Short safaris", "Nature walks", "Route breaker"}',
 '{"Game drives", "Boat trips", "Nature walks"}',
 '{"Zebras", "Impala", "Giraffes", "Birds"}',
 'Works well at the beginning or end of western Uganda circuits.',
 '1-2 nights', 'published', 5),

('lake-bunyonyi', 'Lake Bunyonyi', 'Southwestern Uganda',
 'A scenic, restful lake often used after gorilla trekking for canoe rides, views, and a slower final night.',
 '{"Relaxation", "Canoeing", "Post-trek scenery"}',
 '{"Canoeing", "Swimming"}',
 '{"Birds", "Views"}',
 'A gentle add-on after Bwindi when the itinerary needs rest and beautiful views.',
 '1-2 nights', 'published', 6),

('jinja-source-of-the-nile', 'Jinja and the Nile', 'Eastern Uganda',
 'Jackfruit Safaris'' home base and Uganda''s adventure hub for rafting, cycling, horse riding, craft visits, Nile views, and transfers.',
 '{"Source of the Nile", "Rafting and cycling", "Local Jackfruit base"}',
 '{"Rafting", "Cycling", "Craft visits"}',
 '{"Nile", "Views"}',
 'Great before or after safari, especially for travelers with a free day around Kampala, Entebbe, or Jinja.',
 '1-3 nights', 'published', 7);

-- Seed experiences
insert into public.experiences (
  slug, name, category, summary, included, location, status, order_column
) values
('gorilla-trekking', 'Gorilla Trekking in Uganda', 'Wildlife',
 'Plan a safe, well-supported trek to see mountain gorillas in Bwindi or Mgahinga with permit guidance, lodge advice, and local transport.',
 '{"Bwindi and Mgahinga permit guidance", "Fitness, packing, and trekking expectations", "Sector-aware lodge and route planning", "Recommended tours: 3 Days Gorilla, 10 Days Uganda, Custom Safari"}',
 'Bwindi Impenetrable National Park', 'published', 1),

('jinja-adventures', 'Jinja Activities and Nile Adventures', 'Adventure',
 'Make the most of Uganda''s adventure capital with cycling, rafting, horse riding, ziplining, bungee jumping, Source of the Nile visits, and local experiences.',
 '{"White water rafting and kayaking on the Nile", "Cycling tours through villages and plantations", "Horse riding, zipline, bungee, and city craft visits", "Easy add-on before or after a safari"}',
 'Jinja, Uganda', 'published', 2),

('cultural-experiences', 'Cultural Experiences in Uganda', 'Culture',
 'Add meaning to your safari through local food, community visits, crafts, storytelling, village life, and respectful cultural encounters.',
 '{"Community walks near Bwindi", "Batwa cultural experiences where appropriate", "Jinja craft village and local food tasting", "Village, market, plantation, music, and storytelling visits"}',
 'Various locations', 'published', 3),

('wildlife-safaris', 'Wildlife Safaris', 'Wildlife',
 'Explore Murchison Falls, Queen Elizabeth, Lake Mburo, and other wildlife regions with private game drives, boat cruises, and local guides.',
 '{"Savannah game drives and boat safaris", "Rhino tracking at Ziwa on northern routes", "Elephants, giraffes, buffaloes, hippos, antelopes, lions, and birds", "Private pacing for couples, families, and groups"}',
 'National Parks', 'published', 4);

-- Seed safari packages
insert into public.safari_packages (
  slug, title, duration, route, start_point, end_point, summary, price_from, currency,
  highlights, included, excluded, itinerary, accommodation_options, faq, status, order_column,
  meta_title, meta_description, permit_rate_warning
) values
('3-days-gorilla-tracking', '3 Days Gorilla Tracking Safari', '3 days',
 'Entebbe/Kampala - Bwindi - Entebbe/Kampala', 'Starts in Entebbe, Kampala, or by request from Jinja', 'Entebbe/Kampala',
 'A focused Bwindi journey for travelers who want one unforgettable hour with mountain gorillas, supported by a private driver-guide, permit planning, and lodge options.',
 1250, 'USD',
 '{"Scenic drive through western Uganda", "Equator stop at Kayabwe", "Gorilla trekking in Bwindi Impenetrable National Park", "Optional Batwa or community walk", "Private 4x4 safari vehicle and driver-guide"}',
 '{"Transport in a private 4x4 safari vehicle", "English-speaking driver-guide", "Accommodation and meals as listed", "One gorilla trekking permit per person when included in quote", "Park entrance fees", "Bottled drinking water"}',
 '{"International flights", "Visa fees", "Travel insurance", "Tips and personal expenses", "Optional cultural or community activities unless confirmed"}',
 '[
  {"day": "Day 1", "title": "Entebbe or Kampala to Bwindi", "body": "Your Jackfruit Safaris driver-guide collects you from your hotel or Entebbe International Airport. Travel southwest through rolling hills, farms, trading centers, and traditional homesteads, with a photo stop at the Equator before arriving near Bwindi in the evening.", "meals": "Lunch and dinner"},
  {"day": "Day 2", "title": "Gorilla trekking in Bwindi", "body": "After an early breakfast, transfer to park headquarters for briefing. Trek with Uganda Wildlife Authority rangers for roughly 2 to 6 hours depending on the gorilla family''s location. Once found, you spend the permitted hour observing them before returning to the lodge.", "meals": "Breakfast, lunch, and dinner"},
  {"day": "Day 3", "title": "Return to Kampala or Entebbe", "body": "Begin the return drive after breakfast, with lunch en route and evening drop-off in Kampala or Entebbe.", "meals": "Breakfast and lunch"}
 ]'::jsonb,
 '[
  {"tier": "Luxury", "options": "Buhoma Lodge or Mahogany Springs"},
  {"tier": "Mid-range", "options": "Silverback Lodge or Ichumbi Gorilla Lodge"},
  {"tier": "Budget", "options": "Rushaga Gorilla Camp or Buhoma Community Rest Camp"}
 ]'::jsonb,
 '[
  {"question": "How hard is gorilla trekking?", "answer": "Trekking can be moderate to challenging depending on the gorilla family''s location, trail condition, and weather. Porters are strongly recommended."},
  {"question": "When should I book my permit?", "answer": "Book as early as possible, especially for high season. Permits are limited and must be confirmed before the trip is final."},
  {"question": "Can this trip start from Jinja?", "answer": "Yes. A Jinja start is possible, but it adds road time and may need an adjusted pickup schedule or an extra night."}
 ]'::jsonb, 'published', 1,
 '3 Days Gorilla Tracking Safari in Uganda | Bwindi Gorilla Trek',
 'Plan a private 3-day Uganda gorilla trekking safari to Bwindi with Jackfruit Safaris, including permit guidance, 4x4 transport, lodge options, and local support.',
 'Gorilla permit rates and lodge availability must be verified with current Uganda Wildlife Authority and lodge tariffs before final quotation.');

insert into public.safari_packages (
  slug, title, duration, route, start_point, end_point, summary, price_from, currency,
  highlights, included, excluded, itinerary, accommodation_options, faq, status, order_column,
  meta_title, meta_description
) values
('3-days-murchison-falls', '3 Days Murchison Falls Safari', '3 days',
 'Kampala/Entebbe - Ziwa - Murchison Falls - Kampala/Entebbe', 'Starts in Kampala or Entebbe', 'Kampala/Entebbe',
 'A classic short Uganda wildlife safari with Ziwa rhinos, savannah game drives, a Nile boat cruise, and the dramatic top of Murchison Falls.',
 850, 'USD',
 '{"Rhino tracking at Ziwa Rhino Sanctuary", "Game drives in Murchison Falls National Park", "Nile boat cruise to the base of the falls", "Top of the Falls viewpoint or hike", "Chance to see elephants, giraffes, lions, buffaloes, hippos, and birds"}',
 '{"4x4 Land Cruiser with pop-up roof", "Professional English-speaking guide", "Accommodation and meals as listed", "Ziwa Rhino Sanctuary tracking fees", "Murchison Falls park entry", "Game drives and Nile boat cruise", "Bottled drinking water"}',
 '{"International flights", "Visa fees", "Travel insurance", "Personal expenses", "Tips, alcohol, and laundry"}',
 '[
  {"day": "Day 1", "title": "Ziwa Rhino Sanctuary and Murchison Falls", "body": "Pick up after breakfast and drive north. Track rhinos at Ziwa Rhino Sanctuary, continue via Masindi for lunch, then enter Murchison Falls National Park with a short evening game drive if time allows.", "meals": "Lunch and dinner"},
  {"day": "Day 2", "title": "Game drive, Nile boat cruise, and Top of the Falls", "body": "Start early on the Buligi Circuit, then take an afternoon boat cruise toward the base of the falls. Watch for hippos, crocodiles, elephants, and river birds before visiting the Top of the Falls if timing allows.", "meals": "Breakfast, lunch, and dinner"},
  {"day": "Day 3", "title": "Morning game drive and return", "body": "Enjoy a final game drive or Top of the Falls visit, then return to Kampala or Entebbe with lunch en route.", "meals": "Breakfast and lunch"}
 ]'::jsonb,
 '[
  {"tier": "Luxury", "options": "Paraa Safari Lodge"},
  {"tier": "Mid-range", "options": "Pakuba Safari Lodge"},
  {"tier": "Budget", "options": "Hornbill Bush Lodge"}
 ]'::jsonb,
 '[
  {"question": "Is this safari suitable for children?", "answer": "Yes, it can work well for families because the route is compact and varied. Age rules may apply to some activities."},
  {"question": "Can I add Jinja before or after?", "answer": "Yes. Jinja pairs well with arrival or departure days if you want Nile activities or a relaxed extension."}
 ]'::jsonb, 'published', 2,
 '3 Days Murchison Falls Safari | Ziwa Rhinos, Game Drives and Nile Cruise',
 'Book a private 3-day Murchison Falls safari with Jackfruit Safaris, including Ziwa rhino tracking, game drives, Nile boat cruise, and local guide support.');

insert into public.safari_packages (
  slug, title, duration, route, start_point, end_point, summary, price_from, currency,
  highlights, included, excluded, itinerary, accommodation_options, faq, status, order_column,
  meta_title, meta_description
) values
('10-days-uganda-safari', '10 Days Uganda Safari', '10 days',
 'Entebbe - Lake Mburo - Kibale - Queen Elizabeth - Ishasha - Bwindi - Lake Bunyonyi - Entebbe', 'Starts and ends in Entebbe', 'Entebbe',
 'Jackfruit Safaris'' complete Uganda circuit, combining savannah wildlife, chimpanzees, gorillas, boat cruises, crater landscapes, and lakeside rest.',
 2950, 'USD',
 '{"Lake Mburo wildlife and nature walk", "Chimpanzee tracking in Kibale Forest", "Kazinga Channel boat cruise", "Queen Elizabeth and Ishasha game drives", "Gorilla trekking in Bwindi", "Lake Bunyonyi relaxation"}',
 '{"All airport transfers", "Ground transport in 4x4 safari Land Cruiser", "English-speaking professional guide", "Accommodation and meals as listed", "Park entrance fees", "Gorilla and chimp permits when included in quote", "Boat cruises and listed activities", "Bottled drinking water"}',
 '{"International flights", "Visa fees", "Travel insurance", "Tips, drinks, laundry, and personal expenses", "Optional activities not listed as included"}',
 '[
  {"day": "Day 1", "title": "Arrival in Entebbe", "body": "Meet your guide on arrival and transfer to your Entebbe hotel for rest after the flight.", "meals": "Dinner depending on arrival time"},
  {"day": "Day 2", "title": "Entebbe to Lake Mburo", "body": "Travel through central Uganda with an Equator stop, then continue to Lake Mburo for an afternoon game drive.", "meals": "Breakfast, lunch, and dinner"},
  {"day": "Day 3", "title": "Lake Mburo nature walk and transfer to Kibale", "body": "Begin with a guided nature walk, then transfer toward the forested landscapes around Kibale.", "meals": "Breakfast, lunch, and dinner"},
  {"day": "Day 4", "title": "Chimpanzee tracking and Bigodi Wetland", "body": "Track chimpanzees in Kibale Forest and visit Bigodi Wetland for birds, community stories, and local conservation.", "meals": "Breakfast, lunch, and dinner"},
  {"day": "Day 5", "title": "Kibale to Queen Elizabeth", "body": "Travel to Queen Elizabeth National Park and take the Kazinga Channel boat cruise.", "meals": "Breakfast, lunch, and dinner"},
  {"day": "Day 6", "title": "Queen Elizabeth to Ishasha", "body": "Enjoy a morning game drive, then continue toward Ishasha in search of tree-climbing lions.", "meals": "Breakfast, lunch, and dinner"},
  {"day": "Day 7", "title": "Ishasha to Bwindi", "body": "Take a final Ishasha game drive before transferring to the Bwindi sector matched to your gorilla permit.", "meals": "Breakfast, lunch, and dinner"},
  {"day": "Day 8", "title": "Gorilla trekking in Bwindi", "body": "Trek with UWA rangers and spend the permitted hour with mountain gorillas. Add a community walk if energy and timing allow.", "meals": "Breakfast, lunch, and dinner"},
  {"day": "Day 9", "title": "Bwindi to Lake Bunyonyi", "body": "Continue to Lake Bunyonyi for a canoe ride, views, and a gentler final night after trekking.", "meals": "Breakfast, lunch, and dinner"},
  {"day": "Day 10", "title": "Lake Bunyonyi to Entebbe", "body": "Return to Entebbe for departure, with stops planned around flight timing.", "meals": "Breakfast and lunch"}
 ]'::jsonb,
 '[
  {"tier": "Mid-range", "options": "Comfortable safari lodges matched to each park sector and activity location"},
  {"tier": "Luxury upgrades", "options": "Premium lodges available in Bwindi, Queen Elizabeth, Kibale, and Lake Mburo"},
  {"tier": "Budget adjustments", "options": "Simpler lodge choices can reduce cost while keeping the route private"}
 ]'::jsonb,
 '[
  {"question": "Is this route rushed?", "answer": "It is a full itinerary, but the routing follows a logical Uganda circuit. Travelers wanting a slower pace can add one or two nights."},
  {"question": "Can it be luxury?", "answer": "Yes. Lodge upgrades and domestic flight segments can make the journey more comfortable."}
 ]'::jsonb, 'published', 3,
 '10 Days Uganda Safari | Gorillas, Chimps, Queen Elizabeth and Lake Mburo',
 'Explore Uganda on a private 10-day safari circuit with Jackfruit Safaris, including Lake Mburo, Kibale chimps, Queen Elizabeth, Bwindi gorillas, and Lake Bunyonyi.');

insert into public.safari_packages (
  slug, title, duration, route, start_point, end_point, summary, price_from, currency,
  highlights, included, excluded, itinerary, accommodation_options, faq, status, order_column,
  meta_title, meta_description
) values
('custom-uganda-safari', 'Custom Uganda Safari Planning', 'Custom',
 'Built around your dates, pace, interests, and budget', 'Flexible starts from Entebbe, Kampala, Jinja, or by request', 'Flexible',
 'A tailored planning service for gorilla trekking, wildlife, photography, culture, Jinja adventure, family travel, group transport, and smooth Uganda logistics.',
 NULL, 'USD',
 '{"Gorilla trekking plus Lake Bunyonyi", "Murchison Falls plus Jinja and Source of the Nile", "Kibale chimpanzees plus Queen Elizabeth wildlife", "Family-friendly safari pacing", "Airport transfers, Jinja activities, and group logistics"}',
 '{"Custom route design", "Permit and lodge availability checks", "Private guide and transport planning", "Detailed quotation with inclusions and exclusions", "WhatsApp and email support"}',
 '{"Items not selected in your final quote", "Government fee increases after quotation", "International flights, visas, and insurance"}',
 '[
  {"day": "Step 1", "title": "Share your travel details", "body": "Tell us your dates, group size, budget, comfort level, and must-do experiences.", "meals": "Not applicable"},
  {"day": "Step 2", "title": "Receive a recommended route", "body": "Jackfruit Safaris suggests a realistic route, lodge level, activity plan, and price guidance.", "meals": "Not applicable"},
  {"day": "Step 3", "title": "Confirm permits, lodges, and transport", "body": "Once the route feels right, the team checks live availability and confirms the details before payment.", "meals": "Not applicable"}
 ]'::jsonb,
 '[
  {"tier": "Budget", "options": "Simple guesthouses, camps, and practical safari lodges"},
  {"tier": "Mid-range", "options": "Comfortable lodges with private bathrooms and reliable service"},
  {"tier": "Luxury", "options": "Premium lodges or tented camps with strong locations and service"}
 ]'::jsonb,
 '[
  {"question": "How quickly can I get a quote?", "answer": "Simple trips can often be estimated quickly, while gorilla permits and specific lodges require availability checks."},
  {"question": "Can Jackfruit work with agents or NGOs?", "answer": "Yes. The team can support group transport, Jinja logistics, safari add-ons, and visiting teams."}
 ]'::jsonb, 'published', 4,
 'Custom Uganda Safari Planning | Jackfruit Safaris',
 'Request a custom Uganda safari quote from Jackfruit Safaris for gorilla trekking, wildlife, Jinja adventures, family travel, transport, and group logistics.');

-- Seed testimonials as reviews
insert into public.reviews (
  guest_name, country, trip_type, rating, quote, source, status, permission_status
) values
('Private safari guest', 'Uganda', 'Gorilla trekking', 5,
 'The team made the route feel easy, from permit planning to lodge timing and the long drives.',
 'Direct submission', 'published', 'approved'),
('Jinja visitor', 'Uganda', 'Nile activities', 5,
 'Fast WhatsApp replies, clear pickup details, and a relaxed local feel around Jinja.',
 'Direct submission', 'published', 'approved'),
('Small group traveler', 'Uganda', 'Uganda circuit', 5,
 'We always knew what was included, what was optional, and what needed live confirmation.',
 'Direct submission', 'published', 'approved');