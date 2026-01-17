import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, Edit, Trash2, Save, X, Image as ImageIcon,
  Ruler, Weight, FileText, CheckCircle, AlertTriangle, Upload
} from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface PerfilAluminio {
  codigo: string;
  descricao: string;
  quantidade: number; // metros lineares ou unidades
  pesoPorMetro: number; // kg/m
  unidade: 'METRO' | 'UNIDADE';
}

interface Acessorio {
  codigo: string;
  descricao: string;
  quantidade: number;
  pesoUnitario: number; // kg
  tipo: 'DOBRADICA' | 'TRINCO' | 'PUXADOR' | 'PARAFUSO' | 'OUTRO';
}

interface FormulaVidro {
  largura: string; // ex: "L - 10" (largura do vão menos 10mm)
  altura: string; // ex: "H - 15" (altura do vão menos 15mm)
  observacoes: string;
}

interface Tipologia {
  id: string;
  codigo: string;
  nome: string;
  categoria: 'PORTA' | 'JANELA' | 'SACADA' | 'DIVISORIA';
  imagemUrl: string;
  perfisAluminio: PerfilAluminio[];
  acessorios: Acessorio[];
  formulaVidro: FormulaVidro;
  pesoTotal: number; // calculado automaticamente
  observacoesTecnicas: string;
  normaTecnica: string; // ex: "NBR 10821"
  ativo: boolean;
  dataCriacao: string;
}

