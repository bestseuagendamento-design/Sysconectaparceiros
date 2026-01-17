import { useState } from 'react';
import { X, Camera, Check, Ruler, Zap } from 'lucide-react';

interface OrcamentoPorFotoProps {
  onClose: () => void;
}

export function OrcamentoPorFoto({ onClose }: OrcamentoPorFotoProps) {
  const [etapa, setEtapa] = useState<'camera' | 'medicao' | 'formulario' | 'resultado'>('camera');
  const [fotoCapturada, setFotoCapturada] = useState(false);
  const [medidas, setMedidas] = useState({ largura: '', altura: '' });
  const [orcamentoGerado, setOrcamentoGerado] = useState<any>(null);

  const capturarFoto = () => {
    setFotoCapturada(true);
    setTimeout(() => {
      // Simular leitura automática de medidas
      setMedidas({ largura: '1.00', altura: '1.20' });
      setEtapa('medicao');
    }, 1500);
  };

  const confirmarMedidas = () => {
    setEtapa('formulario');
  };

  const gerarOrcamento = () => {
    const largura = parseFloat(medidas.largura);
    const altura = parseFloat(medidas.altura);
    const area = largura * altura;

    const orcamento = {
      medidas: {
        largura,
        altura,
        area,
      },
      produto: 'Janela Linha Suprema 2 Folhas',
      material: 'Alumínio Branco',
      valorM2: 850.00,
      valorTotal: area * 850.00,
      prazoEntrega: '15 dias úteis',
    };

    setOrcamentoGerado(orcamento);
    setEtapa('resultado');
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border-2 border-cyan-700 rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-900 to-cyan-800 p-6 border-b border-cyan-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan-700/30 rounded-xl flex items-center justify-center">
                <Camera className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-white text-2xl font-bold">📷 Orçamento por Foto</h2>
                <p className="text-cyan-300 text-sm">
                  {etapa === 'camera' && 'Tire uma foto do vão para medir'}
                  {etapa === 'medicao' && 'Medidas detectadas automaticamente'}
                  {etapa === 'formulario' && 'Complete os dados do orçamento'}
                  {etapa === 'resultado' && 'Orçamento gerado com sucesso'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-cyan-300 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* ETAPA 1: Câmera */}
          {etapa === 'camera' && (
            <div className="space-y-6">
              <div className="bg-neutral-800/50 border-2 border-cyan-700 rounded-xl p-8 text-center">
                <Camera className="w-20 h-20 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-white font-bold text-2xl mb-3">
                  📸 Capture o Vão da Janela/Porta
                </h3>
                <p className="text-neutral-400 mb-6">
                  Posicione a câmera de frente para o vão e tire uma foto clara.
                  O sistema irá detectar automaticamente as medidas.
                </p>

                {/* Área da Câmera Simulada */}
                <div className="bg-black rounded-xl border-2 border-cyan-700 h-96 flex items-center justify-center mb-6 relative overflow-hidden">
                  {!fotoCapturada ? (
                    <>
                      {/* Guias de alinhamento */}
                      <div className="absolute inset-0">
                        <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-500/50"></div>
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-500/50"></div>
                        <div className="absolute top-1/4 left-1/4 w-4 h-4 border-t-2 border-l-2 border-cyan-500"></div>
                        <div className="absolute top-1/4 right-1/4 w-4 h-4 border-t-2 border-r-2 border-cyan-500"></div>
                        <div className="absolute bottom-1/4 left-1/4 w-4 h-4 border-b-2 border-l-2 border-cyan-500"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-4 h-4 border-b-2 border-r-2 border-cyan-500"></div>
                      </div>
                      <Camera className="w-32 h-32 text-cyan-700" />
                    </>
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="text-cyan-400 text-2xl animate-pulse">📸 Analisando foto...</div>
                    </div>
                  )}
                </div>

                <button
                  onClick={capturarFoto}
                  disabled={fotoCapturada}
                  className="w-full py-4 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg font-bold transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Camera className="w-6 h-6" />
                  {fotoCapturada ? 'PROCESSANDO...' : 'CAPTURAR FOTO'}
                </button>
              </div>

              <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-4">
                <p className="text-orange-300 text-sm">
                  💡 <strong>Dica:</strong> Para quando você esqueceu a trena! O sistema usa inteligência artificial para estimar as medidas baseado em referências da foto.
                </p>
              </div>
            </div>
          )}

          {/* ETAPA 2: Medição Detectada */}
          {etapa === 'medicao' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-2 border-cyan-600 rounded-xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-cyan-600/30 rounded-xl flex items-center justify-center">
                    <Zap className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-2xl mb-2">🎯 Medidas Detectadas!</h3>
                    <p className="text-cyan-300">O sistema analisou a foto e detectou as seguintes dimensões:</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-black/30 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Ruler className="w-5 h-5 text-cyan-400" />
                      <span className="text-cyan-400 font-semibold">Largura</span>
                    </div>
                    <div className="text-white text-4xl font-bold">{medidas.largura}m</div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Ruler className="w-5 h-5 text-cyan-400" />
                      <span className="text-cyan-400 font-semibold">Altura</span>
                    </div>
                    <div className="text-white text-4xl font-bold">{medidas.altura}m</div>
                  </div>
                </div>

                <div className="mt-6 bg-orange-900/20 border border-orange-700 rounded-lg p-4">
                  <p className="text-orange-300 text-sm">
                    ⚠️ <strong>Atenção:</strong> Essas são medidas estimadas. Você pode ajustá-las na próxima etapa se necessário.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setEtapa('camera')}
                  className="py-4 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-bold transition-all text-lg"
                >
                  ← TIRAR NOVA FOTO
                </button>
                <button
                  onClick={confirmarMedidas}
                  className="py-4 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg font-bold transition-all text-lg"
                >
                  CONTINUAR →
                </button>
              </div>
            </div>
          )}

          {/* ETAPA 3: Formulário */}
          {etapa === 'formulario' && (
            <div className="space-y-6">
              <div className="bg-neutral-800/50 border-2 border-cyan-700 rounded-xl p-6">
                <h3 className="text-cyan-400 font-bold text-lg mb-4 flex items-center gap-2">
                  <Ruler className="w-5 h-5" />
                  Ajustar Medidas (se necessário)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cyan-400 text-sm mb-2">Largura (metros)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={medidas.largura}
                      onChange={(e) => setMedidas({ ...medidas, largura: e.target.value })}
                      className="w-full bg-neutral-900 border border-cyan-800 rounded-lg px-4 py-3 text-white text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-cyan-700"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-400 text-sm mb-2">Altura (metros)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={medidas.altura}
                      onChange={(e) => setMedidas({ ...medidas, altura: e.target.value })}
                      className="w-full bg-neutral-900 border border-cyan-800 rounded-lg px-4 py-3 text-white text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-cyan-700"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-neutral-800/50 border-2 border-cyan-700 rounded-xl p-6">
                <h3 className="text-cyan-400 font-bold text-lg mb-4">Tipo de Produto</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="bg-cyan-700 hover:bg-cyan-600 text-white py-4 rounded-lg font-semibold transition-all">
                    Janela 2 Folhas
                  </button>
                  <button className="bg-neutral-700 hover:bg-neutral-600 text-white py-4 rounded-lg font-semibold transition-all">
                    Janela 4 Folhas
                  </button>
                  <button className="bg-neutral-700 hover:bg-neutral-600 text-white py-4 rounded-lg font-semibold transition-all">
                    Porta de Vidro
                  </button>
                  <button className="bg-neutral-700 hover:bg-neutral-600 text-white py-4 rounded-lg font-semibold transition-all">
                    Box Banheiro
                  </button>
                </div>
              </div>

              <div className="bg-neutral-800/50 border-2 border-cyan-700 rounded-xl p-6">
                <h3 className="text-cyan-400 font-bold text-lg mb-4">Material</h3>
                <div className="grid grid-cols-3 gap-4">
                  <button className="bg-cyan-700 hover:bg-cyan-600 text-white py-4 rounded-lg font-semibold transition-all">
                    Alumínio Branco
                  </button>
                  <button className="bg-neutral-700 hover:bg-neutral-600 text-white py-4 rounded-lg font-semibold transition-all">
                    Alumínio Preto
                  </button>
                  <button className="bg-neutral-700 hover:bg-neutral-600 text-white py-4 rounded-lg font-semibold transition-all">
                    Alumínio Bronze
                  </button>
                </div>
              </div>

              <button
                onClick={gerarOrcamento}
                className="w-full py-5 bg-green-700 hover:bg-green-600 text-white rounded-lg font-bold transition-all text-xl flex items-center justify-center gap-2"
              >
                <Zap className="w-6 h-6" />
                GERAR ORÇAMENTO
              </button>
            </div>
          )}

          {/* ETAPA 4: Resultado */}
          {etapa === 'resultado' && orcamentoGerado && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-2 border-green-600 rounded-xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-green-600/30 rounded-xl flex items-center justify-center">
                    <Check className="w-8 h-8 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-2xl mb-2">✅ Orçamento Gerado!</h3>
                    <p className="text-green-300">Baseado nas medidas capturadas por foto</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-green-400 text-sm mb-1">Produto</div>
                    <div className="text-white font-semibold">{orcamentoGerado.produto}</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-green-400 text-sm mb-1">Material</div>
                    <div className="text-white font-semibold">{orcamentoGerado.material}</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-green-400 text-sm mb-1">Medidas</div>
                    <div className="text-white font-semibold">
                      {orcamentoGerado.medidas.largura}m x {orcamentoGerado.medidas.altura}m
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-green-400 text-sm mb-1">Área Total</div>
                    <div className="text-white font-semibold">{orcamentoGerado.medidas.area.toFixed(2)}m²</div>
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-neutral-400">Valor por m²:</span>
                    <span className="text-white font-semibold">R$ {orcamentoGerado.valorM2.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-neutral-400">Área ({orcamentoGerado.medidas.area.toFixed(2)}m²):</span>
                    <span className="text-white font-semibold">x {orcamentoGerado.medidas.area.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-green-700 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="text-green-400 text-sm mb-1">Valor Total</div>
                      <div className="text-white text-4xl font-bold">R$ {orcamentoGerado.valorTotal.toFixed(2)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 text-sm mb-1">Prazo de Entrega</div>
                      <div className="text-white text-xl font-semibold">{orcamentoGerado.prazoEntrega}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setEtapa('camera');
                    setFotoCapturada(false);
                    setOrcamentoGerado(null);
                  }}
                  className="py-4 bg-orange-700 hover:bg-orange-600 text-white rounded-lg font-bold transition-all text-lg"
                >
                  FAZER NOVO ORÇAMENTO
                </button>
                <button
                  onClick={() => {
                    alert('Orçamento salvo com sucesso!');
                    onClose();
                  }}
                  className="py-4 bg-green-700 hover:bg-green-600 text-white rounded-lg font-bold transition-all text-lg flex items-center justify-center gap-2"
                >
                  <Check className="w-6 h-6" />
                  SALVAR ORÇAMENTO
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
