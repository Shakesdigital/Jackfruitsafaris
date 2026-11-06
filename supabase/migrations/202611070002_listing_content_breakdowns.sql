-- Jackfruit Safaris - comprehensive listing content breakdowns
-- Detail-page content for all listed destinations (7), experiences (4) and
-- safari packages (3), researched and written November 2026 for the CMS.
--
-- The facts are checked against the Uganda Wildlife Authority Conservation
-- Tariff (July 2024-June 2026) and UWA''s letter of 26 February 2026, verified
-- across independent visitor guides in August-October 2026:
-- Park entry per 24h FNR: Murchison Falls US$45 (the only Category A+ park);
-- all other parks on our routes US$40. Gorilla permits FNR US$800 standard,
-- US$600 low season (April/May/November 2026 treks, non-reschedulable);
-- habituation US$1,500 rising to US$1,800 on 1 January 2027. Permits must be
-- paid in full at booking (since 1 March 2026) and foreign non-resident
-- permits go through UTB-licensed operators. Nile launch cruises ~US$30 FNR;
-- Kibale chimpanzee permits US$250-300 depending on tariff cycle (confirmed
-- at booking); Kyambura Gorge US$100.
-- Rates are periodically revised: every page says we re-confirm the tariff at
-- quotation. Voice: Jackfruit''s own - locally grounded (Jinja), practical,
-- honest. No invented ratings, testimonials, guaranteed sightings or
-- availability.
--
-- The safari packages keep the owner''s published from-prices; this file only
-- improves day bodies, inclusions, permits and FAQ fields.

-- ===========================================================================
-- 1. DESTINATIONS
-- ===========================================================================

update public.destinations
set
 overview = $ov$Bwindi Impenetrable National Park is the reason most travelers book Uganda: a mist-covered ancient forest holding roughly half of the world''s remaining mountain gorillas. Trekking runs from all four sectors - Buhoma, Ruhija, Rushaga and Nkuringo - and every sector has its own habituated families, trailhead towns and lodge clusters, so where you sleep genuinely decides what your trek day feels like. The same forest also offers the gorilla habituation experience for travelers who want four hours with a semi-habituated family instead of the standard hour, guided forest walks among ferns and waterfalls, and Batwa community experiences led by the forest''s first people.

Permits are issued by the Uganda Wildlife Authority and sell out hardest for June-September and December-February. We confirm your permit, match it to a sector and lodge before you pay for anything else, and brief you properly on gear, porters and pacing so the trek day stays a highlight rather than a scramble.$ov$,
 why_go = array[
 $ov$Meet a habituated mountain gorilla family face to face$ov$,
 $ov$Choice of four trekking sectors, each with its own trail character$ov$,
 $ov$Optional four-hour gorilla habituation experience at Rushaga$ov$,
 $ov$Batwa-led cultural and community walks$ov$,
 $ov$Guided forest walks among ferns, waterfalls and cloud forest$ov$,
 $ov$Conservation the whole family can support: tourism here funds it$ov$
 ],
 how_to_get_there = array[
 $ov$By road from Kampala or Entebbe: roughly 460-540 km, 8-9 hours with stops, depending on your sector (Buhoma via Kanungu, Rushaga and Nkuringo via Kigezi, Ruhija via Kabale).$ov$,
 $ov$Through Rwanda: land via the Gatuna or Cyanika border crossings - about 3-4 hours from Kigali to Rushaga or Nkuringo, a strong pairing when Bwindi sits inside a Volcanoes National Park loop.$ov$,
 $ov$By air: scheduled domestic flights from Entebbe to Kihihi or Kisoro airstrips with a short transfer to your sector lodge - worth it when trek dates are fixed and road time is tight.$ov$
 ],
 top_experiences = '[
 {"name":"Gorilla Trekking","slug":"gorilla-trekking","description":"The one unforgettable hour, fully supported: permit procurement, sector choice, lodge matching, porter briefing and private transport."},
 {"name":"Cultural Experiences","slug":"cultural-experiences","description":"Respectful encounters with Batwa forest knowledge, craft cooperatives and community walks around the sector you trek from."},
 {"name":"Wildlife Safaris","slug":"wildlife-safaris","description":"Pair Bwindi''s forest with the savannah parks - the shape behind our 10-day Uganda circuit."}
 ]'::jsonb,
 wildlife = array[
 $ov$Around 459 resident mountain gorillas - about half of the world''s population - across all four sectors$ov$,
 $ov$Black-and-white colobus, red-tailed, blue and L''Hoest''s monkeys; chimpanzees present but not typically trekked here$ov$,
 $ov$One of East Africa''s richest forest bird grounds: 350-plus species including 23 Albertine Rift endemics$ov$,
 $ov$Duikers, bushbuck and tree hyraxes on the quieter trails; forest elephants roam the deeper sectors$ov$,
 $ov$Butterfly and orchid diversity that rewards slow walkers between lookouts$ov$,
 $ov$The ancient rainforest itself - one of the few large tracts of pre-Pleistocene African forest left standing$ov$
 ],
 best_time = $ov$June-September and December-February give the easiest footwork and the clearest skies, and those months sell permits furthest in advance. Trekking runs all year: the wetter months bring thinner trails, greener forest and (from 2026) real permit savings. Gorilla permits are US$800 per foreign non-resident at other times; UWA''s low-season rate is US$600 for April, May and November 2026 treks - announced on 26 February 2026, and those permits cannot be rescheduled. The habituation experience is US$1,500 and rises to US$1,800 from 1 January 2027. Rates are periodically revised; we confirm the current tariff before you commit.$ov$,
 recommended_nights = $ov$2-3 nights. Two nights covers one trek day comfortably; three adds slack for the long drives, a second forest activity or a slow community morning before Ishasha or Lake Bunyonyi.$ov$,
 meta_title = 'Bwindi Impenetrable NP Safari Guide 2026 | Jackfruit Safaris',
 meta_description = 'Plan gorilla trekking in Bwindi with Jackfruit Safaris: the four sectors, current permit facts, when to go and how many nights - planned around your dates from Jinja.',
 updated_at = now()
where slug = 'bwindi-impenetrable-national-park';

update public.destinations
set
 overview = $ov$Murchison Falls National Park compresses a big Africa into a compact loop: the Victoria Nile pours through a seven-metre gorge as one of the world''s most dramatic waterfalls, boat safaris motor up the river beneath hippos, crocodiles, elephants and buffalo crowding the banks, and the open Buligi tracks rate among Uganda''s most reliable big-game drives. It is Uganda''s largest protected savannah park, carries the world''s strongest Nubian giraffe population, and comes with the country''s best short-safari reachability: the Kampala-Gulu corridor puts a full 3-day loop - rhino walk at Ziwa, game drives, falls boat - within reach from Entebbe, Kampala or our own Jinja base.

