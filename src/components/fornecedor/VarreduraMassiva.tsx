import { toast } from 'sonner@2.0.3';

export async function fazerVarreduraMassiva(
  projectId: string,
  publicAnonKey: string,
  fornecedorId: string
) {
  console.log('🚨🚨🚨 ============================================');
  console.log('🚨 INICIANDO VARREDURA MASSIVA NO SISTEMA');
  console.log('🚨🚨🚨 ============================================');

  const resultados: any = {
    timestamp: new Date().toISOString(),
    tentativas: [],
    encontrados: [],
    erros: []
  };

  try {
    // 🔥 TENTATIVA 1: Rota padrão de pedidos
    console.log('🔍 [1/10] Buscando em: /pedidos/fornecedor/' + fornecedorId);
    try {
      const res1 = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos/fornecedor/${fornecedorId}`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      const data1 = await res1.json();
      resultados.tentativas.push({ 
        rota: `/pedidos/fornecedor/${fornecedorId}`, 
        status: res1.status, 
        total: data1.pedidos?.length || 0,
        dados: data1
      });
      if (data1.pedidos?.length > 0) {
        resultados.encontrados.push({ origem: 'pedidos/fornecedor', total: data1.pedidos.length, pedidos: data1.pedidos });
      }
      console.log(`✅ Encontrados: ${data1.pedidos?.length || 0} pedidos`);
    } catch (err: any) {
      console.error('❌ Erro:', err.message);
      resultados.erros.push({ rota: 'pedidos/fornecedor', erro: err.message });
    }

    // 🔥 TENTATIVA 2: Rota de produção
    console.log('🔍 [2/10] Buscando em: /producao/' + fornecedorId);
    try {
      const res2 = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/producao/${fornecedorId}`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      const data2 = await res2.json();
      resultados.tentativas.push({ 
        rota: `/producao/${fornecedorId}`, 
        status: res2.status, 
        total: data2.pedidos?.length || 0,
        dados: data2
      });
      if (data2.pedidos?.length > 0) {
        resultados.encontrados.push({ origem: 'producao', total: data2.pedidos.length, pedidos: data2.pedidos });
      }
      console.log(`✅ Encontrados: ${data2.pedidos?.length || 0} pedidos em produção`);
    } catch (err: any) {
      console.error('❌ Erro:', err.message);
      resultados.erros.push({ rota: 'producao', erro: err.message });
    }

    // 🔥 TENTATIVA 3: Todos os pedidos (sem filtro)
    console.log('🔍 [3/10] Buscando em: /pedidos (TODOS)');
    try {
      const res3 = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      const data3 = await res3.json();
      resultados.tentativas.push({ 
        rota: '/pedidos (todos)', 
        status: res3.status, 
        total: data3.pedidos?.length || 0,
        dados: data3
      });
      if (data3.pedidos?.length > 0) {
        resultados.encontrados.push({ origem: 'pedidos-todos', total: data3.pedidos.length, pedidos: data3.pedidos });
      }
      console.log(`✅ Encontrados: ${data3.pedidos?.length || 0} pedidos totais`);
    } catch (err: any) {
      console.error('❌ Erro:', err.message);
      resultados.erros.push({ rota: 'pedidos-todos', erro: err.message });
    }

    // 🔥 TENTATIVA 4: Orçamentos aprovados
    console.log('🔍 [4/10] Buscando em: /orcamentos (aprovados)');
    try {
      const res4 = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/orcamentos`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      const data4 = await res4.json();
      resultados.tentativas.push({ 
        rota: '/orcamentos', 
        status: res4.status, 
        total: data4.orcamentos?.length || 0,
        dados: data4
      });
      if (data4.orcamentos?.length > 0) {
        resultados.encontrados.push({ origem: 'orcamentos', total: data4.orcamentos.length, orcamentos: data4.orcamentos });
      }
      console.log(`✅ Encontrados: ${data4.orcamentos?.length || 0} orçamentos`);
    } catch (err: any) {
      console.error('❌ Erro:', err.message);
      resultados.erros.push({ rota: 'orcamentos', erro: err.message });
    }

    // 🔥 TENTATIVA 5: Debug - listar TODAS as chaves do banco
    console.log('🔍 [5/10] Buscando em: /debug/keys');
    try {
      const res5 = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/debug/keys`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      const data5 = await res5.json();
      resultados.tentativas.push({ 
        rota: '/debug/keys', 
        status: res5.status, 
        total: data5.keys?.length || 0,
        dados: data5
      });
      if (data5.keys?.length > 0) {
        resultados.encontrados.push({ origem: 'debug-keys', total: data5.keys.length, keys: data5.keys });
      }
      console.log(`✅ Encontradas: ${data5.keys?.length || 0} chaves no banco`);
    } catch (err: any) {
      console.error('❌ Erro:', err.message);
      resultados.erros.push({ rota: 'debug/keys', erro: err.message });
    }

    // 🔥 TENTATIVA 6: Buscar por prefixo "pedido:"
    console.log('🔍 [6/10] Buscando em: /kv/prefix/pedido:');
    try {
      const res6 = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/kv/prefix/pedido:`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      const data6 = await res6.json();
      resultados.tentativas.push({ 
        rota: '/kv/prefix/pedido:', 
        status: res6.status, 
        total: data6.data?.length || 0,
        dados: data6
      });
      if (data6.data?.length > 0) {
        resultados.encontrados.push({ origem: 'kv-pedido', total: data6.data.length, dados: data6.data });
      }
      console.log(`✅ Encontrados: ${data6.data?.length || 0} registros com prefixo "pedido:"`);
    } catch (err: any) {
      console.error('❌ Erro:', err.message);
      resultados.erros.push({ rota: 'kv-pedido', erro: err.message });
    }

    // 🔥 TENTATIVA 7: Buscar por prefixo "orcamento:"
    console.log('🔍 [7/10] Buscando em: /kv/prefix/orcamento:');
    try {
      const res7 = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/kv/prefix/orcamento:`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      const data7 = await res7.json();
      resultados.tentativas.push({ 
        rota: '/kv/prefix/orcamento:', 
        status: res7.status, 
        total: data7.data?.length || 0,
        dados: data7
      });
      if (data7.data?.length > 0) {
        resultados.encontrados.push({ origem: 'kv-orcamento', total: data7.data.length, dados: data7.data });
      }
      console.log(`✅ Encontrados: ${data7.data?.length || 0} registros com prefixo "orcamento:"`);
    } catch (err: any) {
      console.error('❌ Erro:', err.message);
      resultados.erros.push({ rota: 'kv-orcamento', erro: err.message });
    }

    // 🔥 TENTATIVA 8: Buscar diretamente na tabela kv_store
    console.log('🔍 [8/10] Buscando diretamente em: kv_store (tabela)');
    try {
      const res8 = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/kv/all`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      const data8 = await res8.json();
      resultados.tentativas.push({ 
        rota: '/kv/all', 
        status: res8.status, 
        total: data8.data?.length || 0,
        dados: data8
      });
      if (data8.data?.length > 0) {
        resultados.encontrados.push({ origem: 'kv-all', total: data8.data.length, dados: data8.data });
      }
      console.log(`✅ Encontrados: ${data8.data?.length || 0} registros totais no kv_store`);
    } catch (err: any) {
      console.error('❌ Erro:', err.message);
      resultados.erros.push({ rota: 'kv-all', erro: err.message });
    }

    // 🔥 TENTATIVA 9: Buscar pedidos por status "aguardando_aprovacao"
    console.log('🔍 [9/10] Buscando em: /pedidos/status/aguardando_aprovacao');
    try {
      const res9 = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos/status/aguardando_aprovacao`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      const data9 = await res9.json();
      resultados.tentativas.push({ 
        rota: '/pedidos/status/aguardando_aprovacao', 
        status: res9.status, 
        total: data9.pedidos?.length || 0,
        dados: data9
      });
      if (data9.pedidos?.length > 0) {
        resultados.encontrados.push({ origem: 'pedidos-status', total: data9.pedidos.length, pedidos: data9.pedidos });
      }
      console.log(`✅ Encontrados: ${data9.pedidos?.length || 0} pedidos aguardando aprovação`);
    } catch (err: any) {
      console.error('❌ Erro:', err.message);
      resultados.erros.push({ rota: 'pedidos-status', erro: err.message });
    }

    // 🔥 TENTATIVA 10: Buscar na rota de gestão de status
    console.log('🔍 [10/10] Buscando em: /gestao/pedidos');
    try {
      const res10 = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/gestao/pedidos`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      const data10 = await res10.json();
      resultados.tentativas.push({ 
        rota: '/gestao/pedidos', 
        status: res10.status, 
        total: data10.pedidos?.length || 0,
        dados: data10
      });
      if (data10.pedidos?.length > 0) {
        resultados.encontrados.push({ origem: 'gestao-pedidos', total: data10.pedidos.length, pedidos: data10.pedidos });
      }
      console.log(`✅ Encontrados: ${data10.pedidos?.length || 0} pedidos na gestão`);
    } catch (err: any) {
      console.error('❌ Erro:', err.message);
      resultados.erros.push({ rota: 'gestao-pedidos', erro: err.message });
    }

  } catch (error: any) {
    console.error('💥 ERRO FATAL NA VARREDURA:', error);
    resultados.erros.push({ tipo: 'fatal', erro: error.message });
  }

  console.log('🚨🚨🚨 ============================================');
  console.log('🚨 VARREDURA MASSIVA COMPLETA');
  console.log('🚨 Tentativas:', resultados.tentativas.length);
  console.log('🚨 Fontes com dados:', resultados.encontrados.length);
  console.log('🚨 Erros:', resultados.erros.length);
  console.log('🚨🚨🚨 ============================================');
  console.log('📊 RESULTADO COMPLETO:', JSON.stringify(resultados, null, 2));

  toast.success(`🔍 Varredura completa! ${resultados.encontrados.length} fontes com dados encontradas!`);
  
  return resultados;
}
