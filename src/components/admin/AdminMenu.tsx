import { Database, ArrowLeft } from 'lucide-react';

interface AdminMenuProps {
  onNavigate: (screen: string) => void;
  currentScreen: string;
}

export function AdminMenu({ onNavigate, currentScreen }: AdminMenuProps) {
  if (currentScreen !== 'admin-inicializar-banco') {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-50">
      <button
        onClick={() => onNavigate('01-login')}
        className="bg-white hover:bg-gray-50 text-gray-900 rounded-lg px-4 py-2 shadow-lg border border-gray-200 flex items-center gap-2 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Voltar ao Login</span>
      </button>
    </div>
  );
}
