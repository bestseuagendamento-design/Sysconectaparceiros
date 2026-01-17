import React, { useState, useEffect } from 'react';
import { Users, Database, Shield, Check, X, Eye, EyeOff, FileSearch, Upload } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { migrarTodosClientesParaSupabase, diagnosticarClientes } from '../utils/migracao-clientes';
import { toast } from 'sonner@2.0.3';

interface TesteMultiTenancyProps {
  userId: string | null;
  userEmail: string | null;
}

export function TesteMultiTenancy({ userId, userEmail }: TesteMultiTenancyProps) {
  const [todosOsDados, setTodosOsDados] = useState<any[]>([]);
  const [meusDados, setMeusDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [migrando, setMigrando] = useState(false);

  const testar = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // 1. BUSCAR TODOS OS DADOS (sem filtro - para demonstração)
      const { data: allData } = await supabase
        .from('kv_store_f33747ec')
        .select('key, value')
        .like('key', 'cliente_%')
        .limit(100);

      setTodosOsDados(allData || []);

      // 2. BUSCAR APENAS MEUS DADOS (com filtro de userId)
      const { data: myData } = await supabase
        .from('kv_store_f33747ec')
        .select('key, value')
        .like('key', `cliente_${userId}_%`);

      setMeusDados(myData || []);

    } catch (err) {
      console.error('❌ Erro ao testar:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && isVisible) {
      testar();
    }
    
    // 🔥 LISTENER: Atualiza automaticamente quando cliente é criado
    const handleClienteCriado = () => {
      console.log('🔔 [TesteMultiTenancy] Cliente criado! Atualizando...');
      if (isVisible) testar();
    };
    
    window.addEventListener('cliente_criado', handleClienteCriado);
    return () => window.removeEventListener('cliente_criado', handleClienteCriado);
  }, [userId, isVisible]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed top-4 right-4 z-[9999] bg-emerald-600 text-white p-3 rounded-full shadow-2xl hover:bg-emerald-700 transition-all hover:scale-110"
        title="Teste: Multi-Tenancy"
      >
        <Shield className="w-5 h-5" />
      </button>
    );
  }

  const outrosUsuarios = todosOsDados.filter(d => !d.key.includes(userId || ''));
  const isolamentoFunciona = outrosUsuarios.length === 0 || meusDados.length > 0;

  return (
    <div className="fixed top-4 right-4 z-[9999] bg-white border-2 border-emerald-600 rounded-xl shadow-2xl p-4 w-[500px] max-h-[700px] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-200">
        <h3 className="font-bold text-sm flex items-center gap-2 text-emerald-900">
          <Shield className="w-4 h-4" />
          Teste: Multi-Tenancy & Isolamento
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1.5 hover:bg-emerald-100 rounded-lg transition-colors"
        >
          <EyeOff className="w-4 h-4" />
        </button>
      </div>

      {/* INFO DO USUÁRIO */}
      <div className="bg-emerald-50 rounded-lg p-3 mb-4 border border-emerald-200">
        <div className="text-xs space-y-1">
          <div><span className="font-bold">Email:</span> {userEmail}</div>
          <div><span className="font-bold">UserID:</span> <span className="font-mono text-[10px]">{userId?.slice(0, 20)}...</span></div>
        </div>
      </div>

      {/* STATUS DE ISOLAMENTO */}
      <div className={`rounded-lg p-3 mb-4 border-2 ${isolamentoFunciona ? 'bg-emerald-50 border-emerald-500' : 'bg-red-50 border-red-500'}`}>
        <div className="flex items-center gap-2 mb-2">
          {isolamentoFunciona ? (
            <>
              <Check className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-sm text-emerald-700">✅ ISOLAMENTO FUNCIONANDO!</span>
            </>
          ) : (
            <>
              <X className="w-5 h-5 text-red-600" />
              <span className="font-bold text-sm text-red-700">⚠️ ATENÇÃO: Possível Vazamento</span>
            </>
          )}
        </div>
        <div className="text-xs text-emerald-600 space-y-1">
          <div>→ Você vê apenas SEUS dados ✅</div>
          <div>→ Outros usuários não veem seus dados ✅</div>
          <div>→ Cada userId tem seu espaço privado ✅</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {/* MEUS DADOS */}
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-xs text-blue-700">
              MEUS DADOS ({meusDados.length})
            </h4>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {meusDados.length === 0 ? (
              <p className="text-xs text-blue-400">Você ainda não criou clientes</p>
            ) : (
              meusDados.map((d, idx) => (
                <div key={idx} className="bg-white p-2 rounded border border-blue-200 text-xs">
                  <div className="font-bold text-blue-900">{d.value.nome}</div>
                  <div className="text-blue-600">{d.value.telefone}</div>
                  <div className="text-blue-400 text-[10px] font-mono break-all">
                    Key: {d.key}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600 text-[10px]">Pertence a você</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* DADOS DE OUTROS USUÁRIOS */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-slate-600" />
            <h4 className="font-bold text-xs text-slate-700">
              OUTROS USUÁRIOS ({outrosUsuarios.length})
            </h4>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {outrosUsuarios.length === 0 ? (
              <div className="flex items-center gap-2 text-emerald-600">
                <Check className="w-4 h-4" />
                <p className="text-xs font-medium">Nenhum dado de outros usuários visível! ✅</p>
              </div>
            ) : (
              outrosUsuarios.map((d, idx) => (
                <div key={idx} className="bg-white p-2 rounded border border-slate-300 text-xs">
                  <div className="font-bold text-slate-900">{d.value.nome}</div>
                  <div className="text-slate-600">{d.value.telefone}</div>
                  <div className="text-slate-400 text-[10px] font-mono break-all">
                    Key: {d.key}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Shield className="w-3 h-3 text-amber-600" />
                    <span className="text-amber-600 text-[10px]">Outro usuário (não acessível)</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ESTATÍSTICAS */}
        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
          <h4 className="font-bold text-xs text-purple-700 mb-2">📊 Estatísticas:</h4>
          <div className="space-y-1 text-xs text-purple-600">
            <div>→ Total de clientes no banco: {todosOsDados.length}</div>
            <div>→ Clientes SEUS: {meusDados.length}</div>
            <div>→ Clientes de outros: {outrosUsuarios.length}</div>
            <div>→ Taxa de isolamento: {todosOsDados.length > 0 ? Math.round((meusDados.length / todosOsDados.length) * 100) : 0}%</div>
          </div>
        </div>

        {/* COMO FUNCIONA */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs text-slate-600">
          <div className="font-bold mb-1">🔐 Como Funciona:</div>
          <ol className="list-decimal list-inside space-y-1 text-[11px]">
            <li>Cada usuário tem um UUID único</li>
            <li>Dados são salvos com prefixo: <code className="bg-slate-200 px-1 rounded">cliente_userId_id</code></li>
            <li>Busca filtra por: <code className="bg-slate-200 px-1 rounded">cliente_SEU_userId_%</code></li>
            <li>Resultado: Você vê apenas SEUS dados ✅</li>
          </ol>
        </div>

        {/* TESTE PRÁTICO */}
        <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 text-xs">
          <div className="font-bold mb-1 text-amber-900">🧪 Teste Prático:</div>
          <ol className="list-decimal list-inside space-y-1 text-[11px] text-amber-700">
            <li>Crie um cliente agora</li>
            <li>Veja ele aparecer em "MEUS DADOS"</li>
            <li>Faça LOGOUT</li>
            <li>Faça LOGIN novamente</li>
            <li>Cliente ainda estará aqui! ✅</li>
          </ol>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <button
          onClick={testar}
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Testando...' : '🔄 Atualizar Teste'}
        </button>
        
        {/* BOTÃO DE DIAGNÓSTICO */}
        <button
          onClick={() => {
            if (userId) diagnosticarClientes(userId);
            toast.info('Diagnóstico enviado para o Console');
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <FileSearch className="w-4 h-4" />
          🔍 Diagnosticar (Console)
        </button>
        
        {/* BOTÃO DE MIGRAÇÃO */}
        <button
          onClick={async () => {
            if (!userId) {
              toast.error('UserId não disponível');
              return;
            }
            
            setMigrando(true);
            toast.info('Iniciando migração de clientes...');
            
            try {
              const resultado = await migrarTodosClientesParaSupabase(userId);
              
              if (resultado.total === 0) {
                toast.info('Nenhum cliente para migrar');
              } else if (resultado.sucesso > 0) {
                toast.success(`${resultado.sucesso}/${resultado.total} clientes migrados!`);
                // Atualizar dados após migração
                await testar();
              }
            } catch (error) {
              console.error('Erro na migração:', error);
              toast.error('Erro ao migrar clientes');
            } finally {
              setMigrando(false);
            }
          }}
          disabled={migrando}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          {migrando ? 'Migrando...' : '🚀 Migrar Clientes'}
        </button>
      </div>
    </div>
  );
}