Combining the falls launch cruise with the Top of the Falls viewpoint (or the Fajao gorge scramble to the echo point) gives the park''s best photographic afternoon; the delta tracks reward a slow dawn game drive before it.$ov$,
 why_go = array[
 $ov$Watch the Nile force itself through a 7-metre gorge$ov$,
 $ov$Boat safari to the base of the falls past hippo and elephant$ov$,
 $ov$Walk with white rhinos on foot at Ziwa Rhino Sanctuary en route$ov$,
 $ov$Big-game drives on the Buligi circuits - giraffe, lion, buffalo$ov$,
 $ov$Shoebill odds on the delta channels, plus Nile river-bird life$ov$,
 $ov$The best short-loop reachability of any Uganda park from Entebbe or Jinja$ov$
 ],
 how_to_get_there = array[
 $ov$From Kampala or Entebbe: 300-320 km via Masindi, about 4-5 hours to the gate. From Jinja we use the Gulu road: the whole loop stays comfortable when the day starts early and the night stops are picked to match the gate.$ov$,
 $ov$Gates sit at Mubako, Tangi and Paraa; the Paraa ferry connects the north-bank Buligi game circuits to the main Buhoro road. UWA entry runs on a per-person 24-hour ticket plus a vehicle fee - we itemize both in your quote.$ov$,
 $ov$Match gate times to your itinerary: gates open and close on fixed schedules, so we set evening arrivals and morning drives to match the ferry and the gate rather than fight them.$ov$
 ],
 top_experiences = '[
 {"name":"Wildlife Safaris","slug":"wildlife-safaris","description":"Private game drives on the Buligi circuits and a Nile boat safari to the base of the falls - the core pairing inside our 3-day Murchison package."},
 {"name":"Cultural Experiences","slug":"cultural-experiences","description":"Community visits around the Bunyoro parishes bordering the park, plus craft and market stops in Masindi."}
 ]'::jsonb,
 wildlife = array[
 $ov$Nubian giraffes at Africa''s highest density, with large elephant and buffalo herds along the Nile$ov$,
 $ov$Lions watched most often on the savannah circuits; leopard recorded on dawn drives$ov$,
 $ov$Hippos and Nile crocodiles in sizeable numbers below the falls and along the channels$ov$,
 $ov$Spotted hyena, warthog, oribi and Jackson''s hartebeest across the grasslands$ov$,
 $ov$Shoebill storks favor the delta channels; bee-eaters, kingfishers and fish eagles line the boat route$ov$,
 $ov$White rhinos live outside the park itself - Ziwa Rhino Sanctuary holds Uganda''s only wild-bred population and sits on the road north$ov$
 ],
 best_time = $ov$December-February and June-July bring dry murram roads and game concentrated by water; March-May and August-November turn some tracks slow and green, and the boat cruise becomes the most productive wildlife hour. Park entry is US$45 per foreign non-resident per 24 hours (Murchison sits in UWA''s top entry band), the falls launch cruise is about US$30, and the Top of the Falls viewpoint at US$10 or the Fajao gorge hike at US$15 close the day. Rates are periodically revised - we confirm the current tariff at quotation.$ov$,
 recommended_nights = $ov$2-3 nights. Two nights fits Ziwa plus falls plus one full game drive; three unhurries the boat, the Top of the Falls and two separate game drives. It pairs naturally with a Jinja night before or after.$ov$,
 meta_title = 'Murchison Falls Safari Guide 2026 | Jackfruit Safaris',
 meta_description = 'Route, pricing and wildlife guide for Murchison Falls with Jackfruit Safaris: 3-day loops from Entebbe, Kampala or Jinja, the Nile boat safari, Ziwa rhinos and Top of the Falls.',
 updated_at = now()
where slug = 'murchison-falls-national-park';

update public.destinations
set
 overview = $ov$Queen Elizabeth National Park is Uganda''s most varied savannah park - and the one whose highlights slot together like a route puzzle. Game drives on the Kasenyi plains track Uganda''s most-viewed lions; Ishasha makes you look up; the Kazinga Channel boat safari runs a 32-km stretch between Lake George and Lake Edward packing hippos, elephants, buffaloes, crocodiles and 60-plas visible bird species into two hours; and Kyambura Gorge holds a habituated chimpanzee community in a sunken rainforest corridor.

The park rewards a planned circuit more than a single base: Mweya for game drives and the boat, the craters on its northern side, Kyambura for chimps, and Ishasha a half-day south on murram that works in every season when you start early.$ov$,
 why_go = array[
 $ov$Two-hour Kazinga Channel boat safari past hippos, elephant and skimmer flocks$ov$,
 $ov$Game drives on the Kasenyi circuit - lions, buffalo, Uganda kob$ov$,
 $ov$Chimpanzee tracking in the Kyambura Gorge$ov$,
 $ov$Tree-climbing lions in the Ishasha sector$ov$,
 $ov$Crater-lake scenery and Rift Valley forest$ov$,
 $ov$A natural pairing with Kibale (2-3 hours) or Bwindi (3-4 hours)$ov$
 ],
 how_to_get_there = array[
 $ov$From Kampala: 410 km / 7-8 hours via Mbarara or Fort Portal to Mweya. From Jinja or Kibale: 2-3 hours on surfaced road into the park''s northern entrance. We set arrivals to match gate and lodge timing, never to out-run them.$ov$,
 $ov$Base at Mweya for the channel, Kasenyi and Kyambura; add a night south (Ishasha) or toward Bwindi''s Nkuringo/Kigezi side when the next day is gorilla day.$ov$,
 $ov$Mweya to Ishasha runs about 3 hours of murram - schedule it as a morning leg, not an evening dash after the boat$ov$
 ],
 top_experiences = '[
 {"name":"Wildlife Safaris","slug":"wildlife-safaris","description":"Private game drives across Kasenyi plus the Kazinga Channel boat safari - the classic Queen Elizabeth pairing built into the 10-day circuit."},
 {"name":"Cultural Experiences","slug":"cultural-experiences","description":"Community visits around the fishing villages and Batwa-led sites bordering the park."}
 ]'::jsonb,
 wildlife = array[
 $ov$One of Africa''s densest hippo concentrations; the channel''s paired buffaloes are its famous close-up$ov$,
 $ov$Elephants crossing between lake shores on the channel''s dusk and dawn banks$ov$,
 $ov$Kasenyi lions, a thinner leopard population and spotted hyena$ov$,
 $ov$Kyambura Gorge chimpanzees plus black-and-white colobus in Maramagambo Forest$ov$,
 $ov$600-plus bird species, including shoebill at the Lake George margins and African skimmer over the channel$ov$,
 $ov$Interesting hybrids: Uganda kob leks across Kasenyi, topi on the Ishasha flats - and the iconic tree-climbing lions$ov$
 ],
 best_time = $ov$The park has no truly rainless month. January-February and June-July are usually the driest stretches and easiest on murram; March-May can slow the Ishasha tracks. The Kazinga Channel cruise at about US$30 per foreign non-resident is the park''s best value in every season, and Kyambura chimp tracking runs US$100 FNR under the current UWA tariff. Rates are periodically revised - confirmed at quotation.$ov$,
 recommended_nights = $ov$2-3 nights at Mweya covers the channel and Kasenyi; a fourth night opens Kyambura chimps and the Ishasha sector. Pairs well with Kibale the night before if chimps matter more than night drives.$ov$,
 meta_title = 'Queen Elizabeth NP Safari Guide 2026 | Jackfruit Safaris',
 meta_description = 'Route, cruise and wildlife guide for Queen Elizabeth NP with Jackfruit Safaris: Kasenyi drives, the Kazinga Channel, Kyambura chimps and Ishasha tree-climbing lions.',
 updated_at = now()
where slug = 'queen-elizabeth-national-park';

update public.destinations
set
 overview = $ov$Kibale National Park is Uganda''s chimpanzee capital - and the most reliable place in East Africa to meet a habituated chimp community on a half-day trek. The park protects roughly 1,500 chimpanzees inside a 795 km sq km block of mid-altitude rainforest that also shelters 12 other primate species, red colobus among them. Tracking mornings run in two briefing turns, and the walk is genuinely forest-walking: trails through elephant-marked undergrowth, fig trees crowding the canopy, and the alarm calls that announce where the community is moving next.

