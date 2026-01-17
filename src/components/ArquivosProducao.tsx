import React, { useState } from 'react';
import { ArrowLeft, Download, Send, FileText, CheckCircle, ExternalLink, Package } from 'lucide-react';

interface ArquivosProducaoProps {
  projeto: any;
  onVoltar: () => void;
  onLiberarProducao: () => void;
}

export function ArquivosProducao({ projeto, onVoltar, onLiberarProducao }: ArquivosProducaoProps) {
  const [arquivosSelecionados, setArquivosSelecionados] = useState<string[]>([]);

  const arquivos = [
    {
      id: 'dxf-1',
      nome: `${projeto.id}_Layout_Completo.dxf`,
      tipo: 'DXF',
      tamanho: '245 KB',
      status: 'Pronto',
      dataGeracao: new Date().toLocaleDateString('pt-BR')
    },
    {
      id: 'nc-1',
      nome: `${projeto.id}_Programa_Corte.nc`,
      tipo: 'NC',
      tamanho: '189 KB',
      status: 'Pronto',
      dataGeracao: new Date().toLocaleDateString('pt-BR')
    },
    {
      id: 'pdf-1',
      nome: `${projeto.id}_Etiquetas.pdf`,
      tipo: 'PDF',
      tamanho: '1.2 MB',
      status: 'Pronto',
      dataGeracao: new Date().toLocaleDateString('pt-BR')
    }
  ];

  const softwares = [
    {
      nome: 'Optima',
      logo: '🔷',
      compativel: true,
      formatos: ['DXF', 'NC']
    },
    {
      nome: 'Lisec',
      logo: '🔶',
      compativel: true,
      formatos: ['DXF', 'NC']
    },
    {
      nome: 'OptiWay',
      logo: '🔵',
      compativel: true,
      formatos: ['DXF']
    },
    {
      nome: 'Bottero CAD',
      logo: '🟢',
      compativel: true,
      formatos: ['DXF', 'NC']
    }
  ];

  const handleDownloadArquivo = (arquivo: any) => {
    // Gerar arquivo simulado
    const conteudo = `SysConecta - ${arquivo.tipo}\nProjeto: ${projeto.id}\nCliente: ${projeto.cliente}\nData: ${new Date().toISOString()}`;
    const blob = new Blob([conteudo], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = arquivo.nome;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadTodos = () => {
    arquivos.forEach(arquivo => {
      setTimeout(() => handleDownloadArquivo(arquivo), 100);
    });
  };

  const toggleSelecao = (id: string) => {
    if (arquivosSelecionados.includes(id)) {
      setArquivosSelecionados(arquivosSelecionados.filter(a => a !== id));
    } else {
      setArquivosSelecionados([...arquivosSelecionados, id]);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onVoltar}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para layout
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl text-neutral-900">Arquivos de Produção</h1>
              <p className="text-neutral-600">Tudo pronto para envio às máquinas de corte</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="col-span-2 space-y-6">
            {/* Informações do Projeto */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h2 className="text-xl text-neutral-900 mb-4">📋 Informações do Projeto</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-600 mb-1">ID Produção</p>
                  <p className="text-neutral-900 font-bold text-sm">{projeto.id}</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-600 mb-1">Cliente</p>
                  <p className="text-neutral-900 font-bold">{projeto.cliente}</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-600 mb-1">Orçamento</p>
                  <p className="text-neutral-900 font-bold">{projeto.orcamentoId}</p>
                </div>
              </div>
            </div>

            {/* Lista de Arquivos */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl text-neutral-900">📄 Arquivos Gerados</h2>
                <button
                  onClick={handleDownloadTodos}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Baixar Todos
                </button>
              </div>

              <div className="space-y-3">
                {arquivos.map((arquivo) => (
                  <div
                    key={arquivo.id}
                    className="flex items-center justify-between p-4 border-2 border-neutral-200 rounded-lg hover:border-blue-500 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={arquivosSelecionados.includes(arquivo.id)}
                        onChange={() => toggleSelecao(arquivo.id)}
                        className="w-5 h-5 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
                      />
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-neutral-900 font-bold">{arquivo.nome}</p>
                        <p className="text-sm text-neutral-600">
                          {arquivo.tipo} • {arquivo.tamanho} • {arquivo.dataGeracao}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                        {arquivo.status}
                      </span>
                      <button
                        onClick={() => handleDownloadArquivo(arquivo)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Integrações */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h2 className="text-xl text-neutral-900 mb-6">🔌 Softwares Compatíveis</h2>
              
              <div className="grid grid-cols-2 gap-4">
                {softwares.map((software) => (
                  <div
                    key={software.nome}
                    className="p-4 border-2 border-neutral-200 rounded-lg hover:border-green-500 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{software.logo}</span>
                        <div>
                          <p className="text-neutral-900 font-bold">{software.nome}</p>
                          <p className="text-xs text-neutral-600">{software.formatos.join(', ')}</p>
                        </div>
                      </div>
                      {software.compativel && (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      )}
                    </div>
                    <button className="w-full px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors text-sm flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" />
                      Enviar para {software.nome}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-500 rounded-lg">
                <div className="flex items-start gap-3">
                  <ExternalLink className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-900 font-bold mb-1">Integração Direta</p>
                    <p className="text-sm text-blue-800">
                      Os arquivos são compatíveis com os principais softwares de corte do mercado. 
                      Configure a integração automática nas configurações da empresa.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadados */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h2 className="text-xl text-neutral-900 mb-4">🔖 Metadados Incorporados</h2>
              
              <div className="bg-neutral-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <p>{"{"}</p>
                <p className="ml-4">"sysconecta_id": "{projeto.id}",</p>
                <p className="ml-4">"orcamento_id": "{projeto.orcamentoId}",</p>
                <p className="ml-4">"cliente": "{projeto.cliente}",</p>
                <p className="ml-4">"data_geracao": "{new Date().toISOString()}",</p>
                <p className="ml-4">"total_pecas": {projeto.itens?.length || 0},</p>
                <p className="ml-4">"tipo_vidro": "Temperado",</p>
                <p className="ml-4">"espessura": "8mm"</p>
                <p>{"}"}</p>
              </div>

              <p className="text-xs text-neutral-600 mt-3">
                ℹ️ Todos os arquivos incluem metadados para rastreabilidade completa
              </p>
            </div>
          </div>

          {/* Coluna Lateral */}
          <div className="space-y-6">
            {/* Status do Projeto */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white sticky top-8">
              <h3 className="text-lg mb-6">✅ Status do Projeto</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6" />
                  <span>Orçamento aprovado</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6" />
                  <span>Layout otimizado</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6" />
                  <span>Arquivos gerados</span>
                </div>
                <div className="flex items-center gap-3 opacity-50">
                  <div className="w-6 h-6 border-2 border-white rounded-full" />
                  <span>Liberado para produção</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-green-400">
                <p className="text-sm text-green-100 mb-2">Próximo Passo</p>
                <p className="font-bold text-lg mb-6">Liberar para Produção</p>
                
                <button
                  onClick={onLiberarProducao}
                  className="w-full px-6 py-4 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors font-bold text-lg shadow-lg flex items-center justify-center gap-2"
                >
                  <Package className="w-6 h-6" />
                  ▶️ Liberar para Produção
                </button>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h3 className="text-neutral-900 font-bold mb-4">⚡ Ações Rápidas</h3>
              
              <div className="space-y-2">
                <button className="w-full px-4 py-3 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Imprimir Etiquetas
                </button>
                <button className="w-full px-4 py-3 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors text-sm flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Enviar por Email
                </button>
                <button className="w-full px-4 py-3 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors text-sm flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Exportar Relatório
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
