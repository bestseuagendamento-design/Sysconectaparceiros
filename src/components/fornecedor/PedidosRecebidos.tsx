/**
 * 📦 PEDIDOS RECEBIDOS - FORNECEDOR
 * Sistema completo de gestão de pedidos com aprovação e produção
 */

import React, { useState, useEffect } from 'react';
import { 
  Package, Clock, CheckCircle, X, Eye, Download, 
  FileText, Loader2, AlertCircle, ArrowRight,
  Play, Box, Scissors, Zap, PackageCheck, Truck, MapPin,
  Bug, RefreshCw, ChevronDown, ChevronUp, Search, Bell, Trash2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { fazerVarreduraMassiva } from './VarreduraMassiva';
import { DebugPedidoFornecedor } from './DebugPedidoFornecedor';
import { GlassCAD } from '../GlassCAD'; // 🔥 IMPORTAR GLASSCAD PARA MOSTRAR VISUAL DOS VIDROS

interface PedidosRecebidosProps {
  fornecedorId: string;
  tipoFornecedor: 'vidros' | 'aluminio' | 'acessorios';
}

interface ItemPedido {
  codigo: string;
  descricao: string;
  quantidade: number;
  unidade: string;
  medida?: string;
  valor_unitario?: number;
  valor_total?: number;
  
  // 🔥 NOVOS CAMPOS TÉCNICOS (vindos do itemsExplodidos)
  largura_cad?: number;
  altura_cad?: number;
  espessura_cad?: number;
  tipo_cad?: string;
  cor_cad?: string;
  ambiente?: string;
  codigo_producao?: string;
  status_producao?: string;
  largura?: number;
  altura?: number;
  detalhes?: any;
}

interface Pedido {
  id: string;
  orcamento_id: string;
  vidraceiro_id: string;
  vidraceiro_nome: string;
  vidraceiro_email: string;
  vidraceiro_telefone: string;
  vidraceiro_cidade: string;
  vidraceiro_estado: string;
  
  // Dados do projeto
  cliente_nome: string;
  projeto_largura: number;
  projeto_altura: number;
  projeto_tipo_vidro: string;
  projeto_espessura: number;
  projeto_cor_aluminio?: string;
  projeto_linha: string;
  projeto_sistema: string;
  
  // Itens do pedido
  items: ItemPedido[];
  categoria: string;
  valor_total: number;
  
  // Status e datas
  status: 'aguardando_aprovacao' | 'aprovado' | 'producao' | 'corte' | 'lapidacao' | 'tempera' | 'embalando' | 'carregando' | 'saiu_entrega' | 'entregue' | 'recusado';
  comprovante_url?: string;
  data_pedido: string;
  data_aprovacao?: string;
  data_producao_inicio?: string;
  data_entrega?: string;
  tempo_producao_dias?: number;
  
  // Logística
  rota_rastreio?: string;
  previsao_entrega?: string;
  motorista_nome?: string;
  motorista_telefone?: string;
}

const STATUS_CONFIG = {
  aguardando_aprovacao: { cor: 'orange', label: 'Aguardando Aprovação', icon: Clock },
  aprovado: { cor: 'blue', label: 'Aprovado', icon: CheckCircle },
  producao: { cor: 'purple', label: 'Em Produção', icon: Play },
  corte: { cor: 'cyan', label: 'Corte', icon: Scissors },
  lapidacao: { cor: 'teal', label: 'Lapidação', icon: Box },
  tempera: { cor: 'amber', label: 'Têmpera', icon: Zap },
  embalando: { cor: 'indigo', label: 'Embalando', icon: PackageCheck },
  carregando: { cor: 'violet', label: 'Carregando', icon: Package },
  saiu_entrega: { cor: 'blue', label: 'Saiu para Entrega', icon: Truck },
  entregue: { cor: 'emerald', label: 'Entregue', icon: CheckCircle },
  recusado: { cor: 'red', label: 'Recusado', icon: X }
};

export function PedidosRecebidos({ fornecedorId, tipoFornecedor }: PedidosRecebidosProps) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  const [modalDetalhes, setModalDetalhes] = useState(false);
  const [modalProducao, setModalProducao] = useState(false);
  const [processando, setProcessando] = useState(false);
  
  // 🔥 ESTADOS DE DEBUG
  const [debugExpanded, setDebugExpanded] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>({
    timestamp: null,
    responseStatus: null,
    totalPedidos: 0,
    dadosBrutos: null,
    erros: [],
    tentativas: [], // 🔥 NOVO: Todas as tentativas de busca
    varreduraCompleta: null // 🔥 NOVO: Resultado da varredura massiva
  });
  const [fazendoVarredura, setFazendoVarredura] = useState(false);

  // 🔥 NOVOS ESTADOS: BUSCA E NOTIFICAÇÕES
  const [termoBusca, setTermoBusca] = useState('');
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(3); // Simulado, depois vem do backend

  useEffect(() => {
    carregarPedidos();
    // Atualizar a cada 30 segundos
    const interval = setInterval(carregarPedidos, 30000);
    return () => clearInterval(interval);
  }, [fornecedorId]);

  const carregarPedidos = async () => {
    try {
      console.log('🔥🔥🔥 ========================================== ==');
      console.log('🔥 INICIANDO CARREGAMENTO DE PEDIDOS');
      console.log('🔥 Fornecedor ID:', fornecedorId);
      console.log('🔥 Tipo Fornecedor:', tipoFornecedor);
      console.log('🔥 Project ID:', projectId);
      console.log('🔥 Public Anon Key:', publicAnonKey?.slice(0, 20) + '...');
      
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos/fornecedor/${fornecedorId}`;
      console.log('🔥 URL COMPLETA:', url);
      console.log('🔥🔥🔥 ============================================');
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${publicAnonKey}` }
      });

      console.log('📡 ============================================');
      console.log('📡 RESPOSTA DO SERVIDOR:');
      console.log('📡 Status HTTP:', response.status);
      console.log('📡 Status Text:', response.statusText);
      console.log('📡 Headers:', Object.fromEntries(response.headers.entries()));
      console.log('📡 ============================================');

      if (response.ok) {
        const data = await response.json();
        
        console.log('✅ ============================================');
        console.log('✅ DADOS RECEBIDOS DO SERVIDOR:');
        console.log('✅ Data completo:', JSON.stringify(data, null, 2));
        console.log('✅ Tipo de data:', typeof data);
        console.log('✅ Keys de data:', Object.keys(data));
        console.log('✅ data.success existe?', !!data.success);
        console.log('✅ data.pedidos existe?', !!data.pedidos);
        console.log('✅ Tipo de data.pedidos:', typeof data.pedidos);
        console.log('✅ É array?', Array.isArray(data.pedidos));
        console.log('✅ Quantidade de pedidos:', data.pedidos?.length || 0);
        console.log('✅ ============================================');
        
        // 🔥 VERIFICAR result.success IGUAL NA GESTÃO DE STATUS
        if (data.success && data.pedidos) {
          console.log('✅ SUCCESS = TRUE! Setando pedidos:', data.pedidos.length);
          setPedidos(data.pedidos);
        } else {
          console.error('❌ SUCCESS = FALSE ou pedidos vazio!');
          console.error('❌ data.success:', data.success);
          console.error('❌ data.pedidos:', data.pedidos);
          console.error('❌ data.error:', data.error);
          setPedidos([]);
        }
        
        if (data.pedidos && data.pedidos.length > 0) {
          console.log('📦 ============================================');
          console.log('📦 ANALISANDO PEDIDOS INDIVIDUAIS:');
          data.pedidos.forEach((pedido: any, index: number) => {
            console.log(`📦 --- PEDIDO ${index + 1} ---`);
            console.log('📦 ID:', pedido.id);
            console.log('📦 Status:', pedido.status);
            console.log('📦 Valor Total:', pedido.valor_total);
            console.log('📦 Data Pedido:', pedido.data_pedido);
            console.log('📦 👤 VIDRACEIRO NOME:', pedido.vidraceiro_nome);
            console.log('📦 👤 VIDRACEIRO ID:', pedido.vidraceiro_id);
            console.log('📦 👤 VIDRACEIRO EMAIL:', pedido.vidraceiro_email);
            console.log('📦 👤 VIDRACEIRO TELEFONE:', pedido.vidraceiro_telefone);
            console.log('📦 👤 VIDRACEIRO CIDADE:', pedido.vidraceiro_cidade);
            console.log('📦 👤 VIDRACEIRO ESTADO:', pedido.vidraceiro_estado);
            console.log('📦 🏢 CLIENTE NOME:', pedido.cliente_nome);
            console.log('📦 Pedido completo:', JSON.stringify(pedido, null, 2));
            console.log('📦 -------------------');
          });
          console.log('📦 ============================================');
        } else {
          console.warn('⚠️ ============================================');
          console.warn('⚠️ NENHUM PEDIDO ENCONTRADO!');
          console.warn('⚠️ data.pedidos:', data.pedidos);
          console.warn('⚠️ data.success:', data.success);
          console.warn('⚠️ data.error:', data.error);
          console.warn('⚠️ Verifique se o fornecedor tem pedidos no banco');
          console.warn('⚠️ ============================================');
        }
        
        // 🔥 DEBUG
        setDebugInfo({
          timestamp: new Date().toISOString(),
          responseStatus: response.status,
          totalPedidos: data.pedidos?.length || 0,
          dadosBrutos: data,
          erros: [],
          tentativas: [...debugInfo.tentativas, { timestamp: new Date().toISOString(), status: response.status, data: data }]
        });
        
        console.log('✅ Estado atualizado! Pedidos:', data.pedidos?.length || 0);
        
      } else {
        const errorText = await response.text();
        
        console.error('❌ ============================================');
        console.error('❌ ERRO NA RESPOSTA DO SERVIDOR:');
        console.error('❌ Status:', response.status);
        console.error('❌ Status Text:', response.statusText);
        console.error('❌ Error Text:', errorText);
        console.error('❌ ============================================');
        
        // 🔥 DEBUG
        setDebugInfo({
          timestamp: new Date().toISOString(),
          responseStatus: response.status,
          totalPedidos: 0,
          dadosBrutos: null,
          erros: [{ status: response.status, text: errorText }],
          tentativas: [...debugInfo.tentativas, { timestamp: new Date().toISOString(), status: response.status, error: errorText }]
        });
      }
    } catch (error) {
      console.error('💥 ============================================');
      console.error('💥 ERRO DE EXCEÇÃO:');
      console.error('💥 Error:', error);
      console.error('💥 Error Message:', (error as Error).message);
      console.error('💥 Error Stack:', (error as Error).stack);
      console.error('💥 ============================================');
      
      // 🔥 DEBUG
      setDebugInfo({
        timestamp: new Date().toISOString(),
        responseStatus: null,
        totalPedidos: 0,
        dadosBrutos: null,
        erros: [{ message: (error as Error).message, stack: (error as Error).stack }],
        tentativas: [...debugInfo.tentativas, { timestamp: new Date().toISOString(), error: (error as Error).message }]
      });
    } finally {
      setLoading(false);
      console.log('🏁 CARREGAMENTO FINALIZADO');
      console.log('🏁 ============================================');
    }
  };

  const aprovarPedido = async (pedido: Pedido) => {
    if (!confirm(`Deseja aprovar o pedido ${pedido.id}?`)) return;

    setProcessando(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos/${pedido.id}/aprovar`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            fornecedor_id: fornecedorId,
            data_aprovacao: new Date().toISOString()
          })
        }
      );

      if (response.ok) {
        toast.success('✅ Pedido aprovado!');
        setPedidoSelecionado({ ...pedido, status: 'aprovado', data_aprovacao: new Date().toISOString() });
        carregarPedidos();
        setModalDetalhes(false);
        setModalProducao(true);
      } else {
        toast.error('❌ Erro ao aprovar pedido');
      }
    } catch (error) {
      console.error('Erro ao aprovar:', error);
      toast.error('❌ Erro ao conectar com servidor');
    } finally {
      setProcessando(false);
    }
  };

  const recusarPedido = async (pedido: Pedido) => {
    const motivo = prompt('Motivo da recusa:');
    if (!motivo) return;

    setProcessando(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos/${pedido.id}/recusar`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            fornecedor_id: fornecedorId,
            motivo: motivo
          })
        }
      );

      if (response.ok) {
        toast.success('Pedido recusado');
        carregarPedidos();
        setModalDetalhes(false);
      } else {
        toast.error('❌ Erro ao recusar pedido');
      }
    } catch (error) {
      console.error('Erro ao recusar:', error);
      toast.error('❌ Erro ao conectar com servidor');
    } finally {
      setProcessando(false);
    }
  };

  // 🔥 NOVA FUNÇÃO: EXCLUIR PEDIDO
  const excluirPedido = async (pedido: Pedido) => {
    if (!confirm(`⚠️ ATENÇÃO: Deseja realmente EXCLUIR permanentemente o pedido ${pedido.id}?\n\nEsta ação não pode ser desfeita!`)) return;

    setProcessando(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos/${pedido.id}/excluir`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            fornecedor_id: fornecedorId
          })
        }
      );

      if (response.ok) {
        toast.success('🗑️ Pedido excluído permanentemente');
        carregarPedidos();
        setModalDetalhes(false);
      } else {
        toast.error('❌ Erro ao excluir pedido');
      }
    } catch (error) {
      console.error('Erro ao excluir:', error);
      toast.error('❌ Erro ao conectar com servidor');
    } finally {
      setProcessando(false);
    }
  };

  const atualizarStatusProducao = async (novoStatus: Pedido['status']) => {
    if (!pedidoSelecionado) return;

    setProcessando(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos/${pedidoSelecionado.id}/status`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            status: novoStatus,
            fornecedor_id: fornecedorId,
            data_atualizacao: new Date().toISOString()
          })
        }
      );

      if (response.ok) {
        toast.success(`✅ Status atualizado: ${STATUS_CONFIG[novoStatus].label}`);
        setPedidoSelecionado({ ...pedidoSelecionado, status: novoStatus });
        carregarPedidos();

        // Se chegou em "saiu_entrega", notificar o vidraceiro
        if (novoStatus === 'saiu_entrega') {
          await notificarVidraceiro(pedidoSelecionado.id);
        }
      } else {
        toast.error('❌ Erro ao atualizar status');
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('❌ Erro ao conectar com servidor');
    } finally {
      setProcessando(false);
    }
  };

  const notificarVidraceiro = async (pedidoId: string) => {
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/notificacoes/entrega`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            pedido_id: pedidoId,
            tipo: 'saiu_entrega'
          })
        }
      );
    } catch (error) {
      console.error('Erro ao notificar:', error);
    }
  };

  const pedidosFiltrados = pedidos.filter(p => 
    filtroStatus === 'todos' || p.status === filtroStatus
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-[#0F0F0F] min-h-screen">
      {/* 🔥 BOTÃO PARA MOSTRAR DEBUG (quando escondido) */}
      {!debugExpanded && (
        <button
          onClick={() => setDebugExpanded(true)}
          className="fixed bottom-6 right-6 z-50 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-full shadow-2xl transition-all flex items-center gap-2 animate-pulse"
        >
          <Bug className="w-5 h-5" />
          MOSTRAR DEBUG
        </button>
      )}

      {/* 🔥 PAINEL DE DEBUG - COLAPSÁVEL */}
      {debugExpanded && (
        <div className="bg-yellow-500/10 border-4 border-yellow-500 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Bug className="w-8 h-8 text-yellow-500 animate-pulse" />
              <div>
                <h3 className="font-black text-yellow-500 text-xl">🔍 DEBUG ATIVO</h3>
                <p className="text-yellow-300 text-sm">Abra o Console (F12) para ver os logs detalhados</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDebugExpanded(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all flex items-center gap-2"
              >
                <ChevronUp className="w-5 h-5" />
                ESCONDER DEBUG
              </button>
              <button
                onClick={() => {
                  console.log('🔄 RECARREGANDO PEDIDOS MANUALMENTE...');
                  carregarPedidos();
                }}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                RECARREGAR
              </button>
              <button
                onClick={async () => {
                  setFazendoVarredura(true);
                  const resultado = await fazerVarreduraMassiva(projectId, publicAnonKey, fornecedorId);
                  setDebugInfo(prev => ({ ...prev, varreduraCompleta: resultado }));
                  setFazendoVarredura(false);
                }}
                disabled={fazendoVarredura}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 animate-pulse"
              >
                {fazendoVarredura ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                {fazendoVarredura ? 'VARRENDO...' : '🚨 VARREDURA MASSIVA'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="p-4 bg-black/60 rounded-lg border-2 border-yellow-500/30">
              <p className="text-xs text-yellow-500/70 mb-1">⏰ Última Atualização</p>
              <p className="text-lg font-bold text-white">
                {debugInfo.timestamp ? new Date(debugInfo.timestamp).toLocaleTimeString('pt-BR') : 'Aguardando...'}
              </p>
            </div>
            <div className="p-4 bg-black/60 rounded-lg border-2 border-yellow-500/30">
              <p className="text-xs text-yellow-500/70 mb-1">📡 Status HTTP</p>
              <p className={`text-2xl font-black ${
                debugInfo.responseStatus === 200 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {debugInfo.responseStatus || 'N/A'}
              </p>
            </div>
            <div className="p-4 bg-black/60 rounded-lg border-2 border-yellow-500/30">
              <p className="text-xs text-yellow-500/70 mb-1">📦 Total de Pedidos</p>
              <p className="text-4xl font-black text-yellow-500">{debugInfo.totalPedidos}</p>
            </div>
            <div className="p-4 bg-black/60 rounded-lg border-2 border-yellow-500/30">
              <p className="text-xs text-yellow-500/70 mb-1">⚠️ Erros</p>
              <p className={`text-lg font-bold ${
                debugInfo.erros.length === 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {debugInfo.erros.length === 0 ? '✓ Nenhum' : `${debugInfo.erros.length} erro(s)`}
              </p>
            </div>
          </div>

          {/* Mostra primeiros 2 pedidos */}
          {pedidos.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-yellow-500/70 font-bold">🔎 PRIMEIROS 2 PEDIDOS:</p>
              {pedidos.slice(0, 2).map((p, idx) => (
                <div key={idx} className="p-4 bg-black/80 rounded-lg border-2 border-yellow-500/30">
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-yellow-500/70">ID:</span>
                      <span className="ml-2 text-white font-mono">{p.id.slice(0, 15)}...</span>
                    </div>
                    <div>
                      <span className="text-yellow-500/70">Status:</span>
                      <span className="ml-2 text-emerald-400 font-bold">{p.status}</span>
                    </div>
                    <div>
                      <span className="text-yellow-500/70">Valor:</span>
                      <span className="ml-2 text-white font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.valor_total)}
                      </span>
                    </div>
                    <div className="col-span-3 border-t border-yellow-500/20 pt-2 mt-2">
                      <span className="text-yellow-500/70">👤 VIDRACEIRO:</span>
                      <span className={`ml-2 font-black text-lg ${
                        p.vidraceiro_nome === 'Vidraçaria Parceira' 
                          ? 'text-red-500 animate-pulse' 
                          : 'text-emerald-400'
                      }`}>
                        {p.vidraceiro_nome || '⚠️ SEM NOME'}
                      </span>
                    </div>
                    <div>
                      <span className="text-yellow-500/70">📧:</span>
                      <span className="ml-2 text-white text-xs">{p.vidraceiro_email || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-yellow-500/70">📞:</span>
                      <span className="ml-2 text-white">{p.vidraceiro_telefone || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-yellow-500/70">📍:</span>
                      <span className="ml-2 text-white">{p.vidraceiro_cidade || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Erros visíveis */}
          {debugInfo.erros.length > 0 && (
            <div className="mt-4 p-4 bg-red-500/20 border-2 border-red-500 rounded-lg">
              <p className="text-red-400 font-bold mb-2">❌ ERROS DETECTADOS:</p>
              {debugInfo.erros.map((erro: any, idx: number) => (
                <pre key={idx} className="text-xs text-red-300 overflow-auto">
                  {JSON.stringify(erro, null, 2)}
                </pre>
              ))}
            </div>
          )}

          {/* Resultados da Varredura Massiva */}
          {debugInfo.varreduraCompleta && (
            <div className="mt-4 p-6 bg-red-500/10 border-4 border-red-500 rounded-xl">
              <h4 className="text-red-500 font-black text-lg mb-4">🚨 RESULTADO DA VARREDURA MASSIVA</h4>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-4 bg-black/60 rounded-lg border-2 border-red-500/30">
                  <p className="text-xs text-red-500/70 mb-1">🔍 Tentativas</p>
                  <p className="text-3xl font-black text-red-500">{debugInfo.varreduraCompleta.tentativas?.length || 0}</p>
                </div>
                <div className="p-4 bg-black/60 rounded-lg border-2 border-emerald-500/30">
                  <p className="text-xs text-emerald-500/70 mb-1">✅ Fontes com Dados</p>
                  <p className="text-3xl font-black text-emerald-500">{debugInfo.varreduraCompleta.encontrados?.length || 0}</p>
                </div>
                <div className="p-4 bg-black/60 rounded-lg border-2 border-orange-500/30">
                  <p className="text-xs text-orange-500/70 mb-1">❌ Erros</p>
                  <p className="text-3xl font-black text-orange-500">{debugInfo.varreduraCompleta.erros?.length || 0}</p>
                </div>
              </div>

              {debugInfo.varreduraCompleta.encontrados?.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-emerald-500 font-bold">📦 FONTES COM DADOS ENCONTRADAS:</p>
                  {debugInfo.varreduraCompleta.encontrados.map((fonte: any, idx: number) => (
                    <div key={idx} className="p-4 bg-black/80 rounded-lg border-2 border-emerald-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-emerald-400">{fonte.origem}</span>
                        <span className="px-3 py-1 bg-emerald-500 text-black rounded-full text-sm font-bold">
                          {fonte.total} item(s)
                        </span>
                      </div>
                      <details className="text-xs">
                        <summary className="cursor-pointer text-emerald-300 hover:text-emerald-200">Ver dados...</summary>
                        <pre className="mt-2 p-2 bg-black/60 rounded text-emerald-200 overflow-auto max-h-60">
                          {JSON.stringify(fonte, null, 2)}
                        </pre>
                      </details>
                    </div>
                  ))}
                </div>
              )}

              {debugInfo.varreduraCompleta.tentativas?.length > 0 && (
                <div className="mt-4">
                  <details>
                    <summary className="cursor-pointer text-red-300 hover:text-red-200 font-bold text-sm">
                      📊 Ver todas as tentativas ({debugInfo.varreduraCompleta.tentativas.length})
                    </summary>
                    <div className="mt-3 space-y-2">
                      {debugInfo.varreduraCompleta.tentativas.map((tentativa: any, idx: number) => (
                        <div key={idx} className="p-3 bg-black/60 rounded-lg border border-red-500/20 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-red-300">{tentativa.rota}</span>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                tentativa.status === 200 ? 'bg-emerald-500 text-black' : 'bg-red-500 text-white'
                              }`}>
                                HTTP {tentativa.status}
                              </span>
                              <span className="text-yellow-500">{tentativa.total} item(s)</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 p-3 bg-black/60 rounded-lg border border-yellow-500/30">
            <p className="text-xs text-yellow-500">
              💡 <strong>INSTRUÇÕES:</strong> Clique em "🚨 VARREDURA MASSIVA" para buscar pedidos em TODOS os lugares possíveis do sistema. Abra o Console (F12) para ver logs detalhados.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">📦 Pedidos Recebidos</h2>
          <p className="text-[#9CA3AF]">{pedidos.length} pedidos no total</p>
        </div>

        {/* Filtros */}
        <div className="flex gap-2">
          <button
            onClick={() => setFiltroStatus('todos')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filtroStatus === 'todos'
                ? 'bg-[#D4AF37] text-black'
                : 'bg-[#1A1A1A] text-[#9CA3AF] hover:bg-[#2D2D2D]'
            }`}
          >
            Todos ({pedidos.length})
          </button>
          <button
            onClick={() => setFiltroStatus('aguardando_aprovacao')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filtroStatus === 'aguardando_aprovacao'
                ? 'bg-orange-500 text-white'
                : 'bg-[#1A1A1A] text-[#9CA3AF] hover:bg-[#2D2D2D]'
            }`}
          >
            Novos ({pedidos.filter(p => p.status === 'aguardando_aprovacao').length})
          </button>
          <button
            onClick={() => setFiltroStatus('producao')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filtroStatus === 'producao'
                ? 'bg-purple-500 text-white'
                : 'bg-[#1A1A1A] text-[#9CA3AF] hover:bg-[#2D2D2D]'
            }`}
          >
            Produção ({pedidos.filter(p => ['producao', 'corte', 'lapidacao', 'tempera', 'embalando', 'carregando'].includes(p.status)).length})
          </button>
        </div>
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
            const statusConfig = STATUS_CONFIG[pedido.status] || STATUS_CONFIG['aguardando_aprovacao']; // 🔥 FALLBACK
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={pedido.id}
                className="bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl p-6 hover:border-[#D4AF37] transition-all cursor-pointer"
                onClick={() => {
                  setPedidoSelecionado(pedido);
                  setModalDetalhes(true);
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">#{pedido.id.slice(0, 8)}</h3>
                      <span className={`px-3 py-1 bg-${statusConfig.cor}-500/20 text-${statusConfig.cor}-400 rounded-full text-sm font-medium flex items-center gap-2`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusConfig.label}
                      </span>
                    </div>
                    <p className="text-[#9CA3AF] text-sm mb-1">
                      <strong className="text-white">{pedido.vidraceiro_nome}</strong> • {pedido.vidraceiro_cidade}/{pedido.vidraceiro_estado}
                    </p>
                    <p className="text-[#9CA3AF] text-sm">
                      {pedido.vidraceiro_email}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-black text-[#D4AF37] mb-1">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.valor_total)}
                    </p>
                    <p className="text-xs text-[#9CA3AF]">
                      {new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                {/* 🔥 RESUMO DOS ITENS (SEM dimensões da janela) */}
                <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-[#0F0F0F] rounded-lg">
                  <div>
                    <p className="text-xs text-[#9CA3AF] mb-1">Total de Itens</p>
                    <p className="text-2xl font-black text-[#D4AF37]">
                      {pedido.items.reduce((acc, item) => acc + item.quantidade, 0)} peças
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#9CA3AF] mb-1">Categoria</p>
                    <p className="text-sm font-bold text-white uppercase">
                      {pedido.categoria}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#9CA3AF] mb-1">Vidraçaria</p>
                    <p className="text-sm font-bold text-white">
                      {pedido.vidraceiro_nome}
                    </p>
                  </div>
                </div>

                {/* Ações Rápidas */}
                <div className="flex items-center gap-3">
                  {pedido.status === 'aguardando_aprovacao' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPedidoSelecionado(pedido);
                        setModalDetalhes(true);
                      }}
                      className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Analisar Pedido
                    </button>
                  )}
                  
                  {['producao', 'corte', 'lapidacao', 'tempera', 'embalando', 'carregando'].includes(pedido.status) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPedidoSelecionado(pedido);
                        setModalProducao(true);
                      }}
                      className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Gerenciar Produção
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPedidoSelecionado(pedido);
                      setModalDetalhes(true);
                    }}
                    className="px-4 py-2 bg-[#2D2D2D] hover:bg-[#3D3D3D] text-white rounded-lg transition-all flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Detalhes
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: DETALHES DO PEDIDO */}
      {modalDetalhes && pedidoSelecionado && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-[#1A1A1A] border border-[#2D2D2D] rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-[#1A1A1A] border-b border-[#2D2D2D] p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white mb-1">
                  Pedido #{pedidoSelecionado.id.slice(0, 8)}
                </h2>
                <p className="text-[#9CA3AF]">Detalhes completos</p>
              </div>
              <button
                onClick={() => setModalDetalhes(false)}
                className="p-2 hover:bg-[#2D2D2D] rounded-lg transition-all"
              >
                <X className="w-6 h-6 text-[#9CA3AF]" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="bg-[#0F0F0F] border border-[#2D2D2D] rounded-xl p-6">
                <h3 className="font-bold text-white mb-4">Status do Pedido</h3>
                <div className="flex items-center gap-4">
                  {(() => {
                    const statusConfig = STATUS_CONFIG[pedidoSelecionado.status] || STATUS_CONFIG['aguardando_aprovacao'];
                    const StatusIcon = statusConfig?.icon || Clock;
                    return (
                      <span className={`px-4 py-2 bg-${statusConfig.cor}-500/20 text-${statusConfig.cor}-400 rounded-lg text-sm font-bold flex items-center gap-2`}>
                        <StatusIcon className="w-5 h-5" />
                        {statusConfig.label}
                      </span>
                    );
                  })()}
                  <p className="text-sm text-[#9CA3AF]">
                    Recebido em {new Date(pedidoSelecionado.data_pedido).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>

              {/* Informações do Vidraceiro */}
              <div className="bg-[#0F0F0F] border border-[#2D2D2D] rounded-xl p-6">
                <h3 className="font-bold text-white mb-4">🏢 Dados do Vidraceiro</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#9CA3AF] mb-1">Empresa</p>
                    <p className="text-sm font-bold text-white">{pedidoSelecionado.vidraceiro_nome}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#9CA3AF] mb-1">Email</p>
                    <p className="text-sm font-bold text-white">{pedidoSelecionado.vidraceiro_email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#9CA3AF] mb-1">Telefone</p>
                    <p className="text-sm font-bold text-white">{pedidoSelecionado.vidraceiro_telefone || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#9CA3AF] mb-1">Localização</p>
                    <p className="text-sm font-bold text-white">{pedidoSelecionado.vidraceiro_cidade}/{pedidoSelecionado.vidraceiro_estado}</p>
                  </div>
                </div>
              </div>



              {/* Lista de Itens com GlassCAD */}
              <div className="bg-[#0F0F0F] border border-[#2D2D2D] rounded-xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  📦 Fila de Produção & CAD Técnico
                </h3>
                
                {/* 🔥 GRID DE CARDS COM GLASSCAD */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {pedidoSelecionado.items.map((item, idx) => {
                    const largura = item.largura_cad || item.largura || item.detalhes?.largura || 0;
                    const altura = item.altura_cad || item.altura || item.detalhes?.altura || 0;
                    const espessura = item.espessura_cad || pedidoSelecionado.projeto_espessura || 8;
                    const tipo = item.tipo_cad || pedidoSelecionado.projeto_tipo_vidro || 'TEMPERADO';
                    const cor = item.cor_cad || 'INCOLOR';
                    const codigoProducao = item.codigo_producao || item.codigo || `ITEM-${idx + 1}`;
                    const statusProducao = item.status_producao || 'aguardando';

                    return (
                      <div key={idx} className="bg-[#111] border border-[#222] rounded-xl overflow-hidden hover:border-[#333] transition-colors flex flex-col">
                        {/* Header do Item */}
                        <div className="p-4 border-b border-[#222] flex justify-between items-start bg-[#151515]">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold bg-[#000] text-[#888] px-2 py-1 rounded border border-[#222]">
                                #{idx + 1}
                              </span>
                              <span className="text-sm font-bold text-white font-mono tracking-wide bg-[#222] px-2 py-0.5 rounded text-[#D4AF37]">
                                {codigoProducao}
                              </span>
                            </div>
                            <p className="text-sm text-[#EEE] font-medium mt-2">{item.descricao}</p>
                            {item.ambiente && (
                              <p className="text-xs text-[#666] mt-1 flex items-center gap-1">
                                <span className="bg-[#222] px-2 py-0.5 rounded text-[#888]">{item.ambiente}</span>
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border ${
                              statusProducao === 'pronto' 
                                ? 'bg-green-900/20 text-green-400 border-green-900/30' 
                                : 'bg-yellow-900/20 text-yellow-500 border-yellow-900/30'
                            }`}>
                              {statusProducao}
                            </span>
                          </div>
                        </div>

                        {/* Área Visual CAD */}
                        <div className="p-4 bg-[#E5E5E5] flex items-center justify-center flex-1 min-h-[300px]">
                          <div className="w-full max-w-[350px]">
                            <GlassCAD 
                              largura={largura}
                              altura={altura}
                              espessura={espessura}
                              tipo={tipo}
                              cor={cor}
                              codigo={codigoProducao}
                            />
                          </div>
                        </div>
                        
                        {/* Footer Técnico */}
                        <div className="p-3 bg-[#111] border-t border-[#222] flex justify-between items-center text-xs text-[#666]">
                          <div className="flex gap-4">
                            <span>Área: <strong className="text-[#888]">{((largura * altura)/1000000).toFixed(4)} m²</strong></span>
                            <span>Peso: <strong className="text-[#888]">~{(((largura * altura)/1000000) * (espessura * 2.5)).toFixed(2)} kg</strong></span>
                          </div>
                          <span className="text-[#555]">ESP: <strong className="text-[#888]">{espessura}mm</strong></span>
                        </div>

                        {/* Especificações Detalhadas */}
                        <div className="p-4 bg-[#0A0A0A] border-t border-[#222] grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <p className="text-[#666] mb-1">Largura</p>
                            <p className="text-white font-bold">{largura}mm</p>
                          </div>
                          <div>
                            <p className="text-[#666] mb-1">Altura</p>
                            <p className="text-white font-bold">{altura}mm</p>
                          </div>
                          <div>
                            <p className="text-[#666] mb-1">Tipo</p>
                            <p className="text-white font-bold">{tipo}</p>
                          </div>
                          <div>
                            <p className="text-[#666] mb-1">Cor</p>
                            <p className="text-white font-bold">{cor}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-[#666] mb-1">Quantidade</p>
                            <p className="text-[#D4AF37] font-bold text-lg">{item.quantidade}x</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* TOTAL */}
                <div className="mt-6 p-4 bg-[#1A1A1A] rounded-lg flex items-center justify-between">
                  <span className="text-white font-bold text-lg">VALOR TOTAL DO PEDIDO:</span>
                  <span className="text-3xl font-black text-[#D4AF37]">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedidoSelecionado.valor_total)}
                  </span>
                </div>
              </div>

              {/* Comprovante */}
              {pedidoSelecionado.comprovante_url && (
                <div className="bg-[#0F0F0F] border border-[#2D2D2D] rounded-xl p-6">
                  <h3 className="font-bold text-white mb-4">📄 Comprovante de Pagamento</h3>
                  <button className="px-4 py-2 bg-[#D4AF37] hover:bg-[#B8941E] text-black font-bold rounded-lg transition-all flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Baixar Comprovante
                  </button>
                </div>
              )}

              {/* Ações */}
              {pedidoSelecionado.status === 'aguardando_aprovacao' && (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <button
                      onClick={() => recusarPedido(pedidoSelecionado)}
                      disabled={processando}
                      className="flex-1 px-6 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Recusar Pedido
                    </button>
                    <button
                      onClick={() => aprovarPedido(pedidoSelecionado)}
                      disabled={processando}
                      className="flex-1 px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {processando ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <CheckCircle className="w-5 h-5" />
                      )}
                      Aprovar e Iniciar Produção
                    </button>
                  </div>

                  {/* 🔥 BOTÃO DE EXCLUIR (separado, com cor de alerta) */}
                  <button
                    onClick={() => excluirPedido(pedidoSelecionado)}
                    disabled={processando}
                    className="w-full px-6 py-4 bg-gray-800 hover:bg-gray-900 text-red-400 border-2 border-red-500/50 hover:border-red-500 font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    🗑️ EXCLUIR PEDIDO PERMANENTEMENTE
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: GESTÃO DE PRODUÇÃO */}
      {modalProducao && pedidoSelecionado && (
        <ModalGestaoProducao
          pedido={pedidoSelecionado}
          onClose={() => setModalProducao(false)}
          onAtualizarStatus={atualizarStatusProducao}
          processando={processando}
        />
      )}
      
      {/* 🔥 DEBUG FLUTUANTE */}
      <DebugPedidoFornecedor pedidos={pedidos} />
    </div>
  );
}

