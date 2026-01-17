/**
 * 🔢 MOTOR DE CÁLCULO INDUSTRIAL - SYSCONECTA
 * 
 * Fórmulas técnicas para cálculo de vidros, perfis, peso e acessórios.
 * Base: Especificações técnicas linha SUPREMA
 */

import { Tipologia } from '../data/tipologias/suprema-correr-2f';

export interface ConfiguracaoUsuario {
  largura_total_mm: number;
  altura_total_mm: number;
  tipo_vidro: string;
  espessura_vidro: string | number;
  cor_aluminio: string;
  tem_contra_marco: boolean;
  configuracao_folhas: string; // "1_MOVEL_1_FIXA" ou "2_MOVEIS"
  tipo_puxador: string;
  tipo_fechadura: string;
  preco_unitario_vidro_m2?: number; // 🔥 Campo opcional para cálculo financeiro
}

export interface VidroCalculado {
  folha_numero: number;
  tipo_folha: "MOVEL" | "FIXA";
  largura_mm: number;
  altura_mm: number;
  area_m2: number;
  peso_kg: number;
}

export interface PerfilCalculado {
  nome: string;
  codigo: string;
  quantidade: number;
  comprimento_mm: number;
  peso_kg_m: number;
  peso_total_kg: number;
  descricao: string;
}

export interface SobraPerfilDetalhada {
  codigo_perfil: string;
  nome_perfil: string;
  linha: string; // "SUPREMA"
  cortes_necessarios: Array<{
    corte_numero: number;
    comprimento_mm: number;
    localizacao: string; // Ex: "Marco Superior", "Folha 1 - Montante Esquerdo"
  }>;
  barras_usadas: Array<{
    barra_numero: number;
    comprimento_barra_mm: number; // 6000mm
    perdas_serra_mm: number; // 3mm por corte
    cortes_nesta_barra: number[];
    sobra_aproveitavel_mm: number;
    sobra_vai_para_estoque: boolean;
  }>;
  total_metros_necessarios: number;
  total_metros_usados: number;
  total_sobra_mm: number;
  total_barras_6m: number;
}

export interface AcessorioCalculado {
  nome: string;
  codigo: string;
  quantidade: number;
  descricao: string;
  requer_recorte?: {
    altura_mm: number;
    posicao: string;
  };
}

export interface ResultadoCalculo {
  vidros: VidroCalculado[];
  perfis: PerfilCalculado[];
  acessorios: AcessorioCalculado[];
  resumo: {
    area_total_vidro_m2: number;
    peso_total_vidro_kg: number;
    peso_total_aluminio_kg: number;
    metros_vedacao: number;
    custo_total_estimado: number; // 🔥 Campo Financeiro Adicionado
  };
  otimizacao: {
    barras_6m_necessarias: number;
    sobra_total_mm: number;
    detalhamento: Array<{
      perfil: string;
      barras: number;
      sobra_mm: number;
    }>;
  };
  codigo_producao: string;
  componentes?: any; // Compatibilidade com chamada em App.tsx
}

/**
 * 🔹 OTIMIZAÇÃO DE BARRAS DE 6 METROS
 * Algoritmo de corte otimizado (Bin Packing) com perda de serra
 */
