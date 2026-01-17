import { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, Bot, Users, Package, Smile, Clock } from 'lucide-react';

interface ChatB2BProps {
  onClose: () => void;
}

export function ChatB2B({ onClose }: ChatB2BProps) {
  const [chatMode, setChatMode] = useState<'inicial' | 'servico' | 'material' | 'chat'>('inicial');
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [inputMensagem, setInputMensagem] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  useEffect(() => {
    // Mensagem inicial
    setMensagens([
      {
        id: 1,
        tipo: 'bot',
        texto: 'Olá! 👋 Sou o assistente do SysConecta B2B. Como posso ajudar você hoje?',
        timestamp: new Date(),
      }
    ]);
  }, []);

  const handleModoServico = () => {
    setChatMode('servico');
    setMensagens([
      ...mensagens,
      {
        id: Date.now(),
        tipo: 'usuario',
        texto: 'Tenho dúvida sobre serviço',
        timestamp: new Date(),
      },
      {
        id: Date.now() + 1,
        tipo: 'bot',
        texto: 'Perfeito! Sou o SYSagente 🤖 e estou aqui para ajudar com dúvidas sobre serviços. No que posso te auxiliar?',
        timestamp: new Date(),
        sugestoes: [
          'Como fazer instalação de box?',
          'Qual o prazo de entrega padrão?',
          'Como calcular m² de vidro?',
          'Preciso de ajuda com medição',
        ]
      }
    ]);
  };

  const handleModoMaterial = () => {
    setChatMode('material');
    setMensagens([
      ...mensagens,
      {
        id: Date.now(),
        tipo: 'usuario',
        texto: 'Tenho dúvida sobre material',
        timestamp: new Date(),
      },
      {
        id: Date.now() + 1,
        tipo: 'bot',
        texto: 'Ótimo! Sou o SYSagente 🤖 especialista em materiais. Qual material você precisa saber mais?',
        timestamp: new Date(),
        sugestoes: [
          'Qual vidro usar para box?',
          'Diferença entre temperado e laminado',
          'Espessura ideal para janela',
          'Tipos de alumínio disponíveis',
        ]
      }
    ]);
  };

  const handleModoChat = () => {
    setChatMode('chat');
    setMensagens([
      {
        id: 1,
        tipo: 'sistema',
        texto: '🟢 Você entrou no chat B2B - 47 vidraceiros online',
        timestamp: new Date(),
      },
      {
        id: 2,
        tipo: 'outro',
        nome: 'Carlos Silva',
        avatar: '👨‍🔧',
        texto: 'Alguém já trabalhou com vidro duplo de 8mm? Preciso de dicas!',
        timestamp: new Date(Date.now() - 300000),
      },
      {
        id: 3,
        tipo: 'outro',
        nome: 'Roberto Santos',
        avatar: '👷',
        texto: 'Sim, Carlos! Uso direto. O importante é fazer a vedação correta nas bordas.',
        timestamp: new Date(Date.now() - 240000),
      },
      {
        id: 4,
        tipo: 'outro',
        nome: 'Ana Costa',
        avatar: '👩‍💼',
        texto: 'Concordo com o Roberto! E sempre confira se o espaçador está certinho 👍',
        timestamp: new Date(Date.now() - 180000),
      },
      {
        id: 5,
        tipo: 'outro',
        nome: 'João Pereira',
        avatar: '🧑‍🔧',
        texto: 'Pessoal, alguém usa o novo sistema de orçamento do SysConecta? Tá MUITO bom! 🚀',
        timestamp: new Date(Date.now() - 120000),
      },
      {
        id: 6,
        tipo: 'outro',
        nome: 'Maria Oliveira',
        avatar: '👩‍🏭',
        texto: 'Usooo! Facilitou demais minha vida. Principalmente a parte de tipologias 3D 😍',
        timestamp: new Date(Date.now() - 60000),
      },
      {
        id: 7,
        tipo: 'outro',
        nome: 'Fernando Lima',
        avatar: '👨‍💻',
        texto: 'Verdade! E o acompanhamento de pedidos em tempo real? Parece Waze! hahaha 😂',
        timestamp: new Date(Date.now() - 30000),
      },
      {
        id: 8,
        tipo: 'outro',
        nome: 'Patricia Rocha',
        avatar: '👩‍🔬',
        texto: 'Amanhã o software vai ficar ainda melhor! Ouvi dizer que vem novidade... 🤫✨',
        timestamp: new Date(Date.now() - 10000),
      },
    ]);
  };

  const handleEnviarMensagem = () => {
    if (!inputMensagem.trim()) return;

    const novaMensagem = {
      id: Date.now(),
      tipo: chatMode === 'chat' ? 'usuario-chat' : 'usuario',
      texto: inputMensagem,
      timestamp: new Date(),
      ...(chatMode === 'chat' && { nome: 'Você', avatar: '🙋' })
    };

    setMensagens([...mensagens, novaMensagem]);
    setInputMensagem('');

    // Resposta automática do bot (se não for chat)
    if (chatMode !== 'chat') {
      setTimeout(() => {
        const resposta = {
          id: Date.now() + 1,
          tipo: 'bot',
          texto: 'Entendi sua dúvida! Vou consultar nossa base de conhecimento e te responder em instantes... 🔍',
          timestamp: new Date(),
        };
        setMensagens(prev => [...prev, resposta]);
      }, 1000);
    }
  };

  const handleSugestao = (sugestao: string) => {
    setInputMensagem(sugestao);
  };

  return (
    <div className="fixed bottom-28 left-4 right-4 md:left-auto md:bottom-8 md:right-8 z-50 md:w-[450px] h-[50vh] md:h-[600px] bg-gradient-to-br from-neutral-900 to-neutral-950 border-2 border-cyan-700 rounded-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-900 to-cyan-800 p-4 rounded-t-xl border-b border-cyan-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-700/30 rounded-full flex items-center justify-center">
              {chatMode === 'chat' ? (
                <Users className="w-5 h-5 text-cyan-400" />
              ) : (
                <Bot className="w-5 h-5 text-cyan-400" />
              )}
            </div>
            <div>
              <div className="text-white font-bold">
                {chatMode === 'inicial' && 'Chat B2B SysConecta'}
                {chatMode === 'servico' && 'SYSagente - Serviços'}
                {chatMode === 'material' && 'SYSagente - Materiais'}
                {chatMode === 'chat' && 'Comunidade B2B'}
              </div>
              <div className="text-cyan-300 text-xs flex items-center gap-1">
                {chatMode === 'chat' ? (
                  <>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    47 vidraceiros online
                  </>
                ) : (
                  'Assistente Virtual'
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-cyan-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Botões de Modo (apenas no inicial) */}
        {chatMode === 'inicial' && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleModoServico}
              className="flex-1 px-3 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              Serviço
            </button>
            <button
              onClick={handleModoMaterial}
              className="flex-1 px-3 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              Material
            </button>
            <button
              onClick={handleModoChat}
              className="flex-1 px-3 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Chat
            </button>
          </div>
        )}
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {mensagens.map((msg) => (
          <div key={msg.id}>
            {msg.tipo === 'sistema' && (
              <div className="text-center">
                <div className="inline-block px-4 py-2 bg-neutral-800/50 text-neutral-400 text-xs rounded-full">
                  {msg.texto}
                </div>
              </div>
            )}

            {msg.tipo === 'bot' && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-cyan-700/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <div className="bg-neutral-800 rounded-2xl rounded-tl-none p-3 max-w-[85%]">
                    <p className="text-white text-sm">{msg.texto}</p>
                  </div>
                  {msg.sugestoes && (
                    <div className="mt-2 space-y-1">
                      {msg.sugestoes.map((sugestao: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => handleSugestao(sugestao)}
                          className="block w-full text-left px-3 py-2 bg-neutral-900 hover:bg-cyan-900/30 border border-neutral-700 hover:border-cyan-700 text-neutral-300 hover:text-white text-xs rounded-lg transition-all"
                        >
                          {sugestao}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-1 mt-1 text-neutral-600 text-xs">
                    <Clock className="w-3 h-3" />
                    {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            )}

            {(msg.tipo === 'usuario' || msg.tipo === 'usuario-chat') && (
              <div className="flex justify-end gap-3">
                <div className="flex-1 flex flex-col items-end">
                  <div className="bg-cyan-700 rounded-2xl rounded-tr-none p-3 max-w-[85%]">
                    <p className="text-white text-sm">{msg.texto}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-neutral-600 text-xs">
                    <Clock className="w-3 h-3" />
                    {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {msg.tipo === 'usuario-chat' && (
                  <div className="w-8 h-8 bg-cyan-700/30 rounded-full flex items-center justify-center flex-shrink-0 text-lg">
                    {msg.avatar}
                  </div>
                )}
              </div>
            )}

            {msg.tipo === 'outro' && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-neutral-700 to-neutral-600 rounded-full flex items-center justify-center flex-shrink-0 text-lg">
                  {msg.avatar}
                </div>
                <div className="flex-1">
                  <div className="text-neutral-400 text-xs mb-1">{msg.nome}</div>
                  <div className="bg-neutral-800 rounded-2xl rounded-tl-none p-3 max-w-[85%]">
                    <p className="text-white text-sm">{msg.texto}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-neutral-600 text-xs">
                    <Clock className="w-3 h-3" />
                    {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-neutral-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMensagem}
            onChange={(e) => setInputMensagem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleEnviarMensagem()}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-cyan-700 text-sm"
          />
          <button
            onClick={handleEnviarMensagem}
            className="w-12 h-12 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg transition-all flex items-center justify-center flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
