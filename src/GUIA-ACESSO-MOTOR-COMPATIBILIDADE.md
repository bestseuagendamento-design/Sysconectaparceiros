# 🎯 GUIA DE ACESSO - MOTOR DE COMPATIBILIDADE AUTOMÁTICA

## 📋 Sistema SysConecta - Navegação Completa

---

## 🔑 **PASSO 1: LOGIN NO SISTEMA**

### Credenciais de Acesso:
- **Email:** `Leandro.zara@sysvidro.com`
- **Senha:** `56734297Ombongo!`

---

## 🎯 **PASSO 2: ESCOLHER PERFIL - FORNECEDOR**

Após o login, você verá a tela de escolha de perfil. Selecione:

### ✅ **FORNECEDOR DE PERFIS DE ALUMÍNIO**

Este perfil dá acesso ao Dashboard do Fornecedor com todas as funcionalidades do Motor de Compatibilidade.

---

## 🏢 **PASSO 3: DASHBOARD DO FORNECEDOR**

No Dashboard, você terá acesso a:

- **📦 Pedidos Recebidos** - Ver pedidos de vidraceiros
- **📊 Novo Orçamento** - Criar orçamentos técnicos
- **🔧 Configurações** - Editar preços e materiais
- **📈 Estatísticas** - Visão geral do negócio

---

## 🎨 **PASSO 4: ACESSAR O CONFIGURADOR SUPREMA**

### Opção A: Via Dashboard Fornecedor
1. No Dashboard do Fornecedor, clique em **"Novo Orçamento"** ou **"Selecionar Tipologia"**
2. Selecione a tipologia **"PV MIL – CORRER – 2 FOLHAS"**
3. O sistema irá para o Configurador Técnico

### Opção B: Acesso Direto (Para Teste)
No console do navegador (F12), digite:
```javascript
window.location.hash = '#configurador-suprema'
```

Ou adicione `?screen=configurador-suprema` na URL e recarregue a página.

---

## 🔥 **PASSO 5: USAR O MOTOR DE COMPATIBILIDADE**

No **Configurador Suprema**, você verá:

### 1️⃣ **DIMENSÕES**
- Largura (mm): 800 - 4000mm
- Altura (mm): 600 - 3000mm
- Inserir valores e ver validação em tempo real

### 2️⃣ **VIDROS**
- Escolher tipo de vidro: Incolor, Verde, Fumê, Bronze, Refletivo
- Escolher espessura: 6mm, 8mm, 10mm
- Sistema calcula peso automaticamente

### 3️⃣ **FECHADURAS**
- Várias opções compatíveis
- Validação automática de compatibilidade

### 4️⃣ **PUXADORES**
- Modelos disponíveis
- Validação de compatibilidade

### 5️⃣ **ROLDANAS**
- Sistema calcula peso total
- Sugere roldanas adequadas automaticamente
- Valida capacidade de carga

### 6️⃣ **CONFIGURAÇÕES**
- Trincos
- Escovas
- Perfis específicos

---

## 🎛️ **PAINEL DE COMPATIBILIDADE - O QUE VOCÊ VAI VER**

### ✅ Status Visual:
- **🟢 VERDE** - Tudo compatível
- **🟡 AMARELO** - Avisos (pode continuar)
- **🔴 VERMELHO** - Bloqueios críticos (não pode prosseguir)

### 📊 Informações Exibidas:
1. **Status Geral** - Compatível / Avisos / Bloqueado
2. **Dimensões** - Validação de largura/altura
3. **Vidro** - Peso calculado, espessura validada
4. **Peso e Roldanas** - Carga por folha, capacidade
5. **Fechaduras** - Compatibilidade verificada
6. **Puxadores** - Validação de modelo
7. **Configurações** - Trincos, escovas, etc.

### 🔍 Detalhes Técnicos:
- Clique em cada seção para expandir
- Veja mensagens de erro/aviso específicas
- Receba sugestões de otimização

---

## 🧪 **TESTE PRÁTICO - CENÁRIOS**

### ✅ **Cenário 1: Configuração VÁLIDA**
```
Largura: 2000mm
Altura: 2100mm
Vidro: Incolor 8mm
Roldanas: Roldana Premium 60kg
Fechadura: Crescent Lock Standard
Puxador: Puxador Escovado 30cm
```
**Resultado:** ✅ Painel VERDE - Tudo compatível

---

### ⚠️ **Cenário 2: Configuração com AVISOS**
```
Largura: 3500mm (muito larga)
Altura: 2100mm
Vidro: Incolor 10mm (pesado)
Roldanas: Roldana Standard 40kg (capacidade limite)
```
**Resultado:** 🟡 Painel AMARELO - Avisos de atenção

---

### ❌ **Cenário 3: Configuração BLOQUEADA**
```
Largura: 4500mm (excede limite)
Altura: 3500mm (excede limite)
Vidro: Refletivo 10mm (muito pesado)
Roldanas: Roldana Basic 25kg (insuficiente)
```
**Resultado:** 🔴 Painel VERMELHO - Bloqueado para produção

---

## 🎨 **RECURSOS VISUAIS**

