import {
  Binoculars,
  CalendarCheck,
  Camera,
  Car,
  CircleDollarSign,
  Compass,
  HeartHandshake,
  Map,
  MessageCircle,
  Mountain,
  ShieldCheck,
  Sparkles,
  Star,
  Trees,
  Waves,
} from "lucide-react";

export type IconName =
  | "binoculars"
  | "calendar"
  | "camera"
  | "car"
  | "cash"
  | "compass"
  | "heart"
  | "map"
  | "message"
  | "mountain"
  | "shield"
  | "sparkles"
  | "star"
  | "trees"
  | "waves";

export const iconMap = {
  binoculars: Binoculars,
  calendar: CalendarCheck,
  camera: Camera,
  car: Car,
  cash: CircleDollarSign,
  compass: Compass,
  heart: HeartHandshake,
  map: Map,
  message: MessageCircle,
  mountain: Mountain,
  shield: ShieldCheck,
  sparkles: Sparkles,
  star: Star,
  trees: Trees,
  waves: Waves,
} satisfies Record<IconName, typeof Binoculars>;

export const site = {
  name: "Jackfruit Safaris",
  shortName: "Jackfruit Safaris",
  email: "jackfruitsafarisuganda@gmail.com",
  phone: "+256 772 550 268",
  alternatePhone: "+256 752 550 268",
  location: "Craft Village, Jinja, Uganda",
  hours: "9 AM - 5 PM, with WhatsApp support for travel inquiries",
  whatsappHref:
    "https://wa.me/256772550268?text=Hello%20Jackfruit%20Safaris%2C%20I%20would%20like%20help%20planning%20a%20Uganda%20trip.",
};

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Safaris", href: "/safaris" },
  { label: "Destinations", href: "/destinations" },
  { label: "Experiences", href: "/experiences/gorilla-trekking" },
  { label: "About", href: "/about" },
  { label: "Travel Guide", href: "/travel-guide" },
];

export type NavItem = (typeof navItems)[number];

function isNavItem(item: unknown): item is NavItem {
  if (!item || typeof item !== "object") return false;

  const candidate = item as Record<string, unknown>;
  return (
    typeof candidate.label === "string" &&
    candidate.label.trim().length > 0 &&
    typeof candidate.href === "string" &&
    candidate.href.trim().length > 0
  );
}

export function resolveNavItems(items: unknown): NavItem[] {
  const cmsItems = Array.isArray(items) ? items.filter(isNavItem) : [];
  return cmsItems.length > 0 ? cmsItems : navItems;
}

export const images = {
  hero:
    "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=2200&q=82",
  gorilla:
    "https://images.unsplash.com/photo-1549366021-9f761d040a94?auto=format&fit=crop&w=1600&q=82",
  falls:
    "https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1600&q=82",
  nile:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=82",
  savannah:
    "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=82",
  culture:
    "https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&w=1600&q=82",
  vehicle:
    "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=82",
  lake:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=82",
  forest:
    "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=82",
};

export const trustItems = [
  "2024 Tripadvisor Travelers' Choice Award",
  "Registered tour company based in Jinja, Uganda",
  "Private and custom safari planning",
  "WhatsApp support before and during your trip",
];

export type ImageAlignment = "left" | "right" | "center" | null;

export type HighlightWithImage = {
  text: string;
  image_url?: string | null;
  image_alignment?: ImageAlignment;
};

export type SafariPageSection = {
  key: string;
  title?: string | null;
  body?: string | null;
  image_url?: string | null;
  image_alignment?: ImageAlignment;
};

export type SafariDayWithImage = {
  day: string;
  title: string;
  body: string;
  meals?: string;
  image_url?: string | null;
  image_alignment?: ImageAlignment;
};

export type Safari = {
  slug: string;
  title: string;
  duration: string;
  route: string;
  startEnd: string;
  summary: string;
  price: string;
  comfort: string;
  bestFor: string;
  image: string;
  highlights: string[];
  itinerary: { day: string; title: string; body: string; meals: string }[];
  accommodations: { tier: string; options: string }[];
  included: string[];
  excluded: string[];
  faqs: { question: string; answer: string }[];
  seoTitle: string;
  seoDescription: string;
  note?: string;
};