The same stretch of country works as a circuit: the Bigodi Wetland Sanctuary walk adds swamp primates and a working community-tourism project; Fort Portal offers coffee, caves and crater walks; and Queen Elizabeth National Park sits two hours south - which is why our 10-day circuit threads them together.$ov$,
 why_go = array[
 $ov$The best success rate in East Africa for a half-day chimp trek$ov$,
 $ov$Highest primate count in Uganda - 13 species in one forest block$ov$,
 $ov$Bigodi Wetland boardwalk for swamp primates and wetland birds$ov$,
 $ov$Crater-country scenery on the Fort Portal outskirts$ov$,
 $ov$Natural pairing with Queen Elizabeth on the same drive south$ov$,
 $ov$Real community-tourism returns around the forest edge$ov$
 ],
 how_to_get_there = array[
 $ov$From Kampala or Entebbe: 300-320 km via Mubende or Fort Portal, 4.5-5.5 hours to the Kanyanchu gate; from Jinja it runs comfortably inside a day when paired with an overnight in Fort Portal.$ov$,
 $ov$From Queen Elizabeth (Mweya or Kasese): 2-3 hours by surfaced road through the Ndali-Kasenda craters - so Kibale sits naturally as the next trip morning when you drive over the previous evening.$ov$,
 $ov$Chimp permits come through UWA and set your briefing session; confirm them before locking lodge nights.$ov$
 ],
 top_experiences = '[
 {"name":"Cultural Experiences","slug":"cultural-experiences","description":"Bigodi community guides, tea and coffee visits, crater walks and Fort Portal market mornings tied to your chimp day."},
 {"name":"Wildlife Safaris","slug":"wildlife-safaris","description":"Follow the forest with two hours south to Queen Elizabeth and continue the primates-plus-savannah loop."}
 ]'::jsonb,
 wildlife = array[
 $ov$Roughly 1,500 chimpanzees, with a habituation option for the keen primate watcher$ov$,
 $ov$Red colobus, black-and-white colobus, L''Hoest''s, red-tailed and blue monkeys; grey-cheeked mangabeys$ov$,
 $ov$Forest elephants present - usually read from trails, tracks and camera traps rather than met$ov$,
 $ov$Bigodi sanctuary adds swamp-loving sitatunga, bushbuck and waterbirds$ov$,
 $ov$375 species put the park among Uganda''s top forest birding sites$ov$,
 $ov$Olive baboons and (with patience) duikers cross the Bigodi trails$ov$
 ],
 best_time = $ov$Tracking runs year-round; the wetter months leave trails slick but the forest greenest. UWA lists Kibale chimpanzee tracking from US$250 per foreign non-resident on the current tariff cycle (published rates shift between tariff periods, so we confirm the exact permit rate at booking). Fruiting lulls in September and February send the groups deeper and make the trek a better workout.$ov$,
 recommended_nights = $ov$2 nights: the tracking morning plus Bigodi (or the crater walks) as a slow second day. Add one night at Queen Elizabeth when you continue south on the circuit.$ov$,
 meta_title = 'Kibale Chimpanzee Tracking Guide 2026 | Jackfruit Safaris',
 meta_description = 'Plan chimpanzee tracking in Kibale with Jackfruit Safaris: permit facts, Bigodi Wetland, crater walks and drive times from Kampala, Jinja or Queen Elizabeth.',
 updated_at = now()
where slug = 'kibale-forest-national-park';

update public.destinations
set
 overview = $ov$Lake Mburo National Park is Uganda''s smallest savannah park - 370 km sq km of acacia woodland, papyrus swamps and lake islands you can realistically reach in half a day from Kampala and in under four hours from Entebbe. It sits on the Entebbe-Bwindi corridor, which makes it both a strong first wildlife stop and the park that keeps the long drives pleasant rather than punishing. Walk safaris and horseback rides are permitted and low-key here - one of the few Uganda parks that lets you stand near zebra herds and giraffes without four doors and a roof between you.

Afternoon boat trips cross the lake past pelicans, fish eagles and hippos; UWA ranger-escorted night drives make Mburo the most straightforward place to hear (and sometimes spot) bushbabies, owls and leopard. As a park open year-round, it rewards a slow morning before Bwindi''s forest roads.$ov$,
 why_go = array[
 $ov$Guided walk safaris and horseback rides among zebra and giraffe$ov$,
 $ov$Relaxed game drives in acacia country you can genuinely cover$ov$,
 $ov$Boat trips across the lake past pelicans, papyrus and hippos$ov$,
 $ov$Night drives through UWA for bushbabies, leopard and hyena$ov$,
 $ov$The useful stop between Entebbe and the gorilla sectors$ov$,
 $ov$A compact park you can properly cover in a day-and-a-half$ov$
 ],
 how_to_get_there = array[
 $ov$From Kampala or Entebbe: 240 km / 3.5-4.5 hours on the Masaka-Mbarara road with the park entrance at Sanga; hold an hour spare for the gravel stretch down to the lake.$ov$,
 $ov$From Bwindi (Ruhija or Rushaga): 3-4 hours on the Mbarara back-road - Mburo springs naturally as a last night after gorilla trekking.$ov$,
 $ov$The lake boat departs the park jetty each afternoon; night drives and walk permits are arranged with UWA at booking.$ov$
 ],
 top_experiences = '[
 {"name":"Wildlife Safaris","slug":"wildlife-safaris","description":"Private walks, drives and boat outings - Mburo is our most walkable savannah option and an easy stop on the 10-day circuit."},
 {"name":"Cultural Experiences","slug":"cultural-experiences","description":"Ranch communities, Ankole long-horned cattle country and market mornings along the Masaka-Mbarara route."}
 ]'::jsonb,
 wildlife = array[
 $ov$Impala - Uganda''s only population - plus Burchell''s zebra, eland, buffalo and topi$ov$,
 $ov$Giraffes, reintroduced to the park and a signature sighting on the walk safaris$ov$,
 $ov$Hippos and crocodiles along the channels and lakeshore reeds$ov$,
 $ov$Over 350 recorded species; Mburo rates among Uganda''s most beginner-friendly birding parks$ov$,
 $ov$Leopards and spotted hyena headline the night drives$ov$,
 $ov$Olive baboon and vervet troops on the Sanga escarpment in the early hours$ov$
 ],
 best_time = $ov$The park stays workable all year and the acacia shade keeps drives comfortable even at Rift heat. June-August and December-February are the clearest stretches for photography. Park entry follows the UWA Category A rate (US$40 per foreign non-resident per 24 hours); the boat, walk permits and night drives bill separately at small fees we itemize in your quote.$ov$,
 recommended_nights = $ov$1-2 nights. One night covers a walk, an afternoon boat and a compact game drive; two adds a night drive and time on horseback. Many travelers use it as the rested opening before Kibale, Queen Elizabeth or Bwindi.$ov$,
 meta_title = 'Lake Mburo Safari Guide 2026 | Jackfruit Safaris',
 meta_description = 'Plan Lake Mburo with Jackfruit Safaris: walk and horseback safaris, the lake boat, night drives and easy routing between Entebbe and Bwindi.',
 updated_at = now()
where slug = 'lake-mburo-national-park';

update public.destinations
set
 overview = $ov$Lake Bunyonyi is the deep-blue pause between Uganda''s heavy days - one of Africa''s deepest lakes, sunk into terraced high country at about 1,962 m, fringed by 29 islands and ringed with hillside lodging that reaches out over the water. There are no hippos or crocodiles, no bilharzia risk to plan around, and the water is safe to swim in - a genuine luxury after a gorilla trek.

