# 🚀 Guia de Deploy - SysConecta

Este guia mostra como fazer deploy do SysConecta em diferentes plataformas.

## 📋 Índice

- [Pré-requisitos](#pré-requisitos)
- [Deploy no Vercel](#deploy-no-vercel)
- [Deploy no Netlify](#deploy-no-netlify)
- [Deploy Supabase Edge Functions](#deploy-supabase-edge-functions)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Checklist de Deploy](#checklist-de-deploy)
- [Troubleshooting](#troubleshooting)

---

## ✅ Pré-requisitos

Antes de fazer deploy, certifique-se de ter:

- [ ] Conta no Supabase (gratuita)
- [ ] Projeto Supabase criado e configurado
- [ ] Database inicializado (veja `/COMO-INICIALIZAR-BANCO.md`)
- [ ] Variáveis de ambiente configuradas
- [ ] Código sem erros no console
- [ ] Testes locais passando

---

## 🔵 Deploy no Vercel

### Método 1: Via Interface Web

1. **Acesse o Vercel**
   - Vá para [vercel.com](https://vercel.com)
   - Faça login com sua conta GitHub

2. **Importe o Repositório**
   - Clique em "New Project"
   - Selecione seu repositório `sysconecta`
   - Clique em "Import"

3. **Configure o Projeto**
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Adicione as Variáveis de Ambiente**
   ```
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_ANON_KEY=sua_chave_publica
   SUPABASE_SERVICE_ROLE_KEY=sua_chave_servico
   RESEND_API_KEY=sua_chave_resend
   ```

5. **Deploy**
   - Clique em "Deploy"
   - Aguarde o build completar
   - Acesse sua aplicação em `https://seu-app.vercel.app`

### Método 2: Via CLI

```bash
# Instale o Vercel CLI
npm i -g vercel

# Faça login
vercel login

# Execute o deploy
vercel

# Para produção
vercel --prod
```

### Configuração Avançada (vercel.json)

Crie um arquivo `vercel.json` na raiz:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## 🟢 Deploy no Netlify

### Método 1: Via Interface Web

1. **Acesse o Netlify**
   - Vá para [netlify.com](https://netlify.com)
   - Faça login com sua conta GitHub

2. **Importe o Repositório**
   - Clique em "Add new site" > "Import an existing project"
   - Selecione GitHub
   - Escolha seu repositório `sysconecta`

3. **Configure o Build**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18

4. **Adicione as Variáveis de Ambiente**
   - Vá para "Site settings" > "Environment variables"
   - Adicione as mesmas variáveis do Vercel

5. **Deploy**
   - Clique em "Deploy site"
   - Aguarde o build completar

### Método 2: Via CLI

```bash
# Instale o Netlify CLI
npm install -g netlify-cli

# Faça login
netlify login

# Inicialize o projeto
netlify init

# Deploy
netlify deploy

# Para produção
netlify deploy --prod
```

### Configuração (netlify.toml)

Crie um arquivo `netlify.toml` na raiz:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

## 🟣 Deploy Supabase Edge Functions

### 1. Instale o Supabase CLI

```bash
# macOS/Linux
brew install supabase/tap/supabase

# Windows (Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# NPM (alternativa)
npm install -g supabase
```

### 2. Faça Login

```bash
supabase login
```

### 3. Link ao Projeto

```bash
# Na raiz do projeto
supabase link --project-ref seu-project-id
```

### 4. Deploy das Functions

```bash
# Deploy todas as functions
supabase functions deploy

# Deploy uma function específica
supabase functions deploy make-server-f33747ec

# Com secrets
supabase secrets set RESEND_API_KEY=your_key
```

### 5. Verifique o Deploy

```bash
# Liste as functions
supabase functions list

# Veja os logs
supabase functions logs make-server-f33747ec
```

### Estrutura das Functions

```
/supabase/functions/server/
├── index.tsx              # Entry point
├── database.tsx           # Database operations
├── email.tsx             # Email service
├── kv_store.tsx          # Key-value store
├── sysconecta-database.tsx
└── tabela-precos-vidros.tsx
```

---

## 🔑 Variáveis de Ambiente

### Variáveis Obrigatórias

```env
# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Variáveis Opcionais

```env
# Email
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Database
SUPABASE_DB_URL=postgresql://postgres:password@...

# App
NODE_ENV=production
APP_URL=https://sysconecta.com
```

### Como Adicionar Variáveis

#### Vercel
```bash
# Via CLI
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production

# Ou pela interface: Settings > Environment Variables
```

#### Netlify
```bash
# Via CLI
netlify env:set SUPABASE_URL "https://..."

# Ou pela interface: Site settings > Environment variables
```

#### Supabase Functions
```bash
# Via CLI
supabase secrets set RESEND_API_KEY=re_xxx

# Liste secrets
supabase secrets list
```

---

## ✅ Checklist de Deploy

### Antes do Deploy

- [ ] Código sem erros no console
- [ ] TypeScript sem erros (`npm run type-check`)
- [ ] Linting passou (`npm run lint`)
- [ ] Build local funcionando (`npm run build`)
- [ ] Testes manuais realizados
- [ ] Variáveis de ambiente configuradas
- [ ] Database inicializado no Supabase
- [ ] RLS configurado corretamente
- [ ] Edge Functions testadas

### Depois do Deploy

- [ ] Build passou com sucesso
- [ ] Aplicação carrega sem erros
- [ ] Login funciona
- [ ] Pedidos salvam no Supabase
- [ ] RLS está funcionando (dados isolados)
- [ ] Email funciona (se configurado)
- [ ] Scanner QR Code funciona
- [ ] Upload de arquivos funciona
- [ ] Performance aceitável
- [ ] Mobile responsivo

### Monitoramento

- [ ] Configure alertas de erro
- [ ] Configure analytics
- [ ] Configure uptime monitoring
- [ ] Configure error tracking (Sentry, etc)

---

## 🐛 Troubleshooting

### Build Falha

**Problema**: Build falha com erro de TypeScript

**Solução**:
```bash
# Verifique localmente
npm run type-check

# Corrija os erros e commit
git add .
git commit -m "fix: corrige erros TypeScript"
git push
```

### Tela Branca após Deploy

**Problema**: Aplicação mostra tela branca

**Solução**:
1. Verifique o console do browser (F12)
2. Verifique se as variáveis de ambiente estão configuradas
3. Verifique se o redirect está configurado (`/*` -> `/index.html`)

### Erro 404 nas Rotas

**Problema**: Refresh na página dá erro 404

**Solução**:
- Adicione redirect no `vercel.json` ou `netlify.toml`
- Todas as rotas devem redirecionar para `/index.html`

### CORS Error

**Problema**: Erro de CORS ao chamar Supabase

**Solução**:
1. Verifique se as URLs estão corretas
2. Adicione seu domínio nas configurações do Supabase
3. Verifique se as headers CORS estão configuradas

### Functions não Funcionam

**Problema**: Edge Functions retornam erro 500

**Solução**:
```bash
# Veja os logs
supabase functions logs make-server-f33747ec

# Re-deploy com logs
supabase functions deploy make-server-f33747ec --debug
```

### RLS Bloqueando Dados

**Problema**: Dados não aparecem mesmo estando no banco

**Solução**:
1. Verifique as policies RLS no Supabase Dashboard
2. Teste com service role key
3. Veja `/EXPLICACAO_RLS_E_MULTI_TENANCY.md`

### Performance Ruim

**Problema**: Aplicação lenta

**Solução**:
1. Ative cache de build no Vercel/Netlify
2. Use lazy loading de componentes
3. Otimize imagens
4. Minimize bundle size
5. Configure CDN

---

## 📊 Monitoramento

### Vercel Analytics

```bash
# Instale
npm install @vercel/analytics

# Use em App.tsx
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

### Error Tracking (Sentry)

```bash
# Instale
npm install @sentry/react

# Configure
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-dsn",
  environment: process.env.NODE_ENV,
});
```

---

## 🔄 CI/CD

### GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Type Check
        run: npm run type-check
      
      - name: Lint
        run: npm run lint
      
      - name: Build
        run: npm run build
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🌐 Custom Domain

### Vercel

1. Vá para "Settings" > "Domains"
2. Adicione seu domínio
3. Configure DNS:
   - Type: `A`
   - Name: `@`
   - Value: `76.76.21.21`
   
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`

### Netlify

1. Vá para "Domain settings"
2. Adicione custom domain
3. Configure DNS conforme instruções

---

## 📝 Notas Finais

### Segurança

- ✅ Sempre use HTTPS
- ✅ Configure headers de segurança
- ✅ Nunca exponha service role key no frontend
- ✅ Use environment variables para secrets
- ✅ Configure RLS corretamente

### Performance

- ✅ Use CDN
- ✅ Configure cache
- ✅ Otimize imagens
- ✅ Minimize bundle size
- ✅ Use lazy loading

### Backup

- ✅ Configure backups automáticos do Supabase
- ✅ Mantenha cópia local do database schema
- ✅ Versione suas migrations

---

**Deploy bem-sucedido! 🎉**

Se tiver problemas, consulte:
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Supabase Docs](https://supabase.com/docs)
