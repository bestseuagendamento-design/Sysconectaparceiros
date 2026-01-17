import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Factory, Store, Building2, Truck, Zap, Network,
  ArrowRight, CheckCircle2, Sparkles, Hexagon
} from 'lucide-react';

interface BoasVindasCinematicaProps {
  nomeUsuario: string;
  perfilUsuario: string;
  onComplete: () => void;
}

export function BoasVindasCinematica({ nomeUsuario, perfilUsuario, onComplete }: BoasVindasCinematicaProps) {
  const [fase, setFase] = useState(1);

  useEffect(() => {
    // Fase 1: Boas-vindas (3s)
    const timer1 = setTimeout(() => setFase(2), 3000);
    
    // Fase 2: Conexões (4s)
    const timer2 = setTimeout(() => setFase(3), 7000);
    
    // Fase 3: Explosão SysConecta (3s)
    const timer3 = setTimeout(() => setFase(4), 10000);
    
    // Fase 4: Transição para dashboard (2s)
    const timer4 = setTimeout(() => onComplete(), 12000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  const getPerfilNome = () => {
    const nomes: Record<string, string> = {
      vidraceiro: 'Vidraceiro Premium',
      arquiteto: 'Arquiteto Profissional',
      construtor: 'Construtor Enterprise',
      industria_guardian: 'Indústria Guardian',
      fornecedor_vidro: 'Fornecedor de Vidro',
      fornecedor: 'Fornecedor Premium',
      parceirosys: 'Parceiro SysConecta',
    };
    return nomes[perfilUsuario] || 'Profissional';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#0A0A0A]">
      {/* ========================================
          BACKGROUND CINEMATOGRÁFICO
          ======================================== */}
      <div className="absolute inset-0">
        {/* Gradient animado */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0F0F0F]"
          animate={{
            background: [
              'radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 70%, rgba(46, 82, 102, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.15) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        {/* Partículas douradas */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#D4AF37] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                y: [0, -100],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Grid tech */}
        <motion.div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212, 175, 55, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212, 175, 55, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
          }}
          animate={{
            opacity: [0.03, 0.06, 0.03],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      {/* ========================================
          CONTEÚDO CINEMATOGRÁFICO
          ======================================== */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          
          {/* ========================================
              FASE 1: BOAS-VINDAS
              ======================================== */}
          {fase === 1 && (
            <motion.div
              key="fase1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.8 }}
              className="text-center px-6"
            >
              {/* Hexágono pulsante */}
              <motion.div
                className="mb-12"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Hexagon className="w-32 h-32 mx-auto text-[#D4AF37]" strokeWidth={1.5} />
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <Sparkles className="w-16 h-16 text-[#FFD700]" />
                </motion.div>
              </motion.div>

              {/* Mensagem de boas-vindas */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent">
                  Bem-vindo!
                </h1>
                <p className="text-3xl font-bold text-white mb-3">
                  {nomeUsuario}
                </p>
                <p className="text-xl text-[#D4AF37] mb-8">
                  {getPerfilNome()}
                </p>
                
                <motion.div
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                  className="flex items-center justify-center gap-2 text-gray-400"
                >
                  <Zap className="w-5 h-5" />
                  <span className="text-sm tracking-wider">Inicializando sistema...</span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* ========================================
              FASE 2: CONEXÕES TECNOLÓGICAS
              ======================================== */}
          {fase === 2 && (
            <motion.div
              key="fase2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex items-center justify-center px-6"
            >
              <div className="relative w-full max-w-4xl h-96">
                
                {/* Centro - SysConecta Hub */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="relative">
                    <motion.div
                      className="w-32 h-32 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#FFD700] flex items-center justify-center shadow-2xl"
                      animate={{
                        boxShadow: [
                          '0 0 40px rgba(212, 175, 55, 0.4)',
                          '0 0 80px rgba(212, 175, 55, 0.8)',
                          '0 0 40px rgba(212, 175, 55, 0.4)',
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Network className="w-16 h-16 text-black" />
                    </motion.div>
                    
                    {/* Pulso */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-[#D4AF37]"
                      animate={{
                        scale: [1, 2, 2],
                        opacity: [0.8, 0, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  </div>
                </motion.div>

                {/* Fornecedores - Esquerda */}
                <motion.div
                  className="absolute top-1/2 left-0 -translate-y-1/2"
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <div className="flex flex-col gap-8">
                    <IconNode icon={Store} label="Fornecedores" color="#B87333" />
                    <IconNode icon={Factory} label="Indústrias" color="#6B46C1" />
                  </div>
                </motion.div>

                {/* Clientes - Direita */}
                <motion.div
                  className="absolute top-1/2 right-0 -translate-y-1/2"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <div className="flex flex-col gap-8">
                    <IconNode icon={Building2} label="Construtores" color="#4A7C9B" />
                    <IconNode icon={Truck} label="Logística" color="#2E5266" />
                  </div>
                </motion.div>

                {/* Linhas de conexão animadas */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {/* Linha Fornecedores → Centro */}
                  <motion.line
                    x1="20%"
                    y1="35%"
                    x2="50%"
                    y2="50%"
                    stroke="#D4AF37"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ delay: 0.8, duration: 1 }}
                  />
                  
                  {/* Linha Indústrias → Centro */}
                  <motion.line
                    x1="20%"
                    y1="65%"
                    x2="50%"
                    y2="50%"
                    stroke="#D4AF37"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ delay: 1, duration: 1 }}
                  />
                  
                  {/* Linha Centro → Construtores */}
                  <motion.line
                    x1="50%"
                    y1="50%"
                    x2="80%"
                    y2="35%"
                    stroke="#D4AF37"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ delay: 1.2, duration: 1 }}
                  />
                  
                  {/* Linha Centro → Logística */}
                  <motion.line
                    x1="50%"
                    y1="50%"
                    x2="80%"
                    y2="65%"
                    stroke="#D4AF37"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ delay: 1.4, duration: 1 }}
                  />

                  {/* Partículas viajando pelas linhas */}
                  <motion.circle
                    r="4"
                    fill="#FFD700"
                    animate={{
                      cx: ['20%', '50%'],
                      cy: ['35%', '50%'],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: 2,
                    }}
                  />
                </svg>

                {/* Texto centralizado */}
                <motion.div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2, duration: 0.6 }}
                >
                  <p className="text-xl font-semibold text-white mb-2">
                    Conectando todo ecossistema
                  </p>
                  <p className="text-sm text-gray-400 tracking-wider">
                    TECNOLOGIA SYSCONECTA 2026
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ========================================
              FASE 3: EXPLOSÃO SYSCONECTA 2026
              ======================================== */}
          {fase === 3 && (
            <motion.div
              key="fase3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {/* Explosão de partículas */}
              <div className="absolute inset-0">
                {[...Array(100)].map((_, i) => {
                  const angle = (i / 100) * Math.PI * 2;
                  const distance = 50 + Math.random() * 400;
                  const endX = Math.cos(angle) * distance;
                  const endY = Math.sin(angle) * distance;

                  return (
                    <motion.div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#D4AF37] rounded-full"
                      initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                      animate={{
                        x: endX,
                        y: endY,
                        opacity: [1, 1, 0],
                        scale: [0, 1.5, 0],
                      }}
                      transition={{
                        duration: 2,
                        ease: "easeOut",
                      }}
                    />
                  );
                })}
              </div>

              {/* Logo gigante */}
              <motion.div
                className="text-center z-10"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, type: "spring" }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                >
                  <h1 className="text-8xl md:text-9xl font-black mb-6 bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent drop-shadow-2xl">
                    SysConecta
                  </h1>
                  <motion.p
                    className="text-5xl md:text-6xl font-black text-[#D4AF37]"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    2026
                  </motion.p>
                </motion.div>

                <motion.div
                  className="mt-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <p className="text-2xl text-white font-semibold tracking-[0.3em] mb-3">
                    SYSVIDRO | SYSCONSTRUÇÃO
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
                    <span className="text-lg text-gray-300">Sistema pronto!</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Anel dourado expansivo */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border-4 border-[#D4AF37]"
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: [0, 3, 3],
                  opacity: [1, 0.3, 0],
                }}
                transition={{
                  duration: 2,
                }}
              />
            </motion.div>
          )}

          {/* ========================================
              FASE 4: TRANSIÇÃO PARA DASHBOARD
              ======================================== */}
          {fase === 4 && (
            <motion.div
              key="fase4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
              >
                <Sparkles className="w-24 h-24 mx-auto text-[#D4AF37] mb-6" />
              </motion.div>
              
              <h2 className="text-4xl font-bold text-white mb-4">
                Entrando no sistema...
              </h2>
              <div className="flex items-center justify-center gap-3 text-gray-400">
                <motion.div
                  className="w-3 h-3 bg-[#D4AF37] rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-3 h-3 bg-[#D4AF37] rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-3 h-3 bg-[#D4AF37] rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Botão skip (discreto) */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        whileHover={{ opacity: 1 }}
        onClick={onComplete}
        className="absolute bottom-8 right-8 px-6 py-3 bg-[#1A1A1A]/80 backdrop-blur-sm border border-gray-700 text-gray-400 rounded-xl hover:text-white hover:border-[#D4AF37] transition-all duration-200 flex items-center gap-2"
      >
        <span className="text-sm">Pular animação</span>
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
}

// Componente auxiliar para ícones de nós
function IconNode({ icon: Icon, label, color }: { icon: any; label: string; color: string }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      whileHover={{ scale: 1.1 }}
    >
      <motion.div
        className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl"
        style={{ backgroundColor: `${color}20`, borderWidth: '2px', borderColor: color }}
        animate={{
          boxShadow: [
            `0 0 20px ${color}40`,
            `0 0 40px ${color}60`,
            `0 0 20px ${color}40`,
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Icon className="w-10 h-10" style={{ color }} />
      </motion.div>
      <span className="text-xs text-gray-400 font-medium">{label}</span>
    </motion.div>
  );
}
