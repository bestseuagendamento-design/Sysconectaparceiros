# 🏗️ SysConecta - Sistema Industrial de Gestão para Vidraçarias e Fornecedores

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/react-18.0%2B-61dafb.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.0%2B-3178c6.svg)
![Supabase](https://img.shields.io/badge/supabase-enabled-green.svg)

## 📋 Sobre o Projeto

**SysConecta** é uma plataforma industrial completa para gestão de vidraçarias e fornecedores de esquadrias de alumínio. O sistema oferece controle total desde o orçamento até a produção, com recursos avançados de automação, rastreamento e gestão multi-tenant.

### 🎯 Principais Funcionalidades

- ✅ **Autenticação Completa** - Sistema de login com múltiplos perfis (Vidraceiro, Fornecedor, Admin)
- ✅ **Multi-Tenancy com RLS** - Isolamento total de dados por `user_id` no Supabase
- ✅ **Gestão de Pedidos** - Fluxo completo de orçamento até produção
- ✅ **Leitor DWG/DXF** - Importação automática de projetos CAD com extração de medidas
- ✅ **Configurador de Produtos** - Sistema Suprema com cálculos técnicos precisos
- ✅ **Dashboard Fornecedor** - Gestão completa de pedidos, estoque e produção
- ✅ **Scanner de Fábrica** - Rastreamento de peças com QR Code
- ✅ **Gestão de Preços** - Controle de preços por fornecedor e estado
- ✅ **Cálculos Industriais** - Motor de compatibilidade e cálculo de materiais
- ✅ **Sistema de Entregas** - Rotas, mapas e rastreamento em tempo real
- ✅ **Marketplace B2B** - Plataforma de compra e venda entre vidraçarias e fornecedores

---

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **Tailwind CSS v4** para estilização
- **Lucide React** para ícones
- **Recharts** para gráficos e dashboards
- **Motion (Framer Motion)** para animações
- **React Hook Form** para formulários complexos
- **Sonner** para notificações toast

### Backend
- **Supabase** - Database PostgreSQL com RLS
- **Supabase Auth** - Autenticação e autorização
- **Supabase Storage** - Armazenamento de arquivos
- **Edge Functions** - API serverless com Hono framework
- **Deno Runtime** para edge functions

### Ferramentas de Desenvolvimento
- **TypeScript** para type safety
- **ESLint** para linting
- **Git** para controle de versão

---

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuita)
- Git instalado

### Passo 1: Clone o repositório

```bash
git clone https://github.com/SEU_USUARIO/sysconecta.git
cd sysconecta
```

### Passo 2: Instale as dependências

```bash
npm install
```

### Passo 3: Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase Configuration
SUPABASE_URL=sua_url_supabase
SUPABASE_ANON_KEY=sua_chave_publica
SUPABASE_SERVICE_ROLE_KEY=sua_chave_servico

# Email Configuration (Opcional - Resend)
RESEND_API_KEY=sua_chave_resend
```

> **⚠️ IMPORTANTE**: Nunca compartilhe suas chaves de API. O arquivo `.env.local` está no `.gitignore` e não será commitado.

### Passo 4: Configure o Supabase

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Crie um novo projeto
3. Copie a URL e as chaves de API
4. Execute as migrações do banco (veja seção [Database Setup](#database-setup))

### Passo 5: Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173` (ou outra porta indicada).

---

## 🗄️ Database Setup

### Estrutura do Banco de Dados

O SysConecta utiliza 12 tabelas principais no Supabase:

1. **users** - Perfis de usuários
2. **vidraceiros** - Dados específicos de vidraçarias
3. **fornecedores** - Dados de fornecedores
4. **clientes** - Clientes finais
5. **orcamentos** - Orçamentos criados
6. **pedidos** - Pedidos confirmados
7. **produtos** - Catálogo de produtos
8. **estoque** - Controle de estoque
9. **precos** - Tabelas de preços por fornecedor
10. **entregas** - Gestão de entregas
11. **producao** - Controle de produção
12. **kv_store_f33747ec** - Chave-valor para dados flexíveis

### Inicialização do Banco

Para inicializar o banco de dados, siga os guias em:

- `/COMO-INICIALIZAR-BANCO.md` - Guia passo a passo
- `/SYSCONECTA_DATABASE_README.md` - Documentação completa do schema

### Row Level Security (RLS)

Todas as tabelas implementam RLS para garantir isolamento de dados:

```sql
-- Exemplo de policy RLS
CREATE POLICY "Users can only see their own data"
ON pedidos
FOR SELECT
USING (auth.uid() = user_id);
```

Veja mais em: `/EXPLICACAO_RLS_E_MULTI_TENANCY.md`

---

## 👥 Perfis de Usuário

### 1. VIDRACEIRO (Vidraçaria)
- Criar orçamentos e pedidos
- Gerenciar clientes finais
- Acompanhar status de produção
- Acesso ao marketplace

### 2. FORNECEDOR (Fábrica de Esquadrias)
- Receber e processar pedidos
- Gerenciar produção
- Controlar estoque
- Definir preços por região
- Sistema de scanner e etiquetas

### 3. ADMIN
- Acesso total ao sistema
- Cadastro de tipologias
- Gestão de usuários
- Configurações globais

---

## 🎨 Estrutura de Componentes

```
/components
├── /admin              # Componentes administrativos
├── /auth               # Autenticação e cadastro
├── /debug              # Ferramentas de debug
├── /fornecedor         # Dashboard do fornecedor
├── /navigation         # Navegação mobile/desktop
├── /ui                 # Componentes UI reutilizáveis
├── /utils              # Utilitários e helpers
└── /vidraceiro         # Componentes do vidraceiro
```

