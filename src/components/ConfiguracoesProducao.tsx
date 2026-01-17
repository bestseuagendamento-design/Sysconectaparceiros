import React, { useState } from 'react';
import { ArrowLeft, Settings, CheckCircle, AlertCircle } from 'lucide-react';

interface ConfiguracoesProducaoProps {
  orcamento: any;
  onVoltar: () => void;
  onGerarLayout: (config: any) => void;
}

export function ConfiguracoesProducao({ orcamento, onVoltar, onGerarLayout }: ConfiguracoesProducaoProps) {
  const [configuracao, setConfiguracao] = useState({
    larguraChapa: '3210',
    alturaChapa: '2250',
    folgaCorte: '5',
    permitirRotacao: true,
    priorizarReaproveitamento: true,
    estrategiaProducao: 'imediata',
    dataProgramada: '',
    turno: 'manha'
  });

  // Calcular totais do orçamento
  const totalPecas = orcamento.itens?.length || 0;
  const areaTotal = orcamento.itens?.reduce((sum: number, item: any) => sum + parseFloat(item.area || 0), 0).toFixed(4);

  const handleSubmit = () => {
    // Criar ID único de produção
    const idProducao = `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const projetoProducao = {
      id: idProducao,
      orcamentoId: orcamento.id,
      cliente: orcamento.clienteNome,
      dataAprovacao: new Date().toISOString(),
      configuracao: configuracao,
      status: 'aguardando_layout',
      itens: orcamento.itens
    };

    // Salvar no localStorage
    const projetos = JSON.parse(localStorage.getItem('projetosProducao') || '[]');
    projetos.push(projetoProducao);
    localStorage.setItem('projetosProducao', JSON.stringify(projetos));

    onGerarLayout(projetoProducao);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onVoltar}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para orçamento
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl text-neutral-900">Configurações de Produção</h1>
              <p className="text-neutral-600">Configure os parâmetros antes da otimização de chapa</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Coluna Esquerda - Dados Herdados */}
          <div className="col-span-2 space-y-6">
            {/* Bloco 1 - Dados Herdados */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h2 className="text-xl text-neutral-900">Dados do Orçamento Aprovado</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-600 mb-1">Cliente</p>
                  <p className="text-neutral-900 font-bold">{orcamento.clienteNome}</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-600 mb-1">Número do Orçamento</p>
                  <p className="text-neutral-900 font-bold">{orcamento.id}</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-600 mb-1">Quantidade de Peças</p>
                  <p className="text-neutral-900 font-bold text-2xl">{totalPecas}</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-600 mb-1">Área Total</p>
                  <p className="text-neutral-900 font-bold text-2xl">{areaTotal}m²</p>
                </div>
              </div>
            </div>

            {/* Bloco 2 - Parâmetros de Chapa */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h2 className="text-xl text-neutral-900 mb-6">📐 Parâmetros de Chapa</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-700 text-sm mb-2">Largura da Chapa (mm)</label>
                    <input
                      type="number"
                      value={configuracao.larguraChapa}
                      onChange={(e) => setConfiguracao({ ...configuracao, larguraChapa: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 text-sm mb-2">Altura da Chapa (mm)</label>
                    <input
                      type="number"
                      value={configuracao.alturaChapa}
                      onChange={(e) => setConfiguracao({ ...configuracao, alturaChapa: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-700 text-sm mb-2">Folga de Corte - Kerf (mm)</label>
                  <input
                    type="number"
                    value={configuracao.folgaCorte}
                    onChange={(e) => setConfiguracao({ ...configuracao, folgaCorte: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-neutral-900"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Espaçamento entre peças durante o corte</p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configuracao.permitirRotacao}
                      onChange={(e) => setConfiguracao({ ...configuracao, permitirRotacao: e.target.checked })}
                      className="w-5 h-5 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <p className="text-neutral-900 font-medium">🔄 Permitir rotação das peças</p>
                      <p className="text-sm text-neutral-600">Otimiza o aproveitamento girando peças em 90°</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configuracao.priorizarReaproveitamento}
                      onChange={(e) => setConfiguracao({ ...configuracao, priorizarReaproveitamento: e.target.checked })}
                      className="w-5 h-5 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <p className="text-neutral-900 font-medium">♻️ Priorizar reaproveitamento</p>
                      <p className="text-sm text-neutral-600">Busca peças de outros orçamentos aprovados</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Bloco 3 - Estratégia de Produção */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h2 className="text-xl text-neutral-900 mb-6">🔧 Estratégia de Produção</h2>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border-2 border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                  <input
                    type="radio"
                    name="estrategia"
                    value="imediata"
                    checked={configuracao.estrategiaProducao === 'imediata'}
                    onChange={(e) => setConfiguracao({ ...configuracao, estrategiaProducao: e.target.value })}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div>
                    <p className="text-neutral-900 font-medium">⚡ Produção imediata</p>
                    <p className="text-sm text-neutral-600">Inicia processo de corte assim que possível</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                  <input
                    type="radio"
                    name="estrategia"
                    value="agrupar"
                    checked={configuracao.estrategiaProducao === 'agrupar'}
                    onChange={(e) => setConfiguracao({ ...configuracao, estrategiaProducao: e.target.value })}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div>
                    <p className="text-neutral-900 font-medium">📦 Agrupar com outros pedidos do dia</p>
                    <p className="text-sm text-neutral-600">Otimiza chapas com múltiplos orçamentos</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                  <input
                    type="radio"
                    name="estrategia"
                    value="programada"
                    checked={configuracao.estrategiaProducao === 'programada'}
                    onChange={(e) => setConfiguracao({ ...configuracao, estrategiaProducao: e.target.value })}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div>
                    <p className="text-neutral-900 font-medium">📅 Produção programada</p>
                    <p className="text-sm text-neutral-600">Agendar para data e turno específicos</p>
                  </div>
                </label>

                {configuracao.estrategiaProducao === 'programada' && (
                  <div className="ml-8 mt-4 grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                    <div>
                      <label className="block text-neutral-700 text-sm mb-2">Data</label>
                      <input
                        type="date"
                        value={configuracao.dataProgramada}
                        onChange={(e) => setConfiguracao({ ...configuracao, dataProgramada: e.target.value })}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 text-sm mb-2">Turno</label>
                      <select
                        value={configuracao.turno}
                        onChange={(e) => setConfiguracao({ ...configuracao, turno: e.target.value })}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-neutral-900"
                      >
                        <option value="manha">Manhã (06:00 - 14:00)</option>
                        <option value="tarde">Tarde (14:00 - 22:00)</option>
                        <option value="noite">Noite (22:00 - 06:00)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Coluna Direita - Resumo */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white sticky top-8">
              <h3 className="text-lg mb-6">📊 Resumo da Configuração</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Dimensão da Chapa</p>
                  <p className="text-2xl font-bold">{configuracao.larguraChapa} × {configuracao.alturaChapa}mm</p>
                </div>

                <div className="pt-4 border-t border-blue-400">
                  <p className="text-blue-100 text-sm mb-1">Folga de Corte</p>
                  <p className="text-xl font-bold">{configuracao.folgaCorte}mm</p>
                </div>

                <div className="pt-4 border-t border-blue-400">
                  <p className="text-blue-100 text-sm mb-2">Otimizações</p>
                  <div className="space-y-2">
                    {configuracao.permitirRotacao && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Rotação habilitada</span>
                      </div>
                    )}
                    {configuracao.priorizarReaproveitamento && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Reaproveitamento ativo</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-blue-400">
                  <p className="text-blue-100 text-sm mb-1">Estratégia</p>
                  <p className="font-bold">
                    {configuracao.estrategiaProducao === 'imediata' && '⚡ Imediata'}
                    {configuracao.estrategiaProducao === 'agrupar' && '📦 Agrupada'}
                    {configuracao.estrategiaProducao === 'programada' && '📅 Programada'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full mt-8 px-6 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-bold text-lg shadow-lg"
              >
                ▶️ Gerar Layout de Reaproveitamento
              </button>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-900 font-bold mb-1">Atenção</p>
                  <p className="text-xs text-yellow-800">
                    Após gerar o layout, você poderá visualizar e aprovar antes da geração dos arquivos DXF/NC.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
