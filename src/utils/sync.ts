import { supabase } from './supabase/client';
import { projectId, publicAnonKey } from './supabase/info';
import { toast } from 'sonner@2.0.3';

// Chaves de Prefixo para organização no KV Store
const PREFIX = {
  CLIENTE: 'cliente',
  PEDIDO: 'pedido',
  ORCAMENTO: 'orcamento',
  PRECO: 'preco'
};

/**
 * Salva um item no KV Store do Supabase (Persistência Real)
 */
export async function salvarNoBanco(tipo: 'cliente' | 'pedido' | 'orcamento' | 'preco', id: string, dados: any, userId?: string) {
  console.log('🔥🔥🔥 [SALVANDO] ===================================');
  console.log(`   Tipo: ${tipo}`);
  console.log(`   ID: ${id}`);
  console.log(`   UserID: ${userId}`);
  console.log(`   Dados:`, dados);
  console.log('=================================================');
  
  try {
    // 1. PREÇO (Rota Específica)
    if (tipo === 'preco') {
        const fornecedorId = id;
        console.log(`💾 Salvando preços via API Backend para: ${fornecedorId}`);
        
        const payload = dados.precos ? dados.precos : dados; 
        let precosArray = [];
        if (Array.isArray(payload)) {
            precosArray = payload;
        } else {
            precosArray = Object.entries(payload).map(([key, val]: any) => ({
                id: key,
                ...val
            }));
        }

        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/fornecedor/precos-vidro/${fornecedorId}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${publicAnonKey}`
            },
            body: JSON.stringify({ precos: precosArray })
        });

        if (!response.ok) throw new Error(`Falha na API: ${response.status}`);
        return true;
    }

    // 2. OUTROS (Proxy KV Genérico)
    let key = '';
    
    if (tipo === 'pedido') {
      const fornecedorId = dados.fornecedorId || dados.fornecedor_id;
      if (!fornecedorId) throw new Error('Pedido sem ID de fornecedor');
      key = `${PREFIX.PEDIDO}:${fornecedorId}:${id}`;  // ✅ FORMATO CORRETO COM ':'
    } else if (tipo === 'cliente') {
      if (!userId) throw new Error('Cliente precisa de UserID');
      key = `${PREFIX.CLIENTE}:${userId}:${id}`;  // ✅ FORMATO CORRETO COM ':'
    } else {
      if (!userId) throw new Error('Orçamento precisa de UserID');
      key = `${PREFIX.ORCAMENTO}:${userId}:${id}`;  // ✅ FORMATO CORRETO COM ':'
    }

    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/kv/set`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ 
            key: key, 
            value: { ...dados, _updatedAt: new Date().toISOString() } 
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Proxy Error: ${response.status}`);
    }
    
    return true;

  } catch (err) {
    console.error('❌ Erro ao salvar no banco:', err);
    // Fallback: Tenta salvar no localStorage para não perder
    localStorage.setItem(`BACKUP_${tipo}_${id}`, JSON.stringify(dados));
    return false;
  }
}

/**
 * Busca itens do KV Store (Sincronização)
 * 🔥 ATUALIZADO: Usa rota do servidor para evitar RLS e memory leaks
 */
export async function buscarDoBanco(tipo: 'cliente' | 'pedido' | 'orcamento', filtroId: string) {
  try {
    // 🔥 USA ROTA DO SERVIDOR (Proxy que contorna RLS)
    const url = `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/kv/get-by-prefix?userId=${filtroId}&tipo=${tipo}`;
    
    console.log(`🌐 [buscarDoBanco] Chamando servidor: ${url}`);
    
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` }
    });

    console.log(`📡 [buscarDoBanco] Status da resposta: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`⚠️ Servidor retornou ${response.status}: ${errorText}`);
      return [];
    }

    const result = await response.json();
    
    console.log(`📦 [buscarDoBanco] Resposta do servidor:`, result);
    
    if (result.success && Array.isArray(result.values)) {
      console.log(`✅ [buscarDoBanco] ${result.values.length} ${tipo}(s) encontrado(s)`);
      return result.values;
    }

    return [];

  } catch (err) {
    console.error('❌ Erro ao buscar do banco:', err);
    return [];
  }
}

/**
 * Busca tabela de preços de um fornecedor
 * 🔥 ATUALIZADO: Usa API do Backend para contornar RLS e aproveitar Auto-Seed
 */
export async function buscarPrecos(fornecedorId: string) {
    try {
        console.log(`🌐 Buscando preços via API para: ${fornecedorId}`);
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/tabela-precos/${fornecedorId}`, {
             headers: { 
                'Authorization': `Bearer ${publicAnonKey}`
            }
        });
        
        if (!response.ok) {
            console.warn(`⚠️ API retornou ${response.status}. Tentando busca direta como fallback...`);
            throw new Error(`API Error ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.tabela) {
            console.log(`✅ Preços carregados via API: ${Object.keys(data.tabela).length} itens`);
            return data.tabela;
        }
        
        return {};
    } catch (err) {
        console.error('❌ Erro na API de preços. Tentando via Supabase Client (Fallback)...', err);
        try {
            // 🔥 Chave correta alinhada com GestorPrecosFornecedor e Backend
            const key = `precos-vidro:${fornecedorId}`;
            const { data } = await supabase
                .from('kv_store_f33747ec')
                .select('value')
                .eq('key', key)
                .single();
                
            // O formato salvo no KV tem { precos: ... }, precisamos retornar apenas o mapa 'precos'
            return data?.value?.precos || {};
        } catch (dbErr) {
            console.error('❌ Falha total ao buscar preços:', dbErr);
            return {};
        }
    }
}