### Componentes Principais

- **App.tsx** - Componente raiz da aplicação
- **DashboardFornecedor.tsx** - Dashboard completo do fornecedor
- **ConfiguradorSupremaCompleto.tsx** - Configurador de produtos Suprema
- **PedidosFornecedor.tsx** - Gestão de pedidos recebidos
- **LeitorDWG.tsx** - Leitor de arquivos DWG/DXF (em desenvolvimento)

---

## 🔧 Funcionalidades Avançadas

### 1. Leitor DWG/DXF

Sistema de importação automática de projetos CAD:

```typescript
// Importar diretamente do CAD para orçamento
import { LeitorDWG } from './components/vidracaria/LeitorDWG';

// Identifica automaticamente:
// - Janelas
// - Portas
// - Guarda-corpos
// - Extrai medidas (largura x altura)
// - Calcula área em m²
```

### 2. Configurador Suprema

Cálculos técnicos precisos para esquadrias:

- Cálculo de quantidade de peças
- Compatibilidade de motores
- Dimensionamento de trilhos
- Lista de materiais (BOM)
- SVG técnico em tempo real

### 3. Sistema de Produção

Rastreamento completo:

- QR Code para cada peça
- Scanner de fábrica
- Status em tempo real
- Etiquetas de identificação
- Código de vidro para integração

### 4. Gestão de Preços

Controle granular por fornecedor:

- Preços de vidro, alumínio e acessórios
- Variação por estado/região
- Sistema de markup
- Histórico de alterações

---

## 📱 Recursos Mobile

- **Design Responsivo** - Funciona perfeitamente em mobile e desktop
- **Bottom Navigation** - Navegação otimizada para mobile
- **Touch Gestures** - Suporte a gestos touch
- **PWA Ready** - Pode ser instalado como app

---

## 🔐 Segurança

### Autenticação

- JWT tokens com Supabase Auth
- Refresh token automático
- Session management
- Social login (Google, Facebook, GitHub)

### Autorização

- Row Level Security (RLS)
- Policy-based access control
- User roles e permissions
- Multi-tenant isolation

### Proteção de Dados

- HTTPS obrigatório
- Environment variables para secrets
- Sanitização de inputs
- CORS configurado corretamente

---

## 📊 Migração de Dados

O sistema inclui migração automática que roda uma única vez no login:

```typescript
// Migra 25 pedidos existentes automaticamente
// Adiciona userId correto
// Executa apenas uma vez por usuário
```

Veja mais em: `/MIGRACAO_AUTOMATICA.md`

---

## 🐛 Debug e Testes

### Ferramentas de Debug

- **DebugSalvamento.tsx** - Testa salvamento no Supabase
- **DebugClientes.tsx** - Verifica isolamento multi-tenant
- **DebugPedidos.tsx** - Inspeciona pedidos do fornecedor
- **TesteMultiTenancy.tsx** - Valida RLS

### Testes Rápidos

Consulte os guias:
- `/TESTE_RAPIDO_30_SEGUNDOS.md`
- `/TESTE_IMEDIATO_SALVAMENTO.md`
- `/VERIFICACAO_CRITICA_SISTEMA.md`

---

## 📚 Documentação Adicional

### Guias Técnicos
- `/ESPECIFICACAO-TECNICA-INDUSTRIAL-COMPLETA.md` - Spec completa
- `/ARQUITETURA_DASHBOARD_FORNECEDORES.md` - Arquitetura do dashboard
- `/CALCULO-TECNICO-README.md` - Documentação de cálculos

### Guias de Uso
- `/INICIO-RAPIDO.md` - Quick start guide
- `/COMO_FUNCIONA_PEDIDO_VIDRACEIRO_FORNECEDOR.md` - Fluxo de pedidos
- `/COMO_FUNCIONA_PRECOS_CONFIGURADOR.md` - Sistema de preços

### Correções e Updates
- `/CORRECAO-ARQUITETURA-FORNECEDOR.md`
- `/CORRECAO_PERSISTENCIA_PEDIDOS.md`
- `/SOLUCAO_PERSISTENCIA_FINAL.md`

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Regras Importantes

⚠️ **NUNCA publique com erros no console!** - Veja `/REGRA-CRITICA-NUNCA-PUBLICAR-COM-ERROS.md`

---

## 🐞 Problemas Conhecidos

- Leitor DWG/DXF em desenvolvimento (extração de medidas)
- Alguns imports React podem causar avisos
- HTML2Canvas pode estourar memória em SVGs muito grandes

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido com ❤️ para a indústria de esquadrias de alumínio

---

## 🌟 Agradecimentos

- Supabase pela infraestrutura incrível
- Comunidade React/TypeScript
- Todos os contribuidores

---

## 📞 Suporte

Para dúvidas e suporte:

- Abra uma [Issue](https://github.com/SEU_USUARIO/sysconecta/issues)
- Consulte a documentação em `/INDEX-GUIAS.md`

---

## 🚀 Roadmap

- [x] Sistema de autenticação completo
- [x] Dashboard fornecedor funcional
- [x] Gestão de pedidos com RLS
- [x] Configurador Suprema
- [x] Sistema de preços
- [ ] Leitor DWG/DXF completo
- [ ] App mobile nativo
- [ ] Integração com ERPs
- [ ] API pública
- [ ] Webhooks
- [ ] Analytics avançado

---

**Última atualização**: Janeiro 2026

**Status**: ✅ Produção - Sistema funcional e robusto
