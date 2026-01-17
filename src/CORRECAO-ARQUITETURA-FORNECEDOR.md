# 🚨 CORREÇÃO CRÍTICA DE ARQUITETURA - FORNECEDOR VS TIPOLOGIA

## ❌ ERRO GRAVE IDENTIFICADO

**FORNECEDOR NÃO CONFIGURA TIPOLOGIAS!**

---

## ✅ ARQUITETURA CORRETA (IMPLEMENTADA)

### 1️⃣ TIPOLOGIA = FIXA (Não editável)

**Localização:** `/data/tipologias/suprema-correr-2f.ts`

**Contém:**
- Estrutura técnica
- Fórmulas de cálculo  
- Quantidades de material
- Compatibilidades
- **NÃO TEM PREÇO**

**Tipologia apenas sabe:** "Preciso de 2,34 m² de vidro + 18,7 kg de alumínio + 1 puxador + 4 roldanas"

---

### 2️⃣ FORNECEDOR = ESTOQUE DE MATERIAIS (Preços dinâmicos)

**O que FORNECEDOR faz:**
- ✅ Cadastra materiais no estoque
- ✅ Define preços (R$/m², R$/kg, R$/un)
- ✅ Atualiza disponibilidade
- ✅ Recebe pedidos de materiais
- ❌ **NÃO vê tipologias**
- ❌ **NÃO configura janelas/portas**

---

## 🔧 CORREÇÕES APLICADAS

### ✅ DashboardFornecedor.tsx

**REMOVIDO:**
- ❌ Card "🔥 Configurador SUPREMA"
- ❌ Navegação para tipologias

**MANTIDO:**
- ✅ Card "💰 Editar Preços" (correto!)
- ✅ Card "Ver Pedidos" (pedidos de materiais)
- ✅ Card "Gerenciar Estoque" (materiais)

---

## 📂 COMPONENTES CORRETOS DE FORNECEDOR

### ✅ Usar (Estão Corretos):
- `/components/fornecedor/EdicaoPrecosVidro.tsx` → Editar preços de vidro (R$/m²)
- `/components/fornecedor/EdicaoPrecosAluminio.tsx` → Editar preços de alumínio (R$/kg)
- `/components/fornecedor/EdicaoPrecosAcessorios.tsx` → Editar preços de acessórios (R$/un)
- `/components/fornecedor/EstoqueFornecedor.tsx` → Gerenciar estoque de materiais
- `/components/fornecedor/PedidosRecebidos.tsx` → Ver pedidos de materiais
- `/components/fornecedor/ProducaoFornecedor.tsx` → Gestão de produção de materiais

### ❌ NÃO Usar (Arquitetura Errada):
- `/components/SelecaoTipologiaFornecedor.tsx` → Fornecedor NÃO escolhe tipologia
- `/components/ConfiguradorTecnicoFornecedor.tsx` → Fornecedor NÃO configura janelas
- `/components/AproveitamentoChapaFornecedor.tsx` → Isso é para produção interna, não fornecedor

---

## 🎯 QUEM USA CONFIGURADOR SUPREMA?

### ✅ VIDRACEIRO / CLIENTE
- Escolhe tipologia (ex: Janela 2F)
- Configura dimensões, vidro, ferragens
- Sistema PUXA preços dos estoques dos fornecedores automaticamente
- Gera orçamento final

### ❌ NÃO É O FORNECEDOR
- Fornecedor só vende MATERIAL
- Não monta janelas no sistema
- Só recebe pedidos de materiais

---

## 🔄 FLUXO CORRETO

```
VIDRACEIRO
    ↓
Escolhe Tipologia (Janela 2F)
    ↓
Configurador Suprema
    ↓
Sistema calcula: precisa 2,34 m² vidro
    ↓
Sistema consulta ESTOQUE DO FORNECEDOR
    ↓
Pega preço: R$ 198,00/m²
    ↓
Calcula: 2,34 × R$ 198,00 = R$ 463,32
    ↓
Orçamento Final
```

**O FORNECEDOR NÃO VÊ NADA DISSO!**

Ele só vê:
```
Pedido recebido:
- Material: Vidro Fumê 6mm
- Quantidade: 2,34 m²
- Valor: R$ 463,32
```

---

## 📊 ESTRUTURA DE DADOS

### FORNECEDOR (Tabela `fornecedores_estoque`)
```json
{
  "fornecedorId": "forn-123",
  "material": "Vidro Fumê 6mm",
  "precoUnitario": 198.00,
  "unidade": "m²",
  "disponibilidade": true
}
```

### TIPOLOGIA (Arquivo estático)
```typescript
{
  nome: "PV MIL - CORRER - 2F",
  vidro: {
    calculo: (largura, altura) => largura * altura * 2.34 // m²
  }
}
```

### ORÇAMENTO (Gerado em tempo real)
```json
{
  "tipologia": "PV MIL - CORRER - 2F",
  "materiais": [
    {
      "tipo": "vidro",
      "quantidade": 2.34,
      "precoUnitario": 198.00, // ← VINDO DO ESTOQUE
      "total": 463.32
    }
  ]
}
```

---

## 🎯 INTERFACES DE FORNECEDOR

### Tela 1: Editar Preços de Vidro
```
┌─────────────────────────────────────┐
│ 💰 EDIÇÃO DE PREÇOS - VIDRO        │
├─────────────────────────────────────┤
│                                     │
│ Vidro Incolor 6mm                   │
│ Preço: R$ [165,00] / m²             │
│ ☑ Disponível                        │
│                                     │
│ Vidro Fumê 6mm                      │
│ Preço: R$ [198,00] / m²             │
│ ☑ Disponível                        │
│                                     │
│ [Salvar Alterações]                 │
└─────────────────────────────────────┘
```

