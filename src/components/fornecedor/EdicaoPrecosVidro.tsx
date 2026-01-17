import React, { useState, useEffect } from 'react';
import { Wine, Save, Loader2, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface EdicaoPrecosVidroProps {
  fornecedorId: string;
  onVoltar: () => void;
}

interface PrecoVidro {
  id?: string;
  tipo: string;
  espessura: string;
  precoM2: number;
  disponivel: boolean;
}

// 🪟 LISTA COMPLETA DE VIDROS GUARDIAN
const VIDROS_GUARDIAN = [
  // FLOAT (COMUM)
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
  
  // TEMPERADO
  { tipo: 'Temperado Incolor', espessura: '6mm', categoria: 'Temperado' },
  { tipo: 'Temperado Incolor', espessura: '8mm', categoria: 'Temperado' },
  { tipo: 'Temperado Incolor', espessura: '10mm', categoria: 'Temperado' },
  { tipo: 'Temperado Verde', espessura: '6mm', categoria: 'Temperado' },
  { tipo: 'Temperado Verde', espessura: '8mm', categoria: 'Temperado' },
  { tipo: 'Temperado Fumê', espessura: '6mm', categoria: 'Temperado' },
  { tipo: 'Temperado Fumê', espessura: '8mm', categoria: 'Temperado' },
  
  // LAMINADO
  { tipo: 'Laminado Incolor', espessura: '3+3', categoria: 'Laminado' },
  { tipo: 'Laminado Incolor', espessura: '4+4', categoria: 'Laminado' },
  { tipo: 'Laminado Incolor', espessura: '5+5', categoria: 'Laminado' },
  { tipo: 'Laminado Verde', espessura: '3+3', categoria: 'Laminado' },
  { tipo: 'Laminado Verde', espessura: '4+4', categoria: 'Laminado' },
  { tipo: 'Laminado Fumê', espessura: '3+3', categoria: 'Laminado' },
  { tipo: 'Laminado Fumê', espessura: '4+4', categoria: 'Laminado' },
  
  // CONTROLE SOLAR
  { tipo: 'Guardian Sun Green', espessura: '6mm', categoria: 'Controle Solar' },
  { tipo: 'Guardian Sun Grey', espessura: '6mm', categoria: 'Controle Solar' },
  { tipo: 'Guardian Neutral Clear', espessura: '6mm', categoria: 'Controle Solar' },
  { tipo: 'Guardian Neutral Grey', espessura: '6mm', categoria: 'Controle Solar' },
  
  // ACÚSTICO
  { tipo: 'Laminado Acústico Incolor', espessura: '6+6', categoria: 'Acústico' },
  { tipo: 'Laminado Acústico Fumê', espessura: '6+6', categoria: 'Acústico' },
  
  // DECORATIVOS
  { tipo: 'Mini Boreal', espessura: '4mm', categoria: 'Decorativo' },
  { tipo: 'Pontilhado', espessura: '4mm', categoria: 'Decorativo' },
  { tipo: 'Canelado', espessura: '4mm', categoria: 'Decorativo' },
  { tipo: 'Ártico', espessura: '4mm', categoria: 'Decorativo' },
];

export function EdicaoPrecosVidro({ fornecedorId, onVoltar }: EdicaoPrecosVidroProps) {
  const [precos, setPrecos] = useState<PrecoVidro[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('Todos');

  useEffect(() => {
    carregarPrecos();
  }, [fornecedorId]);

  const carregarPrecos = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/fornecedor/precos-vidro/${fornecedorId}`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        // Se não tiver preços, inicializar com todos os vidros Guardian
        if (!data.precos || data.precos.length === 0) {
          const precosIniciais = VIDROS_GUARDIAN.map(vidro => ({
            tipo: vidro.tipo,
            espessura: vidro.espessura,
            precoM2: 0,
            disponivel: true
          }));
          setPrecos(precosIniciais);
        } else {
          setPrecos(data.precos);
        }
      } else {
        // Inicializar com todos os vidros se der erro
        const precosIniciais = VIDROS_GUARDIAN.map(vidro => ({
          tipo: vidro.tipo,
          espessura: vidro.espessura,
          precoM2: 0,
          disponivel: true
        }));
        setPrecos(precosIniciais);
      }
    } catch (error) {
      console.error('Erro ao carregar preços:', error);
      // Inicializar com todos os vidros se der erro
      const precosIniciais = VIDROS_GUARDIAN.map(vidro => ({
        tipo: vidro.tipo,
        espessura: vidro.espessura,
        precoM2: 0,
        disponivel: true
      }));
      setPrecos(precosIniciais);
    } finally {
      setLoading(false);
    }
  };

  const atualizarPreco = (index: number, campo: keyof PrecoVidro, valor: any) => {
    const novosPrecos = [...precos];
    novosPrecos[index] = { ...novosPrecos[index], [campo]: valor };
    setPrecos(novosPrecos);
  };

  const salvarPrecos = async () => {
    setSalvando(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/fornecedor/precos-vidro/${fornecedorId}`,
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
        const errorText = await response.text();
        console.error('Erro ao salvar:', errorText);
        toast.error('Erro ao salvar preços');
      }
    } catch (error) {
      console.error('Erro ao salvar preços:', error);
      toast.error('Erro ao salvar preços');
    } finally {
      setSalvando(false);
    }
  };

  const categorias = ['Todos', 'Float', 'Temperado', 'Laminado', 'Controle Solar', 'Acústico', 'Decorativo'];

  const precosFiltrados = categoriaFiltro === 'Todos' 
    ? precos 
    : precos.filter(p => {
        const vidro = VIDROS_GUARDIAN.find(v => v.tipo === p.tipo && v.espessura === p.espessura);
        return vidro?.categoria === categoriaFiltro;
      });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
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
            className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#D4AF37] mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#FFD700] flex items-center justify-center">
                  <Wine className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white">Edição de Preços - Vidros Guardian</h1>
                  <p className="text-[#9CA3AF] text-sm">Configure os preços de {precos.length} tipos de vidro</p>
                </div>
              </div>
            </div>

            <button
              onClick={salvarPrecos}
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
                  Salvar Todos os Preços
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
          <div className="mb-6 p-4 rounded-lg bg-[#0066B2]/10 border border-[#0066B2]/30">
            <div className="flex items-center gap-3">
              <div className="text-5xl">🏢</div>
              <div>
                <p className="text-white font-bold mb-1">PARCERIA GUARDIAN GLASS</p>
                <p className="text-[#9CA3AF] text-sm">
                  Todos os {VIDROS_GUARDIAN.length} tipos de vidro Guardian já estão cadastrados. Configure apenas os preços por m².
                </p>
              </div>
            </div>
          </div>

          {/* Filtro por Categoria */}
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

          {/* Grid de Preços */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {precosFiltrados.map((preco, index) => {
              const vidroInfo = VIDROS_GUARDIAN.find(v => v.tipo === preco.tipo && v.espessura === preco.espessura);
              const indexOriginal = precos.findIndex(p => p.tipo === preco.tipo && p.espessura === preco.espessura);
              
              return (
                <div
                  key={`${preco.tipo}-${preco.espessura}`}
                  className="p-4 bg-[#0F0F0F] border border-[#2D2D2D] rounded-lg hover:border-[#D4AF37] transition-all"
                >
                  {/* Categoria Tag */}
                  <div className="mb-3">
                    <span className="px-2 py-1 text-xs rounded bg-[#D4AF37]/20 text-[#D4AF37] font-medium">
                      {vidroInfo?.categoria}
                    </span>
                  </div>

                  {/* Tipo e Espessura */}
                  <div className="mb-3">
                    <h3 className="text-white font-bold">{preco.tipo}</h3>
                    <p className="text-[#9CA3AF] text-sm">Espessura: {preco.espessura}</p>
                  </div>

                  {/* Preço */}
                  <div className="mb-3">
                    <label className="block text-xs text-[#9CA3AF] mb-2">Preço por m²</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">R$</span>
                      <input
                        type="number"
                        value={preco.precoM2}
                        onChange={(e) => atualizarPreco(indexOriginal, 'precoM2', parseFloat(e.target.value) || 0)}
                        step="0.01"
                        min="0"
                        className="w-full pl-10 pr-3 py-2 bg-[#1A1A1A] border border-[#2D2D2D] rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Disponibilidade */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preco.disponivel}
                      onChange={(e) => atualizarPreco(indexOriginal, 'disponivel', e.target.checked)}
                      className="w-4 h-4 rounded bg-[#1A1A1A] border-[#2D2D2D] text-[#D4AF37] focus:ring-[#D4AF37]"
                    />
                    <span className="text-sm text-[#9CA3AF]">Disponível em estoque</span>
                  </label>
                </div>
              );
            })}
          </div>

          {/* Resumo */}
          <div className="mt-8 p-4 rounded-lg bg-[#2D2D2D]/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-[#9CA3AF] text-sm mb-1">Total de Vidros</p>
                <p className="text-white text-2xl font-black">{precos.length}</p>
              </div>
              <div>
                <p className="text-[#9CA3AF] text-sm mb-1">Disponíveis</p>
                <p className="text-emerald-400 text-2xl font-black">
                  {precos.filter(p => p.disponivel).length}
                </p>
              </div>
              <div>
                <p className="text-[#9CA3AF] text-sm mb-1">Com Preço</p>
                <p className="text-[#D4AF37] text-2xl font-black">
                  {precos.filter(p => p.precoM2 > 0).length}
                </p>
              </div>
              <div>
                <p className="text-[#9CA3AF] text-sm mb-1">Sem Preço</p>
                <p className="text-orange-400 text-2xl font-black">
                  {precos.filter(p => p.precoM2 === 0).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
