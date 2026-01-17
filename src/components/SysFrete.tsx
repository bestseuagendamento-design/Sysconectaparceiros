import { useState } from 'react';
import { X, MapPin, Truck, Star, DollarSign, Package, Navigation, Calendar, CheckCircle } from 'lucide-react';

interface SysFreteProps {
  onClose: () => void;
  theme?: 'light' | 'dark';
}

export function SysFrete({ onClose, theme = 'light' }: SysFreteProps) {
  const isDark = theme === 'dark';
  const [telaAtiva, setTelaAtiva] = useState<'home' | 'contratar'>('home');
  const [motoristaSelecionado, setMotoristaSelecionado] = useState<any>(null);
  const [showModalSucesso, setShowModalSucesso] = useState(false);
  
  const [filtros, setFiltros] = useState({
    uf: '',
    cidade: '',
    tipoCaminhao: '',
    capacidade: '',
    precoKm: '',
    urgencia: ''
  });

  const [dadosFrete, setDadosFrete] = useState({
    origem: '',
    destino: '',
    tipoCarga: '',
    pesoEstimado: '',
    valorKm: '',
    distancia: 0,
    precoFinal: 0
  });

  // DADOS MOCK - Motoristas/Caminhões
  const caminhoes = [
    {
      id: 1,
      foto: 'https://i.pravatar.cc/150?img=12',
      nome: 'José Carlos Silva',
      tipoCaminhao: 'Truck Baú',
      capacidade: '8T',
      localizacao: 'São Paulo / SP',
      precoKm: 4.50,
      avaliacao: 5,
      totalAvaliacoes: 287
    },
    {
      id: 2,
      foto: 'https://i.pravatar.cc/150?img=33',
      nome: 'Roberto Almeida',
      tipoCaminhao: 'Carreta',
      capacidade: '16T',
      localizacao: 'Guarulhos / SP',
      precoKm: 6.80,
      avaliacao: 4.8,
      totalAvaliacoes: 156
    },
    {
      id: 3,
      foto: 'https://i.pravatar.cc/150?img=52',
      nome: 'Marcos Pereira',
      tipoCaminhao: 'VAN',
      capacidade: '2T',
      localizacao: 'Rio de Janeiro / RJ',
      precoKm: 3.20,
      avaliacao: 4.9,
      totalAvaliacoes: 421
    },
    {
      id: 4,
      foto: 'https://i.pravatar.cc/150?img=15',
      nome: 'Antonio Santos',
      tipoCaminhao: 'Truck Sider',
      capacidade: '8T',
      localizacao: 'Belo Horizonte / MG',
      precoKm: 4.20,
      avaliacao: 4.7,
      totalAvaliacoes: 198
    },
    {
      id: 5,
      foto: 'https://i.pravatar.cc/150?img=68',
      nome: 'Fernando Costa',
      tipoCaminhao: 'Bitruck',
      capacidade: '12T',
      localizacao: 'Curitiba / PR',
      precoKm: 5.50,
      avaliacao: 5,
      totalAvaliacoes: 312
    },
    {
      id: 6,
      foto: 'https://i.pravatar.cc/150?img=27',
      nome: 'Paulo Oliveira',
      tipoCaminhao: 'Toco',
      capacidade: '6T',
      localizacao: 'Salvador / BA',
      precoKm: 3.90,
      avaliacao: 4.6,
      totalAvaliacoes: 143
    }
  ];

  const handleContratar = (motorista: any) => {
    setMotoristaSelecionado(motorista);
    setDadosFrete({
      ...dadosFrete,
      valorKm: motorista.precoKm.toString()
    });
    setTelaAtiva('contratar');
  };

  const handleConfirmarFrete = () => {
    setShowModalSucesso(true);
  };

  const calcularDistancia = () => {
    // Simulação de cálculo
    const distanciaSimulada = Math.floor(Math.random() * 500) + 50;
    const valorKm = parseFloat(dadosFrete.valorKm) || 0;
    const total = distanciaSimulada * valorKm;
    
    setDadosFrete({
      ...dadosFrete,
      distancia: distanciaSimulada,
      precoFinal: total
    });
  };

  const renderHome = () => (
    <div className="space-y-6">
      {/* Filtros */}
      <div id="filtros-sysfrete" className={`${isDark ? 'bg-neutral-900/50 border-neutral-800' : 'bg-white border-slate-200'} border rounded-2xl p-4 md:p-6 shadow-sm`}>
        <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold mb-4`}>Filtros de Busca</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4">
          <div>
            <label className={`${isDark ? 'text-neutral-400' : 'text-slate-500'} text-sm mb-1.5 block`}>UF</label>
            <select 
              value={filtros.uf}
              onChange={(e) => setFiltros({...filtros, uf: e.target.value})}
              className={`w-full ${isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500`}
            >
              <option value="">Todos</option>
              <option value="SP">SP</option>
              <option value="RJ">RJ</option>
              <option value="MG">MG</option>
              <option value="PR">PR</option>
              <option value="BA">BA</option>
              <option value="CE">CE</option>
            </select>
          </div>

          <div>
            <label className={`${isDark ? 'text-neutral-400' : 'text-slate-500'} text-sm mb-1.5 block`}>Cidade</label>
            <input
              type="text"
              placeholder="Digite a cidade"
              value={filtros.cidade}
              onChange={(e) => setFiltros({...filtros, cidade: e.target.value})}
              className={`w-full ${isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500`}
            />
          </div>

          <div>
            <label className={`${isDark ? 'text-neutral-400' : 'text-slate-500'} text-sm mb-1.5 block`}>Tipo de Caminhão</label>
            <select 
              value={filtros.tipoCaminhao}
              onChange={(e) => setFiltros({...filtros, tipoCaminhao: e.target.value})}
              className={`w-full ${isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500`}
            >
              <option value="">Todos</option>
              <option value="van">VAN</option>
              <option value="toco">Toco</option>
              <option value="truck">Truck</option>
              <option value="bitruck">Bitruck</option>
              <option value="carreta">Carreta</option>
            </select>
          </div>

          <div>
            <label className={`${isDark ? 'text-neutral-400' : 'text-slate-500'} text-sm mb-1.5 block`}>Capacidade</label>
            <select 
              value={filtros.capacidade}
              onChange={(e) => setFiltros({...filtros, capacidade: e.target.value})}
              className={`w-full ${isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500`}
            >
              <option value="">Todas</option>
              <option value="2T">2T</option>
              <option value="6T">6T</option>
              <option value="8T">8T</option>
              <option value="12T">12T</option>
              <option value="16T">16T</option>
            </select>
          </div>

          <div>
            <label className={`${isDark ? 'text-neutral-400' : 'text-slate-500'} text-sm mb-1.5 block`}>Preço por km</label>
            <input
              type="number"
              placeholder="R$ máximo"
              value={filtros.precoKm}
              onChange={(e) => setFiltros({...filtros, precoKm: e.target.value})}
              className={`w-full ${isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500`}
            />
          </div>

          <div>
            <label className={`${isDark ? 'text-neutral-400' : 'text-slate-500'} text-sm mb-1.5 block`}>Urgência</label>
            <select 
              value={filtros.urgencia}
              onChange={(e) => setFiltros({...filtros, urgencia: e.target.value})}
              className={`w-full ${isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500`}
            >
              <option value="">Todas</option>
              <option value="imediato">Imediato</option>
              <option value="24h">24h</option>
              <option value="48h">48h</option>
              <option value="agendado">Agendado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Caminhões */}
      <div className="space-y-4">
        {caminhoes.map((caminhao) => (
          <div key={caminhao.id} className={`${isDark ? 'bg-neutral-900/50 border-neutral-800 hover:border-teal-500/50' : 'bg-white border-slate-200 hover:border-teal-500/50'} border rounded-2xl p-4 md:p-6 transition-all shadow-sm`}>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              {/* Foto do Motorista */}
              <img
                src={caminhao.foto}
                alt={caminhao.nome}
                className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-4 ${isDark ? 'border-neutral-800' : 'border-slate-100'}`}
              />

              {/* Informações */}
              <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 w-full">
                <div className="col-span-2 md:col-span-1">
                  <div className={`${isDark ? 'text-neutral-500' : 'text-slate-400'} text-[10px] font-bold uppercase mb-1`}>Motorista</div>
                  <div className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold`}>{caminhao.nome}</div>
                </div>

                <div>
                  <div className={`${isDark ? 'text-neutral-500' : 'text-slate-400'} text-[10px] font-bold uppercase mb-1`}>Tipo</div>
                  <div className={`${isDark ? 'text-white' : 'text-slate-700'} font-semibold flex items-center gap-2 text-sm`}>
                    <Truck className="w-4 h-4 text-orange-400" />
                    {caminhao.tipoCaminhao}
                  </div>
                </div>

                <div>
                  <div className={`${isDark ? 'text-neutral-500' : 'text-slate-400'} text-[10px] font-bold uppercase mb-1`}>Capacidade</div>
                  <div className={`${isDark ? 'text-white' : 'text-slate-700'} font-semibold flex items-center gap-2 text-sm`}>
                    <Package className="w-4 h-4 text-blue-400" />
                    {caminhao.capacidade}
                  </div>
                </div>

                <div>
                  <div className={`${isDark ? 'text-neutral-500' : 'text-slate-400'} text-[10px] font-bold uppercase mb-1`}>Localização</div>
                  <div className={`${isDark ? 'text-white' : 'text-slate-700'} font-semibold flex items-center gap-2 text-sm`}>
                    <MapPin className="w-4 h-4 text-green-400" />
                    {caminhao.localizacao}
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <div className={`${isDark ? 'text-neutral-500' : 'text-slate-400'} text-[10px] font-bold uppercase mb-1`}>Preço por km</div>
                  <div className="text-green-500 font-bold text-lg">R$ {caminhao.precoKm.toFixed(2)}</div>
                </div>
              </div>

              {/* Avaliação e Botão */}
              <div className="text-right w-full md:w-auto flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 mt-2 md:mt-0">
                <div className="flex items-center gap-1 mb-0 md:mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(caminhao.avaliacao)
                          ? 'text-yellow-400 fill-yellow-400'
                          : isDark ? 'text-neutral-600' : 'text-slate-300'
                      }`}
                    />
                  ))}
                  <span className={`${isDark ? 'text-neutral-400' : 'text-slate-400'} text-xs ml-2`}>({caminhao.totalAvaliacoes})</span>
                </div>
                
                <button
                  id="btn-sysfrete-contratar"
                  onClick={() => handleContratar(caminhao)}
                  className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl text-white font-semibold hover:from-teal-500 hover:to-cyan-500 transition-all shadow-lg shadow-teal-500/20 active:scale-95"
                >
                  Contratar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContratar = () => (
    <div className="space-y-6">
      <button
        onClick={() => setTelaAtiva('home')}
        className="text-teal-500 hover:text-teal-400 text-sm flex items-center gap-2 font-medium"
      >
        ← Voltar para lista
      </button>

      <div className={`bg-gradient-to-r ${isDark ? 'from-teal-900/30 to-cyan-900/30 border-teal-700/50' : 'from-teal-50 to-cyan-50 border-teal-100'} border rounded-2xl p-6`}>
        <h2 className={`${isDark ? 'text-white' : 'text-teal-900'} text-2xl font-black mb-2`}>Contratação de Frete</h2>
        <p className={`${isDark ? 'text-neutral-300' : 'text-teal-700'}`}>Preencha os dados para finalizar a contratação</p>
      </div>

      {motoristaSelecionado && (
        <div className={`${isDark ? 'bg-neutral-900/50 border-neutral-800' : 'bg-white border-slate-200'} border rounded-2xl p-6`}>
          <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold mb-4`}>Motorista Selecionado</h3>
          <div className="flex items-center gap-4">
            <img
              src={motoristaSelecionado.foto}
              alt={motoristaSelecionado.nome}
              className={`w-16 h-16 rounded-full border-4 ${isDark ? 'border-neutral-800' : 'border-slate-100'}`}
            />
            <div className="flex-1">
              <div className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-lg`}>{motoristaSelecionado.nome}</div>
              <div className={`${isDark ? 'text-neutral-400' : 'text-slate-500'} text-sm`}>
                {motoristaSelecionado.tipoCaminhao} • {motoristaSelecionado.capacidade} • R$ {motoristaSelecionado.precoKm}/km
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulário */}
      <div className={`${isDark ? 'bg-neutral-900/50 border-neutral-800' : 'bg-white border-slate-200'} border rounded-2xl p-6`}>
        <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold mb-4`}>Dados do Frete</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className={`${isDark ? 'text-neutral-400' : 'text-slate-500'} text-sm mb-1.5 block`}>Origem *</label>
            <input
              type="text"
              placeholder="Ex: São Paulo, SP"
              value={dadosFrete.origem}
              onChange={(e) => setDadosFrete({...dadosFrete, origem: e.target.value})}
              className={`w-full ${isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-lg px-4 py-3 focus:outline-none focus:border-teal-500`}
            />
          </div>

          <div>
            <label className={`${isDark ? 'text-neutral-400' : 'text-slate-500'} text-sm mb-1.5 block`}>Destino *</label>
            <input
              type="text"
              placeholder="Ex: Rio de Janeiro, RJ"
              value={dadosFrete.destino}
              onChange={(e) => setDadosFrete({...dadosFrete, destino: e.target.value})}
              className={`w-full ${isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-lg px-4 py-3 focus:outline-none focus:border-teal-500`}
            />
          </div>
          {/* ... other inputs ... */}
          <div>
             <label className={`${isDark ? 'text-neutral-400' : 'text-slate-500'} text-sm mb-1.5 block`}>Tipo de Carga *</label>
             <select
               value={dadosFrete.tipoCarga}
               onChange={(e) => setDadosFrete({...dadosFrete, tipoCarga: e.target.value})}
               className={`w-full ${isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-lg px-4 py-3 focus:outline-none focus:border-teal-500`}
             >
               <option value="">Selecione</option>
               <option value="vidro-temperado">Vidro Temperado</option>
               <option value="vidro-laminado">Vidro Laminado</option>
               <option value="esquadrias">Esquadrias</option>
               <option value="aluminio">Perfis de Alumínio</option>
               <option value="acessorios">Acessórios</option>
               <option value="mista">Carga Mista</option>
             </select>
           </div>
 
           <div>
             <label className={`${isDark ? 'text-neutral-400' : 'text-slate-500'} text-sm mb-1.5 block`}>Peso Estimado (kg) *</label>
             <input
               type="number"
               placeholder="Ex: 1500"
               value={dadosFrete.pesoEstimado}
               onChange={(e) => setDadosFrete({...dadosFrete, pesoEstimado: e.target.value})}
               className={`w-full ${isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-lg px-4 py-3 focus:outline-none focus:border-teal-500`}
             />
           </div>
 
           <div>
             <label className={`${isDark ? 'text-neutral-400' : 'text-slate-500'} text-sm mb-1.5 block`}>Valor por km</label>
             <input
               type="number"
               step="0.01"
               value={dadosFrete.valorKm}
               onChange={(e) => setDadosFrete({...dadosFrete, valorKm: e.target.value})}
               className={`w-full ${isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-lg px-4 py-3 focus:outline-none focus:border-teal-500`}
               readOnly
             />
           </div>
 
           <div>
             <label className={`${isDark ? 'text-neutral-400' : 'text-slate-500'} text-sm mb-1.5 block`}>Distância Calculada</label>
             <div className="flex gap-2">
               <input
                 type="text"
                 value={dadosFrete.distancia ? `${dadosFrete.distancia} km` : 'Não calculado'}
                 className={`flex-1 ${isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-lg px-4 py-3`}
                 readOnly
               />
               <button
                 onClick={calcularDistancia}
                 className="px-4 py-3 bg-teal-600 hover:bg-teal-500 rounded-lg text-white font-semibold transition-all"
               >
                 Calcular
               </button>
             </div>
           </div>
        </div>
      </div>

      {/* Resumo */}
      {dadosFrete.precoFinal > 0 && (
        <div className={`bg-gradient-to-r ${isDark ? 'from-green-900/30 to-teal-900/30 border-green-700/50' : 'from-green-50 to-teal-50 border-green-200'} border rounded-2xl p-6`}>
          <h3 className={`${isDark ? 'text-white' : 'text-green-900'} font-bold mb-4`}>Resumo do Frete</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className={`${isDark ? 'text-neutral-400' : 'text-green-700'} text-sm mb-1`}>Distância</div>
              <div className={`${isDark ? 'text-white' : 'text-green-900'} text-2xl font-black`}>{dadosFrete.distancia} km</div>
            </div>
            <div>
              <div className={`${isDark ? 'text-neutral-400' : 'text-green-700'} text-sm mb-1`}>Valor por km</div>
              <div className={`${isDark ? 'text-white' : 'text-green-900'} text-2xl font-black`}>R$ {dadosFrete.valorKm}</div>
            </div>
            <div>
              <div className={`${isDark ? 'text-neutral-400' : 'text-green-700'} text-sm mb-1`}>Preço Final Estimado</div>
              <div className="text-green-500 font-black text-2xl">R$ {dadosFrete.precoFinal.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Botões */}
      <div className="flex flex-col md:flex-row gap-4 pb-4">
        <button
          id="btn-sysfrete-confirmar"
          onClick={handleConfirmarFrete}
          disabled={!dadosFrete.origem || !dadosFrete.destino || !dadosFrete.tipoCarga || dadosFrete.precoFinal === 0}
          className="flex-1 py-4 bg-gradient-to-r from-green-600 to-green-700 rounded-xl text-white font-bold text-lg hover:from-green-500 hover:to-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-95"
        >
          Confirmar Frete
        </button>
        <button
          id="btn-sysfrete-cancelar"
          onClick={() => setTelaAtiva('home')}
          className={`px-8 py-4 ${isDark ? 'bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'} border rounded-xl font-bold transition-all`}
        >
          Cancelar
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div className={`${isDark ? 'bg-gradient-to-br from-neutral-900 to-neutral-950 border-neutral-800' : 'bg-white border-slate-200'} border rounded-2xl w-full max-w-7xl max-h-[95vh] flex flex-col shadow-2xl`}>
        
        {/* Header */}
        <div className={`p-4 md:p-6 border-b ${isDark ? 'border-neutral-800 bg-gradient-to-r from-orange-900/20 to-red-900/20' : 'border-slate-100 bg-gradient-to-r from-orange-50 to-red-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-orange-600 to-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Truck className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h2 className={`${isDark ? 'text-white' : 'text-slate-900'} text-lg md:text-2xl font-black`}>SYSFRETE</h2>
                <p className={`${isDark ? 'text-neutral-400' : 'text-slate-500'} text-xs md:text-sm`}>Marketplace de Caminhões</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${isDark ? 'bg-neutral-800/50 text-neutral-400 hover:text-white hover:bg-red-500/20' : 'bg-white text-slate-400 hover:text-red-500 hover:bg-red-50'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {telaAtiva === 'home' && renderHome()}
          {telaAtiva === 'contratar' && renderContratar()}
        </div>
      </div>

      {/* MODAL - SYSFRETE-SUCESSO */}
      {showModalSucesso && (
        <div id="modal-sysfrete-sucesso" className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <div className={`${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200'} border rounded-2xl p-8 max-w-md w-full shadow-2xl`}>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} text-xl font-bold mb-2`}>Frete contratado com sucesso!</h3>
              <p className={`${isDark ? 'text-neutral-400' : 'text-slate-500'} mb-6`}>Acompanhe em: Meus Fretes</p>
              <button
                onClick={() => {
                  setShowModalSucesso(false);
                  setTelaAtiva('home');
                }}
                className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-lg text-white font-bold transition-all"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}