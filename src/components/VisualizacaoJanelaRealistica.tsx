/**
 * 🪟 VISUALIZAÇÃO REALÍSTICA DA JANELA (LIMPA)
 * Mostra imagem fotorrealística da janela de correr 2 folhas
 * Com filtros CSS dinâmicos para mudar cores de alumínio e vidro
 */

import React from 'react';
import janelaReferenciaImg from 'figma:asset/8d8e6506b73a10e552a4f4fe652445c31cfd94f3.png';
import { ConfiguracaoUsuario } from '../utils/calculos-industriais';
import { SUPREMA_CORRER_2F, Tipologia } from '../data/tipologias/suprema-correr-2f';

interface VisualizacaoJanelaRealisticaProps {
  config: ConfiguracaoUsuario;
}

export function VisualizacaoJanelaRealistica({ config }: VisualizacaoJanelaRealisticaProps) {
  const tipologia = SUPREMA_CORRER_2F;
  const corAluminio = tipologia.cores_hex[config.cor_aluminio];
  
  // Função para converter HEX em RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  // Calcular filtros CSS para alumínio baseado na cor selecionada
  const getAluminioFilter = () => {
    const rgb = hexToRgb(corAluminio);
    const brightness = (rgb.r + rgb.g + rgb.b) / 3 / 255;
    
    // Detectar cor específica
    if (config.cor_aluminio === 'BRANCO') {
      return 'brightness(1.3) contrast(1.1)';
    } else if (config.cor_aluminio === 'PRETO') {
      return 'brightness(0.3) contrast(1.4) saturate(0)';
    } else if (config.cor_aluminio === 'ANODIZADO_NATURAL') {
      return 'brightness(1.1) contrast(1.05) saturate(0.8) sepia(0.1)';
    } else if (config.cor_aluminio === 'BRONZE') {
      return 'brightness(0.7) contrast(1.1) saturate(1.2) hue-rotate(20deg) sepia(0.3)';
    } else if (config.cor_aluminio === 'CHAMPAGNE') {
      return 'brightness(1.2) contrast(1) saturate(0.9) sepia(0.15) hue-rotate(30deg)';
    }
    
    return `brightness(${brightness}) contrast(1.1)`;
  };

  // Calcular filtros CSS para vidro baseado no tipo
  const getVidroFilter = () => {
    if (config.tipo_vidro === 'INCOLOR') {
      return 'opacity(0.3) brightness(1.2)';
    } else if (config.tipo_vidro === 'FUME') {
      return 'opacity(0.5) brightness(0.6) saturate(0.3)';
    } else if (config.tipo_vidro === 'VERDE') {
      return 'opacity(0.4) brightness(0.9) saturate(1.3) hue-rotate(90deg)';
    } else if (config.tipo_vidro === 'BRONZE') {
      return 'opacity(0.5) brightness(0.8) saturate(1.1) sepia(0.4) hue-rotate(20deg)';
    } else if (config.tipo_vidro === 'REFLETIVO') {
      return 'opacity(0.2) brightness(1.5) saturate(0.5) contrast(1.3)';
    }
    return 'opacity(0.3)';
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* CONTAINER IMAGEM - Auto-ajustável com limites de altura e largura */}
        <div className="relative inline-block" style={{ maxWidth: '85%', maxHeight: '85%' }}> 
          
          {/* CAMADA BASE - IMAGEM ORIGINAL */}
          {/* max-h-[40vh] garante que não ocupe mais que 40% da altura da tela no mobile */}
          <img 
            src={janelaReferenciaImg} 
            alt="Janela Suprema"
            className="block w-auto h-auto object-contain drop-shadow-xl mx-auto"
            style={{ 
              maxWidth: '100%',
              maxHeight: '40vh', // Limite de altura vital para mobile
              position: 'relative',
              zIndex: 1
            }}
          />
          
          {/* CAMADA ALUMÍNIO - COM FILTRO DE COR */}
          <img 
            src={janelaReferenciaImg} 
            alt="Camada Alumínio"
            className="absolute top-0 left-0 w-full h-full object-contain"
            style={{ 
              filter: getAluminioFilter(),
              mixBlendMode: 'multiply',
              zIndex: 2,
              pointerEvents: 'none'
            }}
          />
          
          {/* CAMADA VIDRO - COM FILTRO DE TRANSPARÊNCIA */}
          <div 
            className="absolute top-0 left-0 w-full h-full"
            style={{ 
              // Usar mask-image se necessário para recortar só o vidro, mas aqui aplicando filtro full por cima com blend
              background: `linear-gradient(135deg, ${tipologia.cores_vidro[config.tipo_vidro]}99, ${tipologia.cores_vidro[config.tipo_vidro]}66)`,
              filter: getVidroFilter(),
              mixBlendMode: 'overlay',
              zIndex: 3,
              pointerEvents: 'none',
              backdropFilter: 'blur(0.5px)'
            }}
          />
        </div>
    </div>
  );
}