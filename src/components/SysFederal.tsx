import { useState } from 'react';
import { X, FileText, Building2, MapPin, TrendingUp, Database, DollarSign, BarChart3, Globe } from 'lucide-react';

interface SysFederalProps {
  onClose: () => void;
}

export function SysFederal({ onClose }: SysFederalProps) {
  const [telaAtiva, setTelaAtiva] = useState<'home' | 'licitacoes-vidro' | 'licitacoes-esquadrias' | 'obras-mapa' | 'dados-economicos'>('home');

  // FRAME 1 - SYSFEDERAL-HOME
  const renderHome = () => (
    <div className="grid grid-cols-2 gap-6">
      {/* Card 1 - Licitações Vidro */}
      <button
        id="card-sysfederal-licitacoes-vidro"
        onClick={() => setTelaAtiva('licitacoes-vidro')}
        className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-2 border-blue-700/50 rounded-2xl p-8 hover:border-blue-500 transition-all group text-left"
      >
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-white text-2xl font-black mb-2">Licitações Abertas de Vidro</h3>
        <p className="text-blue-300 mb-4">Consulta automática em portais governamentais</p>
        <div className="flex items-center gap-2 text-blue-400">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold">128 licitações ativas</span>
        </div>
      </button>

      {/* Card 2 - Licitações Esquadrias */}
      <button
        id="card-sysfederal-licitacoes-esquadrias"
        onClick={() => setTelaAtiva('licitacoes-esquadrias')}
        className="bg-gradient-to-br from-teal-900/30 to-teal-800/30 border-2 border-teal-700/50 rounded-2xl p-8 hover:border-teal-500 transition-all group text-left"
      >
        <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-white text-2xl font-black mb-2">Licitações de Esquadrias</h3>
        <p className="text-teal-300 mb-4">Alumínio, PVC e estruturas metálicas</p>
        <div className="flex items-center gap-2 text-teal-400">
          <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold">94 licitações ativas</span>
        </div>
      </button>

      {/* Card 3 - Obras IBGE */}
      <button
        id="card-sysfederal-obras"
        onClick={() => setTelaAtiva('obras-mapa')}
        className="bg-gradient-to-br from-orange-900/30 to-orange-800/30 border-2 border-orange-700/50 rounded-2xl p-8 hover:border-orange-500 transition-all group text-left"
      >
        <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <MapPin className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-white text-2xl font-black mb-2">Obras Iniciando (IBGE)</h3>
        <p className="text-orange-300 mb-4">Mapa nacional com obras detectadas</p>
        <div className="flex items-center gap-2 text-orange-400">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold">1.247 obras mapeadas</span>
        </div>
      </button>

      {/* Card 4 - Dados Econômicos */}
      <button
        id="card-sysfederal-dados"
        onClick={() => setTelaAtiva('dados-economicos')}
        className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-2 border-purple-700/50 rounded-2xl p-8 hover:border-purple-500 transition-all group text-left"
      >
        <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <TrendingUp className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-white text-2xl font-black mb-2">Dados Econômicos</h3>
        <p className="text-purple-300 mb-4">Preços, importação e consumo por região</p>
        <div className="flex items-center gap-2 text-purple-400">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold">Atualizado hoje</span>
        </div>
      </button>
    </div>
  );

  // FRAME 2 - SYSFEDERAL-LICITACOES-VIDRO
  const renderLicitacoesVidro = () => (
    <div className="space-y-6">
      <button
        onClick={() => setTelaAtiva('home')}
        className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2"
      >
        ← Voltar
      </button>

      <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 border border-blue-700/50 rounded-2xl p-6">
        <h2 className="text-white text-2xl font-black mb-2">Licitações Abertas de Vidro</h2>
        <p className="text-blue-300">Dados extraídos automaticamente de portais oficiais</p>
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-800/50">
              <tr>
                <th className="text-left text-neutral-400 text-sm py-4 px-6">Nº Processo</th>
                <th className="text-left text-neutral-400 text-sm py-4 px-6">Prefeitura</th>
                <th className="text-left text-neutral-400 text-sm py-4 px-6">Cidade / Estado</th>
                <th className="text-left text-neutral-400 text-sm py-4 px-6">Tipo de Vidro</th>
                <th className="text-center text-neutral-400 text-sm py-4 px-6">Quantidade</th>
                <th className="text-right text-neutral-400 text-sm py-4 px-6">Valor Estimado</th>
                <th className="text-center text-neutral-400 text-sm py-4 px-6">Data Limite</th>
                <th className="text-center text-neutral-400 text-sm py-4 px-6">Ação</th>
              </tr>
            </thead>
            <tbody>
              {[
                { processo: '2024/0089-PMF', prefeitura: 'Prefeitura São Paulo', cidade: 'São Paulo / SP', tipo: 'Temperado 10mm', qtd: '850 m²', valor: 'R$ 450.000', data: '15/01/2025' },
                { processo: '2024/1245-GRJ', prefeitura: 'Gov. Rio de Janeiro', cidade: 'Rio de Janeiro / RJ', tipo: 'Laminado 8+8mm', qtd: '620 m²', valor: 'R$ 380.000', data: '20/01/2025' },
                { processo: '2024/0567-PMBH', prefeitura: 'Prefeitura BH', cidade: 'Belo Horizonte / MG', tipo: 'Insulado', qtd: '1200 m²', valor: 'R$ 890.000', data: '05/02/2025' },
                { processo: '2024/0923-COHAB', prefeitura: 'COHAB Curitiba', cidade: 'Curitiba / PR', tipo: 'Temperado 8mm', qtd: '450 m²', valor: 'R$ 280.000', data: '18/01/2025' },
                { processo: '2024/1567-SEOB', prefeitura: 'Sec. Obras Salvador', cidade: 'Salvador / BA', tipo: 'Laminado 10+10mm', qtd: '380 m²', valor: 'R$ 320.000', data: '25/01/2025' }
              ].map((lic, i) => (
                <tr key={i} className="border-t border-neutral-800 hover:bg-neutral-800/30 transition-all">
                  <td className="text-white text-sm py-4 px-6 font-mono">{lic.processo}</td>
                  <td className="text-white text-sm py-4 px-6">{lic.prefeitura}</td>
                  <td className="text-neutral-300 text-sm py-4 px-6">{lic.cidade}</td>
                  <td className="text-blue-400 text-sm py-4 px-6">{lic.tipo}</td>
                  <td className="text-center text-white text-sm py-4 px-6">{lic.qtd}</td>
                  <td className="text-right text-green-400 text-sm py-4 px-6 font-bold">{lic.valor}</td>
                  <td className="text-center text-neutral-400 text-sm py-4 px-6">{lic.data}</td>
                  <td className="text-center py-4 px-6">
                    <button
                      id="btn-sysfederal-proposta"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-semibold transition-all"
                    >
                      Gerar Proposta
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // FRAME 3 - SYSFEDERAL-LICITACOES-ESQUADRIAS
  const renderLicitacoesEsquadrias = () => (
    <div className="space-y-6">
      <button
        onClick={() => setTelaAtiva('home')}
        className="text-teal-400 hover:text-teal-300 text-sm flex items-center gap-2"
      >
        ← Voltar
      </button>

      <div className="bg-gradient-to-r from-teal-900/30 to-teal-800/30 border border-teal-700/50 rounded-2xl p-6">
        <h2 className="text-white text-2xl font-black mb-2">Licitações de Esquadrias</h2>
        <p className="text-teal-300">Alumínio, PVC e estruturas metálicas</p>
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-800/50">
              <tr>
                <th className="text-left text-neutral-400 text-sm py-4 px-6">Nº Processo</th>
                <th className="text-left text-neutral-400 text-sm py-4 px-6">Prefeitura</th>
                <th className="text-left text-neutral-400 text-sm py-4 px-6">Cidade / Estado</th>
                <th className="text-left text-neutral-400 text-sm py-4 px-6">Tipo</th>
                <th className="text-center text-neutral-400 text-sm py-4 px-6">Quantidade</th>
                <th className="text-right text-neutral-400 text-sm py-4 px-6">Valor Estimado</th>
                <th className="text-center text-neutral-400 text-sm py-4 px-6">Data Limite</th>
                <th className="text-center text-neutral-400 text-sm py-4 px-6">Ação</th>
              </tr>
            </thead>
            <tbody>
              {[
                { processo: '2024/2341-PMF', prefeitura: 'Prefeitura Fortaleza', cidade: 'Fortaleza / CE', tipo: 'Esquadrias Alumínio L25', qtd: '120 un', valor: 'R$ 680.000', data: '22/01/2025' },
                { processo: '2024/0891-PMPA', prefeitura: 'Prefeitura Porto Alegre', cidade: 'Porto Alegre / RS', tipo: 'Porta Correr PVC', qtd: '85 un', valor: 'R$ 420.000', data: '28/01/2025' },
                { processo: '2024/1567-PMREC', prefeitura: 'Prefeitura Recife', cidade: 'Recife / PE', tipo: 'Fachada Cortina', qtd: '1 projeto', valor: 'R$ 1.200.000', data: '10/02/2025' }
              ].map((lic, i) => (
                <tr key={i} className="border-t border-neutral-800 hover:bg-neutral-800/30 transition-all">
                  <td className="text-white text-sm py-4 px-6 font-mono">{lic.processo}</td>
                  <td className="text-white text-sm py-4 px-6">{lic.prefeitura}</td>
                  <td className="text-neutral-300 text-sm py-4 px-6">{lic.cidade}</td>
                  <td className="text-teal-400 text-sm py-4 px-6">{lic.tipo}</td>
                  <td className="text-center text-white text-sm py-4 px-6">{lic.qtd}</td>
                  <td className="text-right text-green-400 text-sm py-4 px-6 font-bold">{lic.valor}</td>
                  <td className="text-center text-neutral-400 text-sm py-4 px-6">{lic.data}</td>
                  <td className="text-center py-4 px-6">
                    <button className="px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg text-white text-sm font-semibold transition-all">
                      Gerar Proposta
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // FRAME 4 - SYSFEDERAL-OBRAS-MAPA
  const renderObrasMapa = () => (
    <div className="space-y-6">
      <button
        onClick={() => setTelaAtiva('home')}
        className="text-orange-400 hover:text-orange-300 text-sm flex items-center gap-2"
      >
        ← Voltar
      </button>

      <div className="bg-gradient-to-r from-orange-900/30 to-orange-800/30 border border-orange-700/50 rounded-2xl p-6">
        <h2 className="text-white text-2xl font-black mb-2">Obras Iniciando — Mapa Nacional</h2>
        <p className="text-orange-300">Dados do IBGE com obras detectadas automaticamente</p>
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
        <div className="aspect-video bg-neutral-800/50 rounded-xl flex items-center justify-center border-2 border-dashed border-neutral-700">
          <div className="text-center">
            <Globe className="w-20 h-20 text-orange-400 mx-auto mb-4" />
            <h3 className="text-white text-xl font-bold mb-2">Mapa Interativo do Brasil</h3>
            <p className="text-neutral-400 mb-4">1.247 obras detectadas em 26 estados + DF</p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-neutral-300">Em andamento (823)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-neutral-300">Aguardando (312)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                <span className="text-neutral-300">Concluídas (112)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas por Região */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { regiao: 'Sudeste', obras: 487, cor: 'blue' },
          { regiao: 'Sul', obras: 312, cor: 'green' },
          { regiao: 'Nordeste', obras: 234, cor: 'yellow' },
          { regiao: 'Centro-Oeste', obras: 134, cor: 'orange' },
          { regiao: 'Norte', obras: 80, cor: 'red' }
        ].map((reg, i) => (
          <div key={i} className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
            <div className="text-neutral-400 text-sm mb-2">{reg.regiao}</div>
            <div className="text-white text-2xl font-black">{reg.obras}</div>
            <div className="text-neutral-500 text-xs">obras</div>
          </div>
        ))}
      </div>
    </div>
  );

  // FRAME 5 - SYSFEDERAL-DADOS-ECONOMICOS
  const renderDadosEconomicos = () => (
    <div className="space-y-6">
      <button
        onClick={() => setTelaAtiva('home')}
        className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2"
      >
        ← Voltar
      </button>

      <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-700/50 rounded-2xl p-6">
        <h2 className="text-white text-2xl font-black mb-2">Dados Econômicos</h2>
        <p className="text-purple-300">Preços médios, importação e consumo por região</p>
      </div>

      {/* Preços Médios por Estado */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-400" />
          Preços Médios por Estado (m²)
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { estado: 'São Paulo', vidro: 'R$ 180', aluminio: 'R$ 85' },
            { estado: 'Rio de Janeiro', vidro: 'R$ 175', aluminio: 'R$ 82' },
            { estado: 'Minas Gerais', vidro: 'R$ 165', aluminio: 'R$ 78' },
            { estado: 'Paraná', vidro: 'R$ 170', aluminio: 'R$ 80' },
            { estado: 'Bahia', vidro: 'R$ 155', aluminio: 'R$ 72' },
            { estado: 'Ceará', vidro: 'R$ 150', aluminio: 'R$ 70' }
          ].map((est, i) => (
            <div key={i} className="bg-neutral-800/50 rounded-lg p-4">
              <div className="text-white font-semibold mb-2">{est.estado}</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-neutral-500 text-xs">Vidro</div>
                  <div className="text-green-400 font-bold">{est.vidro}</div>
                </div>
                <div>
                  <div className="text-neutral-500 text-xs">Alumínio</div>
                  <div className="text-blue-400 font-bold">{est.aluminio}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Importação */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" />
            Importação de Vidro (2024)
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Total Importado</span>
              <span className="text-white font-bold">18.450 toneladas</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Crescimento anual</span>
              <span className="text-green-400 font-bold">+12.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Principal origem</span>
              <span className="text-white font-bold">China (67%)</span>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-orange-400" />
            Importação de Alumínio (2024)
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Total Importado</span>
              <span className="text-white font-bold">32.890 toneladas</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Crescimento anual</span>
              <span className="text-green-400 font-bold">+8.3%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Principal origem</span>
              <span className="text-white font-bold">Argentina (54%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Consumo por Região */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          Consumo por Região
        </h3>
        <div className="space-y-3">
          {[
            { regiao: 'Sudeste', consumo: 45, cor: 'blue' },
            { regiao: 'Sul', consumo: 25, cor: 'green' },
            { regiao: 'Nordeste', consumo: 18, cor: 'yellow' },
            { regiao: 'Centro-Oeste', consumo: 8, cor: 'orange' },
            { regiao: 'Norte', consumo: 4, cor: 'red' }
          ].map((reg, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-neutral-300 text-sm">{reg.regiao}</span>
                <span className="text-white font-bold">{reg.consumo}%</span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-2">
                <div
                  className={`bg-gradient-to-r from-${reg.cor}-600 to-${reg.cor}-700 h-full rounded-full`}
                  style={{ width: `${reg.consumo}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-7xl max-h-[95vh] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 bg-gradient-to-r from-green-900/20 to-teal-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/50">
                <Database className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-white text-2xl font-black">SYSFEDERAL – Dados Públicos</h2>
                <p className="text-neutral-400 text-sm">Consulta automática a fontes oficiais de governo</p>
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
          {telaAtiva === 'licitacoes-vidro' && renderLicitacoesVidro()}
          {telaAtiva === 'licitacoes-esquadrias' && renderLicitacoesEsquadrias()}
          {telaAtiva === 'obras-mapa' && renderObrasMapa()}
          {telaAtiva === 'dados-economicos' && renderDadosEconomicos()}
        </div>
      </div>
    </div>
  );
}