Mornings are for canoes: dugout paddles out to Punishment Island, past floating gardens and reed throngs, then hillside walks between tea plots and mist. The lake sits under three hours from the Kigezi gorilla sectors and quietly solves the last-night problem - instead of an eight-hour rally to Entebbe, you drive four relaxed hours to a Kigali airport exit or loop up through Mbarara after breakfast.$ov$,
 why_go = array[
 $ov$Swim safely: no hippos, no crocodiles, no bilharzia$ov$,
 $ov$Dugout-canoe and boat trips among the lake''s 29 islands$ov$,
 $ov$Terraced-hill walks, tea plots and a bamboo zipline$ov$,
 $ov$Batwa and Bakiga community visits with island stories attached$ov$,
 $ov$The classic slow final night after gorilla trekking$ov$,
 $ov$Kigali airport as a natural onward link - hours shorter than the Entebbe rally$ov$
 ],
 how_to_get_there = array[
 $ov$From Bwindi (Rushaga or Nkuringo): 2.5-3.5 hours via Kabale on winding highland tarmac - the drive is half the pleasure$ov$,
 $ov$From Kigali: 2.5-3.5 hours via Katuna or Cyanika; the pairing suits travelers threading Bwindi with Rwanda$ov$,
 $ov$From Kampala or Entebbe: 420 km / about 7 hours - pleasant when a night at Lake Mburo breaks the drive$ov$
 ],
 top_experiences = '[
 {"name":"Cultural Experiences","slug":"cultural-experiences","description":"Island legends, Batwa and Bakiga craft and food visits, plus market mornings around Kabale and the lake shore."},
 {"name":"Gorilla Trekking","slug":"gorilla-trekking","description":"Bwindi''s southern sectors sit 2.5-3.5 hours away - Bunyonyi works as the trek''s slow bookend."}
 ]'::jsonb,
 wildlife = array[
 $ov$Waterbirds on every shoreline: kingfishers, herons and the fish eagles announcing first light$ov$,
 $ov$Crowned cranes among the island grasses$ov$,
 $ov$Vervet monkeys and small antelope along the forest fringes; the deeper ridges carry bushpig and duiker$ov$,
 $ov$Otters in the quieter bays, most often at dawn$ov$,
 $ov$Bamboo ridges and hillside plots attract francolins, kites and the occasional Verreaux''s eagle-owl at dusk$ov$,
 $ov$The lake itself: croc-free, hippo-free, family-safe water$ov$
 ],
 best_time = $ov$Highland weather stays cool all year; June-August and December-February give the clearest mornings and easiest walking. Rain is frequent but rarely a whole day. Canoes, boats and the zipline run daily; community visits are best arranged a day ahead through your lodge or the Kigezi community-network desk we work with.$ov$,
 recommended_nights = $ov$1-2 nights, usually the trip''s closing stay. Two nights when gorilla trekking finished the day before; one works when Kigali airport is your departure gate.$ov$,
 meta_title = 'Lake Bunyonyi Travel Guide 2026 | Jackfruit Safaris',
 meta_description = 'Plan Lake Bunyonyi after gorilla trekking with Jackfruit Safaris: canoes, the 29 islands, swim-safe water, hill walks and the Kigali airport route.',
 updated_at = now()
where slug = 'lake-bunyonyi';

update public.destinations
set
 overview = $ov$Jinja is the source of the Nile and Uganda''s adventure capital - and it is where Jackfruit Safaris is based, so river conditions here are confirmed day by day rather than quoted from a brochure. The Nile''s big-water stretches deliver full-day and half-day white-water rafting with safety kayakers accompanying every boat; gentler options (kayak clinics, SUP, tubing, sunset cruises) give younger travelers and non-swimmers a real share of the river. Around it all sits the town''s quieter charm: the Source of the Nile gardens, craft villages, the colonial-era ripon cliffs at dusk, Indian-African food and a relaxed lakefront pace.

Rafting operators refresh rates and launch times as the Nalubaale dam schedule changes the water, so our team confirms launches, safety-boats and lunch arrangements as part of your route - whether Jinja opens your trip, closes it or breaks the western drives in the middle.$ov$,
 why_go = array[
 $ov$Full-day white-water rafting through the Nile''s big-water sections$ov$,
 $ov$Kayak clinics, SUP, tubing and sunset cruises for every level$ov$,
 $ov$Stand at the Source where Lake Victoria becomes the river$ov$,
 $ov$Horse riding, quad and mountain-bike trails through river villages$ov$,
 $ov$The Mabira Forest zipline 30 minutes west$ov$,
 $ov$A calm riverfront base with Jinja''s craft, food and colonial architecture$ov$
 ],
 how_to_get_there = array[
 $ov$From Entebbe: 115 km / 2-2.5 hours depending on traffic. From Kampala: 80 km / 1.5-2 hours. Operator pickups run from both cities and the riverside camps.$ov$,
 $ov$An easy add-on before or after any safari: Jinja sits on the northern route to Murchison, so rafting can open your western loop or close it without extra road days$ov$,
 $ov$Launch times are published by operators and confirmed against the dam-release schedule when you book$ov$
 ],
 top_experiences = '[
 {"name":"Jinja Activities","slug":"jinja-adventures","description":"Full and half-day rafting, kayak clinics, horse riding, quad biking, village cycling, the Source of the Nile and river cruises - organized by our own Jinja team."},
 {"name":"Cultural Experiences","slug":"cultural-experiences","description":"The craft village, Jinja''s colonial quarter, Basoga storytelling and market mornings within reach of every rafting camp."}
 ]'::jsonb,
 wildlife = array[
 $ov$Great blue and malachite kingfishers work every stretch of boat water$ov$,
 $ov$Fish eagles over the papyrus and riverside figs$ov$,
 $ov$Monitor lizards along the rocks downstream of Bujagali and Itanda$ov$,
 $ov$Olive baboons along the riverside forest near Bujagali$ov$,
 $ov$Mabira Forest (30 minutes west) holds turacos, primates and raptors on the zipline trails$ov$,
 $ov$Hippos in the calm back-channels below the dam$ov$
 ],
 best_time = $ov$Rafting runs every day of the year; the biggest runs pair with higher dam releases, which we confirm with the operators a few days ahead. January-February is the steadiest weather for cycling and zipline days. Rafting prices are set by each operator: full day grade-3/5 runs typically US$135-145 per person, half-day about US$120 - rates change, so our team confirms the current price when you book.$ov$,
 recommended_nights = $ov$1-2 nights. One night covers a rafting day and the Source of the Nile; two lets you add a boat cruise and a slow morning in town. Jinja also works well as the jetlag-recovery night before the western parks push begin$ov$,
 meta_title = 'Jinja Activities and the Source of the Nile 2026 | Jackfruit Safaris',
 meta_description = 'Plan Jinja with the team that lives there: rafting, kayak clinics, the Source of the Nile, village rides, craft visits and drive times from Entebbe, Kampala and the parks.',
 updated_at = now()
where slug = 'jinja-source-of-the-nile';

-- ===========================================================================
-- 2. EXPERIENCES
-- ===========================================================================

update public.experiences
set
 summary = $ov$One hour with a habituated mountain gorilla family - carefully planned so the hour lands right: sector-matched permits, trek-level matching for your fitness, porter briefing, lodge logistics and the westward drive handled by our Jinja team.$ov$,
 description = $ov$Gorilla trekking is regulated by the Uganda Wildlife Authority and the rules are precise: eight visitors per day per habituated family, one hour once the group is found, minimum age 15, and - for foreign non-residents - permits issued only through licensed tour operators. For 2026, UWA lists the standard foreign non-resident permit at US$800, with a US$600 low-season rate for April, May and November treks (announced on 26 February 2026, non-reschedulable). Since 1 March 2026 permits must be paid in full at booking. The gorilla habituation experience - four hours with a semi-habituated family, Rushaga sector only - is US$1,500 and rises to US$1,800 from 1 January 2027. Rates are periodically revised; we confirm the current tariff with UWA before you commit.

The real work of a good trek day happens before the trailhead: matching your permit to a sector before a lodge is chosen, sequencing the 8-9 hour drive (or the Kihihi/Kisoro flight) so arrival evening is calm, and briefing you honestly on trail lengths, gear, porter hire and how the ranger team reads the forest - so the hour you came for is the hour you get.$ov$,
 safety_notes = $ov$Ranger escorts accompany every group and emergency procedures are briefed at the trailhead. Keep the required distance from the gorillas; masks are used where UWA regs require them on the day. The trek is real rainforest - porter hire is strongly recommended and directly supports sector wages. Tell us about knee, altitude or heat concerns before booking: sector choice changes the physical demand more than anything else.$ov$,
 included = array[
 $ov$Permit procurement and sector matching through UWA-licensed handling$ov$,
 $ov$Private 4x4 transport from Entebbe, Kampala or Jinja (or Kihihi/Kisoro flight coordination)$ov$,
 $ov$Lodge matching to your trekking sector - the decision that defines the trek day$ov$,
 $ov$A full gear, porter and trail-briefing walkthrough before the trek$ov$,
 $ov$Batwa or community walk options where appropriate$ov$,
 $ov$Recommended pairings: 3 Days Gorilla Tracking, the 10 Days Uganda Circuit, or custom safari planning$ov$
 ],
 excluded = array[
 $ov$International flights and travel insurance - arrange before travel$ov$,
 $ov$Porter and ranger-guide tips: bring small-denomination USD or shillings$ov$,
 $ov$Optional habituation upgrades unless requested at booking$ov$,
 $ov$Meals not listed in your itinerary$ov$
 ],
 meta_title = 'Gorilla Trekking in Uganda 2026 | Jackfruit Safaris',
 meta_description = 'Book gorilla trekking in Bwindi or Mgahinga with Jackfruit Safaris: 2026 permit facts, sector matching, lodge logistics and private transport from Jinja.',
 updated_at = now()
