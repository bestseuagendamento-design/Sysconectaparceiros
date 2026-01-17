# 📧 ENVIAR CÓDIGO DE VERIFICAÇÃO - SANTA RITA VIDROS

## 🎯 **OBJETIVO**

Enviar código de verificação de 6 dígitos para a Santa Rita Vidros no email:
**leandro.zara@sysvidro.com**

---

## 🚀 **COMO EXECUTAR**

### **Método 1: Pelo Frontend (Automático)**

Quando o usuário acessar a tela da Santa Rita e clicar em "Enviar Código", o sistema automaticamente:

1. Gera código de 6 dígitos
2. Armazena no KV Store (válido por 30 minutos)
3. Envia email com template premium dark luxury
4. Mostra campo para digitar código

---

### **Método 2: Pelo cURL (Manual)**

Execute o comando abaixo para enviar o código **AGORA**:

```bash
curl -X POST https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-f33747ec/fornecedor/send-code \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "nomeEmpresa": "Santa Rita Vidros Laminados LTDA",
    "nomeResponsavel": "Leandro Zara",
    "email": "leandro.zara@sysvidro.com",
    "estado": "SC"
  }'
```

**Substitua:**
- `YOUR_PROJECT_ID` pelo Project ID do Supabase
- `YOUR_ANON_KEY` pela chave pública do Supabase

---

### **Método 3: Pelo JavaScript (Console do Navegador)**

Abra o console do navegador (F12) e cole:

```javascript
// Dados para enviar código
const dados = {
  nomeEmpresa: "Santa Rita Vidros Laminados LTDA",
  nomeResponsavel: "Leandro Zara",
  email: "leandro.zara@sysvidro.com",
  estado: "SC"
};

// Fazer requisição
fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-f33747ec/fornecedor/send-code', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  },
  body: JSON.stringify(dados)
})
.then(res => res.json())
.then(data => {
  console.log('✅ Resposta:', data);
  if (data.success) {
    console.log('📧 Email enviado com sucesso!');
    console.log('🔐 Código gerado:', data.codigoGerado);
  }
})
.catch(err => console.error('❌ Erro:', err));
```

---

## 📋 **RESPOSTA ESPERADA**

```json
{
  "success": true,
  "message": "Código de verificação gerado e enviado com sucesso!",
  "codigoGerado": "123456",
  "data": {
    "id": "email-id-from-resend"
  }
}
```

---

## 📧 **EMAIL QUE SERÁ ENVIADO**

### **Para:** leandro.zara@sysvidro.com
### **Assunto:** 🏭 Código de Acesso Exclusivo - Santa Rita Vidros Laminados LTDA - SysConecta 2026

### **Conteúdo:**
- ✅ Logo SysConecta 2026 dourado
- ✅ Badge "FORNECEDOR EXCLUSIVO - SC"
- ✅ Título: "🔐 Código de Acesso"
- ✅ Saudação personalizada: "Olá, Leandro Zara!"
- ✅ **CÓDIGO DE 6 DÍGITOS EM DESTAQUE**
- ✅ Instruções passo a passo
- ✅ Validade: 30 minutos
- ✅ Benefícios exclusivos de fornecedor
- ✅ Design dark luxury premium

---

## 🔐 **CÓDIGO DE VERIFICAÇÃO**

### **Características:**
- ✅ 6 dígitos numéricos
- ✅ Gerado aleatoriamente
- ✅ Válido por **30 minutos**
- ✅ Armazenado no KV Store
- ✅ Removido automaticamente após uso

### **Exemplo de código:**
```
234567
```

---

## 🧪 **FLUXO COMPLETO**

### **1. Usuário acessa SysConecta**
- Cria conta
- Escolhe "Fornecedor"
- Escolhe "Fornecedor de Vidros"
- Seleciona "SC - Santa Catarina"

### **2. Tela Santa Rita aparece**
- Mostra dados da empresa
- Botão: "Enviar Código por Email"

### **3. Usuário clica em "Enviar Código"**
- Sistema gera código de 6 dígitos
- Armazena no banco (30 min de validade)
- **Envia email para: leandro.zara@sysvidro.com**
- Mostra campo: "Digite o código que enviamos"

### **4. Leandro recebe o email**
- Abre email no Gmail/Outlook
- Vê código em destaque (ex: 456789)
- Copia o código

### **5. Leandro digita o código**
- Insere o código no campo
- Clica em "Verificar Código"

