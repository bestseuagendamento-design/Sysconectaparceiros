# 🔐 PAINEL DE ADMINISTRADOR MASTER - SYSCONECTA

## 📋 DOCUMENTAÇÃO COMPLETA

---

## 🔑 CREDENCIAIS DE ACESSO

```
Email: Leandro.zara@gmail.com
Senha: 56734297Ombongo!
```

⚠️ **IMPORTANTE**: Estas credenciais são salvas em localStorage após o login e dão acesso total ao sistema.

---

## 🚪 COMO ACESSAR

### 1. **Ícone Secreto na Tela de Login**

Na tela de login principal do SysConecta, há um **ícone secreto** no canto superior direito:

```
┌─────────────────────────────────────┐
│                            🔐       │  ← Clique aqui
│                                     │
│        SYSCONECTA LOGIN             │
│                                     │
└─────────────────────────────────────┘
```

- **Localização**: Canto superior direito
- **Aparência**: Bolinha vermelha com cadeado 🔐
- **Estado normal**: Quase invisível (opacity: 10%)
- **Ao passar o mouse**: Fica visível (opacity: 100%)

### 2. **Tela de Login Admin**

Ao clicar no ícone secreto, você será levado para a tela de login administrativo:

- Fundo escuro (tema dark)
- Campo de email
- Campo de senha
- Autenticação segura

### 3. **Dashboard Admin**

Após o login bem-sucedido, você acessa o painel completo de administração.

---

## 📊 FUNCIONALIDADES DO PAINEL

### **ABA 1: 📊 Visão Geral**

**Cards de Resumo:**
- ✅ Fornecedores Ativos
- ✅ Vagas Ocupadas (de 81 possíveis)
- ✅ Vagas Disponíveis
- ✅ Indústrias Parceiras

**Gráficos de Distribuição:**
- Fornecedores de VIDRO (x / 27 estados)
- Fornecedores de ALUMÍNIO (x / 27 estados)
- Fornecedores de ACESSÓRIOS (x / 27 estados)

**Progresso visual** com barras coloridas mostrando ocupação por tipo.

---

### **ABA 2: ➕ Cadastrar Fornecedor**

**Formulário Completo:**

#### Dados Básicos:
- Razão Social *
- Nome Fantasia *
- CNPJ *
- Tipo (VIDRO / ALUMÍNIO / ACESSÓRIOS) *
- Estado (27 estados do Brasil) *

#### Responsável:
- Nome *
- Email *
- Telefone *

#### Endereço:
- Logradouro *
- Número *
- Bairro *
- Cidade *
- CEP *

**Validações Automáticas:**
- ✅ Verifica se já existe fornecedor no estado/tipo
- ✅ Verifica se CNPJ já está cadastrado
- ✅ Atribui indústria parceira automaticamente:
  - VIDRO → Guardian Glass
  - ALUMÍNIO → (Não definida ainda)
  - ACESSÓRIOS → (Não definida ainda)
- ✅ Registra data de adesão automaticamente
- ✅ Ativa o fornecedor por padrão

**Após cadastro:**
- ✅ Salva no banco de dados (KV Store)
- ✅ Atualiza mapa de exclusividade territorial
- ✅ Redireciona para aba "Fornecedores"

---

### **ABA 3: 🏢 Fornecedores**

**Listagem Completa:**

Para cada fornecedor, exibe:
- 🏢 Nome Fantasia
- Status (Ativo/Inativo)
- Tipo (VIDRO/ALUMÍNIO/ACESSÓRIOS)
- Razão Social
- CNPJ
- Estado
- Cidade
- Responsável (Nome, Email, Telefone)
- Data de Adesão
- Indústria Parceira

**Ações Disponíveis:**
- ❌ Inativar Fornecedor (com confirmação)

**Filtros:**
- Por estado
- Por tipo
- Por status (ativo/inativo)

---

### **ABA 4: 🏭 Indústrias**

**Indústrias Parceiras Cadastradas:**

#### Guardian Glass (Ativa)
- **Tipo**: VIDRO
- **Status**: Ativa
- **Descrição**: Indústria EXCLUSIVA de vidros para todos os fornecedores do SysConecta
- **Parceria desde**: 01/01/2024

