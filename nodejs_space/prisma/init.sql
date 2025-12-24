-- Inicialização IDEMPOTENTE do banco de dados
-- NÃO apaga dados existentes - apenas cria o que falta

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2),
    category TEXT,
    category_id INTEGER,
    condition TEXT,
    brand TEXT,
    model TEXT,
    specs JSONB,
    url_original TEXT,
    extraction_date TIMESTAMP(3),
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Tabela de imagens
CREATE TABLE IF NOT EXISTS images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    url TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Tabela de API keys
CREATE TABLE IF NOT EXISTS api_keys (
    id SERIAL PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_admin BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices (IF NOT EXISTS para evitar erro se já existirem)
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_condition ON products(condition);
CREATE INDEX IF NOT EXISTS idx_images_product_id ON images(product_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);

-- Inserir API keys APENAS se não existirem
INSERT INTO api_keys (key, name, is_active, is_admin, created_at)
SELECT 'ed126afe-92a8-415f-b886-a1b0fed24ff5', 'Admin Panel Key', true, true, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM api_keys WHERE key = 'ed126afe-92a8-415f-b886-a1b0fed24ff5');

INSERT INTO api_keys (key, name, is_active, is_admin, created_at)
SELECT '700cd62c-7c2e-4aa2-a580-803d9318761d', 'Public API Key', true, false, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM api_keys WHERE key = '700cd62c-7c2e-4aa2-a580-803d9318761d');
