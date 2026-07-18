-- Up
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  brand_name TEXT NOT NULL,
  logo TEXT,
  favicon TEXT,
  contact_email TEXT,
  facebook TEXT,
  instagram TEXT,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Down
DROP TABLE IF EXISTS settings;
