-- Site aesthetics controls for CMS-managed branding and typography.

alter table public.site_settings
  add column if not exists brand_primary_color text,
  add column if not exists brand_secondary_color text,
  add column if not exists brand_accent_color text,
  add column if not exists brand_background_color text,
  add column if not exists brand_surface_color text,
  add column if not exists brand_text_color text,
  add column if not exists brand_muted_text_color text,
  add column if not exists heading_font_family text,
  add column if not exists body_font_family text,
  add column if not exists base_font_size text,
  add column if not exists heading_weight text,
  add column if not exists body_weight text,
  add column if not exists line_height text,
  add column if not exists letter_spacing text,
  add column if not exists border_radius_style text,
  add column if not exists button_style text,
  add column if not exists section_spacing text,
  add column if not exists card_shadow_style text,
  add column if not exists aesthetics jsonb not null default '{}'::jsonb;

update public.site_settings
set brand_primary_color = coalesce(brand_primary_color, '#143c2d'),
    brand_secondary_color = coalesce(brand_secondary_color, '#2d6f55'),
    brand_accent_color = coalesce(brand_accent_color, '#f5bf2f'),
    brand_background_color = coalesce(brand_background_color, '#fbfaf5'),
    brand_surface_color = coalesce(brand_surface_color, '#ffffff'),
    brand_text_color = coalesce(brand_text_color, '#10251b'),
    brand_muted_text_color = coalesce(brand_muted_text_color, '#536154'),
    heading_font_family = coalesce(heading_font_family, 'Geist'),
    body_font_family = coalesce(body_font_family, 'Geist'),
    base_font_size = coalesce(base_font_size, '16px'),
    heading_weight = coalesce(heading_weight, '900'),
    body_weight = coalesce(body_weight, '400'),
    line_height = coalesce(line_height, '1.6'),
    letter_spacing = coalesce(letter_spacing, 'normal'),
    border_radius_style = coalesce(border_radius_style, 'rounded'),
    button_style = coalesce(button_style, 'pill'),
    section_spacing = coalesce(section_spacing, 'comfortable'),
    card_shadow_style = coalesce(card_shadow_style, 'soft'),
    aesthetics = jsonb_build_object(
      'palette', jsonb_build_object(
        'primary', coalesce(brand_primary_color, '#143c2d'),
        'secondary', coalesce(brand_secondary_color, '#2d6f55'),
        'accent', coalesce(brand_accent_color, '#f5bf2f'),
        'background', coalesce(brand_background_color, '#fbfaf5'),
        'surface', coalesce(brand_surface_color, '#ffffff'),
        'text', coalesce(brand_text_color, '#10251b'),
        'muted_text', coalesce(brand_muted_text_color, '#536154')
      ),
      'typography', jsonb_build_object(
        'heading_font_family', coalesce(heading_font_family, 'Geist'),
        'body_font_family', coalesce(body_font_family, 'Geist'),
        'base_font_size', coalesce(base_font_size, '16px'),
        'heading_weight', coalesce(heading_weight, '900'),
        'body_weight', coalesce(body_weight, '400'),
        'line_height', coalesce(line_height, '1.6'),
        'letter_spacing', coalesce(letter_spacing, 'normal')
      ),
      'shape', jsonb_build_object(
        'border_radius_style', coalesce(border_radius_style, 'rounded'),
        'button_style', coalesce(button_style, 'pill'),
        'section_spacing', coalesce(section_spacing, 'comfortable'),
        'card_shadow_style', coalesce(card_shadow_style, 'soft')
      )
    ) || coalesce(aesthetics, '{}'::jsonb)
where true;