### 1. **Visualização 3D Realística**
- Preview da janela em tempo real
- Cores e texturas reais dos vidros
- Puxadores e ferragens renderizados

### 2. **Bill of Materials (BOM)**
- Lista completa de materiais
- Quantidades precisas
- Códigos de produção
- Reaproveitamento de barras de 6m

### 3. **Orçamentos**
- **Completo:** Todos os itens detalhados
- **Simples:** Orçamento por item (sem detalhes internos)

---

## 🚀 **FLUXO COMPLETO DE USO**

```
LOGIN (credenciais acima)
    ↓
ESCOLHA PERFIL → FORNECEDOR ALUMÍNIO
    ↓
DASHBOARD FORNECEDOR
    ↓
NOVO ORÇAMENTO / SELECIONAR TIPOLOGIA
    ↓
TIPOLOGIA: PV MIL – CORRER – 2 FOLHAS
    ↓
CONFIGURADOR SUPREMA
    ↓
PREENCHER DIMENSÕES
    ↓
ESCOLHER VIDRO
    ↓
ESCOLHER FECHADURA
    ↓
ESCOLHER PUXADOR
    ↓
ESCOLHER ROLDANAS
    ↓
VER PAINEL DE COMPATIBILIDADE ✅
    ↓
VISUALIZAR 3D
    ↓
GERAR BOM
    ↓
CRIAR ORÇAMENTO (Completo ou Simples)
    ↓
ENVIAR PARA PRODUÇÃO
```

---

## 🔧 **FUNCIONALIDADES IMPLEMENTADAS**

### ✅ Motor de Compatibilidade
- Validação de dimensões min/max
- Cálculo automático de peso do vidro
- Validação peso vs capacidade roldanas
- Compatibilidade fechaduras por tipologia
- Compatibilidade puxadores
- Validação de configurações (trincos, escovas)

### ✅ Feedback Visual Premium
- Painel expansível/colapsável
- Cores semafóricas (verde/amarelo/vermelho)
- Ícones informativos
- Mensagens contextuais
- Sugestões de otimização

### ✅ Proteção Industrial
- Bloqueio automático de configurações inválidas
- Avisos para situações limítrofes
- Sugestões de correção
- Log de validações

### ✅ Integração Completa
- Dados técnicos reais de `/data/tipologias/suprema-correr-2f.ts`
- Cálculos industriais de `/utils/calculos-industriais.ts`
- Motor de `/utils/motor-compatibilidade.ts`
- Interface em `/components/PainelCompatibilidade.tsx`
- Configurador em `/components/ConfiguradorTecnicoFornecedorSuprema.tsx`

---

## 🎯 **O QUE VOCÊ VAI VER NA TELA**

### Lado Esquerdo:
- **Formulário de Configuração**
  - Dimensões (largura/altura)
  - Tipo de vidro (dropdown com imagens)
  - Espessura do vidro
  - Fechadura (dropdown com opções)
  - Puxador (dropdown com modelos)
  - Roldanas (dropdown com capacidades)
  - Trincos, escovas, etc.

### Centro:
- **Painel de Compatibilidade** (Card Premium)
  - Status geral grande e visível
  - Seções expansíveis
  - Indicadores coloridos
  - Mensagens detalhadas

### Lado Direito:
- **Visualização 3D**
  - Janela renderizada em tempo real
  - Vidro com textura real
  - Puxadores e ferragens
  - Dimensões anotadas

### Abas Inferiores:
- **3D** - Visualização tridimensional
- **BOM** - Lista de materiais
- **Orçamento** - Valores e totais

---

## 💡 **DICAS DE USO**

1. **Comece pelas dimensões** - O sistema valida tudo a partir delas
2. **Escolha o vidro** - Peso é calculado automaticamente
3. **Veja as sugestões** - O painel sugere roldanas adequadas
4. **Expanda as seções** - Clique para ver detalhes técnicos
5. **Teste cenários** - Tente configurações extremas para ver bloqueios

---

## 🐛 **TROUBLESHOOTING**

### Não vejo o Painel de Compatibilidade?
- Verifique se está no **Configurador Suprema**
- Tente preencher alguns campos (dimensões, vidro)
- O painel aparece sempre, mesmo com campos vazios

### O painel está vazio?
- O sistema precisa de pelo menos **dimensões** para calcular
- Preencha largura e altura primeiro

### Não consigo acessar o Configurador?
- Verifique se fez login com as credenciais corretas
- Escolha o perfil "Fornecedor de Alumínio"
- Use o acesso direto via console se necessário

---

## 📞 **SUPORTE**

Se encontrar problemas:
1. Abra o Console (F12)
2. Veja mensagens de erro
3. Verifique o localStorage: `localStorage`
4. Reset de emergência: `resetSysConecta()`

---

## 🎉 **RESUMO**

O **Motor de Compatibilidade Automática** está 100% funcional e integrado ao sistema! Ele valida TODAS as configurações em tempo real e garante que apenas produtos tecnicamente viáveis cheguem à produção.

**Proteção Industrial Total ✅**

---

**Criado em:** 17 de Dezembro de 2025
**Versão:** 2.1.0
**Status:** ✅ PRODUÇÃO
