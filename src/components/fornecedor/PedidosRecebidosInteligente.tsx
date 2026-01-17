/**
 * 📦 PEDIDOS RECEBIDOS INTELIGENTE
 * Sistema de gestão de pedidos com identificação de perfil e aprovação/recusa
 */

import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, XCircle, User, Building2, Briefcase, Home, Clock, Filter, Search, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface Pedido {
  id: string;
  vidraceiro_id: string;
  vidraceiro_nome: string;
  vidraceiro_email: string;
  vidraceiro_telefone: string;
  perfil_cliente: 'vidraceiro' | 'serralheiro' | 'arquiteto' | 'engenheiro' | 'construtor' | 'cliente_final';
  data_pedido: string;
  hora_pedido: string;
  status: string;
  valor_total: number;
  items: any[];
  categoria: string;
  cliente?: {
    nome: string;
    telefone: string;
    endereco: string;
  };
}

interface PedidosRecebidosInteligenteProps {
  fornecedorId: string;
}

const PERFIS = [
  { id: 'todos', nome: 'Todos', icone: Package, cor: 'slate' },
  { id: 'vidraceiro', nome: 'Vidraceiros', icone: Building2, cor: 'blue' },
  { id: 'serralheiro', nome: 'Serralheiros', icone: Building2, cor: 'purple' },
  { id: 'arquiteto', nome: 'Arquitetos', icone: Briefcase, cor: 'emerald' },
  { id: 'engenheiro', nome: 'Engenheiros', icone: Briefcase, cor: 'orange' },
  { id: 'construtor', nome: 'Construtores', icone: User, cor: 'amber' },
  { id: 'cliente_final', nome: 'Clientes Finais', icone: Home, cor: 'pink' },
];