where slug = 'gorilla-trekking';

update public.experiences
set
 summary = $ov$Rafting, kayaking, cycling, horse riding, zipline and bungee at the source of the Nile - scheduled and safety-checked by our own Jinja team and slotted into the route you want afterwards.$ov$,
 description = $ov$Jinja''s appeal is the range. On the river: full-day grade-3/5 white-water rafting (typically US$135-145 per person), half-day runs (about US$120), the family float that stays inside the gentler channels, and kayak sessions that graduate from flat-water drills to class-3 rapids. Around town the texture rather than the adrenaline: village breakfasts before birdsong cycling loops, horse riding on the ribbons of track along the river, quad runs on red laterite roads, the Mabira canopy zipline, bungee above the Nile pool - and a properly briefed visit to the Source monument where Lake Victoria becomes the river.

Rafting operators adjust launch times and stretch character as the dam schedule changes the water; that is exactly why the scheduling part is ours. Whether Jinja opens your trip, closes it, or breaks up the western drives, we book the operators, time pickups and brief you on what each option actually feels like.$ov$,
 safety_notes = $ov$Jinja''s rafting companies run with international-standard safety kayakers, helmets, PFDs, rescue boats and pre-run briefings; operators adjust briefings when dam releases change the water. Tell us about paddling experience and non-swimmer guests ahead of the booking - the family float and flat-water options keep everything inside the gentler channel ranges.$ov$,
 included = array[
 $ov$Full options across rafting (half/full day), kayaking, SUP and tubing$ov$,
 $ov$Operator vetting and launch scheduling against the dam release calendar$ov$,
 $ov$Ground transport between Jinja lodging, pickup points and activities$ov$,
 $ov$Horse riding, cycling, quad, zipline and bungee options on request$ov$,
 $ov$Easy add-ons before/after gorilla or savannah safaris$ov$,
 $ov$WhatsApp support before and during your trip$ov$
 ],
 excluded = array[
 $ov$Lodging unless Jinja nights are added - we recommend partners at every budget tier$ov$,
 $ov$Meals outside the operator packages unless confirmed$ov$,
 $ov$Gratuities for raft crews and activity guides$ov$
 ],
 meta_title = 'Jinja Activities and Nile Adventures 2026 | Jackfruit Safaris',
 meta_description = 'Plan Jinja adventures with Jackfruit Safaris: 2026 rafting rates, kayak clinics, the Source of the Nile, cycling, horse riding and booking handled by the local team.',
 updated_at = now()
where slug = 'jinja-adventures';

update public.experiences
set
 summary = $ov$Add meaning to your safari: community visits, Batwa forest knowledge, craft cooperatives, storytelling, market mornings and shared meals - arranged with consent, fair contribution fees and no staged performances.$ov$,
 description = $ov$Cultural experiences work best when they are real relationships, not props. Around Bwindi, Batwa-led forest walks explain how the forest''s first people read honey paths, medicine and weather - a living, community-owned story rather than a show built for cameras. Jinja''s craft village and Basoga food culture; Kibale''s Bigodi wetland group; Kigezi tea and banana-beer cooperatives; Ankole long-horned cattle culture around Mburo; the fishing and salt communities along Kazinga Channel - every region we route has living economy stories worth one unhurried morning.

We agree on a fixed, quoted contribution fee to the hosting group before the visit happens, brief you on photography consent (ask first, always), and keep visits short enough to stay an exchange rather than a spectacle. Homestead meals, story evenings and craft workshops are all possible; collecting a market scene for content is not why guests come, and it is never why we visit.$ov$,
 safety_notes = $ov$Cultural visits stay inside established community partnerships with agreed contribution fees. Photography consent is rehearsed before every visit. Religious sites, school visits and any home access run through our team - never as improvisation on the street.$ov$,
 included = array[
 $ov$Established community partners in every listed region$ov$,
 $ov$Fixed contribution fee quoted before the visit$ov$,
 $ov$Interpretation support (Basoga, Rukiga or Runyoro storytelling translated where needed)$ov$,
 $ov$Craft, meal and workshop options that pay working artisans$ov$,
 $ov$Scheduling that respects community rhythms - mornings, market days, rest days as appropriate$ov$,
 $ov$Bundleable with any segment: Bwindi, Kibale, Queen Elizabeth, Jinja, Lake Mburo, Lake Bunyonyi$ov$
 ],
 excluded = array[
 $ov$Photography or filming fees when communities charge them separately$ov$,
 $ov$Direct donations to schools or families - we channel support through established local programs instead$ov$
 ],
 meta_title = 'Cultural Experiences in Uganda 2026 | Jackfruit Safaris',
 meta_description = 'Real community encounters with Jackfruit Safaris: Batwa forest walks, Jinja craft villages, Bigodi wetland communities and consent-based cultural visits across Uganda.',
 updated_at = now()
where slug = 'cultural-experiences';

update public.experiences
set
 summary = $ov$Private savannah game drives and boat safaris across Uganda''s wildlife parks - Murchison Falls, Queen Elizabeth, Lake Mburo and beyond - paced for couples, families and small groups with an honest, no-rush sightings approach.$ov$,
 description = $ov$Uganda''s savannah parks each have a specialty that routes should respect: Murchison for sheer size plus the thundering Nile gorge; Queen Elizabeth for variety - Kasenyi lions, the Kazinga Channel boat, Kyambura chimps, Ishasha''s tree-climbing lions; Lake Mburo for walk-and-horse access to zebra and giraffe. We plan the sequence so tracking, boats and drive times support each other - the Kazinga boat at golden hour, the Buligi circuit at dawn, a night drive in Mburo - and we will tell you when a park will not deliver what another brochure claims.

Fees are transparent: park entry is US$40 per day at Category A parks (US$45 at Murchison, the top band), the Murchison and Kazinga launch cruises run about US$30 per foreign non-resident, and every rate is periodically revised - the itemized list is confirmed at quotation. Game-drive, walk and night-drive fees are UWA-set per vehicle or per person.$ov$,
 safety_notes = $ov$Remain inside the vehicle during game drives unless the ranger team has briefed a walk plan; night drives run with UWA ranger escorts. Tell us your family''s youngest ages at booking - some boats and night drives have minimum-age guidance$ov$,
 included = array[
 $ov$Private 4x4 safari vehicle (open roof) and professional driver-guide$ov$,
 $ov$Game-drive and boat-cruise fees as itemized in your quote$ov$,
 $ov$Routing that puts dawn drives and dusk boats where they matter most$ov$,
 $ov$Ziwa Rhino Sanctuary rhino tracking on northern loops$ov$,
 $ov$Sits inside every package: 3 Days Murchison, the 10 Days Uganda Circuit, or custom trips$ov$,
 $ov$WhatsApp support for live changes while on safari$ov$
 ],
 excluded = array[
 $ov$Park entry fees when they are itemized separately on fly-in or self-drive options$ov$,
 $ov$Night drives unless added at booking (UWA ranger-escorted)$ov$,
 $ov$Personal gear and wildlife-photography planning (we can advise on both)$ov$
 ],
 meta_title = 'Wildlife Safaris Across Uganda''s Parks 2026 | Jackfruit Safaris',
 meta_description = 'Plan private savannah safaris with Jackfruit Safaris: Murchison Falls, Queen Elizabeth and Lake Mburo - game drives, boat cruises, current fee facts and honest route advice.',
 updated_at = now()
