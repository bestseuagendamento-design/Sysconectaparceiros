import { useState } from 'react';
import { X, Mail, CheckCircle, Lock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { resetPassword } from '../../utils/supabase/client';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface RecuperarSenhaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RecuperarSenhaModal({ isOpen, onClose }: RecuperarSenhaModalProps) {
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'codigo' | 'sucesso'>('email');
  const [codigoGerado, setCodigoGerado] = useState('');

  const handleEnviarEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Digite seu e-mail');
      return;
    }

    setIsLoading(true);

    try {
      // Gerar código de 6 dígitos
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      setCodigoGerado(resetCode);

      // Enviar email com código
      const emailResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/auth/password-reset`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            nome: email.split('@')[0],
            email: email,
            resetCode: resetCode,
          }),
        }
      );

      if (emailResponse.ok) {
        toast.success('Código enviado para seu email!');
        setStep('codigo');
        
        // Também usar função Supabase nativa como backup
        try {
          await resetPassword(email);
        } catch (supabaseError) {
          console.warn('Backup Supabase reset:', supabaseError);
        }
      } else {
        toast.error('Erro ao enviar email. Tente novamente.');
      }
    } catch (error: any) {
      console.error('Erro ao enviar email:', error);
      toast.error('Erro ao enviar email. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificarCodigo = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!codigo) {
      toast.error('Digite o código recebido');
      return;
    }

    // Simular validação do código
    if (codigo === codigoGerado) {
      toast.success('Código verificado! Redirecionando...');
      setStep('sucesso');
      
      setTimeout(() => {
        // Aqui você pode redirecionar para a página de redefinir senha
        // ou abrir um modal de nova senha
        setStep('email');
        setCodigo('');
        setEmail('');
        onClose();
      }, 3000);
    } else {
      toast.error('Código inválido. Tente novamente.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {step === 'email' ? (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#2C5F6F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-[#2C5F6F]" />
                </div>
                <h2 className="text-gray-900 mb-2" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  Recuperar Senha
                </h2>
                <p className="text-gray-600 text-sm">
                  Digite seu e-mail para receber um link de recuperação
                </p>
              </div>

              <form onSubmit={handleEnviarEmail} className="space-y-5">
                <div>
                  <label className="block text-gray-700 text-xs font-medium uppercase tracking-wider mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2C5F6F]/20 focus:border-[#2C5F6F] transition-all"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#2C5F6F] to-[#1A3D4A] hover:from-[#1A3D4A] hover:to-[#2C5F6F] text-white rounded-lg px-6 py-3 transition-all uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-medium shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Enviando...
                    </>
                  ) : (
                    'Enviar Link'
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  Voltar ao login
                </button>
              </form>
            </>
          ) : step === 'codigo' ? (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#2C5F6F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-[#2C5F6F]" />
                </div>
                <h2 className="text-gray-900 mb-2" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  Verificar Código
                </h2>
                <p className="text-gray-600 text-sm">
                  Digite o código recebido em seu e-mail
                </p>
              </div>

              <form onSubmit={handleVerificarCodigo} className="space-y-5">
                <div>
                  <label className="block text-gray-700 text-xs font-medium uppercase tracking-wider mb-2">
                    Código
                  </label>
                  <input
                    type="text"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2C5F6F]/20 focus:border-[#2C5F6F] transition-all"
                    placeholder="123456"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#2C5F6F] to-[#1A3D4A] hover:from-[#1A3D4A] hover:to-[#2C5F6F] text-white rounded-lg px-6 py-3 transition-all uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-medium shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Verificando...
                    </>
                  ) : (
                    'Verificar Código'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="w-full text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  Reenviar Código
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-gray-900 mb-2" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                Email Enviado!
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Enviamos um link de recuperação para <strong>{email}</strong>. 
                Verifique sua caixa de entrada e spam.
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}