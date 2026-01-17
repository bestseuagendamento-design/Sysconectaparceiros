import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, Building2, Phone, Mail, MapPin, CreditCard, 
  ArrowRight, CheckCircle2, Shield, Zap,
  ChevronLeft, Hash, Home
} from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface CadastroDadosPremiumProps {
  onComplete: (dados?: any) => void;
  onBack: () => void;
  perfilSelecionado?: string;
}

export function CadastroDadosPremium({ onComplete, onBack, perfilSelecionado }: CadastroDadosPremiumProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1 - Dados Principais
    nomeCompleto: '',
    nomeFantasia: '',
    cpfCnpj: '',
    email: '',
    telefone: '',
    
    // Step 2 - Endereço
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cep: '',
    cidade: '',
    estado: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // Validar step 1
      if (!formData.nomeCompleto || !formData.cpfCnpj || !formData.email || !formData.telefone) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
      setStep(2);
    } else {
      // Validar step 2 e finalizar
      if (!formData.endereco || !formData.cep || !formData.cidade || !formData.estado) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
      
      setIsLoading(true);
      console.log('📋 CADASTRO COMPLETO:', formData);
      
      try {
        // Enviar email de confirmação de cadastro
        const emailResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/auth/signup-confirmation`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({
              nome: formData.nomeCompleto,
              email: formData.email,
              empresa: formData.nomeFantasia || formData.nomeCompleto,
              perfil: perfilSelecionado || 'cliente',
            }),
          }
        );

        if (emailResponse.ok) {
          const emailData = await emailResponse.json();
          console.log('✅ Email de confirmação enviado:', emailData);
        } else {
          console.warn('⚠️ Não foi possível enviar email de confirmação');
        }
      } catch (error) {
        console.warn('⚠️ Erro ao enviar email de confirmação:', error);
      }
      
      setTimeout(() => {
        setIsLoading(false);
        onComplete(formData);
      }, 2000);
    }
  };

  const getPerfilColor = () => {
    const colors: Record<string, string> = {
      vidraceiro: '#D4AF37',
      arquiteto: '#2E5266',
      construtor: '#4A7C9B',
      industria_guardian: '#6B46C1',
      fornecedor: '#B87333',
      parceirosys: '#10B981',
    };
    return colors[perfilSelecionado || ''] || '#D4AF37';
  };

  const perfilColor = getPerfilColor();

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#0A0A0A]">
      {/* ========================================
          BACKGROUND PREMIUM (mesmo do login)
          ======================================== */}
      <div className="absolute inset-0">
        {/* Gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0F0F0F]" />
        
        {/* Grid tech pattern */}
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

        {/* Glow orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[200px] opacity-10 animate-pulse" 
             style={{ backgroundColor: perfilColor }} />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#2E5266] rounded-full blur-[200px] opacity-10 animate-pulse" 
             style={{ animationDelay: '1s' }} />
        
        {/* Diagonal lines */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent"
              style={{
                width: '200%',
                top: `${20 + i * 20}%`,
                left: '-50%',
                transform: 'rotate(-15deg)',
              }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scaleX: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      </div>

      {/* ========================================
          CONTEÚDO PRINCIPAL
          ======================================== */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6 py-16">
        <div className="w-full max-w-3xl">
          
          {/* ========================================
              HEADER - LOGO + PROGRESSO
              ======================================== */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            {/* Logo SysConecta 2026 */}
            <div className="mb-8">
              <div className="flex items-baseline justify-center gap-4 mb-3">
                <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent">
                  SysConecta
                </h1>
                <span className="text-2xl font-bold text-[#D4AF37]/80">
                  2026
                </span>
              </div>
              
              {/* Linha decorativa */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              </div>

              {/* Subtítulo */}
              <div className="text-sm tracking-[0.3em] text-gray-400 font-light uppercase mb-8">
                SYSVIDRO | SYSCONSTRUÇÃO
              </div>
            </div>

            {/* Título da seção */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-white mb-2">
                Complete seu cadastro
              </h2>
              <p className="text-lg text-gray-400">
                Etapa {step} de 2 - {step === 1 ? 'Dados principais' : 'Endereço'}
              </p>
            </motion.div>

            {/* Progress bar */}
            <div className="mt-8 max-w-md mx-auto">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: perfilColor }}
                    initial={{ width: '0%' }}
                    animate={{ width: step === 1 ? '50%' : '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                <span className="text-sm font-semibold" style={{ color: perfilColor }}>
                  {step === 1 ? '50%' : '100%'}
                </span>
              </div>
              
              {/* Steps indicators */}
              <div className="flex justify-between mt-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    style={{ 
                      backgroundColor: step >= 1 ? `${perfilColor}20` : '#1A1A1A',
                      borderWidth: '2px',
                      borderColor: step >= 1 ? perfilColor : '#374151'
                    }}
                  >
                    {step > 1 ? (
                      <CheckCircle2 className="w-5 h-5" style={{ color: perfilColor }} />
                    ) : (
                      <span className="text-xs font-bold" style={{ color: step === 1 ? perfilColor : '#6B7280' }}>1</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">Dados</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    style={{ 
                      backgroundColor: step >= 2 ? `${perfilColor}20` : '#1A1A1A',
                      borderWidth: '2px',
                      borderColor: step >= 2 ? perfilColor : '#374151'
                    }}
                  >
                    <span className="text-xs font-bold" style={{ color: step === 2 ? perfilColor : '#6B7280' }}>2</span>
                  </div>
                  <span className="text-xs text-gray-400">Endereço</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ========================================
              FORM CARD
              ======================================== */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            {/* Glow effect */}
            <div 
              className="absolute -inset-4 rounded-3xl blur-2xl opacity-20"
              style={{ backgroundColor: perfilColor }}
            />

            {/* Card principal */}
            <div className="relative bg-[#1A1A1A]/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 md:p-10 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* ========================================
                    STEP 1 - DADOS PRINCIPAIS
                    ======================================== */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    {/* Nome Completo */}
                    <div>
                      <label htmlFor="nomeCompleto" className="block text-sm font-medium text-gray-300 mb-2">
                        Nome completo / Razão social *
                      </label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" />
                        <input
                          id="nomeCompleto"
                          type="text"
                          value={formData.nomeCompleto}
                          onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                          placeholder="Digite seu nome ou razão social"
                          className="w-full pl-12 pr-4 py-3.5 bg-[#0A0A0A]/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 transition-all duration-200 outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
                          required
                        />
                      </div>
                    </div>

                    {/* Nome Fantasia */}
                    <div>
                      <label htmlFor="nomeFantasia" className="block text-sm font-medium text-gray-300 mb-2">
                        Nome fantasia <span className="text-gray-500">(opcional)</span>
                      </label>
                      <div className="relative group">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" />
                        <input
                          id="nomeFantasia"
                          type="text"
                          value={formData.nomeFantasia}
                          onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
                          placeholder="Nome comercial da empresa"
                          className="w-full pl-12 pr-4 py-3.5 bg-[#0A0A0A]/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 transition-all duration-200 outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
                        />
                      </div>
                    </div>

                    {/* Grid 2 colunas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* CPF/CNPJ */}
                      <div>
                        <label htmlFor="cpfCnpj" className="block text-sm font-medium text-gray-300 mb-2">
                          CPF ou CNPJ *
                        </label>
                        <div className="relative group">
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" />
                          <input
                            id="cpfCnpj"
                            type="text"
                            value={formData.cpfCnpj}
                            onChange={(e) => setFormData({ ...formData, cpfCnpj: e.target.value })}
                            placeholder="000.000.000-00"
                            className="w-full pl-12 pr-4 py-3.5 bg-[#0A0A0A]/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 transition-all duration-200 outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
                            required
                          />
                        </div>
                      </div>

                      {/* Telefone */}
                      <div>
                        <label htmlFor="telefone" className="block text-sm font-medium text-gray-300 mb-2">
                          Telefone *
                        </label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" />
                          <input
                            id="telefone"
                            type="tel"
                            value={formData.telefone}
                            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                            placeholder="(00) 00000-0000"
                            className="w-full pl-12 pr-4 py-3.5 bg-[#0A0A0A]/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 transition-all duration-200 outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        E-mail corporativo *
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" />
                        <input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="seu@email.com.br"
                          className="w-full pl-12 pr-4 py-3.5 bg-[#0A0A0A]/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 transition-all duration-200 outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ========================================
                    STEP 2 - ENDEREÇO
                    ======================================== */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* CEP */}
                    <div>
                      <label htmlFor="cep" className="block text-sm font-medium text-gray-300 mb-2">
                        CEP *
                      </label>
                      <div className="relative group">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" />
                        <input
                          id="cep"
                          type="text"
                          value={formData.cep}
                          onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                          placeholder="00000-000"
                          className="w-full pl-12 pr-4 py-3.5 bg-[#0A0A0A]/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 transition-all duration-200 outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
                          required
                        />
                      </div>
                    </div>

                    {/* Endereço + Número */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <label htmlFor="endereco" className="block text-sm font-medium text-gray-300 mb-2">
                          Endereço *
                        </label>
                        <div className="relative group">
                          <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" />
                          <input
                            id="endereco"
                            type="text"
                            value={formData.endereco}
                            onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                            placeholder="Rua, avenida..."
                            className="w-full pl-12 pr-4 py-3.5 bg-[#0A0A0A]/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 transition-all duration-200 outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="numero" className="block text-sm font-medium text-gray-300 mb-2">
                          Número
                        </label>
                        <input
                          id="numero"
                          type="text"
                          value={formData.numero}
                          onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                          placeholder="Nº"
                          className="w-full px-4 py-3.5 bg-[#0A0A0A]/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 transition-all duration-200 outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
                        />
                      </div>
                    </div>

                    {/* Complemento + Bairro */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="complemento" className="block text-sm font-medium text-gray-300 mb-2">
                          Complemento <span className="text-gray-500">(opcional)</span>
                        </label>
                        <input
                          id="complemento"
                          type="text"
                          value={formData.complemento}
                          onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                          placeholder="Apto, sala..."
                          className="w-full px-4 py-3.5 bg-[#0A0A0A]/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 transition-all duration-200 outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
                        />
                      </div>

                      <div>
                        <label htmlFor="bairro" className="block text-sm font-medium text-gray-300 mb-2">
                          Bairro
                        </label>
                        <input
                          id="bairro"
                          type="text"
                          value={formData.bairro}
                          onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                          placeholder="Seu bairro"
                          className="w-full px-4 py-3.5 bg-[#0A0A0A]/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 transition-all duration-200 outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
                        />
                      </div>
                    </div>

                    {/* Cidade + Estado */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <label htmlFor="cidade" className="block text-sm font-medium text-gray-300 mb-2">
                          Cidade *
                        </label>
                        <div className="relative group">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" />
                          <input
                            id="cidade"
                            type="text"
                            value={formData.cidade}
                            onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                            placeholder="Sua cidade"
                            className="w-full pl-12 pr-4 py-3.5 bg-[#0A0A0A]/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 transition-all duration-200 outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="estado" className="block text-sm font-medium text-gray-300 mb-2">
                          Estado *
                        </label>
                        <select
                          id="estado"
                          value={formData.estado}
                          onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                          className="w-full px-4 py-3.5 bg-[#0A0A0A]/50 border border-gray-700 rounded-xl text-white transition-all duration-200 outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
                          required
                        >
                          <option value="">UF</option>
                          <option value="AC">AC</option>
                          <option value="AL">AL</option>
                          <option value="AP">AP</option>
                          <option value="AM">AM</option>
                          <option value="BA">BA</option>
                          <option value="CE">CE</option>
                          <option value="DF">DF</option>
                          <option value="ES">ES</option>
                          <option value="GO">GO</option>
                          <option value="MA">MA</option>
                          <option value="MT">MT</option>
                          <option value="MS">MS</option>
                          <option value="MG">MG</option>
                          <option value="PA">PA</option>
                          <option value="PB">PB</option>
                          <option value="PR">PR</option>
                          <option value="PE">PE</option>
                          <option value="PI">PI</option>
                          <option value="RJ">RJ</option>
                          <option value="RN">RN</option>
                          <option value="RS">RS</option>
                          <option value="RO">RO</option>
                          <option value="RR">RR</option>
                          <option value="SC">SC</option>
                          <option value="SP">SP</option>
                          <option value="SE">SE</option>
                          <option value="TO">TO</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ========================================
                    FOOTER - BOTÕES
                    ======================================== */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-700/50">
                  {step === 2 && (
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0A0A0A]/50 border border-gray-700 text-gray-300 font-medium rounded-xl hover:border-gray-600 hover:bg-[#1A1A1A] transition-all duration-200"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Voltar
                    </button>
                  )}
                  
                  {step === 1 && (
                    <button
                      type="button"
                      onClick={onBack}
                      className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0A0A0A]/50 border border-gray-700 text-gray-300 font-medium rounded-xl hover:border-gray-600 hover:bg-[#1A1A1A] transition-all duration-200"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Voltar
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold rounded-xl hover:shadow-2xl hover:shadow-[#D4AF37]/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Salvando...
                      </>
                    ) : step === 1 ? (
                      <>
                        Próxima Etapa
                        <ArrowRight className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        Concluir Cadastro
                        <CheckCircle2 className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Security badge */}
              <div className="mt-6 pt-6 border-t border-gray-700/50">
                <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#D4AF37]" />
                    <span>Dados criptografados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#D4AF37]" />
                    <span>Processo rápido</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}