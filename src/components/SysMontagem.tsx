import { useState } from 'react';
import { X, Wrench, Ruler, Target, Play, CheckCircle, ArrowLeft } from 'lucide-react';

interface SysMontagemProps {
  onClose: () => void;
}

export function SysMontagem({ onClose }: SysMontagemProps) {
  const [telaAtiva, setTelaAtiva] = useState<'home' | 'passos'>('home');
  const [tipologiaSelecionada, setTipologiaSelecionada] = useState<any>(null);
  const [showModalOk, setShowModalOk] = useState(false);
  const [checklist, setChecklist] = useState({
    nivelado: false,
    esquadrejado: false,
    vedado: false,
    testado: false
  });

  // Categorias de tipologias
  const tipologias = [
    { id: 'box-banheiro', nome: 'Box de banheiro', icone: '🚿', cor: 'from-blue-600 to-blue-700' },
    { id: 'porta-correr', nome: 'Porta de correr', icone: '🚪', cor: 'from-teal-600 to-teal-700' },
    { id: 'porta-abrir', nome: 'Porta de abrir', icone: '🚪', cor: 'from-cyan-600 to-cyan-700' },
    { id: 'janela-correr', nome: 'Janela de correr', icone: '🪟', cor: 'from-green-600 to-green-700' },
    { id: 'janela-maximair', nome: 'Janela maxim-ar', icone: '🪟', cor: 'from-emerald-600 to-emerald-700' },
    { id: 'janela-basculante', nome: 'Janela basculante', icone: '🪟', cor: 'from-lime-600 to-lime-700' },
    { id: 'janela-projetante', nome: 'Janela projetante', icone: '🪟', cor: 'from-yellow-600 to-yellow-700' },
    { id: 'pivotante', nome: 'Pivotante', icone: '🚪', cor: 'from-orange-600 to-orange-700' },
    { id: 'guarda-corpo', nome: 'Guarda-corpo', icone: '🛡️', cor: 'from-red-600 to-red-700' },
    { id: 'fachada', nome: 'Fachada', icone: '🏢', cor: 'from-pink-600 to-pink-700' },
    { id: 'cobertura', nome: 'Cobertura', icone: '☂️', cor: 'from-purple-600 to-purple-700' }
  ];

  const handleSelecionarTipologia = (tipologia: any) => {
    setTipologiaSelecionada(tipologia);
    setTelaAtiva('passos');
    setChecklist({
      nivelado: false,
      esquadrejado: false,
      vedado: false,
      testado: false
    });
  };

  const handleConcluir = () => {
    setShowModalOk(true);
  };

  // FRAME 1 - SYSMONTAGEM-HOME
  const renderHome = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        {tipologias.map((tipologia) => (
          <button
            key={tipologia.id}
            id={`card-sysmontagem-${tipologia.id}`}
            onClick={() => handleSelecionarTipologia(tipologia)}
            className="group bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 hover:border-teal-500/50 transition-all"
          >
            <div className={`w-16 h-16 bg-gradient-to-br ${tipologia.cor} rounded-2xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform`}>
              {tipologia.icone}
            </div>
            <h3 className="text-white font-bold text-lg mb-2">{tipologia.nome}</h3>
            <p className="text-neutral-400 text-sm mb-4">Guia completo de instalação</p>
            <div className="text-teal-400 text-sm font-semibold group-hover:text-teal-300">
              Ver passo a passo →
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // FRAME 2 - SYSMONTAGEM-PASSOS
  const renderPassos = () => {
    if (!tipologiaSelecionada) return null;

    return (
      <div className="space-y-6">
        <button
          id="btn-sysmontagem-voltar"
          onClick={() => setTelaAtiva('home')}
          className="text-teal-400 hover:text-teal-300 text-sm flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para categorias
        </button>

        <div className={`bg-gradient-to-r ${tipologiaSelecionada.cor} bg-opacity-20 border border-teal-700/50 rounded-2xl p-6`}>
          <div className="flex items-center gap-4">
            <div className="text-6xl">{tipologiaSelecionada.icone}</div>
            <div>
              <h2 className="text-white text-2xl font-black mb-2">{tipologiaSelecionada.nome}</h2>
              <p className="text-neutral-300">Guia completo de instalação passo a passo</p>
            </div>
          </div>
        </div>

        {/* PASSO 1 - Ferramentas */}
        <div id="passo1-ferramentas" className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Wrench className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="text-white font-bold text-xl">Passo 1 — Ferramentas Necessárias</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {[
              { nome: 'Furadeira', icone: '🔨' },
              { nome: 'Trena', icone: '📏' },
              { nome: 'Nível', icone: '📐' },
              { nome: 'Parafusadeira', icone: '🔧' },
              { nome: 'Chave Phillips', icone: '🪛' },
              { nome: 'Silicone estrutural', icone: '💧' },
              { nome: 'Esquadro', icone: '📐' },
              { nome: 'Martelo de borracha', icone: '🔨' },
              { nome: 'EPI completo', icone: '🦺' }
            ].map((ferramenta, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                <span className="text-2xl">{ferramenta.icone}</span>
                <span className="text-white font-medium">{ferramenta.nome}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PASSO 2 - Medidas Ideais */}
        <div id="passo2-2d" className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Ruler className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-white font-bold text-xl">Passo 2 — Medidas Ideais (2D)</h3>
          </div>
          
          <div className="bg-neutral-800/50 rounded-xl p-8 border-2 border-dashed border-neutral-700">
            <div className="aspect-video bg-neutral-900 rounded-lg flex items-center justify-center border border-neutral-700">
              <div className="text-center">
                <div className="text-neutral-600 text-6xl mb-4">📐</div>
                <p className="text-neutral-400 font-semibold">Imagem 2D - Diagrama de Medidas</p>
                <p className="text-neutral-600 text-sm mt-2">Visualização técnica com cotas</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="bg-neutral-900/50 rounded-lg p-3">
                <div className="text-neutral-500 text-xs mb-1">Altura Padrão</div>
                <div className="text-white font-bold">2100mm</div>
              </div>
              <div className="bg-neutral-900/50 rounded-lg p-3">
                <div className="text-neutral-500 text-xs mb-1">Largura Padrão</div>
                <div className="text-white font-bold">900mm</div>
              </div>
              <div className="bg-neutral-900/50 rounded-lg p-3">
                <div className="text-neutral-500 text-xs mb-1">Espessura Vidro</div>
                <div className="text-white font-bold">8mm</div>
              </div>
            </div>
          </div>
        </div>

        {/* PASSO 3 - Pontos de Furação */}
        <div id="passo3-furacoes" className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-white font-bold text-xl">Passo 3 — Pontos de Furação</h3>
          </div>
          
          <div className="bg-neutral-800/50 rounded-xl p-8 border-2 border-dashed border-neutral-700">
            <div className="aspect-video bg-neutral-900 rounded-lg flex items-center justify-center border border-neutral-700">
              <div className="text-center">
                <div className="text-neutral-600 text-6xl mb-4">🎯</div>
                <p className="text-neutral-400 font-semibold">Imagem com Marcações de Furação</p>
                <p className="text-neutral-600 text-sm mt-2">Pontos exatos para fixação</p>
              </div>
            </div>
            <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-400 text-sm font-semibold">⚠️ Atenção:</p>
              <p className="text-neutral-300 text-sm mt-1">
                Sempre verifique a estrutura antes de furar. Use buchas apropriadas para o tipo de parede.
              </p>
            </div>
          </div>
        </div>

        {/* PASSO 4 - Sequência de Montagem */}
        <div id="passo4-video" className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Play className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-white font-bold text-xl">Passo 4 — Sequência de Montagem</h3>
          </div>
          
          <div className="bg-neutral-800/50 rounded-xl p-8 border-2 border-dashed border-neutral-700">
            <div className="aspect-video bg-neutral-900 rounded-lg flex items-center justify-center border border-neutral-700">
              <button className="w-20 h-20 bg-purple-600 hover:bg-purple-500 rounded-full flex items-center justify-center transition-all group">
                <Play className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform" />
              </button>
            </div>
            <div className="mt-4 text-center">
              <p className="text-neutral-400 font-semibold">Vídeo Tutorial - Montagem Completa</p>
              <p className="text-neutral-600 text-sm mt-1">Duração: 8min 32s</p>
            </div>
          </div>
        </div>

        {/* PASSO 5 - Checklist Final */}
        <div id="passo5-checklist" className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-white font-bold text-xl">Passo 5 — Checklist Final</h3>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center gap-4 p-4 bg-neutral-800/50 rounded-lg cursor-pointer hover:bg-neutral-800 transition-all">
              <input
                type="checkbox"
                checked={checklist.nivelado}
                onChange={(e) => setChecklist({...checklist, nivelado: e.target.checked})}
                className="w-5 h-5 rounded border-neutral-600 bg-neutral-700 text-green-600 focus:ring-green-500"
              />
              <div className="flex-1">
                <div className="text-white font-semibold">Nivelado</div>
                <div className="text-neutral-400 text-sm">Verificar com nível de bolha</div>
              </div>
            </label>

            <label className="flex items-center gap-4 p-4 bg-neutral-800/50 rounded-lg cursor-pointer hover:bg-neutral-800 transition-all">
              <input
                type="checkbox"
                checked={checklist.esquadrejado}
                onChange={(e) => setChecklist({...checklist, esquadrejado: e.target.checked})}
                className="w-5 h-5 rounded border-neutral-600 bg-neutral-700 text-green-600 focus:ring-green-500"
              />
              <div className="flex-1">
                <div className="text-white font-semibold">Esquadrejado</div>
                <div className="text-neutral-400 text-sm">Verificar ângulos de 90° com esquadro</div>
              </div>
            </label>

            <label className="flex items-center gap-4 p-4 bg-neutral-800/50 rounded-lg cursor-pointer hover:bg-neutral-800 transition-all">
              <input
                type="checkbox"
                checked={checklist.vedado}
                onChange={(e) => setChecklist({...checklist, vedado: e.target.checked})}
                className="w-5 h-5 rounded border-neutral-600 bg-neutral-700 text-green-600 focus:ring-green-500"
              />
              <div className="flex-1">
                <div className="text-white font-semibold">Vedado Corretamente</div>
                <div className="text-neutral-400 text-sm">Aplicar silicone em todos os pontos necessários</div>
              </div>
            </label>

            <label className="flex items-center gap-4 p-4 bg-neutral-800/50 rounded-lg cursor-pointer hover:bg-neutral-800 transition-all">
              <input
                type="checkbox"
                checked={checklist.testado}
                onChange={(e) => setChecklist({...checklist, testado: e.target.checked})}
                className="w-5 h-5 rounded border-neutral-600 bg-neutral-700 text-green-600 focus:ring-green-500"
              />
              <div className="flex-1">
                <div className="text-white font-semibold">Testado</div>
                <div className="text-neutral-400 text-sm">Testar abertura, fechamento e fixação</div>
              </div>
            </label>
          </div>
        </div>

        {/* Botão Concluir */}
        <div className="flex gap-4">
          <button
            id="btn-sysmontagem-concluir"
            onClick={handleConcluir}
            disabled={!Object.values(checklist).every(v => v)}
            className="flex-1 py-4 bg-gradient-to-r from-green-600 to-green-700 rounded-xl text-white font-bold text-lg hover:from-green-500 hover:to-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <CheckCircle className="w-6 h-6" />
            Marcar Instalação Concluída
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-7xl max-h-[95vh] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 bg-gradient-to-r from-teal-900/20 to-cyan-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-600 to-cyan-700 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/50">
                <Wrench className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-white text-2xl font-black">SYSMONTAGEM – Guia de Instalação</h2>
                <p className="text-neutral-400 text-sm">Aprenda passo a passo a instalar qualquer tipologia</p>
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

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-6">
          {telaAtiva === 'home' && renderHome()}
          {telaAtiva === 'passos' && renderPassos()}
        </div>
      </div>

      {/* MODAL - SYSMONTAGEM-OK */}
      {showModalOk && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-white text-xl font-bold mb-2">Instalação registrada com sucesso!</h3>
              <p className="text-neutral-400 mb-6">O registro foi salvo no sistema</p>
              <button
                onClick={() => {
                  setShowModalOk(false);
                  setTelaAtiva('home');
                }}
                className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-lg text-white font-bold transition-all"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
