import { CheckCircle, AlertCircle, Database, Mail, Shield, Users } from 'lucide-react';
import { motion } from 'motion/react';

export function GuiaInicializacao() {
  return (
    <div className="max-w-4xl mx-auto mt-8">
      {/* Banner de Boas-Vindas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#2C5F6F] to-[#1A3D4A] rounded-2xl p-8 mb-6 text-white"
      >
        <h2 className="mb-3" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
          🎉 Bem-vindo ao SysConecta!
        </h2>
        <p className="text-white/90 mb-4">
          Você está prestes a configurar um <strong>sistema enterprise completo</strong> com banco de dados real, 
          autenticação segura e emails automáticos.
        </p>
        <div className="flex items-center gap-2 text-white/80 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>Configuração em 1 clique • 100% grátis • Pronto para produção</span>
        </div>
      </motion.div>

      {/* Recursos Disponíveis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
            <Database className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-gray-900 mb-2" style={{ fontSize: '1rem', fontWeight: 600 }}>
            Banco de Dados Real
          </h3>
          <p className="text-gray-600 text-sm">
            PostgreSQL com 6 tabelas otimizadas, índices e segurança máxima
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-gray-900 mb-2" style={{ fontSize: '1rem', fontWeight: 600 }}>
            Autenticação Segura
          </h3>
          <p className="text-gray-600 text-sm">
            Login com email, Google, Apple + recuperação de senha automática
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-gray-900 mb-2" style={{ fontSize: '1rem', fontWeight: 600 }}>
            Emails Automáticos
          </h3>
          <p className="text-gray-600 text-sm">
            Verificação, recuperação de senha e notificações em tempo real
          </p>
        </motion.div>
      </div>

      {/* Passo a Passo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 border border-gray-200 mb-6"
      >
        <h3 className="text-gray-900 mb-4 flex items-center gap-2" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
          <Users className="w-5 h-5 text-[#2C5F6F]" />
          Como funciona:
        </h3>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-[#2C5F6F] text-white rounded-full flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h4 className="text-gray-900 font-medium mb-1">Clique em "Inicializar Banco de Dados"</h4>
              <p className="text-gray-600 text-sm">
                Um clique para criar todas as 6 tabelas necessárias no PostgreSQL
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-[#2C5F6F] text-white rounded-full flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h4 className="text-gray-900 font-medium mb-1">Aguarde a confirmação</h4>
              <p className="text-gray-600 text-sm">
                Você verá uma mensagem verde de sucesso em poucos segundos
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-[#2C5F6F] text-white rounded-full flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h4 className="text-gray-900 font-medium mb-1">Verifique o status</h4>
              <p className="text-gray-600 text-sm">
                Clique em "Verificar Status" para confirmar que está tudo OK
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
              ✓
            </div>
            <div>
              <h4 className="text-green-900 font-medium mb-1">Pronto! Sistema 100% funcional</h4>
              <p className="text-green-700 text-sm">
                Agora você tem um sistema enterprise completo com banco de dados real
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Alerta Importante */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6"
      >
        <div className="flex gap-3">
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-amber-900 font-medium mb-2">⚠️ Importante:</h4>
            <ul className="text-amber-800 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>Este processo é <strong>SEGURO e IDEMPOTENTE</strong> - pode ser executado múltiplas vezes sem problemas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>Se as tabelas já existirem, elas <strong>NÃO serão recriadas</strong> (seus dados estão seguros)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>Tudo está sendo criado no <strong>plano gratuito</strong> do Supabase (50.000 usuários/mês grátis)</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
