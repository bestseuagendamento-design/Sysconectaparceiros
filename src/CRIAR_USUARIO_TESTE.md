# 🔥 CRIAR USUÁRIO DE TESTE COM DADOS COMPLETOS

## 🎯 OBJETIVO:
Criar um usuário vidraceiro de teste com **TODOS OS DADOS COMPLETOS** para que não apareça mais "Vidraçaria Parceira".

---

## 📝 USANDO A API DO SISTEMA:

### 1. Abra o Console do Navegador (F12)
### 2. Cole e execute este código:

```javascript
// 🔥 CRIAR USUÁRIO VIDRACEIRO DE TESTE
const projectId = 'YOUR_PROJECT_ID'; // Substitua pelo ID do projeto
const publicAnonKey = 'YOUR_PUBLIC_ANON_KEY'; // Substitua pela chave pública

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
  console.log('✅ USUÁRIO CRIADO:', data);
  if (data.success) {
    alert('✅ Usuário criado com sucesso!\n\nEmail: vidraceiro@teste.com\nSenha: 123456');
  } else {
    alert('❌ Erro: ' + data.error);
  }
})
.catch(err => {
  console.error('❌ ERRO:', err);
  alert('❌ Erro ao criar usuário: ' + err.message);
});
```

---

## 🔑 CREDENCIAIS DO USUÁRIO DE TESTE:

- **Email:** `vidraceiro@teste.com`
- **Senha:** `123456`
- **Nome:** João Silva
- **Empresa:** Vidraçaria Silva & Filhos
- **Telefone:** (48) 99999-8888
- **Perfil:** Vidraceiro
- **Estado:** SC

---

## ✅ O QUE ISSO VAI SALVAR NO SUPABASE:

O usuário será criado no **Supabase Auth** com os seguintes `user_metadata`:

```json
{
  "full_name": "João Silva",
  "nome_empresa": "Vidraçaria Silva & Filhos",
  "phone": "(48) 99999-8888",
  "role": "vidraceiro",
  "state": "SC"
}
```

---

## 🔥 APÓS CRIAR O USUÁRIO:

### 1. Faça LOGIN com as credenciais:
- Email: `vidraceiro@teste.com`
- Senha: `123456`

### 2. Clique no botão DEBUG (🔍 DEBUG VIDRACEIRO)

### 3. CONFIRA se agora aparece:
- ✅ **Nome:** João Silva
- ✅ **Nome Fantasia:** Vidraçaria Silva & Filhos
- ✅ **Telefone:** (48) 99999-8888
- ✅ **Estado:** SC

### 4. Crie um PEDIDO e confira:
- ✅ O nome deve aparecer como **"Vidraçaria Silva & Filhos"**
- ✅ NÃO deve aparecer mais "Vidraçaria Parceira"

---

## 🚨 SE O USUÁRIO JÁ EXISTIR:

Se já existe um usuário com o email `vidraceiro@teste.com`, você pode:

1. **Deletar pelo Supabase Dashboard:**
   - Vá em Authentication → Users
   - Encontre o usuário e delete

2. **Ou usar outro email:**
   - Mude o email no script acima para `vidraceiro2@teste.com`

---

## 📊 VERIFICAR NO BANCO:

Após o login, você pode verificar se os dados foram salvos corretamente no localStorage:

1. Abra o **Console do Navegador (F12)**
2. Vá na aba **Application** → **Local Storage**
3. Procure a chave: `sysconecta_usuario_dados`
4. Confira se tem todos os dados:

```json
{
  "id": "uuid-do-usuario",
  "email": "vidraceiro@teste.com",
  "nome": "João Silva",
  "nomeFantasia": "Vidraçaria Silva & Filhos",
  "telefone": "(48) 99999-8888",
  "estado": "SC",
  "role": "vidraceiro"
}
```

---

## ✅ PRONTO!

Agora quando você criar um pedido, o nome **"Vidraçaria Silva & Filhos"** deve aparecer em vez de "Vidraçaria Parceira"! 🎉
