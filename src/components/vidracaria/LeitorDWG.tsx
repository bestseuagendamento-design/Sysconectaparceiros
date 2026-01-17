import React, { useState, useCallback } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Download,
  Trash2,
  Eye,
  Plus,
  Ruler,
  Package,
  DoorOpen,
  Shield,
  Square
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ElementoDWG {
  id: string;
  tipo: 'JANELA' | 'PORTA' | 'GUARDA_CORPO' | 'VIDRO' | 'ESQUADRIA';
  largura: number; // em metros
  altura: number; // em metros
  area: number; // m²
  layer: string;
  confianca: 'alta' | 'media' | 'baixa';
  descricao: string;
}

interface LeitorDWGProps {
  onImportarParaOrcamento?: (elementos: ElementoDWG[]) => void;
}

export function LeitorDWG({ onImportarParaOrcamento }: LeitorDWGProps) {
  const [processando, setProcessando] = useState(false);
  const [elementos, setElementos] = useState<ElementoDWG[]>([]);
  const [arquivoNome, setArquivoNome] = useState<string>('');
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [visualizacao, setVisualizacao] = useState<'lista' | 'cards'>('lista');

  // Função para processar o arquivo DWG/DXF
  const processarArquivo = useCallback(async (file: File) => {
    setProcessando(true);
    setArquivoNome(file.name);
    
    try {
      console.log('📐 Processando arquivo:', file.name);
      
      // Ler o arquivo como texto
      const texto = await file.text();
      
      // Analisar e extrair elementos
      const elementosEncontrados = analisarDWG(texto, file.name);
      
      setElementos(elementosEncontrados);
      
      if (elementosEncontrados.length > 0) {
        toast.success(`✅ ${elementosEncontrados.length} elementos encontrados!`);
      } else {
        toast.warning('⚠️ Nenhum elemento de vidro identificado automaticamente.');
      }
      
    } catch (error: any) {
      console.error('Erro ao processar arquivo:', error);
      toast.error('Erro ao processar arquivo. Verifique se é um DXF válido.');
    } finally {
      setProcessando(false);
    }
  }, []);

  // Função de análise do arquivo DWG/DXF
  const analisarDWG = (conteudo: string, nomeArquivo: string): ElementoDWG[] => {
    const elementos: ElementoDWG[] = [];
    
    // 🔍 ANÁLISE DXF (formato texto AutoCAD)
    if (nomeArquivo.toLowerCase().endsWith('.dxf')) {
      console.log('📐 Analisando arquivo DXF...');
      
      // Procurar por blocos INSERT (janelas, portas)
      const blocos = extrairBlocos(conteudo);
      elementos.push(...blocos);
      
      // Procurar por LWPOLYLINE e LINE (guarda-corpos, esquadrias)
      const polilinhas = extrairPolilinhas(conteudo);
      elementos.push(...polilinhas);
      
      // Procurar por CIRCLE e ARC (elementos circulares)
      const circulares = extrairElementosCirculares(conteudo);
      elementos.push(...circulares);
      
    } else if (nomeArquivo.toLowerCase().endsWith('.dwg')) {
      // DWG binário - não pode ser lido diretamente como texto
      toast.error('❌ Arquivo DWG detectado. Por favor, exporte como DXF no AutoCAD (Salvar Como > DXF)');
      return [];
    }
    
    return elementos;
  };

  // Extrair blocos (janelas, portas)
  const extrairBlocos = (conteudo: string): ElementoDWG[] => {
    const elementos: ElementoDWG[] = [];
    const linhas = conteudo.split('\n');
    
    let i = 0;
    while (i < linhas.length) {
      const linha = linhas[i].trim();
      
      // Procurar por INSERT (blocos)
      if (linha === 'INSERT' || linha === 'BLOCK') {
        let nomeBlocoIndex = i;
        let nomeBloco = '';
        let scaleX = 1;
        let scaleY = 1;
        let layer = 'DEFAULT';
        
        // Buscar nome do bloco (código 2)
        for (let j = i; j < i + 50 && j < linhas.length; j++) {
          if (linhas[j].trim() === '2') {
            nomeBloco = linhas[j + 1].trim();
          }
          if (linhas[j].trim() === '8') {
            layer = linhas[j + 1].trim();
          }
          if (linhas[j].trim() === '41') {
            scaleX = parseFloat(linhas[j + 1].trim()) || 1;
          }
          if (linhas[j].trim() === '42') {
            scaleY = parseFloat(linhas[j + 1].trim()) || 1;
          }
        }
        
        // Identificar tipo baseado no nome
        const nomeLower = nomeBloco.toLowerCase();
        let tipo: ElementoDWG['tipo'] | null = null;
        let confianca: ElementoDWG['confianca'] = 'media';
        
        if (nomeLower.includes('janela') || nomeLower.includes('window') || nomeLower.includes('jan')) {
          tipo = 'JANELA';
          confianca = 'alta';
        } else if (nomeLower.includes('porta') || nomeLower.includes('door')) {
          tipo = 'PORTA';
          confianca = 'alta';
        } else if (nomeLower.includes('guarda') || nomeLower.includes('guard') || nomeLower.includes('rail')) {
          tipo = 'GUARDA_CORPO';
          confianca = 'alta';
        } else if (nomeLower.includes('vidro') || nomeLower.includes('glass') || nomeLower.includes('esquadria')) {
          tipo = 'VIDRO';
          confianca = 'alta';
        }
        
        if (tipo) {
          // Usar scale como dimensão aproximada (em metros, assumindo escala 1:100)
          const largura = Math.abs(scaleX) / 100; // Converter para metros
          const altura = Math.abs(scaleY) / 100;
          
          if (largura > 0.1 && altura > 0.1 && largura < 10 && altura < 10) { // Filtro de sanidade
            elementos.push({
              id: `bloco-${elementos.length + 1}`,
              tipo,
              largura,
              altura,
              area: largura * altura,
              layer,
              confianca,
              descricao: `${nomeBloco} (${largura.toFixed(2)}m x ${altura.toFixed(2)}m)`
            });
          }
        }
      }
      
      i++;
    }
    
    return elementos;
  };

  // Extrair polilinhas (retângulos que podem ser vidros)
  const extrairPolilinhas = (conteudo: string): ElementoDWG[] => {
    const elementos: ElementoDWG[] = [];
    const linhas = conteudo.split('\n');
    
    let i = 0;
    while (i < linhas.length) {
      const linha = linhas[i].trim();
      
      if (linha === 'LWPOLYLINE' || linha === 'POLYLINE') {
        let pontos: Array<{x: number, y: number}> = [];
        let layer = 'DEFAULT';
        
        // Buscar pontos (código 10 e 20 para X e Y)
        for (let j = i; j < i + 200 && j < linhas.length; j++) {
          if (linhas[j].trim() === '8') {
            layer = linhas[j + 1].trim();
          }
          if (linhas[j].trim() === '10') {
            const x = parseFloat(linhas[j + 1].trim());
            if (!isNaN(x)) {
              // Procurar Y correspondente
              for (let k = j + 1; k < j + 10; k++) {
                if (linhas[k].trim() === '20') {
                  const y = parseFloat(linhas[k + 1].trim());
                  if (!isNaN(y)) {
                    pontos.push({ x, y });
                    break;
                  }
                }
              }
            }
          }
          if (linhas[j].trim() === 'SEQEND' || linhas[j].trim() === 'ENDSEC') break;
        }
        
        // Verificar se forma um retângulo (4 pontos)
        if (pontos.length === 4 || pontos.length === 5) {
          const largura = Math.abs(pontos[1].x - pontos[0].x) / 1000; // Convertendo de mm para m
          const altura = Math.abs(pontos[2].y - pontos[1].y) / 1000;
          
          // Filtro: apenas retângulos que parecem ser janelas/portas (entre 0.5m e 5m)
          if (largura > 0.3 && altura > 0.3 && largura < 6 && altura < 6) {
            const layerLower = layer.toLowerCase();
            let tipo: ElementoDWG['tipo'] = 'ESQUADRIA';
            let confianca: ElementoDWG['confianca'] = 'baixa';
            
            if (layerLower.includes('janela') || layerLower.includes('window')) {
              tipo = 'JANELA';
              confianca = 'media';
            } else if (layerLower.includes('porta') || layerLower.includes('door')) {
              tipo = 'PORTA';
              confianca = 'media';
            } else if (layerLower.includes('vidro') || layerLower.includes('glass')) {
              tipo = 'VIDRO';
              confianca = 'media';
            } else if (layerLower.includes('guarda')) {
              tipo = 'GUARDA_CORPO';
              confianca = 'media';
            }
            
            elementos.push({
              id: `poly-${elementos.length + 1}`,
              tipo,
              largura,
              altura,
              area: largura * altura,
              layer,
              confianca,
              descricao: `Retângulo ${layer} (${largura.toFixed(2)}m x ${altura.toFixed(2)}m)`
            });
          }
        }
      }
      
      i++;
    }
    
    return elementos;
  };

  // Extrair elementos circulares
  const extrairElementosCirculares = (conteudo: string): ElementoDWG[] => {
    // Por enquanto, retornar vazio - pode ser expandido no futuro
    return [];
  };

  // Handler de drop de arquivo
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.name.toLowerCase().endsWith('.dxf') || file.name.toLowerCase().endsWith('.dwg')) {
        processarArquivo(file);
      } else {
        toast.error('Por favor, envie um arquivo DXF ou DWG');
      }
    }
  }, [processarArquivo]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processarArquivo(file);
    }
  }, [processarArquivo]);

  // Toggle seleção
  const toggleSelecao = (id: string) => {
    setSelecionados(prev => {
      const novo = new Set(prev);
      if (novo.has(id)) {
        novo.delete(id);
      } else {
        novo.add(id);
      }
      return novo;
    });
  };

  // Selecionar todos
  const selecionarTodos = () => {
    setSelecionados(new Set(elementos.map(e => e.id)));
  };

  // Limpar seleção
  const limparSelecao = () => {
    setSelecionados(new Set());
  };

  // Importar selecionados para orçamento
  const importarSelecionados = () => {
    const elementosSelecionados = elementos.filter(e => selecionados.has(e.id));
    if (elementosSelecionados.length > 0 && onImportarParaOrcamento) {
      onImportarParaOrcamento(elementosSelecionados);
      toast.success(`${elementosSelecionados.length} elementos importados para orçamento!`);
    } else {
      toast.warning('Selecione ao menos um elemento para importar.');
    }
  };

  // Ícone por tipo
  const getIconePorTipo = (tipo: ElementoDWG['tipo']) => {
    switch (tipo) {
      case 'JANELA': return <Square className="w-4 h-4" />;
      case 'PORTA': return <DoorOpen className="w-4 h-4" />;
      case 'GUARDA_CORPO': return <Shield className="w-4 h-4" />;
      case 'VIDRO': return <Package className="w-4 h-4" />;
      case 'ESQUADRIA': return <Ruler className="w-4 h-4" />;
    }
  };

  // Cor por confiança
  const getCorPorConfianca = (confianca: ElementoDWG['confianca']) => {
    switch (confianca) {
      case 'alta': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'media': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'baixa': return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      
      {/* HEADER */}
      <div className="p-4 md:p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <FileText className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-900">
              Leitor Inteligente de DWG/DXF
            </h2>
            <p className="text-xs md:text-sm text-slate-600">
              Identifique automaticamente janelas, portas e elementos de vidro
            </p>
          </div>
        </div>
      </div>

      {/* ÁREA DE UPLOAD */}
      {elementos.length === 0 && (
        <div className="flex-1 p-6">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-slate-300 rounded-xl p-8 md:p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer"
          >
            <input
              type="file"
              accept=".dxf,.dwg"
              onChange={handleFileInput}
              className="hidden"
              id="dwg-upload"
            />
            <label htmlFor="dwg-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-4">
                {processando ? (
                  <>
                    <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                    <p className="text-lg font-bold text-slate-700">Processando arquivo...</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-16 h-16 text-slate-400" />
                    <div>
                      <p className="text-lg font-bold text-slate-700 mb-1">
                        Arraste um arquivo DXF aqui
                      </p>
                      <p className="text-sm text-slate-500">
                        ou clique para selecionar
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 mt-4">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        Detecta janelas, portas e guarda-corpos
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        Extrai medidas automaticamente
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        Importa direto para orçamento
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-800 font-medium">
                        💡 <strong>Dica:</strong> No AutoCAD, use "Salvar Como → DXF" para melhor compatibilidade
                      </p>
                    </div>
                  </>
                )}
              </div>
            </label>
          </div>
        </div>
      )}

      {/* RESULTADOS */}
      {elementos.length > 0 && (
        <>
          {/* TOOLBAR */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-slate-600" />
                <span className="font-bold text-slate-900">{arquivoNome}</span>
              </div>
              <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                {elementos.length} elementos
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={selecionarTodos}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Selecionar Todos
              </button>
              <button
                onClick={limparSelecao}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Limpar
              </button>
              <button
                onClick={() => {
                  setElementos([]);
                  setSelecionados(new Set());
                  setArquivoNome('');
                }}
                className="px-3 py-1.5 bg-white border border-red-300 rounded-lg text-xs font-bold text-red-700 hover:bg-red-50 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Novo Arquivo
              </button>
            </div>
          </div>

          {/* LISTA DE ELEMENTOS */}
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th className="p-3 text-left">
                    <input
                      type="checkbox"
                      checked={selecionados.size === elementos.length}
                      onChange={() => selecionados.size === elementos.length ? limparSelecao() : selecionarTodos()}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="p-3 text-xs font-bold text-slate-600 uppercase text-left">Tipo</th>
                  <th className="p-3 text-xs font-bold text-slate-600 uppercase text-left">Descrição</th>
                  <th className="p-3 text-xs font-bold text-slate-600 uppercase text-right">Largura</th>
                  <th className="p-3 text-xs font-bold text-slate-600 uppercase text-right">Altura</th>
                  <th className="p-3 text-xs font-bold text-slate-600 uppercase text-right">Área</th>
                  <th className="p-3 text-xs font-bold text-slate-600 uppercase text-center">Confiança</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {elementos.map((elem) => (
                  <tr
                    key={elem.id}
                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                      selecionados.has(elem.id) ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => toggleSelecao(elem.id)}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selecionados.has(elem.id)}
                        onChange={() => toggleSelecao(elem.id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {getIconePorTipo(elem.tipo)}
                        <span className="text-sm font-bold text-slate-700">{elem.tipo.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm text-slate-600">{elem.descricao}</div>
                      <div className="text-xs text-slate-400 mt-0.5">Layer: {elem.layer}</div>
                    </td>
                    <td className="p-3 text-right">
                      <span className="text-sm font-bold text-slate-900">{elem.largura.toFixed(2)}m</span>
                    </td>
                    <td className="p-3 text-right">
                      <span className="text-sm font-bold text-slate-900">{elem.altura.toFixed(2)}m</span>
                    </td>
                    <td className="p-3 text-right">
                      <span className="text-sm font-bold text-blue-600">{elem.area.toFixed(2)}m²</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold border ${getCorPorConfianca(elem.confianca)}`}>
                        {elem.confianca.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FOOTER COM AÇÕES */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              <span className="font-bold text-slate-900">{selecionados.size}</span> de {elementos.length} selecionados
            </div>
            
            <button
              onClick={importarSelecionados}
              disabled={selecionados.size === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-900/10 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Importar para Orçamento
            </button>
          </div>
        </>
      )}
    </div>
  );
}
