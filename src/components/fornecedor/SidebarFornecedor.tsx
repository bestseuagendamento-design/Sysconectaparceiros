import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  PlusCircle,
  DollarSign, 
  Users, 
  Truck, 
  Settings, 
  LogOut,
  PackageOpen,
  Store,
  X,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarFornecedorProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  userName?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function SidebarFornecedor({ activeTab, setActiveTab, onLogout, userName, isOpen = false, onClose }: SidebarFornecedorProps) {
  
  const menuItems = [
    { id: 'visao-geral', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'criar-orcamento', label: 'Criar Orçamento', icon: PlusCircle },
    { id: 'pedidos', label: 'Pedidos & Produção', icon: ShoppingCart, badge: 3 },
    { id: 'gestao-status', label: 'Gestão de Status', icon: RefreshCw },
    { id: 'tabela-precos', label: 'Tabela de Preços', icon: DollarSign },
    { id: 'clientes', label: 'Meus Clientes', icon: Users },
    { id: 'estoque', label: 'Estoque & MP', icon: PackageOpen },
    { id: 'rotas-entrega', label: 'Rotas de Entrega', icon: Truck },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed md:relative top-0 left-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 z-50 transition-transform duration-300 shadow-2xl md:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Botão Fechar Mobile */}
        <button 
            onClick={onClose}
            className="absolute top-2 right-2 p-2 text-slate-400 hover:text-slate-600 md:hidden z-50"
        >
            <X className="w-5 h-5" />
        </button>

      {/* HEADER DA SIDEBAR */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/20">
          <Store className="text-white w-5 h-5" />
        </div>
        <div>
          <h2 className="text-slate-900 font-bold text-sm tracking-tight leading-tight">ÁREA DO<br/>FORNECEDOR</h2>
        </div>
      </div>

      {/* MENU ITENS */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                onClose?.();
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative
                ${isActive 
                  ? 'text-slate-900 bg-slate-100 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }
              `}
            >
              {/* Barra lateral ativa */}
              {isActive && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-slate-900" 
                />
              )}

              <item.icon className={`w-5 h-5 ${isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`} />
              
              <span className="flex-1 text-left">{item.label}</span>
              
              {item.badge && (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* FOOTER DA SIDEBAR */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
            <span className="text-slate-900 font-bold text-xs">SR</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-slate-900 text-sm font-bold truncate">{userName || 'Fornecedor'}</p>
            <p className="text-slate-500 text-xs truncate">Logado como Admin</p>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-2 text-slate-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair do Sistema</span>
        </button>
      </div>
    </aside>
    </>
  );
}