export const safaris: Safari[] = [
  {
    slug: "3-days-gorilla-tracking",
    title: "3 Days Gorilla Tracking Safari",
    duration: "3 days",
    route: "Entebbe/Kampala - Bwindi - Entebbe/Kampala",
    startEnd: "Starts in Entebbe, Kampala, or by request from Jinja",
    summary:
      "A focused Bwindi journey for travelers who want one unforgettable hour with mountain gorillas, supported by a private driver-guide, permit planning, and lodge options.",
    price: "from USD 1,250 per person",
    comfort: "Budget, mid-range, or luxury",
    bestFor: "Gorilla trekking travelers with limited time",
    image: images.gorilla,
    highlights: [
      "Scenic drive through western Uganda",
      "Equator stop at Kayabwe",
      "Gorilla trekking in Bwindi Impenetrable National Park",
      "Optional Batwa or community walk",
      "Private 4x4 safari vehicle and driver-guide",
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Entebbe or Kampala to Bwindi",
        body: "Your Jackfruit Safaris driver-guide collects you from your hotel or Entebbe International Airport. Travel southwest through rolling hills, farms, trading centers, and traditional homesteads, with a photo stop at the Equator before arriving near Bwindi in the evening.",
        meals: "Lunch and dinner",
      },
      {
        day: "Day 2",
        title: "Gorilla trekking in Bwindi",
        body: "After an early breakfast, transfer to park headquarters for briefing. Trek with Uganda Wildlife Authority rangers for roughly 2 to 6 hours depending on the gorilla family's location. Once found, you spend the permitted hour observing them before returning to the lodge.",
        meals: "Breakfast, lunch, and dinner",
      },
      {
        day: "Day 3",
        title: "Return to Kampala or Entebbe",
        body: "Begin the return drive after breakfast, with lunch en route and evening drop-off in Kampala or Entebbe.",
        meals: "Breakfast and lunch",
      },
    ],
    accommodations: [
      { tier: "Luxury", options: "Buhoma Lodge or Mahogany Springs" },
      { tier: "Mid-range", options: "Silverback Lodge or Ichumbi Gorilla Lodge" },
      {
        tier: "Budget",
        options: "Rushaga Gorilla Camp or Buhoma Community Rest Camp",
      },
    ],
    included: [
      "Transport in a private 4x4 safari vehicle",
      "English-speaking driver-guide",
      "Accommodation and meals as listed",
      "One gorilla trekking permit per person when included in quote",
      "Park entrance fees",
      "Bottled drinking water",
    ],
    excluded: [
      "International flights",
      "Visa fees",
      "Travel insurance",
      "Tips and personal expenses",
      "Optional cultural or community activities unless confirmed",
    ],
    faqs: [
      {
        question: "How hard is gorilla trekking?",
        answer:
          "Trekking can be moderate to challenging depending on the gorilla family's location, trail condition, and weather. Porters are strongly recommended.",
      },
      {
        question: "When should I book my permit?",
        answer:
          "Book as early as possible, especially for high season. Permits are limited and must be confirmed before the trip is final.",
      },
      {
        question: "Can this trip start from Jinja?",
        answer:
          "Yes. A Jinja start is possible, but it adds road time and may need an adjusted pickup schedule or an extra night.",
      },
    ],
    seoTitle:
      "3 Days Gorilla Tracking Safari in Uganda | Bwindi Gorilla Trek",
    seoDescription:
      "Plan a private 3-day Uganda gorilla trekking safari to Bwindi with Jackfruit Safaris, including permit guidance, 4x4 transport, lodge options, and local support.",
    note:
      "Gorilla permit rates and lodge availability must be verified with current Uganda Wildlife Authority and lodge tariffs before final quotation.",
  },
  {
    slug: "3-days-murchison-falls",
    title: "3 Days Murchison Falls Safari",
    duration: "3 days",
    route: "Kampala/Entebbe - Ziwa - Murchison Falls - Kampala/Entebbe",
    startEnd: "Starts in Kampala or Entebbe",
    summary:
      "A classic short Uganda wildlife safari with Ziwa rhinos, savannah game drives, a Nile boat cruise, and the dramatic top of Murchison Falls.",
    price: "from USD 850 per person",
    comfort: "Budget, mid-range, or luxury",
    bestFor: "First-time safari travelers and short stays",
    image: images.falls,
    highlights: [
      "Rhino tracking at Ziwa Rhino Sanctuary",
      "Game drives in Murchison Falls National Park",
      "Nile boat cruise to the base of the falls",
      "Top of the Falls viewpoint or hike",
      "Chance to see elephants, giraffes, lions, buffaloes, hippos, and birds",
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Ziwa Rhino Sanctuary and Murchison Falls",
        body: "Pick up after breakfast and drive north. Track rhinos at Ziwa Rhino Sanctuary, continue via Masindi for lunch, then enter Murchison Falls National Park with a short evening game drive if time allows.",
        meals: "Lunch and dinner",
      },
      {
        day: "Day 2",
        title: "Game drive, Nile boat cruise, and Top of the Falls",
        body: "Start early on the Buligi Circuit, then take an afternoon boat cruise toward the base of the falls. Watch for hippos, crocodiles, elephants, and river birds before visiting the Top of the Falls if timing allows.",
        meals: "Breakfast, lunch, and dinner",
      },
      {
        day: "Day 3",
        title: "Morning game drive and return",
        body: "Enjoy a final game drive or Top of the Falls visit, then return to Kampala or Entebbe with lunch en route.",
        meals: "Breakfast and lunch",
      },
    ],
    accommodations: [
      { tier: "Luxury", options: "Paraa Safari Lodge" },
      { tier: "Mid-range", options: "Pakuba Safari Lodge" },
      { tier: "Budget", options: "Hornbill Bush Lodge" },
    ],
    included: [
      "4x4 Land Cruiser with pop-up roof",
      "Professional English-speaking guide",
      "Accommodation and meals as listed",
      "Ziwa Rhino Sanctuary tracking fees",
      "Murchison Falls park entry",
      "Game drives and Nile boat cruise",
      "Bottled drinking water",
    ],
    excluded: [
      "International flights",
      "Visa fees",
      "Travel insurance",
      "Personal expenses",
      "Tips, alcohol, and laundry",
    ],
    faqs: [
      {
        question: "Is this safari suitable for children?",
        answer:
          "Yes, it can work well for families because the route is compact and varied. Age rules may apply to some activities.",
      },
      {
        question: "Can I add Jinja before or after?",
        answer:
          "Yes. Jinja pairs well with arrival or departure days if you want Nile activities or a relaxed extension.",
      },
    ],
    seoTitle:
      "3 Days Murchison Falls Safari | Ziwa Rhinos, Game Drives and Nile Cruise",
    seoDescription:
      "Book a private 3-day Murchison Falls safari with Jackfruit Safaris, including Ziwa rhino tracking, game drives, Nile boat cruise, and local guide support.",
  },
  {
    slug: "10-days-uganda-safari",
    title: "10 Days Uganda Safari",
    duration: "10 days",
    route:
      "Entebbe - Lake Mburo - Kibale - Queen Elizabeth - Ishasha - Bwindi - Lake Bunyonyi - Entebbe",
    startEnd: "Starts and ends in Entebbe",
    summary:
      "Jackfruit Safaris' complete Uganda circuit, combining savannah wildlife, chimpanzees, gorillas, boat cruises, crater landscapes, and lakeside rest.",
    price: "from USD 2,950 per person",
    comfort: "Comfortable mid-range, with upgrades available",
    bestFor: "Travelers wanting Uganda's strongest first-time circuit",
    image: images.savannah,
    highlights: [
      "Lake Mburo wildlife and nature walk",
      "Chimpanzee tracking in Kibale Forest",
      "Kazinga Channel boat cruise",
      "Queen Elizabeth and Ishasha game drives",
      "Gorilla trekking in Bwindi",
      "Lake Bunyonyi relaxation",
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Entebbe",
        body: "Meet your guide on arrival and transfer to your Entebbe hotel for rest after the flight.",
        meals: "Dinner depending on arrival time",
      },
      {
        day: "Day 2",
        title: "Entebbe to Lake Mburo",
        body: "Travel through central Uganda with an Equator stop, then continue to Lake Mburo for an afternoon game drive.",
        meals: "Breakfast, lunch, and dinner",
      },
      {
        day: "Day 3",
        title: "Lake Mburo nature walk and transfer to Kibale",
        body: "Begin with a guided nature walk, then transfer toward the forested landscapes around Kibale.",
        meals: "Breakfast, lunch, and dinner",
      },
      {
        day: "Day 4",
        title: "Chimpanzee tracking and Bigodi Wetland",
        body: "Track chimpanzees in Kibale Forest and visit Bigodi Wetland for birds, community stories, and local conservation.",
        meals: "Breakfast, lunch, and dinner",
      },
      {
        day: "Day 5",
        title: "Kibale to Queen Elizabeth",
        body: "Travel to Queen Elizabeth National Park and take the Kazinga Channel boat cruise.",
        meals: "Breakfast, lunch, and dinner",
      },
      {
        day: "Day 6",
        title: "Queen Elizabeth to Ishasha",
        body: "Enjoy a morning game drive, then continue toward Ishasha in search of tree-climbing lions.",
        meals: "Breakfast, lunch, and dinner",
      },
      {
        day: "Day 7",
        title: "Ishasha to Bwindi",
        body: "Take a final Ishasha game drive before transferring to the Bwindi sector matched to your gorilla permit.",
        meals: "Breakfast, lunch, and dinner",
      },
      {
        day: "Day 8",
        title: "Gorilla trekking in Bwindi",
        body: "Trek with UWA rangers and spend the permitted hour with mountain gorillas. Add a community walk if energy and timing allow.",
        meals: "Breakfast, lunch, and dinner",
      },
      {
        day: "Day 9",
        title: "Bwindi to Lake Bunyonyi",
        body: "Continue to Lake Bunyonyi for a canoe ride, views, and a gentler final night after trekking.",
        meals: "Breakfast, lunch, and dinner",
      },
      {
        day: "Day 10",
        title: "Lake Bunyonyi to Entebbe",
        body: "Return to Entebbe for departure, with stops planned around flight timing.",
        meals: "Breakfast and lunch",
      },
    ],
    accommodations: [
      {
        tier: "Mid-range",
        options:
          "Comfortable safari lodges matched to each park sector and activity location",
      },
      {
        tier: "Luxury upgrades",
        options:
          "Premium lodges available in Bwindi, Queen Elizabeth, Kibale, and Lake Mburo",
      },
      {
        tier: "Budget adjustments",
        options:
          "Simpler lodge choices can reduce cost while keeping the route private",
      },
    ],
    included: [
      "All airport transfers",
      "Ground transport in 4x4 safari Land Cruiser",
      "English-speaking professional guide",
      "Accommodation and meals as listed",
      "Park entrance fees",
      "Gorilla and chimp permits when included in quote",
      "Boat cruises and listed activities",
      "Bottled drinking water",
    ],
    excluded: [
      "International flights",
      "Visa fees",
      "Travel insurance",
      "Tips, drinks, laundry, and personal expenses",
      "Optional activities not listed as included",
    ],
    faqs: [
      {
        question: "Is this route rushed?",
        answer:
          "It is a full itinerary, but the routing follows a logical Uganda circuit. Travelers wanting a slower pace can add one or two nights.",
      },
      {
        question: "Can it be luxury?",
        answer:
          "Yes. Lodge upgrades and domestic flight segments can make the journey more comfortable.",
      },
    ],
    seoTitle:
      "10 Days Uganda Safari | Gorillas, Chimps, Queen Elizabeth and Lake Mburo",
    seoDescription:
      "Explore Uganda on a private 10-day safari circuit with Jackfruit Safaris, including Lake Mburo, Kibale chimps, Queen Elizabeth, Bwindi gorillas, and Lake Bunyonyi.",
  },
  {
    slug: "custom-uganda-safari",
    title: "Custom Uganda Safari Planning",
    duration: "Custom",
    route: "Built around your dates, pace, interests, and budget",
    startEnd: "Flexible starts from Entebbe, Kampala, Jinja, or by request",
    summary:
      "A tailored planning service for gorilla trekking, wildlife, photography, culture, Jinja adventure, family travel, group transport, and smooth Uganda logistics.",
    price: "quoted after dates and preferences",
    comfort: "Budget to luxury",
    bestFor: "Families, couples, groups, solo travelers, NGOs, and agents",
    image: images.nile,
    highlights: [
      "Gorilla trekking plus Lake Bunyonyi",
      "Murchison Falls plus Jinja and Source of the Nile",
      "Kibale chimpanzees plus Queen Elizabeth wildlife",
      "Family-friendly safari pacing",
      "Airport transfers, Jinja activities, and group logistics",
    ],
    itinerary: [
      {
        day: "Step 1",
        title: "Share your travel details",
        body: "Tell us your dates, group size, budget, comfort level, and must-do experiences.",
        meals: "Not applicable",
      },
      {
        day: "Step 2",
        title: "Receive a recommended route",
        body: "Jackfruit Safaris suggests a realistic route, lodge level, activity plan, and price guidance.",
        meals: "Not applicable",
      },
      {
        day: "Step 3",
        title: "Confirm permits, lodges, and transport",
        body: "Once the route feels right, the team checks live availability and confirms the details before payment.",
        meals: "Not applicable",
      },
    ],
    accommodations: [
      { tier: "Budget", options: "Simple guesthouses, camps, and practical safari lodges" },
      { tier: "Mid-range", options: "Comfortable lodges with private bathrooms and reliable service" },
      { tier: "Luxury", options: "Premium lodges or tented camps with strong locations and service" },
    ],
    included: [
      "Custom route design",
      "Permit and lodge availability checks",
      "Private guide and transport planning",
      "Detailed quotation with inclusions and exclusions",
      "WhatsApp and email support",
    ],
    excluded: [
      "Items not selected in your final quote",
      "Government fee increases after quotation",
      "International flights, visas, and insurance",
    ],
    faqs: [
      {
        question: "How quickly can I get a quote?",
        answer:
          "Simple trips can often be estimated quickly, while gorilla permits and specific lodges require availability checks.",
      },
      {
        question: "Can Jackfruit work with agents or NGOs?",
        answer:
          "Yes. The team can support group transport, Jinja logistics, safari add-ons, and visiting teams.",
      },
    ],
    seoTitle: "Custom Uganda Safari Planning | Jackfruit Safaris",
    seoDescription:
      "Request a custom Uganda safari quote from Jackfruit Safaris for gorilla trekking, wildlife, Jinja adventures, family travel, transport, and group logistics.",
  },
];

