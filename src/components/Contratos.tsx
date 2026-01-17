import { useState } from 'react';
import { X, FileText, Send, Mail, Phone, AlertTriangle, Check, Eye } from 'lucide-react';

interface ContratosProps {
  onClose: () => void;
  theme?: 'light' | 'dark';
}

export function Contratos({ onClose, theme = 'light' }: ContratosProps) {
  const isDark = theme === 'dark';
  const [contratoSelecionado, setContratoSelecionado] = useState<number | null>(null);
  const [enviando, setEnviando] = useState(false);

  const contratos = [
    {
      id: 1,
      cliente: 'Sr. Pedro Silva',
      email: '',
      telefone: '',
      orcamento: '#ORC-2024-001',
      valor: 'R$ 12.450,00',
      status: 'Aprovado',
      data: '10/12/2024',
      temDados: false,
    },
    {
      id: 2,
      cliente: 'Sra. Maria Santos',
      email: 'maria.santos@email.com',
      telefone: '(11) 98765-4321',
      orcamento: '#ORC-2024-002',
      valor: 'R$ 8.900,00',
      status: 'Aprovado',
      data: '11/12/2024',
      temDados: true,
    },
    {
      id: 3,
      cliente: 'João Costa Empreendimentos',
      email: 'joao@costa.com.br',
      telefone: '(11) 91234-5678',
      orcamento: '#ORC-2024-003',
      valor: 'R$ 24.500,00',
      status: 'Aprovado',
      data: '11/12/2024',
      temDados: true,
    },
  ];

  const enviarContrato = (contrato: typeof contratos[0]) => {
    setEnviando(true);
    setTimeout(() => {
      setEnviando(false);
      alert(`✅ Contrato enviado com sucesso!\n\n📧 Email: ${contrato.email}\n📱 WhatsApp: ${contrato.telefone}\n\nO cliente ${contrato.cliente} receberá o contrato para assinatura digital.`);
      setContratoSelecionado(null);
    }, 2000);
  };

  const visualizarContrato = (contrato: typeof contratos[0]) => {
    setContratoSelecionado(contrato.id);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6">
      <div className={`${isDark ? 'bg-gradient-to-br from-neutral-900 to-neutral-950 border-purple-700' : 'bg-white border-purple-200'} border-2 rounded-2xl w-full max-w-6xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col`}>
        
        {/* Header */}
        <div className={`p-4 md:p-6 border-b ${isDark ? 'border-purple-700 bg-gradient-to-r from-purple-900 to-purple-800' : 'border-purple-200 bg-gradient-to-r from-purple-500 to-purple-600'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white text-lg md:text-2xl font-bold">Meus Contratos</h2>
                <p className="text-purple-100 text-xs md:text-sm">Gerenciar e enviar contratos de orçamentos aprovados</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          
          {!contratoSelecionado ? (
            // Lista de Contratos
            <div className="space-y-4">
              {contratos.map((contrato) => (
                <div
                  key={contrato.id}
                  className={`${isDark ? 'bg-neutral-800/50 border-purple-700 hover:border-purple-600' : 'bg-white border-purple-200 hover:border-purple-400'} border rounded-xl p-4 md:p-6 transition-all shadow-sm`}
                >
                  <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-lg`}>{contrato.cliente}</h3>
                        <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-500 rounded-full text-xs font-semibold">
                          {contrato.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 mb-4">
                        <div>
                          <div className={`${isDark ? 'text-neutral-500' : 'text-slate-500'} text-xs mb-1 uppercase font-bold`}>Orçamento</div>
                          <div className={`${isDark ? 'text-white' : 'text-slate-900'} font-semibold`}>{contrato.orcamento}</div>
                        </div>
                        <div>
                          <div className={`${isDark ? 'text-neutral-500' : 'text-slate-500'} text-xs mb-1 uppercase font-bold`}>Valor</div>
                          <div className="text-purple-500 font-bold">{contrato.valor}</div>
                        </div>
                        <div>
                          <div className={`${isDark ? 'text-neutral-500' : 'text-slate-500'} text-xs mb-1 uppercase font-bold`}>Data</div>
                          <div className={`${isDark ? 'text-white' : 'text-slate-900'}`}>{contrato.data}</div>
                        </div>
                      </div>

                      {/* Dados de Contato */}
                      {!contrato.temDados ? (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                          <div>
                            <div className="text-red-500 font-semibold text-sm">Nenhum dado para envio encontrado</div>
                            <div className="text-red-400 text-xs">Email e telefone não cadastrados no sistema</div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className={`${isDark ? 'bg-neutral-900/50' : 'bg-slate-50'} rounded-lg p-3 flex items-center gap-2`}>
                            <Mail className="w-4 h-4 text-purple-500" />
                            <div className="overflow-hidden">
                              <div className={`${isDark ? 'text-neutral-500' : 'text-slate-500'} text-xs uppercase font-bold`}>Email</div>
                              <div className={`${isDark ? 'text-white' : 'text-slate-900'} text-sm truncate`}>{contrato.email}</div>
                            </div>
                          </div>
                          <div className={`${isDark ? 'bg-neutral-900/50' : 'bg-slate-50'} rounded-lg p-3 flex items-center gap-2`}>
                            <Phone className="w-4 h-4 text-purple-500" />
                            <div>
                              <div className={`${isDark ? 'text-neutral-500' : 'text-slate-500'} text-xs uppercase font-bold`}>WhatsApp</div>
                              <div className={`${isDark ? 'text-white' : 'text-slate-900'} text-sm`}>{contrato.telefone}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                      <button
                        onClick={() => visualizarContrato(contrato)}
                        className={`flex-1 md:flex-none px-4 py-2 ${isDark ? 'bg-purple-700 hover:bg-purple-600' : 'bg-purple-600 hover:bg-purple-500'} text-white rounded-lg transition-all text-sm font-semibold flex items-center justify-center gap-2 shadow-sm`}
                      >
                        <Eye className="w-4 h-4" />
                        Visualizar
                      </button>
                      <button
                        onClick={() => enviarContrato(contrato)}
                        disabled={!contrato.temDados || enviando}
                        className="flex-1 md:flex-none px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-all text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      >
                        <Send className="w-4 h-4" />
                        Enviar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Visualização do Contrato
            <div className="space-y-6">
              <button
                onClick={() => setContratoSelecionado(null)}
                className="text-purple-500 hover:text-purple-400 transition-colors flex items-center gap-2 font-medium"
              >
                ← Voltar para lista
              </button>

              <div className="bg-white rounded-xl p-8 md:p-12 text-black shadow-lg">
                {/* Cabeçalho do Contrato */}
                <div className="text-center mb-8 border-b-2 border-gray-200 pb-6">
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1>
                  <div className="text-gray-500">Vidros, Esquadrias e Instalações</div>
                </div>

                {/* Partes do Contrato */}
                <div className="space-y-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h2 className="font-bold text-lg mb-3 border-b border-gray-200 pb-1">CONTRATANTE:</h2>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm">
                        <p><strong>Nome:</strong> {contratos.find(c => c.id === contratoSelecionado)?.cliente}</p>
                        <p><strong>Email:</strong> {contratos.find(c => c.id === contratoSelecionado)?.email}</p>
                        <p><strong>Telefone:</strong> {contratos.find(c => c.id === contratoSelecionado)?.telefone}</p>
                      </div>
                    </div>

                    <div>
                      <h2 className="font-bold text-lg mb-3 border-b border-gray-200 pb-1">CONTRATADO:</h2>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm">
                        <p><strong>Empresa:</strong> SysConecta Vidraçaria Premium LTDA</p>
                        <p><strong>CNPJ:</strong> 12.345.678/0001-90</p>
                        <p><strong>Endereço:</strong> Av. Paulista, 1000 - São Paulo/SP</p>
                        <p><strong>Telefone:</strong> (11) 3000-0000</p>
                      </div>
                    </div>
                  </div>

                  {/* Objeto do Contrato */}
                  <div>
                    <h2 className="font-bold text-lg mb-3 border-b border-gray-200 pb-1">DO OBJETO:</h2>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-2 text-sm">
                      <p><strong>Orçamento:</strong> {contratos.find(c => c.id === contratoSelecionado)?.orcamento}</p>
                      <p><strong>Valor Total:</strong> {contratos.find(c => c.id === contratoSelecionado)?.valor}</p>
                      <p className="mt-4 text-gray-700 leading-relaxed">
                        O presente contrato tem como objeto a prestação de serviços de fornecimento, 
                        instalação e manutenção de vidros, esquadrias de alumínio e serviços correlatos, 
                        conforme especificações técnicas detalhadas no orçamento acima referenciado.
                      </p>
                    </div>
                  </div>

                  {/* Cláusulas */}
                  <div>
                    <h2 className="font-bold text-lg mb-3 border-b border-gray-200 pb-1">CLÁUSULAS CONTRATUAIS:</h2>
                    <div className="space-y-4 text-sm">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <p className="font-bold text-gray-900 mb-1">CLÁUSULA 1ª - DO PRAZO</p>
                        <p className="text-gray-700">
                          O prazo para execução dos serviços será de até 30 (trinta) dias corridos, 
                          contados a partir da aprovação do projeto e confirmação do pedido.
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <p className="font-bold text-gray-900 mb-1">CLÁUSULA 2ª - DO PAGAMENTO</p>
                        <p className="text-gray-700">
                          O pagamento será realizado em até 3 (três) parcelas, sendo: 40% na aprovação do orçamento, 
                          30% no início da instalação e 30% na conclusão e aprovação final dos serviços.
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <p className="font-bold text-gray-900 mb-1">CLÁUSULA 3ª - DA GARANTIA</p>
                        <p className="text-gray-700">
                          A CONTRATADA garante os serviços prestados pelo prazo de 12 (doze) meses, 
                          a contar da data de conclusão, contra defeitos de fabricação e instalação.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assinaturas */}
                <div className="border-t-2 border-gray-200 pt-8 mt-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="text-center">
                      <div className="border-t-2 border-gray-400 pt-2 mb-2 w-2/3 mx-auto"></div>
                      <p className="font-semibold">CONTRATANTE</p>
                      <p className="text-sm text-gray-600">{contratos.find(c => c.id === contratoSelecionado)?.cliente}</p>
                    </div>
                    <div className="text-center">
                      <div className="border-t-2 border-gray-400 pt-2 mb-2 w-2/3 mx-auto"></div>
                      <p className="font-semibold">CONTRATADO</p>
                      <p className="text-sm text-gray-600">SysConecta Vidraçaria Premium LTDA</p>
                    </div>
                  </div>
                  <div className="text-center mt-8 text-sm text-gray-500">
                    São Paulo, {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Botão Enviar */}
              <div className="flex gap-4">
                <button
                  onClick={() => setContratoSelecionado(null)}
                  className={`flex-1 py-4 ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50'} rounded-xl font-bold transition-all shadow-sm`}
                >
                  Voltar
                </button>
                <button
                  onClick={() => enviarContrato(contratos.find(c => c.id === contratoSelecionado)!)}
                  className="flex-1 py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
                >
                  <Send className="w-5 h-5" />
                  Enviar Contrato para Cliente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}