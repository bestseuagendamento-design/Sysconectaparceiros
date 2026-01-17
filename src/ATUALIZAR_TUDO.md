# SCRIPT DE ATUALIZAÇÃO GLOBAL - TEMA CLEAN

## Padrão de Substituição

### Substituir em TODOS os componentes:

**DE:**
```tsx
className="min-h-screen bg-gradient-to-br from-neutral-900 via-black to-neutral-950
```

**PARA:**
```tsx
className="min-h-screen bg-[#FAF9F7]
```

**DE:**
```tsx
className="bg-neutral-900/40 border border-neutral-800
```

**PARA:**
```tsx
className="bg-white border border-gray-200
```

**DE:**
```tsx
className="text-white
```

**PARA:**
```tsx
className="text-gray-900
```

**DE:**
```tsx
className="text-neutral-500
```

**PARA:**
```tsx
className="text-gray-600
```

**DE:**
```tsx
className="bg-black border border-neutral-800
```

**PARA:**
```tsx
className="bg-white border border-gray-300
```

**DE:**
```tsx
className="bg-neutral-800 hover:bg-neutral-700 text-white
```

**PARA:**
```tsx
className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-900
```

**DE:**
```tsx
className="bg-white hover:bg-neutral-200 text-black
```

**PARA:**
```tsx
className="bg-[#2C5F6F] hover:bg-[#234A56] text-white
```

## Lista de arquivos a atualizar:

- /components/FormularioTipologia.tsx
- /components/ResumoOrcamento.tsx
- /components/OrcamentoFinal.tsx
- /components/ComprarMaterial.tsx
- /components/AcompanharPedido.tsx
- /components/MeusPedidos.tsx
- /components/MinhasEntregas.tsx
- /components/RotaTempoReal.tsx
- /components/RomaneioEntrega.tsx
- /components/SysLicita.tsx
- /components/SysFrete.tsx
- /components/SysMontagem.tsx
- /components/SysFederal.tsx
- /components/TelaEmBreve.tsx

## Status: EM PROGRESSO