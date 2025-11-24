#!/bin/bash

echo "🔗 CONECTAR AO GITHUB"
echo "===================="
echo ""
echo "📋 Pré-requisitos:"
echo "   1. Ter uma conta no GitHub"
echo "   2. Criar um repositório em: https://github.com/new"
echo "   3. Ter o URL do repositório (ex: https://github.com/usuario/repo.git)"
echo ""
echo "⚠️  IMPORTANTE: NÃO marque 'Add README' ou 'Add .gitignore' ao criar!"
echo ""
read -p "Pressione ENTER quando tiver criado o repositório no GitHub..."

echo ""
read -p "🔗 Cole o URL do repositório (ex: https://github.com/usuario/repo.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ URL não pode estar vazio!"
    exit 1
fi

echo ""
echo "🔧 Conectando ao GitHub..."

# Remover remote se já existir
git remote remove origin 2>/dev/null

# Adicionar novo remote
git remote add origin "$REPO_URL"

echo "✅ Remote adicionado!"
echo ""
echo "📊 Verificando conexão..."
git remote -v

echo ""
echo "🚀 Fazendo push para o GitHub..."
echo "⚠️  Você precisará autenticar:"
echo "   - Usuário: seu usuário do GitHub"
echo "   - Senha: use Personal Access Token (não a senha normal!)"
echo ""
echo "📖 Como criar token: https://github.com/settings/tokens"
echo ""

git push -u origin master

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCESSO! Seu código está no GitHub!"
    echo ""
    echo "🔗 Acesse: ${REPO_URL%.git}"
    echo ""
    echo "📚 Próximos passos:"
    echo "   - Fazer mudanças: git add . && git commit -m 'mensagem'"
    echo "   - Enviar: git push"
    echo "   - Receber: git pull"
else
    echo ""
    echo "❌ Erro ao fazer push!"
    echo "📖 Veja o guia completo: cat GUIA_GITHUB.md"
fi
