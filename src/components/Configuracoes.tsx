import { useState } from 'react';
import { X, Percent, User, Save, DollarSign } from 'lucide-react';

interface ConfiguracoesProps {
  onClose: () => void;
}

export function Configuracoes({ onClose }: ConfiguracoesProps) {
  const [aba, setAba] = useState<'lucro' | 'perfil'>('lucro');
  const [lucroGlobal, setLucroGlobal] = useState(30);
  const [lucrosPorLinha, setLucrosPorLinha] = useState({
    guardian: 25,
    cba: 28,
    acessorio: 35,
  });

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border-2 border-emerald-700 rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 p-6 border-b border-emerald-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-700/30 rounded-xl flex items-center justify-center">
                {aba === 'lucro' ? (
                  <Percent className="w-6 h-6 text-emerald-400" />
                ) : (
                  <User className="w-6 h-6 text-emerald-400" />
                )}
              </div>
              <div>
                <h2 className="text-white text-2xl font-bold">Configurações</h2>
                <p className="text-emerald-300 text-sm">Personalize seu sistema</p>
              </div>
            </div>
            <button onClick={onClose} className="text-emerald-300 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-neutral-900 border-b border-neutral-800 p-4 flex gap-2">
          <button
            onClick={() => setAba('lucro')}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              aba === 'lucro'
                ? 'bg-emerald-700 text-white'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Percent className="w-5 h-5" />
            Configuração de Lucro
          </button>
          <button
            onClick={() => setAba('perfil')}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              aba === 'perfil'
                ? 'bg-emerald-700 text-white'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <User className="w-5 h-5" />
            Meu Perfil
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {aba === 'lucro' && (
            <div className="space-y-6">
              {/* Lucro Global */}
              <div className="bg-emerald-900/20 border border-emerald-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-white font-bold text-lg">Margem de Lucro Global</h3>
                </div>
                <p className="text-neutral-400 text-sm mb-4">
                  Define a margem de lucro padrão aplicada sobre os preços dos distribuidores
                </p>
                
                <div className="flex items-center gap-6">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={lucroGlobal}
                    onChange={(e) => setLucroGlobal(Number(e.target.value))}
                    className="flex-1 h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="text-emerald-400 font-bold text-3xl w-24 text-right">
                    {lucroGlobal}%
                  </div>
                </div>

                {/* Exemplo */}
                <div className="mt-6 bg-neutral-900/50 rounded-lg p-4">
                  <div className="text-neutral-400 text-xs mb-2">EXEMPLO DE CÁLCULO:</div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-neutral-500">Preço Distribuidor</div>
                      <div className="text-white font-semibold">R$ 1.000,00</div>
                    </div>
                    <div>
                      <div className="text-neutral-500">Margem ({lucroGlobal}%)</div>
                      <div className="text-emerald-400 font-semibold">+ R$ {(1000 * lucroGlobal / 100).toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-neutral-500">Preço Final Cliente</div>
                      <div className="text-white font-bold text-lg">R$ {(1000 + (1000 * lucroGlobal / 100)).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lucro por Linha */}
              <div className="bg-neutral-800/50 border border-emerald-700 rounded-xl p-6">
                <h3 className="text-white font-bold text-lg mb-4">Margem por Linha de Produto</h3>
                <p className="text-neutral-400 text-sm mb-6">
                  Personalize a margem de lucro específica para cada fornecedor
                </p>

                <div className="space-y-6">
                  {/* Guardian */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-emerald-400 font-semibold">GUARDIAN</label>
                      <span className="text-emerald-400 font-bold text-xl">{lucrosPorLinha.guardian}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={lucrosPorLinha.guardian}
                      onChange={(e) => setLucrosPorLinha({ ...lucrosPorLinha, guardian: Number(e.target.value) })}
                      className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>

                  {/* CBA */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-emerald-400 font-semibold">CBA</label>
                      <span className="text-emerald-400 font-bold text-xl">{lucrosPorLinha.cba}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={lucrosPorLinha.cba}
                      onChange={(e) => setLucrosPorLinha({ ...lucrosPorLinha, cba: Number(e.target.value) })}
                      className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>

                  {/* Acessório */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-emerald-400 font-semibold">ACESSÓRIO</label>
                      <span className="text-emerald-400 font-bold text-xl">{lucrosPorLinha.acessorio}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={lucrosPorLinha.acessorio}
                      onChange={(e) => setLucrosPorLinha({ ...lucrosPorLinha, acessorio: Number(e.target.value) })}
                      className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  alert('✅ Configurações de lucro salvas com sucesso!');
                  onClose();
                }}
                className="w-full py-4 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Salvar Configurações de Lucro
              </button>
            </div>
          )}

          {aba === 'perfil' && (
            <div className="space-y-6">
              <div className="bg-neutral-800/50 border border-emerald-700 rounded-xl p-6">
                <h3 className="text-white font-bold text-lg mb-6">Dados da Empresa</h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="text-emerald-400 text-sm mb-2 block font-semibold">Razão Social</label>
                    <input
                      type="text"
                      defaultValue="SysConecta Vidraçaria Premium LTDA"
                      className="w-full bg-neutral-900 border border-emerald-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="text-emerald-400 text-sm mb-2 block font-semibold">CNPJ</label>
                    <input
                      type="text"
                      defaultValue="12.345.678/0001-90"
                      className="w-full bg-neutral-900 border border-emerald-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="text-emerald-400 text-sm mb-2 block font-semibold">Telefone</label>
                    <input
                      type="text"
                      defaultValue="(11) 3000-0000"
                      className="w-full bg-neutral-900 border border-emerald-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-emerald-400 text-sm mb-2 block font-semibold">Email</label>
                    <input
                      type="email"
                      defaultValue="contato@sysconecta.com.br"
                      className="w-full bg-neutral-900 border border-emerald-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-emerald-400 text-sm mb-2 block font-semibold">Endereço</label>
                    <input
                      type="text"
                      defaultValue="Av. Paulista, 1000 - São Paulo/SP"
                      className="w-full bg-neutral-900 border border-emerald-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  alert('✅ Perfil atualizado com sucesso!');
                  onClose();
                }}
                className="w-full py-4 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Salvar Alterações
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
