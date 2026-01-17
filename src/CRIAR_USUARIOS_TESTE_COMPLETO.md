# 🔥 CRIAR USUÁRIOS DE TESTE - VIDRACEIRO E FORNECEDOR

## 🎯 OBJETIVO:
Criar usuários de teste com **TODOS OS DADOS COMPLETOS** para testar o sistema sem "Vidraçaria Parceira".

---

## 📝 MÉTODO 1: USANDO O CONSOLE DO NAVEGADOR

### 1️⃣ CRIAR USUÁRIO VIDRACEIRO

Abra o **Console do Navegador (F12)** e cole este código:

```javascript
const projectId = 'lfajgkrlkxdxrcydednu'; // Substitua pelo seu Project ID
const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmYWpna3Jsa3hkeHJjeWRlZG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3OTk5NTMsImV4cCI6MjA1MjM3NTk1M30.1d5KBtqLbDqX5lqLOdMNbO3p_njTlP9M3xL5Z-Tsp4M'; // Substitua pela sua chave

fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/auth/signup`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`
  },
  body: JSON.stringify({
    email: 'vidraceiro@teste.com',
    password: '123456',
    nome: 'João Silva',
    empresa: 'Vidraçaria Silva & Filhos',
    telefone: '(48) 99999-8888',
    role: 'vidraceiro',
    estado: 'SC'
  })
})
.then(res => res.json())
.then(data => {
  console.log('✅ VIDRACEIRO CRIADO:', data);
  alert(data.success ? '✅ Vidraceiro criado!' : '❌ Erro: ' + data.error);
});
```

---

### 2️⃣ CRIAR USUÁRIO FORNECEDOR

```javascript
const projectId = 'lfajgkrlkxdxrcydednu'; // Substitua pelo seu Project ID
const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmYWpna3Jsa3hkeHJjeWRlZG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3OTk5NTMsImV4cCI6MjA1MjM3NTk1M30.1d5KBtqLbDqX5lqLOdMNbO3p_njTlP9M3xL5Z-Tsp4M'; // Substitua pela sua chave

fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/auth/signup`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`
  },
  body: JSON.stringify({
    email: 'fornecedor@teste.com',
    password: '123456',
    nome: 'Carlos Santos',
    empresa: 'Santa Rita Vidros SC',
    telefone: '(48) 98888-7777',
    role: 'fornecedor',
    estado: 'SC'
  })
})
.then(res => res.json())
.then(data => {
  console.log('✅ FORNECEDOR CRIADO:', data);
  alert(data.success ? '✅ Fornecedor criado!' : '❌ Erro: ' + data.error);
});
```

---

## 📋 CREDENCIAIS DOS USUÁRIOS DE TESTE

### 👤 VIDRACEIRO
- **Email:** `vidraceiro@teste.com`
- **Senha:** `123456`
- **Nome:** João Silva
- **Empresa:** Vidraçaria Silva & Filhos
- **Telefone:** (48) 99999-8888
- **Perfil:** Vidraceiro
- **Estado:** SC

### 🏭 FORNECEDOR
- **Email:** `fornecedor@teste.com`
- **Senha:** `123456`
- **Nome:** Carlos Santos
- **Empresa:** Santa Rita Vidros SC
- **Telefone:** (48) 98888-7777
- **Perfil:** Fornecedor
- **Estado:** SC

---

## ✅ COMO TESTAR APÓS CRIAR OS USUÁRIOS

### 🔍 TESTE 1: LOGIN VIDRACEIRO

1. **Faça LOGIN** com `vidraceiro@teste.com` / `123456`
2. **Veja o BOTÃO LARANJA** no canto inferior direito: **"🔍 DEBUG VIDRACEIRO"**
3. **Clique nele** e confira:
   - ✅ Nome: **João Silva**
   - ✅ Nome Fantasia: **Vidraçaria Silva & Filhos**
   - ✅ Telefone: **(48) 99999-8888**
   - ✅ Estado: **SC**
4. **Crie um PEDIDO** e confira se aparece o nome correto (não deve aparecer "Vidraçaria Parceira")

---

### 🔍 TESTE 2: LOGIN FORNECEDOR

1. **Faça LOGOUT** e depois LOGIN com `fornecedor@teste.com` / `123456`
2. **Veja o BOTÃO ROXO** no canto inferior direito: **"🔍 DEBUG FORNECEDOR"**
3. **Clique nele** e confira:
   - ✅ Nome: **Carlos Santos**
   - ✅ Nome Fantasia: **Santa Rita Vidros SC**
   - ✅ Telefone: **(48) 98888-7777**
   - ✅ Estado: **SC**
4. **Veja os PEDIDOS recebidos** e confira se os nomes dos vidraceiros aparecem corretamente

---

## 🚨 SE O USUÁRIO JÁ EXISTIR

Se já existe um usuário com o email, você pode:

### OPÇÃO 1: Deletar pelo Supabase Dashboard
1. Vá em **Authentication → Users**
2. Encontre o usuário e delete
3. Execute o script novamente

### OPÇÃO 2: Usar outro email
Mude o email no script:
- `vidraceiro2@teste.com`
- `fornecedor2@teste.com`

---

## 📊 VERIFICAR NO LOCALSTORAGE

Após o login, você pode verificar se os dados foram salvos:

1. **F12** → **Application** → **Local Storage**
2. Procure a chave: **`sysconecta_usuario_dados`**
3. Confira se tem todos os dados:

```json
{
  "id": "uuid-do-usuario",
  "email": "vidraceiro@teste.com",
  "nome": "João Silva",
  "nomeFantasia": "Vidraçaria Silva & Filhos",
  "telefone": "(48) 99999-8888",
  "cidade": "",
  "estado": "SC",
  "role": "vidraceiro"
}
```

---

## 🎯 MÉTOD 2: USAR A INTERFACE DO SISTEMA

Você também pode criar os usuários pela **tela de CADASTRO** do sistema:

1. Click em **"Criar Conta"**
2. Preencha todos os campos
3. Click em **"Cadastrar"**
4. O sistema vai criar E já fazer login automático

---

## ✅ RESULTADO ESPERADO

### ANTES (❌ PROBLEMA):
- Pedidos apareciam como **"Vidraçaria Parceira"**
- localStorage vazio: `sysconecta_usuario_dados: null`

### DEPOIS (✅ CORRIGIDO):
- Pedidos aparecem com o **NOME REAL da empresa**
- localStorage preenchido com **TODOS OS DADOS**
- Debug mostra **TUDO VERDE** ✅

---

## 🔥 PRONTO!

Agora teste criando um pedido e veja se o nome aparece corretamente! 🎉
