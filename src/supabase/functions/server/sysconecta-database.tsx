// ════════════════════════════════════════════════════════════════════
// 🗄️ SYSCONECTA - BANCO DE DADOS COMPLETO
// ════════════════════════════════════════════════════════════════════
// Sistema B2B Enterprise para Setor de Vidros no Brasil
// Estrutura completa de fornecedores, exclusividade territorial e indústrias
// ════════════════════════════════════════════════════════════════════

import * as kv from './kv_store.tsx';

// ════════════════════════════════════════════════════════════════════
// 📋 TIPOS E INTERFACES
// ════════════════════════════════════════════════════════════════════

export type TipoFornecedor = 'VIDRO' | 'ALUMINIO' | 'ACESSORIOS';
export type EstadoBR = 
  | 'AC' | 'AL' | 'AP' | 'AM' | 'BA' | 'CE' | 'DF' | 'ES' | 'GO' 
  | 'MA' | 'MT' | 'MS' | 'MG' | 'PA' | 'PB' | 'PR' | 'PE' | 'PI' 
  | 'RJ' | 'RN' | 'RS' | 'RO' | 'RR' | 'SC' | 'SP' | 'SE' | 'TO';

export interface Industria {
  id: string;
  nome: string;
  tipo: TipoFornecedor;
  descricao: string;
  ativo: boolean;
  dataCadastro: string;
}

export interface Fornecedor {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  tipo: TipoFornecedor;
  estado: EstadoBR;
  
  // Exclusividade
  exclusivoEstado: boolean; // Sempre true no SysConecta
  
  // Indústria parceira
  industriaId: string; // ID da indústria que fornece
  
  // Responsável
  responsavel: {
    nome: string;
    email: string;
    telefone: string;
  };
  
  // Endereço
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: EstadoBR;
    cep: string;
  };
  
  // Status
  ativo: boolean;
  dataAdesao: string;
  dataInativacao?: string;
}

export interface ExclusividadeTerritorial {
  estado: EstadoBR;
  tipo: TipoFornecedor;
  fornecedorId: string | null; // null = vaga disponível
  dataOcupacao?: string;
}

export interface ConfiguracaoSistema {
  // Regras de negócio
  exclusividadeTerritorial: boolean; // Sempre true
  maxFornecedoresPorEstadoPorTipo: number; // Sempre 1
  
  // Indústrias ativas
  industriaVidroAtiva: string; // 'guardian_glass'
  industriaAluminioAtiva: string | null; // Ainda não definido
  industriaAcessoriosAtiva: string | null; // Ainda não definido
  
  // Comissão Marketplace
  comissaoMarketplace: {
    min: number; // 3%
    max: number; // 6%
  };
}

// ════════════════════════════════════════════════════════════════════
// 🏭 INDÚSTRIAS PARCEIRAS
// ════════════════════════════════════════════════════════════════════

export const INDUSTRIAS: Record<string, Industria> = {
  guardian_glass: {
    id: 'guardian_glass',
    nome: 'Guardian Glass',
    tipo: 'VIDRO',
    descricao: 'Indústria EXCLUSIVA de vidros para todos os fornecedores do SysConecta',
    ativo: true,
    dataCadastro: '2024-01-01'
  }
};

// ════════════════════════════════════════════════════════════════════
// 🗺️ ESTADOS BRASILEIROS
// ════════════════════════════════════════════════════════════════════

export const ESTADOS_BR: Record<EstadoBR, string> = {
  'AC': 'Acre',
  'AL': 'Alagoas',
  'AP': 'Amapá',
  'AM': 'Amazonas',
  'BA': 'Bahia',
  'CE': 'Ceará',
  'DF': 'Distrito Federal',
  'ES': 'Espírito Santo',
  'GO': 'Goiás',
  'MA': 'Maranhão',
  'MT': 'Mato Grosso',
  'MS': 'Mato Grosso do Sul',
  'MG': 'Minas Gerais',
  'PA': 'Pará',
  'PB': 'Paraíba',
  'PR': 'Paraná',
  'PE': 'Pernambuco',
  'PI': 'Piauí',
  'RJ': 'Rio de Janeiro',
  'RN': 'Rio Grande do Norte',
  'RS': 'Rio Grande do Sul',
  'RO': 'Rondônia',
  'RR': 'Roraima',
  'SC': 'Santa Catarina',
  'SP': 'São Paulo',
  'SE': 'Sergipe',
  'TO': 'Tocantins'
};

