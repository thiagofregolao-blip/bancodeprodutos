# 🚀 GUIA RÁPIDO - API DE PRODUTOS

## ⚡ REGRA PRINCIPAL

**SEMPRE adicione `&includeImages=false` nas buscas!**

Sem isso = 15-30 segundos ❌  
Com isso = 0.2-0.5 segundos ✅

---

## 🔑 CREDENCIAIS

```
URL: https://bancodeprodutos.abacusai.app
API Key: ed126afe-92a8-415f-b886-a1b0fed24ff5
Header: X-API-Key
```

---

## 📖 3 FORMAS DE USAR

### 1️⃣ BUSCAR PRODUTOS (Mais Usado)

```bash
# ✅ CORRETO - Ultra-rápido (0.2s)
GET /api/products/search?q=iphone&includeImages=false&limit=20

# ❌ ERRADO - Muito lento (20s)
GET /api/products/search?q=iphone
```

**JavaScript:**
```javascript
const response = await fetch(
  'https://bancodeprodutos.abacusai.app/api/products/search?q=iphone&includeImages=false&limit=20',
  { headers: { 'X-API-Key': 'ed126afe-92a8-415f-b886-a1b0fed24ff5' } }
);
const data = await response.json();
console.log(data.data); // Array de produtos
```

**PHP:**
```php
$url = "https://bancodeprodutos.abacusai.app/api/products/search?q=iphone&includeImages=false&limit=20";
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['X-API-Key: ed126afe-92a8-415f-b886-a1b0fed24ff5']);
$response = curl_exec($ch);
$data = json_decode($response, true);
print_r($data['data']);
```

---

### 2️⃣ LISTAR PRODUTOS COM FOTO

```bash
# ✅ CORRETO - 1 foto por produto (1-2s)
GET /api/products?page=1&limit=20&imageLimit=1
```

**JavaScript:**
```javascript
const response = await fetch(
  'https://bancodeprodutos.abacusai.app/api/products?page=1&limit=20&imageLimit=1',
  { headers: { 'X-API-Key': 'ed126afe-92a8-415f-b886-a1b0fed24ff5' } }
);
const data = await response.json();
```

---

### 3️⃣ VER DETALHES COMPLETOS

```bash
# ✅ CORRETO - Todas as fotos (2-3s)
GET /api/products/123
```

**JavaScript:**
```javascript
const response = await fetch(
  'https://bancodeprodutos.abacusai.app/api/products/123',
  { headers: { 'X-API-Key': 'ed126afe-92a8-415f-b886-a1b0fed24ff5' } }
);
const produto = await response.json();
```

---

## 📊 PARÂMETROS IMPORTANTES

| Parâmetro | Descrição | Valor Recomendado |
|-----------|-----------|-------------------|
| `includeImages` | Incluir imagens? | `false` para buscas |
| `imageLimit` | Quantas imagens | `1` para listagens |
| `limit` | Produtos por página | `20` |
| `page` | Número da página | `1, 2, 3...` |
| `q` | Termo de busca | `iphone, samsung...` |

---

## ⚠️ ERROS COMUNS

### ❌ ERRO 1: Busca muito lenta
```bash
# ERRADO (20-30s)
/api/products/search?q=iphone

# CORRETO (0.2s)
/api/products/search?q=iphone&includeImages=false
```

### ❌ ERRO 2: Esqueceu API Key
```javascript
// ERRADO - Retorna 401
fetch('https://bancodeprodutos.abacusai.app/api/products/search?q=iphone')

// CORRETO
fetch('https://bancodeprodutos.abacusai.app/api/products/search?q=iphone&includeImages=false', {
  headers: { 'X-API-Key': 'ed126afe-92a8-415f-b886-a1b0fed24ff5' }
})
```

### ❌ ERRO 3: Muitos produtos de uma vez
```bash
# EVITE - Pode dar timeout
/api/products?limit=500

# PREFIRA - Use paginação
/api/products?limit=20&page=1
```

---

## 🎯 FLUXO IDEAL

1. **Usuário digita** → Busca sem imagens (`includeImages=false`)
2. **Mostra resultados** → Lista com 1 foto (`imageLimit=1`)
3. **Clica no produto** → Detalhes completos (todas fotos)

---

## 📋 EXEMPLO COMPLETO FUNCIONAL

```html
<!DOCTYPE html>
<html>
<head>
    <title>Busca de Produtos</title>
</head>
<body>
    <input type="text" id="busca" placeholder="Digite para buscar...">
    <div id="resultados"></div>

    <script>
        const API_URL = 'https://bancodeprodutos.abacusai.app';
        const API_KEY = 'ed126afe-92a8-415f-b886-a1b0fed24ff5';

        document.getElementById('busca').addEventListener('input', async (e) => {
            const termo = e.target.value;
            
            if (termo.length < 3) return;

            // ✅ Busca SEM imagens (ultra-rápido!)
            const response = await fetch(
                `${API_URL}/api/products/search?q=${termo}&includeImages=false&limit=10`,
                { headers: { 'X-API-Key': API_KEY } }
            );

            const data = await response.json();
            
            // Mostrar resultados
            document.getElementById('resultados').innerHTML = data.data.map(p => `
                <div>
                    <h3>${p.name}</h3>
                    <p>R$ ${parseFloat(p.price).toFixed(2)}</p>
                </div>
            `).join('');
        });
    </script>
</body>
</html>
```

---

## 🎓 COPIE E COLE NO SEU CÓDIGO

```javascript
// ✅ FUNÇÕES PRONTAS PARA USAR

const API_URL = 'https://bancodeprodutos.abacusai.app';
const API_KEY = 'ed126afe-92a8-415f-b886-a1b0fed24ff5';

// Buscar produtos (SEM imagens - ultra-rápido)
async function buscar(termo) {
    const res = await fetch(
        `${API_URL}/api/products/search?q=${termo}&includeImages=false&limit=20`,
        { headers: { 'X-API-Key': API_KEY } }
    );
    return (await res.json()).data;
}

// Listar produtos (COM 1 foto)
async function listar(pagina = 1) {
    const res = await fetch(
        `${API_URL}/api/products?page=${pagina}&limit=20&imageLimit=1`,
        { headers: { 'X-API-Key': API_KEY } }
    );
    return (await res.json()).data;
}

// Detalhes do produto (TODAS as fotos)
async function detalhes(id) {
    const res = await fetch(
        `${API_URL}/api/products/${id}`,
        { headers: { 'X-API-Key': API_KEY } }
    );
    return await res.json();
}

// USAR:
const produtos = await buscar('iphone'); // Busca rápida
const lista = await listar(1); // Página 1 com fotos
const produto = await detalhes(123); // Detalhes completos
```

---

## ✅ CHECKLIST

Antes de usar em produção:

- [ ] Adicionei `includeImages=false` nas buscas?
- [ ] Usei `imageLimit=1` nas listagens?
- [ ] Coloquei a API Key no header `X-API-Key`?
- [ ] Testei e está rápido (< 2s)?
- [ ] Implementei paginação?

---

## 📞 PRECISA DE AJUDA?

- 📖 Guia completo: `GUIA_DE_INTEGRACAO.md`
- 🌐 Documentação: https://bancodeprodutos.abacusai.app/api-docs
- 📧 Email: seu-email@exemplo.com

---

**LEMBRE-SE:** `includeImages=false` = Busca RÁPIDA! ⚡

**Última atualização:** 24/11/2024
