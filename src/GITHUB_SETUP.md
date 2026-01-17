# 🚀 Guia Completo: Como Colocar o SysConecta no GitHub

Este guia te mostra **passo a passo** como colocar todo o código do SysConecta no GitHub.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:

- [ ] **Git instalado** - [Baixe aqui](https://git-scm.com/downloads)
- [ ] **Conta no GitHub** - [Crie gratuitamente](https://github.com/join)
- [ ] **Código do SysConecta** na sua máquina

---

## 🎯 Passo 1: Instale o Git (se necessário)

### Windows

```bash
# Baixe e instale: https://git-scm.com/download/win
# Ou use winget:
winget install --id Git.Git -e --source winget
```

### macOS

```bash
# Use Homebrew
brew install git

# Ou baixe: https://git-scm.com/download/mac
```

### Linux (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install git
```

**Verifique a instalação:**

```bash
git --version
# Deve mostrar algo como: git version 2.40.0
```

---

## 🎯 Passo 2: Configure o Git

```bash
# Configure seu nome (será visível nos commits)
git config --global user.name "Seu Nome"

# Configure seu email (use o mesmo do GitHub)
git config --global user.email "seu.email@exemplo.com"

# Verifique as configurações
git config --list
```

---

## 🎯 Passo 3: Crie um Repositório no GitHub

### Via Interface Web:

1. **Acesse**: [github.com/new](https://github.com/new)

2. **Preencha**:
   - **Repository name**: `sysconecta`
   - **Description**: `Sistema Industrial de Gestão para Vidraçarias e Fornecedores`
   - **Visibilidade**: 
     - ✅ **Public** (recomendado para portfolio)
     - ⚠️ **Private** (se quiser manter privado)
   - **NÃO marque**: "Add a README file" (já temos um)
   - **NÃO marque**: "Add .gitignore" (já temos um)
   - **License**: MIT (opcional, mas recomendado)

3. **Clique**: "Create repository"

4. **Copie a URL** que aparece (algo como):
   ```
   https://github.com/SEU_USUARIO/sysconecta.git
   ```

---

## 🎯 Passo 4: Prepare o Código Local

### Abra o Terminal na Pasta do Projeto

```bash
# Navegue até a pasta do projeto
cd /caminho/para/sysconecta

# Verifique se está no lugar certo
ls
# Deve mostrar: App.tsx, components/, supabase/, etc.
```

### Inicialize o Repositório Git

```bash
# Inicialize o repositório
git init

# Verifique
git status
# Deve mostrar muitos arquivos "Untracked"
```

---

## 🎯 Passo 5: Adicione os Arquivos

### Verifique o .gitignore

```bash
# Veja se o .gitignore existe
cat .gitignore

# Deve ter conteúdo como:
# node_modules/
# .env
# .env.local
# etc.
```

> ✅ O `.gitignore` foi criado automaticamente e está protegendo seus secrets!

### Adicione Todos os Arquivos

```bash
# Adicione todos os arquivos
git add .

# Verifique o que será commitado
git status

# Deve mostrar muitos arquivos em verde (staged)
```

### ⚠️ IMPORTANTE: Verifique se NÃO está adicionando:

```bash
# Estes arquivos NÃO devem aparecer:
# .env
# .env.local
# .env.production
# node_modules/

# Se aparecerem, REMOVA:
git reset .env
git reset .env.local
```

---

## 🎯 Passo 6: Primeiro Commit

```bash
# Faça o primeiro commit
git commit -m "feat: primeiro commit - sistema completo SysConecta v2.0"

# Deve mostrar algo como:
# 150 files changed, 15000 insertions(+)
# create mode 100644 App.tsx
# create mode 100644 README.md
# etc.
```

---

## 🎯 Passo 7: Conecte ao GitHub

```bash
# Adicione o repositório remoto (use a URL que você copiou)
git remote add origin https://github.com/SEU_USUARIO/sysconecta.git

# Verifique
git remote -v
# Deve mostrar:
# origin  https://github.com/SEU_USUARIO/sysconecta.git (fetch)
# origin  https://github.com/SEU_USUARIO/sysconecta.git (push)
```

---

## 🎯 Passo 8: Envie para o GitHub

```bash
# Renomeie a branch para main (se necessário)
git branch -M main

# Envie o código
git push -u origin main
```

### Se pedir autenticação:

#### Opção 1: Personal Access Token (Recomendado)

1. Acesse: [github.com/settings/tokens](https://github.com/settings/tokens)
2. Clique em "Generate new token" > "Generate new token (classic)"
3. Preencha:
   - **Note**: `SysConecta CLI`
   - **Expiration**: `90 days` (ou o que preferir)
   - **Scopes**: Marque `repo` (todos os sub-items)
4. Clique em "Generate token"
5. **COPIE O TOKEN** (você só verá uma vez!)
6. Use como senha quando o Git pedir

#### Opção 2: SSH (Alternativa)

```bash
# Gere uma chave SSH
ssh-keygen -t ed25519 -C "seu.email@exemplo.com"

# Copie a chave pública
cat ~/.ssh/id_ed25519.pub

# Adicione no GitHub:
# https://github.com/settings/ssh/new
# Cole a chave e salve

# Mude a URL do remote para SSH
git remote set-url origin git@github.com:SEU_USUARIO/sysconecta.git

# Tente novamente
git push -u origin main
```

---

## 🎯 Passo 9: Verifique no GitHub

1. **Acesse**: `https://github.com/SEU_USUARIO/sysconecta`

2. **Você deve ver**:
   - ✅ Todos os arquivos do projeto
   - ✅ README.md renderizado na página principal
   - ✅ Badges de versão, licença, etc.
   - ✅ Estrutura de pastas completa

3. **Verifique se NÃO aparecem**:
   - ❌ `.env` ou `.env.local`
   - ❌ `node_modules/`
   - ❌ Arquivos temporários

---

## 🎯 Passo 10: Configure o Repositório (Opcional)

### Adicione Topics

1. Clique no ⚙️ (settings) ao lado de "About"
2. Adicione topics:
   ```
   react
   typescript
   supabase
   vidracaria
   esquadrias
   erp
   b2b
   industria
   tailwindcss
   ```
3. Salve

### Adicione Description

Edite a descrição:
```
Sistema Industrial de Gestão para Vidraçarias e Fornecedores de Esquadrias - React + TypeScript + Supabase
```

### Adicione Website (se tiver)

```
https://sysconecta.vercel.app
```

---

## 🎯 Workflow Diário: Como Fazer Updates

### Quando fizer mudanças no código:

```bash
# 1. Veja o que mudou
git status

# 2. Adicione os arquivos modificados
git add .

# 3. Faça commit com mensagem descritiva
git commit -m "feat: adiciona nova funcionalidade X"
# ou
git commit -m "fix: corrige bug Y"
# ou
git commit -m "docs: atualiza documentação"

# 4. Envie para o GitHub
git push
```

### Tipos de commits (Conventional Commits):

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Mudanças na documentação
- `style:` - Formatação, espaços, etc
- `refactor:` - Refatoração de código
- `perf:` - Melhoria de performance
- `test:` - Adicionar testes
- `chore:` - Tarefas de manutenção

**Exemplos**:

```bash
git commit -m "feat(fornecedor): adiciona filtro de pedidos por status"
git commit -m "fix(auth): corrige erro de login com email inválido"
git commit -m "docs(readme): atualiza instruções de instalação"
```

---

## 🎯 Comandos Git Essenciais

### Verificar status

```bash
git status
```

### Ver histórico de commits

```bash
git log
# ou mais compacto:
git log --oneline
```

### Ver mudanças antes de commitar

```bash
git diff
```

### Desfazer mudanças não commitadas

```bash
# Desfazer mudanças em um arquivo
git checkout -- nome-do-arquivo.tsx

# Desfazer todas as mudanças
git reset --hard
```

### Baixar mudanças do GitHub

```bash
git pull
```

### Criar uma nova branch

```bash
# Criar e mudar para nova branch
git checkout -b feature/minha-feature

# Enviar nova branch para o GitHub
git push -u origin feature/minha-feature
```

### Mudar de branch

```bash
git checkout main
git checkout feature/minha-feature
```

### Mesclar branches

```bash
# Estando na main
git merge feature/minha-feature
```

---

## 🎯 Boas Práticas

### ✅ SEMPRE faça:

1. **Commits pequenos e frequentes**
   ```bash
   # Bom
   git commit -m "feat: adiciona botão de filtro"
   git commit -m "style: melhora layout do botão"
   
   # Ruim
   git commit -m "muitas mudanças"
   ```

2. **Mensagens de commit descritivas**
   ```bash
   # Bom
   git commit -m "fix(auth): corrige validação de email no login"
   
   # Ruim
   git commit -m "fix"
   ```

3. **Verifique antes de commitar**
   ```bash
   git status
   git diff
   ```

4. **Pull antes de Push**
   ```bash
   git pull
   git push
   ```

### ❌ NUNCA faça:

1. **Commitar arquivos sensíveis**
   - ❌ `.env`
   - ❌ `.env.local`
   - ❌ Senhas, tokens, API keys

2. **Commitar node_modules**
   - Já está no `.gitignore`

3. **Commits muito grandes**
   - Divida em commits menores

4. **Force push na main**
   ```bash
   # EVITE isso:
   git push --force
   ```

---

## 🆘 Resolução de Problemas

### Erro: "rejected because the remote contains work"

```bash
# Baixe as mudanças primeiro
git pull origin main

# Se houver conflitos, resolva manualmente e depois:
git add .
git commit -m "merge: resolve conflitos"
git push
```

### Erro: "Authentication failed"

1. Verifique se está usando o token correto
2. Gere um novo Personal Access Token
3. Use o token como senha

### Accidentally committed .env

```bash
# Remove do histórico
git rm --cached .env

# Adicione ao .gitignore se não estiver
echo ".env" >> .gitignore

# Commit
git add .gitignore
git commit -m "fix: remove .env do repositório"
git push

# IMPORTANTE: Depois, mude todas as keys no .env!
```

### Arquivo muito grande

```bash
# GitHub tem limite de 100MB por arquivo
# Para arquivos grandes, use Git LFS:
git lfs install
git lfs track "*.dwg"
git add .gitattributes
git commit -m "chore: adiciona Git LFS para arquivos DWG"
```

---

## 📚 Recursos Adicionais

### Documentação

- [Git Official Docs](https://git-scm.com/doc)
- [GitHub Docs](https://docs.github.com)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

### Tutoriais

- [Git Tutorial for Beginners](https://www.youtube.com/watch?v=8JJ101D3knE)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)

### Ferramentas GUI

Se preferir interface gráfica:

- [GitHub Desktop](https://desktop.github.com/)
- [GitKraken](https://www.gitkraken.com/)
- [SourceTree](https://www.sourcetreeapp.com/)

---

## ✅ Checklist Final

Antes de considerar o setup completo:

- [ ] Repositório criado no GitHub
- [ ] Git instalado e configurado localmente
- [ ] Código commitado e enviado
- [ ] `.env` NÃO está no GitHub
- [ ] README.md aparece corretamente
- [ ] Todos os arquivos estão presentes
- [ ] Topics adicionados
- [ ] Description configurada
- [ ] Você consegue fazer `git push` sem erros

---

## 🎉 Pronto!

Seu código está agora no GitHub! 🚀

**Próximos passos:**

1. Configure o deploy (veja `/DEPLOY.md`)
2. Adicione colaboradores (se necessário)
3. Configure GitHub Actions para CI/CD
4. Adicione badges ao README
5. Crie releases quando lançar novas versões

---

**URL do seu repositório:**
```
https://github.com/SEU_USUARIO/sysconecta
```

Compartilhe com o mundo! 🌍
