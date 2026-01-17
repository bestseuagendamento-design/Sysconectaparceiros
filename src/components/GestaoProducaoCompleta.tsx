import React, { useState } from 'react';
import { 
  ArrowLeft, Package, Search, Filter, Clock, CheckCircle, Truck, 
  Settings, ChevronDown, AlertCircle, FileText, Eye
} from 'lucide-react';

interface GestaoProducaoCompletaProps {
  onVoltar: () => void;
  pedidosFornecedor: any[];
  onAtualizarStatus: (pedidoId: string, novoStatus: string) => void;
  onVerDetalhes: (pedido: any) => void;
}

export function GestaoProducaoCompleta({ 
  onVoltar, 
  pedidosFornecedor, 
  onAtualizarStatus,
  onVerDetalhes 
}: GestaoProducaoCompletaProps) {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');

  // 🔥 FILTRAR APENAS PEDIDOS APROVADOS (em produção)
  const pedidosAprovados = pedidosFornecedor.filter(pedido => 
    pedido.status === 'aprovado' || 
    pedido.statusFornecedor === 'aprovado' ||
    pedido.etapaProducao === 'em-producao' ||
    pedido.etapaProducao === 'corte' ||
    pedido.etapaProducao === 'tmpera' ||
    pedido.etapaProducao === 'embalagem' ||
    pedido.etapaProducao === 'expedicao' ||
    pedido.etapaProducao === 'em_rota' ||
    pedido.etapaProducao === 'entregue'
  );

  // Filtrar por busca e status
  const pedidosFiltrados = pedidosAprovados.filter(pedido => {
    const matchBusca = busca === '' || 
      pedido.numeroPedido?.toString().includes(busca) ||
      pedido.cliente?.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      pedido.vidraceiro?.nome?.toLowerCase().includes(busca.toLowerCase());
    
    const matchStatus = filtroStatus === 'todos' || pedido.etapaProducao === filtroStatus;
    
    return matchBusca && matchStatus;
  });

  const statusOptions = [
    { value: 'todos', label: 'Todos os Status', cor: 'text-gray-900' },
    { value: 'em-producao', label: 'Em Produção', cor: 'text-blue-600' },
    { value: 'corte', label: 'Em Corte', cor: 'text-purple-600' },
    { value: 'tmpera', label: 'Em Têmpera', cor: 'text-orange-600' },
    { value: 'embalagem', label: 'Em Embalagem', cor: 'text-cyan-600' },
    { value: 'expedicao', label: 'Expedição', cor: 'text-green-600' },
    { value: 'em_rota', label: 'Em Rota', cor: 'text-teal-600' },
    { value: 'entregue', label: 'Entregue', cor: 'text-emerald-600' }
  ];

  const getStatusInfo = (etapa: string) => {
    const statusMap: any = {
      'em-producao': { 
        label: 'Em Produção', 
        cor: 'bg-blue-100 text-blue-900 border-blue-300',
        icon: <Package className="w-4 h-4" />
      },
      'corte': { 
        label: 'Em Corte', 
        cor: 'bg-purple-100 text-purple-900 border-purple-300',
        icon: <Settings className="w-4 h-4" />
      },
      'tmpera': { 
        label: 'Em Têmpera', 
        cor: 'bg-orange-100 text-orange-900 border-orange-300',
        icon: <AlertCircle className="w-4 h-4" />
      },
      'embalagem': { 
        label: 'Em Embalagem', 
        cor: 'bg-cyan-100 text-cyan-900 border-cyan-300',
        icon: <Package className="w-4 h-4" />
      },
      'expedicao': { 
        label: 'Expedição', 
        cor: 'bg-green-100 text-green-900 border-green-300',
        icon: <CheckCircle className="w-4 h-4" />
      },
      'em_rota': { 
        label: 'Em Rota', 
        cor: 'bg-teal-100 text-teal-900 border-teal-300',
        icon: <Truck className="w-4 h-4" />
      },
      'entregue': { 
        label: 'Entregue', 
        cor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        icon: <CheckCircle className="w-4 h-4" />
      }
    };
    
    return statusMap[etapa] || statusMap['em-producao'];
  };

  const handleMudarStatus = (pedidoId: string, novoStatus: string) => {
    if (confirm(`Deseja realmente mudar o status deste pedido para "${getStatusInfo(novoStatus).label}"?\n\nO vidraceiro será notificado automaticamente.`)) {
      onAtualizarStatus(pedidoId, novoStatus);
    }
  };

  // Estatísticas rápidas
  const totalPedidos = pedidosAprovados.length;
  const emProducao = pedidosAprovados.filter(p => 
    p.etapaProducao === 'em-producao' || p.etapaProducao === 'corte' || p.etapaProducao === 'tmpera'
  ).length;
  const prontos = pedidosAprovados.filter(p => 
    p.etapaProducao === 'expedicao' || p.etapaProducao === 'em_rota'
  ).length;
  const entregues = pedidosAprovados.filter(p => p.etapaProducao === 'entregue').length;

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <div className="p-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={onVoltar}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar ao Dashboard
            </button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-gray-900 mb-2 font-bold" style={{ fontSize: '2rem' }}>
                  Gestão de Produção
                </h1>
                <p className="text-gray-700">
                  Acompanhe e gerencie todos os pedidos aprovados
                </p>
              </div>

              {/* Estatísticas Rápidas */}
              <div className="flex items-center gap-4">
                <div className="bg-white border-2 border-gray-200 rounded-xl px-6 py-4 text-center">
                  <div className="text-gray-600 text-xs font-medium mb-1">Total</div>
                  <div className="text-gray-900 font-bold text-2xl">{totalPedidos}</div>
                </div>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl px-6 py-4 text-center">
                  <div className="text-blue-600 text-xs font-medium mb-1">Em Produção</div>
                  <div className="text-blue-900 font-bold text-2xl">{emProducao}</div>
                </div>
                <div className="bg-green-50 border-2 border-green-200 rounded-xl px-6 py-4 text-center">
                  <div className="text-green-600 text-xs font-medium mb-1">Prontos/Em Rota</div>
                  <div className="text-green-900 font-bold text-2xl">{prontos}</div>
                </div>
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl px-6 py-4 text-center">
                  <div className="text-emerald-600 text-xs font-medium mb-1">Entregues</div>
                  <div className="text-emerald-900 font-bold text-2xl">{entregues}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
            <div className="flex items-center gap-4">
              {/* Busca */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por número do pedido, cliente ou vidraçaria..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                />
              </div>

              {/* Filtro de Status */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className="pl-12 pr-10 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium appearance-none cursor-pointer min-w-[200px]"
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Lista de Pedidos */}
          {pedidosFiltrados.length === 0 ? (
            <div className="bg-white border-2 border-gray-200 rounded-xl p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2 font-semibold" style={{ fontSize: '1.25rem' }}>
                {busca || filtroStatus !== 'todos' 
                  ? 'Nenhum pedido encontrado' 
                  : 'Nenhum pedido em produção'}
              </h3>
              <p className="text-gray-700">
                {busca || filtroStatus !== 'todos'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Os pedidos aprovados aparecerão aqui'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pedidosFiltrados.map((pedido) => {
                const statusInfo = getStatusInfo(pedido.etapaProducao || 'em-producao');
                
                return (
                  <div 
                    key={pedido.id} 
                    className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-6">
                      {/* Número do Pedido */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            #{pedido.numeroPedido || pedido.id.slice(-4)}
                          </span>
                        </div>
                      </div>

                      {/* Informações do Pedido */}
                      <div className="flex-1 grid grid-cols-3 gap-6">
                        <div>
                          <div className="text-gray-600 text-xs font-medium mb-1">CLIENTE FINAL</div>
                          <div className="text-gray-900 font-semibold">
                            {pedido.cliente?.nome || 'N/A'}
                          </div>
                          <div className="text-gray-700 text-sm">
                            {pedido.cliente?.telefone || '-'}
                          </div>
                        </div>

                        <div>
                          <div className="text-gray-600 text-xs font-medium mb-1">VIDRAÇARIA</div>
                          <div className="text-gray-900 font-semibold">
                            {pedido.vidraceiro?.nome || 'N/A'}
                          </div>
                          <div className="text-gray-700 text-sm">
                            {pedido.vidraceiro?.telefone || '-'}
                          </div>
                        </div>

                        <div>
                          <div className="text-gray-600 text-xs font-medium mb-1">TIPO DE PEDIDO</div>
                          <div className="text-gray-900 font-semibold">
                            {pedido.tipoPedido || 'Vidros Temperados'}
                          </div>
                          <div className="text-gray-700 text-sm">
                            {pedido.vidros?.length || pedido.itensOrcamento?.length || 0} vidros • R$ {pedido.valores?.total?.toFixed(2) || '0.00'}
                          </div>
                        </div>
                      </div>

                      {/* Status Atual */}
                      <div className="flex-shrink-0 text-center">
                        <div className="text-gray-600 text-xs font-medium mb-2">STATUS ATUAL</div>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${statusInfo.cor} font-semibold text-sm mb-3`}>
                          {statusInfo.icon}
                          {statusInfo.label}
                        </div>

                        {/* Mudar Status */}
                        <div className="relative">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                handleMudarStatus(pedido.id, e.target.value);
                                e.target.value = ''; // Reset
                              }
                            }}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 text-sm font-medium hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
                          >
                            <option value="">Mudar Status</option>
                            <option value="em-producao">Em Produção</option>
                            <option value="corte">Em Corte</option>
                            <option value="tmpera">Em Têmpera</option>
                            <option value="embalagem">Em Embalagem</option>
                            <option value="expedicao">Expedição</option>
                            <option value="em_rota">Em Rota</option>
                            <option value="entregue">Entregue</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => onVerDetalhes(pedido)}
                          className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold transition-all"
                        >
                          <Eye className="w-4 h-4" />
                          Ver Detalhes
                        </button>
                      </div>
                    </div>

                    {/* Data de Aprovação */}
                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Clock className="w-4 h-4" />
                        Aprovado em: {pedido.dataAprovacao 
                          ? new Date(pedido.dataAprovacao).toLocaleString('pt-BR')
                          : new Date(pedido.data).toLocaleString('pt-BR')
                        }
                      </div>

                      {pedido.romaneio && (
                        <div className="flex items-center gap-2 text-teal-600 text-sm font-medium">
                          <Truck className="w-4 h-4" />
                          Motorista: {pedido.romaneio.motorista} | Placa: {pedido.romaneio.placa}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
