
# 🔑 API Keys Atualizadas - IMPORTANTE!

## ⚠️ AÇÃO NECESSÁRIA: FAZER DEPLOY

As API Keys foram recriadas. **Você precisa fazer o DEPLOY para produção** para as mudanças funcionarem!

### 🚀 Como fazer deploy:

1. Clique no botão **"DEPLOY"** no topo da tela do ChatLLM
2. Aguarde o deploy finalizar (cerca de 1-2 minutos)
3. Teste novamente o upload em: https://bancodeprodutos.abacusai.app/admin/upload.html

---

## 🔐 Nova API Key (Admin - Leitura e Escrita)

```
700cd62c-7c2e-4aa2-a580-803d9318761d
```

**Use esta API Key para:**
- ✅ Gerenciar produtos (criar, editar, deletar)
- ✅ Upload em lote
- ✅ Admin dashboard
- ✅ Todas as operações

---

## 🔓 API Key de Leitura (Read-Only)

```
d95225f7-813c-4813-8765-557c4673529b
```

**Use esta API Key para:**
- ✅ Listar produtos (GET /api/products)
- ✅ Buscar produtos (GET /api/products/:id)
- ✅ Listar categorias (GET /api/categories)
- ❌ NÃO pode criar/editar/deletar

---

## 💻 Código Atualizado para Usar no Seu App

### JavaScript / React / Vue / Angular

```javascript
const API_URL = 'https://bancodeprodutos.abacusai.app';
const API_KEY = '700cd62c-7c2e-4aa2-a580-803d9318761d'; // Admin (escrita)
// OU
const API_KEY = 'd95225f7-813c-4813-8765-557c4673529b'; // Apenas leitura

async function getProducts() {
  const response = await fetch(`${API_URL}/api/products?limit=20`, {
    headers: { 'X-API-Key': API_KEY }
  });
  const data = await response.json();
  return data.data;
}
```

### Python

```python
import requests

API_URL = 'https://bancodeprodutos.abacusai.app'
API_KEY = '700cd62c-7c2e-4aa2-a580-803d9318761d'

response = requests.get(
    f'{API_URL}/api/products',
    headers={'X-API-Key': API_KEY}
)
products = response.json()
```

### PHP

```php
<?php
$API_URL = 'https://bancodeprodutos.abacusai.app';
$API_KEY = '700cd62c-7c2e-4aa2-a580-803d9318761d';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "$API_URL/api/products");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["X-API-Key: $API_KEY"]);

$response = curl_exec($ch);
curl_close($ch);
$products = json_decode($response, true);
?>
```

### cURL (Terminal)

```bash
curl -H "X-API-Key: 700cd62c-7c2e-4aa2-a580-803d9318761d" \
  "https://bancodeprodutos.abacusai.app/api/products?limit=10"
```

---

## 📖 Documentação

### Swagger (Teste Interativo)
https://bancodeprodutos.abacusai.app/api-docs

**Como usar:**
1. Clique em **"Authorize"** (cadeado verde no topo)
2. Cole a API Key: `700cd62c-7c2e-4aa2-a580-803d9318761d`
3. Clique em "Authorize"
4. Teste os endpoints!

---

## ⚡ O que mudou?

| Antes | Depois |
|-------|--------|
| `sk_admin_master456` | `700cd62c-7c2e-4aa2-a580-803d9318761d` |

**Todos os arquivos HTML do admin já foram atualizados automaticamente!**

---

## 🎯 Próximos Passos

### 1️⃣ **FAZER DEPLOY (OBRIGATÓRIO)**
Clique no botão **DEPLOY** para aplicar as mudanças em produção

### 2️⃣ **Testar o Upload**
Depois do deploy, teste:
https://bancodeprodutos.abacusai.app/admin/upload.html

### 3️⃣ **Atualizar seu App**
Se você já estava usando a API antiga, atualize para a nova API Key:
- Antiga: ~~`sk_admin_master456`~~
- **Nova: `700cd62c-7c2e-4aa2-a580-803d9318761d`**

---

## 🔒 Segurança

⚠️ **Dica de Segurança:**
- Para apps em produção, considere usar a API Key de **leitura** (`d95225f7-...`) no frontend
- Use a API Key **admin** (`700cd62c-...`) apenas no backend/server-side
- Nunca exponha a API Key admin em repositórios públicos

---

## ✅ Checklist

- [ ] Fazer deploy da aplicação
- [ ] Testar upload em produção
- [ ] Atualizar API Key no seu app (se já estava usando)
- [ ] Testar no Swagger
- [ ] Guardar as novas API Keys em local seguro

---

**🎉 Depois do deploy, tudo estará funcionando perfeitamente!**