#### Alumínio e Acessórios
- Status: Não definidas
- Aguardando definição das indústrias parceiras

**Função:**
- Visualizar indústrias ativas
- Acompanhar parcerias
- (Futuro: Cadastrar novas indústrias)

---

### **ABA 5: 🏪 Empresas Conectadas**

**Visão por Segmento:**

#### Fornecedores de Vidro
- Quantidade total
- Lista completa com:
  - Nome Fantasia
  - Estado
  - Status

#### Fornecedores de Alumínio
- Quantidade total
- Lista completa

#### Fornecedores de Acessórios
- Quantidade total
- Lista completa

#### Vidraceiros Ativos
- Total de vidraceiros cadastrados
- Lista de vidraceiros
- (Será integrado com sistema de autenticação)

**Função:**
- Gestão completa de todas as empresas conectadas
- Visão consolidada por segmento
- Acompanhamento de crescimento da rede

---

### **ABA 6: 💰 Comprovantes & Comissões**

#### **Cards de Resumo:**

1. **Comissões do Mês**
   - Soma de todas as comissões do mês atual
   - Cálculo automático (5% do valor de cada pedido)

2. **Total de Comprovantes**
   - Quantidade total de comprovantes registrados

3. **Comissão Total Acumulada**
   - Soma de todas as comissões de todos os tempos
   - Valor histórico completo

#### **Filtros:**
- 📅 Por período (mês/ano)
- 🏢 Por fornecedor
- ✅ Por status (pendente/aprovado)

#### **Tabela de Comprovantes:**

Exibe para cada comprovante:
- **Data**: Data do pagamento
- **Fornecedor**: Nome do fornecedor que recebeu
- **Vidraceiro**: Nome do vidraceiro que pagou
- **Categoria**: Tipo de material (Vidros/Alumínio/Acessórios)
- **Valor**: Valor total do pedido
- **Comissão (5%)**: Valor que o SysConecta recebe
- **Comprovante**: Link para visualizar o arquivo anexado

#### **Ações:**
- 👁️ Visualizar comprovante (abre em nova aba)
- 📥 Exportar relatório completo (Excel/PDF)

#### **Por que isso é importante:**

```
╔══════════════════════════════════════════════════╗
║  CONTROLE FINANCEIRO TOTAL                       ║
║                                                  ║
║  ✅ Rastreamento de TODOS os pagamentos          ║
║  ✅ Cálculo automático das comissões (5%)        ║
║  ✅ Comprovantes visuais para auditoria          ║
║  ✅ Relatórios para acerto de contas             ║
║  ✅ Transparência total nas transações           ║
╚══════════════════════════════════════════════════╝
```

**Fluxo de pagamento:**
```
1. Vidraceiro faz pedido com fornecedor
2. Fornecedor aprova pedido
3. Vidraceiro paga via PIX
4. Vidraceiro anexa comprovante no sistema
5. ✅ Comprovante aparece automaticamente no painel admin
6. Admin pode visualizar e controlar comissões
```

---

## 🔒 SEGURANÇA

### **Autenticação:**
- Login com email e senha específicos
- Credenciais salvas em localStorage
- Session persistente até logout manual

### **Proteção:**
- Ícone secreto quase invisível
- Acesso apenas com credenciais corretas
- Todas as ações registradas

### **Logout:**
- Botão vermelho no header
- Limpa localStorage
- Retorna para tela de login principal

---

## 🗄️ BANCO DE DADOS

### **APIs Utilizadas:**

```typescript
// Fornecedores
GET  /sysconecta/fornecedores          // Listar todos
GET  /sysconecta/fornecedor/:id        // Buscar específico
POST /sysconecta/fornecedor            // Criar novo
PUT  /sysconecta/fornecedor/:id        // Atualizar
DELETE /sysconecta/fornecedor/:id      // Inativar

// Estatísticas
GET  /sysconecta/estatisticas          // Dados gerais
GET  /sysconecta/relatorio             // Relatório completo

// Exclusividade
GET  /sysconecta/exclusividade/mapa    // Mapa de vagas

// Admin
GET  /admin/comprovantes               // Todos os comprovantes
GET  /admin/empresas                   // Todas as empresas
```