export function PedidosRecebidosInteligente({ fornecedorId }: PedidosRecebidosInteligenteProps) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [perfilFiltro, setPerfilFiltro] = useState('todos');
  const [busca, setBusca] = useState('');
  const [processando, setProcessando] = useState<string | null>(null);
  const [modalDetalhes, setModalDetalhes] = useState(false); // 🔥 MODAL DE DETALHES
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null); // 🔥 PEDIDO SELECIONADO

  useEffect(() => {
    carregarPedidos();
  }, [fornecedorId]);

  const carregarPedidos = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos/fornecedor/${fornecedorId}`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('📦 [PEDIDOS RECEBIDOS] Todos os pedidos:', data.pedidos);
        
        // 🔥 MOSTRAR TODOS OS PEDIDOS (não filtrar por status para debug)
        const todosPedidos = data.pedidos || [];
        
        console.log('📊 [PEDIDOS RECEBIDOS] Total de pedidos:', todosPedidos.length);
        console.log('📊 [PEDIDOS RECEBIDOS] Pedidos por status:', todosPedidos.reduce((acc: any, p: any) => {
          acc[p.status] = (acc[p.status] || 0) + 1;
          return acc;
        }, {}));
        
        // Adicionar perfil do cliente (simulado - em produção vem do backend)
        const comPerfil = todosPedidos.map((p: any) => ({
          ...p,
          perfil_cliente: detectarPerfil(p.vidraceiro_email || ''),
          hora_pedido: new Date(p.data_pedido).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          })
        }));
        
        setPedidos(comPerfil);
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      toast.error('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Detectar perfil baseado no email ou metadata
  const detectarPerfil = (email: string): string => {
    // Em produção, isso viria do user_metadata.role
    // Por enquanto, simulação baseada no email
    if (email.includes('vidro') || email.includes('glass')) return 'vidraceiro';
    if (email.includes('serralheria') || email.includes('aluminio')) return 'serralheiro';
    if (email.includes('arq')) return 'arquiteto';
    if (email.includes('eng')) return 'engenheiro';
    if (email.includes('constru')) return 'construtor';
    return 'cliente_final';
  };

  // 🔥 APROVAR PEDIDO → Status: em_producao
  const aprovarPedido = async (pedidoId: string) => {
    setProcessando(pedidoId);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos/${pedidoId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ status: 'em_producao' })
        }
      );

      if (response.ok) {
        toast.success('✅ Pedido aprovado e enviado para produção!');
        setPedidos(prev => prev.filter(p => p.id !== pedidoId));
      } else {
        throw new Error('Erro ao aprovar');
      }
    } catch (error) {
      console.error('Erro ao aprovar pedido:', error);
      toast.error('❌ Erro ao aprovar pedido');
    } finally {
      setProcessando(null);
    }
  };

  // 🔥 RECUSAR PEDIDO → Deleta da lista
  const recusarPedido = async (pedidoId: string) => {
    if (!confirm('Tem certeza que deseja recusar este pedido? Esta ação não pode ser desfeita.')) {
      return;
    }

    setProcessando(pedidoId);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos/${pedidoId}/excluir`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );

      if (response.ok) {
        toast.success('🗑️ Pedido recusado e removido');
        setPedidos(prev => prev.filter(p => p.id !== pedidoId));
      } else {
        throw new Error('Erro ao recusar');
      }
    } catch (error) {
      console.error('Erro ao recusar pedido:', error);
      toast.error('❌ Erro ao recusar pedido');
    } finally {
      setProcessando(null);
    }
  };

  // Filtrar pedidos
  const pedidosFiltrados = pedidos.filter(p => {
    if (perfilFiltro !== 'todos' && p.perfil_cliente !== perfilFiltro) return false;
    if (busca && !p.vidraceiro_nome.toLowerCase().includes(busca.toLowerCase())) return false;
    return true;
  });

  // Agrupar por perfil
  const pedidosPorPerfil = PERFIS.reduce((acc, perfil) => {
    if (perfil.id === 'todos') return acc;
    acc[perfil.id] = pedidos.filter(p => p.perfil_cliente === perfil.id).length;
    return acc;
  }, {} as { [key: string]: number });

  const getIconePerfil = (perfil: string) => {
    const config = PERFIS.find(p => p.id === perfil);
    if (!config) return User;
    return config.icone;
  };

  const getCorPerfil = (perfil: string) => {
    const config = PERFIS.find(p => p.id === perfil);
    return config?.cor || 'slate';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Package className="w-16 h-16 text-slate-300 animate-bounce mx-auto mb-4" />
          <p className="text-slate-500">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-purple-500 rounded-xl">
            <Package className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Pedidos Recebidos</h1>
            <p className="text-slate-600">Gestão inteligente com identificação de perfil</p>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas por Perfil */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {PERFIS.map(perfil => {
          const Icone = perfil.icone;
          const quantidade = perfil.id === 'todos' ? pedidos.length : pedidosPorPerfil[perfil.id] || 0;
          
          return (
            <button
              key={perfil.id}
              onClick={() => setPerfilFiltro(perfil.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                perfilFiltro === perfil.id
                  ? `bg-${perfil.cor}-100 border-${perfil.cor}-500`
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <Icone className={`w-6 h-6 mb-2 ${perfilFiltro === perfil.id ? `text-${perfil.cor}-600` : 'text-slate-400'}`} />
              <p className={`text-2xl font-black ${perfilFiltro === perfil.id ? `text-${perfil.cor}-600` : 'text-slate-900'}`}>
                {quantidade}
              </p>
              <p className="text-xs text-slate-600">{perfil.nome}</p>
            </button>
          );
        })}
      </div>

      {/* Barra de Busca */}
      <div className="bg-white rounded-xl p-4 mb-6 border border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome do cliente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Lista de Pedidos */}
      {pedidosFiltrados.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Nenhum pedido aguardando aprovação.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidosFiltrados.map((pedido, idx) => {
            const IconePerfil = getIconePerfil(pedido.perfil_cliente);
            const cor = getCorPerfil(pedido.perfil_cliente);
            const perfilNome = PERFIS.find(p => p.id === pedido.perfil_cliente)?.nome || 'Cliente';

            return (
              <motion.div
                key={pedido.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-white rounded-xl border-2 border-${cor}-200 overflow-hidden`}
              >
                <div className="p-6">
                  {/* Header do Pedido */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 bg-${cor}-100 rounded-xl`}>
                        <IconePerfil className={`w-6 h-6 text-${cor}-600`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-black text-slate-900">{pedido.vidraceiro_nome}</h3>
                          <span className={`px-3 py-1 bg-${cor}-100 text-${cor}-700 text-xs font-bold rounded-full`}>
                            {perfilNome}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{pedido.vidraceiro_email}</p>
                        <p className="text-sm text-slate-600">{pedido.vidraceiro_telefone}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-3xl font-black text-emerald-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.valor_total)}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(pedido.data_pedido).toLocaleDateString('pt-BR')} às {pedido.hora_pedido}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Itens do Pedido */}
                  <div className="bg-slate-50 rounded-lg p-4 mb-4">
                    <p className="text-sm font-bold text-slate-700 mb-3">📦 Itens do Pedido ({pedido.items?.length || 0}):</p>
                    
                    {/* 🔥 CLIENTE FINAL */}
                    {pedido.cliente && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                        <p className="text-xs font-bold text-blue-700 mb-1">👤 CLIENTE FINAL:</p>
                        <p className="text-sm font-bold text-slate-900">{pedido.cliente.nome || 'Não informado'}</p>
                        {pedido.cliente.telefone && <p className="text-xs text-slate-600">📞 {pedido.cliente.telefone}</p>}
                        {pedido.cliente.endereco && <p className="text-xs text-slate-600">📍 {pedido.cliente.endereco}</p>}
                      </div>
                    )}
                    
                    {/* 🔥 LISTA DE ITENS COM DIMENSÕES */}
                    <div className="space-y-2">
                      {pedido.items?.map((item: any, itemIdx: number) => (
                        <div key={itemIdx} className="bg-white border border-slate-200 rounded-lg p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="font-bold text-slate-900 mb-1">
                                {item.descricao || item.tipo || 'Item sem descrição'}
                              </p>
                              
                              {/* 🔥 DIMENSÕES */}
                              {(item.largura || item.altura) && (
                                <div className="flex items-center gap-3 text-sm text-slate-600 mb-1">
                                  <span className="font-medium">📏 Dimensões:</span>
                                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">
                                    {item.largura || 0}m × {item.altura || 0}m
                                  </span>
                                  {item.quantidade && (
                                    <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">
                                      {item.quantidade}x
                                    </span>
                                  )}
                                </div>
                              )}
                              
                              {/* 🔥 DETALHES ADICIONAIS */}
                              <div className="flex flex-wrap gap-2 text-xs">
                                {item.tipo && (
                                  <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded">
                                    {item.tipo}
                                  </span>
                                )}
                                {item.cor && (
                                  <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded">
                                    Cor: {item.cor}
                                  </span>
                                )}
                                {item.espessura && (
                                  <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded">
                                    Espessura: {item.espessura}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* 🔥 VALOR */}
                            <div className="text-right">
                              {item.valorUnitario && (
                                <p className="text-xs text-slate-500">Unit: R$ {item.valorUnitario.toFixed(2)}</p>
                              )}
                              {item.valorTotal && (
                                <p className="text-lg font-bold text-emerald-600">
                                  R$ {item.valorTotal.toFixed(2)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => aprovarPedido(pedido.id)}
                      disabled={processando === pedido.id}
                      className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      {processando === pedido.id ? 'Aprovando...' : 'Aprovar e Enviar para Produção'}
                    </button>

                    <button
                      onClick={() => recusarPedido(pedido.id)}
                      disabled={processando === pedido.id}
                      className="flex-1 py-3 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                      {processando === pedido.id ? 'Recusando...' : 'Recusar Pedido'}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Informação de Ações */}
      <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-bold mb-1">Como funciona:</p>
            <ul className="space-y-1 ml-4">
              <li>✅ <strong>Aprovar:</strong> O pedido vai automaticamente para produção</li>
              <li>❌ <strong>Recusar:</strong> O pedido é removido permanentemente da lista</li>
              <li>📊 Os pedidos são organizados por perfil do cliente para melhor gestão</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}