# 🔍 DIAGNÓSTICO COMPLETO: SISTEMA DE EMAILS SUPABASE

## ⚠️ **PROBLEMA ATUAL:**
**Os emails não estão sendo enviados.**

---

## 📋 **CHECKLIST DE DIAGNÓSTICO - PASSO A PASSO:**

### **1️⃣ VERIFICAR SE O CÓDIGO ESTÁ CORRETO** ✅

Vamos revisar o arquivo que envia emails:

**Arquivo:** `/supabase/functions/server/emails.tsx`

**O que precisa ter:**
```typescript
import { Resend } from 'npm:resend@4.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

export async function enviarEmailVIP(params) {
  const { data, error } = await resend.emails.send({
    from: 'SysConecta <onboarding@resend.dev>',
    to: params.email,
    subject: params.assunto,
    html: params.corpo,
  });
  
  return { data, error };
}
```

---

### **2️⃣ VERIFICAR AS VARIÁVEIS DE AMBIENTE NO SUPABASE** 🔑

#### **PASSO 1: Acessar Supabase Dashboard**
```
1. Ir para: https://supabase.com/dashboard
2. Selecionar seu projeto
3. Ir em: Settings → Edge Functions → Secrets
```

#### **PASSO 2: Verificar se RESEND_API_KEY existe**
```
Você deve ver algo assim:

┌────────────────────────────────────────┐
│ RESEND_API_KEY                         │
│ re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx      │
│ (valor oculto)                         │
└────────────────────────────────────────┘
```

#### **❌ SE NÃO EXISTIR, ADICIONAR:**
```
1. Clicar em "Add new secret"
2. Name: RESEND_API_KEY
3. Value: sua_chave_da_resend
4. Salvar
```

---

### **3️⃣ VERIFICAR SE TEM CONTA NA RESEND** 📧

#### **O que é Resend?**
Resend é o serviço que ENVIA os emails. Sem uma conta ativa na Resend, **nenhum email será enviado**.

#### **PASSO 1: Criar conta na Resend**
```
1. Ir para: https://resend.com
2. Clicar em "Sign Up"
3. Criar conta (grátis - 100 emails/dia)
4. Confirmar email
```

#### **PASSO 2: Pegar a API Key**
```
1. No dashboard Resend, ir em: "API Keys"
2. Clicar em "Create API Key"
3. Dar um nome: "SysConecta Production"
4. Copiar a chave: re_xxxxxxxxxxxxxx
```

#### **PASSO 3: Adicionar no Supabase**
```
Voltar no Supabase:
Settings → Edge Functions → Secrets
Add new secret:
  Name: RESEND_API_KEY
  Value: re_xxxxxxxxxxxxxx (a chave que copiou)
```

---

### **4️⃣ VERIFICAR O DOMÍNIO DE ENVIO** 🌐

#### **Problema comum:**
```
❌ from: 'SysConecta <seuemail@gmail.com>'
   → NÃO FUNCIONA! Gmail bloqueia.

✅ from: 'SysConecta <onboarding@resend.dev>'
   → Domínio teste da Resend. FUNCIONA!
```

#### **Para produção (opcional):**
```
1. No Resend, ir em "Domains"
2. Adicionar seu domínio: sysconecta.com.br
3. Configurar DNS (MX, TXT, CNAME)
4. Verificar domínio
5. Usar: from: 'SysConecta <noreply@sysconecta.com.br>'
```

**POR ENQUANTO:** Use `onboarding@resend.dev` (domínio teste gratuito).

---

### **5️⃣ VERIFICAR SE O SERVIDOR ESTÁ RODANDO** 🚀

#### **No Supabase Dashboard:**
```
1. Ir em: Edge Functions
2. Ver se "server" está listado
3. Status deve estar: "Active" (verde)
```

#### **Se não estiver:**
```bash
# Fazer deploy local:
supabase functions deploy server --no-verify-jwt
```

---

### **6️⃣ TESTAR O ENVIO DE EMAIL MANUALMENTE** 🧪