export const experiences = [
  {
    slug: "gorilla-trekking",
    title: "Gorilla Trekking in Uganda",
    icon: "trees" as IconName,
    image: images.gorilla,
    summary:
      "Plan a safe, well-supported trek to see mountain gorillas in Bwindi or Mgahinga with permit guidance, lodge advice, and local transport.",
    bullets: [
      "Bwindi and Mgahinga permit guidance",
      "Fitness, packing, and trekking expectations",
      "Sector-aware lodge and route planning",
      "Recommended tours: 3 Days Gorilla, 10 Days Uganda, Custom Safari",
    ],
  },
  {
    slug: "jinja-adventures",
    title: "Jinja Activities and Nile Adventures",
    icon: "waves" as IconName,
    image: images.nile,
    summary:
      "Make the most of Uganda's adventure capital with cycling, rafting, horse riding, ziplining, bungee jumping, Source of the Nile visits, and local experiences.",
    bullets: [
      "White water rafting and kayaking on the Nile",
      "Cycling tours through villages and plantations",
      "Horse riding, zipline, bungee, and city craft visits",
      "Easy add-on before or after a safari",
    ],
  },
  {
    slug: "cultural-experiences",
    title: "Cultural Experiences in Uganda",
    icon: "heart" as IconName,
    image: images.culture,
    summary:
      "Add meaning to your safari through local food, community visits, crafts, storytelling, village life, and respectful cultural encounters.",
    bullets: [
      "Community walks near Bwindi",
      "Batwa cultural experiences where appropriate",
      "Jinja craft village and local food tasting",
      "Village, market, plantation, music, and storytelling visits",
    ],
  },
  {
    slug: "wildlife-safaris",
    title: "Wildlife Safaris",
    icon: "binoculars" as IconName,
    image: images.savannah,
    summary:
      "Explore Murchison Falls, Queen Elizabeth, Lake Mburo, and other wildlife regions with private game drives, boat cruises, and local guides.",
    bullets: [
      "Savannah game drives and boat safaris",
      "Rhino tracking at Ziwa on northern routes",
      "Elephants, giraffes, buffaloes, hippos, antelopes, lions, and birds",
      "Private pacing for couples, families, and groups",
    ],
  },
];

