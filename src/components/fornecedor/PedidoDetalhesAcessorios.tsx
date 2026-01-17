/**
 * 🔧 PEDIDO - VISÃO DO FORNECEDOR DE ACESSÓRIOS
 * Mostra APENAS: lista de itens (roldanas, puxadores, fechaduras, etc.)
 */

import React from 'react';
import { Package, CheckCircle } from 'lucide-react';

interface PedidoDetalhesAcessoriosProps {
  pedido: {
    id: string;
    cliente: string;
    data: string;
    acessorios: {
      roldanas: {
        tipo: string;
        codigo: string;
        quantidade: number;
        descricao: string;
      };
      puxadores: {
        tipo: string;
        codigo: string;
        quantidade: number;
        descricao: string;
      };
      fechaduras: {
        tipo: string;
        codigo: string | null;
        quantidade: number;
        descricao: string;
      };
      vedacao: {
        codigo: string;
        metros_lineares: number;
        descricao: string;
      };
      tampas: {
        codigo: string;
        quantidade: number;
      };
      parafusos: {
        codigo: string;
        quantidade: number;
      };
    };
    valor_total: number;
    status: string;
  };
  onAceitar?: () => void;
  onRecusar?: () => void;
}

export function PedidoDetalhesAcessorios({ pedido, onAceitar, onRecusar }: PedidoDetalhesAcessoriosProps) {
  // Criar lista de todos os itens
  const itens = [
    {
      nome: 'Roldanas',
      codigo: pedido.acessorios.roldanas.codigo,
      quantidade: pedido.acessorios.roldanas.quantidade,
      unidade: 'un',
      descricao: pedido.acessorios.roldanas.descricao,
      categoria: 'Ferragens'
    },
    {
      nome: 'Puxadores',
      codigo: pedido.acessorios.puxadores.codigo,
      quantidade: pedido.acessorios.puxadores.quantidade,
      unidade: 'un',
      descricao: pedido.acessorios.puxadores.descricao,
      categoria: 'Ferragens'
    },
    ...(pedido.acessorios.fechaduras.quantidade > 0 ? [{
      nome: 'Fechaduras',
      codigo: pedido.acessorios.fechaduras.codigo || 'N/A',
      quantidade: pedido.acessorios.fechaduras.quantidade,
      unidade: 'un',
      descricao: pedido.acessorios.fechaduras.descricao,
      categoria: 'Ferragens'
    }] : []),
    {
      nome: 'Vedação (Escova)',
      codigo: pedido.acessorios.vedacao.codigo,
      quantidade: pedido.acessorios.vedacao.metros_lineares,
      unidade: 'm',
      descricao: pedido.acessorios.vedacao.descricao,
      categoria: 'Vedação'
    },
    {
      nome: 'Tampas',
      codigo: pedido.acessorios.tampas.codigo,
      quantidade: pedido.acessorios.tampas.quantidade,
      unidade: 'un',
      descricao: 'Tampas para acabamento',
      categoria: 'Acabamento'
    },
    {
      nome: 'Parafusos',
      codigo: pedido.acessorios.parafusos.codigo,
      quantidade: pedido.acessorios.parafusos.quantidade,
      unidade: 'un',
      descricao: 'Parafusos autoatarraxantes 4.0x16mm',
      categoria: 'Fixação'
    }
  ];

  const totalItens = itens.reduce((sum, item) => sum + item.quantidade, 0);

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

      {/* Resumo */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-[#0A0A0A] border border-[#2D2D2D]">
          <p className="text-sm text-[#6B7280] mb-1">Total de Categorias</p>
          <p className="text-3xl font-black text-white">{new Set(itens.map(i => i.categoria)).size}</p>
        </div>
        <div className="p-4 rounded-lg bg-[#0A0A0A] border border-[#2D2D2D]">
          <p className="text-sm text-[#6B7280] mb-1">Total de Itens</p>
          <p className="text-3xl font-black text-white">{totalItens}</p>
        </div>
      </div>

      {/* Lista de Itens por Categoria */}
      <div className="space-y-6 mb-6">
        <h4 className="text-lg font-bold text-white">🔧 Lista de Acessórios</h4>

        {/* Agrupar por categoria */}
        {['Ferragens', 'Vedação', 'Acabamento', 'Fixação'].map(categoria => {
          const itensDaCategoria = itens.filter(i => i.categoria === categoria);
          if (itensDaCategoria.length === 0) return null;

          return (
            <div key={categoria}>
              <h5 className="text-sm font-bold text-[#D4AF37] mb-3">{categoria}</h5>
              <div className="space-y-3">
                {itensDaCategoria.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-[#0A0A0A] border border-[#2D2D2D] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                        <Package className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-white mb-1">{item.nome}</p>
                        <p className="text-sm text-[#9CA3AF]">{item.descricao}</p>
                        <p className="text-xs text-[#6B7280] mt-1">Código: {item.codigo}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-[#D4AF37]">
                        {item.quantidade} {item.unidade}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Checklist de Separação */}
      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-6">
        <p className="text-sm font-bold text-blue-400 mb-3">📋 Checklist de Separação:</p>
        <div className="space-y-2">
          {itens.map((item, idx) => (
            <label key={idx} className="flex items-center gap-3 text-sm text-blue-300 cursor-pointer hover:text-blue-200">
              <input type="checkbox" className="w-4 h-4 rounded border-blue-500/50" />
              <span>{item.quantidade} {item.unidade} - {item.nome} ({item.codigo})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Observações */}
      <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mb-6">
        <p className="text-sm text-yellow-400">
          ⚠️ <strong>Importante:</strong> Confira a quantidade e códigos de todos os itens antes de embalar. 
          Inclua manual de instalação quando aplicável.
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
            Aceitar e Separar Itens
          </button>
        </div>
      )}
    </div>
  );
}
