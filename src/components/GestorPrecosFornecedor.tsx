import React, { useState, useEffect } from 'react';
import { Save, Search, DollarSign, Filter, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { toast } from 'sonner@2.0.3';
import { salvarNoBanco } from '../utils/sync';

// Tipos de Itens que o Fornecedor Vende
type CategoriaItem = 'VIDRO' | 'ALUMINIO' | 'ACESSORIO';

interface ItemCatalogo {
  id: string;
  sku: string;
  categoria: CategoriaItem;
  descricao: string;
  unidade: string; // m², barra 6m, kit, unidade
  preco: number;
  disponivel: boolean;
  uf_atuacao: string; // Regionalização!
}

// Mock inicial caso o banco esteja vazio (Seed Inteligente por Estado)
const CATALOGO_SEED: ItemCatalogo[] = [
  // VIDROS (SC) - SKUs compatíveis com ConfiguradorSupremaCompleto
  { id: 'temperado-incolor-8mm', sku: 'temperado-incolor-8mm', categoria: 'VIDRO', descricao: 'Vidro Temperado Incolor 8mm', unidade: 'm²', preco: 150.00, disponivel: true, uf_atuacao: 'SC' },
  { id: 'temperado-verde-8mm', sku: 'temperado-verde-8mm', categoria: 'VIDRO', descricao: 'Vidro Temperado Verde 8mm', unidade: 'm²', preco: 180.00, disponivel: true, uf_atuacao: 'SC' },
  { id: 'laminado-incolor-6mm', sku: 'laminado-incolor-6mm', categoria: 'VIDRO', descricao: 'Vidro Laminado Incolor 6mm (3+3)', unidade: 'm²', preco: 220.00, disponivel: true, uf_atuacao: 'SC' },
  
  // ALUMINIO (SC)
  { id: 'suprema-trilho-inf', sku: 'suprema-trilho-inf', categoria: 'ALUMINIO', descricao: 'Trilho Inferior Suprema (Natural)', unidade: 'Barra 6m', preco: 120.00, disponivel: true, uf_atuacao: 'SC' },
  { id: 'suprema-capa', sku: 'suprema-capa', categoria: 'ALUMINIO', descricao: 'Capa Lateral Suprema (Branco)', unidade: 'Barra 6m', preco: 45.00, disponivel: true, uf_atuacao: 'SC' },

  // ACESSORIOS (SC)
  { id: 'roldana-suprema', sku: 'roldana-suprema', categoria: 'ACESSORIO', descricao: 'Roldana Dupla Suprema c/ Regulagem', unidade: 'Unidade', preco: 15.00, disponivel: true, uf_atuacao: 'SC' },
  { id: 'kit-01', sku: 'kit-01', categoria: 'ACESSORIO', descricao: 'Kit Acessórios Janela 2F (Fecho + Roldanas)', unidade: 'Kit', preco: 45.00, disponivel: true, uf_atuacao: 'SC' },
];

export function GestorPrecosFornecedor() {
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [itens, setItens] = useState<ItemCatalogo[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState<CategoriaItem | 'TODOS'>('TODOS');
  const [busca, setBusca] = useState('');
  
  // Contexto do Fornecedor (Simulado - No futuro virá do Auth)
  const fornecedorAtual = {
    id: 'fornecedor-santa-rita-01',
    nome: 'Santa Rita Vidros & Alumínios',
    uf: 'SC'
  };

  // 1. Carregar Catálogo
  useEffect(() => {
    carregarCatalogo();
  }, []);

  async function carregarCatalogo() {
    try {
      setLoading(true);
      
      // 🔥 CORREÇÃO CRÍTICA: Ler da mesma chave que o Backend/Configurador usa!
      // Chave correta: precos-vidro:{id}
      // Formato esperado: { precos: Record<string, Item>, ... }
      
      const key = `precos-vidro:${fornecedorAtual.id}`;
      console.log(`🔄 Carregando dados reais de: ${key}`);

      const { data, error } = await supabase
        .from('kv_store_f33747ec')
        .select('value')
        .eq('key', key)
        .maybeSingle();

      if (data && data.value && data.value.precos) {
        // CONVERSÃO: Record (Backend) -> Array (Frontend)
        const tabela = data.value.precos;
        
        // MAPA DE MIGRAÇÃO (SKU Antigo -> SKU Novo)
        const SKU_MIGRATE: Record<string, string> = {
            'TEMP-INC-8': 'temperado-incolor-8mm',
            'TEMP-VER-8': 'temperado-verde-8mm',
            'LAM-INC-6': 'laminado-incolor-6mm',
            'SUP-TRILHO-INF': 'suprema-trilho-inf',
            'SUP-CAPA': 'suprema-capa',
            'ROLDANA-SUP': 'roldana-suprema',
            'KIT-01': 'kit-01'
        };

        const itensConvertidos: ItemCatalogo[] = Object.entries(tabela).map(([skuOrig, dados]: [string, any]) => {
            // Migração automática de SKU se necessário
            const sku = SKU_MIGRATE[skuOrig] || skuOrig;

            // Tenta extrair informações do SKU (ex: temperado-incolor-8mm)
            const parts = sku.split('-');
            const tipo = parts[0]?.toUpperCase() || 'VIDRO';
            const espessura = parts[parts.length-1]; // 8mm
            
            let descricao = dados.descricao;
            if (!descricao) {
                // Reconstrói descrição amigável se não existir
                descricao = `${tipo} ${parts[1] || ''} ${espessura}`.replace(/-/g, ' ').toUpperCase();
            }

            return {
                id: sku, // O ID é o próprio SKU
                sku: sku,
                categoria: mapCategoria(sku),
                descricao: descricao,
                unidade: 'm²', // Padrão para vidro
                preco: dados.precoVenda || 0,
                disponivel: dados.ativo ?? true,
                uf_atuacao: fornecedorAtual.uf
            };
        });
        
        // Ordenar por descrição
        itensConvertidos.sort((a, b) => a.descricao.localeCompare(b.descricao));
        setItens(itensConvertidos);
        
      } else {
        console.warn('⚠️ Tabela vazia. Usando seed de visualização (sem salvar).');
        // Se não existe, mostra o seed apenas visualmente, mas PREPARADO para salvar na chave certa
        const seedRegional = CATALOGO_SEED.filter(i => i.uf_atuacao === fornecedorAtual.uf);
        setItens(seedRegional);
      }
    } catch (error) {
      console.error('Erro ao carregar:', error);
      toast.error('Erro ao carregar tabela de preços');
    } finally {
      setLoading(false);
    }
  }

  // Helper simples para categoria
  function mapCategoria(sku: string): CategoriaItem {
      if (sku.includes('perfil') || sku.includes('barra')) return 'ALUMINIO';
      if (sku.includes('roldana') || sku.includes('kit') || sku.includes('fech')) return 'ACESSORIO';
      return 'VIDRO';
  }

  // 2. Salvar Alterações
  async function handleSalvarTudo() {
    try {
      setSalvando(true);
      
      // 🔥 CONVERSÃO INVERSA: Array (Frontend) -> Record (Backend)
      // Preserva a estrutura que o index.tsx e ConfiguradorSuprema esperam
      
      const mapaPrecos: Record<string, any> = {};
      
      itens.forEach(item => {
          mapaPrecos[item.id] = {
              custoBase: item.preco * 0.6, // Estimativa de custo se não houver
              margemLucro: 40,
              precoVenda: item.preco, // O QUE IMPORTA É ISSO
              ativo: item.disponivel,
              descricao: item.descricao // Salva descrição para facilitar leitura futura
          };
      });

      console.log('💾 Salvando dados reais na tabela OFICIAL via Proxy...');

      // Usa a função segura para contornar RLS
      const sucesso = await salvarNoBanco('preco', fornecedorAtual.id, { precos: mapaPrecos });

      if (!sucesso) throw new Error('Falha ao salvar via Proxy');

      console.log('✅ Sincronizado com sucesso!');
      toast.success('Tabela Oficial Atualizada! O Configurador já está usando estes preços.');
      
    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      toast.error(`Falha ao salvar: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setSalvando(false);
    }
  }

  // Atualizar preço localmente antes de salvar
  const atualizarPreco = (id: string, novoPreco: number) => {
    setItens(prev => prev.map(item => 
      item.id === id ? { ...item, preco: novoPreco } : item
    ));
  };

  const toggleDisponibilidade = (id: string) => {
    setItens(prev => prev.map(item => 
      item.id === id ? { ...item, disponivel: !item.disponivel } : item
    ));
  };

  // Filtragem na tela
  const itensFiltrados = itens.filter(item => {
    const matchCategoria = filtroCategoria === 'TODOS' || item.categoria === filtroCategoria;
    const matchBusca = item.descricao.toLowerCase().includes(busca.toLowerCase()) || 
                       item.sku.toLowerCase().includes(busca.toLowerCase());
    return matchCategoria && matchBusca;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
        <p className="text-sm text-slate-500">Carregando sua tabela de preços...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      
      {/* HEADER */}
      <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-white z-20 shadow-sm">
        <div className="flex justify-between items-start md:block">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
              Gestão de Preços
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Tabela: <span className="font-bold text-slate-800">{fornecedorAtual.uf}</span>
            </p>
          </div>
          
          {/* Mobile Save Button (Small) */}
          <button
            onClick={handleSalvarTudo}
            disabled={salvando}
            className="md:hidden flex items-center justify-center p-2 bg-emerald-600 text-white rounded-lg shadow-md active:scale-95 disabled:opacity-50"
            title="Salvar"
          >
            {salvando ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          </button>
        </div>

        {/* Desktop Save Button */}
        <button
          onClick={handleSalvarTudo}
          disabled={salvando}
          className="hidden md:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-emerald-900/10 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {salvando ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      {/* FILTROS */}
      <div className="p-3 md:p-4 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Buscar item..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none"
          />
        </div>

        <div className="flex bg-white rounded-lg border border-slate-200 p-1 overflow-x-auto no-scrollbar gap-1">
          {(['TODOS', 'VIDRO', 'ALUMINIO', 'ACESSORIO'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltroCategoria(cat)}
              className={`flex-shrink-0 px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap ${
                filtroCategoria === cat 
                  ? 'bg-slate-900 text-white' 
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="flex-1 overflow-auto bg-slate-50/50">
        
        {/* DESKTOP TABLE */}
        <table className="hidden md:table w-full text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">SKU / Item</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Unidade</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-40">Preço (R$)</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-32">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {itensFiltrados.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-4">
                  <div className="font-bold text-slate-800 text-sm">{item.descricao}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.sku}</div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium">
                    {item.unidade}
                  </span>
                </td>
                <td className="p-4">
                  <div className="relative group-hover:border-blue-300 border border-transparent rounded-lg transition-colors p-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={item.preco}
                      onChange={(e) => atualizarPreco(item.id, parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-slate-900 font-bold text-sm focus:border-blue-500 focus:bg-white outline-none"
                    />
                  </div>
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => toggleDisponibilidade(item.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      item.disponivel ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        item.disponivel ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <div className="text-[9px] text-slate-400 mt-1 font-medium">
                    {item.disponivel ? 'Visível' : 'Oculto'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* MOBILE CARDS LIST */}
        <div className="md:hidden flex flex-col divide-y divide-slate-100 bg-white">
            {itensFiltrados.map((item) => (
              <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                 <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                       <div className="font-bold text-slate-900 text-sm leading-tight mb-1">{item.descricao}</div>
                       <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-500 font-bold font-mono">
                             {item.sku}
                          </span>
                          <span className="text-[10px] text-slate-400">
                             p/ {item.unidade}
                          </span>
                       </div>
                    </div>
                    
                    {/* Toggle Switch Compacto */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => toggleDisponibilidade(item.id)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          item.disponivel ? 'bg-emerald-500' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${
                            item.disponivel ? 'translate-x-4.5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                          {item.disponivel ? 'ON' : 'OFF'}
                      </span>
                    </div>
                 </div>

                 {/* Preço em destaque em baixo */}
                 <div className="mt-3 flex items-center gap-3">
                    <div className="relative flex-1">
                       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">R$</span>
                       <input
                          type="number"
                          step="0.01"
                          inputMode="decimal"
                          value={item.preco}
                          onChange={(e) => atualizarPreco(item.id, parseFloat(e.target.value) || 0)}
                          className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold text-lg focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                        />
                    </div>
                 </div>
              </div>
            ))}
        </div>

        {/* EMPTY STATE */}
        {itensFiltrados.length === 0 && (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center h-full">
            <AlertCircle className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">Nenhum item encontrado.</p>
          </div>
        )}

      </div>
      
      <div className="p-3 bg-yellow-50 border-t border-yellow-100 text-xs text-yellow-800 flex items-center justify-center gap-2 text-center">
         <AlertCircle className="w-4 h-4 flex-shrink-0" />
         <span>Preços alteram novos orçamentos imediatamente.</span>
      </div>
    </div>
  );
}