import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Clock, 
  Package, 
  ArrowUpRight,
  ScanBarcode,
  LayoutDashboard,
  ShoppingCart,
  PlusCircle,
  DollarSign,
  Users,
  Truck,
  Settings,
  PackageOpen,
  Sparkles,
  Edit3,
  Save,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { ScannerFabrica } from './ScannerFabrica';
import { DebugSupabase } from './DebugSupabase'; // 🔥 NOVO
import { DebugSalvamento } from '../debug/DebugSalvamento'; // 🔥 DEBUG DE SALVAMENTO
import { CriarPedidosFake } from '../debug/CriarPedidosFake'; // 🔥 CRIAR PEDIDOS FAKE
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface HomeFornecedorProps {
  userName: string;
  nomeEmpresa: string;
  fornecedorId: string; // 🔥 ID DO FORNECEDOR PARA BUSCAR PEDIDOS
  setActiveTab?: (tab: string) => void;
}

export function HomeFornecedor({ userName, nomeEmpresa, fornecedorId, setActiveTab }: HomeFornecedorProps) {
  const [showScanner, setShowScanner] = useState(false);
  const [showFaturamento, setShowFaturamento] = useState(true); // 🔥 CONTROLE DE VISIBILIDADE
  const [pedidosPendentes, setPedidosPendentes] = useState(0);
  
  // 🔥 ESTATÍSTICAS COMPLETAS POR STATUS
  const [pedidosStats, setPedidosStats] = useState({
    pendente: 0,      // aguardando_aprovacao
    aprovado: 0,      // aprovado
    producao: 0,      // producao + corte + lapidacao + tempera + embalando + carregando
    entrega: 0,       // saiu_entrega
    entregue: 0       // entregue
  });
  
  const [producaoStats, setProducaoStats] = useState({
    corte: 0,
    lapidacao: 0,
    tempera: 0,
    totalItems: 0
  });

  // 🔥 EDITOR DE BANNER
  const [editandoBanner, setEditandoBanner] = useState(false);
  const [bannerData, setBannerData] = useState({
    titulo: 'Semana do Temperado Santa Rita',
    descricao: 'Feche seus orçamentos de Vidro 8mm até amanhã e garanta 15% OFF no pagamento à vista.',
    preco: '',
    unidade: 'm²',
    validade: '',
  });

  const salvarBanner = async () => {
    try {
      if (!bannerData.titulo || !bannerData.descricao) {
        toast.error('Preencha título e descrição');
        return;
      }

      // 🔥 SALVAR VIA SERVIDOR (BYPASS RLS)
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/kv/set`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          key: 'campanha_SC',
          value: {
            ...bannerData,
            validade: bannerData.validade || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          }
        })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erro ao salvar');
      }

      toast.success('✅ Banner salvo! Aparecerá para todos os vidraceiros de SC');
      setEditandoBanner(false);
    } catch (err: any) {
      console.error('Erro ao salvar banner:', err);
      toast.error(`Erro ao salvar: ${err.message || 'Tente novamente'}`);
    }
  };

  // Função para calcular estatísticas reais do "Chão de Fábrica" (NUVEM)
  const calcularProducao = async () => {
    try {
        // 🔥 DESABILITADO - Não vamos calcular produção na home por enquanto
        // Apenas mostrar zero ou buscar do servidor se necessário
        setProducaoStats({ corte: 0, lapidacao: 0, tempera: 0, totalItems: 0 });
    } catch (e) {
        console.error("Erro ao calcular produção", e);
    }
  };

  // 🔥 CARREGAR ESTATÍSTICAS COMPLETAS
  const carregarEstatisticas = async () => {
    try {
        // 🔥 BUSCAR DO SERVIDOR (Multi-tenancy)
        console.log('🔍 [HOME FORNECEDOR] Buscando estatísticas do fornecedor:', nomeEmpresa);
        
        const url = `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/estatisticas/fornecedor/${encodeURIComponent(nomeEmpresa)}`;
        console.log('📡 [HOME FORNECEDOR] URL:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${publicAnonKey}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('📡 [HOME FORNECEDOR] Response status:', response.status);

        if (response.ok) {
            const result = await response.json();
            const estatisticas = result.estatisticas || {};
            
            console.log('📊 [HOME FORNECEDOR] Estatísticas completas:', JSON.stringify(estatisticas, null, 2));
            
            // 🔥 ATUALIZAR ESTADO COM ESTATÍSTICAS
            setPedidosStats({
                pendente: estatisticas.pendente || 0,
                aprovado: estatisticas.aprovado || 0,
                producao: estatisticas.producao || 0,
                entrega: estatisticas.entrega || 0,
                entregue: estatisticas.entregue || 0
            });
            setPedidosPendentes(estatisticas.pendente || 0);
            
            console.log('✅ [HOME FORNECEDOR] Estado atualizado com sucesso!');
            console.log('🔢 [HOME FORNECEDOR] pedidosStats:', { pendente: estatisticas.pendente, aprovado: estatisticas.aprovado, producao: estatisticas.producao, entrega: estatisticas.entrega, entregue: estatisticas.entregue });
        } else {
            console.error('❌ [HOME FORNECEDOR] Erro ao buscar estatísticas - Status:', response.status);
            const errorText = await response.text();
            console.error('❌ [HOME FORNECEDOR] Erro detalhado:', errorText);
        }
    } catch (error) {
        console.error('❌ [HOME FORNECEDOR] ERRO CRÍTICO ao carregar estatísticas:', error);
    }
  };

  // 🔥 CARREGAR PEDIDOS RECENTES
  const carregarPedidosRecentes = async () => {
    try {
        // 🔥 BUSCAR DO SERVIDOR (Multi-tenancy)
        console.log('🔍 [HOME FORNECEDOR] Buscando pedidos recentes do fornecedor:', nomeEmpresa);
        
        const url = `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos/fornecedor/${encodeURIComponent(nomeEmpresa)}`;
        console.log('📡 [HOME FORNECEDOR] URL:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${publicAnonKey}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('📡 [HOME FORNECEDOR] Response status:', response.status);

        if (response.ok) {
            const result = await response.json();
            const pedidos = result.pedidos || [];
            
            console.log('📦 [HOME FORNECEDOR] Total de pedidos recebidos:', pedidos.length);
            console.log('📦 [HOME FORNECEDOR] Pedidos completos:', JSON.stringify(pedidos, null, 2));
            
            // 🔥 CONTAR POR STATUS
            const countPendente = pedidos.filter((p: any) => p.status === 'aguardando_aprovacao').length;
            const countAprovado = pedidos.filter((p: any) => p.status === 'aprovado').length;
            const countProducao = pedidos.filter((p: any) => ['producao', 'corte', 'lapidacao', 'tempera', 'embalando', 'carregando'].includes(p.status)).length;
            const countEntrega = pedidos.filter((p: any) => p.status === 'saiu_entrega').length;
            const countEntregue = pedidos.filter((p: any) => p.status === 'entregue').length;
            
            console.log('📊 [HOME FORNECEDOR] ESTATÍSTICAS POR STATUS:');
            console.log('  ⏳ Pendente (aguardando_aprovacao):', countPendente);
            console.log('  ✅ Aprovado:', countAprovado);
            console.log('  ⚙️  Produção (producao/corte/lapidacao/tempera/embalando/carregando):', countProducao);
            console.log('  🚚 Entrega (saiu_entrega):', countEntrega);
            console.log('  ✔️  Entregue:', countEntregue);
            
            // 🔥 LISTA DE STATUS DE CADA PEDIDO
            pedidos.forEach((p: any, idx: number) => {
                console.log(`  📦 Pedido ${idx + 1}: ${p.id?.slice(0, 8)} - Status: "${p.status}" - Vidraceiro: ${p.vidraceiro_nome}`);
            });
            
            setPedidosStats({
                pendente: countPendente,
                aprovado: countAprovado,
                producao: countProducao,
                entrega: countEntrega,
                entregue: countEntregue
            });
            setPedidosPendentes(countPendente);
            
            console.log('✅ [HOME FORNECEDOR] Estado atualizado com sucesso!');
            console.log('🔢 [HOME FORNECEDOR] pedidosStats:', { pendente: countPendente, aprovado: countAprovado, producao: countProducao, entrega: countEntrega, entregue: countEntregue });
        } else {
            console.error('❌ [HOME FORNECEDOR] Erro ao buscar pedidos - Status:', response.status);
            const errorText = await response.text();
            console.error('❌ [HOME FORNECEDOR] Erro detalhado:', errorText);
        }
    } catch (error) {
        console.error('❌ [HOME FORNECEDOR] ERRO CRÍTICO ao carregar pedidos:', error);
    }
  };

  // 🔥 AUTO-INICIALIZAR TABELA DE PREÇOS COMPLETA (apenas na primeira vez)
  const inicializarTabelaPrecos = async () => {
    try {
        // 🔥 BUSCAR DO SERVIDOR - Usando a rota correta que já existe
        console.log('🔍 [HOME FORNECEDOR] Verificando inicialização da tabela de preços para o fornecedor:', fornecedorId);
        
        const url = `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/tabela-precos/${encodeURIComponent(fornecedorId)}`;
        console.log('📡 [HOME FORNECEDOR] URL:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${publicAnonKey}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('📡 [HOME FORNECEDOR] Response status:', response.status);

        if (response.ok) {
            const result = await response.json();
            const tabela = result.tabela || {};
            
            console.log('📊 [HOME FORNECEDOR] Tabela de preços:', Object.keys(tabela).length, 'itens');
            
            // 🔥 VERIFICAR SE A TABELA ESTÁ VAZIA
            if (Object.keys(tabela).length === 0) {
                console.log('⚠️ [HOME FORNECEDOR] Tabela de preços vazia - primeira execução detectada');
                toast.info('Inicializando tabela de preços...');
            } else {
                console.log('✅ [HOME FORNECEDOR] Tabela de preços já inicializada');
            }
        } else {
            console.error('❌ [HOME FORNECEDOR] Erro ao verificar tabela de preços - Status:', response.status);
            const errorText = await response.text();
            console.error('❌ [HOME FORNECEDOR] Erro detalhado ao verificar tabela de preços:', errorText);
        }
    } catch (error) {
        console.error('❌ [HOME FORNECEDOR] ERRO CRÍTICO ao inicializar tabela de preços:', error);
    }
  };

  useEffect(() => {
    carregarEstatisticas();
    carregarPedidosRecentes();
    // 🔥 AUTO-INICIALIZAR TABELA DE PREÇOS COMPLETA (apenas na primeira vez)
    inicializarTabelaPrecos();
  }, [fornecedorId]);
  
  // KPIs Reais
  const kpis = [
    {
      id: 1,
      titulo: 'Pedidos Pendentes',
      valor: pedidosPendentes.toString(),
      subtexto: 'Aguardando aprovação',
      cor: '#D4AF37',
      icon: Clock,
      trend: 'Atualizado Agora'
    },
    {
      id: 2,
      titulo: 'Produção Hoje',
      valor: `${producaoStats.totalItems} pçs`,
      subtexto: 'Itens em fluxo',
      cor: '#10B981',
      icon: Package,
      trend: 'Tempo Real'
    },
    {
      id: 3,
      titulo: 'Faturamento Dia',
      valor: 'R$ 0,00',
      subtexto: 'Ticket médio R$ 0,00',
      cor: '#3B82F6',
      icon: TrendingUp,
      trend: 'Aguardando Vendas'
    }
  ];

  // 🔥 CARDS DA SIDEBAR (MESMAS FUNÇÕES, SÓ QUE EM CARDS)
  const menuCards = [
    { 
      id: 'criar-orcamento', 
      label: 'Criar Orçamento', 
      icon: PlusCircle,
      gradient: 'from-slate-50 to-slate-100',
      textColor: 'text-slate-900',
      desc: 'Criar orçamento para vidraceiros'
    },
    { 
      id: 'pedidos', 
      label: 'Novos Pedidos Recebidos', 
      icon: ShoppingCart,
      gradient: 'from-slate-50 to-slate-100',
      textColor: 'text-slate-900',
      desc: `${pedidosPendentes} aguardando aprovação`,
      badge: pedidosPendentes > 0 ? pedidosPendentes : null
    },
    { 
      id: 'tabela-precos', 
      label: 'Gestão de Tabela de Preços', 
      icon: DollarSign,
      gradient: 'from-slate-50 to-slate-100',
      textColor: 'text-slate-900',
      desc: 'Gerencie preços de produtos'
    },
    { 
      id: 'rotas-entrega', 
      label: 'Rotas de Entrega', 
      icon: Truck,
      gradient: 'from-slate-50 to-slate-100',
      textColor: 'text-slate-900',
      desc: 'Próxima rota: 14:00 - Sul'
    },
    { 
      id: 'estoque', 
      label: 'Estoque & MP', 
      icon: PackageOpen,
      gradient: 'from-slate-50 to-slate-100',
      textColor: 'text-slate-900',
      desc: 'Controle de matéria-prima'
    },
  ];

  return (
    <>
    {/* MODO SCANNER (FULLSCREEN OVERLAY) */}
    <AnimatePresence>
        {showScanner && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-[2000]"
            >
                <ScannerFabrica onVoltar={() => setShowScanner(false)} />
            </motion.div>
        )}
    </AnimatePresence>

    <div className="p-4 md:p-10 max-w-[1600px] mx-auto bg-slate-50 min-h-full">
      {/* HEADER DA HOME */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-0"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 tracking-tight">
            Bom dia, <span className="text-blue-600">{userName.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-base">
            Painel de Controle: <span className="text-slate-900 font-semibold">{nomeEmpresa}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
            <button 
                onClick={() => setShowScanner(true)}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 md:px-5 py-2.5 rounded-full font-bold shadow-lg shadow-slate-900/20 transition-all hover:scale-105 text-sm"
            >
                <ScanBarcode className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden md:inline">Scanner de Fábrica</span>
                <span className="md:hidden">Scanner</span>
            </button>
        </div>
      </motion.div>

      {/* GRID DE KPIs UNIFICADO (ESTILO LINEAR) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 mb-8 shadow-sm"
      >
        <div className="grid grid-cols-3 gap-4 md:gap-8">
          {kpis.map((kpi) => (
            <div key={kpi.id} className="flex flex-col">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <div className="flex items-center gap-2">
                  <kpi.icon className="w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                  <span className="text-slate-500 font-medium text-xs md:text-sm">{kpi.titulo}</span>
                </div>
                
                {/* 🔥 ÍCONE DE OLHO PARA FATURAMENTO */}
                {kpi.id === 3 && (
                  <button 
                    onClick={() => setShowFaturamento(!showFaturamento)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showFaturamento ? (
                      <Eye className="w-4 h-4 md:w-5 md:h-5" />
                    ) : (
                      <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
                    )}
                  </button>
                )}
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                {kpi.id === 3 && !showFaturamento ? '•••••' : kpi.valor}
              </h3>
              <p className="text-slate-400 text-xs md:text-sm">
                {kpi.id === 3 && !showFaturamento ? '••••••••••••' : kpi.subtexto}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 🔥 GRID DE CARDS 2x4 (ITENS DA SIDEBAR) - ESTILO LINEAR */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8">
        {menuCards.map((card, idx) => (
          <motion.div
            key={`${card.id}-${idx}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => setActiveTab?.(card.id)}
            className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group relative overflow-hidden h-32 md:h-36 flex flex-col justify-between"
          >
            {/* Badge */}
            {card.badge && (
              <span className="absolute top-3 right-3 bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {card.badge}
              </span>
            )}

            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-slate-50 rounded-xl border border-slate-100">
                <card.icon className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />
              </div>
              <h3 className="text-sm md:text-base font-bold leading-tight text-slate-900">{card.label}</h3>
            </div>
            
            <div>
              <p className="text-slate-500 text-xs md:text-sm mb-2 md:mb-3 line-clamp-1">{card.desc}</p>
              <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium text-slate-600 group-hover:translate-x-1 transition-transform">
                <span>Acessar</span>
                <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>



      {/* 🔥 EDITOR DE BANNER SANTA RITA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-[#8B0000] to-[#B22222] rounded-2xl p-4 md:p-6 text-white shadow-xl"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-3">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold">Editor de Campanha Santa Rita</h3>
              <p className="text-white/80 text-xs md:text-sm">Este banner aparece para todos os vidraceiros de SC</p>
            </div>
          </div>
          {!editandoBanner && (
            <button 
              onClick={() => setEditandoBanner(true)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-all backdrop-blur-sm border border-white/30 text-sm self-start md:self-auto"
            >
              <Edit3 className="w-4 h-4" />
              Editar
            </button>
          )}
        </div>

        {editandoBanner ? (
          <div className="space-y-4 bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-xl border border-white/20">
            <div>
              <label className="text-sm font-medium mb-2 block">Título</label>
              <input 
                type="text"
                value={bannerData.titulo}
                onChange={(e) => setBannerData({...bannerData, titulo: e.target.value})}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                placeholder="Ex: Semana do Temperado Santa Rita"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Descrição</label>
              <textarea 
                value={bannerData.descricao}
                onChange={(e) => setBannerData({...bannerData, descricao: e.target.value})}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 h-20 resize-none text-sm"
                placeholder="Descrição da promoção..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Preço (opcional)</label>
                <input 
                  type="text"
                  value={bannerData.preco}
                  onChange={(e) => setBannerData({...bannerData, preco: e.target.value})}
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                  placeholder="Ex: 89,90"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Validade</label>
                <input 
                  type="date"
                  value={bannerData.validade}
                  onChange={(e) => setBannerData({...bannerData, validade: e.target.value})}
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-3 pt-4">
              <button 
                onClick={salvarBanner}
                className="flex-1 flex items-center justify-center gap-2 bg-white text-[#8B0000] px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all text-sm"
              >
                <Save className="w-5 h-5" />
                Salvar e Publicar
              </button>
              <button 
                onClick={() => setEditandoBanner(false)}
                className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-medium transition-all backdrop-blur-sm border border-white/30 text-sm"
              >
                <X className="w-5 h-5" />
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-xl border border-white/20">
            <h4 className="text-xl md:text-2xl font-black mb-2">{bannerData.titulo}</h4>
            <p className="text-white/90 mb-4 text-sm md:text-base">{bannerData.descricao}</p>
            {bannerData.preco && (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-black text-[#FFD700]">R$ {bannerData.preco}</span>
                <span className="text-sm text-white/70">/ {bannerData.unidade}</span>
              </div>
            )}
          </div>
        )}
      </motion.div>

    </div>
    
    {/* 🔥 DEBUG SUPABASE - BOTÃO FLUTUANTE */}
    <DebugSupabase fornecedorId={fornecedorId} />
    
    {/* 🔥 DEBUG SALVAMENTO - INTERCEPTA TODAS AS CHAMADAS! */}
    <DebugSalvamento />
    
    {/* 🔥 CRIAR PEDIDOS FAKE - INTERCEPTA TODAS AS CHAMADAS! */}
    <CriarPedidosFake />
    </>
  );
}