import { useState, FormEvent } from 'react';
import { CheckCircle, Users, Shield, Lock, Mail, Phone, Building2, MessageSquare, Eye, EyeOff, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginComListaEsperaProps {
  onLogin: (email: string, senha: string) => void;
  onSocialLogin: (provider: string) => void;
  isLoading: boolean;
  loginEmail: string;
  setLoginEmail: (value: string) => void;
  loginSenha: string;
  setLoginSenha: (value: string) => void;
  chkSalvarSenha: boolean;
  setChkSalvarSenha: (value: boolean) => void;
  chkManterConectado: boolean;
  setChkManterConectado: (value: boolean) => void;
  setShowRecuperarSenha: (value: boolean) => void;
  setShowNovaSenha: (value: boolean) => void;
  setShowSuporte: (value: boolean) => void;
}

export function LoginComListaEspera({
  onLogin,
  onSocialLogin,
  isLoading,
  loginEmail,
  setLoginEmail,
  loginSenha,
  setLoginSenha,
  chkSalvarSenha,
  setChkSalvarSenha,
  chkManterConectado,
  setChkManterConectado,
  setShowRecuperarSenha,
  setShowNovaSenha,
  setShowSuporte,
}: LoginComListaEsperaProps) {
  // Estados da Lista de Espera
  const [waitlistNome, setWaitlistNome] = useState('');
  const [waitlistEmpresa, setWaitlistEmpresa] = useState('');
  const [waitlistTelefone, setWaitlistTelefone] = useState('');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSegmento, setWaitlistSegmento] = useState('');
  const [waitlistMensagem, setWaitlistMensagem] = useState('');
  const [waitlistEnviado, setWaitlistEnviado] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);

  // Novos estados para features 2026
  const [showPassword, setShowPassword] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Validação de email em tempo real
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = regex.test(email);
    setEmailValid(email.length > 0 ? isValid : null);
    return isValid;
  };

  // Cálculo de força da senha
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    setPasswordStrength(strength);
    return strength;
  };

  const handleEmailChange = (value: string) => {
    setLoginEmail(value);
    validateEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    setLoginSenha(value);
    calculatePasswordStrength(value);
  };

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    onLogin(loginEmail, loginSenha);
  };

  const handleWaitlistSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (waitlistNome && waitlistTelefone && waitlistEmail) {
      console.log('Lista de Espera:', {
        nome: waitlistNome,
        empresa: waitlistEmpresa,
        telefone: waitlistTelefone,
        email: waitlistEmail,
        segmento: waitlistSegmento,
        mensagem: waitlistMensagem
      });
      setWaitlistEnviado(true);
      setTimeout(() => {
        setWaitlistEnviado(false);
        setWaitlistNome('');
        setWaitlistEmpresa('');
        setWaitlistTelefone('');
        setWaitlistEmail('');
        setWaitlistSegmento('');
        setWaitlistMensagem('');
      }, 4000);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Fraca';
    if (passwordStrength <= 3) return 'Média';
    return 'Forte';
  };

  // Partículas flutuantes
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
  }));

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex relative overflow-hidden">
      {/* LADO ESQUERDO - LOGIN */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-1/2 flex items-center justify-center p-12 relative z-10"
      >
        <div className="w-full max-w-md">
          {/* Card de Login com Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl p-12 shadow-[0_8px_32px_0_rgba(31,38,135,0.15),0_2px_8px_0_rgba(0,0,0,0.05)] relative"
          >
            {/* Glow effect sutil */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#C4A96A]/5 to-transparent rounded-2xl pointer-events-none"></div>

            {/* Cabeçalho */}
            <div className="text-center mb-10 relative">
              <motion.h1 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-gray-900 tracking-tight mb-2 relative"
                style={{ fontSize: '3.5rem', fontWeight: 600, letterSpacing: '-0.02em' }}
              >
                SYSCONECTA
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles className="w-6 h-6 text-[#C4A96A]" />
                </motion.div>
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-[#C4A96A] text-sm tracking-[0.15em] uppercase font-semibold mb-2"
              >
                PARCEIRA OFICIAL - GUARDIAN GLASS BR
              </motion.div>
              <div className="text-gray-600 text-xs tracking-[0.2em] uppercase">
                SYSVIDRO | SYSCONSTRUÇÃO
              </div>

              {/* Badge de Segurança */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-full px-4 py-2"
              >
                <Shield className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-700 font-medium">Conexão Segura SSL</span>
              </motion.div>
            </div>

            {/* Formulário de Login */}
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="space-y-5">
                {/* Campo Email com Validação */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-gray-700 text-xs font-medium uppercase tracking-wider mb-2">
                    E-mail ou WhatsApp
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedInput === 'email' ? 'text-[#2C5F6F]' : 'text-gray-400'}`} />
                    <input
                      id="input-login"
                      type="text"
                      value={loginEmail}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      onFocus={() => setFocusedInput('email')}
                      onBlur={() => setFocusedInput(null)}
                      className={`w-full bg-white/60 backdrop-blur-sm border pl-10 pr-10 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all ${
                        emailValid === false 
                          ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                          : emailValid === true
                          ? 'border-green-300 focus:ring-green-500/20 focus:border-green-500'
                          : 'border-gray-300 focus:ring-[#2C5F6F]/20 focus:border-[#2C5F6F]'
                      }`}
                      placeholder="Digite seu e-mail ou WhatsApp"
                    />
                    <AnimatePresence>
                      {emailValid !== null && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {emailValid ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-red-500 flex items-center justify-center">
                              <span className="text-red-500 text-xs">!</span>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <AnimatePresence>
                    {emailValid === false && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-red-500 mt-1 ml-1"
                      >
                        Digite um e-mail válido
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Campo Senha com Indicador de Força */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-gray-700 text-xs font-medium uppercase tracking-wider mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedInput === 'password' ? 'text-[#2C5F6F]' : 'text-gray-400'}`} />
                    <input
                      id="input-senha"
                      type={showPassword ? 'text' : 'password'}
                      value={loginSenha}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      onFocus={() => setFocusedInput('password')}
                      onBlur={() => setFocusedInput(null)}
                      className="w-full bg-white/60 backdrop-blur-sm border border-gray-300 pl-10 pr-10 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2C5F6F]/20 focus:border-[#2C5F6F] transition-all"
                      placeholder="Digite sua senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  
                  {/* Indicador de Força da Senha */}
                  <AnimatePresence>
                    {loginSenha.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2"
                      >
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <motion.div
                              key={level}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: passwordStrength >= level ? 1 : 0.3 }}
                              transition={{ duration: 0.3, delay: level * 0.05 }}
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                passwordStrength >= level ? getPasswordStrengthColor() : 'bg-gray-200'
                              }`}
                              style={{ transformOrigin: 'left' }}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600">
                          Segurança: <span className={`font-medium ${
                            passwordStrength <= 1 ? 'text-red-500' :
                            passwordStrength <= 3 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {getPasswordStrengthText()}
                          </span>
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Checkboxes com animação */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <label className="flex items-center gap-3 text-gray-700 cursor-pointer group">
                  <input
                    id="chk-salvar-senha"
                    type="checkbox"
                    checked={chkSalvarSenha}
                    onChange={(e) => setChkSalvarSenha(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 bg-white text-[#2C5F6F] focus:ring-[#2C5F6F] focus:ring-2 cursor-pointer transition-all"
                  />
                  <span className="text-sm group-hover:text-gray-900 transition-colors">
                    Salvar senha
                  </span>
                </label>

                <label className="flex items-center gap-3 text-gray-700 cursor-pointer group">
                  <input
                    id="chk-manter-conectado"
                    type="checkbox"
                    checked={chkManterConectado}
                    onChange={(e) => setChkManterConectado(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 bg-white text-[#2C5F6F] focus:ring-[#2C5F6F] focus:ring-2 cursor-pointer transition-all"
                  />
                  <span className="text-sm group-hover:text-gray-900 transition-colors">
                    Manter conectado
                  </span>
                </label>
              </motion.div>

              {/* Botão Login Premium */}
              <motion.button
                id="btn-login"
                type="submit"
                disabled={!loginEmail || !loginSenha || isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-black to-neutral-800 hover:from-neutral-800 hover:to-black text-white rounded-lg px-6 py-3 transition-all uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-medium shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </motion.button>

              {/* Links de apoio */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center justify-center gap-6 text-xs text-gray-600 pt-2"
              >
                <button
                  id="lnk-esqueci-senha"
                  type="button"
                  onClick={() => setShowRecuperarSenha(true)}
                  className="hover:text-gray-900 transition-colors hover:underline"
                >
                  Esqueci minha senha
                </button>
                <span className="text-gray-400">•</span>
                <button
                  id="lnk-criar-nova-senha"
                  type="button"
                  onClick={() => setShowNovaSenha(true)}
                  className="hover:text-gray-900 transition-colors hover:underline"
                >
                  Criar nova senha
                </button>
                <span className="text-gray-400">•</span>
                <button
                  id="lnk-suporte"
                  type="button"
                  onClick={() => setShowSuporte(true)}
                  className="hover:text-gray-900 transition-colors hover:underline"
                >
                  Suporte
                </button>
              </motion.div>

              {/* Autenticação Externa */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="pt-6 border-t border-gray-200"
              >
                <div className="text-center mb-5">
                  <span className="text-xs text-gray-700 uppercase tracking-wider font-medium">
                    Autenticação externa
                  </span>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <motion.button
                    id="btn-login-google"
                    type="button"
                    onClick={() => onSocialLogin('Google')}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-white hover:shadow-md transition-all"
                    aria-label="Login with Google"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </motion.button>

                  <motion.button
                    id="btn-login-apple"
                    type="button"
                    onClick={() => onSocialLogin('Apple')}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-white hover:shadow-md transition-all"
                    aria-label="Login with Apple"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#000000">
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                  </motion.button>

                  <motion.button
                    id="btn-login-instagram"
                    type="button"
                    onClick={() => onSocialLogin('Instagram')}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-white hover:shadow-md transition-all"
                    aria-label="Login with Instagram"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="url(#instagram-gradient)">
                      <defs>
                        <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" style={{ stopColor: '#FED373', stopOpacity: 1 }} />
                          <stop offset="25%" style={{ stopColor: '#F15245', stopOpacity: 1 }} />
                          <stop offset="50%" style={{ stopColor: '#D92E7F', stopOpacity: 1 }} />
                          <stop offset="75%" style={{ stopColor: '#9B36B7', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#515ECF', stopOpacity: 1 }} />
                        </linearGradient>
                      </defs>
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <circle cx="12" cy="12" r="4" fill="white" />
                      <circle cx="17.5" cy="6.5" r="1" fill="white" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>

              {/* BOTÃO LISTA DE ESPERA */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="pt-6 border-t border-gray-200"
              >
                <motion.button
                  type="button"
                  onClick={() => setShowWaitlist(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-[#C4A96A] to-[#B39858] hover:from-[#B39858] hover:to-[#A28747] text-white rounded-lg px-6 py-3 transition-all uppercase text-sm font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Users className="w-4 h-4" />
                  Lista de Espera
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </motion.div>

      {/* LADO DIREITO - CTA ou LISTA DE ESPERA */}
      <div className="w-1/2 bg-gradient-to-br from-[#2C5F6F] to-[#1A3D4A] flex items-center justify-center p-12 relative overflow-hidden">
        {/* Partículas Flutuantes */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Grid Pattern Sutil */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />

        <AnimatePresence mode="wait">
          {!showWaitlist ? (
            /* CTA Inicial */
            <motion.div
              key="cta"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="text-center relative z-10"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white/40 text-xs tracking-[0.3em] uppercase mb-8 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3 h-3" />
                2026
                <Sparkles className="w-3 h-3" />
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white mb-6 font-bold" 
                style={{ fontSize: '3rem', lineHeight: '1.1' }}
              >
                Conectando o<br />Setor de Vidros
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/80 text-lg mb-8 max-w-md mx-auto"
              >
                A plataforma B2B enterprise que revoluciona a forma como vidraceiros, fornecedores e profissionais do setor se conectam.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col gap-4 text-white/70 text-sm max-w-md mx-auto"
              >
                {[
                  'Orçamentos completos com desenho técnico CAD',
                  'Gestão inteligente de estoque e produção',
                  'Sistema de aproveitamento otimizado de chapas'
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-[#C4A96A] flex-shrink-0 mt-0.5" />
                    <span className="text-left">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Contador de Usuários */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mt-12 inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3"
              >
                <Users className="w-5 h-5 text-[#C4A96A]" />
                <div className="text-left">
                  <div className="text-white font-semibold text-lg">1.247+</div>
                  <div className="text-white/60 text-xs">na lista de espera</div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            /* Formulário Lista de Espera */
            <motion.div
              key="waitlist"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md relative z-10"
            >
              {!waitlistEnviado ? (
                <>
                  {/* Cabeçalho Lista de Espera */}
                  <div className="text-center mb-8">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.6 }}
                      className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20"
                    >
                      <Users className="w-8 h-8 text-white" />
                    </motion.div>
                    <motion.h2 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-white mb-3 font-semibold" 
                      style={{ fontSize: '1.75rem' }}
                    >
                      Lista de Espera
                    </motion.h2>
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-white/80 text-sm"
                    >
                      Seja um dos primeiros a ter acesso ao SysConecta e revolucione seu negócio
                    </motion.p>
                  </div>

                  {/* Formulário Lista de Espera */}
                  <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-white/90 text-xs font-medium uppercase tracking-wider mb-2">
                        Nome Completo *
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                        <input
                          type="text"
                          value={waitlistNome}
                          onChange={(e) => setWaitlistNome(e.target.value)}
                          required
                          className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg pl-10 px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
                          placeholder="Seu nome completo"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <label className="block text-white/90 text-xs font-medium uppercase tracking-wider mb-2">
                        Empresa
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                        <input
                          type="text"
                          value={waitlistEmpresa}
                          onChange={(e) => setWaitlistEmpresa(e.target.value)}
                          className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg pl-10 px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
                          placeholder="Nome da sua empresa (opcional)"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-white/90 text-xs font-medium uppercase tracking-wider mb-2">
                        WhatsApp/Telefone *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                        <input
                          type="tel"
                          value={waitlistTelefone}
                          onChange={(e) => setWaitlistTelefone(e.target.value)}
                          required
                          className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg pl-10 px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <label className="block text-white/90 text-xs font-medium uppercase tracking-wider mb-2">
                        E-mail *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                        <input
                          type="email"
                          value={waitlistEmail}
                          onChange={(e) => setWaitlistEmail(e.target.value)}
                          required
                          className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg pl-10 px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
                          placeholder="seu@email.com"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-white/90 text-xs font-medium uppercase tracking-wider mb-2">
                        Segmento
                      </label>
                      <select
                        value={waitlistSegmento}
                        onChange={(e) => setWaitlistSegmento(e.target.value)}
                        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
                      >
                        <option value="" className="text-gray-900">Selecione...</option>
                        <option value="vidraceiro" className="text-gray-900">Vidraçaria</option>
                        <option value="serralheiro" className="text-gray-900">Serralheria</option>
                        <option value="arquiteto" className="text-gray-900">Arquiteto/Engenheiro</option>
                        <option value="construtora" className="text-gray-900">Construtora/Incorporadora</option>
                        <option value="fornecedor" className="text-gray-900">Fornecedor</option>
                        <option value="industria" className="text-gray-900">Indústria</option>
                        <option value="outro" className="text-gray-900">Outro</option>
                      </select>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <label className="block text-white/90 text-xs font-medium uppercase tracking-wider mb-2">
                        Mensagem (opcional)
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-white/50" />
                        <textarea
                          value={waitlistMensagem}
                          onChange={(e) => setWaitlistMensagem(e.target.value)}
                          rows={3}
                          className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg pl-10 px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all resize-none"
                          placeholder="Conte-nos um pouco sobre seu interesse..."
                        />
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex gap-3 pt-2"
                    >
                      <motion.button
                        type="button"
                        onClick={() => setShowWaitlist(false)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-lg px-6 py-3 transition-all uppercase text-sm font-semibold border border-white/20"
                      >
                        Voltar
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={!waitlistNome || !waitlistTelefone || !waitlistEmail}
                        whileHover={{ scale: !waitlistNome || !waitlistTelefone || !waitlistEmail ? 1 : 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-white hover:bg-gray-100 text-[#2C5F6F] rounded-lg px-6 py-3 transition-all uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg"
                      >
                        Enviar
                      </motion.button>
                    </motion.div>

                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-white/60 text-xs text-center mt-4"
                    >
                      * Campos obrigatórios
                    </motion.p>
                  </form>
                </>
              ) : (
                /* Mensagem de Sucesso */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20"
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-white mb-3 font-semibold" 
                    style={{ fontSize: '1.75rem' }}
                  >
                    Cadastro Realizado!
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/80 text-sm mb-6"
                  >
                    Obrigado por se inscrever! Entraremos em contato em breve com mais informações sobre o acesso ao SysConecta.
                  </motion.p>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 mb-6"
                  >
                    <p className="text-white/70 text-xs">
                      Fique atento ao seu e-mail e WhatsApp para novidades exclusivas!
                    </p>
                  </motion.div>
                  <motion.button
                    type="button"
                    onClick={() => {
                      setShowWaitlist(false);
                      setWaitlistEnviado(false);
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white hover:bg-gray-100 text-[#2C5F6F] rounded-lg px-6 py-3 transition-all uppercase text-sm font-semibold shadow-lg"
                  >
                    Voltar ao Login
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
