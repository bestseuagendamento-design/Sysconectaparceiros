import React, { useState } from 'react';
import { 
  ArrowLeft, Truck, Package, CheckCircle, MapPin, Phone, User, 
  Calendar, Clock, FileText, Printer, Download, Send, Box, Weight, Ruler 
} from 'lucide-react';

interface RomaneioCarregamentoProps {
  pedido: any;
  onVoltar: () => void;
  onConfirmarCarregamento: (dadosRomaneio: any) => void; // 🔥 MODIFICADO: Agora recebe dados
}

export function RomaneioCarregamento({ pedido, onVoltar, onConfirmarCarregamento }: RomaneioCarregamentoProps) {
  const [motorista, setMotorista] = useState('');
  const [placa, setPlaca] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [itensConferidos, setItensConferidos] = useState<number[]>([]);

  const dataCarregamento = new Date().toLocaleDateString('pt-BR');
  const horaCarregamento = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const conferirItem = (index: number) => {
    if (itensConferidos.includes(index)) {
      setItensConferidos(itensConferidos.filter(i => i !== index));
    } else {
      setItensConferidos([...itensConferidos, index]);
    }
  };

  const todosConferidos = pedido.vidros?.length > 0 && itensConferidos.length === pedido.vidros.length;

  const calcularPesoTotal = () => {
    if (!pedido.vidros) return 0;
    return pedido.vidros.reduce((total: number, vidro: any) => {
      // Cálculo aproximado: área x espessura x densidade do vidro (2.5 kg/dm³)
      const area = (vidro.largura / 1000) * (vidro.altura / 1000); // m²
      const volume = area * (vidro.espessura || 8) / 1000; // m³
      const peso = volume * 2500; // kg (densidade do vidro)
      return total + peso;
    }, 0);
  };

  const calcularAreaTotal = () => {
    if (!pedido.vidros) return 0;
    return pedido.vidros.reduce((total: number, vidro: any) => {
      const area = (vidro.largura / 1000) * (vidro.altura / 1000);
      return total + area;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onVoltar}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para Gestão de Produção
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-neutral-900 mb-2">Romaneio de Carregamento</h1>
              <p className="text-neutral-600">
                Pedido #{pedido.numero || pedido.numeroPedido} • {typeof pedido.cliente === 'string' ? pedido.cliente : pedido.cliente?.nome || 'Cliente'}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-neutral-900 rounded-lg hover:bg-neutral-50 transition-colors">
                <Printer className="w-5 h-5" />
                Imprimir
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-neutral-900 rounded-lg hover:bg-neutral-50 transition-colors">
                <Download className="w-5 h-5" />
                Exportar PDF
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Coluna Principal - Romaneio */}
          <div className="col-span-2 space-y-6">
            {/* Informações do Pedido */}
            <div className="bg-white rounded-2xl border-2 border-neutral-900 p-8 shadow-lg">
              <h2 className="text-neutral-900 font-bold text-xl mb-6 flex items-center gap-3">
                <Package className="w-6 h-6" />
                Informações do Pedido
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-neutral-600 text-sm mb-1">Número do Pedido</div>
                  <div className="text-neutral-900 font-bold text-lg">#{pedido.numero || pedido.numeroPedido}</div>
                </div>
                <div>
                  <div className="text-neutral-600 text-sm mb-1">Data de Carregamento</div>
                  <div className="text-neutral-900 font-bold text-lg">{dataCarregamento}</div>
                </div>
                <div>
                  <div className="text-neutral-600 text-sm mb-1">Cliente</div>
                  <div className="text-neutral-900 font-bold">{typeof pedido.cliente === 'string' ? pedido.cliente : pedido.cliente?.nome || 'Cliente'}</div>
                </div>
                <div>
                  <div className="text-neutral-600 text-sm mb-1">Obra</div>
                  <div className="text-neutral-900 font-bold">{pedido.nomeObra || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-neutral-600 text-sm mb-1">Endereço de Entrega</div>
                  <div className="text-neutral-900 font-bold">{pedido.enderecoObra || 'A definir'}</div>
                </div>
                <div>
                  <div className="text-neutral-600 text-sm mb-1">Telefone</div>
                  <div className="text-neutral-900 font-bold">{pedido.telefone || '(00) 0000-0000'}</div>
                </div>
              </div>
            </div>

            {/* Dados do Transporte */}
            <div className="bg-white rounded-2xl border-2 border-neutral-900 p-8 shadow-lg">
              <h2 className="text-neutral-900 font-bold text-xl mb-6 flex items-center gap-3">
                <Truck className="w-6 h-6" />
                Dados do Transporte
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-neutral-600 text-sm mb-2 block">Motorista</label>
                  <input
                    type="text"
                    value={motorista}
                    onChange={(e) => setMotorista(e.target.value)}
                    placeholder="Nome completo do motorista"
                    className="w-full px-4 py-3 bg-neutral-50 border-2 border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-neutral-600 text-sm mb-2 block">Placa do Veículo</label>
                  <input
                    type="text"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                    placeholder="ABC-1234"
                    className="w-full px-4 py-3 bg-neutral-50 border-2 border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none transition-colors"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-neutral-600 text-sm mb-2 block">Observações</label>
                  <textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Adicione observações sobre o carregamento..."
                    rows={3}
                    className="w-full px-4 py-3 bg-neutral-50 border-2 border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Lista de Vidros para Conferência */}
            <div className="bg-white rounded-2xl border-2 border-neutral-900 p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-neutral-900 font-bold text-xl flex items-center gap-3">
                  <Box className="w-6 h-6" />
                  Conferência de Vidros ({itensConferidos.length}/{pedido.vidros?.length || 0})
                </h2>
                {todosConferidos && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-bold">
                    <CheckCircle className="w-5 h-5" />
                    Todos Conferidos
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {pedido.vidros?.map((vidro: any, index: number) => {
                  const conferido = itensConferidos.includes(index);
                  const area = ((vidro.largura / 1000) * (vidro.altura / 1000)).toFixed(2);
                  
                  return (
                    <div
                      key={index}
                      onClick={() => conferirItem(index)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        conferido 
                          ? 'bg-green-50 border-green-600' 
                          : 'bg-neutral-50 border-neutral-200 hover:border-neutral-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                            conferido ? 'bg-green-600 text-white' : 'bg-neutral-200 text-neutral-700'
                          }`}>
                            {conferido ? <CheckCircle className="w-6 h-6" /> : vidro.codigo}
                          </div>
                          <div>
                            <div className="text-neutral-900 font-bold">
                              Vidro {vidro.codigo} - {vidro.tipo || 'Incolor'}
                            </div>
                            <div className="text-neutral-600 text-sm">
                              {vidro.largura}mm × {vidro.altura}mm • {vidro.espessura || 8}mm • {area}m²
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-neutral-600 text-sm">Quantidade</div>
                          <div className="text-neutral-900 font-bold text-lg">{vidro.quantidade || 1} un</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Coluna Lateral - Resumo e Ações */}
          <div className="space-y-6">
            {/* Resumo de Carregamento */}
            <div className="bg-white rounded-2xl border-2 border-neutral-900 p-6 shadow-lg">
              <h3 className="text-neutral-900 font-bold mb-4">Resumo do Carregamento</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Box className="w-4 h-4" />
                    <span className="text-sm">Total de Peças</span>
                  </div>
                  <span className="font-bold text-blue-900">{pedido.vidros?.length || 0}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 text-purple-700">
                    <Ruler className="w-4 h-4" />
                    <span className="text-sm">Área Total</span>
                  </div>
                  <span className="font-bold text-purple-900">{calcularAreaTotal().toFixed(2)}m²</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2 text-orange-700">
                    <Weight className="w-4 h-4" />
                    <span className="text-sm">Peso Estimado</span>
                  </div>
                  <span className="font-bold text-orange-900">{calcularPesoTotal().toFixed(1)}kg</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Conferidos</span>
                  </div>
                  <span className="font-bold text-green-900">{itensConferidos.length}/{pedido.vidros?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Informações de Tempo */}
            <div className="bg-neutral-900 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold mb-4">Data e Hora</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-neutral-400" />
                  <div>
                    <div className="text-neutral-400 text-xs">Data</div>
                    <div className="font-bold">{dataCarregamento}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-neutral-400" />
                  <div>
                    <div className="text-neutral-400 text-xs">Horário</div>
                    <div className="font-bold">{horaCarregamento}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status de Validação */}
            <div className={`rounded-2xl p-6 border-2 ${
              todosConferidos && motorista && placa
                ? 'bg-green-50 border-green-600'
                : 'bg-amber-50 border-amber-600'
            }`}>
              <h3 className={`font-bold mb-4 ${
                todosConferidos && motorista && placa ? 'text-green-900' : 'text-amber-900'
              }`}>
                Validação do Carregamento
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className={`flex items-center gap-2 ${
                  todosConferidos ? 'text-green-700' : 'text-amber-700'
                }`}>
                  {todosConferidos ? <CheckCircle className="w-4 h-4" /> : <Box className="w-4 h-4" />}
                  {todosConferidos ? 'Todos os vidros conferidos' : 'Confira todos os vidros'}
                </div>
                <div className={`flex items-center gap-2 ${
                  motorista ? 'text-green-700' : 'text-amber-700'
                }`}>
                  {motorista ? <CheckCircle className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  {motorista ? 'Motorista informado' : 'Informe o motorista'}
                </div>
                <div className={`flex items-center gap-2 ${
                  placa ? 'text-green-700' : 'text-amber-700'
                }`}>
                  {placa ? <CheckCircle className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                  {placa ? 'Placa informada' : 'Informe a placa'}
                </div>
              </div>
            </div>

            {/* Botão de Confirmação */}
            <button
              onClick={() => {
                // 🔥 NOVO: Preparar dados do romaneio
                const dadosRomaneio = {
                  motorista,
                  placa,
                  observacoes,
                  itensConferidos,
                  dataCarregamento,
                  horaCarregamento,
                  pesoTotal: calcularPesoTotal().toFixed(1),
                  areaTotal: calcularAreaTotal().toFixed(2)
                };
                onConfirmarCarregamento(dadosRomaneio);
              }}
              disabled={!todosConferidos || !motorista || !placa}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                todosConferidos && motorista && placa
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-6 h-6" />
              CONFIRMAR CARREGAMENTO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}