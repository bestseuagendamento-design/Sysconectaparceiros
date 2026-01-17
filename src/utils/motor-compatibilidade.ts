/**
 * 🔍 MOTOR DE COMPATIBILIDADE AUTOMÁTICA - SYSCONECTA
 * 
 * Valida automaticamente:
 * - Compatibilidade vidro × espessura × tipologia
 * - Compatibilidade roldana × peso do vidro
 * - Compatibilidade fechadura × altura da folha
 * - Compatibilidade puxador × configuração de folhas
 * - Limites dimensionais por tipologia
 * 
 * Retorna:
 * - Lista de avisos (warnings)
 * - Lista de erros críticos (bloqueiam produção)
 * - Sugestões automáticas de correção
 */

import { Tipologia } from '../data/tipologias/suprema-correr-2f';
import { ConfiguracaoUsuario, VidroCalculado } from './calculos-industriais';

export interface ProblemaCompatibilidade {
  tipo: 'ERRO' | 'AVISO' | 'SUGESTAO';
  categoria: 'DIMENSOES' | 'VIDRO' | 'FERRAGEM' | 'PESO' | 'CONFIGURACAO';
  codigo: string;
  titulo: string;
  mensagem: string;
  solucao?: string;
  valor_atual?: string | number;
  valor_recomendado?: string | number;
  bloqueiaProducao: boolean;
}

export interface ResultadoCompatibilidade {
  compativel: boolean;
  problemas: ProblemaCompatibilidade[];
  sugestoes: ProblemaCompatibilidade[];
  avisos: ProblemaCompatibilidade[];
  erros: ProblemaCompatibilidade[];
}

/**
 * 🔹 FUNÇÃO PRINCIPAL: Verificar compatibilidade completa
 */
export function verificarCompatibilidade(
  config: ConfiguracaoUsuario,
  tipologia: Tipologia,
  vidrosCalculados?: VidroCalculado[]
): ResultadoCompatibilidade {
  const problemas: ProblemaCompatibilidade[] = [];

  // 1️⃣ VERIFICAR DIMENSÕES
  const problemasDimensoes = verificarDimensoes(config, tipologia);
  problemas.push(...problemasDimensoes);

  // 2️⃣ VERIFICAR VIDRO
  const problemasVidro = verificarVidro(config, tipologia);
  problemas.push(...problemasVidro);

  // 3️⃣ VERIFICAR PESO E ROLDANAS
  if (vidrosCalculados && vidrosCalculados.length > 0) {
    const problemasPeso = verificarPesoERoldanas(vidrosCalculados, config, tipologia);
    problemas.push(...problemasPeso);
  }

  // 4️⃣ VERIFICAR FECHADURAS
  const problemasFechaduras = verificarFechaduras(config, tipologia);
  problemas.push(...problemasFechaduras);

  // 5️⃣ VERIFICAR CONFIGURAÇÃO DE FOLHAS
  const problemasFolhas = verificarConfiguracaoFolhas(config, tipologia);
  problemas.push(...problemasFolhas);

  // 6️⃣ VERIFICAR PUXADORES
  const problemasPuxadores = verificarPuxadores(config, tipologia);
  problemas.push(...problemasPuxadores);

  // Separar problemas por tipo
  const erros = problemas.filter(p => p.tipo === 'ERRO');
  const avisos = problemas.filter(p => p.tipo === 'AVISO');
  const sugestoes = problemas.filter(p => p.tipo === 'SUGESTAO');

  // Sistema é compatível se não houver ERROS críticos
  const compativel = erros.length === 0;

  return {
    compativel,
    problemas,
    erros,
    avisos,
    sugestoes
  };
}

/**
 * 🔹 VERIFICAR DIMENSÕES
 */
