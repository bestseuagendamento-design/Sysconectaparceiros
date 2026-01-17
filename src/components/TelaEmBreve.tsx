import { ArrowLeft, Clock } from 'lucide-react';

interface TelaEmBreveProps {
  titulo: string;
  onNavigate: (screen: string) => void;
}

export function TelaEmBreve({ titulo, onNavigate }: TelaEmBreveProps) {
  return (
    <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center p-12">
      <div className="text-center max-w-2xl">
        <div className="w-32 h-32 bg-[#2C5F6F]/10 rounded-2xl flex items-center justify-center mb-8 mx-auto">
          <Clock className="w-16 h-16 text-[#2C5F6F]" />
        </div>
        
        <h1 className="text-gray-900 mb-4 tracking-tight font-semibold" style={{ fontSize: '2rem' }}>
          {titulo}
        </h1>
        
        <p className="text-gray-600 text-lg mb-12">
          Esta funcionalidade estará disponível em breve
        </p>
        
        <button
          onClick={() => onNavigate('03-dashboard-execucao')}
          className="inline-flex items-center gap-3 px-8 py-4 bg-[#2C5F6F] hover:bg-[#234A56] text-white rounded-lg transition-all duration-300 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
}
