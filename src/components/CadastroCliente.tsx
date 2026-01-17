import { useState } from 'react';
import { X, User, Phone, Mail, MapPin, FileText, Save, ArrowRight, Plus } from 'lucide-react';

interface CadastroClienteProps {
  onClose: () => void;
  onSave: (cliente: any) => void;
  onSaveAndContinue: (cliente: any) => void;
  onAddMoreItems?: (cliente: any) => void;
}

export function CadastroCliente({ onClose, onSave, onSaveAndContinue, onAddMoreItems }: CadastroClienteProps) {
  const [formData, setFormData] = useState({
    nome: '',
    cpfCnpj: '',
    telefone: '',
    email: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    observacoes: '',
  });

  const handleSave = () => {
    // 🔥 GARANTIR ID ÚNICO ANTES DE SALVAR
    const clienteComId = {
      ...formData,
      id: `cli-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    onSave(clienteComId);
    onClose();
  };

  const handleSaveAndContinue = () => {
    // 🔥 GARANTIR ID ÚNICO ANTES DE SALVAR
    const clienteComId = {
      ...formData,
      id: `cli-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    onSaveAndContinue(clienteComId);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-t-2xl border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
              <User className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Cadastro de Cliente</h2>
              <p className="text-slate-500 text-sm">Preencha os dados do cliente</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Scrollable */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-slate-50/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Nome Completo */}
            <div className="col-span-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Nome Completo *</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome ou Razão Social"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-400 transition-all shadow-sm"
              />
            </div>

            {/* CPF/CNPJ */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">CPF/CNPJ *</label>
              <input
                type="text"
                value={formData.cpfCnpj}
                onChange={(e) => setFormData({ ...formData, cpfCnpj: e.target.value })}
                placeholder="000.000.000-00"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-400 transition-all shadow-sm"
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> Telefone *</span>
              </label>
              <input
                type="text"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(00) 00000-0000"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-400 transition-all shadow-sm"
              />
            </div>

            {/* Email */}
            <div className="col-span-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> Email</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="cliente@exemplo.com"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-400 transition-all shadow-sm"
              />
            </div>

            <div className="col-span-1 md:col-span-2 h-px bg-slate-200 my-2"></div>

            {/* Endereço */}
            <div className="col-span-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Endereço Completo</span>
              </label>
              <input
                type="text"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                placeholder="Rua, número, complemento"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-400 transition-all shadow-sm"
              />
            </div>

            {/* Cidade */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Cidade</label>
              <input
                type="text"
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                placeholder="Cidade"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-400 transition-all shadow-sm"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Estado</label>
              <input
                type="text"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                placeholder="UF"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-400 transition-all shadow-sm"
              />
            </div>

            {/* CEP */}
            <div className="col-span-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">CEP</label>
              <input
                type="text"
                value={formData.cep}
                onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                placeholder="00000-000"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-400 transition-all shadow-sm"
              />
            </div>

            <div className="col-span-1 md:col-span-2 h-px bg-slate-200 my-2"></div>

            {/* Observações */}
            <div className="col-span-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Observações</span>
              </label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Informações adicionais sobre o cliente..."
                rows={3}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-400 transition-all resize-none shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-slate-100 p-6 rounded-b-2xl flex flex-col gap-3 sticky bottom-0 z-10">
          
          {/* Botão Adicionar Mais Itens (Acima do Continuar) */}
          {onAddMoreItems && (
             <button
                onClick={() => onAddMoreItems(formData)}
                className="w-full py-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl transition-all font-bold flex items-center justify-center gap-2 mb-1 shadow-sm"
             >
                <Plus className="w-5 h-5" />
                Adicionar mais itens ao orçamento?
             </button>
          )}

          <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={handleSave}
                className="flex-1 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-all font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <Save className="w-5 h-5" />
                Salvar Apenas
              </button>
              <button
                onClick={handleSaveAndContinue}
                className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all font-bold flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 active:scale-[0.98]"
              >
                <span>Continuar</span>
                <ArrowRight className="w-5 h-5" />
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}