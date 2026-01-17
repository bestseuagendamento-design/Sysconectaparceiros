/**
 * 🗺️ ROTAS DE ENTREGA - Gestão Completa de Logística
 * Sistema inteligente de agrupamento de pedidos por localização e dia da semana
 */

import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Calendar, Package, Truck, Navigation, Clock, CheckCircle, Filter, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { MapaEntregas } from './MapaEntregas';

interface RotasEntregaProps {
  fornecedorId: string;
}

interface PedidoPronto {
  id: string;
  vidraceiro_nome: string;
  vidraceiro_endereco: string;
  vidraceiro_numero: string;
  vidraceiro_bairro: string;
  vidraceiro_cidade: string;
  vidraceiro_estado: string;
  vidraceiro_telefone: string;
  valor_total: number;
  data_pedido: string;
  status: string;
  items: any[];
  distancia_km?: number;
  tempo_estimado?: string;
}

interface RotaAgrupada {
  dia: string;
  regiao: string;
  pedidos: PedidoPronto[];
  distancia_total: number;
  tempo_total: string;
  cor: string;
}

const DIAS_SEMANA = [
  { id: 'segunda', nome: 'Segunda-feira', cor: 'blue' },
  { id: 'terca', nome: 'Terça-feira', cor: 'purple' },
  { id: 'quarta', nome: 'Quarta-feira', cor: 'emerald' },
  { id: 'quinta', nome: 'Quinta-feira', cor: 'orange' },
  { id: 'sexta', nome: 'Sexta-feira', cor: 'pink' },
];

const REGIOES_SC = [
  { id: 'florianopolis', nome: 'Grande Florianópolis', cidades: ['Florianópolis', 'São José', 'Palhoça', 'Biguaçu', 'Santo Amaro da Imperatriz'] },
  { id: 'norte', nome: 'Norte (Joinville/Jaraguá)', cidades: ['Joinville', 'Jaraguá do Sul', 'São Francisco do Sul', 'Itajaí', 'Balneário Camboriú'] },
  { id: 'sul', nome: 'Sul (Criciúma/Tubarão)', cidades: ['Criciúma', 'Tubarão', 'Laguna', 'Araranguá', 'Içara'] },
  { id: 'oeste', nome: 'Oeste (Chapecó/Xanxerê)', cidades: ['Chapecó', 'Xanxerê', 'Concórdia', 'São Miguel do Oeste'] },
  { id: 'vale', nome: 'Vale do Itajaí', cidades: ['Blumenau', 'Brusque', 'Rio do Sul', 'Indaial'] },
  { id: 'outras', nome: 'Outras Cidades', cidades: [] }
];

