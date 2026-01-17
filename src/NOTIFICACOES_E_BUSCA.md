# 🔍🔔 Sistema de Busca e Notificações - Dashboard Fornecedor

## ✨ Funcionalidades Implementadas

### 🔍 **BUSCA EM TEMPO REAL**
- **Barra de busca inteligente** no topo da dashboard
- **Debounce de 300ms** para evitar sobrecarga
- **Placeholder descritivo**: "Buscar pedidos, orçamentos, clientes..."
- **Botão de limpar (X)** quando tem texto digitado
- **Focus ring dourado** (#D4AF37) quando ativa

**Como usar:**
```typescript
<HeaderFornecedor 
  fornecedorId={fornecedorId}
  nomeEmpresa={nomeEmpresa}
  onBusca={(termo) => console.log('Buscar:', termo)}
/>
```

---

### 🔔 **NOTIFICAÇÕES EM TEMPO REAL**

#### **Recursos:**
1. ✅ **Sininho animado** com bounce quando tem notificação
2. ✅ **Badge vermelho** mostrando quantidade não lida (máx 99+)
3. ✅ **Dropdown elegante** com animação
4. ✅ **Marcação individual** (clica na notificação)
5. ✅ **Marcar todas como lidas** (botão no header)
6. ✅ **Limpar todas** (botão no footer)
7. ✅ **Som de notificação** quando recebe nova
8. ✅ **Auto-verificação** a cada 30 segundos
9. ✅ **Persistência** no localStorage

#### **Tipos de Notificação:**
- 🎉 **novo_pedido** (laranja)
- ✅ **pedido_aprovado** (verde)
- 🚚 **pedido_entregue** (azul)
- 💬 **mensagem** (cinza)

#### **Estrutura de uma Notificação:**
```typescript
interface Notificacao {
  id: string;
  tipo: 'novo_pedido' | 'pedido_aprovado' | 'pedido_entregue' | 'mensagem';
  titulo: string;
  mensagem: string;
  data: string;
  lida: boolean;
  pedidoId?: string;
  icone?: React.ComponentType<any>;
  cor?: string;
}
```

---

## 🚀 **Como Funciona**

### **1. Verificação Automática de Novos Pedidos**
```typescript
// Roda a cada 30 segundos
useEffect(() => {
  const interval = setInterval(() => {
    verificarNovosPedidos();
  }, 30000);
  
  return () => clearInterval(interval);
}, [fornecedorId]);
```

### **2. Detecção de Novos Pedidos**
O sistema compara a data do pedido com a última verificação:
```typescript
const lastCheck = localStorage.getItem('sysconecta_last_check_${fornecedorId}');
const lastCheckTime = lastCheck ? new Date(lastCheck) : new Date(0);

if (pedidoData > lastCheckTime) {
  // 🎉 NOVO PEDIDO! Adicionar notificação
}
```

### **3. Armazenamento Local**
```
localStorage['sysconecta_notif_fornecedor_forn-vidro-01'] = [
  { id: '1', titulo: 'Novo Pedido', lida: false, ... },
  { id: '2', titulo: 'Pedido Aprovado', lida: true, ... }
]

localStorage['sysconecta_last_check_forn-vidro-01'] = '2026-01-13T10:30:00Z'
```

---

## 🎨 **UI/UX**

### **Desktop:**
```
┌─────────────────────────────────────────────────────────────┐
│  🏢 Santa Rita Vidros          🔍 Buscar...          🔔 3   │
│     Painel do Fornecedor                                    │
└─────────────────────────────────────────────────────────────┘
```

### **Dropdown de Notificações:**
```
┌────────────────────────────────────┐
│ Notificações    [Marcar como lidas]│
│ 3 não lidas                        │
├────────────────────────────────────┤
│ 📦  🎉 Novo Pedido Recebido!    ●  │
│     Vidraçaria Premium • R$ 2.450  │
│     13/01 10:30                    │
├────────────────────────────────────┤
│ ✅  Pedido Aprovado                │
│     Pedido #1234 em produção       │
│     13/01 09:15                    │
├────────────────────────────────────┤
│            [Limpar todas]          │
└────────────────────────────────────┘
```

---

## 🧪 **Teste da Notificação**

### **Simulação Automática (REMOVER EM PRODUÇÃO):**
No código atual, há uma notificação de teste que aparece após 3 segundos:

```typescript
setTimeout(() => {
  adicionarNotificacao({
    id: `notif-test-${Date.now()}`,
    tipo: 'novo_pedido',
    titulo: '🎉 Novo Pedido Recebido!',
    mensagem: 'Vidraçaria Premium • R$ 2.450,00',
    data: new Date().toISOString(),
    lida: false,
    icone: Package,
    cor: 'orange'
  });
}, 3000);
```

**⚠️ ATENÇÃO:** Remova este `setTimeout` antes de colocar em produção!

---

## 📍 **Localização dos Arquivos**

```
/components/fornecedor/
  ├── HeaderFornecedor.tsx      🔥 NOVO - Header com busca e notificações
  ├── DashboardFornecedor.tsx   ✅ ATUALIZADO - Integração do header
  └── PedidosRecebidos.tsx      (já existente)
```

---

## 🔧 **Personalização**

### **Mudar Intervalo de Verificação:**
```typescript
// De 30s para 1 minuto
setInterval(() => verificarNovosPedidos(), 60000);
```

### **Adicionar Novo Tipo de Notificação:**
```typescript
// 1. Adicionar no tipo
tipo: 'novo_pedido' | 'pedido_aprovado' | 'NOVO_TIPO';

// 2. Configurar cor
const getCorNotificacao = (notif) => {
  if (notif.tipo === 'NOVO_TIPO') return 'purple';
}

// 3. Configurar ícone
const getIconeNotificacao = (notif) => {
  if (notif.tipo === 'NOVO_TIPO') return <Star className="w-5 h-5" />;
}
```

### **Desabilitar Som:**
```typescript
// Comentar ou remover:
const audio = new Audio('...');
audio.play();
```

---

## ✅ **Checklist de Implementação**

- [x] Header com busca
- [x] Sininho de notificações
- [x] Badge com contador
- [x] Dropdown animado
- [x] Marcar como lida
- [x] Marcar todas como lidas
- [x] Limpar todas
- [x] Som de notificação
- [x] Auto-verificação a cada 30s
- [x] Persistência no localStorage
- [x] Animações suaves
- [x] Fechar ao clicar fora
- [x] Integração com dashboard

---

## 🎯 **Próximos Passos**

1. ⚠️ **Remover notificação de teste** (linha 62-71 do HeaderFornecedor.tsx)
2. 🔔 **Integrar com backend real** para notificações push
3. 🔍 **Implementar lógica de busca** nos componentes (PedidosRecebidos, etc)
4. 📱 **Adicionar suporte mobile** (header mobile com busca)
5. 🔊 **Permitir usuário desabilitar som** (configurações)
6. 📧 **Adicionar notificações por email** (opcional)

---

## 🐛 **Troubleshooting**

**Notificações não aparecem?**
- Verifique o `fornecedorId` no localStorage
- Abra o Console (F12) e veja os logs de `verificarNovosPedidos()`
- Verifique se há pedidos com status `aguardando_aprovacao`

**Badge não atualiza?**
- Limpe o cache do navegador
- Verifique o localStorage: `sysconecta_notif_fornecedor_*`

**Som não toca?**
- Alguns navegadores bloqueiam áudio automático
- Requer interação do usuário primeiro