export const destinations = [
  {
    slug: "bwindi-impenetrable-national-park",
    name: "Bwindi Impenetrable National Park",
    region: "Southwestern Uganda",
    image: images.gorilla,
    summary:
      "Uganda's iconic mountain gorilla trekking destination, with forest trails, sector-sensitive lodge choices, community visits, and powerful conservation value.",
    overview:
      "Bwindi Impenetrable National Park protects the mist-shrouded montane forest home to roughly half the world's remaining mountain gorillas. A UNESCO World Heritage Site, the park covers 331 km² of dense jungle on Uganda's southwestern border, where ancient trees, orchids, and over 300 bird species create a pristine safari wilderness.",
    whyGo: ["Mountain gorillas", "Rainforest trekking", "Batwa and community experiences"],
    howToGetThere: [
      "From Kampala: 8–9 hour drive via Mbarara and the western Rift Valley",
      "From Entebbe: 9–10 hour drive via Masaka and Mbarara",
      "Domestic flights: Kihihi airstrip (charter from Entebbe or Kajjansi)",
      "Recommended: combine with Lake Bunyonyi for post-trek relaxation",
    ],
    keyHighlights: [
      { title: "Gorilla Family Tracking", description: "Spend one unforgettable hour observing endangered mountain gorillas in their natural habitat, guided by Uganda Wildlife Authority rangers.", image: images.gorilla },
      { title: "Batwa Cultural Experience", description: "Walk with the Batwa people, Uganda's forest-dwelling ancestors, and learn their traditional ways of living in the jungle.", image: images.culture },
      { title: "Bwindi Birdlife", description: "With over 300 bird species including the Rwenzori turaco, the forest is a birder's paradise.", image: images.forest },
      { title: "Forest Nature Walks", description: "Guided trails through the montane forest reveal orchids, ferns, and other endemic flora.", image: images.hero },
    ],
    bestTime:
      "Drier months usually make trekking footing easier, while greener months can be scenic and quieter.",
    nights: "2-3 nights depending on route and comfort",
  },
  {
    slug: "murchison-falls-national-park",
    name: "Murchison Falls National Park",
    region: "Northwestern Uganda",
    image: images.falls,
    summary:
      "A strong short-safari choice with Nile boat cruises, big game, giraffes, elephants, hippos, crocodiles, and the dramatic Top of the Falls.",
    overview:
      "Murchison Falls National Park is Uganda's largest protected area at 3,840 km², spanning savannah, woodland, and wetlands along the Victoria Nile. The park's centerpiece is the dramatic Murchison Falls, where the Nile squeezes through a 7-meter gorge before thundering into a spectacular cascade.",
    whyGo: ["Nile boat cruise", "Game drives", "Ziwa rhino pairing"],
    howToGetThere: [
      "From Kampala: 300 km via Masindi — 6+ hour drive (roads now paved)",
      "From Fort Portal: 320 km via Hoima — 6+ hour drive",
      "Domestic flights: Pakuba Airfield via AeroLink from Entebbe or Kajjansi",
      "Charter flights also available from Entebbe or Kajjansi",
    ],
    keyHighlights: [
      { title: "Murchison Falls", description: "Watch 300 cubic meters of water plunge through a 7-meter gorge in a breathtaking display of raw power and mist.", image: images.falls },
      { title: "Nile Boat Safari", description: "Cruise to the base of the falls and witness hippos, crocodiles, elephants, and river birds along the scenic waterway.", image: images.nile },
      { title: "Ziwa Rhino Sanctuary", description: "Track endangered southern white rhinos with expert guides on guided rhino walks.", image: images.savannah },
      { title: "Top of the Falls", description: "Hike 500 steps to the viewpoint for dramatic perspectives of the cascade and rainbow over the gorge.", image: images.falls },
    ],
    bestTime:
      "December to February (dry season) for excellent wildlife viewing; June to September (high season) for peak conditions.",
    nights: "2-3 nights",
  },
  {
    slug: "queen-elizabeth-national-park",
    name: "Queen Elizabeth National Park",
    region: "Western Uganda",
    image: images.savannah,
    summary:
      "A varied park for game drives, Kazinga Channel cruises, crater scenery, and Ishasha tree-climbing lion searches.",
    overview:
      "Queen Elizabeth National Park spans 1,978 km² at the intersection of the Albertine Rift and the Great Lakes, offering Uganda's most diverse safari experiences. The park is home to all the Big Five except rhino and is famous for tree-climbing lions in Ishasha and the Kazinga Channel boat cruise.",
    whyGo: ["Kazinga Channel", "Ishasha sector", "Crater landscapes"],
    howToGetThere: [
      "From Kampala: 380 km via Mbarara — 6–7 hour drive",
      "From Entebbe: 6–7 hour drive via Masaka and Mbarara",
      "Domestic flights: Kihihi or Mbarara airstrips from Entebbe or Kajjansi",
      "3-hour drive south to Bwindi; 2-hour drive north to Kibale",
    ],
    keyHighlights: [
      { title: "Kazinga Channel Boat Cruise", description: "Navigate the channel between Lakes Edward and George, spotting hippos, crocodiles, buffalo, and over 300 bird species.", image: images.nile },
      { title: "Ishasha Tree-Climbing Lions", description: "Witness lions lounging in the branches of fig trees, a rare behavior unique to this lion population.", image: images.savannah },
      { title: "Kyambura Gorge Chimpanzees", description: "Trek through misty gorge forest to encounter habituated chimpanzees.", image: images.forest },
      { title: "Crater Lakes", description: "Explore scenic crater lakes of the Rwenzori foothills, perfect for photography and quiet nature walks.", image: images.lake },
    ],
    bestTime:
      "Excellent as part of a Kibale-Bwindi circuit; lodge choice should match your priority sector.",
    nights: "2-3 nights",
  },
  {
    slug: "kibale-forest-national-park",
    name: "Kibale Forest National Park",
    region: "Western Uganda",
    image: images.forest,
    summary:
      "Uganda's leading chimpanzee tracking forest, often paired with Bigodi Wetland and Queen Elizabeth National Park.",
    overview:
      "Kibale National Park protects 795 km² of regenerating and primary Afrotropical rainforest, home to the world's largest population of chimpanzees and over 13 primate species. The park sits between the Rwenzori foothills and the Fort Portal plateau, offering cool temperatures, misty mornings, and dense forest trails.",
    whyGo: ["Chimpanzee tracking", "Bigodi Wetland", "Forest birding"],
    howToGetThere: [
      "From Kampala: 310 km via Mbarara — 5–6 hour drive",
      "From Fort Portal: 35 km — under 1 hour drive",
      "From Entebbe: 6–7 hour drive via Kampala and Mbarara",
      "Nearest charter airstrip: Kihihi or Fort Portal from Entebbe",
    ],
    keyHighlights: [
      { title: "Chimpanzee Tracking", description: "Follow habituated chimpanzees through the rainforest, spending up to 8 hours with these intelligent primates.", image: images.forest },
      { title: "Bigodi Wetland Sanctuary", description: "Walk elevated boardwalks through papyrus and marsh, spotting blue monkeys, bushbabies, and over 180 bird species.", image: images.hero },
      { title: "Forest Elephant Trail", description: "Spot the rare forest elephant and other wildlife along lesser-known forest paths.", image: images.gorilla },
      { title: "Primate Diversity", description: "Encounter black-and-white colobus monkeys, red colobus, and L'Hoest's monkeys in their natural habitat.", image: images.forest },
    ],
    bestTime:
      "Book chimp permits early and stay near the activity sector for easier morning logistics.",
    nights: "1-2 nights",
  },
  {
    slug: "lake-mburo-national-park",
    name: "Lake Mburo National Park",
    region: "Western Uganda",
    image: images.vehicle,
    summary:
      "A compact park with zebras, impala, giraffes, nature walks, boat trips, and useful routing between Entebbe and the southwest.",
    overview:
      "Lake Mburo National Park is Uganda's smallest protected area at 370 km², but one of its most accessible — just 3 to 4 hours from Kampala. Unlike Uganda's forest parks, Lake Mburo features open acacia woodland and savannah, supporting unique species like the rare impala and large herds of Burchell's zebra.",
    whyGo: ["Short safaris", "Nature walks", "Route breaker"],
    howToGetThere: [
      "From Kampala: 250 km — 3–4 hour drive via Masaka",
      "From Entebbe: 4–5 hour drive via Kampala and Masaka",
      "From Mbarara: 80 km — 1.5 hour drive",
      "No commercial flights; drive is the only access to the park",
    ],
    keyHighlights: [
      { title: "Walking Safaris", description: "Safely walk acacia woodland trails on foot, the only park in Uganda where this is possible without lions or elephants.", image: images.vehicle },
      { title: "Lake Mburo Boat Cruise", description: "Cruise the lake's shoreline, spotting hippos, crocodiles, and waterbirds including the rare African finfoot.", image: images.lake },
      { title: "Zebra Herds", description: "Photograph large herds of Burchell's zebra, Uganda's largest zebra population, in the open savannah grassland.", image: images.savannah },
      { title: "Night Game Drives", description: "Search for nocturnal wildlife including leopards, porcupines, and genets under the African night sky.", image: images.falls },
    ],
    bestTime:
      "Works well at the beginning or end of western Uganda circuits.",
    nights: "1-2 nights",
  },
  {
    slug: "lake-bunyonyi",
    name: "Lake Bunyonyi",
    region: "Southwestern Uganda",
    image: images.lake,
    summary:
      "A scenic, restful lake often used after gorilla trekking for canoe rides, views, and a slower final night.",
    overview:
      "Lake Bunyonyi, meaning 'a place of many little birds,' sits at 6,308 feet above sea level in southwestern Uganda, making it one of the highest lakes in the region. The scenic lake stretches 29 km through misty hills, dotted with 29 small islands connected by traditional dugout canoes and guided canoe safaris.",
    whyGo: ["Relaxation", "Canoeing", "Post-trek scenery"],
    howToGetThere: [
      "From Kampala: 400 km via Mbarara — 7–8 hour drive",
      "From Entebbe: 8–9 hour drive via Kampala and Mbarara",
      "From Bwindi (Buhoma): 1-hour drive",
      "From Kihihi: 30-minute drive",
      "No commercial flights; drive is the only access",
    ],
    keyHighlights: [
      { title: "Canoe Safaris", description: "Paddle traditional dugout canoes across the glassy lake, spotting bushbuck, bush pigs, and over 200 bird species.", image: images.lake },
      { title: "Terraced Hillsides", description: "Walk through meticulously terraced hillsides cultivated with bananas, maize, and beans by local communities.", image: images.hero },
      { title: "Batwa Cultural Experience", description: "Meet the Batwa people, learn their traditional songs, storytelling, and sustainable forest living practices.", image: images.culture },
      { title: "Island Hopping", description: "Visit the 29 small islands, each with its own story and lakeside viewpoint.", image: images.nile },
    ],
    bestTime:
      "A gentle add-on after Bwindi when the itinerary needs rest and beautiful views.",
    nights: "1-2 nights",
  },
  {
    slug: "jinja-source-of-the-nile",
    name: "Jinja and the Nile",
    region: "Eastern Uganda",
    image: images.nile,
    summary:
      "Jackfruit Safaris' home base and Uganda's adventure hub for rafting, cycling, horse riding, craft visits, Nile views, and transfers.",
    overview:
      "Jinja sits on the northern shore of Lake Victoria where the Nile River begins its 6,650-kilometer journey to the Mediterranean. As Uganda's adventure capital and the historic source of the Nile, Jinja offers world-class white-water rafting, bungee jumping, quad biking, cycling tours, and boat excursions to the famous source point.",
    whyGo: ["Source of the Nile", "Rafting and cycling", "Local Jackfruit base"],
    howToGetThere: [
      "From Kampala: 80 km — 1.5–2 hour drive via the New Jinja Bridge",
      "From Entebbe: 2–2.5 hour drive via Kampala",
      "Domestic flights: Entebbe to Kajjansi airstrip, then 2-hour drive to Jinja",
      "Regular bus and taxi services between Kampala and Jinja",
    ],
    keyHighlights: [
      { title: "White-Water Rafting", description: "Navigate the Nile's intense rapids with professional guides, suitable for beginners and experienced rafters alike.", image: images.nile },
      { title: "Source of the Nile", description: "Boat to the spot where the White Nile begins its journey, marked by a monument and lakeside viewpoint.", image: images.hero },
      { title: "Bungee Jumping", description: "Leap 44 meters into the gorge at Wildwaters Club, one of Africa's most spectacular bungee jumping sites.", image: images.falls },
      { title: "Mabira Forest Canopy Walk", description: "Walk suspended bridges through the rainforest canopy, spotting primates and over 300 bird species.", image: images.forest },
    ],
    bestTime:
      "Great before or after safari, especially for travelers with a free day around Kampala, Entebbe, or Jinja.",
    nights: "1-3 nights",
  },
];

