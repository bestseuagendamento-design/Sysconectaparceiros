# 🎯 SISTEMA COMPLETO DE PEÇAS E PREÇOS

## ✅ IMPLEMENTAÇÃO 100% FUNCIONAL

---

## 🔢 NUMERAÇÃO DAS PEÇAS

### **REGRA FUNDAMENTAL:**
- **4 FOLHAS = 4 VIDROS SEPARADOS**
- Cada folha é uma **PEÇA UNITÁRIA**
- Cada peça é um **ITEM INDEPENDENTE** no orçamento

### **EXEMPLO PRÁTICO:**

**Porta de Correr 4 Folhas**  
**Vão:** 4000mm × 2000mm

**Sistema cria 4 ITENS:**

1. **Peça 1 de 4** - Folha FIXA - 1000mm × 1940mm
2. **Peça 2 de 4** - Folha FIXA - 1000mm × 1940mm
3. **Peça 3 de 4** - Folha MÓVEL - 1050mm × 1980mm
4. **Peça 4 de 4** - Folha MÓVEL - 1050mm × 1980mm

---

## 💰 SISTEMA DE PREÇOS CONFIGURÁVEL

### **CONFIGURAÇÃO POR COR E ESPESSURA:**

Cada combinação de COR + ESPESSURA tem preço único por m²:

```
Incolor 8mm  → R$ 450,00/m²
Incolor 10mm → R$ 550,00/m²
Verde 8mm    → R$ 480,00/m²
Verde 10mm   → R$ 580,00/m²
Fumê 8mm     → R$ 480,00/m²
Bronze 8mm   → R$ 480,00/m²
```

### **COMO USAR:**

1. Selecione **Cor** e **Espessura**
2. Aparece caixa de edição de preço:
   ```
   💰 Preço por m² - Incolor 8mm
   R$ [450.00] / m²
   ```
3. **Edite o valor** conforme necessário
4. Preço será aplicado a **TODAS as peças** com essa especificação

---

## 🔪 NA CHAPA DE CORTE

### **VISUALIZAÇÃO:**

Cada peça mostra:
```
┌──────────────────────┐
│  Peça 1/4            │
│  1000mm × 1940mm     │
│  [QR CODE]           │
└──────────────────────┘
```

### **ETIQUETA COMPLETA:**
```
┌────────────────────────────┐
│ [QR CODE]                  │
│                            │
│ CLIENTE: José Silva        │
│ PRODUTO: Porta 4 Folhas    │
│ PEÇA: 1 de 4              │
│ FOLHA: 🔒 FIXA            │
│ DIMENSÕES: 1000×1940mm     │
│ COR: Incolor              │
│ ESPESSURA: 8mm            │
└────────────────────────────┘
```

---

## 📊 FLUXO COMPLETO

### **1. CONFIGURAÇÃO**
```
Vão: 4000mm × 2000mm
Produto: Porta de Correr 4 Folhas
Cor: Incolor
Espessura: 8mm
Preço/m²: R$ 450,00 (configurável)
```

### **2. CÁLCULO AUTOMÁTICO**
```
Sistema calcula 4 vidros:
- 2 Fixas: 1000 × 1940mm
- 2 Móveis: 1050 × 1980mm
```

### **3. CRIAÇÃO DOS ITENS**
```
Sistema cria 4 ITENS no orçamento:
✅ Item 1: Peça 1 de 4 - FIXA
✅ Item 2: Peça 2 de 4 - FIXA  
✅ Item 3: Peça 3 de 4 - MÓVEL
✅ Item 4: Peça 4 de 4 - MÓVEL
```

### **4. CÁLCULO DE PREÇOS**
```
Cada item tem preço individual:
Peça 1: 1000×1940 = 1.94m² × R$450 = R$873,00
Peça 2: 1000×1940 = 1.94m² × R$450 = R$873,00
Peça 3: 1050×1980 = 2.08m² × R$450 = R$936,00
Peça 4: 1050×1980 = 2.08m² × R$450 = R$936,00
────────────────────────────────────────────
TOTAL: R$ 3.618,00
```

### **5. NA CHAPA DE CORTE**
```
Algoritmo de bin packing recebe 4 peças separadas
Cada peça é posicionada individualmente
Etiquetas identificam: Peça X de Y
```

---

## 🎨 INTERFACE

