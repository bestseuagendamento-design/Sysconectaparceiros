import { useState } from 'react';
import { Database, CheckCircle, XCircle, Loader, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { GuiaInicializacao } from './GuiaInicializacao';

export function InicializarBanco() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [initResult, setInitResult] = useState<any>(null);
  const [tablesStatus, setTablesStatus] = useState<any>(null);

  const handleInitialize = async () => {
    setIsInitializing(true);
    setInitResult(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/database/init`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      setInitResult(data);

      if (data.success) {
        toast.success('✅ Banco de dados criado com sucesso!');
        // Verificar automaticamente após criar
        setTimeout(() => handleCheck(), 1000);
      } else {
        toast.error('❌ Erro ao criar banco de dados');
      }
    } catch (error: any) {
      console.error('Erro ao inicializar banco:', error);
      setInitResult({ 
        success: false, 
        message: 'Erro ao conectar com o servidor',
        error: error.message 
      });
      toast.error('❌ Erro ao conectar com servidor');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleCheck = async () => {
    setIsChecking(true);
    setTablesStatus(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/database/check`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      setTablesStatus(data);

      if (data.success) {
        toast.success('✅ Verificação concluída');
      }
    } catch (error: any) {
      console.error('Erro ao verificar tabelas:', error);
      toast.error('❌ Erro ao verificar tabelas');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#2C5F6F] to-[#1A3D4A] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Database className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-gray-900 mb-2" style={{ fontSize: '2rem', fontWeight: 700 }}>
            Inicializar Banco de Dados
          </h1>
          <p className="text-gray-600">
            Configure todas as tabelas necessárias para o SysConecta
          </p>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="space-y-6">
            {/* Botão Inicializar */}
            <div>
              <h2 className="text-gray-900 mb-4" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                Passo 1: Criar Tabelas
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Clique no botão abaixo para criar todas as tabelas necessárias no banco de dados PostgreSQL do Supabase.
              </p>
              
              <button
                onClick={handleInitialize}
                disabled={isInitializing}
                className="w-full bg-gradient-to-r from-[#2C5F6F] to-[#1A3D4A] hover:from-[#1A3D4A] hover:to-[#2C5F6F] text-white rounded-xl px-6 py-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              >
                {isInitializing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Loader className="w-5 h-5" />
                    </motion.div>
                    <span>Criando tabelas...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-5 h-5" />
                    <span>Inicializar Banco de Dados</span>
                  </>
                )}
              </button>
            </div>

            {/* Resultado da Inicialização */}
            <AnimatePresence>
              {initResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-4 rounded-xl border-2 ${
                    initResult.success
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {initResult.success ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={`font-medium ${initResult.success ? 'text-green-900' : 'text-red-900'}`}>
                        {initResult.message}
                      </p>
                      {initResult.error && (
                        <p className="text-sm text-red-700 mt-2 font-mono bg-red-100 p-2 rounded">
                          {initResult.error}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Botão Verificar */}
            <div>
              <h2 className="text-gray-900 mb-4" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                Passo 2: Verificar Tabelas
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Verifique se todas as tabelas foram criadas corretamente.
              </p>
              
              <button
                onClick={handleCheck}
                disabled={isChecking}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl px-6 py-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border border-gray-300"
              >
                {isChecking ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Loader className="w-5 h-5" />
                    </motion.div>
                    <span>Verificando...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    <span>Verificar Status das Tabelas</span>
                  </>
                )}
              </button>
            </div>

            {/* Status das Tabelas */}
            <AnimatePresence>
              {tablesStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-5"
                >
                  <h3 className="text-gray-900 mb-4" style={{ fontSize: '1rem', fontWeight: 600 }}>
                    Status das Tabelas:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tablesStatus.tables && Object.entries(tablesStatus.tables).map(([table, exists]) => (
                      <div
                        key={table}
                        className={`flex items-center gap-2 p-3 rounded-lg ${
                          exists ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                        }`}
                      >
                        {exists ? (
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                        )}
                        <span className={`text-sm font-medium ${exists ? 'text-green-900' : 'text-red-900'}`}>
                          {table}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-[#2C5F6F]/10 border-2 border-[#2C5F6F]/20 rounded-xl p-6">
          <h3 className="text-[#2C5F6F] mb-3" style={{ fontSize: '1rem', fontWeight: 600 }}>
            📊 Tabelas que serão criadas (12 no total):
          </h3>
          
          <div className="space-y-4">
            {/* Básicas */}
            <div>
              <p className="text-[#2C5F6F] mb-2" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                ✅ BÁSICAS (6):
              </p>
              <ul className="space-y-2 text-[#2C5F6F] text-sm ml-4">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#2C5F6F] rounded-full"></div>
                  <strong>user_profiles</strong> - Perfis de usuário (com categorias de fornecedor)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#2C5F6F] rounded-full"></div>
                  <strong>waitlist</strong> - Lista de espera para novos usuários
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#2C5F6F] rounded-full"></div>
                  <strong>clientes</strong> - Cadastro de clientes
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#2C5F6F] rounded-full"></div>
                  <strong>orcamentos</strong> - Orçamentos criados
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#2C5F6F] rounded-full"></div>
                  <strong>pedidos</strong> - Pedidos de vidraceiro para fornecedor
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#2C5F6F] rounded-full"></div>
                  <strong>notificacoes</strong> - Sistema de notificações
                </li>
              </ul>
            </div>

            {/* Tipologias */}
            <div>
              <p className="text-[#2C5F6F] mb-2" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                🏗️ TIPOLOGIAS (4):
              </p>
              <ul className="space-y-2 text-[#2C5F6F] text-sm ml-4">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#2C5F6F] rounded-full"></div>
                  <strong>tipologias</strong> - Cadastro mestre de tipologias
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#2C5F6F] rounded-full"></div>
                  <strong>tipologia_aluminio</strong> - Itens de alumínio (com peso)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#2C5F6F] rounded-full"></div>
                  <strong>tipologia_vidro</strong> - Cálculo de vidro e furações
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#2C5F6F] rounded-full"></div>
                  <strong>tipologia_acessorios</strong> - Itens de acessórios
                </li>
              </ul>
            </div>

            {/* Fornecedores */}
            <div>
              <p className="text-[#2C5F6F] mb-2" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                💰 FORNECEDORES (2):
              </p>
              <ul className="space-y-2 text-[#2C5F6F] text-sm ml-4">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#2C5F6F] rounded-full"></div>
                  <strong>fornecedor_precos</strong> - Preços por fornecedor e categoria
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#2C5F6F] rounded-full"></div>
                  <strong>materiais_sobra</strong> - Controle de sobras de alumínio
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Guia de Inicialização */}
        <GuiaInicializacao />
      </div>
    </div>
  );
}