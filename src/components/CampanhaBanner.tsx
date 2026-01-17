import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, Timer } from 'lucide-react';
import { supabase } from '../../utils/supabase/client';

export function CampanhaBanner({ estadoUser }: { estadoUser: string }) {
  const [campanha, setCampanha] = useState<any>(null);

  useEffect(() => {
    async function carregarCampanha() {
      // Busca campanha ativa para o estado
      const { data } = await supabase
        .from('kv_store_f33747ec')
        .select('value')
        .eq('key', `campanha_${estadoUser}`)
        .single();

      if (data?.value) {
        const camp = data.value;
        const agora = new Date();
        const validade = new Date(camp.validade);
        
        if (validade > agora) {
            setCampanha(camp);
        }
      }
    }
    carregarCampanha();
  }, [estadoUser]);

  if (!campanha) {
      // Banner Padrão (Fallback - Santa Rita)
      return (
        <div className="bg-gradient-to-r from-[#8B0000] to-[#B22222] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl mb-6 border border-white/10">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-center sm:text-left">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold mb-3 border border-white/30">
                        <Timer className="w-3 h-3" /> OFERTA RELÂMPAGO
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-black mb-3 leading-tight tracking-tight">
                        Semana do Temperado <br/><span className="text-[#FFD700]">Santa Rita</span>
                    </h2>
                    <p className="text-white/90 text-sm sm:text-base max-w-lg leading-relaxed">
                        Feche seus orçamentos de <strong className="text-white">Vidro 8mm</strong> até amanhã e garanta <strong className="bg-white/20 px-1 rounded text-[#FFD700]">15% OFF</strong> no pagamento à vista.
                    </p>
                </div>

                <div className="flex-shrink-0 relative group">
                    <div className="absolute -inset-1 bg-[#FFD700] rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <button className="relative px-8 py-4 bg-white text-[#8B0000] rounded-xl font-bold hover:bg-gray-50 transition-all transform group-hover:scale-105 shadow-xl flex items-center gap-3">
                        Ver Tabela Promocional <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
            
            {/* Elementos Decorativos */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-black/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-900 to-blue-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl mb-6 border border-indigo-500/30 animate-in fade-in">
        <div className="relative z-10 max-w-lg">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500 text-black text-xs font-black mb-3 shadow-lg shadow-yellow-500/20">
                <Sparkles className="w-3 h-3" /> OFERTA RELÂMPAGO
            </span>
            <h2 className="text-2xl md:text-3xl font-black mb-2 leading-tight">
                {campanha.titulo}
            </h2>
            <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-black text-yellow-400">R$ {campanha.preco}</span>
                <span className="text-sm text-indigo-200">/ {campanha.unidade}</span>
            </div>
            <p className="text-indigo-200 mb-6 text-sm md:text-base max-w-sm">
                {campanha.descricao}
            </p>
            
            <div className="flex items-center gap-4">
                <button className="px-6 py-2.5 bg-yellow-500 text-black rounded-lg font-bold hover:bg-yellow-400 transition-colors flex items-center gap-2 shadow-lg shadow-yellow-500/20">
                    Aproveitar Oferta <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-mono bg-indigo-950/50 px-3 py-2 rounded-lg border border-indigo-500/30">
                    <Timer className="w-3 h-3" />
                    Expira em {new Date(campanha.validade).toLocaleDateString()}
                </div>
            </div>
        </div>
        
        {/* Imagem de Fundo (Se houver) */}
        {campanha.imagem && (
            <div className="absolute right-0 top-0 h-full w-1/2 opacity-30 pointer-events-none">
                <img src={campanha.imagem} className="w-full h-full object-cover mask-image-gradient" />
            </div>
        )}
    </div>
  );
}