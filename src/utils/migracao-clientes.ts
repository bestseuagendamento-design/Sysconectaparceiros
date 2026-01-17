import { supabase } from './supabase/client';
import { projectId, publicAnonKey } from './supabase/info';
import { toast } from 'sonner@2.0.3';

/**
 * 🔥 MIGRAÇÃO EMERGENCIAL: Consolida TODOS os clientes para o Supabase
 * 
 * Busca clientes em:
 * 1. localStorage antigo (sysconecta_clientes_fornecedor)
 * 2. localStorage de backup (BACKUP_cliente_*)
 * 3. Qualquer outro formato legado
 * 
 * E salva TUDO no Supabase com isolamento correto por userId
 */
export async function migrarTodosClientesParaSupabase(userId: string): Promise<{ sucesso: number; falhas: number; total: number }> {
  console.log('🚀 [MIGRAÇÃO] Iniciando migração de clientes para Supabase...');
  
  const clientesParaMigrar: any[] = [];
  let sucesso = 0;
  let falhas = 0;
  
  try {
    // 1. BUSCAR DO LOCALSTORAGE ANTIGO (Fornecedor)
    const clientesFornecedor = localStorage.getItem('sysconecta_clientes_fornecedor');
    if (clientesFornecedor) {
      try {
        const parsed = JSON.parse(clientesFornecedor);
        if (Array.isArray(parsed)) {
          console.log(`📦 [MIGRAÇÃO] Encontrados ${parsed.length} clientes em sysconecta_clientes_fornecedor`);
          clientesParaMigrar.push(...parsed);
        }
      } catch (e) {
        console.error('❌ [MIGRAÇÃO] Erro ao parsear clientes fornecedor:', e);
      }
    }
    
    // 2. BUSCAR BACKUPS DO LOCALSTORAGE
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('BACKUP_cliente_')) {
        try {
          const backup = localStorage.getItem(key);
          if (backup) {
            const parsed = JSON.parse(backup);
            console.log(`📦 [MIGRAÇÃO] Encontrado backup: ${key}`);
            clientesParaMigrar.push(parsed);
          }
        } catch (e) {
          console.error(`❌ [MIGRAÇÃO] Erro ao parsear backup ${key}:`, e);
        }
      }
    }
    
    // 3. BUSCAR CLIENTES QUE JÁ ESTÃO NO SUPABASE (para evitar duplicação)
    let clientesExistentes: Set<string> = new Set();
    try {
      const searchKey = `cliente_${userId}_%`;
      const { data } = await supabase
        .from('kv_store_f33747ec')
        .select('key, value')
        .like('key', searchKey);
      
      if (data) {
        data.forEach(item => {
          if (item.value?.id) {
            clientesExistentes.add(item.value.id);
          }
        });
        console.log(`✅ [MIGRAÇÃO] ${clientesExistentes.size} clientes já existem no Supabase`);
      }
    } catch (e) {
      console.error('❌ [MIGRAÇÃO] Erro ao buscar clientes existentes:', e);
    }
    
    // 4. REMOVER DUPLICATAS da lista de migração
    const clientesUnicos = clientesParaMigrar.filter((cliente, index, self) => {
      // Remove duplicatas por ID
      const isDuplicado = self.findIndex(c => c.id === cliente.id) !== index;
      const jaExiste = clientesExistentes.has(cliente.id);
      
      if (isDuplicado) {
        console.log(`⚠️ [MIGRAÇÃO] Cliente duplicado ignorado: ${cliente.nome} (${cliente.id})`);
        return false;
      }
      
      if (jaExiste) {
        console.log(`⚠️ [MIGRAÇÃO] Cliente já existe no Supabase: ${cliente.nome} (${cliente.id})`);
        return false;
      }
      
      return true;
    });
    
    console.log(`📊 [MIGRAÇÃO] Total para migrar: ${clientesUnicos.length} clientes únicos`);
    
    // 5. SALVAR CADA CLIENTE NO SUPABASE
    for (const cliente of clientesUnicos) {
      try {
        // Garantir formato correto
        const clienteFormatado = {
          ...cliente,
          id: cliente.id || `cli-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          usuario_id: userId,
          createdAt: cliente.createdAt || new Date().toISOString(),
          _updatedAt: new Date().toISOString()
        };
        
        const key = `cliente_${userId}_${clienteFormatado.id}`;
        
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/kv/set`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`
            },
            body: JSON.stringify({ key, value: clienteFormatado })
          }
        );
        
        if (response.ok) {
          console.log(`✅ [MIGRAÇÃO] Cliente migrado: ${clienteFormatado.nome}`);
          sucesso++;
          
          // Limpar backup se existir
          const backupKey = `BACKUP_cliente_${clienteFormatado.id}`;
          if (localStorage.getItem(backupKey)) {
            localStorage.removeItem(backupKey);
            console.log(`🗑️ [MIGRAÇÃO] Backup removido: ${backupKey}`);
          }
        } else {
          console.error(`❌ [MIGRAÇÃO] Falha ao migrar: ${clienteFormatado.nome}`);
          falhas++;
        }
      } catch (error) {
        console.error(`❌ [MIGRAÇÃO] Erro ao migrar cliente:`, error);
        falhas++;
      }
    }
    
    const total = clientesUnicos.length;
    
    console.log(`📊 [MIGRAÇÃO] RESULTADO FINAL:`);
    console.log(`   ✅ Sucesso: ${sucesso}`);
    console.log(`   ❌ Falhas: ${falhas}`);
    console.log(`   📦 Total: ${total}`);
    
    if (sucesso > 0) {
      toast.success(`${sucesso} cliente(s) migrado(s) com sucesso!`);
    }
    
    if (falhas > 0) {
      toast.error(`${falhas} cliente(s) falharam na migração`);
    }
    
    return { sucesso, falhas, total };
    
  } catch (error) {
    console.error('❌ [MIGRAÇÃO] Erro geral na migração:', error);
    return { sucesso, falhas, total: 0 };
  }
}

/**
 * 🔍 DIAGNÓSTICO: Lista todos os clientes em todos os lugares
 */
export function diagnosticarClientes(userId: string) {
  console.log('🔍 ==================== DIAGNÓSTICO DE CLIENTES ====================');
  
  // 1. LocalStorage Fornecedor
  const clientesFornecedor = localStorage.getItem('sysconecta_clientes_fornecedor');
  if (clientesFornecedor) {
    try {
      const parsed = JSON.parse(clientesFornecedor);
      console.log(`📦 localStorage (sysconecta_clientes_fornecedor): ${Array.isArray(parsed) ? parsed.length : 0} clientes`);
      if (Array.isArray(parsed)) {
        parsed.forEach((c, i) => console.log(`   ${i+1}. ${c.nome} (${c.id})`));
      }
    } catch (e) {
      console.error('❌ Erro ao ler clientes fornecedor');
    }
  } else {
    console.log('📦 localStorage (sysconecta_clientes_fornecedor): 0 clientes');
  }
  
  // 2. Backups
  const backups: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('BACKUP_cliente_')) {
      backups.push(key);
    }
  }
  console.log(`💾 Backups encontrados: ${backups.length}`);
  backups.forEach(b => console.log(`   - ${b}`));
  
  // 3. Buscar no Supabase (assíncrono)
  supabase
    .from('kv_store_f33747ec')
    .select('key, value')
    .like('key', `cliente_${userId}_%`)
    .then(({ data }) => {
      console.log(`☁️ Supabase (cliente_${userId}_*): ${data?.length || 0} clientes`);
      if (data) {
        data.forEach((item, i) => {
          console.log(`   ${i+1}. ${item.value?.nome} (${item.value?.id}) - Key: ${item.key}`);
        });
      }
      console.log('🔍 ================================================================');
    });
}