where slug = 'wildlife-safaris';

-- ===========================================================================
-- 3. SAFARI PACKAGES
-- ===========================================================================

update public.safari_packages
set
 highlights = array[
 $ov$One hour with a habituated mountain gorilla family in Bwindi$ov$,
 $ov$Scenic western drive with the Equator stop at Kayabwe included$ov$,
 $ov$Sector-matched lodges and permits: Buhoma, Ruhija, Rushaga or Nkuringo$ov$,
 $ov$Optional Batwa or community walks around your sector$ov$,
 $ov$Private 4x4 with an experienced Jinja-based driver-guide$ov$,
 $ov$Permits secured through licensed operators - every UWA fact briefed up front$ov$
 ],
 included = array[
 $ov$Private 4x4 safari vehicle and fuel for the whole route$ov$,
 $ov$English-speaking driver-guide (our Jinja team), accommodation and meals per itinerary$ov$,
 $ov$One gorilla permit per person when it is included in your quote$ov$,
 $ov$Park entrance fees for the trek day (covered within the gorilla permit)$ov$,
 $ov$Bottled drinking water and trip briefings$ov$,
 $ov$WhatsApp support before and during the trip$ov$
 ],
 excluded = array[
 $ov$International flights and travel insurance$ov$,
 $ov$Uganda visa fees - the tourist eVisa is USD 50 single-entry, applied for online before travel$ov$,
 $ov$Porter services (recommended), ranger tips and personal gear$ov$,
 $ov$Optional Batwa, community or habituation upgrades unless confirmed in writing$ov$
 ],
 itinerary = '[
 {"day": "Day 1", "title": "Entebbe or Kampala to your Bwindi sector", "body": "Your driver-guide collects you from the airport or the hotel between 6 and 8 AM and heads southwest along the paved corridor through Mbarara and Kabale (or via Kanungu when Buhoma is the sector). A proper Equator stop - coffee, photographs, a real break - keeps the 8-9 hour day humane. Arrive, check in, dinner, and an evening sector briefing for tomorrow: boots, gloves, gaiters and the porter question settled ahead of the ranger''s 7 AM roll call.", "meals": "Lunch and dinner"},
 {"day": "Day 2", "title": "Gorilla trekking and the one hour", "body": "Register at the sector headquarters by 7 AM, sit the ranger briefing, then walk 2-6 hours into the forest as your family''s location that morning dictates. Once you reach them, one hour is yours - barely enough time to feel how close you actually are. Return to your lodge for a late lunch and a long shower; if you want tea and community stories instead of a second forest walk, we have both scheduled as options.", "meals": "Breakfast, lunch and dinner"},
 {"day": "Day 3", "title": "Back north - or onward to Lake Bunyonyi", "body": "The straightforward plan: the drive back with lunch en route for an Entebbe or Kampala evening drop. The smart plan when Kigezi permits allow it: Bwindi to Bunyonyi by mid-afternoon, then out via Kigali. Both schedules are discussed at booking so the final night lands where your onward ticket suits.", "meals": "Breakfast and lunch"}
 ]'::jsonb,
 accommodation_options = '[
 {"tier": "Luxury", "options": "Buhoma Lodge, Mahogany Springs or Clouds'' Mountain Gorilla Lodge (sector-matched)"},
 {"tier": "Mid-range", "options": "Silverback Lodge or Ichumbi Gorilla Lodge"},
 {"tier": "Budget", "options": "Buhoma Community Rest Camp or sector lodges at Rushaga"}
 ]'::jsonb,
 permits = '{"permit": "Gorilla permit", "rate": "US$800 foreign non-resident; US$600 low season (Apr/May/Nov 2026, non-reschedulable); habituation US$1,500 (US$1,800 from 1 Jan 2027)", "warning": "Permits are paid in full at booking (UWA rule since 1 March 2026) and sell out furthest for June-September and December-February. We confirm current rates with UWA before you commit."}'::jsonb,
 faq = '[
 {"question": "How much are Uganda gorilla permits in 2026?", "answer": "UWA charges US$800 per foreign non-resident (US$700 for residents, US$500 rest-of-Africa). A US$600 low-season rate applies to April, May and November 2026 treks - announced 26 February 2026 - and those permits are date-specific and cannot be rescheduled. The habituation experience is US$1,500, rising to US$1,800 on 1 January 2027. Rates can change; we confirm with UWA at booking."},
 {"question": "How far in advance should I book?", "answer": "For June-September and December-February, three to six months ahead is the safe window; lodge space follows permit availability. Low-season months open with better availability plus the US$600 permit rate."},
 {"question": "How hard is the trek?", "answer": "It varies - 30 minutes to 6+ hours each way, up and down forest trails. Your fitness shapes the sector choice: Buhoma and Rushaga tend toward gentler walks, Nkuringo is steeper on the day. Porters are strongly recommended and they directly support community wages."},
 {"question": "Can this trip start from Jinja?", "answer": "Yes - it is our home base. A Jinja pickup shifts Day 1 timings by about an hour and we schedule an earlier Equator stop; return timing stays comfortable."},
 {"question": "Which sector will I trek?", "answer": "We match your permit to a sector before booking any lodge - that decision decides trailhead distance, steepness and community options. If a sector is unavailable for your date we say so before you commit rather than sell hope."},
 {"question": "Can I combine gorillas with other parks?", "answer": "Yes. The 10-day circuit combines gorillas with the savannah and chimpanzee parks; a two-day Lake Bunyonyi extension or a Queen Elizabeth Kazinga add-on also works on shorter links."}
 ]'::jsonb,
 permit_rate_warning = $ov$Permit facts verified November 2026 (UWA): foreign non-resident US$800 standard, US$600 low season for April/May/November 2026 (non-reschedulable), habituation US$1,500 (US$1,800 from 1 January 2027). Permits are paid in full at booking. We re-confirm the current UWA tariff at quotation.$ov$,
 updated_at = now()
where slug = '3-days-gorilla-tracking';

