// ════════════════════════════════════════════════════════════════════
// 📋 DOSSIÊ COMPLETO DA TIPOLOGIA L001
// Janela de Correr 2 Folhas - LINHA SUPREMA
// ════════════════════════════════════════════════════════════════════

export const TIPOLOGIA_L001 = {
  id: 'preview-temp',
  codigo: 'L001',
  nome: 'Janela de Correr 2 Folhas',
  linha: 'LINHA SUPREMA',
  categoria: 'JANELAS',
  descricao: 'Janela de correr com 2 folhas móveis em alumínio linha Suprema com usinagens de alta precisão',
  imagemUrl: 'https://exemplo.com/l001.jpg',
  status: 'PENDENTE' as const,
  dataCriacao: new Date().toISOString(),
  
  // ═══════════════════════════════════════════════════════════════
  // PERFIS DE ALUMÍNIO
  // ═══════════════════════════════════════════════════════════════
  perfis: [
    // MARCO FIXO (QUADRO)
    {
      codigo: 'SU-001',
      nome: 'Trilho Superior',
      formula: 'L',
      pesoKgMetro: 0.891,
      tamanhoBarraDisponivel: 6000,
      kerfDisco: 5,
      usinagens: 'Furo Ø4.5mm na face lateral a 12mm da borda para fixação no SU-003',
      observacoes: 'Recebe as guias de nylon (SU-064) das folhas móveis'
    },
    {
      codigo: 'SU-002',
      nome: 'Trilho Inferior',
      formula: 'L',
      pesoKgMetro: 1.474,
      tamanhoBarraDisponivel: 6000,
      kerfDisco: 5,
      usinagens: 'Rasgo de dreno 20×5mm: centro do 1º a 50mm da esquerda, 2º a L-50mm. Vedação: silicone nas cabeças',
      observacoes: 'Trilho externo 5mm mais baixo que interno para drenagem'
    },
    {
      codigo: 'SU-003',
      nome: 'Marco Lateral',
      formula: 'H * 2',
      pesoKgMetro: 0.534,
      tamanhoBarraDisponivel: 6000,
      kerfDisco: 5,
      usinagens: 'Dois canais de 5.5mm para inserção de Escova de Vedação 5×5mm (Finseal)',
      observacoes: '2 peças: esquerda + direita'
    },
    
    // FOLHAS MÓVEIS (QUADROS MÓVEIS)
    {
      codigo: 'SU-039',
      nome: 'Montante Lateral Folha (Lado Marco)',
      formula: '(H - 45) * 2',
      pesoKgMetro: 0.311,
      tamanhoBarraDisponivel: 6000,
      kerfDisco: 5,
      usinagens: 'Rasgo no topo para fixação da Guia de Nylon SU-064',
      observacoes: '2 peças: 1 na folha esquerda, 1 na folha direita. Encosta no marco lateral SU-003'
    },
    {
      codigo: 'SU-040',
      nome: 'Montante Central (Mão de Amigo - Macho/Fêmea)',
      formula: '(H - 45) * 2',
      pesoKgMetro: 0.267,
      tamanhoBarraDisponivel: 6000,
      kerfDisco: 5,
      usinagens: 'Rasgo 120×18mm em Hf/2 para fecho central (FEC-18). Rasgo no topo para SU-064',
      observacoes: '2 peças que se cruzam no centro com transpasse de 26mm. Escovas Finseal se comprimem no fechamento'
    },
    {
      codigo: 'SU-053',
      nome: 'Travessa Horizontal Folha',
      formula: '(((L + 12) / 2) - 72) * 4',
      pesoKgMetro: 0.311,
      tamanhoBarraDisponivel: 6000,
      kerfDisco: 5,
      usinagens: 'Travessa inferior: furação para embutir roldanas. Centro da roldana a 60mm da face externa dos montantes',
      observacoes: '4 travessas total: 2 por folha (superior + inferior)'
    }
  ],
  
  // ═══════════════════════════════════════════════════════════════
  // VIDROS GUARDIAN GLASS
  // ═══════════════════════════════════════════════════════════════
  vidros: [
    {
      nome: 'Vidro Folha Esquerda',
      larguraFormula: '(((L + 12) / 2) - 72) + 20',
      alturaFormula: '((H - 45) - 72) + 20',
      espessuras: ['4mm', '6mm', '8mm'],
      cores: [
        'Clear (Incolor)',
        'French Green',
        'Euro Grey',
        'Royal Silver',
        'Sky Blue',
        'Neutral',
        'SunGuard Neutral 40'
      ],
      observacoes: 'Vidro temperado Guardian Glass. Fórmula +20mm: vidro entra 10mm em cada canal lateral. Calços de nylon/borracha 5mm na base. Gaxeta EPDM em U abraçando o vidro'
    },
    {
      nome: 'Vidro Folha Direita',
      larguraFormula: '(((L + 12) / 2) - 72) + 20',
      alturaFormula: '((H - 45) - 72) + 20',
      espessuras: ['4mm', '6mm', '8mm'],
      cores: [
        'Clear (Incolor)',
        'French Green',
        'Euro Grey',
        'Royal Silver',
        'Sky Blue',
        'Neutral',
        'SunGuard Neutral 40'
      ],
      observacoes: 'Vidro temperado Guardian Glass. Fórmula +20mm: vidro entra 10mm em cada canal lateral. Calços de nylon/borracha 5mm na base. Gaxeta EPDM em U abraçando o vidro'
    }
  ],
  
  // ═══════════════════════════════════════════════════════════════
  // ACESSÓRIOS E COMPONENTES
  // ═══════════════════════════════════════════════════════════════
  acessorios: [
    {
      codigo: 'RO-42',
      nome: 'Roldana 4 Rodas (4mm/6mm)',
      tipo: 'FIXO' as const,
      quantidadeFixa: 4,
      unidade: 'UNIDADE' as const,
      observacoes: 'Para vidros 4mm ou 6mm. Embutidas na Travessa Inferior (SU-053) a 60mm da face externa'
    },
    {
      codigo: 'RO-44',
      nome: 'Roldana 4 Rodas (8mm)',
      tipo: 'FIXO' as const,
      quantidadeFixa: 4,
      unidade: 'UNIDADE' as const,
      observacoes: 'Para vidros 8mm. Embutidas na Travessa Inferior (SU-053) a 60mm da face externa'
    },
    {
      codigo: 'SU-064',
      nome: 'Guia de Nylon',
      tipo: 'FIXO' as const,
      quantidadeFixa: 4,
      unidade: 'UNIDADE' as const,
      observacoes: 'No topo dos montantes SU-039 e SU-040. Centraliza folha no Trilho Superior (SU-001) para evitar ruído e vibração'
    },
    {
      codigo: 'FEC-18',
      nome: 'Fecho Central Caracol',
      tipo: 'FIXO' as const,
      quantidadeFixa: 2,
      unidade: 'UNIDADE' as const,
      observacoes: 'Posição: exatamente em Hf/2. Rasgo 120×18mm no SU-040. 1 em cada folha móvel'
    },
    {
      codigo: 'TR-01',
      nome: 'Trava de Segurança',
      tipo: 'FIXO' as const,
      quantidadeFixa: 1,
      unidade: 'UNIDADE' as const,
      observacoes: 'Trava adicional para segurança'
    },
    {
      codigo: 'ES-FINSEAL',
      nome: 'Escova de Vedação Finseal 5×5mm',
      tipo: 'FORMULA' as const,
      formula: '((L * 2) + (H * 4)) / 1000',
      unidade: 'METRO' as const,
      observacoes: 'Inserida nos canais de 5.5mm do SU-003 (marcos laterais) e SU-040 (montantes centrais). Rolo de 5 metros'
    },
    {
      codigo: 'GAXETA-EPDM',
      nome: 'Gaxeta EPDM formato U',
      tipo: 'FORMULA' as const,
      formula: '(((((L + 12) / 2) - 72) + 20) * 2 + (((H - 45) - 72) + 20) * 2) * 2 / 1000',
      unidade: 'METRO' as const,
      observacoes: 'Abraça o vidro Guardian Glass antes de fechar o quadro de alumínio. 2 folhas × perímetro do vidro'
    },
    {
      codigo: 'CALCO-5MM',
      nome: 'Calços de Nylon/Borracha 5mm',
      tipo: 'FIXO' as const,
      quantidadeFixa: 8,
      unidade: 'UNIDADE' as const,
      observacoes: 'Na base do vidro para evitar quebra com vibração da roldana. 4 por vidro × 2 vidros'
    },
    {
      codigo: 'SILICONE-VED',
      nome: 'Vedante de Silicone',
      tipo: 'FIXO' as const,
      quantidadeFixa: 1,
      unidade: 'UNIDADE' as const,
      observacoes: 'Aplicar nas cabeças do Trilho Inferior (SU-002) antes de parafusar o marco lateral para evitar vazamento nos cantos'
    }
  ],
  
  opcionais: [],
  acabamentosAluminio: [
    'Branco',
    'Preto',
    'Bronze',
    'Champagne',
    'Natural',
    'RAL 9005 - Preto Microtexturizado'
  ],
  permiteReaproveitamento: true,
  normaTecnica: 'NBR 10821-2:2017'
};
