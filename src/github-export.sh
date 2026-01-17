#!/bin/bash

################################################################################
# 🚀 Script Automático de Export para GitHub - SysConecta
################################################################################
# 
# Este script automatiza todo o processo de export do SysConecta para GitHub:
# 1. Verifica dependências (git, gh)
# 2. Inicializa o repositório Git
# 3. Adiciona todos os arquivos
# 4. Faz o commit inicial
# 5. Cria o repositório no GitHub
# 6. Faz o push de todos os arquivos
#
# Uso: ./github-export.sh
#
################################################################################

set -e  # Para o script em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
REPO_NAME="sysconecta"
REPO_DESCRIPTION="Sistema completo de gestão de pedidos de vidro com auditoria técnica e integração Supabase"
DEFAULT_BRANCH="main"

################################################################################
# Funções auxiliares
################################################################################

print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

################################################################################
# Verificações iniciais
################################################################################

print_header "🔍 Verificando Dependências"

# Verificar se Git está instalado
if ! command -v git &> /dev/null; then
    print_error "Git não está instalado!"
    echo ""
    echo "Por favor, instale o Git:"
    echo "  - macOS: brew install git"
    echo "  - Ubuntu: sudo apt install git"
    echo "  - Windows: https://git-scm.com/download/win"
    exit 1
fi
print_success "Git instalado: $(git --version)"

# Verificar se GitHub CLI está instalado
if ! command -v gh &> /dev/null; then
    print_warning "GitHub CLI (gh) não está instalado!"
    echo ""
    echo "Você pode:"
    echo "  1. Instalar o GitHub CLI para automação completa:"
    echo "     - macOS: brew install gh"
    echo "     - Ubuntu: sudo apt install gh"
    echo "     - Windows: winget install GitHub.cli"
    echo ""
    echo "  2. OU continuar sem GitHub CLI (você precisará criar o repositório manualmente)"
    echo ""
    read -p "Continuar sem GitHub CLI? (s/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
    USE_GH_CLI=false
else
    print_success "GitHub CLI instalado: $(gh --version | head -n 1)"
    USE_GH_CLI=true
fi

################################################################################
# Configuração do Git
################################################################################

print_header "⚙️  Configurando Git"

# Verificar se o usuário configurou nome e email
if [ -z "$(git config user.name)" ] || [ -z "$(git config user.email)" ]; then
    print_warning "Configuração do Git não encontrada"
    echo ""
    read -p "Digite seu nome: " git_name
    read -p "Digite seu email: " git_email
    git config --global user.name "$git_name"
    git config --global user.email "$git_email"
    print_success "Git configurado"
else
    print_success "Git já configurado para $(git config user.name) <$(git config user.email)>"
fi

################################################################################
# Inicialização do Repositório
################################################################################

print_header "📦 Inicializando Repositório Git"

# Verificar se já existe um repositório Git
if [ -d .git ]; then
    print_warning "Repositório Git já existe!"
    echo ""
    read -p "Deseja reinicializar? Isso irá apagar o histórico existente! (s/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        rm -rf .git
        print_info "Repositório removido"
    else
        print_info "Mantendo repositório existente"
    fi
fi

# Inicializar Git
if [ ! -d .git ]; then
    git init
    print_success "Repositório Git inicializado"
fi

# Renomear branch para main se necessário
current_branch=$(git branch --show-current)
if [ "$current_branch" != "$DEFAULT_BRANCH" ]; then
    git branch -M $DEFAULT_BRANCH
    print_success "Branch renomeada para $DEFAULT_BRANCH"
fi

################################################################################
# Verificação de Segurança
################################################################################

print_header "🔒 Verificação de Segurança"

# Verificar se .gitignore existe
if [ ! -f .gitignore ]; then
    print_error "Arquivo .gitignore não encontrado!"
    exit 1
fi
print_success "Arquivo .gitignore encontrado"

# Verificar se há arquivos sensíveis que serão commitados
print_info "Verificando arquivos sensíveis..."
sensitive_files=$(git ls-files | grep -E '\.env$|\.env\.local$|secrets|password|api.*key' || true)
if [ ! -z "$sensitive_files" ]; then
    print_error "Arquivos sensíveis detectados:"
    echo "$sensitive_files"
    echo ""
    print_error "Adicione estes arquivos ao .gitignore antes de continuar!"
    exit 1
fi
print_success "Nenhum arquivo sensível detectado"

################################################################################
# Adicionar e Commitar Arquivos
################################################################################

print_header "📝 Adicionando Arquivos ao Git"

# Adicionar todos os arquivos
git add .
print_success "Arquivos adicionados ao staging"

# Mostrar resumo dos arquivos
files_count=$(git diff --cached --numstat | wc -l)
print_info "Total de arquivos: $files_count"

