import React from 'react';
import imagemJanela from 'figma:asset/740446fe5ccde61bcd5edaed7cce91e77a3147d9.png';

interface DesenhoJanelaLimpoProps {
  largura: number;
  altura: number;
  corVidro: string;
  espessuraVidro: string;
  vidrosCalculados: any[];
}

export function DesenhoJanelaLimpo({ 
  largura, 
  altura, 
  corVidro, 
  espessuraVidro, 
  vidrosCalculados 
}: DesenhoJanelaLimpoProps) {
  
  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 rounded-2xl p-8 flex items-center justify-center min-h-[600px]">
      <div className="relative w-full flex flex-col items-center max-w-4xl">
        
        {/* APENAS A IMAGEM - LIMPA */}
        <img 
          src={imagemJanela} 
          alt="Janela de Correr 2 Folhas - Linha Suprema"
          className="w-full max-w-3xl h-auto rounded-lg shadow-2xl"
        />
        
      </div>
    </div>
  );
}
