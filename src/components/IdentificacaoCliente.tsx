import React, { useState, useEffect } from 'react';
import { User, Search, MapPin, Phone, Building, Briefcase, Users, Home, Plus, ArrowRight, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export type PerfilComprador = 'Vidraceiro' | 'Construtor' | 'Arquiteto' | 'Consumidor Final';

export interface DadosCliente {
  id?: string | number;
  nome: string;
  perfil: PerfilComprador;
  telefone: string;
  endereco: string;
  cpf_cnpj?: string;
  email?: string;
  cidade?: string;
  usuario_id?: string;
  createdAt?: string;
}

interface IdentificacaoClienteProps {
  clientesExistentes: DadosCliente[];
  onClienteSelecionado: (cliente: DadosCliente) => void;
  onNovoClienteSalvo: (cliente: DadosCliente) => void;
  onAddMoreItems?: (cliente: DadosCliente) => void; 
}

export function IdentificacaoCliente({ clientesExistentes, onClienteSelecionado, onNovoClienteSalvo, onAddMoreItems }: IdentificacaoClienteProps) {
  const [modo, setModo] = useState<'novo' | 'buscar'>('novo');
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(false);

  // Estado do Formulário Novo
  const [novoCliente, setNovoCliente] = useState<DadosCliente>({
    nome: '',
    perfil: 'Vidraceiro',
    telefone: '',
    endereco: '',
    cpf_cnpj: '',
    email: '',
    cidade: ''
  });

  // Filtragem
  const clientesFiltrados = clientesExistentes.filter(c => 
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.telefone.includes(busca) ||
    (c.cpf_cnpj && c.cpf_cnpj.includes(busca))
  );

  const handleSalvar = async () => {
    // Validação
    if (!novoCliente.nome.trim()) {
        toast.error('Nome é obrigatório');
        return;
    }
    if (!novoCliente.telefone.trim()) {
        toast.error('Telefone é obrigatório');
        return;
    }
    if (!novoCliente.endereco.trim()) {
        toast.error('Endereço de entrega é obrigatório');
        return;
    }

    setLoading(true);
    
    // Simula delay de rede e processamento
    await new Promise(resolve => setTimeout(resolve, 600));

    onNovoClienteSalvo(novoCliente);
    setLoading(false);
  };

  const getIconePerfil = (perfil: string) => {
      switch (perfil) {
          case 'Vidraceiro': return <Briefcase className="w-4 h-4" />;
          case 'Construtor': return <Building className="w-4 h-4" />;
          case 'Arquiteto': return <MapPin className="w-4 h-4" />;
          case 'Consumidor Final': return <Users className="w-4 h-4" />;
          default: return <User className="w-4 h-4" />;
      }
  };

  return (
    <div className="relative min-h-[80vh] w-full">
        <div 
            className="fixed inset-0 z-0 opacity-40 pointer-events-none bg-slate-900"
        />
        <div className="fixed inset-0 z-0 bg-gradient-to-t from-black via-black/80 to-black/40 pointer-events-none" />

        <div className="relative z-10 w-full max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4">
            
            <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl font-bold text-white tracking-tight">Identificação do Cliente</h2>
                <p className="text-white/60">Selecione um cliente existente ou cadastre um novo.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-1 rounded-xl flex max-w-md mx-auto mb-8">
                <button
                    onClick={() => setModo('novo')}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                        modo === 'novo' 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                >
                    <Plus className="w-4 h-4" />
                    Novo Cliente
                </button>
                <button
                    onClick={() => setModo('buscar')}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                        modo === 'buscar' 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                >
                    <Search className="w-4 h-4" />
                    Buscar Cliente
                </button>
            </div>

            {modo === 'novo' && (
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                    <div className="p-6 md:p-8 space-y-5">
                        
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nome Completo</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                    <input 
                                        type="text"
                                        value={novoCliente.nome}
                                        onChange={e => setNovoCliente({...novoCliente, nome: e.target.value})}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-900"
                                        placeholder="Nome do cliente"
                                    />
                                </div>
                            </div>

                            <div className="w-full md:w-[160px] space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Perfil</label>
                                <div className="relative">
                                    <select 
                                        value={novoCliente.perfil}
                                        onChange={e => setNovoCliente({...novoCliente, perfil: e.target.value as PerfilComprador})}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-900 appearance-none cursor-pointer"
                                    >
                                        <option value="Vidraceiro">Vidraceiro</option>
                                        <option value="Construtor">Construtor</option>
                                        <option value="Arquiteto">Arquiteto</option>
                                        <option value="Consumidor Final">Final</option>
                                    </select>
                                    <div className="absolute right-3 top-3 pointer-events-none text-slate-400">
                                        <ArrowRight className="w-4 h-4 rotate-90" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">CPF / CNPJ</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                    <input 
                                        type="text"
                                        value={novoCliente.cpf_cnpj}
                                        onChange={e => setNovoCliente({...novoCliente, cpf_cnpj: e.target.value})}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-900"
                                        placeholder="000.000.000-00"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">WhatsApp</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                    <input 
                                        type="text"
                                        value={novoCliente.telefone}
                                        onChange={e => setNovoCliente({...novoCliente, telefone: e.target.value})}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-900"
                                        placeholder="(00) 90000-0000"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-[2] space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Endereço de Entrega</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                    <input 
                                        type="text"
                                        value={novoCliente.endereco}
                                        onChange={e => setNovoCliente({...novoCliente, endereco: e.target.value})}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-900"
                                        placeholder="Rua, Número, Bairro"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Cidade</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                    <input 
                                        type="text"
                                        value={novoCliente.cidade}
                                        onChange={e => setNovoCliente({...novoCliente, cidade: e.target.value})}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-900"
                                        placeholder="Cidade/UF"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 mt-2">
                            <button
                                onClick={handleSalvar}
                                disabled={loading}
                                className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <span>Continuar para Orçamento</span>}
                                {!loading && <ArrowRight className="w-6 h-6" />}
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {modo === 'buscar' && (
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                        <input 
                            type="text"
                            value={busca}
                            onChange={e => setBusca(e.target.value)}
                            placeholder="Buscar por nome, telefone ou CPF..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {clientesFiltrados.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <User className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                <p className="text-slate-500 font-medium">Nenhum cliente encontrado</p>
                                {busca && <p className="text-xs text-slate-400 mt-1">Tente outro termo ou cadastre um novo</p>}
                            </div>
                        ) : (
                            clientesFiltrados.map((cliente, idx) => (
                                <button
                                    key={cliente.id || idx}
                                    onClick={() => onClienteSelecionado(cliente)}
                                    className="w-full bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md hover:ring-1 hover:ring-blue-500 transition-all text-left group flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                            cliente.perfil === 'Vidraceiro' ? 'bg-blue-100 text-blue-600' :
                                            cliente.perfil === 'Construtor' ? 'bg-orange-100 text-orange-600' :
                                            'bg-slate-100 text-slate-600'
                                        }`}>
                                            {getIconePerfil(cliente.perfil || '')}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{cliente.nome}</h4>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                                <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-medium text-slate-600">{cliente.perfil || 'Não informado'}</span>
                                                <span>•</span>
                                                <span>{cliente.telefone}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}

        </div>
    </div>
  );
}