import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, useTranslation } from './translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, values?: Record<string, any>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  // 🌍 Carregar idioma do localStorage ou detectar do navegador
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('sysconecta_language');
    if (saved && ['pt', 'en', 'es', 'fr', 'de', 'it'].includes(saved)) {
      return saved as Language;
    }
    
    // Detectar idioma do navegador
    const browserLang = navigator.language.split('-')[0];
    if (['pt', 'en', 'es', 'fr', 'de', 'it'].includes(browserLang)) {
      return browserLang as Language;
    }
    
    // Padrão: Português
    return 'pt';
  });

  const { t } = useTranslation(language);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sysconecta_language', lang);
    console.log('🌍 Idioma alterado para:', lang);
  };

  useEffect(() => {
    // Atualizar atributo lang no HTML
    document.documentElement.lang = language;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
