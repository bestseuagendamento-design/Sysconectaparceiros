import { ArrowLeft, MapPin, Truck, Clock, Navigation, Bell, Package } from 'lucide-react';
import { useState, useEffect } from 'react';

interface RotaTempoRealProps {
  onNavigate: (screen: string) => void;
}

export function RotaTempoReal({ onNavigate }: RotaTempoRealProps) {
  const [fornecedoraSelecionada, setFornecedoraSelecionada] = useState<'vidro' | 'aluminio' | 'acessorios'>('vidro');
  const [showNotification, setShowNotification] = useState(false);
  const [distancia, setDistancia] = useState(12.5); // km
  const [tempoEstimado, setTempoEstimado] = useState('25 min');

  const fornecedoras = {
    vidro: {
      id: 'vidro',
      nome: 'TEMPERMAX',
      icon: '🔷',
      cor: 'blue',
      motorista: 'Carlos Silva',
      veiculo: 'Fiat Ducato - ABC-1234',
      telefone: '(15) 98765-4321',
      origem: 'TEMPERMAX - Sorocaba, SP',
      destino: 'Sua Vidraçaria - Itapetininga, SP',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d117311.35!2d-47.6!3d-23.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x94c58a8a6b1a5a89%3A0x8a0d6c0b8c0a1d1e!2sSorocaba%2C%20SP!3m2!1d-23.5014842!2d-47.4526119!4m5!1s0x94c5d1c8c8c8c8c8%3A0x8c8c8c8c8c8c8c8c!2sItapetininga%2C%20SP!3m2!1d-23.5916873!2d-48.0530892!5e0!3m2!1spt-BR!2sbr!4v1702400000000!5m2!1spt-BR!2sbr',
      distanciaReal: '85 km',
      tempoReal: '1h 15min',
      // Rota realista seguindo Rodovia Raposo Tavares (SP-270)
      pathRota: 'M 120 580 C 140 570, 160 550, 185 535 C 210 520, 240 500, 270 485 C 295 472, 320 460, 345 450 C 370 440, 395 432, 420 425 C 445 418, 470 412, 495 407 C 520 402, 545 398, 570 395 C 595 392, 620 390, 645 388 C 670 386, 695 385, 720 383 C 740 381, 758 379, 775 377',
      pontoOrigem: { x: 120, y: 580 },
      pontoDestino: { x: 775, y: 377 },
    },
    aluminio: {
      id: 'aluminio',
      nome: 'CBA',
      icon: '⚙️',
      cor: 'slate',
      motorista: 'Roberto Santos',
      veiculo: 'Mercedes Sprinter - DEF-5678',
      telefone: '(19) 97654-3210',
      origem: 'CBA Alumínio - Campinas, SP',
      destino: 'Sua Vidraçaria - Itapetininga, SP',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d467200.0!2d-47.8!3d-23.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x94c8c8f0e0e0e0e0%3A0x1a1a1a1a1a1a1a1a!2sCampinas%2C%20SP!3m2!1d-22.9099384!2d-47.0626332!4m5!1s0x94c5d1c8c8c8c8c8%3A0x8c8c8c8c8c8c8c8c!2sItapetininga%2C%20SP!3m2!1d-23.5916873!2d-48.0530892!5e0!3m2!1spt-BR!2sbr!4v1702400000000!5m2!1spt-BR!2sbr',
      distanciaReal: '132 km',
      tempoReal: '1h 45min',
      // Rota realista seguindo Rodovia Santos Dumont (SP-75) + Castello Branco (SP-280)
      pathRota: 'M 850 120 C 830 145, 810 168, 788 192 C 765 218, 740 245, 715 270 C 690 295, 665 318, 640 340 C 615 362, 590 382, 565 400 C 540 418, 515 434, 490 448 C 465 462, 440 474, 415 484 C 390 494, 365 502, 340 508 C 315 514, 290 518, 265 520 C 240 522, 215 522, 190 520 C 170 518, 152 515, 135 510',
      pontoOrigem: { x: 850, y: 120 },
      pontoDestino: { x: 135, y: 510 },
    },
    acessorios: {
      id: 'acessorios',
      nome: 'Acessorio',
      icon: '🔧',
      cor: 'neutral',
      motorista: 'João Pereira',
      veiculo: 'Renault Master - GHI-9012',
      telefone: '(41) 96543-2109',
      origem: 'Acessorio - Curitiba, PR',
      destino: 'Sua Vidraçaria - Itapetininga, SP',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d935000.0!2d-48.5!3d-24.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x94dce35351c3b8b5%3A0x6d2f6ba5bacf4a3a!2sCuritiba%2C%20PR!3m2!1d-25.4289541!2d-49.267137!4m5!1s0x94c5d1c8c8c8c8c8%3A0x8c8c8c8c8c8c8c8c!2sItapetininga%2C%20SP!3m2!1d-23.5916873!2d-48.0530892!5e0!3m2!1spt-BR!2sbr!4v1702400000000!5m2!1spt-BR!2sbr',
      distanciaReal: '318 km',
      tempoReal: '4h 30min',
      // Rota realista seguindo BR-116 (Régis Bittencourt)
      pathRota: 'M 780 50 C 760 72, 742 96, 725 122 C 708 148, 692 176, 677 205 C 662 234, 648 264, 635 294 C 622 324, 610 354, 599 384 C 588 414, 578 444, 569 474 C 560 504, 552 534, 545 564 C 538 590, 532 615, 527 638 C 522 661, 518 683, 515 703 C 512 723, 510 741, 509 757 C 508 770, 507 781, 507 790',
      pontoOrigem: { x: 780, y: 50 },
      pontoDestino: { x: 507, y: 790 },
    },
  };

  const fornecedoraAtual = fornecedoras[fornecedoraSelecionada];

  // Simular aproximação após 10 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setDistancia(5.0);
      setTempoEstimado('12 min');
      setShowNotification(true);
      
      // Esconder notificação após 8 segundos
      setTimeout(() => {
        setShowNotification(false);
      }, 8000);
    }, 10000);

    return () => clearTimeout(timer);
  }, [fornecedoraSelecionada]);

  return (
    <div className="min-h-screen bg-[#FAF9F7] p-12">
      <div className="max-w-7xl mx-auto">
        {/* Notificação de Proximidade */}
        {showNotification && (
          <div className="fixed top-8 right-8 z-50 bg-white border border-gray-200 shadow-lg rounded-xl p-6 max-w-md animate-slide-in"  >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#2C5F6F]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Bell className="w-6 h-6 text-[#2C5F6F]" />
              </div>
              <div className="flex-1">
                <div className="text-gray-900 mb-2 font-semibold">Entrega Próxima!</div>
                <p className="text-gray-600 text-sm mb-3">
                  O caminhão está a {distancia}km de distância. Previsão de chegada: {tempoEstimado}
                </p>
                <button
                  onClick={() => setShowNotification(false)}
                  className="text-[#2C5F6F] text-sm font-medium"
                >
                  Entendi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-3 tracking-tight font-semibold" style={{ fontSize: '1.75rem' }}>
            Rota em Tempo Real
          </h2>
          <p className="text-gray-600 text-sm">
            Acompanhe a localização da entrega
          </p>
        </div>

        {/* Seletor de Fornecedora */}
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 mb-8">
          <div className="text-neutral-600 text-xs uppercase tracking-wider mb-4">
            Selecione qual entrega deseja acompanhar
          </div>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setFornecedoraSelecionada('vidro')}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                fornecedoraSelecionada === 'vidro'
                  ? 'bg-blue-700/20 border-blue-700 text-blue-500'
                  : 'bg-black/30 border-neutral-800 text-neutral-500 hover:border-neutral-700'
              }`}
            >
              <div className="text-2xl">🔷</div>
              <div className="text-left">
                <div className="text-white text-sm">TEMPERMAX</div>
                <div className="text-xs">Vidros</div>
              </div>
            </button>
            <button
              onClick={() => setFornecedoraSelecionada('aluminio')}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                fornecedoraSelecionada === 'aluminio'
                  ? 'bg-slate-700/20 border-slate-700 text-slate-500'
                  : 'bg-black/30 border-neutral-800 text-neutral-500 hover:border-neutral-700'
              }`}
            >
              <div className="text-2xl">⚙️</div>
              <div className="text-left">
                <div className="text-white text-sm">CBA</div>
                <div className="text-xs">Alumínio</div>
              </div>
            </button>
            <button
              onClick={() => setFornecedoraSelecionada('acessorios')}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                fornecedoraSelecionada === 'acessorios'
                  ? 'bg-neutral-700/20 border-neutral-700 text-neutral-400'
                  : 'bg-black/30 border-neutral-800 text-neutral-500 hover:border-neutral-700'
              }`}
            >
              <div className="text-2xl">🔧</div>
              <div className="text-left">
                <div className="text-white text-sm">Acessorio</div>
                <div className="text-xs">Acessórios</div>
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* COLUNA ESQUERDA - Informações */}
          <div className="space-y-6">
            {/* Status da Entrega */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-cyan-700/30 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-cyan-500" />
                </div>
                <div>
                  <div className="text-white" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                    Em rota
                  </div>
                  <div className="text-neutral-500 text-xs">
                    {fornecedoraAtual.nome}
                  </div>
                </div>
              </div>

              {/* Distância e Tempo */}
              <div className="space-y-4">
                <div className="bg-black/30 rounded-lg p-4 border border-neutral-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Navigation className="w-5 h-5 text-slate-600" />
                      <span className="text-neutral-500 text-sm">Distância</span>
                    </div>
                    <div className="text-white" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                      {distancia} km
                    </div>
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-neutral-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-slate-600" />
                      <span className="text-neutral-500 text-sm">Tempo estimado</span>
                    </div>
                    <div className="text-white" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                      {tempoEstimado}
                    </div>
                  </div>
                </div>
              </div>

              {/* Previsão de Chegada */}
              <div className="mt-6 p-4 bg-slate-700/20 border border-slate-700/30 rounded-lg">
                <div className="text-xs text-neutral-500 mb-1 uppercase tracking-wider">
                  Previsão de chegada
                </div>
                <div className="text-white" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                  Hoje - 16:30
                </div>
              </div>
            </div>

            {/* Dados do Motorista */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-white mb-4 text-sm uppercase tracking-wider">
                Dados do Motorista
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-neutral-600 text-xs mb-1">Nome</div>
                  <div className="text-white">{fornecedoraAtual.motorista}</div>
                </div>
                <div>
                  <div className="text-neutral-600 text-xs mb-1">Veículo</div>
                  <div className="text-white">{fornecedoraAtual.veiculo}</div>
                </div>
                <div>
                  <div className="text-neutral-600 text-xs mb-1">Contato</div>
                  <div className="text-white">{fornecedoraAtual.telefone}</div>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all text-sm">
                📞 Ligar para o motorista
              </button>
            </div>

            {/* Alertas de Proximidade */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-white mb-4 text-sm uppercase tracking-wider">
                Alertas Inteligentes
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-neutral-400 cursor-pointer group">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-neutral-700 bg-black text-slate-700 focus:ring-slate-700 focus:ring-1 cursor-pointer"
                  />
                  <span className="text-sm group-hover:text-neutral-300 transition-colors">
                    Avisar quando estiver a 5km
                  </span>
                </label>
                <label className="flex items-center gap-3 text-neutral-400 cursor-pointer group">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-neutral-700 bg-black text-slate-700 focus:ring-slate-700 focus:ring-1 cursor-pointer"
                  />
                  <span className="text-sm group-hover:text-neutral-300 transition-colors">
                    Avisar quando estiver a 2km
                  </span>
                </label>
                <label className="flex items-center gap-3 text-neutral-400 cursor-pointer group">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-neutral-700 bg-black text-slate-700 focus:ring-slate-700 focus:ring-1 cursor-pointer"
                  />
                  <span className="text-sm group-hover:text-neutral-300 transition-colors">
                    Avisar 10 minutos antes
                  </span>
                </label>
                <label className="flex items-center gap-3 text-neutral-400 cursor-pointer group">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-neutral-700 bg-black text-slate-700 focus:ring-slate-700 focus:ring-1 cursor-pointer"
                  />
                  <span className="text-sm group-hover:text-neutral-300 transition-colors">
                    Avisar 5 minutos antes
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA - Mapa 3D */}
          <div className="col-span-2">
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl overflow-hidden" style={{ height: '900px' }}>
              {/* Header do Mapa */}
              <div className="p-6 bg-neutral-900/60 border-b border-neutral-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-white text-sm uppercase tracking-wider">
                    Mapa em Tempo Real - {fornecedoraAtual.nome}
                  </h3>
                  <div className="flex items-center gap-2 px-3 py-1 bg-cyan-700/20 border border-cyan-700/30 rounded text-cyan-500 text-xs">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                    Atualização ao vivo
                  </div>
                </div>
              </div>

              {/* Mapa Real (Google Maps Embed simulado) */}
              <div className="relative h-full bg-neutral-800">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={fornecedoraAtual.mapUrl}
                />
                
                {/* Overlay com Rota Azul (estilo Waze) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
                  <defs>
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: '#0ea5e9', stopOpacity: 0.9 }} />
                      <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
                    </linearGradient>
                    
                    {/* Sombra para a linha */}
                    <filter id="routeShadow">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                      <feOffset dx="0" dy="2" result="offsetblur"/>
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.5"/>
                      </feComponentTransfer>
                      <feMerge> 
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/> 
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Linha de rota azul estilo Waze */}
                  <path
                    d={fornecedoraAtual.pathRota}
                    stroke="url(#routeGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#routeShadow)"
                    className="animate-[dashFlow_2s_linear_infinite]"
                    strokeDasharray="20,10"
                  />
                  
                  {/* Linha base sólida */}
                  <path
                    d={fornecedoraAtual.pathRota}
                    stroke="#0ea5e9"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.4"
                  />
                </svg>

                {/* Ponto de ORIGEM (Fornecedora) */}
                <div className="absolute pointer-events-none" style={{ left: `${fornecedoraAtual.pontoOrigem.x}px`, top: `${fornecedoraAtual.pontoOrigem.y}px`, zIndex: 20 }}>
                  <div className="relative flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full border-4 border-white shadow-2xl flex items-center justify-center animate-pulse">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -bottom-16 whitespace-nowrap bg-blue-900/95 backdrop-blur-sm border border-blue-700 px-4 py-2 rounded-lg shadow-xl">
                      <div className="text-white text-xs mb-1">📦 Origem</div>
                      <div className="text-blue-300 text-xs">{fornecedoraAtual.origem}</div>
                    </div>
                  </div>
                </div>

                {/* Ponto de DESTINO (Sua Vidraçaria) */}
                <div className="absolute pointer-events-none" style={{ left: `${fornecedoraAtual.pontoDestino.x}px`, top: `${fornecedoraAtual.pontoDestino.y}px`, zIndex: 20 }}>
                  <div className="relative flex flex-col items-center">
                    <div className="w-14 h-14 bg-green-600 rounded-full border-4 border-white shadow-2xl flex items-center justify-center animate-pulse">
                      <MapPin className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -top-16 whitespace-nowrap bg-green-900/95 backdrop-blur-sm border border-green-700 px-4 py-2 rounded-lg shadow-xl">
                      <div className="text-white text-xs mb-1">🏢 Destino</div>
                      <div className="text-green-300 text-xs">{fornecedoraAtual.destino}</div>
                    </div>
                  </div>
                </div>

                {/* Caminhão 3D em MOVIMENTO na rota */}
                <div 
                  className="absolute pointer-events-none"
                  style={{ zIndex: 30 }}
                >
                  <div 
                    className="relative"
                    style={{
                      offsetPath: `path('${fornecedoraAtual.pathRota}')`,
                      animation: 'moveAlongPath 20s ease-in-out infinite',
                    }}
                  >
                    {/* Sombra do caminhão */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-12 bg-black/40 rounded-full blur-lg" />
                    
                    {/* Container 3D do Caminhão */}
                    <div className="relative" style={{ 
                      transformStyle: 'preserve-3d',
                      transform: 'perspective(800px) rotateX(20deg) rotateY(-15deg)'
                    }}>
                      {/* Carroceria */}
                      <div className="relative w-20 h-28 bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700 rounded-lg shadow-2xl border-2 border-cyan-400">
                        {/* Cabine do caminhão */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-10 bg-gradient-to-br from-cyan-400 via-cyan-500 to-cyan-600 rounded-t-lg shadow-xl border-2 border-cyan-300">
                          {/* Para-brisa */}
                          <div className="absolute top-1 left-2 right-2 h-4 bg-cyan-200/40 rounded backdrop-blur-sm" />
                          {/* Faróis */}
                          <div className="absolute -bottom-1 left-1 w-2 h-1 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50" />
                          <div className="absolute -bottom-1 right-1 w-2 h-1 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50" />
                        </div>
                        
                        {/* Detalhes da carroceria */}
                        <div className="absolute inset-0 p-2">
                          <div className="w-full h-full border-2 border-cyan-300/30 rounded" />
                        </div>
                        
                        {/* Logo da fornecedora */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl drop-shadow-lg">
                          {fornecedoraAtual.icon}
                        </div>
                        
                        {/* Rodas com animação de rotação */}
                        <div className="absolute -bottom-3 left-2">
                          <div className="w-5 h-5 bg-neutral-900 rounded-full border-2 border-neutral-700 shadow-lg animate-spin" style={{ animationDuration: '0.6s' }}>
                            <div className="absolute inset-1 bg-neutral-800 rounded-full" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-4 bg-neutral-600" />
                          </div>
                        </div>
                        <div className="absolute -bottom-3 right-2">
                          <div className="w-5 h-5 bg-neutral-900 rounded-full border-2 border-neutral-700 shadow-lg animate-spin" style={{ animationDuration: '0.6s' }}>
                            <div className="absolute inset-1 bg-neutral-800 rounded-full" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-4 bg-neutral-600" />
                          </div>
                        </div>
                        <div className="absolute top-8 left-2">
                          <div className="w-5 h-5 bg-neutral-900 rounded-full border-2 border-neutral-700 shadow-lg animate-spin" style={{ animationDuration: '0.6s' }}>
                            <div className="absolute inset-1 bg-neutral-800 rounded-full" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-4 bg-neutral-600" />
                          </div>
                        </div>
                        <div className="absolute top-8 right-2">
                          <div className="w-5 h-5 bg-neutral-900 rounded-full border-2 border-neutral-700 shadow-lg animate-spin" style={{ animationDuration: '0.6s' }}>
                            <div className="absolute inset-1 bg-neutral-800 rounded-full" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-4 bg-neutral-600" />
                          </div>
                        </div>

                        {/* Luzes de freio/sinalização */}
                        <div className="absolute bottom-2 left-1 w-2 h-2 bg-red-600 rounded-sm shadow-lg shadow-red-600/50 animate-pulse" />
                        <div className="absolute bottom-2 right-1 w-2 h-2 bg-red-600 rounded-sm shadow-lg shadow-red-600/50 animate-pulse" />
                      </div>
                    </div>
                    
                    {/* Info bubble do motorista */}
                    <div className="absolute -top-28 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/95 backdrop-blur-sm border-2 border-cyan-600 px-5 py-3 rounded-xl shadow-2xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Truck className="w-4 h-4 text-cyan-400" />
                        <div className="text-white">{fornecedoraAtual.motorista}</div>
                      </div>
                      <div className="flex items-center gap-4 text-cyan-300 text-xs">
                        <span>📍 {distancia} km</span>
                        <span>•</span>
                        <span>⏱️ {tempoEstimado}</span>
                      </div>
                      {/* Seta apontando para o caminhão */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black/95 border-r-2 border-b-2 border-cyan-600 rotate-45" />
                    </div>
                  </div>
                </div>

                {/* Legenda */}
                <div className="absolute bottom-6 left-6 bg-black/90 border border-neutral-700 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-white text-xs mb-3 uppercase tracking-wider">Legenda</div>
                  <div className="space-y-2 text-xs text-neutral-400">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-cyan-500" />
                      <span>Caminhão {fornecedoraAtual.nome}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-1 bg-cyan-500 rounded" />
                      <span>Rota em tempo real</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-500" />
                      <span>Seu destino</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-blue-500" />
                      <span>Origem (fornecedor)</span>
                    </div>
                  </div>
                </div>

                {/* Status overlay */}
                <div className="absolute top-6 left-6 bg-gradient-to-r from-cyan-900/90 to-blue-900/90 backdrop-blur-sm border border-cyan-700 rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2 text-cyan-300 text-sm">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    🚚 Em rota para entrega
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botão Voltar */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => onNavigate('minhas-entregas')}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para Minhas Entregas
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes moveRoute {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(50px, -30px);
          }
          50% {
            transform: translate(100px, 20px);
          }
          75% {
            transform: translate(50px, 60px);
          }
        }

        @keyframes dashFlow {
          0% {
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes moveAlongPath {
          0% {
            offsetDistance: 0%;
          }
          100% {
            offsetDistance: 100%;
          }
        }
      `}</style>
    </div>
  );
}