### **FORMULÁRIO:**
```
┌─────────────────────────────────────┐
│ Largura (mm): 4000                  │
│ Altura (mm):  2000                  │
│ Cor:          Incolor ▼             │
│ Espessura:    8mm ▼                 │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 💰 Preço por m² - Incolor 8mm   │ │
│ │ R$ [450.00] / m²                │ │
│ │ 💡 Este preço será usado        │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [+ Adicionar Mais Item]             │
└─────────────────────────────────────┘
```

### **ORÇAMENTO:**
```
ITENS DO ORÇAMENTO (4)

┌────────────────────────────────────────┐
│ 1 │ Porta de Correr 4 Folhas          │
│   │ - Folha Fixa 1 (Peça 1 de 4)      │
│   │ Dimensões (Vidro FIXA):           │
│   │ 1000mm x 1940mm                   │
│   │ Vão: 4000mm × 2000mm              │
│   │ R$ 873,00                         │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ 2 │ Porta de Correr 4 Folhas          │
│   │ - Folha Fixa 2 (Peça 2 de 4)      │
│   │ Dimensões (Vidro FIXA):           │
│   │ 1000mm x 1940mm                   │
│   │ R$ 873,00                         │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ 3 │ Porta de Correr 4 Folhas          │
│   │ - Folha Móvel 1 (Peça 3 de 4)     │
│   │ Dimensões (Vidro MÓVEL):          │
│   │ 1050mm x 1980mm                   │
│   │ R$ 936,00                         │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ 4 │ Porta de Correr 4 Folhas          │
│   │ - Folha Móvel 2 (Peça 4 de 4)     │
│   │ Dimensões (Vidro MÓVEL):          │
│   │ 1050mm x 1980mm                   │
│   │ R$ 936,00                         │
└────────────────────────────────────────┘

TOTAL: R$ 3.618,00
```

---

## 🔧 ARQUIVOS TÉCNICOS

### **`/utils/calculoTecnicoVidros.ts`**
- Configurações de produtos (folhas fixas/móveis)
- Função `calcularVidrosPortaCorrer()`
- Retorna array com cada vidro calculado

### **`/components/NovoOrcamentoSantaRita.tsx`**
- Estado `precosConfiguraveis` (preços por cor/espessura)
- Caixa de edição de preço
- Cálculo com preço configurável
- Criação de múltiplos itens (um por folha)
- Campo `numeroFolha` e `totalFolhas`

### **`/components/AproveitamentoChapa.tsx`**
- Exibição "Peça X/Y" no desenho
- Etiquetas com número da peça
- Identificação de folha FIXA/MÓVEL

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [x] Sistema de cálculo técnico (folhas fixas/móveis)
- [x] Divisão igual da largura
- [x] Descontos técnicos (FIXA: -60mm, MÓVEL: -20mm)
- [x] Acréscimo na largura móvel (+50mm)
- [x] Criação de múltiplos itens (um por folha)
- [x] Numeração "Peça X de Y"
- [x] Sistema de preços configurável
- [x] Caixa de edição de preço por cor/espessura
- [x] Cálculo com preço configurado
- [x] Exibição na chapa "Peça X/Y"
- [x] Etiquetas com número da peça
- [x] Identificação FIXA/MÓVEL
- [x] Persistência no localStorage
- [x] Busca em orçamentos aprovados

---

## 🎯 RESULTADO FINAL

**ANTES:**
❌ Criava 1 item com medidas erradas  
❌ Preço fixo de R$ 450/m²  
❌ Não identificava peças

**DEPOIS:**
✅ Cria N itens (um por folha)  
✅ Preço configurável por cor/espessura  
✅ Numeração "Peça X de Y"  
✅ Medidas técnicas corretas  
✅ Etiquetas completas  
✅ Sistema production-ready!

---

## 📱 TESTANDO

1. Acesse **Novo Orçamento**
2. Selecione **Porta de Correr 4 Folhas**
3. Digite vão: **4000mm × 2000mm**
4. Escolha **Incolor 8mm**
5. **EDITE O PREÇO** na caixa verde
6. Adicione ao orçamento
7. Veja **4 ITENS CRIADOS** (Peça 1 de 4, 2 de 4, 3 de 4, 4 de 4)
8. Aprove e veja na **Chapa de Corte**

🚀 **SISTEMA 100% OPERACIONAL!**
