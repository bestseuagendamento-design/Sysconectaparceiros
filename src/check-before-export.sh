#!/bin/bash

################################################################################
# 🔍 Verificador de Segurança Pré-Export - SysConecta
################################################################################
# 
# Este script verifica se está tudo pronto e seguro para export
#
################################################################################

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  🔍 Verificador de Segurança Pré-Export${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

################################################################################
# 1. Verificar se .gitignore existe
################################################################################

echo -n "Verificando .gitignore... "
if [ -f .gitignore ]; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FALTA${NC}"
    echo "   Arquivo .gitignore não encontrado!"
    ((ERRORS++))
fi

################################################################################
# 2. Verificar se há arquivos .env
################################################################################

echo -n "Verificando arquivos .env... "
if [ -f .env ] || [ -f .env.local ]; then
    echo -e "${YELLOW}⚠️  ATENÇÃO${NC}"
    echo "   Arquivos .env encontrados:"
    [ -f .env ] && echo "   - .env"
    [ -f .env.local ] && echo "   - .env.local"
    echo "   CERTIFIQUE-SE que estão no .gitignore!"
    ((WARNINGS++))
else
    echo -e "${GREEN}✅ OK${NC}"
fi

################################################################################
# 3. Verificar se Git está instalado
################################################################################

echo -n "Verificando Git... "
if command -v git &> /dev/null; then
    echo -e "${GREEN}✅ $(git --version)${NC}"
else
    echo -e "${RED}❌ NÃO INSTALADO${NC}"
    echo "   Por favor, instale o Git antes de continuar"
    ((ERRORS++))
fi

################################################################################
# 4. Verificar se GitHub CLI está instalado
################################################################################

echo -n "Verificando GitHub CLI... "
if command -v gh &> /dev/null; then
    echo -e "${GREEN}✅ $(gh --version | head -n 1)${NC}"
else
    echo -e "${YELLOW}⚠️  NÃO INSTALADO${NC}"
    echo "   GitHub CLI não é obrigatório, mas recomendado"
    echo "   Instale com: brew install gh (macOS) ou sudo apt install gh (Ubuntu)"
    ((WARNINGS++))
fi

################################################################################
# 5. Verificar arquivos essenciais
################################################################################

echo ""
echo "Verificando arquivos essenciais..."

ESSENTIAL_FILES=(
    "package.json"
    "README.md"
    "App.tsx"
)

for file in "${ESSENTIAL_FILES[@]}"; do
    echo -n "  Verificando $file... "
    if [ -f "$file" ] || [ -f "src/$file" ] || [ -f "/$file" ]; then
        echo -e "${GREEN}✅${NC}"
    else
        echo -e "${RED}❌${NC}"
        ((ERRORS++))
    fi
done

################################################################################
# 6. Verificar documentação
################################################################################

echo ""
echo "Verificando documentação..."

DOCS=(
    "README.md"
    "DEPLOY.md"
    "CONTRIBUTING.md"
    "CHANGELOG.md"
)

for doc in "${DOCS[@]}"; do
    echo -n "  Verificando $doc... "
    if [ -f "$doc" ]; then
        echo -e "${GREEN}✅${NC}"
    else
        echo -e "${YELLOW}⚠️  FALTA${NC}"
        ((WARNINGS++))
    fi
done

################################################################################
# 7. Verificar scripts de export
################################################################################

echo ""
echo "Verificando scripts de export..."

SCRIPTS=(
    "quick-export.sh"
    "github-export.sh"
    "github-export.ps1"
)

for script in "${SCRIPTS[@]}"; do
    echo -n "  Verificando $script... "
    if [ -f "$script" ]; then
        echo -e "${GREEN}✅${NC}"
    else
        echo -e "${YELLOW}⚠️  FALTA${NC}"
        ((WARNINGS++))
    fi
done

################################################################################
# 8. Procurar por secrets no código
################################################################################

echo ""
echo "Procurando por secrets no código..."

# Padrões suspeitos
SUSPICIOUS_PATTERNS=(
    "password.*=.*['\"].*['\"]"
    "api.*key.*=.*['\"].*['\"]"
    "secret.*=.*['\"].*['\"]"
    "token.*=.*['\"].*['\"]"
)

FOUND_SECRETS=false

for pattern in "${SUSPICIOUS_PATTERNS[@]}"; do
    results=$(grep -r -i -E "$pattern" --include="*.tsx" --include="*.ts" --include="*.js" --include="*.jsx" . 2>/dev/null || true)
    if [ ! -z "$results" ]; then
        if [ "$FOUND_SECRETS" = false ]; then
            echo -e "${RED}⚠️  Possíveis secrets encontrados no código:${NC}"
            FOUND_SECRETS=true
        fi
        echo "$results" | head -n 5
        ((WARNINGS++))
    fi
done

if [ "$FOUND_SECRETS" = false ]; then
    echo -e "${GREEN}✅ Nenhum secret encontrado${NC}"
fi

################################################################################
# 9. Verificar tamanho do repositório
################################################################################

echo ""
echo -n "Verificando tamanho do repositório... "

REPO_SIZE=$(du -sh . 2>/dev/null | cut -f1)
echo -e "${BLUE}$REPO_SIZE${NC}"

################################################################################
# 10. Verificar node_modules
################################################################################

echo -n "Verificando node_modules... "
if [ -d node_modules ]; then
    NODE_SIZE=$(du -sh node_modules 2>/dev/null | cut -f1)
    echo -e "${YELLOW}⚠️  Existe ($NODE_SIZE)${NC}"
    echo "   CERTIFIQUE-SE que node_modules está no .gitignore!"
    
    # Verificar se está no gitignore
    if grep -q "node_modules" .gitignore 2>/dev/null; then
        echo -e "   ${GREEN}✅ Está no .gitignore${NC}"
    else
        echo -e "   ${RED}❌ NÃO está no .gitignore!${NC}"
        ((ERRORS++))
    fi
else
    echo -e "${GREEN}✅ Não existe${NC}"
fi

################################################################################
# Resumo Final
################################################################################

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "📊 RESUMO:"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ TUDO PERFEITO!${NC}"
    echo ""
    echo "Seu projeto está 100% pronto para export!"
    echo ""
    echo "Execute agora:"
    echo -e "${GREEN}./quick-export.sh${NC}"
    echo ""
    EXIT_CODE=0
    
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNINGS avisos encontrados${NC}"
    echo ""
    echo "Seu projeto está pronto, mas há alguns avisos."
    echo "Revise os avisos acima antes de continuar."
    echo ""
    echo "Para continuar mesmo assim:"
    echo -e "${GREEN}./quick-export.sh${NC}"
    echo ""
    EXIT_CODE=0
    
else
    echo -e "${RED}❌ $ERRORS erros encontrados${NC}"
    [ $WARNINGS -gt 0 ] && echo -e "${YELLOW}⚠️  $WARNINGS avisos encontrados${NC}"
    echo ""
    echo "CORRIJA OS ERROS antes de fazer export!"
    echo ""
    EXIT_CODE=1
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

exit $EXIT_CODE
