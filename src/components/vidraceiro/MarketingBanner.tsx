import React from 'react';
import { Tag, ArrowRight, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

export function MarketingBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#8B0000] to-[#B22222] shadow-lg"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Tag size={120} className="text-white transform rotate-12 translate-x-4 -translate-y-4" />
      </div>
      
      <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30 flex items-center gap-1">
              <TrendingUp size={12} />
              OFERTA RELÂMPAGO
            </span>
            <span className="text-white/80 text-xs font-medium tracking-wide">VÁLIDO ATÉ AMANHÃ</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
            Semana do Temperado Santa Rita
          </h2>
          <p className="text-white/90 text-sm sm:text-base max-w-xl leading-relaxed">
            Feche orçamentos de <strong className="text-white font-extrabold">Vidro Temperado 8mm</strong> hoje e ganhe <strong className="text-[#FFD700]">15% de desconto</strong> no pagamento à vista. Aproveite para renovar seu estoque!
          </p>
        </div>

        <div className="flex-shrink-0">
          <button className="group bg-white text-[#8B0000] hover:bg-gray-50 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-md hover:shadow-xl flex items-center gap-2 transform hover:scale-105">
            Ver Tabela Promocional
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
      
      {/* Efeito de Brilho */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] animate-shimmer" />
    </motion.div>
  );
}