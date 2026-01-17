/**
 * 📦 MEUS PEDIDOS - VIDRACEIRO
 * Histórico completo com notificações, rastreamento e avaliações
 */

import React, { useState, useEffect } from 'react';
import {
  Package, Clock, CheckCircle, Truck, MapPin, Star,
  Eye, Download, X, Loader2, Bell, AlertCircle, Calendar, Timer, ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { supabase } from '../../utils/supabase/client';
import { buscarDoBanco } from '../../utils/sync';

interface MeusPedidosProps {
  vidraceiroId?: string;
  onNavigate?: (screen: string) => void;
}

interface Pedido {
  id: string;
  fornecedor_nome: string;
  fornecedor_logo?: string;
  categoria: string;
  valor_total: number;
  status: string;
  data_pedido: string;
  data_aprovacao?: string;
  data_producao_inicio?: string;
  data_entrega?: string;
  tempo_producao_dias?: number;
  previsao_entrega?: string;
  rota_rastreio?: string;
  items: any[];
  notificacao_entrega?: boolean;
  avaliacao?: number;
  comentario_avaliacao?: string;
  
  // Dados do projeto
  projeto_largura: number;
  projeto_altura: number;
  projeto_tipo_vidro: string;
  projeto_espessura: number;

  // Dados do Cliente (Gestão Completa)
  cliente_nome?: string;
  cliente_endereco?: string;
}

const STATUS_CONFIG: any = {
  aguardando_aprovacao: { cor: 'orange', label: 'Aguardando Aprovação', icon: Clock },
  aprovado: { cor: 'blue', label: 'Aprovado - Fila de Produção', icon: CheckCircle },
  producao: { cor: 'purple', label: 'Em Produção', icon: Package },
  corte: { cor: 'cyan', label: 'Corte', icon: Package },
  lapidacao: { cor: 'teal', label: 'Lapidação', icon: Package },
  tempera: { cor: 'amber', label: 'Têmpera', icon: Package },
  embalando: { cor: 'indigo', label: 'Embalando', icon: Package },
  expedicao: { cor: 'emerald', label: 'Produção Concluída', icon: CheckCircle }, // Status Novo
  pronto: { cor: 'emerald', label: 'Produção Concluída', icon: CheckCircle }, // Status Novo
  saiu_entrega: { cor: 'blue', label: 'Em Rota de Entrega', icon: Truck },
  em_rota: { cor: 'blue', label: 'Em Rota de Entrega', icon: Truck },
  entregue: { cor: 'gray', label: 'Entregue / Finalizado', icon: CheckCircle },
  concluido: { cor: 'gray', label: 'Entregue / Finalizado', icon: CheckCircle },
  recusado: { cor: 'red', label: 'Recusado', icon: X }
};

export function MeusPedidos({ vidraceiroId, onNavigate }: MeusPedidosProps) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  const [modalDetalhes, setModalDetalhes] = useState(false);
  const [modalRastreio, setModalRastreio] = useState(false);
  const [modalAvaliacao, setModalAvaliacao] = useState(false);
  const [modalAgendamento, setModalAgendamento] = useState(false); // Novo Modal
  const [avaliacao, setAvaliacao] = useState(5);
  const [comentario, setComentario] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  // Notificações
  const [notificacoes, setNotificacoes] = useState<string[]>([]);
  
  // 🔥 NOVOS ESTADOS DE DEBUG
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [debugExpanded, setDebugExpanded] = useState(true);
  const [debugCarregamento, setDebugCarregamento] = useState<any[]>([]); // Histórico de carregamentos

  useEffect(() => {
    carregarPedidos();
    carregarNotificacoes();
    
    // Listener para atualização em tempo real
    const handleUpdate = () => {
        console.log("🔄 Atualizando pedidos via evento global...");
        carregarPedidos();
    };
    window.addEventListener('pedidos_vidraceiro_updated', handleUpdate);
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(() => {
      carregarPedidos();
      carregarNotificacoes();
    }, 30000);
    
    return () => {
        clearInterval(interval);
        window.removeEventListener('pedidos_vidraceiro_updated', handleUpdate);
    };
  }, [vidraceiroId]);

  const carregarPedidos = async () => {
    if (!vidraceiroId) return;

    const timestamp = new Date().toISOString();
    console.log(`📦 [${timestamp}] Buscando meus pedidos do servidor: ${vidraceiroId}`);

    // 🔥 REGISTRAR TENTATIVA DE CARREGAMENTO
    const tentativa: any = {
      timestamp,
      vidraceiroId,
      pedidosAntesDoCarregamento: pedidos.length,
      status: 'iniciando'
    };

    try {
      // 🔥 BUSCA REAL NO SERVIDOR COM A CHAVE CORRETA
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos/listar/${vidraceiroId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      tentativa.httpStatus = response.status;
      tentativa.httpOk = response.ok;

      if (!response.ok) {
        tentativa.status = 'erro_http';
        tentativa.erro = `Erro HTTP: ${response.status}`;
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const result = await response.json();
      const pedidosNuvem = result.pedidos || [];
      
      tentativa.totalRecebidoDoServidor = pedidosNuvem.length;
      tentativa.primeirosPedidos = pedidosNuvem.slice(0, 3).map((p: any) => ({
        id: p.id?.slice(0, 8),
        status: p.status,
        fornecedor_nome: p.fornecedor_nome,
        vidraceiro_nome: p.vidraceiro_nome,
        cliente_nome: p.cliente_nome
      }));
      
      console.log(`✅ [${timestamp}] ${pedidosNuvem.length} pedidos encontrados no servidor`);
      
      if (pedidosNuvem.length > 0) {
        // Normalizar e Ordenar
        const listaNormalizada = pedidosNuvem.map((p: any) => ({
          ...p,
          // Normalizações de compatibilidade
          status: p.status || 'pendente',
          data_pedido: p.data_pedido || new Date().toISOString()
        }));

        listaNormalizada.sort((a: any, b: any) => 
          new Date(b.data_pedido).getTime() - new Date(a.data_pedido).getTime()
        );

        // Atualizar estado
        setPedidos(listaNormalizada);
        tentativa.status = 'sucesso';
        tentativa.pedidosDepoisDoCarregamento = listaNormalizada.length;
      } else {
        // ⚠️ NÃO limpar se não houver pedidos - pode ser erro temporário
        console.log(`⚠️ [${timestamp}] Nenhum pedido no servidor, mantendo estado atual`);
        tentativa.status = 'servidor_vazio';
        tentativa.pedidosDepoisDoCarregamento = pedidos.length;
        tentativa.nota = 'Mantendo pedidos locais pois servidor retornou vazio';
      }

    } catch (error: any) {
      console.error(`❌ [${timestamp}] Erro ao carregar pedidos do servidor:`, error);
      tentativa.status = 'erro_catch';
      tentativa.erro = error?.message || String(error);
      tentativa.pedidosDepoisDoCarregamento = pedidos.length;
      tentativa.nota = 'Mantendo pedidos locais em caso de erro';
      // ⚠️ NÃO limpar pedidos em caso de erro - manter estado atual
      console.log(`⚠️ [${timestamp}] Mantendo pedidos locais em caso de erro`);
    } finally {
      setLoading(false);
      
      // 🔥 SALVAR NO HISTÓRICO DE DEBUG
      setDebugCarregamento(prev => [...prev, tentativa].slice(-10)); // Manter últimos 10
      
      console.log(`🔍 [${timestamp}] DEBUG CARREGAMENTO:`, tentativa);
    }
  };

  const carregarNotificacoes = async () => {
    if (!projectId || !vidraceiroId) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/notificacoes/vidraceiro/${vidraceiroId}`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        const novasNotificacoes = data.notificacoes || [];
        
        // Mostrar toast para pedidos que saíram para entrega
        novasNotificacoes.forEach((pedidoId: string) => {
          if (!notificacoes.includes(pedidoId)) {
            const pedido = pedidos.find(p => p.id === pedidoId);
            if (pedido) {
              mostrarNotificacaoEntrega(pedido);
            }
          }
        });
        
        setNotificacoes(novasNotificacoes);
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  };

  const mostrarNotificacaoEntrega = (pedido: Pedido) => {
    toast.success(
      <div className="flex flex-col gap-2">
        <p className="font-bold">🚚 Pedido #{pedido.id.slice(0, 8)} saiu para entrega!</p>
        <p className="text-sm">Fornecedor: {pedido.fornecedor_nome}</p>
        <button
          onClick={() => {
            setPedidoSelecionado(pedido);
            setModalRastreio(true);
          }}
          className="px-3 py-1 bg-[#D4AF37] text-black rounded font-bold text-sm mt-2"
        >
          Acompanhar Rota
        </button>
      </div>,
      { duration: 10000 }
    );
  };

  const abrirRastreio = (pedido: Pedido) => {
    setPedidoSelecionado(pedido);
    setModalRastreio(true);
  };

  const confirmarRecebimento = async (pedido: Pedido) => {
    if (!confirm('Confirmar que você recebeu este pedido?')) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos/${pedido.id}/confirmar-recebimento`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            vidraceiro_id: vidraceiroId,
            data_recebimento: new Date().toISOString()
          })
        }
      );

      if (response.ok) {
        toast.success('✅ Recebimento confirmado!');
        setPedidoSelecionado(pedido);
        setModalAgendamento(true); // Abre agendamento primeiro
        carregarPedidos();
      }
    } catch (error) {
      console.error('Erro ao confirmar recebimento:', error);
      toast.error('Erro ao confirmar recebimento');
    }
  };

  const excluirPedido = async (pedidoId: string) => {
      if(!confirm('Tem certeza? Isso ocultará o pedido da sua lista.')) return;
      
      // 🔥 REMOVER DO SERVIDOR (TODO: criar endpoint para deletar pedido)
      // Por enquanto, apenas atualiza localmente
      const novosPedidos = pedidos.filter(p => p.id !== pedidoId);
      setPedidos(novosPedidos);
      toast.success('Pedido removido da lista');
      
      // TODO: Implementar DELETE no servidor
      // await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos/${pedidoId}`, { method: 'DELETE' });
  };

  const handleAgendarInstalacao = (data: string) => {
      // Aqui salvaria na agenda
      toast.success(`📅 Instalação agendada para ${new Date(data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}`);
      setModalAgendamento(false);
      setModalAvaliacao(true);
  };

  const handlePularAgendamento = () => {
      setModalAgendamento(false);
      setModalAvaliacao(true);
  };

  const enviarAvaliacao = async () => {
    if (!pedidoSelecionado) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos/${pedidoSelecionado.id}/avaliar`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            vidraceiro_id: vidraceiroId,
            avaliacao: avaliacao,
            comentario: comentario
          })
        }
      );

      if (response.ok) {
        toast.success('✅ Avaliação enviada com sucesso!');
        setModalAvaliacao(false);
        setAvaliacao(5);
        setComentario('');
        carregarPedidos();
      }
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      toast.error('Erro ao enviar avaliação');
    }
  };

  const pedidosFiltrados = pedidos.filter(p => {
    if (filtroStatus === 'todos') return true;
    
    const status = p.status ? p.status.toLowerCase() : 'novo';
    
    // ABA PENDENTES: Inclui APROVADO
    if (filtroStatus === 'pendentes') {
        return ['novo', 'aguardando_aprovacao', 'aguardando', 'pendente', 'aprovado'].includes(status);
    }
    
    // ABA PRODUÇÃO
    if (filtroStatus === 'producao') {
        return ['producao', 'corte', 'lapidacao', 'tempera', 'embalando', 'em_producao'].includes(status);
    }
    
    // ABA PRODUÇÃO CONCLUÍDA (Expedição)
    if (filtroStatus === 'concluida') {
        return ['expedicao', 'pronto', 'carregando'].includes(status);
    }
    
    // ABA EM ROTA DE ENTREGA
    if (filtroStatus === 'em_rota') {
        return ['saiu_entrega', 'em_rota', 'em_transito'].includes(status);
    }
    
    // ABA FINALIZADOS
    if (filtroStatus === 'finalizados') {
        return ['entregue', 'concluido', 'recebido'].includes(status);
    }
    
    return p.status === filtroStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header com Notificações */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onNavigate && (
            <button 
              onClick={() => onNavigate('dashboard')}
              className="p-2 bg-[#2D2D2D] hover:bg-[#3D3D3D] rounded-lg transition-all text-white hover:text-[#D4AF37]"
              title="Voltar para Dashboard"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <div>
            <h2 className="text-2xl font-black text-white">📦 Meus Pedidos</h2>
            <p className="text-[#9CA3AF]">{pedidos.length} pedidos realizados</p>
          </div>
        </div>

        {notificacoes.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500 rounded-lg">
            <Bell className="w-5 h-5 text-blue-400 animate-pulse" />
            <span className="text-blue-400 font-bold">{notificacoes.length} novos</span>
          </div>
        )}
      </div>

      {/* 🔥🔥🔥 BOTÃO DE DEBUG - VERIFICAR DADOS NO SERVIDOR */}
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-red-400 font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              DEBUG - Verificar Pedidos no Banco
            </h3>
            <p className="text-red-300 text-sm mt-1">
              Clique para listar TODOS os pedidos salvos no KV Store
            </p>
          </div>
          <button
            onClick={async () => {
              try {
                toast.loading('Buscando pedidos no KV Store...');
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
                console.log('🔍 DEBUG - PEDIDOS NO KV:', result);
                
                // Salvar informações de debug
                setDebugInfo(result);
                
                toast.dismiss();
                toast.success(`${result.total} pedidos encontrados no banco!`);
              } catch (error) {
                toast.dismiss();
                toast.error('Erro ao buscar pedidos do banco');
                console.error(error);
              }
            }}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-all"
          >
            🔍 Verificar Banco
          </button>
        </div>
      </div>

      {/* 🔥🔥🔥 PAINEL DE DEBUG EXPANDIDO */}
      {debugInfo && (
        <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg overflow-hidden">
          <button
            onClick={() => setDebugExpanded(!debugExpanded)}
            className="w-full p-4 flex items-center justify-between hover:bg-yellow-900/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
              <div className="text-left">
                <h3 className="text-yellow-400 font-bold">
                  🔍 Diagnóstico Completo
                </h3>
                <p className="text-yellow-300 text-sm">
                  {debugInfo.total} pedidos no banco • {pedidos.length} pedidos exibidos
                </p>
              </div>
            </div>
            <div className="text-yellow-400 text-2xl">
              {debugExpanded ? '▼' : '▶'}
            </div>
          </button>

          {debugExpanded && (
            <div className="p-4 border-t border-yellow-500/30 bg-black/40 space-y-4">
              {/* 1. INFORMAÇÕES BÁSICAS */}
              <div className="bg-yellow-900/10 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="text-yellow-300 font-bold mb-3 flex items-center gap-2">
                  📊 Informações Básicas
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-yellow-400/70">Meu User ID:</p>
                    <p className="text-white font-mono text-xs break-all">{vidraceiroId}</p>
                  </div>
                  <div>
                    <p className="text-yellow-400/70">Total no Banco:</p>
                    <p className="text-white font-bold text-lg">{debugInfo.total} pedidos</p>
                  </div>
                  <div>
                    <p className="text-yellow-400/70">Exibidos na Tela:</p>
                    <p className="text-white font-bold text-lg">{pedidos.length} pedidos</p>
                  </div>
                  <div>
                    <p className="text-yellow-400/70">Status:</p>
                    <p className={`font-bold ${debugInfo.total > 0 && pedidos.length === 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {debugInfo.total > 0 && pedidos.length === 0 ? '❌ FILTRO ERRADO' : '✅ OK'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. ESTRUTURA DOS DADOS */}
              <div className="bg-yellow-900/10 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="text-yellow-300 font-bold mb-3 flex items-center gap-2">
                  🔑 Estrutura das Chaves
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-black/40 p-3 rounded">
                    <p className="text-yellow-400/70 mb-1">Sistema Antigo (chaves individuais):</p>
                    <p className="text-white font-mono text-xs">
                      pedido:fornecedor:forn-vidro-01:xxxxx
                    </p>
                    <p className="text-emerald-400 text-xs mt-1">
                      {debugInfo.pedidos_antigos?.length || 0} pedidos encontrados
                    </p>
                  </div>
                  <div className="bg-black/40 p-3 rounded">
                    <p className="text-yellow-400/70 mb-1">Sistema Novo (array completo):</p>
                    <p className="text-white font-mono text-xs">
                      pedidos:{vidraceiroId}
                    </p>
                    <p className="text-emerald-400 text-xs mt-1">
                      {debugInfo.pedidos_novos?.length || 0} pedidos encontrados
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. ANÁLISE DE DADOS */}
              {debugInfo.analise && (
                <div className="bg-yellow-900/10 border border-yellow-500/30 rounded-lg p-4">
                  <h4 className="text-yellow-300 font-bold mb-3 flex items-center gap-2">
                    🔬 Análise Detalhada
                  </h4>
                  <div className="space-y-3 text-xs">
                    {debugInfo.analise.antigos?.length > 0 && (
                      <div>
                        <p className="text-yellow-400 font-bold mb-2">Primeiros 3 pedidos (sistema antigo):</p>
                        {debugInfo.analise.antigos.map((p: any, i: number) => (
                          <div key={i} className="bg-black/40 p-2 rounded mb-2 font-mono">
                            <p className="text-white">ID: {p.id}</p>
                            <p className="text-cyan-400">Vidraceiro: {p.vidraceiro_id}</p>
                            <p className="text-purple-400">Fornecedor: {p.fornecedor_id}</p>
                            <p className="text-orange-400">Status: {p.status}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {debugInfo.analise.novos?.length > 0 && (
                      <div>
                        <p className="text-yellow-400 font-bold mb-2">Sistema novo (arrays):</p>
                        {debugInfo.analise.novos.map((p: any, i: number) => (
                          <div key={i} className="bg-black/40 p-2 rounded mb-2 font-mono">
                            <p className="text-white">Total de pedidos: {p.total_pedidos}</p>
                            <p className="text-cyan-400">Primeiro pedido: {p.primeiro_pedido}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 4. DIAGNÓSTICO */}
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                  🚨 Diagnóstico do Problema
                </h4>
                <div className="space-y-2 text-sm">
                  {debugInfo.total > 0 && pedidos.length === 0 ? (
                    <>
                      <p className="text-red-300">❌ <strong>PROBLEMA IDENTIFICADO:</strong></p>
                      <p className="text-white">
                        Os pedidos estão salvos com chaves DIFERENTES do seu userId!
                      </p>
                      <div className="bg-black/40 p-3 rounded mt-2">
                        <p className="text-yellow-300 text-xs mb-1">Seu userId:</p>
                        <p className="text-white font-mono text-xs break-all">{vidraceiroId}</p>
                        <p className="text-yellow-300 text-xs mt-2 mb-1">Chave esperada:</p>
                        <p className="text-white font-mono text-xs">
                          pedido:vidraceiro:{vidraceiroId}:*
                        </p>
                        <p className="text-red-400 text-xs mt-2">
                          Mas os pedidos foram salvos com chaves de FORNECEDOR!
                        </p>
                      </div>
                      
                      {/* 🔥 BOTÃO DE MIGRAÇÃO */}
                      {debugInfo.analise?.antigos?.[0]?.vidraceiro_id && 
                       debugInfo.analise.antigos[0].vidraceiro_id !== vidraceiroId && (
                        <div className="mt-4 pt-4 border-t border-red-500/30">
                          <p className="text-yellow-300 font-bold mb-2 flex items-center gap-2">
                            🔧 Solução Automática:
                          </p>
                          <p className="text-white text-xs mb-3">
                            Migrar os {debugInfo.total} pedidos do userId antigo para o atual
                          </p>
                          <button
                            onClick={async () => {
                              const userId_antigo = debugInfo.analise.antigos[0].vidraceiro_id;
                              const userId_novo = vidraceiroId;
                              
                              if (!confirm(`Migrar ${debugInfo.total} pedidos de\n\n${userId_antigo}\n\npara\n\n${userId_novo}?`)) {
                                return;
                              }
                              
                              try {
                                toast.loading('Migrando pedidos...');
                                
                                const response = await fetch(
                                  `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/debug/migrar-pedidos`,
                                  {
                                    method: 'POST',
                                    headers: {
                                      'Authorization': `Bearer ${publicAnonKey}`,
                                      'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ userId_antigo, userId_novo })
                                  }
                                );
                                
                                const result = await response.json();
                                
                                toast.dismiss();
                                
                                if (result.success) {
                                  toast.success(`✅ ${result.total_migrado} pedidos migrados!`);
                                  // Recarregar pedidos
                                  setTimeout(() => {
                                    carregarPedidos();
                                    setDebugInfo(null);
                                  }, 1000);
                                } else {
                                  toast.error(`Erro: ${result.error || result.message}`);
                                }
                              } catch (error) {
                                toast.dismiss();
                                toast.error('Erro ao migrar pedidos');
                                console.error(error);
                              }
                            }}
                            className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                          >
                            🔄 MIGRAR {debugInfo.total} PEDIDOS AGORA
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-green-400">✅ Tudo está funcionando corretamente!</p>
                  )}
                </div>
              </div>

              {/* 5. CONSOLE LOG */}
              <div className="bg-blue-900/10 border border-blue-500/30 rounded-lg p-3">
                <p className="text-blue-300 text-xs">
                  💡 Veja o console (F12) para dados completos em JSON
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filtros de Status */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setFiltroStatus('todos')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
            filtroStatus === 'todos'
              ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
              : 'bg-[#1A1A1A] text-[#9CA3AF] hover:bg-[#2D2D2D]'
          }`}
        >
          Todos ({pedidos.length})
        </button>

        <button
          onClick={() => setFiltroStatus('pendentes')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
            filtroStatus === 'pendentes'
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
              : 'bg-[#1A1A1A] text-[#9CA3AF] hover:bg-[#2D2D2D]'
          }`}
        >
          Pendentes ({pedidos.filter(p => ['novo', 'aguardando_aprovacao', 'aguardando', 'pendente', 'aprovado'].includes(p.status)).length})
        </button>

        <button
          onClick={() => setFiltroStatus('producao')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
            filtroStatus === 'producao'
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
              : 'bg-[#1A1A1A] text-[#9CA3AF] hover:bg-[#2D2D2D]'
          }`}
        >
          Em Produção ({pedidos.filter(p => ['producao', 'corte', 'lapidacao', 'tempera', 'embalando'].includes(p.status)).length})
        </button>

        <button
          onClick={() => setFiltroStatus('concluida')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
            filtroStatus === 'concluida'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
              : 'bg-[#1A1A1A] text-[#9CA3AF] hover:bg-[#2D2D2D]'
          }`}
        >
          Produção Concluída ({pedidos.filter(p => ['expedicao', 'pronto', 'carregando'].includes(p.status)).length})
        </button>

        <button
          onClick={() => setFiltroStatus('em_rota')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
            filtroStatus === 'em_rota'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'bg-[#1A1A1A] text-[#9CA3AF] hover:bg-[#2D2D2D]'
          }`}
        >
          Em Rota de Entrega ({pedidos.filter(p => ['saiu_entrega', 'em_rota', 'em_transito'].includes(p.status)).length})
        </button>
        
        <button
          onClick={() => setFiltroStatus('finalizados')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
            filtroStatus === 'finalizados'
              ? 'bg-gray-600 text-white'
              : 'bg-[#1A1A1A] text-[#9CA3AF] hover:bg-[#2D2D2D]'
          }`}
        >
          Finalizados ({pedidos.filter(p => ['entregue', 'concluido', 'recebido'].includes(p.status)).length})
        </button>
      </div>

      {/* Lista de Pedidos */}
      {pedidosFiltrados.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-16 h-16 text-[#2D2D2D] mx-auto mb-4" />
          <p className="text-[#9CA3AF]">Nenhum pedido encontrado</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pedidosFiltrados.map((pedido) => {
            const statusConfig = STATUS_CONFIG[pedido.status];
            const StatusIcon = statusConfig?.icon || Package;
            const temNotificacao = notificacoes.includes(pedido.id);

            return (
              <div
                key={pedido.id}
                className={`bg-[#1A1A1A] border rounded-xl p-6 hover:border-[#D4AF37] transition-all cursor-pointer ${
                  temNotificacao ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-[#2D2D2D]'
                }`}
                onClick={() => {
                  setPedidoSelecionado(pedido);
                  setModalDetalhes(true);
                }}
              >
                {temNotificacao && (
                  <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500 rounded-lg flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-400 animate-pulse" />
                    <span className="text-blue-400 font-bold">🚚 Pedido saiu para entrega!</span>
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
                  <div className="flex-1 w-full">
                    {/* NOME DO CLIENTE - GESTÃO COMPLETA */}
                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-[#2D2D2D]">
                        <div className="w-10 h-10 min-w-[2.5rem] rounded-full bg-gradient-to-br from-[#2C5F6F] to-[#1A3A45] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#2C5F6F]/20">
                            {pedido.cliente_nome ? pedido.cliente_nome.substring(0,2).toUpperCase() : 'CL'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-white font-bold text-lg leading-tight truncate">
                                {pedido.cliente_nome || 'Cliente não informado'}
                            </p>
                            <p className="text-[#9CA3AF] text-xs flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                {pedido.cliente_endereco || 'Endereço da obra não informado'}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-sm font-mono text-[#555]">Pedido #{pedido.id.slice(0, 8)}</h3>
                      <span className={`px-3 py-1 bg-${statusConfig?.cor || 'gray'}-500/20 text-${statusConfig?.cor || 'gray'}-400 rounded-full text-xs md:text-sm font-medium flex items-center gap-2 whitespace-nowrap`}>
                        <StatusIcon className="w-3 h-3 md:w-4 md:h-4" />
                        {statusConfig?.label || pedido.status}
                      </span>
                    </div>
                    <p className="text-[#9CA3AF] text-sm mb-1">
                      Fornecedor: <strong className="text-white">{pedido.fornecedor_nome}</strong>
                    </p>
                    <p className="text-[#9CA3AF] text-sm">
                      {pedido.categoria.toUpperCase()} • {pedido.items.length} itens
                    </p>
                  </div>

                  <div className="text-left md:text-right w-full md:w-auto bg-[#111] md:bg-transparent p-3 md:p-0 rounded-lg border border-[#222] md:border-none flex flex-row md:flex-col justify-between md:justify-start items-center md:items-end">
                    <div>
                        <p className="text-xs text-[#9CA3AF] md:hidden">Valor Total</p>
                        <p className="text-xl md:text-2xl font-black text-[#D4AF37] mb-0 md:mb-1">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.valor_total)}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-[#9CA3AF] md:hidden">Data</p>
                        <p className="text-xs text-[#9CA3AF]">
                        {new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}
                        </p>
                    </div>
                  </div>
                </div>

                {/* Informações do Projeto */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 p-3 bg-[#0F0F0F] rounded-lg">
                  <div>
                    <p className="text-xs text-[#9CA3AF] mb-1">Dimensões</p>
                    <p className="text-sm font-bold text-white">
                      {pedido.projeto_largura}×{pedido.projeto_altura}mm
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#9CA3AF] mb-1">Vidro</p>
                    <p className="text-sm font-bold text-white">
                      {pedido.projeto_tipo_vidro} {pedido.projeto_espessura}mm
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#9CA3AF] mb-1">Tempo Produção</p>
                    <p className="text-sm font-bold text-white">
                      {pedido.tempo_producao_dias ? `${pedido.tempo_producao_dias} dias` : '-'}
                    </p>
                  </div>
                </div>

                {/* Avaliação */}
                {pedido.avaliacao && (
                  <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < pedido.avaliacao! ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-[#2D2D2D]'
                          }`}
                        />
                      ))}
                    </div>
                    {pedido.comentario_avaliacao && (
                      <p className="text-sm text-emerald-400">{pedido.comentario_avaliacao}</p>
                    )}
                  </div>
                )}

                {/* Ações */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                  {filtroStatus === 'todos' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          excluirPedido(pedido.id);
                        }}
                        className="flex-1 px-4 py-3 md:py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-lg transition-all flex items-center justify-center gap-2 border border-red-500/50"
                      >
                        <X className="w-4 h-4" />
                        Ocultar da Lista
                      </button>
                  ) : (
                    <>
                      {['saiu_entrega', 'em_rota', 'em_transito'].includes(pedido.status) && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              abrirRastreio(pedido);
                            }}
                            className="flex-1 px-4 py-3 md:py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                          >
                            <MapPin className="w-4 h-4" />
                            Rastrear
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmarRecebimento(pedido);
                            }}
                            className="flex-1 px-4 py-3 md:py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 animate-pulse"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Confirmar Entrega
                          </button>
                        </>
                      )}

                      {['entregue', 'concluido', 'recebido'].includes(pedido.status) && !pedido.avaliacao && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPedidoSelecionado(pedido);
                            setModalAvaliacao(true);
                          }}
                          className="flex-1 px-4 py-3 md:py-2 bg-[#D4AF37] hover:bg-[#B8941E] text-black font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                          <Star className="w-4 h-4" />
                          Avaliar Fornecedor
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPedidoSelecionado(pedido);
                          setModalDetalhes(true);
                        }}
                        className="px-4 py-3 md:py-2 bg-[#2D2D2D] hover:bg-[#3D3D3D] text-white rounded-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Detalhes
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: DETALHES DO PEDIDO */}
      {modalDetalhes && pedidoSelecionado && (
        <ModalDetalhesPedido
          pedido={pedidoSelecionado}
          onClose={() => setModalDetalhes(false)}
        />
      )}

      {/* MODAL: RASTREAMENTO */}
      {modalRastreio && pedidoSelecionado && (
        <ModalRastreamento
          pedido={pedidoSelecionado}
          onClose={() => setModalRastreio(false)}
        />
      )}

      {/* MODAL: AVALIAÇÃO */}
      {modalAvaliacao && pedidoSelecionado && (
        <ModalAvaliacao
          pedido={pedidoSelecionado}
          avaliacao={avaliacao}
          setAvaliacao={setAvaliacao}
          comentario={comentario}
          setComentario={setComentario}
          onEnviar={enviarAvaliacao}
          onClose={() => setModalAvaliacao(false)}
        />
      )}

      {/* MODAL: AGENDAR INSTALAÇÃO */}
      {modalAgendamento && pedidoSelecionado && (
        <ModalAgendarInstalacao
          pedido={pedidoSelecionado}
          onAgendar={handleAgendarInstalacao}
          onPular={handlePularAgendamento}
          onClose={() => setModalAgendamento(false)}
        />
      )}
    </div>
  );
}

// MODAL DE DETALHES
function ModalDetalhesPedido({ pedido, onClose }: { pedido: Pedido; onClose: () => void }) {
  const statusConfig = STATUS_CONFIG[pedido.status];
  const StatusIcon = statusConfig?.icon || Package;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 md:p-6">
      <div className="bg-[#1A1A1A] w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col border border-[#2D2D2D]">
        <div className="p-4 border-b border-[#2D2D2D] flex justify-between items-center bg-[#111]">
          <div>
            <h3 className="text-lg font-bold text-white">Detalhes do Pedido</h3>
            <p className="text-xs text-[#9CA3AF]">#{pedido.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#2D2D2D] rounded-full text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center gap-3 p-4 bg-[#111] rounded-xl border border-[#2D2D2D]">
            <div className={`p-3 rounded-full bg-${statusConfig?.cor || 'gray'}-500/20 text-${statusConfig?.cor || 'gray'}-400`}>
              <StatusIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-[#9CA3AF] uppercase font-bold">Status Atual</p>
              <p className="text-lg font-bold text-white">{statusConfig?.label || pedido.status}</p>
            </div>
          </div>

          {/* Itens */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#D4AF37]" />
              Itens do Pedido
            </h4>
            <div className="space-y-2">
              {pedido.items?.map((item: any, idx: number) => (
                <div key={idx} className="p-3 bg-[#111] rounded-lg border border-[#2D2D2D] flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-white">{item.descricao || item.nome}</p>
                    <p className="text-xs text-[#9CA3AF]">
                      {item.largura}x{item.altura}mm • {item.quantidade} un
                    </p>
                  </div>
                  <p className="text-sm font-bold text-[#D4AF37]">
                    R$ {((item.total || 0)).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Financeiro */}
          <div className="p-4 bg-[#111] rounded-xl border border-[#2D2D2D]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-[#9CA3AF]">Subtotal</span>
              <span className="text-sm text-white font-mono">R$ {pedido.valor_total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-[#2D2D2D]">
              <span className="text-base font-bold text-white">Total</span>
              <span className="text-xl font-black text-[#D4AF37]">R$ {pedido.valor_total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#2D2D2D] bg-[#111]">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-[#2D2D2D] hover:bg-[#3D3D3D] text-white rounded-xl font-bold transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

// MODAL RASTREAMENTO (Simples)
function ModalRastreamento({ pedido, onClose }: { pedido: Pedido; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] w-full max-w-md rounded-2xl p-6 border border-[#2D2D2D] text-center">
        <Truck className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-bounce" />
        <h3 className="text-xl font-bold text-white mb-2">Pedido em Rota</h3>
        <p className="text-[#9CA3AF] mb-6">
          Seu pedido saiu da fábrica e está a caminho da sua vidraçaria.
        </p>
        
        <div className="bg-[#111] p-4 rounded-xl border border-[#2D2D2D] text-left mb-6 relative overflow-hidden">
           {/* Linha do tempo visual */}
           <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-[#333]"></div>
           
           <div className="relative z-10 space-y-6">
              <div className="flex gap-4">
                 <div className="w-4 h-4 rounded-full bg-green-500 mt-1 ring-4 ring-[#1A1A1A]"></div>
                 <div>
                    <p className="text-sm font-bold text-white">Saiu da Fábrica</p>
                    <p className="text-xs text-[#666]">Hoje, 08:30</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="w-4 h-4 rounded-full bg-blue-500 mt-1 ring-4 ring-[#1A1A1A] animate-pulse"></div>
                 <div>
                    <p className="text-sm font-bold text-blue-400">Em Trânsito</p>
                    <p className="text-xs text-[#666]">Previsão: 14:00 - 16:00</p>
                 </div>
              </div>
              <div className="flex gap-4 opacity-50">
                 <div className="w-4 h-4 rounded-full bg-[#333] mt-1 ring-4 ring-[#1A1A1A]"></div>
                 <div>
                    <p className="text-sm font-bold text-white">Entregue</p>
                    <p className="text-xs text-[#666]">Aguardando...</p>
                 </div>
              </div>
           </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}

// MODAL AVALIAÇÃO
function ModalAvaliacao({ 
  pedido, avaliacao, setAvaliacao, comentario, setComentario, onEnviar, onClose 
}: any) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] w-full max-w-md rounded-2xl p-6 border border-[#2D2D2D]">
        <h3 className="text-xl font-bold text-white mb-4 text-center">Avaliar Entrega</h3>
        
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setAvaliacao(star)}
              className="p-1 hover:scale-110 transition-transform"
            >
              <Star 
                className={`w-8 h-8 ${star <= avaliacao ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-[#333]'}`} 
              />
            </button>
          ))}
        </div>

        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Deixe um comentário sobre a qualidade do material..."
          className="w-full bg-[#111] border border-[#333] rounded-xl p-3 text-white text-sm mb-4 h-24 focus:outline-none focus:border-[#D4AF37]"
        />

        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-[#2D2D2D] hover:bg-[#3D3D3D] text-white rounded-xl font-bold transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={onEnviar}
            className="flex-1 py-3 bg-[#D4AF37] hover:bg-[#B8941E] text-black font-bold rounded-xl transition-colors"
          >
            Enviar Avaliação
          </button>
        </div>
      </div>
    </div>
  );
}

// MODAL AGENDAR INSTALAÇÃO (Novo)
function ModalAgendarInstalacao({ pedido, onAgendar, onPular, onClose }: any) {
    const [data, setData] = useState('');

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#1A1A1A] w-full max-w-sm rounded-2xl p-6 border border-[#333] shadow-2xl">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Material Recebido!</h3>
                    <p className="text-[#9CA3AF] text-sm">
                        Deseja agendar a instalação deste pedido agora?
                    </p>
                </div>

                <div className="mb-6">
                    <label className="block text-xs font-bold text-[#666] uppercase mb-2">Data Prevista da Instalação</label>
                    <input 
                        type="date" 
                        className="w-full bg-[#111] border border-[#333] rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                        onChange={(e) => setData(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <button 
                        onClick={() => data ? onAgendar(data) : toast.error('Selecione uma data')}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        <Calendar className="w-4 h-4" />
                        Agendar Instalação
                    </button>
                    <button 
                        onClick={onPular}
                        className="w-full py-3 bg-transparent hover:bg-[#222] text-[#666] font-bold rounded-xl transition-colors"
                    >
                        Pular agendamento
                    </button>
                </div>
            </div>
        </div>
    );
}