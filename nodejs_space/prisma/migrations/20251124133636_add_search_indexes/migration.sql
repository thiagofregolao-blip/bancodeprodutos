
-- Enable pg_trgm extension for fast text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add trigram indexes for fast ILIKE searches
CREATE INDEX IF NOT EXISTS products_name_trgm_idx ON products USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS products_description_trgm_idx ON products USING gin (description gin_trgm_ops);
CREATE INDEX IF NOT EXISTS products_brand_trgm_idx ON products USING gin (brand gin_trgm_ops);
CREATE INDEX IF NOT EXISTS products_model_trgm_idx ON products USING gin (model gin_trgm_ops);

-- Add regular index for category text search
CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);
