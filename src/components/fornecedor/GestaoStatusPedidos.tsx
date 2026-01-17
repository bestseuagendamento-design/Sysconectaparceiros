import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Clock, 
  Cog, 
  CheckCircle2, 
  Truck, 
  MapPin,
  Eye,
  Edit3,
  Save,
  X,
  ChevronRight,
  AlertCircle,
  Calendar,
  User,
  Building2,
  DollarSign,
  FileText,
  History,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { cloudStorage } from '../../utils/cloudStorage';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

// 🎯 TIPOS DE STATUS POSSÍVEIS NO FLUXO
type StatusPedido = 
  | 'pendente'        // Aguardando aprovação
  | 'aprovado'        // Aprovado, aguardando produção
  | 'em_producao'     // Em produção
  | 'pronto'          // Pronto para despacho
  | 'despachado'      // Despachado
  | 'entregue'        // Entregue ao cliente
  | 'cancelado'       // Cancelado
  | 'reprovado';      // Reprovado

interface StatusInfo {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: any;
  descricao: string;
}

// 🎨 CONFIGURAÇÃO DOS STATUS
const STATUS_CONFIG: Record<StatusPedido, StatusInfo> = {
  pendente: {
    label: 'Pendente',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-300',
    icon: Clock,
    descricao: 'Aguardando aprovação do fornecedor'
  },
  aprovado: {
    label: 'Aprovado',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    icon: CheckCircle2,
    descricao: 'Aprovado, aguardando início da produção'
  },
  em_producao: {
    label: 'Em Produção',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    icon: Cog,
    descricao: 'Em produção na fábrica'
  },
  pronto: {
    label: 'Pronto',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    icon: CheckCircle2,
    descricao: 'Pronto para despacho'
  },
  despachado: {
    label: 'Despachado',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-300',
    icon: Truck,
    descricao: 'Em rota de entrega'
  },
  entregue: {
    label: 'Entregue',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    icon: MapPin,
    descricao: 'Entregue ao cliente'
  },
  cancelado: {
    label: 'Cancelado',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    icon: X,
    descricao: 'Pedido cancelado'
  },
  reprovado: {
    label: 'Reprovado',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    icon: AlertCircle,
    descricao: 'Pedido reprovado'
  }
};

// 🔄 FLUXO LÓGICO DE STATUS (PRÓXIMOS PASSOS PERMITIDOS)
const PROXIMOS_STATUS: Record<StatusPedido, StatusPedido[]> = {
  pendente: ['aprovado', 'reprovado', 'cancelado'],
  aprovado: ['em_producao', 'cancelado'],
  em_producao: ['pronto', 'cancelado'],
  pronto: ['despachado', 'cancelado'],
  despachado: ['entregue', 'cancelado'],
  entregue: [], // Status final
  cancelado: [], // Status final
  reprovado: [] // Status final
};

interface Pedido {
  id: string;
  numeroPedido?: string;
  cliente_nome: string;
  vidraceiro_nome?: string;
  vidraceiro_cidade?: string;
  valor_total: number;
  data_pedido: string;
  status: string;
  statusFornecedor?: string;
  etapaProducao?: string;
  items: any[];
  historicoStatus?: HistoricoStatus[];
  observacoesStatus?: string;
  dataAprovacao?: string;
  dataDespachado?: string;
  dataEntregue?: string;
}

interface HistoricoStatus {
  status: StatusPedido;
  data: string;
  usuario?: string;
  observacao?: string;
}

