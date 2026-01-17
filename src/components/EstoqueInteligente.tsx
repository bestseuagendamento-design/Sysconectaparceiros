import { useState } from 'react';
import { X, Plus, Edit2, Trash2, Package, AlertTriangle, TrendingDown, Search, Filter, Download, Upload, CheckCircle, XCircle } from 'lucide-react';

interface ItemEstoque {
  id: string;
  categoria: string;
  nome: string;
  descricao: string;
  quantidade: number;
  estoqueMinimo: number;
  unidade: string;
  valorUnitario: number;
  localizacao: string;
  fornecedor: string;
  ultimaCompra: string;
}

interface EstoqueInteligenteProps {
  onClose: () => void;
  theme?: 'light' | 'dark';
}

export function EstoqueInteligente({ onClose, theme = 'light' }: EstoqueInteligenteProps) {
  const [itens, setItens] = useState<ItemEstoque[]>([
    // PERFIS
    { id: '1', categoria: 'Perfis', nome: 'Perfil de Alumínio Branco 6m', descricao: 'Perfil para janela', quantidade: 45, estoqueMinimo: 20, unidade: 'un', valorUnitario: 89.90, localizacao: 'Prateleira A1', fornecedor: 'AlumiBrasil', ultimaCompra: '2024-12-01' },
    { id: '2', categoria: 'Perfis', nome: 'Perfil de Alumínio Preto 6m', descricao: 'Perfil para box', quantidade: 32, estoqueMinimo: 15, unidade: 'un', valorUnitario: 95.50, localizacao: 'Prateleira A2', fornecedor: 'AlumiBrasil', ultimaCompra: '2024-12-05' },
    { id: '3', categoria: 'Perfis', nome: 'Perfil H para Box 2,10m', descricao: 'Perfil H acabamento', quantidade: 28, estoqueMinimo: 20, unidade: 'un', valorUnitario: 45.00, localizacao: 'Prateleira A3', fornecedor: 'PerfilTech', ultimaCompra: '2024-11-28' },
    { id: '4', categoria: 'Perfis', nome: 'Perfil U para Porta 2,10m', descricao: 'Perfil U porta de correr', quantidade: 8, estoqueMinimo: 15, unidade: 'un', valorUnitario: 52.00, localizacao: 'Prateleira A4', fornecedor: 'PerfilTech', ultimaCompra: '2024-11-20' },
    
    // VIDROS
    { id: '5', categoria: 'Vidros', nome: 'Vidro Temperado Incolor 8mm', descricao: 'Chapa 2,20x1,60m', quantidade: 12, estoqueMinimo: 10, unidade: 'chapa', valorUnitario: 385.00, localizacao: 'Cavalete 1', fornecedor: 'Vidraçaria São Paulo', ultimaCompra: '2024-12-08' },
    { id: '6', categoria: 'Vidros', nome: 'Vidro Temperado Fumê 8mm', descricao: 'Chapa 2,20x1,60m', quantidade: 8, estoqueMinimo: 8, unidade: 'chapa', valorUnitario: 425.00, localizacao: 'Cavalete 2', fornecedor: 'Vidraçaria São Paulo', ultimaCompra: '2024-12-08' },
    { id: '7', categoria: 'Vidros', nome: 'Vidro Temperado Verde 8mm', descricao: 'Chapa 2,20x1,60m', quantidade: 5, estoqueMinimo: 6, unidade: 'chapa', valorUnitario: 445.00, localizacao: 'Cavalete 3', fornecedor: 'VidroSul', ultimaCompra: '2024-11-25' },
    { id: '8', categoria: 'Vidros', nome: 'Vidro Laminado 8mm', descricao: 'Chapa 2,20x1,60m', quantidade: 6, estoqueMinimo: 5, unidade: 'chapa', valorUnitario: 520.00, localizacao: 'Cavalete 4', fornecedor: 'VidroSul', ultimaCompra: '2024-12-01' },
    
    // FIXAÇÃO
    { id: '9', categoria: 'Fixação', nome: 'Parafuso Auto Atarrachante 25mm', descricao: 'Caixa com 1000 unidades', quantidade: 15, estoqueMinimo: 10, unidade: 'cx', valorUnitario: 45.00, localizacao: 'Armário B1', fornecedor: 'FixaBem', ultimaCompra: '2024-12-03' },
    { id: '10', categoria: 'Fixação', nome: 'Parafuso Auto Atarrachante 50mm', descricao: 'Caixa com 500 unidades', quantidade: 8, estoqueMinimo: 8, unidade: 'cx', valorUnitario: 38.00, localizacao: 'Armário B2', fornecedor: 'FixaBem', ultimaCompra: '2024-12-03' },
    { id: '11', categoria: 'Fixação', nome: 'Bucha Fischer S8', descricao: 'Caixa com 500 unidades', quantidade: 22, estoqueMinimo: 12, unidade: 'cx', valorUnitario: 62.00, localizacao: 'Armário B3', fornecedor: 'FixaBem', ultimaCompra: '2024-12-05' },
    { id: '12', categoria: 'Fixação', nome: 'Bucha Química 300ml', descricao: 'Cartucho para fixação pesada', quantidade: 18, estoqueMinimo: 15, unidade: 'un', valorUnitario: 28.50, localizacao: 'Armário B4', fornecedor: 'QuimiFixa', ultimaCompra: '2024-12-07' },
    
    // VEDAÇÃO
    { id: '13', categoria: 'Vedação', nome: 'Silicone Transparente 280ml', descricao: 'Cartucho profissional', quantidade: 12, estoqueMinimo: 20, unidade: 'un', valorUnitario: 12.50, localizacao: 'Armário C1', fornecedor: 'SiliconeBrasil', ultimaCompra: '2024-11-30' },
    { id: '14', categoria: 'Vedação', nome: 'Silicone Branco 280ml', descricao: 'Cartucho profissional', quantidade: 16, estoqueMinimo: 18, unidade: 'un', valorUnitario: 12.50, localizacao: 'Armário C2', fornecedor: 'SiliconeBrasil', ultimaCompra: '2024-11-30' },
    { id: '15', categoria: 'Vedação', nome: 'Silicone Preto 280ml', descricao: 'Cartucho profissional', quantidade: 9, estoqueMinimo: 15, unidade: 'un', valorUnitario: 13.00, localizacao: 'Armário C3', fornecedor: 'SiliconeBrasil', ultimaCompra: '2024-11-28' },
    { id: '16', categoria: 'Vedação', nome: 'Borracha U para Vidro 8mm', descricao: 'Rolo com 50 metros', quantidade: 7, estoqueMinimo: 10, unidade: 'rolo', valorUnitario: 95.00, localizacao: 'Armário C4', fornecedor: 'BorrachasTech', ultimaCompra: '2024-11-25' },
    { id: '17', categoria: 'Vedação', nome: 'Borracha Dupla para Box', descricao: 'Rolo com 50 metros', quantidade: 5, estoqueMinimo: 8, unidade: 'rolo', valorUnitario: 110.00, localizacao: 'Armário C5', fornecedor: 'BorrachasTech', ultimaCompra: '2024-11-25' },
    
    // FERRAMENTAS
    { id: '18', categoria: 'Ferramentas', nome: 'Ventosa Dupla Profissional', descricao: 'Capacidade 80kg', quantidade: 4, estoqueMinimo: 3, unidade: 'un', valorUnitario: 185.00, localizacao: 'Armário D1', fornecedor: 'FerramentasPro', ultimaCompra: '2024-10-15' },
    { id: '19', categoria: 'Ferramentas', nome: 'Cortador de Vidro Profissional', descricao: 'Com depósito de óleo', quantidade: 3, estoqueMinimo: 2, unidade: 'un', valorUnitario: 95.00, localizacao: 'Armário D2', fornecedor: 'FerramentasPro', ultimaCompra: '2024-09-20' },
    { id: '20', categoria: 'Ferramentas', nome: 'Esquadro de Alumínio 60cm', descricao: 'Profissional reforçado', quantidade: 2, estoqueMinimo: 2, unidade: 'un', valorUnitario: 78.00, localizacao: 'Armário D3', fornecedor: 'FerramentasPro', ultimaCompra: '2024-08-10' },
  ]);

  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [modalAberto, setModalAberto] = useState(false);
  const [itemEditando, setItemEditando] = useState<ItemEstoque | null>(null);
  const [modoEdicao, setModoEdicao] = useState(false);

  const [formData, setFormData] = useState<Partial<ItemEstoque>>({
    categoria: 'Perfis',
    nome: '',
    descricao: '',
    quantidade: 0,
    estoqueMinimo: 0,
    unidade: 'un',
    valorUnitario: 0,
    localizacao: '',
    fornecedor: '',
    ultimaCompra: new Date().toISOString().split('T')[0],
  });

  const categorias = ['todas', 'Perfis', 'Vidros', 'Fixação', 'Vedação', 'Ferramentas'];

  const itensFiltrados = itens.filter(item => {
    const passaBusca = item.nome.toLowerCase().includes(busca.toLowerCase()) ||
                       item.descricao.toLowerCase().includes(busca.toLowerCase());
    const passaCategoria = categoriaFiltro === 'todas' || item.categoria === categoriaFiltro;
    return passaBusca && passaCategoria;
  });

  const itensEmFalta = itens.filter(item => item.quantidade < item.estoqueMinimo);
  const valorTotalEstoque = itens.reduce((acc, item) => acc + (item.quantidade * item.valorUnitario), 0);

  const abrirModalNovo = () => {
    setFormData({
      categoria: 'Perfis',
      nome: '',
      descricao: '',
      quantidade: 0,
      estoqueMinimo: 0,
      unidade: 'un',
      valorUnitario: 0,
      localizacao: '',
      fornecedor: '',
      ultimaCompra: new Date().toISOString().split('T')[0],
    });
    setItemEditando(null);
    setModoEdicao(false);
    setModalAberto(true);
  };

  const abrirModalEdicao = (item: ItemEstoque) => {
    setFormData(item);
    setItemEditando(item);
    setModoEdicao(true);
    setModalAberto(true);
  };

  const salvarItem = () => {
    if (!formData.nome || !formData.descricao) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    if (modoEdicao && itemEditando) {
      setItens(itens.map(item => item.id === itemEditando.id ? { ...formData, id: item.id } as ItemEstoque : item));
    } else {
      const novoItem: ItemEstoque = {
        ...formData as ItemEstoque,
        id: Date.now().toString(),
      };
      setItens([...itens, novoItem]);
    }

    setModalAberto(false);
  };

  const excluirItem = (id: string) => {
    if (confirm('Deseja realmente excluir este item?')) {
      setItens(itens.filter(item => item.id !== id));
    }
  };

  const ajustarQuantidade = (id: string, delta: number) => {
    setItens(itens.map(item => 
      item.id === id ? { ...item, quantidade: Math.max(0, item.quantidade + delta) } : item
    ));
  };

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6">
      <div className={`${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border rounded-2xl w-full max-w-7xl max-h-[90vh] flex flex-col shadow-2xl transition-all duration-300`}>
        
        {/* Header */}
        <div className={`p-4 md:p-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Package className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h2 className={`${isDark ? 'text-white' : 'text-slate-900'} text-lg md:text-2xl font-bold tracking-tight`}>Estoque Inteligente</h2>
                <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-xs md:text-sm`}>Gestão completa de materiais e insumos</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className={`${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'} border rounded-xl p-3 md:p-4`}>
              <div className="text-blue-500 text-xs font-bold uppercase tracking-wider mb-1">Total de Itens</div>
              <div className={`${isDark ? 'text-white' : 'text-slate-900'} text-xl md:text-2xl font-black`}>{itens.length}</div>
            </div>
            <div className={`${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100'} border rounded-xl p-3 md:p-4`}>
              <div className="text-red-500 text-xs font-bold uppercase tracking-wider mb-1">Itens em Falta</div>
              <div className={`${isDark ? 'text-white' : 'text-slate-900'} text-xl md:text-2xl font-black`}>{itensEmFalta.length}</div>
            </div>
            <div className={`${isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'} border rounded-xl p-3 md:p-4`}>
              <div className="text-emerald-500 text-xs font-bold uppercase tracking-wider mb-1">Valor Total</div>
              <div className={`${isDark ? 'text-white' : 'text-slate-900'} text-xl md:text-2xl font-black`}>R$ {valorTotalEstoque.toLocaleString('pt-BR')}</div>
            </div>
            <div className={`${isDark ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-100'} border rounded-xl p-3 md:p-4`}>
              <div className="text-purple-500 text-xs font-bold uppercase tracking-wider mb-1">Categorias</div>
              <div className={`${isDark ? 'text-white' : 'text-slate-900'} text-xl md:text-2xl font-black`}>{categorias.length - 1}</div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className={`p-4 md:p-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'} flex flex-col md:flex-row items-stretch md:items-center gap-4`}>
          <div className="flex-1 relative">
            <Search className={`w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'} absolute left-3 top-1/2 -translate-y-1/2`} />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className={`w-full ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'} border rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <Filter className={`w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'} flex-shrink-0`} />
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoriaFiltro(cat)}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-semibold text-xs md:text-sm transition-all whitespace-nowrap ${
                  categoriaFiltro === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : isDark 
                      ? 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {cat === 'todas' ? 'Todas' : cat}
              </button>
            ))}
          </div>

          <button
            onClick={abrirModalNovo}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span className="md:hidden">Novo</span>
            <span className="hidden md:inline">Novo Item</span>
          </button>
        </div>

        {/* Lista de Itens */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="space-y-3">
            {itensFiltrados.map(item => {
              const emFalta = item.quantidade < item.estoqueMinimo;
              const valorTotal = item.quantidade * item.valorUnitario;

              return (
                <div
                  key={item.id}
                  className={`${isDark ? 'bg-slate-800 border-slate-700 hover:border-blue-500/50' : 'bg-white border-slate-200 hover:border-blue-300'} border rounded-xl p-4 transition-all shadow-sm`}
                >
                  <div className="flex flex-col md:flex-row items-start gap-4">
                    {/* Categoria Badge */}
                    <div className="hidden md:flex w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg items-center justify-center flex-shrink-0 shadow-md">
                      <Package className="w-6 h-6 text-white" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-sm md:text-base`}>{item.nome}</h3>
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide border ${isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                              {item.categoria}
                            </span>
                            {emFalta && (
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide border flex items-center gap-1 ${isDark ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                <AlertTriangle className="w-3 h-3" />
                                Estoque Baixo
                              </span>
                            )}
                          </div>
                          <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-xs md:text-sm`}>{item.descricao}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => abrirModalEdicao(item)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => excluirItem(item.id)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isDark ? 'bg-slate-700 text-red-400 hover:bg-red-900/20' : 'bg-slate-100 text-red-500 hover:bg-red-50'}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-4">
                        <div className={`${isDark ? 'bg-slate-900/50' : 'bg-slate-50'} rounded-lg p-2.5`}>
                          <div className={`${isDark ? 'text-slate-500' : 'text-slate-400'} text-[10px] font-bold uppercase mb-1`}>Quantidade</div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => ajustarQuantidade(item.id, -1)}
                              className={`w-5 h-5 rounded flex items-center justify-center ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-white border border-slate-200 text-slate-600'}`}
                            >
                              -
                            </button>
                            <div className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-sm`}>{item.quantidade} <span className="text-xs font-normal opacity-70">{item.unidade}</span></div>
                            <button
                              onClick={() => ajustarQuantidade(item.id, 1)}
                              className={`w-5 h-5 rounded flex items-center justify-center ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-white border border-slate-200 text-slate-600'}`}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className={`${isDark ? 'bg-slate-900/50' : 'bg-slate-50'} rounded-lg p-2.5`}>
                          <div className={`${isDark ? 'text-slate-500' : 'text-slate-400'} text-[10px] font-bold uppercase mb-1`}>Mínimo</div>
                          <div className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-sm`}>{item.estoqueMinimo} <span className="text-xs font-normal opacity-70">{item.unidade}</span></div>
                        </div>

                        <div className={`${isDark ? 'bg-slate-900/50' : 'bg-slate-50'} rounded-lg p-2.5`}>
                          <div className={`${isDark ? 'text-slate-500' : 'text-slate-400'} text-[10px] font-bold uppercase mb-1`}>Valor Unit.</div>
                          <div className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-sm`}>R$ {item.valorUnitario.toFixed(2)}</div>
                        </div>

                        <div className={`${isDark ? 'bg-slate-900/50' : 'bg-slate-50'} rounded-lg p-2.5`}>
                          <div className={`${isDark ? 'text-slate-500' : 'text-slate-400'} text-[10px] font-bold uppercase mb-1`}>Total</div>
                          <div className="text-emerald-500 font-bold text-sm">R$ {valorTotal.toFixed(2)}</div>
                        </div>

                        <div className={`${isDark ? 'bg-slate-900/50' : 'bg-slate-50'} rounded-lg p-2.5 hidden md:block`}>
                          <div className={`${isDark ? 'text-slate-500' : 'text-slate-400'} text-[10px] font-bold uppercase mb-1`}>Local</div>
                          <div className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-sm truncate`}>{item.localizacao}</div>
                        </div>

                        <div className={`${isDark ? 'bg-slate-900/50' : 'bg-slate-50'} rounded-lg p-2.5 hidden md:block`}>
                          <div className={`${isDark ? 'text-slate-500' : 'text-slate-400'} text-[10px] font-bold uppercase mb-1`}>Fornecedor</div>
                          <div className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-sm truncate`}>{item.fornecedor}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal de Edição/Novo */}
        {modalAberto && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-10">
            <div className={`${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border rounded-2xl w-full max-w-2xl p-6 shadow-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} text-xl font-bold`}>
                  {modoEdicao ? 'Editar Item' : 'Novo Item'}
                </h3>
                <button
                  onClick={() => setModalAberto(false)}
                  className={`${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Form Fields - Styled Conditionally */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-xs font-bold uppercase mb-1.5 block`}>Categoria *</label>
                    <select
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      className={`w-full ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500`}
                    >
                      {categorias.filter(c => c !== 'todas').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-xs font-bold uppercase mb-1.5 block`}>Nome *</label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className={`w-full ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500`}
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-xs font-bold uppercase mb-1.5 block`}>Descrição *</label>
                  <input
                    type="text"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    className={`w-full ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500`}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                     <label className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-xs font-bold uppercase mb-1.5 block`}>Qtd *</label>
                     <input
                      type="number"
                      value={formData.quantidade}
                      onChange={(e) => setFormData({ ...formData, quantidade: parseFloat(e.target.value) })}
                      className={`w-full ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500`}
                     />
                  </div>
                  <div>
                     <label className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-xs font-bold uppercase mb-1.5 block`}>Mínimo *</label>
                     <input
                      type="number"
                      value={formData.estoqueMinimo}
                      onChange={(e) => setFormData({ ...formData, estoqueMinimo: parseFloat(e.target.value) })}
                      className={`w-full ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500`}
                     />
                  </div>
                  <div>
                     <label className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-xs font-bold uppercase mb-1.5 block`}>Unidade *</label>
                     <select
                      value={formData.unidade}
                      onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
                      className={`w-full ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500`}
                     >
                        <option value="un">Unidade</option>
                        <option value="cx">Caixa</option>
                        <option value="rolo">Rolo</option>
                        <option value="chapa">Chapa</option>
                        <option value="kg">Kg</option>
                        <option value="m">Metro</option>
                     </select>
                  </div>
                </div>
                
                 <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-xs font-bold uppercase mb-1.5 block`}>Valor (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.valorUnitario}
                      onChange={(e) => setFormData({ ...formData, valorUnitario: parseFloat(e.target.value) })}
                      className={`w-full ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500`}
                    />
                  </div>
                   <div>
                    <label className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-xs font-bold uppercase mb-1.5 block`}>Local *</label>
                    <input
                      type="text"
                      value={formData.localizacao}
                      onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                      className={`w-full ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500`}
                    />
                  </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-xs font-bold uppercase mb-1.5 block`}>Fornecedor *</label>
                        <input
                          type="text"
                          value={formData.fornecedor}
                          onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
                          className={`w-full ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500`}
                        />
                    </div>
                     <div>
                        <label className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-xs font-bold uppercase mb-1.5 block`}>Última Compra</label>
                        <input
                          type="date"
                          value={formData.ultimaCompra}
                          onChange={(e) => setFormData({ ...formData, ultimaCompra: e.target.value })}
                          className={`w-full ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500`}
                        />
                    </div>
                 </div>

              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setModalAberto(false)}
                  className={`flex-1 px-6 py-3 rounded-xl font-bold text-sm transition-all ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarItem}
                  className="flex-1 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                  {modoEdicao ? 'Salvar Alterações' : 'Adicionar Item'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}