function verificarDimensoes(
  config: ConfiguracaoUsuario,
  tipologia: Tipologia
): ProblemaCompatibilidade[] {
  const problemas: ProblemaCompatibilidade[] = [];
  const { largura_total_mm, altura_total_mm } = config;
  const { largura_total_mm: limL, altura_total_mm: limA } = tipologia.dimensoes_usuario;

  // LARGURA
  if (largura_total_mm < limL.min) {
    problemas.push({
      tipo: 'ERRO',
      categoria: 'DIMENSOES',
      codigo: 'DIM_LARGURA_MIN',
      titulo: 'Largura abaixo do mínimo',
      mensagem: `A largura total de ${largura_total_mm}mm está abaixo do mínimo permitido para esta tipologia.`,
      solucao: `Aumente a largura para pelo menos ${limL.min}mm.`,
      valor_atual: largura_total_mm,
      valor_recomendado: limL.min,
      bloqueiaProducao: true
    });
  }

  if (largura_total_mm > limL.max) {
    problemas.push({
      tipo: 'ERRO',
      categoria: 'DIMENSOES',
      codigo: 'DIM_LARGURA_MAX',
      titulo: 'Largura acima do máximo',
      mensagem: `A largura total de ${largura_total_mm}mm excede o limite máximo da linha ${tipologia.linha}.`,
      solucao: `Reduza a largura para no máximo ${limL.max}mm ou escolha outra tipologia.`,
      valor_atual: largura_total_mm,
      valor_recomendado: limL.max,
      bloqueiaProducao: true
    });
  }

  // ALTURA
  if (altura_total_mm < limA.min) {
    problemas.push({
      tipo: 'ERRO',
      categoria: 'DIMENSOES',
      codigo: 'DIM_ALTURA_MIN',
      titulo: 'Altura abaixo do mínimo',
      mensagem: `A altura total de ${altura_total_mm}mm está abaixo do mínimo permitido para esta tipologia.`,
      solucao: `Aumente a altura para pelo menos ${limA.min}mm.`,
      valor_atual: altura_total_mm,
      valor_recomendado: limA.min,
      bloqueiaProducao: true
    });
  }

  if (altura_total_mm > limA.max) {
    problemas.push({
      tipo: 'ERRO',
      categoria: 'DIMENSOES',
      codigo: 'DIM_ALTURA_MAX',
      titulo: 'Altura acima do máximo',
      mensagem: `A altura total de ${altura_total_mm}mm excede o limite máximo da linha ${tipologia.linha}.`,
      solucao: `Reduza a altura para no máximo ${limA.max}mm ou escolha outra tipologia.`,
      valor_atual: altura_total_mm,
      valor_recomendado: limA.max,
      bloqueiaProducao: true
    });
  }

  // SUGESTÃO: Dimensões muito próximas do limite
  if (largura_total_mm > limL.max * 0.95 && largura_total_mm <= limL.max) {
    problemas.push({
      tipo: 'AVISO',
      categoria: 'DIMENSOES',
      codigo: 'DIM_LARGURA_PROXIMO_LIMITE',
      titulo: 'Largura próxima do limite máximo',
      mensagem: `A largura está em ${((largura_total_mm / limL.max) * 100).toFixed(1)}% do limite máximo.`,
      solucao: 'Considere reforçar a estrutura ou dividir em múltiplas folhas.',
      bloqueiaProducao: false
    });
  }

  return problemas;
}

/**
 * 🔹 VERIFICAR VIDRO
 */
function verificarVidro(
  config: ConfiguracaoUsuario,
  tipologia: Tipologia
): ProblemaCompatibilidade[] {
  const problemas: ProblemaCompatibilidade[] = [];
  const { tipo_vidro, espessura_vidro } = config;

  // Verificar se o tipo de vidro é permitido
  if (!tipologia.vidro.tipos_permitidos.includes(tipo_vidro)) {
    problemas.push({
      tipo: 'ERRO',
      categoria: 'VIDRO',
      codigo: 'VIDRO_TIPO_NAO_PERMITIDO',
      titulo: 'Tipo de vidro não permitido',
      mensagem: `O tipo de vidro "${tipo_vidro}" não é compatível com a linha ${tipologia.linha}.`,
      solucao: `Escolha um dos tipos permitidos: ${tipologia.vidro.tipos_permitidos.join(', ')}.`,
      valor_atual: tipo_vidro,
      bloqueiaProducao: true
    });
  }

  // Verificar se está bloqueado
  if (tipologia.vidro.tipos_bloqueados.includes(tipo_vidro)) {
    problemas.push({
      tipo: 'ERRO',
      categoria: 'VIDRO',
      codigo: 'VIDRO_TIPO_BLOQUEADO',
      titulo: 'Tipo de vidro bloqueado',
      mensagem: `O tipo de vidro "${tipo_vidro}" está bloqueado para esta tipologia por razões técnicas.`,
      solucao: 'Escolha outro tipo de vidro compatível.',
      valor_atual: tipo_vidro,
      bloqueiaProducao: true
    });
  }

  // Verificar espessura
  const espessurasValidas = tipologia.vidro.espessuras_mm.map(e => String(e));
  if (!espessurasValidas.includes(String(espessura_vidro))) {
    problemas.push({
      tipo: 'ERRO',
      categoria: 'VIDRO',
      codigo: 'VIDRO_ESPESSURA_INVALIDA',
      titulo: 'Espessura de vidro inválida',
      mensagem: `A espessura ${espessura_vidro}mm não é válida para esta tipologia.`,
      solucao: `Espessuras válidas: ${tipologia.vidro.espessuras_mm.join(', ')}mm.`,
      valor_atual: espessura_vidro,
      bloqueiaProducao: true
    });
  }

  // SUGESTÃO: Vidro laminado para grandes dimensões
  const areaTotal = (config.largura_total_mm * config.altura_total_mm) / 1_000_000; // m²
  if (areaTotal > 3.0 && !['LAMINADO', 'TEMPERADO'].includes(tipo_vidro)) {
    problemas.push({
      tipo: 'SUGESTAO',
      categoria: 'VIDRO',
      codigo: 'VIDRO_SUGESTAO_LAMINADO',
      titulo: 'Considere vidro de segurança',
      mensagem: `Para áreas acima de 3m², recomenda-se vidro LAMINADO ou TEMPERADO por segurança.`,
      solucao: 'Altere o tipo de vidro para LAMINADO ou TEMPERADO.',
      bloqueiaProducao: false
    });
  }

  return problemas;
}

