
import React from 'react';

// Componente genérico para placeholder
const PlaceholderDesenho: React.FC<{ nome: string }> = ({ nome }) => (
  <div className="flex items-center justify-center w-full h-full min-h-[100px] bg-gray-100 border border-dashed border-gray-300 rounded text-gray-500 text-xs text-center p-2">
    Desenho Técnico: {nome}
  </div>
);

export const PortaAbrir1Folha = () => <PlaceholderDesenho nome="Porta Abrir 1 Folha" />;
export const PortaAbrir2Folhas = () => <PlaceholderDesenho nome="Porta Abrir 2 Folhas" />;
export const PortaAbrir4Folhas = () => <PlaceholderDesenho nome="Porta Abrir 4 Folhas" />;
export const PortaPivotante = () => <PlaceholderDesenho nome="Porta Pivotante" />;
export const PortaGiroBandeira = () => <PlaceholderDesenho nome="Porta Giro Bandeira" />;
export const PortaGiroLateral = () => <PlaceholderDesenho nome="Porta Giro Lateral" />;
export const PortaCorrer1Folha = () => <PlaceholderDesenho nome="Porta Correr 1 Folha" />;
export const PortaCorrer2Folhas = () => <PlaceholderDesenho nome="Porta Correr 2 Folhas" />;
export const PortaCorrer3Folhas = () => <PlaceholderDesenho nome="Porta Correr 3 Folhas" />;
export const PortaCorrer4Folhas = () => <PlaceholderDesenho nome="Porta Correr 4 Folhas" />;
export const PortaTelescopica = () => <PlaceholderDesenho nome="Porta Telescópica" />;
export const PortaEmbutida = () => <PlaceholderDesenho nome="Porta Embutida" />;
export const PortaRoldanasAparentes = () => <PlaceholderDesenho nome="Porta Roldanas Aparentes" />;
export const JanelaCorrer2 = () => <PlaceholderDesenho nome="Janela Correr 2 Folhas" />;
export const JanelaCorrer3 = () => <PlaceholderDesenho nome="Janela Correr 3 Folhas" />;
export const JanelaCorrer4 = () => <PlaceholderDesenho nome="Janela Correr 4 Folhas" />;
export const JanelaMaximAr = () => <PlaceholderDesenho nome="Janela Maxim-Ar" />;
export const JanelaBasculante = () => <PlaceholderDesenho nome="Janela Basculante" />;
export const JanelaFixa = () => <PlaceholderDesenho nome="Janela Fixa" />;
export const BoxPadrao2Folhas = () => <PlaceholderDesenho nome="Box Padrão 2 Folhas" />;
export const Box3Folhas = () => <PlaceholderDesenho nome="Box 3 Folhas" />;
export const Box4Folhas = () => <PlaceholderDesenho nome="Box 4 Folhas" />;
export const BoxCanto = () => <PlaceholderDesenho nome="Box Canto" />;
export const BoxTeto = () => <PlaceholderDesenho nome="Box Teto" />;
export const BoxElegance = () => <PlaceholderDesenho nome="Box Elegance" />;
export const Box3em1 = () => <PlaceholderDesenho nome="Box 3 em 1" />;
export const Fachada3Pecas = () => <PlaceholderDesenho nome="Fachada 3 Peças" />;
