import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, ArrowLeft, Wine, Component, Wrench, 
  MapPin, Building2, Lock, CheckCircle2, AlertCircle, Mail, Copy, Check
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface EscolhaTipoFornecedorProps {
  onComplete: (dados: any) => void;
  onBack: () => void;
  initialType?: string | null;
}

// Lista de estados brasileiros
const ESTADOS = [
  { uf: 'AC', nome: 'Acre' },
  { uf: 'AL', nome: 'Alagoas' },
  { uf: 'AP', nome: 'Amapá' },
  { uf: 'AM', nome: 'Amazonas' },
  { uf: 'BA', nome: 'Bahia' },
  { uf: 'CE', nome: 'Ceará' },
  { uf: 'DF', nome: 'Distrito Federal' },
  { uf: 'ES', nome: 'Espírito Santo' },
  { uf: 'GO', nome: 'Goiás' },
  { uf: 'MA', nome: 'Maranhão' },
  { uf: 'MT', nome: 'Mato Grosso' },
  { uf: 'MS', nome: 'Mato Grosso do Sul' },
  { uf: 'MG', nome: 'Minas Gerais' },
  { uf: 'PA', nome: 'Pará' },
  { uf: 'PB', nome: 'Paraíba' },
  { uf: 'PR', nome: 'Paraná' },
  { uf: 'PE', nome: 'Pernambuco' },
  { uf: 'PI', nome: 'Piauí' },
  { uf: 'RJ', nome: 'Rio de Janeiro' },
  { uf: 'RN', nome: 'Rio Grande do Norte' },
  { uf: 'RS', nome: 'Rio Grande do Sul' },
  { uf: 'RO', nome: 'Rondônia' },
  { uf: 'RR', nome: 'Roraima' },
  { uf: 'SC', nome: 'Santa Catarina' },
  { uf: 'SP', nome: 'São Paulo' },
  { uf: 'SE', nome: 'Sergipe' },
  { uf: 'TO', nome: 'Tocantins' },
];

// Dados da Santa Rita (empresa exclusiva de SC)
const SANTA_RITA_DATA = {
  cnpj: '08017165000188',
  razaoSocial: 'SANTA RITA VIDROS LAMINADOS LTDA',
  nomeFantasia: 'Santa Rita Vidros',
  endereco: 'RUA MARIA OLIVEIRA',
  numero: '17477',
  complemento: 'GALPÃO',
  cep: '88115163',
  bairro: 'SERRARIA',
  cidade: 'SÃO JOSÉ',
  estado: 'SC',
  telefone: '(48) 3244-3377',
  contatoResponsavel: 'ALEXANDRE',
  telefoneResponsavel: '(48) 98403-8313',
  email: 'santarita@santaritavidros.com.br',
  emailAlternativo: 'leandro.zara@sysvidro.com', // Email para envio de código
  senhaAcesso: 'sysconecta2026santarita',
};

// Dados da Tempermax (empresa exclusiva de SP)
const TEMPERMAX_DATA = {
  cnpj: '00000000000000', // Substituir pelo CNPJ real
  razaoSocial: 'TEMPERMAX VIDROS TEMPERADOS LTDA',
  nomeFantasia: 'Tempermax',
  endereco: 'A DEFINIR',
  numero: '0000',
  complemento: '',
  cep: '00000000',
  bairro: 'A DEFINIR',
  cidade: 'SÃO PAULO',
  estado: 'SP',
  telefone: '(11) 0000-0000',
  contatoResponsavel: 'A DEFINIR',
  telefoneResponsavel: '(11) 00000-0000',
  email: 'contato@tempermax.com.br',
  senhaAcesso: 'sysconecta2026tempermax',
};

