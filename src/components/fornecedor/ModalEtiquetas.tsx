import React from 'react';
import { X, Printer, Download } from 'lucide-react';
import { Button } from '../ui/button';

interface EtiquetaData {
  id: string;
  pedidoId: string;
  cliente: string;      // Nome da Vidraçaria (Quem pagou)
  cliente_final?: string; // Nome da Obra/Cliente Final (Para quem vai)
  descricao: string;
  medidas: string;
  setor: string;
  // Novos campos
  espessura?: string | number;
  cor?: string;
  tipo?: string;
}

interface ModalEtiquetasProps {
  isOpen: boolean;
  onClose: () => void;
  pedidoId: string;
  clienteNome: string;
}

export function ModalEtiquetas({ isOpen, onClose, pedidoId, clienteNome }: ModalEtiquetasProps) {
  const [items, setItems] = React.useState<EtiquetaData[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      // Buscar itens do pedido no "Banco de Produção"
      const stored = localStorage.getItem('sysconecta_producao_items');
      if (stored) {
        const todosItems = JSON.parse(stored);
        // Filtrar apenas itens deste pedido
        const itensDoPedido = todosItems.filter((i: any) => i.pedidoId === pedidoId);
        setItems(itensDoPedido);
      }
    }
  }, [isOpen, pedidoId]);

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1500] bg-black/80 flex items-center justify-center p-4 print:p-0 print:bg-white print:block print:static">
      
      {/* Container Principal (Escondido na impressão, visível na tela) */}
      <div className="bg-white w-full max-w-4xl h-[90vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl print:hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Gerador de Etiquetas</h2>
            <p className="text-slate-500">Pedido #{pedidoId} - {clienteNome} ({items.length} volumes)</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Printer className="w-4 h-4" />
              Imprimir
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="area-impressao-preview">
            {items.map((item, idx) => (
              <EtiquetaPreview key={idx} item={item} index={idx + 1} total={items.length} />
            ))}
          </div>
        </div>
        
        <div className="p-4 bg-yellow-50 text-yellow-800 text-sm text-center border-t border-yellow-100">
            Dica: Ao imprimir, selecione "Sem Margens" nas configurações da impressora.
        </div>
      </div>

      {/* ÁREA EXCLUSIVA DE IMPRESSÃO (CSS PRINT ONLY) */}
      <div className="hidden print:grid print:grid-cols-2 print:gap-4 print:p-0 w-full bg-white print:content-start">
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            @page {
              size: A4;
              margin: 5mm;
            }
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            /* Garantir que as etiquetas não quebrem no meio */
            .etiqueta-container {
              break-inside: avoid;
              page-break-inside: avoid;
            }
          }
        `}} />
        {items.map((item, idx) => (
           <div key={idx} className="etiqueta-container w-full flex justify-center pb-2">
              <EtiquetaPreview item={item} index={idx + 1} total={items.length} />
           </div>
        ))}
      </div>
    </div>
  );
}

// O Layout da Etiqueta Individual (OTIMIZADO PARA O VIDRACEIRO)
function EtiquetaPreview({ item, index, total }: { item: EtiquetaData, index: number, total: number }) {
  // Gerador de QR Code Simples via API
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${item.id}&bgcolor=ffffff`;

  return (
    <div className="bg-white border-2 border-slate-900 rounded-lg p-2 flex flex-row gap-2 h-[220px] w-full max-w-[380px] shadow-sm print:shadow-none print:border-2 print:border-black relative overflow-hidden box-border">
      
      {/* INFO PRINCIPAL */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        
        {/* Cabeçalho: Vidraçaria + Contador */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-1 mb-1">
            <div className="w-[70%]">
                <span className="text-[8px] font-bold uppercase text-slate-500 print:text-black block">Vidraçaria / Comprador</span>
                <p className="font-bold text-slate-800 text-xs truncate leading-tight print:text-black">
                    {item.cliente.substring(0, 30)}
                </p>
            </div>
            <div className="text-right">
                <span className="text-xs font-black bg-black text-white px-2 py-0.5 rounded print:bg-black print:text-white block">
                    {index}/{total}
                </span>
            </div>
        </div>

        {/* CENTRO: CLIENTE FINAL */}
        <div className="mb-2">
            <span className="text-[8px] font-bold uppercase text-slate-400 print:text-black block mb-0.5">
                CLIENTE FINAL / OBRA:
            </span>
            <div className="bg-slate-50 border border-slate-300 rounded px-2 py-1 print:bg-transparent print:border-black">
                <h2 className="text-base font-black text-slate-900 leading-tight print:text-black uppercase truncate">
                    {item.cliente_final || item.cliente} 
                </h2>
            </div>
        </div>

        {/* INFO TÉCNICA (Novo Bloco) */}
        <div className="grid grid-cols-3 gap-1 mb-2 bg-slate-50 p-1 rounded border border-slate-100 print:border-slate-300 print:bg-transparent">
            <div>
                <span className="text-[7px] font-bold uppercase text-slate-400 print:text-black block">Tipo</span>
                <p className="text-[10px] font-bold text-slate-900 print:text-black truncate" title={item.tipo || '-'}>
                    {item.tipo || '-'}
                </p>
            </div>
            <div>
                <span className="text-[7px] font-bold uppercase text-slate-400 print:text-black block">Cor</span>
                <p className="text-[10px] font-bold text-slate-900 print:text-black truncate" title={item.cor || '-'}>
                    {item.cor || '-'}
                </p>
            </div>
            <div>
                <span className="text-[7px] font-bold uppercase text-slate-400 print:text-black block">Espessura</span>
                <p className="text-[10px] font-bold text-slate-900 print:text-black truncate">
                    {item.espessura ? `${item.espessura}mm` : '-'}
                </p>
            </div>
        </div>

        {/* RODAPÉ: MEDIDAS E DESCRIÇÃO */}
        <div className="mt-auto border-t border-slate-200 pt-1">
             <div className="flex justify-between items-end gap-2">
                <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-medium text-slate-600 truncate print:text-black leading-tight">
                        {item.descricao}
                    </p>
                </div>
                <div className="text-right shrink-0">
                    <p className="text-xl font-black text-slate-900 leading-none print:text-black tracking-tighter">
                        {item.medidas}
                    </p>
                    <p className="text-[8px] text-slate-400 text-center font-bold uppercase print:text-black">mm</p>
                </div>
             </div>
        </div>
      </div>

      {/* LATERAL: QR CODE + ID */}
      <div className="w-[80px] shrink-0 flex flex-col items-center justify-center border-l-2 border-dashed border-slate-300 pl-1 print:border-black bg-slate-50 print:bg-transparent">
        <img 
            src={qrUrl} 
            alt="QR" 
            className="w-16 h-16 object-contain mb-1 mix-blend-multiply"
            loading="eager"
        />
        <span className="text-[8px] font-mono font-bold text-center break-all leading-none print:text-black transform -rotate-90 origin-center whitespace-nowrap mt-6 translate-y-2 w-20">
            {item.id}
        </span>
      </div>
    </div>
  );
}