export function otimizarBarras(perfis: PerfilCalculado[]): {
  barras_6m_necessarias: number;
  sobra_total_mm: number;
  detalhamento: Array<{
    perfil: string;
    barras: number;
    sobra_mm: number;
  }>;
} {
  const BARRA_6M = 6000;
  const PERDA_SERRA = 3; // 3mm de perda por corte
  let barras_totais = 0;
  let sobra_total = 0;
  const detalhamento: Array<{ perfil: string; barras: number; sobra_mm: number }> = [];

  perfis.forEach((perfil) => {
    const comprimento_corte = perfil.comprimento_mm;
    const quantidade_necessaria = perfil.quantidade;
    
    // Calcular quantas peças cabem em uma barra (considerando perda de serra)
    let pecas_por_barra = 0;
    let comprimento_usado = 0;
    
    // Simular cortes em uma barra
    while (comprimento_usado + comprimento_corte + (pecas_por_barra > 0 ? PERDA_SERRA : 0) <= BARRA_6M) {
      if (pecas_por_barra > 0) {
        comprimento_usado += PERDA_SERRA; // Perda do corte anterior
      }
      comprimento_usado += comprimento_corte;
      pecas_por_barra++;
    }
    
    // Se não couber nenhuma peça, a barra é muito curta (erro)
    if (pecas_por_barra === 0) {
      pecas_por_barra = 1;
      comprimento_usado = comprimento_corte;
    }
    
    // Calcular quantas barras são necessárias
    const barras_necessarias = Math.ceil(quantidade_necessaria / pecas_por_barra);
    
    // Calcular sobra REAL
    // Última barra pode ter menos peças
    const pecas_ultima_barra = quantidade_necessaria % pecas_por_barra || pecas_por_barra;
    const comprimento_usado_ultima_barra = (pecas_ultima_barra * comprimento_corte) + 
                                            ((pecas_ultima_barra - 1) * PERDA_SERRA);
    const sobra_ultima_barra = BARRA_6M - comprimento_usado_ultima_barra;
    
    // Sobra das outras barras (totalmente utilizadas)
    const barras_completas = barras_necessarias - 1;
    const sobra_barras_completas = barras_completas * (BARRA_6M - comprimento_usado);
    
    const sobra_total_perfil = sobra_barras_completas + sobra_ultima_barra;

    barras_totais += barras_necessarias;
    sobra_total += sobra_total_perfil;

    detalhamento.push({
      perfil: `${perfil.nome} (${perfil.codigo})`,
      barras: barras_necessarias,
      sobra_mm: Math.round(sobra_total_perfil)
    });
  });

  return {
    barras_6m_necessarias: barras_totais,
    sobra_total_mm: Math.round(sobra_total),
    detalhamento
  };
}

/**
 * 🔹 CÁLCULO DETALHADO DE SOBRAS POR PERFIL
 * Especifica cada corte, cada barra e quanto sobrou para o estoque
 */
