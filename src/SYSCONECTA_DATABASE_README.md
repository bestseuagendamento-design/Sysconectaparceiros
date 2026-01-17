# 🗄️ SYSCONECTA - DOCUMENTAÇÃO DO BANCO DE DADOS

## ✅ REGRA DE OURO CORRIGIDA

```
╔════════════════════════════════════════════════════╗
║  EXCLUSIVIDADE BASEADA NO ESTADO DO VIDRACEIRO!    ║
║                                                    ║
║  👤 VIDRACEIRO em SC → Compra de SANTA RITA (SC)   ║
║  👤 VIDRACEIRO em SP → Compra de Fornecedor SP     ║
║  👤 VIDRACEIRO em RJ → Compra de Fornecedor RJ     ║
║                                                    ║
║  ❌ O CLIENTE FINAL NÃO IMPORTA ONDE MORA!         ║
╚════════════════════════════════════════════════════╝
```

### 💡 Exemplo Real:
```
VIDRACEIRO: Vidraçaria Silva (Balneário Camboriú, SC)
CLIENTE: Maria Santos (São Paulo, SP)

COMPRA:
✅ Vidraceiro está em SC
✅ Sistema roteia para: Santa Rita Vidros (SC)
✅ Santa Rita entrega em SC para o vidraceiro
✅ Vidraceiro vai até SP instalar no cliente

O VIDRACEIRO SEMPRE COMPRA DO SEU FORNECEDOR REGIONAL!
```

---

## 📊 STATUS ATUAL DO SISTEMA

| TIPO | FORNECEDORES | INDÚSTRIA PARCEIRA | STATUS |
|------|--------------|-------------------|---------|
| **VIDRO** | **1 (Santa Rita - SC)** | **Guardian Glass** | ✅ **OPERACIONAL** |
| **ALUMÍNIO** | **0 cadastrados** | **Não definida** | ❌ **NÃO EXISTE** |
| **ACESSÓRIOS** | **0 cadastrados** | **Não definida** | ❌ **NÃO EXISTE** |

---

## 🏭 CADEIA DE SUPRIMENTOS

```
┌────────────────────────────────────────────────────┐
│  NÍVEL 1: INDÚSTRIA ÚNICA                          │
│  ┌──────────────────────────────────────┐          │
│  │  🏭 GUARDIAN GLASS (Única fonte)    │          │
│  │     └─ Fornece para TODOS os        │          │
│  │        fornecedores de vidro        │          │
│  └──────────────────────────────────────┘          │
│                    ⬇️ EXCLUSIVO                     │
│  NÍVEL 2: FORNECEDORES REGIONAIS (27 máx)         │
│  ┌──────────────────────────────────────┐          │
│  │  ✅ Santa Rita Vidros (SC)          │          │
│  │  ⚠️  Vaga disponível (SP)           │          │
│  │  ⚠️  Vaga disponível (RJ)           │          │
│  │  ⚠️  Vaga disponível (MG)           │          │
│  │  ⚠️  ... 23 estados restantes       │          │
│  └──────────────────────────────────────┘          │
│                    ⬇️                               │
│  NÍVEL 3: VIDRACEIROS                              │
│  └─ Compram vidro dos fornecedores regionais       │
│                    ⬇️                               │
│  NÍVEL 4: CLIENTE FINAL                            │
│  └─ Recebe produto instalado                       │
└────────────────────────────────────────────────────┘
```

---

## 🗂️ ESTRUTURA DO BANCO DE DADOS

### 📁 Arquivo: `/supabase/functions/server/sysconecta-database.tsx`

### 🔑 Tipos Principais

```typescript
export type TipoFornecedor = 'VIDRO' | 'ALUMINIO' | 'ACESSORIOS';
export type EstadoBR = 'AC' | 'AL' | ... | 'SP' | 'SC' | 'TO'; // 27 estados

export interface Industria {
  id: string;
  nome: string;
  tipo: TipoFornecedor;
  descricao: string;
  ativo: boolean;
  dataCadastro: string;
}

export interface Fornecedor {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  tipo: TipoFornecedor;
  estado: EstadoBR;
  exclusivoEstado: boolean; // Sempre true
  industriaId: string; // ID da indústria parceira
  responsavel: {
    nome: string;
    email: string;
    telefone: string;
  };
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: EstadoBR;
    cep: string;
  };
  ativo: boolean;
  dataAdesao: string;
  dataInativacao?: string;
}

export interface ExclusividadeTerritorial {
  estado: EstadoBR;
  tipo: TipoFornecedor;
  fornecedorId: string | null; // null = vaga disponível
  dataOcupacao?: string;
}
```

