import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ArrowLeft,
  Building2, 
  Hammer, 
  Globe2,
  Lock,
  Truck,
  DraftingCompass,
  Network,
  CheckCircle2,
  Wine,
  Component,
  Wrench,
  Factory,
  Store
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useI18n } from '../../i18n/i18nContext';
import { EscolhaTipoFornecedor } from './EscolhaTipoFornecedor';

// --- LOGO SYSCONECTA 2026 (TIPOGRAFIA MONUMENTAL) ---
const SysConectaLogo = () => (
  <svg viewBox="0 0 600 100" className="w-full h-full drop-shadow-[0_0_30px_rgba(212,175,55,0.6)]">
    <defs>
      {/* Gradiente Ouro Luxo */}
      <linearGradient id="gold-text" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBF5B7" />
        <stop offset="30%" stopColor="#D4AF37" />
        <stop offset="70%" stopColor="#AA771C" />
        <stop offset="100%" stopColor="#FBF5B7" />
      </linearGradient>
      {/* Gradiente Platina */}
      <linearGradient id="platinum-text" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="40%" stopColor="#E0E0E0" />
        <stop offset="100%" stopColor="#909090" />
      </linearGradient>
    </defs>
    
    {/* TEXTO PRINCIPAL: SYSCONECTA */}
    <text 
      x="50%" 
      y="80" 
      textAnchor="middle" 
      fontFamily="'Arial Black', 'Helvetica Neue', sans-serif" 
      fontWeight="900" 
      fontSize="75" 
      letterSpacing="-2"
    >
      {/* SYS em Platina */}
      <tspan fill="url(#platinum-text)">SYS</tspan>
      {/* CONECT em Ouro */}
      <tspan fill="url(#gold-text)">CONECT</tspan>
      {/* A Final separado para ajuste fino se precisar, mas mantendo fluxo */}
      <tspan fill="url(#gold-text)">A</tspan>
    </text>

    {/* 2026 SOBRE A LETRA "A" (Posição calculada manualmente para ficar em cima do último A) */}
    {/* Ajustando X para alinhar com o último caractere (Aprox 550 no viewbox de 600) */}
    <text 
      x="525" 
      y="35" 
      textAnchor="middle" 
      fontFamily="Arial, sans-serif" 
      fontWeight="bold" 
      fontSize="16" 
      fill="#D4AF37" 
      letterSpacing="2"
    >
      2026
    </text>
  </svg>
);

interface LandingPageEnterpriseProps {
  onLogin: (email: string, pass: string, profile: string, rememberMe: boolean) => void;
  onRegister: (type: string) => void;
  onAdminLogin: () => void;
  onFornecedorBypass?: (dados: any) => void;
}

type PerfilKey = 'vidraceiro' | 'arquiteto' | 'construtor' | 'industria' | 'fornecedor' | 'parceirosys';