export function calcularSobrasDetalhadas(
  config: ConfiguracaoUsuario,
  tipologia: Tipologia
): SobraPerfilDetalhada[] {
  const BARRA_6M = 6000;
  const PERDA_SERRA = 3; // 3mm por corte
  const SOBRA_MINIMA_ESTOQUE = 300; // Sobras abaixo de 300mm não vão para estoque
  
  const sobras: SobraPerfilDetalhada[] = [];
  const perfis = calcularPerfis(config, tipologia);
  
  perfis.forEach((perfil) => {
    const cortes_necessarios: Array<{
      corte_numero: number;
      comprimento_mm: number;
      localizacao: string;
    }> = [];
    
    // DETERMINAR LOCALIZAÇÃO DE CADA CORTE
    if (perfil.codigo === tipologia.perfis.SUPREMA_PERFIL_SUPERIOR.codigo) {
      cortes_necessarios.push({
        corte_numero: 1,
        comprimento_mm: perfil.comprimento_mm,
        localizacao: "Marco Superior"
      });
    } else if (perfil.codigo === tipologia.perfis.SUPREMA_PERFIL_INFERIOR.codigo) {
      cortes_necessarios.push({
        corte_numero: 1,
        comprimento_mm: perfil.comprimento_mm,
        localizacao: "Marco Inferior (Trilho)"
      });
    } else if (perfil.codigo === tipologia.perfis.SUPREMA_PERFIL_LATERAL.codigo) {
      cortes_necessarios.push({
        corte_numero: 1,
        comprimento_mm: perfil.comprimento_mm,
        localizacao: "Marco Lateral Esquerdo"
      });
      cortes_necessarios.push({
        corte_numero: 2,
        comprimento_mm: perfil.comprimento_mm,
        localizacao: "Marco Lateral Direito"
      });
    } else if (perfil.codigo === tipologia.perfis.SUPREMA_PERFIL_FOLHA_VERTICAL.codigo) {
      cortes_necessarios.push({
        corte_numero: 1,
        comprimento_mm: perfil.comprimento_mm,
        localizacao: "Folha 1 - Montante Esquerdo"
      });
      cortes_necessarios.push({
        corte_numero: 2,
        comprimento_mm: perfil.comprimento_mm,
        localizacao: "Folha 1 - Montante Direito"
      });
      cortes_necessarios.push({
        corte_numero: 3,
        comprimento_mm: perfil.comprimento_mm,
        localizacao: "Folha 2 - Montante Esquerdo"
      });
      cortes_necessarios.push({
        corte_numero: 4,
        comprimento_mm: perfil.comprimento_mm,
        localizacao: "Folha 2 - Montante Direito"
      });
    } else if (perfil.codigo === tipologia.perfis.SUPREMA_PERFIL_FOLHA_HORIZONTAL_SUPERIOR.codigo) {
      cortes_necessarios.push({
        corte_numero: 1,
        comprimento_mm: perfil.comprimento_mm,
        localizacao: "Folha 1 - Travessa Superior"
      });
      cortes_necessarios.push({
        corte_numero: 2,
        comprimento_mm: perfil.comprimento_mm,
        localizacao: "Folha 1 - Travessa Inferior"
      });
      cortes_necessarios.push({
        corte_numero: 3,
        comprimento_mm: perfil.comprimento_mm,
        localizacao: "Folha 2 - Travessa Superior"
      });
      cortes_necessarios.push({
        corte_numero: 4,
        comprimento_mm: perfil.comprimento_mm,
        localizacao: "Folha 2 - Travessa Inferior"
      });
    } else if (perfil.codigo === tipologia.perfis.SUPREMA_BAGUETE_VIDRO.codigo) {
      // Baguetes: perímetro de cada vidro
      const perimetro_vidro = (perfil.comprimento_mm * 2 + config.altura_total_mm * 2);
      for (let i = 0; i < perfil.quantidade / 2; i++) {
        cortes_necessarios.push({
          corte_numero: (i * 2) + 1,
          comprimento_mm: perfil.comprimento_mm,
          localizacao: `Folha ${i + 1} - Baguete Horizontal`
        });
        cortes_necessarios.push({
          corte_numero: (i * 2) + 2,
          comprimento_mm: config.altura_total_mm,
          localizacao: `Folha ${i + 1} - Baguete Vertical`
        });
      }
    } else if (perfil.codigo === tipologia.perfis.SUPREMA_CONTRA_MARCO.codigo && config.tem_contra_marco) {
      const largura = config.largura_total_mm;
      const altura = config.altura_total_mm;
      cortes_necessarios.push({
        corte_numero: 1,
        comprimento_mm: largura,
        localizacao: "Contra-Marco Superior"
      });
      cortes_necessarios.push({
        corte_numero: 2,
        comprimento_mm: largura,
        localizacao: "Contra-Marco Inferior"
      });
      cortes_necessarios.push({
        corte_numero: 3,
        comprimento_mm: altura,
        localizacao: "Contra-Marco Lateral Esquerdo"
      });
      cortes_necessarios.push({
        corte_numero: 4,
        comprimento_mm: altura,
        localizacao: "Contra-Marco Lateral Direito"
      });
    }
    
    // DISTRIBUIR CORTES EM BARRAS
    const barras_usadas: Array<{
      barra_numero: number;
      comprimento_barra_mm: number;
      perdas_serra_mm: number;
      cortes_nesta_barra: number[];
      sobra_aproveitavel_mm: number;
      sobra_vai_para_estoque: boolean;
    }> = [];
    
    let cortes_restantes = [...cortes_necessarios];
    let barra_atual_numero = 1;
    
    while (cortes_restantes.length > 0) {
      let comprimento_disponivel = BARRA_6M;
      const cortes_nesta_barra: number[] = [];
      let perdas_serra_total = 0;
      
      // Tentar encaixar cortes na barra atual
      for (let i = cortes_restantes.length - 1; i >= 0; i--) {
        const corte = cortes_restantes[i];
        const perda_serra = cortes_nesta_barra.length > 0 ? PERDA_SERRA : 0;
        
        if (comprimento_disponivel >= corte.comprimento_mm + perda_serra) {
          comprimento_disponivel -= (corte.comprimento_mm + perda_serra);
          cortes_nesta_barra.push(corte.corte_numero);
          perdas_serra_total += perda_serra;
          cortes_restantes.splice(i, 1);
        }
      }
      
      const sobra_mm = comprimento_disponivel;
      const vai_para_estoque = sobra_mm >= SOBRA_MINIMA_ESTOQUE;
      
      barras_usadas.push({
        barra_numero: barra_atual_numero,
        comprimento_barra_mm: BARRA_6M,
        perdas_serra_mm: perdas_serra_total,
        cortes_nesta_barra: cortes_nesta_barra.sort((a, b) => a - b),
        sobra_aproveitavel_mm: sobra_mm,
        sobra_vai_para_estoque: vai_para_estoque
      });
      
      barra_atual_numero++;
    }
    
    // CÁLCULO TOTAL
    const total_metros_necessarios = (perfil.quantidade * perfil.comprimento_mm) / 1000;
    const total_metros_usados = (barras_usadas.length * BARRA_6M) / 1000;
    const total_sobra_mm = barras_usadas.reduce((sum, b) => sum + b.sobra_aproveitavel_mm, 0);
    
    sobras.push({
      codigo_perfil: perfil.codigo,
      nome_perfil: perfil.descricao,
      linha: tipologia.linha,
      cortes_necessarios,
      barras_usadas,
      total_metros_necessarios: parseFloat(total_metros_necessarios.toFixed(3)),
      total_metros_usados: parseFloat(total_metros_usados.toFixed(3)),
      total_sobra_mm: Math.round(total_sobra_mm),
      total_barras_6m: barras_usadas.length
    });
  });
  
  return sobras;
}

