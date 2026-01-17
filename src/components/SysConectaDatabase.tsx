import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Factory, Database, CheckCircle, XCircle, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Fornecedor {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  tipo: 'VIDRO' | 'ALUMINIO' | 'ACESSORIOS';
  estado: string;
  exclusivoEstado: boolean;
  industriaId: string;
  responsavel: {
    nome: string;
    email: string;
    telefone: string;
  };
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  ativo: boolean;
  dataAdesao: string;
}

interface Estatisticas {
  totalFornecedores: number;
  fornecedoresAtivos: number;
  fornecedoresInativos: number;
  porTipo: {
    VIDRO: number;
    ALUMINIO: number;
    ACESSORIOS: number;
  };
  vagasDisponiveis: {
    VIDRO: number;
    ALUMINIO: number;
    ACESSORIOS: number;
  };
  totalVagasPossiveis: number;
  totalVagasOcupadas: number;
  totalVagasDisponiveis: number;
  industrias: {
    vidro: string;
    aluminio: string;
    acessorios: string;
  };
}

interface SysConectaDatabaseProps {
  onBack: () => void;
}

export function SysConectaDatabase({ onBack }: SysConectaDatabaseProps) {
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [activeTab, setActiveTab] = useState<'stats' | 'fornecedores' | 'mapa'>('stats');

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec`;

  // Inicializar banco de dados
  const handleInit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/sysconecta/init`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setInitialized(true);
        alert('✅ Banco de dados SysConecta inicializado com sucesso!');
        await loadData();
      } else {
        alert(`❌ Erro: ${data.error}`);
      }
    } catch (error) {
      console.error('Erro ao inicializar:', error);
      alert('❌ Erro ao inicializar banco de dados');
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados
  const loadData = async () => {
    setLoading(true);
    try {
      // Buscar fornecedores
      const fornecedoresRes = await fetch(`${API_URL}/sysconecta/fornecedores`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      const fornecedoresData = await fornecedoresRes.json();

      if (fornecedoresData.success) {
        setFornecedores(fornecedoresData.fornecedores || []);
        setInitialized(true);
      }

      // Buscar estatísticas
      const statsRes = await fetch(`${API_URL}/sysconecta/estatisticas`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      const statsData = await statsRes.json();

      if (statsData.success) {
        setEstatisticas(statsData.estatisticas);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F7] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 text-3xl mb-2">
                🗄️ SysConecta Database
              </h1>
              <p className="text-gray-600">
                Sistema de Gerenciamento de Fornecedores com Exclusividade Territorial
              </p>
            </div>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
            >
              Voltar
            </button>
          </div>

          {!initialized && (
            <div className="mt-6 p-6 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-yellow-900 mb-2">Banco de dados não inicializado</h3>
                  <p className="text-yellow-800 text-sm mb-4">
                    Clique no botão abaixo para inicializar o banco de dados com os dados padrão:
                  </p>
                  <ul className="text-yellow-800 text-sm mb-4 ml-4 list-disc">
                    <li>1 Fornecedor de Vidro: Santa Rita (SC)</li>
                    <li>1 Indústria: Guardian Glass</li>
                    <li>27 Estados × 3 Tipos = 81 vagas de exclusividade</li>
                  </ul>
                  <button
                    onClick={handleInit}
                    disabled={loading}
                    className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? '⏳ Inicializando...' : '🚀 Inicializar Banco de Dados'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 rounded-lg transition-colors ${
              activeTab === 'stats'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📊 Estatísticas
          </button>
          <button
            onClick={() => setActiveTab('fornecedores')}
            className={`px-6 py-3 rounded-lg transition-colors ${
              activeTab === 'fornecedores'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            🏢 Fornecedores
          </button>
          <button
            onClick={() => setActiveTab('mapa')}
            className={`px-6 py-3 rounded-lg transition-colors ${
              activeTab === 'mapa'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            🗺️ Mapa de Exclusividade
          </button>
        </div>

        {/* Conteúdo */}
        {activeTab === 'stats' && estatisticas && (
          <div className="space-y-6">
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-600 text-sm">Fornecedores Ativos</span>
                </div>
                <div className="text-3xl text-gray-900">{estatisticas.fornecedoresAtivos}</div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600 text-sm">Vagas Ocupadas</span>
                </div>
                <div className="text-3xl text-gray-900">{estatisticas.totalVagasOcupadas}</div>
                <div className="text-xs text-gray-500 mt-1">de {estatisticas.totalVagasPossiveis} vagas</div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-600 text-sm">Vagas Disponíveis</span>
                </div>
                <div className="text-3xl text-gray-900">{estatisticas.totalVagasDisponiveis}</div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Factory className="w-5 h-5 text-orange-600" />
                  <span className="text-gray-600 text-sm">Indústria Parceira</span>
                </div>
                <div className="text-lg text-gray-900 mt-1">Guardian Glass</div>
                <div className="text-xs text-gray-500 mt-1">Vidros (Exclusiva)</div>
              </div>
            </div>

            {/* Distribuição por Tipo */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-gray-900 text-xl mb-6">Distribuição por Tipo de Fornecedor</h2>
              <div className="space-y-4">
                {/* VIDRO */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-blue-600 rounded"></div>
                      <span className="text-gray-700">VIDRO</span>
                    </div>
                    <span className="text-gray-900">
                      {estatisticas.porTipo.VIDRO} / 27 estados
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: `${(estatisticas.porTipo.VIDRO / 27) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {estatisticas.vagasDisponiveis.VIDRO} vagas disponíveis
                  </div>
                </div>

                {/* ALUMÍNIO */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-gray-400 rounded"></div>
                      <span className="text-gray-700">ALUMÍNIO</span>
                    </div>
                    <span className="text-gray-900">
                      {estatisticas.porTipo.ALUMINIO} / 27 estados
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-400"
                      style={{ width: `${(estatisticas.porTipo.ALUMINIO / 27) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {estatisticas.vagasDisponiveis.ALUMINIO} vagas disponíveis
                  </div>
                </div>

                {/* ACESSÓRIOS */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-600 rounded"></div>
                      <span className="text-gray-700">ACESSÓRIOS</span>
                    </div>
                    <span className="text-gray-900">
                      {estatisticas.porTipo.ACESSORIOS} / 27 estados
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600"
                      style={{ width: `${(estatisticas.porTipo.ACESSORIOS / 27) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {estatisticas.vagasDisponiveis.ACESSORIOS} vagas disponíveis
                  </div>
                </div>
              </div>
            </div>

            {/* Regra de Ouro */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-400 rounded-xl shadow-lg p-8">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🎯</div>
                <div className="flex-1">
                  <h3 className="text-amber-900 text-xl mb-3">Regra de Ouro do SysConecta</h3>
                  <div className="space-y-2 text-amber-800">
                    <p className="text-sm">
                      <strong>VIDRACEIRO em SC</strong> → Compra de <strong>Santa Rita (SC)</strong>
                    </p>
                    <p className="text-sm">
                      <strong>VIDRACEIRO em SP</strong> → Compra de <strong>Fornecedor SP</strong> (quando existir)
                    </p>
                    <p className="text-sm mt-4 p-3 bg-amber-100 rounded-lg">
                      ⚠️ O roteamento é baseado no <strong>ESTADO DO VIDRACEIRO</strong>, NÃO no cliente final!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fornecedores' && (
          <div className="space-y-4">
            {fornecedores.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum fornecedor cadastrado</p>
              </div>
            ) : (
              fornecedores.map((fornecedor) => (
                <div key={fornecedor.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
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
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Razão Social:</span>
                          <p className="text-gray-900">{fornecedor.razaoSocial}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">CNPJ:</span>
                          <p className="text-gray-900">{fornecedor.cnpj}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Tipo:</span>
                          <p className="text-gray-900">{fornecedor.tipo}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Estado:</span>
                          <p className="text-gray-900">{fornecedor.estado}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Responsável:</span>
                          <p className="text-gray-900">{fornecedor.responsavel.nome}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <p className="text-gray-900">{fornecedor.responsavel.email}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Cidade:</span>
                          <p className="text-gray-900">{fornecedor.endereco.cidade}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Data de Adesão:</span>
                          <p className="text-gray-900">
                            {new Date(fornecedor.dataAdesao).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-900 text-sm">
                          <Factory className="w-4 h-4" />
                          <span>
                            Compra exclusivamente de: <strong>Guardian Glass</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'mapa' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-gray-900 text-xl mb-6">Mapa de Exclusividade Territorial</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-4 pb-4 border-b">
                <div>Estado</div>
                <div>Vidro</div>
                <div>Alumínio / Acessórios</div>
              </div>

              {/* Santa Catarina (Único com fornecedor) */}
              <div className="grid grid-cols-3 gap-4 text-sm p-4 bg-green-50 rounded-lg">
                <div className="text-gray-900">
                  <MapPin className="inline w-4 h-4 mr-2" />
                  <strong>SC</strong> - Santa Catarina
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-900">Santa Rita Vidros</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Vagas disponíveis</span>
                </div>
              </div>

              {/* Outros estados (exemplos) */}
              {['SP - São Paulo', 'RJ - Rio de Janeiro', 'MG - Minas Gerais', 'PR - Paraná'].map((estado) => (
                <div key={estado} className="grid grid-cols-3 gap-4 text-sm p-4 bg-gray-50 rounded-lg">
                  <div className="text-gray-900">
                    <MapPin className="inline w-4 h-4 mr-2" />
                    {estado}
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">Vaga disponível</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">Vagas disponíveis</span>
                  </div>
                </div>
              ))}

              <div className="text-center text-gray-500 text-sm pt-4">
                ... e mais 22 estados com vagas disponíveis
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
