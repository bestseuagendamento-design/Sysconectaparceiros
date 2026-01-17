import React, { useState, useEffect } from 'react';
import { Wrench, Save, Loader2, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface EdicaoPrecosAcessoriosProps {
  fornecedorId: string;
  onVoltar: () => void;
}

interface PrecoAcessorio {
  id?: string;
  categoria: string;
  nome: string;
  precoUnitario: number;
}

export function EdicaoPrecosAcessorios({ fornecedorId, onVoltar }: EdicaoPrecosAcessoriosProps) {
  const [precos, setPrecos] = useState<PrecoAcessorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  // Categorias disponíveis
  const categorias = [
    'Puxadores',
    'Fechaduras',
    'Roldanas',
    'Trincos',
    'Dobradiças',
    'Vedações',
    'Outros',
  ];

  useEffect(() => {
    carregarPrecos();
  }, [fornecedorId]);

  const carregarPrecos = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/fornecedor/precos-acessorios/${fornecedorId}`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPrecos(data.precos || []);
      }
    } catch (error) {
      console.error('Erro ao carregar preços:', error);
      toast.error('Erro ao carregar preços');
    } finally {
      setLoading(false);
    }
  };

  const adicionarLinha = () => {
    setPrecos([...precos, { categoria: categorias[0], nome: '', precoUnitario: 0 }]);
  };

  const removerLinha = (index: number) => {
    setPrecos(precos.filter((_, i) => i !== index));
  };

  const atualizarPreco = (index: number, campo: keyof PrecoAcessorio, valor: any) => {
    const novosPrecos = [...precos];
    novosPrecos[index] = { ...novosPrecos[index], [campo]: valor };
    setPrecos(novosPrecos);
  };

  const salvarPrecos = async () => {
    setSalvando(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/fornecedor/precos-acessorios/${fornecedorId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ precos })
        }
      );

      if (response.ok) {
        toast.success('✅ Preços salvos com sucesso!');
      } else {
        toast.error('Erro ao salvar preços');
      }
    } catch (error) {
      console.error('Erro ao salvar preços:', error);
      toast.error('Erro ao salvar preços');
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#B87333] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1A1A1A] to-[#0F0F0F] border-b border-[#2D2D2D] p-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={onVoltar}
            className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#B87333] mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B87333] to-[#CD7F32] flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white">Edição de Preços - Acessórios</h1>
                  <p className="text-[#9CA3AF] text-sm">Configure os preços dos seus acessórios por categoria</p>
                </div>
              </div>
            </div>

            <button
              onClick={salvarPrecos}
              disabled={salvando}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#B87333] to-[#CD7F32] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#B87333]/50 transition-all disabled:opacity-50"
            >
              {salvando ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Salvar Preços
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] border border-[#2D2D2D] rounded-2xl p-8">
          
          {/* Informação */}
          <div className="mb-6 p-4 rounded-lg bg-[#B87333]/10 border border-[#B87333]/30">
            <p className="text-[#B87333] text-sm">
              💡 <strong>IMPORTANTE:</strong> Os preços cadastrados aqui serão utilizados automaticamente nos cálculos de todas as esquadrias que necessitem de acessórios.
            </p>
          </div>

          {/* Botão Adicionar */}
          <button
            onClick={adicionarLinha}
            className="mb-6 flex items-center gap-2 px-4 py-2 bg-[#B87333]/20 border border-[#B87333] text-[#B87333] rounded-lg hover:bg-[#B87333]/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            Adicionar Acessório
          </button>

          {/* Tabela de Preços */}
          <div className="space-y-4">
            {precos.length === 0 ? (
              <div className="text-center py-12 text-[#9CA3AF]">
                Nenhum preço cadastrado. Clique em "Adicionar Acessório" para começar.
              </div>
            ) : (
              precos.map((preco, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-[#0F0F0F] border border-[#2D2D2D] rounded-lg"
                >
                  {/* Categoria */}
                  <div>
                    <label className="block text-xs text-[#9CA3AF] mb-2">Categoria</label>
                    <select
                      value={preco.categoria}
                      onChange={(e) => atualizarPreco(index, 'categoria', e.target.value)}
                      className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2D2D2D] rounded-lg text-white focus:border-[#B87333] focus:outline-none"
                    >
                      {categorias.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Nome do Produto */}
                  <div>
                    <label className="block text-xs text-[#9CA3AF] mb-2">Nome do Produto</label>
                    <input
                      type="text"
                      value={preco.nome}
                      onChange={(e) => atualizarPreco(index, 'nome', e.target.value)}
                      placeholder="Ex: Puxador Inox 40cm"
                      className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2D2D2D] rounded-lg text-white focus:border-[#B87333] focus:outline-none placeholder:text-[#6B7280]"
                    />
                  </div>

                  {/* Preço Unitário */}
                  <div>
                    <label className="block text-xs text-[#9CA3AF] mb-2">Preço Unitário</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">R$</span>
                      <input
                        type="number"
                        value={preco.precoUnitario}
                        onChange={(e) => atualizarPreco(index, 'precoUnitario', parseFloat(e.target.value) || 0)}
                        step="0.01"
                        min="0"
                        className="w-full pl-10 pr-3 py-2 bg-[#1A1A1A] border border-[#2D2D2D] rounded-lg text-white focus:border-[#B87333] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Remover */}
                  <div className="flex items-end">
                    <button
                      onClick={() => removerLinha(index)}
                      className="w-full px-3 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remover
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
