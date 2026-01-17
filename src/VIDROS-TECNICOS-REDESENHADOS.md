# 🏭 SYSCONECTA — VIDROS TÉCNICOS REDESENHADOS

## ✅ 100% REDESENHADO CONFORME ESPECIFICAÇÃO INDUSTRIAL

---

## 🎯 OBJETIVO CUMPRIDO

Substituir **TODOS** os vidros atuais por vidros técnicos reais, desenhados em **SVG vetorial inline**, prontos para representar produção industrial (DXF).

### ❌ ANTES:
- Ícones ilustrativos
- Cards genéricos
- Sem coordenadas técnicas
- Sem layers

### ✅ AGORA:
- **12 SVGs técnicos industriais**
- **Geometria real com coordenadas exatas**
- **Layers DXF (CONTOUR, HOLES, CUTOUTS)**
- **Posicionamento por distância de borda (mm)**
- **Proporções reais mantidas**

---

## 📐 REGRA MÃE APLICADA

✅ **Todo vidro = desenho técnico, NÃO ícone**  
✅ **Cada SVG contém:**
- Contorno (LAYER: CONTOUR)
- Furos (LAYER: HOLES)
- Recortes (LAYER: CUTOUTS)
- Proporção real (W × H em mm)
- Referências de borda

---

## 🏗️ 12 SVGs TÉCNICOS CRIADOS

### **1. GLASS_BOX_CORRER_800x1900**
```typescript
<SVG_BoxCorrer largura={120} />
```
**Especificações:**
- Dimensões: 800 × 1900 mm
- **LAYER: CONTOUR** → Retângulo 800×1900
- **LAYER: HOLES** → 2 furos Ø30mm
  - HOLE_ROLDANA_01 (esq): Centro (60, 1865) - 60mm lateral, 35mm topo
  - HOLE_ROLDANA_02 (dir): Centro (740, 1865) - 60mm lateral, 35mm topo
