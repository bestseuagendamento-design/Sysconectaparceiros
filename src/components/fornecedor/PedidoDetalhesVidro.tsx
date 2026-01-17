/**
 * 🪟 PEDIDO - VISÃO DO FORNECEDOR DE VIDRO
 * Mostra APENAS: m², largura, altura, quantidade, cor, tipo de vidro
 */

import React from 'react';
import { Package, Ruler, Palette } from 'lucide-react';

interface PedidoDetalhesVidroProps {
  pedido: {
    id: string;
    cliente: string;
    data: string;
    vidros: {
      tipo: string;
      espessura: string;
      cor: string;
      folhas: Array<{
        numero: number;
        largura_mm: number;
        altura_mm: number;
        area_m2: number;
      }>;
      area_total_m2: number;
    };
    valor_total: number;
    status: string;
  };
  onAceitar?: () => void;
  onRecusar?: () => void;
}

export function PedidoDetalhesVidro({ pedido, onAceitar, onRecusar }: PedidoDetalhesVidroProps) {
  return (
    <div className="p-6 rounded-xl bg-[#1A1A1A] border border-[#2D2D2D]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#2D2D2D]">
        <div>
          <h3 className="text-2xl font-black text-white mb-1">Pedido #{pedido.id}</h3>
          <p className="text-sm text-[#9CA3AF]">Cliente: {pedido.cliente}</p>
          <p className="text-xs text-[#6B7280]">{pedido.data}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-[#6B7280] mb-1">Valor Total</p>
          <p className="text-2xl font-black text-[#D4AF37]">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.valor_total)}
          </p>
        </div>
      </div>

      {/* Especificações do Vidro */}
      <div className="space-y-6">
        {/* Tipo e Características */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-[#0A0A0A] border border-[#2D2D2D]">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-[#9CA3AF]" />
              <p className="text-sm text-[#6B7280]">Tipo de Vidro</p>
            </div>
            <p className="text-lg font-bold text-white">{pedido.vidros.tipo}</p>
          </div>

          <div className="p-4 rounded-lg bg-[#0A0A0A] border border-[#2D2D2D]">
            <div className="flex items-center gap-2 mb-2">
              <Ruler className="w-5 h-5 text-[#9CA3AF]" />
              <p className="text-sm text-[#6B7280]">Espessura</p>
            </div>
            <p className="text-lg font-bold text-white">{pedido.vidros.espessura} mm</p>
          </div>

          <div className="p-4 rounded-lg bg-[#0A0A0A] border border-[#2D2D2D]">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="w-5 h-5 text-[#9CA3AF]" />
              <p className="text-sm text-[#6B7280]">Cor</p>
            </div>
            <p className="text-lg font-bold text-white">{pedido.vidros.cor}</p>
          </div>
        </div>

        {/* Medidas das Folhas */}
        <div>
          <h4 className="text-lg font-bold text-white mb-4">📐 Medidas das Folhas</h4>
          <div className="space-y-3">
            {pedido.vidros.folhas.map((folha) => (
              <div
                key={folha.numero}
                className="p-4 rounded-lg bg-[#0A0A0A] border border-[#2D2D2D] flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                    <span className="text-xl font-black text-[#D4AF37]">{folha.numero}</span>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280]">Folha {folha.numero}</p>
                    <p className="text-lg font-bold text-white">
                      {folha.largura_mm} mm × {folha.altura_mm} mm
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#6B7280]">Área</p>
                  <p className="text-xl font-black text-[#D4AF37]">{folha.area_m2} m²</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totais */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8941E]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black/70 text-sm mb-1">Área Total de Vidro</p>
              <p className="text-3xl font-black text-black">{pedido.vidros.area_total_m2} m²</p>
            </div>
            <div className="text-right">
              <p className="text-black/70 text-sm mb-1">Quantidade de Folhas</p>
              <p className="text-3xl font-black text-black">{pedido.vidros.folhas.length}</p>
            </div>
          </div>
        </div>

        {/* Observação Importante */}
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-sm text-blue-400">
            ℹ️ <strong>Importante:</strong> Corte com precisão conforme as medidas exatas. 
            Tolerância máxima: ±1mm.
          </p>
        </div>

        {/* Ações */}
        {pedido.status === 'em_analise' && onAceitar && onRecusar && (
          <div className="flex gap-4">
            <button
              onClick={onRecusar}
              className="flex-1 py-3 bg-[#0A0A0A] border border-[#2D2D2D] hover:border-red-500 text-white rounded-lg transition-all"
            >
              Recusar Pedido
            </button>
            <button
              onClick={onAceitar}
              className="flex-1 py-3 bg-[#D4AF37] hover:bg-[#B8941E] text-black font-bold rounded-lg transition-all"
            >
              Aceitar e Iniciar Produção
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