export const guideArticles = [
  "Best Time to Visit Uganda for Safari and Gorilla Trekking",
  "Gorilla Trekking Permit Guide",
  "What to Pack for a Uganda Safari",
  "How Many Days Do You Need in Uganda?",
  "Murchison Falls Safari Guide",
  "Jinja Adventure Guide",
  "Uganda Safari Costs: Budget, Mid-Range, and Luxury",
  "Entebbe to Jinja Travel Guide",
  "Family Safari in Uganda",
  "Is Uganda Safe for Safari Travelers?",
];

export const testimonials = [
  {
    name: "Private safari guest",
    trip: "Gorilla trekking",
    quote:
      "The team made the route feel easy, from permit planning to lodge timing and the long drives.",
  },
  {
    name: "Jinja visitor",
    trip: "Nile activities",
    quote:
      "Fast WhatsApp replies, clear pickup details, and a relaxed local feel around Jinja.",
  },
  {
    name: "Small group traveler",
    trip: "Uganda circuit",
    quote:
      "We always knew what was included, what was optional, and what needed live confirmation.",
  },
];

export const cmsModels = [
  "Site Settings",
  "Navigation",
  "Pages",
  "Heroes",
  "Safari Packages",
  "Destinations",
  "Experiences",
  "Transfer Services",
  "Accommodation",
  "Reviews",
  "Gallery Media",
  "FAQs",
  "Travel Guide Articles",
  "Partners",
  "Inquiry Leads",
  "Redirects",
];

