
# 🎯 Guia Rápido de Uso da API

## 📋 Resumo

**URL Base:** `https://bancodeprodutos.abacusai.app`  
**API Key:** `700cd62c-7c2e-4aa2-a580-803d9318761d`  
**Header obrigatório:** `X-API-Key: 700cd62c-7c2e-4aa2-a580-803d9318761d`

---

## 🚀 Endpoints Principais

### 1️⃣ Listar Produtos
```bash
curl -H "X-API-Key: 700cd62c-7c2e-4aa2-a580-803d9318761d" \
  "https://bancodeprodutos.abacusai.app/api/products?limit=10"
```

### 2️⃣ Buscar Produto por ID
```bash
curl -H "X-API-Key: 700cd62c-7c2e-4aa2-a580-803d9318761d" \
  "https://bancodeprodutos.abacusai.app/api/products/1"
```

### 3️⃣ Buscar Produtos (Search)
```bash
curl -H "X-API-Key: 700cd62c-7c2e-4aa2-a580-803d9318761d" \
  "https://bancodeprodutos.abacusai.app/api/products?search=xiaomi"
```

### 4️⃣ Filtrar por Categoria
```bash
curl -H "X-API-Key: 700cd62c-7c2e-4aa2-a580-803d9318761d" \
  "https://bancodeprodutos.abacusai.app/api/products?category=Celulares"
```

### 5️⃣ Listar Categorias
```bash
curl -H "X-API-Key: 700cd62c-7c2e-4aa2-a580-803d9318761d" \
  "https://bancodeprodutos.abacusai.app/api/categories"
```

---

## 💻 Exemplo JavaScript Simples

```html
<!DOCTYPE html>
<html>
<head>
    <title>Teste API Produtos</title>
    <style>
        body { font-family: Arial; max-width: 1200px; margin: 0 auto; padding: 20px; }
        .product { border: 1px solid #ddd; padding: 15px; margin: 10px; display: inline-block; width: 250px; }
        .product img { width: 100%; height: 200px; object-fit: cover; }
        .price { color: #0066cc; font-weight: bold; font-size: 18px; }
    </style>
</head>
<body>
    <h1>Produtos</h1>
    <input type="text" id="search" placeholder="Buscar produtos..." style="width: 300px; padding: 10px;">
    <button onclick="searchProducts()">Buscar</button>
    <div id="products"></div>

    <script>
        const API_URL = 'https://bancodeprodutos.abacusai.app';
        const API_KEY = '700cd62c-7c2e-4aa2-a580-803d9318761d';

        async function loadProducts(query = '') {
            const url = query 
                ? `${API_URL}/api/products?search=${encodeURIComponent(query)}&limit=20`
                : `${API_URL}/api/products?limit=20`;

            const response = await fetch(url, {
                headers: { 'X-API-Key': API_KEY }
            });

            const data = await response.json();
            displayProducts(data.data);
        }

        function displayProducts(products) {
            const container = document.getElementById('products');
            container.innerHTML = products.map(p => `
                <div class="product">
                    ${p.images[0] ? `<img src="${API_URL}${p.images[0].url}" alt="${p.name}">` : ''}
                    <h3>${p.name}</h3>
                    <p>${p.category || ''}</p>
                    <p class="price">${p.price ? 'R$ ' + p.price.toFixed(2) : 'Sem preço'}</p>
                </div>
            `).join('');
        }

        function searchProducts() {
            const query = document.getElementById('search').value;
            loadProducts(query);
        }

        // Carregar produtos ao abrir a página
        loadProducts();

        // Buscar ao pressionar Enter
        document.getElementById('search').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchProducts();
        });
    </script>
</body>
</html>
```

Salve como `teste-api.html` e abra no navegador!

---

## 📱 URLs Importantes

- **API Docs (Swagger):** https://bancodeprodutos.abacusai.app/api-docs
- **Admin Dashboard:** https://bancodeprodutos.abacusai.app/admin
- **Upload de Produtos:** https://bancodeprodutos.abacusai.app/admin/upload.html

---

## 🔑 Estrutura de Resposta

### Produto
```json
{
  "id": 1,
  "name": "Nome do Produto",
  "description": "Descrição completa...",
  "price": 499.90,
  "category": "Celulares",
  "categoryId": 1,
  "condition": "Semi Novo",
  "brand": "Xiaomi",
  "model": "Redmi 9A",
  "images": [
    {
      "id": 1,
      "url": "/uploads/products/1_123_imagem_1.jpg"
    }
  ],
  "createdAt": "2025-11-23T20:30:59.811Z",
  "updatedAt": "2025-11-23T20:30:59.811Z"
}
```

### Lista Paginada
```json
{
  "data": [...], // Array de produtos
  "total": 2621,
  "page": 1,
  "limit": 50,
  "totalPages": 53
}
```

---

## ⚡ Parâmetros de Query

| Parâmetro | Tipo | Descrição | Exemplo |
|-----------|------|-----------|---------|
| `page` | number | Número da página | `page=1` |
| `limit` | number | Itens por página (máx: 100) | `limit=50` |
| `search` | string | Buscar em nome/descrição | `search=xiaomi` |
| `category` | string | Filtrar por categoria | `category=Celulares` |
| `sortBy` | string | Campo para ordenar | `sortBy=price` |
| `order` | string | asc ou desc | `order=desc` |

---

## 🎨 Como Exibir Imagens

As URLs das imagens são relativas. Para exibir, adicione o domínio:

```javascript
// URL retornada pela API
const imageUrl = product.images[0].url;
// Exemplo: "/uploads/products/1_123_imagem_1.jpg"

// URL completa para exibir
const fullUrl = `https://i.ytimg.com/vi/V0DeC9TkkkY/maxresdefault.jpg`;
// Resultado: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Colour_18-col_PT_with_labels.png/1200px-Colour_18-col_PT_with_labels.png"
```

**Em HTML:**
```html
<img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/5_PAO_12M_2007-07-12.jpg" 
     alt="Produto">
```

---

## 🛠️ Testando no Terminal

### Instalar httpie (mais legível que curl)
```bash
pip install httpie
```

### Listar produtos
```bash
http GET https://bancodeprodutos.abacusai.app/api/products \
  X-API-Key:700cd62c-7c2e-4aa2-a580-803d9318761d \
  limit==10
```

### Buscar produto
```bash
http GET https://bancodeprodutos.abacusai.app/api/products/1 \
  X-API-Key:700cd62c-7c2e-4aa2-a580-803d9318761d
```

---

## 📞 Precisa de Ajuda?

- Veja a **documentação completa** em Swagger
- Teste os endpoints diretamente pelo **Admin Dashboard**
- Todos os endpoints retornam JSON padronizado

**🎉 Pronto para integrar! 🚀**
