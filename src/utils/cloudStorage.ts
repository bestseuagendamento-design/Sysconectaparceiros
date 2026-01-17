import { supabase } from './supabase/client';
import { projectId, publicAnonKey } from './supabase/info';

const TABLE_NAME = 'kv_store_f33747ec';

export const cloudStorage = {
  // SALVAR DADOS NA NUVEM (VIA PROXY BACKEND - CONTORNA RLS)
  setItem: async (key: string, value: any) => {
    try {
      // Salva local também para garantir velocidade
      localStorage.setItem(key, JSON.stringify(value));

      // 🔥 USAR PROXY BACKEND (SERVICE_ROLE_KEY - CONTORNA RLS)
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/kv/set`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ 
          key: key, 
          value: value 
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Proxy Error ${response.status}: ${errorText}`);
      }
      
      console.log(`☁️ [Cloud] ${key} salvo com sucesso via Proxy.`);
    } catch (e) {
      console.error(`❌ [Cloud] Erro ao salvar ${key}:`, e);
    }
  },

  // BUSCAR DADOS DA NUVEM
  getItem: async (key: string) => {
    try {
      // 🔥 SEMPRE USAR PROXY BACKEND (mais confiável e contorna RLS)
      console.log(`🔄 [Cloud] Buscando ${key} via Proxy Backend...`);
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/kv/get`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ key }),
        signal: AbortSignal.timeout(10000) // 10 segundos timeout
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.value !== undefined) {
          // Atualiza cache local
          localStorage.setItem(key, JSON.stringify(result.value));
          console.log(`✅ [Cloud] ${key} carregado via Proxy Backend`);
          return result.value;
        }
      }
      
      // Se não encontrou na nuvem, busca no cache local
      console.log(`⚠️ [Cloud] ${key} não encontrado no servidor, usando cache local...`);
      const local = localStorage.getItem(key);
      return local ? JSON.parse(local) : null;
      
    } catch (e: any) {
      const msg = e?.message || '';
      
      if (msg.includes('Failed to fetch') || msg.includes('Network request failed') || msg.includes('AbortError')) {
         console.warn(`⚠️ [Cloud] Offline ou timeout para ${key}. Usando cache local.`);
      } else {
         console.error(`❌ [Cloud] Erro ao buscar ${key}:`, e);
      }
      
      // Fallback seguro para cache local
      const local = localStorage.getItem(key);
      try {
        return local ? JSON.parse(local) : null;
      } catch {
        return null;
      }
    }
  },

  // SINCRONIZAÇÃO EM TEMPO REAL (Polling Simples)
  // Usaremos polling (verificação a cada X segundos) para garantir simplicidade e robustez no teste
  sync: async (key: string, onData: (data: any) => void) => {
    const data = await cloudStorage.getItem(key);
    if (data) onData(data);
  }
};