- Cruz de centro em cada furo
- Stroke azul (#2563eb) para contorno
- Stroke vermelho (#dc2626) para furos

---

### **2. GLASS_PORTA_GIRO_PUXADOR_ESQ_900x2100**
```typescript
<SVG_PortaGiroPuxadorEsq largura={120} />
```
**Especificações:**
- Dimensões: 900 × 2100 mm
- **LAYER: CONTOUR** → Retângulo 900×2100
- **LAYER: HOLES** → 2 furos Ø12mm
  - HOLE_PUXADOR_01 (sup): Centro (60, 950) - 1150mm do piso
  - HOLE_PUXADOR_02 (inf): Centro (60, 1250) - 850mm do piso
  - Espaçamento: 300mm entre centros
- Lado esquerdo (60mm da borda esquerda)
- Linha de conexão entre furos

---

### **3. GLASS_PORTA_GIRO_PUXADOR_DIR_900x2100**
```typescript
<SVG_PortaGiroPuxadorDir largura={120} />
```
**Especificações:**
- Idêntico ao anterior, mas lado direito
- Furos a 60mm da borda direita (X = 840mm)

---

### **4. GLASS_PORTA_GIRO_FECHADURA_ESQ_900x2100**
```typescript
<SVG_PortaGiroFechaduraEsq largura={120} />
```
**Especificações:**
- Dimensões: 900 × 2100 mm
- **LAYER: CONTOUR** → Retângulo 900×2100
- **LAYER: CUTOUTS** → 1 recorte retangular
  - CUTOUT_FECHADURA: 55 × 120 mm
  - Centro: (45, 1100) - 1000mm do piso, 45mm da borda
  - Lado esquerdo
- Stroke laranja (#ea580c) para recortes
- Cruz de centro no recorte

---

### **5. GLASS_PORTA_GIRO_FECHADURA_DIR_900x2100**
```typescript
<SVG_PortaGiroFechaduraDir largura={120} />
```
**Especificações:**
- Idêntico ao anterior, mas lado direito
- Centro do recorte: (855, 1100)

---

### **6. GLASS_PORTA_PIVOT_ESQ_1000x2200**
```typescript
<SVG_PortaPivotEsq largura={120} />
```
**Especificações:**
- Dimensões: 1000 × 2200 mm
- **LAYER: CONTOUR** → Retângulo 1000×2200
- **LAYER: HOLES** → 2 furos Ø20mm
  - HOLE_PIVOT_TOP: Centro (55, 35) - 35mm do topo
  - HOLE_PIVOT_BOTTOM: Centro (55, 2165) - 35mm da base
  - Lado esquerdo (55mm da borda)
- Linha de eixo vertical entre furos

---

### **7. GLASS_PORTA_PIVOT_DIR_1000x2200**
```typescript
<SVG_PortaPivotDir largura={120} />
```
**Especificações:**
- Idêntico ao anterior, mas lado direito
- X = 945mm (55mm da borda direita)

---

### **8. GLASS_PORTA_CORRER_4F_1000x2000**
```typescript
<SVG_PortaCorrer4F largura={120} />
```
**Especificações:**
- Dimensões: 1000 × 2000 mm (1 folha do sistema de 4)
- **LAYER: CONTOUR** → Retângulo 1000×2000
- **LAYER: HOLES** → 2 furos Ø30mm para roldanas
  - Posições: 60mm laterais, 35mm topo
- Sistema de 4 folhas móveis (cada folha independente)

---

### **9. GLASS_VIDRO_FIXO_1200x2000**
```typescript
<SVG_VidroFixo largura={120} />
```
**Especificações:**
- Dimensões: 1200 × 2000 mm
- **LAYER: CONTOUR** → Retângulo 1200×2000
- Sem furos
- Sem recortes
- Texto: "SEM FUROS"

---

### **10. GLASS_JANELA_BASCULANTE_1000x600**
```typescript
<SVG_JanelaBasculante largura={120} />
```
**Especificações:**
- Dimensões: 1000 × 600 mm
- **LAYER: CONTOUR** → Retângulo 1000×600
- **LAYER: HOLES** → 4 furos Ø12mm para dobradiças
  - Posição: 40mm de cada canto
  - 4 furos nos 4 cantos

---

### **11. GLASS_GUARDA_CORPO_1500x1100**
```typescript
<SVG_GuardaCorpo largura={120} />
```
**Especificações:**
- Dimensões: 1500 × 1100 mm
- **LAYER: CONTOUR** → Retângulo 1500×1100
- Vidro laminado
- Sem furos (instalação com perfis)
- Texto: "LAMINADO"

---

### **12. GLASS_TAMPO_MESA_1400x800**
```typescript
<SVG_TampoMesa largura={120} />
```
**Especificações:**
- Dimensões: 1400 × 800 mm
- **LAYER: CONTOUR** → Retângulo 1400×800
- Vidro temperado
- Cantos retos
- Sem furos
- Texto: "TEMPERADO"

---

## 📊 ORGANIZAÇÃO DE LAYERS (PADRÃO DXF)

Cada SVG segue a hierarquia:

```
GLASS_[TIPO]_[W]x[H]
 ├─ CONTOUR (stroke: #2563eb, azul)
 ├─ HOLES (stroke: #dc2626, vermelho)
 │   ├─ HOLE_ROLDANA_01
 │   ├─ HOLE_ROLDANA_02
 │   ├─ HOLE_PUXADOR_01
 │   └─ HOLE_PIVOT_TOP/BOTTOM
 ├─ CUTOUTS (stroke: #ea580c, laranja)
 │   └─ CUTOUT_FECHADURA
 └─ DIMENSIONS (cotas - futuro)
```

Isso **simula exatamente** um arquivo DXF industrial.

---

## 🎨 CARACTERÍSTICAS TÉCNICAS DOS SVGs

### **1. Sistema de Coordenadas**
- Origem lógica: canto inferior esquerdo (0,0)
- SVG renderiza com origem superior esquerda (conversão automática)
- Todas as posições em **mm reais**

### **2. Furos**
- Círculo com stroke tracejado
- Centro marcado com ponto sólido
- Cruz de centro (linhas de eixo)
- Diâmetro real escalado

### **3. Recortes**
- Retângulo com stroke tracejado
- Centro marcado
- Linhas de eixo (horizontal e vertical)
- Dimensões reais

### **4. Escala**
- SVG parametrizável por largura
- Proporções mantidas automaticamente
- Altura calculada pela razão W/H real

### **5. Texto Técnico**
- Dimensões reais (800×1900mm)
- Tipo de furos (Ø30, Ø12, Ø20)
- Lado (ESQ, DIR)
- Quantidade (4F, 4×)

---

## 🔧 COMO OS SVGs SÃO USADOS

### **1. No Catálogo de Peças**
```tsx
import * as SVGsTecnicos from './SVGsTecnicos';

const SVGComponent = SVGsTecnicos[peca.componenteSVG];
<SVGComponent largura={120} />
```

### **2. Em Meus Orçamentos**
```tsx
<PreviewTecnicoSVG vidro={orcamento.vidroTecnico} larguraCanvas={180} />
```

### **3. No Preview do Orçamento**
```tsx
<PreviewTecnicoSVG 
  vidro={vidroTecnico} 
  larguraCanvas={800}
  mostrarCotas={true}
  mostrarIDs={true}
/>
```

### **4. No Nesting**
```tsx
// Cada peça usa seu SVG técnico
<SVG_BoxCorrer largura={escala * 800} />
```

---

## ✅ VALIDAÇÃO FINAL (CHECKLIST)

- [x] Todo vidro tem contorno real? **SIM**
- [x] Furos têm posição por borda (mm)? **SIM**
- [x] Recortes têm dimensão real? **SIM**
- [x] Layers seguem padrão DXF? **SIM**
- [x] SVG serve como preview técnico? **SIM**
- [x] SVG poderia virar DXF amanhã? **SIM**
- [x] Nada ilustrativo, tudo técnico? **SIM**
- [x] Proporções reais mantidas? **SIM**
- [x] Coordenadas por distância de borda? **SIM**
- [x] Cruz de centro em todos os furos? **SIM**

---

## 📁 ARQUIVOS CRIADOS

1. **`/components/SVGsTecnicos.tsx`** ✅
   - 12 componentes SVG técnicos
   - Geometria real inline
   - Layers DXF simulados
   - Coordenadas exatas

2. **`/data/catalogoPecasTecnicas.ts`** ✅
   - 12 peças técnicas
   - Referência ao componenteSVG
   - Dados técnicos completos

3. **`/components/SelecaoPecaTecnica.tsx`** ✅
   - Catálogo com SVGs reais
   - Lista (não cards)
   - Preview técnico inline

---

## 🎯 RESULTADO FINAL

### **CADA SVG É:**
✅ Um **desenho técnico pré-DXF**  
✅ Com **layers separados** (CONTOUR, HOLES, CUTOUTS)  
✅ Com **coordenadas exatas** (mm de cada borda)  
✅ Com **proporções reais** mantidas  
✅ Com **cruzes de centro** em furos e recortes  
✅ Com **nomenclatura industrial** (HOLE_ROLDANA_01, etc.)  
✅ **Escalável** sem perder proporções  
✅ **Parametrizável** (largura configurável)  

---

## 🏭 EXEMPLO DE USO COMPLETO

### **1. Usuário seleciona: "Box de Correr — Roldanas Superiores"**

### **2. SVG renderizado:**
```
┌─────────────────────────────────┐
│          800mm                  │
│  ╔═══════════════════════════╗  │
│  ║                           ║  │
│  ║    ⊕                 ⊕    ║  │ ← 35mm do topo
│  ║   H1               H2     ║  │
│  ║  Ø30              Ø30     ║  │
│  ║                           ║  │
│  ║                           ║  │ 1900mm
│  ║                           ║  │
│  ║                           ║  │
│  ║                           ║  │
│  ╚═══════════════════════════╝  │
└─────────────────────────────────┘
   60mm              60mm
```

### **3. Dados salvos:**
```json
{
  "vidroTecnico": {
    "largura": 800,
    "altura": 1900,
    "espessura": 8,
    "furos": [
      {
        "id": "HOLE_ROLDANA_01",
        "centro": { "x": 60, "y": 1865 },
        "diametro": 30,
        "tipo": "roldana"
      },
      {
        "id": "HOLE_ROLDANA_02",
        "centro": { "x": 740, "y": 1865 },
        "diametro": 30,
        "tipo": "roldana"
      }
    ],
    "recortes": []
  }
}
```

### **4. No nesting:**
- SVG é usado para posicionar na chapa
- Coordenadas são exportadas para DXF
- Layers são mantidos (CONTOUR, HOLES)

### **5. No DXF final:**
```
LAYER: CONTOUR
  RECTANGLE (0,0) to (800,1900)

LAYER: HOLES
  CIRCLE center(60,1865) radius(15)
  CIRCLE center(740,1865) radius(15)
```

---

## 🚀 DIFERENCIAIS

### **ANTES (sistema antigo):**
❌ Ícones bonitos mas inúteis para produção  
❌ Sem coordenadas técnicas  
❌ Sem layers  
❌ Impossível virar DXF  

### **AGORA (sistema novo):**
✅ **Desenhos técnicos industriais**  
✅ **Coordenadas exatas de cada furo**  
✅ **Layers DXF simulados**  
✅ **Pronto para exportação DXF**  
✅ **Validação automática (30mm MVP)**  
✅ **Rastreabilidade total**  

---

## 💎 MENSAGEM FINAL

**"Estes não são ícones. São peças industriais em SVG."**

Cada SVG foi desenhado como se fosse pré-DXF, com:
- Furação posicionada por **distância de borda**
- Recortes com **dimensões reais**
- Layers **separados e nomeados**
- Coordenadas **técnicas e precisas**

**PRONTO PARA VIRAR DXF AMANHÃ! 🏭**

---

## ✅ IMPLEMENTAÇÃO 100% COMPLETA

**12 SVGs técnicos** ✅  
**Layers DXF** ✅  
**Coordenadas exatas** ✅  
**Catálogo atualizado** ✅  
**Seleção com previews reais** ✅  
**Nada ilustrativo** ✅  
**Tudo parametrizável** ✅  

**SYSCONECTA — DO SVG À MÁQUINA! 🚀**