update public.safari_packages
set
 highlights = array[
 $ov$Walk with white rhinos on foot at Ziwa Rhino Sanctuary$ov$,
 $ov$Dawn game drives on the Buligi circuits$ov$,
 $ov$Boat safari to the base of Murchison Falls past hippos and elephants$ov$,
 $ov$_Top of the Falls viewpoint - or the Fajao gorge hike up to it$ov$,
 $ov$Uganda''s most bookable short wildlife loop from Entebbe, Kampala or Jinja$ov$,
 $ov$Nubian giraffes at the highest density in Africa$ov$
 ],
 included = array[
 $ov$Private 4x4 with an experienced Jinja-based guide and fuel$ov$,
 $ov$Accommodation and meals per itinerary, two park nights$ov$,
 $ov$Murchison Falls park entry (US$45 FNR per 24 hours) and vehicle fees$ov$,
 $ov$Ziwa Rhino Sanctuary tracking fees$ov$,
 $ov$The Nile launch cruise to the falls base (about US$30 FNR)$ov$,
 $ov$Top of the Falls entrance and guided game drives$ov$
 ],
 excluded = array[
 $ov$International flights, visas (USD 50 e-visa) and travel insurance$ov$,
 $ov$Tips, drinks and personal expenses$ov$,
 $ov$Optional night drives or sport-fishing permits$ov$
 ],
 itinerary = '[
 {"day": "Day 1", "title": "Ziwa rhinos and the road north", "body": "Early pickup from Entebbe, Kampala or Jinja. Track white rhinos on foot at Ziwa Rhino Sanctuary - about two hours, ranger-led, genuinely close. Lunch at Masindi or the sanctuary gate, then into Murchison Falls National Park with a short evening game drive before dinner. Kaniyo-Pabidi chimpanzee tracking (in Budongo Forest Reserve) is a possible add-on with advance permissions.", "meals": "Lunch and dinner"},
 {"day": "Day 2", "title": "Falls, boat and Buligi", "body": "Dawn on the Buligi circuit - the park''s big-game hours. Lunch at the lodge, then the 15:00 launch cruises up the Victoria Nile past hippos, crocodiles and elephants drinking at the bank, all the way to the base of the falls. Walk the Fajao gorge up to the echo point or close the day at the Top of the Falls viewpoint (US$15 vs US$10, ranger arrangements itemized in your quote).", "meals": "Breakfast, lunch and dinner"},
 {"day": "Day 3", "title": "A last drive and the road south", "body": "A final game drive catches anything yesterday missed - oribi, hartebeest, wattled lapwings over the delta tracks. After breakfast the return south with a lunch stop at Masindi; drop-off in Kampala or Entebbe, or link through to Jinja for a Nile evening and a Jinja morning before the flight home.", "meals": "Breakfast and lunch"}
 ]'::jsonb,
 accommodation_options = '[
 {"tier": "Luxury", "options": "Paraa Safari Lodge or Nile Safari Lodge"},
 {"tier": "Mid-range", "options": "Fort Murchison, Murchison River Lodge or Pakuba Safari Lodge"},
 {"tier": "Budget", "options": "Red Chilli Hideaway or Twiga Safari Lodge"}
 ]'::jsonb,
 permits = '{"permit": "Park entry (UWA, per 24 hours)", "rate": "US$45 FNR at Murchison (Category A+); falls launch cruise about US$30; Top of the Falls US$10 viewpoint / US$15 gorge; Ziwa tracking fees included; vehicle and community fees as itemized", "warning": "UWA revises rates periodically; the itemized list is confirmed at quotation."}'::jsonb,
 faq = '[
 {"question": "Can this trip start from Jinja?", "answer": "Yes - it is our home base and the northern road makes Murchison a natural Jinja loop. Pickup runs roughly an hour earlier than the Kampala template."},
 {"question": "How much are the park fees?", "answer": "The UWA tariff (verified November 2026) charges US$45 per foreign non-resident per 24 hours at Murchison - it is the country''s top entry band. The falls launch cruise is around US$30, Top of the Falls US$10 (viewpoint) or US$15 (gorge hike), and Ziwa tracking fees are itemized. Rates are periodically revised; the itemized list is confirmed in your quote."},
 {"question": "When is the best time?", "answer": "December-February and June-July give dry murram roads and game gather by the water. In wetter months some delta tracks slow down and the boat cruise becomes the most reliable wildlife hour."},
 {"question": "Is the rhino tracking at Ziwa included?", "answer": "Yes - sanctuary tracking fees are included in this package''s quote. Ziwa sits on the road north and pairs perfectly with a Masindi lunch."},
 {"question": "What should I pack?", "answer": "Dawn layers, a hat, sunscreen, closed shoes for the Ziwa walk, neutral colors, insect repellent, and small-denomination cash for gate extras and tips."}
 ]'::jsonb,
 permit_rate_warning = $ov$Fee facts template verified November 2026 (UWA): Murchison entry US$45 FNR per 24 hours; falls launch cruise about US$30. Rates are periodically revised and reconfirmed at quotation.$ov$,
 updated_at = now()
where slug = '3-days-murchison-falls';

update public.safari_packages
set
 highlights = array[
 $ov$Gorilla trekking in Bwindi with sector-matched lodges and permits$ov$,
 $ov$Chimpanzee tracking in Kibale, Uganda''s primate capital$ov$,
 $ov$Kazinga Channel boat safari and Kasenyi game drives in Queen Elizabeth$ov$,
 $ov$Boat safari to the base of Murchison Falls and the Nile diversion channels$ov$,
 $ov$Rhino tracking at Ziwa, crater-lake country, Lake Mburo and a Lake Bunyonyi slow night$ov$,
 $ov$One route that covers Uganda''s iconic landscapes without rushed drives$ov$
 ],
 included = array[
 $ov$Private 4x4 and guide throughout - fuel, driver accommodation all on us$ov$,
 $ov$Park entry fees and the permits listed on this itinerary$ov$,
 $ov$Lodges and meals per itinerary at the tier you choose$ov$,
 $ov$All activity fees named on the itinerary (Kazinga boat, Buligi drives, Mburo boat and walks)$ov$,
 $ov$Bottled drinking water, route briefings, WhatsApp support$ov$,
 $ov$Flexible out-route: Kigali departure or the northern loop to Entebbe$ov$
 ],
 excluded = array[
 $ov$International flights, visas (~USD 50 e-visa) and travel insurance$ov$,
 $ov$Tips, drinks and personal expenses$ov$,
 $ov$Kyambura Gorge chimp permits when you add that optional morning$ov$
 ],
 itinerary = '[
 {"day": "Day 1", "title": "Jinja or Entebbe to Lake Mburo", "body": "Morning pickup in Jinja (our home base) or Entebbe. Lake Mburo by mid-afternoon: an acacia-country walk safari with zebra and giraffe lead by our guide, an afternoon boat across the lake, and a lakeside dinner with your first real introduction to Uganda''s savannah pace.", "meals": "Lunch and dinner"},
 {"day": "Day 2", "title": "Mburo morning to Kibale forest", "body": "Early walk or horseback among the herds, then the drive west to Kibale with a crater-country sunset before the Fort Portal night.", "meals": "Breakfast, lunch and dinner"},
 {"day": "Day 3", "title": "Chimpanzee tracking in Kibale", "body": "Early briefing at Kanyanchu and the half-day trek that Uganda does best - a habituated community, working through the fig canopy. Afternoon offers Bigodi''s wetland, a restful lodge afternoon, or the crater walks; your call, priced ahead.", "meals": "Breakfast, lunch and dinner"},
 {"day": "Day 4", "title": "Kibale to Queen Elizabeth (Kasenyi)", "body": "Drive south into Queen Elizabeth NP, run the Kasenyi circuit late afternoon for kob leks and lion work, and reach Mweya before dark.", "meals": "Breakfast, lunch and dinner"},
 {"day": "Day 5", "title": "Kazinga Channel boat and crater country", "body": "An early game drive, then the two-hour Kazinga Channel launch - Uganda''s densest and most photographed wildlife hour. Afternoon options: crater-drive, a community visit, or slow time on the channel rim.", "meals": "Breakfast, lunch and dinner"},
 {"day": "Day 6", "title": "Kyambura or Ishasha to Bwindi", "body": "Optional Kyambura Gorge chimp tracking at first light (UWA permits US$100 FNR, arranged separately), then the drive to Bwindi (3-4 hours depending on the sector). Check-in and sector briefing before dinner.", "meals": "Breakfast, lunch and dinner"},
 {"day": "Day 7", "title": "Gorilla trekking in Bwindi", "body": "The day that anchors the route: the 7 AM briefing, 2-6 hours of forest tracking, then the hour that made you plan the trip. Return for a late lunch; an optional Batwa or community walk keeps the afternoon quiet after your legs have earned it.", "meals": "Breakfast, lunch and dinner"},
 {"day": "Day 8", "title": "Bwindi to Lake Bunyonyi", "body": "A slow highland morning, then on to Bunyonyi: swim in swim-safe water, paddle a dugout to the islands, and take the best night''s sleep of the whole trip on the shore.", "meals": "Breakfast, lunch and dinner"},
 {"day": "Day 9", "title": "South or north - pick your exit", "body": "The quiet Kigezi morning, then the plan decided at booking: north via Mbarara (a Lake Mburo stop with option for a horseback ride), or south, over the border for a Kigali airport departure. Both routes are priced within the same package.", "meals": "Breakfast, lunch and dinner"},
 {"day": "Day 10", "title": "Northern loop day or return", "body": "For the northern exit: Ziwa rhinos on foot, Murchison Falls game drives and the Nile boat safari (an extra night lets the launch sit at its own unhurried pace), or the final smooth drive to Entebbe with a Jinja parting evening. Full routing is locked with you at itinerary sign-off.", "meals": "Breakfast and lunch"}
 ]'::jsonb,
 accommodation_options = '[
 {"tier": "Luxury", "options": "Mihingo Lodge (Mburo), Kyaninga or Ndali Lodge (Kibale), Mweya Safari Lodge (QE), Buhoma Lodge or Clouds'' (Bwindi), Birdnest or Arcadia (Bunyonyi)"},
 {"tier": "Mid-range", "options": "Rwakobo Rock or Igongo (Mburo), Primate Lodge Kanyanchu (Kibale), Enganzi or Twin Lakes (QE), Silverback or Ichumbi (Bwindi), Birdnest @ Bunyonyi"},
 {"tier": "Budget", "options": "Rwakobo Rock budget rooms (Mburo), Chimpanzee Forest Guesthouse (Kibale), Bushara camp (Bunyonyi) - and sector lodges grouped for the Bwindi trek"}
 ]'::jsonb,
 permits = '{"permit": "All permits on this route", "rate": "Gorilla US$800 FNR (US$600 in Apr/May/Nov 2026); Kibale chimpanzee from US$250; park entries US$40 per 24h (US$45 Murchison); launch cruises about US$30; Kyambura optional add-on US$100", "warning": "Rates are periodically revised by UWA and lodges; the itemized list is confirmed at quotation."}'::jsonb,
 faq = '[
 {"question": "Which order do the parks run in?", "answer": "Jinja or Entebbe -> Lake Mburo -> Kibale -> Queen Elizabeth -> Bwindi -> Lake Bunyonyi -> (north to Entebbe, or south to Kigali). The order keeps drive legs within five hours and supports the permit date rather than competing with it; the reverse order also works, and the gorilla permit week is what fixes the middle of the trip."},
 {"question": "When should I book?", "answer": "Gorilla permits anchor the whole route: three to six months ahead for June-September and December-February, or two to three months for the low-season months - where the Apr/May/Nov 2026 permits cost US$600. Lodge nights follow the permit weeks."},
 {"question": "Is this a rushed 10-day route?", "answer": "No - drive legs sit around four to five hours and each permit-anchored morning is followed by an unhurried lodge afternoon. The only option-heavy leg is the northern loop day, and that leg is scoped with you at booking."},
 {"question": "What does the package cost include?", "answer": "Private 4x4 and guide throughout, park entry fees, all permits named on the itinerary, listed lodges and meals per day, and the activity fees on the itinerary. International flights, visas (~USD 50 e-visa) and tips are excluded; the full exclusion list is itemized in the quote."},
 {"question": "Can families do this route?", "answer": "Yes with pacing: boats welcome children, and the gorilla permit carries a minimum age of 15. For younger families we scope a 4x4 with safety seats and pace the walking days around the boat and park rhythm."}
 ]'::jsonb,
 permit_rate_warning = $ov$Permit facts verified November 2026 (UWA): Bwindi gorilla US$800 FNR (US$600 low season, non-reschedulable); Kibale chimpanzee from US$250; park entry US$40 per 24 hours (US$45 at Murchison). Rates are periodically revised - the full itemized quote is confirmed at booking.$ov$,
 updated_at = now()