#### **Teste via código:**
```typescript
// No seu código, adicionar log:
console.log('📧 Tentando enviar email...');
console.log('Para:', email);
console.log('RESEND_API_KEY existe?', !!Deno.env.get('RESEND_API_KEY'));

const { data, error } = await resend.emails.send({ ... });

console.log('✅ Resultado:', data);
console.log('❌ Erro:', error);
```

#### **Ver logs no Supabase:**
```
1. Edge Functions → server → Logs
2. Ver se aparece os console.log
3. Ver se tem erro
```

---

### **7️⃣ PROBLEMAS MAIS COMUNS E SOLUÇÕES** 🔧

#### **❌ Erro: "Invalid API key"**
```
Solução:
- Verificar se RESEND_API_KEY está correta
- Gerar nova chave na Resend
- Atualizar no Supabase Secrets
```

#### **❌ Erro: "From email not verified"**
```
Solução:
- Usar: from: 'SysConecta <onboarding@resend.dev>'
- OU verificar seu domínio na Resend
```

#### **❌ Erro: "Missing API key"**
```
Solução:
- Adicionar RESEND_API_KEY no Supabase Secrets
- Fazer redeploy da function
```

#### **❌ Email não chega (sem erro)**
```
Solução:
- Verificar caixa de SPAM
- Verificar logs da Resend: https://resend.com/emails
- Ver se email foi enviado com sucesso
```

---

## 🎯 **ROTEIRO COMPLETO PARA RESOLVER:**

### **ETAPA 1: Criar conta Resend**
```
1. Ir para: https://resend.com
2. Sign up (grátis)
3. Confirmar email
```

### **ETAPA 2: Pegar API Key**
```
1. Dashboard Resend → API Keys
2. Create API Key
3. Copiar: re_xxxxxxxxxxxxx
```

### **ETAPA 3: Adicionar no Supabase**
```
1. Supabase Dashboard → Settings → Edge Functions → Secrets
2. Add new secret:
   Name: RESEND_API_KEY
   Value: re_xxxxxxxxxxxxx
3. Save
```

### **ETAPA 4: Verificar código**
```typescript
// /supabase/functions/server/emails.tsx

import { Resend } from 'npm:resend@4.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

export async function enviarEmailVIP(params: {
  email: string;
  assunto: string;
  corpo: string;
}) {
  try {
    console.log('📧 Enviando email para:', params.email);
    
    const { data, error } = await resend.emails.send({
      from: 'SysConecta 2026 <onboarding@resend.dev>', // ✅ Domínio teste
      to: params.email,
      subject: params.assunto,
      html: params.corpo,
    });

    if (error) {
      console.error('❌ Erro ao enviar email:', error);
      throw error;
    }

    console.log('✅ Email enviado com sucesso:', data);
    return { success: true, data };
    
  } catch (err) {
    console.error('❌ Erro crítico:', err);
    return { success: false, error: err };
  }
}
```

### **ETAPA 5: Fazer redeploy**
```bash
# Se usar Supabase CLI local:
supabase functions deploy server --no-verify-jwt

# OU fazer um pequeno commit para triggerar deploy automático
```

### **ETAPA 6: Testar**
```
1. Fazer cadastro no sistema
2. Ver logs no Supabase: Edge Functions → server → Logs
3. Ver emails enviados na Resend: https://resend.com/emails
4. Verificar caixa de entrada (e SPAM!)
```

---

## 📊 **STATUS ATUAL DO SISTEMA:**

### **✅ O QUE JÁ FUNCIONA:**
```
✅ Código de envio implementado
✅ Integração com Resend configurada
✅ Templates de email prontos
✅ Modo simulação funcionando
```

### **❓ O QUE PRECISA VERIFICAR:**
```
❓ RESEND_API_KEY existe no Supabase?
❓ Conta da Resend está ativa?
❓ Logs mostram algum erro?
❓ Domínio 'from' está correto?
```

---

## 🔥 **SOLUÇÃO RÁPIDA - 5 MINUTOS:**

### **Se quiser resolver AGORA:**

**1. Criar conta Resend** (2 min)
   → https://resend.com

**2. Pegar API Key** (1 min)
   → Dashboard → API Keys → Create

**3. Adicionar no Supabase** (1 min)
   → Settings → Edge Functions → Secrets
   → Add: RESEND_API_KEY = re_xxxxx

