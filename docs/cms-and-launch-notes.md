# Jackfruit Safaris CMS And Launch Notes

## Detected Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase client installed for inquiry persistence
- Supabase SQL migration in `supabase/migrations/202606270001_jackfruit_cms.sql`

## Front-End Scope Implemented

- Home
- About
- Safaris index
- Safari detail pages
- Destinations index
- Destination detail pages
- Experiences index
- Experience detail pages
- Airport transfers
- Reviews
- Travel guide
- Contact
- Request quote
- Mobile sticky WhatsApp/request quote bar
- Desktop sticky quote card on itinerary pages
- Redirects for legacy URLs in `next.config.ts`

## CMS Scope

The migration creates tables for:

- Site settings
- Navigation menus and menu items
- Pages, modules, and module attachments
- Safari packages
- Destinations
- Experiences
- Transfer services
- Accommodation
- Reviews
- Gallery media
- FAQs
- Travel guide articles
- Partners
- Inquiry leads
- Redirects
- Profiles and role assignments

## Roles

Supported roles:

- `admin`
- `editor`
- `booking_manager`
- `guide`

Admins manage users and roles. Admins, editors, and booking managers can manage content and leads.

## Inquiry Persistence

The public quote form validates submissions in `src/app/actions.ts`.

To persist inquiries, add:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

The service role key should be used only in secure server environments.

## Launch Checks

- Replace placeholder remote photography with licensed Jackfruit Safaris or approved partner images.
- Verify current Uganda Wildlife Authority gorilla/chimp permit and park fee tariffs before publishing final prices.
- Confirm lodge availability and current rates before sending quotes.
- Connect email or WhatsApp notifications for new `inquiry_leads`.
- Add GA4, Google Search Console, Meta Pixel, and conversion events after deployment.
- Import only reviews with permission or embed review widgets according to platform rules.