export function TipologiasCatalogo() {
  const [tipologias, setTipologias] = useState<Tipologia[]>([]);
  const [loading, setLoading] = useState(false);
  const [editando, setEditando] = useState(false);
  const [tipologiaSelecionada, setTipologiaSelecionada] = useState<Tipologia | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Tipologia>>({
    codigo: '',
    nome: '',
    categoria: 'PORTA',
    imagemUrl: '',
    perfisAluminio: [],
    acessorios: [],
    formulaVidro: {
      largura: 'L - 10',
      altura: 'H - 15',
      observacoes: ''
    },
    observacoesTecnicas: '',
    normaTecnica: 'NBR 10821',
    ativo: true
  });

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec`;

  useEffect(() => {
    loadTipologias();
  }, []);

  const loadTipologias = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/sysconecta/tipologias`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const data = await response.json();
      if (data.success) {
        setTipologias(data.tipologias || []);
      }
    } catch (error) {
      console.error('Erro ao carregar tipologias:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularPesoTotal = (perfis: PerfilAluminio[], acessorios: Acessorio[]): number => {
    const pesoPerfis = perfis.reduce((total, perfil) => {
      if (perfil.unidade === 'METRO') {
        return total + (perfil.quantidade * perfil.pesoPorMetro);
      }
      return total + (perfil.quantidade * perfil.pesoPorMetro); // para unidades, pesoPorMetro é peso unitário
    }, 0);

    const pesoAcessorios = acessorios.reduce((total, acessorio) => {
      return total + (acessorio.quantidade * acessorio.pesoUnitario);
    }, 0);

    return Number((pesoPerfis + pesoAcessorios).toFixed(2));
  };

  const handleAdicionarPerfil = () => {
    const novosPerfis = [...(formData.perfisAluminio || []), {
      codigo: '',
      descricao: '',
      quantidade: 0,
      pesoPorMetro: 0,
      unidade: 'METRO' as const
    }];
    setFormData({ ...formData, perfisAluminio: novosPerfis });
  };

  const handleRemoverPerfil = (index: number) => {
    const novosPerfis = formData.perfisAluminio?.filter((_, i) => i !== index);
    setFormData({ ...formData, perfisAluminio: novosPerfis });
  };

  const handleAdicionarAcessorio = () => {
    const novosAcessorios = [...(formData.acessorios || []), {
      codigo: '',
      descricao: '',
      quantidade: 0,
      pesoUnitario: 0,
      tipo: 'OUTRO' as const
    }];
    setFormData({ ...formData, acessorios: novosAcessorios });
  };

  const handleRemoverAcessorio = (index: number) => {
    const novosAcessorios = formData.acessorios?.filter((_, i) => i !== index);
    setFormData({ ...formData, acessorios: novosAcessorios });
  };

  const handleSalvar = async () => {
    // Validações
    if (!formData.codigo || !formData.nome) {
      alert('❌ Preencha código e nome da tipologia');
      return;
    }

    if (!formData.perfisAluminio || formData.perfisAluminio.length === 0) {
      alert('❌ Adicione pelo menos um perfil de alumínio');
      return;
    }

    // Validar perfis
    for (const perfil of formData.perfisAluminio) {
      if (!perfil.codigo || !perfil.descricao || perfil.quantidade <= 0 || perfil.pesoPorMetro <= 0) {
        alert(`❌ Perfil incompleto: ${perfil.codigo || 'sem código'}`);
        return;
      }
    }

    // Validar acessórios
    for (const acessorio of formData.acessorios || []) {
      if (!acessorio.codigo || !acessorio.descricao || acessorio.quantidade <= 0) {
        alert(`❌ Acessório incompleto: ${acessorio.codigo || 'sem código'}`);
        return;
      }
    }

    setLoading(true);

    try {
      const pesoTotal = calcularPesoTotal(
        formData.perfisAluminio || [],
        formData.acessorios || []
      );

      const tipologia: Tipologia = {
        id: tipologiaSelecionada?.id || `tip_${Date.now()}`,
        codigo: formData.codigo || '',
        nome: formData.nome || '',
        categoria: formData.categoria || 'PORTA',
        imagemUrl: formData.imagemUrl || '',
        perfisAluminio: formData.perfisAluminio || [],
        acessorios: formData.acessorios || [],
        formulaVidro: formData.formulaVidro || {
          largura: 'L - 10',
          altura: 'H - 15',
          observacoes: ''
        },
        pesoTotal,
        observacoesTecnicas: formData.observacoesTecnicas || '',
        normaTecnica: formData.normaTecnica || 'NBR 10821',
        ativo: formData.ativo ?? true,
        dataCriacao: tipologiaSelecionada?.dataCriacao || new Date().toISOString()
      };

      const response = await fetch(`${API_URL}/sysconecta/tipologia`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tipologia)
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Tipologia salva com sucesso!');
        setEditando(false);
        setTipologiaSelecionada(null);
        setFormData({
          codigo: '',
          nome: '',
          categoria: 'PORTA',
          imagemUrl: '',
          perfisAluminio: [],
          acessorios: [],
          formulaVidro: { largura: 'L - 10', altura: 'H - 15', observacoes: '' },
          observacoesTecnicas: '',
          normaTecnica: 'NBR 10821',
          ativo: true
        });
        await loadTipologias();
      } else {
        alert(`❌ Erro: ${data.error}`);
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('❌ Erro ao salvar tipologia');
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (tipologia: Tipologia) => {
    setTipologiaSelecionada(tipologia);
    setFormData(tipologia);
    setEditando(true);
  };

  const handleCancelar = () => {
    setEditando(false);
    setTipologiaSelecionada(null);
    setFormData({
      codigo: '',
      nome: '',
      categoria: 'PORTA',
      imagemUrl: '',
      perfisAluminio: [],
      acessorios: [],
      formulaVidro: { largura: 'L - 10', altura: 'H - 15', observacoes: '' },
      observacoesTecnicas: '',
      normaTecnica: 'NBR 10821',
      ativo: true
    });
  };

  const handleDeletar = async (id: string, nome: string) => {
    if (!confirm(`❌ Tem certeza que deseja deletar a tipologia "${nome}"?`)) return;

    try {
      const response = await fetch(`${API_URL}/sysconecta/tipologia/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Tipologia deletada com sucesso!');
        await loadTipologias();
      } else {
        alert(`❌ Erro: ${data.error}`);
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert('❌ Erro ao deletar tipologia');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 text-2xl">Catálogo de Tipologias</h2>
          <p className="text-gray-600 text-sm mt-1">
            Cadastre tipologias com precisão técnica: perfis, acessórios, fórmulas de vidro
          </p>
        </div>
        {!editando && (
          <button
            onClick={() => setEditando(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Tipologia
          </button>
        )}
      </div>

      {/* Form de Cadastro/Edição */}
      {editando && (
        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900 text-xl">
              {tipologiaSelecionada ? '✏️ Editar Tipologia' : '➕ Nova Tipologia'}
            </h3>
            <button
              onClick={handleCancelar}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Dados Básicos */}
            <div>
              <h4 className="text-gray-900 mb-4">📋 Dados Básicos</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm mb-2">Código *</label>
                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => setFormData({...formData, codigo: e.target.value.toUpperCase()})}
                    placeholder="ex: P-01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">Nome *</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="ex: Porta de Abrir 1 Folha"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">Categoria *</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value as any})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  >
                    <option value="PORTA">PORTA</option>
                    <option value="JANELA">JANELA</option>
                    <option value="SACADA">SACADA</option>
                    <option value="DIVISORIA">DIVISÓRIA</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm mb-2">URL da Imagem</label>
                  <input
                    type="text"
                    value={formData.imagemUrl}
                    onChange={(e) => setFormData({...formData, imagemUrl: e.target.value})}
                    placeholder="https://exemplo.com/imagem.png"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">Norma Técnica</label>
                  <input
                    type="text"
                    value={formData.normaTecnica}
                    onChange={(e) => setFormData({...formData, normaTecnica: e.target.value})}
                    placeholder="ex: NBR 10821"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Perfis de Alumínio */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-gray-900">🔩 Perfis de Alumínio *</h4>
                <button
                  onClick={handleAdicionarPerfil}
                  className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Perfil
                </button>
              </div>

              {formData.perfisAluminio && formData.perfisAluminio.length > 0 ? (
                <div className="space-y-3">
                  {formData.perfisAluminio.map((perfil, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="col-span-2">
                        <label className="block text-gray-600 text-xs mb-1">Código *</label>
                        <input
                          type="text"
                          value={perfil.codigo}
                          onChange={(e) => {
                            const novos = [...formData.perfisAluminio!];
                            novos[index].codigo = e.target.value.toUpperCase();
                            setFormData({...formData, perfisAluminio: novos});
                          }}
                          placeholder="ALU-001"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>

                      <div className="col-span-4">
                        <label className="block text-gray-600 text-xs mb-1">Descrição *</label>
                        <input
                          type="text"
                          value={perfil.descricao}
                          onChange={(e) => {
                            const novos = [...formData.perfisAluminio!];
                            novos[index].descricao = e.target.value;
                            setFormData({...formData, perfisAluminio: novos});
                          }}
                          placeholder="Perfil de Marco 50x30mm"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-gray-600 text-xs mb-1">Qtd *</label>
                        <input
                          type="number"
                          step="0.01"
                          value={perfil.quantidade}
                          onChange={(e) => {
                            const novos = [...formData.perfisAluminio!];
                            novos[index].quantidade = parseFloat(e.target.value) || 0;
                            setFormData({...formData, perfisAluminio: novos});
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-gray-600 text-xs mb-1">Peso/m (kg) *</label>
                        <input
                          type="number"
                          step="0.001"
                          value={perfil.pesoPorMetro}
                          onChange={(e) => {
                            const novos = [...formData.perfisAluminio!];
                            novos[index].pesoPorMetro = parseFloat(e.target.value) || 0;
                            setFormData({...formData, perfisAluminio: novos});
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>

                      <div className="col-span-1">
                        <label className="block text-gray-600 text-xs mb-1">Un.</label>
                        <select
                          value={perfil.unidade}
                          onChange={(e) => {
                            const novos = [...formData.perfisAluminio!];
                            novos[index].unidade = e.target.value as any;
                            setFormData({...formData, perfisAluminio: novos});
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="METRO">m</option>
                          <option value="UNIDADE">un</option>
                        </select>
                      </div>

                      <div className="col-span-1 flex items-end">
                        <button
                          onClick={() => handleRemoverPerfil(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500 text-sm">
                  Nenhum perfil adicionado. Clique em "Adicionar Perfil" para começar.
                </div>
              )}
            </div>

            {/* Acessórios */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-gray-900">🔧 Acessórios</h4>
                <button
                  onClick={handleAdicionarAcessorio}
                  className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Acessório
                </button>
              </div>

              {formData.acessorios && formData.acessorios.length > 0 ? (
                <div className="space-y-3">
                  {formData.acessorios.map((acessorio, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="col-span-2">
                        <label className="block text-gray-600 text-xs mb-1">Código *</label>
                        <input
                          type="text"
                          value={acessorio.codigo}
                          onChange={(e) => {
                            const novos = [...formData.acessorios!];
                            novos[index].codigo = e.target.value.toUpperCase();
                            setFormData({...formData, acessorios: novos});
                          }}
                          placeholder="AC-001"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>

                      <div className="col-span-4">
                        <label className="block text-gray-600 text-xs mb-1">Descrição *</label>
                        <input
                          type="text"
                          value={acessorio.descricao}
                          onChange={(e) => {
                            const novos = [...formData.acessorios!];
                            novos[index].descricao = e.target.value;
                            setFormData({...formData, acessorios: novos});
                          }}
                          placeholder="Dobradiça 3 1/2"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-gray-600 text-xs mb-1">Tipo</label>
                        <select
                          value={acessorio.tipo}
                          onChange={(e) => {
                            const novos = [...formData.acessorios!];
                            novos[index].tipo = e.target.value as any;
                            setFormData({...formData, acessorios: novos});
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="DOBRADICA">Dobradiça</option>
                          <option value="TRINCO">Trinco</option>
                          <option value="PUXADOR">Puxador</option>
                          <option value="PARAFUSO">Parafuso</option>
                          <option value="OUTRO">Outro</option>
                        </select>
                      </div>

                      <div className="col-span-1">
                        <label className="block text-gray-600 text-xs mb-1">Qtd *</label>
                        <input
                          type="number"
                          value={acessorio.quantidade}
                          onChange={(e) => {
                            const novos = [...formData.acessorios!];
                            novos[index].quantidade = parseInt(e.target.value) || 0;
                            setFormData({...formData, acessorios: novos});
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-gray-600 text-xs mb-1">Peso Unit. (kg)</label>
                        <input
                          type="number"
                          step="0.001"
                          value={acessorio.pesoUnitario}
                          onChange={(e) => {
                            const novos = [...formData.acessorios!];
                            novos[index].pesoUnitario = parseFloat(e.target.value) || 0;
                            setFormData({...formData, acessorios: novos});
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>

                      <div className="col-span-1 flex items-end">
                        <button
                          onClick={() => handleRemoverAcessorio(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500 text-sm">
                  Nenhum acessório adicionado (opcional).
                </div>
              )}
            </div>

            {/* Fórmula do Vidro */}
            <div className="border-t pt-6">
              <h4 className="text-gray-900 mb-4">📐 Fórmula de Cálculo do Vidro</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Largura do Vidro (L = largura do vão)
                  </label>
                  <input
                    type="text"
                    value={formData.formulaVidro?.largura}
                    onChange={(e) => setFormData({
                      ...formData, 
                      formulaVidro: {...formData.formulaVidro!, largura: e.target.value}
                    })}
                    placeholder="ex: L - 10 (largura menos 10mm)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Use "L" para largura do vão. Ex: "L - 10" significa largura menos 10mm
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Altura do Vidro (H = altura do vão)
                  </label>
                  <input
                    type="text"
                    value={formData.formulaVidro?.altura}
                    onChange={(e) => setFormData({
                      ...formData, 
                      formulaVidro: {...formData.formulaVidro!, altura: e.target.value}
                    })}
                    placeholder="ex: H - 15 (altura menos 15mm)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Use "H" para altura do vão. Ex: "H - 15" significa altura menos 15mm
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm mb-2">Observações sobre o Vidro</label>
                  <textarea
                    value={formData.formulaVidro?.observacoes}
                    onChange={(e) => setFormData({
                      ...formData, 
                      formulaVidro: {...formData.formulaVidro!, observacoes: e.target.value}
                    })}
                    placeholder="Ex: Vidro temperado 8mm, considerar folga de 2mm em cada lado"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Observações Técnicas */}
            <div className="border-t pt-6">
              <h4 className="text-gray-900 mb-4">📝 Observações Técnicas</h4>
              <textarea
                value={formData.observacoesTecnicas}
                onChange={(e) => setFormData({...formData, observacoesTecnicas: e.target.value})}
                placeholder="Informações adicionais sobre montagem, instalação, etc."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Peso Total Calculado */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Weight className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-gray-700 text-sm">Peso Total Estimado (sem vidro)</p>
                  <p className="text-gray-900 text-2xl">
                    {calcularPesoTotal(
                      formData.perfisAluminio || [],
                      formData.acessorios || []
                    ).toFixed(2)} kg
                  </p>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t">
              <button
                onClick={handleCancelar}
                className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvar}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Salvando...' : 'Salvar Tipologia'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Tipologias */}
      {!editando && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tipologias.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl shadow-lg p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Nenhuma tipologia cadastrada</p>
              <p className="text-gray-500 text-sm">
                Clique em "Nova Tipologia" para começar
              </p>
            </div>
          ) : (
            tipologias.map((tipologia) => (
              <div key={tipologia.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Imagem */}
                {tipologia.imagemUrl ? (
                  <img 
                    src={tipologia.imagemUrl} 
                    alt={tipologia.nome}
                    className="w-full h-48 object-cover bg-gray-100"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}

                {/* Conteúdo */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-gray-600 text-xs mb-1">{tipologia.codigo}</p>
                      <h3 className="text-gray-900">{tipologia.nome}</h3>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {tipologia.categoria}
                    </span>
                  </div>

                  {/* Informações */}
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Ruler className="w-4 h-4" />
                      <span>{tipologia.perfisAluminio.length} perfis</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Package className="w-4 h-4" />
                      <span>{tipologia.acessorios.length} acessórios</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Weight className="w-4 h-4" />
                      <span>{tipologia.pesoTotal} kg</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FileText className="w-4 h-4" />
                      <span>{tipologia.normaTecnica}</span>
                    </div>
                  </div>

                  {/* Fórmula Vidro */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4 text-xs">
                    <p className="text-gray-600 mb-1">Vidro:</p>
                    <p className="text-gray-900">
                      L: {tipologia.formulaVidro.largura} | H: {tipologia.formulaVidro.altura}
                    </p>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditar(tipologia)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeletar(tipologia.id, tipologia.nome)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
