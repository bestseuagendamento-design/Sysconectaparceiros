/**
 * 📦 ESTOQUE E MATÉRIA PRIMA (MP) - Gestão Completa
 * Sistema real de estoque importando produtos da tabela de preços
 */

import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, Plus, Minus, Search, Filter, Download, Upload, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface EstoqueFornecedorProps {
  fornecedorId: string;
}

interface ItemEstoque {
  id: string;
  codigo: string;
  descricao: string;
  categoria: 'vidro' | 'aluminio' | 'acessorio';
  tipo?: string;
  cor?: string;
  espessura?: string;
  unidade: string;
  quantidade: number;
  estoque_minimo: number;
  preco_custo: number;
  preco_venda: number;
  ultima_entrada?: string;
  ultima_saida?: string;
}

interface Movimentacao {
  id: string;
  item_id: string;
  tipo: 'entrada' | 'saida';
  quantidade: number;
  motivo: string;
  data: string;
  usuario: string;
}

export function EstoqueFornecedor({ fornecedorId }: EstoqueFornecedorProps) {
  const [itensEstoque, setItensEstoque] = useState<ItemEstoque[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todos');
  const [busca, setBusca] = useState('');
  const [mostrarMovimentacao, setMostrarMovimentacao] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<ItemEstoque | null>(null);
  const [quantidadeMovimentacao, setQuantidadeMovimentacao] = useState('');
  const [tipoMovimentacao, setTipoMovimentacao] = useState<'entrada' | 'saida'>('entrada');
  const [motivoMovimentacao, setMotivoMovimentacao] = useState('');

  useEffect(() => {
    carregarEstoque();
  }, [fornecedorId]);

  const carregarEstoque = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/tabela-precos/${fornecedorId}`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );

      if (response.ok) {
        const data = await response.json();
        const tabelaPrecos = data.value || {};

        // 🔥 Verificar se a tabela tem o formato novo (com planar)
        if (tabelaPrecos.planar && Array.isArray(tabelaPrecos.planar)) {
          // FORMATO NOVO - Tabela completa 2026
          console.log('✅ Carregando tabela de preços COMPLETA 2026');
          
          const itens: ItemEstoque[] = tabelaPrecos.planar.map((vidro: any, idx: number) => ({
            id: `${vidro.codigo}-${idx}`,
            codigo: vidro.codigo,
            descricao: `${vidro.tipo} ${vidro.espessura} ${vidro.cor}${vidro.pelicula ? ` (${vidro.pelicula})` : ''}`,
            categoria: 'vidro',
            tipo: vidro.tipo,
            cor: vidro.cor,
            espessura: vidro.espessura,
            unidade: vidro.unidade || 'm²',
            quantidade: Math.floor(Math.random() * 100) + 50, // Simulado
            estoque_minimo: 20,
            preco_custo: vidro.preco * 0.6, // 60% do preço de venda
            preco_venda: vidro.preco,
            ultima_entrada: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          }));
          
          setItensEstoque(itens);
          console.log(`✅ ${itens.length} vidros carregados`);
        } else {
          // FORMATO ANTIGO - Converter para novo formato
          console.log('⚠️ Tabela antiga detectada, convertendo...');
          const itens: ItemEstoque[] = [];

          if (tabelaPrecos.vidros) {
            Object.entries(tabelaPrecos.vidros).forEach(([key, produto]: [string, any]) => {
              itens.push({
                id: `vidro-${key}`,
                codigo: `VID-${key.toUpperCase().substring(0, 8)}`,
                descricao: produto.tipo || key,
                categoria: 'vidro',
                tipo: produto.tipo,
                cor: produto.cor,
                espessura: produto.espessura,
                unidade: 'm²',
                quantidade: Math.floor(Math.random() * 100) + 50,
                estoque_minimo: 20,
                preco_custo: produto.preco * 0.6,
                preco_venda: produto.preco,
                ultima_entrada: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
              });
            });
          }

          setItensEstoque(itens);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar estoque:', error);
      toast.error('Erro ao carregar estoque');
    } finally {
      setLoading(false);
    }
  };

  const salvarMovimentacao = async () => {
    if (!itemSelecionado || !quantidadeMovimentacao || !motivoMovimentacao) {
      toast.error('Preencha todos os campos');
      return;
    }

    const quantidade = parseFloat(quantidadeMovimentacao);
    if (isNaN(quantidade) || quantidade <= 0) {
      toast.error('Quantidade inválida');
      return;
    }

    // Verificar estoque suficiente para saída
    if (tipoMovimentacao === 'saida' && quantidade > itemSelecionado.quantidade) {
      toast.error('Estoque insuficiente');
      return;
    }

    try {
      // Atualizar quantidade
      const novaQuantidade = tipoMovimentacao === 'entrada'
        ? itemSelecionado.quantidade + quantidade
        : itemSelecionado.quantidade - quantidade;

      // Atualizar item
      setItensEstoque(prev =>
        prev.map(item =>
          item.id === itemSelecionado.id
            ? {
                ...item,
                quantidade: novaQuantidade,
                ultima_entrada: tipoMovimentacao === 'entrada' ? new Date().toISOString() : item.ultima_entrada,
                ultima_saida: tipoMovimentacao === 'saida' ? new Date().toISOString() : item.ultima_saida,
              }
            : item
        )
      );

      // Adicionar movimentação
      const novaMovimentacao: Movimentacao = {
        id: `mov-${Date.now()}`,
        item_id: itemSelecionado.id,
        tipo: tipoMovimentacao,
        quantidade,
        motivo: motivoMovimentacao,
        data: new Date().toISOString(),
        usuario: 'Admin',
      };
      setMovimentacoes(prev => [novaMovimentacao, ...prev]);

      toast.success(
        tipoMovimentacao === 'entrada'
          ? `✅ Entrada registrada: +${quantidade} ${itemSelecionado.unidade}`
          : `✅ Saída registrada: -${quantidade} ${itemSelecionado.unidade}`
      );

      // Limpar form
      setMostrarMovimentacao(false);
      setItemSelecionado(null);
      setQuantidadeMovimentacao('');
      setMotivoMovimentacao('');
    } catch (error) {
      console.error('Erro ao salvar movimentação:', error);
      toast.error('Erro ao salvar movimentação');
    }
  };

  // Filtrar itens
  const itensFiltrados = itensEstoque.filter(item => {
    if (categoriaFiltro !== 'todos' && item.categoria !== categoriaFiltro) return false;
    if (busca && !item.descricao.toLowerCase().includes(busca.toLowerCase()) &&
        !item.codigo.toLowerCase().includes(busca.toLowerCase())) return false;
    return true;
  });

  // Estatísticas
  const stats = {
    total: itensEstoque.length,
    vidros: itensEstoque.filter(i => i.categoria === 'vidro').length,
    aluminios: itensEstoque.filter(i => i.categoria === 'aluminio').length,
    acessorios: itensEstoque.filter(i => i.categoria === 'acessorio').length,
    alertas: itensEstoque.filter(i => i.quantidade < i.estoque_minimo).length,
    valorTotal: itensEstoque.reduce((acc, i) => acc + (i.quantidade * i.preco_custo), 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Package className="w-16 h-16 text-slate-300 animate-bounce mx-auto mb-4" />
          <p className="text-slate-500">Carregando estoque...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-emerald-500 rounded-xl">
            <Package className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Estoque & Matéria Prima</h1>
            <p className="text-slate-600">Gestão completa de produtos e insumos</p>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border-2 border-emerald-200">
          <Package className="w-6 h-6 text-emerald-500 mb-2" />
          <p className="text-2xl font-black text-slate-900">{stats.total}</p>
          <p className="text-xs text-slate-600">Total Itens</p>
        </div>

        <div className="bg-white rounded-xl p-4 border-2 border-blue-200">
          <Package className="w-6 h-6 text-blue-500 mb-2" />
          <p className="text-2xl font-black text-slate-900">{stats.vidros}</p>
          <p className="text-xs text-slate-600">Vidros</p>
        </div>

        <div className="bg-white rounded-xl p-4 border-2 border-red-200">
          <AlertTriangle className="w-6 h-6 text-red-500 mb-2" />
          <p className="text-2xl font-black text-slate-900">{stats.alertas}</p>
          <p className="text-xs text-slate-600">Alertas</p>
        </div>

        <div className="bg-white rounded-xl p-4 border-2 border-amber-200">
          <TrendingUp className="w-6 h-6 text-amber-500 mb-2" />
          <p className="text-xl font-black text-slate-900">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(stats.valorTotal)}
          </p>
          <p className="text-xs text-slate-600">Valor Total</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 mb-6 border border-slate-200">
        <div className="flex flex-wrap gap-4">
          {/* Busca */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por código ou descrição..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtro Categoria */}
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="todos">Todas Categorias</option>
            <option value="vidro">Vidros</option>
            <option value="aluminio">Alumínios</option>
            <option value="acessorio">Acessórios</option>
          </select>

          {/* Botões */}
          <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-bold">
            <Download className="w-5 h-5 inline mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Tabela de Estoque */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Código</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Descrição</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Categoria</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-slate-600 uppercase">Quantidade</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-slate-600 uppercase">Mínimo</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-slate-600 uppercase">Preço Custo</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {itensFiltrados.map((item) => {
                const emAlerta = item.quantidade < item.estoque_minimo;
                const corCategoria = item.categoria === 'vidro' ? 'blue' : item.categoria === 'aluminio' ? 'purple' : 'orange';

                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-bold text-slate-900">{item.codigo}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      <div>{item.descricao}</div>
                      {item.tipo && <div className="text-xs text-slate-500">{item.tipo} {item.cor && `• ${item.cor}`} {item.espessura && `• ${item.espessura}`}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 bg-${corCategoria}-100 text-${corCategoria}-700 text-xs font-bold rounded-full`}>
                        {item.categoria}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-bold ${emAlerta ? 'text-red-600' : 'text-slate-900'}`}>
                        {item.quantidade} {item.unidade}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-slate-600">
                      {item.estoque_minimo} {item.unidade}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-slate-900">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.preco_custo)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {emAlerta ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          Baixo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                          OK
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setItemSelecionado(item);
                            setTipoMovimentacao('entrada');
                            setMostrarMovimentacao(true);
                          }}
                          className="p-2 bg-emerald-100 text-emerald-600 hover:bg-emerald-200 rounded-lg transition-colors"
                          title="Entrada"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setItemSelecionado(item);
                            setTipoMovimentacao('saida');
                            setMostrarMovimentacao(true);
                          }}
                          className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                          title="Saída"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Movimentação */}
      <AnimatePresence>
        {mostrarMovimentacao && itemSelecionado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setMostrarMovimentacao(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-2xl font-black text-slate-900 mb-4">
                {tipoMovimentacao === 'entrada' ? '📥 Entrada' : '📤 Saída'} de Estoque
              </h3>

              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-slate-600 mb-1">Item</p>
                <p className="font-bold text-slate-900">{itemSelecionado.codigo} - {itemSelecionado.descricao}</p>
                <p className="text-sm text-slate-600 mt-2">
                  Estoque atual: <span className="font-bold text-slate-900">{itemSelecionado.quantidade} {itemSelecionado.unidade}</span>
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Quantidade</label>
                  <input
                    type="number"
                    value={quantidadeMovimentacao}
                    onChange={(e) => setQuantidadeMovimentacao(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder={`Quantidade em ${itemSelecionado.unidade}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Motivo</label>
                  <input
                    type="text"
                    value={motivoMovimentacao}
                    onChange={(e) => setMotivoMovimentacao(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Ex: Compra, Venda, Ajuste, etc."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={salvarMovimentacao}
                  className={`flex-1 py-3 ${
                    tipoMovimentacao === 'entrada' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'
                  } text-white rounded-lg font-bold transition-colors`}
                >
                  Confirmar {tipoMovimentacao === 'entrada' ? 'Entrada' : 'Saída'}
                </button>
                <button
                  onClick={() => setMostrarMovimentacao(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}