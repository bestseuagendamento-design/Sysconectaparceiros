
import React from 'react';

interface SVGProps {
  largura?: number;
  altura?: number;
  temPuxador?: boolean;
  temFechadura?: boolean;
  temDobradicaInferior?: boolean;
  temRoldanas?: boolean;
}

export const PortaCorrer2FolhasSVG: React.FC<SVGProps> = ({ largura = 200, altura }) => (
  <svg width={largura} height={altura || largura * 1.5} viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="90" height="280" stroke="black" strokeWidth="2" fill="#E0F7FA" opacity="0.5" />
    <rect x="100" y="10" width="90" height="280" stroke="black" strokeWidth="2" fill="#E0F7FA" opacity="0.5" />
    <path d="M100 10 L190 10" stroke="black" strokeWidth="2" strokeDasharray="5,5" />
    <circle cx="170" cy="150" r="5" fill="black" /> {/* Puxador */}
  </svg>
);

export const PortaGiro1FolhaSVG: React.FC<SVGProps> = ({ largura = 200, altura }) => (
  <svg width={largura} height={altura || largura * 2.5} viewBox="0 0 200 500" fill="none" xmlns="http://www.w3.org/2000/svg">
     <rect x="10" y="10" width="180" height="480" stroke="black" strokeWidth="2" fill="#E0F7FA" opacity="0.5" />
     <path d="M190 10 L10 250" stroke="black" strokeWidth="1" strokeDasharray="5,5" />
     <path d="M10 250 L190 490" stroke="black" strokeWidth="1" strokeDasharray="5,5" />
     <circle cx="170" cy="250" r="5" fill="black" /> {/* Puxador */}
  </svg>
);

export const BoxPadraoSVG: React.FC<SVGProps> = ({ largura = 200, altura }) => (
  <svg width={largura} height={altura || largura * 1.2} viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="90" height="220" stroke="black" strokeWidth="2" fill="#E0F7FA" opacity="0.5" />
    <rect x="100" y="10" width="90" height="220" stroke="black" strokeWidth="2" fill="#E0F7FA" opacity="0.5" />
    <circle cx="170" cy="120" r="5" fill="black" />
  </svg>
);

export const JanelaCorrer2FolhasSVG: React.FC<SVGProps> = ({ largura = 200, altura }) => (
  <svg width={largura} height={altura || largura * 0.8} viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="90" height="140" stroke="black" strokeWidth="2" fill="#E0F7FA" opacity="0.5" />
    <rect x="100" y="10" width="90" height="140" stroke="black" strokeWidth="2" fill="#E0F7FA" opacity="0.5" />
    <circle cx="90" cy="80" r="5" fill="black" />
    <circle cx="110" cy="80" r="5" fill="black" />
  </svg>
);
