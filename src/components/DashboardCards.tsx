import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Package, DollarSign, ShoppingCart, Store, Crown, Sparkles, Cloud, CloudRain, Sun, AlertCircle, BarChart3, CheckCircle, Clock, XCircle, MessageSquare, MessageCircle, ArrowLeft, Plus, Minus, Trash2, CreditCard, QrCode, Check } from 'lucide-react';
import logoSrAlex from 'figma:asset/88b8225577d5368dc8aeb374d8593fa61d9ab5ea.png';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChatB2B } from './ChatB2B';
import { MarketplaceSYS } from './MarketplaceSYS';
import { LojaSrAlex } from './LojaSrAlex';

interface DashboardCardsProps {
  onNavigate: (screen: string) => void;
  theme?: 'light' | 'dark';
  orcamentos?: any[];
}

export function DashboardCards({ onNavigate, theme = 'light', orcamentos = [] }: DashboardCardsProps) {
  // Cálculo de Status
  const stats = {
    aprovados: orcamentos.filter(o => ['aprovado', 'concluido', 'fechado'].includes(o.status?.toLowerCase())).length,
    analise: orcamentos.filter(o => ['rascunho', 'pendente', 'em_analise', 'novo'].includes(o.status?.toLowerCase()) || !o.status).length,
    recusados: orcamentos.filter(o => ['recusado', 'cancelado', 'perdido'].includes(o.status?.toLowerCase())).length,
  };
  // CARROSSEL 1 - LANÇAMENTOS
  const [currentLancamento, setCurrentLancamento] = useState(0);
  const [showSysAgente, setShowSysAgente] = useState(false);
  const [sysAgenteStep, setSysAgenteStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<string>('');

  const lancamentos = [
    {
      id: 1,
      fornecedor: 'TEMPERMAX',
      produto: 'Guardian Glass',
      titulo: 'NOVO VIDRO CONTROLE SOLAR',
      badge: 'LANÇAMENTO',
      subtitulo: 'Confirme disponibilidade com seu fornecedor',
      imagem: 'https://images.unsplash.com/photo-1735306506524-848c738dc617?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidWlsZGluZyUyMGlsYW5kJTIwZmFjYWRlJTIwc29sYXIlMjBjb250cm9sfGVufDF8fHx8MTc2NTQ1Nzc0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      icon: '🔷',
    },
    {
      id: 2,
      fornecedor: 'CBA',
      produto: 'Linha Premium Anodizado',
      titulo: 'ALUMÍNIO ANODIZADO PREMIUM',
      badge: 'NOVIDADE',
      subtitulo: 'Alta durabilidade e acabamento impecável',
      imagem: 'https://images.unsplash.com/photo-1563432358505-a5574c9e7ddc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbHVtaW51bSUyMGFub2RpemVkJTIwZ2xhc3MlMjByYWlsaW5nJTIwYmFsY29ueXxlbnwxfHx8fDE3NjU0NTc3NDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      icon: '⚙️',
    },
    {
      id: 3,
      fornecedor: 'Acessorio',
      produto: 'Kit Smart Lock',
      titulo: 'FECHADURAS INTELIGENTES',
      badge: 'LANÇAMENTO',
      subtitulo: 'Tecnologia de ponta para seus projetos',
      imagem: 'https://images.unsplash.com/photo-1737820254974-03006441c574?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGRvb3IlMjBsb2NrJTIwZmluZ2VycHJpbnR8ZW58MXx8fHwxNzY1NDU3NzQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      icon: '🔧',
    },
  ];

  // CARROSSEL 2 - MARKETPLACE GRID 3×3
  const [currentMarketplaceSet, setCurrentMarketplaceSet] = useState(0);
  const [currentPromo, setCurrentPromo] = useState(0);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [showLojaSrAlex, setShowLojaSrAlex] = useState(false);
  const [lojaAberta, setLojaAberta] = useState('');

  // Conjuntos de 9 empresas que pagam pra aparecer em destaque
  const marketplaceSets = [
    [
      { nome: 'Sr. Alex', imagem: logoSrAlex, cor: 'bg-white' },
      { nome: 'Pirelli', imagem: 'https://images.unsplash.com/photo-1752959807356-a4f7628f74a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', cor: 'bg-gradient-to-br from-yellow-100 to-orange-100' },
      { nome: "McDonald's", imagem: 'https://images.unsplash.com/photo-1711059073701-c1badfdb6fac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', cor: 'bg-gradient-to-br from-red-100 to-rose-100' },
      { nome: 'Shell', imagem: 'https://images.unsplash.com/photo-1613986406535-a8371a573ac5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', cor: 'bg-gradient-to-br from-yellow-50 to-red-50' },
      { nome: 'Leroy Merlin', imagem: 'https://images.unsplash.com/photo-1707817649077-57df8c84591b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', cor: 'bg-gradient-to-br from-green-100 to-emerald-100' },
      { nome: 'Dicico', imagem: 'https://images.unsplash.com/photo-1761718061033-2cdc5b3ec64d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', cor: 'bg-gradient-to-br from-orange-100 to-amber-100' },
      { nome: 'Koch', imagem: 'https://images.unsplash.com/photo-1753354868656-53671f69602a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', cor: 'bg-gradient-to-br from-blue-100 to-cyan-100' },
      { nome: 'Tramontina', imagem: 'https://images.unsplash.com/photo-1665949091885-9849b2622bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', cor: 'bg-gradient-to-br from-red-50 to-orange-50' },
      { nome: 'Tekbond', imagem: 'https://images.unsplash.com/photo-1750780536022-579e5a5cfeb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', cor: 'bg-gradient-to-br from-gray-100 to-slate-100' },
    ],
    [
      { nome: 'Bosch', imagem: 'https://images.unsplash.com/photo-1665949091885-9849b2622bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', cor: 'bg-gradient-to-br from-green-100 to-teal-100' },
      { nome: '3M', imagem: 'https://images.unsplash.com/photo-1750780536022-579e5a5cfeb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', cor: 'bg-gradient-to-br from-red-100 to-pink-100' },
      { nome: 'DeWalt', imagem: 'https://images.unsplash.com/photo-1665949091885-9849b2622bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', cor: 'bg-gradient-to-br from-yellow-100 to-amber-100' },
      { nome: 'Makita', imagem: 'https://images.unsplash.com/photo-1665949091885-9849b2622bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', cor: 'bg-gradient-to-br from-teal-100 to-cyan-100' },
      { nome: 'Stanley', imagem: 'https://images.unsplash.com/photo-1665949091885-9849b2622bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', cor: 'bg-gradient-to-br from-yellow-50 to-yellow-100' },
      { nome: 'Black+Decker', imagem: 'https://images.unsplash.com/photo-1665949091885-9849b2622bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', cor: 'bg-gradient-to-br from-orange-100 to-red-100' },
      { nome: 'Vonder', imagem: 'https://images.unsplash.com/photo-1665949091885-9849b2622bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', cor: 'bg-gradient-to-br from-blue-100 to-indigo-100' },
      { nome: 'Tigre', imagem: 'https://images.unsplash.com/photo-1761718061033-2cdc5b3ec64d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', cor: 'bg-gradient-to-br from-orange-50 to-orange-100' },
      { nome: 'Sika', imagem: 'https://images.unsplash.com/photo-1750780536022-579e5a5cfeb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', cor: 'bg-gradient-to-br from-red-50 to-red-100' },
    ],
    [
      { nome: 'Quartzolit', imagem: 'https://images.unsplash.com/photo-1761718061033-2cdc5b3ec64d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', cor: 'bg-gradient-to-br from-gray-100 to-gray-200' },
      { nome: 'Brasilit', imagem: 'https://images.unsplash.com/photo-1761718061033-2cdc5b3ec64d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', cor: 'bg-gradient-to-br from-blue-50 to-blue-100' },
      { nome: 'Vedacit', imagem: 'https://images.unsplash.com/photo-1750780536022-579e5a5cfeb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', cor: 'bg-gradient-to-br from-cyan-100 to-blue-100' },
      { nome: 'Tubolit', imagem: 'https://images.unsplash.com/photo-1761718061033-2cdc5b3ec64d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', cor: 'bg-gradient-to-br from-red-100 to-rose-100' },
      { nome: 'Axton', imagem: 'https://images.unsplash.com/photo-1707817649077-57df8c84591b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', cor: 'bg-gradient-to-br from-green-50 to-green-100' },
      { nome: 'Portobello', imagem: 'https://images.unsplash.com/photo-1761718061033-2cdc5b3ec64d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', cor: 'bg-gradient-to-br from-amber-100 to-yellow-100' },
      { nome: 'Deca', imagem: 'https://images.unsplash.com/photo-1761718061033-2cdc5b3ec64d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', cor: 'bg-gradient-to-br from-blue-100 to-cyan-100' },
      { nome: 'Docol', imagem: 'https://images.unsplash.com/photo-1761718061033-2cdc5b3ec64d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', cor: 'bg-gradient-to-br from-gray-50 to-gray-100' },
      { nome: 'Eternit', imagem: 'https://images.unsplash.com/photo-1761718061033-2cdc5b3ec64d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', cor: 'bg-gradient-to-br from-slate-100 to-zinc-100' },
    ],
  ];

  const promocoes = [
    {
      id: 1,
      parceiro: 'Makita',
      logo: '🔨',
      titulo: 'Economize com SYS',
      descricao: 'Comprando ferramentas com a Makita economize 15%',
      desconto: '15% OFF',
      cor: 'from-teal-900 to-teal-800',
    },
    {
      id: 2,
      parceiro: 'Bosch',
      logo: '⚡',
      titulo: 'Kit Profissional',
      descricao: 'Furadeira + Parafusadeira - Combo especial SYS',
      desconto: '20% OFF',
      cor: 'from-green-900 to-green-800',
    },
    {
      id: 3,
      parceiro: 'DeWalt',
      logo: '🔧',
      titulo: 'Super Desconto',
      descricao: 'Ferramentas elétricas com até 25% de desconto',
      desconto: '25% OFF',
      cor: 'from-yellow-900 to-yellow-800',
    },
    {
      id: 4,
      parceiro: '3M',
      logo: '🛡️',
      titulo: 'EPIs Profissionais',
      descricao: 'Segurança em primeiro lugar - 10% OFF',
      desconto: '10% OFF',
      cor: 'from-red-900 to-red-800',
    },
    {
      id: 5,
      parceiro: 'Tramontina',
      logo: '🔪',
      titulo: 'Ferramentas Manuais',
      descricao: 'Qualidade e durabilidade - 12% de desconto',
      desconto: '12% OFF',
      cor: 'from-blue-900 to-blue-800',
    },
  ];

  // CLIMA E AVISOS
  const [showAvisoClima, setShowAvisoClima] = useState(true);
  const [showSysAvisa, setShowSysAvisa] = useState(false);
  const [mensagemEnviada, setMensagemEnviada] = useState(false);
  const [showModalAvisos, setShowModalAvisos] = useState(false);

  // CHAT B2B
  const [showChatB2B, setShowChatB2B] = useState(false);

  // Auto-rotação dos carrosséis
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentLancamento((prev) => (prev + 1) % lancamentos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promocoes.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Auto-rotação Marketplace Grid 3×3 - a cada 10 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMarketplaceSet((prev) => (prev + 1) % marketplaceSets.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [marketplaceSets.length]);

  const handleSaibaMaisLancamento = (produto: string) => {
    setSelectedProduct(produto);
    setShowSysAgente(true);
    setSysAgenteStep(1);
  };

  const handleSysAgenteConfirmar = () => {
    setSysAgenteStep(2);
  };

  const handleSysAgenteVoltar = () => {
    setShowSysAgente(false);
    setSysAgenteStep(1);
  };

  const handleEnviarAviso = () => {
    setShowSysAvisa(false);
    setMensagemEnviada(true);
    setTimeout(() => setMensagemEnviada(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* LINHA 1 - REORGANIZADO: Lançamentos (Pequeno) | VIP (Pequeno) | Marketplace (Grande) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        
        {/* CARD 1 - LANÇAMENTOS (Carrossel) - AGORA MENOR (1 COLUNA) */}
        <div className={`relative ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-xl overflow-hidden shadow-sm col-span-1 md:col-span-1`} style={{ height: '320px' }}>
          <div className="absolute top-3 left-3 md:top-4 md:left-4 z-20">
            <div className={`flex items-center gap-1.5 md:gap-2 px-2 py-1 md:px-3 md:py-1.5 ${theme === 'dark' ? 'bg-slate-900/90 border-slate-700 text-amber-500' : 'bg-white/95 border-gray-200 text-gray-900'} backdrop-blur-sm rounded-full border`}>
              <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3 text-amber-500" />
              <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider">Novo</span>
            </div>
          </div>

          {/* Imagem de Fundo */}
          <div className="absolute inset-0">
            <ImageWithFallback
              src={lancamentos[currentLancamento].imagem}
              alt={lancamentos[currentLancamento].titulo}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20"></div>
          </div>

          {/* Conteúdo */}
          <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-10">
            {/* Badge LANÇAMENTO - Escondido no mobile muito pequeno se atrapalhar, mas ok por enquanto */}
            <div className="flex justify-end">
              <div className="px-2 py-1 bg-amber-500 text-white rounded-md shadow-lg">
                <span className="font-bold text-[8px] md:text-[10px] tracking-wider">{lancamentos[currentLancamento].badge}</span>
              </div>
            </div>

            {/* Conteúdo central */}
            <div className="space-y-1 md:space-y-2">
              <div className="text-white text-sm md:text-xl font-bold tracking-tight leading-tight line-clamp-3 md:line-clamp-none">
                {lancamentos[currentLancamento].titulo}
              </div>
              <div className="text-gray-300 text-[10px] md:text-xs line-clamp-2">
                {lancamentos[currentLancamento].subtitulo}
              </div>
            </div>

            {/* Botão */}
            <button
              onClick={() => handleSaibaMaisLancamento(lancamentos[currentLancamento].produto)}
              className={`w-full py-2 md:py-2.5 ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-white hover:bg-gray-100 text-gray-900'} rounded-lg transition-all font-semibold text-[10px] md:text-xs`}
            >
              Ver Detalhes
            </button>
          </div>

          {/* Navegação */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {lancamentos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentLancamento(index)}
                className={`h-1 rounded-full transition-all ${
                  index === currentLancamento ? 'bg-white w-4 md:w-6' : 'bg-white/50 w-1 md:w-1.5'
                }`}
              />
            ))}
          </div>
        </div>

        {/* CARD 2 - BANNER VIP FIXO - MOVIDO PARA CÁ (AO LADO DO LANÇAMENTO) */}
        <div className={`relative ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-xl overflow-hidden shadow-sm col-span-1 md:col-span-1`} style={{ height: '320px' }}>
          {/* Imagem de Fundo */}
          <div className="absolute inset-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGJ1c2luZXNzJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY1NDI2MzQyfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Seja VIP"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/80 to-slate-900/40"></div>
          </div>

          {/* Conteúdo */}
          <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-10">
            <div className="flex justify-end">
              <Crown className="w-6 h-6 md:w-10 md:h-10 text-amber-400" />
            </div>

            <div className="space-y-2 md:space-y-3">
              <div className="text-amber-100 text-sm md:text-xl font-bold tracking-tight leading-tight">
                Quer aparecer aqui?
              </div>
              <div className="text-slate-300 text-[10px] md:text-xs leading-relaxed line-clamp-3">
                Seja VIP e apareça para mais de <span className="text-amber-300 font-bold">100k usuários</span>
              </div>
            </div>

            <div className="space-y-2">
              <button className="w-full py-2 md:py-2.5 bg-amber-500 hover:bg-amber-400 text-white rounded-lg transition-all font-bold text-[10px] md:text-xs shadow-lg shadow-amber-500/20">
                Contrate
              </button>
              <button className="w-full py-2 md:py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg transition-all text-[10px] md:text-xs border border-white/20">
                Saiba mais
              </button>
            </div>
          </div>
        </div>

        {/* CARD 3 - MARKETPLACE - REDUZIDO (1 COLUNA) */}
        <div className={`relative ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-xl overflow-hidden shadow-sm p-4 md:p-6 col-span-1`} style={{ height: '320px' }}>
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <ShoppingCart className={`w-3 h-3 md:w-4 md:h-4 ${theme === 'dark' ? 'text-emerald-500' : 'text-green-600'}`} />
            <span className={`${theme === 'dark' ? 'text-slate-200' : 'text-gray-900'} text-[10px] md:text-xs font-semibold uppercase tracking-wider`}>Marketplace SYS</span>
          </div>

          {/* GRID 3×3 - APENAS VISUALIZAÇÃO (Só Sr. Alex é clicável pois já está cadastrado) */}
          {/* IMPORTANTE: Quando empresas se cadastram como ParceiroSYS, aparecem aqui com integração REAL */}
          <div className="grid grid-cols-3 gap-2 md:gap-3 mb-3 md:mb-5">
            {marketplaceSets[currentMarketplaceSet].map((empresa, index) => (
              empresa.nome === 'Sr. Alex' ? (
                // SR. ALEX - ÚNICO CLICÁVEL (cliente real já cadastrado)
                <button
                  key={index}
                  onClick={() => {
                    setShowLojaSrAlex(true);
                    setLojaAberta(empresa.nome);
                  }}
                  className={`aspect-square ${theme === 'dark' ? 'bg-slate-800 border-amber-500/50' : 'bg-gradient-to-br from-purple-100 to-pink-100 border-yellow-500'} rounded-lg hover:scale-105 transition-all overflow-hidden border-2 shadow-lg relative group`}
                >
                  <ImageWithFallback
                    src={empresa.imagem}
                    alt={empresa.nome}
                    className="w-full h-full object-cover"
                  />
                  {/* Badge PARCEIRO REAL */}
                  <div className="absolute top-0 right-0 bg-amber-500 text-white text-[6px] md:text-[8px] px-1 md:px-1.5 py-0.5 rounded-bl font-bold">
                    REAL
                  </div>
                </button>
              ) : (
                // OUTROS - APENAS VISUALIZAÇÃO (aguardando cadastro ParceiroSYS)
                <div
                  key={index}
                  className={`aspect-square ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'} rounded-lg overflow-hidden border relative`}
                >
                  <ImageWithFallback
                    src={empresa.imagem}
                    alt={empresa.nome}
                    className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
                  />
                  {/* Badge EM BREVE */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="bg-black/80 backdrop-blur-sm text-white text-[6px] md:text-[8px] px-1.5 py-0.5 rounded font-bold border border-white/20">
                      EM BREVE
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>

          {/* Indicadores de navegação */}
          <div className="flex justify-center gap-1.5 mb-3 md:mb-4">
            {marketplaceSets.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentMarketplaceSet(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentMarketplaceSet ? 'bg-emerald-500 w-4 md:w-6' : 'bg-slate-300 w-1 md:w-1.5'
                }`}
              />
            ))}
          </div>

          {/* Botão VER TODOS - ÚNICO CLICÁVEL */}
          <button
            onClick={() => setShowMarketplace(true)}
            className={`w-full py-2 md:py-2.5 ${theme === 'dark' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'} rounded-lg transition-all font-semibold text-[10px] md:text-xs shadow-md`}
          >
            ACESSAR
          </button>
        </div>

        {/* 4. STATUS ORÇAMENTO - MOVIDO PARA CÁ (1 COLUNA) */}
        <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border rounded-xl p-4 md:p-5 shadow-sm col-span-1 flex flex-col justify-between`} style={{ height: '320px' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 ${theme === 'dark' ? 'bg-slate-800' : 'bg-purple-50'} rounded-lg flex items-center justify-center shrink-0`}>
              <BarChart3 className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div>
              <div className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-semibold text-xs`}>Status Orçamentos</div>
              <div className="text-gray-500 text-[10px]">Últimos 7 dias</div>
            </div>
          </div>

          <div className="flex flex-col flex-1 justify-between py-2 gap-2">
            {/* APROVADOS */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-green-500">{stats.aprovados}</span>
                <span className="text-[10px] font-semibold text-gray-500 uppercase">Aprovados</span>
              </div>
              {/* Mini gráfico visual (estético) */}
              <div className="h-10 w-16 flex items-end gap-0.5 opacity-80">
                {[20, 40, 30, 50, 40].map((h, i) => (
                  <div key={i} className="flex-1 bg-green-500 rounded-t-sm" style={{ height: `${stats.aprovados > 0 ? h : 5}%` }}></div>
                ))}
              </div>
            </div>

            <div className={`h-px w-full ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'}`}></div>

            {/* EM ANÁLISE */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-amber-500">{stats.analise}</span>
                <span className="text-[10px] font-semibold text-gray-500 uppercase">Análise</span>
              </div>
              <div className="h-10 w-16 flex items-end gap-0.5 opacity-80">
                 {[30, 40, 50, 40, 30].map((h, i) => (
                  <div key={i} className="flex-1 bg-amber-500 rounded-t-sm" style={{ height: `${stats.analise > 0 ? h : 5}%` }}></div>
                ))}
              </div>
            </div>

            <div className={`h-px w-full ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'}`}></div>

            {/* RECUSADOS */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-red-500">{stats.recusados}</span>
                <span className="text-[10px] font-semibold text-gray-500 uppercase">Recusados</span>
              </div>
              <div className="h-10 w-16 flex items-end gap-0.5 opacity-80">
                 {[20, 30, 20, 25, 20].map((h, i) => (
                  <div key={i} className="flex-1 bg-red-500 rounded-t-sm" style={{ height: `${stats.recusados > 0 ? h : 5}%` }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* MODAL - SYSAGENTE (Lançamentos) */}
      {showSysAgente && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border-2 border-cyan-700 rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-cyan-700/30 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-cyan-500" />
              </div>
              <div>
                <div className="text-white font-bold">SYSagente</div>
                <div className="text-cyan-500 text-xs">Assistente Inteligente</div>
              </div>
            </div>

            {sysAgenteStep === 1 && (
              <>
                <div className="text-white mb-6 leading-relaxed">
                  Olá! Vi que tem interesse no novo vidro da <span className="text-cyan-400 font-semibold">Guardian</span>.
                  <br /><br />
                  Quer confirmar com o distribuidor do seu estado <span className="text-blue-400 font-semibold">"TEMPERMAX"</span> sobre a disponibilidade do vidro?
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSysAgenteVoltar}
                    className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-all font-semibold"
                  >
                    Não
                  </button>
                  <button
                    onClick={handleSysAgenteConfirmar}
                    className="flex-1 py-3 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg transition-all font-semibold"
                  >
                    Sim
                  </button>
                </div>
              </>
            )}

            {sysAgenteStep === 2 && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="text-white mb-4 leading-relaxed">
                    Já está disponível o vidro dentro das suas tipologias!
                    <br /><br />
                    Fazendo o seu projeto você já tem ele como categoria selecionável.
                  </div>
                  <div className="text-neutral-400 text-sm italic mb-6">
                    Qualquer dúvida o SYSagente está para ajudar. Obrigado!
                  </div>
                </div>
                <button
                  onClick={handleSysAgenteVoltar}
                  className="w-full py-3 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg transition-all font-semibold"
                >
                  Entendido
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* MODAL - MARKETPLACE */}
      {showMarketplace && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border-2 border-green-700 rounded-2xl max-w-4xl w-full p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 text-green-500" />
                <div className="text-white font-bold text-xl">Marketplace SYS</div>
              </div>
              <button
                onClick={() => setShowMarketplace(false)}
                className="text-neutral-400 hover:text-white transition-colors text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {promocoes.map((promo) => (
                <div key={promo.id} className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-6 hover:border-green-700 transition-all cursor-pointer">
                  <div className="text-5xl mb-3">{promo.logo}</div>
                  <div className="text-white font-bold mb-2">{promo.parceiro}</div>
                  <div className="text-neutral-400 text-sm mb-4">{promo.descricao}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-green-500 font-bold">{promo.desconto}</div>
                    <button className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded text-sm font-semibold transition-all">
                      Ver produto
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL - SYSAVISA */}
      {showSysAvisa && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border-2 border-orange-700 rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-orange-700/30 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <div className="text-white font-bold">SYSavisa</div>
                <div className="text-orange-500 text-xs">Mensagem Automática</div>
              </div>
            </div>

            <div className="bg-black/40 border border-neutral-700 rounded-lg p-4 mb-6">
              <div className="text-neutral-400 text-xs mb-2">Mensagem para: Dona Ana</div>
              <div className="text-white text-sm leading-relaxed">
                Olá Dona Ana! 👋
                <br /><br />
                Infelizmente precisaremos adiar o serviço agendado para hoje devido às condições climáticas desfavoráveis (previsão de chuva forte). 
                <br /><br />
                Para garantir a qualidade do trabalho e sua segurança, vamos remarcar para um dia com tempo adequado.
                <br /><br />
                Em breve entraremos em contato para reagendar.
                <br /><br />
                Agradecemos a compreensão! 🙏
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSysAvisa(false)}
                className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-all font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleEnviarAviso}
                className="flex-1 py-3 bg-orange-700 hover:bg-orange-600 text-white rounded-lg transition-all font-semibold"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICAÇÃO - MENSAGEM ENVIADA */}
      {mensagemEnviada && (
        <div className="fixed top-8 right-8 z-50 bg-gradient-to-r from-green-900 to-green-800 border border-green-700 rounded-xl p-6 shadow-2xl animate-[slideIn_0.3s_ease-out] max-w-md">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-700/30 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex-1">
              <div className="text-white mb-1 font-semibold">
                ✅ Mensagem Enviada!
              </div>
              <p className="text-green-300 text-sm">
                A sua mensagem foi enviada com sucesso para o WhatsApp da Dona Ana.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* BOTÃO FLUTUANTE - CHAT B2B (Minimalista Moderno) */}
      {!showChatB2B && (
        <button
          onClick={() => setShowChatB2B(true)}
          className="fixed bottom-24 right-6 z-40 group flex items-center justify-center w-14 h-14 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 dark:border-slate-700 hover:scale-110 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-blue-500/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
          <MessageCircle className="w-6 h-6 stroke-[1.5]" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
        </button>
      )}

      {/* CHAT B2B */}
      {showChatB2B && <ChatB2B onClose={() => setShowChatB2B(false)} />}

      {/* MARKETPLACE COMPLETO */}
      {showMarketplace && <MarketplaceSYS onClose={() => setShowMarketplace(false)} />}

      {/* MODAL - AVISOS IMPORTANTES */}
      {showModalAvisos && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border-2 border-orange-700 rounded-2xl max-w-lg w-full p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-700/30 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <div className="text-white font-bold text-xl">Avisos Importantes</div>
                  <div className="text-orange-500 text-xs">1 notificação pendente</div>
                </div>
              </div>
              <button
                onClick={() => setShowModalAvisos(false)}
                className="text-neutral-400 hover:text-white transition-colors text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Lista de Avisos */}
            <div className="space-y-4">
              <div className="bg-orange-900/20 border border-orange-700/50 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <CloudRain className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="text-orange-400 font-bold mb-2">
                      ⚠️ Obra Externa Afetada - Clima
                    </div>
                    <div className="text-neutral-300 text-sm leading-relaxed mb-4">
                      Dia chuvoso previsto para Segunda-feira (11/Dez). A obra da <span className="font-semibold text-white">Dona Ana</span> precisará ser adiada. Não será possível concluir por motivo climático.
                    </div>
                    <div className="bg-black/40 border border-neutral-700 rounded-lg p-3 mb-4">
                      <div className="text-neutral-400 text-xs mb-1">Obra:</div>
                      <div className="text-white font-semibold">Instalação Box Blindex - Dona Ana</div>
                      <div className="text-neutral-400 text-xs mt-2">Endereço:</div>
                      <div className="text-neutral-300 text-sm">Rua das Flores, 123 - Jardim Paulista</div>
                    </div>
                    <button
                      onClick={() => {
                        setShowModalAvisos(false);
                        setShowSysAvisa(true);
                      }}
                      className="w-full py-3 bg-orange-700 hover:bg-orange-600 text-white rounded-lg transition-all font-semibold"
                    >
                      🤖 Avisar Cliente com SYSAVISA
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL - LOJA SR. ALEX */}
      {showLojaSrAlex && (
        <LojaSrAlex onClose={() => setShowLojaSrAlex(false)} />
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}