/**
 * 🔹 CÁLCULO DE PERFIS PARA UMA CONFIGURAÇÃO E TIPOLOGIA
 * Determina os perfis necessários para uma configuração específica
 */
export function calcularPerfis(
  config: ConfiguracaoUsuario,
  tipologia: Tipologia
): PerfilCalculado[] {
  const perfis: PerfilCalculado[] = [];
  
  // 1️⃣ PERFIS SUPERIORES E INFERIORES
  perfis.push({
    nome: "Marco Superior",
    codigo: tipologia.perfis.SUPREMA_PERFIL_SUPERIOR.codigo,
    quantidade: 1,
    comprimento_mm: config.largura_total_mm,
    peso_kg_m: tipologia.perfis.SUPREMA_PERFIL_SUPERIOR.peso_kg_m,
    peso_total_kg: parseFloat(((config.largura_total_mm / 1000) * tipologia.perfis.SUPREMA_PERFIL_SUPERIOR.peso_kg_m).toFixed(3)),
    descricao: tipologia.perfis.SUPREMA_PERFIL_SUPERIOR.descricao
  });
  
  perfis.push({
    nome: "Marco Inferior (Trilho)",
    codigo: tipologia.perfis.SUPREMA_PERFIL_INFERIOR.codigo,
    quantidade: 1,
    comprimento_mm: config.largura_total_mm,
    peso_kg_m: tipologia.perfis.SUPREMA_PERFIL_INFERIOR.peso_kg_m,
    peso_total_kg: parseFloat(((config.largura_total_mm / 1000) * tipologia.perfis.SUPREMA_PERFIL_INFERIOR.peso_kg_m).toFixed(3)),
    descricao: tipologia.perfis.SUPREMA_PERFIL_INFERIOR.descricao
  });
  
  // 2️⃣ PERFIS LATERAIS
  perfis.push({
    nome: "Marco Lateral Esquerdo",
    codigo: tipologia.perfis.SUPREMA_PERFIL_LATERAL.codigo,
    quantidade: 1,
    comprimento_mm: config.altura_total_mm,
    peso_kg_m: tipologia.perfis.SUPREMA_PERFIL_LATERAL.peso_kg_m,
    peso_total_kg: parseFloat(((config.altura_total_mm / 1000) * tipologia.perfis.SUPREMA_PERFIL_LATERAL.peso_kg_m).toFixed(3)),
    descricao: tipologia.perfis.SUPREMA_PERFIL_LATERAL.descricao
  });
  
  perfis.push({
    nome: "Marco Lateral Direito",
    codigo: tipologia.perfis.SUPREMA_PERFIL_LATERAL.codigo,
    quantidade: 1,
    comprimento_mm: config.altura_total_mm,
    peso_kg_m: tipologia.perfis.SUPREMA_PERFIL_LATERAL.peso_kg_m,
    peso_total_kg: parseFloat(((config.altura_total_mm / 1000) * tipologia.perfis.SUPREMA_PERFIL_LATERAL.peso_kg_m).toFixed(3)),
    descricao: tipologia.perfis.SUPREMA_PERFIL_LATERAL.descricao
  });
  
  // 3️⃣ PERFIS DE FOLHA VERTICAL (2 por folha = 4 unidades)
  const altura_folha = config.altura_total_mm / tipologia.folhas.total;
  perfis.push({
    nome: "Montantes Verticais de Folha",
    codigo: tipologia.perfis.SUPREMA_PERFIL_FOLHA_VERTICAL.codigo,
    quantidade: 4, // 2 folhas × 2 montantes
    comprimento_mm: altura_folha,
    peso_kg_m: tipologia.perfis.SUPREMA_PERFIL_FOLHA_VERTICAL.peso_kg_m,
    peso_total_kg: parseFloat(((altura_folha / 1000) * tipologia.perfis.SUPREMA_PERFIL_FOLHA_VERTICAL.peso_kg_m * 4).toFixed(3)),
    descricao: tipologia.perfis.SUPREMA_PERFIL_FOLHA_VERTICAL.descricao
  });
  
  // 4️⃣ PERFIS DE FOLHA HORIZONTAL (2 por folha = 4 unidades)
  const largura_folha = config.largura_total_mm / tipologia.folhas.total;
  perfis.push({
    nome: "Travessas Horizontais de Folha",
    codigo: tipologia.perfis.SUPREMA_PERFIL_FOLHA_HORIZONTAL_SUPERIOR.codigo,
    quantidade: 4, // 2 folhas × 2 travessas
    comprimento_mm: largura_folha,
    peso_kg_m: tipologia.perfis.SUPREMA_PERFIL_FOLHA_HORIZONTAL_SUPERIOR.peso_kg_m,
    peso_total_kg: parseFloat(((largura_folha / 1000) * tipologia.perfis.SUPREMA_PERFIL_FOLHA_HORIZONTAL_SUPERIOR.peso_kg_m * 4).toFixed(3)),
    descricao: tipologia.perfis.SUPREMA_PERFIL_FOLHA_HORIZONTAL_SUPERIOR.descricao
  });
  
  // 5️⃣ BAGUETES DE VIDRO (perímetro de cada vidro × 2 folhas)
  const perimetro_por_folha = (largura_folha * 2) + (altura_folha * 2);
  const total_baguetes = perimetro_por_folha * tipologia.folhas.total;
  perfis.push({
    nome: "Baguetes de Vidro",
    codigo: tipologia.perfis.SUPREMA_BAGUETE_VIDRO.codigo,
    quantidade: Math.ceil(total_baguetes / largura_folha), // Estimativa de peças
    comprimento_mm: largura_folha, // Tamanho médio por peça
    peso_kg_m: tipologia.perfis.SUPREMA_BAGUETE_VIDRO.peso_kg_m,
    peso_total_kg: parseFloat(((total_baguetes / 1000) * tipologia.perfis.SUPREMA_BAGUETE_VIDRO.peso_kg_m).toFixed(3)),
    descricao: tipologia.perfis.SUPREMA_BAGUETE_VIDRO.descricao
  });
  
  // 6️⃣ CONTRA-MARCO (se habilitado)
  if (config.tem_contra_marco) {
    const largura = config.largura_total_mm;
    const altura = config.altura_total_mm;
    perfis.push({
      nome: "Contra-Marco Superior",
      codigo: tipologia.perfis.SUPREMA_CONTRA_MARCO.codigo,
      quantidade: 1,
      comprimento_mm: largura,
      peso_kg_m: tipologia.perfis.SUPREMA_CONTRA_MARCO.peso_kg_m,
      peso_total_kg: parseFloat(((largura / 1000) * tipologia.perfis.SUPREMA_CONTRA_MARCO.peso_kg_m).toFixed(3)),
      descricao: tipologia.perfis.SUPREMA_CONTRA_MARCO.descricao
    });
    
    perfis.push({
      nome: "Contra-Marco Inferior",
      codigo: tipologia.perfis.SUPREMA_CONTRA_MARCO.codigo,
      quantidade: 1,
      comprimento_mm: largura,
      peso_kg_m: tipologia.perfis.SUPREMA_CONTRA_MARCO.peso_kg_m,
      peso_total_kg: parseFloat(((largura / 1000) * tipologia.perfis.SUPREMA_CONTRA_MARCO.peso_kg_m).toFixed(3)),
      descricao: tipologia.perfis.SUPREMA_CONTRA_MARCO.descricao
    });
    
    perfis.push({
      nome: "Contra-Marco Lateral Esquerdo",
      codigo: tipologia.perfis.SUPREMA_CONTRA_MARCO.codigo,
      quantidade: 1,
      comprimento_mm: altura,
      peso_kg_m: tipologia.perfis.SUPREMA_CONTRA_MARCO.peso_kg_m,
      peso_total_kg: parseFloat(((altura / 1000) * tipologia.perfis.SUPREMA_CONTRA_MARCO.peso_kg_m).toFixed(3)),
      descricao: tipologia.perfis.SUPREMA_CONTRA_MARCO.descricao
    });
    
    perfis.push({
      nome: "Contra-Marco Lateral Direito",
      codigo: tipologia.perfis.SUPREMA_CONTRA_MARCO.codigo,
      quantidade: 1,
      comprimento_mm: altura,
      peso_kg_m: tipologia.perfis.SUPREMA_CONTRA_MARCO.peso_kg_m,
      peso_total_kg: parseFloat(((altura / 1000) * tipologia.perfis.SUPREMA_CONTRA_MARCO.peso_kg_m).toFixed(3)),
      descricao: tipologia.perfis.SUPREMA_CONTRA_MARCO.descricao
    });
  }
  
  return perfis;
}