# Fazer commit
print_info "Criando commit inicial..."
git commit -m "🎉 Initial commit: SysConecta v1.0.0

Sistema completo de gestão de pedidos de vidro com:
- ✅ Auditoria técnica completa
- ✅ Persistência real no Supabase
- ✅ Isolamento por user_id
- ✅ Sistema de leitura DWG/DXF
- ✅ Gestão completa para fornecedores
- ✅ Interface responsiva com React + Tailwind
- ✅ Backend Supabase Edge Functions
- ✅ Autenticação e autorização
- ✅ Documentação completa

Features principais:
- Login e registro de usuários
- Dashboard com estatísticas
- Gestão de pedidos (criar, editar, visualizar)
- Perfil FORNECEDOR com gestão de itens
- Leitura automática de arquivos CAD
- Cálculo de área e extração de medidas
- Sistema de confiança para validação
- Integração com scanner via código do vidro
- Imagens CAD SVG
- Status de produção em tempo real

Tecnologias:
- React 18 + TypeScript
- Tailwind CSS v4
- Supabase (Database, Auth, Storage, Edge Functions)
- Vite
- Lucide Icons
- React Hook Form
- Sonner Toast

Deploy: Vercel (ver DEPLOY.md)
Docs: Ver README.md, CONTRIBUTING.md, CHANGELOG.md
"
print_success "Commit criado"

################################################################################
# Criar Repositório no GitHub
################################################################################

if [ "$USE_GH_CLI" = true ]; then
    print_header "🌐 Criando Repositório no GitHub"
    
    # Verificar autenticação
    print_info "Verificando autenticação no GitHub..."
    if ! gh auth status &> /dev/null; then
        print_warning "Você não está autenticado no GitHub"
        print_info "Iniciando processo de autenticação..."
        gh auth login
    fi
    print_success "Autenticado no GitHub"
    
    # Perguntar se o repo será público ou privado
    echo ""
    echo "O repositório será:"
    echo "  1. Público (visível para todos)"
    echo "  2. Privado (apenas para você e colaboradores)"
    echo ""
    read -p "Escolha (1 ou 2) [1]: " repo_visibility
    repo_visibility=${repo_visibility:-1}
    
    if [ "$repo_visibility" = "1" ]; then
        visibility_flag="--public"
        visibility_text="público"
    else
        visibility_flag="--private"
        visibility_text="privado"
    fi
    
    # Criar repositório
    print_info "Criando repositório $visibility_text no GitHub..."
    
    if gh repo create $REPO_NAME \
        $visibility_flag \
        --source=. \
        --remote=origin \
        --description="$REPO_DESCRIPTION" \
        --push; then
        
        print_success "Repositório criado e código enviado com sucesso!"
        
        # Obter URL do repositório
        repo_url=$(gh repo view --json url -q .url)
        
        echo ""
        print_header "🎉 EXPORT CONCLUÍDO COM SUCESSO!"
        echo ""
        print_success "Repositório: $repo_url"
        echo ""
        echo "Próximos passos:"
        echo "  1. Acesse: $repo_url"
        echo "  2. Verifique se todos os arquivos foram enviados"
        echo "  3. Configure deploy no Vercel (ver DEPLOY.md)"
        echo "  4. Adicione colaboradores se necessário"
        echo "  5. Configure proteção de branches (opcional)"
        echo ""
        
        # Perguntar se quer abrir o repositório no navegador
        read -p "Abrir repositório no navegador? (S/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Nn]$ ]]; then
            gh repo view --web
        fi
        
    else
        print_error "Falha ao criar repositório no GitHub"
        print_info "Você pode criar manualmente em: https://github.com/new"
        exit 1
    fi
    