export function GestaoStatusPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  const [editandoStatus, setEditandoStatus] = useState(false);
  const [novoStatus, setNovoStatus] = useState<StatusPedido | ''>('');
  const [observacao, setObservacao] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<StatusPedido | 'todos'>('todos');
  
  // 🔥 ESTADOS DE DEBUG
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [debugExpanded, setDebugExpanded] = useState(true);
  const [debugAtualizacoes, setDebugAtualizacoes] = useState<any[]>([]); // Histórico de atualizações de status
  const [fornecedorId, setFornecedorId] = useState('forn-vidro-01'); // ID padrão do fornecedor

  // 🔄 CARREGAR PEDIDOS DA NUVEM
  const carregarPedidos = async () => {
    try {
      setLoading(true);
      
      // 🔥 BUSCAR DO SERVIDOR (não mais do localStorage!)
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos/fornecedor/${fornecedorId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const result = await response.json();
      
      if (result.success) {
        setPedidos(result.pedidos);
        console.log(`✅ ${result.pedidos.length} pedidos carregados do fornecedor ${fornecedorId}`);
      } else {
        console.error('❌ Erro na resposta:', result.error);
        toast.error('Erro ao carregar pedidos');
        setPedidos([]);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar pedidos:', error);
      toast.error('Erro ao carregar pedidos');
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPedidos();
    
    // 🔥 DESABILITADO: Polling estava causando out of memory
    // const interval = setInterval(carregarPedidos, 5000);
    // return () => clearInterval(interval);
  }, []);

  // 🎯 ATUALIZAR STATUS DO PEDIDO
  const atualizarStatus = async () => {
    if (!pedidoSelecionado || !novoStatus) {
      toast.error('Selecione um status');
      return;
    }

    try {
      setLoading(true);

      // 1. Criar registro de histórico
      const historicoAtual = pedidoSelecionado.historicoStatus || [];
      const novoHistorico: HistoricoStatus = {
        status: novoStatus as StatusPedido,
        data: new Date().toISOString(),
        usuario: 'Fornecedor', // Pode ser substituído por usuário logado
        observacao: observacao || undefined
      };

      // 2. Atualizar pedido
      const pedidoAtualizado: Pedido = {
        ...pedidoSelecionado,
        status: novoStatus,
        statusFornecedor: novoStatus,
        historicoStatus: [...historicoAtual, novoHistorico],
        observacoesStatus: observacao || pedidoSelecionado.observacoesStatus,
        ...(novoStatus === 'aprovado' && { dataAprovacao: new Date().toISOString() }),
        ...(novoStatus === 'despachado' && { dataDespachado: new Date().toISOString() }),
        ...(novoStatus === 'entregue' && { dataEntregue: new Date().toISOString() })
      };

      // 3. Atualizar na lista
      const pedidosAtualizados = pedidos.map(p => 
        p.id === pedidoSelecionado.id ? pedidoAtualizado : p
      );

      // 4. Salvar na nuvem
      await cloudStorage.setItem('sysconecta_pedidos_fornecedor', pedidosAtualizados);
      
      // 5. Disparar evento para sincronizar com outras telas
      window.dispatchEvent(new Event('pedidos_fornecedor_updated'));

      // 6. Atualizar estado local
      setPedidos(pedidosAtualizados);
      setPedidoSelecionado(pedidoAtualizado);

      toast.success(`Status atualizado para: ${STATUS_CONFIG[novoStatus as StatusPedido].label}`);
      
      // 7. Resetar form
      setEditandoStatus(false);
      setNovoStatus('');
      setObservacao('');

      console.log('✅ Status atualizado:', {
        pedidoId: pedidoSelecionado.id,
        statusAnterior: pedidoSelecionado.status,
        statusNovo: novoStatus
      });

      // 🔥 ADICIONAR AO HISTÓRICO DE DEBUG
      setDebugAtualizacoes(prev => [
        ...prev,
        {
          pedidoId: pedidoSelecionado.id,
          statusAnterior: pedidoSelecionado.status,
          statusNovo: novoStatus,
          data: new Date().toISOString(),
          usuario: 'Fornecedor'
        }
      ]);

    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    } finally {
      setLoading(false);
    }
  };

  // 🎨 RENDERIZAR BADGE DE STATUS
  const renderStatusBadge = (status: string, size: 'sm' | 'md' = 'sm') => {
    const config = STATUS_CONFIG[status as StatusPedido] || STATUS_CONFIG.pendente;
    const Icon = config.icon;
    
    const sizeClasses = size === 'sm' 
      ? 'px-3 py-1 text-xs'
      : 'px-4 py-2 text-sm';

    return (
      <div className={`inline-flex items-center gap-2 ${sizeClasses} rounded-lg border-2 ${config.bgColor} ${config.borderColor} ${config.color} font-semibold`}>
        <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
        {config.label}
      </div>
    );
  };

  // 📊 FILTRAR PEDIDOS
  const pedidosFiltrados = filtroStatus === 'todos' 
    ? pedidos 
    : pedidos.filter(p => p.status === filtroStatus || p.statusFornecedor === filtroStatus);

  // 📈 ESTATÍSTICAS
  const stats = {
    total: pedidos.length,
    pendentes: pedidos.filter(p => p.status === 'pendente').length,
    em_producao: pedidos.filter(p => ['aprovado', 'em_producao'].includes(p.status)).length,
    prontos: pedidos.filter(p => ['pronto', 'despachado'].includes(p.status)).length,
    finalizados: pedidos.filter(p => p.status === 'entregue').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            📦 Gestão de Status de Pedidos
          </h1>
          <p className="text-slate-600">
            Atualize manualmente o status dos pedidos conforme progridem
          </p>
        </div>

        {/* 🔥🔥🔥 PAINEL DE DEBUG COMPLETO */}
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-red-700 font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                DEBUG - Verificar Pedidos no Banco
              </h3>
              <p className="text-red-600 text-sm mt-1">
                Clique para buscar TODOS os pedidos no servidor (por fornecedor_id)
              </p>
            </div>
            <button
              onClick={async () => {
                try {
                  toast.loading('Buscando TODOS os pedidos no KV Store...');
                  
                  // Buscar TODOS os pedidos (sistema antigo + novo)
                  const response = await fetch(
                    `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/debug/pedidos-all`,
                    {
                      method: 'GET',
                      headers: {
                        'Authorization': `Bearer ${publicAnonKey}`,
                        'Content-Type': 'application/json'
                      }
                    }
                  );
                  
                  const result = await response.json();
                  console.log('🔍 DEBUG - TODOS OS PEDIDOS:', result);
                  
                  // Filtrar por fornecedor
                  const pedidosDoFornecedor = result.pedidos_antigos.filter((p: any) => 
                    p.fornecedor_id === fornecedorId
                  );
                  
                  setDebugInfo({
                    ...result,
                    fornecedorId,
                    pedidosDoFornecedor,
                    totalDoFornecedor: pedidosDoFornecedor.length
                  });
                  
                  toast.dismiss();
                  toast.success(`${result.total} pedidos no banco • ${pedidosDoFornecedor.length} do fornecedor ${fornecedorId}`);
                } catch (error) {
                  toast.dismiss();
                  toast.error('Erro ao buscar pedidos');
                  console.error(error);
                }
              }}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all"
            >
              🔍 Verificar Banco
            </button>
          </div>
        </div>

        {/* 🔥🔥🔥 PAINEL DE DEBUG EXPANDIDO */}
        {debugInfo && (
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl overflow-hidden mb-6">
            <button
              onClick={() => setDebugExpanded(!debugExpanded)}
              className="w-full p-4 flex items-center justify-between hover:bg-yellow-100 transition-all"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-700" />
                <div className="text-left">
                  <h3 className="text-yellow-800 font-bold">
                    🔍 Diagnóstico Completo (Gestão de Status)
                  </h3>
                  <p className="text-yellow-700 text-sm">
                    {debugInfo.total} pedidos no banco • {debugInfo.totalDoFornecedor} do fornecedor • {pedidos.length} exibidos
                  </p>
                </div>
              </div>
              <div className="text-yellow-700 text-2xl">
                {debugExpanded ? '▼' : '▶'}
              </div>
            </button>

            {debugExpanded && (
              <div className="p-4 border-t-2 border-yellow-400/30 bg-white/60 space-y-4">
                {/* 1. INFORMAÇÕES BÁSICAS */}
                <div className="bg-white border-2 border-yellow-300 rounded-lg p-4">
                  <h4 className="text-yellow-800 font-bold mb-3 flex items-center gap-2">
                    📊 Informações Básicas
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-600">Meu Fornecedor ID:</p>
                      <p className="text-slate-900 font-mono text-xs font-bold">{fornecedorId}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Total no Banco:</p>
                      <p className="text-slate-900 font-bold text-lg">{debugInfo.total} pedidos</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Do Meu Fornecedor:</p>
                      <p className="text-blue-600 font-bold text-lg">{debugInfo.totalDoFornecedor} pedidos</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Exibidos na Tela:</p>
                      <p className="text-emerald-600 font-bold text-lg">{pedidos.length} pedidos</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-slate-600">Status:</p>
                      <p className={`font-bold ${
                        debugInfo.totalDoFornecedor > 0 && pedidos.length === 0 
                          ? 'text-red-600' 
                          : 'text-green-600'
                      }`}>
                        {debugInfo.totalDoFornecedor > 0 && pedidos.length === 0 
                          ? '❌ PROBLEMA: Pedidos existem mas não aparecem!' 
                          : '✅ OK'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. ESTRUTURA DAS CHAVES */}
                <div className="bg-white border-2 border-yellow-300 rounded-lg p-4">
                  <h4 className="text-yellow-800 font-bold mb-3 flex items-center gap-2">
                    🔑 Como os Pedidos Estão Salvos
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="bg-slate-50 p-3 rounded">
                      <p className="text-slate-700 font-bold mb-1">Sistema Antigo:</p>
                      <p className="text-slate-900 font-mono text-xs">
                        pedido:vidraceiro:{'<userId>'}:{'<pedidoId>'}
                      </p>
                      <p className="text-blue-600 text-xs mt-1 font-bold">
                        {debugInfo.pedidos_antigos?.length || 0} pedidos encontrados
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded">
                      <p className="text-slate-700 font-bold mb-1">Sistema Novo:</p>
                      <p className="text-slate-900 font-mono text-xs">
                        pedidos:{'<userId>'}
                      </p>
                      <p className="text-blue-600 text-xs mt-1 font-bold">
                        {debugInfo.pedidos_novos?.length || 0} pedidos encontrados
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. PRIMEIROS PEDIDOS DO FORNECEDOR */}
                {debugInfo.pedidosDoFornecedor?.length > 0 && (
                  <div className="bg-white border-2 border-yellow-300 rounded-lg p-4">
                    <h4 className="text-yellow-800 font-bold mb-3 flex items-center gap-2">
                      📦 Primeiros 3 Pedidos do Fornecedor {fornecedorId}
                    </h4>
                    <div className="space-y-2 text-xs">
                      {debugInfo.pedidosDoFornecedor.slice(0, 3).map((p: any, i: number) => (
                        <div key={i} className="bg-slate-50 p-3 rounded font-mono">
                          <p className="text-slate-900 font-bold">#{p.id.slice(0, 8)}</p>
                          <p className="text-blue-600">Vidraceiro: {p.vidraceiro_id}</p>
                          <p className="text-purple-600">Fornecedor: {p.fornecedor_id}</p>
                          <p className="text-orange-600">Status: {p.status}</p>
                          <p className="text-green-600">Valor: R$ {p.valor_total?.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. DIAGNÓSTICO */}
                <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4">
                  <h4 className="text-red-700 font-bold mb-3 flex items-center gap-2">
                    🚨 Diagnóstico do Problema
                  </h4>
                  <div className="space-y-2 text-sm">
                    {debugInfo.totalDoFornecedor > 0 && pedidos.length === 0 ? (
                      <>
                        <p className="text-red-700">❌ <strong>PROBLEMA IDENTIFICADO:</strong></p>
                        <p className="text-slate-900">
                          Existem {debugInfo.totalDoFornecedor} pedidos no banco com fornecedor_id = <strong>{fornecedorId}</strong>,
                          mas a Gestão de Status está buscando de <strong>localStorage</strong>!
                        </p>
                        <div className="bg-white p-3 rounded mt-2">
                          <p className="text-red-600 font-bold text-xs mb-2">Código Atual (ERRADO):</p>
                          <pre className="text-xs text-slate-700 overflow-x-auto">
const remotePedidos = await cloudStorage.getItem('sysconecta_pedidos_fornecedor')
                          </pre>
                          <p className="text-green-600 font-bold text-xs mt-3 mb-2">Código Correto:</p>
                          <pre className="text-xs text-slate-700 overflow-x-auto">
const response = await fetch(`/pedidos/fornecedor/{fornecedorId}`)
                          </pre>
                        </div>
                        <p className="text-yellow-700 mt-3">
                          💡 <strong>Solução:</strong> Criar rota no servidor para buscar por fornecedor_id
                        </p>
                      </>
                    ) : debugInfo.totalDoFornecedor === 0 ? (
                      <p className="text-orange-600">
                        ⚠️ Nenhum pedido encontrado para o fornecedor <strong>{fornecedorId}</strong> no banco
                      </p>
                    ) : (
                      <p className="text-green-600">✅ Tudo está funcionando corretamente!</p>
                    )}
                  </div>
                </div>

                {/* 5. CONSOLE LOG */}
                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-3">
                  <p className="text-blue-700 text-xs">
                    💡 Veja o console (F12) para dados completos em JSON
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ESTATÍSTICAS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border-2 border-slate-200 shadow-sm">
            <div className="text-2xl font-black text-slate-900">{stats.total}</div>
            <div className="text-xs text-slate-500 font-semibold">Total</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200 shadow-sm">
            <div className="text-2xl font-black text-yellow-700">{stats.pendentes}</div>
            <div className="text-xs text-yellow-600 font-semibold">Pendentes</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200 shadow-sm">
            <div className="text-2xl font-black text-purple-700">{stats.em_producao}</div>
            <div className="text-xs text-purple-600 font-semibold">Produção</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200 shadow-sm">
            <div className="text-2xl font-black text-green-700">{stats.prontos}</div>
            <div className="text-xs text-green-600 font-semibold">Prontos</div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 border-2 border-emerald-200 shadow-sm">
            <div className="text-2xl font-black text-emerald-700">{stats.finalizados}</div>
            <div className="text-xs text-emerald-600 font-semibold">Entregues</div>
          </div>
        </div>

        {/* FILTROS */}
        <div className="bg-white rounded-xl p-4 mb-6 border-2 border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-slate-600" />
            <span className="font-bold text-slate-700">Filtrar por Status:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltroStatus('todos')}
              className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
                filtroStatus === 'todos'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
              }`}
            >
              Todos ({stats.total})
            </button>
            {(Object.keys(STATUS_CONFIG) as StatusPedido[]).map(status => {
              const config = STATUS_CONFIG[status];
              const count = pedidos.filter(p => p.status === status || p.statusFornecedor === status).length;
              
              if (count === 0) return null;
              
              return (
                <button
                  key={status}
                  onClick={() => setFiltroStatus(status)}
                  className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
                    filtroStatus === status
                      ? `${config.bgColor} ${config.color} ${config.borderColor}`
                      : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {config.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* LISTA DE PEDIDOS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-slate-900">
                📋 Pedidos ({pedidosFiltrados.length})
              </h2>
              <button
                onClick={carregarPedidos}
                disabled={loading}
                className="p-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {loading && pedidos.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border-2 border-slate-200">
                <RefreshCw className="w-8 h-8 animate-spin text-slate-400 mx-auto mb-3" />
                <p className="text-slate-500 font-semibold">Carregando pedidos...</p>
              </div>
            ) : pedidosFiltrados.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border-2 border-slate-200">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-semibold">Nenhum pedido encontrado</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
                <AnimatePresence>
                  {pedidosFiltrados.map((pedido) => (
                    <motion.div
                      key={pedido.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`bg-white rounded-xl p-4 border-2 cursor-pointer transition-all hover:shadow-lg ${
                        pedidoSelecionado?.id === pedido.id
                          ? 'border-blue-500 shadow-md'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => setPedidoSelecionado(pedido)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-black text-slate-900 text-lg">
                            #{pedido.numeroPedido || pedido.id.slice(-6)}
                          </div>
                          <div className="text-sm text-slate-500">
                            {new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                        {renderStatusBadge(pedido.status || pedido.statusFornecedor || 'pendente')}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <User className="w-4 h-4" />
                          <span className="font-semibold">{pedido.vidraceiro_nome || pedido.cliente_nome}</span>
                        </div>
                        
                        {pedido.vidraceiro_cidade && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <MapPin className="w-4 h-4" />
                            <span>{pedido.vidraceiro_cidade}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-slate-600">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-bold text-green-600">
                            R$ {pedido.valor_total?.toFixed(2) || '0.00'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-600">
                          <Package className="w-4 h-4" />
                          <span>{pedido.items?.length || 0} itens</span>
                        </div>
                      </div>

                      {pedidoSelecionado?.id === pedido.id && (
                        <div className="mt-3 pt-3 border-t-2 border-slate-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditandoStatus(true);
                              setNovoStatus('');
                              setObservacao('');
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                          >
                            <Edit3 className="w-4 h-4" />
                            Atualizar Status
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* DETALHES DO PEDIDO */}
          <div>
            {pedidoSelecionado ? (
              <div className="bg-white rounded-xl p-6 border-2 border-slate-200 shadow-sm sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-slate-900">
                    Detalhes do Pedido
                  </h2>
                  <button
                    onClick={() => setPedidoSelecionado(null)}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>

                {/* INFO DO PEDIDO */}
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="text-xs text-slate-500 font-semibold mb-1">Status Atual</div>
                    {renderStatusBadge(pedidoSelecionado.status || 'pendente', 'md')}
                    <div className="text-xs text-slate-500 mt-2">
                      {STATUS_CONFIG[(pedidoSelecionado.status || 'pendente') as StatusPedido]?.descricao}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-slate-100">
                    <div>
                      <div className="text-xs text-slate-500 font-semibold mb-1">Cliente</div>
                      <div className="font-bold text-slate-900">{pedidoSelecionado.vidraceiro_nome || pedidoSelecionado.cliente_nome}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-semibold mb-1">Valor Total</div>
                      <div className="font-bold text-green-600">R$ {pedidoSelecionado.valor_total?.toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                {/* EDITAR STATUS */}
                {editandoStatus && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Edit3 className="w-5 h-5 text-blue-600" />
                      <span className="font-bold text-blue-900">Atualizar Status</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Novo Status
                        </label>
                        <select
                          value={novoStatus}
                          onChange={(e) => setNovoStatus(e.target.value as StatusPedido)}
                          className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                        >
                          <option value="">Selecione...</option>
                          {PROXIMOS_STATUS[(pedidoSelecionado.status || 'pendente') as StatusPedido]?.map(status => (
                            <option key={status} value={status}>
                              {STATUS_CONFIG[status].label}
                            </option>
                          ))}
                          {/* Permitir voltar para qualquer status (modo administrador) */}
                          <optgroup label="Outros Status">
                            {(Object.keys(STATUS_CONFIG) as StatusPedido[])
                              .filter(s => !PROXIMOS_STATUS[(pedidoSelecionado.status || 'pendente') as StatusPedido]?.includes(s))
                              .map(status => (
                                <option key={status} value={status}>
                                  {STATUS_CONFIG[status].label}
                                </option>
                              ))}
                          </optgroup>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Observação (opcional)
                        </label>
                        <textarea
                          value={observacao}
                          onChange={(e) => setObservacao(e.target.value)}
                          placeholder="Ex: Pedido pronto para carga às 14h"
                          className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={atualizarStatus}
                          disabled={!novoStatus || loading}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Save className="w-5 h-5" />
                          Salvar
                        </button>
                        <button
                          onClick={() => {
                            setEditandoStatus(false);
                            setNovoStatus('');
                            setObservacao('');
                          }}
                          className="px-4 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-bold"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* HISTÓRICO DE STATUS */}
                {pedidoSelecionado.historicoStatus && pedidoSelecionado.historicoStatus.length > 0 && (
                  <div className="pt-4 border-t-2 border-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                      <History className="w-5 h-5 text-slate-600" />
                      <span className="font-bold text-slate-700">Histórico</span>
                    </div>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {pedidoSelecionado.historicoStatus.map((hist, index) => (
                        <div key={index} className="flex gap-3 pb-3 border-b border-slate-100 last:border-0">
                          <div className="flex-shrink-0">
                            {React.createElement(STATUS_CONFIG[hist.status].icon, {
                              className: `w-5 h-5 ${STATUS_CONFIG[hist.status].color}`
                            })}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-slate-900">
                              {STATUS_CONFIG[hist.status].label}
                            </div>
                            <div className="text-xs text-slate-500">
                              {new Date(hist.data).toLocaleString('pt-BR')}
                            </div>
                            {hist.observacao && (
                              <div className="text-sm text-slate-600 mt-1">
                                "{hist.observacao}"
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 border-2 border-slate-200 text-center">
                <Eye className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-semibold">
                  Selecione um pedido para ver os detalhes
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}