/**
 * 🔹 VERIFICAR PESO E ROLDANAS
 */
function verificarPesoERoldanas(
  vidrosCalculados: VidroCalculado[],
  config: ConfiguracaoUsuario,
  tipologia: Tipologia
): ProblemaCompatibilidade[] {
  const problemas: ProblemaCompatibilidade[] = [];

  // Encontrar a folha mais pesada
  const folhaMaisPesada = vidrosCalculados.reduce((max, v) => 
    v.peso_kg > max.peso_kg ? v : max
  , vidrosCalculados[0]);

  const pesoMax = folhaMaisPesada.peso_kg;

  // Verificar qual roldana seria selecionada
  const regraRoldana = tipologia.ferragens.roldanas.regras_por_peso_kg.find(regra => {
    if (regra.ate && pesoMax <= regra.ate) return true;
    if (regra.acima && pesoMax > regra.acima) return true;
    return false;
  });

  if (!regraRoldana) {
    problemas.push({
      tipo: 'ERRO',
      categoria: 'PESO',
      codigo: 'PESO_EXCEDE_CAPACIDADE',
      titulo: 'Peso excede capacidade máxima',
      mensagem: `A folha ${folhaMaisPesada.folha_numero} pesa ${pesoMax.toFixed(2)}kg, excedendo a capacidade de qualquer roldana disponível.`,
      solucao: 'Reduza as dimensões, espessura do vidro ou divida em mais folhas.',
      valor_atual: pesoMax.toFixed(2),
      bloqueiaProducao: true
    });
  } else {
    // Verificar se está próximo do limite
    const capacidadeRoldana = tipologia.acessorios.roldanas[regraRoldana.tipo]?.capacidade_kg || 0;
    if (pesoMax > capacidadeRoldana * 0.9) {
      problemas.push({
        tipo: 'AVISO',
        categoria: 'PESO',
        codigo: 'PESO_PROXIMO_LIMITE',
        titulo: 'Peso próximo do limite da roldana',
        mensagem: `A folha ${folhaMaisPesada.folha_numero} está em ${((pesoMax / capacidadeRoldana) * 100).toFixed(1)}% da capacidade da roldana ${regraRoldana.tipo}.`,
        solucao: 'Considere usar uma roldana de maior capacidade ou reduzir o peso.',
        valor_atual: `${pesoMax.toFixed(2)}kg`,
        valor_recomendado: `< ${(capacidadeRoldana * 0.85).toFixed(2)}kg`,
        bloqueiaProducao: false
      });
    }
  }

  return problemas;
}

/**
 * 🔹 VERIFICAR FECHADURAS
 */
function verificarFechaduras(
  config: ConfiguracaoUsuario,
  tipologia: Tipologia
): ProblemaCompatibilidade[] {
  const problemas: ProblemaCompatibilidade[] = [];
  const { tipo_fechadura, altura_total_mm } = config;

  // Verificar se o tipo de fechadura é válido
  if (!tipologia.ferragens.fechaduras.includes(tipo_fechadura)) {
    problemas.push({
      tipo: 'ERRO',
      categoria: 'FERRAGEM',
      codigo: 'FECHADURA_INVALIDA',
      titulo: 'Tipo de fechadura inválido',
      mensagem: `O tipo de fechadura "${tipo_fechadura}" não está disponível para esta tipologia.`,
      solucao: `Escolha uma das opções: ${tipologia.ferragens.fechaduras.join(', ')}.`,
      valor_atual: tipo_fechadura,
      bloqueiaProducao: true
    });
  }

  // Verificar se a altura é adequada para fechaduras complexas
  const fechaduraConfig = tipologia.acessorios.fechaduras[tipo_fechadura];
  if (fechaduraConfig?.altura_recorte_mm) {
    const alturaMinima = fechaduraConfig.altura_recorte_mm * 3; // Altura mínima recomendada
    if (altura_total_mm < alturaMinima) {
      problemas.push({
        tipo: 'AVISO',
        categoria: 'FERRAGEM',
        codigo: 'FECHADURA_ALTURA_INSUFICIENTE',
        titulo: 'Altura pode ser insuficiente para fechadura',
        mensagem: `Fechaduras do tipo "${tipo_fechadura}" funcionam melhor em alturas acima de ${alturaMinima}mm.`,
        solucao: 'Considere usar uma fechadura mais simples ou aumentar a altura.',
        valor_atual: `${altura_total_mm}mm`,
        valor_recomendado: `>= ${alturaMinima}mm`,
        bloqueiaProducao: false
      });
    }
  }

  return problemas;
}