export type TeamMember = {
  slug: string;
  name: string;
  position: string;
  bio?: string;
  photo_url?: string | null;
  email?: string | null;
  phone?: string | null;
  social_links?: Record<string, string>;
};

export const teamMembers: TeamMember[] = [
  {
    slug: "elvis-tumwebaze",
    name: "Elvis Tumwebaze",
    position: "Founder & Managing Director",
    bio: "Raised as an orphan in Jinja, Elvis was introduced to tourism and travel by his father at a young age. When his father passed away, he saw firsthand the challenges orphaned and vulnerable children face across Uganda. That experience became the heart of Jackfruit Safaris: a portion of every safari profit is channelled back into education, healthcare, and community programs for orphaned and vulnerable children. Elvis built Jackfruit on the belief that authentic travel should lift up the communities it touches.",
    photo_url: null,
  },
  {
    slug: "sam-kiggundu",
    name: "Sam Kiggundu",
    position: "Lead Safari Guide",
    bio: "With over 15 years guiding across Uganda's national parks, Sam is a specialist in mountain-gorilla tracking, birding, and cultural storytelling. A Uganda Wildlife Authority-certified guide, he brings deep ecology knowledge and a warm, engaging presence to every trek.",
    photo_url: null,
  },
  {
    slug: "maria-wanja",
    name: "Maria Wanja",
    position: "Operations Manager",
    bio: "Maria coordinates permits, logistics, and guest relations for every Jackfruit safari. With a background in hospitality and NGO project management, she ensures every detail — from arrival to departure — runs like clockwork while maintaining the personal touch that guests remember.",
    photo_url: null,
  },
  {
    slug: "david-okello",
    name: "David Okello",
    position: "Senior Driver-Guide",
    bio: "Behind every smooth safari is David, a professional 4x4 driver-guide with 12 years on Ugandan roads. Known for his spot-on wildlife spotting, safety-first approach, and encyclopedic knowledge of local stories, he keeps guests comfortable and informed between parks.",
    photo_url: null,
  },
];