// ════════════════════════════════════════════════════════════════════
// 💾 FUNÇÕES DE BANCO DE DADOS - INDÚSTRIAS
// ════════════════════════════════════════════════════════════════════

export async function getIndustria(id: string): Promise<Industria | null> {
  return await kv.get(`industria:${id}`);
}

export async function getAllIndustrias(): Promise<Industria[]> {
  const industrias = await kv.getByPrefix('industria:');
  return industrias || [];
}

export async function saveIndustria(industria: Industria): Promise<void> {
  await kv.set(`industria:${industria.id}`, industria);
}

// ════════════════════════════════════════════════════════════════════
// 💾 FUNÇÕES DE BANCO DE DADOS - FORNECEDORES
// ════════════════════════════════════════════════════════════════════

export async function getFornecedor(id: string): Promise<Fornecedor | null> {
  return await kv.get(`fornecedor:${id}`);
}

export async function getFornecedorPorCNPJ(cnpj: string): Promise<Fornecedor | null> {
  const fornecedores = await getAllFornecedores();
  return fornecedores.find(f => f.cnpj === cnpj) || null;
}

export async function getAllFornecedores(): Promise<Fornecedor[]> {
  const fornecedores = await kv.getByPrefix('fornecedor:');
  return fornecedores || [];
}

export async function getFornecedoresPorEstado(estado: EstadoBR): Promise<Fornecedor[]> {
  const fornecedores = await getAllFornecedores();
  return fornecedores.filter(f => f.estado === estado && f.ativo);
}

export async function getFornecedorPorEstadoTipo(
  estado: EstadoBR, 
  tipo: TipoFornecedor
): Promise<Fornecedor | null> {
  const fornecedores = await getFornecedoresPorEstado(estado);
  return fornecedores.find(f => f.tipo === tipo) || null;
}

export async function saveFornecedor(fornecedor: Fornecedor): Promise<void> {
  await kv.set(`fornecedor:${fornecedor.id}`, fornecedor);
  
  // Atualizar mapa de exclusividade
  await atualizarExclusividade(fornecedor.estado, fornecedor.tipo, fornecedor.id);
}

export async function inativarFornecedor(id: string): Promise<void> {
  const fornecedor = await getFornecedor(id);
  if (!fornecedor) throw new Error('Fornecedor não encontrado');
  
  fornecedor.ativo = false;
  fornecedor.dataInativacao = new Date().toISOString();
  await saveFornecedor(fornecedor);
  
  // Liberar exclusividade
  await liberarExclusividade(fornecedor.estado, fornecedor.tipo);
}

// ════════════════════════════════════════════════════════════════════
// 💾 FUNÇÕES DE BANCO DE DADOS - EXCLUSIVIDADE TERRITORIAL
// ════════════════════════════════════════════════════════════════════

export async function getExclusividade(
  estado: EstadoBR, 
  tipo: TipoFornecedor
): Promise<ExclusividadeTerritorial | null> {
  return await kv.get(`exclusividade:${estado}:${tipo}`);
}

export async function verificarVagaDisponivel(
  estado: EstadoBR, 
  tipo: TipoFornecedor
): Promise<boolean> {
  const exclusividade = await getExclusividade(estado, tipo);
  return !exclusividade || exclusividade.fornecedorId === null;
}

export async function atualizarExclusividade(
  estado: EstadoBR, 
  tipo: TipoFornecedor, 
  fornecedorId: string
): Promise<void> {
  const exclusividade: ExclusividadeTerritorial = {
    estado,
    tipo,
    fornecedorId,
    dataOcupacao: new Date().toISOString()
  };
  await kv.set(`exclusividade:${estado}:${tipo}`, exclusividade);
}

