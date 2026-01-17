/**
 * 🔥 NOVO ORÇAMENTO - SYSCONECTA
 * TELA DE ESCOLHA DO TIPO DE ORÇAMENTO
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, FileText, Camera, Mic, FolderOpen, ArrowRight, Trash2
} from 'lucide-react';
import { OrcamentoManual } from './OrcamentoManual';
import { OrcamentoPorFoto } from './OrcamentoPorFoto';
import { OrcamentoPorVoz } from './OrcamentoPorVoz';

interface NovoOrcamentoProps {
  usuario: {
    id: string;
    nomeEmpresa: string;
    estado: string;
    perfil: string;
  };
  onVoltar: () => void;
  clientes?: any[];
  onAdicionarCliente?: (cliente: any) => void;
  onNovosPedidos?: (pedidos: any[]) => void;
  orcamentos?: any[];
  onSalvar?: (orcamento: any) => void;
}

type TipoOrcamento = 'selecao' | 'manual' | 'foto' | 'voz' | 'meus';

export function NovoOrcamento({ usuario, onVoltar, clientes = [], onAdicionarCliente, onNovosPedidos, orcamentos = [], onSalvar }: NovoOrcamentoProps) {
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoOrcamento>('selecao');

  // Se selecionou Manual
  if (tipoSelecionado === 'manual') {
    return (
      <OrcamentoManual 
        usuario={usuario}
        onVoltar={() => setTipoSelecionado('selecao')}
        clientes={clientes}
        onAdicionarCliente={onAdicionarCliente}
        onPedidosCriados={onNovosPedidos}
        onSalvar={onSalvar}
      />
    );
  }

  // Se selecionou Foto
  if (tipoSelecionado === 'foto') {
    return (
      <OrcamentoPorFoto 
        onClose={() => setTipoSelecionado('selecao')}
      />
    );
  }

  // Se selecionou Voz
  if (tipoSelecionado === 'voz') {
    return (
      <OrcamentoPorVoz 
        onClose={() => setTipoSelecionado('selecao')}
      />
    );
  }

  // Se selecionou Meus Orçamentos
  if (tipoSelecionado === 'meus') {
    return (
      <div className="fixed inset-0 bg-[#0A0A0A] z-50 flex flex-col overflow-y-auto">
        <div className="bg-gradient-to-r from-[#1A1A1A] to-[#0F0F0F] border-b border-[#2D2D2D] p-6 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
                <button
                onClick={() => setTipoSelecionado('selecao')}
                className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#D4AF37] mb-2 transition-colors"
                >
                <ArrowLeft className="w-4 h-4" />
                Voltar
                </button>
                <h1 className="text-3xl font-black text-white">📂 Meus Orçamentos (Nuvem)</h1>
            </div>
            <div className="text-sm text-gray-400 font-mono bg-[#1A1A1A] px-3 py-1 rounded-full border border-gray-800">
                {orcamentos.length} salvos
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-4">
             {orcamentos.length === 0 ? (
                 <div className="text-center py-20 flex flex-col items-center">
                     <div className="w-20 h-20 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-6">
                        <FolderOpen className="w-10 h-10 text-gray-700" />
                     </div>
                     <h3 className="text-white text-xl font-bold mb-2">Nenhum orçamento salvo</h3>
                     <p className="text-gray-500 max-w-md">Seus orçamentos salvos na nuvem aparecerão aqui automaticamente.</p>
                 </div>
             ) : (
                 orcamentos.map((orc: any) => (
                    <div key={orc.id} className="bg-[#111] border border-[#333] rounded-xl p-6 hover:border-[#D4AF37]/50 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent rounded-bl-full pointer-events-none" />
                        
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#222] rounded-lg flex items-center justify-center text-[#D4AF37]">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                                        {orc.cliente?.nome || 'Cliente Sem Nome'}
                                    </h3>
                                    <p className="text-gray-500 text-xs flex items-center gap-2">
                                        <span>{new Date(orc.dataOrcamento || Date.now()).toLocaleDateString('pt-BR')}</span>
                                        <span className="w-1 h-1 bg-gray-600 rounded-full" />
                                        <span>{orc.itens?.length || 0} itens</span>
                                    </p>
                                </div>
                            </div>
                            <div className="text-left md:text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Valor Total</p>
                                <span className="text-2xl font-bold text-[#D4AF37]">
                                    R$ {(orc.valorTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-[#222] pt-4">
                            <button className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 px-4 py-2 hover:bg-red-900/10 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                                Excluir
                            </button>
                            <button className="flex items-center gap-2 bg-[#D4AF37] text-black font-bold px-6 py-2 rounded-lg hover:bg-[#F3E5AB] transition-colors shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                                Abrir Orçamento <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                 ))
             )}
          </div>
        </div>
      </div>
    );
  }

  // TELA DE SELEÇÃO (Redesigned: Clean, White, Glass & Steel)
  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0A] overflow-y-auto animate-in fade-in duration-300">
      {/* Background Image Premium - Vidraceiro em Ação */}
      <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1688319694677-7729b163abf8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGF6aWVyJTIwbWVhc3VyaW5nJTIwd2luZG93JTIwY29uc3RydWN0aW9uJTIwd29ya2VyJTIwZ2xhc3MlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY4MTY0OTUwfDA&ixlib=rb-4.1.0&q=80&w=1080" 
            alt="Vidraceiro fazendo orçamento" 
            className="w-full h-full object-cover"
          />
      </div>
      <div className="fixed inset-0 z-0 bg-gradient-to-t from-black via-black/80 to-black/40 pointer-events-none" />
      
      {/* HEADER - Transparent & Sticky */}
      <div className="sticky top-0 z-10 bg-black/20 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={onVoltar}
            className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors border border-white/5">
              <ArrowLeft className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-sm font-medium">Voltar</span>
          </button>
          
          <div className="text-right">
            <h1 className="text-lg font-bold text-white tracking-tight">Novo Orçamento</h1>
            <p className="text-xs text-white/60 font-medium">Selecione o método</p>
          </div>
        </div>
      </div>

      {/* CONTENT - Compact & Refined Grid */}
      <div className="relative z-10 max-w-3xl mx-auto p-4 md:p-8 pb-32">
        
        <div className="grid grid-cols-2 gap-3 md:gap-6">
          
          {/* ORÇAMENTO MANUAL */}
          <button
            onClick={() => setTipoSelecionado('manual')}
            className="group relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/20 hover:border-[#D4AF37] rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/20 text-left flex flex-col items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 flex items-center justify-center">
              <FileText className="w-5 h-5 stroke-[1.5]" />
            </div>
            
            <div className="w-full">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-amber-500 transition-colors">Manual</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                Fluxo completo guiado.
              </p>
            </div>
          </button>

          {/* ORÇAMENTO POR FOTO */}
          <button
            onClick={() => setTipoSelecionado('foto')}
            className="group relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/20 hover:border-blue-500 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 text-left flex flex-col items-start gap-3"
          >
             <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 flex items-center justify-center">
              <Camera className="w-5 h-5 stroke-[1.5]" />
            </div>
            
            <div className="w-full">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-500 transition-colors">Por Foto</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                IA identifica materiais.
              </p>
            </div>
          </button>

          {/* ORÇAMENTO POR VOZ */}
          <button
            onClick={() => setTipoSelecionado('voz')}
            className="group relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/20 hover:border-purple-500 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 text-left flex flex-col items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 flex items-center justify-center">
              <Mic className="w-5 h-5 stroke-[1.5]" />
            </div>
            
            <div className="w-full">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-purple-500 transition-colors">Por Voz</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                Fale o que precisa.
              </p>
            </div>
          </button>

          {/* MEUS ORÇAMENTOS */}
          <button
            onClick={() => setTipoSelecionado('meus')}
            className="group relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/20 hover:border-emerald-500 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 text-left flex flex-col items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 stroke-[1.5]" />
            </div>
            
            <div className="w-full">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-emerald-500 transition-colors">Salvos</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                Edite ou duplique.
              </p>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
}