/**
 * 🔍🔔 HEADER DO FORNECEDOR - Busca + Notificações
 * Sistema completo de busca e notificações em tempo real
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, X, CheckCircle, Package, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface HeaderFornecedorProps {
  fornecedorId: string;
  nomeEmpresa: string;
  onBusca?: (termo: string) => void;
}

interface Notificacao {
  id: string;
  tipo: 'novo_pedido' | 'pedido_aprovado' | 'pedido_entregue' | 'mensagem';
  titulo: string;
  mensagem: string;
  data: string;
  lida: boolean;
  pedidoId?: string;
  icone?: React.ComponentType<any>;
  cor?: string;
}

export function HeaderFornecedor({ fornecedorId, nomeEmpresa, onBusca }: HeaderFornecedorProps) {
  const [termoBusca, setTermoBusca] = useState('');
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);
  const [totalNaoLidas, setTotalNaoLidas] = useState(0);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  // 🔥 Busca em tempo real
  useEffect(() => {
    if (onBusca) {
      const timer = setTimeout(() => {
        onBusca(termoBusca);
      }, 300); // Debounce de 300ms
      return () => clearTimeout(timer);
    }
  }, [termoBusca, onBusca]);

  // 🔥 Carregar notificações do localStorage
  useEffect(() => {
    carregarNotificacoes();
  }, [fornecedorId]);

  // 🔥 Verificar novos pedidos a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      verificarNovosPedidos();
    }, 30000); // 30 segundos
    
    // Verificar imediatamente ao montar
    verificarNovosPedidos();
    
    // 🔥 SIMULAÇÃO: Adicionar uma notificação de teste após 3 segundos (REMOVER EM PRODUÇÃO)
    setTimeout(() => {
      adicionarNotificacao({
        id: `notif-test-${Date.now()}`,
        tipo: 'novo_pedido',
        titulo: '🎉 Novo Pedido Recebido!',
        mensagem: 'Vidraçaria Premium • R$ 2.450,00',
        data: new Date().toISOString(),
        lida: false,
        icone: Package,
        cor: 'orange'
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [fornecedorId]);

  // 🔥 Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setNotificacoesAbertas(false);
      }
    };

    if (notificacoesAbertas) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notificacoesAbertas]);

  const carregarNotificacoes = () => {
    const storageKey = `sysconecta_notif_fornecedor_${fornecedorId}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      setNotificacoes(parsed);
      setTotalNaoLidas(parsed.filter((n: Notificacao) => !n.lida).length);
    }
  };

  const salvarNotificacoes = (novas: Notificacao[]) => {
    const storageKey = `sysconecta_notif_fornecedor_${fornecedorId}`;
    localStorage.setItem(storageKey, JSON.stringify(novas));
    setNotificacoes(novas);
    setTotalNaoLidas(novas.filter(n => !n.lida).length);
  };

  const verificarNovosPedidos = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos/fornecedor/${fornecedorId}`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );

      if (response.ok) {
        const data = await response.json();
        const pedidosNovos = data.pedidos?.filter((p: any) => p.status === 'aguardando_aprovacao') || [];
        
        // Verificar se tem pedidos novos que ainda não foram notificados
        const storageKey = `sysconecta_last_check_${fornecedorId}`;
        const lastCheck = localStorage.getItem(storageKey);
        const lastCheckTime = lastCheck ? new Date(lastCheck) : new Date(0);
        
        pedidosNovos.forEach((pedido: any) => {
          const pedidoData = new Date(pedido.data_pedido);
          
          // Se o pedido é mais novo que a última verificação
          if (pedidoData > lastCheckTime) {
            adicionarNotificacao({
              id: `notif-${pedido.id}`,
              tipo: 'novo_pedido',
              titulo: '🎉 Novo Pedido Recebido!',
              mensagem: `${pedido.vidraceiro_nome} • ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.valor_total)}`,
              data: pedido.data_pedido,
              lida: false,
              pedidoId: pedido.id,
              icone: Package,
              cor: 'orange'
            });
          }
        });
        
        localStorage.setItem(storageKey, new Date().toISOString());
      }
    } catch (error) {
      console.error('Erro ao verificar novos pedidos:', error);
    }
  };

  const adicionarNotificacao = (notificacao: Notificacao) => {
    const storageKey = `sysconecta_notif_fornecedor_${fornecedorId}`;
    const stored = localStorage.getItem(storageKey);
    const existentes = stored ? JSON.parse(stored) : [];
    
    // Verificar se já existe (evitar duplicatas)
    if (existentes.some((n: Notificacao) => n.id === notificacao.id)) {
      return;
    }
    
    const novas = [notificacao, ...existentes].slice(0, 50); // Máximo 50 notificações
    salvarNotificacoes(novas);
    
    // 🔥 Tocar som de notificação (opcional)
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE');
      audio.volume = 0.3;
      audio.play().catch(() => {}); // Ignora erro se não puder tocar
    } catch (e) {}
  };

  const marcarComoLida = (id: string) => {
    const novas = notificacoes.map(n => 
      n.id === id ? { ...n, lida: true } : n
    );
    salvarNotificacoes(novas);
  };

  const marcarTodasComoLidas = () => {
    const novas = notificacoes.map(n => ({ ...n, lida: true }));
    salvarNotificacoes(novas);
  };

  const limparNotificacoes = () => {
    salvarNotificacoes([]);
  };

  const getIconeNotificacao = (notif: Notificacao) => {
    if (notif.icone) {
      const IconeCustom = notif.icone;
      return <IconeCustom className="w-5 h-5" />;
    }
    
    switch (notif.tipo) {
      case 'novo_pedido':
        return <Package className="w-5 h-5" />;
      case 'pedido_aprovado':
        return <CheckCircle className="w-5 h-5" />;
      case 'pedido_entregue':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getCorNotificacao = (notif: Notificacao) => {
    if (notif.cor) return notif.cor;
    
    switch (notif.tipo) {
      case 'novo_pedido':
        return 'orange';
      case 'pedido_aprovado':
        return 'emerald';
      case 'pedido_entregue':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="flex items-center justify-between gap-4">
        {/* Logo / Nome da Empresa */}
        <div className="flex-shrink-0 hidden md:block">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">{nomeEmpresa}</h1>
          <p className="text-xs text-slate-500">Painel do Fornecedor</p>
        </div>

        {/* 🔍 BARRA DE BUSCA */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar pedidos, orçamentos, clientes..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
            />
            {termoBusca && (
              <button
                onClick={() => setTermoBusca('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
        </div>

        {/* 🔔 SININHO DE NOTIFICAÇÕES */}
        <div className="relative flex-shrink-0" ref={notifDropdownRef}>
          <button
            onClick={() => setNotificacoesAbertas(!notificacoesAbertas)}
            className="relative p-3 hover:bg-slate-100 rounded-xl transition-all group"
          >
            <Bell className={`w-6 h-6 text-slate-600 group-hover:text-slate-900 transition-colors ${totalNaoLidas > 0 ? 'animate-bounce' : ''}`} />
            
            {/* Badge de Notificações Não Lidas */}
            {totalNaoLidas > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
              >
                {totalNaoLidas > 99 ? '99+' : totalNaoLidas}
              </motion.span>
            )}
          </button>

          {/* Dropdown de Notificações */}
          <AnimatePresence>
            {notificacoesAbertas && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
              >
                {/* Header do Dropdown */}
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">Notificações</h3>
                    <p className="text-xs text-slate-500">
                      {totalNaoLidas > 0 ? `${totalNaoLidas} não lida${totalNaoLidas > 1 ? 's' : ''}` : 'Tudo lido'}
                    </p>
                  </div>
                  {totalNaoLidas > 0 && (
                    <button
                      onClick={marcarTodasComoLidas}
                      className="text-xs text-[#D4AF37] hover:text-[#B8941E] font-medium transition-colors"
                    >
                      Marcar todas como lidas
                    </button>
                  )}
                </div>

                {/* Lista de Notificações */}
                <div className="max-h-96 overflow-y-auto">
                  {notificacoes.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm">Nenhuma notificação</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {notificacoes.map((notif) => {
                        const cor = getCorNotificacao(notif);
                        return (
                          <motion.div
                            key={notif.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${!notif.lida ? 'bg-blue-50/50' : ''}`}
                            onClick={() => marcarComoLida(notif.id)}
                          >
                            <div className="flex gap-3">
                              <div className={`flex-shrink-0 w-10 h-10 bg-${cor}-100 rounded-full flex items-center justify-center text-${cor}-600`}>
                                {getIconeNotificacao(notif)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className={`text-sm font-semibold ${!notif.lida ? 'text-slate-900' : 'text-slate-600'}`}>
                                    {notif.titulo}
                                  </h4>
                                  {!notif.lida && (
                                    <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></span>
                                  )}
                                </div>
                                <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                                  {notif.mensagem}
                                </p>
                                <p className="text-xs text-slate-400 mt-2">
                                  {new Date(notif.data).toLocaleString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer do Dropdown */}
                {notificacoes.length > 0 && (
                  <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex justify-center">
                    <button
                      onClick={limparNotificacoes}
                      className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                    >
                      Limpar todas
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 🔥 RESULTADOS DA BUSCA (se tiver termo) */}
      {termoBusca && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 text-sm text-slate-500"
        >
          Buscando por: <strong className="text-slate-900">{termoBusca}</strong>
        </motion.div>
      )}
    </div>
  );
}