export async function liberarExclusividade(
  estado: EstadoBR, 
  tipo: TipoFornecedor
): Promise<void> {
  const exclusividade: ExclusividadeTerritorial = {
    estado,
    tipo,
    fornecedorId: null
  };
  await kv.set(`exclusividade:${estado}:${tipo}`, exclusividade);
}

export async function getMapaExclusividade(): Promise<Record<string, any>> {
  const mapa: Record<string, any> = {};
  
  for (const estado of Object.keys(ESTADOS_BR)) {
    mapa[estado] = {
      nome: ESTADOS_BR[estado as EstadoBR],
      VIDRO: await getExclusividade(estado as EstadoBR, 'VIDRO'),
      ALUMINIO: await getExclusividade(estado as EstadoBR, 'ALUMINIO'),
      ACESSORIOS: await getExclusividade(estado as EstadoBR, 'ACESSORIOS')
    };
  }
  
  return mapa;
}

// ════════════════════════════════════════════════════════════════════
// 🎯 ROTEAMENTO DE PEDIDOS
// ════════════════════════════════════════════════════════════════════

/**
 * REGRA CRÍTICA DO SYSCONECTA:
 * O roteamento é baseado no ESTADO DO VIDRACEIRO (usuário), NÃO no cliente final!
 * 
 * Exemplo:
 * - Vidraceiro em SC → Compra SEMPRE da Santa Rita (SC)
 * - Cliente pode estar em qualquer lugar do Brasil
 * - Fornecedor entrega no ESTADO DO VIDRACEIRO
 */
export async function rotearPedido(
  estadoVidraceiro: EstadoBR,
  tipo: TipoFornecedor
): Promise<Fornecedor | null> {
  return await getFornecedorPorEstadoTipo(estadoVidraceiro, tipo);
}

export async function validarPedido(
  estadoVidraceiro: EstadoBR,
  tipo: TipoFornecedor
): Promise<{ valido: boolean; mensagem: string; fornecedor?: Fornecedor }> {
  const fornecedor = await rotearPedido(estadoVidraceiro, tipo);
  
  if (!fornecedor) {
    return {
      valido: false,
      mensagem: `Nenhum fornecedor de ${tipo} disponível em ${ESTADOS_BR[estadoVidraceiro]} (${estadoVidraceiro})`
    };
  }
  
  return {
    valido: true,
    mensagem: `Pedido roteado para ${fornecedor.nomeFantasia}`,
    fornecedor
  };
}

// ════════════════════════════════════════════════════════════════════
// 💾 FUNÇÕES DE BANCO DE DADOS - CONFIGURAÇÃO
// ════════════════════════════════════════════════════════════════════

export async function getConfiguracao(): Promise<ConfiguracaoSistema> {
  const config = await kv.get('config:sistema');
  
  if (!config) {
    // Configuração padrão
    const defaultConfig: ConfiguracaoSistema = {
      exclusividadeTerritorial: true,
      maxFornecedoresPorEstadoPorTipo: 1,
      industriaVidroAtiva: 'guardian_glass',
      industriaAluminioAtiva: null,
      industriaAcessoriosAtiva: null,
      comissaoMarketplace: {
        min: 3,
        max: 6
      }
    };
    await saveConfiguracao(defaultConfig);
    return defaultConfig;
  }
  
  return config;
}

export async function saveConfiguracao(config: ConfiguracaoSistema): Promise<void> {
  await kv.set('config:sistema', config);
}

// ════════════════════════════════════════════════════════════════════
// 🎬 INICIALIZAÇÃO DO BANCO DE DADOS
// ════════════════════════════════════════════════════════════════════

