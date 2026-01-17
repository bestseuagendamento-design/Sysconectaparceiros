import React, { useState, useEffect } from 'react';
import { 
  Shield, Building2, Factory, Users, DollarSign, FileText, 
  TrendingUp, LogOut, Plus, Edit, Trash2, Eye, Download,
  CheckCircle, XCircle, Search, Filter, Calendar
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { InicializarSistema } from './admin/InicializarSistema';
import { TipologiasLinhas } from './admin/TipologiasLinhas';
import { CadastrarTipologiaL001 } from './admin/CadastrarTipologiaL001';

interface Fornecedor {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  tipo: 'VIDRO' | 'ALUMINIO' | 'ACESSORIOS';
  estado: string;
  responsavel: {
    nome: string;
    email: string;
    telefone: string;
  };
  endereco: {
    cidade: string;
    estado: string;
  };
  ativo: boolean;
  dataAdesao: string;
}

interface Comprovante {
  id: string;
  fornecedor_nome: string;
  vidraceiro_nome: string;
  valor: number;
  data: string;
  comprovante_url: string;
  status: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'fornecedores' | 'industrias' | 'empresas' | 'comprovantes' | 'cadastrar' | 'tipologias'>('overview');
  const [loading, setLoading] = useState(false);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [comprovantes, setComprovantes] = useState<Comprovante[]>([]);
  const [estatisticas, setEstatisticas] = useState<any>(null);

  // Form para novo fornecedor
  const [novoFornecedor, setNovoFornecedor] = useState({
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    tipo: 'VIDRO' as 'VIDRO' | 'ALUMINIO' | 'ACESSORIOS',
    estado: 'SC',
    responsavel: {
      nome: '',
      email: '',
      telefone: ''
    },
    endereco: {
      logradouro: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: 'SC',
      cep: ''
    }
  });

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec`;

  // Carregar dados
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Carregar fornecedores
      const fornecedoresRes = await fetch(`${API_URL}/sysconecta/fornecedores`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const fornecedoresData = await fornecedoresRes.json();
      if (fornecedoresData.success) {
        setFornecedores(fornecedoresData.fornecedores || []);
      }

      // Carregar estatísticas
      const statsRes = await fetch(`${API_URL}/sysconecta/estatisticas`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setEstatisticas(statsData.estatisticas);
      }

      // Carregar comprovantes de pagamento
      const comprovantesRes = await fetch(`${API_URL}/admin/comprovantes`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const comprovantesData = await comprovantesRes.json();
      if (comprovantesData.success) {
        setComprovantes(comprovantesData.comprovantes || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCadastrarFornecedor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fornecedor = {
        id: `${novoFornecedor.tipo.toLowerCase()}_${novoFornecedor.estado.toLowerCase()}_${Date.now()}`,
        ...novoFornecedor,
        exclusivoEstado: true,
        industriaId: novoFornecedor.tipo === 'VIDRO' ? 'guardian_glass' : '',
        ativo: true,
        dataAdesao: new Date().toISOString()
      };

      const response = await fetch(`${API_URL}/sysconecta/fornecedor`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fornecedor)
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Fornecedor cadastrado com sucesso!');
        setNovoFornecedor({
          razaoSocial: '',
          nomeFantasia: '',
          cnpj: '',
          tipo: 'VIDRO',
          estado: 'SC',
          responsavel: { nome: '', email: '', telefone: '' },
          endereco: { logradouro: '', numero: '', bairro: '', cidade: '', estado: 'SC', cep: '' }
        });
        await loadData();
        setActiveTab('fornecedores');
      } else {
        alert(`❌ Erro: ${data.error}`);
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('❌ Erro ao cadastrar fornecedor');
    } finally {
      setLoading(false);
    }
  };

  const handleInativarFornecedor = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja inativar ${nome}?`)) return;

    try {
      const response = await fetch(`${API_URL}/sysconecta/fornecedor/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Fornecedor inativado com sucesso!');
        await loadData();
      } else {
        alert(`❌ Erro: ${data.error}`);
      }
    } catch (error) {
      console.error('Erro ao inativar:', error);
      alert('❌ Erro ao inativar fornecedor');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sysconecta_admin_logged');
    localStorage.removeItem('sysconecta_admin_email');
    onLogout();
  };

  const ESTADOS = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Fixo */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-lg">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl">Painel Master</h1>
                <p className="text-gray-400 text-sm">SysConecta Administração</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Navegação em Tabs */}
      <div className="bg-white border-b shadow-sm sticky top-[76px] z-40">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 whitespace-nowrap transition-colors border-b-2 ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('cadastrar')}
              className={`px-6 py-4 whitespace-nowrap transition-colors border-b-2 ${
                activeTab === 'cadastrar'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              ➕ Cadastrar Fornecedor
            </button>
            <button
              onClick={() => setActiveTab('fornecedores')}
              className={`px-6 py-4 whitespace-nowrap transition-colors border-b-2 ${
                activeTab === 'fornecedores'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              🏢 Fornecedores ({fornecedores.length})
            </button>
            <button
              onClick={() => setActiveTab('industrias')}
              className={`px-6 py-4 whitespace-nowrap transition-colors border-b-2 ${
                activeTab === 'industrias'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              🏭 Indústrias
            </button>
            <button
              onClick={() => setActiveTab('empresas')}
              className={`px-6 py-4 whitespace-nowrap transition-colors border-b-2 ${
                activeTab === 'empresas'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              🏪 Empresas Conectadas
            </button>
            <button
              onClick={() => setActiveTab('comprovantes')}
              className={`px-6 py-4 whitespace-nowrap transition-colors border-b-2 ${
                activeTab === 'comprovantes'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              💰 Comprovantes & Comissões
            </button>
            <button
              onClick={() => setActiveTab('tipologias')}
              className={`px-6 py-4 whitespace-nowrap transition-colors border-b-2 ${
                activeTab === 'tipologias'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📋 Tipologias
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* OVERVIEW */}
        {activeTab === 'overview' && estatisticas && (
          <div className="space-y-6">
            {/* Botão de Inicialização */}
            <InicializarSistema />

            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
                <div className="flex items-center justify-between mb-2">
                  <Building2 className="w-8 h-8 text-blue-600" />
                  <span className="text-2xl text-gray-900">{estatisticas.fornecedoresAtivos}</span>
                </div>
                <p className="text-gray-600 text-sm">Fornecedores Ativos</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <span className="text-2xl text-gray-900">{estatisticas.totalVagasOcupadas}</span>
                </div>
                <p className="text-gray-600 text-sm">Vagas Ocupadas</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                  <span className="text-2xl text-gray-900">{estatisticas.totalVagasDisponiveis}</span>
                </div>
                <p className="text-gray-600 text-sm">Vagas Disponíveis</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-600">
                <div className="flex items-center justify-between mb-2">
                  <Factory className="w-8 h-8 text-orange-600" />
                  <span className="text-2xl text-gray-900">1</span>
                </div>
                <p className="text-gray-600 text-sm">Indústrias Parceiras</p>
              </div>
            </div>

            {/* Distribuição por Tipo */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-gray-900 text-xl mb-6">Distribuição por Tipo</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">VIDRO</span>
                    <span className="text-gray-900">{estatisticas.porTipo.VIDRO} / 27</span>
                  </div>
                  <div className="w-full h-4 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${(estatisticas.porTipo.VIDRO / 27) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">ALUMÍNIO</span>
                    <span className="text-gray-900">{estatisticas.porTipo.ALUMINIO} / 27</span>
                  </div>
                  <div className="w-full h-4 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-gray-500 rounded-full"
                      style={{ width: `${(estatisticas.porTipo.ALUMINIO / 27) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">ACESSÓRIOS</span>
                    <span className="text-gray-900">{estatisticas.porTipo.ACESSORIOS} / 27</span>
                  </div>
                  <div className="w-full h-4 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-green-600 rounded-full"
                      style={{ width: `${(estatisticas.porTipo.ACESSORIOS / 27) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CADASTRAR FORNECEDOR */}
        {activeTab === 'cadastrar' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-gray-900 text-2xl mb-6">➕ Cadastrar Novo Fornecedor</h2>

            <form onSubmit={handleCadastrarFornecedor} className="space-y-6">
              {/* Dados Básicos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Razão Social *</label>
                  <input
                    type="text"
                    value={novoFornecedor.razaoSocial}
                    onChange={(e) => setNovoFornecedor({...novoFornecedor, razaoSocial: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Nome Fantasia *</label>
                  <input
                    type="text"
                    value={novoFornecedor.nomeFantasia}
                    onChange={(e) => setNovoFornecedor({...novoFornecedor, nomeFantasia: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">CNPJ *</label>
                  <input
                    type="text"
                    value={novoFornecedor.cnpj}
                    onChange={(e) => setNovoFornecedor({...novoFornecedor, cnpj: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    placeholder="00.000.000/0000-00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Tipo *</label>
                  <select
                    value={novoFornecedor.tipo}
                    onChange={(e) => setNovoFornecedor({...novoFornecedor, tipo: e.target.value as any})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    required
                  >
                    <option value="VIDRO">VIDRO</option>
                    <option value="ALUMINIO">ALUMÍNIO</option>
                    <option value="ACESSORIOS">ACESSÓRIOS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Estado *</label>
                  <select
                    value={novoFornecedor.estado}
                    onChange={(e) => setNovoFornecedor({
                      ...novoFornecedor, 
                      estado: e.target.value,
                      endereco: { ...novoFornecedor.endereco, estado: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    required
                  >
                    {ESTADOS.map(estado => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Responsável */}
              <div className="border-t pt-6">
                <h3 className="text-gray-900 text-lg mb-4">Responsável</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Nome *</label>
                    <input
                      type="text"
                      value={novoFornecedor.responsavel.nome}
                      onChange={(e) => setNovoFornecedor({
                        ...novoFornecedor, 
                        responsavel: {...novoFornecedor.responsavel, nome: e.target.value}
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={novoFornecedor.responsavel.email}
                      onChange={(e) => setNovoFornecedor({
                        ...novoFornecedor, 
                        responsavel: {...novoFornecedor.responsavel, email: e.target.value}
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Telefone *</label>
                    <input
                      type="tel"
                      value={novoFornecedor.responsavel.telefone}
                      onChange={(e) => setNovoFornecedor({
                        ...novoFornecedor, 
                        responsavel: {...novoFornecedor.responsavel, telefone: e.target.value}
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      placeholder="(00) 00000-0000"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="border-t pt-6">
                <h3 className="text-gray-900 text-lg mb-4">Endereço</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Logradouro *</label>
                    <input
                      type="text"
                      value={novoFornecedor.endereco.logradouro}
                      onChange={(e) => setNovoFornecedor({
                        ...novoFornecedor, 
                        endereco: {...novoFornecedor.endereco, logradouro: e.target.value}
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Número *</label>
                    <input
                      type="text"
                      value={novoFornecedor.endereco.numero}
                      onChange={(e) => setNovoFornecedor({
                        ...novoFornecedor, 
                        endereco: {...novoFornecedor.endereco, numero: e.target.value}
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Bairro *</label>
                    <input
                      type="text"
                      value={novoFornecedor.endereco.bairro}
                      onChange={(e) => setNovoFornecedor({
                        ...novoFornecedor, 
                        endereco: {...novoFornecedor.endereco, bairro: e.target.value}
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Cidade *</label>
                    <input
                      type="text"
                      value={novoFornecedor.endereco.cidade}
                      onChange={(e) => setNovoFornecedor({
                        ...novoFornecedor, 
                        endereco: {...novoFornecedor.endereco, cidade: e.target.value}
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">CEP *</label>
                    <input
                      type="text"
                      value={novoFornecedor.endereco.cep}
                      onChange={(e) => setNovoFornecedor({
                        ...novoFornecedor, 
                        endereco: {...novoFornecedor.endereco, cep: e.target.value}
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      placeholder="00000-000"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Botão */}
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ Cadastrando...' : '✅ Cadastrar Fornecedor'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* FORNECEDORES */}
        {activeTab === 'fornecedores' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-900 text-2xl">Fornecedores Cadastrados</h2>
              <button
                onClick={() => setActiveTab('cadastrar')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Novo Fornecedor
              </button>
            </div>

            {fornecedores.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum fornecedor cadastrado</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {fornecedores.map((fornecedor) => (
                  <div key={fornecedor.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <Building2 className="w-6 h-6 text-blue-600" />
                          <h3 className="text-gray-900 text-xl">{fornecedor.nomeFantasia}</h3>
                          {fornecedor.ativo ? (
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              Ativo
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                              Inativo
                            </span>
                          )}
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {fornecedor.tipo}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 block">Razão Social</span>
                            <span className="text-gray-900">{fornecedor.razaoSocial}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 block">CNPJ</span>
                            <span className="text-gray-900">{fornecedor.cnpj}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 block">Estado</span>
                            <span className="text-gray-900">{fornecedor.estado}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 block">Cidade</span>
                            <span className="text-gray-900">{fornecedor.endereco?.cidade || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 block">Responsável</span>
                            <span className="text-gray-900">{fornecedor.responsavel?.nome || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 block">Email</span>
                            <span className="text-gray-900">{fornecedor.responsavel?.email || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 block">Telefone</span>
                            <span className="text-gray-900">{fornecedor.responsavel?.telefone || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 block">Data de Adesão</span>
                            <span className="text-gray-900">
                              {new Date(fornecedor.dataAdesao).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        {fornecedor.ativo && (
                          <button
                            onClick={() => handleInativarFornecedor(fornecedor.id, fornecedor.nomeFantasia)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Inativar"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* INDÚSTRIAS */}
        {activeTab === 'industrias' && (
          <div className="space-y-6">
            <h2 className="text-gray-900 text-2xl">Indústrias Parceiras</h2>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start gap-6">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl flex-shrink-0">
                  <Factory className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-gray-900 text-xl">Guardian Glass</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Ativa
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      VIDRO
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Indústria EXCLUSIVA de vidros para todos os fornecedores do SysConecta
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Parceria desde: 01/01/2024</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 rounded-xl p-8 text-center">
              <Factory className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">Indústrias de Alumínio e Acessórios</p>
              <p className="text-gray-500 text-sm">Ainda não definidas</p>
            </div>
          </div>
        )}

        {/* EMPRESAS CONECTADAS */}
        {activeTab === 'empresas' && (
          <div className="space-y-6">
            <h2 className="text-gray-900 text-2xl">Empresas Conectadas ao SysConecta</h2>

            {/* Fornecedores por Segmento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900">Fornecedores de Vidro</h3>
                    <p className="text-gray-600 text-sm">{estatisticas?.porTipo.VIDRO || 0} empresas</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {fornecedores.filter(f => f.tipo === 'VIDRO' && f.ativo).map(f => (
                    <div key={f.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="text-gray-900 text-sm">{f.nomeFantasia}</p>
                        <p className="text-gray-600 text-xs">{f.estado}</p>
                      </div>
                    </div>
                  ))}
                  {estatisticas?.porTipo.VIDRO === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">Nenhuma empresa</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900">Fornecedores de Alumínio</h3>
                    <p className="text-gray-600 text-sm">{estatisticas?.porTipo.ALUMINIO || 0} empresas</p>
                  </div>
                </div>
                <p className="text-gray-500 text-sm text-center py-4">Nenhuma empresa cadastrada</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900">Fornecedores de Acessórios</h3>
                    <p className="text-gray-600 text-sm">{estatisticas?.porTipo.ACESSORIOS || 0} empresas</p>
                  </div>
                </div>
                <p className="text-gray-500 text-sm text-center py-4">Nenhuma empresa cadastrada</p>
              </div>
            </div>

            {/* Vidraceiros */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-purple-600" />
                <h3 className="text-gray-900 text-lg">Vidraceiros Ativos</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Lista de vidraceiros será carregada do sistema de autenticação
              </p>
            </div>
          </div>
        )}

        {/* COMPROVANTES & COMISSÕES */}
        {activeTab === 'comprovantes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-900 text-2xl">Comprovantes de Pagamento & Comissões</h2>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  Exportar
                </button>
              </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm mb-2">Período</label>
                  <input
                    type="month"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-2">Fornecedor</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600">
                    <option value="">Todos</option>
                    {fornecedores.map(f => (
                      <option key={f.id} value={f.id}>{f.nomeFantasia}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-2">Status</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600">
                    <option value="">Todos</option>
                    <option value="pendente">Pendente</option>
                    <option value="aprovado">Aprovado</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <Filter className="w-4 h-4 inline mr-2" />
                    Filtrar
                  </button>
                </div>
              </div>
            </div>

            {/* Resumo de Comissões */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-gray-600 text-sm">Comissões do Mês</p>
                    <p className="text-gray-900 text-2xl">
                      R$ {comprovantes
                        .filter(c => {
                          const data = new Date(c.data_pagamento);
                          const hoje = new Date();
                          return data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear();
                        })
                        .reduce((sum, c) => sum + (c.comissao_sysconecta || 0), 0)
                        .toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-gray-600 text-sm">Total de Comprovantes</p>
                    <p className="text-gray-900 text-2xl">{comprovantes.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-gray-600 text-sm">Comissão Total Acumulada</p>
                    <p className="text-gray-900 text-2xl">
                      R$ {comprovantes.reduce((sum, c) => sum + (c.comissao_sysconecta || 0), 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Comprovantes */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-gray-900 text-lg mb-4">Histórico de Comprovantes</h3>
              
              {comprovantes.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Nenhum comprovante registrado</p>
                  <p className="text-gray-500 text-sm">
                    Os comprovantes anexados pelos vidraceiros aparecerão aqui
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Data</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Fornecedor</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Vidraceiro</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Categoria</th>
                        <th className="px-4 py-3 text-right text-xs text-gray-600">Valor</th>
                        <th className="px-4 py-3 text-right text-xs text-gray-600">Comissão (5%)</th>
                        <th className="px-4 py-3 text-center text-xs text-gray-600">Comprovante</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {comprovantes.map((comprovante) => (
                        <tr key={comprovante.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {new Date(comprovante.data_pagamento).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {comprovante.fornecedor_nome}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {comprovante.vidraceiro_nome}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                              {comprovante.categoria}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900 text-right">
                            R$ {comprovante.valor.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 text-sm text-green-600 text-right">
                            R$ {(comprovante.comissao_sysconecta || 0).toFixed(2)}
                          </td>
                          <td className="px-4 py-4 text-sm text-center">
                            <a
                              href={comprovante.comprovante_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700"
                            >
                              <Eye className="w-4 h-4" />
                              Ver
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TIPOLOGIAS */}
        {activeTab === 'tipologias' && (
          <div className="space-y-6">
            <h2 className="text-gray-900 text-2xl">Tipologias de Produtos</h2>

            <CadastrarTipologiaL001 />
            <TipologiasLinhas />
          </div>
        )}
      </div>
    </div>
  );
}