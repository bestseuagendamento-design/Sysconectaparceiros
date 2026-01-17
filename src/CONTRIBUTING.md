# 🤝 Guia de Contribuição - SysConecta

Obrigado por considerar contribuir com o SysConecta! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Posso Contribuir?](#como-posso-contribuir)
- [Processo de Desenvolvimento](#processo-de-desenvolvimento)
- [Padrões de Código](#padrões-de-código)
- [Commits](#commits)
- [Pull Requests](#pull-requests)
- [Reportando Bugs](#reportando-bugs)
- [Sugerindo Features](#sugerindo-features)

---

## 📜 Código de Conduta

Este projeto adere a um código de conduta. Ao participar, você deve respeitar este código.

### Nossas Regras

- Use linguagem acolhedora e inclusiva
- Seja respeitoso com diferentes pontos de vista
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros da comunidade

---

## 🎯 Como Posso Contribuir?

### 1. Reportar Bugs

Encontrou um bug? Nos ajude reportando através de uma issue.

**Antes de criar uma issue:**
- Verifique se o bug já não foi reportado
- Verifique se está usando a versão mais recente
- Colete informações sobre o bug

**Ao criar a issue, inclua:**
- Título descritivo
- Passos para reproduzir o problema
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Informações do ambiente (navegador, SO, etc.)

### 2. Sugerir Features

Tem uma ideia para melhorar o SysConecta?

**Crie uma issue com:**
- Título claro e descritivo
- Descrição detalhada da feature
- Por que essa feature seria útil
- Exemplos de uso (se possível)

### 3. Contribuir com Código

Quer contribuir com código? Ótimo!

**Áreas onde você pode ajudar:**
- Corrigir bugs
- Implementar novas features
- Melhorar documentação
- Adicionar testes
- Otimizar performance
- Melhorar UI/UX

---

## 🔧 Processo de Desenvolvimento

### 1. Fork o Repositório

```bash
# Clone seu fork
git clone https://github.com/SEU_USUARIO/sysconecta.git
cd sysconecta

# Adicione o repositório original como upstream
git remote add upstream https://github.com/ORIGINAL/sysconecta.git
```

### 2. Configure o Ambiente

```bash
# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Inicie o servidor de desenvolvimento
npm run dev
```

### 3. Crie uma Branch

```bash
# Sempre crie uma branch a partir da main atualizada
git checkout main
git pull upstream main
git checkout -b feature/minha-feature
```

### 4. Faça suas Alterações

- Escreva código limpo e legível
- Siga os padrões de código do projeto
- Adicione comentários quando necessário
- Teste suas alterações
- Mantenha commits pequenos e focados

### 5. Teste

```bash
# Execute type checking
npm run type-check

# Execute linting
npm run lint

# Teste manualmente no navegador
npm run dev
```

### 6. Commit

```bash
git add .
git commit -m "feat: adiciona nova feature X"
```

### 7. Push

```bash
git push origin feature/minha-feature
```

### 8. Abra um Pull Request

- Vá para o GitHub e abra um Pull Request
- Preencha o template de PR
- Aguarde review

---

## 💻 Padrões de Código

### TypeScript

```typescript
// ✅ BOM - Use tipos explícitos
interface Pedido {
  id: string;
  valor: number;
  status: 'pendente' | 'aprovado' | 'cancelado';
}

function processarPedido(pedido: Pedido): void {
  // ...
}

// ❌ RUIM - Evite any
function processar(data: any) {
  // ...
}
```

### React Components

```typescript
// ✅ BOM - Componente funcional com tipos
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={`btn-${variant}`}>
      {label}
    </button>
  );
}

// ❌ RUIM - Sem tipos
export function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;
}
```

### Tailwind CSS

```typescript
// ✅ BOM - Classes organizadas
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">

// ❌ RUIM - Classes desorganizadas
<div className="p-4 flex shadow-md rounded-lg bg-white items-center justify-between">
```

### Nomenclatura

- **Componentes**: PascalCase (`DashboardFornecedor.tsx`)
- **Funções**: camelCase (`calcularTotal()`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_ITEMS`)
- **Arquivos**: kebab-case para utils (`calcular-quantidades.ts`)

### Estrutura de Arquivos

```
/components
  /fornecedor
    DashboardFornecedor.tsx    # Componente principal
    PedidosFornecedor.tsx      # Componente secundário
  /ui
    button.tsx                 # Componente UI
/utils
  calcular-total.ts            # Utilitário
/data
  catalogoProdutos.ts          # Dados estáticos
```

---

## 📝 Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/).

### Formato

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

### Tipos

- `feat`: Nova feature
- `fix`: Correção de bug
- `docs`: Alterações na documentação
- `style`: Formatação, ponto e vírgula, etc
- `refactor`: Refatoração de código
- `perf`: Melhoria de performance
- `test`: Adição de testes
- `chore`: Tarefas de manutenção

### Exemplos

```bash
# Feature
feat(fornecedor): adiciona filtro de pedidos por status

# Bug fix
fix(auth): corrige erro de login com email inválido

# Documentação
docs(readme): atualiza instruções de instalação

# Refatoração
refactor(pedidos): simplifica lógica de cálculo de total

# Performance
perf(dashboard): otimiza carregamento de gráficos
```

---

## 🔍 Pull Requests

### Checklist antes de abrir um PR

- [ ] Código está formatado corretamente
- [ ] Não há erros de TypeScript
- [ ] Não há warnings no console
- [ ] Testei localmente
- [ ] Adicionei comentários quando necessário
- [ ] Atualizei a documentação (se necessário)
- [ ] Segui os padrões de código do projeto
- [ ] Commits seguem o padrão Conventional Commits

### Template de PR

```markdown
## Descrição
Breve descrição das mudanças

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Como Testar
1. Passo 1
2. Passo 2
3. ...

## Screenshots (se aplicável)
[Adicione screenshots]

## Checklist
- [ ] Código testado localmente
- [ ] Sem erros no console
- [ ] Documentação atualizada
- [ ] Segue padrões do projeto
```

---

## 🐛 Reportando Bugs

### Template de Issue - Bug

```markdown
## Descrição do Bug
Descrição clara do que acontece

## Passos para Reproduzir
1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

## Comportamento Esperado
O que deveria acontecer

## Comportamento Atual
O que está acontecendo

## Screenshots
[Adicione screenshots]

## Ambiente
- OS: [ex: Windows 10]
- Navegador: [ex: Chrome 120]
- Versão: [ex: 2.0.0]

## Informações Adicionais
Qualquer contexto adicional
```

---

## ✨ Sugerindo Features

### Template de Issue - Feature

```markdown
## Resumo da Feature
Descrição breve e clara

## Motivação
Por que essa feature é necessária?

## Descrição Detalhada
Descrição completa da feature

## Alternativas Consideradas
Outras soluções que você considerou

## Contexto Adicional
Screenshots, mockups, etc
```

---

## 🚨 Regras Importantes

### ⚠️ NUNCA publique com erros

**Regra crítica**: Antes de fazer commit ou PR:
1. Verifique o console do navegador
2. Execute `npm run type-check`
3. Execute `npm run lint`
4. Teste todas as funcionalidades afetadas

Veja: `/REGRA-CRITICA-NUNCA-PUBLICAR-COM-ERROS.md`

### 🔐 Segurança

- NUNCA commite arquivos `.env` ou `.env.local`
- NUNCA exponha chaves de API no código
- NUNCA commite senhas ou tokens
- Use variáveis de ambiente para secrets

### 📦 Dependências

- Adicione apenas dependências necessárias
- Verifique licenças antes de adicionar libs
- Mantenha dependências atualizadas
- Documente novas dependências no README

---

## 🎓 Aprendendo o Código

### Documentação Interna

Antes de contribuir, leia:

1. `/README.md` - Overview do projeto
2. `/ESPECIFICACAO-TECNICA-INDUSTRIAL-COMPLETA.md` - Spec técnica
3. `/ARQUITETURA_DASHBOARD_FORNECEDORES.md` - Arquitetura
4. `/INICIO-RAPIDO.md` - Quick start

### Componentes Importantes

- `/App.tsx` - Componente raiz
- `/components/fornecedor/DashboardFornecedor.tsx` - Dashboard principal
- `/supabase/functions/server/index.tsx` - API server
- `/utils/supabase/client.ts` - Cliente Supabase

### Fluxos Principais

1. **Autenticação**: `/components/auth/`
2. **Pedidos**: `/components/fornecedor/PedidosFornecedor.tsx`
3. **Produção**: `/components/fornecedor/ProducaoFornecedor.tsx`
4. **Preços**: `/components/fornecedor/GestaoPrecos.tsx`

---

## 💬 Comunicação

### Onde pedir ajuda?

- **Issues**: Para bugs e features
- **Discussions**: Para discussões gerais
- **Pull Requests**: Para review de código

### Resposta

- Issues serão triadas em até 48h
- PRs serão revisados em até 1 semana
- Bugs críticos têm prioridade

---

## 🏆 Reconhecimento

Todos os contribuidores serão:
- Listados no arquivo CONTRIBUTORS.md
- Mencionados nos release notes
- Creditados nas redes sociais do projeto

---

## 📚 Recursos Úteis

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## ❓ Dúvidas?

Se tiver dúvidas sobre como contribuir:

1. Leia esta documentação novamente
2. Procure em issues fechadas
3. Abra uma issue com a tag `question`
4. Entre em contato com os mantenedores

---

**Obrigado por contribuir com o SysConecta! 🚀**

Cada contribuição, por menor que seja, faz diferença para tornar este projeto melhor.
