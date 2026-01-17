@echo off
REM ============================================
REM Script de Deploy Automático para GitHub
REM SysConecta v2.0 - Windows
REM ============================================

echo.
echo ========================================
echo  SysConecta - Deploy para GitHub
echo ========================================
echo.

REM Verificar se Git está instalado
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Git nao esta instalado!
    echo Baixe em: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo [OK] Git instalado

REM Verificar se já é um repositório Git
if not exist ".git" (
    echo.
    echo [INFO] Inicializando repositorio Git...
    git init
    echo [OK] Repositorio inicializado
) else (
    echo [OK] Repositorio Git ja existe
)

echo.
echo ========================================
echo  Verificando arquivos...
echo ========================================
echo.

REM Verificar .gitignore
if not exist ".gitignore" (
    echo [ERRO] .gitignore nao encontrado!
    pause
    exit /b 1
)
echo [OK] .gitignore encontrado

REM Avisos sobre arquivos sensíveis
if exist ".env" (
    echo [AVISO] Arquivo .env encontrado! Verifique se esta no .gitignore
)
if exist ".env.local" (
    echo [AVISO] Arquivo .env.local encontrado! Verifique se esta no .gitignore
)

echo.
echo ========================================
echo  Adicionando arquivos...
echo ========================================
echo.

git add .
echo [OK] Arquivos adicionados

echo.
echo ========================================
echo  Fazendo commit...
echo ========================================
echo.

set /p commit_message="Digite a mensagem do commit (ou Enter para usar padrao): "

if "%commit_message%"=="" (
    set commit_message=chore: atualizacao geral
)

git commit -m "%commit_message%"
echo [OK] Commit realizado: %commit_message%

echo.
echo ========================================
echo  Verificando remote...
echo ========================================
echo.

git remote | findstr "origin" >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo [INFO] Remote nao configurado
    echo.
    echo Configure o remote do GitHub:
    echo 1. Crie um repositorio no GitHub: https://github.com/new
    echo 2. Copie a URL do repositorio
    echo.
    set /p repo_url="Cole a URL do repositorio GitHub: "
    
    git remote add origin !repo_url!
    echo [OK] Remote configurado
) else (
    echo [OK] Remote 'origin' ja configurado
    git remote get-url origin
)

echo.
echo ========================================
echo  Renomeando branch para main...
echo ========================================
echo.

git branch -M main
echo [OK] Branch main

echo.
echo ========================================
echo  Enviando para GitHub...
echo ========================================
echo.

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo  SUCESSO! Codigo enviado para GitHub!
    echo ========================================
    echo.
    echo Proximos passos:
    echo 1. Acesse seu repositorio no GitHub
    echo 2. Verifique se todos os arquivos estao la
    echo 3. Configure o deploy (veja DEPLOY.md^)
    echo.
) else (
    echo.
    echo ========================================
    echo  ERRO ao enviar para GitHub!
    echo ========================================
    echo.
    echo Possiveis solucoes:
    echo 1. Verifique sua autenticacao (token ou SSH^)
    echo 2. Execute: git pull origin main
    echo 3. Resolva conflitos se houver
    echo 4. Tente novamente: git push -u origin main
    echo.
    echo Mais ajuda em: GITHUB_SETUP.md
    echo.
)

pause
