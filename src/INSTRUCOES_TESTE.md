# 🧪 INSTRUÇÕES DE TESTE - SISTEMA DE PEDIDOS COMPLETO

## 🎯 **FLUXO COMPLETO END-TO-END**

### **PASSO 1: INICIALIZAR FORNECEDORES**
```
1. Abrir o console do navegador (F12)
2. Digite: inicializarFornecedores()
3. Aguarde a mensagem: "✅ Fornecedores cadastrados"
```

**Fornecedores criados:**
- 🪟 **SANTA RITA** - Vidros - SC - ID: `santa-rita-vidros-sc`
- 🔩 **ALUSUPRA** - Alumínio - SC - ID: `alusupra-aluminio-sc`
- 🔧 **ALUSUPRA** - Acessórios - SC - ID: `alusupra-acessorios-sc`

---

### **PASSO 2: LOGIN COMO VIDRACEIRO (Criar Pedido)**
```
1. No console: loginComoVidraceiro()
2. Ou faça login manual:
   - Email: vidracaria@teste.com
   - Estado: SC
   - Perfil: Vidraceiro
```

### **PASSO 3: CRIAR ORÇAMENTO**
```
1. Dashboard → "Comercial" → "➕ NOVO ORÇAMENTO"
2. Preencher cliente (Nome + CPF)
3. Escolher Linha: SUPREMA
4. Escolher Produto: Janela de Correr - 2 Folhas
5. Configurar:
   - Largura: 2000mm
   - Altura: 2100mm
   - Vidro: INCOLOR 6mm
   - Cor: BRANCO
6. Clique "Salvar e Continuar"
```

### **PASSO 4: SOLICITAR MATERIAL**
```
1. Na tela de Resumo, clique "Solicitar Material"
2. Você verá 3 fornecedores:
   - 🪟 SANTA RITA - VIDRO
   - 🔩 ALUSUPRA - ALUMÍNIO
   - 🔧 ALUSUPRA - ACESSÓRIOS
3. Marque os 3 checkboxes
4. Para cada um:
   - Copie o QR Code PIX (simulado)
   - Clique "Já Realizei o Pagamento"
5. Clique "Finalizar Solicitação"
6. Aguarde: "✅ Solicitação enviada com sucesso!"
```

**O QUE ACONTECE:**
- Pedidos salvos no Supabase KV Store
- Chaves duplas criadas:
  - `pedido:fornecedor:santa-rita-vidros-sc:pedido-xxx`
  - `pedido:vidraceiro:vidraceiro-temp:pedido-xxx`

---

### **PASSO 5: LOGIN COMO FORNECEDOR ALEXANDRE (Santa Rita)**
```
1. Faça logout (ou abra aba anônima)
2. No console: loginComoAlexandre()
3. Ou faça login manual:
   - Email: alexandre@santarita.com
   - Estado: SC
   - Perfil: Fornecedor > Vidros
```

### **PASSO 6: VER PEDIDOS RECEBIDOS**
```
1. Dashboard do Fornecedor abre automaticamente
2. Clique em "📦 Pedidos Recebidos" no menu lateral
3. Você verá o pedido com:
   ✅ Dados do vidraceiro (nome, email, telefone, cidade/estado)
   ✅ Dados do cliente final
   ✅ Especificações do projeto:
      - Largura: 2000mm
      - Altura: 2100mm
      - Vidro: INCOLOR 6mm
      - Linha: SUPREMA
      - Sistema: Correr 2 Folhas
   ✅ Lista de itens (código, descrição, quantidade, valores)
   ✅ Comprovante anexado
   ✅ Valor total
```

### **PASSO 7: APROVAR E INICIAR PRODUÇÃO**
```
1. Clique no pedido para ver detalhes completos
2. Clique "Aprovar e Iniciar Produção"
3. Modal de Gestão de Produção abre automaticamente
4. Avançar cada etapa clicando "Concluir Etapa":
   ⚙️ Em Produção
   ✂️ Corte
   📦 Lapidação
   ⚡ Têmpera
   📦 Embalando
   🚚 Carregando
   🚛 Saiu para Entrega ← NOTIFICA O VIDRACEIRO!
```

---

### **PASSO 8: VIDRACEIRO RECEBE NOTIFICAÇÃO**
```
1. Volte para a aba do vidraceiro (ou faça login novamente)
2. Vá em "Pedidos" no menu
3. Você verá:
   - 🔔 Alerta: "🚚 Pedido saiu para entrega!"
   - Toast automático com botão "Acompanhar Rota"
4. Clique em "Rastrear Entrega"
   - Mapa simulado
   - Previsão de entrega
   - Dados do motorista
```

