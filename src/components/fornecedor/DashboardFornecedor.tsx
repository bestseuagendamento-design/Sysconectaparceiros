import React, { useState, useEffect } from 'react';
import { SidebarFornecedor } from './SidebarFornecedor';
import { HeaderFornecedor } from './HeaderFornecedor'; // 🔥 NOVO
import { HomeFornecedor } from './HomeFornecedor';
import { GestaoPrecos } from './GestaoPrecos'; // ✅ COMPONENTE CORRETO
import { PedidosRecebidos } from './PedidosRecebidos'; // 🔥 TELA FUNCIONAL (não CardPedidosRecebidos)
import { PedidosRecebidosInteligente } from './PedidosRecebidosInteligente'; // 🔥 NOVO - Gestão Inteligente
import { LogisticaFornecedor } from './LogisticaFornecedor';
import { EstoqueFornecedor } from './EstoqueFornecedor';
// import { DebugPedidos } from './DebugPedidos'; // ⚠️ DESABILITADO - Usando modelo antigo
import { GestaoStatusPedidos } from './GestaoStatusPedidos';
import { RotasEntrega } from './RotasEntrega'; // 🔥 NOVO
import { NovoOrcamentoSantaRita } from '../NovoOrcamentoSantaRita'; // ✅ CRIAR ORÇAMENTO
import { motion, AnimatePresence } from 'motion/react';
import { Menu } from 'lucide-react';

// Tipagem básica para os dados do usuário (que vêm do App.tsx)
interface DashboardFornecedorProps {
  userData: {
    razaoSocial: string;
    nomeFantasia: string;
    contatoResponsavel: string;
    email: string;
    // ... outros dados
  } | null;
  onLogout: () => void;
  onNavigate: (screen: string) => void;
}

export function DashboardFornecedor({ userData, onLogout, onNavigate }: DashboardFornecedorProps) {
  const [activeTab, setActiveTab] = useState(() => {
      // Tenta recuperar tab da navegação
      const savedTab = localStorage.getItem('sysconecta_dashboard_tab');
      if (savedTab) {
          localStorage.removeItem('sysconecta_dashboard_tab'); // Limpa após usar
          return savedTab;
      }
      return 'visao-geral';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [termoBusca, setTermoBusca] = useState(''); // 🔥 NOVO: Estado da busca
  
  // Garantir que temos um nome para exibir
  const userName = userData?.contatoResponsavel || 'Fornecedor';
  const nomeEmpresa = userData?.nomeFantasia || 'Minha Empresa';
  const fornecedorId = userData?.id || 'forn-desconhecido'; // 🔥 ID DO FORNECEDOR

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* 1. SIDEBAR LATERAL (FIXA) */}
      <SidebarFornecedor 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={onLogout}
        userName={userName}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. ÁREA DE CONTEÚDO PRINCIPAL (DINÂMICA) */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 relative flex flex-col">

        {/* 🔥 HEADER COM BUSCA E NOTIFICAÇÕES (Desktop) */}
        <div className="hidden md:block">
          <HeaderFornecedor 
            fornecedorId={fornecedorId}
            nomeEmpresa={nomeEmpresa}
            onBusca={setTermoBusca}
          />
        </div>

        {/* Header Mobile */}
        <div className="md:hidden p-4 flex items-center gap-3 border-b border-slate-200 bg-white/90 backdrop-blur-sm sticky top-0 z-30">
            <button 
                onClick={() => setIsMobileMenuOpen(true)} 
                className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
                <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold text-slate-900 text-lg tracking-wide">Santa Rita</span>
        </div>
        
        {/* Background Sutil (Opcional - removi para ficar limpo igual vidraceiro) */}
        
        {/* Conteúdo com Animação de Troca */}
        <div className="relative z-10 min-h-full">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                >
                    {activeTab === 'visao-geral' && (
                        <HomeFornecedor 
                          userName={userName} 
                          nomeEmpresa={nomeEmpresa}
                          fornecedorId={fornecedorId}
                          setActiveTab={setActiveTab}
                        />
                    )}

                    {activeTab === 'criar-orcamento' && (
                        <NovoOrcamentoSantaRita onNavigate={onNavigate} />
                    )}

                    {activeTab === 'pedidos' && (
                        <PedidosRecebidos fornecedorId={fornecedorId} tipoFornecedor="vidros" />
                    )}

                    {activeTab === 'tabela-precos' && (
                        <GestaoPrecos fornecedorId="santa-rita-vidros" />
                    )}
                    
                    {activeTab === 'gestao-status' && (
                        <GestaoStatusPedidos />
                    )}
                    
                    {activeTab === 'rotas-entrega' && (
                        <RotasEntrega fornecedorId={fornecedorId} />
                    )}
                    
                    {activeTab === 'estoque' && (
                        <EstoqueFornecedor fornecedorId={fornecedorId} />
                    )}
                    
                    {/* Outras tabs... */}
                    {!['visao-geral', 'criar-orcamento', 'pedidos', 'tabela-precos', 'gestao-status', 'rotas-entrega', 'estoque'].includes(activeTab) && (
                         <div className="flex flex-col items-center justify-center h-[80vh] text-slate-500">
                            <h3 className="text-xl font-bold mb-2 text-slate-800">Em Desenvolvimento</h3>
                            <p>O módulo {activeTab} estará disponível em breve.</p>
                        </div>
                    )}

                </motion.div>
            </AnimatePresence>
        </div>

      </main>

      {/* 🔥 COMPONENTE DE DEBUG - Visualização em Tempo Real */}
      {/* ⚠️ DESABILITADO TEMPORARIAMENTE - Usando modelo antigo sysconecta_pedidos_fornecedor */}
      {/* <DebugPedidos /> */}
    </div>
  );
}