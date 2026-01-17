import { useState } from 'react';
import { X, Calendar, Clock, Bell, Users, Plus, Edit, Trash2 } from 'lucide-react';

interface AgendaProps {
  onClose: () => void;
  theme?: 'light' | 'dark';
}

export function Agenda({ onClose, theme = 'light' }: AgendaProps) {
  const isDark = theme === 'dark';
  const [tipoSelecionado, setTipoSelecionado] = useState<'agenda' | 'reuniao' | 'lembrete'>('agenda');
  const [mostrarNovo, setMostrarNovo] = useState(false);

  const agendamentos = [
    { id: 1, tipo: 'agenda', titulo: 'Instalação - Sr. Pedro', data: '15/12/2024', hora: '09:00', local: 'Av. Paulista, 1000' },
    { id: 2, tipo: 'agenda', titulo: 'Medição - Maria Santos', data: '15/12/2024', hora: '14:00', local: 'Rua Augusta, 500' },
    { id: 3, tipo: 'reuniao', titulo: 'Reunião com Fornecedor Guardian', data: '16/12/2024', hora: '10:00', participantes: '5 pessoas' },
    { id: 4, tipo: 'lembrete', titulo: 'Enviar orçamento para João Costa', data: '14/12/2024', hora: '16:00', prioridade: 'Alta' },
    { id: 5, tipo: 'lembrete', titulo: 'Ligar para cliente - Aprovação', data: '14/12/2024', hora: '11:00', prioridade: 'Média' },
  ];

  const filtrados = agendamentos.filter(a => a.tipo === tipoSelecionado);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6">
      <div className={`${isDark ? 'bg-gradient-to-br from-neutral-900 to-neutral-950 border-indigo-700' : 'bg-white border-indigo-200'} border-2 rounded-2xl w-full max-w-5xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col`}>
        
        {/* Header */}
        <div className={`p-4 md:p-6 border-b ${isDark ? 'border-indigo-700 bg-gradient-to-r from-indigo-900 to-indigo-800' : 'border-indigo-200 bg-gradient-to-r from-indigo-500 to-indigo-600'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white text-lg md:text-2xl font-bold">Minha Agenda</h2>
                <p className="text-indigo-100 text-xs md:text-sm">Agendas, Reuniões e Lembretes</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className={`${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-indigo-50 border-indigo-100'} border-b p-2 md:p-4 flex gap-2 overflow-x-auto`}>
          <button
            onClick={() => setTipoSelecionado('agenda')}
            className={`flex-1 py-2 md:py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-sm whitespace-nowrap ${
              tipoSelecionado === 'agenda'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : isDark ? 'bg-neutral-800 text-neutral-400 hover:text-white' : 'bg-white text-slate-600 hover:text-indigo-600 border border-transparent hover:border-indigo-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Agendas ({agendamentos.filter(a => a.tipo === 'agenda').length})
          </button>
          <button
            onClick={() => setTipoSelecionado('reuniao')}
            className={`flex-1 py-2 md:py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-sm whitespace-nowrap ${
              tipoSelecionado === 'reuniao'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : isDark ? 'bg-neutral-800 text-neutral-400 hover:text-white' : 'bg-white text-slate-600 hover:text-indigo-600 border border-transparent hover:border-indigo-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Reuniões ({agendamentos.filter(a => a.tipo === 'reuniao').length})
          </button>
          <button
            onClick={() => setTipoSelecionado('lembrete')}
            className={`flex-1 py-2 md:py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-sm whitespace-nowrap ${
              tipoSelecionado === 'lembrete'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : isDark ? 'bg-neutral-800 text-neutral-400 hover:text-white' : 'bg-white text-slate-600 hover:text-indigo-600 border border-transparent hover:border-indigo-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            Lembretes ({agendamentos.filter(a => a.tipo === 'lembrete').length})
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          
          {!mostrarNovo ? (
            <>
              {/* Botão Novo */}
              <button
                onClick={() => setMostrarNovo(true)}
                className="w-full py-3 md:py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all mb-6 flex items-center justify-center gap-2 shadow-lg active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Novo {tipoSelecionado === 'agenda' ? 'Agendamento' : tipoSelecionado === 'reuniao' ? 'Reunião' : 'Lembrete'}
              </button>

              {/* Lista */}
              <div className="space-y-4">
                {filtrados.map((item) => (
                  <div
                    key={item.id}
                    className={`${isDark ? 'bg-neutral-800/50 border-indigo-700 hover:border-indigo-600' : 'bg-white border-indigo-200 hover:border-indigo-400'} border rounded-xl p-4 md:p-5 transition-all shadow-sm`}
                  >
                    <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                      <div className="flex-1 w-full">
                        <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-lg mb-3`}>{item.titulo}</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-indigo-500" />
                            <div>
                              <div className={`${isDark ? 'text-neutral-500' : 'text-slate-500'} text-xs uppercase font-bold`}>Data</div>
                              <div className={`${isDark ? 'text-white' : 'text-slate-900'} text-sm`}>{item.data}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-indigo-500" />
                            <div>
                              <div className={`${isDark ? 'text-neutral-500' : 'text-slate-500'} text-xs uppercase font-bold`}>Horário</div>
                              <div className={`${isDark ? 'text-white' : 'text-slate-900'} text-sm`}>{item.hora}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.tipo === 'agenda' && (
                              <>
                                <div className={`${isDark ? 'text-neutral-500' : 'text-slate-500'} text-xs uppercase font-bold`}>Local</div>
                                <div className={`${isDark ? 'text-white' : 'text-slate-900'} text-sm truncate`}>{item.local}</div>
                              </>
                            )}
                            {item.tipo === 'reuniao' && (
                              <>
                                <Users className="w-4 h-4 text-indigo-500" />
                                <div>
                                  <div className={`${isDark ? 'text-neutral-500' : 'text-slate-500'} text-xs uppercase font-bold`}>Participantes</div>
                                  <div className={`${isDark ? 'text-white' : 'text-slate-900'} text-sm`}>{item.participantes}</div>
                                </div>
                              </>
                            )}
                            {item.tipo === 'lembrete' && (
                              <>
                                <Bell className="w-4 h-4 text-indigo-500" />
                                <div>
                                  <div className={`${isDark ? 'text-neutral-500' : 'text-slate-500'} text-xs uppercase font-bold`}>Prioridade</div>
                                  <div className={`text-sm font-bold ${
                                    item.prioridade === 'Alta' ? 'text-red-500' :
                                    item.prioridade === 'Média' ? 'text-yellow-500' :
                                    'text-green-500'
                                  }`}>
                                    {item.prioridade}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 self-end md:self-start">
                        <button className={`w-10 h-10 ${isDark ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'} rounded-lg flex items-center justify-center transition-all`}>
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className={`w-10 h-10 ${isDark ? 'bg-red-700 hover:bg-red-600' : 'bg-red-100 text-red-600 hover:bg-red-200'} rounded-lg flex items-center justify-center transition-all`}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            // Formulário Novo
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-xl`}>
                  Novo {tipoSelecionado === 'agenda' ? 'Agendamento' : tipoSelecionado === 'reuniao' ? 'Reunião' : 'Lembrete'}
                </h3>
                <button
                  onClick={() => setMostrarNovo(false)}
                  className={`${isDark ? 'text-neutral-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'} transition-colors`}
                >
                  Cancelar
                </button>
              </div>

              <div>
                <label className={`${isDark ? 'text-indigo-400' : 'text-indigo-600'} text-sm mb-2 block font-bold uppercase`}>Título *</label>
                <input
                  type="text"
                  placeholder={`Título do ${tipoSelecionado === 'reuniao' ? 'reunião' : tipoSelecionado}`}
                  className={`w-full ${isDark ? 'bg-neutral-900 border-indigo-800 text-white' : 'bg-white border-slate-200 text-slate-900'} border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`${isDark ? 'text-indigo-400' : 'text-indigo-600'} text-sm mb-2 block font-bold uppercase`}>Data *</label>
                  <input
                    type="date"
                    className={`w-full ${isDark ? 'bg-neutral-900 border-indigo-800 text-white' : 'bg-white border-slate-200 text-slate-900'} border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
                <div>
                  <label className={`${isDark ? 'text-indigo-400' : 'text-indigo-600'} text-sm mb-2 block font-bold uppercase`}>Horário *</label>
                  <input
                    type="time"
                    className={`w-full ${isDark ? 'bg-neutral-900 border-indigo-800 text-white' : 'bg-white border-slate-200 text-slate-900'} border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
              </div>

              {tipoSelecionado === 'agenda' && (
                <div>
                  <label className={`${isDark ? 'text-indigo-400' : 'text-indigo-600'} text-sm mb-2 block font-bold uppercase`}>Local</label>
                  <input
                    type="text"
                    placeholder="Endereço ou local do agendamento"
                    className={`w-full ${isDark ? 'bg-neutral-900 border-indigo-800 text-white' : 'bg-white border-slate-200 text-slate-900'} border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
              )}

              {tipoSelecionado === 'reuniao' && (
                <div>
                  <label className={`${isDark ? 'text-indigo-400' : 'text-indigo-600'} text-sm mb-2 block font-bold uppercase`}>Participantes</label>
                  <input
                    type="text"
                    placeholder="Nome dos participantes"
                    className={`w-full ${isDark ? 'bg-neutral-900 border-indigo-800 text-white' : 'bg-white border-slate-200 text-slate-900'} border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
              )}

              {tipoSelecionado === 'lembrete' && (
                <div>
                  <label className={`${isDark ? 'text-indigo-400' : 'text-indigo-600'} text-sm mb-2 block font-bold uppercase`}>Prioridade</label>
                  <select className={`w-full ${isDark ? 'bg-neutral-900 border-indigo-800 text-white' : 'bg-white border-slate-200 text-slate-900'} border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500`}>
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              )}

              <div>
                <label className={`${isDark ? 'text-indigo-400' : 'text-indigo-600'} text-sm mb-2 block font-bold uppercase`}>Observações</label>
                <textarea
                  rows={4}
                  placeholder="Detalhes adicionais..."
                  className={`w-full ${isDark ? 'bg-neutral-900 border-indigo-800 text-white' : 'bg-white border-slate-200 text-slate-900'} border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 resize-none`}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setMostrarNovo(false)}
                  className={`flex-1 py-3 ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50'} rounded-xl font-bold transition-all shadow-sm`}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    alert('✅ Salvo com sucesso!');
                    setMostrarNovo(false);
                  }}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95"
                >
                  Salvar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}