import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Truck, 
  Search, 
  Filter,
  ChevronRight,
  ChevronDown,
  Printer,
  Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../utils/supabase/client';
import { toast } from 'sonner@2.0.3';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GlassCAD } from '../GlassCAD';
import { buscarDoBanco, salvarNoBanco } from '../../utils/sync';

// Tipos
export interface PedidoItem {
  sku: string;
  nome: string;
  largura: number;
  altura: number;
  quantidade: number;
  precoUnitario: number;
  total: number;
}

export interface Pedido {
  id: string;
  fornecedorId: string;
  clienteId: string;
  clienteNome: string;
  clienteEmpresa: string;
  status: 'pendente' | 'aprovado' | 'producao' | 'expedicao' | 'em_rota' | 'concluido' | 'cancelado';
  itens: PedidoItem[];
  valorTotal: number;
  dataCriacao: string;
  dataAtualizacao: string;
}

interface PedidosFornecedorProps {
  fornecedorId: string;
}

export function PedidosFornecedor({ fornecedorId }: PedidosFornecedorProps) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  const [statusFiltro, setStatusFiltro] = useState<string>('todos');

  // Carregar pedidos
  const carregarPedidos = async () => {
    try {
      // setLoading(true); // Removido para evitar flicker no polling
      
      console.log(`📡 Buscando pedidos na nuvem para: ${fornecedorId}`);

      // 1. BUSCA REAL NA NUVEM (Prioridade Máxima)
      const pedidosNuvem = await buscarDoBanco('pedido', fornecedorId);
      
      if (pedidosNuvem && pedidosNuvem.length > 0) {
          // Normalizar dados
          const listaNormalizada = pedidosNuvem.map((p: any) => ({
              ...p,
              clienteNome: p.cliente_final || p.clienteNome || 'Cliente Final',
              clienteEmpresa: p.vidraceiro_nome || p.clienteEmpresa || 'Vidraceiro',
              valorTotal: p.valor_total || p.valorTotal,
              dataCriacao: p.data_envio || p.dataCriacao || p.data_criacao || new Date().toISOString(),
              itens: p.itens || []
          }));

          // Ordenar por data (mais recente primeiro)
          listaNormalizada.sort((a: any, b: any) => 
            new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()
          );

          // Verificar se houve mudança para atualizar estado
          setPedidos(prev => {
              if (JSON.stringify(prev) !== JSON.stringify(listaNormalizada)) {
                  console.log(`✅ ${listaNormalizada.length} pedidos sincronizados.`);
                  return listaNormalizada;
              }
              return prev;
          });
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    carregarPedidos();
    
    // Polling REAL de 5 segundos para garantir atualização rápida no teste
    const intervalo = setInterval(carregarPedidos, 5000);
    return () => clearInterval(intervalo);
  }, [fornecedorId]);

  // Atualizar status do pedido
  const atualizarStatus = async (pedido: Pedido, novoStatus: Pedido['status']) => {
    try {
      const pedidoAtualizado = { 
        ...pedido, 
        status: novoStatus,
        dataAtualizacao: new Date().toISOString()
      };

      // 1. Atualizar Estado Local (Feedback Instantâneo)
      setPedidos(prev => prev.map(p => p.id === pedido.id ? pedidoAtualizado : p));
      setPedidoSelecionado(pedidoAtualizado);
      toast.success(`Pedido movido para ${novoStatus.toUpperCase()}`);

      // 2. Salvar na Nuvem (Persistência Real)
      const salvo = await salvarNoBanco('pedido', pedido.id, pedidoAtualizado);
      if (!salvo) {
          toast.warning('Salvo apenas localmente. Verifique conexão.');
      } else {
          console.log(`☁️ Status ${novoStatus} salvo na nuvem.`);
      }

      // 3. Notificar Vidraceiro (Via tabela de notificações ou websocket futuro)
      // (A notificação já é implícita pois o vidraceiro lê o status do pedido na lista dele)

    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status.');
    }
  };

  // Filtragem
  const pedidosFiltrados = pedidos.filter(p => 
    statusFiltro === 'todos' ? true : p.status === statusFiltro
  );

  // Cores dos status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendente': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'aprovado': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'producao': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'expedicao': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'em_rota': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'concluido': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'cancelado': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-400';
    }
  };

  // Ícone do status
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendente': return <Clock className="w-4 h-4" />;
      case 'aprovado': return <CheckCircle className="w-4 h-4" />;
      case 'producao': return <Printer className="w-4 h-4" />;
      case 'expedicao': return <Box className="w-4 h-4" />;
      case 'em_rota': return <Truck className="w-4 h-4" />;
      case 'concluido': return <CheckCircle className="w-4 h-4" />;
      case 'cancelado': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex h-full bg-[#0A0A0A] text-white">
      
      {/* LISTA LATERAL DE PEDIDOS */}
      <div className="w-full md:w-1/3 border-r border-[#222] flex flex-col bg-[#111]">
        
        {/* Header Lista */}
        <div className="p-4 border-b border-[#222]">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <ShoppingBag className="text-[#D4AF37]" />
            Pedidos
          </h2>
          
          <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
            {['todos', 'pendente', 'producao', 'expedicao', 'em_rota', 'concluido'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFiltro(st)}
                className={`
                  px-3 py-1 text-xs rounded-full capitalize border transition-colors
                  ${statusFiltro === st 
                    ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-bold' 
                    : 'bg-transparent text-[#666] border-[#333] hover:border-[#666]'
                  }
                `}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]" />
            <input 
              type="text" 
              placeholder="Buscar cliente ou pedido..." 
              className="w-full bg-[#0A0A0A] border border-[#333] rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Lista Scrollável */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-[#666]">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#D4AF37] mx-auto mb-2"></div>
              Carregando...
            </div>
          ) : pedidosFiltrados.length === 0 ? (
            <div className="p-8 text-center text-[#666]">
              Nenhum pedido encontrado.
            </div>
          ) : (
            <div className="divide-y divide-[#222]">
              {pedidosFiltrados.map(pedido => (
                <button
                  key={pedido.id}
                  onClick={() => setPedidoSelecionado(pedido)}
                  className={`
                    w-full text-left p-4 hover:bg-[#1A1A1A] transition-colors relative
                    ${pedidoSelecionado?.id === pedido.id ? 'bg-[#1A1A1A] border-l-2 border-[#D4AF37]' : 'border-l-2 border-transparent'}
                  `}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-white text-sm">#{pedido.id.slice(-6).toUpperCase()}</span>
                    <span className="text-[10px] text-[#666]">
                      {format(new Date(pedido.dataCriacao), "dd/MM HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <h3 className="font-medium text-[#DDD] text-sm truncate">{pedido.clienteEmpresa}</h3>
                    <p className="text-xs text-[#888]">{pedido.clienteNome}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 border ${getStatusColor(pedido.status)}`}>
                      {getStatusIcon(pedido.status)}
                      {pedido.status.toUpperCase()}
                    </span>
                    <span className="text-sm font-bold text-[#D4AF37]">
                      R$ {pedido.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DETALHE DO PEDIDO (DIREITA) */}
      <div className="flex-1 flex flex-col bg-[#0A0A0A]">
        {pedidoSelecionado ? (
          <>
            {/* Header Detalhe */}
            <div className="p-6 border-b border-[#222] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-white">
                    Pedido #{pedidoSelecionado.id.slice(-6).toUpperCase()}
                  </h2>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(pedidoSelecionado.status.toLowerCase())}`}>
                    {pedidoSelecionado.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-[#888] flex items-center gap-2">
                  {pedidoSelecionado.clienteEmpresa} • {pedidoSelecionado.clienteNome}
                </p>
              </div>

              {/* BARRA DE AÇÕES - Sempre visível */}
              <div className="flex flex-wrap gap-3">
                
                {/* 1. SE PENDENTE -> Aceitar ou Recusar */}
                {pedidoSelecionado.status.toLowerCase() === 'pendente' && (
                  <>
                    <button 
                      onClick={() => atualizarStatus(pedidoSelecionado, 'cancelado')}
                      className="px-4 py-2 border border-red-900 text-red-500 rounded-lg hover:bg-red-900/20 font-medium transition-colors"
                    >
                      Recusar
                    </button>
                    <button 
                      onClick={() => atualizarStatus(pedidoSelecionado, 'aprovado')} 
                      className="px-4 py-2 bg-[#222] text-white rounded-lg hover:bg-[#333] font-medium border border-[#333]"
                    >
                      Aprovar (Aguardar)
                    </button>
                    <button 
                      onClick={() => atualizarStatus(pedidoSelecionado, 'producao')}
                      className="px-6 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8860B] font-bold shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2"
                    >
                      <Printer className="w-4 h-4" />
                      Aprovar & Produzir
                    </button>
                  </>
                )}

                {/* 2. SE APROVADO -> Enviar para Produção */}
                {pedidoSelecionado.status.toLowerCase() === 'aprovado' && (
                    <button 
                      onClick={() => atualizarStatus(pedidoSelecionado, 'producao')}
                      className="px-6 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8860B] font-bold shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2 animate-pulse"
                    >
                      <Printer className="w-4 h-4" />
                      ENVIAR PARA PRODUÇÃO
                    </button>
                )}

                {/* 3. SE EM PRODUÇÃO -> Enviar para Expedição */}
                {pedidoSelecionado.status.toLowerCase() === 'producao' && (
                  <button 
                    onClick={() => atualizarStatus(pedidoSelecionado, 'expedicao')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-lg flex items-center gap-2"
                  >
                    <Box className="w-4 h-4" />
                    Produção Concluída (Ir p/ Expedição)
                  </button>
                )}

                {/* 4. SE EM EXPEDIÇÃO -> Enviar para Entrega */}
                {pedidoSelecionado.status.toLowerCase() === 'expedicao' && (
                  <button 
                    onClick={() => atualizarStatus(pedidoSelecionado, 'em_rota')}
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-bold shadow-lg flex items-center gap-2"
                  >
                    <Truck className="w-4 h-4" />
                    Enviar para Entrega
                  </button>
                )}

                {/* 5. SE EM ROTA -> Confirmar Entrega */}
                {(pedidoSelecionado.status.toLowerCase() === 'em_rota' || pedidoSelecionado.status === 'em_transito') && (
                  <button 
                    onClick={() => atualizarStatus(pedidoSelecionado, 'concluido')}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-lg flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirmar Entrega Realizada
                  </button>
                )}
                
                {/* 6. SE CONCLUÍDO -> Apenas informativo */}
                 {pedidoSelecionado.status.toLowerCase() === 'concluido' && (
                  <div className="px-4 py-2 bg-green-900/20 border border-green-900/50 text-green-500 rounded-lg font-bold flex items-center gap-2 cursor-default">
                    <CheckCircle className="w-4 h-4" />
                    Pedido Finalizado
                  </div>
                )}
              </div>
            </div>

            {/* Conteúdo Detalhe */}
            <div className="flex-1 overflow-y-auto p-6">
              
              {/* Card da Empresa Solicitante (Vidraceiro) */}
              <div className="bg-[#151515] border border-[#222] rounded-xl p-6 mb-6">
                 <div className="flex justify-between items-start mb-4 border-b border-[#222] pb-4">
                     <div>
                        <h3 className="text-sm font-bold text-[#888] uppercase tracking-wider mb-1">
                             Dados do Solicitante
                        </h3>
                         <p className="text-xl font-bold text-white mb-1">{(pedidoSelecionado as any).vidraceiro_nome || pedidoSelecionado.clienteEmpresa}</p>
                         <p className="text-sm text-[#888] font-mono">{(pedidoSelecionado as any).vidraceiro_cnpj || 'CNPJ não informado'}</p>
                     </div>
                     <div className="text-right">
                         <div className="inline-block bg-[#0A0A0A] rounded-lg border border-[#222] p-3 text-left">
                             <p className="text-xs text-[#666] uppercase mb-1">Condição Pagamento</p>
                             <div className="flex items-center justify-end gap-2">
                                 <span className={`text-xl font-bold ${
                                     ((pedidoSelecionado as any).condicao_pagamento || '100%') === '100%' 
                                     ? 'text-blue-500' 
                                     : 'text-emerald-500'
                                 }`}>
                                     {(pedidoSelecionado as any).condicao_pagamento || '100%'}
                                 </span>
                             </div>
                             <p className="text-[10px] text-[#555] mt-1 text-right">
                                 Pago: R$ {((pedidoSelecionado as any).valor_pago_informado || pedidoSelecionado.valorTotal).toFixed(2)}
                             </p>
                         </div>
                     </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2 text-sm text-[#CCC]">
                         <p className="flex items-center gap-2">
                             <span className="text-[#666] w-16">Contato:</span> 
                             <span className="text-white">{(pedidoSelecionado as any).vidraceiro_telefone || '-'}</span>
                         </p>
                         <p className="flex items-center gap-2">
                             <span className="text-[#666] w-16">Email:</span> 
                             <span className="text-white">{(pedidoSelecionado as any).vidraceiro_email || '-'}</span>
                         </p>
                     </div>
                     <div className="space-y-2 text-sm text-[#CCC]">
                         <p className="flex items-start gap-2">
                             <span className="text-[#666] w-16">Endereço:</span> 
                             <span>
                                 {(pedidoSelecionado as any).vidraceiro_endereco}, {(pedidoSelecionado as any).vidraceiro_numero} <br/>
                                 {(pedidoSelecionado as any).vidraceiro_bairro} - {(pedidoSelecionado as any).vidraceiro_cidade}/{(pedidoSelecionado as any).vidraceiro_estado}
                             </span>
                         </p>
                     </div>
                 </div>
              </div>

              {/* Tabela de Itens (NOVO LAYOUT DE PRODUÇÃO) */}
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 mt-8 text-white">
                <Printer className="w-4 h-4 text-[#D4AF37]" /> Fila de Produção & CAD
              </h3>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 pb-10">
                  {pedidoSelecionado.itens.map((item: any, idx) => (
                      <div key={idx} className="bg-[#111] border border-[#222] rounded-xl overflow-hidden hover:border-[#333] transition-colors flex flex-col">
                          {/* Header do Item */}
                          <div className="p-4 border-b border-[#222] flex justify-between items-start bg-[#151515]">
                              <div>
                                  <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs font-bold bg-[#000] text-[#888] px-2 py-1 rounded border border-[#222]">
                                          #{idx + 1}
                                      </span>
                                      <span className="text-sm font-bold text-white font-mono tracking-wide bg-[#222] px-2 py-0.5 rounded text-[#D4AF37]">
                                          {item.codigo_producao || item.sku || `ITEM-${idx}`}
                                      </span>
                                  </div>
                                  <p className="text-sm text-[#EEE] font-medium mt-2">{item.nome || item.descricao}</p>
                                  <p className="text-xs text-[#666] mt-1 flex items-center gap-1">
                                      {item.ambiente ? (
                                          <span className="bg-[#222] px-2 py-0.5 rounded text-[#888]">{item.ambiente}</span>
                                      ) : 'Geral'}
                                  </p>
                              </div>
                              <div className="text-right">
                                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border ${
                                      item.status_producao === 'pronto' 
                                      ? 'bg-green-900/20 text-green-400 border-green-900/30' 
                                      : 'bg-yellow-900/20 text-yellow-500 border-yellow-900/30'
                                  }`}>
                                      {item.status_producao || 'AGUARDANDO'}
                                  </span>
                              </div>
                          </div>

                          {/* Área Visual CAD (Branca para contraste do desenho técnico) */}
                          <div className="p-4 bg-[#E5E5E5] flex items-center justify-center flex-1 min-h-[300px]">
                              <div className="w-full max-w-[350px]">
                                <GlassCAD 
                                    largura={item.largura_cad || item.largura || 0}
                                    altura={item.altura_cad || item.altura || 0}
                                    espessura={item.espessura_cad || 8}
                                    tipo={item.tipo_cad || 'TEMPERADO'}
                                    cor={item.cor_cad || 'INCOLOR'}
                                    codigo={item.codigo_producao}
                                />
                              </div>
                          </div>
                          
                          {/* Footer Técnico */}
                          <div className="p-3 bg-[#111] border-t border-[#222] flex justify-between items-center text-xs text-[#666]">
                              <div className="flex gap-4">
                                  <span>Area: <strong className="text-[#888]">{(((item.largura_cad || item.largura || 0) * (item.altura_cad || item.altura || 0))/1000000).toFixed(4)} m²</strong></span>
                                  <span>Peso: <strong className="text-[#888]">~{((((item.largura_cad || item.largura || 0) * (item.altura_cad || item.altura || 0))/1000000) * ((item.espessura_cad || 8) * 2.5)).toFixed(2)} kg</strong></span>
                              </div>
                              <div className="font-mono text-[#444]">
                                  v.1.0
                              </div>
                          </div>
                      </div>
                  ))}
              </div>

            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[#444]">
            <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">Selecione um pedido para ver detalhes</p>
          </div>
        )}
      </div>
    </div>
  );
}