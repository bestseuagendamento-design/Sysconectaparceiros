// Estrutura completa de linhas de produtos do SysConecta

export interface ProductVariation {
  id: string;
  name: string;
  folhas?: number;
  hasBandeira?: boolean;
  modules?: number;
}

export interface ProductType {
  id: string;
  name: string;
  category: 'porta' | 'janela' | 'outro' | 'box' | 'fachada' | 'cobertura' | 'portao';
  variations: ProductVariation[];
  defaultView?: '2d' | '3d';
}

export interface ProductLine {
  id: string;
  name: string;
  description: string;
  tipos: ProductType[];
  color: string; // cor de destaque da linha
}

export const PRODUCT_LINES: ProductLine[] = [
  {
    id: 'linha-0',
    name: 'LINHA 0',
    description: 'Sistema Básico (Vidro sem Esquadria)',
    color: '#3B82F6',
    tipos: [
      {
        id: 'porta-fixa',
        name: 'Porta de vidro fixa',
        category: 'porta',
        variations: [
          { id: 'fixa-1f', name: '1 folha', folhas: 1 },
          { id: 'fixa-2f', name: '2 folhas', folhas: 2 },
          { id: 'fixa-bandeira', name: 'Com bandeira fixa', folhas: 1, hasBandeira: true },
          { id: 'fixa-sem-bandeira', name: 'Sem bandeira', folhas: 1, hasBandeira: false },
        ]
      },
      {
        id: 'porta-abrir',
        name: 'Porta de vidro de abrir',
        category: 'porta',
        variations: [
          { id: 'abrir-1f', name: '1 folha', folhas: 1 },
          { id: 'abrir-2f', name: '2 folhas', folhas: 2 },
          { id: 'abrir-bandeira', name: 'Com bandeira fixa', folhas: 1, hasBandeira: true },
        ]
      },
      {
        id: 'porta-giro',
        name: 'Porta de vidro de giro (pivotante)',
        category: 'porta',
        variations: [
          { id: 'giro-1f', name: '1 folha', folhas: 1 },
          { id: 'giro-2f', name: '2 folhas', folhas: 2 },
        ]
      },
      {
        id: 'janela-fixa',
        name: 'Janela fixa de vidro',
        category: 'janela',
        variations: [
          { id: 'janela-1mod', name: '1 módulo', modules: 1 },
          { id: 'janela-multi', name: 'Múltiplos módulos', modules: 4 },
        ]
      },
      {
        id: 'divisoria',
        name: 'Divisória de vidro',
        category: 'outro',
        variations: [
          { id: 'div-fixa', name: 'Fixa', modules: 1 },
          { id: 'div-modular', name: 'Modular', modules: 3 },
        ]
      },
      {
        id: 'painel-fixo',
        name: 'Painel fixo de vidro',
        category: 'outro',
        variations: [
          { id: 'painel-simples', name: 'Simples', modules: 1 },
          { id: 'painel-duplo', name: 'Duplo', modules: 2 },
        ]
      },
    ]
  },
  {
    id: 'linha-20',
    name: 'LINHA 20',
    description: 'Linha Leve',
    color: '#10B981',
    tipos: [
      {
        id: 'porta-correr-20',
        name: 'Porta de correr',
        category: 'porta',
        variations: [
          { id: 'correr20-2f', name: '2 folhas', folhas: 2 },
          { id: 'correr20-3f', name: '3 folhas', folhas: 3 },
          { id: 'correr20-4f', name: '4 folhas', folhas: 4 },
        ]
      },
      {
        id: 'porta-abrir-20',
        name: 'Porta de abrir',
        category: 'porta',
        variations: [
          { id: 'abrir20-1f', name: '1 folha', folhas: 1 },
          { id: 'abrir20-2f', name: '2 folhas', folhas: 2 },
        ]
      },
      {
        id: 'janela-correr-20',
        name: 'Janela de correr',
        category: 'janela',
        variations: [
          { id: 'jcorrer20-2f', name: '2 folhas', folhas: 2 },
          { id: 'jcorrer20-3f', name: '3 folhas', folhas: 3 },
          { id: 'jcorrer20-4f', name: '4 folhas', folhas: 4 },
        ]
      },
      {
        id: 'janela-maximar-20',
        name: 'Janela maxim-ar',
        category: 'janela',
        variations: [
          { id: 'maximar20-1f', name: '1 folha', folhas: 1 },
          { id: 'maximar20-2f', name: '2 folhas', folhas: 2 },
        ]
      },
      {
        id: 'janela-basculante-20',
        name: 'Janela basculante',
        category: 'janela',
        variations: [
          { id: 'basculante20-1f', name: '1 folha', folhas: 1 },
        ]
      },
    ]
  },
  {
    id: 'linha-25',
    name: 'LINHA 25',
    description: 'Linha Clássica',
    color: '#F59E0B',
    tipos: [
      {
        id: 'porta-correr-25',
        name: 'Porta de correr',
        category: 'porta',
        variations: [
          { id: 'correr25-2f', name: '2 folhas', folhas: 2 },
          { id: 'correr25-3f', name: '3 folhas', folhas: 3 },
          { id: 'correr25-4f', name: '4 folhas', folhas: 4 },
        ]
      },
      {
        id: 'porta-abrir-25',
        name: 'Porta de abrir',
        category: 'porta',
        variations: [
          { id: 'abrir25-1f', name: '1 folha', folhas: 1 },
          { id: 'abrir25-2f', name: '2 folhas', folhas: 2 },
        ]
      },
      {
        id: 'porta-giro-25',
        name: 'Porta de giro',
        category: 'porta',
        variations: [
          { id: 'giro25-1f', name: '1 folha', folhas: 1 },
        ]
      },
      {
        id: 'janela-correr-25',
        name: 'Janela de correr',
        category: 'janela',
        variations: [
          { id: 'jcorrer25-2f', name: '2 folhas', folhas: 2 },
          { id: 'jcorrer25-3f', name: '3 folhas', folhas: 3 },
          { id: 'jcorrer25-4f', name: '4 folhas', folhas: 4 },
        ]
      },
      {
        id: 'janela-abrir-25',
        name: 'Janela de abrir',
        category: 'janela',
        variations: [
          { id: 'jabrir25-1f', name: '1 folha', folhas: 1 },
          { id: 'jabrir25-2f', name: '2 folhas', folhas: 2 },
        ]
      },
      {
        id: 'janela-basculante-25',
        name: 'Janela basculante',
        category: 'janela',
        variations: [
          { id: 'basculante25-1f', name: '1 folha', folhas: 1 },
        ]
      },
      {
        id: 'janela-maximar-25',
        name: 'Janela maxim-ar',
        category: 'janela',
        variations: [
          { id: 'maximar25-1f', name: '1 folha', folhas: 1 },
          { id: 'maximar25-2f', name: '2 folhas', folhas: 2 },
        ]
      },
    ]
  },
  {
    id: 'linha-30',
    name: 'LINHA 30',
    description: 'Linha Reforçada',
    color: '#8B5CF6',
    tipos: [
      {
        id: 'porta-correr-30',
        name: 'Porta de correr',
        category: 'porta',
        variations: [
          { id: 'correr30-2f', name: '2 folhas', folhas: 2 },
          { id: 'correr30-4f', name: '4 folhas', folhas: 4 },
        ]
      },
      {
        id: 'porta-abrir-30',
        name: 'Porta de abrir',
        category: 'porta',
        variations: [
          { id: 'abrir30-1f', name: '1 folha', folhas: 1 },
          { id: 'abrir30-2f', name: '2 folhas', folhas: 2 },
        ]
      },
      {
        id: 'porta-balcao-30',
        name: 'Porta balcão',
        category: 'porta',
        variations: [
          { id: 'balcao30-2f', name: '2 folhas', folhas: 2 },
          { id: 'balcao30-4f', name: '4 folhas', folhas: 4 },
        ]
      },
      {
        id: 'janela-correr-30',
        name: 'Janela de correr',
        category: 'janela',
        variations: [
          { id: 'jcorrer30-2f', name: '2 folhas', folhas: 2 },
          { id: 'jcorrer30-3f', name: '3 folhas', folhas: 3 },
          { id: 'jcorrer30-4f', name: '4 folhas', folhas: 4 },
        ]
      },
      {
        id: 'janela-maximar-30',
        name: 'Janela maxim-ar',
        category: 'janela',
        variations: [
          { id: 'maximar30-1f', name: '1 folha', folhas: 1 },
        ]
      },
      {
        id: 'janela-fixa-30',
        name: 'Janela fixa',
        category: 'janela',
        variations: [
          { id: 'fixa30-1f', name: '1 módulo', modules: 1 },
        ]
      },
    ]
  },
  {
    id: 'linha-42',
    name: 'LINHA 42',
    description: 'Linha Pesada',
    color: '#EF4444',
    tipos: [
      {
        id: 'porta-correr-pesada',
        name: 'Porta de correr pesada',
        category: 'porta',
        variations: [
          { id: 'correr42-2f', name: '2 folhas', folhas: 2 },
          { id: 'correr42-4f', name: '4 folhas', folhas: 4 },
        ]
      },
      {
        id: 'porta-abrir-dupla',
        name: 'Porta de abrir dupla',
        category: 'porta',
        variations: [
          { id: 'abrirdupla42-2f', name: '2 folhas', folhas: 2 },
        ]
      },
      {
        id: 'janela-fixa-42',
        name: 'Janela fixa',
        category: 'janela',
        variations: [
          { id: 'fixa42-1f', name: '1 módulo', modules: 1 },
        ]
      },
      {
        id: 'janela-correr-pesada',
        name: 'Janela de correr pesada',
        category: 'janela',
        variations: [
          { id: 'jcorrer42-2f', name: '2 folhas', folhas: 2 },
          { id: 'jcorrer42-4f', name: '4 folhas', folhas: 4 },
        ]
      },
    ]
  },
  {
    id: 'linha-suprema',
    name: 'LINHA SUPREMA',
    description: 'Padrão Brasil',
    color: '#14B8A6',
    tipos: [
      {
        id: 'porta-correr-suprema',
        name: 'Porta de correr',
        category: 'porta',
        variations: [
          { id: 'corrersuprema-2f', name: '2 folhas', folhas: 2 },
          { id: 'corrersuprema-3f', name: '3 folhas', folhas: 3 },
          { id: 'corrersuprema-4f', name: '4 folhas', folhas: 4 },
          { id: 'corrersuprema-6f', name: '6 folhas', folhas: 6 },
        ]
      },
      {
        id: 'porta-abrir-suprema',
        name: 'Porta de abrir',
        category: 'porta',
        variations: [
          { id: 'abrirsuprema-1f', name: '1 folha', folhas: 1 },
          { id: 'abrirsuprema-2f', name: '2 folhas', folhas: 2 },
        ]
      },
      {
        id: 'porta-balcao-suprema',
        name: 'Porta balcão',
        category: 'porta',
        variations: [
          { id: 'balcaosuprema-2f', name: '2 folhas', folhas: 2 },
          { id: 'balcaosuprema-4f', name: '4 folhas', folhas: 4 },
        ]
      },
      {
        id: 'janela-correr-suprema',
        name: 'Janela de correr',
        category: 'janela',
        variations: [
          { id: 'jcorrersuprema-2f', name: '2 folhas', folhas: 2 },
          { id: 'jcorrersuprema-3f', name: '3 folhas', folhas: 3 },
          { id: 'jcorrersuprema-4f', name: '4 folhas', folhas: 4 },
        ]
      },
      {
        id: 'janela-maximar-suprema',
        name: 'Janela maxim-ar',
        category: 'janela',
        variations: [
          { id: 'maximarsuprema-1f', name: '1 folha', folhas: 1 },
        ]
      },
      {
        id: 'janela-abrir-suprema',
        name: 'Janela de abrir',
        category: 'janela',
        variations: [
          { id: 'jabrirsuprema-1f', name: '1 folha', folhas: 1 },
          { id: 'jabrirsuprema-2f', name: '2 folhas', folhas: 2 },
        ]
      },
      {
        id: 'janela-fixa-suprema',
        name: 'Janela fixa',
        category: 'janela',
        variations: [
          { id: 'fixasuprema-1f', name: '1 módulo', modules: 1 },
        ]
      },
    ]
  },
  {
    id: 'linha-minimalista',
    name: 'LINHA MINIMALISTA',
    description: 'Linha Slim',
    color: '#6366F1',
    tipos: [
      {
        id: 'porta-correr-slim',
        name: 'Porta de correr slim',
        category: 'porta',
        variations: [
          { id: 'correrslim-2f', name: '2 folhas', folhas: 2 },
          { id: 'correrslim-3f', name: '3 folhas', folhas: 3 },
          { id: 'correrslim-4f', name: '4 folhas', folhas: 4 },
        ]
      },
      {
        id: 'porta-pivotante',
        name: 'Porta pivotante',
        category: 'porta',
        variations: [
          { id: 'pivotante-1f', name: '1 folha', folhas: 1 },
        ]
      },
      {
        id: 'janela-fixa-slim',
        name: 'Janela fixa slim',
        category: 'janela',
        variations: [
          { id: 'fixaslim-1f', name: '1 módulo', modules: 1 },
        ]
      },
    ]
  },
  {
    id: 'linha-elevavel',
    name: 'LINHA ELEVÁVEL',
    description: 'Alto Padrão',
    color: '#EC4899',
    tipos: [
      {
        id: 'porta-elevavel',
        name: 'Porta elevável',
        category: 'porta',
        variations: [
          { id: 'elevavel-2f', name: '2 folhas', folhas: 2 },
          { id: 'elevavel-3f', name: '3 folhas', folhas: 3 },
          { id: 'elevavel-4f', name: '4 folhas', folhas: 4 },
          { id: 'elevavel-6f', name: '6 folhas', folhas: 6 },
        ]
      },
    ]
  },
  {
    id: 'linha-box',
    name: 'LINHA BOX',
    description: 'Box de Banheiro',
    color: '#06B6D4',
    tipos: [
      {
        id: 'box-frontal',
        name: 'Box frontal',
        category: 'box',
        variations: [
          { id: 'frontal-correr', name: 'Porta de correr', folhas: 2 },
          { id: 'frontal-abrir', name: 'Porta de abrir', folhas: 1 },
        ]
      },
      {
        id: 'box-canto',
        name: 'Box de canto',
        category: 'box',
        variations: [
          { id: 'canto-correr', name: 'Porta de correr', folhas: 2 },
          { id: 'canto-abrir', name: 'Porta de abrir', folhas: 1 },
        ]
      },
    ]
  },
  {
    id: 'linha-fachadas',
    name: 'LINHA FACHADAS',
    description: 'Sistemas de Fachada',
    color: '#84CC16',
    tipos: [
      {
        id: 'fachada-fixa',
        name: 'Fachada fixa',
        category: 'fachada',
        variations: [
          { id: 'fachada-modulos', name: 'Módulos fixos', modules: 6 },
        ]
      },
      {
        id: 'fachada-abertura',
        name: 'Fachada com abertura',
        category: 'fachada',
        variations: [
          { id: 'fachada-projetante', name: 'Módulos com janela projetante', modules: 6 },
        ]
      },
    ]
  },
  {
    id: 'linha-cobertura',
    name: 'LINHA COBERTURA',
    description: 'Cobertura de Vidro',
    color: '#A855F7',
    tipos: [
      {
        id: 'cobertura-fixa',
        name: 'Cobertura fixa',
        category: 'cobertura',
        variations: [
          { id: 'cobertura-manual', name: 'Com abertura manual', modules: 4 },
          { id: 'cobertura-motorizada', name: 'Com abertura motorizada', modules: 4 },
        ]
      },
      {
        id: 'cobertura-retratil',
        name: 'Cobertura retrátil',
        category: 'cobertura',
        variations: [
          { id: 'retratil-manual', name: 'Abertura manual', modules: 4 },
          { id: 'retratil-motorizada', name: 'Abertura motorizada', modules: 4 },
        ]
      },
    ]
  },
  {
    id: 'linha-portao',
    name: 'LINHA PORTÃO',
    description: 'Portão de Garagem',
    color: '#F97316',
    tipos: [
      {
        id: 'portao-correr',
        name: 'Portão de correr',
        category: 'portao',
        variations: [
          { id: 'portao-correr-1f', name: '1 folha', folhas: 1 },
          { id: 'portao-correr-2f', name: '2 folhas', folhas: 2 },
        ]
      },
      {
        id: 'portao-basculante',
        name: 'Portão basculante',
        category: 'portao',
        variations: [
          { id: 'portao-basculante-1f', name: '1 folha', folhas: 1 },
        ]
      },
    ]
  },
];