// MODAL DE GESTÃO DE PRODUÇÃO
interface ModalGestaoProducaoProps {
  pedido: Pedido;
  onClose: () => void;
  onAtualizarStatus: (status: Pedido['status']) => void;
  processando: boolean;
}

function ModalGestaoProducao({ pedido, onClose, onAtualizarStatus, processando }: ModalGestaoProducaoProps) {
  const etapasProducao: Array<{ status: Pedido['status']; label: string; icon: any; cor: string }> = [
    { status: 'producao', label: 'Em Produção', icon: Play, cor: 'purple' },
    { status: 'corte', label: 'Corte', icon: Scissors, cor: 'cyan' },
    { status: 'lapidacao', label: 'Lapidação', icon: Box, cor: 'teal' },
    { status: 'tempera', label: 'Têmpera', icon: Zap, cor: 'amber' },
    { status: 'embalando', label: 'Embalando', icon: PackageCheck, cor: 'indigo' },
    { status: 'carregando', label: 'Carregando', icon: Package, cor: 'violet' },
    { status: 'saiu_entrega', label: 'Saiu para Entrega', icon: Truck, cor: 'blue' },
  ];

  const indexAtual = etapasProducao.findIndex(e => e.status === pedido.status);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
      <div className="bg-[#1A1A1A] border border-[#2D2D2D] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1A1A1A] border-b border-[#2D2D2D] p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white mb-1">🏭 Gestão de Produção</h2>
            <p className="text-[#9CA3AF]">Pedido #{pedido.id.slice(0, 8)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#2D2D2D] rounded-lg transition-all"
          >
            <X className="w-6 h-6 text-[#9CA3AF]" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Timeline Vertical */}
          <div className="space-y-4">
            {etapasProducao.map((etapa, index) => {
              const EtapaIcon = etapa.icon;
              const concluida = index < indexAtual;
              const atual = index === indexAtual;
              const proxima = index === indexAtual + 1;

              return (
                <div key={etapa.status} className="relative">
                  <div className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    atual 
                      ? `bg-${etapa.cor}-500/20 border-2 border-${etapa.cor}-500` 
                      : concluida
                      ? 'bg-emerald-500/10 border border-emerald-500/30'
                      : 'bg-[#0F0F0F] border border-[#2D2D2D]'
                  }`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      concluida
                        ? 'bg-emerald-500 text-white'
                        : atual
                        ? `bg-${etapa.cor}-500 text-white`
                        : 'bg-[#2D2D2D] text-[#6B7280]'
                    }`}>
                      {concluida ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <EtapaIcon className="w-6 h-6" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className={`font-bold ${atual ? 'text-white' : concluida ? 'text-emerald-400' : 'text-[#6B7280]'}`}>
                        {etapa.label}
                      </h4>
                      {atual && <p className="text-sm text-[#9CA3AF]">Em andamento...</p>}
                      {concluida && <p className="text-sm text-emerald-400">✓ Concluído</p>}
                    </div>

                    {proxima && !processando && (
                      <button
                        onClick={() => onAtualizarStatus(etapa.status)}
                        className={`px-4 py-2 bg-${etapa.cor}-500 hover:bg-${etapa.cor}-600 text-white font-bold rounded-lg transition-all flex items-center gap-2`}
                      >
                        Avançar
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}

                    {atual && index < etapasProducao.length - 1 && (
                      <button
                        onClick={() => onAtualizarStatus(etapasProducao[index + 1].status)}
                        disabled={processando}
                        className={`px-4 py-2 bg-${etapa.cor}-500 hover:bg-${etapa.cor}-600 text-white font-bold rounded-lg transition-all disabled:opacity-50 flex items-center gap-2`}
                      >
                        {processando ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            Concluir Etapa
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Linha Conectora */}
                  {index < etapasProducao.length - 1 && (
                    <div className="ml-6 pl-6 h-4 border-l-2 border-dashed border-[#2D2D2D]" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Botão Marcar como Entregue */}
          {pedido.status === 'saiu_entrega' && (
            <button
              onClick={() => onAtualizarStatus('entregue')}
              disabled={processando}
              className="w-full px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {processando ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Marcar como Entregue
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}