export function RotasEntrega({ fornecedorId }: RotasEntregaProps) {
  const [pedidosProntos, setPedidosProntos] = useState<PedidoPronto[]>([]);
  const [loading, setLoading] = useState(true);
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);
  const [regiaoSelecionada, setRegiaoSelecionada] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [rotaExpandida, setRotaExpandida] = useState<string | null>(null);

  useEffect(() => {
    carregarPedidosProntos();
  }, [fornecedorId]);

  const carregarPedidosProntos = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos/fornecedor/${fornecedorId}`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );

      if (response.ok) {
        const data = await response.json();
        // 🔥 FILTRAR APENAS PEDIDOS COM STATUS "PRONTO" (prontos para entrega)
        const prontos = data.pedidos?.filter((p: any) => 
          p.status === 'pronto'
        ) || [];
        setPedidosProntos(prontos);
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos prontos:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Identificar região baseado na cidade
  const identificarRegiao = (cidade: string): string => {
    for (const regiao of REGIOES_SC) {
      if (regiao.cidades.some(c => cidade.toLowerCase().includes(c.toLowerCase()))) {
        return regiao.id;
      }
    }
    return 'outras';
  };

  // 🔥 Agrupar pedidos por região
  const pedidosPorRegiao = useMemo(() => {
    const grupos: { [key: string]: PedidoPronto[] } = {};
    
    pedidosProntos.forEach(pedido => {
      const regiao = identificarRegiao(pedido.vidraceiro_cidade || '');
      if (!grupos[regiao]) {
        grupos[regiao] = [];
      }
      grupos[regiao].push(pedido);
    });

    return grupos;
  }, [pedidosProntos]);

  // 🔥 Calcular distância estimada (simplificado - em produção usar Google Maps API)
  const calcularDistanciaEstimada = (cidade: string): number => {
    const distancias: { [key: string]: number } = {
      'florianopolis': 0,
      'norte': 120,
      'sul': 180,
      'oeste': 550,
      'vale': 140,
      'outras': 200
    };
    const regiao = identificarRegiao(cidade);
    return distancias[regiao] || 200;
  };

  // 🔥 Calcular tempo estimado
  const calcularTempoEstimado = (distancia: number): string => {
    const horas = Math.floor(distancia / 60); // 60 km/h média
    const minutos = Math.round((distancia / 60 - horas) * 60);
    return horas > 0 ? `${horas}h${minutos > 0 ? minutos + 'min' : ''}` : `${minutos}min`;
  };

  // 🔥 Criar rotas otimizadas
  const rotasOtimizadas = useMemo(() => {
    const rotas: RotaAgrupada[] = [];

    Object.entries(pedidosPorRegiao).forEach(([regiaoId, pedidos]) => {
      if (pedidos.length === 0) return;

      const regiao = REGIOES_SC.find(r => r.id === regiaoId);
      if (!regiao) return;

      // Distribuir pedidos pelos dias da semana
      const pedidosPorDia = Math.ceil(pedidos.length / DIAS_SEMANA.length);
      
      DIAS_SEMANA.forEach((dia, idx) => {
        const pedidosDia = pedidos.slice(idx * pedidosPorDia, (idx + 1) * pedidosPorDia);
        
        if (pedidosDia.length > 0) {
          const distanciaTotal = pedidosDia.reduce((acc, p) => 
            acc + calcularDistanciaEstimada(p.vidraceiro_cidade || ''), 0
          );
          
          rotas.push({
            dia: dia.id,
            regiao: regiao.nome,
            pedidos: pedidosDia,
            distancia_total: distanciaTotal,
            tempo_total: calcularTempoEstimado(distanciaTotal),
            cor: dia.cor
          });
        }
      });
    });

    return rotas;
  }, [pedidosPorRegiao]);

  // 🔥 Filtrar rotas
  const rotasFiltradas = rotasOtimizadas.filter(rota => {
    if (diaSelecionado && rota.dia !== diaSelecionado) return false;
    if (regiaoSelecionada && !rota.regiao.toLowerCase().includes(regiaoSelecionada.toLowerCase())) return false;
    if (busca && !rota.regiao.toLowerCase().includes(busca.toLowerCase()) && 
        !rota.pedidos.some(p => p.vidraceiro_nome.toLowerCase().includes(busca.toLowerCase()))) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Truck className="w-16 h-16 text-slate-300 animate-bounce mx-auto mb-4" />
          <p className="text-slate-500">Carregando rotas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-blue-500 rounded-xl">
            <Navigation className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Rotas de Entrega</h1>
            <p className="text-slate-600">Gestão inteligente de logística e entregas</p>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-slate-600">Pedidos Prontos</p>
              <p className="text-2xl font-black text-slate-900">{pedidosProntos.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-emerald-200">
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8 text-emerald-500" />
            <div>
              <p className="text-sm text-slate-600">Rotas Planejadas</p>
              <p className="text-2xl font-black text-slate-900">{rotasOtimizadas.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
          <div className="flex items-center gap-3">
            <MapPin className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-slate-600">Regiões Atendidas</p>
              <p className="text-2xl font-black text-slate-900">{Object.keys(pedidosPorRegiao).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-orange-200">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-sm text-slate-600">Distância Total</p>
              <p className="text-2xl font-black text-slate-900">
                {rotasOtimizadas.reduce((acc, r) => acc + r.distancia_total, 0)} km
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-6 mb-6 border border-slate-200">
        <div className="flex flex-wrap gap-4">
          {/* Busca */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por região ou cliente..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtro por Dia */}
          <select
            value={diaSelecionado || ''}
            onChange={(e) => setDiaSelecionado(e.target.value || null)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos os dias</option>
            {DIAS_SEMANA.map(dia => (
              <option key={dia.id} value={dia.id}>{dia.nome}</option>
            ))}
          </select>

          {/* Botão Limpar Filtros */}
          {(diaSelecionado || regiaoSelecionada || busca) && (
            <button
              onClick={() => {
                setDiaSelecionado(null);
                setRegiaoSelecionada(null);
                setBusca('');
              }}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Lista de Rotas */}
      <div className="space-y-4">
        {rotasFiltradas.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
            <Truck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Nenhuma rota encontrada com os filtros aplicados.</p>
          </div>
        ) : (
          rotasFiltradas.map((rota, idx) => {
            const isExpandida = rotaExpandida === `${rota.dia}-${rota.regiao}`;
            const dia = DIAS_SEMANA.find(d => d.id === rota.dia);
            
            return (
              <motion.div
                key={`${rota.dia}-${rota.regiao}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-white rounded-xl border-2 border-${rota.cor}-200 overflow-hidden`}
              >
                {/* Header da Rota */}
                <div
                  onClick={() => setRotaExpandida(isExpandida ? null : `${rota.dia}-${rota.regiao}`)}
                  className={`p-6 bg-${rota.cor}-50 cursor-pointer hover:bg-${rota.cor}-100 transition-colors`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 bg-${rota.cor}-500 rounded-xl`}>
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900">{dia?.nome}</h3>
                        <p className="text-slate-600">{rota.regiao}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-slate-600">Pedidos</p>
                        <p className={`text-2xl font-black text-${rota.cor}-600`}>{rota.pedidos.length}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600">Distância</p>
                        <p className="text-lg font-bold text-slate-900">{rota.distancia_total} km</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600">Tempo Est.</p>
                        <p className="text-lg font-bold text-slate-900">{rota.tempo_total}</p>
                      </div>
                      {isExpandida ? (
                        <ChevronUp className="w-6 h-6 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Detalhes da Rota (Expandível) */}
                <AnimatePresence>
                  {isExpandida && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t-2 border-slate-100"
                    >
                      <div className="p-6 space-y-4">
                        {rota.pedidos.map((pedido, pedidoIdx) => (
                          <div
                            key={pedido.id}
                            className="bg-slate-50 rounded-lg p-4 border border-slate-200"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`font-black text-${rota.cor}-600 text-lg`}>
                                    #{pedidoIdx + 1}
                                  </span>
                                  <h4 className="font-bold text-slate-900">{pedido.vidraceiro_nome}</h4>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div className="flex items-center gap-2 text-slate-600">
                                    <MapPin className="w-4 h-4" />
                                    <span>
                                      {pedido.vidraceiro_endereco}, {pedido.vidraceiro_numero}
                                      {pedido.vidraceiro_bairro && ` - ${pedido.vidraceiro_bairro}`}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-slate-600">
                                    <MapPin className="w-4 h-4" />
                                    <span>{pedido.vidraceiro_cidade} - {pedido.vidraceiro_estado}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-slate-600">
                                    <Package className="w-4 h-4" />
                                    <span>{pedido.items?.length || 0} item(ns)</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-slate-600">
                                    <Clock className="w-4 h-4" />
                                    <span>{calcularTempoEstimado(calcularDistanciaEstimada(pedido.vidraceiro_cidade || ''))}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="text-right">
                                <p className="text-2xl font-black text-emerald-600">
                                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.valor_total)}
                                </p>
                                <button
                                  className={`mt-2 px-4 py-2 bg-${rota.cor}-500 text-white rounded-lg hover:bg-${rota.cor}-600 transition-colors text-sm font-bold`}
                                >
                                  Ver Mapa
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Botão Gerar Rota Otimizada */}
                        <button
                          className={`w-full mt-4 py-3 bg-${rota.cor}-500 text-white rounded-lg hover:bg-${rota.cor}-600 transition-colors font-bold flex items-center justify-center gap-2`}
                        >
                          <Navigation className="w-5 h-5" />
                          Gerar Rota Otimizada no Google Maps
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Footer com Mapa Interativo */}
      <div className="mt-8 bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-blue-500" />
          Mapa de Entregas - Todos os Pedidos Prontos
        </h3>
        <MapaEntregas 
          enderecos={pedidosProntos.map(p => ({
            nome: p.vidraceiro_nome,
            endereco: p.vidraceiro_endereco,
            numero: p.vidraceiro_numero,
            bairro: p.vidraceiro_bairro,
            cidade: p.vidraceiro_cidade,
            estado: p.vidraceiro_estado,
            valor: p.valor_total,
            items: p.items?.length || 0,
          }))}
        />
      </div>
    </div>
  );
}