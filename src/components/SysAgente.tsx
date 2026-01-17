import { useState } from 'react';
import { X, Send, Mic, Sparkles, Lightbulb, Calculator, FileText, Package } from 'lucide-react';

interface SysAgenteProps {
  onClose: () => void;
}

export function SysAgente({ onClose }: SysAgenteProps) {
  const [mensagens, setMensagens] = useState([
    {
      tipo: 'agente',
      texto: 'Olá! Sou o SysAgente, seu assistente inteligente! Como posso ajudar você hoje?',
      hora: '14:32'
    }
  ]);
  const [input, setInput] = useState('');

  const sugestoes = [
    { icon: Calculator, texto: 'Calcular orçamento rápido', cor: 'teal' },
    { icon: FileText, texto: 'Resumir meus orçamentos', cor: 'blue' },
    { icon: Package, texto: 'Status das entregas', cor: 'orange' },
    { icon: Lightbulb, texto: 'Dicas de otimização', cor: 'yellow' },
  ];

  const enviarMensagem = () => {
    if (!input.trim()) return;

    setMensagens([
      ...mensagens,
      {
        tipo: 'usuario',
        texto: input,
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setTimeout(() => {
      setMensagens(prev => [
        ...prev,
        {
          tipo: 'agente',
          texto: 'Entendi sua solicitação! Estou processando as informações...',
          hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1000);

    setInput('');
  };

  const usarSugestao = (texto: string) => {
    setInput(texto);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border-2 border-purple-500/50 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl shadow-purple-900/50">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 bg-gradient-to-r from-purple-600/20 to-purple-700/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Bonequinho SysAgente */}
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-purple-500/50 border-2 border-purple-400 relative">
                <div className="w-7 h-7 bg-white rounded-full mb-1"></div>
                <div className="w-10 h-4 bg-white rounded-sm flex items-center justify-center">
                  <span className="text-purple-600 text-[10px] font-black">SYS</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-neutral-900 animate-pulse"></div>
              </div>

              <div>
                <h2 className="text-white text-2xl font-black flex items-center gap-2">
                  SysAgente IA
                  <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                </h2>
                <p className="text-neutral-400 text-sm">Assistente Inteligente SysConecta</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 bg-neutral-800/50 border border-neutral-700/50 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/50 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {mensagens.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.tipo === 'agente' && (
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex flex-col items-center justify-center mr-3 flex-shrink-0">
                  <div className="w-4 h-4 bg-white rounded-full mb-0.5"></div>
                  <div className="w-5 h-2 bg-white rounded-sm"></div>
                </div>
              )}

              <div
                className={`max-w-md rounded-2xl px-4 py-3 ${
                  msg.tipo === 'usuario'
                    ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white'
                    : 'bg-neutral-800/50 border border-neutral-700/50 text-white'
                }`}
              >
                <p className="text-sm">{msg.texto}</p>
                <span className="text-xs opacity-70 mt-1 block">{msg.hora}</span>
              </div>

              {msg.tipo === 'usuario' && (
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center ml-3 text-white font-bold flex-shrink-0">
                  AS
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sugestões Rápidas */}
        <div className="px-6 py-3 border-t border-neutral-800">
          <div className="text-neutral-400 text-xs mb-3 font-semibold">Sugestões Rápidas:</div>
          <div className="grid grid-cols-2 gap-3">
            {sugestoes.map((sugestao, i) => (
              <button
                key={i}
                onClick={() => usarSugestao(sugestao.texto)}
                className={`flex items-center gap-3 bg-${sugestao.cor}-600/10 border border-${sugestao.cor}-500/30 rounded-xl p-3 hover:bg-${sugestao.cor}-600/20 transition-all text-left`}
              >
                <div className={`w-10 h-10 bg-${sugestao.cor}-600/20 rounded-lg flex items-center justify-center`}>
                  <sugestao.icon className={`w-5 h-5 text-${sugestao.cor}-400`} />
                </div>
                <span className="text-white text-sm font-semibold">{sugestao.texto}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-neutral-800 bg-neutral-900/50">
          <div className="flex gap-3">
            <button className="w-12 h-12 bg-purple-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center text-purple-400 hover:bg-purple-600/30 transition-all">
              <Mic className="w-5 h-5" />
            </button>

            <input
              type="text"
              placeholder="Digite sua mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
              className="flex-1 bg-neutral-800/50 border border-neutral-700/50 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-purple-500/50"
            />

            <button
              onClick={enviarMensagem}
              className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white hover:from-purple-500 hover:to-purple-600 transition-all shadow-lg shadow-purple-900/50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
