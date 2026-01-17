import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, FileText, Loader2, Database, AlertCircle } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { SUPREMA_CORRER_2F } from '../data/tipologias/suprema-correr-2f';
import { 
  calcularCompleto, 
  ConfiguracaoUsuario, 
  ResultadoCalculo 
} from '../utils/calculos-industriais';
import { verificarCompatibilidade, ResultadoCompatibilidade } from '../utils/motor-compatibilidade';
import { VisualizacaoJanelaRealistica } from './VisualizacaoJanelaRealistica';
import { BillOfMaterials } from './BillOfMaterials';

// 🔥 IMPORTAÇÃO DO SISTEMA MESTRE DE VIDROS
import { CATALOGO_VIDROS, VidroSKU } from '../data/catalogoVidrosMestre';

import { buscarPrecos } from '../utils/sync';

// Tipo que vem do Gestor de Preços (GestaoPrecos.tsx)
interface PrecoItem {
  custoBase: number;
  margemLucro: number;
  precoVenda: number;
  ativo: boolean;
}

type TabelaPrecos = Record<string, PrecoItem>;

interface ConfiguradorSupremaCompletoProps {
  onVoltar?: () => void;
  onFinalizar?: (config: any, resultado: any) => void;
  fornecedorId?: string; // ID do fornecedor para carregar tabela específica
  fornecedorUF?: string; // UF para garantir regionalização
  initialConfig?: ConfiguracaoUsuario; // 🔥 RECUPERAR RASCUNHO
}

