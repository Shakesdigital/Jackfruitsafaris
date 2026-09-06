-- Add footer_about column to site_settings for editable footer column 1 content
alter table public.site_settings add column if not exists footer_about text;

-- Seed a default value for existing Jackfruit Safaris row if the column is null
update public.site_settings set
  footer_about = coalesce(
    footer_about,
    'Jackfruit Safaris designs private, tailor-made Uganda safaris — from gorilla trekking in Bwindi to Nile adventures and cultural encounters — planned locally from our base in Jinja.'
  )
where business_name = 'Jackfruit Safaris' and footer_about is null;
