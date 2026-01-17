import React from 'react';
import { User, Building2, ShieldAlert } from 'lucide-react';

interface DevSwitcherProps {
  onSwitch: (role: 'vidraceiro' | 'fornecedor') => void;
}

export function DevSwitcher({ onSwitch }: DevSwitcherProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="fixed top-20 left-4 z-[10000] font-sans">
      {isOpen ? (
        <div className="bg-black/90 backdrop-blur border border-white/20 p-2 rounded-2xl shadow-2xl flex flex-col gap-2 animate-in fade-in zoom-in duration-200">
            <div className="px-2 py-1 text-[10px] font-bold text-white/50 text-center uppercase tracking-widest border-b border-white/10 mb-1">
                Modo Deus
            </div>
            
            <button
                onClick={() => {
                    onSwitch('vidraceiro');
                    setIsOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all font-bold text-sm shadow-lg shadow-blue-900/20 active:scale-95 w-full"
            >
                <User className="w-4 h-4" />
                Sou Vidraceiro
            </button>

            <button
                onClick={() => {
                    onSwitch('fornecedor');
                    setIsOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all font-bold text-sm shadow-lg shadow-purple-900/20 active:scale-95 w-full"
            >
                <Building2 className="w-4 h-4" />
                Sou Santa Rita
            </button>

            <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-center text-white/40 hover:text-white pt-1"
            >
                Fechar
            </button>
        </div>
      ) : (
        <button
            onClick={() => setIsOpen(true)}
            className="w-10 h-10 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-900/50 border-2 border-white/20 transition-all hover:scale-110 active:scale-95 group"
            title="Trocar Perfil (Dev Mode)"
        >
            <ShieldAlert className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  );
}