/**
 * 🔥 ORÇAMENTO MANUAL - SYSCONECTA
 * FLUXO COMPLETO COM PERSISTÊNCIA NO SUPABASE
 * 
 * ETAPAS:
 * 1. Cliente (novo ou existente)
 * 2. Escolher Linha (SUPREMA)
 * 3. Escolher Produto (Janela Correr 2 Folhas)
 * 4. Configuração Completa
 * 5. Resumo do Orçamento
 * 6. Lista de Material em Tempo Real
 * 7. Comprar Materiais
 * 8. Seleção de Insumos
 * 9. Pagamento QR Code
 * 10. Anexo de Comprovante
 * 11. Envio aos Fornecedores
 * 12. Acompanhamento de Status
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ArrowRight, User, Search, Plus, Check, 
  Package, DollarSign, Upload, Send, X, Loader2,
  AlertCircle, CheckCircle, Clock, Truck, FileText
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ConfiguradorSupremaCompleto } from './ConfiguradorSupremaCompleto';
import { ResumoOrcamentoCompleto } from './ResumoOrcamentoCompleto';
import { IdentificacaoCliente, DadosCliente } from './IdentificacaoCliente';
import { projectId, publicAnonKey } from '../utils/supabase/info';

import { salvarNoBanco } from '../utils/sync';

interface OrcamentoManualProps {
  usuario: {
    id: string;
    nomeEmpresa: string; // 🔥 NOME REAL DA VIDRAÇARIA
    estado: string;
    perfil: string;
    telefone?: string;
    email?: string;
    cnpj?: string;
    endereco?: string;
    cidade?: string;
  };
  onVoltar: () => void;
  clientes?: any[];
  onAdicionarCliente?: (cliente: any) => void;
  isFornecedor?: boolean;
  onPedidosCriados?: (pedidos: any[]) => void;
  onSalvar?: (orcamento: any) => void;
}

type Etapa = 
  | 'cliente'
  | 'linha'
  | 'produto'
  | 'configuracao'
  | 'resumo'
  | 'lista-material'
  | 'comprar'
  | 'pagamento'
  | 'comprovante'
  | 'acompanhamento';

// Interface estendida para suportar novos campos
interface Cliente {
  id?: string | number;
  nome: string;
  cpf_cnpj: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  estado: string;
  perfil?: string; // NOVO
}

interface Material {
  codigo: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  medida?: string;
  origem: 'estoque' | 'compra';
  categoria: 'vidro' | 'aluminio' | 'acessorio';
  fornecedor?: string;
  valor_unitario?: number;
  valor_total?: number;
}

interface Pedido {
  id: string;
  fornecedor_id: string;
  fornecedor_nome: string;
  categoria: string;
  itens: Material[];
  valor_total: number;
  status: 'aguardando_comprovante' | 'enviado' | 'aprovado' | 'producao' | 'transporte' | 'entregue' | 'recusado';
  qr_code_pix?: string;
  comprovante_url?: string;
  data_envio?: string;
  data_atualizacao?: string;
}

export function OrcamentoManual({ usuario, onVoltar, clientes = [], onAdicionarCliente, isFornecedor = false, onPedidosCriados, onSalvar }: OrcamentoManualProps) {
  const [etapaAtual, setEtapaAtual] = useState<Etapa>('cliente');
  const [loading, setLoading] = useState(false);
  
  // DADOS DO ORÇAMENTO
  const [orcamentoId, setOrcamentoId] = useState<string>('');
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [linhaEscolhida, setLinhaEscolhida] = useState<string>('');
  const [produtoEscolhido, setProdutoEscolhido] = useState<string>('');
  const [configuracao, setConfiguracao] = useState<any>(null);
  const [itensOrcamento, setItensOrcamento] = useState<any[]>([]); // 🔥 NOVO: Suporte a múltiplos itens
  const [listaMaterial, setListaMaterial] = useState<Material[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  
  // ESTADOS DE INTERFACE
  const [modoCliente, setModoCliente] = useState<'novo' | 'buscar'>('novo');
  const [clientesBusca, setClientesBusca] = useState<Cliente[]>([]);
  const [buscaTexto, setBuscaTexto] = useState('');
  const [novoCliente, setNovoCliente] = useState<Cliente>({
    nome: '',
    cpf_cnpj: '',
    telefone: '',
    email: '',
    endereco: '',
    cidade: '',
    estado: usuario.estado
  });
  
  const [categoriasCompra, setCategoriasCompra] = useState({
    vidro: true,
    aluminio: true,
    acessorio: true
  });
  
  const [comprovanteFile, setComprovanteFile] = useState<File | null>(null);

  const handleNovoOrcamento = () => {
    setCliente(null);
    setLinhaEscolhida('');
    setProdutoEscolhido('');
    setConfiguracao(null);
    setListaMaterial([]);
    setPedidos([]);
    setEtapaAtual('cliente'); 
    setModoCliente('novo'); 
    window.scrollTo(0,0);
    toast.success('Pronto para novo orçamento!');
  };

  // ========================================
  // ETAPA 1: CLIENTE
  // ========================================
  
  const handleNovoClienteSalvo = async (dados: DadosCliente) => {
      // Adapter para o formato interno Cliente
      const clienteFormatado: Cliente = {
          id: dados.id || `cli-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          nome: dados.nome,
          cpf_cnpj: dados.cpf_cnpj || '',
          telefone: dados.telefone,
          email: dados.email || '',
          endereco: dados.endereco,
          cidade: dados.cidade || '',
          estado: usuario.estado,
          perfil: dados.perfil
      };

      // 1. Notifica o pai (App.tsx) para salvar no banco
      if (onAdicionarCliente) {
          onAdicionarCliente({
            ...clienteFormatado,
            usuario_id: usuario.id,
            createdAt: new Date().toISOString()
          });
      }

      // 1.5. Salvar DIRETO no banco também (garantia dupla)
      try {
          await salvarNoBanco('cliente', clienteFormatado.id, {
              ...clienteFormatado,
              usuario_id: usuario.id,
              createdAt: new Date().toISOString()
          }, usuario.id);
      } catch (error) {
          console.error('Erro ao salvar cliente:', error);
      }

      // 2. Atualiza estado local e avança
      setCliente(clienteFormatado);
      toast.success('Cliente cadastrado com sucesso!');
      
      setTimeout(() => {
          setEtapaAtual('linha');
      }, 100);
  };

  const selecionarCliente = (clienteSelecionado: any) => {
    // Adapter simples caso venha do novo componente
    const clienteFormatado: Cliente = {
        ...clienteSelecionado,
        perfil: clienteSelecionado.perfil || 'Não informado'
    };
    
    setCliente(clienteFormatado);
    toast.success(`Cliente ${clienteFormatado.nome} selecionado`);
    setEtapaAtual('linha');
  };

  // ========================================
  // ETAPA 2: LINHA (SUPREMA)
  // ========================================
  
  const selecionarLinha = (linha: string) => {
    setLinhaEscolhida(linha);
    toast.success(`Linha ${linha} selecionada`);
    setEtapaAtual('produto');
  };

  // ========================================
  // ETAPA 3: PRODUTO
  // ========================================
  
  const selecionarProduto = (produto: string) => {
    setProdutoEscolhido(produto);
    toast.success(`Produto ${produto} selecionado`);
    setEtapaAtual('configuracao');
  };

  // ========================================
  // ETAPA 4: CONFIGURAÇÃO
  // ========================================
  
  const finalizarConfiguracao = (config: any, materiais: Material[]) => {
    // 1. Criar novo item do orçamento
    const novoItem = {
        id: Date.now(),
        linha: linhaEscolhida,
        produto: produtoEscolhido,
        configuracao: config,
        materiais: materiais
    };

    // 2. Adicionar à lista de itens
    const novosItens = [...itensOrcamento, novoItem];
    setItensOrcamento(novosItens);

    // 3. Atualizar lista total de materiais (flat) para o resumo
    const materiaisTotais = novosItens.flatMap(item => item.materiais);
    setListaMaterial(materiaisTotais);
    
    // 4. Configuração atual (para referência imediata)
    setConfiguracao(config);

    // 5. Salvar parcialmente (opcional)
    // salvarOrcamento(config, materiaisTotais);
    
    setEtapaAtual('resumo');
  };

  const salvarOrcamento = async (config: any, materiais: Material[]) => {
    // 🔥 PERSISTÊNCIA REDUNDANTE (SEGURANÇA CONTRA FALHAS DE API)
    if (onSalvar) {
        onSalvar({
            id: orcamentoId || `orc-${Date.now()}`,
            usuario_id: usuario.id,
            cliente: cliente,
            cliente_id: cliente?.id,
            linha: linhaEscolhida,
            produto: produtoEscolhido,
            configuracao: config,
            materiais: materiais,
            itens: materiais, 
            status: 'rascunho',
            valorTotal: materiais.reduce((acc, m) => acc + (m.valor_total || 0), 0),
            dataOrcamento: new Date().toISOString()
        });
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/orcamentos`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            usuario_id: usuario.id,
            cliente_id: cliente?.id,
            linha: linhaEscolhida,
            produto: produtoEscolhido,
            configuracao: config,
            materiais: materiais,
            status: 'configurando'
          })
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setOrcamentoId(data.orcamento_id);
        toast.success('Orçamento salvo!');
      }
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error);
    }
  };

  // ========================================
  // ETAPA 5: RESUMO
  // ========================================
  
  const voltarParaConfiguracao = () => {
    setEtapaAtual('configuracao');
  };

  const confirmarResumo = () => {
    setEtapaAtual('lista-material');
  };

  // ========================================
  // ETAPA 6: COMPRAR MATERIAIS
  // ========================================
  
  const iniciarCompra = async () => {
    setLoading(true);
    try {
      // Buscar fornecedores do estado
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/fornecedores/estado/${usuario.estado}`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        const fornecedores = data.fornecedores || [];
        
        // Separar materiais por categoria e criar pedidos
        const pedidosCriados: Pedido[] = [];
        
        if (categoriasCompra.vidro) {
          const materiaisVidro = listaMaterial.filter(m => m.categoria === 'vidro');
          const fornecedorVidro = fornecedores.find((f: any) => f.tipoFornecedor === 'vidros');
          
          if (materiaisVidro.length > 0 && fornecedorVidro) {
            pedidosCriados.push({
              id: `PED-${Date.now()}-${Math.floor(Math.random()*1000)}`, // ID Único e curto
              fornecedor_id: fornecedorVidro.id || 'santa-rita-vidros', // Fallback seguro
              fornecedor_nome: fornecedorVidro.nomeEmpresa,
              categoria: 'vidro',
              itens: materiaisVidro,
              valor_total: materiaisVidro.reduce((sum, m) => sum + (m.valor_total || 0), 0),
              status: 'aguardando_comprovante',
              qr_code_pix: gerarQRCodePIX(fornecedorVidro),
              // 🔥 DADOS REAIS DO VIDRACEIRO PARA O FORNECEDOR SABER QUEM É
              vidraceiro_id: usuario.id,
              vidraceiro_nome: usuario.nomeEmpresa || 'Vidraceiro Sem Nome',
              vidraceiro_cnpj: usuario.cnpj || '',
              vidraceiro_telefone: usuario.telefone || '',
              vidraceiro_email: usuario.email || '',
              vidraceiro_endereco: usuario.endereco || '',
              vidraceiro_cidade: usuario.cidade || '',
              vidraceiro_estado: usuario.estado || '',
              cliente_final: cliente?.nome || 'Consumidor Final', // Nome do cliente do vidraceiro
              data_criacao: new Date().toISOString()
            });
          }
        }
        
        if (categoriasCompra.aluminio) {
          const materiaisAluminio = listaMaterial.filter(m => m.categoria === 'aluminio');
          const fornecedorAluminio = fornecedores.find((f: any) => f.tipoFornecedor === 'aluminio');
          
          if (materiaisAluminio.length > 0 && fornecedorAluminio) {
            pedidosCriados.push({
              id: `pedido-aluminio-${Date.now()}`,
              fornecedor_id: fornecedorAluminio.id,
              fornecedor_nome: fornecedorAluminio.nomeEmpresa,
              categoria: 'aluminio',
              itens: materiaisAluminio,
              valor_total: materiaisAluminio.reduce((sum, m) => sum + (m.valor_total || 0), 0),
              status: 'aguardando_comprovante',
              qr_code_pix: gerarQRCodePIX(fornecedorAluminio)
            });
          }
        }
        
        if (categoriasCompra.acessorio) {
          const materiaisAcessorio = listaMaterial.filter(m => m.categoria === 'acessorio');
          const fornecedorAcessorio = fornecedores.find((f: any) => f.tipoFornecedor === 'acessorios');
          
          if (materiaisAcessorio.length > 0 && fornecedorAcessorio) {
            pedidosCriados.push({
              id: `pedido-acessorio-${Date.now()}`,
              fornecedor_id: fornecedorAcessorio.id,
              fornecedor_nome: fornecedorAcessorio.nomeEmpresa,
              categoria: 'acessorio',
              itens: materiaisAcessorio,
              valor_total: materiaisAcessorio.reduce((sum, m) => sum + (m.valor_total || 0), 0),
              status: 'aguardando_comprovante',
              qr_code_pix: gerarQRCodePIX(fornecedorAcessorio)
            });
          }
        }
        
        setPedidos(pedidosCriados);
        setEtapaAtual('pagamento');
      }
    } catch (error) {
      console.error('Erro ao iniciar compra:', error);
      toast.error('Erro ao processar compra');
    } finally {
      setLoading(false);
    }
  };

  const gerarQRCodePIX = (fornecedor: any): string => {
    // Santa Rita = CNPJ real
    if (fornecedor.nomeEmpresa.includes('Santa Rita')) {
      return `00020126580014BR.GOV.BCB.PIX0136${fornecedor.cnpj || '12345678000199'}520400005303986540510.005802BR5925SANTA RITA VIDROS6009SAO PAULO62070503***63041234`;
    }
    // Outros = simulação
    return `00020126580014BR.GOV.BCB.PIX01364ec531d1-e203-4e6d-8419-e27f45bdf0e9520400005303986540510.005802BR5925${fornecedor.nomeEmpresa.substring(0, 25).toUpperCase()}6009SAO PAULO62070503***63041234`;
  };

  // ========================================
  // ETAPA 9: COMPROVANTE
  // ========================================
  
  const anexarComprovante = async () => {
    if (!comprovanteFile) {
      toast.error('Selecione um arquivo');
      return;
    }
    
    setLoading(true);
    try {
      // Simular upload (em produção, fazer upload para Supabase Storage)
      const comprovanteUrl = `comprovante-${Date.now()}.pdf`;
      
      // Atualizar todos os pedidos
      const pedidosAtualizados = pedidos.map(p => ({
        ...p,
        comprovante_url: comprovanteUrl,
        status: 'enviado' as const,
        data_envio: new Date().toISOString()
      }));
      
      setPedidos(pedidosAtualizados);
      
      // Enviar para fornecedores
      await enviarParaFornecedores(pedidosAtualizados);
      
      toast.success('Comprovante enviado! Pedidos enviados aos fornecedores.');
      setEtapaAtual('acompanhamento');
    } catch (error) {
      console.error('Erro ao anexar comprovante:', error);
      toast.error('Erro ao enviar comprovante');
    } finally {
      setLoading(false);
    }
  };

  const enviarParaFornecedores = async (pedidosParaEnviar: Pedido[]) => {
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos/enviar`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            orcamento_id: orcamentoId,
            pedidos: pedidosParaEnviar,
            usuario_id: usuario.id
          })
        }
      );
    } catch (error) {
      console.error('Erro ao enviar para fornecedores:', error);
    }
  };

  // ========================================
  // RENDER (Redesigned: Clean, White, Glass & Steel)
  // ========================================

  return (
    <div className="fixed inset-0 z-50 bg-[#F5F7FA] overflow-y-auto animate-in fade-in duration-300">
      
      {/* HEADER FIXO - Minimalista */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 py-3 md:px-6 md:py-4 transition-all">
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex items-center justify-between mb-4 md:mb-0">
             <button
              onClick={onVoltar}
              className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
                <ArrowLeft className="w-4 h-4 stroke-[2]" />
              </div>
              <span className="text-sm font-medium hidden md:inline">Voltar</span>
            </button>
            
            <div className="text-center md:text-right">
              <h1 className="text-base md:text-lg font-semibold text-slate-900 tracking-tight">Orçamento Manual</h1>
              <p className="text-[10px] md:text-xs text-slate-500 font-medium uppercase tracking-wider">Etapa {['cliente', 'linha', 'produto', 'configuracao', 'resumo', 'lista-material', 'comprar', 'pagamento', 'comprovante', 'acompanhamento'].indexOf(etapaAtual) + 1} de 10</p>
            </div>
          </div>

          {/* Stepper Minimalista (Mobile: Barra / Desktop: Steps) */}
          <div className="mt-2 md:mt-4">
             {/* Mobile Progress Bar */}
             <div className="md:hidden h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                   className="h-full bg-slate-900 transition-all duration-500 ease-out"
                   style={{ width: `${((['cliente', 'linha', 'produto', 'configuracao', 'resumo', 'lista-material', 'comprar', 'pagamento', 'comprovante', 'acompanhamento'].indexOf(etapaAtual) + 1) / 10) * 100}%` }}
                />
             </div>

             {/* Desktop Stepper */}
             <div className="hidden md:flex items-center justify-between px-2">
                {['cliente', 'linha', 'produto', 'configuracao', 'resumo', 'lista-material', 'comprar', 'pagamento', 'comprovante', 'acompanhamento'].map((etapa, index) => {
                   const currentIndex = ['cliente', 'linha', 'produto', 'configuracao', 'resumo', 'lista-material', 'comprar', 'pagamento', 'comprovante', 'acompanhamento'].indexOf(etapaAtual);
                   const isActive = index === currentIndex;
                   const isCompleted = index < currentIndex;
                   
                   return (
                      <div key={etapa} className="flex flex-col items-center gap-2 group relative z-10">
                         <div className={`
                            w-2 h-2 rounded-full transition-all duration-300 
                            ${isActive ? 'bg-slate-900 scale-150 ring-4 ring-slate-100' : isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}
                         `} />
                         {/* Linha conectora (exceto no último) */}
                         {index < 9 && (
                            <div className={`absolute left-1/2 top-1 w-full h-[1px] -z-10 ${index < currentIndex ? 'bg-emerald-500/30' : 'bg-slate-100'}`} style={{ width: 'calc(100% * 2)' }} />
                         )}
                         <span className={`text-[10px] font-medium uppercase tracking-wider ${isActive ? 'text-slate-900' : 'text-transparent group-hover:text-slate-400'} transition-colors absolute top-4 whitespace-nowrap`}>
                            {etapa.replace('-', ' ')}
                         </span>
                      </div>
                   );
                })}
             </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto pb-24 md:pb-10">
        <div className="max-w-3xl mx-auto p-4 md:p-8">
        
          {/* ======================================== */}
          {/* ETAPA 1: CLIENTE */}
          {/* ======================================== */}
          {etapaAtual === 'cliente' && (
            <IdentificacaoCliente 
                clientesExistentes={clientes || []}
                onClienteSelecionado={selecionarCliente}
                onNovoClienteSalvo={handleNovoClienteSalvo}
                onAddMoreItems={(dados) => {
                    // Comportamento similar ao salvar: define o cliente e avança para seleção de linha
                    handleNovoClienteSalvo(dados);
                }}
            />
          )}

          {/* ======================================== */}
          {/* ETAPA 2: LINHA */}
          {/* ======================================== */}
          {etapaAtual === 'linha' && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              <div className="text-center mb-8">
                 <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-amber-100">
                   <Package className="w-6 h-6 md:w-8 md:h-8 stroke-[1.5]" />
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-2 tracking-tight">Qual a linha?</h2>
                <p className="text-sm text-slate-500">Selecione o padrão do alumínio</p>
              </div>

              <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                <button
                  onClick={() => selecionarLinha('SUPREMA')}
                  className="group relative bg-white border border-slate-200 hover:border-amber-400 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-amber-900/5 text-left"
                >
                   <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs">
                           25
                         </div>
                         <div>
                            <h4 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors">Linha Suprema</h4>
                            <p className="text-xs text-slate-500 mt-1">Padrão de mercado (25mm)</p>
                         </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500 transition-colors" />
                   </div>
                   <div className="mt-4 flex gap-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-1 bg-slate-50 text-slate-500 rounded border border-slate-100">Residencial</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-1 bg-emerald-50 text-emerald-600 rounded border border-emerald-100">Mais Vendido</span>
                   </div>
                </button>
                
                 <button
                  disabled
                  className="opacity-50 cursor-not-allowed group relative bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left"
                >
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                           32
                         </div>
                         <div>
                            <h4 className="text-lg font-bold text-slate-400">Linha Gold</h4>
                            <p className="text-xs text-slate-400 mt-1">Em breve</p>
                         </div>
                      </div>
                   </div>
                </button>
              </div>
            </div>
          )}

          {/* ======================================== */}
          {/* ETAPA 3: PRODUTO */}
          {/* ======================================== */}
          {etapaAtual === 'produto' && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              <div className="text-center mb-8">
                 <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-blue-100">
                   <Package className="w-6 h-6 md:w-8 md:h-8 stroke-[1.5]" />
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-2 tracking-tight">O que vamos montar?</h2>
                <p className="text-sm text-slate-500">Linha Suprema</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => selecionarProduto('Janela de Correr - 2 Folhas')}
                  className="group relative bg-white border border-slate-200 hover:border-blue-500 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/5 text-left flex flex-col items-center justify-center gap-4 aspect-square md:aspect-auto md:h-48"
                >
                   {/* Ilustração Abstrata da Janela */}
                   <div className="w-32 h-24 border-4 border-slate-200 group-hover:border-blue-200 rounded-lg flex relative bg-slate-50 overflow-hidden transition-colors">
                      <div className="w-1/2 border-r-2 border-slate-200 bg-white/50"></div>
                      <div className="w-1/2 bg-white/50 translate-x-2 group-hover:translate-x-0 transition-transform duration-500"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="px-2 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full">Selecionar</div>
                      </div>
                   </div>
                   
                   <div className="text-center">
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Janela de Correr</h4>
                      <p className="text-xs text-slate-500 mt-1">2 Folhas Móveis</p>
                   </div>
                </button>
                
                 {/* Placeholder para outros produtos */}
                 {[1, 2, 3].map((i) => (
                     <button
                        key={i}
                        disabled
                        className="opacity-40 cursor-not-allowed border border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 bg-slate-50/50"
                     >
                        <div className="w-16 h-12 bg-slate-200 rounded"></div>
                        <div className="w-24 h-4 bg-slate-200 rounded"></div>
                     </button>
                 ))}
              </div>
            </div>
          )}

          {/* ======================================== */}
          {/* ETAPA 4: CONFIGURAÇÃO */}
          {/* ======================================== */}
          {etapaAtual === 'configuracao' && (
            <div className="fixed inset-0 z-[60] bg-[#F5F7FA]">
              <ConfiguradorSupremaCompleto
                initialConfig={configuracao}
                onVoltar={() => setEtapaAtual('produto')}
                onFinalizar={(config, resultado) => {
                  setConfiguracao({ ...config, resultado });
                  // ... Lógica de conversão mantida igual ...
                  const materiais: Material[] = [];
                  
                  // Vidros (USANDO PREÇO REAL DO CONFIGURADOR)
                  const precoVidroReal = config.preco_unitario_vidro_m2 || 0;

                  resultado.vidros?.forEach((v: any, idx: number) => {
                    materiais.push({
                      codigo: `VID-${idx + 1}`,
                      descricao: `Vidro ${config.tipo_vidro} ${config.espessura_vidro}mm - ${v.largura_mm}x${v.altura_mm}mm`,
                      unidade: 'm²',
                      quantidade: v.area_m2,
                      medida: `${v.largura_mm}x${v.altura_mm}`,
                      origem: 'compra',
                      categoria: 'vidro',
                      valor_unitario: precoVidroReal,
                      valor_total: v.area_m2 * precoVidroReal
                    });
                  });
                  
                  // Perfis
                  resultado.perfis?.forEach((p: any) => {
                    materiais.push({
                      codigo: p.codigo,
                      descricao: p.nome,
                      unidade: 'kg',
                      quantidade: p.peso_total_kg,
                      medida: `${p.comprimento_mm}mm`,
                      origem: 'compra',
                      categoria: 'aluminio',
                      valor_unitario: 0, // Alumínio requer cotação
                      valor_total: 0
                    });
                  });
                  
                  // Acessórios
                  resultado.acessorios?.forEach((a: any) => {
                    materiais.push({
                      codigo: a.codigo,
                      descricao: a.descricao || a.nome,
                      unidade: 'un',
                      quantidade: a.quantidade,
                      origem: 'compra',
                      categoria: 'acessorio',
                      valor_unitario: 0, // Acessório requer cotação
                      valor_total: 0
                    });
                  });
                  
                  setListaMaterial(materiais);
                  salvarOrcamento({ ...config, resultado }, materiais);
                  setEtapaAtual('resumo');
                }}
              />
            </div>
          )}

          {/* ======================================== */}
          {/* ETAPA 5: RESUMO */}
          {/* ======================================== */}
          {etapaAtual === 'resumo' && configuracao && (
            <div className="fixed inset-0 z-[60] bg-[#F5F7FA]">
              <ResumoOrcamentoCompleto
                orcamentoId={`ORÇ-${Date.now()}`}
                config={configuracao}
                materiais={[
                    {
                        tipo: 'VIDRO',
                        fornecedor: 'Santa Rita Vidros - SC',
                        tem_perfil: true,
                        items: (configuracao.resultado?.vidros || []).map((v: any, i: number) => {
                            const area = v.area_m2 || ((v.largura_mm || v.largura || 0) * (v.altura_mm || v.altura || 0)) / 1000000;
                            const precoM2 = configuracao.preco_unitario_vidro_m2 || 0;
                            const totalCalculado = area * precoM2;
                            
                            return {
                                codigo: `V-${i+1}`,
                                descricao: `Vidro ${configuracao.tipo_vidro} ${configuracao.espessura_vidro}mm`,
                                quantidade: 1,
                                unidade: 'pç',
                                preco_unitario: v.preco_total || totalCalculado,
                                total: v.preco_total || totalCalculado,
                                detalhes: {
                                    ...v,
                                    tipo_folha: v.tipo || (i === 0 ? 'FIXA' : 'MOVEL'),
                                    largura: v.largura_mm || v.largura,
                                    altura: v.altura_mm || v.altura,
                                    area: area,
                                    preco_m2: precoM2,
                                    especificacao: `${configuracao.espessura_vidro}mm ${configuracao.tipo_vidro}`
                                }
                            };
                        }),
                        total: (configuracao.resultado?.vidros || []).reduce((acc: number, v: any) => {
                             const area = v.area_m2 || ((v.largura_mm || v.largura || 0) * (v.altura_mm || v.altura || 0)) / 1000000;
                             const precoM2 = configuracao.preco_unitario_vidro_m2 || 0;
                             return acc + (v.preco_total || (area * precoM2));
                        }, 0)
                    },
                    {
                        tipo: 'ALUMINIO',
                        fornecedor: 'Alumínios SC',
                        tem_perfil: true,
                        items: (configuracao.resultado?.perfis || []).map((p: any) => ({
                            codigo: p.codigo,
                            descricao: p.descricao,
                            quantidade: p.quantidade,
                            unidade: 'br',
                            preco_unitario: 100, 
                            total: p.quantidade * 100
                        })),
                        total: (configuracao.resultado?.perfis || []).reduce((acc: number, p: any) => acc + (p.quantidade * 100), 0)
                    },
                    {
                        tipo: 'ACESSORIO',
                        fornecedor: 'Ferragens Total',
                        tem_perfil: true,
                        items: (configuracao.resultado?.acessorios || []).map((a: any) => ({
                            codigo: a.codigo || 'ACE-001',
                            descricao: a.nome || a.descricao,
                            quantidade: a.quantidade,
                            unidade: 'un',
                            preco_unitario: 25,
                            total: a.quantidade * 25
                        })),
                        total: (configuracao.resultado?.acessorios || []).reduce((acc: number, a: any) => acc + (a.quantidade * 25), 0)
                    }
                ].filter(g => g.items.length > 0)}
                onVoltar={() => setEtapaAtual('configuracao')}
                clienteInfo={cliente}
                isFornecedor={isFornecedor}
                onDashboard={onVoltar}
                onNovoOrcamento={handleNovoOrcamento}
              />
            </div>
          )}

          {/* ======================================== */}
          {/* ETAPA 6: LISTA DE MATERIAL */}
          {/* ======================================== */}
          {etapaAtual === 'lista-material' && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              <div className="text-center mb-8">
                 <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                   <FileText className="w-6 h-6 md:w-8 md:h-8 stroke-[1.5]" />
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-2 tracking-tight">Lista de Material</h2>
                <p className="text-sm text-slate-500">Itens calculados para este projeto</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                   <table className="w-full text-sm text-left">
                     <thead className="bg-slate-50 border-b border-slate-200">
                       <tr>
                         <th className="px-4 py-3 font-semibold text-slate-500">Item</th>
                         <th className="px-4 py-3 font-semibold text-slate-500 text-right">Qtd</th>
                         <th className="px-4 py-3 font-semibold text-slate-500 text-center">Tipo</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                       {listaMaterial.map((material, index) => (
                         <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-4 py-3">
                             <div className="font-medium text-slate-900">{material.descricao}</div>
                             <div className="text-xs text-slate-400 font-mono mt-0.5">{material.codigo}</div>
                           </td>
                           <td className="px-4 py-3 text-right">
                             <span className="font-medium text-slate-900">{material.quantidade}</span>
                             <span className="text-xs text-slate-400 ml-1">{material.unidade}</span>
                           </td>
                           <td className="px-4 py-3 text-center">
                             <span className={`inline-flex px-2 py-1 text-[10px] font-bold uppercase rounded border ${
                               material.categoria === 'vidro' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                               material.categoria === 'aluminio' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                               'bg-amber-50 text-amber-600 border-amber-100'
                             }`}>
                               {material.categoria}
                             </span>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setEtapaAtual('comprar')}
                  className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-900/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  Continuar para Compra
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* ======================================== */}
          {/* ETAPA 7: COMPRAR MATERIAIS */}
          {/* ======================================== */}
          {etapaAtual === 'comprar' && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              <div className="text-center mb-8">
                 <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-emerald-100">
                   <DollarSign className="w-6 h-6 md:w-8 md:h-8 stroke-[1.5]" />
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-2 tracking-tight">O que vamos pedir?</h2>
                <p className="text-sm text-slate-500">Selecione as categorias para compra agora</p>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                 {[
                    { id: 'vidro', label: 'Vidros', count: listaMaterial.filter(m => m.categoria === 'vidro').length, icon: '����' },
                    { id: 'aluminio', label: 'Alumínios', count: listaMaterial.filter(m => m.categoria === 'aluminio').length, icon: '🔩' },
                    { id: 'acessorio', label: 'Acessórios', count: listaMaterial.filter(m => m.categoria === 'acessorio').length, icon: '🔧' }
                 ].map((cat) => (
                   <label key={cat.id} className={`flex items-center gap-4 p-4 md:p-6 border rounded-2xl cursor-pointer transition-all ${
                      // @ts-ignore
                      categoriasCompra[cat.id] 
                         ? 'bg-white border-slate-900 shadow-md ring-1 ring-slate-900' 
                         : 'bg-slate-50 border-slate-200 opacity-70 hover:opacity-100'
                   }`}>
                     <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${
                        // @ts-ignore
                        categoriasCompra[cat.id] ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-300'
                     }`}>
                        {/* @ts-ignore */}
                        {categoriasCompra[cat.id] && <Check className="w-4 h-4" />}
                     </div>
                     <input
                       type="checkbox"
                       // @ts-ignore
                       checked={categoriasCompra[cat.id]}
                       // @ts-ignore
                       onChange={(e) => setCategoriasCompra({...categoriasCompra, [cat.id]: e.target.checked})}
                       className="hidden"
                     />
                     <div className="flex-1">
                       <h4 className="text-base font-bold text-slate-900">{cat.icon} {cat.label}</h4>
                       <p className="text-xs text-slate-500">
                         {cat.count} itens nesta categoria
                       </p>
                     </div>
                   </label>
                 ))}
              </div>

              <div className="flex justify-center pt-6">
                <button
                  onClick={iniciarCompra}
                  disabled={loading || (!categoriasCompra.vidro && !categoriasCompra.aluminio && !categoriasCompra.acessorio)}
                  className="w-full md:w-auto px-8 py-4 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 shadow-xl shadow-emerald-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      Gerar Pedidos de Compra
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ======================================== */}
          {/* ETAPA 9: PAGAMENTO QR CODE */}
          {/* ======================================== */}
          {etapaAtual === 'pagamento' && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              <div className="text-center mb-8">
                 <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                   <DollarSign className="w-6 h-6 md:w-8 md:h-8 stroke-[1.5]" />
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-2 tracking-tight">Pagamento PIX</h2>
                <p className="text-sm text-slate-500">Realize o pagamento para liberar a produção</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pedidos.map((pedido, index) => (
                  <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
                    <div className="mb-4">
                      <h4 className="text-sm font-bold text-slate-900 mb-1">{pedido.fornecedor_nome}</h4>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">{pedido.categoria}</p>
                      <p className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.valor_total)}
                      </p>
                    </div>

                    {/* QR Code Simulado Moderno */}
                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-inner mb-4 w-full max-w-[200px] aspect-square flex items-center justify-center relative overflow-hidden group">
                       <div className="absolute inset-0 bg-slate-900 opacity-[0.03] pattern-grid-lg"></div>
                       <div className="z-10 text-center">
                          <p className="text-[10px] font-mono text-slate-400 mb-2">QR CODE PIX</p>
                          <div className="w-32 h-32 bg-slate-900 rounded-lg mx-auto flex items-center justify-center">
                              {/* Placeholder visual do QR Code */}
                              <div className="w-24 h-24 bg-white opacity-90 rounded-sm"></div>
                          </div>
                          <p className="text-[8px] text-slate-300 mt-2 max-w-[150px] truncate mx-auto opacity-0 group-hover:opacity-100 transition-opacity">
                             {pedido.qr_code_pix?.substring(0, 20)}...
                          </p>
                       </div>
                    </div>

                    <p className="text-xs text-slate-400">
                      {pedido.itens.length} itens inclusos
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-center pt-6">
                <button
                  onClick={() => setEtapaAtual('comprovante')}
                  className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-900/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  Confirmar Pagamentos
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* ======================================== */}
          {/* ETAPA 10: COMPROVANTE */}
          {/* ======================================== */}
          {etapaAtual === 'comprovante' && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500 pb-20">
              <div className="text-center mb-8">
                 <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-blue-100">
                   <Upload className="w-6 h-6 md:w-8 md:h-8 stroke-[1.5]" />
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-2 tracking-tight">Comprovante de Pagamento</h2>
                <p className="text-sm text-slate-500">Anexe a foto ou PDF do comprovante PIX</p>
              </div>

              <div className="max-w-md mx-auto space-y-6">
                
                {/* ÁREA DE UPLOAD MELHORADA */}
                <div className={`
                    relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
                    ${comprovanteFile ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50/10'}
                `}>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => setComprovanteFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    id="comprovante-upload"
                  />
                  
                  <div className="flex flex-col items-center justify-center pointer-events-none">
                     <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform ${comprovanteFile ? 'bg-emerald-100 text-emerald-600 scale-110' : 'bg-slate-50 text-slate-400'}`}>
                        {comprovanteFile ? <CheckCircle className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                     </div>
                    {comprovanteFile ? (
                      <div>
                          <p className="text-emerald-700 font-bold mb-1 break-all px-4">{comprovanteFile.name}</p>
                          <p className="text-xs text-emerald-600">Toque para alterar</p>
                      </div>
                    ) : (
                      <div>
                          <p className="text-slate-900 font-bold mb-2">Toque para anexar</p>
                          <p className="text-xs text-slate-500">Galeria ou Câmera</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* BOTÃO ENVIAR (SEPARADO E CLARO) */}
                <button
                    onClick={async () => {
                        if (!comprovanteFile) {
                            toast.error('Por favor, anexe o comprovante primeiro.');
                            return;
                        }
                        
                        setLoading(true);
                        try {
                            const comprovanteUrl = `comprovante-${Date.now()}-${comprovanteFile.name}`;
                            
                            const pedidosAtualizados = pedidos.map(p => ({
                                ...p,
                                comprovante_url: comprovanteUrl,
                                status: 'enviado' as const,
                                data_envio: new Date().toISOString(),
                                condicao_pagamento: '100%', // Assumindo PIX Total
                                valor_pago_informado: p.valor_total
                            }));
                            
                            setPedidos(pedidosAtualizados);
                            
                            // 🔥 1. PERSISTIR NA NUVEM IMEDIATAMENTE (Sync Real - Índice Duplo)
                            for (const ped of pedidosAtualizados) {
                                // A. Salva para o Fornecedor (Caixa de Entrada dele)
                                await salvarNoBanco('pedido', ped.id, ped);
                                
                                // B. Salva para o Vidraceiro (Meus Pedidos dele)
                                // Usamos uma chave especial manual aqui para não alterar a função genérica
                                const chaveVidraceiro = `meus_pedidos_${usuario.id}_${ped.id}`;
                                await supabase.from('kv_store_f33747ec').upsert({
                                    key: chaveVidraceiro,
                                    value: { ...ped, _updatedAt: new Date().toISOString() }
                                });
                            }
                            
                            // 🔥 2. PERSISTIR NO PARENT (DASHBOARD VIDRACEIRO)
                            if (onPedidosCriados) {
                                onPedidosCriados(pedidosAtualizados);
                            }
                            
                            // 🔥 3. ENVIAR EMAIL (LEGADO/NOTIFICAÇÃO)
                            await enviarParaFornecedores(pedidosAtualizados);
                            
                            toast.success('Comprovante enviado! Pedidos em produção.');
                            setEtapaAtual('acompanhamento');
                        } catch (error) {
                            console.error('Erro:', error);
                            toast.error('Erro ao enviar');
                        } finally {
                            setLoading(false);
                        }
                    }}
                    disabled={loading || !comprovanteFile}
                    className={`
                        w-full px-8 py-4 rounded-xl font-bold text-white shadow-xl transition-all flex items-center justify-center gap-3
                        ${!comprovanteFile 
                            ? 'bg-slate-300 cursor-not-allowed opacity-70' 
                            : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] shadow-emerald-900/20'
                        }
                    `}
                >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Confirmar e Enviar Pedido
                      </>
                    )}
                </button>
                
                {!comprovanteFile && (
                    <p className="text-center text-xs text-slate-400 mt-2">
                        O botão será ativado após anexar o comprovante.
                    </p>
                )}
              </div>
            </div>
          )}

          {/* ======================================== */}
          {/* ETAPA 12: ACOMPANHAMENTO */}
          {/* ======================================== */}
          {etapaAtual === 'acompanhamento' && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              <div className="text-center mb-8">
                 <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm animate-bounce">
                   <CheckCircle className="w-8 h-8 stroke-[2]" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-2 tracking-tight">Sucesso!</h2>
                <p className="text-sm text-slate-500">Seus pedidos foram enviados aos fornecedores.</p>
              </div>

              <div className="space-y-4 max-w-xl mx-auto">
                {pedidos.map((pedido, index) => (
                  <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{pedido.fornecedor_nome}</h4>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">{pedido.categoria}</p>
                      </div>
                      <div className="text-right">
                         <span className="inline-flex px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">
                            {pedido.status.replace('_', ' ')}
                         </span>
                      </div>
                    </div>

                    {/* Timeline Minimalista */}
                    <div className="relative pt-2">
                       <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[20%]"></div>
                       </div>
                       <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                          <span className="text-emerald-600">Enviado</span>
                          <span>Aprovado</span>
                          <span>Produção</span>
                          <span>Entrega</span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center pt-8">
                <button
                  onClick={onVoltar}
                  className="px-8 py-3 bg-slate-100 text-slate-600 font-medium rounded-xl hover:bg-slate-200 hover:text-slate-900 transition-all"
                >
                  Voltar ao Início
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}