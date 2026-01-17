import React, { useState, useEffect, useRef } from 'react';
import { 
  QrCode, 
  Truck, 
  Hammer, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  RotateCcw,
  Search,
  Package,
  Camera,
  Keyboard,
  CameraOff
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { Html5Qrcode } from 'html5-qrcode';
import { cloudStorage } from '../../utils/cloudStorage';

// Tipos de Estação de Trabalho
type Estacao = 'corte' | 'lapidacao' | 'tempera' | 'expedicao';

export function ScannerFabrica({ onVoltar }: { onVoltar: () => void }) {
  const [modo, setModo] = useState<'producao' | 'carregamento'>('producao');
  const [estacaoAtual, setEstacaoAtual] = useState<Estacao>('corte');
  const [codigoInput, setCodigoInput] = useState('');
  const [ultimoBip, setUltimoBip] = useState<any>(null);
  const [feedback, setFeedback] = useState<'idle' | 'sucesso' | 'erro' | 'carregando'>('idle');
  const [mensagemFeedback, setMensagemFeedback] = useState('');
  
  // Controle da Câmera
  const [usarCamera, setUsarCamera] = useState(false);
  const [cameraPermissao, setCameraPermissao] = useState<boolean | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Iniciar Câmera quando ativado
  useEffect(() => {
    if (usarCamera && feedback === 'idle') {
        const startScanner = async () => {
            try {
                // Pequeno delay para garantir que o elemento DOM existe
                await new Promise(r => setTimeout(r, 100));
                
                if (!document.getElementById('reader')) return;

                if (scannerRef.current) {
                    await scannerRef.current.stop().catch(() => {});
                }

                const html5QrCode = new Html5Qrcode("reader");
                scannerRef.current = html5QrCode;

                const config = { fps: 10, qrbox: { width: 250, height: 250 } };
                
                await html5QrCode.start(
                    { facingMode: "environment" }, // Câmera traseira
                    config,
                    (decodedText) => {
                        // Sucesso na leitura
                        html5QrCode.pause();
                        processarCodigo(decodedText);
                    },
                    (errorMessage) => {}
                );
                setCameraPermissao(true);
            } catch (err) {
                console.error("Erro ao iniciar câmera", err);
                setCameraPermissao(false);
                toast.error("Não foi possível acessar a câmera.");
                setUsarCamera(false);
            }
        };

        startScanner();

        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(err => console.log("Erro ao parar scanner", err));
            }
        };
    } else {
        if (scannerRef.current && (scannerRef.current.isScanning)) {
             scannerRef.current.stop().catch(() => {});
        }
    }
  }, [usarCamera, feedback]);

  // Manter foco no input sempre (se não estiver usando câmera)
  useEffect(() => {
    if (usarCamera) return; 

    const focusInterval = setInterval(() => {
        if (document.activeElement !== inputRef.current && feedback === 'idle' && feedback !== 'carregando') {
            inputRef.current?.focus();
        }
    }, 2000);
    return () => clearInterval(focusInterval);
  }, [feedback, usarCamera]);

  // Função Principal: Processar o Código Bipado
  const processarCodigo = async (codigo: string) => {
    if (!codigo) return;

    setFeedback('carregando'); // Feedback visual de rede

    try {
        // 1. Buscar o item na NUVEM (Garante sincronia entre celular e PC)
        const producaoItems = await cloudStorage.getItem('sysconecta_producao_items') || [];
        
        if (!producaoItems || producaoItems.length === 0) {
            bipErro("Banco de produção vazio na Nuvem!");
            return;
        }

        const itemIndex = producaoItems.findIndex((i: any) => i.id === codigo || i.id.endsWith(codigo));

        if (itemIndex === -1) {
            bipErro(`Etiqueta não encontrada: ${codigo}`);
            return;
        }

        const item = producaoItems[itemIndex];

        // 2. Lógica de Validação por Modo
        if (modo === 'carregamento') {
            // Modo Carregamento (Expedição)
            if (item.setor !== 'tempera' && item.setor !== 'pronto') {
                 bipErro(`Item no setor: ${item.setor.toUpperCase()}. Não pode carregar!`);
                 return;
            }
            
            // Atualizar
            item.setor = 'expedicao';
            item.status = 'carregado';
            item.historico.push({
                etapa: 'carregamento',
                data: new Date().toISOString(),
                obs: 'Carregado no caminhão (Mobile Cloud)'
            });
            
            bipSucesso(item, "CARREGADO COM SUCESSO");

        } else {
            // Modo Produção
            item.setor = estacaoAtual;
            item.status = 'em_producao';
            if (estacaoAtual === 'tempera') item.status = 'pronto'; 

            item.historico.push({
                etapa: estacaoAtual,
                data: new Date().toISOString(),
                obs: `Bipado na estação ${estacaoAtual.toUpperCase()} (Mobile Cloud)`
            });

            bipSucesso(item, `REGISTRADO EM: ${estacaoAtual.toUpperCase()}`);
        }

        // 3. Salvar na NUVEM
        producaoItems[itemIndex] = item;
        await cloudStorage.setItem('sysconecta_producao_items', producaoItems);
        
        // Dispara evento local para atualizar interface se necessário
        window.dispatchEvent(new Event('producao_updated'));

    } catch (error) {
        console.error("Erro no processamento:", error);
        bipErro("Erro de conexão com a Nuvem");
    }
  };

  const bipSucesso = (item: any, msg: string) => {
    setFeedback('sucesso');
    setMensagemFeedback(msg);
    setUltimoBip(item);
    setCodigoInput('');
    
    setTimeout(() => {
        setFeedback('idle');
    }, 2000);
  };

  const bipErro = (msg: string) => {
    setFeedback('erro');
    setMensagemFeedback(msg);
    setCodigoInput('');
    
    setTimeout(() => {
        setFeedback('idle');
    }, 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processarCodigo(codigoInput);
  };

  // Renderização da Tela Cheia de Feedback
  if (feedback === 'sucesso') {
    return (
        <div className="fixed inset-0 z-[1000] bg-emerald-600 flex flex-col items-center justify-center text-white p-6 animate-in zoom-in duration-200">
            <CheckCircle2 className="w-32 h-32 mb-4 drop-shadow-lg" />
            <h1 className="text-4xl font-black text-center mb-2">SUCESSO!</h1>
            <p className="text-2xl font-bold text-center opacity-90">{mensagemFeedback}</p>
            <div className="mt-8 bg-white/20 p-6 rounded-2xl w-full max-w-md backdrop-blur-sm border border-white/30">
                <p className="text-xs uppercase tracking-widest font-bold opacity-70 mb-1">Item Bipado</p>
                <p className="text-2xl font-black mb-1">{ultimoBip?.id}</p>
                <p className="text-lg">{ultimoBip?.descricao}</p>
            </div>
            <p className="mt-8 animate-pulse text-white/70">Retornando ao scanner...</p>
        </div>
    );
  }

  if (feedback === 'erro') {
    return (
        <div className="fixed inset-0 z-[1000] bg-red-600 flex flex-col items-center justify-center text-white p-6 animate-in shake duration-300">
            <XCircle className="w-32 h-32 mb-4 drop-shadow-lg" />
            <h1 className="text-4xl font-black text-center mb-2">ERRO!</h1>
            <p className="text-2xl font-bold text-center opacity-90">{mensagemFeedback}</p>
            <button 
                onClick={() => setFeedback('idle')}
                className="mt-12 bg-white text-red-600 px-8 py-3 rounded-full font-bold text-xl shadow-lg active:scale-95 transition-transform"
            >
                Tentar Novamente
            </button>
        </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[900] bg-slate-900 text-white flex flex-col h-full font-sans overflow-hidden">
      
      {/* HEADER SIMPLES */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
            <Package className="text-yellow-500 w-6 h-6" />
            <span className="font-bold tracking-wider">PCP MOBILE</span>
        </div>
        <button onClick={onVoltar} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded text-slate-400">
            Sair
        </button>
      </div>

      {/* SELETOR DE MODO */}
      <div className="p-4 grid grid-cols-2 gap-3 shrink-0">
        <button
            onClick={() => setModo('producao')}
            className={`
                flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all
                ${modo === 'producao' 
                    ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/50' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 opacity-50'}
            `}
        >
            <Hammer className="w-6 h-6" />
            <span className="font-bold text-xs uppercase">Produção</span>
        </button>

        <button
            onClick={() => setModo('carregamento')}
            className={`
                flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all
                ${modo === 'carregamento' 
                    ? 'bg-green-600 border-green-400 text-white shadow-lg shadow-green-900/50' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 opacity-50'}
            `}
        >
            <Truck className="w-6 h-6" />
            <span className="font-bold text-xs uppercase">Expedição</span>
        </button>
      </div>

      {/* SELETOR DE ESTAÇÃO (PRODUÇÃO) */}
      {modo === 'producao' && (
          <div className="px-4 pb-2 shrink-0">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {[
                    { id: 'corte', label: 'Corte', icon: '✂️' },
                    { id: 'lapidacao', label: 'Lapidação', icon: '⚙️' },
                    { id: 'tempera', label: 'Forno', icon: '🔥' },
                ].map(st => (
                    <button
                        key={st.id}
                        onClick={() => setEstacaoAtual(st.id as Estacao)}
                        className={`
                            whitespace-nowrap px-4 py-3 rounded-lg text-sm font-bold border transition-all flex items-center gap-2 flex-1 justify-center
                            ${estacaoAtual === st.id
                                ? 'bg-slate-100 text-slate-900 border-white'
                                : 'bg-slate-800 text-slate-400 border-slate-700'}
                        `}
                    >
                        <span>{st.icon}</span> {st.label}
                    </button>
                ))}
            </div>
          </div>
      )}

      {/* ÁREA DE SCAN (CÂMERA OU MANUAL) */}
      <div className="flex-1 relative bg-black flex flex-col">
         
         {/* BOTÃO TOGGLE CAMERA/MANUAL */}
         <div className="absolute top-4 right-4 z-30">
            <button 
                onClick={() => setUsarCamera(!usarCamera)}
                className="bg-slate-800/80 backdrop-blur text-white p-3 rounded-full border border-slate-600 shadow-lg"
            >
                {usarCamera ? <Keyboard className="w-6 h-6" /> : <Camera className="w-6 h-6" />}
            </button>
         </div>

         {/* VISUALIZAÇÃO DA CÂMERA */}
         {usarCamera ? (
            <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-black">
                <div id="reader" className="w-full h-full object-cover"></div>
                {/* Overlay de Guia */}
                <div className="absolute inset-0 pointer-events-none border-[50px] border-black/50 z-10">
                    <div className="w-full h-full border-2 border-red-500/50 relative">
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 animate-pulse shadow-[0_0_10px_red]"></div>
                    </div>
                </div>
                <div className="absolute bottom-10 left-0 right-0 text-center z-20">
                     <p className="bg-black/60 text-white px-4 py-2 rounded-full inline-block text-sm font-bold">
                        Aponte para o Código QR ou Barras
                     </p>
                </div>
            </div>
         ) : (
            // MODO MANUAL (INPUT)
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 p-6">
                <div className="w-full max-w-sm relative z-20">
                    <label className="block text-center text-slate-400 text-sm mb-4 uppercase tracking-widest font-bold">
                        Digitação Manual / Pistola USB
                    </label>
                    
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input 
                            ref={inputRef}
                            type="text" 
                            value={codigoInput}
                            onChange={(e) => setCodigoInput(e.target.value)}
                            className="flex-1 bg-slate-800 border-2 border-slate-700 focus:border-yellow-500 text-white text-xl font-mono text-center p-4 rounded-xl outline-none transition-colors"
                            placeholder="DIGITE O CÓDIGO..."
                            autoFocus
                        />
                        <button 
                            type="submit"
                            className="bg-yellow-500 hover:bg-yellow-400 text-black p-4 rounded-xl font-bold transition-colors"
                        >
                            <Search className="w-6 h-6" />
                        </button>
                    </form>

                    <div className="mt-8 flex justify-center">
                        <button 
                            onClick={() => setUsarCamera(true)}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors border border-slate-700 px-6 py-3 rounded-full"
                        >
                            <Camera className="w-5 h-5" />
                            <span>Ativar Câmera</span>
                        </button>
                    </div>
                </div>
            </div>
         )}
      </div>

      {/* RODAPÉ COM ÚLTIMO STATUS */}
      {ultimoBip && !usarCamera && (
        <div className="bg-slate-900 border-t border-slate-800 p-4 shrink-0">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-green-900/30 text-green-500 flex items-center justify-center border border-green-900/50">
                    <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Último Registro</p>
                    <p className="text-white font-bold text-sm">{ultimoBip.id}</p>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}