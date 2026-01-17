import React, { useState } from 'react';
import { supabase } from '../../utils/supabase/client';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { X, Mail, Lock, User, Building2, MapPin, Loader2, Phone, ArrowRight, LayoutDashboard, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: any) => void;
  initialRole?: string; // 'vidraceiro', 'fornecedor', etc.
}

export function AuthModal({ isOpen, onClose, onSuccess, initialRole = 'vidraceiro' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Extra Fields for Signup
  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('SC'); // Default SC para facilitar teste

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        // CADASTRO VIA BACKEND (Auto-Confirm) para evitar erro de email não confirmado
        const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/auth/signup`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${publicAnonKey}`
                },
                body: JSON.stringify({
                    email,
                    password,
                    nome,
                    empresa,
                    telefone,
                    cidade,
                    estado,
                    role: initialRole
                })
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.error || 'Erro ao criar conta');
        }

        toast.success("Conta criada! Entrando...");
        
        // Fazer login automático após criar conta
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (loginError) throw loginError;

        if (loginData.user) {
           localStorage.setItem('sysconecta_user_name', nome);
           localStorage.setItem('sysconecta_user_role', initialRole);
           
           // 🔥 SALVAR DADOS COMPLETOS DO USUÁRIO
           const metadata = loginData.user.user_metadata || {};
           const dadosUsuario = {
               id: loginData.user.id,
               email: email,
               nome: metadata.full_name || nome,
               nomeFantasia: metadata.nome_empresa || empresa || metadata.full_name || nome,
               telefone: metadata.phone || telefone || '(00) 00000-0000',
               cnpj: metadata.cnpj || '',
               cpf: metadata.cpf || '',
               endereco: metadata.address || '',
               numero: metadata.numero || 'S/N',
               bairro: metadata.bairro || '',
               cidade: metadata.city || cidade || '',
               estado: metadata.state || estado || 'SC',
               role: initialRole
           };
           localStorage.setItem('sysconecta_usuario_dados', JSON.stringify(dadosUsuario));
           console.log('✅ [AuthModal SIGNUP] Dados salvos:', dadosUsuario);
           
           // 🔥 MIGRAÇÃO AUTOMÁTICA DE PEDIDOS (Novo usuário não terá nada, mas roda por consistência)
           const migrationKey = `sysconecta_migration_done_${loginData.user.id}`;
           localStorage.setItem(migrationKey, 'true'); // Marca como migrado (novo usuário não tem pedidos antigos)
           
           onSuccess(loginData.user);
        }

      } else {
        // LOGIN
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        toast.success("Login realizado!");
        if (data.user) {
            // Recuperar metadata
            const metadata = data.user.user_metadata || {};
            if (metadata) {
                localStorage.setItem('sysconecta_user_name', metadata.full_name || email);
                localStorage.setItem('sysconecta_user_role', metadata.role || 'vidraceiro');
                
                // 🔥 SALVAR DADOS COMPLETOS DO USUÁRIO
                const dadosUsuario = {
                    id: data.user.id,
                    email: email,
                    nome: metadata.full_name || metadata.nome || email.split('@')[0],
                    nomeFantasia: metadata.nome_empresa || metadata.company_name || metadata.full_name || email.split('@')[0],
                    telefone: metadata.phone || metadata.telefone || '(00) 00000-0000',
                    cnpj: metadata.cnpj || '',
                    cpf: metadata.cpf || '',
                    endereco: metadata.address || metadata.endereco || '',
                    numero: metadata.numero || 'S/N',
                    bairro: metadata.bairro || '',
                    cidade: metadata.city || metadata.cidade || '',
                    estado: metadata.state || metadata.estado || 'SC',
                    role: metadata.role || 'vidraceiro'
                };
                localStorage.setItem('sysconecta_usuario_dados', JSON.stringify(dadosUsuario));
                console.log('✅ [AuthModal LOGIN] Dados salvos:', dadosUsuario);
                
                // 🔥 MIGRAÇÃO AUTOMÁTICA DE PEDIDOS
                const migrationKey = `sysconecta_migration_done_${data.user.id}`;
                const migrationDone = localStorage.getItem(migrationKey);
                
                if (!migrationDone) {
                    console.log('🔄 [AuthModal] Executando migração automática...');
                    fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos/migrate-user-id`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${publicAnonKey}`
                        },
                        body: JSON.stringify({ userId: data.user.id })
                    })
                    .then(res => res.json())
                    .then(result => {
                        if (result.success) {
                            console.log(`✅ Migração concluída: ${result.updated} pedido(s)`);
                            localStorage.setItem(migrationKey, 'true');
                            if (result.updated > 0) {
                                toast.success(`${result.updated} pedido(s) migrado(s)!`);
                            }
                        }
                    })
                    .catch(err => console.error('❌ Erro na migração:', err));
                }
            }
            onSuccess(data.user);
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro na autenticação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop com Blur Cinematográfico */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative w-full max-w-[480px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20"
      >
        {/* Decorative Top Gradient */}
        <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        
        {/* Close Button */}
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all z-10"
        >
            <X className="w-5 h-5" />
        </button>

        <div className="p-8">
            {/* Header Section */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 mb-4 shadow-sm text-blue-600">
                    <LayoutDashboard className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    {mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta grátis'}
                </h2>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">
                    {mode === 'login' 
                        ? 'Acesse seu painel para gerenciar orçamentos e pedidos.' 
                        : 'Cadastre-se para acessar o catálogo completo e fazer pedidos.'}
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleAuth} className="space-y-5">
                
                <AnimatePresence mode='popLayout'>
                    {mode === 'signup' && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="space-y-4 overflow-hidden"
                        >
                            {/* Nome & Empresa */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">Nome</label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                        <input 
                                            type="text" 
                                            placeholder="Seu nome"
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                            value={nome}
                                            onChange={e => setNome(e.target.value)}
                                            required={mode === 'signup'}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">Empresa</label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                        <input 
                                            type="text" 
                                            placeholder="Nome fantasia"
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                            value={empresa}
                                            onChange={e => setEmpresa(e.target.value)}
                                            required={mode === 'signup'}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Telefone */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">Contato</label>
                                <div className="relative group">
                                    <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input 
                                        type="tel" 
                                        placeholder="(00) 00000-0000"
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                        value={telefone}
                                        onChange={e => setTelefone(e.target.value)}
                                        required={mode === 'signup'}
                                    />
                                </div>
                            </div>

                            {/* Localização (Cidade & Estado) */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">Localização</label>
                                <div className="flex gap-3">
                                    <div className="relative flex-[2] group">
                                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                        <input 
                                            type="text" 
                                            placeholder="Cidade"
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                            value={cidade}
                                            onChange={e => setCidade(e.target.value)}
                                            required={mode === 'signup'}
                                        />
                                    </div>
                                    <div className="relative flex-1 group">
                                        <select
                                            className="w-full h-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium cursor-pointer appearance-none text-center"
                                            value={estado}
                                            onChange={e => setEstado(e.target.value)}
                                        >
                                            {['SC', 'SP', 'PR', 'RS', 'RJ', 'MG', 'DF', 'GO', 'BA'].map(uf => (
                                                <option key={uf} value={uf}>{uf}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-blue-600/80 font-medium pl-1 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Usado para encontrar fornecedores próximos
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Email & Senha (Sempre visíveis) */}
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">Credenciais</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input 
                                type="email" 
                                placeholder="seu@email.com"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                            type="password" 
                            placeholder="Sua senha secreta"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            {mode === 'login' ? 'Entrar no Sistema' : 'Criar Conta Grátis'}
                            <ArrowRight className="w-5 h-5 opacity-80" />
                        </>
                    )}
                </button>
            </form>

            {/* Toggle Login/Signup */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-500 mb-3">
                    {mode === 'login' ? 'Ainda não possui acesso?' : 'Já tem uma conta?'}
                </p>
                <div className="flex justify-center">
                    <button 
                        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                        className="text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-6 py-2 rounded-full transition-colors duration-200 flex items-center gap-2"
                    >
                        {mode === 'login' ? 'Criar nova conta' : 'Fazer login existente'}
                    </button>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
