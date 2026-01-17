#!/bin/bash

# ============================================
# Script de Deploy Automático para GitHub
# SysConecta v2.0
# ============================================

echo "🚀 SysConecta - Script de Deploy para GitHub"
echo "=============================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para mensagens de sucesso
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Função para mensagens de erro
error() {
    echo -e "${RED}❌ $1${NC}"
}

# Função para mensagens de aviso
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Passo 1: Verificar se Git está instalado
echo "📦 Verificando Git..."
if ! command -v git &> /dev/null; then
    error "Git não está instalado!"
    echo "Instale o Git: https://git-scm.com/downloads"
    exit 1
fi
success "Git instalado: $(git --version)"
echo ""

# Passo 2: Verificar se já é um repositório Git
if [ ! -d ".git" ]; then
    echo "🔧 Inicializando repositório Git..."
    git init
    success "Repositório inicializado"
else
    success "Repositório Git já existe"
fi
echo ""

# Passo 3: Verificar arquivos sensíveis
echo "🔒 Verificando arquivos sensíveis..."
if [ -f ".env" ]; then
    warning "Arquivo .env encontrado! Certifique-se de que está no .gitignore"
fi
if [ -f ".env.local" ]; then
    warning "Arquivo .env.local encontrado! Certifique-se de que está no .gitignore"
fi

# Verificar se .gitignore existe
if [ ! -f ".gitignore" ]; then
    error ".gitignore não encontrado!"
    exit 1
fi
success ".gitignore encontrado"
echo ""

# Passo 4: Verificar se há mudanças para commitar
echo "📝 Verificando mudanças..."
git status --short
echo ""

# Passo 5: Adicionar arquivos
echo "➕ Adicionando arquivos..."
git add .
success "Arquivos adicionados"
echo ""

# Passo 6: Verificar se há algo para commitar
if git diff-index --quiet HEAD --; then
    warning "Nenhuma mudança para commitar"
else
    # Pedir mensagem de commit
    echo "💬 Digite a mensagem do commit:"
    echo "   Exemplos:"
    echo "   - feat: adiciona nova funcionalidade"
    echo "   - fix: corrige bug"
    echo "   - docs: atualiza documentação"
    echo ""
    read -p "Mensagem: " commit_message
    
    if [ -z "$commit_message" ]; then
        commit_message="chore: atualização geral"
    fi
    
    # Fazer commit
    echo ""
    echo "📦 Fazendo commit..."
    git commit -m "$commit_message"
    success "Commit realizado: $commit_message"
fi
echo ""

# Passo 7: Verificar se remote está configurado
echo "🌐 Verificando remote..."
if git remote | grep -q "origin"; then
    success "Remote 'origin' já configurado: $(git remote get-url origin)"
else
    echo ""
    echo "🔗 Configure o remote do GitHub:"
    echo "   1. Crie um repositório no GitHub: https://github.com/new"
    echo "   2. Copie a URL do repositório"
    echo ""
    read -p "Cole a URL do repositório GitHub: " repo_url
    
    if [ -z "$repo_url" ]; then
        error "URL não fornecida!"
        exit 1
    fi
    
    git remote add origin "$repo_url"
    success "Remote configurado: $repo_url"
fi
echo ""

# Passo 8: Renomear branch para main (se necessário)
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "🔄 Renomeando branch para main..."
    git branch -M main
    success "Branch renomeada para main"
fi
echo ""

# Passo 9: Push para GitHub
echo "🚀 Enviando para GitHub..."
echo ""
git push -u origin main

# Verificar se o push foi bem-sucedido
if [ $? -eq 0 ]; then
    echo ""
    success "======================================"
    success "🎉 Código enviado para GitHub!"
    success "======================================"
    echo ""
    echo "📍 Próximos passos:"
    echo "   1. Acesse: $(git remote get-url origin | sed 's/.git$//')"
    echo "   2. Verifique se todos os arquivos estão lá"
    echo "   3. Configure o deploy (veja DEPLOY.md)"
    echo ""
else
    echo ""
    error "======================================"
    error "Erro ao enviar para GitHub!"
    error "======================================"
    echo ""
    echo "💡 Possíveis soluções:"
    echo "   1. Verifique sua autenticação (token ou SSH)"
    echo "   2. Execute: git pull origin main"
    echo "   3. Resolva conflitos se houver"
    echo "   4. Tente novamente: git push -u origin main"
    echo ""
    echo "📚 Mais ajuda em: GITHUB_SETUP.md"
    echo ""
    exit 1
fi