---

## 🔌 API ENDPOINTS

### Base URL
```
https://{projectId}.supabase.co/functions/v1/make-server-f33747ec
```

### 🎬 Inicialização
```
POST /sysconecta/init
→ Inicializa o banco de dados com dados padrão
```

### 📊 Estatísticas
```
GET /sysconecta/estatisticas
→ Retorna estatísticas gerais do sistema

GET /sysconecta/relatorio
→ Retorna relatório completo
```

### 🏭 Indústrias
```
GET /sysconecta/industrias
→ Lista todas as indústrias
```

### 🏢 Fornecedores
```
GET /sysconecta/fornecedores
→ Lista todos os fornecedores

GET /sysconecta/fornecedor/:id
→ Busca fornecedor específico

POST /sysconecta/fornecedor
→ Cria novo fornecedor

PUT /sysconecta/fornecedor/:id
→ Atualiza fornecedor

DELETE /sysconecta/fornecedor/:id
→ Inativa fornecedor

GET /sysconecta/fornecedores/estado/:estado
→ Busca fornecedores de um estado

GET /sysconecta/fornecedor/estado/:estado/tipo/:tipo
→ Busca fornecedor específico de estado/tipo
```

### 🗺️ Exclusividade Territorial
```
GET /sysconecta/exclusividade/:estado/:tipo
→ Verifica vaga disponível

GET /sysconecta/exclusividade/mapa
→ Retorna mapa completo de exclusividade
```

### 🎯 Roteamento
```
POST /sysconecta/rotear-pedido
Body: { estadoVidraceiro: 'SC', tipo: 'VIDRO' }
→ Roteia pedido para fornecedor correto
```

---

## 💾 CHAVES NO KV STORE

```
// Indústrias
industria:{industriaId}

// Fornecedores
fornecedor:{fornecedorId}

// Exclusividade
exclusividade:{estado}:{tipo}

// Configuração
config:sistema
```

---

## 🎯 DADOS INICIAIS (PADRÃO)

### 🏭 Indústria
```typescript
{
  id: 'guardian_glass',
  nome: 'Guardian Glass',
  tipo: 'VIDRO',
  descricao: 'Indústria EXCLUSIVA de vidros para todos os fornecedores do SysConecta',
  ativo: true,
  dataCadastro: '2024-01-01'
}
```

### 🏢 Fornecedor
```typescript
{
  id: 'santa_rita_sc',
  razaoSocial: 'Santa Rita Distribuidora de Vidros LTDA',
  nomeFantasia: 'Santa Rita Vidros',
  cnpj: '12.345.678/0001-90',
  tipo: 'VIDRO',
  estado: 'SC',
  exclusivoEstado: true,
  industriaId: 'guardian_glass',
  responsavel: {
    nome: 'Alexandre',
    email: 'alexandre@santaritavidros.com.br',
    telefone: '(47) 99999-8888'
  },
  endereco: {
    logradouro: 'Rua das Indústrias',
    numero: '1500',
    complemento: 'Galpão 3',
    bairro: 'Distrito Industrial',
    cidade: 'Balneário Camboriú',
    estado: 'SC',
    cep: '88330-000'
  },
  ativo: true,
  dataAdesao: '2024-01-15'
}
```

### 🗺️ Exclusividade
```
27 estados × 3 tipos = 81 vagas totais

OCUPADAS: 1 (Santa Rita - SC - VIDRO)
DISPONÍVEIS: 80
```

---

## 📈 ESTATÍSTICAS

```typescript
{
  totalFornecedores: 1,
  fornecedoresAtivos: 1,
  fornecedoresInativos: 0,
  
  porTipo: {
    VIDRO: 1,
    ALUMINIO: 0,
    ACESSORIOS: 0
  },
  
  vagasDisponiveis: {
    VIDRO: 26,  // 27 - 1
    ALUMINIO: 27,
    ACESSORIOS: 27
  },
  
  totalVagasPossiveis: 81,
  totalVagasOcupadas: 1,
  totalVagasDisponiveis: 80,
  
  industrias: {
    vidro: 'guardian_glass',
    aluminio: 'Não definida',
    acessorios: 'Não definida'
  }
}
```

---

## 🔥 FUNÇÕES PRINCIPAIS

### `inicializarBancoDados()`
Inicializa o banco com dados padrão:
- 1 Indústria (Guardian Glass)
- 1 Fornecedor (Santa Rita - SC)
- 81 vagas de exclusividade (27 estados × 3 tipos)

