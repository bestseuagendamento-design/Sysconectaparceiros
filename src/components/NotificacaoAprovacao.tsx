import { useState, useEffect } from 'react';
import { CheckCircle, X, Package } from 'lucide-react';

interface NotificacaoAprovacaoProps {
  notificacoes: any[];
  onFecharNotificacao: (id: number) => void;
  onAbrirPedido: (pedidoId: any) => void;
}

export function NotificacaoAprovacao({ 
  notificacoes, 
  onFecharNotificacao,
  onAbrirPedido 
}: NotificacaoAprovacaoProps) {
  const [notificacoesVisiveis, setNotificacoesVisiveis] = useState<any[]>([]);

  useEffect(() => {
    // Mostrar apenas notificações não lidas
    const naoLidas = notificacoes.filter(n => !n.lida);
    setNotificacoesVisiveis(naoLidas);
  }, [notificacoes]);

  if (notificacoesVisiveis.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-4">
      {notificacoesVisiveis.map((notificacao) => (
        <div
          key={notificacao.id}
          className="bg-white border-2 border-green-500 rounded-2xl shadow-2xl overflow-hidden animate-slideIn"
          style={{
            width: '450px',
            animation: 'slideInRight 0.5s ease-out'
          }}
        >
          {/* Header com gradiente */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 p-6 relative">
            {/* Botão fechar */}
            <button
              onClick={() => onFecharNotificacao(notificacao.id)}
              className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Ícone e Título */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl">
                  🎉 {notificacao.titulo}
                </h3>
                <div className="text-green-100 text-sm mt-1">
                  Pedido {notificacao.pedidoNumero}
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-6 bg-white">
            <p className="text-gray-700 mb-6 text-center" style={{ fontSize: '1.125rem' }}>
              {notificacao.mensagem}
            </p>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 text-green-800">
                <Package className="w-5 h-5 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-semibold mb-1">Status Atualizado:</div>
                  <div className="text-green-700">✓ Aguardando Aprovação → <strong>EM PRODUÇÃO</strong></div>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onFecharNotificacao(notificacao.id)}
                className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all font-medium"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  onAbrirPedido(notificacao.pedidoId);
                  onFecharNotificacao(notificacao.id);
                }}
                className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all font-semibold shadow-lg"
              >
                Acompanhar Pedido
              </button>
            </div>

            {/* Timestamp */}
            <div className="text-center mt-4 text-gray-400 text-xs">
              {new Date(notificacao.timestamp).toLocaleString('pt-BR')}
            </div>
          </div>
        </div>
      ))}

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(500px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slideIn {
          animation: slideInRight 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
