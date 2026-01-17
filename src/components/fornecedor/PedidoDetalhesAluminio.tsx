/**
 * ⚙️ PEDIDO - VISÃO DO FORNECEDOR DE ALUMÍNIO
 * Mostra APENAS: barras necessárias para o projeto, código, comprimento, peso
 */

import React from 'react';
import { Package, Ruler, Weight } from 'lucide-react';

interface PedidoDetalhesAluminioProps {
  pedido: {
    id: string;
    cliente: string;
    data: string;
    aluminio: {
      cor: string;
      perfis: Array<{
        nome: string;
        codigo: string;
        descricao: string;
        quantidade_barras: number;
        comprimento_unitario_mm: number;
        peso_unitario_kg: number;
        peso_total_kg: number;
      }>;
      peso_total_kg: number;
    };
    valor_total: number;
    status: string;
  };
  onAceitar?: () => void;
  onRecusar?: () => void;
}

export function PedidoDetalhesAluminio({ pedido, onAceitar, onRecusar }: PedidoDetalhesAluminioProps) {
  const totalBarras = pedido.aluminio.perfis.reduce((sum, p) => sum + p.quantidade_barras, 0);

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

      {/* Cor do Alumínio */}
      <div className="mb-6 p-4 rounded-lg bg-[#0A0A0A] border border-[#2D2D2D]">
        <p className="text-sm text-[#6B7280] mb-1">Cor do Alumínio</p>
        <p className="text-2xl font-black text-white">{pedido.aluminio.cor}</p>
      </div>

      {/* Lista de Perfis/Barras */}
      <div className="space-y-4 mb-6">
        <h4 className="text-lg font-bold text-white">📦 Barras Necessárias</h4>
        
        {pedido.aluminio.perfis.map((perfil, idx) => (
          <div
            key={idx}
            className="p-4 rounded-lg bg-[#0A0A0A] border border-[#2D2D2D]"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                    <span className="text-lg font-black text-[#D4AF37]">{perfil.quantidade_barras}</span>
                  </div>
                  <div>
                    <p className="font-bold text-white">{perfil.nome}</p>
                    <p className="text-sm text-[#6B7280]">Código: {perfil.codigo}</p>
                  </div>
                </div>
                <p className="text-sm text-[#9CA3AF] ml-13">{perfil.descricao}</p>
              </div>
            </div>

            {/* Especificações */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="p-3 rounded-lg bg-[#1A1A1A] border border-[#2D2D2D]">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="w-4 h-4 text-[#9CA3AF]" />
                  <p className="text-xs text-[#6B7280]">Quantidade</p>
                </div>
                <p className="text-lg font-bold text-white">{perfil.quantidade_barras}x</p>
              </div>

              <div className="p-3 rounded-lg bg-[#1A1A1A] border border-[#2D2D2D]">
                <div className="flex items-center gap-2 mb-1">
                  <Ruler className="w-4 h-4 text-[#9CA3AF]" />
                  <p className="text-xs text-[#6B7280]">Comprimento</p>
                </div>
                <p className="text-lg font-bold text-white">
                  {perfil.comprimento_unitario_mm >= 6000 
                    ? '6m (padrão)' 
                    : `${(perfil.comprimento_unitario_mm / 1000).toFixed(2)}m`
                  }
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#1A1A1A] border border-[#2D2D2D]">
                <div className="flex items-center gap-2 mb-1">
                  <Weight className="w-4 h-4 text-[#9CA3AF]" />
                  <p className="text-xs text-[#6B7280]">Peso Total</p>
                </div>
                <p className="text-lg font-bold text-[#D4AF37]">{perfil.peso_total_kg.toFixed(2)} kg</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Totais Gerais */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-6 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8941E]">
          <p className="text-black/70 text-sm mb-1">Total de Barras</p>
          <p className="text-4xl font-black text-black">{totalBarras}</p>
        </div>

        <div className="p-6 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8941E]">
          <p className="text-black/70 text-sm mb-1">Peso Total</p>
          <p className="text-4xl font-black text-black">{pedido.aluminio.peso_total_kg.toFixed(2)} kg</p>
        </div>
      </div>

      {/* Observação sobre Cortes */}
      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-6">
        <p className="text-sm text-blue-400 mb-2">
          ℹ️ <strong>Informações de Corte:</strong>
        </p>
        <ul className="text-sm text-blue-300 space-y-1 ml-6">
          <li>• Barras padrão de 6 metros devem ser cortadas conforme comprimento especificado</li>
          <li>• Reaproveite sobras para otimizar material</li>
          <li>• Tolerância de corte: ±0,5mm</li>
          <li>• Cor: {pedido.aluminio.cor} - Não misturar cores diferentes</li>
        </ul>
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
  );
}
