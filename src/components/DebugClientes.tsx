import React, { useState, useEffect } from 'react';
import { Users, Database, Cloud, RefreshCw, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../utils/supabase/client';

interface DebugClientesProps {
  userId: string | null;
  clientes: any[];
}

export function DebugClientes({ userId, clientes }: DebugClientesProps) {
  const [clientesNuvem, setClientesNuvem] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string>('Nunca');
  const [isVisible, setIsVisible] = useState(false);

  const carregar = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // Buscar da nuvem
      const searchKey = `cliente_${userId}_%`;
      const { data, error } = await supabase
        .from('kv_store_f33747ec')
        .select('key, value')
        .like('key', searchKey);

      if (error) throw error;

      setClientesNuvem(data?.map(d => d.value) || []);
      setLastSync(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('❌ Erro ao carregar clientes da nuvem:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && isVisible) {
      carregar();
      const interval = setInterval(carregar, 10000); // A cada 10s
      
      // 🔥 LISTENER: Atualiza automaticamente quando cliente é criado
      const handleClienteCriado = () => {
        console.log('🔔 [DebugClientes] Cliente criado! Atualizando...');
        carregar();
      };
      
      window.addEventListener('cliente_criado', handleClienteCriado);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener('cliente_criado', handleClienteCriado);
      };
    }
  }, [userId, isVisible]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 z-[9999] bg-purple-600 text-white p-3 rounded-full shadow-2xl hover:bg-purple-700 transition-all hover:scale-110"
        title="Debug: Clientes"
      >
        <Users className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-white border-2 border-purple-600 rounded-xl shadow-2xl p-4 w-96 max-h-[600px] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-purple-200">
        <h3 className="font-bold text-sm flex items-center gap-2 text-purple-900">
          <Users className="w-4 h-4" />
          Debug: Clientes
        </h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={carregar}
            disabled={loading}
            className="p-1.5 hover:bg-purple-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1.5 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <EyeOff className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="text-xs text-purple-500 mb-3">
        <div>UserID: <span className="font-mono font-bold">{userId?.slice(0, 8)}...</span></div>
        <div>Última atualização: {lastSync}</div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {/* ESTADO LOCAL (APP.TSX) */}
        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-purple-600" />
            <h4 className="font-bold text-xs text-purple-700">
              Estado Local ({clientes.length})
            </h4>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {clientes.length === 0 ? (
              <p className="text-xs text-purple-400">Nenhum cliente carregado</p>
            ) : (
              clientes.map((c, idx) => (
                <div key={idx} className="bg-white p-2 rounded border border-purple-200 text-xs">
                  <div className="font-bold text-purple-900">{c.nome}</div>
                  <div className="text-purple-600">{c.telefone}</div>
                  <div className="text-purple-500 text-[10px]">{c.perfil}</div>
                  <div className="text-purple-400 text-[10px] font-mono">ID: {c.id?.slice(0, 12)}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* NUVEM (SUPABASE KV) */}
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Cloud className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-xs text-blue-700">
              Supabase KV ({clientesNuvem.length})
            </h4>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {clientesNuvem.length === 0 ? (
              <p className="text-xs text-blue-400">Nenhum cliente na nuvem</p>
            ) : (
              clientesNuvem.map((c, idx) => (
                <div key={idx} className="bg-white p-2 rounded border border-blue-200 text-xs">
                  <div className="font-bold text-blue-900">{c.nome}</div>
                  <div className="text-blue-600">{c.telefone}</div>
                  <div className="text-blue-500 text-[10px]">{c.perfil}</div>
                  <div className="text-blue-400 text-[10px] font-mono">ID: {c.id?.slice(0, 12)}</div>
                  {c._updatedAt && (
                    <div className="text-blue-400 text-[10px]">
                      Atualizado: {new Date(c._updatedAt).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* STATUS DE SINCRONIA */}
        <div className="bg-slate-100 rounded-lg p-3 border border-slate-200">
          <div className="flex items-center gap-2">
            {clientes.length === clientesNuvem.length ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700">
                  Sincronizado ({clientes.length} clientes)
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-medium text-amber-700">
                  Aguardando sync ({Math.abs(clientes.length - clientesNuvem.length)} pendente)
                </span>
              </>
            )}
          </div>
        </div>

        {/* INSTRUÇÕES */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs text-slate-600">
          <div className="font-bold mb-1">🧪 Como Testar:</div>
          <ol className="list-decimal list-inside space-y-1 text-[11px]">
            <li>Crie um cliente em "Novo Orçamento"</li>
            <li>Aguarde 2s (auto-save)</li>
            <li>Faça LOGOUT e LOGIN</li>
            <li>Cliente deve aparecer em ambos</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