// Opções de customização
export interface CustomizationOptions {
  vidroColor: string;
  vidroTipo: 'transparente' | 'fumê' | 'bronze' | 'verde' | 'azul' | 'incolor' | 'serigrafado';
  vidroEspessura: '6mm' | '8mm' | '10mm' | '12mm';
  perfilCor: string;
  perfilAcabamento: 'anodizado' | 'pintado' | 'natural';
  puxadorTipo: 'barra' | 'concha' | 'embutido' | 'sem-puxador';
  puxadorCor: string;
  fechadura: boolean;
  trinco: boolean;
}

export const DEFAULT_CUSTOMIZATION: CustomizationOptions = {
  vidroColor: '#6B9BD1',
  vidroTipo: 'incolor',
  vidroEspessura: '8mm',
  perfilCor: '#4A5568',
  perfilAcabamento: 'anodizado',
  puxadorTipo: 'barra',
  puxadorCor: '#2D3748',
  fechadura: true,
  trinco: false,
};

export const VIDRO_COLORS = {
  transparente: '#E8F4F8',
  fumê: '#8B7E74',
  bronze: '#CD7F32',
  verde: '#4A7C59',
  azul: '#6B9BD1',
  incolor: '#F0F9FF',
  serigrafado: '#B8C5D0',
};

export const PERFIL_COLORS = {
  branco: '#F8F9FA',
  preto: '#1A1D23',
  bronze: '#8B7355',
  champanhe: '#D4C5A9',
  grafite: '#4A5568',
  natural: '#A8A8A8',
};