where slug = '10-days-uganda-safari';

-- ===========================================================================
-- 4. NEW EXPERIENCE: chimpanzee tracking!
--    Adds depth to the listing grid and gives the Kibale/Queen Elizabeth
--    quick-links an honest target (they pointed at the gorilla page).
-- ===========================================================================

insert into public.experiences (
  slug, name, category, summary, description, location, duration,
  price_from, currency, provider, safety_notes, included, excluded, gallery,
  cta_label, cta_url, status, order_column, meta_title, meta_description
) values (
 'chimpanzee-tracking', 'Chimpanzee Tracking in Uganda', 'Wildlife',
 'Meet a habituated chimpanzee community on a half-day forest trek - in Kibale, the Kyambura Gorge, or Budongo''s Kaniyo-Pabidi - with permit facts, group logistics and the pairing advice only a local planner adds.',
 $ov$Uganda offers chimpanzee tracking in several distinct settings that a route should choose between, not merge: Kibale National Park gives you East Africa''s highest half-day success rate inside a pure rainforest trek; Queen Elizabeth''s Kyambura Gorge is a short but atmospheric descent into a sunken river forest at the savannah''s edge; and Budongo''s Kaniyo-Pabidi (en route to Murchison) puts chimp tracking on the northern loop between Ziwa and the park gates. Each runs under different management and permits, which is exactly why one "chimp day" price is never honest across them.

For 2026, UWA''s tariff cycle lists Kibale chimpanzee tracking from US$250 per foreign non-resident, Kyambura Gorge from US$100, and Budongo runs as a forestry-reserve concession around US$120-130. Published rates shift between tariff periods so we confirm the exact rate with the issuing authority before you pay. Trek firmness grows in September and February (fruiting lulls push the community deeper and make the walk more demanding), while the June rains keep the canopy at its greenest. Gumboots and porters solve Kibale''s muddier trails, and Kyambura rewards shoes that grip the descent scree.

Our Jinja team books the permits, matches the trek to your route (not the other way around) and pairs the forest morning with what the region does best afterward - Bigodi''s wetlands, the Kasenyi plains, or the Nile''s Bujagali stretch, all inside the same day''s drive.$ov$,
 'Kibale National Park; Kyambura Gorge (Queen Elizabeth NP); Kaniyo-Pabidi (Budongo)',
 'About 3-4 hours door to door, trek 2-4 hours',
 250, 'USD',
 'Jackfruit Safaris routes and books; permits issued by UWA and forestry-reserve concessionaires',
 $ov$Ranger escorts accompany every trek. Keep 8 metres from the chimps where regulations require; masks and quiet conduct are briefed at the trailhead. Tell us about knee or ankle issues before booking - Budongo and Kibale keep the forest flat, Kyambura descends a gorge to reach it.$ov$,
 array[
   $ov$Permit procurement through UWA-licensed handling where required$ov$,
   $ov$Private road access from Kampala, Jinja or your Queen Elizabeth lodge$ov$,
   $ov$Trek choice by destination (Kibale, Kyambura, Budongo) matched to the rest of your route$ov$,
   $ov$Bigodi Wetland pairing after the Kibale trek$ov$,
   $ov$Bundled into the 3-day and 10-day circuits with nearby parks$ov$,
   $ov$WhatsApp support before and during the trek day$ov$
 ],
 array[
   $ov$International flights, the Uganda tourist visa (USD 50) and travel insurance$ov$,
   $ov$Charges for activities not named on your route, such as the Kyambura permit when you track in Kibale instead$ov$
 ],
 '[]'::jsonb,
 'Plan this trek', '/request-quote',
 'published', 5,
 'Chimpanzee Tracking in Uganda 2026 | Jackfruit Safaris',
 'Book chimpanzee tracking in Kibale, Kyambura Gorge or Budongo with Jackfruit Safaris: 2026 permit facts, half-day logistics and pairing advice from a Jinja-based team.'
) on conflict (slug) do nothing;

-- Repoint the Kibale / Queen Elizabeth hero quick-links at the new record
update public.page_heroes
set
  quick_links = case
    when quick_links is null then quick_links
    else replace(quick_links::text,
                 '"label":"Chimp Tracking","href":"/experiences/gorilla-trekking"',
                 '"label":"Chimp Tracking","href":"/experiences/chimpanzee-tracking"')::jsonb
  end,
  updated_at = now()
where quick_links::text like '%/experiences/gorilla-trekking%'
  and page_slug like '/destinations/%';
