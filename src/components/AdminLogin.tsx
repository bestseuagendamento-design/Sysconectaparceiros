import React, { useState } from 'react';
import { Shield, Lock, Mail } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export function AdminLogin({ onLoginSuccess, onBack }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const ADMIN_EMAIL = 'Leandro.zara@gmail.com';
  const ADMIN_PASSWORD = '56734297Ombongo!';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simular delay de autenticação
    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Salvar no localStorage
        localStorage.setItem('sysconecta_admin_logged', 'true');
        localStorage.setItem('sysconecta_admin_email', email);
        onLoginSuccess();
      } else {
        setError('❌ Email ou senha incorretos');
        setPassword('');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full mb-4 shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-white text-3xl mb-2">
            🔐 Acesso Master
          </h1>
          <p className="text-gray-400 text-sm">
            SysConecta - Painel Administrativo
          </p>
        </div>

        {/* Card de Login */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Email do Administrador
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
                  placeholder="admin@sysconecta.com"
                  required
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Senha Master
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="bg-red-900/30 border border-red-600 rounded-lg p-3">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Botões */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? '⏳ Autenticando...' : '🔓 Acessar Painel'}
              </button>

              <button
                type="button"
                onClick={onBack}
                className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
              >
                Voltar
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-gray-500 text-xs text-center">
              🔒 Área restrita. Acesso apenas para administradores autorizados.
            </p>
          </div>
        </div>

        {/* Aviso de Segurança */}
        <div className="mt-6 bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
          <p className="text-yellow-400 text-xs text-center">
            ⚠️ Todas as ações realizadas neste painel são registradas e monitoradas.
          </p>
        </div>
      </div>
    </div>
  );
}
