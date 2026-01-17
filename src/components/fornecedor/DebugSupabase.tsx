import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, 
  RefreshCw, 
  ChevronDown, 
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  Copy,
  Trash2,
  FileJson,
  Server,
  Eye,
  EyeOff,
  Search
} from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface DebugSupabaseProps {
  fornecedorId: string;
}

interface ChaveKV {
  key: string;
  value: any;
  tamanho: string;
  tipo: string;
  timestamp?: string;
}

export function DebugSupabase({ fornecedorId }: DebugSupabaseProps) {
  const [aberto, setAberto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chaves, setChaves] = useState<ChaveKV[]>([]);
  const [expandidas, setExpandidas] = useState<Set<string>>(new Set());
  const [filtro, setFiltro] = useState('');
  const [statusConexao, setStatusConexao] = useState<'ok' | 'erro' | 'carregando'>('carregando');

  // 🔥 DEBUG: LOG QUANDO O COMPONENTE MONTA
  useEffect(() => {
    console.log('🔥🔥🔥 [DEBUG SUPABASE] COMPONENTE MONTADO! fornecedorId:', fornecedorId);
    console.log('🔥🔥🔥 [DEBUG SUPABASE] Botão deve estar VISÍVEL agora!');
    console.log('🔥🔥🔥 [DEBUG SUPABASE] Procure no canto INFERIOR DIREITO da tela!');
  }, []);

  console.log('🔥 [DEBUG SUPABASE] RENDERIZANDO... fornecedorId:', fornecedorId);

  // 🔥 BUSCAR TODAS AS CHAVES DO SUPABASE
  const buscarTodasChaves = async () => {
    setLoading(true);
    setStatusConexao('carregando');
    
    try {
      console.log('🔍 [DEBUG SUPABASE] Iniciando busca de todas as chaves...');
      
      const chavesEncontradas: ChaveKV[] = [];

      // 1. Buscar tabela de preços
      try {
        const resTabelaPrecos = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/tabela-precos/${fornecedorId}`,
          { headers: { Authorization: `Bearer ${publicAnonKey}` } }
        );
        
        if (resTabelaPrecos.ok) {
          const data = await resTabelaPrecos.json();
          const tabelaSize = Object.keys(data.tabela || {}).length;
          chavesEncontradas.push({
            key: `tabela-precos:${fornecedorId}`,
            value: data.tabela,
            tamanho: calcularTamanho(data.tabela),
            tipo: `Tabela de Preços (${tabelaSize} itens)`,
            timestamp: new Date().toISOString()
          });
        }
      } catch (e) {
        console.warn('❌ Erro ao buscar tabela de preços:', e);
      }

      // 2. Buscar pedidos do fornecedor
      try {
        const resPedidos = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos/fornecedor/${fornecedorId}`,
          { headers: { Authorization: `Bearer ${publicAnonKey}` } }
        );
        
        if (resPedidos.ok) {
          const data = await resPedidos.json();
          const pedidos = data.pedidos || [];
          chavesEncontradas.push({
            key: `pedidos-fornecedor:${fornecedorId}`,
            value: pedidos,
            tamanho: calcularTamanho(pedidos),
            tipo: `Pedidos (${pedidos.length} pedidos)`,
            timestamp: new Date().toISOString()
          });
        }
      } catch (e) {
        console.warn('❌ Erro ao buscar pedidos:', e);
      }
      
      // 3. Buscar estoque
      try {
        const resEstoque = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/fornecedor/estoque-vidros/${fornecedorId}`,
          { headers: { Authorization: `Bearer ${publicAnonKey}` } }
        );

        if (resEstoque.ok) {
          const data = await resEstoque.json();
          const estoque = data.estoque || [];
          chavesEncontradas.push({
            key: `estoque-vidros:${fornecedorId}`,
            value: estoque,
            tamanho: calcularTamanho(estoque),
            tipo: `Estoque (${estoque.length} itens)`,
            timestamp: data.estoque?.dataAtualizacao
          });
        }
      } catch (e) {
        console.warn('❌ Erro ao buscar estoque:', e);
      }

      // 4. Buscar estatísticas
      try {
        const resStats = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/estatisticas/fornecedor/${encodeURIComponent(fornecedorId)}`,
          { headers: { Authorization: `Bearer ${publicAnonKey}` } }
        );

        if (resStats.ok) {
          const data = await resStats.json();
          chavesEncontradas.push({
            key: `estatisticas:${fornecedorId}`,
            value: data.estatisticas,
            tamanho: calcularTamanho(data.estatisticas),
            tipo: 'Estatísticas',
            timestamp: new Date().toISOString()
          });
        }
      } catch (e) {
        console.warn('❌ Erro ao buscar estatísticas:', e);
      }

      console.log(`✅ [DEBUG SUPABASE] ${chavesEncontradas.length} chaves encontradas`);
      setChaves(chavesEncontradas);
      setStatusConexao(chavesEncontradas.length > 0 ? 'ok' : 'erro');
      
      if (chavesEncontradas.length === 0) {
        toast.warning('⚠️ Nenhum dado encontrado no Supabase!');
      } else {
        toast.success(`✅ ${chavesEncontradas.length} chaves carregadas!`);
      }
      
    } catch (error) {
      console.error('❌ [DEBUG SUPABASE] Erro ao buscar chaves:', error);
      setStatusConexao('erro');
      toast.error('Erro ao conectar com Supabase');
    } finally {
      setLoading(false);
    }
  };

  // Calcular tamanho do objeto
  const calcularTamanho = (obj: any): string => {
    const str = JSON.stringify(obj);
    const bytes = new Blob([str]).size;
    
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Toggle expandir/colapsar
  const toggleExpandir = (key: string) => {
    const novasExpandidas = new Set(expandidas);
    if (novasExpandidas.has(key)) {
      novasExpandidas.delete(key);
    } else {
      novasExpandidas.add(key);
    }
    setExpandidas(novasExpandidas);
  };

  // Copiar JSON
  const copiarJSON = (value: any) => {
    navigator.clipboard.writeText(JSON.stringify(value, null, 2));
    toast.success('JSON copiado!');
  };

  // Inicializar dados vazios
  const inicializarDados = async () => {
    try {
      toast.loading('Inicializando dados...');
      
      // 1. Inicializar tabela de preços
      const resTabela = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/fornecedor/inicializar-tabela/${fornecedorId}`,
        { 
          method: 'POST',
          headers: { Authorization: `Bearer ${publicAnonKey}` } 
        }
      );

      if (resTabela.ok) {
        console.log('✅ Tabela de preços inicializada');
      }

      toast.success('✅ Dados inicializados! Recarregando...');
      await buscarTodasChaves();
      
    } catch (error) {
      console.error('❌ Erro ao inicializar dados:', error);
      toast.error('Erro ao inicializar dados');
    }
  };

  useEffect(() => {
    if (aberto && chaves.length === 0) {
      buscarTodasChaves();
    }
  }, [aberto]);

  const chavesFiltradas = chaves.filter(c => 
    c.key.toLowerCase().includes(filtro.toLowerCase()) ||
    c.tipo.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <>
      {/* 🔥 BOTÃO FLUTUANTE DE DEBUG */}
      <motion.button
        onClick={() => setAberto(!aberto)}
        className="fixed bottom-6 right-6 z-[1000] bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold text-sm"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Database className="w-5 h-5" />
        <span className="hidden md:inline">Debug Supabase</span>
        {statusConexao === 'ok' && <CheckCircle className="w-4 h-4 text-green-400" />}
        {statusConexao === 'erro' && <XCircle className="w-4 h-4 text-red-400" />}
      </motion.button>

      {/* 🔥 MODAL DE DEBUG */}
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
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* HEADER */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Debug Supabase</h2>
                    <p className="text-white/70 text-sm">Visualização completa dos dados armazenados</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={buscarTodasChaves}
                    disabled={loading}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={() => setAberto(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* STATUS BAR */}
              <div className="bg-slate-50 border-b border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-600">
                        Status: 
                      </span>
                      {statusConexao === 'ok' && (
                        <span className="text-green-600 font-bold flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Conectado
                        </span>
                      )}
                      {statusConexao === 'erro' && (
                        <span className="text-red-600 font-bold flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Erro
                        </span>
                      )}
                      {statusConexao === 'carregando' && (
                        <span className="text-amber-600 font-bold flex items-center gap-1">
                          <RefreshCw className="w-4 h-4 animate-spin" /> Carregando...
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <FileJson className="w-4 h-4" />
                      <span className="font-bold">{chaves.length}</span> chaves encontradas
                    </div>
                  </div>

                  {chaves.length === 0 && !loading && (
                    <button
                      onClick={inicializarDados}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Inicializar Dados
                    </button>
                  )}
                </div>

                {/* BUSCA */}
                <div className="mt-4 relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filtrar por chave ou tipo..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* CONTEÚDO */}
              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <RefreshCw className="w-12 h-12 animate-spin mb-4" />
                    <p className="font-medium">Carregando dados do Supabase...</p>
                  </div>
                ) : chavesFiltradas.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <AlertCircle className="w-16 h-16 mb-4 text-amber-500" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Nenhum dado encontrado</h3>
                    <p className="text-center mb-6 max-w-md">
                      O Supabase está vazio. Isso é normal na primeira vez que você acessa o sistema.
                      Clique no botão abaixo para inicializar os dados.
                    </p>
                    <button
                      onClick={inicializarDados}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2"
                    >
                      <Database className="w-5 h-5" />
                      Inicializar Dados Agora
                    </button>
                    
                    {/* INSTRUÇÕES */}
                    <div className="mt-8 bg-slate-50 rounded-xl p-6 max-w-2xl">
                      <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-600" />
                        O que vai ser inicializado:
                      </h4>
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Tabela de Preços:</strong> 200+ tipos de vidros com preços atualizados</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Estoque:</strong> Controle de matéria-prima e produtos</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Configurações:</strong> Preferências do fornecedor</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {chavesFiltradas.map((chave) => (
                      <div key={chave.key} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                        {/* HEADER DA CHAVE */}
                        <div
                          onClick={() => toggleExpandir(chave.key)}
                          className="p-4 bg-slate-50 hover:bg-slate-100 cursor-pointer flex items-center justify-between transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            {expandidas.has(chave.key) ? (
                              <ChevronDown className="w-5 h-5 text-slate-600" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-slate-600" />
                            )}
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-sm font-bold text-slate-900">{chave.key}</span>
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                  {chave.tipo}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-slate-600">
                                <span>Tamanho: {chave.tamanho}</span>
                                {chave.timestamp && (
                                  <span>Atualizado: {new Date(chave.timestamp).toLocaleString('pt-BR')}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copiarJSON(chave.value);
                            }}
                            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                          >
                            <Copy className="w-4 h-4 text-slate-600" />
                          </button>
                        </div>

                        {/* CONTEÚDO EXPANDIDO */}
                        <AnimatePresence>
                          {expandidas.has(chave.key) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-slate-200"
                            >
                              <div className="p-4 bg-slate-900 overflow-x-auto">
                                <pre className="text-xs text-green-400 font-mono">
                                  {JSON.stringify(chave.value, null, 2)}
                                </pre>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* FOOTER */}
              <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
                <div className="text-xs text-slate-600">
                  <span className="font-medium">Fornecedor ID:</span> {fornecedorId}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={buscarTodasChaves}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Recarregar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}