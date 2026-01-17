/**
 * ✂️ DESENHO TÉCNICO - CORTES TÉCNICOS (SUPERIOR + PERFIL)
 * Mostra vista superior (planta) e vista lateral (perfil) com detalhes técnicos
 */

import React from 'react';
import { ConfiguracaoUsuario } from '../utils/calculos-industriais';
import { Tipologia } from '../data/tipologias/suprema-correr-2f';

interface DesenhoTecnicoCorteProps {
  config: ConfiguracaoUsuario;
  tipologia: Tipologia;
}

export function DesenhoTecnicoCorte({ config, tipologia }: DesenhoTecnicoCorteProps) {
  const corAluminio = tipologia.cores_hex[config.cor_aluminio];
  const corVidro = tipologia.cores_vidro[config.tipo_vidro];

  // Dimensões reais dos perfis (mm)
  const PERFIL_SUPERIOR_ALTURA = 50;
  const PERFIL_INFERIOR_ALTURA = 60;
  const PERFIL_LATERAL_LARGURA = 50;
  const PERFIL_FOLHA_ESPESSURA = 30;
  const VIDRO_ESPESSURA = parseInt(config.espessura_vidro.toString().replace('+', ''));
  const ALTURA_TOTAL = config.altura_total_mm;
  const LARGURA_TOTAL = config.largura_total_mm;

  // Escala para visualização
  const scale = 0.25;

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-8 border-2 border-yellow-600/30 shadow-2xl">
      <div className="mb-6 text-center">
        <h3 className="text-yellow-400 mb-2 text-xl font-bold tracking-wide">
          📐 CORTES TÉCNICOS - VISTAS SUPERIORES E DE PERFIL
        </h3>
        <p className="text-sm text-gray-300">
          Detalhamento técnico completo com trilhos, perfis e dimensões normativas
        </p>
      </div>

      {/* GRID DE CORTES */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* ============ VISTA SUPERIOR (PLANTA) ============ */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-300">
          <div className="mb-4">
            <h4 className="text-gray-900 text-lg font-bold mb-1">🔵 CORTE HORIZONTAL - VISTA SUPERIOR (PLANTA)</h4>
            <p className="text-sm text-gray-600">
              Mostra trilhos duplos, sobreposição das folhas e sistema de drenagem
            </p>
          </div>

          <svg width="100%" height="450" viewBox="0 0 900 450" className="mx-auto bg-gray-50 rounded-lg border border-gray-300">
            {/* TÍTULO */}
            <text x="450" y="30" textAnchor="middle" className="fill-gray-900" fontSize="14" fontWeight="bold">
              CORTE A-A (HORIZONTAL) - PERFIL INFERIOR COM TRILHO DUPLO
            </text>

            {/* LINHA DE CORTE */}
            <line x1="50" y1="45" x2="850" y2="45" stroke="#dc2626" strokeWidth="2" strokeDasharray="8,4" />
            <text x="860" y="50" className="fill-red-600" fontSize="10" fontWeight="bold">CORTE A-A</text>

            {/* GRUPO - DESENHO DO PERFIL INFERIOR */}
            <g transform="translate(250, 80)">
              {/* 1️⃣ PERFIL INFERIOR (TRILHO DUPLO) */}
              <g>
                {/* Base do trilho */}
                <rect
                  x="0"
                  y="0"
                  width="180"
                  height="25"
                  fill={corAluminio}
                  stroke="#000"
                  strokeWidth="2.5"
                />

                {/* Parede esquerda */}
                <rect
                  x="0"
                  y="0"
                  width="15"
                  height="100"
                  fill={corAluminio}
                  stroke="#000"
                  strokeWidth="2"
                />

                {/* Trilho 1 (folha traseira) */}
                <rect
                  x="15"
                  y="15"
                  width="70"
                  height="20"
                  fill="#64748b"
                  stroke="#475569"
                  strokeWidth="1.5"
                />
                <text x="50" y="30" textAnchor="middle" className="fill-white" fontSize="9" fontWeight="bold">
                  TRILHO 1
                </text>

                {/* Divisor central */}
                <rect
                  x="85"
                  y="0"
                  width="10"
                  height="100"
                  fill={corAluminio}
                  stroke="#000"
                  strokeWidth="2"
                />

                {/* Trilho 2 (folha frontal) */}
                <rect
                  x="95"
                  y="15"
                  width="70"
                  height="20"
                  fill="#64748b"
                  stroke="#475569"
                  strokeWidth="1.5"
                />
                <text x="130" y="30" textAnchor="middle" className="fill-white" fontSize="9" fontWeight="bold">
                  TRILHO 2
                </text>

                {/* Parede direita */}
                <rect
                  x="165"
                  y="0"
                  width="15"
                  height="100"
                  fill={corAluminio}
                  stroke="#000"
                  strokeWidth="2"
                />

                {/* Furos de drenagem */}
                <circle cx="30" cy="110" r="10" fill="none" stroke="#dc2626" strokeWidth="2" strokeDasharray="2,2" />
                <text x="30" y="130" textAnchor="middle" className="fill-red-600" fontSize="8" fontWeight="bold">Ø8mm</text>
                <text x="30" y="142" textAnchor="middle" className="fill-red-600" fontSize="7">DRENO</text>
              </g>

              {/* 2️⃣ FOLHA 1 (TRASEIRA) */}
              <g transform="translate(25, -100)">
                {/* Perfil esquerdo */}
                <rect
                  x="0"
                  y="0"
                  width="30"
                  height="20"
                  fill={corAluminio}
                  stroke="#000"
                  strokeWidth="2"
                  opacity="0.9"
                />
                
                {/* Vidro */}
                <rect
                  x="30"
                  y="0"
                  width={VIDRO_ESPESSURA * 2}
                  height="20"
                  fill={corVidro}
                  stroke="#0369a1"
                  strokeWidth="1.5"
                />

                {/* Perfil direito */}
                <rect
                  x={30 + VIDRO_ESPESSURA * 2}
                  y="0"
                  width="30"
                  height="20"
                  fill={corAluminio}
                  stroke="#000"
                  strokeWidth="2"
                  opacity="0.9"
                />

                {/* Roldana */}
                <circle
                  cx="45"
                  cy="35"
                  r="8"
                  fill="#dc2626"
                  stroke="#991b1b"
                  strokeWidth="2"
                />
                <text x="45" y="55" textAnchor="middle" className="fill-red-900" fontSize="7" fontWeight="bold">
                  ROLDANA
                </text>

                <text x="-15" y="12" className="fill-gray-900" fontSize="10" fontWeight="bold">FOLHA 1</text>
              </g>

              {/* 3️⃣ FOLHA 2 (FRONTAL) */}
              <g transform="translate(105, -140)">
                {/* Perfil esquerdo */}
                <rect
                  x="0"
                  y="0"
                  width="30"
                  height="20"
                  fill={corAluminio}
                  stroke="#000"
                  strokeWidth="2"
                  opacity="0.95"
                />
                
                {/* Vidro */}
                <rect
                  x="30"
                  y="0"
                  width={VIDRO_ESPESSURA * 2}
                  height="20"
                  fill={corVidro}
                  stroke="#0369a1"
                  strokeWidth="1.5"
                />

                {/* Perfil direito */}
                <rect
                  x={30 + VIDRO_ESPESSURA * 2}
                  y="0"
                  width="30"
                  height="20"
                  fill={corAluminio}
                  stroke="#000"
                  strokeWidth="2"
                  opacity="0.95"
                />

                {/* Roldana */}
                <circle
                  cx="45"
                  cy="35"
                  r="8"
                  fill="#dc2626"
                  stroke="#991b1b"
                  strokeWidth="2"
                />
                <text x="45" y="55" textAnchor="middle" className="fill-red-900" fontSize="7" fontWeight="bold">
                  ROLDANA
                </text>

                <text x="-15" y="12" className="fill-gray-900" fontSize="10" fontWeight="bold">FOLHA 2</text>
              </g>

              {/* COTAS */}
              <g>
                <line
                  x1="0"
                  y1="120"
                  x2="180"
                  y2="120"
                  stroke="#000"
                  strokeWidth="1.5"
                  markerStart="url(#arrow-corte)"
                  markerEnd="url(#arrow-corte)"
                />
                <text x="90" y="138" textAnchor="middle" className="fill-gray-900" fontSize="11" fontWeight="bold">
                  60 mm (Largura do Perfil Inferior)
                </text>
              </g>

              {/* Cota vidro */}
              <g transform="translate(25, -100)">
                <line
                  x1="30"
                  y1="-12"
                  x2={30 + VIDRO_ESPESSURA * 2}
                  y2="-12"
                  stroke="#0369a1"
                  strokeWidth="1.5"
                  markerStart="url(#arrow-vidro)"
                  markerEnd="url(#arrow-vidro)"
                />
                <text
                  x={30 + (VIDRO_ESPESSURA)}
                  y="-18"
                  textAnchor="middle"
                  className="fill-blue-900"
                  fontSize="9"
                  fontWeight="bold"
                >
                  Vidro {VIDRO_ESPESSURA}mm
                </text>
              </g>
            </g>

            {/* LEGENDA */}
            <g>
              <rect x="50" y="340" width="800" height="90" fill="white" stroke="#cbd5e1" strokeWidth="2" rx="8" />
              
              <text x="70" y="365" className="fill-gray-900" fontSize="12" fontWeight="bold">
                📋 ESPECIFICAÇÕES TÉCNICAS - VISTA SUPERIOR:
              </text>

              <text x="70" y="382" className="fill-gray-700" fontSize="9">
                • Perfil inferior com trilho duplo independente (60mm de largura total)
              </text>
              
              <text x="70" y="397" className="fill-gray-700" fontSize="9">
                • Sistema de drenagem: Furos Ø8mm a cada 400mm (lado externo)
              </text>

              <text x="70" y="412" className="fill-gray-700" fontSize="9">
                • Folhas corrediças independentes com roldanas automáticas | Vidro: {config.tipo_vidro} {config.espessura_vidro}mm
              </text>
            </g>

            <defs>
              <marker id="arrow-corte" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                <polygon points="0 0, 10 5, 0 10" fill="#000" />
              </marker>
              <marker id="arrow-vidro" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <polygon points="0 0, 8 4, 0 8" fill="#0369a1" />
              </marker>
            </defs>
          </svg>
        </div>

        {/* ============ VISTA DE PERFIL (LATERAL) ============ */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-300">
          <div className="mb-4">
            <h4 className="text-gray-900 text-lg font-bold mb-1">🔴 CORTE VERTICAL - VISTA DE PERFIL (LATERAL)</h4>
            <p className="text-sm text-gray-600">
              Mostra estrutura completa da altura, perfis superior/inferior e lateral
            </p>
          </div>

          <svg width="100%" height="600" viewBox="0 0 900 600" className="mx-auto bg-gray-50 rounded-lg border border-gray-300">
            {/* TÍTULO */}
            <text x="450" y="30" textAnchor="middle" className="fill-gray-900" fontSize="14" fontWeight="bold">
              CORTE B-B (VERTICAL) - VISTA LATERAL COMPLETA
            </text>

            {/* LINHA DE CORTE */}
            <line x1="50" y1="45" x2="850" y2="45" stroke="#dc2626" strokeWidth="2" strokeDasharray="8,4" />
            <text x="860" y="50" className="fill-red-600" fontSize="10" fontWeight="bold">CORTE B-B</text>

            {/* DESENHO DA JANELA - VISTA LATERAL */}
            <g transform="translate(300, 80)">
              
              {/* PERFIL SUPERIOR */}
              <rect
                x="0"
                y="0"
                width={LARGURA_TOTAL * scale}
                height={PERFIL_SUPERIOR_ALTURA * scale}
                fill={corAluminio}
                stroke="#000"
                strokeWidth="2.5"
              />
              <text 
                x={LARGURA_TOTAL * scale / 2} 
                y={PERFIL_SUPERIOR_ALTURA * scale / 2 + 3} 
                textAnchor="middle" 
                className="fill-white" 
                fontSize="9" 
                fontWeight="bold"
              >
                PERFIL SUPERIOR
              </text>

              {/* PERFIL LATERAL ESQUERDO */}
              <rect
                x="0"
                y={PERFIL_SUPERIOR_ALTURA * scale}
                width={PERFIL_LATERAL_LARGURA * scale}
                height={(ALTURA_TOTAL - PERFIL_SUPERIOR_ALTURA - PERFIL_INFERIOR_ALTURA) * scale}
                fill={corAluminio}
                stroke="#000"
                strokeWidth="2.5"
              />

              {/* PERFIL LATERAL DIREITO */}
              <rect
                x={(LARGURA_TOTAL - PERFIL_LATERAL_LARGURA) * scale}
                y={PERFIL_SUPERIOR_ALTURA * scale}
                width={PERFIL_LATERAL_LARGURA * scale}
                height={(ALTURA_TOTAL - PERFIL_SUPERIOR_ALTURA - PERFIL_INFERIOR_ALTURA) * scale}
                fill={corAluminio}
                stroke="#000"
                strokeWidth="2.5"
              />

              {/* ÁREA DO VIDRO (2 FOLHAS) */}
              <g>
                {/* Folha 1 (Esquerda) */}
                <rect
                  x={PERFIL_LATERAL_LARGURA * scale}
                  y={PERFIL_SUPERIOR_ALTURA * scale}
                  width={(LARGURA_TOTAL / 2 - PERFIL_LATERAL_LARGURA - PERFIL_FOLHA_ESPESSURA / 2) * scale}
                  height={(ALTURA_TOTAL - PERFIL_SUPERIOR_ALTURA - PERFIL_INFERIOR_ALTURA) * scale}
                  fill={corVidro}
                  stroke="#0369a1"
                  strokeWidth="2"
                  opacity="0.4"
                />
                <text 
                  x={(PERFIL_LATERAL_LARGURA + (LARGURA_TOTAL / 2 - PERFIL_LATERAL_LARGURA - PERFIL_FOLHA_ESPESSURA / 2) / 2) * scale} 
                  y={(PERFIL_SUPERIOR_ALTURA + (ALTURA_TOTAL - PERFIL_SUPERIOR_ALTURA - PERFIL_INFERIOR_ALTURA) / 2) * scale} 
                  textAnchor="middle" 
                  className="fill-blue-900" 
                  fontSize="10" 
                  fontWeight="bold"
                >
                  VIDRO
                </text>
                <text 
                  x={(PERFIL_LATERAL_LARGURA + (LARGURA_TOTAL / 2 - PERFIL_LATERAL_LARGURA - PERFIL_FOLHA_ESPESSURA / 2) / 2) * scale} 
                  y={(PERFIL_SUPERIOR_ALTURA + (ALTURA_TOTAL - PERFIL_SUPERIOR_ALTURA - PERFIL_INFERIOR_ALTURA) / 2 + 15) * scale} 
                  textAnchor="middle" 
                  className="fill-blue-900" 
                  fontSize="9" 
                >
                  FOLHA 1
                </text>

                {/* Divisor central (perfil intermediário) */}
                <rect
                  x={(LARGURA_TOTAL / 2 - PERFIL_FOLHA_ESPESSURA / 2) * scale}
                  y={PERFIL_SUPERIOR_ALTURA * scale}
                  width={PERFIL_FOLHA_ESPESSURA * scale}
                  height={(ALTURA_TOTAL - PERFIL_SUPERIOR_ALTURA - PERFIL_INFERIOR_ALTURA) * scale}
                  fill={corAluminio}
                  stroke="#000"
                  strokeWidth="2"
                />

                {/* Folha 2 (Direita) */}
                <rect
                  x={(LARGURA_TOTAL / 2 + PERFIL_FOLHA_ESPESSURA / 2) * scale}
                  y={PERFIL_SUPERIOR_ALTURA * scale}
                  width={(LARGURA_TOTAL / 2 - PERFIL_LATERAL_LARGURA - PERFIL_FOLHA_ESPESSURA / 2) * scale}
                  height={(ALTURA_TOTAL - PERFIL_SUPERIOR_ALTURA - PERFIL_INFERIOR_ALTURA) * scale}
                  fill={corVidro}
                  stroke="#0369a1"
                  strokeWidth="2"
                  opacity="0.4"
                />
                <text 
                  x={((LARGURA_TOTAL / 2 + PERFIL_FOLHA_ESPESSURA / 2) + (LARGURA_TOTAL / 2 - PERFIL_LATERAL_LARGURA - PERFIL_FOLHA_ESPESSURA / 2) / 2) * scale} 
                  y={(PERFIL_SUPERIOR_ALTURA + (ALTURA_TOTAL - PERFIL_SUPERIOR_ALTURA - PERFIL_INFERIOR_ALTURA) / 2) * scale} 
                  textAnchor="middle" 
                  className="fill-blue-900" 
                  fontSize="10" 
                  fontWeight="bold"
                >
                  VIDRO
                </text>
                <text 
                  x={((LARGURA_TOTAL / 2 + PERFIL_FOLHA_ESPESSURA / 2) + (LARGURA_TOTAL / 2 - PERFIL_LATERAL_LARGURA - PERFIL_FOLHA_ESPESSURA / 2) / 2) * scale} 
                  y={(PERFIL_SUPERIOR_ALTURA + (ALTURA_TOTAL - PERFIL_SUPERIOR_ALTURA - PERFIL_INFERIOR_ALTURA) / 2 + 15) * scale} 
                  textAnchor="middle" 
                  className="fill-blue-900" 
                  fontSize="9" 
                >
                  FOLHA 2
                </text>
              </g>

              {/* PERFIL INFERIOR (COM TRILHO) */}
              <rect
                x="0"
                y={(ALTURA_TOTAL - PERFIL_INFERIOR_ALTURA) * scale}
                width={LARGURA_TOTAL * scale}
                height={PERFIL_INFERIOR_ALTURA * scale}
                fill={corAluminio}
                stroke="#000"
                strokeWidth="2.5"
              />
              <text 
                x={LARGURA_TOTAL * scale / 2} 
                y={(ALTURA_TOTAL - PERFIL_INFERIOR_ALTURA / 2) * scale + 3} 
                textAnchor="middle" 
                className="fill-white" 
                fontSize="9" 
                fontWeight="bold"
              >
                PERFIL INFERIOR (TRILHO)
              </text>

              {/* Trilhos internos (indicação) */}
              <rect
                x={PERFIL_LATERAL_LARGURA * scale}
                y={(ALTURA_TOTAL - PERFIL_INFERIOR_ALTURA + 10) * scale}
                width={(LARGURA_TOTAL - PERFIL_LATERAL_LARGURA * 2) * scale / 2 - 5}
                height="5"
                fill="#475569"
              />
              <rect
                x={(LARGURA_TOTAL / 2 + 5) * scale}
                y={(ALTURA_TOTAL - PERFIL_INFERIOR_ALTURA + 10) * scale}
                width={(LARGURA_TOTAL - PERFIL_LATERAL_LARGURA * 2) * scale / 2 - 5}
                height="5"
                fill="#475569"
              />

              {/* COTAS DIMENSIONAIS */}
              
              {/* Cota altura total */}
              <g>
                <line
                  x1={LARGURA_TOTAL * scale + 30}
                  y1="0"
                  x2={LARGURA_TOTAL * scale + 30}
                  y2={ALTURA_TOTAL * scale}
                  stroke="#000"
                  strokeWidth="1.5"
                  markerStart="url(#arrow-perfil)"
                  markerEnd="url(#arrow-perfil)"
                />
                <text
                  x={LARGURA_TOTAL * scale + 50}
                  y={ALTURA_TOTAL * scale / 2 + 5}
                  textAnchor="middle"
                  className="fill-gray-900"
                  fontSize="11"
                  fontWeight="bold"
                  transform={`rotate(90, ${LARGURA_TOTAL * scale + 50}, ${ALTURA_TOTAL * scale / 2})`}
                >
                  ALTURA TOTAL: {ALTURA_TOTAL} mm
                </text>
              </g>

              {/* Cota largura total */}
              <g>
                <line
                  x1="0"
                  y1={ALTURA_TOTAL * scale + 30}
                  x2={LARGURA_TOTAL * scale}
                  y2={ALTURA_TOTAL * scale + 30}
                  stroke="#000"
                  strokeWidth="1.5"
                  markerStart="url(#arrow-perfil)"
                  markerEnd="url(#arrow-perfil)"
                />
                <text
                  x={LARGURA_TOTAL * scale / 2}
                  y={ALTURA_TOTAL * scale + 48}
                  textAnchor="middle"
                  className="fill-gray-900"
                  fontSize="11"
                  fontWeight="bold"
                >
                  LARGURA TOTAL: {LARGURA_TOTAL} mm
                </text>
              </g>

              {/* Cota perfil superior */}
              <g>
                <line
                  x1="-30"
                  y1="0"
                  x2="-30"
                  y2={PERFIL_SUPERIOR_ALTURA * scale}
                  stroke="#dc2626"
                  strokeWidth="1.5"
                  markerStart="url(#arrow-red)"
                  markerEnd="url(#arrow-red)"
                />
                <text
                  x="-40"
                  y={PERFIL_SUPERIOR_ALTURA * scale / 2 + 3}
                  textAnchor="end"
                  className="fill-red-600"
                  fontSize="9"
                  fontWeight="bold"
                >
                  {PERFIL_SUPERIOR_ALTURA}mm
                </text>
              </g>

              {/* Cota perfil inferior */}
              <g>
                <line
                  x1="-30"
                  y1={(ALTURA_TOTAL - PERFIL_INFERIOR_ALTURA) * scale}
                  x2="-30"
                  y2={ALTURA_TOTAL * scale}
                  stroke="#dc2626"
                  strokeWidth="1.5"
                  markerStart="url(#arrow-red)"
                  markerEnd="url(#arrow-red)"
                />
                <text
                  x="-40"
                  y={(ALTURA_TOTAL - PERFIL_INFERIOR_ALTURA / 2) * scale + 3}
                  textAnchor="end"
                  className="fill-red-600"
                  fontSize="9"
                  fontWeight="bold"
                >
                  {PERFIL_INFERIOR_ALTURA}mm
                </text>
              </g>

            </g>

            {/* LEGENDA */}
            <g>
              <rect x="50" y="490" width="800" height="90" fill="white" stroke="#cbd5e1" strokeWidth="2" rx="8" />
              
              <text x="70" y="515" className="fill-gray-900" fontSize="12" fontWeight="bold">
                📋 ESPECIFICAÇÕES TÉCNICAS - VISTA DE PERFIL:
              </text>

              <text x="70" y="532" className="fill-gray-700" fontSize="9">
                • Perfil superior: {PERFIL_SUPERIOR_ALTURA}mm | Perfil inferior (trilho): {PERFIL_INFERIOR_ALTURA}mm | Perfis laterais: {PERFIL_LATERAL_LARGURA}mm
              </text>
              
              <text x="70" y="547" className="fill-gray-700" fontSize="9">
                • Área envidraçada: {LARGURA_TOTAL - PERFIL_LATERAL_LARGURA * 2}mm × {ALTURA_TOTAL - PERFIL_SUPERIOR_ALTURA - PERFIL_INFERIOR_ALTURA}mm
              </text>

              <text x="70" y="562" className="fill-gray-700" fontSize="9">
                • Sistema de 2 folhas corrediças independentes | Cor: {config.cor_aluminio.replace(/_/g, ' ')}
              </text>
            </g>

            <defs>
              <marker id="arrow-perfil" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                <polygon points="0 0, 10 5, 0 10" fill="#000" />
              </marker>
              <marker id="arrow-red" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <polygon points="0 0, 8 4, 0 8" fill="#dc2626" />
              </marker>
            </defs>
          </svg>
        </div>

      </div>
    </div>
  );
}