export function LandingPageEnterprise({ onLogin, onRegister, onAdminLogin, onFornecedorBypass }: LandingPageEnterpriseProps) {
  const [activeTab, setActiveTab] = useState<PerfilKey>('vidraceiro');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  
  // Lógica de Fornecedor Direto
  const [mostrarWizardFornecedor, setMostrarWizardFornecedor] = useState(false);
  const [tipoFornecedorInicial, setTipoFornecedorInicial] = useState<string | null>(null);
  
  const { t } = useI18n();

  // Configuração dos Perfis (Conteúdo e Visual)
  const perfis = {
    vidraceiro: {
      id: 'vidraceiro',
      labelKey: 'auth.profiles.vidraceiro.title',
      sublabelKey: 'auth.profiles.vidraceiro.subtitle',
      icon: Hammer,
      bgImage: "https://images.unsplash.com/photo-1668277155898-704a26a5cfa3?q=80&w=1920",
      titleKey: "auth.profiles.vidraceiro.subtitle", 
      descriptionKey: "auth.profiles.vidraceiro.description",
      color: "from-[#D4AF37] to-[#F3E5AB]", // Ouro
      stats: { val1: "R$ 42M+", label1: "Processados", val2: "12.5k", label2: "Obras" },
      features: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8'],
      hasLogin: true
    },
    arquiteto: {
      id: 'arquiteto',
      labelKey: 'auth.profiles.arquiteto.title',
      sublabelKey: 'auth.profiles.arquiteto.subtitle',
      icon: DraftingCompass,
      bgImage: "https://images.unsplash.com/photo-1717613576940-b4d2b114b337?q=80&w=1920",
      titleKey: "auth.profiles.arquiteto.subtitle",
      descriptionKey: "auth.profiles.arquiteto.description",
      color: "from-[#E0E0E0] to-[#FFFFFF]", // Prata/Branco
      stats: { val1: "8.2k", label1: "Projetos", val2: "350+", label2: "Parceiros" },
      features: ['f1', 'f2', 'f3', 'f4'],
      hasLogin: true
    },
    construtor: {
      id: 'construtor',
      labelKey: 'auth.profiles.construtor.title',
      sublabelKey: 'auth.profiles.construtor.subtitle',
      icon: Building2,
      bgImage: "https://images.unsplash.com/photo-1702294906517-69d423e87271?q=80&w=1920", 
      titleKey: "auth.profiles.construtor.subtitle",
      descriptionKey: "auth.profiles.construtor.description",
      color: "from-[#FF8C00] to-[#FFA500]", // Laranja Construção
      stats: { val1: "300+", label1: "Empreendimentos", val2: "Total", label2: "Conexão" },
      features: ['f1', 'f2', 'f3', 'f4'],
      hasLogin: true
    },
    industria: {
      id: 'industria',
      labelKey: 'auth.profiles.industria.title',
      sublabelKey: 'auth.profiles.industria.subtitle',
      icon: Building2,
      bgImage: "https://images.unsplash.com/photo-1716194583732-0b9874234218?q=80&w=1920",
      titleKey: "auth.profiles.industria.subtitle",
      descriptionKey: "auth.profiles.industria.description",
      color: "from-[#4A90E2] to-[#87CEFA]", // Azul Industrial
      stats: { val1: "150T", label1: "Vidro/Mês", val2: "99.8%", label2: "Precisão" },
      features: ['f1', 'f2', 'f3', 'f4'],
      hasLogin: false
    },
    fornecedor: {
      id: 'fornecedor',
      labelKey: 'auth.profiles.fornecedor.title',
      sublabelKey: 'auth.profiles.fornecedor.subtitle',
      icon: Truck,
      bgImage: "https://images.unsplash.com/photo-1508404999913-79a3a2e75437?q=80&w=1920",
      titleKey: "auth.profiles.fornecedor.subtitle",
      descriptionKey: "auth.profiles.fornecedor.description",
      color: "from-[#2C5F6F] to-[#4FB3D4]", // Verde Petróleo
      stats: { val1: "48h", label1: "Entrega Média", val2: "5k+", label2: "SKUs" },
      features: ['f1', 'f2', 'f3', 'f4'],
      hasLogin: false
    },
    parceirosys: {
      id: 'parceirosys',
      labelKey: 'auth.profiles.parceiro.title',
      sublabelKey: 'auth.profiles.parceiro.subtitle',
      icon: Network,
      bgImage: "https://images.unsplash.com/photo-1601556033480-86e08be067f3?q=80&w=1920",
      titleKey: "auth.profiles.parceiro.subtitle",
      descriptionKey: "auth.profiles.parceiro.description",
      color: "from-[#9D50BB] to-[#6E48AA]", // Roxo Tech
      stats: { val1: "500k", label1: "Views/Mês", val2: "High", label2: "Conversão" },
      features: ['f1', 'f2', 'f3', 'f4'],
      hasLogin: false
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Preencha suas credenciais');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      onLogin(email, password, activeTab, rememberMe);
      setIsLoading(false);
    }, 1000);
  };

  const handleFornecedorClick = (tipoId: string) => {
    setTipoFornecedorInicial(tipoId);
    setMostrarWizardFornecedor(true);
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      const activeElement = scrollRef.current.querySelector(`[data-id="${activeTab}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeTab]);

  // Se o Wizard estiver ativo, renderiza ele em tela cheia
  if (mostrarWizardFornecedor) {
    return (
      <EscolhaTipoFornecedor
        initialType={tipoFornecedorInicial}
        onComplete={(dados) => { 
            // Callback para App.tsx via onRegister passando dados extras
            // Mas LandingPage não tem prop direta para isso, então vamos adaptar
            // Como onRegister aceita string, vamos usar o localStorage ou adaptar o App.tsx depois
            // Por enquanto, chamamos onRegister('fornecedor') e salvamos dados no localStorage
            localStorage.setItem('sysconecta_temp_fornecedor_data', JSON.stringify(dados));
            
            if (onFornecedorBypass && dados.empresaPreCadastrada) {
                onFornecedorBypass(dados);
            } else {
                onRegister('fornecedor');
            }
        }}
        onBack={() => {
            setMostrarWizardFornecedor(false);
            setTipoFornecedorInicial(null);
        }}
      />
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white font-sans selection:bg-[#D4AF37] selection:text-black">
      
      {/* 1. BACKGROUND DINÂMICO */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/95 z-10" />
          <img 
            src={perfis[activeTab].bgImage} 
            alt="Background" 
            className="w-full h-full object-cover opacity-60"
          />
        </motion.div>
      </AnimatePresence>

      {/* 2. HEADER: LOGO SYSCONECTA 2026 */}
      <header className="absolute top-0 left-0 right-0 z-20 pt-12 flex flex-col items-center justify-center text-center pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D4AF37]/10 blur-[100px] rounded-full" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-[380px] md:w-[500px] h-auto cursor-default">
            <SysConectaLogo />
          </div>
          <div className="mt-[-15px] flex items-center gap-4 opacity-90">
             <div className="h-[1px] w-4 md:w-16 bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
             <div className="flex flex-wrap justify-center gap-3 text-[10px] md:text-sm font-bold tracking-[0.2em] text-white/80">
                <span className="text-white hover:text-[#D4AF37] transition-colors cursor-default drop-shadow-md">SYSVIDRO</span>
                <span className="text-[#D4AF37] font-light">|</span>
                <span className="text-white hover:text-[#D4AF37] transition-colors cursor-default drop-shadow-md">SYSCONSTRUÇÃO</span>
                <span className="text-[#D4AF37] font-light">|</span>
                <span className="text-white hover:text-[#D4AF37] transition-colors cursor-default drop-shadow-md">SYSMARMORE</span>
             </div>
             <div className="h-[1px] w-4 md:w-16 bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
          </div>
        </div>
        <div 
          onClick={onAdminLogin}
          className="absolute top-8 right-8 pointer-events-auto px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] text-white/40 flex items-center gap-2 cursor-pointer hover:bg-white/10 hover:text-white transition-all hover:border-[#D4AF37]/50 group"
        >
          <Globe2 className="w-3 h-3 group-hover:text-[#D4AF37] transition-colors" />
          <span className="font-medium tracking-wide">GLOBAL</span>
        </div>
      </header>

      {/* 3. CONTEÚDO PRINCIPAL (MOBILE FIRST - BOTTOM ALIGNED) */}
      <main className="absolute inset-0 z-20 flex flex-col justify-end pb-8 px-0 md:pb-12 md:px-12 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-6xl mx-auto">
          
          {/* ÁREA DE CONTEÚDO */}
          <div className="px-6 md:px-0 mb-6">
            <AnimatePresence mode='wait'>
              {!showLogin ? (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6 md:text-left text-center"
                >
                  <div className="flex flex-col lg:flex-row gap-8 items-end justify-between">
                    
                    {/* COLUNA ESQUERDA: TÍTULOS E DESCRIÇÃO */}
                    <div className="flex-1 space-y-4 max-w-2xl">
                      <motion.div 
                        key={`title-${activeTab}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-4`}>
                          {React.createElement(perfis[activeTab].icon, { className: "w-3 h-3 text-white/80" })}
                          <span className="text-[10px] uppercase tracking-widest font-bold text-white/80">
                            {t(perfis[activeTab].labelKey).split(' / ')[0]}
                          </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl lg:text-5xl font-bold leading-tight tracking-tight mb-2">
                          <span className={`text-transparent bg-clip-text bg-gradient-to-r ${perfis[activeTab].color}`}>
                            {t(perfis[activeTab].titleKey)}
                          </span>
                        </h1>

                        <p className="text-white/70 text-base md:text-lg leading-relaxed md:mx-0">
                          {t(perfis[activeTab].descriptionKey)}
                        </p>
                      </motion.div>

                      {/* --- ÁREA DE AÇÃO DINÂMICA --- */}
                      <div className="pt-4 max-w-md mx-auto md:mx-0">
                        {/* 1. FORNECEDOR: BOTÕES DE CATEGORIA */}
                        {activeTab === 'fornecedor' && (
                          <div className="flex flex-col gap-3">
                            <button
                              onClick={() => handleFornecedorClick('vidros')}
                              className="w-full px-6 py-4 rounded-xl font-bold text-black flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]"
                            >
                                <div className="flex items-center gap-3">
                                    <Wine className="w-5 h-5" />
                                    <span>FORNECEDOR DE VIDRO</span>
                                </div>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleFornecedorClick('aluminio')}
                              className="w-full px-6 py-4 rounded-xl font-bold text-black flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg bg-gradient-to-r from-[#A3A3A3] to-[#E0E0E0]"
                            >
                                <div className="flex items-center gap-3">
                                    <Component className="w-5 h-5" />
                                    <span>FORNECEDOR DE ALUMÍNIO</span>
                                </div>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleFornecedorClick('acessorios')}
                              className="w-full px-6 py-4 rounded-xl font-bold text-black flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg bg-gradient-to-r from-[#CD7F32] to-[#FFA07A]"
                            >
                                <div className="flex items-center gap-3">
                                    <Wrench className="w-5 h-5" />
                                    <span>FORNECEDOR DE ACESSÓRIOS</span>
                                </div>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                          </div>
                        )}

                        {/* 2. INDÚSTRIA: BOTÕES DE TIPO (SEM LOGIN) */}
                        {activeTab === 'industria' && (
                          <div className="flex flex-col gap-3">
                              <button className="w-full px-6 py-4 rounded-xl font-bold text-black flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg bg-gradient-to-r from-[#4A90E2] to-[#87CEFA]">
                                <div className="flex items-center gap-3">
                                    <Factory className="w-5 h-5" />
                                    <span>INDÚSTRIA DE TRANSFORMAÇÃO</span>
                                </div>
                                <ArrowRight className="w-5 h-5" />
                              </button>
                              <button className="w-full px-6 py-4 rounded-xl font-bold text-black flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg bg-gradient-to-r from-[#A3A3A3] to-[#E0E0E0]">
                                <div className="flex items-center gap-3">
                                    <Store className="w-5 h-5" />
                                    <span>CENTRO DE DISTRIBUIÇÃO</span>
                                </div>
                                <ArrowRight className="w-5 h-5" />
                              </button>
                          </div>
                        )}

                        {/* 3. PARCEIRO SYS: BOTÃO DE INTERESSE */}
                        {activeTab === 'parceirosys' && (
                           <button className="w-full px-8 py-4 rounded-xl font-bold text-white border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all flex items-center justify-center gap-3">
                              QUERO SER UM PARCEIRO
                              <ArrowRight className="w-5 h-5" />
                           </button>
                        )}

                        {/* 4. PADRÃO (VIDRACEIRO, ARQUITETO, CONSTRUTOR): LOGIN E CADASTRO */}
                        {activeTab !== 'fornecedor' && activeTab !== 'industria' && activeTab !== 'parceirosys' && (
                            <div className="flex flex-col md:flex-row gap-4">
                                <button
                                onClick={() => setShowLogin(true)}
                                className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg bg-gradient-to-r ${perfis[activeTab].color} text-black`}
                                >
                                Acessar Plataforma <ArrowRight className="w-5 h-5" />
                                </button>
                                
                                <button 
                                onClick={() => onRegister(activeTab)}
                                className="w-full md:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-white font-medium hover:bg-white/10 transition-colors"
                                >
                                Solicitar Acesso
                                </button>
                            </div>
                        )}
                      </div>
                    </div>

                    {/* COLUNA DIREITA: CHECKLIST DINÂMICO */}
                    {perfis[activeTab].features.length > 0 && (
                      <motion.div 
                        key={`checklist-${activeTab}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="hidden lg:grid grid-cols-2 gap-x-6 gap-y-3 bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 w-full lg:w-auto min-w-[420px]"
                      >
                        {perfis[activeTab].features.map((featureKey, idx) => (
                          <div key={idx} className="flex items-start gap-3 group">
                            <CheckCircle2 className={`w-4 h-4 mt-0.5 text-white/40 group-hover:text-[#D4AF37] transition-colors shrink-0`} />
                            <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors text-left leading-tight">
                              {t(`auth.profiles.${perfis[activeTab].id}.${featureKey}`) || featureKey}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    )}

                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl max-w-md mx-auto md:mx-0"
                >
                  <div className="flex items-center justify-between mb-6">
                    <button 
                      onClick={() => setShowLogin(false)} 
                      className="flex items-center gap-2 text-white/70 hover:text-white transition-colors py-2 px-1 -ml-1 group"
                    >
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                      <span className="font-medium">Voltar</span>
                    </button>
                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider">
                      <span className={`text-transparent bg-clip-text bg-gradient-to-r ${perfis[activeTab].color}`}>
                        {t(perfis[activeTab].labelKey).split(' / ')[0]}
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-white/60 ml-1">E-mail Corporativo</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-white/60 ml-1">Senha</label>
                      <div className="relative">
                        <input 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                          placeholder="••••••••"
                        />
                        <Lock className="absolute right-4 top-3.5 w-4 h-4 text-white/30" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="remember-me"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-white/30 bg-white/5 transition-all checked:border-[#D4AF37] checked:bg-[#D4AF37]"
                        />
                        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity peer-checked:opacity-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5 text-black"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="1"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      <label htmlFor="remember-me" className="cursor-pointer select-none text-xs text-white/70 hover:text-white transition-colors">
                        Lembrar-me neste dispositivo
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-4 mt-2 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r ${perfis[activeTab].color} text-black`}
                    >
                      {isLoading ? "Autenticando..." : "Entrar"}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 4. CARROSSEL DE PERFIS */}
          <div className="mt-4 mb-2">
            <p className="px-6 md:px-0 text-[10px] text-white/30 uppercase tracking-widest font-bold mb-3">
              Selecione seu Perfil
            </p>
            
            <div 
              ref={scrollRef}
              className="flex gap-3 overflow-x-auto pb-6 px-6 md:px-0 snap-x snap-mandatory scrollbar-hide mask-fade-right"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {Object.values(perfis).map((perfil) => (
                <button
                  key={perfil.id}
                  data-id={perfil.id}
                  onClick={() => {
                    setActiveTab(perfil.id as PerfilKey);
                    setShowLogin(false);
                  }}
                  className={`relative flex-shrink-0 w-36 md:w-48 p-4 rounded-xl border transition-all duration-300 snap-center group text-left ${
                    activeTab === perfil.id 
                      ? "bg-white/10 border-white/30 shadow-lg scale-100" 
                      : "bg-black/40 border-white/5 opacity-60 hover:opacity-100 hover:bg-white/5 scale-95"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      activeTab === perfil.id ? "bg-white text-black" : "bg-white/10 text-white"
                    }`}>
                      {React.createElement(perfil.icon, { className: "w-4 h-4" })}
                    </div>
                  </div>
                  
                  <h3 className={`font-bold text-sm leading-tight ${activeTab === perfil.id ? "text-white" : "text-white/70"}`}>
                    {t(perfil.labelKey).split(' / ')[0]}
                  </h3>
                  <p className="text-[10px] text-white/40 mt-0.5 line-clamp-1">
                    {t(perfil.sublabelKey)}
                  </p>
                  
                  {activeTab === perfil.id && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute inset-0 border-2 border-white/20 rounded-xl pointer-events-none"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}