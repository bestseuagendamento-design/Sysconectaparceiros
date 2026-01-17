/**
 * 📦 ESTOQUE DE VIDROS - FORNECEDOR
 * Sistema COMPLETO com persistência no Supabase
 * 
 * FUNCIONALIDADES:
 * - 37 vidros Guardian pré-cadastrados
 * - Edição de quantidade em estoque
 * - Edição de preços por m²
 * - Toggle de disponibilidade
 * - Salvamento automático no Supabase
 * - Integração com sistema de compras
 */

import React, { useState, useEffect } from 'react';
import { Wine, Save, Loader2, ArrowLeft, Package, DollarSign, AlertCircle, CheckCircle, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface EstoqueVidrosProps {
  fornecedorId: string;
  onVoltar: () => void;
}

interface VidroEstoque {
  id?: string;
  tipo: string;
  espessura: string;
  categoria: string;
  quantidade_m2: number;
  preco_m2: number;
  disponivel: boolean;
  ultima_atualizacao?: string;
}

// 🪟 LISTA COMPLETA DE VIDROS GUARDIAN (37 tipos)
const VIDROS_GUARDIAN = [
  // FLOAT (COMUM) - 12 tipos
  { tipo: 'Guardian Clear', espessura: '4mm', categoria: 'Float' },
  { tipo: 'Guardian Clear', espessura: '6mm', categoria: 'Float' },
  { tipo: 'Guardian Clear', espessura: '8mm', categoria: 'Float' },
  { tipo: 'Guardian Clear', espessura: '10mm', categoria: 'Float' },
  { tipo: 'Guardian Green', espessura: '4mm', categoria: 'Float' },
  { tipo: 'Guardian Green', espessura: '6mm', categoria: 'Float' },
  { tipo: 'Guardian Green', espessura: '8mm', categoria: 'Float' },
  { tipo: 'Guardian Bronze', espessura: '4mm', categoria: 'Float' },
  { tipo: 'Guardian Bronze', espessura: '6mm', categoria: 'Float' },
  { tipo: 'Guardian Grey (Fumê)', espessura: '4mm', categoria: 'Float' },
  { tipo: 'Guardian Grey (Fumê)', espessura: '6mm', categoria: 'Float' },
  { tipo: 'Guardian Grey (Fumê)', espessura: '8mm', categoria: 'Float' },
  
  // TEMPERADO - 7 tipos
  { tipo: 'Temperado Incolor', espessura: '6mm', categoria: 'Temperado' },
  { tipo: 'Temperado Incolor', espessura: '8mm', categoria: 'Temperado' },
  { tipo: 'Temperado Incolor', espessura: '10mm', categoria: 'Temperado' },
  { tipo: 'Temperado Verde', espessura: '6mm', categoria: 'Temperado' },
  { tipo: 'Temperado Verde', espessura: '8mm', categoria: 'Temperado' },
  { tipo: 'Temperado Fumê', espessura: '6mm', categoria: 'Temperado' },
  { tipo: 'Temperado Fumê', espessura: '8mm', categoria: 'Temperado' },
  
  // LAMINADO - 7 tipos
  { tipo: 'Laminado Incolor', espessura: '3+3', categoria: 'Laminado' },
  { tipo: 'Laminado Incolor', espessura: '4+4', categoria: 'Laminado' },
  { tipo: 'Laminado Incolor', espessura: '5+5', categoria: 'Laminado' },
  { tipo: 'Laminado Verde', espessura: '3+3', categoria: 'Laminado' },
  { tipo: 'Laminado Verde', espessura: '4+4', categoria: 'Laminado' },
  { tipo: 'Laminado Fumê', espessura: '3+3', categoria: 'Laminado' },
  { tipo: 'Laminado Fumê', espessura: '4+4', categoria: 'Laminado' },
  
  // CONTROLE SOLAR - 4 tipos
  { tipo: 'Guardian Sun Green', espessura: '6mm', categoria: 'Controle Solar' },
  { tipo: 'Guardian Sun Grey', espessura: '6mm', categoria: 'Controle Solar' },
  { tipo: 'Guardian Neutral Clear', espessura: '6mm', categoria: 'Controle Solar' },
  { tipo: 'Guardian Neutral Grey', espessura: '6mm', categoria: 'Controle Solar' },
  
  // ACÚSTICO - 2 tipos
  { tipo: 'Laminado Acústico Incolor', espessura: '6+6', categoria: 'Acústico' },
  { tipo: 'Laminado Acústico Fumê', espessura: '6+6', categoria: 'Acústico' },
  
  // DECORATIVOS - 4 tipos
  { tipo: 'Mini Boreal', espessura: '4mm', categoria: 'Decorativo' },
  { tipo: 'Pontilhado', espessura: '4mm', categoria: 'Decorativo' },
  { tipo: 'Canelado', espessura: '4mm', categoria: 'Decorativo' },
  { tipo: 'Ártico', espessura: '4mm', categoria: 'Decorativo' },
];

export function EstoqueVidros({ fornecedorId, onVoltar }: EstoqueVidrosProps) {
  const [estoque, setEstoque] = useState<VidroEstoque[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('Todos');
  const [inicializando, setInicializando] = useState(false);

  useEffect(() => {
    carregarEstoque();
  }, [fornecedorId]);

  const carregarEstoque = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/fornecedor/estoque-vidros/${fornecedorId}`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        if (!data.estoque || data.estoque.length === 0) {
          // Inicializar automaticamente
          await inicializarEstoque();
        } else {
          setEstoque(data.estoque);
        }
      } else {
        // Inicializar se der erro
        await inicializarEstoque();
      }
    } catch (error) {
      console.error('Erro ao carregar estoque:', error);
      await inicializarEstoque();
    } finally {
      setLoading(false);
    }
  };

  const inicializarEstoque = async () => {
    setInicializando(true);
    try {
      const estoqueInicial = VIDROS_GUARDIAN.map(vidro => ({
        tipo: vidro.tipo,
        espessura: vidro.espessura,
        categoria: vidro.categoria,
        quantidade_m2: 0,
        preco_m2: 0,
        disponivel: true,
        ultima_atualizacao: new Date().toISOString()
      }));

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/fornecedor/estoque-vidros/${fornecedorId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ estoque: estoqueInicial })
        }
      );

      if (response.ok) {
        setEstoque(estoqueInicial);
        toast.success('✅ Estoque inicializado com 37 vidros Guardian!');
      }
    } catch (error) {
      console.error('Erro ao inicializar estoque:', error);
      toast.error('Erro ao inicializar estoque');
    } finally {
      setInicializando(false);
    }
  };

  const atualizarVidro = (index: number, campo: keyof VidroEstoque, valor: any) => {
    const novoEstoque = [...estoque];
    novoEstoque[index] = { 
      ...novoEstoque[index], 
      [campo]: valor,
      ultima_atualizacao: new Date().toISOString()
    };
    setEstoque(novoEstoque);
  };

  const ajustarQuantidade = (index: number, delta: number) => {
    const novoEstoque = [...estoque];
    const novaQuantidade = Math.max(0, novoEstoque[index].quantidade_m2 + delta);
    novoEstoque[index] = {
      ...novoEstoque[index],
      quantidade_m2: novaQuantidade,
      ultima_atualizacao: new Date().toISOString()
    };
    setEstoque(novoEstoque);
  };

  const salvarEstoque = async () => {
    setSalvando(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/fornecedor/estoque-vidros/${fornecedorId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ estoque })
        }
      );

      if (response.ok) {
        toast.success('✅ Estoque salvo com sucesso!');
      } else {
        const errorText = await response.text();
        console.error('Erro ao salvar:', errorText);
        toast.error('Erro ao salvar estoque');
      }
    } catch (error) {
      console.error('Erro ao salvar estoque:', error);
      toast.error('Erro ao salvar estoque');
    } finally {
      setSalvando(false);
    }
  };

  const categorias = ['Todos', 'Float', 'Temperado', 'Laminado', 'Controle Solar', 'Acústico', 'Decorativo'];

  const estoqueFiltrado = categoriaFiltro === 'Todos' 
    ? estoque 
    : estoque.filter(v => v.categoria === categoriaFiltro);

  // Estatísticas
  const stats = {
    total: estoque.length,
    disponiveis: estoque.filter(v => v.disponivel).length,
    comEstoque: estoque.filter(v => v.quantidade_m2 > 0).length,
    comPreco: estoque.filter(v => v.preco_m2 > 0).length,
    valorTotal: estoque.reduce((sum, v) => sum + (v.quantidade_m2 * v.preco_m2), 0)
  };

  if (loading || inicializando) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto mb-4" />
          <p className="text-white">
            {inicializando ? 'Inicializando estoque com vidros Guardian...' : 'Carregando estoque...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#1A1A1A] to-[#0F0F0F] border-b border-[#2D2D2D] p-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={onVoltar}
            className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#D4AF37] mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#FFD700] flex items-center justify-center">
                  <Package className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white">Estoque de Vidros Guardian</h1>
                  <p className="text-[#9CA3AF] text-sm">Gestão completa de estoque e preços</p>
                </div>
              </div>
            </div>

            <button
              onClick={salvarEstoque}
              disabled={salvando}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#D4AF37]/50 transition-all disabled:opacity-50"
            >
              {salvando ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Salvar Estoque
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto p-6">
        
        {/* ESTATÍSTICAS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wine className="w-4 h-4 text-[#9CA3AF]" />
              <p className="text-xs text-[#9CA3AF]">TOTAL</p>
            </div>
            <p className="text-2xl font-black text-white">{stats.total}</p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <p className="text-xs text-[#9CA3AF]">DISPONÍVEIS</p>
            </div>
            <p className="text-2xl font-black text-emerald-400">{stats.disponiveis}</p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-[#D4AF37]" />
              <p className="text-xs text-[#9CA3AF]">COM ESTOQUE</p>
            </div>
            <p className="text-2xl font-black text-[#D4AF37]">{stats.comEstoque}</p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-[#9CA3AF]" />
              <p className="text-xs text-[#9CA3AF]">COM PREÇO</p>
            </div>
            <p className="text-2xl font-black text-white">{stats.comPreco}</p>
          </div>
          
          <div className="bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-black" />
              <p className="text-xs text-black/70">VALOR TOTAL</p>
            </div>
            <p className="text-xl font-black text-black">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.valorTotal)}
            </p>
          </div>
        </div>

        {/* PARCERIA GUARDIAN */}
        <div className="mb-6 p-4 rounded-lg bg-[#0066B2]/10 border border-[#0066B2]/30">
          <div className="flex items-center gap-3">
            <div className="text-5xl">🏢</div>
            <div>
              <p className="text-white font-bold mb-1">PARCERIA GUARDIAN GLASS</p>
              <p className="text-[#9CA3AF] text-sm">
                Sistema completo com {VIDROS_GUARDIAN.length} tipos de vidro Guardian. Configure estoque e preços em tempo real.
              </p>
            </div>
          </div>
        </div>

        {/* FILTRO POR CATEGORIA */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoriaFiltro(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                categoriaFiltro === cat
                  ? 'bg-[#D4AF37] text-black'
                  : 'bg-[#2D2D2D] text-[#9CA3AF] hover:bg-[#3D3D3D]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GRID DE ESTOQUE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {estoqueFiltrado.map((vidro, index) => {
            const indexOriginal = estoque.findIndex(v => v.tipo === vidro.tipo && v.espessura === vidro.espessura);
            
            return (
              <div
                key={`${vidro.tipo}-${vidro.espessura}`}
                className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] border border-[#2D2D2D] rounded-xl p-4 hover:border-[#D4AF37] transition-all"
              >
                {/* Categoria Tag */}
                <div className="mb-3">
                  <span className="px-2 py-1 text-xs rounded bg-[#D4AF37]/20 text-[#D4AF37] font-medium">
                    {vidro.categoria}
                  </span>
                </div>

                {/* Tipo e Espessura */}
                <div className="mb-4">
                  <h3 className="text-white font-bold text-lg mb-1">{vidro.tipo}</h3>
                  <p className="text-[#9CA3AF] text-sm">Espessura: {vidro.espessura}</p>
                </div>

                {/* Quantidade em Estoque */}
                <div className="mb-4">
                  <label className="block text-xs text-[#9CA3AF] mb-2">Quantidade em Estoque (m²)</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => ajustarQuantidade(indexOriginal, -10)}
                      className="w-8 h-8 bg-[#2D2D2D] hover:bg-[#3D3D3D] rounded flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4 text-white" />
                    </button>
                    <input
                      type="number"
                      value={vidro.quantidade_m2}
                      onChange={(e) => atualizarVidro(indexOriginal, 'quantidade_m2', parseFloat(e.target.value) || 0)}
                      step="0.1"
                      min="0"
                      className="flex-1 px-3 py-2 bg-[#0F0F0F] border border-[#2D2D2D] rounded-lg text-white text-center focus:border-[#D4AF37] focus:outline-none"
                      placeholder="0.00"
                    />
                    <button
                      onClick={() => ajustarQuantidade(indexOriginal, 10)}
                      className="w-8 h-8 bg-[#D4AF37] hover:bg-[#B8941E] rounded flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4 text-black" />
                    </button>
                  </div>
                </div>

                {/* Preço por m² */}
                <div className="mb-4">
                  <label className="block text-xs text-[#9CA3AF] mb-2">Preço por m²</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">R$</span>
                    <input
                      type="number"
                      value={vidro.preco_m2}
                      onChange={(e) => atualizarVidro(indexOriginal, 'preco_m2', parseFloat(e.target.value) || 0)}
                      step="0.01"
                      min="0"
                      className="w-full pl-10 pr-3 py-2 bg-[#0F0F0F] border border-[#2D2D2D] rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Valor Total deste Item */}
                <div className="mb-4 p-3 rounded-lg bg-[#2D2D2D]/30">
                  <p className="text-xs text-[#9CA3AF] mb-1">Valor Total em Estoque</p>
                  <p className="text-lg font-black text-[#D4AF37]">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(vidro.quantidade_m2 * vidro.preco_m2)}
                  </p>
                </div>

                {/* Disponibilidade */}
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg bg-[#0F0F0F] border border-[#2D2D2D] hover:border-[#D4AF37] transition-all">
                  <input
                    type="checkbox"
                    checked={vidro.disponivel}
                    onChange={(e) => atualizarVidro(indexOriginal, 'disponivel', e.target.checked)}
                    className="w-4 h-4 rounded bg-[#1A1A1A] border-[#2D2D2D] text-[#D4AF37] focus:ring-[#D4AF37]"
                  />
                  <span className="text-sm text-white font-medium">
                    {vidro.disponivel ? '✅ Disponível para venda' : '❌ Indisponível'}
                  </span>
                </label>

                {/* Alerta de Estoque Baixo */}
                {vidro.quantidade_m2 > 0 && vidro.quantidade_m2 < 10 && (
                  <div className="mt-3 p-2 rounded bg-orange-500/10 border border-orange-500/30">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-400" />
                      <p className="text-xs text-orange-400">Estoque baixo!</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
