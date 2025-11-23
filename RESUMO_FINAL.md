
# 📦 API de Produtos - Resumo Final

## ✅ O que você tem agora:

### 🌐 **API REST Completa em Produção**
- **URL:** https://bancodeprodutos.abacusai.app
- **Status:** ✅ ONLINE e funcionando
- **Total de produtos:** 2621+ produtos cadastrados

---

## 🔑 Credenciais de Acesso

### API Key (para usar a API)
```
X-API-Key: 700cd62c-7c2e-4aa2-a580-803d9318761d
```

**Use em TODOS os requests:**
```javascript
headers: {
  'X-API-Key': '700cd62c-7c2e-4aa2-a580-803d9318761d'
}
```

---

## 📍 Endpoints Principais

### 1. **Listar Produtos**
```
GET https://bancodeprodutos.abacusai.app/api/products
```
- Parâmetros: `page`, `limit`, `search`, `category`, `sortBy`, `order`
- Retorna: Lista paginada de produtos com imagens

### 2. **Buscar Produto por ID**
```
GET https://bancodeprodutos.abacusai.app/api/products/{id}
```

### 3. **Listar Categorias**
```
GET https://bancodeprodutos.abacusai.app/api/categories
```

### 4. **Buscar Produtos**
```
GET https://bancodeprodutos.abacusai.app/api/products?search=xiaomi
```

### 5. **Filtrar por Categoria**
```
GET https://bancodeprodutos.abacusai.app/api/products?category=Celulares
```

---

## 📖 Documentação Completa

### 🔵 **Swagger UI (Teste interativo)**
```
https://bancodeprodutos.abacusai.app/api-docs
```
- Teste todos os endpoints diretamente pelo navegador
- Veja exemplos de request/response
- Documentação completa e interativa

### 📱 **Admin Dashboard**
```
https://bancodeprodutos.abacusai.app/admin
```
- Gerenciar produtos
- Upload em lote (até 2000+ produtos)
- Visualizar estatísticas

---

## 🚀 Como Usar no Seu App

### **Exemplo JavaScript/React:**
```javascript
const API_URL = 'https://bancodeprodutos.abacusai.app';
const API_KEY = '700cd62c-7c2e-4aa2-a580-803d9318761d';

async function getProducts() {
  const response = await fetch(`${API_URL}/api/products?limit=20`, {
    headers: { 'X-API-Key': API_KEY }
  });
  const data = await response.json();
  return data.data; // Array de produtos
}
```

### **Exibir Imagens:**
```javascript
// A API retorna URLs relativas
const imageUrl = product.images[0].url;
// Exemplo: "/uploads/products/1_123_imagem_1.jpg"

// Para exibir, adicione o domínio:
const fullUrl = `https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Cartesian_Product_qtl1.svg/1200px-Cartesian_Product_qtl1.svg.png`;

// Em HTML:
<img src={`https://i.ytimg.com/vi_webp/zyNt5KkKDzQ/maxresdefault.webp />
```

---

## 📂 Arquivos Criados para Você

1. **`GUIA_DE_INTEGRACAO.md`** - Guia completo com exemplos em todas as linguagens
2. **`GUIA_DE_USO.md`** - Guia rápido de uso
3. **`teste-api.html`** - Página HTML para testar a API (abra no navegador!)

---

## 🎯 Próximos Passos

### **1. Testar a API**
- Abra: https://bancodeprodutos.abacusai.app/api-docs
- Clique em "Authorize" e coloque a API Key: `700cd62c-7c2e-4aa2-a580-803d9318761d`
- Teste os endpoints diretamente

### **2. Baixar o arquivo de teste**
- Baixe o `teste-api.html` e abra no navegador
- Veja os produtos sendo carregados da API
- Use como base para seu próprio app

### **3. Integrar no seu App**
```javascript
// Copie este código e adapte:
const products = await fetch(
  'https://bancodeprodutos.abacusai.app/api/products?limit=20',
  { headers: { 'X-API-Key': '700cd62c-7c2e-4aa2-a580-803d9318761d' } }
).then(r => r.json());

products.data.forEach(product => {
  console.log(product.name, product.price);
});
```

---

## ⚡ Recursos Principais

✅ **Upload em lote** - Até 2000+ produtos de uma vez  
✅ **Busca inteligente** - Por nome, descrição, categoria  
✅ **Paginação** - Páginas de até 100 itens  
✅ **Imagens múltiplas** - Cada produto pode ter várias fotos  
✅ **Filtros avançados** - Categoria, preço, data  
✅ **API RESTful** - Padrão JSON, fácil de integrar  
✅ **Documentação Swagger** - Teste interativo  

---

## 🔒 Segurança

⚠️ **IMPORTANTE:**
- A API Key `700cd62c-7c2e-4aa2-a580-803d9318761d` é a chave mestre
- Se possível, crie uma **proxy server-side** para esconder a key
- Não exponha a API Key em repositórios públicos no GitHub
- Para apps mobile, considere usar um backend intermediário

---

## 💡 Dicas de Implementação

### **Paginação Eficiente**
```javascript
// Carregar 20 produtos por vez
let page = 1;
const limit = 20;

async function loadMore() {
  const data = await fetch(
    `${API_URL}/api/products?page=${page}&limit=${limit}`,
    { headers: { 'X-API-Key': API_KEY } }
  ).then(r => r.json());
  
  page++;
  return data.data;
}
```

### **Cache Local**
```javascript
// Guardar em localStorage para não refazer requests
const cacheKey = 'products_cache';
const cacheTime = 5 * 60 * 1000; // 5 minutos

function getCachedProducts() {
  const cached = localStorage.getItem(cacheKey);
  if (!cached) return null;
  
  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > cacheTime) return null;
  
  return data;
}

function setCachedProducts(products) {
  localStorage.setItem(cacheKey, JSON.stringify({
    data: products,
    timestamp: Date.now()
  }));
}
```

### **Lazy Loading de Imagens**
```javascript
<img 
  src={`${API_URL}${product.images[0].url}`}
  loading="lazy"
  alt={product.name}
/>
```

---

## 📞 Links Úteis

- 🔵 **API Docs:** https://bancodeprodutos.abacusai.app/api-docs
- 🎛️ **Admin:** https://bancodeprodutos.abacusai.app/admin
- 📤 **Upload:** https://bancodeprodutos.abacusai.app/admin/upload.html
- 📦 **Produtos:** https://bancodeprodutos.abacusai.app/admin/products.html

---

## 🎉 Pronto!

Agora você tem uma API REST completa para gerenciar e consumir produtos!

**3 maneiras de começar:**

1. **Teste pelo Swagger** → https://bancodeprodutos.abacusai.app/api-docs
2. **Abra o teste-api.html** → Veja funcionando no navegador
3. **Copie os exemplos** → Do GUIA_DE_INTEGRACAO.md para seu app

**Qualquer dúvida, consulte a documentação! 🚀**