**4. Testar** (1 min)
   → Fazer novo cadastro
   → Ver logs no Supabase

**PRONTO!** ✅

---

## 🧪 **CÓDIGO DE TESTE STANDALONE:**

Se quiser testar o envio isoladamente:

```typescript
// Criar arquivo: /supabase/functions/test-email/index.tsx

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Resend } from 'npm:resend@4.0.0';

serve(async (req) => {
  const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

  try {
    const { data, error } = await resend.emails.send({
      from: 'SysConecta <onboarding@resend.dev>',
      to: 'SEU_EMAIL_AQUI@gmail.com', // ← MUDAR AQUI
      subject: '🧪 Teste de Email - SysConecta',
      html: '<h1>Funciona!</h1><p>Se você recebeu este email, está tudo OK! ✅</p>',
    });

    if (error) {
      return new Response(JSON.stringify({ error }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
```

**Deploy:**
```bash
supabase functions deploy test-email --no-verify-jwt
```

**Testar:**
```
Ir em: https://SEU_PROJETO.supabase.co/functions/v1/test-email
```

---

## 📧 **VERIFICAR LOGS DA RESEND:**

Depois de tentar enviar email, você pode ver o status em:

```
https://resend.com/emails

Lá vai mostrar:
- ✅ Delivered (email chegou)
- ⏳ Pending (processando)
- ❌ Failed (falhou - ver motivo)
```

---

## 🎯 **RESUMO FINAL:**

### **PROBLEMA:**
Emails não estão sendo enviados.

### **CAUSA PROVÁVEL:**
1. ❌ RESEND_API_KEY não configurada no Supabase
2. ❌ Conta Resend não criada
3. ❌ Domínio 'from' incorreto

### **SOLUÇÃO:**
1. ✅ Criar conta na Resend (grátis)
2. ✅ Pegar API Key
3. ✅ Adicionar no Supabase Secrets
4. ✅ Usar 'onboarding@resend.dev' como sender
5. ✅ Fazer redeploy da function
6. ✅ Testar e ver logs

### **TEMPO ESTIMADO:**
**5-10 minutos no máximo!**

---

## 🚨 **SE AINDA NÃO FUNCIONAR:**

### **Verificar logs detalhados:**

**No Supabase:**
```
Edge Functions → server → Logs

Procurar por:
- "Erro ao enviar email"
- "Invalid API key"
- "Missing API key"
- Stack trace de erro
```

**Na Resend:**
```
https://resend.com/emails

Ver status de cada email:
- Se foi enviado
- Se falhou (ver motivo)
- Se foi bloqueado
```

---

## 💡 **ALTERNATIVA TEMPORÁRIA:**

Se quiser testar o sistema SEM emails (só para desenvolvimento):

```typescript
// Modo simulação (já implementado)
export async function enviarEmailVIP(params) {
  console.log('📧 [SIMULAÇÃO] Email que seria enviado:');
  console.log('Para:', params.email);
  console.log('Assunto:', params.assunto);
  console.log('Corpo:', params.corpo);
  
  return { 
    success: true, 
    data: { id: 'simulacao-' + Date.now() } 
  };
}
```

**Vantagem:** Sistema funciona 100% sem precisar de Resend.  
**Desvantagem:** Nenhum email real é enviado.

---

## ✅ **PRÓXIMOS PASSOS:**

### **AGORA:**
1. Me diga se você tem conta na Resend
2. Me diga se a RESEND_API_KEY está no Supabase
3. Vamos verificar os logs juntos

### **DEPOIS:**
1. Configurar domínio próprio (sysconecta.com.br)
2. Criar templates mais bonitos
3. Implementar tracking de abertura
4. Adicionar unsubscribe

---

## 🎉 **VAI FUNCIONAR!**

O sistema está 99% pronto. Só falta configurar a chave da Resend! 

**Me avise:**
- ✅ Tem conta na Resend?
- ✅ Já pegou a API Key?
- ✅ Já adicionou no Supabase?

**E vamos resolver AGORA!** 🚀🔥

---

**#SysConecta2026 #Emails #Resend #Supabase** 📧✨