### **6. Sistema valida**
- Verifica se código está correto
- Verifica se não expirou
- ✅ Se válido: autentica e redireciona para dashboard
- ❌ Se inválido: mostra erro e permite tentar novamente

---

## 🎨 **PREVIEW DO EMAIL**

```
╔════════════════════════════════════════════════╗
║   🏭 FORNECEDOR EXCLUSIVO - SC 🏭           ║
║                                                ║
║           🔐 Código de Acesso                 ║
║                                                ║
║   Olá, Leandro Zara!                          ║
║   Bem-vindo(a) ao SysConecta 2026.           ║
║                                                ║
║   A Santa Rita Vidros Laminados LTDA foi      ║
║   selecionada como fornecedor exclusivo       ║
║   do estado de SC.                            ║
║                                                ║
║   ╔══════════════════════════════════╗        ║
║   ║   SEU CÓDIGO DE VERIFICAÇÃO     ║        ║
║   ║                                  ║        ║
║   ║          456789                  ║        ║
║   ╚══════════════════════════════════╝        ║
║                                                ║
║   📋 Como usar este código:                   ║
║   1. Acesse a plataforma SysConecta 2026     ║
║   2. Selecione "Fornecedor de Vidros"        ║
║   3. Escolha o estado SC                      ║
║   4. Insira o código de 6 dígitos acima      ║
║                                                ║
║   ⏰ Válido por 30 minutos                    ║
║                                                ║
║   ✨ Benefícios Exclusivos:                   ║
║   🏆 Exclusividade Territorial                ║
║   📊 Dashboard Analytics                      ║
║   💰 ROI Maximizado                           ║
║   📦 Aproveitamento de Chapas                 ║
╚════════════════════════════════════════════════╝
```

---

## 🔒 **SEGURANÇA**

### **Validações Implementadas:**
- ✅ Código de 6 dígitos numéricos
- ✅ Validade de 30 minutos
- ✅ Um código por email + estado
- ✅ Código removido após uso
- ✅ Código removido se expirado
- ✅ Validação de email formato válido

### **Proteções:**
- ✅ Rate limiting (implementar no futuro)
- ✅ Log de tentativas
- ✅ Email único por estado
- ✅ Código não reutilizável

---

## 📊 **ENDPOINTS CRIADOS**

### **1. Enviar Código**
```
POST /make-server-f33747ec/fornecedor/send-code

Body:
{
  "nomeEmpresa": "Santa Rita Vidros Laminados LTDA",
  "nomeResponsavel": "Leandro Zara",
  "email": "leandro.zara@sysvidro.com",
  "estado": "SC"
}

Response:
{
  "success": true,
  "message": "Código enviado!",
  "codigoGerado": "123456"
}
```

### **2. Verificar Código**
```
POST /make-server-f33747ec/fornecedor/verify-code

Body:
{
  "email": "leandro.zara@sysvidro.com",
  "estado": "SC",
  "codigo": "123456"
}

Response:
{
  "success": true,
  "message": "Código verificado!",
  "dadosEmpresa": {
    "nomeEmpresa": "Santa Rita Vidros Laminados LTDA",
    "nomeResponsavel": "Leandro Zara",
    "email": "leandro.zara@sysvidro.com",
    "estado": "SC"
  }
}
```

---

## 🎯 **PRÓXIMOS PASSOS**

### **Para enviar o código AGORA:**

1. Abra o projeto no navegador
2. Vá para a tela de fornecedor
3. Selecione Santa Catarina
4. O sistema vai automaticamente:
   - Detectar que é Santa Rita
   - Mostrar botão "Enviar Código"
5. Clique no botão
6. ✅ Email será enviado para **leandro.zara@sysvidro.com**

---

## ✅ **CHECKLIST**

- [ ] RESEND_API_KEY configurada no Supabase
- [ ] Backend rodando
- [ ] Email leandro.zara@sysvidro.com válido
- [ ] Clicar em "Enviar Código" na tela Santa Rita
- [ ] Verificar recebimento do email
- [ ] Copiar código de 6 dígitos
- [ ] Colar no campo e verificar
- [ ] ✅ Acesso liberado!

---

**Criado em:** 16 de Dezembro de 2025  
**Status:** ✅ Pronto para uso  
**Email destino:** leandro.zara@sysvidro.com  

**#SysConecta2026 #SantaRita #CodigoVerificacao** 📧🏭✨
