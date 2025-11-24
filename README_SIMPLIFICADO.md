# API DE PRODUTOS - GUIA SIMPLIFICADO

## 🔥 A ÚNICA COISA QUE VOCÊ PRECISA SABER

**Adicione `&includeImages=false` em TODAS as buscas!**

Isso faz sua busca ficar **100x mais rápida** (de 20 segundos para 0.2 segundos).

---

## 🔑 SUA API KEY

```
ed126afe-92a8-415f-b886-a1b0fed24ff5
```

---

## 📝 EXEMPLO PRONTO PARA COPIAR E COLAR

### JavaScript

```javascript
// Copie e cole isto:

async function buscarProdutos(termo) {
  const response = await fetch(
    `https://bancodeprodutos.abacusai.app/api/products/search?q=${termo}&includeImages=false&limit=20`,
    {
      headers: {
        'X-API-Key': 'ed126afe-92a8-415f-b886-a1b0fed24ff5'
      }
    }
  );
  
  const data = await response.json();
  return data.data; // Array com os produtos
}

// Usar:
const produtos = await buscarProdutos('iphone');
console.log(produtos);
```

### PHP

```php
<?php
// Copie e cole isto:

function buscarProdutos($termo) {
    $url = "https://bancodeprodutos.abacusai.app/api/products/search?" . http_build_query([
        'q' => $termo,
        'includeImages' => 'false',
        'limit' => 20
    ]);
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'X-API-Key: ed126afe-92a8-415f-b886-a1b0fed24ff5'
    ]);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    $data = json_decode($response, true);
    return $data['data'];
}

// Usar:
$produtos = buscarProdutos('iphone');
print_r($produtos);
?>
```

---

## 🎯 EXEMPLOS DE URLs

```bash
# Buscar "iphone" (RÁPIDO)
https://bancodeprodutos.abacusai.app/api/products/search?q=iphone&includeImages=false

# Buscar "samsung" (RÁPIDO)
https://bancodeprodutos.abacusai.app/api/products/search?q=samsung&includeImages=false

# Listar produtos com 1 foto
https://bancodeprodutos.abacusai.app/api/products?page=1&limit=20&imageLimit=1

# Ver produto específico (ID 123)
https://bancodeprodutos.abacusai.app/api/products/123
```

**LEMBRE-SE:** Sempre incluir header `X-API-Key: ed126afe-92a8-415f-b886-a1b0fed24ff5`

---

## ⚠️ ERROS MAIS COMUNS

### 1. Busca lenta (20-30 segundos)

**PROBLEMA:** Você não adicionou `includeImages=false`

```bash
# ❌ ERRADO (lento)
/api/products/search?q=iphone

# ✅ CORRETO (rápido)
/api/products/search?q=iphone&includeImages=false
```

### 2. Erro 401 (Unauthorized)

**PROBLEMA:** Esqueceu de adicionar a API Key no header

```javascript
// ❌ ERRADO
fetch('https://bancodeprodutos.abacusai.app/api/products/search?q=iphone')

// ✅ CORRETO
fetch('https://bancodeprodutos.abacusai.app/api/products/search?q=iphone&includeImages=false', {
  headers: { 'X-API-Key': 'ed126afe-92a8-415f-b886-a1b0fed24ff5' }
})
```

---

## 📚 MAIS INFORMAÇÕES

- Guia rápido: `GUIA_DE_USO.md`
- Guia completo: `GUIA_DE_INTEGRACAO.md`
- Documentação: https://bancodeprodutos.abacusai.app/api-docs

---

## 🚀 PRONTO!

Isso é tudo que você precisa para começar. Copie o código acima e adapte para seu sistema.

**Dúvidas?** Leia os guias acima ou teste na documentação.

---

**Atualizado em:** 24/11/2024