/**
 * 🔹 VERIFICAR CONFIGURAÇÃO DE FOLHAS
 */
function verificarConfiguracaoFolhas(
  config: ConfiguracaoUsuario,
  tipologia: Tipologia
): ProblemaCompatibilidade[] {
  const problemas: ProblemaCompatibilidade[] = [];
  const { configuracao_folhas } = config;

  // Verificar se a configuração é permitida
  if (!tipologia.folhas.configuracoes_permitidas.includes(configuracao_folhas)) {
    problemas.push({
      tipo: 'ERRO',
      categoria: 'CONFIGURACAO',
      codigo: 'CONFIG_FOLHAS_INVALIDA',
      titulo: 'Configuração de folhas inválida',
      mensagem: `A configuração "${configuracao_folhas}" não é permitida para esta tipologia.`,
      solucao: `Configurações válidas: ${tipologia.folhas.configuracoes_permitidas.join(', ')}.`,
      valor_atual: configuracao_folhas,
      bloqueiaProducao: true
    });
  }

  return problemas;
}

/**
 * 🔹 VERIFICAR PUXADORES
 */
function verificarPuxadores(
  config: ConfiguracaoUsuario,
  tipologia: Tipologia
): ProblemaCompatibilidade[] {
  const problemas: ProblemaCompatibilidade[] = [];
  const { tipo_puxador } = config;

  // Verificar se o tipo de puxador é válido
  if (!tipologia.ferragens.puxadores.includes(tipo_puxador)) {
    problemas.push({
      tipo: 'ERRO',
      categoria: 'FERRAGEM',
      codigo: 'PUXADOR_INVALIDO',
      titulo: 'Tipo de puxador inválido',
      mensagem: `O tipo de puxador "${tipo_puxador}" não está disponível para esta tipologia.`,
      solucao: `Escolha uma das opções: ${tipologia.ferragens.puxadores.join(', ')}.`,
      valor_atual: tipo_puxador,
      bloqueiaProducao: true
    });
  }

  // SUGESTÃO: Puxador com fechadura integrada
  if (tipo_puxador === 'COM_FECHADURA' && config.tipo_fechadura !== 'SEM_FECHADURA') {
    problemas.push({
      tipo: 'AVISO',
      categoria: 'FERRAGEM',
      codigo: 'PUXADOR_FECHADURA_DUPLICADA',
      titulo: 'Puxador com fechadura + fechadura separada',
      mensagem: 'Você selecionou puxador com fechadura integrada E uma fechadura separada.',
      solucao: 'Considere usar apenas o puxador com fechadura integrada para economia.',
      bloqueiaProducao: false
    });
  }

  return problemas;
}

/**
 * 🔹 OBTER RESUMO DE COMPATIBILIDADE (para UI)
 */
export function obterResumoCompatibilidade(resultado: ResultadoCompatibilidade): {
  icone: string;
  cor: string;
  titulo: string;
  mensagem: string;
} {
  if (resultado.compativel && resultado.avisos.length === 0 && resultado.sugestoes.length === 0) {
    return {
      icone: '✅',
      cor: 'green',
      titulo: 'Configuração 100% compatível',
      mensagem: 'Todos os componentes estão em conformidade. Sistema pronto para produção.'
    };
  }

  if (resultado.compativel && resultado.avisos.length > 0) {
    return {
      icone: '⚠️',
      cor: 'yellow',
      titulo: 'Compatível com avisos',
      mensagem: `Sistema compatível, mas há ${resultado.avisos.length} aviso(s) técnico(s).`
    };
  }

  if (!resultado.compativel) {
    return {
      icone: '❌',
      cor: 'red',
      titulo: 'Incompatível - bloqueado para produção',
      mensagem: `${resultado.erros.length} erro(s) crítico(s) impedem a produção.`
    };
  }

  return {
    icone: '💡',
    cor: 'blue',
    titulo: 'Sugestões disponíveis',
    mensagem: `Sistema tem ${resultado.sugestoes.length} sugestão(ões) de otimização.`
  };
}
