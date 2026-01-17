import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bug, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Database,
  HardDrive,
  RefreshCw,
  Eye,
  FileText,
  Activity
} from 'lucide-react';

interface LogSalvamento {
  id: string;
  timestamp: string;
  tipo: 'PEDIDO' | 'CLIENTE' | 'ORCAMENTO' | 'ESTOQUE' | 'TABELA_PRECOS' | 'OUTRO';
  acao: 'CRIAR' | 'ATUALIZAR' | 'DELETAR' | 'LER';
  destino: 'SUPABASE' | 'LOCALSTORAGE' | 'MEMORIA';
  status: 'SUCESSO' | 'ERRO' | 'PENDENTE';
  dados: any;
  erro?: string;
  rota?: string;
  tamanho?: string;
}

export function DebugSalvamento() {
  const [aberto, setAberto] = useState(false);
  const [logs, setLogs] = useState<LogSalvamento[]>([]);
  const [estatisticas, setEstatisticas] = useState({
    totalSalvamentos: 0,
    sucessos: 0,
    erros: 0,
    supabase: 0,
    localStorage: 0,
    memoria: 0
  });

  // 🔥 INTERCEPTAR FETCH PARA CAPTURAR SALVAMENTOS
  useEffect(() => {
    console.log('🔥🔥🔥 [DEBUG SALVAMENTO] COMPONENTE ATIVADO - Interceptando TODAS as chamadas!');
    
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const [url, options] = args;
      const urlString = typeof url === 'string' ? url : url.toString();
      const method = options?.method || 'GET';
      
      // Só loggar chamadas ao nosso backend
      if (urlString.includes('make-server-f33747ec')) {
        const logId = Date.now().toString();
        const timestamp = new Date().toISOString();
        
        // Determinar tipo e ação
        let tipo: LogSalvamento['tipo'] = 'OUTRO';
        let acao: LogSalvamento['acao'] = 'LER';
        
        if (urlString.includes('pedidos')) tipo = 'PEDIDO';
        else if (urlString.includes('clientes')) tipo = 'CLIENTE';
        else if (urlString.includes('orcamento')) tipo = 'ORCAMENTO';
        else if (urlString.includes('estoque')) tipo = 'ESTOQUE';
        else if (urlString.includes('tabela-precos')) tipo = 'TABELA_PRECOS';
        
        if (method === 'POST') acao = 'CRIAR';
        else if (method === 'PUT' || method === 'PATCH') acao = 'ATUALIZAR';
        else if (method === 'DELETE') acao = 'DELETAR';
        else acao = 'LER';
        
        // Log inicial (PENDENTE)
        const logPendente: LogSalvamento = {
          id: logId,
          timestamp,
          tipo,
          acao,
          destino: 'SUPABASE',
          status: 'PENDENTE',
          rota: urlString.split('make-server-f33747ec')[1],
          dados: options?.body ? JSON.parse(options.body as string) : null
        };
        
        console.log(`🔄 [DEBUG] ${acao} ${tipo} -> SUPABASE`, logPendente);
        setLogs(prev => [logPendente, ...prev].slice(0, 100));
        
        try {
          const response = await originalFetch(...args);
          const clonedResponse = response.clone();
          
          let responseData;
          try {
            responseData = await clonedResponse.json();
          } catch {
            responseData = await clonedResponse.text();
          }
          
          // Log de sucesso ou erro
          const logFinal: LogSalvamento = {
            ...logPendente,
            status: response.ok ? 'SUCESSO' : 'ERRO',
            erro: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`,
            tamanho: JSON.stringify(responseData).length + ' bytes'
          };
          
          if (response.ok) {
            console.log(`✅ [DEBUG] ${acao} ${tipo} -> SUCESSO!`, logFinal);
          } else {
            console.error(`❌ [DEBUG] ${acao} ${tipo} -> ERRO!`, logFinal);
          }
          
          setLogs(prev => prev.map(l => l.id === logId ? logFinal : l));
          
          // Atualizar estatísticas
          setEstatisticas(prev => ({
            totalSalvamentos: prev.totalSalvamentos + 1,
            sucessos: prev.sucessos + (response.ok ? 1 : 0),
            erros: prev.erros + (response.ok ? 0 : 1),
            supabase: prev.supabase + 1,
            localStorage: prev.localStorage,
            memoria: prev.memoria
          }));
          
          return response;
        } catch (error) {
          const logErro: LogSalvamento = {
            ...logPendente,
            status: 'ERRO',
            erro: error instanceof Error ? error.message : 'Erro desconhecido'
          };
          
          console.error(`❌ [DEBUG] ${acao} ${tipo} -> ERRO DE REDE!`, error);
          setLogs(prev => prev.map(l => l.id === logId ? logErro : l));
          
          setEstatisticas(prev => ({
            ...prev,
            totalSalvamentos: prev.totalSalvamentos + 1,
            erros: prev.erros + 1,
            supabase: prev.supabase + 1
          }));
          
          throw error;
        }
      }
      
      return originalFetch(...args);
    };
    
    // Interceptar localStorage
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key: string, value: string) {
      console.log(`💾 [DEBUG] SALVANDO NO LOCALSTORAGE:`, key, value.substring(0, 100));
      
      const log: LogSalvamento = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        tipo: 'OUTRO',
        acao: 'CRIAR',
        destino: 'LOCALSTORAGE',
        status: 'SUCESSO',
        rota: key,
        dados: value.substring(0, 200),
        tamanho: value.length + ' chars'
      };
      
      setLogs(prev => [log, ...prev].slice(0, 100));
      setEstatisticas(prev => ({
        ...prev,
        totalSalvamentos: prev.totalSalvamentos + 1,
        sucessos: prev.sucessos + 1,
        localStorage: prev.localStorage + 1
      }));
      
      return originalSetItem.call(this, key, value);
    };
    
    return () => {
      window.fetch = originalFetch;
      localStorage.setItem = originalSetItem;
    };
  }, []);

  const limparLogs = () => {
    setLogs([]);
    setEstatisticas({
      totalSalvamentos: 0,
      sucessos: 0,
      erros: 0,
      supabase: 0,
      localStorage: 0,
      memoria: 0
    });
  };

  return (
    <>
      {/* BOTÃO FLUTUANTE */}
      <motion.button
        onClick={() => setAberto(!aberto)}
        className="fixed bottom-20 right-6 z-[1000] bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold text-sm"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bug className="w-5 h-5" />
        <span className="hidden md:inline">Debug Salvamento</span>
        {estatisticas.erros > 0 && (
          <span className="bg-white text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {estatisticas.erros}
          </span>
        )}
      </motion.button>

      {/* MODAL */}
      <AnimatePresence>
        {aberto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1001] flex items-center justify-center p-4"
            onClick={() => setAberto(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* HEADER */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bug className="w-8 h-8" />
                    <div>
                      <h2 className="text-2xl font-bold">Debug de Salvamento</h2>
                      <p className="text-white/80 text-sm">Rastreando TODAS as operações de gravação</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAberto(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* ESTATÍSTICAS */}
              <div className="bg-slate-50 border-b border-slate-200 p-4">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div className="bg-white rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-slate-600 font-medium">Total</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{estatisticas.totalSalvamentos}</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-slate-600 font-medium">Sucessos</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{estatisticas.sucessos}</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 border border-red-200">
                    <div className="flex items-center gap-2 mb-1">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-xs text-slate-600 font-medium">Erros</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">{estatisticas.erros}</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Database className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-slate-600 font-medium">Supabase</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{estatisticas.supabase}</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 border border-amber-200">
                    <div className="flex items-center gap-2 mb-1">
                      <HardDrive className="w-4 h-4 text-amber-600" />
                      <span className="text-xs text-slate-600 font-medium">localStorage</span>
                    </div>
                    <div className="text-2xl font-bold text-amber-600">{estatisticas.localStorage}</div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <button
                      onClick={limparLogs}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg font-bold text-sm flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Limpar
                    </button>
                  </div>
                </div>
              </div>

              {/* LOGS */}
              <div className="flex-1 overflow-y-auto p-4">
                {logs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <Activity className="w-16 h-16 mb-4 opacity-20" />
                    <p className="font-medium">Nenhuma operação detectada ainda</p>
                    <p className="text-sm mt-2">Faça uma ação no sistema para ver os logs aparecerem aqui</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {logs.map((log) => (
                      <div
                        key={log.id}
                        className={`border rounded-lg p-4 ${
                          log.status === 'SUCESSO' ? 'bg-green-50 border-green-200' :
                          log.status === 'ERRO' ? 'bg-red-50 border-red-200' :
                          'bg-amber-50 border-amber-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* ÍCONE DE STATUS */}
                          <div className="mt-1">
                            {log.status === 'SUCESSO' && <CheckCircle className="w-5 h-5 text-green-600" />}
                            {log.status === 'ERRO' && <XCircle className="w-5 h-5 text-red-600" />}
                            {log.status === 'PENDENTE' && <RefreshCw className="w-5 h-5 text-amber-600 animate-spin" />}
                          </div>
                          
                          {/* DETALHES */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                log.acao === 'CRIAR' ? 'bg-blue-100 text-blue-700' :
                                log.acao === 'ATUALIZAR' ? 'bg-amber-100 text-amber-700' :
                                log.acao === 'DELETAR' ? 'bg-red-100 text-red-700' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {log.acao}
                              </span>
                              
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-bold">
                                {log.tipo}
                              </span>
                              
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                log.destino === 'SUPABASE' ? 'bg-blue-100 text-blue-700' :
                                log.destino === 'LOCALSTORAGE' ? 'bg-amber-100 text-amber-700' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {log.destino}
                              </span>
                              
                              <span className="text-xs text-slate-500 ml-auto">
                                {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                              </span>
                            </div>
                            
                            {log.rota && (
                              <div className="font-mono text-xs text-slate-700 mb-2">
                                {log.rota}
                              </div>
                            )}
                            
                            {log.erro && (
                              <div className="bg-red-100 border border-red-300 rounded p-2 text-xs text-red-700 font-medium mt-2">
                                ❌ ERRO: {log.erro}
                              </div>
                            )}
                            
                            {log.tamanho && (
                              <div className="text-xs text-slate-500 mt-1">
                                Tamanho: {log.tamanho}
                              </div>
                            )}
                            
                            {log.dados && (
                              <details className="mt-2">
                                <summary className="text-xs text-slate-600 font-medium cursor-pointer hover:text-slate-900">
                                  Ver dados completos
                                </summary>
                                <pre className="mt-2 p-2 bg-slate-900 text-green-400 rounded text-xs overflow-x-auto">
                                  {JSON.stringify(log.dados, null, 2)}
                                </pre>
                              </details>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
