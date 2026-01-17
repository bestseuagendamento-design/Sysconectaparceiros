import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, Edit, Trash2, Save, X, Image as ImageIcon,
  Ruler, Weight, FileText, CheckCircle, AlertTriangle, Upload,
  Layers, Calculator, Scissors, Eye, ChevronDown, ChevronRight
} from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { PreviewTipologia } from './PreviewTipologia';
import { TIPOLOGIA_L001 } from './TipologiaL001Data';

// ════════════════════════════════════════════════════════════════════
// 📋 TIPOS E INTERFACES
// ════════════════════════════════════════════════════════════════════

interface PerfilFormula {
  codigo: string;
  nome: string;
  formula: string; // Ex: "L", "H * 2", "(L + 12) / 2"
  pesoKgMetro: number;
  tamanhoBarraDisponivel: number; // mm (geralmente 6000)
  kerfDisco: number; // mm (geralmente 5)
  usinagens?: string; // Ex: "Furo Ø4.5mm a 12mm da borda"
  observacoes?: string;
}

interface VidroFormula {
  nome: string;
  larguraFormula: string; // Ex: "((L + 12) / 2) - 72"
  alturaFormula: string; // Ex: "(H - 45) - 72"
  espessuras: string[]; // Ex: ["4mm", "6mm", "8mm"]
  cores: string[]; // Ex: ["Clear", "French Green"]
  observacoes: string;
}

interface AcessorioFormula {
  codigo: string;
  nome: string;
  tipo: 'FIXO' | 'FORMULA'; // Fixo = quantidade fixa, Formula = calculada
  quantidadeFixa?: number;
  formula?: string; // Ex: "4" ou "((H-45)*4)+(((L+12)/2)*4)"
  unidade: 'UNIDADE' | 'METRO' | 'KG';
  observacoes?: string;
}

interface Tipologia {
  id: string;
  codigo: string; // Ex: L001
  nome: string; // Ex: Janela de Correr 2 Folhas
  linha: string; // Ex: LINHA SUPREMA
  categoria: string; // Ex: JANELA
  descricao: string;
  imagemUrl: string;
  
  // PERFIS DE ALUMÍNIO
  perfis: PerfilFormula[];
  
  // VIDROS
  vidros: VidroFormula[];
  
  // ACESSÓRIOS
  acessorios: AcessorioFormula[];
  
  // OPCIONAIS
  opcionais: {
    nome: string;
    perfisAdicionais?: PerfilFormula[];
    acessoriosAdicionais?: AcessorioFormula[];
  }[];
  
  // ACABAMENTOS DISPONÍVEIS
  acabamentosAluminio: string[];
  
  // CONFIGURAÇÕES
  permiteReaproveitamento: boolean;
  normaTecnica: string;
  
  // STATUS
  status: 'PENDENTE' | 'APROVADO' | 'INATIVO';
  dataCriacao: string;
  dataAprovacao?: string;
}

interface Linha {
  nome: string;
  descricao: string;
  tipologias: Tipologia[];
}

// ════════════════════════════════════════════════════════════════════
// 🎨 COMPONENTE PRINCIPAL
// ════════════════════════════════════════════════════════════════════

