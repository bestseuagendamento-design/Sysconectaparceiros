#!/bin/bash
################################################################################
# 🚀 QUICK EXPORT - SysConecta → GitHub (1 comando)
################################################################################

echo "🚀 Exportando SysConecta para GitHub..."
echo ""

# Instalar GitHub CLI se não estiver instalado
if ! command -v gh &> /dev/null; then
    echo "⚠️  Instalando GitHub CLI..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install gh
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt update && sudo apt install gh -y
    else
        echo "❌ Por favor, instale GitHub CLI manualmente: https://cli.github.com/"
        exit 1
    fi
fi

# Login no GitHub (se necessário)
if ! gh auth status &> /dev/null; then
    echo "🔐 Fazendo login no GitHub..."
    gh auth login
fi

# Inicializar Git
echo "📦 Inicializando repositório..."
git init
git add .
git commit -m "🎉 Initial commit: SysConecta v1.0.0 - Sistema completo de gestão de pedidos"

# Criar e fazer push
echo "🌐 Criando repositório no GitHub..."
gh repo create sysconecta \
    --public \
    --source=. \
    --remote=origin \
    --description="Sistema completo de gestão de pedidos de vidro com auditoria técnica e integração Supabase" \
    --push

# Adicionar topics
echo "🏷️  Adicionando topics..."
gh repo edit --add-topic react --add-topic typescript --add-topic supabase --add-topic tailwindcss --add-topic vite

# Criar release
echo "📦 Criando release v1.0.0..."
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
gh release create v1.0.0 --title "SysConecta v1.0.0" --notes "Sistema completo de gestão de pedidos"

# Abrir no navegador
echo ""
echo "✅ EXPORT CONCLUÍDO!"
echo ""
gh repo view --web
