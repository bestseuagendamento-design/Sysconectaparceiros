import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, KeyRound, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, ChevronLeft } from 'lucide-react';

interface VerificacaoCodigoPremiumProps {
  onSuccess: () => void;
  onBack: () => void;
  codigoCorreto: string;
  email?: string;
  perfilSelecionado?: string;
}

export function VerificacaoCodigoPremium({ 
  onSuccess, 
  onBack, 
  codigoCorreto,
  email,
  perfilSelecionado 
}: VerificacaoCodigoPremiumProps) {
  const [codigo, setCodigo] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [tentativas, setTentativas] = useState(0);

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

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newCodigo = [...codigo];
    newCodigo[index] = value;
    setCodigo(newCodigo);

    // Auto-focus próximo campo
    if (value && index < 5) {
      const nextInput = document.getElementById(`codigo-${index + 1}`);
      nextInput?.focus();
    }

    // Verificar automaticamente quando completar
    if (newCodigo.every(d => d !== '') && newCodigo.join('') === codigoCorreto) {
      handleVerificar(newCodigo.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !codigo[index] && index > 0) {
      const prevInput = document.getElementById(`codigo-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerificar = (codigoParaVerificar?: string) => {
    const codigoCompleto = codigoParaVerificar || codigo.join('');
    
    if (codigoCompleto.length !== 6) {
      setErro('Digite o código completo de 6 dígitos');
      return;
    }

    setIsLoading(true);
    setErro('');

    setTimeout(() => {
      if (codigoCompleto === codigoCorreto) {
        // Sucesso!
        setIsLoading(false);
        onSuccess();
      } else {
        // Erro
        setIsLoading(false);
        setTentativas(tentativas + 1);
        setErro('Código incorreto. Tente novamente.');
        setCodigo(['', '', '', '', '', '']);
        document.getElementById('codigo-0')?.focus();
      }
    }, 1500);
  };

  const handleReenviar = () => {
    console.log('📧 Reenviando código para:', email);
    alert('Código reenviado para seu e-mail!');
  };

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

        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[200px] opacity-10 animate-pulse" 
             style={{ backgroundColor: perfilColor }} />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#2E5266] rounded-full blur-[200px] opacity-10 animate-pulse" 
             style={{ animationDelay: '1s' }} />
        
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
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          
          {/* ========================================
              HEADER - LOGO
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
              
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              </div>

              <div className="text-sm tracking-[0.3em] text-gray-400 font-light uppercase mb-8">
                SYSVIDRO | SYSCONSTRUÇÃO
              </div>
            </div>

            {/* Título */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="w-8 h-8" style={{ color: perfilColor }} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Verificação de Segurança
              </h2>
              <p className="text-lg text-gray-400">
                Digite o código de 6 dígitos enviado para
              </p>
              <p className="text-lg font-semibold mt-2" style={{ color: perfilColor }}>
                {email || 'seu e-mail'}
              </p>
            </motion.div>
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
            <div className="relative bg-[#1A1A1A]/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 md:p-12 shadow-2xl">
              
              {/* Inputs de código */}
              <div className="flex justify-center gap-3 md:gap-4 mb-8">
                {codigo.map((digit, index) => (
                  <motion.input
                    key={index}
                    id={`codigo-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-16 md:w-16 md:h-20 text-center text-2xl md:text-3xl font-bold bg-[#0A0A0A]/50 border-2 border-gray-700 rounded-xl text-white transition-all duration-200 outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/20 focus:scale-105"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  />
                ))}
              </div>

              {/* Mensagem de erro */}
              {erro && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 mb-6 text-red-400"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{erro}</span>
                </motion.div>
              )}

              {/* Tentativas */}
              {tentativas > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center mb-6"
                >
                  <p className="text-sm text-gray-500">
                    Tentativas: {tentativas}
                  </p>
                </motion.div>
              )}

              {/* Botão Verificar */}
              <button
                onClick={() => handleVerificar()}
                disabled={isLoading || codigo.some(d => d === '')}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold rounded-xl hover:shadow-2xl hover:shadow-[#D4AF37]/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mb-6"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Verificar Código
                  </>
                )}
              </button>

              {/* Linha divisória */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700/50"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-[#1A1A1A] text-gray-500">Opções</span>
                </div>
              </div>

              {/* Ações secundárias */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onBack}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#0A0A0A]/50 border border-gray-700 text-gray-300 font-medium rounded-xl hover:border-gray-600 hover:bg-[#1A1A1A] transition-all duration-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Voltar
                </button>
                
                <button
                  onClick={handleReenviar}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#0A0A0A]/50 border border-gray-700 text-gray-300 font-medium rounded-xl hover:border-gray-600 hover:bg-[#1A1A1A] transition-all duration-200"
                >
                  <RefreshCw className="w-5 h-5" />
                  Reenviar Código
                </button>
              </div>

              {/* Security badge */}
              <div className="mt-8 pt-6 border-t border-gray-700/50">
                <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-[#D4AF37]" />
                    <span>Código temporário</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#D4AF37]" />
                    <span>Verificação segura</span>
                  </div>
                </div>
              </div>

              {/* Código de teste (apenas dev) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-6 text-center"
              >
                <p className="text-xs text-gray-600">
                  Código de teste: <span className="font-mono font-bold text-[#D4AF37]">{codigoCorreto}</span>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
