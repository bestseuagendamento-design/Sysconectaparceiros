import { ArrowLeft, Package, MapPin, Clock, Truck, CheckCircle } from 'lucide-react';

interface MinhasEntregasProps {
  onNavigate: (screen: string) => void;
  pedidosVidraceiro: any[];
}

export function MinhasEntregas({ onNavigate, pedidosVidraceiro }: MinhasEntregasProps) {
  // 🔥 FILTRAR APENAS PEDIDOS APROVADOS (que estão em produção, prontos, em rota ou entregues)
  const pedidosAprovados = pedidosVidraceiro.filter(pedido => 
    pedido.status === 'aprovado' || 
    pedido.status === 'em_producao' || 
    pedido.status === 'pronto_para_entrega' ||
    pedido.status === 'em_rota' || 
    pedido.status === 'entregue' ||
    pedido.etapaProducao === 'em-producao' ||
    pedido.etapaProducao === 'corte' ||
    pedido.etapaProducao === 'tmpera' ||
    pedido.etapaProducao === 'embalagem' ||
    pedido.etapaProducao === 'expedicao' ||
    pedido.etapaProducao === 'em_rota' ||
    pedido.etapaProducao === 'entregue'
  );

  const getStatusInfo = (pedido: any) => {
    const etapa = pedido.etapaProducao || pedido.status;
    
    if (etapa === 'entregue') {
      return {
        label: 'Entregue',
        color: { bg: 'bg-emerald-700/20', border: 'border-emerald-700/30', text: 'text-emerald-500' },
        progress: 100,
        icon: <CheckCircle className="w-4 h-4" />
      };
    }
    
    if (etapa === 'em_rota') {
      return {
        label: 'Em rota de entrega',
        color: { bg: 'bg-cyan-700/20', border: 'border-cyan-700/30', text: 'text-cyan-500' },
        progress: 90,
        icon: <Truck className="w-4 h-4" />
      };
    }
    
    if (etapa === 'expedicao') {
      return {
        label: 'Pronto para envio',
        color: { bg: 'bg-green-700/20', border: 'border-green-700/30', text: 'text-green-500' },
        progress: 80,
        icon: <Package className="w-4 h-4" />
      };
    }
    
    if (etapa === 'embalagem') {
      return {
        label: 'Em embalagem',
        color: { bg: 'bg-blue-700/20', border: 'border-blue-700/30', text: 'text-blue-500' },
        progress: 70,
        icon: <Clock className="w-4 h-4" />
      };
    }
    
    if (etapa === 'tmpera') {
      return {
        label: 'Em têmpera',
        color: { bg: 'bg-orange-700/20', border: 'border-orange-700/30', text: 'text-orange-500' },
        progress: 50,
        icon: <Clock className="w-4 h-4" />
      };
    }
    
    if (etapa === 'corte') {
      return {
        label: 'Em corte',
        color: { bg: 'bg-purple-700/20', border: 'border-purple-700/30', text: 'text-purple-500' },
        progress: 30,
        icon: <Clock className="w-4 h-4" />
      };
    }
    
    if (etapa === 'em-producao' || etapa === 'em_producao' || etapa === 'aprovado') {
      return {
        label: 'Em produção',
        color: { bg: 'bg-blue-700/20', border: 'border-blue-700/30', text: 'text-blue-500' },
        progress: 20,
        icon: <Clock className="w-4 h-4" />
      };
    }
    
    return {
      label: 'Processando',
      color: { bg: 'bg-gray-700/20', border: 'border-gray-700/30', text: 'text-gray-500' },
      progress: 10,
      icon: <Clock className="w-4 h-4" />
    };
  };

  const calcularPrevisaoEntrega = (pedido: any) => {
    const etapa = pedido.etapaProducao || pedido.status;
    
    if (etapa === 'entregue') {
      const dataEntrega = pedido.dataEntrega ? new Date(pedido.dataEntrega) : new Date();
      return `Entregue em ${dataEntrega.toLocaleDateString('pt-BR')}`;
    }
    
    if (etapa === 'em_rota') {
      const dataRomaneio = pedido.romaneio?.dataCarregamento 
        ? new Date(pedido.romaneio.dataCarregamento) 
        : new Date();
      
      // Adiciona previsão de 4 horas a partir do carregamento
      dataRomaneio.setHours(dataRomaneio.getHours() + 4);
      const horaPrevisao = dataRomaneio.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      return `Hoje - ${horaPrevisao}`;
    }
    
    if (etapa === 'expedicao') {
      return 'Aguardando carregamento';
    }
    
    // Para outras etapas, calcular prazo baseado na data de aprovação
    const dataAprovacao = pedido.dataAprovacao ? new Date(pedido.dataAprovacao) : new Date();
    dataAprovacao.setDate(dataAprovacao.getDate() + 7); // 7 dias úteis
    return dataAprovacao.toLocaleDateString('pt-BR');
  };

  const calcularQuantidadeVidro = (pedido: any) => {
    const vidros = pedido.vidros || pedido.itensOrcamento || [];
    const areaTotal = vidros.reduce((total: number, vidro: any) => {
      return total + (vidro.area || 0);
    }, 0);
    return areaTotal.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-3 tracking-tight font-semibold" style={{ fontSize: '1.75rem' }}>
            Minhas Entregas
          </h2>
          <p className="text-gray-700">
            Acompanhe o status dos seus pedidos com a Santa Rita
          </p>
        </div>

        {/* Lista de Entregas */}
        {pedidosAprovados.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2 font-semibold" style={{ fontSize: '1.25rem' }}>
              Nenhuma entrega em andamento
            </h3>
            <p className="text-gray-700 mb-6">
              Seus pedidos aprovados aparecerão aqui
            </p>
            <button
              onClick={() => onNavigate('03-dashboard-execucao')}
              className="px-6 py-3 bg-[#2C5F6F] hover:bg-[#234A56] text-white rounded-lg transition-all font-medium"
            >
              Voltar ao Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-8 mb-8">
            {pedidosAprovados.map((pedido) => {
              const statusInfo = getStatusInfo(pedido);
              const previsaoEntrega = calcularPrevisaoEntrega(pedido);
              const quantidadeVidro = calcularQuantidadeVidro(pedido);

              return (
                <div key={pedido.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  {/* Header da Entrega */}
                  <div className="p-6 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-gray-900 mb-1 font-semibold" style={{ fontSize: '1.25rem' }}>
                          Pedido #{pedido.numeroPedido || pedido.id}
                        </div>
                        <div className="text-gray-700 text-xs font-medium">
                          Realizado em {pedido.dataFormatada || new Date(pedido.data).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      {/* Botão Ver Rota (só aparece se estiver em rota) */}
                      {(pedido.etapaProducao === 'em_rota' || pedido.status === 'em_rota') && (
                        <button
                          onClick={() => onNavigate('rota-tempo-real')}
                          className="flex items-center gap-2 px-6 py-3 bg-[#2C5F6F] hover:bg-[#234A56] text-white rounded-lg transition-all font-medium"
                        >
                          <MapPin className="w-4 h-4" />
                          Ver rota em tempo real
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Materiais */}
                  <div className="p-6">
                    <div className="space-y-6">
                      {/* VIDRO - SANTA RITA */}
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="text-gray-900 font-semibold" style={{ fontSize: '1rem' }}>
                                {pedido.especificacoes?.cor 
                                  ? `Vidro Temperado ${pedido.especificacoes.espessura} - ${pedido.especificacoes.cor}`
                                  : 'Vidro Temperado'
                                }
                              </div>
                            </div>
                            <div className="text-gray-700 text-sm mb-1 font-medium">
                              Fornecedor: <span className="text-gray-900 font-semibold">Santa Rita</span>
                            </div>
                            <div className="text-gray-700 text-sm mb-1 font-medium">
                              Cliente: <span className="text-gray-900">{pedido.cliente?.nome || 'N/A'}</span>
                            </div>
                            <div className="text-gray-700 text-sm font-medium">
                              Quantidade: <span className="text-gray-900">{quantidadeVidro} m²</span>
                            </div>
                            {pedido.dimensoes && (
                              <div className="text-gray-700 text-sm font-medium">
                                Dimensões: <span className="text-gray-900">
                                  {pedido.dimensoes.larguraTotal}mm x {pedido.dimensoes.alturaTotal}mm
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${statusInfo.color.bg} border ${statusInfo.color.border} ${statusInfo.color.text} text-xs mb-2 font-medium`}>
                              {statusInfo.icon}
                              {statusInfo.label}
                            </div>
                            <div className="text-gray-700 text-xs font-medium">
                              Previsão: <span className="text-gray-900">{previsaoEntrega}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Barra de Progresso */}
                        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                              statusInfo.progress === 100 ? 'bg-emerald-600' :
                              statusInfo.progress >= 90 ? 'bg-cyan-600' :
                              statusInfo.progress >= 80 ? 'bg-green-600' :
                              statusInfo.progress >= 70 ? 'bg-blue-600' :
                              statusInfo.progress >= 50 ? 'bg-orange-600' :
                              statusInfo.progress >= 30 ? 'bg-purple-600' :
                              'bg-blue-600'
                            }`}
                            style={{ width: `${statusInfo.progress}%` }}
                          />
                        </div>

                        {/* Detalhes do Pedido */}
                        {pedido.tipoPedido && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="text-gray-700 text-sm font-medium">
                              Tipo: <span className="text-gray-900">{pedido.tipoPedido}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Informações de Romaneio (se houver) */}
                      {pedido.romaneio && (
                        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                          <h4 className="text-gray-900 font-semibold mb-3" style={{ fontSize: '0.875rem' }}>
                            📋 Informações de Transporte
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-700 font-medium">Motorista:</div>
                              <div className="text-gray-900">{pedido.romaneio.motorista}</div>
                            </div>
                            <div>
                              <div className="text-gray-700 font-medium">Veículo:</div>
                              <div className="text-gray-900">{pedido.romaneio.veiculo}</div>
                            </div>
                            <div>
                              <div className="text-gray-700 font-medium">Placa:</div>
                              <div className="text-gray-900">{pedido.romaneio.placa}</div>
                            </div>
                            <div>
                              <div className="text-gray-700 font-medium">Carregamento:</div>
                              <div className="text-gray-900">
                                {new Date(pedido.romaneio.dataCarregamento).toLocaleString('pt-BR')}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Botão Voltar */}
        <div className="flex justify-center">
          <button
            onClick={() => onNavigate('acompanhar-pedido')}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 rounded-lg transition-all font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
