import React from 'react';
import { AlertCircle, Bug, X } from 'lucide-react';

interface DebugPedidoFornecedorProps {
  pedidos: any[];
}

export function DebugPedidoFornecedor({ pedidos }: DebugPedidoFornecedorProps) {
  const [mostrar, setMostrar] = React.useState(false);

  if (!mostrar) {
    return (
      <button
        onClick={() => setMostrar(true)}
        className="fixed bottom-20 right-4 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-bold shadow-lg z-50 flex items-center gap-2 animate-pulse"
      >
        <Bug className="w-5 h-5" />
        🔍 DEBUG PEDIDOS FORNECEDOR ({pedidos.length})
      </button>
    );
  }

  // Análise dos dados
  const problemas = [];
  
  pedidos.forEach((p, idx) => {
    const probs = [];
    
    // 1. Numeração
    if (p.id && p.id.slice(0, 8) === pedidos[0]?.id.slice(0, 8) && idx > 0) {
      probs.push('❌ Numeração incorreta (todos como Pedido 1)');
    }
    
    // 2. Nome do vidraceiro
    if (p.vidraceiro_nome === 'Vidraçaria Parceira' || !p.vidraceiro_nome) {
      probs.push('❌ Nome do vidraceiro: "Vidraçaria Parceira" ou vazio');
    }
    
    // 3. Itens sem medida
    if (p.items && p.items.some((i: any) => !i.medida)) {
      probs.push('❌ Itens sem medida (largura x altura)');
    }
    
    // 4. Sem imagem do configurador
    if (!p.imagem_configurador && !p.configurador_imagem) {
      probs.push('⚠️ Sem imagem do configurador');
    }
    
    // 5. Status de pagamento
    if (!p.status_pagamento && !p.percentual_pago) {
      probs.push('⚠️ Sem status de pagamento (50% ou 100%)');
    }
    
    // 6. Comprovante
    if (p.comprovante_url && p.comprovante_url.startsWith('blob:')) {
      probs.push('⚠️ Comprovante é blob (não acessível após reload)');
    }
    
    // 7. Dados incompletos do vidraceiro
    if (!p.vidraceiro_telefone || !p.vidraceiro_email) {
      probs.push('⚠️ Dados incompletos do vidraceiro');
    }
    
    if (probs.length > 0) {
      problemas.push({
        id: p.id,
        index: idx,
        pedido: p,
        problemas: probs
      });
    }
  });

  // Estatísticas por status
  const stats = {
    aguardando_aprovacao: pedidos.filter(p => p.status === 'aguardando_aprovacao').length,
    aprovado: pedidos.filter(p => p.status === 'aprovado').length,
    producao: pedidos.filter(p => p.status === 'producao' || p.status === 'corte' || p.status === 'lapidacao' || p.status === 'tempera').length,
    entrega: pedidos.filter(p => p.status === 'saiu_entrega' || p.status === 'carregando').length,
    entregue: pedidos.filter(p => p.status === 'entregue').length,
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto p-8">
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b">
          <h2 className="text-2xl font-black text-slate-900">🔍 DEBUG: Pedidos do Fornecedor</h2>
          <button
            onClick={() => setMostrar(false)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold flex items-center gap-2"
          >
            <X className="w-5 h-5" />
            Fechar
          </button>
        </div>

        {/* Estatísticas por Status */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
            📊 Estatísticas por Status
          </h3>
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-lg border-2 border-orange-300">
              <p className="text-xs text-orange-700 font-bold mb-1">NOVOS</p>
              <p className="text-3xl font-black text-orange-600">{stats.aguardando_aprovacao}</p>
              <p className="text-xs text-orange-500">Aguardando aprovação</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-blue-300">
              <p className="text-xs text-blue-700 font-bold mb-1">APROVADOS</p>
              <p className="text-3xl font-black text-blue-600">{stats.aprovado}</p>
              <p className="text-xs text-blue-500">Prontos para produção</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-purple-300">
              <p className="text-xs text-purple-700 font-bold mb-1">PRODUÇÃO</p>
              <p className="text-3xl font-black text-purple-600">{stats.producao}</p>
              <p className="text-xs text-purple-500">Em andamento</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-cyan-300">
              <p className="text-xs text-cyan-700 font-bold mb-1">ENTREGA</p>
              <p className="text-3xl font-black text-cyan-600">{stats.entrega}</p>
              <p className="text-xs text-cyan-500">Saiu para entrega</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-emerald-300">
              <p className="text-xs text-emerald-700 font-bold mb-1">ENTREGUES</p>
              <p className="text-3xl font-black text-emerald-600">{stats.entregue}</p>
              <p className="text-xs text-emerald-500">Concluídos</p>
            </div>
          </div>
        </div>

        {/* Resumo Geral */}
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-yellow-900 mb-4">📋 Resumo Geral</h3>
          <div className="space-y-2 text-sm">
            <p className="text-yellow-900">
              <strong>Total de Pedidos:</strong> {pedidos.length}
            </p>
            <p className="text-yellow-900">
              <strong>Pedidos com Problemas:</strong> {problemas.length}
            </p>
            <p className="text-yellow-900">
              <strong>Taxa de Erro:</strong> {pedidos.length > 0 ? ((problemas.length / pedidos.length) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>

        {/* Problemas Encontrados */}
        {problemas.length > 0 ? (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              ❌ Problemas Encontrados ({problemas.length})
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {problemas.map((prob, idx) => (
                <div key={idx} className="bg-white border-2 border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-red-900">
                      Pedido #{prob.index + 1} (ID: {prob.id.slice(0, 12)}...)
                    </p>
                    <span className="px-2 py-1 bg-red-200 text-red-900 text-xs font-bold rounded">
                      {prob.problemas.length} problema(s)
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {prob.problemas.map((p, i) => (
                      <li key={i} className="text-sm text-red-700">• {p}</li>
                    ))}
                  </ul>
                  <details className="mt-3">
                    <summary className="text-xs text-red-600 cursor-pointer hover:underline">
                      Ver dados completos
                    </summary>
                    <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-x-auto">
                      {JSON.stringify(prob.pedido, null, 2)}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-emerald-900 mb-2">✅ Nenhum Problema Encontrado!</h3>
            <p className="text-emerald-700">Todos os pedidos estão com dados completos e corretos.</p>
          </div>
        )}

        {/* Lista Completa de Pedidos */}
        <div className="bg-slate-50 border-2 border-slate-300 rounded-xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">📦 Lista Completa de Pedidos</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {pedidos.map((p, idx) => (
              <details key={idx} className="bg-white border border-slate-300 rounded-lg p-3">
                <summary className="cursor-pointer text-sm font-bold text-slate-900 hover:text-blue-600">
                  #{idx + 1} - {p.vidraceiro_nome || '❌ SEM NOME'} - {p.status} - {p.valor_total ? `R$ ${p.valor_total.toFixed(2)}` : 'Sem valor'}
                </summary>
                <pre className="mt-2 text-xs bg-slate-100 p-3 rounded overflow-x-auto">
                  {JSON.stringify(p, null, 2)}
                </pre>
              </details>
            ))}
          </div>
        </div>

        {/* Checklist de Correções Necessárias */}
        <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-6 mt-6">
          <h3 className="font-bold text-purple-900 mb-4">🔧 Checklist de Correções Necessárias</h3>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-purple-900">✅ Corrigir numeração dos pedidos (1, 2, 3...)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-purple-900">✅ Mostrar nome real do vidraceiro (não "Vidraçaria Parceira")</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-purple-900">✅ Adicionar medidas nos itens (largura x altura)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-purple-900">✅ Mostrar imagem do configurador Suprema</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-purple-900">✅ Mostrar status de pagamento (50% ou 100%)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-purple-900">✅ Exibir comprovante na tela (não só download)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-purple-900">✅ Card com estatísticas (Novos/Pendentes/Produção/Entrega)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-purple-900">✅ Mostrar TODOS os dados do vidraceiro (empresa, telefone, email, local de entrega)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