export function TipologiasLinhas() {
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [loading, setLoading] = useState(false);
  const [editando, setEditando] = useState(false);
  const [tipologiaSelecionada, setTipologiaSelecionada] = useState<Tipologia | null>(null);
  const [linhaExpandida, setLinhaExpandida] = useState<string | null>(null);
  const [previewAberto, setPreviewAberto] = useState(false);
  const [tipologiaPreview, setTipologiaPreview] = useState<Tipologia | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Tipologia>>({
    codigo: '',
    nome: '',
    linha: 'LINHA SUPREMA',
    categoria: 'JANELA',
    descricao: '',
    imagemUrl: '',
    perfis: [],
    vidros: [],
    acessorios: [],
    opcionais: [],
    acabamentosAluminio: ['Branco', 'Preto', 'Bronze', 'Fosco', 'Amadeirado'],
    permiteReaproveitamento: true,
    normaTecnica: 'NBR 10821',
    status: 'PENDENTE'
  });

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec`;

  const LINHAS_DISPONIVEIS = [
    'LINHA SUPREMA',
    'LINHA INTEGRADA',
    'LINHA TEMPERADO',
    'LINHA POLAR',
    'LINHA PV-MIL'
  ];

  const CATEGORIAS = ['JANELA', 'PORTA', 'SACADA', 'BOX', 'DIVISORIA'];

  const ACABAMENTOS_PADRAO = [
    'Branco',
    'Preto',
    'Bronze',
    'Fosco',
    'Amadeirado Claro',
    'Amadeirado Escuro'
  ];

  const VIDROS_GUARDIAN = [
    'Clear (Incolor)',
    'French Green',
    'Euro Grey',
    'Royal Silver',
    'Sky Blue',
    'Neutral'
  ];

  useEffect(() => {
    loadTipologias();
  }, []);

  const loadTipologias = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/sysconecta/tipologias/linhas`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const data = await response.json();
      if (data.success) {
        setLinhas(data.linhas || []);
      }
    } catch (error) {
      console.error('Erro ao carregar tipologias:', error);
    } finally {
      setLoading(false);
    }
  };

  // ════════════════════════════════════════════════════════════════════
  // 🔧 HANDLERS - PERFIS
  // ════════════════════════════════════════════════════════════════════

  const handleAdicionarPerfil = () => {
    const novosPerfis = [...(formData.perfis || []), {
      codigo: '',
      nome: '',
      formula: 'L',
      pesoKgMetro: 0,
      tamanhoBarraDisponivel: 6000,
      kerfDisco: 5,
      observacoes: ''
    }];
    setFormData({ ...formData, perfis: novosPerfis });
  };

  const handleRemoverPerfil = (index: number) => {
    const novosPerfis = formData.perfis?.filter((_, i) => i !== index);
    setFormData({ ...formData, perfis: novosPerfis });
  };

  const handleEditarPerfil = (index: number, campo: string, valor: any) => {
    const novosPerfis = [...(formData.perfis || [])];
    novosPerfis[index] = { ...novosPerfis[index], [campo]: valor };
    setFormData({ ...formData, perfis: novosPerfis });
  };

  // ════════════════════════════════════════════════════════════════════
  // 🔧 HANDLERS - VIDROS
  // ════════════════════════════════════════════════════════════════════

  const handleAdicionarVidro = () => {
    const novosVidros = [...(formData.vidros || []), {
      nome: 'Vidro Principal',
      larguraFormula: '((L + 12) / 2) - 72',
      alturaFormula: '(H - 45) - 72',
      espessuras: ['4mm', '6mm', '8mm'],
      cores: VIDROS_GUARDIAN,
      observacoes: 'Vidro temperado Guardian Glass'
    }];
    setFormData({ ...formData, vidros: novosVidros });
  };

  const handleRemoverVidro = (index: number) => {
    const novosVidros = formData.vidros?.filter((_, i) => i !== index);
    setFormData({ ...formData, vidros: novosVidros });
  };

  // ════════════════════════════════════════════════════════════════════
  // 🔧 HANDLERS - ACESSÓRIOS
  // ════════════════════════════════════════════════════════════════════

  const handleAdicionarAcessorio = () => {
    const novosAcessorios = [...(formData.acessorios || []), {
      codigo: '',
      nome: '',
      tipo: 'FIXO' as const,
      quantidadeFixa: 1,
      unidade: 'UNIDADE' as const,
      observacoes: ''
    }];
    setFormData({ ...formData, acessorios: novosAcessorios });
  };

  const handleRemoverAcessorio = (index: number) => {
    const novosAcessorios = formData.acessorios?.filter((_, i) => i !== index);
    setFormData({ ...formData, acessorios: novosAcessorios });
  };

  // ════════════════════════════════════════════════════════════════════
  // 💾 SALVAR TIPOLOGIA
  // ════════════════════════════════════════════════════════════════════

  const handleSalvar = async () => {
    // Validações
    if (!formData.codigo || !formData.nome || !formData.linha) {
      alert('❌ Preencha código, nome e linha da tipologia');
      return;
    }

    if (!formData.perfis || formData.perfis.length === 0) {
      alert('❌ Adicione pelo menos um perfil de alumínio');
      return;
    }

    if (!formData.vidros || formData.vidros.length === 0) {
      alert('❌ Adicione pelo menos uma especificação de vidro');
      return;
    }

    // Validar perfis
    for (const perfil of formData.perfis) {
      if (!perfil.codigo || !perfil.nome || !perfil.formula) {
        alert(`❌ Perfil incompleto: ${perfil.codigo || 'sem código'}`);
        return;
      }
    }

    setLoading(true);

    try {
      const tipologia: Tipologia = {
        id: tipologiaSelecionada?.id || `tip_${Date.now()}`,
        codigo: formData.codigo || '',
        nome: formData.nome || '',
        linha: formData.linha || 'LINHA SUPREMA',
        categoria: formData.categoria || 'JANELA',
        descricao: formData.descricao || '',
        imagemUrl: formData.imagemUrl || '',
        perfis: formData.perfis || [],
        vidros: formData.vidros || [],
        acessorios: formData.acessorios || [],
        opcionais: formData.opcionais || [],
        acabamentosAluminio: formData.acabamentosAluminio || [],
        permiteReaproveitamento: formData.permiteReaproveitamento ?? true,
        normaTecnica: formData.normaTecnica || 'NBR 10821',
        status: formData.status || 'PENDENTE',
        dataCriacao: tipologiaSelecionada?.dataCriacao || new Date().toISOString()
      };

      const response = await fetch(`${API_URL}/sysconecta/tipologia/linha`, {
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
        resetForm();
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

  const resetForm = () => {
    setFormData({
      codigo: '',
      nome: '',
      linha: 'LINHA SUPREMA',
      categoria: 'JANELA',
      descricao: '',
      imagemUrl: '',
      perfis: [],
      vidros: [],
      acessorios: [],
      opcionais: [],
      acabamentosAluminio: ['Branco', 'Preto', 'Bronze', 'Fosco', 'Amadeirado'],
      permiteReaproveitamento: true,
      normaTecnica: 'NBR 10821',
      status: 'PENDENTE'
    });
  };

  const handleEditar = (tipologia: Tipologia) => {
    setTipologiaSelecionada(tipologia);
    setFormData(tipologia);
    setEditando(true);
  };

  const handleCancelar = () => {
    setEditando(false);
    setTipologiaSelecionada(null);
    resetForm();
  };

  const handleAprovar = async (id: string) => {
    if (!confirm('✅ Aprovar esta tipologia? Ela ficará disponível para todos os vidraceiros.')) return;

    try {
      const response = await fetch(`${API_URL}/sysconecta/tipologia/${id}/aprovar`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Tipologia aprovada com sucesso!');
        await loadTipologias();
      } else {
        alert(`❌ Erro: ${data.error}`);
      }
    } catch (error) {
      console.error('Erro ao aprovar:', error);
      alert('❌ Erro ao aprovar tipologia');
    }
  };

  const handleDeletar = async (id: string, nome: string) => {
    if (!confirm(`❌ Tem certeza que deseja deletar "${nome}"?`)) return;

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

  const handlePreview = (tipologia: Tipologia) => {
    setTipologiaPreview(tipologia);
    setPreviewAberto(true);
  };

  // ════════════════════════════════════════════════════════════════════
  // 📝 PREVIEW DA TIPOLOGIA L001 (SEM CADASTRAR AINDA)
  // ════════════════════════════════════════════════════════════════════

  const handlePreviewL001 = () => {
    // Criar objeto da L001 para preview (NÃO SALVA NO BANCO)
    const tipologiaL001: Tipologia = TIPOLOGIA_L001;

    // MOSTRAR O PREVIEW
    setTipologiaPreview(tipologiaL001);
    setPreviewAberto(true);
  };

  // ════════════════════════════════════════════════════════════════════
  // 💾 SALVAR TIPOLOGIA L001 (APÓS APROVAÇÃO NO PREVIEW)
  // ════════════════════════════════════════════════════════════════════

  const handleSalvarL001AposAprovacao = async () => {
    if (!tipologiaPreview) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/tipologias`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...tipologiaPreview,
            id: undefined // Remove o ID temporário
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao cadastrar: ${errorText}`);
      }

      alert('✅ Tipologia L001 cadastrada com sucesso!');
      await loadTipologias();
    } catch (error: any) {
      console.error('Erro ao cadastrar L001:', error);
      alert(`❌ Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ════════════════════════════════════════════════════════════════════
  // 🎨 RENDER
  // ════════════════════════════════════════════════════════════════════

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 text-2xl">📋 Linhas de Tipologias</h2>
          <p className="text-gray-600 text-sm mt-1">
            Sistema de tipologias com variáveis dinâmicas (L, H, Qtd) e motor de aproveitamento de barras
          </p>
        </div>
        <div className="flex gap-3">
          {!editando && (
            <>
              <button
                onClick={handlePreviewL001}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-lg"
              >
                <Eye className="w-5 h-5" />
                🔍 PREVIEW L001 (Janela 2 Folhas)
              </button>
              <button
                onClick={() => setEditando(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nova Tipologia
              </button>
            </>
          )}
        </div>
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
                    placeholder="ex: L001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">Linha *</label>
                  <select
                    value={formData.linha}
                    onChange={(e) => setFormData({...formData, linha: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  >
                    {LINHAS_DISPONIVEIS.map(linha => (
                      <option key={linha} value={linha}>{linha}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">Categoria *</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  >
                    {CATEGORIAS.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm mb-2">Nome *</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="ex: Janela de Correr 2 Folhas"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    required
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

                <div className="md:col-span-3">
                  <label className="block text-gray-700 text-sm mb-2">Descrição</label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    placeholder="Descrição técnica da tipologia"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-gray-700 text-sm mb-2">URL da Imagem</label>
                  <input
                    type="text"
                    value={formData.imagemUrl}
                    onChange={(e) => setFormData({...formData, imagemUrl: e.target.value})}
                    placeholder="https://exemplo.com/imagem.png"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Perfis de Alumínio com Fórmulas */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-gray-900">🔩 Perfis de Alumínio (Fórmulas Dinâmicas) *</h4>
                  <p className="text-gray-500 text-xs mt-1">
                    Use L para largura, H para altura. Ex: "L", "H * 2", "(L + 12) / 2"
                  </p>
                </div>
                <button
                  onClick={handleAdicionarPerfil}
                  className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Perfil
                </button>
              </div>

              {formData.perfis && formData.perfis.length > 0 ? (
                <div className="space-y-3">
                  {formData.perfis.map((perfil, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-2">
                          <label className="block text-gray-600 text-xs mb-1">Código *</label>
                          <input
                            type="text"
                            value={perfil.codigo}
                            onChange={(e) => handleEditarPerfil(index, 'codigo', e.target.value.toUpperCase())}
                            placeholder="SU-001"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>

                        <div className="col-span-3">
                          <label className="block text-gray-600 text-xs mb-1">Nome *</label>
                          <input
                            type="text"
                            value={perfil.nome}
                            onChange={(e) => handleEditarPerfil(index, 'nome', e.target.value)}
                            placeholder="Trilho Superior"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-gray-600 text-xs mb-1">Fórmula *</label>
                          <input
                            type="text"
                            value={perfil.formula}
                            onChange={(e) => handleEditarPerfil(index, 'formula', e.target.value)}
                            placeholder="L ou H*2"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-mono"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-gray-600 text-xs mb-1">Peso/m (kg) *</label>
                          <input
                            type="number"
                            step="0.001"
                            value={perfil.pesoKgMetro}
                            onChange={(e) => handleEditarPerfil(index, 'pesoKgMetro', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-gray-600 text-xs mb-1">Barra (mm)</label>
                          <input
                            type="number"
                            value={perfil.tamanhoBarraDisponivel}
                            onChange={(e) => handleEditarPerfil(index, 'tamanhoBarraDisponivel', parseInt(e.target.value) || 6000)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
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

                      <div className="mt-2">
                        <input
                          type="text"
                          value={perfil.observacoes || ''}
                          onChange={(e) => handleEditarPerfil(index, 'observacoes', e.target.value)}
                          placeholder="Observações técnicas"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs text-gray-600"
                        />
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

            {/* Vidros */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-gray-900">🪟 Cálculo de Vidros *</h4>
                  <p className="text-gray-500 text-xs mt-1">
                    Fórmulas para largura e altura do vidro. Usa L (largura vão) e H (altura vão)
                  </p>
                </div>
                <button
                  onClick={handleAdicionarVidro}
                  className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Vidro
                </button>
              </div>

              {formData.vidros && formData.vidros.length > 0 ? (
                <div className="space-y-4">
                  {formData.vidros.map((vidro, index) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <input
                          type="text"
                          value={vidro.nome}
                          onChange={(e) => {
                            const novos = [...formData.vidros!];
                            novos[index].nome = e.target.value;
                            setFormData({...formData, vidros: novos});
                          }}
                          className="px-3 py-1 border border-gray-300 rounded"
                          placeholder="Nome do vidro"
                        />
                        <button
                          onClick={() => handleRemoverVidro(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-gray-600 text-xs mb-1">Fórmula Largura *</label>
                          <input
                            type="text"
                            value={vidro.larguraFormula}
                            onChange={(e) => {
                              const novos = [...formData.vidros!];
                              novos[index].larguraFormula = e.target.value;
                              setFormData({...formData, vidros: novos});
                            }}
                            placeholder="((L + 12) / 2) - 72"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-600 text-xs mb-1">Fórmula Altura *</label>
                          <input
                            type="text"
                            value={vidro.alturaFormula}
                            onChange={(e) => {
                              const novos = [...formData.vidros!];
                              novos[index].alturaFormula = e.target.value;
                              setFormData({...formData, vidros: novos});
                            }}
                            placeholder="(H - 45) - 72"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-mono"
                          />
                        </div>
                      </div>

                      <div className="mt-2">
                        <label className="block text-gray-600 text-xs mb-1">Observações</label>
                        <input
                          type="text"
                          value={vidro.observacoes}
                          onChange={(e) => {
                            const novos = [...formData.vidros!];
                            novos[index].observacoes = e.target.value;
                            setFormData({...formData, vidros: novos});
                          }}
                          placeholder="Ex: Vidro temperado Guardian Glass 8mm"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500 text-sm">
                  Nenhum vidro adicionado. Clique em "Adicionar Vidro" para começar.
                </div>
              )}
            </div>

            {/* Acessórios */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-gray-900">🔧 Acessórios</h4>
                  <p className="text-gray-500 text-xs mt-1">
                    Quantidade fixa ou calculada por fórmula
                  </p>
                </div>
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
                    <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-2">
                          <label className="block text-gray-600 text-xs mb-1">Código</label>
                          <input
                            type="text"
                            value={acessorio.codigo}
                            onChange={(e) => {
                              const novos = [...formData.acessorios!];
                              novos[index].codigo = e.target.value.toUpperCase();
                              setFormData({...formData, acessorios: novos});
                            }}
                            placeholder="ROL-001"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>

                        <div className="col-span-3">
                          <label className="block text-gray-600 text-xs mb-1">Nome</label>
                          <input
                            type="text"
                            value={acessorio.nome}
                            onChange={(e) => {
                              const novos = [...formData.acessorios!];
                              novos[index].nome = e.target.value;
                              setFormData({...formData, acessorios: novos});
                            }}
                            placeholder="Roldana 4 Rodas"
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
                            <option value="FIXO">Fixo</option>
                            <option value="FORMULA">Fórmula</option>
                          </select>
                        </div>

                        <div className="col-span-2">
                          <label className="block text-gray-600 text-xs mb-1">
                            {acessorio.tipo === 'FIXO' ? 'Qtd Fixa' : 'Fórmula'}
                          </label>
                          {acessorio.tipo === 'FIXO' ? (
                            <input
                              type="number"
                              value={acessorio.quantidadeFixa || 0}
                              onChange={(e) => {
                                const novos = [...formData.acessorios!];
                                novos[index].quantidadeFixa = parseInt(e.target.value) || 0;
                                setFormData({...formData, acessorios: novos});
                              }}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          ) : (
                            <input
                              type="text"
                              value={acessorio.formula || ''}
                              onChange={(e) => {
                                const novos = [...formData.acessorios!];
                                novos[index].formula = e.target.value;
                                setFormData({...formData, acessorios: novos});
                              }}
                              placeholder="4 ou L*2"
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-mono"
                            />
                          )}
                        </div>

                        <div className="col-span-2">
                          <label className="block text-gray-600 text-xs mb-1">Unidade</label>
                          <select
                            value={acessorio.unidade}
                            onChange={(e) => {
                              const novos = [...formData.acessorios!];
                              novos[index].unidade = e.target.value as any;
                              setFormData({...formData, acessorios: novos});
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="UNIDADE">Unidade</option>
                            <option value="METRO">Metro</option>
                            <option value="KG">Kg</option>
                          </select>
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
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500 text-sm">
                  Nenhum acessório adicionado (opcional).
                </div>
              )}
            </div>

            {/* Configurações */}
            <div className="border-t pt-6">
              <h4 className="text-gray-900 mb-4">⚙️ Configurações</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.permiteReaproveitamento ?? true}
                      onChange={(e) => setFormData({...formData, permiteReaproveitamento: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700 text-sm">Permitir reaproveitamento de retalhos</span>
                  </label>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="PENDENTE">⏳ Pendente</option>
                    <option value="APROVADO">✅ Aprovado</option>
                    <option value="INATIVO">❌ Inativo</option>
                  </select>
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

      {/* Lista de Linhas e Tipologias */}
      {!editando && (
        <div className="space-y-4">
          {linhas.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Nenhuma tipologia cadastrada</p>
              <p className="text-gray-500 text-sm">
                Clique em "Nova Tipologia" para começar
              </p>
            </div>
          ) : (
            linhas.map((linha) => (
              <div key={linha.nome} className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header da Linha */}
                <button
                  onClick={() => setLinhaExpandida(linhaExpandida === linha.nome ? null : linha.nome)}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {linhaExpandida === linha.nome ? (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    )}
                    <div className="text-left">
                      <h3 className="text-gray-900 text-lg">{linha.nome}</h3>
                      <p className="text-gray-500 text-sm">
                        {linha.tipologias.length} tipologia(s)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {linha.tipologias.filter(t => t.status === 'APROVADO').length > 0 && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        {linha.tipologias.filter(t => t.status === 'APROVADO').length} aprovada(s)
                      </span>
                    )}
                    {linha.tipologias.filter(t => t.status === 'PENDENTE').length > 0 && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                        {linha.tipologias.filter(t => t.status === 'PENDENTE').length} pendente(s)
                      </span>
                    )}
                  </div>
                </button>

                {/* Tipologias da Linha */}
                {linhaExpandida === linha.nome && (
                  <div className="p-6 bg-gray-50 border-t grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {linha.tipologias.map((tipologia) => (
                      <div key={tipologia.id} className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-gray-600 text-xs">{tipologia.codigo}</p>
                            <h4 className="text-gray-900">{tipologia.nome}</h4>
                          </div>
                          {tipologia.status === 'APROVADO' && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                          {tipologia.status === 'PENDENTE' && (
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                          )}
                        </div>

                        <div className="space-y-1 text-sm text-gray-600 mb-4">
                          <p>📐 {tipologia.perfis.length} perfis</p>
                          <p>🪟 {tipologia.vidros.length} vidro(s)</p>
                          <p>🔧 {tipologia.acessorios.length} acessório(s)</p>
                        </div>

                        <div className="space-y-2">
                          {/* BOTÃO PRINCIPAL: PREVIEW/TESTAR */}
                          <button
                            onClick={() => handlePreview(tipologia)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
                          >
                            <Eye className="w-4 h-4" />
                            🔍 TESTAR E VISUALIZAR
                          </button>

                          {/* Outros botões menores */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditar(tipologia)}
                              className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
                            >
                              <Edit className="w-3 h-3" />
                              Editar
                            </button>
                            {tipologia.status === 'PENDENTE' && (
                              <button
                                onClick={() => alert('⚠️ Use o botão "TESTAR E VISUALIZAR" para aprovar após conferir todos os cálculos!')}
                                className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-xs"
                              >
                                <AlertTriangle className="w-3 h-3" />
                                Pendente
                              </button>
                            )}
                            <button
                              onClick={() => handleDeletar(tipologia.id, tipologia.nome)}
                              className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Preview da Tipologia */}
      {previewAberto && tipologiaPreview && (
        <PreviewTipologia
          tipologia={tipologiaPreview}
          onClose={() => setPreviewAberto(false)}
          onAprovar={() => {
            // Se for preview da L001, salvar primeiro
            if (tipologiaPreview.id === 'preview-temp') {
              handleSalvarL001AposAprovacao();
            } else {
              // Senão, só aprovar
              handleAprovar(tipologiaPreview.id);
            }
          }}
        />
      )}
    </div>
  );
}