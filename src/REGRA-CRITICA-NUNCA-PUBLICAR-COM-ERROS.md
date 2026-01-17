# 🚨 REGRA CRÍTICA - NUNCA PUBLICAR ANTES DE CORRIGIR ERROS

## ⚠️ REGRA FUNDAMENTAL DO SYSCONECTA

**SE VOCÊ SABE ONDE ESTÁ O ERRO, VOCÊ CONSEGUE RESOLVER ANTES DE PUBLICAR.**

---

## 📋 **PROTOCOLO OBRIGATÓRIO ANTES DE QUALQUER PUBLICAÇÃO:**

### **1. VALIDAÇÃO PRÉ-PUBLICAÇÃO (OBRIGATÓRIO):**

**ANTES** de usar `write_tool`, `fast_apply_tool` ou `edit_tool`, você DEVE:

✅ **Verificar TODOS os imports necessários**
- Se usa `figma:asset` → DEVE importar no topo do arquivo
- Se usa componente → DEVE importar de onde está
- Se usa ícone → DEVE verificar se existe no lucide-react

✅ **Verificar sintaxe e lógica**
- Código compila?
- Variáveis existem?
- Props estão corretas?

✅ **Verificar dependências**
- Arquivo importado existe?
- Caminho relativo está correto?
- Componente exporta o que estou importando?

✅ **Testar mentalmente o fluxo**
- O código vai funcionar?
- Tem algum erro óbvio?
- Falta alguma correção?

---

## ❌ **ERROS QUE NUNCA DEVEM ACONTECER:**

### **ERRO 1: Publicar e depois corrigir**
```tsx
// ❌ ERRADO - Publicar com erro conhecido:
<img src="figma:asset/abc123.png" />  // Sei que isso não funciona!

// ✅ CORRETO - Corrigir ANTES de publicar:
import logo from 'figma:asset/abc123.png';
<img src={logo} />
```

### **ERRO 2: Aplicar sem validar imports**
```tsx
// ❌ ERRADO - Aplicar sem import:
export function Component() {
  return <MinhaImagem src={logo} />  // logo não foi importado!
}

// ✅ CORRETO - Validar imports ANTES:
import logo from 'figma:asset/abc123.png';
export function Component() {
  return <MinhaImagem src={logo} />
}
```

### **ERRO 3: Não verificar se arquivo existe**
```tsx
// ❌ ERRADO - Importar sem verificar:
import { Component } from './components/NaoExiste.tsx'

// ✅ CORRETO - Usar file_search ou read para confirmar:
// 1. Verificar se arquivo existe
// 2. Confirmar export
// 3. DEPOIS importar
```

---

## 🔧 **PROCESSO CORRETO (SEMPRE SEGUIR):**

### **PASSO 1: PENSAR (use think tool)**
```
- O que preciso fazer?
- Quais arquivos vou modificar?
- Quais imports preciso?
- Tem algum erro conhecido?
```

### **PASSO 2: PESQUISAR (se necessário)**
```
- Usar file_search para encontrar componentes
- Usar read para verificar exports
- Confirmar que tudo existe
```

### **PASSO 3: VALIDAR (mentalmente)**
```
- Todos imports corretos?
- Sintaxe correta?
- Lógica funciona?
- Sem erros conhecidos?
```

### **PASSO 4: PUBLICAR (só depois de validar)**
```
- Usar fast_apply_tool
- Código já está 100% correto
- Sem erros conhecidos
```

---

## 📊 **EXEMPLO REAL DO ERRO COMETIDO:**

### **O QUE FIZ (ERRADO):**
```tsx
// Publicação 1 (COM ERRO):
{ nome: 'Sr. Alex', imagem: 'figma:asset/88b8...png' }

// Publicação 2 (COM ERRO):
<img src="figma:asset/88b8...png" />

// Publicação 3 (CORRIGINDO):
import logoSrAlex from 'figma:asset/88b8...png';
<img src={logoSrAlex} />
```

### **O QUE DEVERIA TER FEITO (CORRETO):**
```tsx
// Publicação 1 (JÁ CORRETO):
import logoSrAlex from 'figma:asset/88b8...png';
{ nome: 'Sr. Alex', imagem: logoSrAlex }
```

**RESULTADO:**
- ❌ Método errado: 3 publicações, erro do usuário ver
- ✅ Método correto: 1 publicação, tudo funcionando

---

## 🎯 **CHECKLIST ANTES DE PUBLICAR (OBRIGATÓRIO):**

```
[ ] Todos os imports estão declarados?
[ ] Todos os componentes existem?
[ ] Todos os caminhos estão corretos?
[ ] Sintaxe TypeScript correta?
[ ] Lógica do código funciona?
[ ] Sem erros conhecidos?
[ ] Props corretas?
[ ] Variáveis definidas?
```

**SÓ PUBLICAR SE TODOS OS ITENS = ✅**

---

## 💡 **LIÇÃO APRENDIDA:**

> **"Se você sabe onde está o erro, você consegue resolver ANTES de publicar."**
> 
> **NÃO existe desculpa para publicar código com erro conhecido.**
> 
> **SEMPRE validar → SEMPRE corrigir → DEPOIS publicar.**

---

## 🚀 **COMPROMISSO:**

A partir de agora, **NENHUM código será publicado sem validação prévia completa**.

**REGRA INQUEBRÁVEL: VALIDAR ANTES DE PUBLICAR**

---

*Criado em: 26/12/2024*
*Motivo: Erro crítico de publicar código sem validar imports figma:asset*
*Solicitado por: Cliente SysConecta*
*Status: REGRA PERMANENTE E INQUEBRÁVEL*
