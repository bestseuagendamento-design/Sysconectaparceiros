/**
 * 📦 BILL OF MATERIALS (BOM) - LISTA TÉCNICA DE MATERIAL
 * Com otimização de barras de 6m e detalhamento de cortes
 */

import React, { useState } from 'react';
import { Package, Scissors, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Warehouse } from 'lucide-react';
import { ResultadoCalculo, calcularSobrasDetalhadas, ConfiguracaoUsuario } from '../utils/calculos-industriais';
import { SUPREMA_CORRER_2F, Tipologia } from '../data/tipologias/suprema-correr-2f';

interface BillOfMaterialsProps {
  resultado: ResultadoCalculo;
  config: ConfiguracaoUsuario;
  mostrarPrecos?: boolean;
}

export function BillOfMaterials({ resultado, config, mostrarPrecos = false }: BillOfMaterialsProps) {
  const tipologia = SUPREMA_CORRER_2F;
  const { vidros, perfis, acessorios, resumo, otimizacao, codigo_producao } = resultado;
  const [mostrarSobrasDetalhadas, setMostrarSobrasDetalhadas] = useState(false);
  const [sobrasDetalhadas, setSobrasDetalhadas] = useState<ReturnType<typeof calcularSobrasDetalhadas> | null>(null);

  const handleMostrarSobras = () => {
    if (!mostrarSobrasDetalhadas && !sobrasDetalhadas) {
      // Calcular sobras detalhadas apenas quando necessário
      const sobras = calcularSobrasDetalhadas(config, tipologia);
      setSobrasDetalhadas(sobras);
    }
    setMostrarSobrasDetalhadas(!mostrarSobrasDetalhadas);
  };

  // Preço unitário (Defensiva se não vier configurado)
  const precoVidroM2 = config.preco_unitario_vidro_m2 || 0;
  const custoTotalVidros = resumo.area_total_vidro_m2 * precoVidroM2;

  return (
    <div className="bg-white rounded-xl border-2 border-neutral-900 overflow-hidden">
      {/* HEADER */}
      <div className="bg-neutral-900 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl mb-2">Bill of Materials (BOM)</h2>
            <p className="text-neutral-300 text-sm">Lista técnica completa de materiais para produção</p>
          </div>
          <Package className="w-12 h-12 text-neutral-400" />
        </div>

        {/* CÓDIGO DE PRODUÇÃO */}
        <div className="mt-4 flex gap-4">
             <div className="flex-1 p-4 bg-neutral-800 rounded-lg">
                <p className="text-xs text-neutral-400 mb-1">CÓDIGO DE PRODUÇÃO:</p>
                <p className="text-xl font-mono font-bold text-amber-400">{codigo_producao}</p>
             </div>
             {mostrarPrecos && (
                 <div className="p-4 bg-emerald-900/30 border border-emerald-500/30 rounded-lg min-w-[150px]">
                    <p className="text-xs text-emerald-400 mb-1">CUSTO VIDRO ESTIMADO:</p>
                    <p className="text-xl font-mono font-bold text-emerald-400">R$ {custoTotalVidros.toFixed(2)}</p>
                 </div>
             )}
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="p-6 space-y-6">
        
        {/* 1️⃣ VIDROS */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-700 font-bold text-sm">V</span>
            </div>
            <h3 className="text-neutral-900 font-bold">VIDROS</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-100 border-b-2 border-neutral-900">
                  <th className="text-left p-3 font-bold text-neutral-900">Folha</th>
                  <th className="text-left p-3 font-bold text-neutral-900">Tipo</th>
                  <th className="text-left p-3 font-bold text-neutral-900">Especificação</th>
                  <th className="text-right p-3 font-bold text-neutral-900">Largura (mm)</th>
                  <th className="text-right p-3 font-bold text-neutral-900">Altura (mm)</th>
                  <th className="text-right p-3 font-bold text-neutral-900">Área (m²)</th>
                  {mostrarPrecos && <th className="text-right p-3 font-bold text-neutral-600">R$/m²</th>}
                  {mostrarPrecos && <th className="text-right p-3 font-bold text-emerald-700 bg-emerald-50">Total (R$)</th>}
                </tr>
              </thead>
              <tbody>
                {vidros.map((vidro) => {
                  const custoPeca = vidro.area_m2 * precoVidroM2;
                  return (
                    <tr key={vidro.folha_numero} className="border-b border-neutral-200 hover:bg-neutral-50">
                        <td className="p-3 font-mono font-bold">#{vidro.folha_numero}</td>
                        <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                            vidro.tipo_folha === 'MOVEL' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-neutral-200 text-neutral-700'
                        }`}>
                            {vidro.tipo_folha}
                        </span>
                        </td>
                        <td className="p-3 text-neutral-700 font-medium">
                            {config.espessura_vidro}mm {config.cor_vidro}
                        </td>
                        <td className="p-3 text-right font-mono">{vidro.largura_mm}</td>
                        <td className="p-3 text-right font-mono">{vidro.altura_mm}</td>
                        <td className="p-3 text-right font-mono">{vidro.area_m2.toFixed(4)}</td>
                        {mostrarPrecos && (
                            <td className="p-3 text-right font-mono text-neutral-600">
                                {precoVidroM2.toFixed(2)}
                            </td>
                        )}
                        {mostrarPrecos && (
                            <td className="p-3 text-right font-mono font-bold text-emerald-700 bg-emerald-50/50">
                                R$ {custoPeca.toFixed(2)}
                            </td>
                        )}
                    </tr>
                  );
                })}
                <tr className="bg-neutral-100 border-t-2 border-neutral-900">
                  <td colSpan={5} className="p-3 font-bold text-neutral-900 text-right">TOTAIS:</td>
                  <td className="p-3 text-right font-mono font-bold text-neutral-900">
                    {resumo.area_total_vidro_m2.toFixed(4)} m²
                  </td>
                  {mostrarPrecos && <td className="p-3 bg-neutral-100"></td>}
                  {mostrarPrecos && (
                      <td className="p-3 text-right font-mono font-bold text-emerald-800 bg-emerald-100">
                        R$ {custoTotalVidros.toFixed(2)}
                      </td>
                  )}
                </tr>
              </tbody>
            </table>
            {mostrarPrecos && (
                <div className="mt-2 text-[10px] text-right text-neutral-500 italic">
                    Base de cálculo: R$ {precoVidroM2.toFixed(2)}/m² ({config.tipo_vidro} {config.espessura_vidro}mm {config.cor_vidro})
                </div>
            )}
          </div>
        </div>

        {/* 2️⃣ PERFIS DE ALUMÍNIO */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <Scissors className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="text-neutral-900 font-bold">PERFIS DE ALUMÍNIO</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-100 border-b-2 border-neutral-900">
                  <th className="text-left p-3 font-bold text-neutral-900">Código</th>
                  <th className="text-left p-3 font-bold text-neutral-900">Descrição</th>
                  <th className="text-center p-3 font-bold text-neutral-900">Qtd</th>
                  <th className="text-right p-3 font-bold text-neutral-900">Comp. (mm)</th>
                  <th className="text-right p-3 font-bold text-neutral-900">Peso/m (kg)</th>
                  <th className="text-right p-3 font-bold text-neutral-900">Peso Total (kg)</th>
                </tr>
              </thead>
              <tbody>
                {perfis.map((perfil, index) => (
                  <tr key={index} className="border-b border-neutral-200 hover:bg-neutral-50">
                    <td className="p-3 font-mono text-xs font-bold text-neutral-700">{perfil.codigo}</td>
                    <td className="p-3">{perfil.descricao}</td>
                    <td className="p-3 text-center font-mono font-bold">{perfil.quantidade}</td>
                    <td className="p-3 text-right font-mono">{perfil.comprimento_mm}</td>
                    <td className="p-3 text-right font-mono text-neutral-600">{perfil.peso_kg_m.toFixed(2)}</td>
                    <td className="p-3 text-right font-mono font-bold">{perfil.peso_total_kg.toFixed(3)}</td>
                  </tr>
                ))}
                <tr className="bg-neutral-100 border-t-2 border-neutral-900">
                  <td colSpan={5} className="p-3 font-bold text-neutral-900">PESO TOTAL ALUMÍNIO:</td>
                  <td className="p-3 text-right font-mono font-bold text-neutral-900">
                    {resumo.peso_total_aluminio_kg.toFixed(3)} kg
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3️⃣ OTIMIZAÇÃO DE BARRAS */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <Scissors className="w-6 h-6 text-amber-700 mt-1" />
            <div className="flex-1">
              <h3 className="text-neutral-900 font-bold mb-1">OTIMIZAÇÃO DE BARRAS DE 6 METROS</h3>
              <p className="text-sm text-neutral-600">
                Cálculo automático de aproveitamento de barras padrão de 6000mm
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4 border border-amber-200">
              <p className="text-xs text-neutral-600 mb-1">BARRAS NECESSÁRIAS</p>
              <p className="text-3xl font-bold text-amber-700">{otimizacao.barras_6m_necessarias}</p>
              <p className="text-xs text-neutral-500 mt-1">barras de 6m</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-amber-200">
              <p className="text-xs text-neutral-600 mb-1">SOBRA TOTAL</p>
              <p className="text-3xl font-bold text-neutral-700">{otimizacao.sobra_total_mm}</p>
              <p className="text-xs text-neutral-500 mt-1">milímetros</p>
            </div>
          </div>

          {/* Detalhamento por perfil */}
          <div className="space-y-2">
            {otimizacao.detalhamento.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded border border-amber-200 text-sm">
                <span className="text-neutral-700 font-medium">{item.perfil}</span>
                <div className="flex items-center gap-4">
                  <span className="text-neutral-900 font-bold">{item.barras} barra(s)</span>
                  <span className="text-neutral-600">Sobra: {item.sobra_mm}mm</span>
                </div>
              </div>
            ))}
          </div>

          {/* Avisos */}
          {otimizacao.sobra_total_mm > 3000 && (
            <div className="mt-4 flex items-start gap-2 p-3 bg-green-100 border border-green-300 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-700 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold text-green-900">Sobra aproveitável!</p>
                <p className="text-green-700">
                  Sobra de {otimizacao.sobra_total_mm}mm pode ser reaproveitada em outras produções.
                </p>
              </div>
            </div>
          )}

          {otimizacao.sobra_total_mm < 500 && (
            <div className="mt-4 flex items-start gap-2 p-3 bg-amber-100 border border-amber-300 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-700 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold text-amber-900">Corte otimizado</p>
                <p className="text-amber-700">
                  Aproveitamento eficiente com apenas {otimizacao.sobra_total_mm}mm de sobra.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 📊 SOBRAS DETALHADAS POR PERFIL - PARA ESTOQUE */}
        <div className="border-2 border-green-300 rounded-lg overflow-hidden">
          <button
            onClick={handleMostrarSobras}
            className="w-full bg-green-50 hover:bg-green-100 transition-colors p-6 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <Warehouse className="w-6 h-6 text-green-700" />
              <div>
                <h3 className="text-neutral-900 font-bold mb-1">📦 SOBRAS DETALHADAS PARA ESTOQUE</h3>
                <p className="text-sm text-neutral-600">
                  Especificação completa de cada sobra por perfil, barra e metragem (Linha {tipologia.linha})
                </p>
              </div>
            </div>
            {mostrarSobrasDetalhadas ? (
              <ChevronUp className="w-6 h-6 text-green-700" />
            ) : (
              <ChevronDown className="w-6 h-6 text-green-700" />
            )}
          </button>

          {mostrarSobrasDetalhadas && sobrasDetalhadas && (
            <div className="p-6 bg-white space-y-6">
              {sobrasDetalhadas.map((sobra, index) => (
                <div key={index} className="border-2 border-green-200 rounded-lg overflow-hidden">
                  {/* HEADER DO PERFIL */}
                  <div className="bg-green-50 p-4 border-b-2 border-green-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-neutral-900 text-lg">{sobra.nome_perfil}</h4>
                        <p className="text-sm text-neutral-600 mt-1">
                          Código: <span className="font-mono font-bold">{sobra.codigo_perfil}</span> | 
                          Linha: <span className="font-bold">{sobra.linha}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-neutral-600">Barras 6m Usadas</p>
                        <p className="text-2xl font-bold text-green-700">{sobra.total_barras_6m}</p>
                      </div>
                    </div>
                  </div>

                  {/* CORTES NECESSÁRIOS */}
                  <div className="p-4 bg-neutral-50 border-b border-green-200">
                    <h5 className="font-bold text-neutral-900 mb-3 text-sm">✂️ CORTES NECESSÁRIOS:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {sobra.cortes_necessarios.map((corte) => (
                        <div key={corte.corte_numero} className="bg-white p-3 rounded border border-neutral-200 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-neutral-900">Corte #{corte.corte_numero}</span>
                            <span className="font-mono font-bold text-amber-700">{corte.comprimento_mm}mm</span>
                          </div>
                          <p className="text-neutral-600 mt-1">{corte.localizacao}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DETALHAMENTO POR BARRA */}
                  <div className="p-4">
                    <h5 className="font-bold text-neutral-900 mb-3 text-sm">📏 DETALHAMENTO POR BARRA DE 6 METROS:</h5>
                    <div className="space-y-3">
                      {sobra.barras_usadas.map((barra) => (
                        <div key={barra.barra_numero} className="border-2 border-neutral-200 rounded-lg overflow-hidden">
                          <div className="bg-neutral-100 px-4 py-2 flex items-center justify-between">
                            <span className="font-bold text-neutral-900">BARRA #{barra.barra_numero} (6000mm)</span>
                            <div className="flex items-center gap-4 text-xs">
                              <span className="text-neutral-600">Perdas Serra: <span className="font-bold">{barra.perdas_serra_mm}mm</span></span>
                              <span className="text-neutral-600">Cortes: <span className="font-bold">{barra.cortes_nesta_barra.join(', ')}</span></span>
                            </div>
                          </div>
                          <div className="p-4 bg-white">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-neutral-600 mb-1">SOBRA APROVEITÁVEL:</p>
                                <p className="text-3xl font-bold text-green-700">{barra.sobra_aproveitavel_mm}mm</p>
                                <p className="text-xs text-neutral-500 mt-1">= {(barra.sobra_aproveitavel_mm / 1000).toFixed(3)} metros</p>
                              </div>
                              <div>
                                {barra.sobra_vai_para_estoque ? (
                                  <div className="bg-green-100 border-2 border-green-500 rounded-lg px-4 py-2 text-center">
                                    <CheckCircle2 className="w-6 h-6 text-green-700 mx-auto mb-1" />
                                    <p className="font-bold text-green-900 text-sm">VAI PARA ESTOQUE</p>
                                    <p className="text-xs text-green-700">Sobra ≥ 300mm</p>
                                  </div>
                                ) : (
                                  <div className="bg-red-100 border-2 border-red-300 rounded-lg px-4 py-2 text-center">
                                    <AlertCircle className="w-6 h-6 text-red-700 mx-auto mb-1" />
                                    <p className="font-bold text-red-900 text-sm">DESCARTE</p>
                                    <p className="text-xs text-red-700">Sobra &lt; 300mm</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* TOTAIS DO PERFIL */}
                  <div className="bg-neutral-900 text-white p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-neutral-400 mb-1">Metros Necessários</p>
                        <p className="text-xl font-bold">{sobra.total_metros_necessarios.toFixed(3)}m</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400 mb-1">Metros Usados</p>
                        <p className="text-xl font-bold text-amber-400">{sobra.total_metros_usados.toFixed(3)}m</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400 mb-1">Sobra Total</p>
                        <p className="text-xl font-bold text-green-400">{sobra.total_sobra_mm}mm</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4️⃣ ACESSÓRIOS E FERRAGENS */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-red-700 font-bold text-sm">A</span>
            </div>
            <h3 className="text-neutral-900 font-bold">ACESSÓRIOS E FERRAGENS</h3>
          </div>
          
          <div className="space-y-2">
            {acessorios.map((acessorio, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50">
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">{acessorio.nome}</p>
                  <p className="text-sm text-neutral-600">{acessorio.descricao}</p>
                  <p className="text-xs font-mono text-neutral-500 mt-1">Código: {acessorio.codigo}</p>
                  
                  {acessorio.requer_recorte && (
                    <div className="mt-2 flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
                      <Scissors className="w-4 h-4 text-red-600" />
                      <span className="text-red-700 font-medium">
                        Requer recorte: {acessorio.requer_recorte.altura_mm}mm ({acessorio.requer_recorte.posicao})
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-right ml-4">
                  <p className="text-2xl font-bold text-neutral-900">{acessorio.quantidade}</p>
                  <p className="text-xs text-neutral-500">unid.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5️⃣ RESUMO FINAL */}
        <div className="bg-neutral-900 text-white rounded-lg p-6">
          <h3 className="font-bold mb-4 text-lg">RESUMO GERAL</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-neutral-400 text-xs mb-1">Vidro Total</p>
              <p className="text-2xl font-bold">{resumo.area_total_vidro_m2.toFixed(2)} m²</p>
            </div>
            <div>
              <p className="text-neutral-400 text-xs mb-1">Peso Vidro</p>
              <p className="text-2xl font-bold">{resumo.peso_total_vidro_kg.toFixed(2)} kg</p>
            </div>
            <div>
              <p className="text-neutral-400 text-xs mb-1">Peso Alumínio</p>
              <p className="text-2xl font-bold">{resumo.peso_total_aluminio_kg.toFixed(2)} kg</p>
            </div>
            <div>
              <p className="text-neutral-400 text-xs mb-1">Vedação</p>
              <p className="text-2xl font-bold">{resumo.metros_vedacao} m</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}