import React from 'react';
import { AlertCircle, User, Building2, Mail, Phone, MapPin } from 'lucide-react';

export function DebugVidraceiroInfo() {
  const [mostrar, setMostrar] = React.useState(false);
  
  const vidraceiroDataString = localStorage.getItem('sysconecta_usuario_dados');
  const vidraceiroData = vidraceiroDataString ? JSON.parse(vidraceiroDataString) : null;
  const userRole = localStorage.getItem('sysconecta_user_role');
  const userId = localStorage.getItem('sysconecta_user_id');

  // 🔥 DETECTAR O TIPO DE USUÁRIO
  const tipoUsuario = userRole === 'fornecedor' ? 'FORNECEDOR' : 'VIDRACEIRO';
  const corBotao = userRole === 'fornecedor' ? 'bg-purple-500 hover:bg-purple-600' : 'bg-orange-500 hover:bg-orange-600';

  if (!mostrar) {
    return (
      <button
        onClick={() => setMostrar(true)}
        className={`fixed bottom-4 right-4 px-4 py-2 ${corBotao} text-white rounded-lg font-bold shadow-lg z-50 flex items-center gap-2 animate-pulse`}
      >
        <AlertCircle className="w-5 h-5" />
        🔍 DEBUG {tipoUsuario}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-slate-900">🔍 DEBUG: Dados do {tipoUsuario}</h2>
          <button
            onClick={() => setMostrar(false)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold"
          >
            Fechar
          </button>
        </div>

        <div className="space-y-6">
          {/* Informações básicas */}
          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
            <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Informações de Sessão
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-blue-700 font-bold">User ID:</span>
                <span className="text-slate-900 font-mono">{userId || '❌ NÃO ENCONTRADO'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-700 font-bold">User Role:</span>
                <span className="text-slate-900 font-mono">{userRole || '❌ NÃO ENCONTRADO'}</span>
              </div>
            </div>
          </div>

          {/* Dados do vidraceiro */}
          {vidraceiroData ? (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-6">
              <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Dados do Vidraceiro (localStorage)
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-emerald-700 font-bold">Nome Fantasia:</span>
                  <p className={`text-lg font-black ${vidraceiroData.nomeFantasia ? 'text-emerald-600' : 'text-red-500'}`}>
                    {vidraceiroData.nomeFantasia || '❌ VAZIO'}
                  </p>
                </div>
                <div>
                  <span className="text-emerald-700 font-bold">Nome:</span>
                  <p className={`text-lg font-black ${vidraceiroData.nome ? 'text-emerald-600' : 'text-red-500'}`}>
                    {vidraceiroData.nome || '❌ VAZIO'}
                  </p>
                </div>
                <div>
                  <span className="text-emerald-700 font-bold">Email:</span>
                  <p className={`${vidraceiroData.email ? 'text-slate-900' : 'text-red-500'}`}>
                    {vidraceiroData.email || '❌ VAZIO'}
                  </p>
                </div>
                <div>
                  <span className="text-emerald-700 font-bold">Telefone:</span>
                  <p className={`${vidraceiroData.telefone ? 'text-slate-900' : 'text-red-500'}`}>
                    {vidraceiroData.telefone || '❌ VAZIO'}
                  </p>
                </div>
                <div>
                  <span className="text-emerald-700 font-bold">CNPJ/CPF:</span>
                  <p className={`${vidraceiroData.cnpj || vidraceiroData.cpf ? 'text-slate-900' : 'text-red-500'}`}>
                    {vidraceiroData.cnpj || vidraceiroData.cpf || '❌ VAZIO'}
                  </p>
                </div>
                <div>
                  <span className="text-emerald-700 font-bold">Cidade/Estado:</span>
                  <p className={`${vidraceiroData.cidade ? 'text-slate-900' : 'text-red-500'}`}>
                    {vidraceiroData.cidade || '❌'} / {vidraceiroData.estado || '❌'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
              <h3 className="font-bold text-red-900 mb-2">❌ PROBLEMA ENCONTRADO!</h3>
              <p className="text-red-700">
                A chave <code className="bg-red-200 px-2 py-1 rounded">sysconecta_usuario_dados</code> está <strong>VAZIA</strong> no localStorage!
              </p>
              <p className="text-red-700 mt-2">
                Por isso os pedidos aparecem como <strong>"Vidraçaria Parceira"</strong>!
              </p>
            </div>
          )}

          {/* Dados completos (JSON) */}
          <div className="bg-slate-50 border-2 border-slate-300 rounded-xl p-6">
            <h3 className="font-bold text-slate-900 mb-4">📋 Dados Completos (JSON)</h3>
            <pre className="text-xs bg-slate-900 text-emerald-400 p-4 rounded-lg overflow-auto max-h-60">
              {JSON.stringify({
                userId,
                userRole,
                vidraceiroData: vidraceiroData || 'null'
              }, null, 2)}
            </pre>
          </div>

          {/* Análise do problema */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
            <h3 className="font-bold text-yellow-900 mb-4">💡 Análise</h3>
            <div className="space-y-2 text-sm text-yellow-900">
              <p>
                ✅ <strong>O que o sistema espera:</strong> Que exista um objeto em{' '}
                <code className="bg-yellow-200 px-1 rounded">localStorage['sysconecta_usuario_dados']</code>{' '}
                com os campos <code>nomeFantasia</code> ou <code>nome</code>
              </p>
              <p>
                {vidraceiroData?.nomeFantasia || vidraceiroData?.nome ? (
                  <>✅ <strong>Status:</strong> Dados encontrados! O nome deveria aparecer corretamente.</>
                ) : (
                  <>❌ <strong>Status:</strong> Dados ausentes! Por isso aparece "Vidraçaria Parceira".</>
                )}
              </p>
              <p className="mt-4 pt-4 border-t border-yellow-300">
                🔧 <strong>Solução:</strong> Os dados do usuário devem ser salvos no localStorage durante o login/cadastro.
                Verifique se o componente de login está salvando corretamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}