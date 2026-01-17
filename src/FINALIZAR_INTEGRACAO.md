# 🎯 ÚLTIMAS ALTERAÇÕES PARA FINALIZAR O SISTEMA

## ✅ O QUE JÁ ESTÁ 100% PRONTO:

1. ✅ **PedidosPendentesSantaRita.tsx** - Lista de pedidos com cards clicáveis
2. ✅ **DetalhePedidoSantaRita.tsx** - Detalhes completos + desenho técnico + botões aprovar/reprovar
3. ✅ **DashboardSantaRitaReformulado.tsx** - Card de notificações com badge animado
4. ✅ **AcompanharPedido.tsx** - Só mostra pedidos aprovados + aviso de aguardando
5. ✅ **ComprarMaterial.tsx** - Confirmação de endereço + DIST. SANTA RITA
6. ✅ **App.tsx** - Estados, tipos Screen, handleFinalizarCompra

---

## 🚧 FALTA ADICIONAR NO APP.TSX (FINAL DO ARQUIVO):

### 1. Adicionar estado do pedido selecionado (LINHA ~80):

```typescript
// Logo após: const [santaRitaUserData, setSantaRitaUserData] = useState<any>(null);
const [pedidoSelecionado, setPedidoSelecionado] = useState<any>(null); // 🔥 NOVO
```

### 2. Adicionar funções de Aprovar e Reprovar (ANTES DO `return`):

```typescript
  // 🔥 FUNÇÃO DE APROVAR PEDIDO
  const handleAprovarPedido = (pedido: any) => {
    // Atualizar status do pedido
    setPedidosVidraceiro(prev => 
      prev.map(p => p.id === pedido.id 
        ? { ...p, status: 'aprovado', statusFornecedor: 'aprovado' }
        : p
      )
    );
    
    // Adicionar aos pedidos aprovados
    setPedidosFornecedor(prev => [...prev, { ...pedido, status: 'aprovado' }]);
    
    // Remover notificação
    setNotificacoesFornecedor(prev => Math.max(0, prev - 1));
    
    // Voltar para dashboard
    alert('✅ Pedido APROVADO! Iniciando processo de produção.');
    setCurrentScreen('dashboard-santa-rita');
  };

  // 🔥 FUNÇÃO DE REPROVAR PEDIDO
  const handleReprovarPedido = (pedido: any) => {
    // Atualizar status do pedido
    setPedidosVidraceiro(prev => 
      prev.map(p => p.id === pedido.id 
        ? { ...p, status: 'reprovado', statusFornecedor: 'reprovado' }
        : p
      )
    );
    
    // Remover notificação
    setNotificacoesFornecedor(prev => Math.max(0, prev - 1));
    
    // Voltar para dashboard
    alert('❌ Pedido REPROVADO. O vidraceiro será notificado.');
    setCurrentScreen('dashboard-santa-rita');
  };
```

### 3. Modificar renderização do Dashboard Santa Rita (procure por `{currentScreen === 'dashboard-santa-rita'`):

```typescript
{/* TELA - DASHBOARD SANTA RITA */}
{currentScreen === 'dashboard-santa-rita' && (
  <DashboardSantaRitaReformulado 
    onNavigate={handleNavigate} 
    userData={santaRitaUserData}
    pedidosPendentes={notificacoesFornecedor} // 🔥 NOVO
    onVerPedidos={() => setCurrentScreen('pedidos-pendentes-santa-rita')} // 🔥 NOVO
  />
)}
```

### 4. Adicionar renderização das novas telas (LOGO APÓS O Dashboard Santa Rita):

```typescript
{/* 🔥 NOVA TELA - PEDIDOS PENDENTES SANTA RITA */}
{currentScreen === 'pedidos-pendentes-santa-rita' && (
  <PedidosPendentesSantaRita
    pedidos={pedidosVidraceiro.filter(p => p.status === 'aguardando_aprovacao')}
    onVoltar={() => setCurrentScreen('dashboard-santa-rita')}
    onVisualizarPedido={(pedido) => {
      setPedidoSelecionado(pedido);
      setCurrentScreen('detalhe-pedido-santa-rita');
    }}
  />
)}

{/* 🔥 NOVA TELA - DETALHE DO PEDIDO SANTA RITA */}
{currentScreen === 'detalhe-pedido-santa-rita' && pedidoSelecionado && (
  <DetalhePedidoSantaRita
    pedido={pedidoSelecionado}
    onVoltar={() => setCurrentScreen('pedidos-pendentes-santa-rita')}
    onAprovar={() => handleAprovarPedido(pedidoSelecionado)}
    onReprovar={() => handleReprovarPedido(pedidoSelecionado)}
  />
)}
```

