import { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Volume2, Check, Loader, Zap } from 'lucide-react';

interface OrcamentoPorVozProps {
  onClose: () => void;
  nomeUsuario?: string;
}

interface Conversa {
  tipo: 'sys' | 'user';
  texto: string;
  timestamp: Date;
}

interface Orcamento {
  produto: string;
  material: string;
  quantidade: number;
  dimensoes?: string;
  valorUnitario: number;
  valorTotal: number;
  detalhamento?: {
    vidro?: number;
    aluminio?: number;
    ferragens?: number;
  };
  prazoEntrega: string;
}

export function OrcamentoPorVoz({ onClose, nomeUsuario = 'Arthur' }: OrcamentoPorVozProps) {
  const [gravando, setGravando] = useState(false);
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [processando, setProcessando] = useState(false);
  const [orcamentoGerado, setOrcamentoGerado] = useState<Orcamento | null>(null);
  const [aguardandoResposta, setAguardandoResposta] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Inicializar reconhecimento de voz
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'pt-BR';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleUserSpeech(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Erro no reconhecimento:', event.error);
        setGravando(false);
        if (event.error === 'no-speech') {
          adicionarMensagemSys('Não consegui ouvir. Pode repetir por favor?');
        }
      };

      recognitionRef.current.onend = () => {
        setGravando(false);
      };
    }

    // Mensagem inicial
    setTimeout(() => {
      const mensagemInicial = `Olá ${nomeUsuario}, tudo bem? Sou o Agente SYS, seu assistente inteligente de orçamentos! Estou aqui para te ajudar a criar orçamentos rapidamente. Como posso te ajudar hoje?`;
      adicionarMensagemSys(mensagemInicial);
      falar(mensagemInicial);
    }, 500);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, [nomeUsuario]);

  const adicionarMensagemSys = (texto: string) => {
    setConversas(prev => [...prev, {
      tipo: 'sys',
      texto,
      timestamp: new Date()
    }]);
  };

  const adicionarMensagemUser = (texto: string) => {
    setConversas(prev => [...prev, {
      tipo: 'user',
      texto,
      timestamp: new Date()
    }]);
  };

  const falar = (texto: string) => {
    window.speechSynthesis.cancel();
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onend = () => {
        setAguardandoResposta(true);
      };

      synthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const iniciarGravacao = () => {
    if (recognitionRef.current) {
      setGravando(true);
      setAguardandoResposta(false);
      recognitionRef.current.start();
    } else {
      alert('Seu navegador não suporta reconhecimento de voz. Use Chrome, Edge ou Safari.');
    }
  };

  const pararGravacao = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setGravando(false);
  };

  const handleUserSpeech = (texto: string) => {
    adicionarMensagemUser(texto);
    setProcessando(true);

    setTimeout(() => {
      processarPedido(texto);
    }, 800);
  };

  const processarPedido = (pedido: string) => {
    const pedidoLower = pedido.toLowerCase();

    // Detectar intenção
    if (pedidoLower.includes('orçamento') || pedidoLower.includes('orçar') || pedidoLower.includes('preço') || pedidoLower.includes('quanto custa')) {
      processarOrcamento(pedido);
    } else if (pedidoLower.includes('olá') || pedidoLower.includes('oi') || pedidoLower.includes('bom dia') || pedidoLower.includes('boa tarde')) {
      const resposta = `Olá! Que bom ter você aqui! Estou pronto para criar orçamentos. Me diga: qual produto você precisa orçar?`;
      adicionarMensagemSys(resposta);
      falar(resposta);
      setProcessando(false);
    } else if (pedidoLower.includes('ajuda') || pedidoLower.includes('o que você faz')) {
      const resposta = `Eu posso criar orçamentos completos para você! Basta me dizer qual produto precisa, como "orçamento de 2 janelas Suprema 2 folhas alumínio branco" e eu calculo tudo automaticamente. Quer tentar?`;
      adicionarMensagemSys(resposta);
      falar(resposta);
      setProcessando(false);
    } else if (pedidoLower.includes('obrigado') || pedidoLower.includes('obrigada')) {
      const resposta = `Por nada! Estou sempre à disposição. Precisa de mais alguma coisa?`;
      adicionarMensagemSys(resposta);
      falar(resposta);
      setProcessando(false);
    } else {
      // Não entendeu, pede esclarecimento
      const resposta = `Desculpe, não entendi muito bem. Você quer fazer um orçamento? Se sim, me diga qual produto e em qual quantidade!`;
      adicionarMensagemSys(resposta);
      falar(resposta);
      setProcessando(false);
    }
  };

  const processarOrcamento = (pedido: string) => {
    const pedidoLower = pedido.toLowerCase();

    // Extrair informações do pedido
    let produto = 'Janela Linha Suprema 2 Folhas';
    let quantidade = 1;
    let material = 'Alumínio Branco';
    let dimensoes = '1.00m x 1.20m';

    // Detectar quantidade
    if (pedidoLower.includes('duas') || pedidoLower.includes('2')) quantidade = 2;
    if (pedidoLower.includes('três') || pedidoLower.includes('3')) quantidade = 3;
    if (pedidoLower.includes('quatro') || pedidoLower.includes('4')) quantidade = 4;
    if (pedidoLower.includes('cinco') || pedidoLower.includes('5')) quantidade = 5;

    // Detectar tipo de produto
    if (pedidoLower.includes('porta')) {
      produto = quantidade > 1 ? `${quantidade}x Porta de Vidro Temperado` : 'Porta de Vidro Temperado';
    } else if (pedidoLower.includes('box')) {
      produto = quantidade > 1 ? `${quantidade}x Box de Banheiro` : 'Box de Banheiro';
    } else if (pedidoLower.includes('janela')) {
      if (pedidoLower.includes('4 folhas') || pedidoLower.includes('quatro folhas')) {
        produto = quantidade > 1 ? `${quantidade}x Janela Linha Suprema 4 Folhas` : 'Janela Linha Suprema 4 Folhas';
      } else {
        produto = quantidade > 1 ? `${quantidade}x Janela Linha Suprema 2 Folhas` : 'Janela Linha Suprema 2 Folhas';
      }
    }

    // Detectar material
    if (pedidoLower.includes('preto')) material = 'Alumínio Preto';
    if (pedidoLower.includes('bronze')) material = 'Alumínio Bronze';
    if (pedidoLower.includes('branco')) material = 'Alumínio Branco';

    // Calcular valores
    const valorUnitario = 1250.00;
    const valorTotal = valorUnitario * quantidade;

    const orcamento: Orcamento = {
      produto,
      material,
      quantidade,
      dimensoes,
      valorUnitario,
      valorTotal,
      detalhamento: {
        vidro: 480.00 * quantidade,
        aluminio: 650.00 * quantidade,
        ferragens: 120.00 * quantidade,
      },
      prazoEntrega: '15 dias úteis',
    };

    setOrcamentoGerado(orcamento);

    const resposta = `Perfeito ${nomeUsuario}! Montei seu orçamento completo:\n\n✅ ${produto}\n✅ Material: ${material}\n✅ Dimensões: ${dimensoes} cada\n\n💰 Valor unitário: ${formatarMoeda(valorUnitario)}\n💰 Valor total: ${formatarMoeda(valorTotal)}\n\n📦 Prazo de entrega: 15 dias úteis\n\nO orçamento foi salvo automaticamente! Posso te ajudar com mais alguma coisa?`;

    adicionarMensagemSys(resposta);
    
    // Falar de forma mais natural
    const falaResposta = `Perfeito ${nomeUsuario}! Montei seu orçamento. ${quantidade > 1 ? quantidade : 'Uma'} ${produto.includes('Janela') ? 'janela' : produto.includes('Porta') ? 'porta' : 'box'} ${produto.includes('2 Folhas') ? 'duas folhas' : produto.includes('4 Folhas') ? 'quatro folhas' : ''}, em ${material.toLowerCase()}. Valor total: ${formatarMoedaPorExtenso(valorTotal)}. Orçamento salvo! Posso te ajudar com mais alguma coisa?`;
    
    falar(falaResposta);
    setProcessando(false);
  };

  const formatarMoeda = (valor: number): string => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatarMoedaPorExtenso = (valor: number): string => {
    const milhares = Math.floor(valor / 1000);
    const centenas = Math.floor(valor % 1000);
    
    if (milhares > 0 && centenas === 0) {
      return `${milhares} mil reais`;
    } else if (milhares > 0) {
      return `${milhares} mil e ${centenas} reais`;
    }
    return `${centenas} reais`;
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gradient-to-br from-slate-950 to-slate-900 border-2 border-purple-700/50 rounded-3xl w-full max-w-5xl shadow-2xl shadow-purple-900/50 max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-purple-800 p-8 border-b border-purple-700/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full -mr-32 -mt-32"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-600/50">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-white text-3xl font-black mb-1">🎤 Orçamento por Voz</h2>
                <p className="text-purple-300 font-semibold">Agente SYS - Assistente Inteligente de IA</p>
              </div>
            </div>
            <button onClick={onClose} className="text-purple-300 hover:text-white transition-colors p-2 hover:bg-purple-800/50 rounded-xl">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gradient-to-br from-slate-950 to-slate-900">
          {conversas.map((conversa, index) => (
            <div
              key={index}
              className={`flex ${conversa.tipo === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}
            >
              <div className={`max-w-[75%] rounded-2xl p-6 shadow-xl ${
                conversa.tipo === 'user'
                  ? 'bg-gradient-to-br from-purple-700 to-purple-600 text-white border border-purple-500/50'
                  : 'bg-slate-900/90 backdrop-blur-sm border border-purple-700/30 text-white'
              }`}>
                {conversa.tipo === 'sys' && (
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-purple-400 text-xs font-bold tracking-wider uppercase">AGENTE SYS</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap leading-relaxed">{conversa.texto}</p>
                <div className={`text-xs mt-3 ${conversa.tipo === 'user' ? 'text-purple-200' : 'text-slate-500'}`}>
                  {conversa.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {processando && (
            <div className="flex justify-start animate-in fade-in duration-500">
              <div className="bg-slate-900/90 backdrop-blur-sm border border-purple-700/30 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <Loader className="w-5 h-5 text-purple-400 animate-spin" />
                  <span className="text-purple-300">Processando sua solicitação...</span>
                </div>
              </div>
            </div>
          )}

          {aguardandoResposta && !gravando && (
            <div className="flex justify-center animate-pulse">
              <div className="bg-purple-900/30 border border-purple-700/50 rounded-full px-6 py-3">
                <span className="text-purple-300 text-sm font-semibold">🎤 Aguardando sua resposta...</span>
              </div>
            </div>
          )}

          {/* Orçamento Gerado */}
          {orcamentoGerado && (
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-2 border-green-600/50 rounded-2xl p-8 shadow-2xl shadow-green-900/30 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Check className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-white text-2xl font-black">✅ Orçamento Gerado</h3>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-black/30 rounded-xl p-5 border border-green-800/30">
                  <div className="text-green-400 text-sm font-semibold mb-2">Produto</div>
                  <div className="text-white text-lg font-bold">{orcamentoGerado.produto}</div>
                </div>
                <div className="bg-black/30 rounded-xl p-5 border border-green-800/30">
                  <div className="text-green-400 text-sm font-semibold mb-2">Material</div>
                  <div className="text-white text-lg font-bold">{orcamentoGerado.material}</div>
                </div>
                <div className="bg-black/30 rounded-xl p-5 border border-green-800/30">
                  <div className="text-green-400 text-sm font-semibold mb-2">Quantidade</div>
                  <div className="text-white text-lg font-bold">{orcamentoGerado.quantidade} unidades</div>
                </div>
                <div className="bg-black/30 rounded-xl p-5 border border-green-800/30">
                  <div className="text-green-400 text-sm font-semibold mb-2">Dimensões</div>
                  <div className="text-white text-lg font-bold">{orcamentoGerado.dimensoes}</div>
                </div>
              </div>

              {orcamentoGerado.detalhamento && (
                <div className="bg-black/30 rounded-xl p-6 mb-6 border border-green-800/30">
                  <div className="text-green-400 text-sm font-semibold mb-4">Detalhamento de Custos:</div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Vidro:</span>
                      <span className="text-white font-bold text-lg">{formatarMoeda(orcamentoGerado.detalhamento.vidro || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Alumínio:</span>
                      <span className="text-white font-bold text-lg">{formatarMoeda(orcamentoGerado.detalhamento.aluminio || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Ferragens:</span>
                      <span className="text-white font-bold text-lg">{formatarMoeda(orcamentoGerado.detalhamento.ferragens || 0)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-green-700/50 pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-green-400 text-sm font-semibold mb-2">Valor Total</div>
                    <div className="text-white text-5xl font-black">{formatarMoeda(orcamentoGerado.valorTotal)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 text-sm font-semibold mb-2">Prazo de Entrega</div>
                    <div className="text-white text-2xl font-bold">{orcamentoGerado.prazoEntrega}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controles */}
        <div className="border-t border-purple-700/50 p-8 bg-gradient-to-r from-slate-950 to-slate-900">
          <div className="flex items-center gap-4">
            {!orcamentoGerado ? (
              <>
                <button
                  onClick={gravando ? pararGravacao : iniciarGravacao}
                  disabled={processando}
                  className={`flex-1 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-4 transition-all shadow-xl ${
                    gravando
                      ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 animate-pulse shadow-red-600/50'
                      : 'bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 shadow-purple-600/50'
                  } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {gravando ? (
                    <>
                      <div className="w-6 h-6 bg-white rounded-full animate-pulse"></div>
                      🎤 GRAVANDO... (Clique para parar)
                    </>
                  ) : (
                    <>
                      <Mic className="w-7 h-7" />
                      {aguardandoResposta ? '🎤 CONTINUAR CONVERSA' : '🎤 PRESSIONE PARA FALAR'}
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    alert('✅ Orçamento salvo com sucesso no sistema!');
                    onClose();
                  }}
                  className="flex-1 py-5 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-green-600/50 transition-all"
                >
                  <Check className="w-7 h-7" />
                  SALVAR ORÇAMENTO
                </button>
                <button
                  onClick={() => {
                    setOrcamentoGerado(null);
                    const mensagem = "Tudo bem! Estou pronto para fazer um novo orçamento. O que você precisa?";
                    adicionarMensagemSys(mensagem);
                    falar(mensagem);
                  }}
                  className="flex-1 py-5 bg-gradient-to-r from-orange-700 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white rounded-2xl font-black text-xl shadow-xl shadow-orange-600/50 transition-all"
                >
                  FAZER NOVO ORÇAMENTO
                </button>
              </>
            )}
          </div>

          <p className="text-center text-slate-500 text-sm mt-4 font-medium">
            {gravando ? (
              <span className="text-purple-400 font-semibold">🎤 Fale agora... O Agente SYS está ouvindo!</span>
            ) : aguardandoResposta ? (
              <span className="text-cyan-400">💬 Clique no botão para continuar a conversa</span>
            ) : (
              '💡 Clique no botão e diga naturalmente o que você precisa'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
