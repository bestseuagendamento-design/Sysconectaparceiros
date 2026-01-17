import { useState, useEffect } from 'react';
import { 
  Users, User, Search, Filter, Plus, Phone, Mail, MapPin, 
  MoreHorizontal, FileText, Trash2, Edit, Briefcase, HardHat, PenTool
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../utils/supabase/client';
import { ModalAdicionarClienteFornecedor } from './ModalAdicionarClienteFornecedor';

interface MeusClientesFornecedorProps {
  onNavigate: (screen: string, data?: any) => void;
  userData?: any;
}

type PerfilCliente = 'vidraceiro' | 'construtor' | 'arquiteto' | 'consumidor_final';

export function MeusClientesFornecedor({ onNavigate, userData }: MeusClientesFornecedorProps) {
  const [activeTab, setActiveTab] = useState<PerfilCliente>('vidraceiro');
  const [searchTerm, setSearchTerm] = useState('');
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔥 DADOS REAIS (Carregados do LocalStorage/Supabase)
  useEffect(() => {
    setLoading(true);
    // Tenta carregar do localStorage primeiro (cache local)
    const saved = localStorage.getItem('sysconecta_clientes_fornecedor');
    if (saved) {
      setClientes(JSON.parse(saved));
    } else {
      setClientes([]); // Começa vazio se não tiver dados
    }
    setLoading(false);
  }, []);

  const handleSaveCliente = (novoCliente: any) => {
    const novaLista = [novoCliente, ...clientes];
    setClientes(novaLista);
    localStorage.setItem('sysconecta_clientes_fornecedor', JSON.stringify(novaLista));
    setActiveTab(novoCliente.perfil); 
    toast.success('Cliente cadastrado com sucesso!');
  };

  // Filtragem
  const filteredClientes = clientes.filter(cliente => {
    const matchesTab = cliente.perfil === activeTab;
    const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cliente.responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cliente.cidade.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getTabIcon = (tab: PerfilCliente) => {
    switch (tab) {
      case 'vidraceiro': return <Briefcase className="w-4 h-4" />;
      case 'construtor': return <HardHat className="w-4 h-4" />;
      case 'arquiteto': return <PenTool className="w-4 h-4" />;
      case 'consumidor_final': return <User className="w-4 h-4" />;
    }
  };

  const getTabLabel = (tab: PerfilCliente) => {
    switch (tab) {
      case 'vidraceiro': return 'Vidraceiros';
      case 'construtor': return 'Construtores';
      case 'arquiteto': return 'Arquitetos';
      case 'consumidor_final': return 'Consumidor Final';
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0A0A0A] text-white">
      {/* Header */}
      <div className="border-b border-[#333] px-8 py-6 bg-[#0A0A0A]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white font-bold text-2xl flex items-center gap-3">
              <Users className="w-8 h-8 text-[#D4AF37]" />
              Meus Clientes
            </h1>
            <p className="text-[#888] text-sm mt-1">
              Gerencie sua carteira de clientes por perfil
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* 🔥 Botão Novo Orçamento (Atalho solicitado pelo usuário) */}
            <button
              onClick={() => onNavigate('novo-orcamento-santa-rita')}
              className="flex items-center gap-2 px-6 py-3 bg-transparent border border-[#D4AF37] hover:bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg transition-all font-bold"
            >
              <FileText className="w-5 h-5" />
              Novo Orçamento
            </button>

            {/* 🔥 Botão Novo Cliente (Agora funcional) */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-lg transition-all font-medium shadow-lg shadow-[#D4AF37]/20"
            >
                <Plus className="w-5 h-5" />
                Novo Cliente
            </button>
          </div>
        </div>

        {/* Modal de Adicionar Cliente */}
        <ModalAdicionarClienteFornecedor 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveCliente}
            perfilInicial={activeTab}
        />

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[#333]">
          {(['vidraceiro', 'construtor', 'arquiteto', 'consumidor_final'] as PerfilCliente[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-t-lg transition-all border-b-2
                ${activeTab === tab 
                  ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10' 
                  : 'border-transparent text-[#666] hover:text-[#D4AF37] hover:bg-[#1A1A1A]'
                }
              `}
            >
              {getTabIcon(tab)}
              {getTabLabel(tab)}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab ? 'bg-[#D4AF37] text-black' : 'bg-[#222] text-[#888]'}`}>
                {clientes.filter(c => c.perfil === tab).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Barra de Busca e Filtros */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#555]" />
            <input
              type="text"
              placeholder={`Buscar ${getTabLabel(activeTab).toLowerCase()} por nome, cidade...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#111] border border-[#333] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-white placeholder-[#555] transition-all"
            />
          </div>
          <button className="px-4 py-3 bg-[#111] border border-[#333] rounded-xl hover:bg-[#222] text-[#888] transition-colors flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <span>Filtros</span>
          </button>
        </div>

        {/* Lista de Clientes */}
        {loading ? (
           <div className="flex items-center justify-center h-64">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
           </div>
        ) : filteredClientes.length === 0 ? (
          <div className="text-center py-16 bg-[#111] rounded-xl border border-[#222] border-dashed">
            <Users className="w-12 h-12 text-[#333] mx-auto mb-4" />
            <h3 className="text-white font-medium mb-1">Nenhum cliente encontrado</h3>
            <p className="text-[#666] text-sm">
              Tente mudar o termo de busca ou adicione um novo cliente.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClientes.map((cliente) => (
              <div key={cliente.id} className="bg-[#111] border border-[#222] rounded-xl p-6 hover:border-[#D4AF37]/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold
                        ${cliente.status === 'ativo' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'bg-[#222] text-[#555]'}
                    `}>
                        {cliente.nome.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-white leading-tight">{cliente.nome}</h3>
                        <p className="text-xs text-[#666]">{cliente.responsavel}</p>
                    </div>
                  </div>
                  <button className="text-[#444] hover:text-[#D4AF37] p-1">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-[#888]">
                        <MapPin className="w-4 h-4 text-[#555]" />
                        <span>{cliente.cidade}/{cliente.estado}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#888]">
                        <Phone className="w-4 h-4 text-[#555]" />
                        <span>{cliente.telefone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#888]">
                        <Mail className="w-4 h-4 text-[#555]" />
                        <span className="truncate">{cliente.email}</span>
                    </div>
                </div>

                <div className="pt-4 border-t border-[#222] flex items-center justify-between">
                    <div>
                        <div className="text-xs text-[#555] font-medium uppercase">Volume Compra</div>
                        <div className="text-sm font-bold text-white">{cliente.volume}</div>
                    </div>
                    <button className="px-3 py-1.5 text-xs font-medium text-[#D4AF37] bg-[#D4AF37]/10 rounded-lg hover:bg-[#D4AF37]/20 transition-colors">
                        Ver Detalhes
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}