export type PageHeroFallback = {
  title: string;
  subtitle?: string;
  intro: string;
  backgroundImage?: string;
  eyebrow?: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  content?: Record<string, string>;
};

export const pageHeroFallbacks: Record<string, PageHeroFallback> = {
  "/": {
    title: "Explore Uganda",
    subtitle: "With Local Safari Experts",
    intro:
      "Private Uganda safaris, gorilla trekking, Jinja adventures, cultural experiences, and reliable airport transfers planned by Jackfruit Safaris from Jinja.",
    backgroundImage: images.hero,
    ctaPrimary: { label: "Plan My Safari", href: "/request-quote" },
    ctaSecondary: { label: "View Safari Packages", href: "/safaris" },
  },
  "/about": {
    title: "Local Roots, Practical Planning",
    subtitle: "Warm Guest Care",
    intro:
      "Jackfruit Safaris is a registered Ugandan tour company born from a simple idea: tourism should support the communities that call Uganda home.",
    backgroundImage: images.gorilla,
    ctaPrimary: { label: "Plan My Safari", href: "/request-quote" },
    ctaSecondary: { label: "View Safari Packages", href: "/safaris" },
    content: {
      intro_body:
        "Born from a story of loss and giving back, Jackfruit Safaris was founded by Elvis — a former orphan from Jinja who was introduced to the travel world by his father before he passed. Seeing the challenges orphaned and vulnerable children face, Elvis built Jackfruit to ensure that every safari adventure directly supports those children through education, healthcare, and community programs. Today, Jackfruit connects travelers with Uganda's extraordinary wildlife and culture while channeling a portion of every booking into meaningful change.",
      mission:
        "To create authentic, locally-rooted safari experiences that connect travelers with Uganda's wildlife and culture while reinvesting in orphaned and vulnerable children.",
      vision:
        "A Uganda where tourism empowers local communities and every child has the chance to thrive.",
      give_back:
        "A portion of every safari profit supports orphaned and vulnerable children across Uganda through education, healthcare, and community programs.",
    },
  },
  "/safaris": {
    title: "Choose Proven Route",
    subtitle: "Make It Yours",
    intro:
      "Whether you have three days or two weeks, Jackfruit Safaris can help you experience Uganda's landscapes and wildlife as budget, mid-range, or luxury private trips.",
    backgroundImage: images.savannah,
    ctaPrimary: { label: "Plan My Safari", href: "/request-quote" },
    ctaSecondary: { label: "View Safari Packages", href: "/safaris" },
  },
  "/destinations": {
    title: "Uganda Safari Places",
    subtitle: "Routed With Care",
    intro:
      "Destination pages give travelers the practical why go, best time, recommended nights, and related route context they need before requesting a quote.",
    backgroundImage: images.falls,
    ctaPrimary: { label: "Plan My Safari", href: "/request-quote" },
    ctaSecondary: { label: "View Safari Packages", href: "/safaris" },
  },
  "/experiences": {
    title: "Choose Your Experience",
    subtitle: "Make It Yours",
    intro:
      "Choose primates, wildlife, Nile adventure, cultural visits, or reliable transport, then ask Jackfruit Safaris to connect the pieces into a realistic itinerary.",
    backgroundImage: images.forest,
    ctaPrimary: { label: "Plan My Safari", href: "/request-quote" },
    ctaSecondary: { label: "View Safari Packages", href: "/safaris" },
  },
  "/reviews": {
    title: "Hear From Travelers",
    subtitle: "Who Explored Uganda With Jackfruit Safaris",
    intro:
      "Review content imported only with permission or embedded according to review platform rules. The CMS includes permission and source fields for that reason.",
    backgroundImage: images.nile,
    ctaPrimary: { label: "Plan My Safari", href: "/request-quote" },
    ctaSecondary: { label: "View Safari Packages", href: "/safaris" },
  },
  "/travel-guide": {
    title: "Practical Travel Articles",
    subtitle: "That Answer Your Booking Questions",
    intro:
      "These are ready as CMS article topics for SEO, buyer education, and AI-search visibility.",
    backgroundImage: images.culture,
    ctaPrimary: { label: "Plan My Safari", href: "/request-quote" },
    ctaSecondary: { label: "View Safari Packages", href: "/safaris" },
  },
  "/contact": {
    title: "Plan Your Uganda Safari",
    subtitle: "Send us your travel details",
    intro:
      "Send your travel details and Jackfruit Safaris will help you choose the right safari, activity, transfer, or custom itinerary.",
    backgroundImage: images.lake,
    ctaPrimary: { label: "Plan My Safari", href: "/request-quote" },
    ctaSecondary: { label: "View Safari Packages", href: "/safaris" },
  },
  "/request-quote": {
    title: "Tell Us What You Want",
    subtitle: "From Uganda",
    intro:
      "Dates, group size, budget, activity interests, and comfort level are enough to start a practical route recommendation.",
    backgroundImage: images.vehicle,
    ctaPrimary: { label: "Plan My Safari", href: "/request-quote" },
    ctaSecondary: { label: "View Safari Packages", href: "/safaris" },
  },
  "/transport/airport-transfers": {
    title: "Airport Pickups and Transport",
    subtitle: "Reliable, Professional Service",
    intro:
      "Reliable airport pickups, hotel transfers, Jinja transfers, and safari transport with professional drivers.",
    backgroundImage: images.vehicle,
    ctaPrimary: { label: "Plan My Safari", href: "/request-quote" },
    ctaSecondary: { label: "View Safari Packages", href: "/safaris" },
  },
};