export function ConfiguradorSupremaCompleto({ onVoltar, onFinalizar, fornecedorId = 'santa-rita-vidros', fornecedorUF = 'SC', initialConfig }: ConfiguradorSupremaCompletoProps) {
  // Estado do Catálogo (Agora é um Mapa SKU -> Preço)
  const [tabelaPrecos, setTabelaPrecos] = useState<TabelaPrecos>({});
  const [loadingCatalogo, setLoadingCatalogo] = useState(true);
  
  const [config, setConfig] = useState<ConfiguracaoUsuario>(initialConfig || {
    largura_total_mm: 2000,
    altura_total_mm: 2100,
    tipo_vidro: 'Temperado', // Case sensitive conforme catalogoVidrosMestre
    espessura_vidro: 8,
    cor_aluminio: 'BRANCO',
    tem_contra_marco: false,
    configuracao_folhas: '1_MOVEL_1_FIXA',
    tipo_puxador: 'SIMPLES',
    tipo_fechadura: 'FECHO_SIMPLES',
    cor_vidro: 'Incolor'
  });

  const [quantidade, setQuantidade] = useState(1);
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [compatibilidade, setCompatibilidade] = useState<ResultadoCompatibilidade | null>(null);
  
  const [modoRevisao, setModoRevisao] = useState(false);
  const [visualizacaoAtiva, setVisualizacaoAtiva] = useState<'realistica' | '3d' | 'bom'>('realistica');

  // 🔥 1. DETERMINAR ID DO FORNECEDOR BASEADO NO ESTADO (SE NÃO FOR PASSADO)
  const [realFornecedorId, setRealFornecedorId] = useState(fornecedorId);

  useEffect(() => {
    // Mapeamento de Fornecedores por Estado
    const MAPA_FORNECEDORES: Record<string, string> = {
        'SC': 'santa-rita-vidros',
        'SP': 'tempermax-sp',
        'PR': 'vidros-parana',
        'RS': 'vidros-sul',
        'RJ': 'vidros-rio',
        'MG': 'vidros-minas',
        // Default
        'DEFAULT': 'santa-rita-vidros'
    };

    if (fornecedorUF) {
        const idEncontrado = MAPA_FORNECEDORES[fornecedorUF] || MAPA_FORNECEDORES['DEFAULT'];
        // Só substitui se o prop fornecedorId for o default ('santa-rita-vidros')
        // Se foi passado um ID específico via prop, respeita ele.
        if (fornecedorId === 'santa-rita-vidros') {
            console.log(`📍 Detectado Estado ${fornecedorUF} -> Usando Fornecedor: ${idEncontrado}`);
            setRealFornecedorId(idEncontrado);
        } else {
            setRealFornecedorId(fornecedorId);
        }
    }
  }, [fornecedorUF, fornecedorId]);

  // 🔥 2. CARREGAR TABELA DE PREÇOS REAL DO FORNECEDOR (KV STORE)
  useEffect(() => {
    async function carregarTabelaPrecos() {
      try {
        setLoadingCatalogo(true);
        console.log(`🔄 Buscando tabela de preços no KV Store: ${realFornecedorId}`);
        
        // 🔥 BUSCA DIRETA NO KV STORE (Garante consistência com o que foi salvo em GestaoPrecos)
        const dados = await buscarPrecos(realFornecedorId);

        if (dados && Object.keys(dados).length > 0) {
          console.log(`✅ Tabela carregada do KV Store: ${Object.keys(dados).length} itens`);
          setTabelaPrecos(dados);
        } else {
          console.warn('⚠️ Tabela vazia ou não encontrada no KV Store. Usando preços zerados.');
          // Tenta carregar tabela default de fallback se quiser
        }
      } catch (err) {
        console.error('❌ Erro ao carregar preços:', err);
      } finally {
        setLoadingCatalogo(false);
      }
    }
    carregarTabelaPrecos();
  }, [realFornecedorId]);

  // 🔥 3. FILTRAGEM INTELIGENTE DE OPÇÕES (Baseada no Mestre + Disponibilidade Real)
  
  // Helper para verificar se um item do catálogo mestre está ativo na tabela do fornecedor
  const isItemAtivo = (itemMestre: VidroSKU) => {
      if (Object.keys(tabelaPrecos).length === 0) return false;
      const skuId = itemMestre.id; 
      const itemPreco = tabelaPrecos[skuId];
      return itemPreco && itemPreco.ativo;
  };

  // 🔥 VALIDAÇÃO TÉCNICA DA TIPOLOGIA
  const isTecnicamentePermitido = (categoria: string, espessura?: number) => {
      const regrasVidro = SUPREMA_CORRER_2F.vidro;
      
      // 1. Validação de Categoria/Tipo
      // A tipologia mistura Cor e Tipo, então fazemos uma verificação permissiva
      const catUpper = categoria.toUpperCase();
      const isTipoPermitido = regrasVidro.tipos_permitidos.some(t => {
          if (t === 'TEMPERADO' && catUpper === 'TEMPERADO') return true;
          if (t === 'LAMINADO' && catUpper === 'LAMINADO') return true;
          if (t === 'CONTROLE_SOLAR' && catUpper === 'CONTROLE SOLAR') return true;
          if (t === 'DECORATIVO' && catUpper === 'DECORATIVO') return true;
          // Float é base, geralmente aceito se a cor bater (mas aqui simplificamos)
          if (catUpper === 'FLOAT') return true; 
          return false;
      });

      if (!isTipoPermitido) return false;

      // 2. Validação de Espessura
      if (espessura !== undefined) {
          return regrasVidro.espessuras_mm.some(e => {
              if (typeof e === 'number') return e === espessura;
              // Suporte a strings como "3+3" (laminado 6mm)
              if (typeof e === 'string') {
                  const num = parseInt(e); // "3+3" -> 3? Não. ParseInt pega o primeiro numero.
                  // Melhor lógica:
                  if (e === '3+3' && espessura === 6) return true;
                  if (e === '4+4' && espessura === 8) return true;
                  return false;
              }
              return false;
          });
      }

      return true;
  };

  const getTiposDisponiveis = () => {
      const categoriasAtivas = new Set<string>();
      CATALOGO_VIDROS.forEach(v => {
          if (isItemAtivo(v)) {
              categoriasAtivas.add(v.categoria);
          }
      });
      return [...categoriasAtivas];
  };

  const getEspessurasDisponiveis = () => {
      // Retorna TODAS as espessuras ativas do fornecedor para essa categoria
      // Mas marca quais são tecnicamente viáveis
      const todasEspessuras = [...new Set(CATALOGO_VIDROS
          .filter(v => v.categoria === config.tipo_vidro && isItemAtivo(v))
          .map(v => v.espessura)
      )].sort((a, b) => a - b);

      return todasEspessuras.map(esp => ({
          valor: esp,
          permitido: isTecnicamentePermitido(config.tipo_vidro, esp)
      }));
  };

  const getCoresDisponiveis = () => {
      return [...new Set(CATALOGO_VIDROS
          .filter(v => v.categoria === config.tipo_vidro && 
                       v.espessura === config.espessura_vidro && 
                       isItemAtivo(v))
          .map(v => v.cor)
      )];
  };

  const [precoAtualVidro, setPrecoAtualVidro] = useState(0);

  // 🔥 3. CÁLCULO DINÂMICO DE PREÇO E ENGENHARIA
  useEffect(() => {
    // A. Gerar o ID do SKU atual baseada na seleção
    const tipoStr = config.tipo_vidro || 'Temperado';
    const corStr = config.cor_vidro || 'Incolor';
    
    // Mesma lógica de geração de ID do catalogoVidrosMestre.ts
    const skuId = `${tipoStr.toLowerCase().replace(/\s+/g, '-')}-${corStr.toLowerCase().replace(/\s+/g, '-')}-${config.espessura_vidro}mm`
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    console.log(`🔍 BUSCANDO PREÇO: SKU=[${skuId}]`);

    // B. Buscar preço na tabela carregada
    let itemPreco = tabelaPrecos[skuId];
    
    // 🔥 BUSCA FLEXÍVEL (FALLBACK)
    if (!itemPreco) {
        console.warn(`⚠️ SKU exato [${skuId}] não encontrado. Tentando variações...`);
        
        // Tenta Uppercase (ex: TEMPERADO-INCOLOR-8MM)
        const skuUpper = skuId.toUpperCase();
        if (tabelaPrecos[skuUpper]) {
            console.log(`✅ Encontrado via Uppercase: ${skuUpper}`);
            itemPreco = tabelaPrecos[skuUpper];
        } 
        // Tenta sem 'mm' (ex: temperado-incolor-8)
        else {
             const skuSemMM = skuId.replace('mm', '');
             if (tabelaPrecos[skuSemMM]) {
                 console.log(`✅ Encontrado sem 'mm': ${skuSemMM}`);
                 itemPreco = tabelaPrecos[skuSemMM];
             }
             // Tenta com espaços (ex: temperado incolor 8mm)
             else {
                 const skuSpaces = skuId.replace(/-/g, ' ');
                 if (tabelaPrecos[skuSpaces]) {
                     itemPreco = tabelaPrecos[skuSpaces];
                 }
             }
        }
    }
    
    // Debug das chaves disponíveis se falhar tudo
    if (!itemPreco && Object.keys(tabelaPrecos).length > 0) {
        console.log("📋 Chaves disponíveis na tabela (Amostra):", Object.keys(tabelaPrecos).slice(0, 5));
    }

    let precoM2 = 0;
    
    if (itemPreco && itemPreco.ativo) {
        precoM2 = itemPreco.precoVenda;
        console.log(`✅ PREÇO ENCONTRADO: R$ ${precoM2.toFixed(2)}`);
    } else {
        console.warn(`❌ PREÇO NÃO ENCONTRADO PARA SKU: ${skuId}`);
        // SEM FALLBACK. Se o fornecedor não cadastrou, o preço é ZERO.
        // Regra de Ouro: Nunca inventar preços.
        precoM2 = 0; 
    }

    if (precoM2 !== precoAtualVidro) {
        setPrecoAtualVidro(precoM2);
    }

    // C. Injetar preço e calcular
    const configComPreco = {
        ...config,
        preco_unitario_vidro_m2: precoM2
    };

    const novoResultado = calcularCompleto(configComPreco, SUPREMA_CORRER_2F);
    setResultado(novoResultado);

    const novaCompatibilidade = verificarCompatibilidade(config, SUPREMA_CORRER_2F, novoResultado.vidros);
    setCompatibilidade(novaCompatibilidade);

  }, [config.largura_total_mm, config.altura_total_mm, config.tipo_vidro, config.espessura_vidro, config.cor_vidro, config.tem_contra_marco, config.configuracao_folhas, config.tipo_puxador, config.tipo_fechadura, tabelaPrecos]); // Dependências explícitas para evitar loop com config inteiro se eu fosse atualizar config


  // 🔥 AUTO-CORREÇÃO DE SELEÇÃO INVÁLIDA
  useEffect(() => {
     // Verifica se a espessura atual é permitida na tipologia
     const espPermitida = isTecnicamentePermitido(config.tipo_vidro, Number(config.espessura_vidro));
     
     if (!espPermitida) {
         // Tenta achar a primeira permitida que esteja ativa
         const disponiveis = getEspessurasDisponiveis().filter(e => e.permitido);
         if (disponiveis.length > 0) {
             console.log(`⚠️ Correção: ${config.espessura_vidro}mm inválido para ${config.tipo_vidro}. Mudando para ${disponiveis[0].valor}mm`);
             setConfig(prev => ({...prev, espessura_vidro: disponiveis[0].valor}));
         }
     }
  }, [config.tipo_vidro, tabelaPrecos]); // Roda quando carrega tabela também

  // ========================================
  // AÇÕES E RENDER
  // ========================================

  const handleSalvar = () => {
    if (onFinalizar && resultado) {
      
      // 🔥 GERAÇÃO DE SAÍDAS ESPECÍFICAS POR PERFIL (LÓGICA CORRIGIDA)
      
      // 1. Visão do Fornecedor de Vidro (MANUFATURA - Medidas Exatas)
      const outputFornecedorVidro = {
        tipo: 'ordem_producao_vidro',
        cliente: 'Vidraceiro',
        pecas: resultado.vidros.map(v => ({
            id: v.id,
            descricao: `${config.tipo_vidro} ${config.espessura_vidro}mm ${v.cor || 'INCOLOR'}`,
            largura_corte_mm: v.largura, 
            altura_corte_mm: v.altura,
            metro_quadrado_real: (v.largura * v.altura) / 1000000,
            processamento: 'CORTE + LAPIDAÇÃO' + (config.tipo_vidro === 'TEMPERADO' ? ' + TÊMPERA' : ''),
            furos: []
        })),
        area_total_m2: resultado.resumo.area_total_vidro_m2
      };

      // 2. Visão do Fornecedor de Alumínio (COMMODITY - Venda por Barras)
      const perfisAgrupados: Record<string, {
         descricao: string;
         total_mm_necessario: number;
         lista_cortes_para_vidraceiro: number[];
      }> = {};

      resultado.perfis.forEach(perfil => {
         if (!perfisAgrupados[perfil.codigo]) {
             perfisAgrupados[perfil.codigo] = {
                 descricao: perfil.descricao,
                 total_mm_necessario: 0,
                 lista_cortes_para_vidraceiro: []
             };
         }
         perfisAgrupados[perfil.codigo].total_mm_necessario += (perfil.medida * perfil.quantidade);
         for(let i=0; i < perfil.quantidade; i++) {
             perfisAgrupados[perfil.codigo].lista_cortes_para_vidraceiro.push(perfil.medida);
         }
      });

      const COMPRIMENTO_BARRA_PADRAO = 6000;
      
      const listaCompraAluminio = Object.entries(perfisAgrupados).map(([codigo, dados]) => {
          const barras_necessarias = Math.ceil(dados.total_mm_necessario / COMPRIMENTO_BARRA_PADRAO);
          const total_comprado_mm = barras_necessarias * COMPRIMENTO_BARRA_PADRAO;
          const sobra_mm = total_comprado_mm - dados.total_mm_necessario;

          return {
              codigo_perfil: codigo,
              descricao: dados.descricao,
              unidade_venda: 'BARRA 6M',
              qtd_barras_compra: barras_necessarias,
              total_consumo_mm: dados.total_mm_necessario,
              sobra_total_mm: sobra_mm,
              mapa_corte_sugerido: dados.lista_cortes_para_vidraceiro
          };
      });

      const outputFornecedorAluminio = {
        tipo: 'pedido_venda_aluminio',
        cor: config.cor_aluminio,
        linha: 'SUPREMA',
        itens_venda: listaCompraAluminio,
        peso_total_estimado_kg: resultado.resumo.peso_total_aluminio_kg
      };

      const pacoteCompleto = {
        ...config,
        preco_unitario_vidro_m2: precoAtualVidro, // 🔥 Garante que o preço vai para o resumo
        quantidade,
        dados_tecnicos: {
            vidro: outputFornecedorVidro,
            aluminio: outputFornecedorAluminio,
            acessorios: resultado.componentes
        },
        meta_dados: {
            criado_por: 'fornecedor_id_real', 
            data_criacao: new Date().toISOString(),
            versao_sistema: '2.1-optimized-bars'
        }
      };

      onFinalizar(pacoteCompleto, resultado);
    }
  };

  const handleSalvarEContinuar = () => {
    handleSalvar();
    // A navegação ou lógica extra de "Continuar" é tratada no handleSalvar (que chama onFinalizar)
    // Se o onFinalizar abrir o Resumo, lá teremos o botão final.
    // Mas o prompt pediu pra mudar a ESCRITA do botão de "Salvar Orçamento" para "Salvar e Continuar".
    // Vou procurar onde esse botão é renderizado.
  };

  const mapCorAbreviada = (cor: string) => {
    const mapa: Record<string, string> = { 'BRANCO': 'BCO', 'PRETO': 'PTO', 'FOSCO': 'FOS', 'BRONZE': 'BRZ', 'CROMADO': 'CRO' };
    return mapa[cor] || cor;
  };

  if (loadingCatalogo) {
    return (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col items-center justify-center animate-pulse">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <h2 className="text-lg font-bold text-slate-700">Conectando ao Fornecedor...</h2>
            <p className="text-sm text-slate-500">Buscando tabela de preços atualizada em tempo real</p>
        </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col animate-in fade-in duration-300">
      
      {/* 1. HEADER MINIMALISTA */}
      <div className="bg-white px-6 py-3 border-b border-slate-100 flex items-center justify-between z-20 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={modoRevisao ? () => { setModoRevisao(false); setVisualizacaoAtiva('realistica'); } : onVoltar}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2]" />
            <span className="font-medium text-sm">{modoRevisao ? 'Voltar p/ Config' : 'Voltar'}</span>
          </button>
          <div className="h-4 w-px bg-slate-200"></div>
          <div className="flex flex-col">
             <h1 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {modoRevisao ? 'Resumo de Materiais' : 'Configurador Suprema'}
             </h1>
             <span className="text-[10px] text-green-600 flex items-center gap-1">
                <Database className="w-3 h-3" /> Tabela: {fornecedorId} ({fornecedorUF})
             </span>
          </div>
        </div>
      </div>

      {/* 2. CONTEÚDO PRINCIPAL */}
      {!modoRevisao ? (
         <div className="flex-1 flex flex-col h-full overflow-hidden">
            
            {/* A. VISUALIZAÇÃO */}
            <div className="flex-1 bg-slate-100/50 relative flex items-center justify-center p-8 overflow-hidden">
                <div className="relative transform scale-110 transition-transform duration-500 hover:scale-125 drop-shadow-2xl">
                    <VisualizacaoJanelaRealistica config={config} />
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-mono text-slate-500 border border-slate-200 shadow-sm">
                    {config.largura_total_mm}mm x {config.altura_total_mm}mm
                </div>
            </div>

            {/* B. CONFIGURAÇÃO (AGORA COM DROPDOWNS DO MESTRE) */}
            <div className="bg-white border-t border-slate-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-30 flex flex-col">
                <div className="px-6 py-2 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Configuração Técnica</span>
                    <button 
                        onClick={() => { setModoRevisao(true); setVisualizacaoAtiva('bom'); }}
                        className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                        <FileText className="w-3 h-3" /> Ver Lista de Materiais
                    </button>
                </div>

                <div className="p-2 md:p-6 pb-24 md:pb-8 overflow-y-auto md:overflow-visible max-h-[40vh] md:max-h-none">
                    <div className="max-w-5xl mx-auto grid grid-cols-12 gap-2 md:flex md:flex-wrap md:items-end md:justify-center">
                        
                        {/* DIMENSÕES */}
                        <div className="col-span-4 md:w-auto group relative bg-white p-2 rounded-xl border border-slate-200 hover:border-blue-400 transition-colors shadow-sm">
                            <span className="absolute -top-2 left-2 px-1 bg-white text-[8px] font-bold text-slate-400 uppercase">Dimens��es do Vão</span>
                            <div className="flex flex-col gap-1 items-center justify-center h-full">
                                <div className="flex items-center gap-1">
                                    <div className="w-12">
                                        <input
                                            type="number"
                                            value={config.largura_total_mm}
                                            onChange={(e) => setConfig({...config, largura_total_mm: parseInt(e.target.value) || 0})}
                                            className="w-full text-center font-bold text-xs text-slate-900 border-b border-slate-200 focus:border-blue-500 outline-none pb-0.5"
                                            placeholder="L"
                                        />
                                    </div>
                                    <span className="text-slate-300 text-[9px]">x</span>
                                    <div className="w-12">
                                        <input
                                            type="number"
                                            value={config.altura_total_mm}
                                            onChange={(e) => setConfig({...config, altura_total_mm: parseInt(e.target.value) || 0})}
                                            className="w-full text-center font-bold text-xs text-slate-900 border-b border-slate-200 focus:border-blue-500 outline-none pb-0.5"
                                            placeholder="A"
                                        />
                                    </div>
                                </div>
                                <span className="text-[8px] text-slate-400">Largura x Altura</span>
                            </div>
                        </div>

                        {/* VIDROS E PERFIS (INTEGRADO) */}
                        <div className="col-span-8 md:w-auto group relative bg-white p-2 rounded-xl border border-slate-200 hover:border-blue-400 transition-colors shadow-sm flex flex-col gap-1.5">
                             <span className="absolute -top-2 left-2 px-1 bg-white text-[8px] font-bold text-slate-400 uppercase">Perfis e Vidros</span>
                             
                             <div className="grid grid-cols-2 gap-2">
                                 <div>
                                    <label className="block text-[8px] text-slate-400 mb-0.5">Cor Alumínio</label>
                                    <select
                                        value={config.cor_aluminio}
                                        onChange={(e) => setConfig({...config, cor_aluminio: e.target.value})}
                                        className="w-full h-7 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-900 outline-none px-1"
                                    >
                                        {SUPREMA_CORRER_2F.cores_aluminio.map(cor => (
                                            <option key={cor} value={cor}>{mapCorAbreviada(cor)}</option>
                                        ))}
                                    </select>
                                 </div>
                                 
                                 {/* TIPO VIDRO (DO MESTRE) */}
                                 <div>
                                    <label className="block text-[8px] text-slate-400 mb-0.5">Tipo Vidro</label>
                                    <select
                                        value={config.tipo_vidro}
                                        onChange={(e) => setConfig({...config, tipo_vidro: e.target.value})}
                                        className="w-full h-7 bg-blue-50 border border-blue-200 rounded-lg text-[10px] font-bold text-blue-900 outline-none px-1"
                                    >
                                        {getTiposDisponiveis().map(tipo => (
                                            <option key={tipo} value={tipo}>{tipo}</option>
                                        ))}
                                    </select>
                                 </div>
                             </div>

                             <div className="w-full pt-1 border-t border-slate-50 flex gap-2">
                                <div className="flex-1">
                                    <label className="text-[8px] text-slate-400 block">Espessura</label>
                                    <select
                                        value={config.espessura_vidro}
                                        onChange={(e) => setConfig({...config, espessura_vidro: parseInt(e.target.value)})}
                                        className="w-full h-6 bg-blue-50 border border-blue-200 rounded text-[10px] font-bold text-blue-900 outline-none px-1"
                                    >
                                        {getEspessurasDisponiveis().map(item => (
                                            <option 
                                                key={item.valor} 
                                                value={item.valor}
                                                disabled={!item.permitido}
                                                className={!item.permitido ? 'text-slate-400 bg-slate-100' : ''}
                                            >
                                                {item.valor}mm {!item.permitido ? '(Indisp.)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="text-[8px] text-slate-400 block">Cor</label>
                                    <select
                                        value={config.cor_vidro || 'Incolor'}
                                        onChange={(e) => setConfig({...config, cor_vidro: e.target.value})}
                                        className="w-full h-6 bg-blue-50 border border-blue-200 rounded text-[10px] font-bold text-blue-900 outline-none px-1 uppercase"
                                    >
                                        {getCoresDisponiveis().map(cor => (
                                            <option key={cor} value={cor}>{cor}</option>
                                        ))}
                                    </select>
                                </div>
                             </div>
                        </div>

                        {/* ACESSÓRIOS */}
                        <div className="col-span-12 md:w-auto group relative bg-white p-2 rounded-xl border border-slate-200 hover:border-blue-400 transition-colors shadow-sm flex items-center justify-between gap-3 md:flex-col md:items-start md:min-w-[160px]">
                             <span className="absolute -top-2 left-2 px-1 bg-white text-[8px] font-bold text-slate-400 uppercase">Acessórios</span>
                             <div className="flex-1 md:w-full">
                                <label className="block text-[8px] text-slate-400 mb-0.5">Fechadura</label>
                                <select
                                    value={config.tipo_fechadura}
                                    onChange={(e) => setConfig({...config, tipo_fechadura: e.target.value})}
                                    className="w-full h-7 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-900 outline-none px-1"
                                >
                                   <option value="FECHO_SIMPLES">Manual (Concha)</option>
                                   <option value="FECHO_CENTRAL">Automática (Click)</option>
                                   <option value="FECHO_COM_CHAVE">Chave (Bico de Papagaio)</option>
                                </select>
                             </div>
                             <div className="flex items-center gap-2 pt-0 md:pt-2 md:mt-auto md:border-t md:border-slate-50">
                                <span className="text-[9px] font-bold text-slate-600">Contra Marco</span>
                                <label className="relative w-8 h-4 rounded-full cursor-pointer transition-colors duration-300">
                                    <input 
                                        type="checkbox" 
                                        className="hidden"
                                        checked={config.tem_contra_marco}
                                        onChange={() => setConfig({...config, tem_contra_marco: !config.tem_contra_marco})}
                                    />
                                    <div className={`w-full h-full rounded-full transition-colors ${config.tem_contra_marco ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300 ${config.tem_contra_marco ? 'translate-x-4' : 'translate-x-0'}`} />
                                </label>
                             </div>
                        </div>

                        {/* BOTÃO AÇÃO */}
                        <div className="col-span-12 md:col-span-auto md:ml-auto flex items-center justify-between gap-3 mt-1 md:mt-0">
                            <div className="flex items-center gap-2 md:block md:text-right">
                                <span className="text-[10px] text-slate-400 font-bold uppercase mr-2 md:mr-0">Qtd:</span>
                                <input
                                    type="number"
                                    value={quantidade}
                                    onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-12 text-center md:text-right font-bold text-slate-900 border-b border-slate-200 outline-none"
                                />
                            </div>
                            <button
                                onClick={handleSalvarEContinuar}
                                className="flex-1 md:flex-none h-10 md:h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold uppercase tracking-wide shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4 md:w-5 md:h-5" />
                                <span>Salvar e Continuar</span>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
         </div>
      ) : (
         // MODO REVISÃO
         <div className="flex-1 bg-slate-50 overflow-y-auto pb-32">
            <div className="max-w-4xl mx-auto p-4 md:p-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h2 className="font-bold text-slate-800 text-lg">Lista de Materiais e Cortes</h2>
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                           {quantidade} unidade(s)
                        </span>
                    </div>
                    <div className="p-4 bg-blue-50 border-b border-blue-100 text-sm text-blue-800">
                        <p className="font-bold mb-1">ℹ️ Nota de Engenharia:</p>
                        <p>Otimização de barras (6m) e desenho técnico de vidros aplicados.</p>
                    </div>
                    {resultado && <BillOfMaterials config={{...config, preco_unitario_vidro_m2: precoAtualVidro}} resultado={resultado} mostrarPrecos={true} />}
                </div>
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={() => {
                            setModoRevisao(false);
                            setVisualizacaoAtiva('realistica');
                        }}
                        className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600 rounded-xl font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Voltar e Editar
                    </button>
                    <button
                        onClick={() => handleSalvar()}
                        className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold uppercase tracking-wide shadow-lg shadow-emerald-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <FileText className="w-5 h-5" />
                        Concluir e Voltar
                    </button>
                </div>
            </div>
         </div>
      )}
    </div>
  );
}