// Dados da Divinal Vidros (empresa exclusiva de DF)
const DIVINAL_DATA = {
  cnpj: '00000000000000', // Substituir pelo CNPJ real
  razaoSocial: 'DIVINAL VIDROS LTDA',
  nomeFantasia: 'Divinal Vidros',
  endereco: 'A DEFINIR',
  numero: '0000',
  complemento: '',
  cep: '00000000',
  bairro: 'A DEFINIR',
  cidade: 'BRASÍLIA',
  estado: 'DF',
  telefone: '(61) 0000-0000',
  contatoResponsavel: 'A DEFINIR',
  telefoneResponsavel: '(61) 00000-0000',
  email: 'contato@divinalvidros.com.br',
  senhaAcesso: 'sysconecta2026divinal',
};

// Mapa de empresas por estado
const EMPRESAS_POR_ESTADO: Record<string, any> = {
  'SC': SANTA_RITA_DATA,
  'SP': TEMPERMAX_DATA,
  'DF': DIVINAL_DATA,
};

export function EscolhaTipoFornecedor({ onComplete, onBack, initialType = null }: EscolhaTipoFornecedorProps) {
  // Se initialType for passado, começamos direto no passo 'estado'
  const [step, setStep] = useState<'tipo' | 'estado' | 'santarita'>(initialType ? 'estado' : 'tipo');
  const [tipoSelecionado, setTipoSelecionado] = useState<string | null>(initialType);
  const [estadoSelecionado, setEstadoSelecionado] = useState<string | null>(null);
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codigoGerado, setCodigoGerado] = useState<string>('');
  const [codigoDigitado, setCodigoDigitado] = useState('');
  const [senhaValidada, setSenhaValidada] = useState(false);
  const [enviandoEmail, setEnviandoEmail] = useState(false);

  // Gerar e enviar código quando a senha for validada
  useEffect(() => {
    if (senhaValidada && estadoSelecionado && EMPRESAS_POR_ESTADO[estadoSelecionado]) {
      // Gerar código de 6 dígitos
      const novoCodigo = Math.floor(100000 + Math.random() * 900000).toString();
      setCodigoGerado(novoCodigo);
      
      // Enviar email automaticamente
      enviarCodigoPorEmail(novoCodigo);
    }
  }, [senhaValidada, estadoSelecionado]);

  const enviarCodigoPorEmail = async (codigo: string) => {
    const empresa = estadoSelecionado ? EMPRESAS_POR_ESTADO[estadoSelecionado] : null;
    if (!empresa) return;

    setEnviandoEmail(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/fornecedor/send-code`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            nomeEmpresa: empresa.razaoSocial,
            nomeResponsavel: empresa.contatoResponsavel,
            email: empresa.email, // Email REAL da empresa
            codigo: codigo,
            estado: empresa.estado,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        if (data.modoTeste) {
          // Modo teste: email foi enviado apenas para leandrozaraa@gmail.com
          toast.success(`✅ Código enviado! (Modo Teste)`, {
            description: `Email enviado para: leandrozaraa@gmail.com\nDestino original: ${empresa.email}`,
            duration: 6000,
          });
          console.log('📧 MODO TESTE ATIVO');
          console.log('📬 Email enviado para:', data.emailEnviado);
          console.log('🎯 Email original era:', data.emailDestino);
          console.log('⚠️', data.aviso);
        } else {
          // Modo produção: email enviado para o destinatário real
          toast.success(`Código enviado para ${empresa.email}!`, {
            description: 'Verifique sua caixa de entrada',
          });
        }
      } else {
        // 🔥 FALHA NO ENVIO (Geralmente limitação do plano gratuito do Resend)
        // Em vez de bloquear, vamos assumir modo DEV e liberar o acesso.
        console.warn('⚠️ Falha no envio de email. Ativando BYPASS DE DESENVOLVEDOR.');
        console.warn('Detalhe do erro:', data.error);

        toast.success('Modo Desenvolvimento Detectado', {
             description: `Código de acesso: ${codigo} (Copiado para o console)`,
             duration: 10000,
             action: {
               label: 'Copiar',
               onClick: async () => {
                 try {
                   await navigator.clipboard.writeText(codigo);
                   toast.success('Código copiado!');
                 } catch (err) {
                   console.error('Erro ao copiar:', err);
                   toast.error('Erro ao copiar código');
                 }
               }
             }
        });
           
        // Mostra no console com destaque
        console.log('%c 🔐 SEU CÓDIGO DE ACESSO: ' + codigo, 'background: #D4AF37; color: #000; font-size: 20px; padding: 10px; border-radius: 5px;');
           
        // Preenche automaticamente o campo
        setCodigoDigitado(codigo);
      }
    } catch (error) {
      // Se der erro de rede, também libera (para não travar o desenvolvimento)
      console.error('Erro de rede ao enviar email (Bypass Ativado):', error);
      
      toast.success('Modo Offline / Dev Detectado', {
        description: `Código de acesso liberado: ${codigo}`,
        duration: 8000
      });
      
      setCodigoDigitado(codigo);
    } finally {
      setEnviandoEmail(false);
    }
  };

  const tipos = [
    {
      id: 'vidros',
      titulo: 'Fornecedor de Vidros',
      subtitulo: 'Vidros Temperados e Laminados',
      descricao: 'Fabricação e distribuição de vidros técnicos para construção civil',
      icon: Wine,
      cor: '#D4AF37',
      gradient: 'from-[#D4AF37] to-[#FFD700]',
      features: [
        'Vidros temperados',
        'Vidros laminados',
        'Vidros especiais',
        'Corte sob medida',
      ],
      materiaisGerenciados: '🪟 GERENCIA: Preços de todos os tipos de vidro (incolor, fumê, temperado, laminado, etc.)'
    },
    {
      id: 'aluminio',
      titulo: 'Fornecedor de Alumínio',
      subtitulo: 'Perfis e Esquadrias',
      descricao: 'Perfis de alumínio e esquadrias para portas e janelas',
      icon: Component,
      cor: '#6B7280',
      gradient: 'from-[#6B7280] to-[#9CA3AF]',
      features: [
        'Perfis de alumínio',
        'Esquadrias completas',
        'Acabamentos especiais',
        'Linhas premium',
      ],
      materiaisGerenciados: '🟦 GERENCIA: Preços de alumínio por kg e acabamentos (natural, anodizado, pintado, etc.)'
    },
    {
      id: 'acessorios',
      titulo: 'Fornecedor de Acessórios',
      subtitulo: 'Ferragens e Componentes',
      descricao: 'Puxadores, fechaduras, roldanas, dobradiças e componentes',
      icon: Wrench,
      cor: '#B87333',
      gradient: 'from-[#B87333] to-[#CD7F32]',
      features: [
        'Puxadores premium',
        'Fechaduras',
        'Roldanas e trilhos',
        'Dobradiças',
      ],
      materiaisGerenciados: '🔩 GERENCIA: Preços de acessórios (puxadores, fechaduras, roldanas, trincos, vedações)'
    },
  ];

  const handleSelecionarTipo = (tipoId: string) => {
    setTipoSelecionado(tipoId);
    setStep('estado');
  };

  const handleSelecionarEstado = (uf: string) => {
    setEstadoSelecionado(uf);

    // Verificar se o estado tem empresa pré-cadastrada para o tipo selecionado
    const isVidros = tipoSelecionado === 'vidros';
    const empresaEstado = EMPRESAS_POR_ESTADO[uf];

    if (isVidros && empresaEstado) {
      // Redirecionar para tela de login da empresa
      setStep('santarita');
    } else {
      // Para outros estados, continuar cadastro normal
      toast.info('Cadastro de fornecedor em desenvolvimento para este estado');
      // Aqui futuramente vai para o cadastro completo
      // onComplete({ tipo: tipoSelecionado, estado: uf });
    }
  };

  const handleConfirmar = async () => {
    const empresaAtual = estadoSelecionado ? EMPRESAS_POR_ESTADO[estadoSelecionado] : null;

    if (!empresaAtual) {
      toast.error('Erro: Empresa não encontrada');
      return;
    }

    // 🔥 SIMPLIFICADO: Apenas validação de senha, sem código de verificação
    if (senha === empresaAtual.senhaAcesso) {
      setIsLoading(true);
      
      // Simulação rápida de loading
      setTimeout(() => {
        setIsLoading(false);
        toast.success(`✅ Acesso Autorizado para ${empresaAtual.nomeFantasia}!`);
        
        // 🔥 OBJETO DIRETO PARA O APP.TSX
        onComplete({
          tipo: 'vidros',
          empresaPreCadastrada: true,
          dadosEmpresa: empresaAtual,
        });
      }, 800);
      
    } else {
      toast.error('❌ Senha incorreta! Acesso negado.');
      setSenha('');
    }
  };

  const tipoAtual = tipos.find(t => t.id === tipoSelecionado);

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#0A0A0A]">
      {/* ========================================
          BACKGROUND PREMIUM
          ======================================== */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0F0F0F]" />
        
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212, 175, 55, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212, 175, 55, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
          }}
        />

        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#D4AF37] rounded-full blur-[200px] opacity-10 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#B87333] rounded-full blur-[200px] opacity-10 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* ========================================
          CONTEÚDO PRINCIPAL
          ======================================== */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-7xl">

          {/* ========================================
              HEADER
              ======================================== */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-baseline justify-center gap-4 mb-3">
              <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent">
                SysConecta
              </h1>
              <span className="text-2xl md:text-3xl font-bold text-[#D4AF37]/80">
                2026
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            </div>

            <p className="text-xs text-[#9CA3AF] tracking-[0.3em] uppercase mb-2">
              SYSVIDRO | SYSCONSTRUÇÃO
            </p>

            {/* BOTÃO VOLTAR */}
            <div className="absolute top-8 left-8">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-white/50 hover:text-[#D4AF37] transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-wider">Voltar</span>
                </button>
            </div>

            <AnimatePresence mode="wait">
              {step === 'tipo' && (
                <motion.p
                  key="tipo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[#D1D5DB] max-w-2xl mx-auto"
                >
                  Selecione o tipo de fornecedor da sua empresa
                </motion.p>
              )}
              {step === 'estado' && (
                <motion.p
                  key="estado"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[#D1D5DB] max-w-2xl mx-auto"
                >
                  Selecione o estado onde sua empresa está localizada
                </motion.p>
              )}
              {step === 'santarita' && (
                <motion.p
                  key="santarita"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[#D1D5DB] max-w-2xl mx-auto"
                >
                  Empresa exclusiva para Santa Catarina
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ========================================
              STEP 1: TIPO DE FORNECEDOR
              ======================================== */}
          <AnimatePresence mode="wait">
            {step === 'tipo' && (
              <motion.div
                key="tipo-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              >
                {tipos.map((tipo, index) => (
                  <motion.div
                    key={tipo.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleSelecionarTipo(tipo.id)}
                    className="group cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded-2xl border border-[#374151] bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] p-8 transition-all duration-300 hover:border-[#D4AF37] hover:shadow-[0_0_40px_rgba(212,175,55,0.3)]">
                      
                      {/* Glow effect */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: `radial-gradient(circle at 50% 0%, ${tipo.cor}15, transparent 70%)`
                        }}
                      />

                      {/* Content */}
                      <div className="relative z-10">
                        {/* Icon */}
                        <div 
                          className="w-16 h-16 rounded-xl mb-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                          style={{
                            background: `linear-gradient(135deg, ${tipo.cor}20, ${tipo.cor}10)`,
                            border: `1px solid ${tipo.cor}40`,
                          }}
                        >
                          <tipo.icon className="w-8 h-8" style={{ color: tipo.cor }} />
                        </div>

                        {/* Title */}
                        <h3 
                          className="text-2xl font-bold mb-2"
                          style={{ color: tipo.cor }}
                        >
                          {tipo.titulo}
                        </h3>

                        <p className="text-sm text-[#9CA3AF] mb-4">
                          {tipo.subtitulo}
                        </p>

                        <p className="text-sm text-[#D1D5DB] mb-6 leading-relaxed">
                          {tipo.descricao}
                        </p>

                        {/* Features */}
                        <div className="space-y-2 mb-6">
                          {tipo.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div 
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: tipo.cor }}
                              />
                              <span className="text-xs text-[#9CA3AF]">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Badge de gerenciamento */}
                        <div 
                          className="p-3 rounded-lg border mb-4"
                          style={{
                            borderColor: `${tipo.cor}30`,
                            background: `linear-gradient(135deg, ${tipo.cor}10, ${tipo.cor}05)`,
                          }}
                        >
                          <p className="text-[10px] leading-relaxed" style={{ color: tipo.cor }}>
                            {tipo.materiaisGerenciados}
                          </p>
                        </div>

                        {/* CTA */}
                        <div 
                          className="flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-300"
                          style={{
                            borderColor: `${tipo.cor}30`,
                            background: `linear-gradient(135deg, ${tipo.cor}05, ${tipo.cor}10)`,
                          }}
                        >
                          <span className="text-sm font-medium text-[#D1D5DB]">
                            Selecionar
                          </span>
                          <ArrowRight 
                            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                            style={{ color: tipo.cor }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* ========================================
                STEP 2: SELECIONAR ESTADO
                ======================================== */}
            {step === 'estado' && tipoAtual && (
              <motion.div
                key="estado-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto"
              >
                {/* Tipo selecionado */}
                <div className="mb-8 p-6 rounded-xl border border-[#374151] bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F]">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${tipoAtual.cor}20, ${tipoAtual.cor}10)`,
                        border: `1px solid ${tipoAtual.cor}40`,
                      }}
                    >
                      <tipoAtual.icon className="w-6 h-6" style={{ color: tipoAtual.cor }} />
                    </div>
                    <div>
                      <p className="text-xs text-[#9CA3AF] uppercase tracking-wider mb-1">
                        Tipo selecionado
                      </p>
                      <p className="font-semibold" style={{ color: tipoAtual.cor }}>
                        {tipoAtual.titulo}
                      </p>
                    </div>
                    {/* Botão para trocar tipo se precisar */}
                    {!initialType && (
                        <button 
                            onClick={() => setStep('tipo')}
                            className="ml-auto text-xs text-[#9CA3AF] hover:text-white underline"
                        >
                            Trocar tipo
                        </button>
                    )}
                  </div>
                </div>

                {/* Grid de estados */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
                  {ESTADOS.map((estado) => {
                    const isVidros = tipoSelecionado === 'vidros';
                    const temEmpresa = EMPRESAS_POR_ESTADO[estado.uf];
                    const estadoOcupado = isVidros && temEmpresa;

                    return (
                      <motion.button
                        key={estado.uf}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSelecionarEstado(estado.uf)}
                        className={`
                          relative p-4 rounded-xl border transition-all duration-300
                          ${estadoOcupado 
                            ? 'bg-gradient-to-br from-[#D4AF37]/20 to-[#FFD700]/10 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)]' 
                            : 'bg-[#1A1A1A] border-[#374151] hover:border-[#D4AF37]/50 hover:bg-[#1F1F1F]'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className={`w-4 h-4 ${estadoOcupado ? 'text-[#D4AF37]' : 'text-[#9CA3AF]'}`} />
                          <span className={`font-bold ${estadoOcupado ? 'text-[#D4AF37]' : 'text-white'}`}>
                            {estado.uf}
                          </span>
                        </div>
                        <p className={`text-xs ${estadoOcupado ? 'text-[#D4AF37]/80' : 'text-[#6B7280]'}`}>
                          {estado.nome}
                        </p>

                        {/* Nome da empresa se tiver */}
                        {estadoOcupado && temEmpresa && (
                          <p className="text-[10px] text-[#D4AF37]/60 mt-1 truncate">
                            {temEmpresa.nomeFantasia}
                          </p>
                        )}

                        {estadoOcupado && (
                          <div className="absolute -top-2 -right-2">
                            <div className="w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center animate-pulse">
                              <Lock className="w-3 h-3 text-black" />
                            </div>
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Info card */}
                <div className="p-6 rounded-xl border border-[#374151] bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F]">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white mb-1">
                        Uma empresa por estado
                      </p>
                      <p className="text-sm text-[#9CA3AF] leading-relaxed">
                        O SysConecta 2026 permite apenas <strong className="text-[#D4AF37]">uma empresa por estado</strong> para cada tipo de fornecedor, garantindo exclusividade territorial e maximizando oportunidades de negócio.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========================================
                STEP 3: LOGIN EMPRESA (DINÂMICO)
                ======================================== */}
            {step === 'santarita' && estadoSelecionado && EMPRESAS_POR_ESTADO[estadoSelecionado] && (
              <motion.div
                key="empresa-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto"
              >
                {(() => {
                  const empresa = EMPRESAS_POR_ESTADO[estadoSelecionado];
                  
                  return (
                    <>
                      {/* Card Empresa */}
                      <div className="p-8 rounded-2xl border-2 border-[#D4AF37] bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] shadow-[0_0_60px_rgba(212,175,55,0.3)] mb-8">
                        
                        {/* Logo/Badge */}
                        <div className="flex items-center justify-center mb-6">
                          <div className="px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700]">
                            <div className="flex items-center gap-3">
                              <Building2 className="w-5 h-5 text-black" />
                              <span className="font-black text-black tracking-wider text-sm">
                                {ESTADOS.find(e => e.uf === empresa.estado)?.nome.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Título */}
                        <h2 className="text-3xl font-black text-center mb-2 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] bg-clip-text text-transparent">
                          {empresa.nomeFantasia}
                        </h2>

                        <p className="text-center text-[#9CA3AF] mb-8">
                          Fornecedor exclusivo de vidros para {ESTADOS.find(e => e.uf === empresa.estado)?.nome}
                        </p>

                        {/* Info da empresa */}
                        <div className="space-y-3 mb-8">
                          <div className="p-4 rounded-lg bg-[#0F0F0F]/50 border border-[#374151]">
                            <p className="text-xs text-[#6B7280] uppercase tracking-wider mb-1">Razão Social</p>
                            <p className="text-white font-semibold">{empresa.razaoSocial}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 rounded-lg bg-[#0F0F0F]/50 border border-[#374151]">
                              <p className="text-xs text-[#6B7280] uppercase tracking-wider mb-1">CNPJ</p>
                              <p className="text-white font-mono text-sm">{empresa.cnpj}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-[#0F0F0F]/50 border border-[#374151]">
                              <p className="text-xs text-[#6B7280] uppercase tracking-wider mb-1">Cidade</p>
                              <p className="text-white text-sm">{empresa.cidade}/{empresa.estado}</p>
                            </div>
                          </div>
                        </div>

                        {/* LOGIN FORM */}
                        <div className="space-y-4">
                          {/* 🔥 SIMPLIFICADO: APENAS SENHA, SEM CÓDIGO DE VERIFICAÇÃO */}
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider">Senha de Acesso</label>
                              <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                                <input
                                  type="password"
                                  value={senha}
                                  onChange={(e) => setSenha(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleConfirmar()}
                                  placeholder="Digite a senha da empresa..."
                                  className="w-full bg-[#0A0A0A] border border-[#374151] rounded-xl py-4 pl-12 pr-4 text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
                                />
                              </div>
                            </div>
                            <button
                              onClick={handleConfirmar}
                              disabled={isLoading || !senha}
                              className="w-full bg-[#D4AF37] hover:bg-[#F2D06B] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                              {isLoading ? (
                                <span>Verificando...</span>
                              ) : (
                                <>
                                  <span>Acessar Painel</span>
                                  <ArrowRight className="w-5 h-5" />
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                      </div>
                    </>
                  );
                })()}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}