/**
 * 🔹 CÁLCULO DE VIDROS - FÓRMULA INDUSTRIAL
 */
export function calcularVidros(
  config: ConfiguracaoUsuario,
  tipologia: Tipologia
): VidroCalculado[] {
  const vidros: VidroCalculado[] = [];
  
  // Largura de cada folha (dividir igualmente)
  const largura_folha = config.largura_total_mm / tipologia.folhas.total;

  // Descontos técnicos
  const desconto_lateral = tipologia.descontos_vidro_mm.encaixe_lateral;
  const desconto_superior = tipologia.descontos_vidro_mm.encaixe_superior;
  const desconto_inferior = tipologia.descontos_vidro_mm.encaixe_inferior;
  const folga = tipologia.descontos_vidro_mm.folga_tecnica;
  const desconto_cm = config.tem_contra_marco ? tipologia.contra_marco.desconto_extra_mm : 0;

  // Peso por m²
  const peso_m2 = tipologia.vidro.peso_por_m2_kg[config.espessura_vidro.toString()];

  // Definir quais folhas são móveis
  const folhas_moveis: boolean[] = [];
  if (config.configuracao_folhas === "1_MOVEL_1_FIXA") {
    folhas_moveis.push(true, false); // Folha 1 móvel, folha 2 fixa
  } else if (config.configuracao_folhas === "2_MOVEIS") {
    folhas_moveis.push(true, true); // Ambas móveis
  }

  for (let i = 0; i < tipologia.folhas.total; i++) {
    const tipo_folha = folhas_moveis[i] ? "MOVEL" : "FIXA";

    // 📐 FÓRMULA LARGURA DO VIDRO
    const vidro_largura = 
      largura_folha
      - (2 * desconto_lateral)
      - folga
      - desconto_cm;

    // 📐 FÓRMULA ALTURA DO VIDRO
    const vidro_altura = 
      config.altura_total_mm
      - desconto_superior
      - desconto_inferior
      - folga
      - desconto_cm;

    // Área em m²
    const area_m2 = (vidro_largura / 1000) * (vidro_altura / 1000);

    // Peso em kg
    const peso_kg = area_m2 * peso_m2;

    vidros.push({
      folha_numero: i + 1,
      tipo_folha,
      largura_mm: Math.round(vidro_largura),
      altura_mm: Math.round(vidro_altura),
      area_m2: parseFloat(area_m2.toFixed(4)),
      peso_kg: parseFloat(peso_kg.toFixed(2))
    });
  }

  return vidros;
}