### `rotearPedido(estadoVidraceiro, tipo)`
Retorna o fornecedor correto baseado no estado do vidraceiro.

### `validarPedido(estadoVidraceiro, tipo)`
Valida se existe fornecedor disponível para o estado/tipo.

### `verificarVagaDisponivel(estado, tipo)`
Verifica se há vaga disponível para novo fornecedor.

### `getMapaExclusividade()`
Retorna mapa completo de todos os 27 estados.

### `getEstatisticas()`
Retorna estatísticas consolidadas do sistema.

---

## ⚙️ CONFIGURAÇÃO DO SISTEMA

```typescript
{
  exclusividadeTerritorial: true, // Sempre true
  maxFornecedoresPorEstadoPorTipo: 1, // Sempre 1
  
  industriaVidroAtiva: 'guardian_glass',
  industriaAluminioAtiva: null, // Ainda não definido
  industriaAcessoriosAtiva: null, // Ainda não definido
  
  comissaoMarketplace: {
    min: 3, // 3%
    max: 6  // 6%
  }
}
```

---

## 🎨 COMPONENTE REACT

### Arquivo: `/components/SysConectaDatabase.tsx`

Interface visual para:
- ✅ Inicializar banco de dados
- 📊 Ver estatísticas em tempo real
- 🏢 Listar fornecedores cadastrados
- 🗺️ Visualizar mapa de exclusividade territorial
- 📈 Acompanhar ocupação de vagas

---

## 🚀 COMO USAR

### 1. Inicializar no Servidor
```typescript
import * as db from './sysconecta-database.tsx';

// Inicializar banco
await db.inicializarBancoDados();
```

### 2. Rotear Pedido
```typescript
// Vidraceiro de SC faz pedido
const fornecedor = await db.rotearPedido('SC', 'VIDRO');
// Retorna: Santa Rita Vidros

// Vidraceiro de SP tenta fazer pedido
const fornecedor = await db.rotearPedido('SP', 'VIDRO');
// Retorna: null (sem fornecedor em SP)
```

### 3. Verificar Vaga
```typescript
const vagaDisponivel = await db.verificarVagaDisponivel('SP', 'VIDRO');
// Retorna: true (SP ainda não tem fornecedor de vidro)

const vagaDisponivel = await db.verificarVagaDisponivel('SC', 'VIDRO');
// Retorna: false (SC já tem Santa Rita)
```

### 4. Adicionar Fornecedor
```typescript
const novoFornecedor: Fornecedor = {
  id: 'vidros_sp_ltda',
  razaoSocial: 'Vidros SP LTDA',
  nomeFantasia: 'Vidros SP',
  cnpj: '98.765.432/0001-10',
  tipo: 'VIDRO',
  estado: 'SP',
  exclusivoEstado: true,
  industriaId: 'guardian_glass',
  // ... outros campos
};

await db.saveFornecedor(novoFornecedor);
// ✅ Fornecedor cadastrado
// ✅ Exclusividade de SP ocupada automaticamente
```

---

## 📌 PONTOS CRÍTICOS

### ✅ CORRETO:
- Roteamento baseado no **ESTADO DO VIDRACEIRO**
- Fornecedor de vidro compra **EXCLUSIVAMENTE da Guardian Glass**
- Um fornecedor por estado por tipo (exclusividade territorial)
- Cliente final pode estar em qualquer lugar do Brasil

### ❌ ERRADO:
- ~~Roteamento baseado no estado do cliente final~~
- ~~Fornecedor pode comprar de várias indústrias~~
- ~~Múltiplos fornecedores no mesmo estado/tipo~~
- ~~Localização do cliente afeta o fornecedor~~

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ **CONCLUÍDO**: Banco de dados criado
2. ✅ **CONCLUÍDO**: API REST implementada
3. ✅ **CONCLUÍDO**: Componente React criado
4. ⏳ **PENDENTE**: Adicionar fornecedores de alumínio
5. ⏳ **PENDENTE**: Adicionar fornecedores de acessórios
6. ⏳ **PENDENTE**: Definir indústrias parceiras para alumínio/acessórios

---

## 📞 CONTATO

**Desenvolvedor:** SysConecta Team  
**Data:** 26 de Dezembro de 2025  
**Versão:** 1.0.0

---

# ✅ SISTEMA SALVO E DOCUMENTADO!

Este banco de dados garante que:
- ✅ Nunca mais esqueceremos a estrutura
- ✅ Regras de negócio estão codificadas
- ✅ Dados persistem no KV Store
- ✅ API REST completa para gerenciamento
- ✅ Interface visual para visualização
