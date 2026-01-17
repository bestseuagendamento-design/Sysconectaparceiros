import React, { useState, useEffect } from 'react';
import { 
  Cog, QrCode, CheckCircle2, Clock, AlertCircle, Eye
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ProducaoFornecedorProps {
  fornecedor: {
    id: string;
    nomeEmpresa: string;
    tipoFornecedor: 'vidros' | 'aluminio' | 'acessorios';
    estado: string;
  };
}

interface PedidoProducao {
  id: string;
  numeroPedido: string;
  cliente: string;
  obra: string;
  tipologia: string;
  itens: ItemProducao[];
  dataInicio: string;
  dataPrevisao?: string;
  statusGeral: 'em_producao' | 'finalizado' | 'pronto_carregar';
  observacoes?: string;
}

interface ItemProducao {
  id: string;
  codigoQR: string;
  produtoNome: string;
  categoria: string;
  quantidade: number;
  unidade: string;
  status: 'aguardando' | 'em_corte' | 'em_lapidacao' | 'em_furacao' | 'em_tempera' | 'finalizado';
  etapas?: EtapaProducao[];
  observacoesTecnicas?: string;
  modelo2D?: string;
}

interface EtapaProducao {
  nome: string;
  status: 'pendente' | 'em_andamento' | 'concluido';
  dataInicio?: string;
  dataConclusao?: string;
  responsavel?: string;
}

export function ProducaoFornecedor({ fornecedor }: ProducaoFornecedorProps) {
  const [pedidos, setPedidos] = useState<PedidoProducao[]>([]);
  const [loading, setLoading] = useState(true);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<PedidoProducao | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'em_producao' | 'finalizado' | 'pronto_carregar'>('todos');

  useEffect(() => {
    carregarPedidosProducao();
  }, [fornecedor.id]);

  const carregarPedidosProducao = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/producao/${fornecedor.id}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPedidos(data.pedidos || []);
      }
    } catch (error) {
      console.error('Erro ao carregar produção:', error);
      toast.error('Erro ao carregar produção');
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatusItem = async (itemId: string, novoStatus: ItemProducao['status']) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/producao/item/${itemId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ 
            status: novoStatus,
            fornecedorId: fornecedor.id
          })
        }
      );

      if (response.ok) {
        toast.success('Status atualizado!');
        carregarPedidosProducao();
      } else {
        toast.error('Erro ao atualizar status');
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const marcarComoPronto = async (pedidoId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/producao/${pedidoId}/finalizar`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ fornecedorId: fornecedor.id })
        }
      );

      if (response.ok) {
        toast.success('Pedido marcado como pronto para carregar!');
        carregarPedidosProducao();
        setPedidoSelecionado(null);
      } else {
        toast.error('Erro ao finalizar pedido');
      }
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      toast.error('Erro ao finalizar pedido');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      em_producao: { color: 'text-blue-500 bg-blue-500/20 border-blue-500/30', label: 'Em Produção', icon: Clock },
      finalizado: { color: 'text-green-500 bg-green-500/20 border-green-500/30', label: 'Finalizado', icon: CheckCircle2 },
      pronto_carregar: { color: 'text-purple-500 bg-purple-500/20 border-purple-500/30', label: 'Pronto p/ Carregar', icon: CheckCircle2 }
    };
    return badges[status as keyof typeof badges] || badges.em_producao;
  };

  const getStatusItemBadge = (status: string) => {
    const badges = {
      aguardando: { color: 'bg-gray-500', label: 'Aguardando' },
      em_corte: { color: 'bg-blue-500', label: 'Corte' },
      em_lapidacao: { color: 'bg-cyan-500', label: 'Lapidação' },
      em_furacao: { color: 'bg-yellow-500', label: 'Furação' },
      em_tempera: { color: 'bg-orange-500', label: 'Têmpera' },
      finalizado: { color: 'bg-green-500', label: 'Finalizado' }
    };
    return badges[status as keyof typeof badges] || badges.aguardando;
  };

  const getEtapasProducao = (): ItemProducao['status'][] => {
    switch (fornecedor.tipoFornecedor) {
      case 'vidros':
        return ['aguardando', 'em_corte', 'em_lapidacao', 'em_furacao', 'em_tempera', 'finalizado'];
      case 'aluminio':
        return ['aguardando', 'em_corte', 'finalizado'];
      case 'acessorios':
        return ['aguardando', 'finalizado'];
      default:
        return ['aguardando', 'finalizado'];
    }
  };

  const pedidosFiltrados = filtroStatus === 'todos' 
    ? pedidos 
    : pedidos.filter(p => p.statusGeral === filtroStatus);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-white mb-2">Produção</h2>
        <p className="text-[#9CA3AF]">Acompanhe o status de produção dos pedidos aprovados</p>
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#D4AF37]/10 to-[#FFD700]/5 border border-[#D4AF37]/30 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-[#D1D5DB]">
            <strong className="text-[#D4AF37]">Gestão de Produção:</strong> Atualize o status de cada item conforme avança nas etapas. 
            {fornecedor.tipoFornecedor === 'vidros' && ' Para vidros: Corte → Lapidação → Furação → Têmpera.'}
            {' '}Cada peça possui QR Code único para rastreamento.
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-3">
        {(['todos', 'em_producao', 'finalizado', 'pronto_carregar'] as const).map(status => {
          const badge = status !== 'todos' ? getStatusBadge(status) : null;
          
          return (
            <button
              key={status}
              onClick={() => setFiltroStatus(status)}
              className={`
                px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2
                ${filtroStatus === status 
                  ? 'bg-[#D4AF37] text-black' 
                  : 'bg-[#1A1A1A] border border-[#374151] text-[#9CA3AF] hover:border-[#D4AF37]'}
              `}
            >
              {badge && React.createElement(badge.icon, { className: 'w-4 h-4' })}
              <span>{status === 'todos' ? 'Todos' : badge?.label}</span>
              {status !== 'todos' && (
                <span className="px-2 py-0.5 rounded-full bg-black/20 text-xs">
                  {pedidos.filter(p => p.statusGeral === status).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Lista de Pedidos */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#9CA3AF]">Carregando produção...</p>
        </div>
      ) : pedidosFiltrados.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border-2 border-dashed border-[#374151]">
          <Cog className="w-16 h-16 text-[#6B7280] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Nenhum pedido em produção</h3>
          <p className="text-[#9CA3AF]">Pedidos aprovados aparecerão aqui automaticamente</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidosFiltrados.map(pedido => {
            const badge = getStatusBadge(pedido.statusGeral);
            const Icon = badge.icon;
            
            return (
              <div
                key={pedido.id}
                className="p-6 rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] border border-[#374151] hover:border-[#D4AF37] transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">Pedido #{pedido.numeroPedido}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${badge.color} flex items-center gap-2`}>
                        <Icon className="w-4 h-4" />
                        {badge.label}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-[#9CA3AF]">
                        <span className="text-[#D1D5DB] font-medium">Cliente:</span> {pedido.cliente}
                      </p>
                      <p className="text-sm text-[#9CA3AF]">
                        <span className="text-[#D1D5DB] font-medium">Obra:</span> {pedido.obra}
                      </p>
                      <p className="text-sm text-[#9CA3AF]">
                        <span className="text-[#D1D5DB] font-medium">Início:</span>{' '}
                        {new Date(pedido.dataInicio).toLocaleDateString('pt-BR')}
                      </p>
                      {pedido.dataPrevisao && (
                        <p className="text-sm text-[#9CA3AF]">
                          <span className="text-[#D1D5DB] font-medium">Previsão:</span>{' '}
                          {new Date(pedido.dataPrevisao).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-black text-white">{pedido.itens.length}</p>
                    <p className="text-sm text-[#9CA3AF]">itens</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#9CA3AF]">Progresso</span>
                    <span className="text-sm font-medium text-[#D4AF37]">
                      {Math.round((pedido.itens.filter(i => i.status === 'finalizado').length / pedido.itens.length) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-[#0F0F0F] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] transition-all duration-500"
                      style={{ 
                        width: `${(pedido.itens.filter(i => i.status === 'finalizado').length / pedido.itens.length) * 100}%` 
                      }}
                    />
                  </div>
                </div>

                {/* Status dos itens */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {pedido.itens.slice(0, 6).map(item => {
                    const statusBadge = getStatusItemBadge(item.status);
                    return (
                      <div
                        key={item.id}
                        className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusBadge.color}`}
                      >
                        {item.produtoNome.substring(0, 20)}... • {statusBadge.label}
                      </div>
                    );
                  })}
                  {pedido.itens.length > 6 && (
                    <div className="px-3 py-1 rounded-full text-xs font-medium text-[#9CA3AF] bg-[#374151]">
                      +{pedido.itens.length - 6} itens
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPedidoSelecionado(pedido)}
                    className="flex-1 px-4 py-3 rounded-xl bg-[#1A1A1A] border border-[#374151] text-[#D1D5DB] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Ver Detalhes & QR Codes</span>
                  </button>

                  {pedido.statusGeral === 'finalizado' && (
                    <button
                      onClick={() => marcarComoPronto(pedido.id)}
                      className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold hover:from-[#FFD700] hover:to-[#D4AF37] transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Marcar Pronto p/ Carregar</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Detalhes */}
      {pedidoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 overflow-y-auto">
          <div className="w-full max-w-6xl my-8 rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] border-2 border-[#D4AF37] p-8">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-black text-white mb-1">Pedido #{pedidoSelecionado.numeroPedido}</h3>
                <p className="text-[#9CA3AF]">{pedidoSelecionado.cliente} • {pedidoSelecionado.obra}</p>
              </div>
              <button
                onClick={() => setPedidoSelecionado(null)}
                className="p-2 rounded-lg hover:bg-[#374151] transition-all"
              >
                <X className="w-5 h-5 text-[#9CA3AF]" />
              </button>
            </div>

            {/* Itens com controle de status */}
            <div className="space-y-4">
              {pedidoSelecionado.itens.map(item => {
                const etapas = getEtapasProducao();
                
                return (
                  <div key={item.id} className="p-6 rounded-xl bg-[#0F0F0F] border border-[#374151]">
                    
                    {/* Info do item */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h5 className="font-medium text-white mb-1">{item.produtoNome}</h5>
                        <p className="text-sm text-[#9CA3AF]">{item.categoria}</p>
                        <p className="text-sm text-[#9CA3AF] mt-1">
                          Quantidade: {item.quantidade} {item.unidade}
                        </p>
                        {item.observacoesTecnicas && (
                          <p className="text-xs text-[#D4AF37] mt-2">
                            ⚠️ {item.observacoesTecnicas}
                          </p>
                        )}
                      </div>

                      {/* QR Code */}
                      <div className="text-center">
                        <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center mb-2">
                          <QrCode className="w-16 h-16 text-black" />
                        </div>
                        <p className="text-xs text-[#9CA3AF]">{item.codigoQR}</p>
                      </div>
                    </div>

                    {/* Etapas de produção */}
                    <div className="flex items-center gap-2">
                      {etapas.map((etapa, idx) => {
                        const etapaAtual = etapas.indexOf(item.status);
                        const estaEtapa = etapa === item.status;
                        const foiConcluida = idx < etapaAtual;
                        const badge = getStatusItemBadge(etapa);
                        
                        return (
                          <React.Fragment key={etapa}>
                            <button
                              onClick={() => atualizarStatusItem(item.id, etapa)}
                              disabled={etapa === 'aguardando'}
                              className={`
                                flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all
                                ${estaEtapa 
                                  ? `${badge.color} text-white ring-2 ring-white` 
                                  : foiConcluida
                                  ? 'bg-green-500/30 text-green-300'
                                  : 'bg-[#1A1A1A] text-[#6B7280] hover:bg-[#374151]'}
                                disabled:opacity-50 disabled:cursor-not-allowed
                              `}
                            >
                              {foiConcluida && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                              {badge.label}
                            </button>
                            {idx < etapas.length - 1 && (
                              <div className={`w-4 h-[2px] ${foiConcluida ? 'bg-green-500' : 'bg-[#374151]'}`} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer ações */}
            {pedidoSelecionado.statusGeral === 'finalizado' && (
              <div className="mt-6 pt-6 border-t border-[#374151]">
                <button
                  onClick={() => marcarComoPronto(pedidoSelecionado.id)}
                  className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold hover:from-[#FFD700] hover:to-[#D4AF37] transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Marcar Pedido como Pronto para Carregar</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
