import { useState, useEffect } from 'react';
import { X, Truck, User, Package, Camera, MapPin, Clock, Check, Share2, Navigation, Calendar, Edit, Utensils, Route, Zap, TrendingUp } from 'lucide-react';

interface RomaneioEntregaProps {
  onClose: () => void;
  theme?: 'light' | 'dark';
}

interface Orcamento {
  id: number;
  numeroOrcamento: string;
  cliente: string;
  produto: string;
  statusProducao: string;
  dataEntrega: string;
  endereco: string;
  bairro: string;
  distanciaKm?: number;
  tempoEstimado?: number;
  horarioChegada?: string;
  latitude?: number;
  longitude?: number;
  selecionado: boolean;
}

interface RestauranteSugestao {
  nome: string;
  endereco: string;
  tipo: string;
  distancia: number;
  entregaAntes: number;
  entregaDepois: number;
}

export function RomaneioEntrega({ onClose, theme = 'light' }: RomaneioEntregaProps) {
  const isDark = theme === 'dark';
  const [etapa, setEtapa] = useState<'tipo' | 'cadastro' | 'carga' | 'otimizacao' | 'carregado' | 'rota' | 'acompanhar' | 'finalizar'>('tipo');
  const [tipoRomaneio, setTipoRomaneio] = useState<'entrega' | 'instalacao' | 'concluidos' | ''>('');
  
  const [motorista, setMotorista] = useState({ nome: '', cnh: '', telefone: '' });
  const [ajudante, setAjudante] = useState({ nome: '', telefone: '' });
  const [caminhao, setCaminhao] = useState({ placa: '', modelo: '' });
  
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([
    { id: 1, numeroOrcamento: '#ORC-001', cliente: 'Sr. Pedro Silva', produto: 'Janela Linha Suprema 2x1.5m', statusProducao: 'PRONTA', dataEntrega: '15/12/2024', endereco: 'Rua Augusta, 1000', bairro: 'Consolação - SP', latitude: -23.5505, longitude: -46.6333, selecionado: false },
    { id: 2, numeroOrcamento: '#ORC-002', cliente: 'Sra. Maria Santos', produto: 'Porta Suprema 2 Folhas', statusProducao: 'PRONTA', dataEntrega: '15/12/2024', endereco: 'Av. Paulista, 500', bairro: 'Bela Vista - SP', latitude: -23.5615, longitude: -46.6562, selecionado: false },
    { id: 3, numeroOrcamento: '#ORC-003', cliente: 'João Costa', produto: 'Box Banheiro Temperado 8mm', statusProducao: 'PRONTA', dataEntrega: '16/12/2024', endereco: 'Rua Vergueiro, 200', bairro: 'Liberdade - SP', latitude: -23.5629, longitude: -46.6395, selecionado: false },
    { id: 4, numeroOrcamento: '#ORC-004', cliente: 'Ana Oliveira', produto: 'Porta 4 Folhas Premium', statusProducao: 'PRONTA', dataEntrega: '16/12/2024', endereco: 'Rua Consolação, 350', bairro: 'Consolação - SP', latitude: -23.5488, longitude: -46.6542, selecionado: false },
    { id: 5, numeroOrcamento: '#ORC-005', cliente: 'Carlos Pereira', produto: 'Espelho Bisotado 2m x 1.5m', statusProducao: 'PRONTA', dataEntrega: '17/12/2024', endereco: 'Av. Rebouças, 890', bairro: 'Pinheiros - SP', latitude: -23.5648, longitude: -46.6696, selecionado: false },
    { id: 6, numeroOrcamento: '#ORC-006', cliente: 'Juliana Alves', produto: 'Janela Maxim-ar Guardian', statusProducao: 'PRONTA', dataEntrega: '17/12/2024', endereco: 'Rua Estados Unidos, 450', bairro: 'Jardins - SP', latitude: -23.5671, longitude: -46.6598, selecionado: false },
    { id: 7, numeroOrcamento: '#ORC-007', cliente: 'Roberto Martins', produto: 'Porta de Vidro Temperado', statusProducao: 'PRONTA', dataEntrega: '18/12/2024', endereco: 'Av. Faria Lima, 1200', bairro: 'Itaim Bibi - SP', latitude: -23.5778, longitude: -46.6889, selecionado: false },
    { id: 8, numeroOrcamento: '#ORC-008', cliente: 'Fernanda Costa', produto: 'Guarda-Corpo Vidro 10mm', statusProducao: 'PRONTA', dataEntrega: '18/12/2024', endereco: 'Rua Haddock Lobo, 600', bairro: 'Cerqueira César - SP', latitude: -23.5598, longitude: -46.6626, selecionado: false },
    { id: 9, numeroOrcamento: '#ORC-009', cliente: 'Marcos Silva', produto: 'Janela Veneziana Alumínio', statusProducao: 'PRONTA', dataEntrega: '19/12/2024', endereco: 'Rua Oscar Freire, 300', bairro: 'Jardins - SP', latitude: -23.5651, longitude: -46.6672, selecionado: false },
    { id: 10, numeroOrcamento: '#ORC-010', cliente: 'Patricia Souza', produto: 'Box Canto Temperado Incolor', statusProducao: 'PRONTA', dataEntrega: '19/12/2024', endereco: 'Av. Angélica, 750', bairro: 'Higienópolis - SP', latitude: -23.5448, longitude: -46.6538, selecionado: false },
    { id: 11, numeroOrcamento: '#ORC-011', cliente: 'Eduardo Lima', produto: 'Porta Balcão 3 Folhas', statusProducao: 'PRONTA', dataEntrega: '20/12/2024', endereco: 'Rua Pamplona, 850', bairro: 'Jardins - SP', latitude: -23.5689, longitude: -46.6612, selecionado: false },
    { id: 12, numeroOrcamento: '#ORC-012', cliente: 'Camila Rocha', produto: 'Janela Basculante Banheiro', statusProducao: 'PRONTA', dataEntrega: '20/12/2024', endereco: 'Rua Bela Cintra, 500', bairro: 'Consolação - SP', latitude: -23.5578, longitude: -46.6589, selecionado: false },
  ]);

  const [rotaOtimizada, setRotaOtimizada] = useState<Orcamento[]>([]);
  const [restauranteSugerido, setRestauranteSugerido] = useState<RestauranteSugestao | null>(null);
  const [fotosEntrega, setFotosEntrega] = useState<number>(0);
  const [fotosTiradas, setFotosTiradas] = useState<string[]>([]);
  const [editandoData, setEditandoData] = useState<number | null>(null);
  const [horarioInicio, setHorarioInicio] = useState('08:00');
  const [posicaoCaminhao, setPosicaoCaminhao] = useState(0); // Progresso da rota 0-100%

  // Simular movimento do caminhão
  useEffect(() => {
    if (etapa === 'acompanhar') {
      const interval = setInterval(() => {
        setPosicaoCaminhao(prev => {
          if (prev >= 100) return 0;
          return prev + 2;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [etapa]);

  const toggleOrcamento = (id: number) => {
    setOrcamentos(orcamentos.map(orc => 
      orc.id === id ? { ...orc, selecionado: !orc.selecionado } : orc
    ));
  };

  const selecionados = orcamentos.filter(orc => orc.selecionado);
  const totalSelecionados = selecionados.length;

  const editarData = (id: number, novaData: string) => {
    setOrcamentos(orcamentos.map(orc => 
      orc.id === id ? { ...orc, dataEntrega: novaData } : orc
    ));
    setEditandoData(null);
  };

  // Algoritmo de otimização de rota
  const otimizarRota = () => {
    const distanciasPorBairro: { [key: string]: number } = {
      'Consolação - SP': 2.5,
      'Bela Vista - SP': 3.2,
      'Liberdade - SP': 4.1,
      'Pinheiros - SP': 5.8,
      'Jardins - SP': 3.5,
      'Itaim Bibi - SP': 6.2,
      'Cerqueira César - SP': 3.8,
      'Higienópolis - SP': 4.5,
    };

    let itensComDistancia = selecionados.map(orc => ({
      ...orc,
      distanciaKm: distanciasPorBairro[orc.bairro] || 5.0,
    }));

    itensComDistancia.sort((a, b) => (a.distanciaKm || 0) - (b.distanciaKm || 0));

    let horarioAtual = horarioInicio;
    const itensComHorarios = itensComDistancia.map((item, index) => {
      const tempoViagem = index === 0 ? (item.distanciaKm || 0) * 3 : 15;
      const tempoEntrega = 25;
      
      const [horas, minutos] = horarioAtual.split(':').map(Number);
      const minutosTotal = horas * 60 + minutos + tempoViagem;
      const novasHoras = Math.floor(minutosTotal / 60);
      const novosMinutos = minutosTotal % 60;
      horarioAtual = `${String(novasHoras).padStart(2, '0')}:${String(novosMinutos).padStart(2, '0')}`;

      const itemComHorario = {
        ...item,
        tempoEstimado: tempoViagem,
        horarioChegada: horarioAtual,
      };

      const minutosComEntrega = novasHoras * 60 + novosMinutos + tempoEntrega;
      const horasComEntrega = Math.floor(minutosComEntrega / 60);
      const minutosComEntrega2 = minutosComEntrega % 60;
      horarioAtual = `${String(horasComEntrega).padStart(2, '0')}:${String(minutosComEntrega2).padStart(2, '0')}`;

      return itemComHorario;
    });

    setRotaOtimizada(itensComHorarios);

    const entregaAlmoco = itensComHorarios.findIndex((item, index) => {
      const [h] = (item.horarioChegada || '').split(':').map(Number);
      return h >= 11 && h <= 14;
    });

    if (entregaAlmoco !== -1) {
      const restaurantes = [
        { nome: 'Restaurante Bom Sabor', tipo: 'Comida por Kilo', distancia: 0.3 },
        { nome: 'Pizzaria Roma', tipo: 'Pizza e Massas', distancia: 0.5 },
        { nome: 'Churrascaria Gaúcha', tipo: 'Rodízio', distancia: 0.4 },
        { nome: 'Lanchonete Central', tipo: 'Lanches e Refeições', distancia: 0.2 },
      ];

      const restauranteEscolhido = restaurantes[Math.floor(Math.random() * restaurantes.length)];

      setRestauranteSugerido({
        ...restauranteEscolhido,
        endereco: itensComHorarios[entregaAlmoco].bairro,
        entregaAntes: entregaAlmoco,
        entregaDepois: entregaAlmoco + 1,
      });
    }

    setEtapa('otimizacao');
  };

  const tirarFoto = () => {
    const fotoUrl = `foto-${Date.now()}.jpg`;
    setFotosTiradas([...fotosTiradas, fotoUrl]);
    setFotosEntrega(fotosEntrega + 1);
  };

  const salvarRomaneio = () => {
    const romaneioCompleto = {
      id: `ROM-${Math.floor(Math.random() * 10000)}`,
      tipo: tipoRomaneio,
      data: new Date().toISOString(),
      motorista,
      ajudante,
      caminhao,
      horarioInicio,
      rota: rotaOtimizada,
      restaurante: restauranteSugerido,
      fotos: fotosTiradas,
      status: 'concluido',
    };

    // Salvar no localStorage
    const romaneiosSalvos = JSON.parse(localStorage.getItem('romaneios') || '[]');
    romaneiosSalvos.push(romaneioCompleto);
    localStorage.setItem('romaneios', JSON.stringify(romaneiosSalvos));

    alert(`✅ ${tipoRomaneio === 'entrega' ? 'ENTREGA' : 'INSTALAÇÃO'} FINALIZADA E SALVA!\n\n📸 ${fotosEntrega} fotos arquivadas\n📦 ${totalSelecionados} itens ${tipoRomaneio === 'entrega' ? 'entregues' : 'instalados'}\n👤 Motorista: ${motorista.nome}\n🚚 Caminhão: ${caminhao.placa}\n\n✅ Romaneio salvo: ${romaneioCompleto.id}\n\nAcesse "Minhas Entregas" para visualizar, editar ou consultar fotos!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6">
      <div className={`${isDark ? 'bg-gradient-to-br from-neutral-900 to-neutral-950 border-orange-700' : 'bg-white border-orange-200'} border-2 rounded-2xl w-full max-w-7xl shadow-2xl max-h-[95vh] overflow-hidden flex flex-col`}>
        
        {/* Header */}
        <div className={`p-4 md:p-6 border-b ${isDark ? 'border-orange-700 bg-gradient-to-r from-orange-900 to-orange-800' : 'border-orange-200 bg-gradient-to-r from-orange-500 to-orange-600'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Truck className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white text-lg md:text-2xl font-bold leading-tight">
                  {etapa === 'tipo' && 'Novo Romaneio'}
                  {etapa === 'cadastro' && `Cadastrar Equipe`}
                  {etapa === 'carga' && `Selecionar Materiais`}
                  {etapa === 'otimizacao' && 'Rota Otimizada'}
                  {etapa === 'carregado' && 'Caminhão Carregado!'}
                  {etapa === 'rota' && 'Compartilhar Rota'}
                  {etapa === 'acompanhar' && `Mapa em Tempo Real`}
                  {etapa === 'finalizar' && `Finalizar`}
                </h2>
                <p className="text-orange-100 text-xs md:text-sm hidden md:block">
                  {tipoRomaneio === 'entrega' && 'Entrega de Materiais'}
                  {tipoRomaneio === 'instalacao' && 'Instalação no Cliente'}
                  {etapa === 'otimizacao' && '✨ Rota organizada por IA'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          
          {/* ETAPA 1: Tipo de Romaneio */}
          {etapa === 'tipo' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
              <button
                onClick={() => {
                  setTipoRomaneio('entrega');
                  setEtapa('cadastro');
                }}
                className={`${isDark ? 'bg-gradient-to-br from-orange-900 to-orange-800 border-orange-600' : 'bg-white border-orange-200 shadow-lg hover:shadow-orange-500/20'} border-2 rounded-2xl p-6 md:p-10 hover:scale-105 transition-all text-center group`}
              >
                <Truck className="w-16 h-16 md:w-20 md:h-20 text-orange-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <div className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-lg md:text-xl mb-1`}>Novo Romaneio</div>
                <div className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-lg md:text-xl mb-3`}>de Entrega</div>
                <div className={`${isDark ? 'text-orange-300' : 'text-slate-500'} text-sm`}>Entregar materiais prontos no cliente</div>
              </button>

              <button
                onClick={() => {
                  setTipoRomaneio('instalacao');
                  setEtapa('cadastro');
                }}
                className={`${isDark ? 'bg-gradient-to-br from-blue-900 to-blue-800 border-blue-600' : 'bg-white border-blue-200 shadow-lg hover:shadow-blue-500/20'} border-2 rounded-2xl p-6 md:p-10 hover:scale-105 transition-all text-center group`}
              >
                <Package className="w-16 h-16 md:w-20 md:h-20 text-blue-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <div className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-lg md:text-xl mb-1`}>Romaneio de</div>
                <div className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-lg md:text-xl mb-3`}>Instalação</div>
                <div className={`${isDark ? 'text-blue-300' : 'text-slate-500'} text-sm`}>Instalar produtos no local do cliente</div>
              </button>

              <button
                onClick={() => {
                  setTipoRomaneio('concluidos');
                  setEtapa('cadastro');
                }}
                className={`${isDark ? 'bg-gradient-to-br from-green-900 to-green-800 border-green-600' : 'bg-white border-green-200 shadow-lg hover:shadow-green-500/20'} border-2 rounded-2xl p-6 md:p-10 hover:scale-105 transition-all text-center group`}
              >
                <Check className="w-16 h-16 md:w-20 md:h-20 text-green-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <div className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-lg md:text-xl mb-1`}>Romaneio de</div>
                <div className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-lg md:text-xl mb-3`}>Serviços Concluídos</div>
                <div className={`${isDark ? 'text-green-300' : 'text-slate-500'} text-sm`}>Trabalhos finalizados e entregues</div>
              </button>
            </div>
          )}

          {/* ETAPA 2: Cadastrar Motorista, Ajudante e Caminhão */}
          {etapa === 'cadastro' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className={`${isDark ? 'bg-neutral-800/50 border-orange-700' : 'bg-white border-orange-200'} border-2 rounded-xl p-4 md:p-6 shadow-sm`}>
                <h3 className="text-orange-500 font-bold text-lg mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Dados do Motorista Responsável
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Nome Completo"
                    value={motorista.nome}
                    onChange={(e) => setMotorista({ ...motorista, nome: e.target.value })}
                    className={`w-full ${isDark ? 'bg-neutral-900 border-orange-800 text-white' : 'bg-orange-50 border-orange-200 text-slate-900'} border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500`}
                  />
                  <input
                    type="text"
                    placeholder="CNH"
                    value={motorista.cnh}
                    onChange={(e) => setMotorista({ ...motorista, cnh: e.target.value })}
                    className={`w-full ${isDark ? 'bg-neutral-900 border-orange-800 text-white' : 'bg-orange-50 border-orange-200 text-slate-900'} border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500`}
                  />
                  <input
                    type="text"
                    placeholder="Telefone"
                    value={motorista.telefone}
                    onChange={(e) => setMotorista({ ...motorista, telefone: e.target.value })}
                    className={`w-full ${isDark ? 'bg-neutral-900 border-orange-800 text-white' : 'bg-orange-50 border-orange-200 text-slate-900'} border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500`}
                  />
                </div>
              </div>

              <div className={`${isDark ? 'bg-neutral-800/50 border-orange-700' : 'bg-white border-orange-200'} border-2 rounded-xl p-4 md:p-6 shadow-sm`}>
                <h3 className="text-orange-500 font-bold text-lg mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Dados do Ajudante
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nome Completo"
                    value={ajudante.nome}
                    onChange={(e) => setAjudante({ ...ajudante, nome: e.target.value })}
                    className={`w-full ${isDark ? 'bg-neutral-900 border-orange-800 text-white' : 'bg-orange-50 border-orange-200 text-slate-900'} border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500`}
                  />
                  <input
                    type="text"
                    placeholder="Telefone"
                    value={ajudante.telefone}
                    onChange={(e) => setAjudante({ ...ajudante, telefone: e.target.value })}
                    className={`w-full ${isDark ? 'bg-neutral-900 border-orange-800 text-white' : 'bg-orange-50 border-orange-200 text-slate-900'} border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500`}
                  />
                </div>
              </div>

              <div className={`${isDark ? 'bg-neutral-800/50 border-orange-700' : 'bg-white border-orange-200'} border-2 rounded-xl p-4 md:p-6 shadow-sm`}>
                <h3 className="text-orange-500 font-bold text-lg mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Dados do Caminhão
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Placa (ABC-1234)"
                    value={caminhao.placa}
                    onChange={(e) => setCaminhao({ ...caminhao, placa: e.target.value })}
                    className={`w-full ${isDark ? 'bg-neutral-900 border-orange-800 text-white' : 'bg-orange-50 border-orange-200 text-slate-900'} border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500`}
                  />
                  <input
                    type="text"
                    placeholder="Modelo"
                    value={caminhao.modelo}
                    onChange={(e) => setCaminhao({ ...caminhao, modelo: e.target.value })}
                    className={`w-full ${isDark ? 'bg-neutral-900 border-orange-800 text-white' : 'bg-orange-50 border-orange-200 text-slate-900'} border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500`}
                  />
                </div>
              </div>

              <div className={`${isDark ? 'bg-neutral-800/50 border-orange-700' : 'bg-white border-orange-200'} border-2 rounded-xl p-4 md:p-6 shadow-sm`}>
                <h3 className="text-orange-500 font-bold text-lg mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Horário de Início
                </h3>
                <input
                  type="time"
                  value={horarioInicio}
                  onChange={(e) => setHorarioInicio(e.target.value)}
                  className={`w-full ${isDark ? 'bg-neutral-900 border-orange-800 text-white' : 'bg-orange-50 border-orange-200 text-slate-900'} border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500`}
                />
              </div>

              <button
                onClick={() => setEtapa('carga')}
                disabled={!motorista.nome || !ajudante.nome || !caminhao.placa}
                className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-95"
              >
                Continuar para Seleção de Carga →
              </button>
            </div>
          )}

          {/* ETAPA 3: Selecionar Carga */}
          {etapa === 'carga' && (
            <div className="space-y-4">
              <div className={`${isDark ? 'bg-orange-900/30 border-orange-700' : 'bg-orange-50 border-orange-200'} border-2 rounded-xl p-4 md:p-5 mb-4`}>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div className="col-span-2 md:col-span-1">
                    <div className="text-orange-500 font-semibold mb-1">Motorista</div>
                    <div className={`${isDark ? 'text-white' : 'text-slate-900'}`}>{motorista.nome}</div>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <div className="text-orange-500 font-semibold mb-1">Ajudante</div>
                    <div className={`${isDark ? 'text-white' : 'text-slate-900'}`}>{ajudante.nome}</div>
                  </div>
                  <div>
                    <div className="text-orange-500 font-semibold mb-1">Caminhão</div>
                    <div className={`${isDark ? 'text-white' : 'text-slate-900'}`}>{caminhao.placa}</div>
                  </div>
                  <div>
                    <div className="text-orange-500 font-semibold mb-1">Início</div>
                    <div className={`${isDark ? 'text-white' : 'text-slate-900'}`}>{horarioInicio}</div>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <div className="text-orange-500 font-semibold mb-1">Carga</div>
                    <div className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold`}>{totalSelecionados} itens</div>
                  </div>
                </div>
              </div>

              <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-lg md:text-xl mb-4 px-1`}>
                📦 Selecione os materiais ({totalSelecionados} de {orcamentos.length})
              </h3>

              <div className="space-y-3 pb-24 md:pb-0">
                {orcamentos.map((orc) => (
                  <div
                    key={orc.id}
                    className={`${
                      orc.selecionado
                        ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/10'
                        : isDark ? 'bg-neutral-800/50 border-neutral-700 hover:border-orange-800' : 'bg-white border-slate-200 hover:border-orange-300'
                    } border-2 rounded-xl p-4 md:p-5 cursor-pointer transition-all`}
                    onClick={() => toggleOrcamento(orc.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        orc.selecionado
                          ? 'border-orange-600 bg-orange-600'
                          : 'border-neutral-400'
                      }`}>
                        {orc.selecionado && <Check className="w-4 h-4 text-white" />}
                      </div>

                      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4">
                        <div className="flex justify-between md:block">
                          <div className="text-neutral-500 text-xs mb-1 md:hidden">Orçamento</div>
                          <div className="text-orange-500 font-bold">{orc.numeroOrcamento}</div>
                          <div className={`${isDark ? 'text-white' : 'text-slate-900'} font-semibold md:hidden`}>{orc.cliente}</div>
                        </div>
                        <div className="hidden md:block">
                          <div className="text-neutral-500 text-xs mb-1">Cliente</div>
                          <div className={`${isDark ? 'text-white' : 'text-slate-900'} font-semibold`}>{orc.cliente}</div>
                        </div>
                        <div className="md:col-span-1">
                          <div className="text-neutral-500 text-xs mb-1 hidden md:block">Produto</div>
                          <div className={`${isDark ? 'text-white' : 'text-slate-700'} text-sm`}>{orc.produto}</div>
                        </div>
                        <div className="flex items-center gap-2 md:block">
                           <div className="text-neutral-500 text-xs mb-1 hidden md:block">Status</div>
                           <span className="text-green-500 font-bold text-xs bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">{orc.statusProducao}</span>
                        </div>
                        <div>
                          <div className="text-neutral-500 text-xs mb-1 hidden md:block">Entrega</div>
                          <div className={`${isDark ? 'text-white' : 'text-slate-700'} flex items-center gap-1 text-sm`}>
                            <Calendar className="w-3 h-3 text-orange-500" />
                            {orc.dataEntrega}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={otimizarRota}
                disabled={totalSelecionados === 0}
                className="w-full py-4 md:py-5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-xl font-bold transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed fixed md:static bottom-6 left-4 right-4 md:bottom-auto md:left-auto md:right-auto shadow-2xl md:shadow-lg z-20 md:z-auto flex items-center justify-center gap-3"
                style={{ width: 'calc(100% - 2rem)', maxWidth: '80rem' }}
              >
                <Zap className="w-6 h-6" />
                <span className="md:hidden">OTIMIZAR ({totalSelecionados})</span>
                <span className="hidden md:inline">🧠 OTIMIZAR ROTA INTELIGENTE ({totalSelecionados} itens)</span>
              </button>
            </div>
          )}

          {/* ETAPA 3.5: ROTA OTIMIZADA */}
          {etapa === 'otimizacao' && (
            <div className="space-y-6">
              <div className={`bg-gradient-to-r ${isDark ? 'from-cyan-900 to-blue-900 border-cyan-600' : 'from-cyan-500 to-blue-600 border-cyan-400'} border-2 rounded-xl p-6`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl md:text-2xl mb-2">🧠 Inteligência SysConecta Ativada</h3>
                    <p className="text-cyan-100">Rota otimizada automaticamente por proximidade e horários estratégicos</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-black/20 rounded-lg p-4">
                    <div className="text-cyan-100 text-sm mb-1">Total de Entregas</div>
                    <div className="text-white text-2xl font-bold">{rotaOtimizada.length}</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-4">
                    <div className="text-cyan-100 text-sm mb-1">Distância Total</div>
                    <div className="text-white text-2xl font-bold">
                      {rotaOtimizada.reduce((acc, item) => acc + (item.distanciaKm || 0), 0).toFixed(1)} km
                    </div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-4">
                    <div className="text-cyan-100 text-sm mb-1">Início</div>
                    <div className="text-white text-2xl font-bold">{horarioInicio}</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-4">
                    <div className="text-cyan-100 text-sm mb-1">Término Previsto</div>
                    <div className="text-white text-2xl font-bold">
                      {rotaOtimizada[rotaOtimizada.length - 1]?.horarioChegada || '--:--'}
                    </div>
                  </div>
                </div>
              </div>

              {restauranteSugerido && (
                <div className="bg-gradient-to-r from-green-600 to-emerald-700 border-2 border-green-400 rounded-xl p-6 animate-pulse shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Utensils className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-xl mb-2">
                        🍽️ PARADA ESTRATÉGICA PARA ALMOÇO
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-green-100 mb-1">Restaurante Sugerido:</div>
                          <div className="text-white font-bold text-lg">{restauranteSugerido.nome}</div>
                          <div className="text-green-50">{restauranteSugerido.tipo}</div>
                        </div>
                        <div>
                          <div className="text-green-100 mb-1">Localização:</div>
                          <div className="text-white">📍 {restauranteSugerido.endereco}</div>
                          <div className="text-green-50">⏱️ Após entrega #{restauranteSugerido.entregaAntes + 1} - {rotaOtimizada[restauranteSugerido.entregaAntes]?.horarioChegada}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-xl mb-4 flex items-center gap-2`}>
                  <Route className="w-6 h-6 text-cyan-500" />
                  Sequência Otimizada de Entregas
                </h3>

                {rotaOtimizada.map((item, index) => (
                  <div key={item.id}>
                    <div className={`${isDark ? 'bg-neutral-800/50 border-cyan-700' : 'bg-white border-cyan-300'} border-2 rounded-xl p-5 shadow-sm`}>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xl">{index + 1}</span>
                        </div>

                        <div className="flex-1">
                          <div className="grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-4 mb-3">
                            <div>
                              <div className={`${isDark ? 'text-neutral-500' : 'text-slate-500'} text-xs mb-1`}>Orçamento</div>
                              <div className="text-cyan-500 font-bold">{item.numeroOrcamento}</div>
                            </div>
                            <div>
                              <div className={`${isDark ? 'text-neutral-500' : 'text-slate-500'} text-xs mb-1`}>Cliente</div>
                              <div className={`${isDark ? 'text-white' : 'text-slate-900'} font-semibold`}>{item.cliente}</div>
                            </div>
                            <div className="md:col-span-2">
                              <div className={`${isDark ? 'text-neutral-500' : 'text-slate-500'} text-xs mb-1`}>Produto</div>
                              <div className={`${isDark ? 'text-white' : 'text-slate-700'}`}>{item.produto}</div>
                            </div>
                            <div>
                              <div className={`${isDark ? 'text-neutral-500' : 'text-slate-500'} text-xs mb-1`}>Chegada</div>
                              <div className="text-cyan-500 font-bold text-lg flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {item.horarioChegada}
                              </div>
                            </div>
                            <div>
                              <div className={`${isDark ? 'text-neutral-500' : 'text-slate-500'} text-xs mb-1`}>Distância</div>
                              <div className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold flex items-center gap-2`}>
                                <Navigation className="w-4 h-4 text-cyan-500" />
                                {item.distanciaKm} km
                              </div>
                            </div>
                          </div>

                          <div className={`flex items-center gap-2 ${isDark ? 'text-cyan-300' : 'text-cyan-700'} text-sm`}>
                            <MapPin className="w-4 h-4" />
                            <span>{item.endereco} - {item.bairro}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {restauranteSugerido && index === restauranteSugerido.entregaAntes && (
                      <div className="flex items-center justify-center my-4">
                        <div className="bg-green-600 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg">
                          <Utensils className="w-5 h-5" />
                          🍽️ PARAR PARA ALMOÇO AQUI - {restauranteSugerido.nome}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setEtapa('carregado')}
                className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all text-xl shadow-lg active:scale-95"
              >
                ✅ CONFIRMAR ROTA OTIMIZADA E CARREGAR CAMINHÃO
              </button>
            </div>
          )}

          {/* ETAPA 4: Caminhão Carregado */}
          {etapa === 'carregado' && (
            <div className="text-center py-12 max-w-2xl mx-auto">
              <div className="w-32 h-32 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Check className="w-16 h-16 text-orange-500" />
              </div>
              <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} text-3xl font-bold mb-4`}>🚚 Caminhão Carregado!</h3>
              <p className="text-orange-500 text-lg mb-2">
                <strong>{totalSelecionados} itens</strong> prontos para {tipoRomaneio}
              </p>
              <p className={`${isDark ? 'text-neutral-400' : 'text-slate-500'} mb-8`}>
                Motorista: <strong className={`${isDark ? 'text-white' : 'text-slate-900'}`}>{motorista.nome}</strong> | 
                Caminhão: <strong className={`${isDark ? 'text-white' : 'text-slate-900'}`}>{caminhao.placa}</strong>
              </p>
              
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={() => setEtapa('rota')}
                  className="flex-1 py-5 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-all text-xl flex items-center justify-center gap-2 shadow-lg"
                >
                  <Navigation className="w-6 h-6" />
                  IR AGORA
                </button>
                <button
                  onClick={() => setEtapa('rota')}
                  className="flex-1 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all text-xl flex items-center justify-center gap-2 shadow-lg"
                >
                  <Share2 className="w-6 h-6" />
                  COMPARTILHAR ROTA
                </button>
              </div>
            </div>
          )}

          {/* ETAPA 5: Compartilhar Rota (QR Code) */}
          {etapa === 'rota' && (
            <div className="text-center py-12 max-w-2xl mx-auto">
              <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} text-2xl font-bold mb-6`}>📱 Compartilhe a Rota via WhatsApp</h3>
              
              <div className="w-72 h-72 bg-white rounded-xl mx-auto mb-6 flex items-center justify-center shadow-2xl border-4 border-white">
                <div className="text-center">
                  <div className="text-8xl mb-4">📱</div>
                  <div className="text-black font-mono text-sm font-bold">QR CODE</div>
                  <div className="text-black font-mono text-xs mt-2">Escaneie para compartilhar</div>
                </div>
              </div>

              <p className={`${isDark ? 'text-neutral-400' : 'text-slate-500'} mb-8`}>
                O motorista deve escanear o QR Code para compartilhar a rota no WhatsApp
              </p>

              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={() => setEtapa('acompanhar')}
                  className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition-all text-lg shadow-lg"
                >
                  📦 MINHAS ENTREGAS
                </button>
                <button
                  onClick={() => setEtapa('acompanhar')}
                  className="flex-1 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold transition-all text-lg flex items-center justify-center gap-2 shadow-lg"
                >
                  <Navigation className="w-5 h-5" />
                  ACOMPANHAR ESSA ROTA
                </button>
              </div>
            </div>
          )}

          {/* ETAPA 6: Acompanhar Rota com MAPA DINÂMICO */}
          {etapa === 'acompanhar' && (
            <div className="space-y-6">
              {/* Mapa Dinâmico com Caminhão */}
              <div className="bg-gradient-to-br from-blue-950 to-green-950 border-2 border-cyan-700 rounded-xl p-6 h-[500px] relative overflow-hidden shadow-xl">
                {/* Fundo do Mapa */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0px, transparent 1px, transparent 50px), repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0px, transparent 1px, transparent 50px)`,
                  }}></div>
                </div>

                {/* Título do Mapa */}
                <div className="relative z-10 mb-4">
                  <h3 className="text-white font-bold text-xl mb-2">
                    🗺️ {tipoRomaneio === 'entrega' ? 'Mapa de Entregas' : tipoRomaneio === 'instalacao' ? 'Mapa de Instalação' : 'Mapa de Serviços Concluídos'}
                  </h3>
                  <p className="text-cyan-400 text-sm">Caminhão seguindo rota azul em tempo real</p>
                </div>

                {/* Marcadores de Destino */}
                <div className="relative z-10 h-full">
                  {rotaOtimizada.map((item, index) => {
                    const left = 20 + (index * 70 / rotaOtimizada.length);
                    const top = 30 + (Math.sin(index) * 20);
                    
                    return (
                      <div
                        key={item.id}
                        className="absolute"
                        style={{
                          left: `${left}%`,
                          top: `${top}%`,
                        }}
                      >
                        {/* Linha da Rota Azul */}
                        {index < rotaOtimizada.length - 1 && (
                          <div
                            className="absolute w-24 h-1 bg-blue-500 rounded-full"
                            style={{
                              transform: 'rotate(15deg)',
                              transformOrigin: 'left center',
                            }}
                          ></div>
                        )}
                        
                        {/* Marcador */}
                        <div className="relative">
                          <div className="w-8 h-8 bg-red-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{index + 1}</span>
                          </div>
                          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {item.bairro.split(' - ')[0]}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Caminhão em Movimento */}
                  <div
                    className="absolute transition-all duration-500 ease-linear"
                    style={{
                      left: `${20 + (posicaoCaminhao / 100) * 70}%`,
                      top: `${30 + (Math.sin(posicaoCaminhao / 20) * 20)}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div className="relative">
                      <Truck className="w-12 h-12 text-orange-500 drop-shadow-lg animate-bounce" />
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-orange-600 text-white text-xs px-2 py-1 rounded font-bold whitespace-nowrap">
                        {motorista.nome.split(' ')[0]}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Legenda */}
                <div className="absolute bottom-4 right-4 bg-black/80 rounded-lg p-3 text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white"></div>
                    <span className="text-white">Destinos</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-1 bg-blue-500 rounded"></div>
                    <span className="text-white">Rota Otimizada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-orange-500" />
                    <span className="text-white">Caminhão</span>
                  </div>
                </div>
              </div>

              {/* Info da Rota */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-cyan-900/30 border border-cyan-700 rounded-lg p-4">
                  <div className="text-cyan-400 text-sm mb-1">Progresso da Rota</div>
                  <div className={`${isDark ? 'text-white' : 'text-slate-900'} text-2xl font-bold`}>{Math.floor(posicaoCaminhao)}%</div>
                  <div className="w-full bg-neutral-800 rounded-full h-2 mt-2">
                    <div className="bg-cyan-500 h-2 rounded-full transition-all" style={{ width: `${posicaoCaminhao}%` }}></div>
                  </div>
                </div>
                <div className="bg-cyan-900/30 border border-cyan-700 rounded-lg p-4">
                  <div className="text-cyan-400 text-sm mb-1">Próximo Destino</div>
                  <div className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold`}>{rotaOtimizada[0]?.bairro}</div>
                  <div className="text-cyan-300 text-sm">{rotaOtimizada[0]?.cliente}</div>
                </div>
                <div className="bg-cyan-900/30 border border-cyan-700 rounded-lg p-4">
                  <div className="text-cyan-400 text-sm mb-1">Tempo Estimado</div>
                  <div className={`${isDark ? 'text-white' : 'text-slate-900'} text-2xl font-bold`}>12 min</div>
                  <div className="text-cyan-300 text-sm">3.5 km restantes</div>
                </div>
              </div>

              {/* Mensagem WhatsApp Automática */}
              <div className="bg-green-900/20 border-2 border-green-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-green-500 font-bold text-lg">✅ Mensagem Automática Enviada</div>
                    <div className={`${isDark ? 'text-neutral-400' : 'text-slate-500'} text-sm`}>WhatsApp do cliente - Enviado há 2 minutos</div>
                  </div>
                </div>
                <div className={`${isDark ? 'bg-neutral-900' : 'bg-white'} rounded-xl p-5 border-l-4 border-green-600 shadow-inner`}>
                  <p className={`${isDark ? 'text-white' : 'text-slate-900'} text-lg`}>
                    "Olá <strong>{selecionados[0]?.cliente.split(' ')[1]}</strong>, seus materiais estão chegando em <strong className="text-green-500">30 minutos</strong>! 🚚
                  </p>
                  <p className={`${isDark ? 'text-white' : 'text-slate-900'} text-lg mt-2`}>
                    Estamos já bem próximo ao local. Obrigado!"
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEtapa('finalizar')}
                className="w-full py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold transition-all text-xl shadow-lg active:scale-95"
              >
                📍 CHEGAMOS NO DESTINO - Finalizar {tipoRomaneio === 'entrega' ? 'Entrega' : 'Instalação'}
              </button>
            </div>
          )}

          {/* ETAPA 7: Finalizar com Fotos */}
          {etapa === 'finalizar' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className={`${isDark ? 'bg-orange-900/20 border-orange-700' : 'bg-orange-50 border-orange-200'} border-2 rounded-xl p-8 text-center`}>
                <Camera className="w-20 h-20 text-orange-500 mx-auto mb-4" />
                <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-2xl mb-3`}>
                  📸 Registrar {tipoRomaneio === 'entrega' ? 'Entrega' : 'Instalação'}
                </h3>
                <p className={`${isDark ? 'text-neutral-400' : 'text-slate-500'} mb-2`}>
                  Tire fotos de TODOS os materiais já no local para certificar que tudo está ali
                </p>
                <p className="text-orange-500 text-sm mb-6 font-semibold">
                  ⚠️ Essas fotos serão arquivadas em "Minhas Entregas" para segurança de todos
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                        i < fotosEntrega
                          ? 'border-green-500 bg-green-500/10'
                          : `${isDark ? 'border-neutral-700 hover:border-orange-600 hover:bg-orange-900/10' : 'border-slate-300 hover:border-orange-400 hover:bg-orange-50'}`
                      }`}
                      onClick={tirarFoto}
                    >
                      {i < fotosEntrega ? (
                        <>
                          <Check className="w-10 h-10 text-green-500 mb-2" />
                          <span className="text-green-500 text-xs font-bold">FOTO {i + 1}</span>
                        </>
                      ) : (
                        <>
                          <Camera className={`w-10 h-10 ${isDark ? 'text-neutral-600' : 'text-slate-400'} mb-2`} />
                          <span className={`${isDark ? 'text-neutral-500' : 'text-slate-500'} text-xs`}>Foto {i + 1}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                <div className={`${isDark ? 'bg-neutral-900/50' : 'bg-white'} rounded-lg p-4 mb-6 shadow-inner`}>
                  <div className="text-orange-500 font-bold text-xl mb-2">
                    📸 {fotosEntrega} de 12 fotos capturadas
                  </div>
                  <div className={`${isDark ? 'text-neutral-400' : 'text-slate-500'} text-sm`}>
                    Mínimo de 6 fotos necessárias para finalizar
                  </div>
                </div>
              </div>

              <button
                onClick={salvarRomaneio}
                disabled={fotosEntrega < 6}
                className="w-full py-5 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-all text-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg active:scale-95"
              >
                <Check className="w-6 h-6" />
                ✅ CONFIRMAR {tipoRomaneio === 'entrega' ? 'ENTREGA' : 'INSTALAÇÃO'} E SALVAR ({fotosEntrega} fotos)
              </button>

              <p className={`${isDark ? 'text-neutral-500' : 'text-slate-500'} text-sm text-center`}>
                ⚠️ Mínimo de 6 fotos necessárias para finalizar. Todas as informações serão salvas para consulta futura!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}