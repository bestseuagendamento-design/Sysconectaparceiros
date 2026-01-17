/**
 * COMPONENTE: Acompanhamento de Status de Pedidos (VIDRACEIRO)
 * 
 * Permite ao vidraceiro ver em tempo real o status dos seus pedidos
 * que estão sendo processados pelos fornecedores.
 * 
 * Sincroniza automaticamente com a nuvem para pegar atualizações do fornecedor.
 */

import React, { useState, useEffect } from 'react';
import {
  Package, Clock, CheckCircle, Factory, Truck, MapPin,
  Eye, RefreshCw, AlertCircle, Bell, Calendar, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { buscarDoBanco } from '../../utils/sync';
import { cloudStorage } from '../../utils/cloudStorage';

interface AcompanhamentoStatusPedidosProps {
  vidraceiroId: string;
}

type StatusPedido = 
  | 'pendente' 
  | 'aprovado' 
  | 'em_producao' 
  | 'pronto' 
  | 'despachado' 
  | 'entregue'
  | 'aguardando_aprovacao';

interface Pedido {
  id: string;
  numero?: string;
  fornecedor_nome: string;
  fornecedor_id: string;
  cliente_final?: string;
  valor_total: number;
  status: StatusPedido;
  data_envio: string;
  data_atualizacao?: string;
  previsao_entrega?: string;
  itens?: any[];
}

const STATUS_CONFIG = {
  pendente: {
    label: 'Pendente',
    icon: Clock,
    color: 'text-slate-500',
    bg: 'bg-slate-50',
    border: 'border-slate-200'
  },
  aguardando_aprovacao: {
    label: 'Aguardando Aprovação',
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200'
  },
  aprovado: {
    label: 'Aprovado',
    icon: CheckCircle,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200'
  },
  em_producao: {
    label: 'Em Produção',
    icon: Factory,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200'
  },
  pronto: {
    label: 'Pronto',
    icon: Package,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200'
  },
  despachado: {
    label: 'Despachado',
    icon: Truck,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200'
  },
  entregue: {
    label: 'Entregue',
    icon: CheckCircle,
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200'
  }
};

export function AcompanhamentoStatusPedidos({ vidraceiroId }: AcompanhamentoStatusPedidosProps) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const carregarPedidos = async () => {
    if (!vidraceiroId) return;
    
    try {
      console.log(`📦 [VIDRACEIRO] Buscando pedidos do servidor: ${vidraceiroId}`);

      // 🔥 BUSCA REAL NO SERVIDOR
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos/vidraceiro/${vidraceiroId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const result = await response.json();
        const pedidosNuvem = result.pedidos || [];
        
        console.log(`✅ [VIDRACEIRO] ${pedidosNuvem.length} pedidos carregados do servidor`);
        setPedidos(pedidosNuvem);
        setLastUpdate(new Date().toLocaleTimeString());
      } else {
        console.error('❌ [VIDRACEIRO] Erro HTTP:', response.status);
        setPedidos([]);
      }
    } catch (error) {
      console.error('❌ [VIDRACEIRO] Erro ao buscar pedidos:', error);
      toast.error('Erro ao carregar pedidos');
      setPedidos([]);
    }
  };

  // Carregar pedidos ao montar
  useEffect(() => {
    carregarPedidos();
  }, [vidraceiroId]);

  // Polling automático a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      carregarPedidos();
    }, 5000);

    return () => clearInterval(interval);
  }, [vidraceiroId]);

  const refreshManual = async () => {
    setLoading(true);
    await carregarPedidos();
    setLoading(false);
    toast.success('Pedidos atualizados!');
  };

  // Agrupar pedidos por status
  const pedidosPorStatus = pedidos.reduce((acc, pedido) => {
    const status = pedido.status || 'pendente';
    if (!acc[status]) acc[status] = [];
    acc[status].push(pedido);
    return acc;
  }, {} as Record<string, Pedido[]>);

  const statusOrdem: StatusPedido[] = [
    'pendente',
    'aguardando_aprovacao',
    'aprovado',
    'em_producao',
    'pronto',
    'despachado',
    'entregue'
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Acompanhamento de Pedidos
            </h1>
            <p className="text-slate-600">
              Acompanhe em tempo real o status dos seus pedidos
            </p>
          </div>
          <button
            onClick={refreshManual}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Atualizar</span>
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">{pedidos.length}</div>
            <div className="text-xs text-slate-500">Total de Pedidos</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <div className="text-2xl font-bold text-amber-700">
              {(pedidosPorStatus['aguardando_aprovacao'] || []).length}
            </div>
            <div className="text-xs text-amber-600">Aguardando</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="text-2xl font-bold text-blue-700">
              {(pedidosPorStatus['em_producao'] || []).length}
            </div>
            <div className="text-xs text-blue-600">Em Produção</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="text-2xl font-bold text-green-700">
              {(pedidosPorStatus['entregue'] || []).length}
            </div>
            <div className="text-xs text-green-600">Entregues</div>
          </div>
        </div>

        {lastUpdate && (
          <div className="mt-3 text-xs text-slate-500 flex items-center gap-2">
            <Clock className="w-3 h-3" />
            Última atualização: {lastUpdate}
          </div>
        )}
      </div>

      {/* LISTA DE PEDIDOS POR STATUS */}
      <div className="space-y-6">
        {statusOrdem.map(status => {
          const pedidosStatus = pedidosPorStatus[status] || [];
          if (pedidosStatus.length === 0) return null;

          const config = STATUS_CONFIG[status];
          const Icon = config.icon;

          return (
            <div key={status} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {/* HEADER DO STATUS */}
              <div className={`${config.bg} ${config.border} border-b px-6 py-4`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${config.bg} rounded-xl flex items-center justify-center border ${config.border}`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div>
                    <h3 className={`font-bold ${config.color}`}>
                      {config.label}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {pedidosStatus.length} {pedidosStatus.length === 1 ? 'pedido' : 'pedidos'}
                    </p>
                  </div>
                </div>
              </div>

              {/* LISTA DE PEDIDOS */}
              <div className="divide-y divide-slate-100">
                {pedidosStatus.map(pedido => (
                  <motion.div
                    key={pedido.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedPedido(pedido)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-slate-900">
                            #{pedido.numero || pedido.id.slice(0, 8)}
                          </span>
                          <span className="text-sm text-slate-600">
                            {pedido.fornecedor_nome}
                          </span>
                        </div>
                        
                        {pedido.cliente_final && (
                          <div className="text-xs text-slate-500 mb-1">
                            Cliente: {pedido.cliente_final}
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(pedido.data_envio).toLocaleDateString('pt-BR')}
                          </span>
                          {pedido.data_atualizacao && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Atualizado: {new Date(pedido.data_atualizacao).toLocaleTimeString('pt-BR')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-bold text-lg text-slate-900">
                            R$ {pedido.valor_total?.toFixed(2)}
                          </div>
                          {pedido.itens && (
                            <div className="text-xs text-slate-500">
                              {pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'}
                            </div>
                          )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>

                    {pedido.previsao_entrega && (
                      <div className="mt-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg inline-block">
                        <span className="text-xs font-medium text-blue-700">
                          Previsão: {new Date(pedido.previsao_entrega).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}

        {pedidos.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-600 mb-2">
              Nenhum pedido encontrado
            </h3>
            <p className="text-slate-500">
              Seus pedidos aparecerão aqui quando forem enviados aos fornecedores
            </p>
          </div>
        )}
      </div>

      {/* MODAL DE DETALHES (Futuro) */}
      <AnimatePresence>
        {selectedPedido && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPedido(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl max-w-2xl w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Detalhes do Pedido #{selectedPedido.numero || selectedPedido.id.slice(0, 8)}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Fornecedor</label>
                  <div className="text-slate-900">{selectedPedido.fornecedor_nome}</div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Status Atual</label>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                    STATUS_CONFIG[selectedPedido.status]?.bg
                  } ${STATUS_CONFIG[selectedPedido.status]?.border} border`}>
                    <span className={`font-medium ${STATUS_CONFIG[selectedPedido.status]?.color}`}>
                      {STATUS_CONFIG[selectedPedido.status]?.label}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Valor Total</label>
                  <div className="text-2xl font-bold text-slate-900">
                    R$ {selectedPedido.valor_total?.toFixed(2)}
                  </div>
                </div>

                {selectedPedido.itens && selectedPedido.itens.length > 0 && (
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">
                      Itens do Pedido
                    </label>
                    <div className="space-y-2">
                      {selectedPedido.itens.map((item, idx) => (
                        <div key={idx} className="bg-slate-50 rounded-lg p-3 text-sm">
                          <div className="font-medium text-slate-900">{item.nome || item.descricao}</div>
                          <div className="text-slate-600">
                            Qtd: {item.quantidade} | R$ {item.precoUnitario?.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedPedido(null)}
                className="mt-6 w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
              >
                Fechar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