/**
 * 🔹 CÁLCULO DE ACESSÓRIOS E FERRAGENS
 */
export function calcularAcessorios(
  config: ConfiguracaoUsuario,
  vidros: VidroCalculado[],
  tipologia: Tipologia
): AcessorioCalculado[] {
  const acessorios: AcessorioCalculado[] = [];

  // 1️⃣ ROLDANAS (baseado no peso do vidro)
  vidros.forEach((vidro) => {
    if (vidro.tipo_folha === "MOVEL") {
      // Encontrar tipo de roldana baseado no peso
      let tipo_roldana = "ROLDANA_SIMPLES";
      for (const regra of tipologia.ferragens.roldanas.regras_por_peso_kg) {
        if (regra.ate && vidro.peso_kg <= regra.ate) {
          tipo_roldana = regra.tipo;
          break;
        } else if (regra.acima && vidro.peso_kg > regra.acima) {
          tipo_roldana = regra.tipo;
          break;
        }
      }

      const info_roldana = tipologia.acessorios.roldanas[tipo_roldana];
      const regra = tipologia.ferragens.roldanas.regras_por_peso_kg.find(r => r.tipo === tipo_roldana);

      if (regra && info_roldana) {
        acessorios.push({
          nome: `Roldanas - Folha ${vidro.folha_numero}`,
          codigo: info_roldana.codigo,
          quantidade: regra.quantidade_por_folha,
          descricao: info_roldana.descricao
        });
      }
    }
  });

  // 2️⃣ PUXADORES
  const info_puxador = tipologia.acessorios.puxadores[config.tipo_puxador];
  if (info_puxador) {
    acessorios.push({
      nome: "Puxador",
      codigo: info_puxador.codigo,
      quantidade: 1,
      descricao: info_puxador.descricao
    });
  }

  // 3️⃣ FECHADURAS
  const info_fechadura = tipologia.acessorios.fechaduras[config.tipo_fechadura];
  if (info_fechadura && info_fechadura.codigo) {
    acessorios.push({
      nome: "Fechadura",
      codigo: info_fechadura.codigo,
      quantidade: 1,
      descricao: info_fechadura.descricao,
      requer_recorte: info_fechadura.altura_recorte_mm ? {
        altura_mm: info_fechadura.altura_recorte_mm,
        posicao: info_fechadura.posicao_vertical || "CENTRO"
      } : undefined
    });
  }

  // 4️⃣ VEDAÇÃO
  const perimetro_total = (config.largura_total_mm * 2 + config.altura_total_mm * 2) / 1000;
  acessorios.push({
    nome: "Vedação",
    codigo: tipologia.acessorios.vedacao.codigo,
    quantidade: Math.ceil(perimetro_total),
    descricao: tipologia.acessorios.vedacao.descricao
  });

  // 5️⃣ TAMPAS
  acessorios.push({
    nome: "Tampas",
    codigo: tipologia.acessorios.tampas.codigo,
    quantidade: tipologia.acessorios.tampas.quantidade_por_janela,
    descricao: "Tampas de acabamento"
  });

  // 6️⃣ PARAFUSOS
  acessorios.push({
    nome: "Parafusos",
    codigo: tipologia.acessorios.parafusos.codigo,
    quantidade: tipologia.acessorios.parafusos.quantidade_padrao,
    descricao: `${tipologia.acessorios.parafusos.tipo} ${tipologia.acessorios.parafusos.medida_mm}`
  });

  return acessorios;
}

