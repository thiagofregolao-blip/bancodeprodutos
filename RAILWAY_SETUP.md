# 🚂 Guia de Configuração no Railway

## ⚠️ Erro: DATABASE_URL não encontrada

Se você está vendo o erro:
```
PrismaClientInitializationError: error: Environment variable not found: DATABASE_URL
```

Siga estes passos para configurar:

## 📋 Passo a Passo

### 1️⃣ Criar Banco PostgreSQL no Railway

1. Acesse o dashboard do Railway: https://railway.app
2. No seu projeto, clique em **"New"** → **"Database"** → **"Add PostgreSQL"**
3. Aguarde alguns segundos enquanto o Railway cria o banco
4. O Railway criará automaticamente uma variável `DATABASE_URL` no serviço do banco

### 2️⃣ Conectar o Banco ao Serviço da Aplicação

**IMPORTANTE:** Você precisa adicionar a variável `DATABASE_URL` ao serviço da sua aplicação (não ao serviço do banco).

1. Clique no **serviço da sua aplicação** (não no banco)
2. Vá para a aba **"Variables"**
3. Clique em **"New Variable"**
4. Selecione **"Reference Variable"** ou **"Add from Service"**
5. Selecione o serviço do **PostgreSQL** que você acabou de criar
6. Selecione a variável **`DATABASE_URL`**
7. Salve a configuração

### 3️⃣ Verificar Variáveis de Ambiente

Certifique-se de que seu serviço da aplicação tem estas variáveis:

- ✅ `DATABASE_URL` (referenciando o serviço do PostgreSQL)
- ✅ `PORT` (opcional - o Railway define automaticamente)
- ✅ `NODE_ENV=production` (opcional)

### 4️⃣ Redeploy

Após configurar a variável:

1. O Railway fará um **redeploy automático** quando você salvar a variável
2. Aguarde o build e deploy completarem
3. Verifique os logs para confirmar que a aplicação iniciou corretamente

### 5️⃣ Executar Migrations

As migrations serão executadas automaticamente durante o build (já configurado no `nixpacks.toml`).

Se precisar executar manualmente, use o Railway CLI:

```bash
railway run npx prisma migrate deploy
```

## 🔍 Verificando se Funcionou

Após o deploy, você deve ver nos logs:

```
[PrismaService] Connecting to database...
[PrismaService] Database connected successfully!
[NestFactory] Starting Nest application...
🚀 Aplicação rodando em: http://0.0.0.0:PORT
```

## ❓ Problemas Comuns

### "Environment variable not found: DATABASE_URL"

- ✅ Certifique-se de que criou o banco PostgreSQL
- ✅ Certifique-se de que adicionou `DATABASE_URL` ao **serviço da aplicação** (não ao banco)
- ✅ Certifique-se de que usou "Reference Variable" para referenciar o serviço do banco

### Aplicação não conecta ao banco

- ✅ Verifique se o banco PostgreSQL está rodando (status "Running" no Railway)
- ✅ Verifique se a URL do banco está correta
- ✅ Verifique os logs do banco para erros

## 📚 Recursos

- [Documentação do Railway sobre Variáveis de Ambiente](https://docs.railway.app/develop/variables)
- [Documentação do Railway sobre PostgreSQL](https://docs.railway.app/databases/postgresql)

