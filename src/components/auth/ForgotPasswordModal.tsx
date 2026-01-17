import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '../ui/glass-card';
import { useI18n } from '../../i18n/i18nContext';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular envio de e-mail
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      
      // Auto-fechar após 3 segundos
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setEmail('');
      }, 3000);
    }, 1500);
  };

  const handleClose = () => {
    onClose();
    setIsSubmitted(false);
    setEmail('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative z-10 w-full max-w-md"
          >
            <GlassCard className="p-8">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              {!isSubmitted ? (
                <>
                  {/* Header */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Recuperar senha
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Digite seu e-mail e enviaremos instruções para redefinir sua senha
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-2">
                        E-mail
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          id="reset-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="seu@email.com"
                          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-[#2C5F6F] focus:ring-4 focus:ring-[#2C5F6F]/10"
                          required
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-3 bg-gradient-to-r from-[#2C5F6F] to-[#4A90A4] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#2C5F6F]/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Enviando...
                          </span>
                        ) : (
                          'Enviar instruções'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleClose}
                        className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  {/* Success state */}
                  <div className="text-center py-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', duration: 0.5 }}
                      className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
                    >
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      E-mail enviado!
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Verifique sua caixa de entrada em <span className="font-semibold">{email}</span>
                    </p>
                  </div>
                </>
              )}
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
