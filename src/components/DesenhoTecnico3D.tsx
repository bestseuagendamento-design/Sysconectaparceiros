/**
 * 🎨 VISUALIZAÇÃO 3D REALÍSTICA - JANELA SUPREMA CORRER 2 FOLHAS
 * Renderização 3D isométrica com Canvas 2D nativo (SEM Three.js)
 */

import React, { useEffect, useRef } from 'react';
import { ConfiguracaoUsuario, VidroCalculado } from '../utils/calculos-industriais';
import { Tipologia } from '../data/tipologias/suprema-correr-2f';

interface DesenhoTecnico3DProps {
  config: ConfiguracaoUsuario;
  vidros: VidroCalculado[];
  tipologia: Tipologia;
}

export function DesenhoTecnico3D({ config, vidros, tipologia }: DesenhoTecnico3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensões do canvas
    const width = canvas.width;
    const height = canvas.height;

    // Controles de rotação
    let rotationX = 0.5; // Ângulo de rotação horizontal
    let rotationY = 0.3; // Ângulo de rotação vertical
    let zoom = 0.5;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    // Dimensões da janela
    const largura = config.largura_total_mm;
    const altura = config.altura_total_mm;
    const profundidade = 100;

    // Cores
    const corAluminio = tipologia.cores_hex[config.cor_aluminio];

    // Função para converter cores hex em RGB
    function hexToRgb(hex: string): { r: number; g: number; b: number } {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 128, g: 128, b: 128 };
    }

    // Projeção isométrica 3D para 2D
    function project3D(x: number, y: number, z: number): { x: number; y: number } {
      // Aplicar rotação
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);

      // Rotação em Y
      let x1 = x * cosY - z * sinY;
      let z1 = x * sinY + z * cosY;
      
      // Rotação em X
      let y1 = y * cosX - z1 * sinX;
      let z2 = y * sinX + z1 * cosX;

      // Projeção isométrica
      const scale = zoom;
      const projX = width / 2 + x1 * scale;
      const projY = height / 2 - y1 * scale;

      return { x: projX, y: projY };
    }

    // Desenhar retângulo 3D (box)
    function drawBox(
      x: number, y: number, z: number,
      w: number, h: number, d: number,
      color: string,
      alpha: number = 1
    ) {
      ctx.globalAlpha = alpha;

      // Face frontal
      const p1 = project3D(x - w/2, y - h/2, z + d/2);
      const p2 = project3D(x + w/2, y - h/2, z + d/2);
      const p3 = project3D(x + w/2, y + h/2, z + d/2);
      const p4 = project3D(x - w/2, y + h/2, z + d/2);

      ctx.fillStyle = color;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Face superior (se visível)
      if (rotationY > 0) {
        const p5 = project3D(x - w/2, y - h/2, z - d/2);
        const p6 = project3D(x + w/2, y - h/2, z - d/2);
        
        const rgb = hexToRgb(color);
        const darkerColor = `rgb(${Math.floor(rgb.r * 0.7)}, ${Math.floor(rgb.g * 0.7)}, ${Math.floor(rgb.b * 0.7)})`;
        
        ctx.fillStyle = darkerColor;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p6.x, p6.y);
        ctx.lineTo(p5.x, p5.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // Face lateral direita (se visível)
      if (rotationX > 0) {
        const p5 = project3D(x + w/2, y - h/2, z - d/2);
        const p6 = project3D(x + w/2, y + h/2, z - d/2);
        
        const rgb = hexToRgb(color);
        const darkerColor = `rgb(${Math.floor(rgb.r * 0.6)}, ${Math.floor(rgb.g * 0.6)}, ${Math.floor(rgb.b * 0.6)})`;
        
        ctx.fillStyle = darkerColor;
        ctx.beginPath();
        ctx.moveTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p6.x, p6.y);
        ctx.lineTo(p5.x, p5.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    }

    // Renderizar cena
    function render() {
      // Limpar canvas
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(0, 0, width, height);

      // Desenhar sombra no chão
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = '#000';
      const shadowSize = largura * zoom * 1.2;
      ctx.fillRect(width/2 - shadowSize/2, height - 100, shadowSize, 50);
      ctx.globalAlpha = 1;

      // MARCO EXTERNO
      const espessuraMarco = 50;
      
      // Marco superior
      drawBox(0, altura/2, 0, largura, espessuraMarco, profundidade, corAluminio);
      
      // Marco inferior
      drawBox(0, -altura/2, 0, largura, espessuraMarco, profundidade, corAluminio);
      
      // Marco lateral esquerdo
      drawBox(-largura/2, 0, 0, espessuraMarco, altura - espessuraMarco*2, profundidade, corAluminio);
      
      // Marco lateral direito
      drawBox(largura/2, 0, 0, espessuraMarco, altura - espessuraMarco*2, profundidade, corAluminio);

      // TRILHO INFERIOR
      drawBox(0, -altura/2 + espessuraMarco/2 + 10, 0, largura - espessuraMarco*2, 20, 40, corAluminio);

      // FOLHAS DE VIDRO
      const espessuraFolha = 35;
      const larguraFolha = (largura - espessuraMarco*2 - espessuraFolha) / 2;
      const alturaFolha = altura - espessuraMarco*2;

      vidros.forEach((vidro, index) => {
        // Posição X da folha
        const xFolha = index === 0 
          ? -largura/2 + espessuraMarco + larguraFolha/2 
          : -largura/2 + espessuraMarco + larguraFolha + espessuraFolha + larguraFolha/2;

        // Profundidade Z (folha da frente ou de trás)
        const zFolha = index === 0 ? 15 : -15;

        // Moldura da folha (4 perfis)
        // Perfil superior
        drawBox(xFolha, alturaFolha/2 - espessuraFolha/2, zFolha, larguraFolha, espessuraFolha, espessuraFolha, corAluminio);
        
        // Perfil inferior
        drawBox(xFolha, -alturaFolha/2 + espessuraFolha/2, zFolha, larguraFolha, espessuraFolha, espessuraFolha, corAluminio);
        
        // Perfil lateral esquerdo
        drawBox(xFolha - larguraFolha/2 + espessuraFolha/2, 0, zFolha, espessuraFolha, alturaFolha, espessuraFolha, corAluminio);
        
        // Perfil lateral direito
        drawBox(xFolha + larguraFolha/2 - espessuraFolha/2, 0, zFolha, espessuraFolha, alturaFolha, espessuraFolha, corAluminio);

        // Vidro (transparente)
        const larguraVidro = larguraFolha - espessuraFolha*2;
        const alturaVidro = alturaFolha - espessuraFolha*2;
        
        // Cor do vidro baseada no tipo
        let corVidro = 'rgba(173, 216, 230, 0.3)'; // Azul claro padrão
        if (config.tipo_vidro === 'TEMPERADO_INCOLOR') {
          corVidro = 'rgba(200, 220, 230, 0.25)';
        } else if (config.tipo_vidro === 'TEMPERADO_FUME') {
          corVidro = 'rgba(100, 100, 100, 0.4)';
        } else if (config.tipo_vidro === 'LAMINADO_INCOLOR') {
          corVidro = 'rgba(180, 200, 220, 0.3)';
        } else if (config.tipo_vidro === 'LAMINADO_VERDE') {
          corVidro = 'rgba(100, 180, 120, 0.35)';
        }
        
        drawBox(xFolha, 0, zFolha, larguraVidro, alturaVidro, 2, corVidro, 0.4);

        // Puxador (apenas em folhas móveis)
        if (vidro.tipo_folha === "MOVEL") {
          drawBox(xFolha + larguraFolha/2 - 25, 0, zFolha + 15, 10, 150, 30, '#1a1a1a');
        }

        // Roldanas
        const roldanaX1 = xFolha - larguraFolha/4;
        const roldanaX2 = xFolha + larguraFolha/4;
        const roldanaY = -alturaFolha/2 + 5;
        
        // Desenhar círculos para roldanas (simplificado)
        const roldana1 = project3D(roldanaX1, roldanaY, zFolha);
        const roldana2 = project3D(roldanaX2, roldanaY, zFolha);
        
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(roldana1.x, roldana1.y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(roldana2.x, roldana2.y, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Texto de controles
      ctx.fillStyle = '#666';
      ctx.font = '12px system-ui';
      ctx.fillText('🖱️ Arraste para rotacionar | Scroll para zoom', 10, height - 10);
    }

    // Event handlers
    function handleMouseDown(e: MouseEvent) {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    }

    function handleMouseMove(e: MouseEvent) {
      if (!isDragging) return;

      const deltaX = e.clientX - lastMouseX;
      const deltaY = e.clientY - lastMouseY;

      rotationX += deltaX * 0.005;
      rotationY += deltaY * 0.005;

      // Limitar rotação vertical
      rotationY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationY));

      lastMouseX = e.clientX;
      lastMouseY = e.clientY;

      render();
    }

    function handleMouseUp() {
      isDragging = false;
    }

    function handleWheel(e: WheelEvent) {
      e.preventDefault();
      zoom += e.deltaY * -0.0005;
      zoom = Math.max(0.2, Math.min(1.0, zoom));
      render();
    }

    // Adicionar event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel);

    // Renderizar frame inicial
    render();

    // Cleanup
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [config, vidros, tipologia]);

  // Cores do alumínio
  const corAluminio = tipologia.cores_hex[config.cor_aluminio];

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-xl p-8 border-2 border-yellow-600/30 shadow-2xl">
      {/* TÍTULO */}
      <div className="mb-6 text-center">
        <h3 className="text-yellow-400 mb-2 text-xl font-bold tracking-wide">
          🏗️ VISUALIZAÇÃO 3D ISOMÉTRICA - SUPREMA CORRER 2 FOLHAS
        </h3>
        <p className="text-sm text-gray-300">
          {config.largura_total_mm}mm × {config.altura_total_mm}mm | 
          {config.cor_aluminio.replace(/_/g, ' ')} | 
          Vidro {config.tipo_vidro} {config.espessura_vidro}mm
        </p>
        <p className="text-xs text-yellow-500/70 mt-1">
          🖱️ Clique e arraste para rotacionar | Scroll para zoom
        </p>
      </div>

      {/* CANVAS 3D */}
      <div className="w-full rounded-lg overflow-hidden border-2 border-gray-700 shadow-inner bg-gray-100">
        <canvas 
          ref={canvasRef}
          width={1200}
          height={600}
          className="w-full h-auto"
          style={{ display: 'block' }}
        />
      </div>

      {/* ESPECIFICAÇÕES TÉCNICAS */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-yellow-600/20">
          <div className="text-xs text-yellow-500/70 mb-1 uppercase tracking-wider">Alumínio</div>
          <div className="text-white font-bold">{config.cor_aluminio.replace(/_/g, ' ')}</div>
          <div className="w-full h-4 rounded mt-2 border border-yellow-600/30" style={{ backgroundColor: corAluminio }} />
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4 border border-yellow-600/20">
          <div className="text-xs text-yellow-500/70 mb-1 uppercase tracking-wider">Vidro</div>
          <div className="text-white font-bold">{config.tipo_vidro} {config.espessura_vidro}mm</div>
          <div className="text-xs text-gray-400 mt-1">
            Peso Total: {vidros.reduce((sum, v) => sum + v.peso_kg, 0).toFixed(2)} kg
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4 border border-yellow-600/20">
          <div className="text-xs text-yellow-500/70 mb-1 uppercase tracking-wider">Configuração</div>
          <div className="text-white font-bold">2 Folhas Corrediças</div>
          <div className="text-xs text-gray-400 mt-1">
            {config.configuracao_folhas.replace(/_/g, ' ')}
          </div>
        </div>
      </div>

      {/* INFORMAÇÕES ADICIONAIS */}
      <div className="mt-4 bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <div className="text-sm font-bold text-yellow-400 mb-1">Renderização 3D Isométrica Nativa</div>
            <div className="text-xs text-gray-300">
              Visualização técnica 3D com projeção isométrica usando Canvas 2D nativo. 
              Performance otimizada sem dependências externas. Arraste para rotacionar e 
              explorar todos os ângulos da janela com cores realísticas de alumínio e vidro.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
