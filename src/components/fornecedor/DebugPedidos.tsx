import React, { useState, useEffect } from 'react';
import { RefreshCw, Database, Cloud, HardDrive, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { cloudStorage } from '../../utils/cloudStorage';
import { motion, AnimatePresence } from 'motion/react';

export function DebugPedidos() {
  const [pedidosLocal, setPedidosLocal] = useState<any[]>([]);
  const [pedidosNuvem, setPedidosNuvem] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string>('Nunca');
  const [isOpen, setIsOpen] = useState(false); // ✅ Estado para toggle

  const carregar = async () => {
    setLoading(true);
    try {
      // 1. LOCALSTORAGE
      const local = localStorage.getItem('sysconecta_pedidos_fornecedor');
      setPedidosLocal(local ? JSON.parse(local) : []);

      // 2. NUVEM (SUPABASE)
      const nuvem = await cloudStorage.getItem('sysconecta_pedidos_fornecedor');
      setPedidosNuvem(nuvem || []);

      setLastSync(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Erro ao carregar:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
    const interval = setInterval(carregar, 5000);
    return () => clearInterval(interval);
  }, []);

  const sincronizar = async () => {
    try {
      setLoading(true);
      await cloudStorage.setItem('sysconecta_pedidos_fornecedor', pedidosLocal);
      await carregar();
      alert('✅ Sincronizado!');
    } catch (err) {
      alert('❌ Erro: ' + err);
    } finally {
      setLoading(false);
    }
  };

  const isSynced = pedidosLocal.length === pedidosNuvem.length;

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {/* HEADER (SEMPRE VISÍVEL - TOGGLE) */}
      <motion.div 
        className="bg-white border-2 border-slate-900 rounded-xl shadow-2xl overflow-hidden"
        initial={false}
        animate={{ width: isOpen ? '384px' : 'auto' }}
      >
        {/* BOTÃO TOGGLE */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-700" />
            <span className="font-bold text-sm text-slate-900">
              Debug Pedidos
            </span>
            {!isOpen && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                isSynced 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {pedidosNuvem.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isOpen && (
              <div className={`w-2 h-2 rounded-full ${
                isSynced ? 'bg-emerald-500' : 'bg-red-500'
              } animate-pulse`} />
            )}
            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-600" />
            )}
          </div>
        </button>

        {/* CONTEÚDO EXPANSÍVEL */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border-t-2 border-slate-200 p-4 max-h-[500px] overflow-y-auto">
                {/* AÇÕES */}
                <div className="text-xs text-slate-500 mb-3 flex items-center justify-between">
                  <span>Última atualização: {lastSync}</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={sincronizar}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Forçar Sync
                    </button>
                    <button 
                      onClick={carregar}
                      disabled={loading}
                      className="p-1 hover:bg-slate-100 rounded transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* LOCALSTORAGE */}
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                      <HardDrive className="w-4 h-4 text-slate-600" />
                      <h4 className="font-bold text-xs text-slate-700">
                        localStorage ({pedidosLocal.length})
                      </h4>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {pedidosLocal.length === 0 ? (
                        <p className="text-xs text-slate-400">Vazio</p>
                      ) : (
                        pedidosLocal.map((p, idx) => (
                          <div key={idx} className="bg-white p-2 rounded border border-slate-200 text-xs">
                            <div className="font-bold text-slate-900">#{p.id?.slice(0, 8)}</div>
                            <div className="text-slate-600">{p.vidraceiro_nome || p.cliente_nome}</div>
                            <div className="text-slate-500">R$ {p.valor_total?.toFixed(2)}</div>
                            <div className={`text-xs font-medium ${
                              p.status === 'aguardando_aprovacao' || p.status === 'pendente'
                                ? 'text-amber-600' 
                                : 'text-emerald-600'
                            }`}>
                              {p.status}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* NUVEM */}
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Cloud className="w-4 h-4 text-blue-600" />
                      <h4 className="font-bold text-xs text-blue-700">
                        Supabase Cloud ({pedidosNuvem.length})
                      </h4>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {pedidosNuvem.length === 0 ? (
                        <p className="text-xs text-blue-400">Vazio</p>
                      ) : (
                        pedidosNuvem.map((p, idx) => (
                          <div key={idx} className="bg-white p-2 rounded border border-blue-200 text-xs">
                            <div className="font-bold text-slate-900">#{p.id?.slice(0, 8)}</div>
                            <div className="text-slate-600">{p.vidraceiro_nome || p.cliente_nome}</div>
                            <div className="text-slate-500">R$ {p.valor_total?.toFixed(2)}</div>
                            <div className={`text-xs font-medium ${
                              p.status === 'aguardando_aprovacao' || p.status === 'pendente'
                                ? 'text-amber-600' 
                                : 'text-emerald-600'
                            }`}>
                              {p.status}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* STATUS DE SINCRONIA */}
                  <div className="bg-slate-100 rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center gap-2">
                      {isSynced ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-medium text-emerald-700">
                            Sincronizado
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span className="text-xs font-medium text-red-700">
                            Dessincronizado ({Math.abs(pedidosLocal.length - pedidosNuvem.length)} diff)
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
