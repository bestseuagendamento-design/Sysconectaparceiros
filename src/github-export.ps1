################################################################################
# 🚀 Script Automático de Export para GitHub - SysConecta (PowerShell)
################################################################################
# 
# Este script automatiza todo o processo de export do SysConecta para GitHub
# no Windows usando PowerShell.
#
# Uso: .\github-export.ps1
#
################################################################################

# Configurações
$RepoName = "sysconecta"
$RepoDescription = "Sistema completo de gestão de pedidos de vidro com auditoria técnica e integração Supabase"
$DefaultBranch = "main"

################################################################################
# Funções auxiliares
################################################################################

function Print-Header {
    param([string]$Message)
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
    Write-Host "  $Message" -ForegroundColor Blue
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
    Write-Host ""
}

function Print-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Print-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Print-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Print-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Cyan
}

################################################################################
# Verificações iniciais
################################################################################

Print-Header "🔍 Verificando Dependências"

# Verificar se Git está instalado
try {
    $gitVersion = git --version
    Print-Success "Git instalado: $gitVersion"
} catch {
    Print-Error "Git não está instalado!"
    Write-Host ""
    Write-Host "Por favor, instale o Git:"
    Write-Host "  - Baixe em: https://git-scm.com/download/win"
    Write-Host "  - OU use: winget install Git.Git"
    exit 1
}

# Verificar se GitHub CLI está instalado
$UseGhCli = $false
try {
    $ghVersion = gh --version
    Print-Success "GitHub CLI instalado: $($ghVersion[0])"
    $UseGhCli = $true
} catch {
    Print-Warning "GitHub CLI (gh) não está instalado!"
    Write-Host ""
    Write-Host "Você pode:"
    Write-Host "  1. Instalar o GitHub CLI para automação completa:"
    Write-Host "     winget install GitHub.cli"
    Write-Host ""
    Write-Host "  2. OU continuar sem GitHub CLI (você precisará criar o repositório manualmente)"
    Write-Host ""
    $response = Read-Host "Continuar sem GitHub CLI? (s/N)"
    if ($response -notmatch '^[Ss]$') {
        exit 1
    }
}

################################################################################
# Configuração do Git
################################################################################

Print-Header "⚙️  Configurando Git"

# Verificar se o usuário configurou nome e email
$gitName = git config user.name
$gitEmail = git config user.email

if ([string]::IsNullOrEmpty($gitName) -or [string]::IsNullOrEmpty($gitEmail)) {
    Print-Warning "Configuração do Git não encontrada"
    Write-Host ""
    $gitName = Read-Host "Digite seu nome"
    $gitEmail = Read-Host "Digite seu email"
    git config --global user.name $gitName
    git config --global user.email $gitEmail
    Print-Success "Git configurado"
} else {
    Print-Success "Git já configurado para $gitName <$gitEmail>"
}

################################################################################
# Inicialização do Repositório
################################################################################

Print-Header "📦 Inicializando Repositório Git"

# Verificar se já existe um repositório Git
if (Test-Path .git) {
    Print-Warning "Repositório Git já existe!"
    Write-Host ""
    $response = Read-Host "Deseja reinicializar? Isso irá apagar o histórico existente! (s/N)"
    if ($response -match '^[Ss]$') {
        Remove-Item -Path .git -Recurse -Force
        Print-Info "Repositório removido"
    } else {
        Print-Info "Mantendo repositório existente"
    }
}

# Inicializar Git
if (-not (Test-Path .git)) {
    git init
    Print-Success "Repositório Git inicializado"
}

# Renomear branch para main se necessário
$currentBranch = git branch --show-current
if ($currentBranch -ne $DefaultBranch) {
    git branch -M $DefaultBranch
    Print-Success "Branch renomeada para $DefaultBranch"
}

################################################################################
# Verificação de Segurança
################################################################################

Print-Header "🔒 Verificação de Segurança"

# Verificar se .gitignore existe
if (-not (Test-Path .gitignore)) {
    Print-Error "Arquivo .gitignore não encontrado!"
    exit 1
}
Print-Success "Arquivo .gitignore encontrado"

