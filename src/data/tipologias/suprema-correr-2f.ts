/**
 * 🏗️ TIPOLOGIA TÉCNICA COMPLETA - SUPREMA CORRER 2 FOLHAS JANELA
 * Sistema SysConecta - Banco de Dados Técnico Industrial
 * 
 * ⚠️ ATENÇÃO: Este arquivo contém dados técnicos reais de fabricação.
 * Alterações podem afetar cálculos de produção, corte e orçamento.
 */

export interface Tipologia {
  tipologia_id: string;
  linha: string;
  sistema: string;
  aplicacao: string;
  folhas: {
    total: number;
    configuracao_padrao: string;
    configuracoes_permitidas: string[];
  };
  dimensoes_usuario: {
    largura_total_mm: { min: number; max: number };
    altura_total_mm: { min: number; max: number };
  };
  cores_aluminio: string[];
  vidro: {
    tipos_permitidos: string[];
    tipos_bloqueados: string[];
    espessuras_mm: (number | string)[];
    peso_por_m2_kg: Record<string, number>;
  };
  descontos_vidro_mm: {
    encaixe_lateral: number;
    encaixe_superior: number;
    encaixe_inferior: number;
    folga_tecnica: number;
  };
  contra_marco: {
    possui: boolean[];
    desconto_extra_mm: number;
    perfil_contra_marco: string;
  };
  ferragens: {
    roldanas: {
      regras_por_peso_kg: Array<{
        ate?: number;
        acima?: number;
        tipo: string;
        quantidade_por_folha: number;
      }>;
    };
    puxadores: string[];
    fechaduras: string[];
  };
  perfis: Record<string, {
    codigo: string;
    peso_kg_m: number;
    descricao: string;
  }>;
  acessorios: {
    roldanas: Record<string, {
      codigo: string;
      capacidade_kg: number;
      descricao: string;
    }>;
    puxadores: Record<string, {
      codigo: string;
      descricao: string;
    }>;
    fechaduras: Record<string, {
      codigo: string | null;
      altura_recorte_mm?: number;
      posicao_vertical?: string;
      descricao: string;
    }>;
    vedacao: {
      codigo: string;
      tipo: string;
      unidade_venda: string;
    };
    tampas: {
      codigo: string;
      quantidade_por_janela: number;
    };
    parafusos: {
      codigo: string;
      tipo: string;
      medida_mm: string;
      quantidade_padrao: number;
    };
  };
  cores_hex: Record<string, string>;
  cores_vidro: Record<string, string>;
}