export type SafariIntroFallback = {
  title: string;
  subtitle: string;
  intro: string;
  body: string;
};

export const safariIntroFallback: SafariIntroFallback = {
  title: "Why choose Jackfruit Safaris for your Uganda safari?",
  subtitle: "Why Uganda",
  intro:
    "Uganda's compact geography lets you track mountain gorillas in Bwindi, watch tree-climbing lions in Queen Elizabeth, and raft the Nile at Jinja — all within a two-week loop. Known as the 'Pearl of Africa' since Churchill's 1907 visit, Uganda is one of only ten countries where mountain gorilla trekking is possible, with roughly half the world's population in Bwindi Impenetrable National Park. Jackfruit Safaris turns that density of experience into a single smooth trip: private 4x4 vehicles, local driver-guides who handle permits and lodge logistics, and routes that adjust to your dates, pace, and budget — from three-day gorilla getaways to full 10-day circuits.",
  body: "<p><strong>Private, flexible, and fully supported</strong> — every package can be adjusted for start point, lodge tier, activity mix, and final night. Whether you want a focused 3-day gorilla trek, a 3-day Murchison Falls wildlife loop, or a 10-day circuit covering Lake Mburo, chimp tracking in Kibale, Queen Elizabeth's Kazinga Channel cruise, and Lake Bunyonyi relaxation, Jackfruit Safaris plans it from Jinja with clear inclusions, live permit checks, and WhatsApp support before and during your trip.</p>",
};

export type ExperienceIntroFallback = {
  title: string;
  subtitle: string;
  intro: string;
  body: string;
};

export const experienceIntroFallback: ExperienceIntroFallback = {
  title: "Why choose Jackfruit Safaris for your Uganda experiences?",
  subtitle: "Experience Uganda",
  intro:
    "Uganda's experiences span mountain gorilla tracking in misty Bwindi, wildlife safaris across Murchison Falls and Queen Elizabeth, white-water rafting on the Nile at Jinja, cultural encounters with local communities, and reliable transport between parks. Jackfruit Safaris matches these activities to your available time, transfer point, safety needs, and comfort level, then connects the pieces into a realistic itinerary — whether you have three days or two weeks.",
  body: "<p><strong>Flexible, fully supported, and locally guided</strong> — every experience can be combined and adjusted for start point, lodge tier, activity mix, and final night. Whether you want focused gorilla trekking, a Nile adventure day in Jinja, cultural immersion in local villages, or reliable airport transfers as standalone add-ons, Jackfruit Safaris plans it from Jinja with clear inclusions, live activity checks, and WhatsApp support before and during your trip.</p>",
};