/**
 * 🔹 FUNÇÃO PRINCIPAL - CÁLCULO COMPLETO
 */
export function calcularCompleto(
  config: ConfiguracaoUsuario,
  tipologia: Tipologia
): ResultadoCalculo {
  // 1️⃣ Calcular vidros
  const vidros = calcularVidros(config, tipologia);

  // 2️⃣ Calcular perfis
  const perfis = calcularPerfis(config, tipologia);

  // 3️⃣ Calcular acessórios
  const acessorios = calcularAcessorios(config, vidros, tipologia);

  // 4️⃣ Calcular otimização de barras
  const otimizacao = otimizarBarras(perfis);

  // 5️⃣ Calcular resumos
  const area_total_vidro_m2 = vidros.reduce((sum, v) => sum + v.area_m2, 0);
  const peso_total_vidro_kg = vidros.reduce((sum, v) => sum + v.peso_kg, 0);
  const peso_total_aluminio_kg = perfis.reduce((sum, p) => sum + p.peso_total_kg, 0);
  const metros_vedacao = acessorios.find(a => a.codigo === tipologia.acessorios.vedacao.codigo)?.quantidade || 0;

  // 🔥 CÁLCULO FINANCEIRO
  // Se preco_unitario_vidro_m2 for fornecido, calcula o custo
  const custo_vidro = (config.preco_unitario_vidro_m2 || 0) * area_total_vidro_m2;
  const custo_total_estimado = parseFloat(custo_vidro.toFixed(2));

  // 6️⃣ Gerar código de produção
  const timestamp = Date.now().toString().slice(-6);
  const codigo_producao = `${tipologia.linha}_${tipologia.sistema}_${tipologia.folhas.total}F_${timestamp}`;

  return {
    vidros,
    perfis,
    acessorios,
    resumo: {
      area_total_vidro_m2: parseFloat(area_total_vidro_m2.toFixed(4)),
      peso_total_vidro_kg: parseFloat(peso_total_vidro_kg.toFixed(2)),
      peso_total_aluminio_kg: parseFloat(peso_total_aluminio_kg.toFixed(3)),
      metros_vedacao,
      custo_total_estimado
    },
    otimizacao,
    codigo_producao,
    componentes: acessorios // Alias para compatibilidade
  };
}