export const SUPREMA_CORRER_2F: Tipologia = {
  tipologia_id: "SUPREMA_CORRER_2F_JANELA",
  linha: "SUPREMA",
  sistema: "CORRER",
  aplicacao: "JANELA",
  
  folhas: {
    total: 2,
    configuracao_padrao: "1_MOVEL_1_FIXA",
    configuracoes_permitidas: ["1_MOVEL_1_FIXA", "2_MOVEIS"]
  },

  dimensoes_usuario: {
    largura_total_mm: { min: 600, max: 3000 },
    altura_total_mm: { min: 600, max: 2400 }
  },

  cores_aluminio: [
    "BRANCO",
    "PRETO",
    "ANODIZADO_NATURAL",
    "ANODIZADO_FOSCO",
    "CHAMPAGNE",
    "MADEIRADO"
  ],

  vidro: {
    tipos_permitidos: [
      "INCOLOR",
      "FUME",
      "VERDE",
      "TEMPERADO",
      "LAMINADO",
      "CONTROLE_SOLAR",
      "DECORATIVO"
    ],
    tipos_bloqueados: ["REFLECTA"],
    espessuras_mm: [4, 6, 8, "3+3", "4+4"],
    peso_por_m2_kg: {
      "4": 10,
      "6": 15,
      "8": 20,
      "3+3": 15,
      "4+4": 20
    }
  },

  descontos_vidro_mm: {
    encaixe_lateral: 18,
    encaixe_superior: 20,
    encaixe_inferior: 22,
    folga_tecnica: 3
  },

  contra_marco: {
    possui: [true, false],
    desconto_extra_mm: 10,
    perfil_contra_marco: "SUP_CM_001"
  },

  ferragens: {
    roldanas: {
      regras_por_peso_kg: [
        { ate: 20, tipo: "ROLDANA_SIMPLES", quantidade_por_folha: 2 },
        { ate: 40, tipo: "ROLDANA_DUPLA", quantidade_por_folha: 2 },
        { ate: 80, tipo: "ROLDANA_DUPLA_REFORCADA", quantidade_por_folha: 2 },
        { acima: 80, tipo: "ROLDANA_QUADRUPLA", quantidade_por_folha: 4 }
      ]
    },
    puxadores: [
      "SIMPLES",
      "EMBUTIDO",
      "PREMIUM",
      "COM_FECHADURA"
    ],
    fechaduras: [
      "SEM_FECHADURA",
      "FECHO_SIMPLES",
      "FECHO_CENTRAL",
      "FECHO_COM_CHAVE"
    ]
  },

  perfis: {
    "SUPREMA_PERFIL_SUPERIOR": {
      codigo: "SUP_MAR_SUP_2F",
      peso_kg_m: 0.74,
      descricao: "Marco Superior - Correr 2 Folhas"
    },
    "SUPREMA_PERFIL_INFERIOR": {
      codigo: "SUP_MAR_INF_2F",
      peso_kg_m: 0.68,
      descricao: "Marco Inferior - Trilho Duplo"
    },
    "SUPREMA_PERFIL_LATERAL": {
      codigo: "SUP_MAR_LAT",
      peso_kg_m: 0.51,
      descricao: "Marco Lateral"
    },
    "SUPREMA_PERFIL_FOLHA_VERTICAL": {
      codigo: "SUP_FOL_MONT",
      peso_kg_m: 0.51,
      descricao: "Montante Vertical de Folha"
    },
    "SUPREMA_PERFIL_FOLHA_HORIZONTAL_SUPERIOR": {
      codigo: "SUP_FOL_TRAV_SUP",
      peso_kg_m: 0.50,
      descricao: "Travessa Horizontal Superior de Folha"
    },
    "SUPREMA_PERFIL_FOLHA_HORIZONTAL_INFERIOR": {
      codigo: "SUP_FOL_TRAV_INF",
      peso_kg_m: 0.52,
      descricao: "Travessa Horizontal Inferior de Folha"
    },
    "SUPREMA_BAGUETE_VIDRO": {
      codigo: "SUP_BAG_VID",
      peso_kg_m: 0.08,
      descricao: "Baguete para Fixação de Vidro"
    },
    "SUPREMA_CONTRA_MARCO": {
      codigo: "SUP_CM_001",
      peso_kg_m: 0.62,
      descricao: "Contra-Marco Opcional"
    }
  },

  acessorios: {
    roldanas: {
      "ROLDANA_SIMPLES": {
        codigo: "ROL_SUP_20KG",
        capacidade_kg: 20,
        descricao: "Roldana Simples - até 20kg"
      },
      "ROLDANA_DUPLA": {
        codigo: "ROL_SUP_40KG",
        capacidade_kg: 40,
        descricao: "Roldana Dupla - até 40kg"
      },
      "ROLDANA_DUPLA_REFORCADA": {
        codigo: "ROL_SUP_80KG",
        capacidade_kg: 80,
        descricao: "Roldana Dupla Reforçada - até 80kg"
      },
      "ROLDANA_QUADRUPLA": {
        codigo: "ROL_SUP_120KG",
        capacidade_kg: 120,
        descricao: "Roldana Quádrupla - acima de 80kg"
      }
    },
    puxadores: {
      "SIMPLES": {
        codigo: "PUX_SUP_SIM",
        descricao: "Puxador Simples"
      },
      "EMBUTIDO": {
        codigo: "PUX_SUP_EMB",
        descricao: "Puxador Embutido"
      },
      "PREMIUM": {
        codigo: "PUX_SUP_PRE",
        descricao: "Puxador Premium"
      },
      "COM_FECHADURA": {
        codigo: "PUX_SUP_FEC",
        descricao: "Puxador com Fechadura Integrada"
      }
    },
    fechaduras: {
      "SEM_FECHADURA": {
        codigo: null,
        descricao: "Sem Fechadura"
      },
      "FECHO_SIMPLES": {
        codigo: "FEC_SUP_SIM",
        altura_recorte_mm: 70,
        posicao_vertical: "CENTRO_DA_FOLHA",
        descricao: "Fecho Simples"
      },
      "FECHO_CENTRAL": {
        codigo: "FEC_SUP_CEN",
        altura_recorte_mm: 110,
        posicao_vertical: "CENTRO_DA_FOLHA",
        descricao: "Fecho Central"
      },
      "FECHO_COM_CHAVE": {
        codigo: "FEC_SUP_CHA",
        altura_recorte_mm: 160,
        posicao_vertical: "CENTRO_DA_FOLHA",
        descricao: "Fecho com Chave"
      }
    },
    vedacao: {
      codigo: "VED_SUP_ESC",
      tipo: "ESCOVA_POLIPROPILENO",
      unidade_venda: "METRO"
    },
    tampas: {
      codigo: "TAM_SUP_INF",
      quantidade_por_janela: 2
    },
    parafusos: {
      codigo: "PARAF_SUP_416",
      tipo: "AUTOATARRAXANTE",
      medida_mm: "4.0x16",
      quantidade_padrao: 40
    }
  },

  cores_hex: {
    "BRANCO": "#FFFFFF",
    "PRETO": "#1A1A1A",
    "ANODIZADO_NATURAL": "#C0C0C0",
    "ANODIZADO_FOSCO": "#8A8A8A",
    "CHAMPAGNE": "#E6D3A3",
    "MADEIRADO": "#8B5A2B"
  },

  cores_vidro: {
    "INCOLOR": "rgba(173, 216, 230, 0.3)",
    "FUME": "rgba(74, 74, 74, 0.5)",
    "VERDE": "rgba(46, 92, 60, 0.5)",
    "TEMPERADO": "rgba(173, 216, 230, 0.3)",
    "LAMINADO": "rgba(173, 216, 230, 0.3)",
    "CONTROLE_SOLAR": "rgba(100, 149, 237, 0.4)",
    "DECORATIVO": "rgba(200, 200, 200, 0.6)"
  }
};