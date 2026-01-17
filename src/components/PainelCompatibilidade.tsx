/**
 * 🎯 PAINEL DE COMPATIBILIDADE - INTERFACE VISUAL
 * Exibe status de compatibilidade em tempo real com design luxury
 */

import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Shield,
  AlertCircle
} from 'lucide-react';
import { 
  ResultadoCompatibilidade, 
  ProblemaCompatibilidade,
  obterResumoCompatibilidade 
} from '../utils/motor-compatibilidade';

interface PainelCompatibilidadeProps {
  resultado: ResultadoCompatibilidade;
  modo?: 'compacto' | 'completo';
}

export function PainelCompatibilidade({ 
  resultado, 
  modo = 'completo' 
}: PainelCompatibilidadeProps) {
  const [expandido, setExpandido] = React.useState(true);
  const resumo = obterResumoCompatibilidade(resultado);

  // Cores baseadas no status
  const corConfig = {
    green: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      text: 'text-green-800',
      icon: 'text-green-600',
      badge: 'bg-green-100 text-green-800 border-green-300'
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      text: 'text-yellow-900',
      icon: 'text-yellow-600',
      badge: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-900',
      icon: 'text-red-600',
      badge: 'bg-red-100 text-red-800 border-red-300'
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      text: 'text-blue-900',
      icon: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-800 border-blue-300'
    }
  };

  const cores = corConfig[resumo.cor as keyof typeof corConfig];

  if (modo === 'compacto') {
    return (
      <div className={`${cores.bg} border-2 ${cores.border} rounded-xl p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${cores.badge} border-2 rounded-lg flex items-center justify-center`}>
              {getIconeStatus(resultado)}
            </div>
            <div>
              <h3 className={`${cores.text} font-bold text-sm`}>{resumo.titulo}</h3>
              <p className={`${cores.text} text-xs opacity-80`}>{resumo.mensagem}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {resultado.erros.length > 0 && (
              <div className="bg-red-100 border border-red-300 text-red-800 px-3 py-1 rounded-lg text-xs font-bold">
                {resultado.erros.length} erro(s)
              </div>
            )}
            {resultado.avisos.length > 0 && (
              <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-1 rounded-lg text-xs font-bold">
                {resultado.avisos.length} aviso(s)
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-neutral-900 rounded-xl overflow-hidden">
      {/* HEADER */}
      <div 
        className={`${cores.bg} border-b-2 ${cores.border} p-6 cursor-pointer`}
        onClick={() => setExpandido(!expandido)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 ${cores.badge} border-2 rounded-xl flex items-center justify-center`}>
              {getIconeStatus(resultado)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield className={`w-5 h-5 ${cores.icon}`} />
                <h2 className={`${cores.text} text-xl font-bold`}>
                  Verificação de Compatibilidade
                </h2>
              </div>
              <p className={`${cores.text} text-sm font-medium`}>{resumo.mensagem}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* BADGES DE CONTAGEM */}
            <div className="flex gap-2">
              {resultado.erros.length > 0 && (
                <div className="flex items-center gap-1 bg-red-100 border-2 border-red-300 text-red-800 px-3 py-2 rounded-lg">
                  <XCircle className="w-4 h-4" />
                  <span className="font-bold text-sm">{resultado.erros.length}</span>
                  <span className="text-xs">erro(s)</span>
                </div>
              )}
              {resultado.avisos.length > 0 && (
                <div className="flex items-center gap-1 bg-yellow-100 border-2 border-yellow-300 text-yellow-800 px-3 py-2 rounded-lg">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-bold text-sm">{resultado.avisos.length}</span>
                  <span className="text-xs">aviso(s)</span>
                </div>
              )}
              {resultado.sugestoes.length > 0 && (
                <div className="flex items-center gap-1 bg-blue-100 border-2 border-blue-300 text-blue-800 px-3 py-2 rounded-lg">
                  <Lightbulb className="w-4 h-4" />
                  <span className="font-bold text-sm">{resultado.sugestoes.length}</span>
                  <span className="text-xs">sugestão(ões)</span>
                </div>
              )}
              {resultado.compativel && resultado.problemas.length === 0 && (
                <div className="flex items-center gap-1 bg-green-100 border-2 border-green-300 text-green-800 px-3 py-2 rounded-lg">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-bold">100% OK</span>
                </div>
              )}
            </div>

            {/* BOTÃO EXPANDIR */}
            <button className={`${cores.text} hover:opacity-70 transition-opacity`}>
              {expandido ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* CONTEÚDO EXPANDIDO */}
      {expandido && (
        <div className="p-6 space-y-4">
          
          {/* ERROS CRÍTICOS */}
          {resultado.erros.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-5 h-5 text-red-600" />
                <h3 className="text-red-900 font-bold">
                  Erros Críticos ({resultado.erros.length})
                </h3>
              </div>
              <div className="space-y-2">
                {resultado.erros.map((problema, idx) => (
                  <CartaoProblema key={idx} problema={problema} tipo="erro" />
                ))}
              </div>
            </div>
          )}

          {/* AVISOS */}
          {resultado.avisos.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <h3 className="text-yellow-900 font-bold">
                  Avisos Técnicos ({resultado.avisos.length})
                </h3>
              </div>
              <div className="space-y-2">
                {resultado.avisos.map((problema, idx) => (
                  <CartaoProblema key={idx} problema={problema} tipo="aviso" />
                ))}
              </div>
            </div>
          )}

          {/* SUGESTÕES */}
          {resultado.sugestoes.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <h3 className="text-blue-900 font-bold">
                  Sugestões de Otimização ({resultado.sugestoes.length})
                </h3>
              </div>
              <div className="space-y-2">
                {resultado.sugestoes.map((problema, idx) => (
                  <CartaoProblema key={idx} problema={problema} tipo="sugestao" />
                ))}
              </div>
            </div>
          )}

          {/* MENSAGEM DE SUCESSO COMPLETO */}
          {resultado.compativel && resultado.problemas.length === 0 && (
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-3" />
              <h3 className="text-green-900 font-bold text-lg mb-2">
                ✅ Sistema 100% Compatível
              </h3>
              <p className="text-green-800 text-sm">
                Todos os componentes estão em perfeita conformidade.<br />
                <strong>Liberado para produção imediata.</strong>
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

/**
 * 🔹 CARTÃO DE PROBLEMA INDIVIDUAL
 */
interface CartaoProblemaProps {
  problema: ProblemaCompatibilidade;
  tipo: 'erro' | 'aviso' | 'sugestao';
}

function CartaoProblema({ problema, tipo }: CartaoProblemaProps) {
  const config = {
    erro: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      text: 'text-red-900',
      badge: 'bg-red-100 text-red-800 border-red-300'
    },
    aviso: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      text: 'text-yellow-900',
      badge: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    },
    sugestao: {
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      text: 'text-blue-900',
      badge: 'bg-blue-100 text-blue-800 border-blue-300'
    }
  };

  const cores = config[tipo];

  return (
    <div className={`${cores.bg} border ${cores.border} rounded-lg p-4`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* TÍTULO */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`${cores.badge} border px-2 py-0.5 rounded text-xs font-bold uppercase`}>
              {problema.categoria}
            </span>
            <h4 className={`${cores.text} font-bold text-sm`}>
              {problema.titulo}
            </h4>
          </div>

          {/* MENSAGEM */}
          <p className={`${cores.text} text-sm mb-2 opacity-90`}>
            {problema.mensagem}
          </p>

          {/* VALORES */}
          {(problema.valor_atual || problema.valor_recomendado) && (
            <div className="flex gap-4 mb-2 text-xs">
              {problema.valor_atual && (
                <div>
                  <span className={`${cores.text} opacity-60`}>Atual:</span>
                  <span className={`${cores.text} font-mono font-bold ml-1`}>
                    {problema.valor_atual}
                  </span>
                </div>
              )}
              {problema.valor_recomendado && (
                <div>
                  <span className={`${cores.text} opacity-60`}>Recomendado:</span>
                  <span className={`${cores.text} font-mono font-bold ml-1`}>
                    {problema.valor_recomendado}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* SOLUÇÃO */}
          {problema.solucao && (
            <div className={`${cores.bg} border-l-4 ${cores.border} pl-3 py-1 mt-2`}>
              <p className={`${cores.text} text-xs font-medium`}>
                💡 <strong>Solução:</strong> {problema.solucao}
              </p>
            </div>
          )}
        </div>

        {/* BADGE DE BLOQUEIO */}
        {problema.bloqueiaProducao && (
          <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            BLOQUEIA
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 🔹 ÍCONE DE STATUS
 */
function getIconeStatus(resultado: ResultadoCompatibilidade) {
  if (resultado.compativel && resultado.problemas.length === 0) {
    return <CheckCircle2 className="w-7 h-7 text-green-600" />;
  }
  if (resultado.compativel && resultado.avisos.length > 0) {
    return <AlertTriangle className="w-7 h-7 text-yellow-600" />;
  }
  if (!resultado.compativel) {
    return <XCircle className="w-7 h-7 text-red-600" />;
  }
  return <Lightbulb className="w-7 h-7 text-blue-600" />;
}