### **PASSO 9: CONFIRMAR RECEBIMENTO**
```
1. Clique "Confirmar Recebimento"
2. Modal de avaliação abre
3. Dê 1-5 estrelas
4. Escreva um comentário (opcional)
5. Clique "Enviar Avaliação"
```

### **PASSO 10: VER HISTÓRICO COMPLETO**
```
Em "Meus Pedidos" você verá:
✅ Status: Entregue
✅ Tempo de produção: X dias
✅ Avaliação dada: ⭐⭐⭐⭐⭐
✅ Todos os detalhes do projeto salvos
✅ Histórico de datas (pedido, aprovação, produção, entrega)
```

---

## 🔧 **FUNÇÕES RÁPIDAS DO CONSOLE**

```javascript
// Inicializar fornecedores SC
inicializarFornecedores()

// Login rápido como Vidraceiro
loginComoVidraceiro()

// Login rápido como Alexandre (Santa Rita)
loginComoAlexandre()

// Ver todos os pedidos salvos
verPedidosSalvos()

// Reset completo (limpar tudo)
resetSysConecta()
```

---

## 📊 **ESTRUTURA DOS DADOS NO SUPABASE**

### **KV Store Keys:**
```
fornecedor:santa-rita-vidros-sc
fornecedor:alusupra-aluminio-sc
fornecedor:alusupra-acessorios-sc

pedido:fornecedor:{fornecedor_id}:{pedido_id}
pedido:vidraceiro:{vidraceiro_id}:{pedido_id}
```

### **Dados do Pedido:**
```json
{
  "id": "pedido-1734448920-abc123",
  "fornecedor_id": "santa-rita-vidros-sc",
  "fornecedor_nome": "SANTA RITA",
  "categoria": "vidro",
  
  "vidraceiro_id": "vidraceiro-temp",
  "vidraceiro_nome": "Vidraçaria Exemplo",
  "vidraceiro_email": "contato@vidracaria.com",
  "vidraceiro_telefone": "(48) 99999-9999",
  "vidraceiro_cidade": "Florianópolis",
  "vidraceiro_estado": "SC",
  
  "cliente_nome": "João da Silva",
  
  "projeto_largura": 2000,
  "projeto_altura": 2100,
  "projeto_tipo_vidro": "INCOLOR",
  "projeto_espessura": 6,
  "projeto_cor_aluminio": "BRANCO",
  "projeto_linha": "SUPREMA",
  "projeto_sistema": "Correr 2 Folhas",
  
  "items": [...],
  "valor_total": 312.00,
  
  "status": "aguardando_aprovacao",
  "data_pedido": "2024-12-17T14:22:00.000Z"
}
```

---

## ✅ **CHECKLIST DE VERIFICAÇÃO**

- [ ] Fornecedores criados (console: inicializarFornecedores())
- [ ] Pedido criado pelo vidraceiro
- [ ] Pedido aparece no dashboard do Alexandre
- [ ] Dados completos do projeto visíveis
- [ ] Alexandre aprova o pedido
- [ ] Gestão de produção funciona (7 etapas)
- [ ] Vidraceiro recebe notificação
- [ ] Rastreamento funciona
- [ ] Confirmação de recebimento OK
- [ ] Avaliação salva corretamente
- [ ] Histórico completo em "Meus Pedidos"

---

## 🚨 **TROUBLESHOOTING**

### **Pedido não aparece para o fornecedor:**
```javascript
// Ver no console se o pedido foi salvo:
verPedidosSalvos()

// Verificar o ID do fornecedor:
console.log(localStorage.getItem('sysconecta_fornecedor_logado'))
```

### **Erro ao enviar pedido:**
```javascript
// Verificar se os fornecedores existem:
fetch('https://PROJECT_ID.supabase.co/functions/v1/make-server-f33747ec/fornecedores/estado/SC', {
  headers: { Authorization: 'Bearer PUBLIC_ANON_KEY' }
})
  .then(r => r.json())
  .then(console.log)
```

### **Reset completo:**
```javascript
resetSysConecta()
```

---

## 📞 **SUPPORT**

Se algo não funcionar:
1. Abra o console (F12)
2. Procure por erros (linhas vermelhas)
3. Copie a mensagem de erro
4. Verifique se os fornecedores foram inicializados
5. Verifique se o estado é SC (não SP!)

**LEMBRE-SE:** Este é um software em produção, não protótipo! Todos os dados são salvos no Supabase KV Store permanentemente.
