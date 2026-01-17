# 🌍 Sistema de Internacionalização (i18n) - SysConecta

## 📋 Visão Geral

O SysConecta possui suporte completo para **6 idiomas principais** do mercado global de vidros:

- 🇧🇷 **Português** (Brasil) - Mercado base
- 🇺🇸 **English** (Internacional - Guardian Glass)
- 🇪🇸 **Español** (América Latina)
- 🇫🇷 **Français** (África + Europa)
- 🇩🇪 **Deutsch** (Alemanha - mercado premium)
- 🇮🇹 **Italiano** (Itália - design)

---

## 🚀 Como Usar

### 1. **Wrap seu App com I18nProvider**

```tsx
import { I18nProvider } from './i18n/i18nContext';

export default function App() {
  return (
    <I18nProvider>
      {/* Seu conteúdo aqui */}
    </I18nProvider>
  );
}
```

### 2. **Use o hook useI18n em qualquer componente**

```tsx
import { useI18n } from './i18n/i18nContext';

function MeuComponente() {
  const { t, language, setLanguage } = useI18n();

  return (
    <div>
      <h1>{t('app.name')}</h1>
      <p>{t('app.tagline')}</p>
      
      {/* Trocar idioma */}
      <button onClick={() => setLanguage('en')}>
        English
      </button>
    </div>
  );
}
```

### 3. **Traduções com interpolação**

```tsx
// Tradução: "Mínimo {count} caracteres"
t('errors.minLength', { count: 8 })
// Resultado: "Mínimo 8 caracteres"
```

---

## 📁 Estrutura de Arquivos

```
/i18n/
  ├── translations.ts      # Todas as traduções
  ├── i18nContext.tsx      # Context React + hook useI18n
  └── README.md           # Esta documentação
```

---

## 🔑 Chaves de Tradução Disponíveis

### App Principal
```typescript
t('app.name')           // "SysConecta"
t('app.tagline')        // "Sistema Enterprise de Gestão de Vidros"
t('app.description')    // "Plataforma B2B Enterprise..."
```

### Autenticação (Login)
```typescript
t('auth.login.title')              // "Bem-vindo de volta"
t('auth.login.subtitle')           // "Entre na sua conta..."
t('auth.login.email')              // "E-mail"
t('auth.login.password')           // "Senha"
t('auth.login.rememberMe')         // "Lembrar-me"
t('auth.login.forgotPassword')     // "Esqueceu a senha?"
t('auth.login.loginButton')        // "Entrar"
t('auth.login.loginButtonLoading') // "Entrando..."
t('auth.login.googleLogin')        // "Continuar com Google"
t('auth.login.microsoftLogin')     // "Continuar com Microsoft"
```

### Features
```typescript
t('auth.features.title')      // "Confiado por líderes globais"
t('auth.features.guardian')   // "Powered by Guardian Glass"
t('auth.features.countries')  // "25+ países no mundo"
t('auth.features.feature1')   // "Gestão Completa de Orçamentos"
```

### Erros
```typescript
t('errors.required')      // "Campo obrigatório"
t('errors.invalidEmail')  // "E-mail inválido"
t('errors.minLength', { count: 8 })  // "Mínimo de 8 caracteres"
```

---

## 🎯 Detectar Idioma do Navegador

O sistema **detecta automaticamente** o idioma do navegador:

```typescript
// Ordem de prioridade:
1. localStorage ('sysconecta_language')
2. navigator.language (idioma do navegador)
3. 'pt' (padrão: Português)
```

---

## 🔧 Como Adicionar Novas Traduções

### 1. **Edite `/i18n/translations.ts`**

```typescript
export const translations = {
  pt: {
    // Adicione nova chave aqui
    dashboard: {
      welcome: 'Bem-vindo ao Dashboard',
      stats: 'Estatísticas'
    }
  },
  en: {
    dashboard: {
      welcome: 'Welcome to Dashboard',
      stats: 'Statistics'
    }
  },
  // ... outros idiomas
}
```

### 2. **Use no componente**

```tsx
const { t } = useI18n();

<h1>{t('dashboard.welcome')}</h1>
<p>{t('dashboard.stats')}</p>
```

---

## 🌟 Componente LanguageSelector

Já está pronto e pode ser usado em qualquer lugar:

```tsx
import { LanguageSelector } from './components/auth/LanguageSelector';

function Header() {
  return (
    <header>
      <LanguageSelector />
    </header>
  );
}
```

Funcionalidades:
- ✅ Dropdown elegante com bandeiras
- ✅ Fecha ao clicar fora
- ✅ Animações suaves (Motion)
- ✅ Salva preferência no localStorage
- ✅ Atualiza documento HTML lang attribute

---

## 🚨 IMPORTANTE

### ❌ NÃO FAÇA:
```tsx
// ❌ Texto hardcoded
<h1>Bem-vindo</h1>

// ❌ Idioma fixo
<p>Welcome</p>
```

### ✅ SEMPRE FAÇA:
```tsx
// ✅ Use traduções
<h1>{t('auth.login.title')}</h1>

// ✅ Suporte multi-idioma
<p>{t('app.description')}</p>
```

---

## 🎨 Próximos Passos

Para adicionar mais idiomas no futuro:

1. Adicione em `languages` array:
```typescript
{ code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' }
```

2. Adicione traduções em `translations`:
```typescript
zh: {
  app: { name: 'SysConecta', ... },
  auth: { ... }
}
```

3. Atualize o type `Language`:
```typescript
export type Language = 'pt' | 'en' | 'es' | 'fr' | 'de' | 'it' | 'zh';
```

---

## 📞 Suporte

Para dúvidas sobre internacionalização:
- Documentação: `/i18n/README.md`
- Exemplos: `/components/auth/PremiumLoginScreen.tsx`
- Hook: `useI18n()` em `/i18n/i18nContext.tsx`

---

**Construído para escala global. 🌍**  
**Guardian Glass - 25+ países - SysConecta Enterprise**
