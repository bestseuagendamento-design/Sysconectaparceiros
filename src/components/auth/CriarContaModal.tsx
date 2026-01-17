import { useState } from 'react';
import { X, Mail, Lock, User, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { signUpWithEmail } from '../../utils/supabase/client';
import { toast } from 'sonner@2.0.3';

interface CriarContaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CriarContaModal({ isOpen, onClose }: CriarContaModalProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cadastroRealizado, setCadastroRealizado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !email || !senha) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (senha !== confirmaSenha) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (senha.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const { user } = await signUpWithEmail(email, senha);
      
      if (user) {
        setCadastroRealizado(true);
        toast.success('Conta criada! Verifique seu email.');
        
        setTimeout(() => {
          setCadastroRealizado(false);
          setNome('');
          setEmail('');
          setSenha('');
          setConfirmaSenha('');
          onClose();
        }, 5000);
      }
    } catch (error: any) {
      if (error.message.includes('already registered')) {
        toast.error('Este email já está cadastrado');
      } else {
        toast.error(error.message || 'Erro ao criar conta');
      }
    } finally {
      setIsLoading(false);
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
          className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {!cadastroRealizado ? (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#2C5F6F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-[#2C5F6F]" />
                </div>
                <h2 className="text-gray-900 mb-2" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  Criar Conta
                </h2>
                <p className="text-gray-600 text-sm">
                  Cadastre-se no SysConecta
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-xs font-medium uppercase tracking-wider mb-2">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2C5F6F]/20 focus:border-[#2C5F6F] transition-all"
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-xs font-medium uppercase tracking-wider mb-2">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2C5F6F]/20 focus:border-[#2C5F6F] transition-all"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-xs font-medium uppercase tracking-wider mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-10 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2C5F6F]/20 focus:border-[#2C5F6F] transition-all"
                      placeholder="Mínimo 6 caracteres"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-xs font-medium uppercase tracking-wider mb-2">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmaSenha}
                      onChange={(e) => setConfirmaSenha(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-10 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2C5F6F]/20 focus:border-[#2C5F6F] transition-all"
                      placeholder="Digite a senha novamente"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#2C5F6F] to-[#1A3D4A] hover:from-[#1A3D4A] hover:to-[#2C5F6F] text-white rounded-lg px-6 py-3 transition-all uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-medium shadow-lg mt-6"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Criando conta...
                    </>
                  ) : (
                    'Criar Conta'
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  Já tenho conta
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-gray-900 mb-2" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                Conta Criada!
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Enviamos um email de verificação para <strong>{email}</strong>
              </p>
              <div className="bg-[#2C5F6F]/10 border border-[#2C5F6F]/20 rounded-lg p-4">
                <p className="text-[#2C5F6F] text-xs">
                  ✉️ Verifique sua caixa de entrada e spam para confirmar seu email antes de fazer login.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
