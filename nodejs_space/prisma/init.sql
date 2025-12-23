-- Inicialização do banco de dados
-- IMPORTANTE: Este script RECRIA as tabelas se o schema estiver incorreto

-- Dropar tabelas na ordem correta (por causa das foreign keys)
DROP TABLE IF EXISTS images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS api_keys CASCADE;
DROP TABLE IF EXISTS _prisma_migrations CASCADE;

-- Tabela de categorias
CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de produtos
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DOUBLE PRECISION,
    sku TEXT,
    barcode TEXT,
    brand TEXT,
    "categoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_category FOREIGN KEY ("categoryId") REFERENCES categories(id) ON DELETE SET NULL
);

-- Tabela de imagens
CREATE TABLE images (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product FOREIGN KEY ("productId") REFERENCES products(id) ON DELETE CASCADE
);

-- Tabela de API keys
CREATE TABLE api_keys (
    id TEXT PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para busca
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_category ON products("categoryId");
CREATE INDEX idx_images_product ON images("productId");
CREATE INDEX idx_api_keys_key ON api_keys(key);

-- Inserir API key padrão
INSERT INTO api_keys (id, key, name, "isActive", "createdAt", "updatedAt")
VALUES ('default-api-key', 'dev-api-key-123', 'Default Development Key', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
