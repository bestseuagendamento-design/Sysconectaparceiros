import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, User, Building2, Phone, CheckCircle2, Sparkles, MapPin, Briefcase } from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface WaitlistModalPremiumProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistModalPremium({ isOpen, onClose }: WaitlistModalPremiumProps) {
  const [formData, setFormData] = useState({
    nome: '',
    empresa: '',
    cargo: '',
    telefone: '',
    email: '',
    cidade: '',
    estado: '',
    segmento: '',
    mensagem: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Enviar email de boas-vindas
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/waitlist/welcome`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            nome: formData.nome,
            email: formData.email,
            empresa: formData.empresa,
          }),
        }
      );

      const result = await response.json();
      
      if (result.success) {
        if (result.simulated) {
          console.log('⚠️ Modo simulação - Email não enviado (configure RESEND_API_KEY)');
        } else {
          console.log('✅ Email enviado com sucesso!');
        }
      } else {
        console.warn('⚠️ Não foi possível enviar email:', result.message);
      }
    } catch (error) {
      console.warn('⚠️ Erro na requisição de email (continuando normalmente):', error);
    }

    // Continuar com o fluxo normal (independente do email)
    setIsLoading(false);
    setIsSubmitted(true);
    
    console.log('📋 LISTA DE ESPERA VIP:', formData);
    
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
      setFormData({
        nome: '',
        empresa: '',
        cargo: '',
        telefone: '',
        email: '',
        cidade: '',
        estado: '',
        segmento: '',
        mensagem: '',
      });
    }, 3500);
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setIsSubmitted(false);
      setFormData({
        nome: '',
        empresa: '',
        cargo: '',
        telefone: '',
        email: '',
        cidade: '',
        estado: '',
        segmento: '',
        mensagem: '',
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop premium */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            {/* Glow effects */}
            <div className="absolute -inset-4 bg-gradient-to-br from-[#D4AF37]/30 to-[#2E5266]/30 blur-3xl opacity-50" />

            <div className="relative bg-[#1A1A1A]/95 backdrop-blur-2xl border border-[#D4AF37]/40 rounded-3xl shadow-2xl overflow-hidden">
              {/* Header decorativo */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              
              <div className="p-8 md:p-12">
                {/* Close button */}
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="absolute top-6 right-6 p-2 rounded-xl hover:bg-[#D4AF37]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Close"
                >
                  <X className="w-6 h-6 text-gray-400 hover:text-[#D4AF37]" />
                </button>

                {!isSubmitted ? (
                  <>
                    {/* Header */}
                    <div className="text-center mb-10">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.6 }}
                        className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#D4AF37]/20 to-[#FFD700]/10 rounded-2xl mb-6 relative"
                      >
                        <Sparkles className="w-10 h-10 text-[#D4AF37]" />
                        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-2xl blur-xl" />
                      </motion.div>
                      
                      <h2 className="text-4xl font-bold text-white mb-3">
                        Lista de Espera VIP
                      </h2>
                      <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Seja um dos <span className="text-[#D4AF37] font-semibold">primeiros pioneiros</span> a revolucionar seu negócio com o SysConecta 2026
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Grid 2 colunas */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Nome */}
                        <div>
                          <label htmlFor="nome" className="block text-sm font-medium text-gray-300 mb-2">
                            Nome completo *
                          </label>
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" />
                            <input
                              id="nome"
                              type="text"
                              value={formData.nome}
                              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                              placeholder="Seu nome completo"
                              className="w-full pl-12 pr-4 py-3.5 bg-[#0A0A0A]/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 transition-all duration-200 outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
                              required
                            />
                          </div>
                        </div>

                        {/* Empresa */}
                        <div>
                          <label htmlFor="empresa" className="block text-sm font-medium text-gray-300 mb-2">
                            Empresa *
                          </label>
                          <div className="relative group">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" />
                            <input
                              id="empresa"
                              type="text"
                              value={formData.empresa}
                              onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                              placeholder="Nome da sua empresa"
                              className="w-full pl-12 pr-4 py-3.5 bg-[#0A0A0A]/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 transition-all duration-200 outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
                              required
                            />
                          </div>
                        </div>

                        {/* Cargo */}
                        <div>
                          <label htmlFor="cargo" className="block text-sm font-medium text-gray-300 mb-2">
                            Cargo *
                          </label>
                          <div className="relative group">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" />
                            <input
                              id="cargo"
                              type="text"
                              value={formData.cargo}
                              onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                              placeholder="Seu cargo/função"
                              className="w-full pl-12 pr-4 py-3.5 bg-[#0A0A0A]/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 transition-all duration-200 outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
                              required
                            />
                          </div>
                        </div>

                        {/* Telefone */}
                        <div>
                          <label htmlFor="telefone" className="block text-sm font-medium text-gray-300 mb-2">
                            Telefone/WhatsApp *
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

                        {/* Email */}
                        <div>
                          <label htmlFor="email-waitlist" className="block text-sm font-medium text-gray-300 mb-2">
                            E-mail corporativo *
                          </label>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" />
                            <input
                              id="email-waitlist"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="seu@email.com.br"
                              className="w-full pl-12 pr-4 py-3.5 bg-[#0A0A0A]/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 transition-all duration-200 outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
                              required
                            />
                          </div>
                        </div>

                        {/* Cidade */}
                        <div>
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
                      </div>

                      {/* Estado e Segmento - mesma linha */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Estado */}
                        <div>
                          <label htmlFor="estado" className="block text-sm font-medium text-gray-300 mb-2">
                            Estado (UF) *
                          </label>
                          <select
                            id="estado"
                            value={formData.estado}
                            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                            className="w-full px-4 py-3.5 bg-[#0A0A0A]/50 border border-gray-700 rounded-xl text-white transition-all duration-200 outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
                            required
                          >
                            <option value="">Selecione...</option>
                            <option value="AC">Acre</option>
                            <option value="AL">Alagoas</option>
                            <option value="AP">Amapá</option>
                            <option value="AM">Amazonas</option>
                            <option value="BA">Bahia</option>
                            <option value="CE">Ceará</option>
                            <option value="DF">Distrito Federal</option>
                            <option value="ES">Espírito Santo</option>
                            <option value="GO">Goiás</option>
                            <option value="MA">Maranhão</option>
                            <option value="MT">Mato Grosso</option>
                            <option value="MS">Mato Grosso do Sul</option>
                            <option value="MG">Minas Gerais</option>
                            <option value="PA">Pará</option>
                            <option value="PB">Paraíba</option>
                            <option value="PR">Paraná</option>
                            <option value="PE">Pernambuco</option>
                            <option value="PI">Piauí</option>
                            <option value="RJ">Rio de Janeiro</option>
                            <option value="RN">Rio Grande do Norte</option>
                            <option value="RS">Rio Grande do Sul</option>
                            <option value="RO">Rondônia</option>
                            <option value="RR">Roraima</option>
                            <option value="SC">Santa Catarina</option>
                            <option value="SP">São Paulo</option>
                            <option value="SE">Sergipe</option>
                            <option value="TO">Tocantins</option>
                          </select>
                        </div>

                        {/* Segmento */}
                        <div>
                          <label htmlFor="segmento" className="block text-sm font-medium text-gray-300 mb-2">
                            Segmento *
                          </label>
                          <select
                            id="segmento"
                            value={formData.segmento}
                            onChange={(e) => setFormData({ ...formData, segmento: e.target.value })}
                            className="w-full px-4 py-3.5 bg-[#0A0A0A]/50 border border-gray-700 rounded-xl text-white transition-all duration-200 outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10"
                            required
                          >
                            <option value="">Selecione...</option>
                            <option value="vidracaria">Vidraçaria</option>
                            <option value="serralheria">Serralheria</option>
                            <option value="construcao">Construção Civil</option>
                            <option value="arquitetura">Arquitetura/Design</option>
                            <option value="fornecedor">Fornecedor de Materiais</option>
                            <option value="industria">Indústria</option>
                            <option value="outro">Outro</option>
                          </select>
                        </div>
                      </div>

                      {/* Mensagem */}
                      <div>
                        <label htmlFor="mensagem" className="block text-sm font-medium text-gray-300 mb-2">
                          Conte-nos sobre suas necessidades (opcional)
                        </label>
                        <textarea
                          id="mensagem"
                          value={formData.mensagem}
                          onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                          placeholder="Descreva seus principais desafios e o que espera do SysConecta..."
                          rows={4}
                          className="w-full px-4 py-3.5 bg-[#0A0A0A]/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 transition-all duration-200 outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 resize-none"
                        />
                      </div>

                      {/* Botões */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 py-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold rounded-xl hover:shadow-2xl hover:shadow-[#D4AF37]/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                              Enviando...
                            </span>
                          ) : (
                            'Garantir Minha Vaga VIP'
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleClose}
                          disabled={isLoading}
                          className="sm:w-auto px-8 py-4 bg-[#0A0A0A]/50 border border-gray-700 text-gray-300 font-medium rounded-xl hover:border-gray-600 hover:bg-[#1A1A1A] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <>
                    {/* Success state */}
                    <div className="text-center py-12">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.7, bounce: 0.5 }}
                        className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#D4AF37]/20 to-[#FFD700]/10 rounded-full mb-8 relative"
                      >
                        <CheckCircle2 className="w-12 h-12 text-[#D4AF37]" />
                        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/30 to-transparent rounded-full blur-2xl animate-pulse" />
                      </motion.div>
                      
                      <h3 className="text-3xl font-bold text-white mb-4">
                        🎉 Parabéns, você está dentro!
                      </h3>
                      <p className="text-lg text-gray-300 mb-2 max-w-md mx-auto">
                        Você agora faz parte do grupo seleto de <span className="text-[#D4AF37] font-semibold">pioneiros VIP</span> do SysConecta 2026
                      </p>
                      <p className="text-sm text-gray-500">
                        Em breve nossa equipe entrará em contato com benefícios exclusivos.
                      </p>

                      {/* Badge VIP */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-[#D4AF37]/10 to-[#FFD700]/10 border border-[#D4AF37]/30 rounded-full"
                      >
                        <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                        <span className="text-sm font-semibold text-[#D4AF37]">MEMBRO VIP</span>
                        <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      </motion.div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}