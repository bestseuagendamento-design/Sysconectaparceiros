/**
 * 🧮 CÁLCULO DE QUANTIDADES POR TIPOLOGIA
 * Sistema SysConecta - Cálculo automático de materiais necessários
 */

import { SUPREMA_CORRER_2F, Tipologia } from '../data/tipologias/suprema-correr-2f';

export interface ConfiguracaoUsuario {
  largura_mm: number;
  altura_mm: number;
  tipo_vidro: string;
  espessura_vidro: string;
  cor_aluminio: string;
  puxador: string;
  fechadura: string;
  contra_marco: boolean;
  folhas_moveis: number; // 1 ou 2
}

export interface QuantidadesCalculadas {
  vidros: {
    tipo: string;
    espessura: string;
    cor: string;
    folhas: Array<{
      numero: number;
      largura_mm: number;
      altura_mm: number;
      area_m2: number;
    }>;
    area_total_m2: number;
    peso_total_kg: number;
  };
  aluminio: {
    cor: string;
    perfis: Array<{
      nome: string;
      codigo: string;
      descricao: string;
      quantidade_barras: number;
      comprimento_unitario_mm: number;
      peso_unitario_kg: number;
      peso_total_kg: number;
    }>;
    peso_total_kg: number;
  };
  acessorios: {
    roldanas: {
      tipo: string;
      codigo: string;
      quantidade: number;
      descricao: string;
    };
    puxadores: {
      tipo: string;
      codigo: string;
      quantidade: number;
      descricao: string;
    };
    fechaduras: {
      tipo: string;
      codigo: string | null;
      quantidade: number;
      descricao: string;
    };
    vedacao: {
      codigo: string;
      metros_lineares: number;
      descricao: string;
    };
    tampas: {
      codigo: string;
      quantidade: number;
    };
    parafusos: {
      codigo: string;
      quantidade: number;
    };
  };
}

/**
 * Calcula todas as quantidades necessárias para fabricar a esquadria
 */