export async function inicializarBancoDados(): Promise<void> {
  console.log('🚀 Inicializando banco de dados SysConecta...');
  
  // 1. Salvar indústrias
  for (const industria of Object.values(INDUSTRIAS)) {
    await saveIndustria(industria);
    console.log(`✅ Indústria salva: ${industria.nome}`);
  }
  
  // 2. Salvar configuração padrão
  await getConfiguracao();
  console.log('✅ Configuração do sistema salva');
  
  // 3. Criar fornecedor padrão: Santa Rita Vidros (SC)
  const santaRita: Fornecedor = {
    id: 'santa_rita_sc',
    razaoSocial: 'Santa Rita Distribuidora de Vidros LTDA',
    nomeFantasia: 'Santa Rita Vidros',
    cnpj: '12.345.678/0001-90',
    tipo: 'VIDRO',
    estado: 'SC',
    exclusivoEstado: true,
    industriaId: 'guardian_glass',
    responsavel: {
      nome: 'Alexandre',
      email: 'alexandre@santaritavidros.com.br',
      telefone: '(47) 99999-8888'
    },
    endereco: {
      logradouro: 'Rua das Indústrias',
      numero: '1500',
      complemento: 'Galpão 3',
      bairro: 'Distrito Industrial',
      cidade: 'Balneário Camboriú',
      estado: 'SC',
      cep: '88330-000'
    },
    ativo: true,
    dataAdesao: '2024-01-15'
  };
  
  await saveFornecedor(santaRita);
  console.log('✅ Fornecedor Santa Rita (SC) salvo');
  
  // 4. Inicializar mapa de exclusividade para todos os estados
  for (const estado of Object.keys(ESTADOS_BR)) {
    const tipos: TipoFornecedor[] = ['VIDRO', 'ALUMINIO', 'ACESSORIOS'];
    for (const tipo of tipos) {
      const vagaDisponivel = await verificarVagaDisponivel(estado as EstadoBR, tipo);
      if (vagaDisponivel) {
        await liberarExclusividade(estado as EstadoBR, tipo);
      }
    }
  }
  console.log('✅ Mapa de exclusividade territorial inicializado (27 estados × 3 tipos = 81 vagas)');
  
  console.log('🎉 Banco de dados SysConecta inicializado com sucesso!');
}

// ════════════════════════════════════════════════════════════════════
// 📊 RELATÓRIOS E ESTATÍSTICAS
// ════════════════════════════════════════════════════════════════════

export async function getEstatisticas() {
  const fornecedores = await getAllFornecedores();
  const config = await getConfiguracao();
  
  const estatisticas = {
    totalFornecedores: fornecedores.length,
    fornecedoresAtivos: fornecedores.filter(f => f.ativo).length,
    fornecedoresInativos: fornecedores.filter(f => !f.ativo).length,
    
    porTipo: {
      VIDRO: fornecedores.filter(f => f.tipo === 'VIDRO' && f.ativo).length,
      ALUMINIO: fornecedores.filter(f => f.tipo === 'ALUMINIO' && f.ativo).length,
      ACESSORIOS: fornecedores.filter(f => f.tipo === 'ACESSORIOS' && f.ativo).length
    },
    
    vagasDisponiveis: {
      VIDRO: 27 - fornecedores.filter(f => f.tipo === 'VIDRO' && f.ativo).length,
      ALUMINIO: 27 - fornecedores.filter(f => f.tipo === 'ALUMINIO' && f.ativo).length,
      ACESSORIOS: 27 - fornecedores.filter(f => f.tipo === 'ACESSORIOS' && f.ativo).length
    },
    
    totalVagasPossiveis: 81, // 27 estados × 3 tipos
    totalVagasOcupadas: fornecedores.filter(f => f.ativo).length,
    totalVagasDisponiveis: 81 - fornecedores.filter(f => f.ativo).length,
    
    industrias: {
      vidro: config.industriaVidroAtiva,
      aluminio: config.industriaAluminioAtiva || 'Não definida',
      acessorios: config.industriaAcessoriosAtiva || 'Não definida'
    }
  };
  
  return estatisticas;
}

export async function getRelatorioCompleto() {
  const fornecedores = await getAllFornecedores();
  const industrias = await getAllIndustrias();
  const config = await getConfiguracao();
  const mapa = await getMapaExclusividade();
  const stats = await getEstatisticas();
  
  return {
    timestamp: new Date().toISOString(),
    configuracao: config,
    estatisticas: stats,
    fornecedores,
    industrias,
    mapaExclusividade: mapa
  };
}