else
    ############################################################################
    # Modo Manual (sem GitHub CLI)
    ############################################################################
    
    print_header "📋 Próximos Passos Manuais"
    
    echo ""
    print_info "O código foi preparado e commitado localmente"
    print_info "Agora você precisa criar o repositório no GitHub manualmente:"
    echo ""
    echo "1. Acesse: https://github.com/new"
    echo ""
    echo "2. Configure o repositório:"
    echo "   - Repository name: $REPO_NAME"
    echo "   - Description: $REPO_DESCRIPTION"
    echo "   - Escolha: Public ou Private"
    echo "   - NÃO marque 'Add a README file'"
    echo "   - NÃO marque 'Add .gitignore'"
    echo ""
    echo "3. Clique em 'Create repository'"
    echo ""
    echo "4. Execute os comandos fornecidos pelo GitHub, que serão algo como:"
    echo ""
    echo "   git remote add origin https://github.com/bestseuagendamento-design/$REPO_NAME.git"
    echo "   git push -u origin main"
    echo ""
    
    print_warning "Pressione qualquer tecla quando tiver criado o repositório no GitHub..."
    read -n 1 -s
    echo ""
    
    # Perguntar a URL do repositório
    echo ""
    read -p "Cole a URL do repositório (ex: https://github.com/bestseuagendamento-design/$REPO_NAME.git): " repo_url
    
    if [ ! -z "$repo_url" ]; then
        # Adicionar remote
        print_info "Adicionando remote origin..."
        git remote add origin "$repo_url" 2>/dev/null || git remote set-url origin "$repo_url"
        print_success "Remote configurado"
        
        # Fazer push
        print_info "Enviando código para o GitHub..."
        if git push -u origin $DEFAULT_BRANCH; then
            print_success "Código enviado com sucesso!"
            
            # Extrair URL do navegador
            browser_url=$(echo "$repo_url" | sed 's/\.git$//')
            
            echo ""
            print_header "🎉 EXPORT CONCLUÍDO COM SUCESSO!"
            echo ""
            print_success "Repositório: $browser_url"
            echo ""
            echo "Próximos passos:"
            echo "  1. Acesse: $browser_url"
            echo "  2. Verifique se todos os arquivos foram enviados"
            echo "  3. Configure deploy no Vercel (ver DEPLOY.md)"
            echo "  4. Adicione colaboradores se necessário"
            echo ""
        else
            print_error "Falha ao enviar código"
            print_info "Tente manualmente: git push -u origin $DEFAULT_BRANCH"
        fi
    fi
fi

################################################################################
# Adicionar Topics (se usar GitHub CLI)
################################################################################

if [ "$USE_GH_CLI" = true ]; then
    print_header "🏷️  Adicionando Topics"
    
    print_info "Adicionando topics ao repositório..."
    
    gh repo edit \
        --add-topic react \
        --add-topic typescript \
        --add-topic supabase \
        --add-topic tailwindcss \
        --add-topic vite \
        --add-topic gestao-pedidos \
        --add-topic vidracaria \
        --add-topic cad \
        --add-topic dwg \
        --add-topic dxf \
        2>/dev/null && print_success "Topics adicionados" || print_warning "Não foi possível adicionar topics (não é crítico)"
fi

################################################################################
# Criar Release (opcional)
################################################################################

if [ "$USE_GH_CLI" = true ]; then
    echo ""
    read -p "Deseja criar uma release v1.0.0? (S/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        print_header "🏷️  Criando Release v1.0.0"
        
        # Criar tag
        git tag -a v1.0.0 -m "🎉 Release v1.0.0 - Sistema completo com auditoria técnica"
        git push origin v1.0.0
        
        # Criar release
        gh release create v1.0.0 \
            --title "SysConecta v1.0.0" \
            --notes "## 🎉 Release Inicial

**SysConecta v1.0.0** - Sistema completo de gestão de pedidos de vidro

### ✨ Funcionalidades Principais

- ✅ **Auditoria Técnica Completa**: Sistema robusto de persistência e validação
- ✅ **Gestão de Pedidos**: Criar, editar, visualizar e gerenciar pedidos
- ✅ **Perfil Fornecedor**: Gestão completa de itens de produção
- ✅ **Leitura DWG/DXF**: Importação automática de arquivos CAD
- ✅ **Integração Scanner**: Código do vidro para rastreamento
- ✅ **Dashboard Estatísticas**: Visão completa do negócio
- ✅ **Autenticação Segura**: Sistema de login e registro
- ✅ **Backend Supabase**: Edge Functions com Hono

### 🛠️ Tecnologias

- React 18 + TypeScript
- Tailwind CSS v4
- Supabase (Database, Auth, Storage, Edge Functions)
- Vite
- React Hook Form
- Lucide Icons

### 📚 Documentação

- [README.md](README.md) - Documentação principal
- [DEPLOY.md](DEPLOY.md) - Guia de deploy no Vercel
- [CONTRIBUTING.md](CONTRIBUTING.md) - Guia para contribuidores
- [CHANGELOG.md](CHANGELOG.md) - Histórico de versões

### 🚀 Deploy

Este projeto está pronto para deploy no Vercel. Veja o guia completo em [DEPLOY.md](DEPLOY.md).

### 📦 Instalação

\`\`\`bash
npm install
npm run dev
\`\`\`

---

**Desenvolvido com ❤️ para a indústria de vidros**
"
        
        print_success "Release v1.0.0 criada!"
    fi
fi

################################################################################
# Finalização
################################################################################

echo ""
print_header "✅ SCRIPT CONCLUÍDO"
echo ""
print_success "Tudo pronto! Seu projeto está no GitHub."
echo ""
print_info "Verifique o arquivo GITHUB_EXPORT_GUIDE.md para mais detalhes"
echo ""