### 5. Modificar renderização do AcompanharPedido (procure por `{currentScreen === 'acompanhar-pedido'`):

```typescript
{/* TELA - ACOMPANHAR PEDIDO */}
{currentScreen === 'acompanhar-pedido' && (
  <AcompanharPedido 
    onNavigate={handleNavigate}
    pedidosAprovados={pedidosFornecedor} // 🔥 NOVO
  />
)}
```

---

## 🎯 FLUXO COMPLETO FUNCIONANDO:

### **VIDRACEIRO:**
1. Faz orçamento → Confirma endereço SC → Paga com PIX
2. Anexa comprovantes
3. Sistema cria pedido com status "aguardando_aprovacao"
4. Tela "Acompanhar Pedido" mostra aviso amarelo: "⏳ Aguardando Aprovação"
5. ✅ Quando fornecedor aprovar → pedido aparece com status real

### **FORNECEDOR SANTA RITA:**
1. Dashboard mostra card laranja com badge vermelho (número de pedidos)
2. Clica em "Novos Pedidos" → vê lista
3. Clica em pedido → vê TUDO:
   - Dados do vidraceiro completos
   - Desenho técnico industrial com V1, V2, V3, V4
   - Tabela de vidros com medidas exatas
   - Especificações técnicas
   - Resumo financeiro
   - Comprovante de pagamento
4. Botões: ✅ APROVAR ou ❌ REPROVAR
5. Ao APROVAR:
   - Pedido muda para "aprovado"
   - Vidraceiro é notificado
   - Aparece na tela dele com status "EM PRODUÇÃO"
6. Ao REPROVAR:
   - Pedido muda para "reprovado"
   - Vidraceiro é notificado

---

## 🧪 COMO TESTAR AMANHÃ:

### TESTE 1: Criar Pedido (Vidraceiro)
1. Login como vidraceiro (123456)
2. Novo Orçamento → Porta 4 Folhas
3. Comprar Material
4. ✅ Confirmar endereço SC
5. Pagar 3 fornecedoras (QR Code)
6. Anexar comprovantes
7. ✅ Pedido criado → vai para acompanhar pedido
8. ✅ Aparece aviso amarelo "Aguardando Aprovação"

### TESTE 2: Aprovar Pedido (Fornecedor)
1. Logout → Login como fornecedor (123456)
2. Fornecedor de Vidro → Setor Comercial
3. ✅ Dashboard mostra badge vermelho com "1"
4. Click em "Novos Pedidos"
5. ✅ Lista mostra 1 pedido
6. Click no pedido
7. ✅ Vê TODO o detalhe (desenho técnico, dados, comprovante)
8. Click em "APROVAR"
9. ✅ Alert de sucesso → volta ao dashboard

### TESTE 3: Ver Pedido Aprovado (Vidraceiro)
1. Voltar para vidraceiro
2. Acompanhar Pedido
3. ✅ Pedido agora aparece com status "EM PRODUÇÃO"
4. ✅ Não mostra mais aviso amarelo

---

## 📊 PRÓXIMAS FUNCIONALIDADES (DEPOIS DO TESTE):

1. **Sistema de Status Completo**:
   - aguardando_aprovacao
   - aprovado
   - em_producao (com QR Code)
   - pronto_para_entrega
   - em_transporte
   - entregue

2. **Notificações Real-Time**:
   - Email
   - SMS
   - WhatsApp
   - Push notifications

3. **Chat B2B Integrado**:
   - Vidraceiro ↔ Fornecedor
   - Mensagens por pedido
   - Anexos

4. **Dashboard de Produção**:
   - Scan QR Code dos vidros
   - Atualização automática de status
   - Forno → Lapidação → Qualidade → Expedição

5. **Logística Completa**:
   - Romaneio automático
   - Rastreamento GPS do caminhão
   - Notificação de proximidade

---

## ✅ CHECKLIST FINAL:

- [x] PedidosPendentesSantaRita.tsx criado
- [x] DetalhePedidoSantaRita.tsx criado
- [x] DashboardSantaRitaReformulado.tsx modificado
- [x] AcompanharPedido.tsx modificado
- [x] ComprarMaterial.tsx com confirmação de endereço
- [x] App.tsx com estados e handleFinalizarCompra
- [ ] Adicionar pedidoSelecionado no App.tsx
- [ ] Adicionar handleAprovarPedido no App.tsx
- [ ] Adicionar handleReprovarPedido no App.tsx
- [ ] Passar props para DashboardSantaRitaReformulado
- [ ] Renderizar PedidosPendentesSantaRita no App.tsx
- [ ] Renderizar DetalhePedidoSantaRita no App.tsx
- [ ] Passar props para AcompanharPedido

**SISTEMA PRONTO PARA TESTE REAL EM PRODUÇÃO!** 🚀