export function calcularQuantidades(
  config: ConfiguracaoUsuario,
  tipologia: Tipologia = SUPREMA_CORRER_2F
): QuantidadesCalculadas {
  
  // ========================================
  // 1️⃣ CÁLCULO DE VIDROS
  // ========================================
  const descontos = tipologia.descontos_vidro_mm;
  const larguraPorFolha = config.largura_mm / 2;
  
  const larguraVidro = larguraPorFolha - (descontos.encaixe_lateral * 2) - descontos.folga_tecnica;
  const alturaVidro = config.altura_mm - descontos.encaixe_superior - descontos.encaixe_inferior - descontos.folga_tecnica;
  
  if (config.contra_marco) {
    // Com contra-marco, reduz mais
    const descontoExtra = tipologia.contra_marco.desconto_extra_mm;
    // larguraVidro -= descontoExtra;
    // alturaVidro -= descontoExtra;
  }

  const areaUnitaria = (larguraVidro * alturaVidro) / 1_000_000; // m²
  const areaTotalVidro = areaUnitaria * 2; // 2 folhas

  const pesoM2 = tipologia.vidro.peso_por_m2_kg[config.espessura_vidro] || 15;
  const pesoTotalVidro = areaTotalVidro * pesoM2;

  // ========================================
  // 2️⃣ CÁLCULO DE ALUMÍNIO (Perfis)
  // ========================================
  const perfisCalculados: Array<{
    nome: string;
    codigo: string;
    descricao: string;
    quantidade_barras: number;
    comprimento_unitario_mm: number;
    peso_unitario_kg: number;
    peso_total_kg: number;
  }> = [];

  const BARRA_PADRAO_MM = 6000; // Barras de 6 metros

  // Marco Superior (1 peça)
  const perfilSuperior = tipologia.perfis.SUPREMA_PERFIL_SUPERIOR;
  perfisCalculados.push({
    nome: 'Marco Superior',
    codigo: perfilSuperior.codigo,
    descricao: perfilSuperior.descricao,
    quantidade_barras: 1,
    comprimento_unitario_mm: config.largura_mm,
    peso_unitario_kg: (config.largura_mm / 1000) * perfilSuperior.peso_kg_m,
    peso_total_kg: (config.largura_mm / 1000) * perfilSuperior.peso_kg_m
  });

  // Marco Inferior (1 peça)
  const perfilInferior = tipologia.perfis.SUPREMA_PERFIL_INFERIOR;
  perfisCalculados.push({
    nome: 'Marco Inferior',
    codigo: perfilInferior.codigo,
    descricao: perfilInferior.descricao,
    quantidade_barras: 1,
    comprimento_unitario_mm: config.largura_mm,
    peso_unitario_kg: (config.largura_mm / 1000) * perfilInferior.peso_kg_m,
    peso_total_kg: (config.largura_mm / 1000) * perfilInferior.peso_kg_m
  });

  // Marcos Laterais (2 peças)
  const perfilLateral = tipologia.perfis.SUPREMA_PERFIL_LATERAL;
  perfisCalculados.push({
    nome: 'Marco Lateral',
    codigo: perfilLateral.codigo,
    descricao: perfilLateral.descricao,
    quantidade_barras: 2,
    comprimento_unitario_mm: config.altura_mm,
    peso_unitario_kg: (config.altura_mm / 1000) * perfilLateral.peso_kg_m,
    peso_total_kg: (config.altura_mm / 1000) * perfilLateral.peso_kg_m * 2
  });

  // Montantes Verticais de Folha (4 peças = 2 por folha x 2 folhas)
  const perfilFolhaVertical = tipologia.perfis.SUPREMA_PERFIL_FOLHA_VERTICAL;
  perfisCalculados.push({
    nome: 'Montante Vertical Folha',
    codigo: perfilFolhaVertical.codigo,
    descricao: perfilFolhaVertical.descricao,
    quantidade_barras: 4,
    comprimento_unitario_mm: config.altura_mm,
    peso_unitario_kg: (config.altura_mm / 1000) * perfilFolhaVertical.peso_kg_m,
    peso_total_kg: (config.altura_mm / 1000) * perfilFolhaVertical.peso_kg_m * 4
  });

  // Travessas Superiores de Folha (2 peças)
  const perfilFolhaHorSup = tipologia.perfis.SUPREMA_PERFIL_FOLHA_HORIZONTAL_SUPERIOR;
  perfisCalculados.push({
    nome: 'Travessa Superior Folha',
    codigo: perfilFolhaHorSup.codigo,
    descricao: perfilFolhaHorSup.descricao,
    quantidade_barras: 2,
    comprimento_unitario_mm: larguraPorFolha,
    peso_unitario_kg: (larguraPorFolha / 1000) * perfilFolhaHorSup.peso_kg_m,
    peso_total_kg: (larguraPorFolha / 1000) * perfilFolhaHorSup.peso_kg_m * 2
  });

  // Travessas Inferiores de Folha (2 peças)
  const perfilFolhaHorInf = tipologia.perfis.SUPREMA_PERFIL_FOLHA_HORIZONTAL_INFERIOR;
  perfisCalculados.push({
    nome: 'Travessa Inferior Folha',
    codigo: perfilFolhaHorInf.codigo,
    descricao: perfilFolhaHorInf.descricao,
    quantidade_barras: 2,
    comprimento_unitario_mm: larguraPorFolha,
    peso_unitario_kg: (larguraPorFolha / 1000) * perfilFolhaHorInf.peso_kg_m,
    peso_total_kg: (larguraPorFolha / 1000) * perfilFolhaHorInf.peso_kg_m * 2
  });

  // Baguetes (perímetro de cada vidro x 2 folhas)
  const perfilBaguete = tipologia.perfis.SUPREMA_BAGUETE_VIDRO;
  const perimetroVidro = (larguraVidro + alturaVidro) * 2;
  const totalBaguete = perimetroVidro * 2; // 2 folhas
  const qtdBarrasBaguete = Math.ceil(totalBaguete / BARRA_PADRAO_MM);
  perfisCalculados.push({
    nome: 'Baguete Vidro',
    codigo: perfilBaguete.codigo,
    descricao: perfilBaguete.descricao,
    quantidade_barras: qtdBarrasBaguete,
    comprimento_unitario_mm: BARRA_PADRAO_MM,
    peso_unitario_kg: (BARRA_PADRAO_MM / 1000) * perfilBaguete.peso_kg_m,
    peso_total_kg: qtdBarrasBaguete * (BARRA_PADRAO_MM / 1000) * perfilBaguete.peso_kg_m
  });

  // Contra-Marco (opcional)
  if (config.contra_marco) {
    const perfilContraMarco = tipologia.perfis.SUPREMA_CONTRA_MARCO;
    const perimetroTotal = (config.largura_mm + config.altura_mm) * 2;
    const qtdBarrasCM = Math.ceil(perimetroTotal / BARRA_PADRAO_MM);
    perfisCalculados.push({
      nome: 'Contra-Marco',
      codigo: perfilContraMarco.codigo,
      descricao: perfilContraMarco.descricao,
      quantidade_barras: qtdBarrasCM,
      comprimento_unitario_mm: BARRA_PADRAO_MM,
      peso_unitario_kg: (BARRA_PADRAO_MM / 1000) * perfilContraMarco.peso_kg_m,
      peso_total_kg: qtdBarrasCM * (BARRA_PADRAO_MM / 1000) * perfilContraMarco.peso_kg_m
    });
  }

  const pesoTotalAluminio = perfisCalculados.reduce((sum, p) => sum + p.peso_total_kg, 0);

  // ========================================
  // 3️⃣ CÁLCULO DE ACESSÓRIOS
  // ========================================

  // ROLDANAS (baseado no peso do vidro)
  const tipoRoldana = tipologia.ferragens.roldanas.regras_por_peso_kg.find(regra => {
    if (regra.ate && pesoTotalVidro <= regra.ate) return true;
    if (regra.acima && pesoTotalVidro > regra.acima) return true;
    return false;
  }) || tipologia.ferragens.roldanas.regras_por_peso_kg[0];

  const qtdRoldanas = tipoRoldana.quantidade_por_folha * 2; // 2 folhas
  const dadosRoldana = tipologia.acessorios.roldanas[tipoRoldana.tipo];

  // PUXADORES
  const dadosPuxador = tipologia.acessorios.puxadores[config.puxador];
  const qtdPuxadores = config.folhas_moveis; // 1 puxador por folha móvel

  // FECHADURAS
  const dadosFechadura = tipologia.acessorios.fechaduras[config.fechadura];
  const qtdFechaduras = config.fechadura === 'SEM_FECHADURA' ? 0 : 1;

  // VEDAÇÃO (perímetro total)
  const perimetroTotal = (config.largura_mm + config.altura_mm) * 2;
  const metrosVedacao = perimetroTotal / 1000;

  // TAMPAS
  const qtdTampas = tipologia.acessorios.tampas.quantidade_por_janela;

  // PARAFUSOS
  const qtdParafusos = tipologia.acessorios.parafusos.quantidade_padrao;

  // ========================================
  // RETORNO FINAL
  // ========================================
  return {
    vidros: {
      tipo: config.tipo_vidro,
      espessura: config.espessura_vidro,
      cor: config.tipo_vidro,
      folhas: [
        {
          numero: 1,
          largura_mm: Math.round(larguraVidro),
          altura_mm: Math.round(alturaVidro),
          area_m2: parseFloat(areaUnitaria.toFixed(3))
        },
        {
          numero: 2,
          largura_mm: Math.round(larguraVidro),
          altura_mm: Math.round(alturaVidro),
          area_m2: parseFloat(areaUnitaria.toFixed(3))
        }
      ],
      area_total_m2: parseFloat(areaTotalVidro.toFixed(3)),
      peso_total_kg: parseFloat(pesoTotalVidro.toFixed(2))
    },
    aluminio: {
      cor: config.cor_aluminio,
      perfis: perfisCalculados.map(p => ({
        ...p,
        peso_unitario_kg: parseFloat(p.peso_unitario_kg.toFixed(3)),
        peso_total_kg: parseFloat(p.peso_total_kg.toFixed(3))
      })),
      peso_total_kg: parseFloat(pesoTotalAluminio.toFixed(2))
    },
    acessorios: {
      roldanas: {
        tipo: tipoRoldana.tipo,
        codigo: dadosRoldana.codigo,
        quantidade: qtdRoldanas,
        descricao: dadosRoldana.descricao
      },
      puxadores: {
        tipo: config.puxador,
        codigo: dadosPuxador.codigo,
        quantidade: qtdPuxadores,
        descricao: dadosPuxador.descricao
      },
      fechaduras: {
        tipo: config.fechadura,
        codigo: dadosFechadura.codigo,
        quantidade: qtdFechaduras,
        descricao: dadosFechadura.descricao
      },
      vedacao: {
        codigo: tipologia.acessorios.vedacao.codigo,
        metros_lineares: parseFloat(metrosVedacao.toFixed(2)),
        descricao: `Vedação Escova - ${metrosVedacao.toFixed(2)}m`
      },
      tampas: {
        codigo: tipologia.acessorios.tampas.codigo,
        quantidade: qtdTampas
      },
      parafusos: {
        codigo: tipologia.acessorios.parafusos.codigo,
        quantidade: qtdParafusos
      }
    }
  };
}
