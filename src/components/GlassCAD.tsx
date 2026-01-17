import React from 'react';

interface GlassCADProps {
  largura: number;
  altura: number;
  espessura: number;
  tipo: string;
  codigo?: string;
  cor?: string;
}

export function GlassCAD({ largura, altura, espessura, tipo, codigo, cor = 'INCOLOR' }: GlassCADProps) {
  const padding = 60;
  const maxViewSize = 300;
  
  const aspectRatio = largura / altura;
  let viewWidth, viewHeight;
  
  if (aspectRatio > 1) {
    viewWidth = maxViewSize;
    viewHeight = maxViewSize / aspectRatio;
  } else {
    viewHeight = maxViewSize;
    viewWidth = maxViewSize * aspectRatio;
  }
  
  const svgWidth = viewWidth + padding * 2;
  const svgHeight = viewHeight + padding * 2;

  // Estilo Técnico (AutoCAD Like)
  const dimColor = '#0000FF'; // Azul padrão de cotas em CAD
  const cutLineColor = '#000000'; // Preto para linha de corte
  
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-slate-400 shadow-sm w-full print:border-none relative overflow-hidden">
      
      {/* Carimbo Técnico */}
      <div className="absolute top-2 right-2 border-2 border-black bg-white p-2 z-10 shadow-sm opacity-90">
          <table className="text-[10px] font-mono text-black leading-tight border-collapse">
              <tbody>
                  <tr><td className="font-bold pr-2">COD:</td><td>{codigo || 'N/A'}</td></tr>
                  <tr><td className="font-bold pr-2">MAT:</td><td>{tipo} {espessura}mm</td></tr>
                  <tr><td className="font-bold pr-2">COR:</td><td>{cor.toUpperCase()}</td></tr>
                  <tr><td className="font-bold pr-2">QTD:</td><td>1</td></tr>
              </tbody>
          </table>
      </div>

      <div className="relative">
        <svg 
          width={svgWidth} 
          height={svgHeight} 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="max-w-full h-auto"
          style={{ maxHeight: '350px' }}
        >
          <defs>
             {/* Seta CAD (Triângulo preenchido) */}
             <marker id="arrow-cad" markerWidth="8" markerHeight="8" refX="0" refY="2" orient="auto">
               <path d="M0,0 L0,4 L8,2 z" fill={dimColor} />
             </marker>
             <marker id="arrow-cad-end" markerWidth="8" markerHeight="8" refX="8" refY="2" orient="auto">
               <path d="M0,2 L8,4 L8,0 z" fill={dimColor} />
             </marker>
          </defs>

          {/* Vidro (Geometria) */}
          <rect 
            x={padding} 
            y={padding} 
            width={viewWidth} 
            height={viewHeight} 
            fill="rgba(200, 220, 255, 0.15)" 
            stroke={cutLineColor}
            strokeWidth="2.5" 
          />
          
          {/* COTA LARGURA (Inferior) */}
          {/* Linha principal */}
          <line 
            x1={padding} y1={padding + viewHeight + 20} 
            x2={padding + viewWidth} y2={padding + viewHeight + 20} 
            stroke={dimColor} strokeWidth="1.5"
          />
          {/* Setas (desenhadas manualmente para garantir visual CAD) */}
          <path d={`M${padding},${padding + viewHeight + 20} l10,-3 l0,6 z`} fill={dimColor} />
          <path d={`M${padding + viewWidth},${padding + viewHeight + 20} l-10,-3 l0,6 z`} fill={dimColor} />

          {/* Linhas de chamada */}
          <line x1={padding} y1={padding + viewHeight + 5} x2={padding} y2={padding + viewHeight + 30} stroke={dimColor} strokeWidth="1" />
          <line x1={padding + viewWidth} y1={padding + viewHeight + 5} x2={padding + viewWidth} y2={padding + viewHeight + 30} stroke={dimColor} strokeWidth="1" />
          
          {/* Texto Valor */}
          <text 
            x={padding + viewWidth / 2} 
            y={padding + viewHeight + 35} 
            textAnchor="middle" 
            className="text-[14px] font-mono font-bold fill-blue-700"
          >
            {largura}
          </text>

          {/* COTA ALTURA (Esquerda) */}
          {/* Linha principal */}
          <line 
            x1={padding - 20} y1={padding} 
            x2={padding - 20} y2={padding + viewHeight} 
            stroke={dimColor} strokeWidth="1.5"
          />
          {/* Setas */}
          <path d={`M${padding - 20},${padding} l-3,10 l6,0 z`} fill={dimColor} />
          <path d={`M${padding - 20},${padding + viewHeight} l-3,-10 l6,0 z`} fill={dimColor} />

          {/* Linhas de chamada */}
          <line x1={padding - 30} y1={padding} x2={padding - 5} y2={padding} stroke={dimColor} strokeWidth="1" />
          <line x1={padding - 30} y1={padding + viewHeight} x2={padding - 5} y2={padding + viewHeight} stroke={dimColor} strokeWidth="1" />

          {/* Texto Valor */}
          <text 
            x={padding - 35} 
            y={padding + viewHeight / 2} 
            textAnchor="middle" 
            transform={`rotate(-90, ${padding - 35}, ${padding + viewHeight / 2})`}
            className="text-[14px] font-mono font-bold fill-blue-700"
          >
            {altura}
          </text>
          
        </svg>
      </div>
    </div>
  );
}