**SEM IMAGENS DE JANELAS!**  
**SEM TIPOLOGIAS!**  
**APENAS MATERIAIS E PREÇOS!**

---

### Tela 2: Editar Preços de Alumínio
```
┌─────────────────────────────────────┐
│ 💰 EDIÇÃO DE PREÇOS - ALUMÍNIO     │
├─────────────────────────────────────┤
│                                     │
│ Perfil Marco PV MIL                 │
│ Preço: R$ [29,80] / kg              │
│ Peso barra 6m: 2,4 kg               │
│ ☑ Disponível                        │
│                                     │
│ Perfil Folha PV MIL                 │
│ Preço: R$ [29,80] / kg              │
│ Peso barra 6m: 1,8 kg               │
│ ☑ Disponível                        │
│                                     │
│ [Salvar Alterações]                 │
└─────────────────────────────────────┘
```

**VENDE POR KG!**  
**NÃO MONTA JANELAS!**

---

### Tela 3: Pedidos Recebidos
```
┌─────────────────────────────────────┐
│ 📦 PEDIDOS RECEBIDOS               │
├─────────────────────────────────────┤
│                                     │
│ Pedido #1234                        │
│ Cliente: Vidraçaria Centro         │
│ Data: 17/12/2025                    │
│                                     │
│ Items:                              │
│ • Vidro Fumê 6mm - 2,34 m²          │
│ • Perfil Marco - 12,5 kg            │
│ • Puxador Embutido - 1 un           │
│                                     │
│ Total: R$ 847,20                    │
│                                     │
│ [Aceitar] [Recusar]                 │
└─────────────────────────────────────┘
```

**FORNECEDOR NÃO SABE:**
- Qual tipologia foi usada
- Se é janela ou porta
- Dimensões do produto final

**FORNECEDOR SÓ SABE:**
- Materiais solicitados
- Quantidades
- Valores

---

## 🔒 REGRAS DE NEGÓCIO

### ✅ PERMITIDO:
1. Fornecedor edita preços dos SEUS materiais
2. Fornecedor vê pedidos de materiais
3. Fornecedor gerencia estoque de materiais
4. Fornecedor produz materiais (perfis, vidros)

### ❌ PROIBIDO:
1. Fornecedor NÃO edita tipologias
2. Fornecedor NÃO vê configurador de janelas
3. Fornecedor NÃO monta produtos finais
4. Fornecedor NÃO precisa saber as fórmulas

---

## 🚀 PRÓXIMOS PASSOS

### Para DESENVOLVEDORES:

1. ✅ **Manter** componentes de edição de preços
2. ✅ **Garantir** que fornecedor só vê materiais
3. ❌ **Remover** qualquer referência a tipologias no dashboard fornecedor
4. ✅ **Mover** Configurador Suprema para fluxo do Vidraceiro

### Para FORNECEDORES (usuários):

1. Faça login como fornecedor
2. Vá em "Editar Preços"
3. Configure seus materiais e preços
4. Aguarde pedidos de vidraceiros
5. **NÃO TENTE** configurar janelas - isso não é seu papel!

---

## 💡 EXEMPLO PRÁTICO

### ❌ ERRADO (como estava antes):
```
FORNECEDOR DE ALUMÍNIO
  → Dashboard
    → "🔥 Configurador SUPREMA"
      → Escolhe janela 2F
        → Configura vidro, puxador, etc.
```

**PROBLEMA:** Fornecedor não monta janelas!

---

### ✅ CORRETO (como está agora):
```
FORNECEDOR DE ALUMÍNIO
  → Dashboard
    → "💰 Editar Preços"
      → Perfil Marco: R$ 29,80/kg
      → Perfil Folha: R$ 29,80/kg
    → "📦 Ver Pedidos"
      → Pedido #123: Preciso 12,5 kg de perfis
```

**CORRETO:** Fornecedor só vende material!

---

## 📞 DOCUMENTOS RELACIONADOS

- `/ESPECIFICACAO-TECNICA-INDUSTRIAL-COMPLETA.md` - Dados técnicos das tipologias
- `/data/tipologias/suprema-correr-2f.ts` - Tipologia fixa (não editável)
- `/components/fornecedor/EdicaoPrecosVidro.tsx` - Tela correta de fornecedor
- `/components/fornecedor/EdicaoPrecosAluminio.tsx` - Tela correta de fornecedor
- `/components/fornecedor/EdicaoPrecosAcessorios.tsx` - Tela correta de fornecedor

---

## 🎯 RESUMO EXECUTIVO

| Conceito | Responsável | O que faz |
|----------|-------------|-----------|
| **Tipologia** | SISTEMA | Estrutura fixa, fórmulas, compatibilidades |
| **Preços** | FORNECEDOR | Define preços de materiais (R$/m², R$/kg, R$/un) |
| **Configuração** | VIDRACEIRO | Monta orçamentos usando tipologias |
| **Cálculo** | SISTEMA | Multiplica quantidades × preços automaticamente |

---

**Data:** 17 de Dezembro de 2025  
**Status:** ✅ ARQUITETURA CORRIGIDA  
**Versão:** 2.2.0 - Correção Conceitual Crítica  

---

## 🏆 FRASE FINAL (MEMORIZAR)

> **"Fornecedor não vende janela.  
> Fornecedor vende MATERIAL.  
> Quem monta janela é o SysConecta."**

---

✅ **CORREÇÃO IMPLEMENTADA NO SISTEMA**
