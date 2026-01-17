import React, { useState } from 'react';
import { Database, CheckCircle, AlertTriangle, Loader } from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

export function InicializarSistema() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec`;

  const handleInicializar = async () => {
    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      console.log('🚀 Iniciando processo de inicialização...');

      // 1. Inicializar banco de dados SysConecta
      const response = await fetch(`${API_URL}/sysconecta/init`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(`✅ Sistema inicializado com sucesso!\n\n` +
          `📊 Fornecedores: ${data.info.fornecedores}\n` +
          `🏭 Indústrias: ${data.info.industrias}\n` +
          `📍 Vagas Disponíveis: ${data.info.vagasDisponiveis}\n` +
          `🗺️ Total de Vagas: ${data.info.totalVagas}`
        );
        console.log('✅ Sistema inicializado:', data);
      } else {
        setStatus('error');
        setMessage(`❌ Erro: ${data.error}`);
        console.error('❌ Erro ao inicializar:', data.error);
      }
    } catch (error) {
      setStatus('error');
      setMessage(`❌ Erro de conexão: ${error.message}`);
      console.error('❌ Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg flex-shrink-0">
          <Database className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-gray-900 text-lg mb-2">Inicializar Sistema</h3>
          <p className="text-gray-600 text-sm mb-4">
            Clique no botão abaixo para inicializar o banco de dados do SysConecta com os dados padrão:
          </p>
          <ul className="text-gray-700 text-sm space-y-2 mb-6">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span><strong>Santa Rita Vidros (SC)</strong> - Fornecedor de vidros</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span><strong>Guardian Glass</strong> - Indústria parceira exclusiva</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span><strong>81 vagas de exclusividade</strong> - 27 estados × 3 tipos</span>
            </li>
          </ul>

          <button
            onClick={handleInicializar}
            disabled={loading || status === 'success'}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Inicializando...
              </>
            ) : status === 'success' ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Sistema Inicializado
              </>
            ) : (
              <>
                <Database className="w-5 h-5" />
                Inicializar Sistema
              </>
            )}
          </button>

          {/* Mensagem de status */}
          {message && (
            <div className={`mt-6 p-4 rounded-lg ${
              status === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : status === 'error'
                ? 'bg-red-50 border border-red-200'
                : ''
            }`}>
              <div className="flex items-start gap-3">
                {status === 'success' && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />}
                {status === 'error' && <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
                <pre className={`text-sm whitespace-pre-wrap ${
                  status === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>{message}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
