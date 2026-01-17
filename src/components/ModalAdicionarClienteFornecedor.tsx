import React, { useState } from 'react';
import { X, User, Phone, Mail, MapPin, Building, Briefcase, HardHat, PenTool, FileText } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ModalAdicionarClienteFornecedorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cliente: any) => void;
  perfilInicial?: 'vidraceiro' | 'construtor' | 'arquiteto' | 'consumidor_final';
}

export function ModalAdicionarClienteFornecedor({ isOpen, onClose, onSave, perfilInicial = 'vidraceiro' }: ModalAdicionarClienteFornecedorProps) {
  const [formData, setFormData] = useState({
    nome: '',
    responsavel: '',
    perfil: perfilInicial,
    telefone: '',
    email: '',
    cidade: '',
    estado: 'SC',
    documento: '' // CPF ou CNPJ
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.nome || !formData.telefone) {
      toast.error('Preencha os campos obrigatórios (Nome e Telefone)');
      return;
    }

    onSave({
      ...formData,
      id: Math.floor(Math.random() * 10000), // ID temporário
      status: 'ativo',
      volume: 'R$ 0,00'
    });
    
    toast.success('Cliente adicionado com sucesso!');
    onClose();
    
    // Reset form
    setFormData({
      nome: '',
      responsavel: '',
      perfil: perfilInicial,
      telefone: '',
      email: '',
      cidade: '',
      estado: 'SC',
      documento: ''
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1A1A1A] rounded-2xl w-full max-w-2xl shadow-2xl border border-[#333] max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#333] flex items-center justify-between sticky top-0 bg-[#1A1A1A] z-10">
          <div>
            <h2 className="text-xl font-bold text-white">Adicionar Novo Cliente</h2>
            <p className="text-[#888] text-sm">Cadastro manual de cliente no sistema do fornecedor</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[#333] rounded-lg transition-colors text-[#888] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Seleção de Perfil */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#BBB]">Tipo de Cliente</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'vidraceiro', label: 'Vidraceiro', icon: Briefcase },
                { id: 'construtor', label: 'Construtor', icon: HardHat },
                { id: 'arquiteto', label: 'Arquiteto', icon: PenTool },
                { id: 'consumidor_final', label: 'Consumidor', icon: User },
              ].map((tipo) => (
                <button
                  key={tipo.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, perfil: tipo.id as any })}
                  className={`
                    flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all
                    ${formData.perfil === tipo.id 
                      ? 'border-[#D4AF37] bg-[#D4AF37] text-black' 
                      : 'border-[#333] hover:border-[#555] text-[#888] hover:bg-[#222]'
                    }
                  `}
                >
                  <tipo.icon className="w-5 h-5" />
                  <span className="text-xs font-bold">{tipo.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome / Razão Social */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#BBB]">
                {formData.perfil === 'consumidor_final' ? 'Nome Completo' : 'Razão Social / Nome Fantasia'} <span className="text-[#D4AF37]">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#555]" />
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-[#333] text-white rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all placeholder-[#444]"
                  placeholder={formData.perfil === 'consumidor_final' ? "Ex: João da Silva" : "Ex: Vidraçaria Silva"}
                />
              </div>
            </div>

            {/* Responsável */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#BBB]">
                Nome do Responsável
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#555]" />
                <input
                  type="text"
                  value={formData.responsavel}
                  onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-[#333] text-white rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all placeholder-[#444]"
                  placeholder="Ex: Maria Oliveira"
                />
              </div>
            </div>

            {/* Documento */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#BBB]">
                CPF / CNPJ
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#555]" />
                <input
                  type="text"
                  value={formData.documento}
                  onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-[#333] text-white rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all placeholder-[#444]"
                  placeholder="000.000.000-00"
                />
              </div>
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#BBB]">
                Telefone / WhatsApp <span className="text-[#D4AF37]">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#555]" />
                <input
                  type="tel"
                  required
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-[#333] text-white rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all placeholder-[#444]"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-[#BBB]">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#555]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-[#333] text-white rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all placeholder-[#444]"
                  placeholder="exemplo@email.com"
                />
              </div>
            </div>

            {/* Cidade */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#BBB]">
                Cidade
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#555]" />
                <input
                  type="text"
                  value={formData.cidade}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-[#333] text-white rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all placeholder-[#444]"
                  placeholder="Ex: Florianópolis"
                />
              </div>
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#BBB]">
                Estado
              </label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#111] border border-[#333] text-white rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all"
              >
                <option value="SC">Santa Catarina</option>
                <option value="PR">Paraná</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="SP">São Paulo</option>
                {/* Outros estados... */}
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-[#333] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-[#888] font-medium hover:bg-[#222] rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-[#D4AF37] hover:bg-[#B8860B] text-black font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Salvar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}