import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Save, 
  DollarSign, 
  AlertCircle,
  Loader2,
  MapPin,
  Truck,
  FileText,
  Calculator,
  Settings
} from 'lucide-react';
import { CATALOGO_VIDROS, CATEGORIAS_VIDRO } from '../../data/catalogoVidrosMestre';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { salvarNoBanco, buscarPrecos } from '../../utils/sync';

interface PrecoItem {
  custoBase: number;
  margemLucro: number;
  precoVenda: number;
  ativo: boolean;
}

// 🔥 NOVO: Interface para taxas adicionais
interface TaxasAdicionais {
  percentualNotaFiscal: number; // % sobre o valor total
  valorFrete: number; // R$ por m², por kg ou fixo
  tipoFrete: 'fixo' | 'por_m2' | 'por_peso'; // Tipo de cobrança do frete
}

// Mapa de preços: SKU_ID -> PrecoItem
type TabelaPrecos = Record<string, PrecoItem>;

interface GestaoPrecosProps {
  fornecedorId: string;
}

export function GestaoPrecos({ fornecedorId }: GestaoPrecosProps) {
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('Temperado');
  const [busca, setBusca] = useState('');
  const [tabelaPrecos, setTabelaPrecos] = useState<TabelaPrecos>({});
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  
  // 🔥 NOVO: Estado para taxas adicionais (Frete e Nota Fiscal)
  const [taxas, setTaxas] = useState<TaxasAdicionais>({
    percentualNotaFiscal: 0,
    valorFrete: 0,
    tipoFrete: 'por_m2'
  });

  // Carregar preços do banco ao iniciar
  useEffect(() => {
    async function carregarPrecos() {
      if (!fornecedorId) return;
      
      try {
        setLoading(true);
        console.log(`🔄 Carregando via KV Store para: ${fornecedorId}`);
        
        // 1. Carregar diretamente do KV Store
        const dados = await buscarPrecos(fornecedorId);
        
        if (dados && Object.keys(dados).length > 0) {
          setTabelaPrecos(dados);
        } else {
            console.log('⚠️ Nenhuma tabela encontrada, iniciando vazia.');
        }
        
        // 2. 🔥 NOVO: Carregar taxas adicionais
        try {
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/taxas/${fornecedorId}`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${publicAnonKey}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.taxas) {
              setTaxas(result.taxas);
              console.log('✅ Taxas carregadas:', result.taxas);
            }
          }
        } catch (err) {
          console.warn('⚠️ Nenhuma taxa encontrada, usando padrão:', err);
        }
        
      } catch (error) {
        console.error('Erro ao carregar tabela de preços:', error);
        toast.error('Erro ao carregar preços. Verifique sua conexão.');
      } finally {
        setLoading(false);
      }
    }
    carregarPrecos();
  }, [fornecedorId]);

  // Salvar alterações
  const salvarAlteracoes = async () => {
    if (!fornecedorId) {
      toast.error('ERRO CRÍTICO: ID do fornecedor não identificado.');
      return;
    }

    try {
      setSalvando(true);
      
      // 1. 🔥 SALVAR TABELA DE PREÇOS
      const sucessoPrecos = await salvarNoBanco('preco', fornecedorId, tabelaPrecos);

      if (!sucessoPrecos) {
        throw new Error('Falha ao escrever tabela de preços no banco.');
      }
      
      // 2. 🔥 NOVO: SALVAR TAXAS ADICIONAIS
      const responseTaxas = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/taxas/${fornecedorId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ taxas })
        }
      );
      
      if (!responseTaxas.ok) {
        throw new Error('Falha ao salvar taxas adicionais.');
      }

      toast.success('Tabela e taxas salvas com sucesso!');
      
    } catch (error: any) {
      console.error('Erro fatal ao salvar:', error);
      toast.error(`FALHA AO SALVAR: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  };

  // Atualizar um item específico
  const atualizarItem = (id: string, campo: keyof PrecoItem, valor: number | boolean) => {
    setTabelaPrecos(prev => {
      const itemAtual = prev[id] || { custoBase: 0, margemLucro: 30, precoVenda: 0, ativo: false };
      const novoItem = { ...itemAtual, [campo]: valor };

      // Recalcular preço de venda se alterar custo ou margem
      if (campo === 'custoBase' || campo === 'margemLucro') {
        const custo = campo === 'custoBase' ? (valor as number) : novoItem.custoBase;
        const margem = campo === 'margemLucro' ? (valor as number) : novoItem.margemLucro;
        novoItem.precoVenda = custo * (1 + (margem / 100));
      }
      
      // Recalcular margem se alterar preço de venda direto
      if (campo === 'precoVenda') {
          const preco = valor as number;
          if (novoItem.custoBase > 0) {
            novoItem.margemLucro = ((preco / novoItem.custoBase) - 1) * 100;
          }
      }

      // Ativa automaticamente ao digitar preço
      if ((campo === 'custoBase' || campo === 'precoVenda') && (valor as number) > 0 && !novoItem.ativo) {
          novoItem.ativo = true;
      }

      return { ...prev, [id]: novoItem };
    });
  };

  // Filtrar itens visíveis (BASEADO NO CATALOGO MESTRE DE VIDROS)
  const itensVisiveis = useMemo(() => {
    return CATALOGO_VIDROS.filter(sku => {
      const matchCategoria = categoriaAtiva === 'Todos' || sku.categoria === categoriaAtiva;
      const matchBusca = busca === '' || 
        sku.nome.toLowerCase().includes(busca.toLowerCase()) || 
        sku.id.includes(busca.toLowerCase());
      return matchCategoria && matchBusca;
    });
  }, [categoriaAtiva, busca]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full font-sans">
      
      {/* HEADER DA FERRAMENTA */}
      <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-white z-20 shadow-sm">
        <div className="flex justify-between items-start md:block">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
              Gestão de Tabela de Preços (Vidros)
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Fornecedor: <span className="font-bold text-slate-800">{fornecedorId}</span>
            </p>
          </div>
          
           {/* Mobile Save Button */}
           <button
            onClick={salvarAlteracoes}
            disabled={salvando}
            className="md:hidden flex items-center justify-center p-2 bg-emerald-600 text-white rounded-lg shadow-md active:scale-95 disabled:opacity-50"
            title="Salvar"
          >
            {salvando ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          </button>
        </div>
        
        {/* Desktop Save Button */}
        <button
          onClick={salvarAlteracoes}
          disabled={salvando}
          className="hidden md:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-emerald-900/10 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {salvando ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      {/* CONTROLES E FILTROS */}
      <div className="p-3 md:p-4 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        
        {/* BUSCA */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar vidro (ex: 8mm incolor)..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none"
          />
        </div>

        {/* TABS DE CATEGORIA */}
        <div className="flex bg-white rounded-lg border border-slate-200 p-1 overflow-x-auto no-scrollbar gap-1">
            {CATEGORIAS_VIDRO.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoriaAtiva(cat)}
                className={`flex-shrink-0 px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap
                  ${categoriaAtiva === cat 
                    ? 'bg-slate-900 text-white' 
                    : 'text-slate-500 hover:bg-slate-100'
                  }
                `}
              >
                {cat}
              </button>
            ))}
        </div>
      </div>

      {/* 🔥 NOVO: SEÇÃO DE TAXAS ADICIONAIS (FRETE E NOTA FISCAL) */}
      <div className="p-4 md:p-6 bg-gradient-to-r from-blue-50 to-emerald-50 border-b border-blue-100">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm md:text-base">Taxas Adicionais (aplicadas no orçamento)</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* NOTA FISCAL */}
          <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Nota Fiscal</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={taxas.percentualNotaFiscal}
                onChange={(e) => setTaxas(prev => ({ ...prev, percentualNotaFiscal: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2.5 pr-8 border border-slate-200 rounded-lg text-right text-lg font-bold text-blue-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 font-bold">%</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">% sobre o valor total</p>
          </div>

          {/* FRETE */}
          <div className="bg-white rounded-lg p-4 border border-emerald-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Frete</span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 font-bold">R$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={taxas.valorFrete}
                onChange={(e) => setTaxas(prev => ({ ...prev, valorFrete: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2.5 pl-10 pr-3 border border-slate-200 rounded-lg text-right text-lg font-bold text-emerald-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="0,00"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {taxas.tipoFrete === 'por_m2' && 'Por m² de vidro'}
              {taxas.tipoFrete === 'por_peso' && 'Por kg de vidro'}
              {taxas.tipoFrete === 'fixo' && 'Valor fixo por pedido'}
            </p>
          </div>

          {/* TIPO DE FRETE */}
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Tipo de Frete</span>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setTaxas(prev => ({ ...prev, tipoFrete: 'por_m2' }))}
                className={`w-full px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  taxas.tipoFrete === 'por_m2'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Por m²
              </button>
              <button
                onClick={() => setTaxas(prev => ({ ...prev, tipoFrete: 'por_peso' }))}
                className={`w-full px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  taxas.tipoFrete === 'por_peso'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Por Peso (kg)
              </button>
              <button
                onClick={() => setTaxas(prev => ({ ...prev, tipoFrete: 'fixo' }))}
                className={`w-full px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  taxas.tipoFrete === 'fixo'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Fixo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ÁREA DE CONTEÚDO (TABELA SCROLLÁVEL) */}
      <div className="flex-1 overflow-auto bg-slate-50/50">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div>
            {/* DESKTOP TABLE */}
            <table className="hidden md:table w-full text-left border-collapse">
              <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-16 text-center">Ativo</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Produto / SKU</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Espessura</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Custo Base (R$)</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-32">Margem (%)</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Preço Venda (R$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {itensVisiveis.map((sku) => {
                  const item = tabelaPrecos[sku.id] || { custoBase: 0, margemLucro: 30, precoVenda: 0, ativo: false };
                  
                  return (
                    <tr key={sku.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={item.ativo}
                          onChange={(e) => atualizarItem(sku.id, 'ativo', e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col">
                            <span className={`font-bold text-sm ${item.ativo ? 'text-slate-900' : 'text-slate-500'}`}>
                                {sku.nome}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{sku.id}</span>
                        </div>
                      </td>

                      <td className="p-4 text-slate-600 text-sm font-medium">
                        {sku.espessura}mm
                      </td>

                      <td className="p-4 text-right">
                        <div className="relative inline-block w-32">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">R$</span>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.custoBase || ''}
                                onChange={(e) => atualizarItem(sku.id, 'custoBase', parseFloat(e.target.value) || 0)}
                                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 pl-8 text-right text-sm text-slate-900 focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="0,00"
                            />
                        </div>
                      </td>

                      <td className="p-4 text-center">
                         <div className="flex items-center justify-center gap-2">
                             <input
                                type="number"
                                min="0"
                                max="500"
                                value={item.margemLucro}
                                onChange={(e) => atualizarItem(sku.id, 'margemLucro', parseFloat(e.target.value) || 0)}
                                className="w-16 bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-center text-sm text-slate-600 focus:text-slate-900 focus:outline-none focus:border-blue-500"
                            />
                            <span className="text-slate-400">%</span>
                         </div>
                      </td>

                      <td className="p-4 text-right">
                         <div className="relative inline-block w-32">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 text-xs font-bold">R$</span>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.precoVenda?.toFixed(2) || ''}
                                onChange={(e) => atualizarItem(sku.id, 'precoVenda', parseFloat(e.target.value) || 0)}
                                className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 pl-8 text-right text-sm font-bold text-emerald-600 focus:outline-none focus:border-emerald-500 shadow-sm"
                            />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* MOBILE LIST (CARDS) */}
            <div className="md:hidden flex flex-col divide-y divide-slate-100 bg-white pb-20">
                {itensVisiveis.map((sku) => {
                  const item = tabelaPrecos[sku.id] || { custoBase: 0, margemLucro: 30, precoVenda: 0, ativo: false };
                  return (
                    <div key={sku.id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start gap-3">
                            <div className="flex-1">
                                <div className="font-bold text-slate-900 text-sm leading-tight mb-1">{sku.nome}</div>
                                <div className="flex items-center gap-2">
                                    <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-500 font-bold font-mono">
                                        {sku.espessura}mm
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                        {sku.id}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-center gap-1">
                                <button
                                    onClick={() => atualizarItem(sku.id, 'ativo', !item.ativo)}
                                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                    item.ativo ? 'bg-emerald-500' : 'bg-slate-200'
                                    }`}
                                >
                                    <span
                                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${
                                        item.ativo ? 'translate-x-4.5' : 'translate-x-0.5'
                                    }`}
                                    />
                                </button>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                    {item.ativo ? 'ON' : 'OFF'}
                                </span>
                            </div>
                        </div>

                        <div className="mt-3 flex items-center gap-3">
                            <div className="relative flex-1 group-focus-within:ring-2 ring-blue-500 rounded-lg transition-all">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">R$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={item.precoVenda || ''} // Remove toFixed no value para facilitar edição
                                    onChange={(e) => atualizarItem(sku.id, 'precoVenda', parseFloat(e.target.value) || 0)}
                                    className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold text-lg focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                                    placeholder="0.00"
                                    onFocus={(e) => e.target.select()} // Seleciona tudo ao clicar
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium bg-slate-100 px-1.5 py-0.5 rounded">m²</span>
                            </div>
                        </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
        
        {!loading && itensVisiveis.length === 0 && (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center">
                <AlertCircle className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm">Nenhum vidro encontrado com este filtro.</p>
            </div>
        )}
      </div>

      <div className="p-3 bg-yellow-50 border-t border-yellow-100 text-xs text-yellow-800 flex items-center justify-center gap-2 text-center">
         <AlertCircle className="w-4 h-4 flex-shrink-0" />
         <span>Preços alterados impactam novos orçamentos imediatamente.</span>
      </div>
    </div>
  );
}