# Verificar se há arquivos sensíveis que serão commitados
Print-Info "Verificando arquivos sensíveis..."
$sensitiveFiles = git ls-files | Select-String -Pattern '\.env$|\.env\.local$|secrets|password|api.*key'
if ($sensitiveFiles) {
    Print-Error "Arquivos sensíveis detectados:"
    $sensitiveFiles | ForEach-Object { Write-Host $_ }
    Write-Host ""
    Print-Error "Adicione estes arquivos ao .gitignore antes de continuar!"
    exit 1
}
Print-Success "Nenhum arquivo sensível detectado"

################################################################################
# Adicionar e Commitar Arquivos
################################################################################

Print-Header "📝 Adicionando Arquivos ao Git"

# Adicionar todos os arquivos
git add .
Print-Success "Arquivos adicionados ao staging"

# Mostrar resumo dos arquivos
$filesCount = (git diff --cached --numstat | Measure-Object).Count
Print-Info "Total de arquivos: $filesCount"

# Fazer commit
Print-Info "Criando commit inicial..."
$commitMessage = @"
🎉 Initial commit: SysConecta v1.0.0

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
"@

git commit -m $commitMessage
Print-Success "Commit criado"

################################################################################
# Criar Repositório no GitHub
################################################################################

if ($UseGhCli) {
    Print-Header "🌐 Criando Repositório no GitHub"
    
    # Verificar autenticação
    Print-Info "Verificando autenticação no GitHub..."
    try {
        gh auth status | Out-Null
        Print-Success "Autenticado no GitHub"
    } catch {
        Print-Warning "Você não está autenticado no GitHub"
        Print-Info "Iniciando processo de autenticação..."
        gh auth login
    }
    
    # Perguntar se o repo será público ou privado
    Write-Host ""
    Write-Host "O repositório será:"
    Write-Host "  1. Público (visível para todos)"
    Write-Host "  2. Privado (apenas para você e colaboradores)"
    Write-Host ""
    $repoVisibility = Read-Host "Escolha (1 ou 2) [1]"
    if ([string]::IsNullOrEmpty($repoVisibility)) {
        $repoVisibility = "1"
    }
    
    if ($repoVisibility -eq "1") {
        $visibilityFlag = "--public"
        $visibilityText = "público"
    } else {
        $visibilityFlag = "--private"
        $visibilityText = "privado"
    }
    
    # Criar repositório
    Print-Info "Criando repositório $visibilityText no GitHub..."
    
    try {
        gh repo create $RepoName `
            $visibilityFlag `
            --source=. `
            --remote=origin `
            --description=$RepoDescription `
            --push
        
        Print-Success "Repositório criado e código enviado com sucesso!"
        
        # Obter URL do repositório
        $repoUrl = gh repo view --json url -q .url
        
        Write-Host ""
        Print-Header "🎉 EXPORT CONCLUÍDO COM SUCESSO!"
        Write-Host ""
        Print-Success "Repositório: $repoUrl"
        Write-Host ""
        Write-Host "Próximos passos:"
        Write-Host "  1. Acesse: $repoUrl"
        Write-Host "  2. Verifique se todos os arquivos foram enviados"
        Write-Host "  3. Configure deploy no Vercel (ver DEPLOY.md)"
        Write-Host "  4. Adicione colaboradores se necessário"
        Write-Host "  5. Configure proteção de branches (opcional)"
        Write-Host ""
        
        # Perguntar se quer abrir o repositório no navegador
        $response = Read-Host "Abrir repositório no navegador? (S/n)"
        if ($response -notmatch '^[Nn]$') {
            gh repo view --web
        }
        
    } catch {
        Print-Error "Falha ao criar repositório no GitHub"
        Print-Info "Você pode criar manualmente em: https://github.com/new"
        exit 1
    }
    
} else {
    ############################################################################
    # Modo Manual (sem GitHub CLI)
    ############################################################################
    
    Print-Header "📋 Próximos Passos Manuais"
    
    Write-Host ""
    Print-Info "O código foi preparado e commitado localmente"
    Print-Info "Agora você precisa criar o repositório no GitHub manualmente:"
    Write-Host ""
    Write-Host "1. Acesse: https://github.com/new"
    Write-Host ""
    Write-Host "2. Configure o repositório:"
    Write-Host "   - Repository name: $RepoName"
    Write-Host "   - Description: $RepoDescription"
    Write-Host "   - Escolha: Public ou Private"
    Write-Host "   - NÃO marque 'Add a README file'"
    Write-Host "   - NÃO marque 'Add .gitignore'"
    Write-Host ""
    Write-Host "3. Clique em 'Create repository'"
    Write-Host ""
    Write-Host "4. Execute os comandos fornecidos pelo GitHub, que serão algo como:"
    Write-Host ""
    Write-Host "   git remote add origin https://github.com/bestseuagendamento-design/$RepoName.git"
    Write-Host "   git push -u origin main"
    Write-Host ""
    
    Print-Warning "Pressione qualquer tecla quando tiver criado o repositório no GitHub..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    Write-Host ""
    
    # Perguntar a URL do repositório
    Write-Host ""
    $repoUrl = Read-Host "Cole a URL do repositório (ex: https://github.com/bestseuagendamento-design/$RepoName.git)"
    
    if (-not [string]::IsNullOrEmpty($repoUrl)) {
        # Adicionar remote
        Print-Info "Adicionando remote origin..."
        try {
            git remote add origin $repoUrl 2>$null
        } catch {
            git remote set-url origin $repoUrl
        }
        Print-Success "Remote configurado"
        
        # Fazer push
        Print-Info "Enviando código para o GitHub..."
        try {
            git push -u origin $DefaultBranch
            Print-Success "Código enviado com sucesso!"
            
            # Extrair URL do navegador
            $browserUrl = $repoUrl -replace '\.git$', ''
            
            Write-Host ""
            Print-Header "🎉 EXPORT CONCLUÍDO COM SUCESSO!"
            Write-Host ""
            Print-Success "Repositório: $browserUrl"
            Write-Host ""
            Write-Host "Próximos passos:"
            Write-Host "  1. Acesse: $browserUrl"
            Write-Host "  2. Verifique se todos os arquivos foram enviados"
            Write-Host "  3. Configure deploy no Vercel (ver DEPLOY.md)"
            Write-Host "  4. Adicione colaboradores se necessário"
            Write-Host ""
        } catch {
            Print-Error "Falha ao enviar código"
            Print-Info "Tente manualmente: git push -u origin $DefaultBranch"
        }
    }
}

################################################################################
# Adicionar Topics (se usar GitHub CLI)
################################################################################

if ($UseGhCli) {
    Print-Header "🏷️  Adicionando Topics"
    
    Print-Info "Adicionando topics ao repositório..."
    
    try {
        gh repo edit `
            --add-topic react `
            --add-topic typescript `
            --add-topic supabase `
            --add-topic tailwindcss `
            --add-topic vite `
            --add-topic gestao-pedidos `
            --add-topic vidracaria `
            --add-topic cad `
            --add-topic dwg `
            --add-topic dxf
        Print-Success "Topics adicionados"
    } catch {
        Print-Warning "Não foi possível adicionar topics (não é crítico)"
    }
}

################################################################################
# Criar Release (opcional)
################################################################################

if ($UseGhCli) {
    Write-Host ""
    $response = Read-Host "Deseja criar uma release v1.0.0? (S/n)"
    if ($response -notmatch '^[Nn]$') {
        Print-Header "🏷️  Criando Release v1.0.0"
        
        # Criar tag
        git tag -a v1.0.0 -m "🎉 Release v1.0.0 - Sistema completo com auditoria técnica"
        git push origin v1.0.0
        
        # Criar release
        $releaseNotes = @"
## 🎉 Release Inicial

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

``````bash
npm install
npm run dev
``````

---

**Desenvolvido com ❤️ para a indústria de vidros**
"@
        
        gh release create v1.0.0 `
            --title "SysConecta v1.0.0" `
            --notes $releaseNotes
        
        Print-Success "Release v1.0.0 criada!"
    }
}

################################################################################
# Finalização
################################################################################

Write-Host ""
Print-Header "✅ SCRIPT CONCLUÍDO"
Write-Host ""
Print-Success "Tudo pronto! Seu projeto está no GitHub."
Write-Host ""
Print-Info "Verifique o arquivo GITHUB_EXPORT_GUIDE.md para mais detalhes"
Write-Host ""
