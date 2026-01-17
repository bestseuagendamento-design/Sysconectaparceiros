import { useState } from 'react';
import { 
  X, Trophy, Star, Gift, Crown, Wallet, History, 
  TrendingUp, ArrowUpRight, ArrowDownLeft, Calendar, 
  Plane, Wrench, Percent, CreditCard, ChevronRight 
} from 'lucide-react';

interface ClubePontosProps {
  onClose: () => void;
  pontosReais?: number;
}

export function ClubePontos({ onClose, pontosReais = 0 }: ClubePontosProps) {
  const [activeTab, setActiveTab] = useState<'extrato' | 'trocar'>('extrato');
  const [categoriaTroca, setCategoriaTroca] = useState('todas');

  // Simulação de Dados Reais de Histórico (Ledger)
  const historicoTransacoes = [
    { id: 1, data: '09/01/2026', descricao: 'Fechamento Obra Residencial Lake View', tipo: 'entrada', valor: 500, categoria: 'Venda' },
    { id: 2, data: '08/01/2026', descricao: 'Bônus de Meta Semanal Atingida', tipo: 'entrada', valor: 250, categoria: 'Meta' },
    { id: 3, data: '05/01/2026', descricao: 'Resgate: Desconto em Ferragens', tipo: 'saida', valor: -1000, categoria: 'Resgate' },
    { id: 4, data: '03/01/2026', descricao: 'Cadastro Completo de Novo Cliente', tipo: 'entrada', valor: 50, categoria: 'Cadastro' },
    { id: 5, data: '28/12/2025', descricao: 'Indicação de Arquiteto Parceiro', tipo: 'entrada', valor: 1000, categoria: 'Indicação' },
  ];

  const pontuacao = {
    total: pontosReais || 3450, // Fallback para visualização rica se for 0
    nivel: pontosReais > 10000 ? 'Black Infinite' : pontosReais > 5000 ? 'Platinum' : 'Gold',
    cashbackEstimado: (pontosReais || 3450) * 0.05, // R$ 0,05 por ponto
    proximoNivel: 10000,
  };

  const progresso = (pontuacao.total / pontuacao.proximoNivel) * 100;

  const recompensas = [
    {
      categoria: 'Ferramentas',
      itens: [
        { nome: 'Kit Ventosas Veribor (Alemã)', pontos: 2000, imagem: '🔧', valorReal: 'R$ 800,00' },
        { nome: 'Nível Laser Bosch Profissional', pontos: 4500, imagem: '📐', valorReal: 'R$ 1.200,00' },
      ]
    },
    {
      categoria: 'Descontos',
      itens: [
        { nome: 'Voucher R$ 500 em Vidros', pontos: 1000, imagem: '🎫', valorReal: 'R$ 500,00' },
        { nome: 'Isenção de Frete (5 Entregas)', pontos: 800, imagem: '🚚', valorReal: 'R$ 350,00' },
      ]
    },
    {
      categoria: 'Business',
      itens: [
        { nome: 'Consultoria Financeira (1h)', pontos: 3000, imagem: '💼', valorReal: 'R$ 1.500,00' },
        { nome: 'Design de Logo Premium', pontos: 5000, imagem: '🎨', valorReal: 'R$ 2.000,00' },
      ]
    },
    {
        categoria: 'Viagens',
        itens: [
          { nome: 'Weekend Resort All-Inclusive', pontos: 15000, imagem: '🏖️', valorReal: 'R$ 4.500,00' },
        ]
      },
  ];

  const categorias = ['todas', 'Ferramentas', 'Descontos', 'Business', 'Viagens'];

  const getRecompensasFiltradas = () => {
      if (categoriaTroca === 'todas') return recompensas.flatMap(r => r.itens.map(i => ({...i, cat: r.categoria})));
      return recompensas.filter(r => r.categoria === categoriaTroca).flatMap(r => r.itens.map(i => ({...i, cat: r.categoria})));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-6xl h-[85vh] rounded-3xl shadow-2xl flex overflow-hidden ring-1 ring-white/20">
        
        {/* SIDEBAR DE NAVEGAÇÃO */}
        <div className="w-20 md:w-64 bg-slate-900 flex flex-col justify-between py-8 border-r border-slate-800">
            <div>
                <div className="px-6 mb-10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Crown className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-white font-bold text-lg hidden md:block tracking-tight">Sys<span className="text-amber-500">Club</span></span>
                </div>

                <nav className="space-y-2 px-3">
                    <button 
                        onClick={() => setActiveTab('extrato')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'extrato' ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                    >
                        <Wallet className="w-5 h-5" />
                        <span className="hidden md:block font-medium">Minha Carteira</span>
                    </button>
                    <button 
                         onClick={() => setActiveTab('trocar')}
                         className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'trocar' ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                    >
                        <Gift className="w-5 h-5" />
                        <span className="hidden md:block font-medium">Trocar Pontos</span>
                    </button>
                </nav>
            </div>

            <div className="px-6 hidden md:block">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <p className="text-slate-400 text-xs mb-1">Precisa de ajuda?</p>
                    <p className="text-white text-sm font-semibold">Fale com seu Concierge</p>
                </div>
            </div>
        </div>

        {/* ÁREA PRINCIPAL */}
        <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden">
            
            {/* HEADER SUPERIOR */}
            <div className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        {activeTab === 'extrato' ? 'Visão Geral da Carteira' : 'Catálogo de Recompensas'}
                    </h2>
                    <p className="text-slate-500 text-sm">Bem-vindo ao nível {pontuacao.nivel}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="w-6 h-6 text-slate-400" />
                </button>
            </div>

            {/* CONTEÚDO SCROLLABLE */}
            <div className="flex-1 overflow-y-auto p-8">
                
                {activeTab === 'extrato' && (
                    <div className="space-y-8">
                        {/* CARTÕES DE STATUS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* CARTÃO BLACK VIRTUAL */}
                            <div className="col-span-1 md:col-span-2 relative h-56 rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.01] duration-500">
                                {/* Background Gradiente Premium */}
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black"></div>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                
                                {/* Conteúdo do Cartão */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <Crown className="w-6 h-6 text-amber-500" />
                                            <span className="text-white/80 font-medium tracking-widest text-sm uppercase">SysConecta Black</span>
                                        </div>
                                        <CreditCard className="w-8 h-8 text-white/20" />
                                    </div>

                                    <div>
                                        <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider">Saldo Total</p>
                                        <h3 className="text-5xl font-mono text-white tracking-tighter drop-shadow-lg">
                                            {pontuacao.total.toLocaleString()} <span className="text-2xl text-amber-500">pts</span>
                                        </h3>
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-slate-400 text-xs uppercase mb-1">Equivalente em Cashback</p>
                                            <p className="text-white font-medium">R$ {pontuacao.cashbackEstimado.toFixed(2)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-slate-400 text-xs uppercase mb-1">Validade</p>
                                            <p className="text-white font-medium">Indeterminado</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CARD DE PROGRESSO */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                                <div>
                                    <h4 className="font-bold text-slate-800 mb-2">Próximo Nível: Infinite</h4>
                                    <p className="text-slate-500 text-sm mb-4">Faltam {(pontuacao.proximoNivel - pontuacao.total).toLocaleString()} pontos para benefícios exclusivos.</p>
                                    
                                    <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden">
                                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${progresso}%` }}></div>
                                    </div>
                                    <div className="flex justify-between text-xs font-medium text-slate-400">
                                        <span>{pontuacao.nivel}</span>
                                        <span>Infinite</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setActiveTab('trocar')}
                                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                                >
                                    Usar meus pontos <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* TABELA DE EXTRATO (LEDGER) */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <History className="w-5 h-5 text-slate-500" />
                                    Últimas Movimentações
                                </h3>
                                <button className="text-sm text-blue-600 font-medium hover:underline">Ver extrato completo</button>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Data</th>
                                            <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Descrição / Origem</th>
                                            <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Categoria</th>
                                            <th className="text-right py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {historicoTransacoes.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="py-4 px-6 text-sm text-slate-500 font-medium font-mono">{item.data}</td>
                                                <td className="py-4 px-6">
                                                    <p className="text-sm font-semibold text-slate-900">{item.descricao}</p>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                                        item.tipo === 'entrada' 
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                                            : 'bg-amber-50 text-amber-700 border-amber-100'
                                                    }`}>
                                                        {item.categoria}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <span className={`text-sm font-bold font-mono ${item.tipo === 'entrada' ? 'text-emerald-600' : 'text-red-500'}`}>
                                                        {item.tipo === 'entrada' ? '+' : ''}{item.valor}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'trocar' && (
                    <div className="space-y-6">
                        {/* Filtros */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {categorias.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategoriaTroca(cat)}
                                    className={`px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all border ${
                                        categoriaTroca === cat
                                        ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/10'
                                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                    }`}
                                >
                                    {cat === 'todas' ? 'Todos os Prêmios' : cat}
                                </button>
                            ))}
                        </div>

                        {/* Grid de Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {getRecompensasFiltradas().map((item, idx) => (
                                <div key={idx} className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-900/5 transition-all duration-300 flex flex-col">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="text-4xl bg-slate-50 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                            {item.imagem}
                                        </div>
                                        <div className="bg-amber-50 px-3 py-1 rounded-full text-amber-700 text-xs font-bold uppercase tracking-wide border border-amber-100">
                                            {item.cat}
                                        </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight">{item.nome}</h3>
                                        <p className="text-xs text-slate-400 font-medium">Valor de mercado: {item.valorReal}</p>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                        <div>
                                            <span className="block text-[10px] text-slate-400 font-bold uppercase">Por apenas</span>
                                            <span className="text-xl font-black text-slate-900">{item.pontos.toLocaleString()} <span className="text-xs text-amber-600 font-bold">pts</span></span>
                                        </div>
                                        
                                        <button 
                                            disabled={pontuacao.total < item.pontos}
                                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                                                pontuacao.total >= item.pontos
                                                    ? 'bg-slate-900 text-white hover:bg-amber-600'
                                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                            }`}
                                        >
                                            {pontuacao.total >= item.pontos ? 'Resgatar' : 'Faltam Pts'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
}
