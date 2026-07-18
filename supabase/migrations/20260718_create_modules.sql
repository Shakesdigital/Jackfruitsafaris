-- Up
CREATE TABLE IF NOT EXISTS modules (
  id SERIAL PRIMARY KEY,
  page_id INTEGER REFERENCES pages(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  json_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Down
DROP TABLE IF EXISTS modules;
