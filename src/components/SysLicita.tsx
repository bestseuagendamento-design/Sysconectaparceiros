import { useState } from 'react';
import { 
  X, Search, Filter, MapPin, Calendar, DollarSign, Building2, FileText, 
  Download, Send, CheckCircle, Clock, AlertCircle, TrendingUp, Award,
  Eye, ChevronRight, Star, Briefcase, Users, Package, Truck, Settings,
  Bot, Sparkles, Calculator, FileCheck, Shield, Target, ArrowRight
} from 'lucide-react';

interface SysLicitaProps {
  onClose: () => void;
  perfilAtual?: 'vidraceiro' | 'prefeitura' | 'fornecedor';
}

export function SysLicita({ onClose, perfilAtual = 'vidraceiro' }: SysLicitaProps) {
  const [telaAtiva, setTelaAtiva] = useState<'lista' | 'detalhe' | 'proposta' | 'enviar' | 'ranking' | 'contrato'>('lista');
  const [licitacaoSelecionada, setLicitacaoSelecionada] = useState<any>(null);
  const [filtros, setFiltros] = useState({
    estado: '',
    cidade: '',
    tipoVidro: '',
    valorMin: '',
    valorMax: '',
    status: 'aberto'
  });
  const [propostaIA, setPropostaIA] = useState<any>(null);
  const [gerandoProposta, setGerandoProposta] = useState(false);

  // DADOS MOCK - Licitações
  const licitacoes = [
    {
      id: 'LIC-001',
      titulo: 'Aquisição de Vidros Temperados para Escolas Municipais',
      objeto: 'Fornecimento e instalação de vidros temperados 10mm em 15 escolas municipais',
      orgao: 'Prefeitura Municipal de São Paulo',
      cidade: 'São Paulo',
      estado: 'SP',
      valorEstimado: 450000,
      dataLimite: '2025-01-15',
      modalidade: 'Pregão Eletrônico',
      status: 'aberto',
      numeroProcesso: '2024/0089-PMF',
      categorias: ['Vidro Temperado', 'Instalação', 'Escolas'],
      prazoExecucao: '90 dias',
      quantidadeItens: 8,
      participantes: 12,
      chanceVitoria: 75,
      risco: 'baixo'
    },
    {
      id: 'LIC-002',
      titulo: 'Esquadrias de Alumínio para Hospital Regional',
      objeto: 'Fornecimento de esquadrias em alumínio linha 25 para ampliação do Hospital Regional',
      orgao: 'Governo do Estado do Rio de Janeiro',
      cidade: 'Niterói',
      estado: 'RJ',
      valorEstimado: 850000,
      dataLimite: '2025-01-20',
      modalidade: 'Concorrência Pública',
      status: 'aberto',
      numeroProcesso: '2024/1245-GRJ',
      categorias: ['Esquadrias', 'Alumínio', 'Saúde'],
      prazoExecucao: '120 dias',
      quantidadeItens: 15,
      participantes: 8,
      chanceVitoria: 60,
      risco: 'médio'
    },
    {
      id: 'LIC-003',
      titulo: 'Fachada Envidraçada para Centro Administrativo',
      objeto: 'Projeto, fornecimento e instalação de fachada cortina em vidro insulado',
      orgao: 'Prefeitura de Belo Horizonte',
      cidade: 'Belo Horizonte',
      estado: 'MG',
      valorEstimado: 2300000,
      dataLimite: '2025-02-05',
      modalidade: 'Tomada de Preços',
      status: 'aberto',
      numeroProcesso: '2024/0567-PMBH',
      categorias: ['Fachada', 'Vidro Insulado', 'Instalação'],
      prazoExecucao: '180 dias',
      quantidadeItens: 25,
      participantes: 5,
      chanceVitoria: 45,
      risco: 'alto'
    },
    {
      id: 'LIC-004',
      titulo: 'Box de Vidro para Habitação Popular',
      objeto: 'Fornecimento e instalação de box de banheiro em vidro temperado 8mm para 200 unidades habitacionais',
      orgao: 'COHAB - Curitiba',
      cidade: 'Curitiba',
      estado: 'PR',
      valorEstimado: 320000,
      dataLimite: '2025-01-18',
      modalidade: 'Pregão Presencial',
      status: 'aberto',
      numeroProcesso: '2024/0923-COHAB',
      categorias: ['Box', 'Vidro Temperado', 'Habitação'],
      prazoExecucao: '60 dias',
      quantidadeItens: 4,
      participantes: 18,
      chanceVitoria: 85,
      risco: 'baixo'
    },
    {
      id: 'LIC-005',
      titulo: 'Guarda-Corpo de Vidro para Prédios Públicos',
      objeto: 'Fornecimento e instalação de guarda-corpo em vidro laminado 10+10mm',
      orgao: 'Secretaria de Obras - Salvador',
      cidade: 'Salvador',
      estado: 'BA',
      valorEstimado: 180000,
      dataLimite: '2025-01-25',
      modalidade: 'Pregão Eletrônico',
      status: 'aberto',
      numeroProcesso: '2024/1567-SEOB',
      categorias: ['Guarda-Corpo', 'Vidro Laminado', 'Instalação'],
      prazoExecucao: '45 dias',
      quantidadeItens: 6,
      participantes: 9,
      chanceVitoria: 70,
      risco: 'baixo'
    },
    {
      id: 'LIC-006',
      titulo: 'Manutenção de Vidros em Edifícios Municipais',
      objeto: 'Serviços de manutenção preventiva e corretiva em vidros de 80 edifícios públicos',
      orgao: 'Prefeitura de Fortaleza',
      cidade: 'Fortaleza',
      estado: 'CE',
      valorEstimado: 520000,
      dataLimite: '2025-02-10',
      modalidade: 'Pregão Eletrônico',
      status: 'aberto',
      numeroProcesso: '2024/0234-PMF',
      categorias: ['Manutenção', 'Serviços', 'Vidro'],
      prazoExecucao: '12 meses',
      quantidadeItens: 12,
      participantes: 14,
      chanceVitoria: 65,
      risco: 'médio'
    }
  ];

  const handleVerDetalhe = (licitacao: any) => {
    setLicitacaoSelecionada(licitacao);
    setTelaAtiva('detalhe');
  };

  const handlePrepararProposta = () => {
    setGerandoProposta(true);
    // Simula geração de proposta pela IA
    setTimeout(() => {
      setPropostaIA({
        materiais: [
          { item: 'Vidro temperado 10mm incolor', quantidade: 850, unidade: 'm²', valorUnitario: 180, total: 153000 },
          { item: 'Perfil alumínio linha 25', quantidade: 420, unidade: 'm', valorUnitario: 85, total: 35700 },
          { item: 'Kit ferragens completo', quantidade: 85, unidade: 'un', valorUnitario: 320, total: 27200 },
          { item: 'Silicone estrutural', quantidade: 140, unidade: 'un', valorUnitario: 45, total: 6300 },
        ],
        maoObra: 98000,
        deslocamento: 12000,
        margem: 0.20,
        subtotal: 332200,
        total: 398640,
        prazo: '90 dias',
        garantia: '36 meses'
      });
      setGerandoProposta(false);
      setTelaAtiva('proposta');
    }, 2500);
  };

  // TELA 01 - LISTAGEM
  const renderLista = () => (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-teal-400" />
          <h3 className="text-white font-bold">Filtros Avançados</h3>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="text-neutral-400 text-sm mb-2 block">Estado</label>
            <select 
              value={filtros.estado}
              onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white text-sm"
            >
              <option value="">Todos</option>
              <option value="SP">São Paulo</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="MG">Minas Gerais</option>
              <option value="PR">Paraná</option>
              <option value="BA">Bahia</option>
              <option value="CE">Ceará</option>
            </select>
          </div>

          <div>
            <label className="text-neutral-400 text-sm mb-2 block">Tipo de Produto</label>
            <select 
              value={filtros.tipoVidro}
              onChange={(e) => setFiltros({...filtros, tipoVidro: e.target.value})}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white text-sm"
            >
              <option value="">Todos</option>
              <option value="temperado">Vidro Temperado</option>
              <option value="laminado">Vidro Laminado</option>
              <option value="insulado">Vidro Insulado</option>
              <option value="esquadrias">Esquadrias</option>
              <option value="box">Box e Divisórias</option>
            </select>
          </div>

          <div>
            <label className="text-neutral-400 text-sm mb-2 block">Valor Mínimo</label>
            <input
              type="number"
              placeholder="R$ 0"
              value={filtros.valorMin}
              onChange={(e) => setFiltros({...filtros, valorMin: e.target.value})}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white text-sm"
            />
          </div>

          <div>
            <label className="text-neutral-400 text-sm mb-2 block">Status</label>
            <select 
              value={filtros.status}
              onChange={(e) => setFiltros({...filtros, status: e.target.value})}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white text-sm"
            >
              <option value="aberto">Abertos</option>
              <option value="disputa">Em Disputa</option>
              <option value="encerrado">Encerrados</option>
              <option value="todos">Todos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Licitações */}
      <div className="space-y-4">
        {licitacoes.map((lic) => (
          <div key={lic.id} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 hover:border-teal-500/50 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-white font-bold text-lg">{lic.titulo}</h3>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    lic.status === 'aberto' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    lic.status === 'disputa' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    'bg-neutral-500/20 text-neutral-400 border border-neutral-500/30'
                  }`}>
                    {lic.status === 'aberto' ? '🟢 ABERTO' : lic.status === 'disputa' ? '🟡 EM DISPUTA' : '⚫ ENCERRADO'}
                  </span>
                </div>
                <p className="text-neutral-400 text-sm mb-3">{lic.objeto}</p>
                
                <div className="grid grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-teal-400" />
                    <span className="text-neutral-300 text-sm">{lic.orgao}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    <span className="text-neutral-300 text-sm">{lic.cidade}/{lic.estado}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-neutral-300 text-sm">R$ {lic.valorEstimado.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span className="text-neutral-300 text-sm">Até {new Date(lic.dataLimite).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>

              {/* Análise IA */}
              <div className="ml-6 text-right">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 text-xs font-bold">Análise IA</span>
                  </div>
                  <div className="text-white text-2xl font-black mb-1">{lic.chanceVitoria}%</div>
                  <div className="text-purple-400 text-xs">Chance de vitória</div>
                </div>
                <div className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  lic.risco === 'baixo' ? 'bg-green-500/20 text-green-400' :
                  lic.risco === 'médio' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  Risco {lic.risco}
                </div>
              </div>
            </div>

            {/* Categorias */}
            <div className="flex items-center gap-2 mb-4">
              {lic.categorias.map((cat, i) => (
                <span key={i} className="px-3 py-1 bg-teal-500/10 border border-teal-500/30 rounded-lg text-teal-400 text-xs">
                  {cat}
                </span>
              ))}
            </div>

            {/* Ações */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleVerDetalhe(lic)}
                className="flex-1 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white hover:bg-neutral-700 transition-all text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Ver Edital Completo
              </button>
              <button
                onClick={() => {
                  setLicitacaoSelecionada(lic);
                  handlePrepararProposta();
                }}
                className="flex-1 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg text-white hover:from-teal-500 hover:to-cyan-500 transition-all text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Preparar Proposta com IA
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // TELA 02 - DETALHE
  const renderDetalhe = () => {
    if (!licitacaoSelecionada) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900/30 to-cyan-900/30 border border-teal-700/50 rounded-2xl p-6">
          <button
            onClick={() => setTelaAtiva('lista')}
            className="text-teal-400 hover:text-teal-300 text-sm mb-4 flex items-center gap-2"
          >
            ← Voltar para lista
          </button>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-white text-2xl font-black mb-2">{licitacaoSelecionada.titulo}</h2>
              <p className="text-neutral-300 mb-4">{licitacaoSelecionada.objeto}</p>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-neutral-500 text-xs mb-1">Número do Processo</div>
                  <div className="text-white font-bold">{licitacaoSelecionada.numeroProcesso}</div>
                </div>
                <div>
                  <div className="text-neutral-500 text-xs mb-1">Modalidade</div>
                  <div className="text-white font-bold">{licitacaoSelecionada.modalidade}</div>
                </div>
                <div>
                  <div className="text-neutral-500 text-xs mb-1">Prazo de Execução</div>
                  <div className="text-white font-bold">{licitacaoSelecionada.prazoExecucao}</div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-neutral-400 text-sm mb-1">Valor Estimado</div>
              <div className="text-green-400 text-3xl font-black mb-2">
                R$ {licitacaoSelecionada.valorEstimado.toLocaleString('pt-BR')}
              </div>
              <div className="text-neutral-500 text-xs">
                {licitacaoSelecionada.participantes} participantes
              </div>
            </div>
          </div>
        </div>

        {/* Arquivos e Documentos */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-400" />
              Documentos da Licitação
            </h3>
            
            <div className="space-y-3">
              {[
                { nome: 'Edital Completo', tipo: 'PDF', tamanho: '2.4 MB' },
                { nome: 'Planilha de Quantidades', tipo: 'XLSX', tamanho: '850 KB' },
                { nome: 'Projeto Arquitetônico', tipo: 'DWG', tamanho: '5.2 MB' },
                { nome: 'Memorial Descritivo', tipo: 'PDF', tamanho: '1.1 MB' },
                { nome: 'Anexo I - Especificações', tipo: 'PDF', tamanho: '680 KB' }
              ].map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-neutral-800/50 border border-neutral-700 rounded-lg hover:border-teal-500/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-500/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <div className="text-white text-sm font-semibold">{doc.nome}</div>
                      <div className="text-neutral-500 text-xs">{doc.tipo} • {doc.tamanho}</div>
                    </div>
                  </div>
                  <button className="p-2 bg-teal-600 hover:bg-teal-500 rounded-lg transition-all">
                    <Download className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Itens Exigidos */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-400" />
              Itens Exigidos pela IA
            </h3>
            
            <div className="space-y-3">
              {[
                { item: 'Vidro temperado 10mm incolor', qtd: '850 m²', prioridade: 'alta' },
                { item: 'Perfil de alumínio linha 25', qtd: '420 m', prioridade: 'alta' },
                { item: 'Porta de correr Suprema', qtd: '40 un', prioridade: 'média' },
                { item: 'Janela maxim-ar linha 25', qtd: '60 un', prioridade: 'média' },
                { item: 'Instalação completa', qtd: '1 serv', prioridade: 'alta' },
                { item: 'Garantia mínima', qtd: '36 meses', prioridade: 'alta' },
                { item: 'ART obrigatória', qtd: '1 doc', prioridade: 'alta' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-neutral-800/50 border border-neutral-700 rounded-lg">
                  <div className="flex-1">
                    <div className="text-white text-sm font-semibold">{item.item}</div>
                    <div className="text-neutral-500 text-xs">{item.qtd}</div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    item.prioridade === 'alta' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {item.prioridade}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Requisitos da Empresa */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-400" />
            Requisitos e Documentação Obrigatória
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            {[
              'Certidão Negativa Federal',
              'Certidão Negativa Estadual',
              'Certidão Negativa Municipal',
              'FGTS Regular',
              'Cadastro na ABNT',
              'Experiência mínima 3 anos',
              'Visita técnica obrigatória',
              'Atestado de capacidade técnica',
              'Balanço patrimonial'
            ].map((req, i) => (
              <div key={i} className="flex items-center gap-2 p-3 bg-neutral-800/50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-neutral-300 text-sm">{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4">
          <button
            onClick={handlePrepararProposta}
            className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl text-white font-bold text-lg hover:from-purple-500 hover:to-purple-600 transition-all flex items-center justify-center gap-3"
          >
            <Bot className="w-6 h-6" />
            Preparar Proposta Automática com IA
          </button>
          <button className="px-8 py-4 bg-neutral-800 border border-neutral-700 rounded-xl text-white font-bold hover:bg-neutral-700 transition-all">
            Simular Preço
          </button>
          <button className="px-8 py-4 bg-neutral-800 border border-neutral-700 rounded-xl text-white font-bold hover:bg-neutral-700 transition-all">
            Ver Histórico
          </button>
        </div>
      </div>
    );
  };

  // TELA 03 - PROPOSTA IA
  const renderProposta = () => {
    if (!propostaIA) return null;

    return (
      <div className="space-y-6">
        <button
          onClick={() => setTelaAtiva('detalhe')}
          className="text-teal-400 hover:text-teal-300 text-sm flex items-center gap-2"
        >
          ← Voltar para detalhes
        </button>

        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white text-2xl font-black">Proposta Gerada pela IA</h2>
              <p className="text-purple-300 text-sm">Análise automática de custos e margem otimizada</p>
            </div>
          </div>
        </div>

        {/* Planilha de Materiais */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4">Planilha de Materiais</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left text-neutral-400 text-sm py-3">Item</th>
                  <th className="text-center text-neutral-400 text-sm py-3">Quantidade</th>
                  <th className="text-center text-neutral-400 text-sm py-3">Unidade</th>
                  <th className="text-right text-neutral-400 text-sm py-3">Valor Unit.</th>
                  <th className="text-right text-neutral-400 text-sm py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {propostaIA.materiais.map((mat: any, i: number) => (
                  <tr key={i} className="border-b border-neutral-800">
                    <td className="text-white text-sm py-4">{mat.item}</td>
                    <td className="text-center text-white text-sm py-4">{mat.quantidade}</td>
                    <td className="text-center text-neutral-400 text-sm py-4">{mat.unidade}</td>
                    <td className="text-right text-green-400 text-sm py-4">R$ {mat.valorUnitario.toFixed(2)}</td>
                    <td className="text-right text-white font-bold text-sm py-4">R$ {mat.total.toLocaleString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumo de Custos */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">Composição de Custos</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg">
                <span className="text-neutral-400">Materiais</span>
                <span className="text-white font-bold">R$ {propostaIA.materiais.reduce((acc: number, m: any) => acc + m.total, 0).toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg">
                <span className="text-neutral-400">Mão de Obra</span>
                <span className="text-white font-bold">R$ {propostaIA.maoObra.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg">
                <span className="text-neutral-400">Deslocamento</span>
                <span className="text-white font-bold">R$ {propostaIA.deslocamento.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-teal-600/20 border border-teal-500/30 rounded-lg">
                <span className="text-teal-400 font-bold">Subtotal</span>
                <span className="text-white font-black">R$ {propostaIA.subtotal.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">Ajustes e Margem</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-neutral-400 text-sm mb-2 block">Margem de Lucro (%)</label>
                <input
                  type="number"
                  defaultValue={20}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white"
                />
              </div>
              
              <div>
                <label className="text-neutral-400 text-sm mb-2 block">Prazo de Execução</label>
                <input
                  type="text"
                  defaultValue={propostaIA.prazo}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="text-neutral-400 text-sm mb-2 block">Garantia</label>
                <input
                  type="text"
                  defaultValue={propostaIA.garantia}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white"
                />
              </div>

              <div className="p-4 bg-gradient-to-r from-green-600/20 to-green-700/20 border border-green-500/30 rounded-xl">
                <div className="text-green-400 text-sm mb-1">Valor Total da Proposta</div>
                <div className="text-white text-3xl font-black">R$ {propostaIA.total.toLocaleString('pt-BR')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-4">
          <button
            onClick={() => setTelaAtiva('enviar')}
            className="flex-1 py-4 bg-gradient-to-r from-green-600 to-green-700 rounded-xl text-white font-bold text-lg hover:from-green-500 hover:to-green-600 transition-all flex items-center justify-center gap-3"
          >
            <ArrowRight className="w-6 h-6" />
            Continuar para Envio
          </button>
          <button className="px-8 py-4 bg-neutral-800 border border-neutral-700 rounded-xl text-white font-bold hover:bg-neutral-700 transition-all">
            Exportar PDF
          </button>
        </div>
      </div>
    );
  };

  // TELA 04 - ENVIAR
  const renderEnviar = () => (
    <div className="space-y-6">
      <button
        onClick={() => setTelaAtiva('proposta')}
        className="text-teal-400 hover:text-teal-300 text-sm flex items-center gap-2"
      >
        ← Voltar para proposta
      </button>

      <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 border border-green-700/50 rounded-2xl p-6">
        <h2 className="text-white text-2xl font-black mb-2">Enviar Proposta</h2>
        <p className="text-neutral-300">Confira todos os documentos antes de enviar</p>
      </div>

      {/* Checklist */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
        <h3 className="text-white font-bold mb-4">Documentos Gerados pela IA</h3>
        
        <div className="space-y-3">
          {[
            { nome: 'Proposta Comercial', status: 'pronto' },
            { nome: 'Proposta Técnica', status: 'pronto' },
            { nome: 'Planilha de Custos', status: 'pronto' },
            { nome: 'Declaração de Capacidade Técnica', status: 'pronto' },
            { nome: 'Certidões (anexadas automaticamente)', status: 'pronto' },
            { nome: 'ART do Responsável Técnico', status: 'pendente' }
          ].map((doc, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-neutral-800/50 border border-neutral-700 rounded-lg">
              <div className="flex items-center gap-3">
                {doc.status === 'pronto' ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                )}
                <span className="text-white font-semibold">{doc.nome}</span>
              </div>
              {doc.status === 'pronto' ? (
                <span className="text-green-400 text-sm font-bold">✓ Pronto</span>
              ) : (
                <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm font-bold transition-all">
                  Anexar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Resumo */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
        <h3 className="text-white font-bold mb-4">Resumo da Proposta</h3>
        
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="text-neutral-500 text-sm mb-1">Valor Total</div>
            <div className="text-green-400 text-2xl font-black">R$ 398.640</div>
          </div>
          <div>
            <div className="text-neutral-500 text-sm mb-1">Prazo de Execução</div>
            <div className="text-white text-2xl font-black">90 dias</div>
          </div>
          <div>
            <div className="text-neutral-500 text-sm mb-1">Garantia</div>
            <div className="text-white text-2xl font-black">36 meses</div>
          </div>
        </div>
      </div>

      {/* Botões Finais */}
      <div className="flex gap-4">
        <button className="flex-1 py-4 bg-gradient-to-r from-green-600 to-green-700 rounded-xl text-white font-bold text-lg hover:from-green-500 hover:to-green-600 transition-all flex items-center justify-center gap-3">
          <Send className="w-6 h-6" />
          Enviar Proposta Agora
        </button>
        <button className="px-8 py-4 bg-neutral-800 border border-neutral-700 rounded-xl text-white font-bold hover:bg-neutral-700 transition-all">
          Salvar Rascunho
        </button>
        <button className="px-8 py-4 bg-neutral-800 border border-neutral-700 rounded-xl text-white font-bold hover:bg-neutral-700 transition-all">
          Imprimir
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-7xl max-h-[95vh] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 bg-gradient-to-r from-teal-900/20 to-cyan-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-600 to-cyan-700 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/50">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-white text-2xl font-black">SysLicita</h2>
                <p className="text-neutral-400 text-sm">Licitações Públicas • Todas as regiões do Brasil</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-neutral-800/50 border border-neutral-700/50 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/50 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navegação por Abas */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => setTelaAtiva('lista')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                telaAtiva === 'lista'
                  ? 'bg-teal-600 text-white'
                  : 'bg-neutral-800/50 text-neutral-400 hover:text-white'
              }`}
            >
              📋 Lista de Licitações
            </button>
            {licitacaoSelecionada && (
              <>
                <ChevronRight className="w-4 h-4 text-neutral-600" />
                <button
                  onClick={() => setTelaAtiva('detalhe')}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    telaAtiva === 'detalhe'
                      ? 'bg-teal-600 text-white'
                      : 'bg-neutral-800/50 text-neutral-400 hover:text-white'
                  }`}
                >
                  📄 Detalhes
                </button>
              </>
            )}
            {propostaIA && (
              <>
                <ChevronRight className="w-4 h-4 text-neutral-600" />
                <button
                  onClick={() => setTelaAtiva('proposta')}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    telaAtiva === 'proposta'
                      ? 'bg-purple-600 text-white'
                      : 'bg-neutral-800/50 text-neutral-400 hover:text-white'
                  }`}
                >
                  🤖 Proposta IA
                </button>
                <ChevronRight className="w-4 h-4 text-neutral-600" />
                <button
                  onClick={() => setTelaAtiva('enviar')}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    telaAtiva === 'enviar'
                      ? 'bg-green-600 text-white'
                      : 'bg-neutral-800/50 text-neutral-400 hover:text-white'
                  }`}
                >
                  📤 Enviar
                </button>
              </>
            )}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-6">
          {gerandoProposta ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-white text-2xl font-bold mb-2">IA Gerando Proposta...</h3>
              <p className="text-neutral-400">Analisando edital, calculando custos e montando documentação</p>
            </div>
          ) : (
            <>
              {telaAtiva === 'lista' && renderLista()}
              {telaAtiva === 'detalhe' && renderDetalhe()}
              {telaAtiva === 'proposta' && renderProposta()}
              {telaAtiva === 'enviar' && renderEnviar()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
