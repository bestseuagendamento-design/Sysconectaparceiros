import React, { useState, useEffect } from 'react';
import { Component, Save, Loader2, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface EdicaoPrecosAluminioProps {
  fornecedorId: string;
  onVoltar: () => void;
}

interface PrecoAluminio {
  id?: string;
  acabamento: string;
  precoKg: number;
  acrescimo: number; // % de acréscimo sobre o preço base
}

export function EdicaoPrecosAluminio({ fornecedorId, onVoltar }: EdicaoPrecosAluminioProps) {
  const [precos, setPrecos] = useState<PrecoAluminio[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  // Acabamentos disponíveis
  const acabamentos = [
    'Natural',
    'Anodizado Preto',
    'Anodizado Bronze',
    'Anodizado Champagne',
    'Branco',
    'Preto',
    'Bronze',
    'Fosco',
  ];

  useEffect(() => {
    carregarPrecos();
  }, [fornecedorId]);

  const carregarPrecos = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/fornecedor/precos-aluminio/${fornecedorId}`,
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
    setPrecos([...precos, { acabamento: acabamentos[0], precoKg: 0, acrescimo: 0 }]);
  };

  const removerLinha = (index: number) => {
    setPrecos(precos.filter((_, i) => i !== index));
  };

  const atualizarPreco = (index: number, campo: keyof PrecoAluminio, valor: any) => {
    const novosPrecos = [...precos];
    novosPrecos[index] = { ...novosPrecos[index], [campo]: valor };
    setPrecos(novosPrecos);
  };

  const salvarPrecos = async () => {
    setSalvando(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/fornecedor/precos-aluminio/${fornecedorId}`,
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
        <Loader2 className="w-8 h-8 text-[#6B7280] animate-spin" />
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
            className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#6B7280] mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6B7280] to-[#9CA3AF] flex items-center justify-center">
                  <Component className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white">Edição de Preços - Alumínio</h1>
                  <p className="text-[#9CA3AF] text-sm">Configure os preços do alumínio por acabamento</p>
                </div>
              </div>
            </div>

            <button
              onClick={salvarPrecos}
              disabled={salvando}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6B7280] to-[#9CA3AF] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#6B7280]/50 transition-all disabled:opacity-50"
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
          <div className="mb-6 p-4 rounded-lg bg-[#6B7280]/10 border border-[#6B7280]/30">
            <p className="text-[#9CA3AF] text-sm">
              💡 <strong>IMPORTANTE:</strong> Os preços cadastrados aqui serão utilizados automaticamente nos cálculos de todas as esquadrias que necessitem de alumínio.
            </p>
          </div>

          {/* Botão Adicionar */}
          <button
            onClick={adicionarLinha}
            className="mb-6 flex items-center gap-2 px-4 py-2 bg-[#6B7280]/20 border border-[#6B7280] text-[#9CA3AF] rounded-lg hover:bg-[#6B7280]/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            Adicionar Acabamento
          </button>

          {/* Tabela de Preços */}
          <div className="space-y-4">
            {precos.length === 0 ? (
              <div className="text-center py-12 text-[#9CA3AF]">
                Nenhum preço cadastrado. Clique em "Adicionar Acabamento" para começar.
              </div>
            ) : (
              precos.map((preco, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-[#0F0F0F] border border-[#2D2D2D] rounded-lg"
                >
                  {/* Acabamento */}
                  <div>
                    <label className="block text-xs text-[#9CA3AF] mb-2">Acabamento</label>
                    <select
                      value={preco.acabamento}
                      onChange={(e) => atualizarPreco(index, 'acabamento', e.target.value)}
                      className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2D2D2D] rounded-lg text-white focus:border-[#6B7280] focus:outline-none"
                    >
                      {acabamentos.map(acab => (
                        <option key={acab} value={acab}>{acab}</option>
                      ))}
                    </select>
                  </div>

                  {/* Preço por kg */}
                  <div>
                    <label className="block text-xs text-[#9CA3AF] mb-2">Preço por kg</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">R$</span>
                      <input
                        type="number"
                        value={preco.precoKg}
                        onChange={(e) => atualizarPreco(index, 'precoKg', parseFloat(e.target.value) || 0)}
                        step="0.01"
                        min="0"
                        className="w-full pl-10 pr-3 py-2 bg-[#1A1A1A] border border-[#2D2D2D] rounded-lg text-white focus:border-[#6B7280] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Acréscimo % */}
                  <div>
                    <label className="block text-xs text-[#9CA3AF] mb-2">Acréscimo (%)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={preco.acrescimo}
                        onChange={(e) => atualizarPreco(index, 'acrescimo', parseFloat(e.target.value) || 0)}
                        step="0.1"
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2D2D2D] rounded-lg text-white focus:border-[#6B7280] focus:outline-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">%</span>
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
