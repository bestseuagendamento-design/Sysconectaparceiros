import React from 'react';
import { Home, Search, Plus, Package, User, Menu, FileText, Truck, DollarSign } from 'lucide-react';

interface MobileBottomNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  userRole: string;
}

export function MobileBottomNav({ currentScreen, onNavigate, userRole }: MobileBottomNavProps) {
  // Não exibir em telas de login/cadastro
  if (
    currentScreen === '01-login' ||
    currentScreen.startsWith('02-') ||
    currentScreen.startsWith('03-cadastro') ||
    currentScreen === '04-verificacao-codigo' ||
    currentScreen === '05-boas-vindas-cinematica'
  ) {
    return null;
  }

  // Configuração de Menu por Perfil
  const getNavItems = () => {
    if (userRole === 'vidraceiro' || userRole === 'arquiteto' || userRole === 'construtor') {
      return [
        { id: 'home', label: 'Início', icon: Home, route: '03-dashboard-execucao' },
        { id: 'pedidos', label: 'Pedidos', icon: Package, route: '12-meus-pedidos' },
        { id: 'novo', label: 'NOVO', icon: Plus, route: 'novo-orcamento-modal', isMain: true },
        { id: 'clientes', label: 'Clientes', icon: User, route: '10-meus-clientes' },
        { id: 'menu', label: 'Menu', icon: Menu, route: '13-agenda' } // Rota provisória para Menu
      ];
    } else if (userRole?.startsWith('fornecedor') || userRole === 'parceirosys') {
      // Fornecedor
      return [
        { id: 'home', label: 'Início', icon: Home, route: 'dashboard-fornecedor' }, // Tab: visao-geral
        { id: 'pedidos', label: 'Pedidos', icon: FileText, route: 'dashboard-fornecedor?tab=pedidos' }, // Tab: pedidos
        { id: 'producao', label: 'Produção', icon: Package, route: 'gestao-producao', isMain: true }, // Tela separada
        { id: 'entregas', label: 'Preços', icon: DollarSign, route: 'dashboard-fornecedor?tab=tabela-precos' }, // Tab: tabela-precos (Troquei Logística por Preços que é mais útil agora)
        { id: 'menu', label: 'Clientes', icon: User, route: 'meus-clientes-fornecedor' } // Tela separada
      ];
    }
    // Default
    return [
        { id: 'home', label: 'Início', icon: Home, route: '03-dashboard-execucao' },
        { id: 'menu', label: 'Menu', icon: Menu, route: 'configuracoes' }
    ];
  };

  const navItems = getNavItems();

  const isActive = (screen: string) => currentScreen === screen || currentScreen.startsWith(screen);

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-[100]">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-6 py-2 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-all duration-300">
        {navItems.map((item) => {
          if (item.isMain) {
            return (
              <div key={item.id} className="relative -top-5">
                <button 
                  onClick={() => onNavigate(item.route)}
                  className="w-14 h-14 bg-slate-900 dark:bg-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.2)] dark:shadow-[0_8px_20px_rgba(255,255,255,0.15)] border-4 border-[#F5F7FA] dark:border-slate-950 text-white dark:text-slate-900 active:scale-95 transition-transform duration-300 group"
                >
                  <item.icon className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>
            );
          }
          
          return (
            <button 
              key={item.id}
              onClick={() => onNavigate(item.route)} 
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                isActive(item.route) 
                  ? 'text-slate-900 dark:text-white' 
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <item.icon className={`w-6 h-6 ${isActive(item.route) ? 'stroke-[2.5px] fill-current/10' : 'stroke-[1.5px]'}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
