# 🎯 SISTEMA DE CÁLCULO TÉCNICO - PORTAS DE CORRER

## ✅ IMPLEMENTAÇÃO COMPLETA

Sistema ultra inteligente de cálculo automático de vidros para portas de correr com divisão de folhas e descontos técnicos.

---

## 📋 REGRAS TÉCNICAS

### **VÃO**
- É a medida do espaço onde a porta será instalada
- **Exemplo:** 2000mm (largura) × 1000mm (altura)

### **DIVISÃO DAS FOLHAS**
✅ **SEMPRE IGUAL** para todas as folhas

**Exemplos:**
- 4 folhas com vão de 4000mm → cada folha = **1000mm**
- 2 folhas com vão de 4000mm → cada folha = **2000mm**
- 3 folhas com vão de 3000mm → cada folha = **1000mm**

### **CÁLCULO TÉCNICO POR TIPO DE FOLHA**

#### 🔒 **FOLHA FIXA**
- **Largura:** Vão ÷ Total de folhas (divisão igual)
- **Altura:** Vão - **60mm** (desconto de 6cm)

#### 🔄 **FOLHA MÓVEL**
- **Largura:** (Vão ÷ Total de folhas) + **50mm** (acréscimo de 5cm)
- **Altura:** Vão - **20mm** (desconto de 2cm)

---

## 🧮 EXEMPLO PRÁTICO

**VÃO:** 2000mm × 1000mm  
**PRODUTO:** Porta de Correr 2 Folhas (1 Fixa + 1 Móvel)

### Cálculos:

**Divisão da largura:**
```
2000mm ÷ 2 folhas = 1000mm por folha
```

**VIDRO FIXO:**
```
Largura: 1000mm
Altura: 1000mm - 60mm = 940mm
✅ RESULTADO: 1000mm × 940mm
```

**VIDRO MÓVEL:**
```
Largura: 1000mm + 50mm = 1050mm
Altura: 1000mm - 20mm = 980mm
✅ RESULTADO: 1050mm × 980mm
```

---

## 🚀 PRODUTOS SUPORTADOS

✅ **Porta de Correr 1 Folha** (1 móvel)  
✅ **Porta de Correr 2 Folhas** (1 fixa + 1 móvel)  
✅ **Porta de Correr 3 Folhas** (1 fixa + 2 móveis)  
✅ **Porta de Correr 4 Folhas** (2 fixas + 2 móveis)  
✅ **Porta Telescópica** (1 fixa + 1 móvel)  
✅ **Porta Embutida** (1 fixa + 1 móvel)  
✅ **Porta de Roldanas Aparentes** (1 fixa + 1 móvel)

---

## 💻 ARQUIVOS DO SISTEMA

### `/utils/calculoTecnicoVidros.ts`
- Função `calcularVidrosPortaCorrer()` - Retorna array de vidros calculados
- Função `isPortaCorrer()` - Verifica se produto é porta de correr
- Configurações de cada produto (folhas fixas/móveis)

### `/components/NovoOrcamentoSantaRita.tsx`
- Integração automática ao adicionar itens
- Cria múltiplos itens (um por folha) automaticamente
- Exibe tipo de folha (FIXA/MÓVEL) no orçamento
- Mostra medida do vão + dimensões calculadas

### `/components/AproveitamentoChapa.tsx`
- Etiquetas identificam tipo de folha (🔒 FIXA / 🔄 MÓVEL)
- Algoritmo de bin packing funciona com múltiplas peças
- QR codes únicos por peça

---

## 🎨 INTERFACE

### Visualização no Orçamento:
```
PRODUTO: Porta de Correr 2 Folhas - Folha Fixa 1
Dimensões (Vidro FIXA): 1000mm x 940mm
Vão: 2000mm × 1000mm
```

```
PRODUTO: Porta de Correr 2 Folhas - Folha Móvel 1
Dimensões (Vidro MÓVEL): 1050mm x 980mm
Vão: 2000mm × 1000mm
```

### Etiquetas de Corte:
```
┌────────────────────────┐
│ [QR CODE]              │
│                        │
│ CLIENTE: José Silva    │
│ PRODUTO: Porta...      │
│ FOLHA: 🔒 FIXA         │
│ DIMENSÕES: 1000×940mm  │
└────────────────────────┘
```

---

## ✅ FLUXO COMPLETO

1. Usuário preenche medidas do VÃO (2000 × 1000)
2. Seleciona produto (Porta de Correr 2 Folhas)
3. Sistema detecta automaticamente que é porta de correr
4. **Calcula vidros técnicos:**
   - Vidro Fixo: 1000mm × 940mm
   - Vidro Móvel: 1050mm × 980mm
5. **Cria 2 itens no orçamento** (um para cada folha)
6. Ao aprovar, salva no localStorage
7. No corte de chapas:
   - Cada vidro vai para o algoritmo de bin packing
   - Etiquetas identificam tipo de folha
   - QR codes rastreáveis

---

## 🔄 PERSISTÊNCIA

✅ Orçamentos salvos no **localStorage**  
✅ Dados permanentes entre sessões  
✅ Busca em orçamentos aprovados para sugestões  
✅ Sistema de otimização de chapas cross-orçamento

---

## 🎯 RESULTADO

**ANTES:**
- Usuário digitava 2000 × 1000
- Sistema criava 1 item com essas medidas
- ❌ Medidas erradas para corte

**DEPOIS:**
- Usuário digita 2000 × 1000 (medida do vão)
- Sistema cria 2 itens automaticamente:
  - ✅ Folha Fixa: 1000 × 940
  - ✅ Folha Móvel: 1050 × 980
- ✅ Medidas corretas para produção!

---

## 📊 STATUS

✅ **100% IMPLEMENTADO E FUNCIONAL**

Sistema pronto para produção com cálculos técnicos reais!