### **Armazenamento:**

Tudo é salvo no **Supabase KV Store** com as seguintes chaves:

```
fornecedor:{fornecedorId}              → Dados do fornecedor
industria:{industriaId}                → Dados da indústria
exclusividade:{estado}:{tipo}          → Controle de vagas
config:sistema                         → Configurações
pedido:fornecedor:{id}:{pedidoId}      → Pedidos (com comprovantes)
```

---

## 📈 MÉTRICAS E KPIs

### **Acompanhamento em Tempo Real:**

1. **Crescimento da Rede:**
   - Total de fornecedores ativos
   - % de vagas ocupadas (x / 81)
   - Taxa de crescimento mensal

2. **Receita:**
   - Comissões do mês
   - Comissões acumuladas
   - Ticket médio por transação

3. **Atividade:**
   - Número de comprovantes/mês
   - Volume financeiro movimentado
   - Fornecedores mais ativos

---

## 🎯 REGRAS DE NEGÓCIO IMPLEMENTADAS

### **Exclusividade Territorial:**
```
✅ Apenas 1 fornecedor por estado por tipo
✅ Total: 27 estados × 3 tipos = 81 vagas
✅ Validação automática no cadastro
```

### **Indústrias Parceiras:**
```
✅ VIDRO → Guardian Glass (EXCLUSIVA)
⏳ ALUMÍNIO → Não definida
⏳ ACESSÓRIOS → Não definida
```

### **Comissões:**
```
✅ 5% sobre cada transação
✅ Cálculo automático
✅ Rastreamento completo
```

### **Roteamento:**
```
✅ Baseado no ESTADO DO VIDRACEIRO
❌ NÃO baseado no cliente final
```

---

## 🚀 PRÓXIMOS PASSOS

### **Funcionalidades Futuras:**

1. **Cadastro de Indústrias**
   - Permitir admin cadastrar novas indústrias
   - Vincular indústrias a tipos de fornecedores

2. **Gestão de Vidraceiros**
   - Listar todos os vidraceiros cadastrados
   - Aprovar/reprovar cadastros
   - Gerenciar permissões

3. **Relatórios Avançados**
   - Exportar dados em Excel/PDF
   - Gráficos de performance
   - Análise de tendências

4. **Notificações**
   - Alertas de novos cadastros
   - Avisos de problemas
   - Resumos mensais

5. **Marketplace SYS**
   - Gestão de produtos complementares
   - Controle de comissões (3-6%)
   - Aprovação de parceiros

---

## 📞 SUPORTE

**Administrador Master:**
- Email: Leandro.zara@gmail.com
- Acesso: Total
- Permissões: Todas

**Em caso de problemas:**
1. Verificar logs no console do navegador
2. Verificar conexão com backend
3. Limpar localStorage e fazer login novamente
4. Contatar suporte técnico

---

## ✅ CHECKLIST DE FUNCIONALIDADES

### **Implementadas:**
- ✅ Login seguro com credenciais
- ✅ Dashboard com estatísticas em tempo real
- ✅ Cadastro completo de fornecedores
- ✅ Listagem e gestão de fornecedores
- ✅ Visualização de indústrias parceiras
- ✅ Empresas conectadas por segmento
- ✅ Comprovantes de pagamento com rastreamento
- ✅ Cálculo automático de comissões (5%)
- ✅ Validação de exclusividade territorial
- ✅ Integração completa com backend
- ✅ Ícone secreto para acesso

### **A Implementar:**
- ⏳ Cadastro de indústrias pelo admin
- ⏳ Gestão de vidraceiros
- ⏳ Exportação de relatórios
- ⏳ Notificações em tempo real
- ⏳ Marketplace SYS

---

## 🎉 CONCLUSÃO

O **Painel de Administrador Master** oferece controle total sobre:

- 🏢 Todos os fornecedores da rede
- 🏭 Indústrias parceiras
- 🏪 Empresas conectadas (fornecedores + vidraceiros)
- 💰 Comprovantes de pagamento
- 💵 Comissões do SysConecta
- 📊 Estatísticas e métricas em tempo real
- 🗺️ Mapa de exclusividade territorial

**Acesso simples, poder total! 🔐**
