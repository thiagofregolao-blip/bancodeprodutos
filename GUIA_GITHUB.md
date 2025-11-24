# 🔗 CONECTAR PROJETO AO GITHUB

## ✅ PASSO A PASSO COMPLETO

---

## 📋 PRÉ-REQUISITOS

Você precisa ter:
- ✅ Conta no GitHub (gratuita)
- ✅ Acesso para criar repositórios

---

## 🚀 OPÇÃO 1: USANDO A INTERFACE DO GITHUB (MAIS FÁCIL)

### **1️⃣ Criar Repositório no GitHub**

1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name:** `products-api` (ou outro nome)
   - **Description:** `API REST para gerenciamento de produtos`
   - **Visibility:** 
     - ✅ **Private** (recomendado - código privado)
     - ou **Public** (código público)
3. **NÃO marque:**
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
4. Clique em **"Create repository"**

### **2️⃣ Conectar Seu Projeto**

Depois de criar, o GitHub vai mostrar instruções. **Copie o URL do repositório** que aparece, exemplo:
```
https://github.com/seu-usuario/products-api.git
```

### **3️⃣ Executar Comandos no Terminal**

Execute estes comandos (substitua SEU_USUARIO pelo seu usuário do GitHub):

```bash
cd /home/ubuntu/products_api

# Adicionar remote
git remote add origin https://github.com/SEU_USUARIO/products-api.git

# Verificar se foi adicionado
git remote -v

# Fazer push para GitHub
git push -u origin master
```

### **4️⃣ Autenticação**

O GitHub vai pedir **autenticação**. Você tem 2 opções:

#### **Opção A: Personal Access Token (Recomendado)**

1. Vá em: https://github.com/settings/tokens
2. Clique em **"Generate new token"** → **"Generate new token (classic)"**
3. Preencha:
   - **Note:** `Products API`
   - **Expiration:** `90 days` (ou mais)
   - **Scopes:** Marque `repo` (todos os sub-itens)
4. Clique em **"Generate token"**
5. **COPIE O TOKEN** (você só verá uma vez!)
6. Quando pedir senha no terminal, **cole o token** (não a senha do GitHub)

#### **Opção B: SSH Key**

Se preferir SSH, siga: https://docs.github.com/pt/authentication/connecting-to-github-with-ssh

---

## 🔄 COMANDOS ÚTEIS PARA O DIA A DIA

### **Fazer mudanças e enviar para GitHub:**

```bash
cd /home/ubuntu/products_api

# Ver o que mudou
git status

# Adicionar todos os arquivos modificados
git add -A

# Fazer commit com mensagem
git commit -m "Descrição das mudanças"

# Enviar para GitHub
git push
```

### **Pegar mudanças do GitHub:**

```bash
# Atualizar seu código local com o que está no GitHub
git pull
```

### **Ver histórico:**

```bash
# Ver commits
git log --oneline

# Ver mudanças de um arquivo
git log -p caminho/do/arquivo
```

---

## 🎯 ESTRUTURA DE BRANCHES (OPCIONAL)

Para projetos maiores, você pode usar branches:

```bash
# Criar branch de desenvolvimento
git checkout -b develop

# Trabalhar nessa branch
git add -A
git commit -m "Nova feature"
git push -u origin develop

# Voltar para master
git checkout master
```

---

## ⚠️ ARQUIVOS QUE NÃO VÃO PRO GITHUB

Já configurei o `.gitignore` para **NÃO** enviar:

- ❌ `node_modules/` (dependências - muito grande)
- ❌ `.env` (senhas e secrets)
- ❌ `dist/` (código compilado)
- ❌ `uploads/` (imagens são base64 inline)
- ❌ Logs e arquivos temporários

---

## 🔐 SEGURANÇA IMPORTANTE

⚠️ **NUNCA COMMITE ESTES ARQUIVOS:**

- ❌ `.env` (contém DATABASE_URL e secrets)
- ❌ `*.key` ou `*.pem` (chaves privadas)
- ❌ API Keys (já está no .gitignore)

**Se acidentalmente commitou um secret:**

1. Delete o arquivo do git:
   ```bash
   git rm --cached arquivo_com_secret
   git commit -m "Remove arquivo sensível"
   git push
   ```

2. **TROQUE IMEDIATAMENTE** a senha/token/secret comprometida!

---

## 📊 EXEMPLO COMPLETO DE WORKFLOW

```bash
# 1. Fazer mudanças no código
vim nodejs_space/src/products/products.service.ts

# 2. Testar localmente
cd nodejs_space
yarn test

# 3. Ver o que mudou
git status
git diff

# 4. Adicionar mudanças
git add nodejs_space/src/products/products.service.ts

# 5. Commit com mensagem descritiva
git commit -m "feat: Add pagination to product search"

# 6. Enviar para GitHub
git push

# ✅ Pronto! Seu código está no GitHub
```

---

## 🎨 BADGES PARA O README (OPCIONAL)

Adicione no README.md para ficar bonito:

```markdown
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![NestJS](https://img.shields.io/badge/NestJS-11.0-red)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)
```

---

## 🆘 PROBLEMAS COMUNS

### **Erro: "remote origin already exists"**
```bash
# Remover remote existente
git remote remove origin

# Adicionar novamente
git remote add origin https://github.com/SEU_USUARIO/products-api.git
```

### **Erro: "Authentication failed"**
- Use **Personal Access Token** ao invés da senha
- Verifique se o token tem permissões de `repo`

### **Erro: "Please tell me who you are"**
```bash
git config user.name "Seu Nome"
git config user.email "seu@email.com"
```

### **Ver configurações:**
```bash
git config --list
```

---

## 📚 RECURSOS ÚTEIS

- 📖 Git Cheat Sheet: https://education.github.com/git-cheat-sheet-education.pdf
- 📖 GitHub Docs: https://docs.github.com/pt
- 📖 Pro Git Book: https://git-scm.com/book/pt-br/v2

---

## ✅ CHECKLIST FINAL

Antes de fazer push, verifique:

- [ ] README.md está atualizado
- [ ] .gitignore está configurado
- [ ] .env NÃO está no repositório
- [ ] Código está testado
- [ ] Commit tem mensagem descritiva
- [ ] Não tem senhas ou secrets no código

---

**Pronto! Seu projeto está conectado ao GitHub! 🎉**

Qualquer dúvida, me chame! 👋
