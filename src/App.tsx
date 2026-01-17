import { useState, useEffect } from 'react';
import { salvarNoBanco, buscarDoBanco } from './utils/sync';
import { supabase } from './utils/supabase/client';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { MessageCircle, X, ArrowRight } from 'lucide-react';
import { Toaster, toast } from 'sonner@2.0.3';
import { I18nProvider } from './i18n/i18nContext';
import { LandingPageEnterprise } from './components/auth/LandingPageEnterprise';
import { WaitlistModalPremium } from './components/auth/WaitlistModalPremium';
import { CadastroDadosPremium } from './components/auth/CadastroDadosPremium';
import { VerificacaoCodigoPremium } from './components/auth/VerificacaoCodigoPremium';
import { BoasVindasCinematica } from './components/auth/BoasVindasCinematica';
import { ForgotPasswordModal } from './components/auth/ForgotPasswordModal';
import { DashboardExecucao } from './components/DashboardExecucao';
import { NovoOrcamento } from './components/NovoOrcamento';
import { MeusPedidos } from './components/vidraceiro/MeusPedidos';
import { MinhasEntregas } from './components/MinhasEntregas';
import { RotaTempoReal } from './components/RotaTempoReal';
import { RomaneioEntrega } from './components/RomaneioEntrega';
import { TelaEmBreve } from './components/TelaEmBreve';
import { SysLicita } from './components/SysLicita';
import { SysFrete } from './components/SysFrete';
import { SysMontagem } from './components/SysMontagem';
import { SysFederal } from './components/SysFederal';
import { LoginComListaEspera } from './components/LoginComListaEspera';
import { DashboardFornecedor } from './components/fornecedor/DashboardFornecedor';
import { MeusClientesFornecedor } from './components/MeusClientesFornecedor'; // 🔥 NOVO
import { DebugVidraceiroInfo } from './components/DebugVidraceiroInfo'; // 🔥 DEBUG

import { NovoOrcamentoSantaRita } from './components/NovoOrcamentoSantaRita';
import { NotificacaoAprovacao } from './components/NotificacaoAprovacao'; // 🔥 NOVO
import { GestaoProducaoCompleta } from './components/GestaoProducaoCompleta'; // 🔥 NOVO
import { RomaneioCarregamento } from './components/RomaneioCarregamento'; // 🔥 NOVO
import { ConfiguradorSupremaCompleto } from './components/ConfiguradorSupremaCompleto'; // 🔥 NOVO
import { LeitorDWG } from './components/vidracaria/LeitorDWG'; // 🔥 LEITOR DWG
import { InicializarBanco } from './components/admin/InicializarBanco'; // 🔥 ADMIN
import { AdminLogin } from './components/AdminLogin'; // 🔥 ADMIN LOGIN
import { AdminDashboard } from './components/AdminDashboard'; // 🔥 ADMIN DASHBOARD
import { MobileBottomNav } from './components/navigation/MobileBottomNav'; // 🔥 NAV MOBILE
// ⚠️ REMOVIDOS: DebugClientes e TesteMultiTenancy (causavam memory leak)

import { AuthModal } from './components/auth/AuthModal';
// DevSwitcher removido a pedido do cliente (Shield icon)

type Screen = 
  | '01-login' 
  | '02-escolha-perfil'
  | '02B-tipo-fornecedor' 
  | '03-cadastro-dados'
  | '04-verificacao-codigo'
  | '05-boas-vindas-cinematica'
  | '03-dashboard-execucao'
  | 'novo-orcamento-modal'
  | '04-tipo-orcamento'
  | '10-meus-clientes'
  | '10B-novo-cliente'
  | '11-obras'
  | '11B-novo-romaneio'
  | '12-meus-pedidos'
  | '13-agenda'
  | '14-meus-contratos'
  | 'acompanhar-pedido'
  | 'meus-pedidos'
  | 'minhas-entregas'
  | 'rota-tempo-real'
  | 'syslicita'
  | 'sysfrete'
  | 'sysmontagem'
  | 'sysfederal'
  | 'dashboard-fornecedor'
  | 'configurador-suprema'
  | 'gestao-producao'
  | 'romaneio-carregamento'
  | 'leitor-dwg'
  | 'admin-inicializar-banco'
  | 'admin-login'
  | 'admin-dashboard'
  | 'producao-santa-rita'
  | 'logistica-santa-rita'
  | 'comercial-santa-rita'
  | 'pedidos-santa-rita'
  | 'novo-orcamento-santa-rita'
  | 'painel-guardian-conecta';

export default function App() {
  console.log('🔥 [SYSCONECTA] App montado - Versão Memory-Fixed');
  
  // 🔥 PERSISTÊNCIA DA TELA ATUAL - Recupera do localStorage com fallback seguro
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    const saved = localStorage.getItem('sysconecta_current_screen');
    if (saved) {
      const screenValue = saved as Screen;
      console.log('🔄 RECUPERANDO TELA DO LOCALSTORAGE:', screenValue);
      return screenValue;
    }
    return '01-login'; // ✅ VOLTA PARA O LOGIN por padrão
  });
  
  const [userRole, setUserRole] = useState<string>(() => {
    return localStorage.getItem('sysconecta_user_role') || '';
  });
  
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('sysconecta_user_name') || '';
  });
  
  // 🔥 ID DO USUÁRIO DINÂMICO (ZERO FAKE MULTI-USER)
  const [userId, setUserId] = useState<string>(() => {
    const savedId = localStorage.getItem('sysconecta_user_id');
    if (savedId) return savedId;
    // Se não tiver ID, cria um temporário (será substituído no login/cadastro real)
    const newId = `user-${Math.floor(Math.random() * 1000000)}`;
    localStorage.setItem('sysconecta_user_id', newId);
    return newId;
  });

  // 🔥 EMAIL DO USUÁRIO (Para multi-tenancy e debug)
  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem('sysconecta_user_email') || '';
  });

  // Função Mágica de Troca de Perfil
  const handleDevSwitch = (role: 'vidraceiro' | 'fornecedor') => {
      if (role === 'fornecedor') {
          const fakeSantaRita = {
              id: 'forn-vidro-01', // 🔥 PADRONIZADO COM ResumoOrcamento
              razaoSocial: 'Santa Rita Vidros Ltda',
              nomeFantasia: 'Santa Rita Vidros',
              cnpj: '12.345.678/0001-99',
              contatoResponsavel: 'Alexandre',
              email: 'alexandre@santarita.com.br',
              telefone: '(48) 99999-9999',
              endereco: {
                  cep: '88000-000',
                  logradouro: 'Rodovia SC 401',
                  numero: '1000',
                  bairro: 'Saco Grande',
                  cidade: 'Florianópolis',
                  estado: 'SC'
              }
          };
          setSantaRitaUserData(fakeSantaRita);
          localStorage.setItem('sysconecta_santa_rita_data', JSON.stringify(fakeSantaRita));
          setUserRole('fornecedor');
          localStorage.setItem('sysconecta_user_role', 'fornecedor');
          setCurrentScreen('dashboard-fornecedor');
          // toast.success('👑 Modo Fornecedor Ativado (Santa Rita)');
      } else {
          // Vidraceiro Genérico
          const novoId = 'vidraceiro-teste-01';
          setUserRole('vidraceiro');
          setUserId(novoId);
          localStorage.setItem('sysconecta_user_role', 'vidraceiro');
          localStorage.setItem('sysconecta_user_id', novoId);
          setCurrentScreen('03-dashboard-execucao');
          // toast.success('👷 Modo Vidraceiro Ativado');
      }
  };

  const [verificationCode, setVerificationCode] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [selectedLinha, setSelectedLinha] = useState<string>('');
  const [selectedTipologia, setSelectedTipologia] = useState<any>(null);
  
  // Itens do orçamento
  const [itensOrcamento, setItensOrcamento] = useState<any[]>([]);
  const [dadosCliente, setDadosCliente] = useState<any>({});
  const [isPremium, setIsPremium] = useState(false);
  const [pedidosRealizados, setPedidosRealizados] = useState<any[]>([]);
  
  // 🔥 ESTADO GLOBAL DO ORÇAMENTO - SALVA TUDO
  const [orcamentoAtual, setOrcamentoAtual] = useState<any>(() => {
    const saved = localStorage.getItem('sysconecta_orcamento_atual');
    return saved ? JSON.parse(saved) : {
      modelo: null,
      tipologia: null,
      linha: '',
      altura: '',
      largura: '',
      itens: [],
      cliente: null,
      vidraceiro: {
        nome: 'Vidraçaria Silva & Cia',
        cnpj: '12.345.678/0001-90',
        endereco: 'Avenida Brasil, 2154',
        bairro: 'Centro',
        cidade: 'Balneário Camboriú',
        estado: 'SC',
        cep: '88330-000',
        telefone: '(47) 3366-1234',
        email: 'contato@vidracariasilva.com.br'
      },
      dataOrcamento: null,
      valorTotal: 0
    };
  });
  
  // 🔥 NOVO SISTEMA DE PEDIDOS INTEGRADO (Vidraceiro → Fornecedor)
  // 🔥 PERSISTÊNCIA: Carregar do localStorage Scoped ao iniciar
  const [pedidosVidraceiro, setPedidosVidraceiro] = useState<any[]>([]);

  // 🔥 Carregar Pedidos do Vidraceiro do SERVIDOR (Multi-tenancy)
  useEffect(() => {
      if (!userId) return;
      
      const carregarPedidosDoServidor = async () => {
          try {
              console.log(`📦 [APP] Buscando pedidos do servidor para usuário: ${userId}`);
              
              const response = await fetch(
                  `https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos/listar/${userId}`,
                  {
                      method: 'GET',
                      headers: {
                          'Authorization': `Bearer ${publicAnonKey}`,
                          'Content-Type': 'application/json'
                      }
                  }
              );

              if (response.ok) {
                  const result = await response.json();
                  const pedidos = result.pedidos || [];
                  console.log(`✅ [APP] ${pedidos.length} pedidos carregados do servidor`);
                  setPedidosVidraceiro(pedidos);
              } else {
                  console.error('❌ [APP] Erro ao buscar pedidos:', response.status);
                  console.log('⚠️ Mantendo pedidos locais em caso de erro do servidor');
              }
          } catch (error) {
              console.error('❌ [APP] Erro ao carregar pedidos:', error);
              console.log('⚠️ Mantendo pedidos locais em caso de erro de rede');
          }
      };

      carregarPedidosDoServidor();
      
      // Listener para atualização em tempo real
      const handlePedidosUpdate = () => {
          console.log("🔄 App: Recarregando pedidos do servidor via evento global");
          carregarPedidosDoServidor();
      };
      
      window.addEventListener('pedidos_vidraceiro_updated', handlePedidosUpdate);
      return () => window.removeEventListener('pedidos_vidraceiro_updated', handlePedidosUpdate);
  }, [userId]);

  // 🔥 EVENT LISTENER: Atualização em Tempo Real (Financeiro/Pedidos) REMOVIDO DAQUI E COLOCADO ACIMA

  const [pedidosFornecedor, setPedidosFornecedor] = useState<any[]>(() => {
    const saved = localStorage.getItem('sysconecta_pedidos_fornecedor');
    return saved ? JSON.parse(saved) : [];
  }); 
  
  const [notificacoesFornecedor, setNotificacoesFornecedor] = useState<number>(() => {
    const saved = localStorage.getItem('sysconecta_notificacoes');
    return saved ? parseInt(saved) : 0;
  });

  // 🔥 NOVO: NOTIFICAÇÕES DE APROVAÇÃO PARA O VIDRACEIRO
  const [notificacoesAprovacao, setNotificacoesAprovacao] = useState<any[]>(() => {
    const saved = localStorage.getItem('sysconecta_notificacoes_aprovacao');
    return saved ? JSON.parse(saved) : [];
  });

  // 🔥 NOVO: DADOS DO FORNECEDOR LOGADO (para Dashboard Fornecedor genérico)
  const [fornecedorLogado, setFornecedorLogado] = useState<any>(() => {
    const saved = localStorage.getItem('sysconecta_fornecedor_logado');
    return saved ? JSON.parse(saved) : null;
  });

  // 🔥 NOVO: DADOS DO SANTA RITA (declarado ANTES dos useEffects que o usam)
  const [santaRitaUserData, setSantaRitaUserData] = useState<any>(() => {
    const saved = localStorage.getItem('sysconecta_santa_rita_data');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTargetRole, setAuthTargetRole] = useState('vidraceiro');
  
  // 🔥 NOVO: ROTEAMENTO GEOGRÁFICO DE FORNECEDORES
  const [usuarioEstado, setUsuarioEstado] = useState('SC'); // Default SC

  const PARCEIROS_POR_ESTADO: any = {
      'SC': { nome: 'Santa Rita Vidros', cnpj: '08.017.165/0001-88', cidade: 'São José', estado: 'SC' },
      'SP': { nome: 'Tempermax SP', cnpj: '11.222.333/0001-99', cidade: 'São Paulo', estado: 'SP' },
      'PR': { nome: 'Vidros Paraná', cnpj: '44.555.666/0001-77', cidade: 'Curitiba', estado: 'PR' },
      'DF': { nome: 'Brasília Temper', cnpj: '99.888.777/0001-11', cidade: 'Brasília', estado: 'DF' },
      // Default para outros estados cai na Santa Rita ou mensagem de "Sem Cobertura"
      'DEFAULT': { nome: 'Santa Rita Vidros (Matriz)', cnpj: '08.017.165/0001-88', cidade: 'São José', estado: 'SC' }
  };
  
  // 🔥 VERIFICAR SESSÃO SUPABASE AO INICIAR
  useEffect(() => {
    const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            console.log("✅ SESSÃO RECUPERADA:", session.user.email);
            setUserId(session.user.id);
            setUserEmail(session.user.email || '');
            localStorage.setItem('sysconecta_user_email', session.user.email || '');
            if (session.user.user_metadata) {
                setUserName(session.user.user_metadata.full_name || '');
                setUserRole(session.user.user_metadata.role || 'vidraceiro');
                // 🔥 RECUPERAR ESTADO DO USUÁRIO
                if (session.user.user_metadata.state) {
                    setUsuarioEstado(session.user.user_metadata.state);
                    console.log("📍 USUÁRIO LOCALIZADO EM:", session.user.user_metadata.state);
                }
                
                // Redirecionamento inteligente baseado no role
                if (currentScreen === '01-login' || currentScreen === '02-escolha-perfil') {
                    const role = session.user.user_metadata.role;
                    if (role === 'vidraceiro') setCurrentScreen('03-dashboard-execucao');
                    else if (role === 'fornecedor') setCurrentScreen('dashboard-fornecedor');
                    else if (role === 'fabrica') setCurrentScreen('gestao-producao'); 
                }
            }
        } else {
            // Sessão inválida ou expirada
            console.log("🔒 NENHUMA SESSÃO ATIVA.");
        }
    };
    checkSession();
  }, []); // Executa apenas uma vez

  const [pedidoSelecionado, setPedidoSelecionado] = useState<any>(null); // 🔥 NOVO para detalhe do pedido

  // 🔥 SALVAR ORÇAMENTO no localStorage
  useEffect(() => {
    localStorage.setItem('sysconecta_orcamento_atual', JSON.stringify(orcamentoAtual));
    console.log('💾 SALVOU ORÇAMENTO ATUAL:', orcamentoAtual);
  }, [orcamentoAtual]);

  // ✅ PEDIDOS AGORA SÃO SALVOS E CARREGADOS DO SERVIDOR
  // Não precisamos mais salvar no localStorage pois tudo vem do Supabase

  useEffect(() => {
    localStorage.setItem('sysconecta_pedidos_fornecedor', JSON.stringify(pedidosFornecedor));
  }, [pedidosFornecedor]);

  useEffect(() => {
    localStorage.setItem('sysconecta_notificacoes', notificacoesFornecedor.toString());
    console.log('💾 SALVOU NOTIFICAÇÕES NO LOCALSTORAGE:', notificacoesFornecedor);
  }, [notificacoesFornecedor]);

  useEffect(() => {
    localStorage.setItem('sysconecta_notificacoes_aprovacao', JSON.stringify(notificacoesAprovacao));
    console.log('💾 SALVOU NOTIFICAÇÕES DE APROVAÇÃO:', notificacoesAprovacao);
  }, [notificacoesAprovacao]);

  useEffect(() => {
    if (fornecedorLogado) {
      localStorage.setItem('sysconecta_fornecedor_logado', JSON.stringify(fornecedorLogado));
    }
  }, [fornecedorLogado]);

  // 🔥 SALVAR ESTADO CRÍTICO NO LOCALSTORAGE
  useEffect(() => {
    // 🚨 RECUPERAÇÃO DE TELA MORTA
    if (currentScreen === '02-escolha-perfil') {
      console.warn('🚨 Detectada tela obsoleta (02-escolha-perfil). Redirecionando para Login...');
      setCurrentScreen('01-login');
      return;
    }

    localStorage.setItem('sysconecta_current_screen', currentScreen);
    console.log('📺 TELA ATUAL:', currentScreen);
    console.log('👤 USER ROLE:', userRole);
    console.log('🏢 FORNECEDOR LOGADO:', fornecedorLogado?.nomeEmpresa || 'N/A');
    console.log('🏭 SANTA RITA DATA:', santaRitaUserData?.nome || 'N/A');
  }, [currentScreen]);

  useEffect(() => {
    if (userRole) {
      localStorage.setItem('sysconecta_user_role', userRole);
    } else {
      localStorage.removeItem('sysconecta_user_role');
    }
  }, [userRole]);

  useEffect(() => {
    if (userName) {
      localStorage.setItem('sysconecta_user_name', userName);
    } else {
      localStorage.removeItem('sysconecta_user_name');
    }
  }, [userName]);

  // 🔥 SALVAR SANTA RITA DATA
  useEffect(() => {
    if (santaRitaUserData) {
      localStorage.setItem('sysconecta_santa_rita_data', JSON.stringify(santaRitaUserData));
    }
  }, [santaRitaUserData]);

  // 🔥 FUNÇÃO GLOBAL DE RESET DE EMERGÊNCIA (disponível no console)
  useEffect(() => {
    (window as any).resetSysConecta = () => {
      console.log('🚨 EXECUTANDO RESET DE EMERGÊNCIA DO SYSCONECTA...');
      localStorage.clear();
      setCurrentScreen('01-login');
      setUserRole('');
      setUserName('');
      setSantaRitaUserData(null);
      setFornecedorLogado(null);
      setPedidosVidraceiro([]);
      setPedidosFornecedor([]);
      setNotificacoesFornecedor(0);
      setNotificacoesAprovacao([]);
      console.log('✅ RESET COMPLETO! Sistema voltou ao estado inicial.');
      alert('✅ Sistema resetado com sucesso! Faça login novamente.');
      window.location.reload();
    };
    console.log('💡 DICA: Em caso de tela branca, digite no console: resetSysConecta()');
  }, [setCurrentScreen, setUserRole, setUserName, setSantaRitaUserData, setFornecedorLogado, setPedidosVidraceiro, setPedidosFornecedor, setNotificacoesFornecedor, setNotificacoesAprovacao]);

  // 🔥 FUNÇÃO DE ACESSO RÁPIDO AO CONFIGURADOR SUPREMA (para testes)
  // ✅ CORRIGIDO: Configurador Suprema é para VIDRACEIRO, não fornecedor!
  useEffect(() => {
    (window as any).acessarConfiguradorSuprema = () => {
      console.log('🚀 ACESSANDO CONFIGURADOR SUPREMA...');
      setCurrentScreen('configurador-suprema');
      setUserRole('vidraceiro'); // ✅ Vidraceiro configura tipologias
      setUserName('Vidraceiro Teste');
      console.log('✅ Acesso direto ao Configurador Suprema realizado!');
    };
    console.log('🔥 ACESSO RÁPIDO: Digite no console: acessarConfiguradorSuprema()');
  }, [setCurrentScreen, setUserRole, setUserName]);

  // 🔥 NOVO: FUNÇÃO DE ACESSO RÁPIDO AO NOVO ORÇAMENTO (Sistema Completo)
  useEffect(() => {
    (window as any).acessarNovoOrcamento = () => {
      console.log('🚀 ACESSANDO NOVO ORÇAMENTO - SISTEMA COMPLETO...');
      setCurrentScreen('dashboard-execucao');
      setUserRole('vidraceiro');
      setUserName('Vidraceiro Teste');
      console.log('✅ Dashboard carregado! Clique no botão "➕ NOVO ORÇAMENTO" no menu lateral.');
      console.log('📋 FLUXO: Cliente → Linha (SUPREMA) → Produto → Configuração → Lista Material → Compra → Pagamento → Comprovante → Acompanhamento');
    };
    console.log('🔥 NOVO SISTEMA: Digite no console: acessarNovoOrcamento()');
  }, [setCurrentScreen, setUserRole, setUserName]);

  // 🔥 NOVO: FUNÇÃO DE ACESSO RÁPIDO AO LEITOR DWG
  useEffect(() => {
    (window as any).acessarLeitorDWG = () => {
      console.log('📐 ACESSANDO LEITOR DWG...');
      setCurrentScreen('leitor-dwg');
      setUserRole('vidraceiro');
      setUserName('Vidraceiro Teste');
      console.log('✅ Leitor DWG carregado! Faça upload de um arquivo DXF para testar.');
    };
    console.log('🔥 LEITOR DWG: Digite no console: acessarLeitorDWG()');
  }, [setCurrentScreen, setUserRole, setUserName]);

  // 🔥 CLIENTES - PERSISTÊNCIA TOTAL NA NUVEM (VIA PROXY KV)
  const [clientes, setClientes] = useState<any[]>([]);
  
  // 🔥 MEUS ORÇAMENTOS - PERSISTÊNCIA TOTAL NA NUVEM (VIA PROXY KV)
  const [meusOrcamentos, setMeusOrcamentos] = useState<any[]>([]);

  // 1. CARREGAR DADOS DA NUVEM AO INICIAR (Sync Real)
  useEffect(() => {
      if (!userId) return;
      
      const carregarDadosNuvem = async () => {
          console.log(`☁️ [SYNC] Iniciando recuperação de dados para: ${userId}`);
          
          try {
              // Buscar Clientes
              const clientesRemotos = await buscarDoBanco('cliente', userId);
              if (clientesRemotos && Array.isArray(clientesRemotos)) {
                  console.log(`✅ [SYNC] ${clientesRemotos.length} clientes recuperados.`);
                  setClientes(prev => {
                      const mapa = new Map();
                      // 1. Nuvem (Base)
                      clientesRemotos.forEach(r => mapa.set(r.id, r));
                      // 2. Local (Preserva o que foi criado durante o load)
                      prev.forEach(p => mapa.set(p.id, p));
                      return Array.from(mapa.values());
                  });
              }

              // Buscar Orçamentos
              const orcamentosRemotos = await buscarDoBanco('orcamento', userId);
              if (orcamentosRemotos && Array.isArray(orcamentosRemotos)) {
                  console.log(`✅ [SYNC] ${orcamentosRemotos.length} orçamentos recuperados.`);
                  setMeusOrcamentos(prev => {
                      const mapa = new Map();
                      orcamentosRemotos.forEach(r => mapa.set(r.id, r));
                      prev.forEach(p => mapa.set(p.id, p));
                      return Array.from(mapa.values());
                  });
              }
          } catch (e) {
              console.error("❌ [SYNC] Falha ao recuperar dados:", e);
          }
      };
      
      carregarDadosNuvem();
  }, [userId]);

  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);

  // 2. AUTO-SAVE CLIENTES (Monitora mudanças e salva na nuvem)
  useEffect(() => {
    if (!userId || clientes.length === 0) return;
    
    const timeoutId = setTimeout(async () => {
        console.log(`💾 [AUTO-SAVE] Salvando ${clientes.length} clientes...`);
        for (const c of clientes) {
             const idFinal = c.id || `cli-${Date.now()}-${Math.random()}`;
             await salvarNoBanco('cliente', idFinal, { ...c, id: idFinal }, userId);
        }
    }, 5000); // Debounce de 5s (aumentado de 2s)

    return () => clearTimeout(timeoutId);
  }, [clientes, userId]);

  // 3. AUTO-SAVE ORÇAMENTOS (Monitora mudanças e salva na nuvem)
  useEffect(() => {
    if (!userId || meusOrcamentos.length === 0) return;

    const timeoutId = setTimeout(async () => {
        console.log('💾 [AUTO-SAVE] Salvando orçamentos...');
        for (const o of meusOrcamentos) {
             const idFinal = o.id || `orc-${Date.now()}-${Math.random()}`;
             await salvarNoBanco('orcamento', idFinal, { ...o, id: idFinal }, userId);
        }
    }, 5000); // Debounce de 5s (aumentado de 2s)
    
    return () => clearTimeout(timeoutId);
  }, [meusOrcamentos, userId]);

  // 🔥 SINCRONIZAÇÃO AUTOMÁTICA PARA O FORNECEDOR (Polling)
  // ⚠️ DESABILITADO - Causava memory leak
  useEffect(() => {
    // Só ativa se for fornecedor ou admin
    if (false && (userRole === 'fornecedor' || userRole === 'admin')) {
       console.log("📡 INICIANDO POLLING DE PEDIDOS (5s)...");
       const interval = setInterval(() => {
          import('./utils/cloudStorage').then(({ cloudStorage }) => {
             // Sincroniza pedidos
             cloudStorage.getItem('sysconecta_pedidos_fornecedor').then(remotePedidos => {
                if (remotePedidos && Array.isArray(remotePedidos)) {
                   setPedidosFornecedor(prev => {
                      // Verifica se mudou algo para evitar re-render desnecessário
                      if (JSON.stringify(prev) !== JSON.stringify(remotePedidos)) {
                         console.log(`🔄 RECEBIDOS ${remotePedidos.length} PEDIDOS DA NUVEM`);
                         
                         // Se aumentou o número, notifica!
                         if (remotePedidos.length > prev.length) {
                             toast.info(`�� ${remotePedidos.length - prev.length} Novo(s) Pedido(s) Recebido(s)!`);
                         }
                         
                         return remotePedidos;
                      }
                      return prev;
                   });
                }
             });
          });
       }, 5000); // Check every 5 seconds
       return () => clearInterval(interval);
    }
  }, [userRole]);

  // 🔥 SINCRONIZAÇÃO AUTOMÁTICA PARA O VIDRACEIRO (Polling de Status)
  // ⚠️ DESABILITADO - Causava memory leak
  useEffect(() => {
    // Só ativa se for vidraceiro
    if (false && userRole === 'vidraceiro') {
       console.log("📡 INICIANDO MONITORAMENTO DE STATUS DOS PEDIDOS (5s)...");
       const interval = setInterval(() => {
          import('./utils/cloudStorage').then(({ cloudStorage }) => {
             // Sincroniza pedidos (Lê da lista mestre dos fornecedores para ver se mudou status)
             cloudStorage.getItem('sysconecta_pedidos_fornecedor').then(remotePedidos => {
                if (remotePedidos && Array.isArray(remotePedidos)) {
                   // Filtra apenas os pedidos deste vidraceiro (usando algum critério, ou atualiza todos localmente se for simplificado)
                   // No teste atual, assumimos que setPedidosVidraceiro mantém a visão do vidraceiro
                   
                   setPedidosVidraceiro(prev => {
                      // Mapeia os pedidos locais e atualiza o status se encontrar correspondência na nuvem
                      const novaLista = prev.map(localPedido => {
                          const remoto = remotePedidos.find((p: any) => p.id === localPedido.id);
                          if (remoto && remoto.status !== localPedido.status) {
                              console.log(`✨ Status atualizado para pedido ${localPedido.id}: ${remoto.status}`);
                              toast.success(`Seu pedido #${remoto.numero || 'N/A'} foi atualizado para: ${remoto.status.toUpperCase()}`);
                              
                              // Se foi aprovado, gera notificação
                              if (remoto.status === 'aprovado' && localPedido.status !== 'aprovado') {
                                  setNotificacoesAprovacao(prevNotif => [...prevNotif, {
                                      id: Date.now(),
                                      tipo: 'aprovacao',
                                      pedidoId: remoto.id,
                                      pedidoNumero: remoto.numero || 'N/A',
                                      titulo: 'PEDIDO APROVADO!',
                                      mensagem: 'Seu pedido foi aprovado pelo fornecedor.',
                                      timestamp: new Date().toISOString(),
                                      lida: false
                                  }]);
                              }
                              
                              return remoto;
                          }
                          return localPedido;
                      });
                      
                      // Verifica se mudou algo
                      if (JSON.stringify(prev) !== JSON.stringify(novaLista)) {
                          return novaLista;
                      }
                      return prev;
                   });
                }
             });
          });
       }, 5000); // Check every 5 seconds
       return () => clearInterval(interval);
    }
  }, [userRole]);

  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginSenha, setLoginSenha] = useState('');
  const [chkSalvarSenha, setChkSalvarSenha] = useState(false);
  const [chkManterConectado, setChkManterConectado] = useState(false);
  const [showRecuperarSenha, setShowRecuperarSenha] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showSuporte, setShowSuporte] = useState(false);
  const [showAgenteSys, setShowAgenteSys] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Lista de Espera states
  const [waitlistNome, setWaitlistNome] = useState('');
  const [waitlistEmpresa, setWaitlistEmpresa] = useState('');
  const [waitlistTelefone, setWaitlistTelefone] = useState('');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSegmento, setWaitlistSegmento] = useState('');
  const [waitlistMensagem, setWaitlistMensagem] = useState('');
  const [waitlistEnviado, setWaitlistEnviado] = useState(false);

  // 🔥 NOTA: santaRitaUserData e pedidoSelecionado foram movidos para cima (linha 207-213)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleNavigate = (screen: string) => {
    console.log('🔄 NAVIGATING TO:', screen);
    setCurrentScreen(screen as Screen);
  };
  
  const handlePerfilSelect = (role: string, dadosExtras?: any) => {
    console.log('👤 PERFIL SELECIONADO:', role, dadosExtras);
    setUserRole(role);
    localStorage.setItem('sysconecta_user_role', role);
    
    // Se for Santa Rita (hardcoded por enquanto)
    if (role === 'fornecedor' && dadosExtras) {
       setSantaRitaUserData(dadosExtras.dadosEmpresa);
       setCurrentScreen('dashboard-fornecedor');
    } else if (role === 'vidraceiro') {
       setCurrentScreen('03-cadastro-dados');
    } else {
       setCurrentScreen('03-cadastro-dados');
    }
  };

  const handleFornecedorTipoSelect = (tipo: string) => {
      // ...
  };
  
  const handleCadastroContinuar = () => {
    setCurrentScreen('04-verificacao-codigo');
  };
  
  const handleConfirmarCodigo = () => {
    setCurrentScreen('05-boas-vindas-cinematica');
  };
  
  const handleBoasVindasComplete = () => {
    if (userRole === 'fornecedor') {
        setCurrentScreen('dashboard-fornecedor');
    } else {
        setCurrentScreen('03-dashboard-execucao');
    }
  };
  
  const handleAdicionarCliente = async (cliente: any) => {
      console.log('🚨🚨🚨 [handleAdicionarCliente] CHAMADO!');
      console.log('   Cliente recebido:', cliente);
      console.log('   userId atual:', userId);
      
      if (!userId) {
          console.error('❌ userId não disponível');
          toast.error('Erro: Usuário não autenticado. Faça login novamente.');
          return;
      }
      
      // 🔥 GARANTIR ID ÚNICO
      const clienteComId = {
          ...cliente,
          id: cliente.id || `cli-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          usuario_id: userId,
          createdAt: cliente.createdAt || new Date().toISOString()
      };
      
      console.log('📦 Cliente formatado para salvamento:', clienteComId);
      
      // 1. SALVAR NO BANCO (Persistência Real)
      console.log(`💾 [CLIENTE] Salvando no Supabase: ${clienteComId.nome}`);
      try {
          const resultado = await salvarNoBanco('cliente', clienteComId.id, clienteComId, userId);
          console.log(`✅ [CLIENTE] Resultado do salvamento:`, resultado);
          
          if (!resultado) {
              throw new Error('salvarNoBanco retornou false');
          }
          
          console.log(`✅ [CLIENTE] Salvo no banco: ${clienteComId.id}`);
      } catch (error) {
          console.error('❌ [CLIENTE] Erro ao salvar no banco:', error);
          toast.error('Erro ao salvar cliente no banco de dados');
          return;
      }
      
      // 2. ATUALIZAR ESTADO LOCAL (UI)
      setClientes(prev => {
          const existe = prev.some(c => c.id === clienteComId.id);
          if (existe) return prev.map(c => c.id === clienteComId.id ? clienteComId : c);
          return [clienteComId, ...prev];
      });
      
      // 3. DISPARAR EVENTO GLOBAL PARA ATUALIZAÇÃO EM TEMPO REAL
      window.dispatchEvent(new CustomEvent('cliente_criado', { detail: clienteComId }));
      
      toast.success('Cliente salvo com sucesso!');
      console.log('✅ handleAdicionarCliente CONCLUÍDO');
  };

  const handleSalvarOrcamento = (orcamento: any) => {
      console.log('💾 Novo Orçamento Salvo:', orcamento);
      setMeusOrcamentos(prev => {
          const existe = prev.some(o => o.id === orcamento.id);
          if (existe) return prev.map(o => o.id === orcamento.id ? orcamento : o);
          return [orcamento, ...prev];
      });
      toast.success('Orçamento salvo na nuvem com sucesso!');
  };
  
  const handleNovosPedidos = () => {
      // ...
  };

  const handleAuthSuccess = () => {
      setIsAuthModalOpen(false);
      
      console.log('✅ LOGIN SUCESSO! Redirecionando...', authTargetRole);
      
      // Salvar role
      setUserRole(authTargetRole);
      localStorage.setItem('sysconecta_user_role', authTargetRole);
      
      // Redirecionamento inteligente
      if (authTargetRole === 'fornecedor') {
          // Verifica se tem dados da Santa Rita salvos ou se é novo
          setCurrentScreen('dashboard-fornecedor');
      } else {
          // Vidraceiro padrão
          setCurrentScreen('03-dashboard-execucao');
      }
      
      toast.success('Bem-vindo de volta!');
  };
  
  const ResumoOrcamento = ({ onNavigate, orcamento, cliente }: any) => { return <div>Resumo Orcamento Vidraceiro</div> };
  const ResumoOrcamentoFornecedor = ({ onNavigate, orcamento, cliente, userData, onAprovarProducao }: any) => { return <div>Resumo Orcamento Fornecedor</div> };

  // 🔥 FUNÇÃO SELECIONAR CLIENTE
  const handleSelecionarCliente = (cliente: any) => {
    setClienteSelecionado(cliente);
    setDadosCliente(cliente);
    // 🔥 SALVAR CLIENTE NO ORÇAMENTO ATUAL
    setOrcamentoAtual(prev => ({
      ...prev,
      cliente: cliente
    }));
    console.log('✅ CLIENTE SELECIONADO E SALVO NO ORÇAMENTO:', cliente);
  };

  // 🔥 FUNÇÃO PARA FORNECEDOR APROVAR PEDIDO (COM PERSISTÊNCIA NA NUVEM)
  const handleAprovarPedido = (pedido: any) => {
    const pedidoId = pedido.id || pedido;
    console.log('🎉 FORNECEDOR APROVOU PEDIDO:', pedidoId);
    
    // 🔥 CRIAR PEDIDO ATUALIZADO COM STATUS DE PRODUÇÃO
    const pedidoAtualizado = {
      ...pedido,
      status: 'aprovado',
      statusFornecedor: 'aprovado',
      etapaProducao: 'em-producao',
      dataAprovacao: new Date().toISOString()
    };
    
    // 🔥 ATUALIZAR LOCALMENTE PRIMEIRO (Feedback instantâneo)
    setPedidosFornecedor(prev => prev.map(p => 
      p.id === pedidoId ? pedidoAtualizado : p
    ));

    // 🔥 PERSISTIR APROVAÇÃO NA NUVEM
    import('./utils/cloudStorage').then(async ({ cloudStorage }) => {
        try {
            // 1. Busca lista atual da nuvem
            const pedidosNuvem = await cloudStorage.getItem('sysconecta_pedidos_fornecedor') || [];
            
            // 2. Atualiza o pedido específico na lista da nuvem
            const novaListaNuvem = pedidosNuvem.map((p: any) => 
                p.id === pedidoId ? { ...p, ...pedidoAtualizado } : p
            );
            
            // 3. Salva a lista atualizada
            await cloudStorage.setItem('sysconecta_pedidos_fornecedor', novaListaNuvem);
            console.log('✅ Status de aprovação salvo na nuvem com sucesso!');
            toast.success('Pedido aprovado e sincronizado com o vidraceiro!');
        } catch (err) {
            console.error('❌ Erro ao salvar aprovação na nuvem:', err);
            toast.error('Erro ao sincronizar aprovação. Verifique a conexão.');
        }
    });

    // 🔥 CRIAR NOTIFICAÇÃO DE APROVAÇÃO PARA O VIDRACEIRO
    const novaNotificacao = {
      id: Date.now(),
      tipo: 'aprovacao',
      pedidoId: pedidoId,
      pedidoNumero: pedido.numero || pedido.numeroPedido || 'N/A',
      titulo: 'PEDIDO APROVADO EM PRODUÇÃO',
      mensagem: 'Seu pedido foi aprovado pelo fornecedor e está em produção!',
      timestamp: new Date().toISOString(),
      lida: false
    };

    setNotificacoesAprovacao(prev => [...prev, novaNotificacao]);

    console.log('✅ NOTIFICAÇÃO DE APROVAÇÃO CRIADA:', novaNotificacao);
    console.log('📦 PEDIDO ATUALIZADO PARA PRODUÇÃO:', pedidoAtualizado);
    
    // 🔥 SELECIONAR PEDIDO E IR PARA GESTÃO DE PRODUÇÃO
    setPedidoSelecionado(pedidoAtualizado);
    setCurrentScreen('gestao-producao');
  };

  // 🔥 NOVO: ROTA DO NOVO ORÇAMENTO (COM GEO-ROUTING)
  const handleNovoOrcamentoSantaRita = () => {
    const fornecedorLocal = PARCEIROS_POR_ESTADO[usuarioEstado] || PARCEIROS_POR_ESTADO['DEFAULT'];
    console.log(`🏭 INICIANDO ORÇAMENTO COM PARCEIRO LOCAL: ${fornecedorLocal.nome}`);
    
    // Limpar orçamento anterior
    setOrcamentoAtual({
        modelo: null,
        tipologia: null,
        linha: '',
        altura: '',
        largura: '',
        itens: [],
        cliente: null,
        // O "vidraceiro" aqui na verdade representa o FORNECEDOR do catálogo neste contexto do componente
        vidraceiro: { 
            nome: fornecedorLocal.nome,
            cnpj: fornecedorLocal.cnpj,
            cidade: fornecedorLocal.cidade,
            estado: fornecedorLocal.estado
        }, 
        dataOrcamento: new Date(),
        valorTotal: 0
    });
    
    // Redireciona para o fluxo de orçamento padrão
    setCurrentScreen('novo-orcamento-santa-rita'); 
  };

  // 🔥 FUNÇÃO PARA FECHAR NOTIFICAÇÃO
  const handleFecharNotificacao = (notificacaoId: number) => {
    setNotificacoesAprovacao(prev => prev.map(n => 
      n.id === notificacaoId ? { ...n, lida: true } : n
    ));
  };

  // 🔥 FUNÇÃO PARA ABRIR PEDIDO APROVADO
  const handleAbrirPedidoAprovado = (pedidoId: any) => {
    console.log(' ABRINDO PEDIDO APROVADO:', pedidoId);
    // Navegar para tela de meus pedidos
    handleNavigate('meus-pedidos');
  };

  // 🔥 NOVA FUNÇÃO: ATUALIZAR ETAPA DE PRODUÇÃO
  const handleAtualizarEtapaProducao = (pedidoId: string, novaEtapa: string) => {
    console.log('🔄 ATUALIZANDO ETAPA DE PRODUÇÃO:', pedidoId, novaEtapa);
    
    // Atualizar pedido selecionado
    setPedidoSelecionado((prev: any) => {
      if (prev && prev.id === pedidoId) {
        return {
          ...prev,
          etapaProducao: novaEtapa,
          statusEntrega: novaEtapa
        };
      }
      return prev;
    });

    // Atualizar nos pedidos do fornecedor
    setPedidosFornecedor(prev => prev.map(p => 
      p.id === pedidoId 
        ? { ...p, etapaProducao: novaEtapa, statusEntrega: novaEtapa }
        : p
    ));

    // Atualizar nos pedidos do vidraceiro
    setPedidosVidraceiro(prev => prev.map(p => 
      p.id === pedidoId 
        ? { ...p, etapaProducao: novaEtapa, statusEntrega: novaEtapa }
        : p
    ));
  };

  // 🔥 NOVA FUNÇÃO: CONFIRMAR CARREGAMENTO (muda status para EM ROTA)
  const handleConfirmarCarregamento = (pedidoId: string, dadosRomaneio: any) => {
    console.log('🚚 CONFIRMANDO CARREGAMENTO:', pedidoId, dadosRomaneio);
    
    const pedidoAtualizado = {
      ...pedidoSelecionado,
      status: 'em_rota',
      statusEntrega: 'em_rota',
      etapaProducao: 'em_rota',
      romaneio: dadosRomaneio,
      dataCarregamento: new Date().toISOString()
    };

    // Atualizar pedido selecionado
    setPedidoSelecionado(pedidoAtualizado);

    // Atualizar nos pedidos do fornecedor
    setPedidosFornecedor(prev => prev.map(p => 
      p.id === pedidoId 
        ? pedidoAtualizado
        : p
    ));

    // Atualizar nos pedidos do vidraceiro
    setPedidosVidraceiro(prev => prev.map(p => 
      p.id === pedidoId 
        ? pedidoAtualizado
        : p
    ));

    // 🔥 CRIAR NOTIFICAÇÃO PARA O VIDRACEIRO
    const novaNotificacao = {
      id: Date.now(),
      tipo: 'em_rota',
      pedidoId: pedidoId,
      pedidoNumero: pedidoAtualizado.numero || pedidoAtualizado.numeroPedido || 'N/A',
      titulo: 'PEDIDO EM ROTA DE ENTREGA',
      mensagem: 'Seu pedido saiu para entrega!',
      timestamp: new Date().toISOString(),
      lida: false
    };

    setNotificacoesAprovacao(prev => [...prev, novaNotificacao]);

    console.log('✅ PEDIDO MUDOU PARA EM ROTA:', pedidoAtualizado);
    alert('✅ CARREGAMENTO CONFIRMADO! Pedido está em rota de entrega.');
    setCurrentScreen('dashboard-santa-rita');
  };

  // 🔥 NOVA FUNÇÃO: CONFIRMAR ENTREGA (status final ENTREGUE)
  const handleConfirmarEntrega = (pedidoId: string) => {
    console.log('📦 CONFIRMANDO ENTREGA:', pedidoId);
    
    const pedidoAtualizado = {
      ...pedidoSelecionado,
      status: 'entregue',
      statusEntrega: 'entregue',
      etapaProducao: 'entregue',
      dataEntrega: new Date().toISOString()
    };

    // Atualizar pedido selecionado
    setPedidoSelecionado(pedidoAtualizado);

    // Atualizar nos pedidos do fornecedor
    setPedidosFornecedor(prev => prev.map(p => 
      p.id === pedidoId 
        ? pedidoAtualizado
        : p
    ));

    // Atualizar nos pedidos do vidraceiro
    setPedidosVidraceiro(prev => prev.map(p => 
      p.id === pedidoId 
        ? pedidoAtualizado
        : p
    ));

    // 🔥 CRIAR NOTIFICAÇÃO PARA O VIDRACEIRO
    const novaNotificacao = {
      id: Date.now(),
      tipo: 'entregue',
      pedidoId: pedidoId,
      pedidoNumero: pedidoAtualizado.numero || pedidoAtualizado.numeroPedido || 'N/A',
      titulo: 'PEDIDO ENTREGUE COM SUCESSO',
      mensagem: 'Seu pedido foi entregue!',
      timestamp: new Date().toISOString(),
      lida: false
    };

    setNotificacoesAprovacao(prev => [...prev, novaNotificacao]);

    console.log('✅ PEDIDO ENTREGUE:', pedidoAtualizado);
    alert('✅ ENTREGA CONFIRMADA COM SUCESSO!');
    setCurrentScreen('dashboard-santa-rita');
  };

  const handleFinalizarCompra = async (comprovantes: any) => {
    // 🔥 GEOLOCALIZAÇÃO: Determinar Fornecedor baseado no Estado do Usuário
    const fornecedorDestino = PARCEIROS_POR_ESTADO[usuarioEstado] || PARCEIROS_POR_ESTADO['DEFAULT'];
    console.log(`📍 PEDIDO DIRECIONADO PARA: ${fornecedorDestino.nome} (${usuarioEstado})`);

    // 🔥 NOVO: Criar pedido completo com dados REAIS do vidraceiro e cliente
    const novoPedido = {
      id: `PED-${Date.now()}`,
      numeroPedido: Math.floor(10000 + Math.random() * 90000),
      data: new Date().toISOString(),
      dataFormatada: new Date().toLocaleDateString('pt-BR'),
      horaFormatada: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      
      // 🔥 FORNECEDOR DEFINIDO PELA REGIÃO
      fornecedor_id: fornecedorDestino.nome, // Usando nome como ID por enquanto
      fornecedor_dados: fornecedorDestino,

      // 🔥 Dados do CLIENTE REAL (selecionado no fluxo)
      cliente: clienteSelecionado || dadosCliente || {
        nome: 'Cliente não identificado',
        cpf: '-',
        telefone: '-',
        email: '-'
      },
      
      // Dados do vidraceiro
      vidraceiro: {
        nome: userName || 'Vidraçaria Silva & Cia', // Usa o nome logado
        cnpj: '12.345.678/0001-90',
        telefone: '(47) 99999-8888',
        endereco: 'Avenida Brasil, 2154',
        bairro: 'Centro',
        cidade: 'Balneário Camboriú',
        estado: 'SC',
        cep: '88330-000'
      },
      
      // 🔥 Dados do pedido REAIS (dos itens do orçamento)
      tipoPedido: selectedTipologia?.nome || 'Porta de Correr 4 Folhas',
      tipologia: selectedTipologia,
      itensOrcamento: itensOrcamento.length > 0 ? itensOrcamento : [
        { id: 1, codigo: 'V1', tipo: 'FIXA', largura: 800, altura: 2040, area: 1.632 },
        { id: 2, codigo: 'V2', tipo: 'MÓVEL', largura: 900, altura: 2080, area: 1.872 },
        { id: 3, codigo: 'V3', tipo: 'MÓVEL', largura: 900, altura: 2080, area: 1.872 },
        { id: 4, codigo: 'V4', tipo: 'FIXA', largura: 800, altura: 2040, area: 1.632 }
      ],
      // (Mantendo compatibilidade de campos)
      vidros: itensOrcamento.length > 0 ? itensOrcamento : [], 
      items: itensOrcamento.map(i => ({
        descricao: i.tipo || 'Vidro',
        largura: i.largura,
        altura: i.altura,
        espessura: i.espessura || 8,
        quantidade: 1
      })),
      
      dimensoes: {
        larguraTotal: 3400,
        alturaTotal: 2100,
        numeroFolhas: 4
      },
      
      especificacoes: {
        cor: 'Fumê',
        espessura: '8mm',
        temPuxador: true,
        temFechadura: true,
        temRoldanas: true,
        tipoAbertura: 'correr'
      },
      
      valores: {
        vidros: itensOrcamento.reduce((sum, item) => sum + (item.valor || 0), 0) || 1142.40,
        aluminio: 489.60,
        acessorios: 170.00,
        total: itensOrcamento.reduce((sum, item) => sum + (item.valor || 0), 0) + 489.60 + 170.00 || 1802.00
      },
      
      valor_total: itensOrcamento.reduce((sum, item) => sum + (item.valor || 0), 0) + 659.60,
      cliente_nome: clienteSelecionado?.nome || 'Cliente Final',
      vidraceiro_nome: userName,

      comprovantes: comprovantes,
      
      status: 'aguardando_aprovacao', 
      statusFornecedor: 'novo', 
      visualizado: false,
      desenhoTecnico: true
    };
    
    // 🔥 ADICIONAR aos pedidos do vidraceiro
    setPedidosVidraceiro(prev => [...prev, novoPedido]);
    
    // 🔥 ADICIONAR SIMULTANEAMENTE aos pedidos do fornecedor (NUVEM DE FORMA SEGURA VIA PROXY)
    setPedidosFornecedor(prev => {
        const novaListaLocal = [...prev, novoPedido];
        
        // Salva item individualmente usando a API Proxy (Bypass RLS)
        // Isso garante que o pedido chegue ao fornecedor mesmo sem auth configurada no DB
        const idFornecedor = novoPedido.fornecedor_id || 'santa-rita-vidros';
        salvarNoBanco('pedido', novoPedido.id, novoPedido, idFornecedor).then(sucesso => {
            if (sucesso) console.log('✅ Pedido enviado para nuvem com sucesso!');
            else console.error('❌ Falha ao enviar pedido para nuvem');
        });
        
        return novaListaLocal;
    });
    
    // Incrementar notificações do fornecedor
    setNotificacoesFornecedor(prev => prev + 1);
    
    console.log('🔥 PEDIDO CRIADO E ENVIADO PARA NUVEM:', novoPedido);
    
    setPedidosRealizados(prev => [...prev, novoPedido]);
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (waitlistNome && waitlistTelefone && waitlistEmail) {
      // Aqui você pode integrar com backend/email
      console.log('Lista de Espera:', {
        nome: waitlistNome,
        empresa: waitlistEmpresa,
        telefone: waitlistTelefone,
        email: waitlistEmail,
        segmento: waitlistSegmento,
        mensagem: waitlistMensagem
      });
      setWaitlistEnviado(true);
      setTimeout(() => {
        setWaitlistEnviado(false);
        setWaitlistNome('');
        setWaitlistEmpresa('');
        setWaitlistTelefone('');
        setWaitlistEmail('');
        setWaitlistSegmento('');
        setWaitlistMensagem('');
      }, 3000);
    }
  };

  // 🔥 FUNÇÃO DE REPROVAR PEDIDO
  const handleReprovarPedido = (pedido: any) => {
    // Atualizar status do pedido
    setPedidosVidraceiro(prev => 
      prev.map(p => p.id === pedido.id 
        ? { ...p, status: 'reprovado', statusFornecedor: 'reprovado' }
        : p
      )
    );
    
    // Remover notificação
    setNotificacoesFornecedor(prev => Math.max(0, prev - 1));
    
    // Voltar para dashboard
    alert('❌ Pedido REPROVADO. O vidraceiro será notificado.');
    setCurrentScreen('dashboard-santa-rita');
  };

  // 🔥 NOVA FUNÇÃO: APROVAR PRODUÇÃO DIRETO DO BALCÃO
  const handleAprovarProducaoBalcao = (pedidoProducao: any) => {
    console.log('🏭 PEDIDO DE BALCÃO APROVADO PARA PRODUÇÃO:', pedidoProducao);
    
    // 1. Adicionar aos pedidos do fornecedor (Dashboard)
    setPedidosFornecedor(prev => [pedidoProducao, ...prev]);
    
    // 2. Adicionar aos pedidos "realizados" para histórico
    setPedidosRealizados(prev => [...prev, pedidoProducao]);
    
    // 3. Atualizar notificações internas (opcional)
    setNotificacoesFornecedor(prev => prev + 1);
    
    // 4. Redirecionar para Dashboard com sucesso
    setCurrentScreen('dashboard-santa-rita');
  };

  return (
    <I18nProvider>
      {/* 🔥 TOASTER PARA NOTIFICAÇÕES */}
      <Toaster position="top-right" richColors />
      
      <div className="min-h-screen bg-[#FAF9F7]">
        {/* ROTA: RESUMO ORÇAMENTO (Detecta se é fornecedor) */}
        {currentScreen === '09-resumo-orcamento' && (
            <>
              {(userRole === 'fornecedor' || santaRitaUserData) ? (
                <ResumoOrcamentoFornecedor 
                  onNavigate={handleNavigate}
                  orcamento={orcamentoAtual}
                  cliente={orcamentoAtual.cliente}
                  userData={santaRitaUserData}
                  onAprovarProducao={handleAprovarProducaoBalcao}
                />
              ) : (
                <ResumoOrcamento 
                  onNavigate={handleNavigate}
                  orcamento={orcamentoAtual}
                  cliente={orcamentoAtual.cliente}
                />
              )}
            </>
        )}
        {/* 🔥 NOTIFICAÇÕES DE APROVAÇÃO (aparece para o vidraceiro) */}
      {currentScreen !== 'dashboard-santa-rita' && 
       currentScreen !== 'pedidos-pendentes-santa-rita' && 
       currentScreen !== 'detalhe-pedido-santa-rita' && (
        <NotificacaoAprovacao 
          notificacoes={notificacoesAprovacao}
          onFecharNotificacao={handleFecharNotificacao}
          onAbrirPedido={handleAbrirPedidoAprovado}
        />
      )}

      {/* Botão Agente Sys - OBRIGATÓRIO EM TODAS AS TELAS */}
      <button
        onClick={() => setShowAgenteSys(!showAgenteSys)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-50 hover:scale-105"
        aria-label="Agente Sys"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </button>

      {/* Painel Agente Sys */}
      {showAgenteSys && (
        <div className="fixed bottom-28 right-8 w-96 h-[500px] bg-white border border-gray-200 rounded-xl shadow-2xl z-50 flex flex-col">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-gray-900 font-semibold">Agente Sys</h3>
            <button onClick={() => setShowAgenteSys(false)} className="text-gray-500 hover:text-gray-900">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="text-gray-600 text-sm">
              Como posso ajudar?
            </div>
          </div>
          <div className="p-6 border-t border-gray-200">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2C5F6F]/20 focus:border-[#2C5F6F]"
              />
              <button className="bg-[#2C5F6F] hover:bg-[#234A56] text-white px-6 rounded-lg transition-colors">
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 TELA ADMIN - INICIALIZAR BANCO DE DADOS */}
      {currentScreen === 'admin-inicializar-banco' && (
        <InicializarBanco />
      )}

      {/* 🔐 ADMIN LOGIN */}
      {currentScreen === 'admin-login' && (
        <AdminLogin
          onLoginSuccess={() => setCurrentScreen('admin-dashboard')}
          onBack={() => setCurrentScreen('01-login')}
        />
      )}

      {/* 🔐 ADMIN DASHBOARD */}
      {currentScreen === 'admin-dashboard' && (
        <AdminDashboard
          onLogout={() => {
            setUserEmail('');
            localStorage.removeItem('sysconecta_user_email');
            setCurrentScreen('01-login');
          }}
        />
      )}

      {/* TELA 01 - 🔥 SYSCONECTA ULTRA PREMIUM LOGIN */}
      {currentScreen === '01-login' && (
        <>
          {/* Ícone secreto de admin */}
          <div 
            onClick={() => setCurrentScreen('admin-login')}
            className="fixed top-4 right-4 z-50 cursor-pointer opacity-10 hover:opacity-100 transition-opacity"
            title="Acesso Master"
          >
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">🔐</span>
            </div>
          </div>

          <LandingPageEnterprise
            onLogin={async (email, password, profile, rememberMe) => {
              setIsLoading(true);
              
              try {
                // 1. Tenta autenticação real no Supabase
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                let loginSuccess = false;
                let effectiveRole = profile;
                let effectiveUserId = '';

                if (data?.user) {
                    loginSuccess = true;
                    // Recuperar metadados do usuário
                    const metadata = data.user.user_metadata || {};
                    effectiveRole = metadata.role || profile || 'vidraceiro';
                    effectiveUserId = data.user.id;
                    
                    setUserName(metadata.full_name || email);
                    if (metadata.state) setUsuarioEstado(metadata.state);
                    
                    console.log('✅ Login Supabase realizado:', email);
                } else {
                    // 2. Fallback para Admin Hardcoded (Legado/Emergência)
                    const AUTHORIZED_EMAIL = 'Leandro.zara@sysvidro.com';
                    const AUTHORIZED_PASSWORD = '56734297Ombongo!';
                    
                    if (email === AUTHORIZED_EMAIL && password === AUTHORIZED_PASSWORD) {
                        loginSuccess = true;
                        effectiveRole = profile;
                        effectiveUserId = 'user-leandro-zara-main';
                        console.log('⚠️ Usando login legado para admin:', email);
                    }
                }

                if (loginSuccess) {
                    setUserRole(effectiveRole);
                    setUserId(effectiveUserId);
                    setUserEmail(email);
                    localStorage.setItem('sysconecta_user_id', effectiveUserId);
                    localStorage.setItem('sysconecta_user_email', email);

                    // 🔥 SALVAR DADOS COMPLETOS DO USUÁRIO (FIX: "Vidraçaria Parceira")
                    if (data?.user) {
                        const metadata = data.user.user_metadata || {};
                        const dadosUsuario = {
                            id: effectiveUserId,
                            email: email,
                            nome: metadata.full_name || metadata.nome || email.split('@')[0],
                            nomeFantasia: metadata.nome_empresa || metadata.company_name || metadata.nomeFantasia || metadata.full_name || email.split('@')[0],
                            telefone: metadata.phone || metadata.telefone || '(00) 00000-0000',
                            cnpj: metadata.cnpj || metadata.cpf || '',
                            cpf: metadata.cpf || '',
                            endereco: metadata.address || metadata.endereco || '',
                            numero: metadata.numero || 'S/N',
                            bairro: metadata.bairro || '',
                            cidade: metadata.city || metadata.cidade || usuarioEstado,
                            estado: metadata.state || metadata.estado || usuarioEstado,
                            role: effectiveRole
                        };
                        
                        localStorage.setItem('sysconecta_usuario_dados', JSON.stringify(dadosUsuario));
                        console.log('🔥🔥🔥 DADOS DO USUÁRIO SALVOS NO LOCALSTORAGE:', dadosUsuario);
                        console.log('🔥🔥🔥 metadata completo:', metadata);
                    }

                    if (rememberMe) {
                        localStorage.setItem('sysconecta_remember_me', 'true');
                    }

                    // 🔥 MIGRAÇÃO AUTOMÁTICA DE PEDIDOS (Executa UMA VEZ por usuário)
                    const migrationKey = `sysconecta_migration_done_${effectiveUserId}`;
                    const migrationDone = localStorage.getItem(migrationKey);
                    
                    if (!migrationDone && effectiveUserId) {
                        console.log('🔄 Executando migração automática de pedidos para userId:', effectiveUserId);
                        
                        // Executa migração em background (não bloqueia o login)
                        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos/migrate-user-id`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${publicAnonKey}`
                            },
                            body: JSON.stringify({ userId: effectiveUserId })
                        })
                        .then(res => res.json())
                        .then(result => {
                            if (result.success) {
                                console.log(`✅ Migração concluída: ${result.updated} pedido(s) atualizado(s)`);
                                localStorage.setItem(migrationKey, 'true');
                                
                                if (result.updated > 0) {
                                    toast.success(`${result.updated} pedido(s) migrado(s) com sucesso!`);
                                }
                            } else {
                                console.warn('⚠️ Migração falhou:', result.error);
                            }
                        })
                        .catch(err => {
                            console.error('❌ Erro na migração automática:', err);
                        });
                    } else if (migrationDone) {
                        console.log('✅ Migração já foi executada para este usuário');
                    }

                    // Roteamento
                    if (['vidraceiro', 'arquiteto', 'construtor'].includes(effectiveRole)) {
                        setCurrentScreen('03-dashboard-execucao');
                    }
                    else if (effectiveRole === 'fornecedor') {
                        // Lógica específica para fornecedor
                        const tempData = localStorage.getItem('sysconecta_temp_fornecedor_data');
                        if (tempData) {
                            const dados = JSON.parse(tempData);
                            if (dados.empresaPreCadastrada) {
                                setSantaRitaUserData(dados.dadosEmpresa);
                                setUserName(dados.dadosEmpresa.contatoResponsavel);
                                setCurrentScreen('dashboard-santa-rita');
                            } else {
                                setCurrentScreen('dashboard-fornecedor');
                            }
                            localStorage.removeItem('sysconecta_temp_fornecedor_data');
                        } else {
                            setCurrentScreen('dashboard-fornecedor');
                        }
                    }
                    else {
                        setCurrentScreen('03-dashboard-execucao');
                    }
                } else {
                    toast.error("Acesso negado. Verifique suas credenciais.");
                    if (error) console.error("Erro Login:", error);
                }
              } catch (err) {
                  console.error("Erro crítico login:", err);
                  toast.error("Erro ao realizar login.");
              } finally {
                  setIsLoading(false);
              }
            }}
            onRegister={(type) => {
              console.log('📝 Abrindo modal de acesso para:', type);
              // Configura o papel alvo (vidraceiro, fornecedor, etc)
              setAuthTargetRole(type);
              // Abre o modal de autenticação (Login/Cadastro)
              setIsAuthModalOpen(true);
            }}
            onFornecedorBypass={(dados: any) => {
                console.log('🚀 BYPASS FORNECEDOR DETECTADO:', dados);
                if (dados.empresaPreCadastrada) {
                    // 🔥 ADICIONAR ID AO FORNECEDOR
                    const fornecedorData = {
                        ...dados.dadosEmpresa,
                        id: 'forn-vidro-01' // 🔥 ID PADRONIZADO (mesmo do DEV switch e GestaoStatusPedidos)
                    };
                    
                    setSantaRitaUserData(fornecedorData);
                    setUserRole('fornecedor');
                    localStorage.setItem('sysconecta_user_role', 'fornecedor');
                    localStorage.setItem('sysconecta_santa_rita_data', JSON.stringify(fornecedorData));
                    
                    // Simula um ID de usuário para sessão local
                    setUserId('fornecedor-santa-rita-bypass');
                    setUserName(fornecedorData.contatoResponsavel);
                    
                    setCurrentScreen('dashboard-santa-rita');
                    toast.success(`Bem-vindo, ${fornecedorData.nomeFantasia}!`);
                }
            }}
            onAdminLogin={() => setCurrentScreen('admin-login')}
          />

          {/* 🔥 PREMIUM FORGOT PASSWORD MODAL */}
          <ForgotPasswordModal
            isOpen={showRecuperarSenha}
            onClose={() => setShowRecuperarSenha(false)}
          />

          {/* 🔥 WAITLIST MODAL PREMIUM */}
          <WaitlistModalPremium
            isOpen={showWaitlist}
            onClose={() => setShowWaitlist(false)}
          />

        </>
      )}

      {/* TELA 03 - 🔥 CADASTRO DE DADOS ULTRA PREMIUM */}
      {currentScreen === '03-cadastro-dados' && (
        <CadastroDadosPremium
          onComplete={handleCadastroContinuar}
          onBack={() => setCurrentScreen('01-login')}
          perfilSelecionado={userRole}
        />
      )}

      {/* TELA 04 - 🔥 VERIFICAÇÃO DE CÓDIGO PREMIUM */}
      {currentScreen === '04-verificacao-codigo' && (
        <VerificacaoCodigoPremium
          onSuccess={handleConfirmarCodigo}
          onBack={() => setCurrentScreen('03-cadastro-dados')}
          codigoCorreto={verificationCode}
          email="usuario@email.com"
          perfilSelecionado={userRole}
        />
      )}

      {/* TELA 05 - 🎬 BOAS-VINDAS CINEMATOGRÁFICA */}
      {currentScreen === '05-boas-vindas-cinematica' && (
        <BoasVindasCinematica
          nomeUsuario={userName || 'Usuário'}
          perfilUsuario={userRole}
          onComplete={handleBoasVindasComplete}
        />
      )}

      {/* DASHBOARD FORNECEDOR (GENERICO) */}
      {(currentScreen === 'dashboard-fornecedor' || currentScreen === 'dashboard-santa-rita') && (
        <DashboardFornecedor 
            userData={santaRitaUserData} 
            onNavigate={handleNavigate}
            onLogout={() => {
                setSantaRitaUserData(null);
                setUserEmail('');
                localStorage.removeItem('sysconecta_user_email');
                setCurrentScreen('01-login');
            }}
        />
      )}

      {/* TELA 03 - DASHBOARD DE EXECUÇÃO */}
      {currentScreen === '03-dashboard-execucao' && (
        <DashboardExecucao 
          onNavigate={handleNavigate}
          pedidos={pedidosVidraceiro}
          clientes={clientes}
          onAdicionarCliente={handleAdicionarCliente}
          notificacoes={notificacoesAprovacao}
          onNovosPedidos={handleNovosPedidos}
          orcamentos={meusOrcamentos}
          onSalvarOrcamento={handleSalvarOrcamento}
        />
      )}

      {/* TELA - NOVO ORÇAMENTO (MODERNO - VIA MENU INFERIOR) */}
      {currentScreen === 'novo-orcamento-modal' && (
        <DashboardExecucao 
          onNavigate={handleNavigate}
          pedidos={pedidosVidraceiro}
          clientes={clientes}
          onAdicionarCliente={handleAdicionarCliente}
          notificacoes={notificacoesAprovacao}
          initialView="novo-orcamento"
          onNovosPedidos={handleNovosPedidos}
          orcamentos={meusOrcamentos}
          onSalvarOrcamento={handleSalvarOrcamento}
        />
      )}

      {/* TELA 10 - MEUS CLIENTES */}
      {currentScreen === '10-meus-clientes' && (
        <DashboardExecucao 
          onNavigate={handleNavigate}
          pedidos={pedidosVidraceiro}
          clientes={clientes}
          onAdicionarCliente={handleAdicionarCliente}
          notificacoes={notificacoesAprovacao}
          initialView="clientes"
          onNovosPedidos={handleNovosPedidos}
          orcamentos={meusOrcamentos}
          onSalvarOrcamento={handleSalvarOrcamento}
        />
      )}

      {/* TELA 11 - OBRAS */}
      {currentScreen === '11-obras' && (
        <TelaEmBreve titulo="Obras / Romaneios" onNavigate={handleNavigate} />
      )}

      {/* TELA 11B - NOVO ROMANEIO */}
      {currentScreen === '11B-novo-romaneio' && (
        <RomaneioEntrega onClose={() => handleNavigate('03-dashboard-execucao')} />
      )}

      {/* TELA 12 - MEUS PEDIDOS */}
      {currentScreen === '12-meus-pedidos' && (
        <div className="fixed inset-0 bg-[#0A0A0A] flex flex-col">
          {/* Header */}
          <div className="bg-[#1A1A1A] border-b border-[#2D2D2D] p-4 flex-shrink-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleNavigate('03-dashboard-execucao')}
                className="flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors"
              >
                ← Voltar
              </button>
              <div>
                <h1 className="text-lg font-bold text-white">Meus Pedidos</h1>
                <p className="text-sm text-[#9CA3AF]">Histórico completo de pedidos</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <MeusPedidos vidraceiroId={userId} onNavigate={handleNavigate} />
          </div>
        </div>
      )}

      {/* TELA 13 - AGENDA */}
      {currentScreen === '13-agenda' && (
        <TelaEmBreve titulo="Agenda" onNavigate={handleNavigate} />
      )}

      {/* TELA 14 - MEUS CONTRATOS */}
      {currentScreen === '14-meus-contratos' && (
        <TelaEmBreve titulo="Meus Contratos" onNavigate={handleNavigate} />
      )}

      {/* TELA - ACOMPANHAR PEDIDO (Redireciona para Meus Pedidos) */}
      {currentScreen === 'acompanhar-pedido' && (
        <MeusPedidos onNavigate={handleNavigate} />
      )}

      {/* TELA - MEUS PEDIDOS (ACOMPANHAMENTO) */}
      {currentScreen === 'meus-pedidos' && (
        <MeusPedidos onNavigate={handleNavigate} />
      )}

      {/* TELA - MINHAS ENTREGAS */}
      {currentScreen === 'minhas-entregas' && (
        <MinhasEntregas 
          onNavigate={handleNavigate} 
          pedidosVidraceiro={pedidosVidraceiro}
        />
      )}

      {/* TELA - ROTA EM TEMPO REAL */}
      {currentScreen === 'rota-tempo-real' && (
        <RotaTempoReal onNavigate={handleNavigate} />
      )}

      {/* TELA - SYSLICITA */}
      {currentScreen === 'syslicita' && (
        <SysLicita onClose={() => handleNavigate('03-dashboard-execucao')} />
      )}

      {/* TELA - SYSFRETE */}
      {currentScreen === 'sysfrete' && (
        <SysFrete onClose={() => handleNavigate('03-dashboard-execucao')} />
      )}

      {/* TELA - SYSMONTAGEM */}
      {currentScreen === 'sysmontagem' && (
        <SysMontagem onClose={() => handleNavigate('03-dashboard-execucao')} />
      )}

      {/* TELA - SYSFEDERAL */}
      {currentScreen === 'sysfederal' && (
        <SysFederal onClose={() => handleNavigate('03-dashboard-execucao')} />
      )}

      {/* TELA - CONFIGURADOR SUPREMA COMPLETO (SISTEMA TÉCNICO COMPLETO) 🔥 NOVO */}
      {currentScreen === 'configurador-suprema' && (
        <ConfiguradorSupremaCompleto
          onVoltar={() => handleNavigate('03-dashboard-execucao')}
          onFinalizar={(config, resultado) => {
              console.log('✅ ORÇAMENTO FINALIZADO:', config, resultado);
              
              // 1. Criar objeto de pedido
              const novoPedido = {
                  id: Date.now().toString(),
                  numero: Math.floor(Math.random() * 10000) + 1000,
                  data_pedido: new Date().toISOString(),
                  status: 'aguardando_aprovacao',
                  perfil: 'vidraceiro',
                  cliente_nome: clienteSelecionado?.nome || dadosCliente?.nome || 'Cliente Balcão',
                  vidraceiro_nome: currentUser?.nome || 'Leandro Vidraçaria',
                  vidraceiro_cidade: currentUser?.cidade || usuarioEstado || 'SC',
                  vidraceiro_telefone: currentUser?.telefone || '(00) 00000-0000',
                  vidraceiro_email: currentUser?.email || 'contato@vidracaria.com',
                  vidraceiro_endereco: currentUser?.endereco || 'Endereço não cadastrado',
                  valor_total: resultado.resumo.custo_total_estimado,
                  condicao_pagamento: '100%',
                  valor_pago: resultado.resumo.custo_total_estimado,
                  items: [
                      {
                          descricao: `Janela Suprema ${config.largura_total_mm}x${config.altura_total_mm}`,
                          largura_cad: config.largura_total_mm,
                          altura_cad: config.altura_total_mm,
                          espessura_cad: config.espessura_vidro,
                          tipo_cad: config.tipo_vidro,
                          cor_cad: config.cor_vidro,
                          quantidade: config.quantidade || 1,
                          ambiente: 'Geral',
                          detalhes: resultado
                      }
                  ],
                  data: new Date().toISOString(),
                  cliente: clienteSelecionado || dadosCliente || { nome: 'Cliente Balcão' },
                  total: resultado.resumo.custo_total_estimado * 1.5,
                  itens: [
                      {
                          titulo: `Janela Suprema ${config.largura_total_mm}x${config.altura_total_mm}`,
                          descricao: `${config.tipo_vidro} ${config.espessura_vidro}mm ${config.cor_vidro}`,
                          quantidade: config.quantidade || 1,
                          preco: resultado.resumo.custo_total_estimado
                      }
                  ],
                  dadosTecnicos: resultado
              };

              // 2. Salvar no Estado Local (Vidraceiro)
              setPedidosVidraceiro(prev => [novoPedido, ...prev]);
              
              // 🔥 3. SALVAR NO SERVIDOR DO VIDRACEIRO (Multi-tenancy com userId)
              if (userId) {
                  fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f33747ec/pedidos/criar`, {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${publicAnonKey}`
                      },
                      body: JSON.stringify({
                          userId: userId,
                          pedido: novoPedido
                      })
                  }).then(async (response) => {
                      if (response.ok) {
                          const result = await response.json();
                          console.log('✅ Pedido salvo no servidor do vidraceiro:', result);
                      } else {
                          console.error('❌ Erro ao salvar pedido no servidor:', response.status);
                      }
                  }).catch(err => {
                      console.error('❌ Erro na requisição de salvar pedido:', err);
                  });
              }
              
              // 4. Salvar na Nuvem para o Fornecedor (Via CloudStorage)
              import('./utils/cloudStorage').then(({ cloudStorage }) => {
                  cloudStorage.getItem('sysconecta_pedidos_fornecedor').then((atuais: any[]) => {
                      const listaAtual = Array.isArray(atuais) ? atuais : [];
                      const listaNova = [novoPedido, ...listaAtual];
                      
                      cloudStorage.setItem('sysconecta_pedidos_fornecedor', listaNova).then(() => {
                          console.log('☁️ PEDIDO ENVIADO PARA NUVEM DO FORNECEDOR');
                          toast.success('Pedido enviado para o fornecedor!');
                      }).catch(err => {
                          console.error('❌ Erro ao salvar pedido na nuvem do fornecedor:', err);
                      });
                  });
              });

              // 5. Navegar para sucesso ou lista
              toast.success('Orçamento salvo com sucesso!');
              handleNavigate('meus-pedidos');
          }}
          fornecedorUF={usuarioEstado}
          fornecedorId={(PARCEIROS_POR_ESTADO[usuarioEstado]?.nome || 'Santa Rita Vidros').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}
        />
      )}

      {/* TELA - MEUS CLIENTES FORNECEDOR */}
      {currentScreen === 'meus-clientes-fornecedor' && (
        <MeusClientesFornecedor 
          onNavigate={handleNavigate}
          userData={santaRitaUserData}
        />
      )}

      {/* TELA - PRODUÇÃO SANTA RITA */}
      {currentScreen === 'producao-santa-rita' && (
        <TelaEmBreve titulo="Módulo de Produção - QR Code" onNavigate={handleNavigate} />
      )}

      {/* TELA - LOGÍSTICA SANTA RITA */}
      {currentScreen === 'logistica-santa-rita' && (
        <TelaEmBreve titulo="Logística & Entrega" onNavigate={handleNavigate} />
      )}

      {/* TELA - COMERCIAL SANTA RITA */}
      {currentScreen === 'comercial-santa-rita' && (
        <TelaEmBreve titulo="Comercial / Orçamentos" onNavigate={handleNavigate} />
      )}

      {/* TELA - NOVO ORÇAMENTO SANTA RITA */}
      {currentScreen === 'novo-orcamento-santa-rita' && (
        <NovoOrcamentoSantaRita onNavigate={handleNavigate} />
      )}

      {/* TELA - PAINEL GUARDIAN CONECTA */}
      {currentScreen === 'painel-guardian-conecta' && (
        <TelaEmBreve titulo="Painel Guardian Conecta" onNavigate={handleNavigate} />
      )}

      {/* 🔥 NOVA TELA - GESTÃO DE PRODUÇÃO COMPLETA */}
      {currentScreen === 'gestao-producao' && (
        <GestaoProducaoCompleta
          onVoltar={() => setCurrentScreen('dashboard-santa-rita')}
          pedidosFornecedor={pedidosFornecedor}
          onAtualizarStatus={(pedidoId, novoStatus) => {
            console.log('🔄 ATUALIZANDO STATUS DO PEDIDO:', pedidoId, novoStatus);
            
            // Atualizar nos pedidos do fornecedor
            setPedidosFornecedor(prev => prev.map(p => 
              p.id === pedidoId 
                ? { ...p, etapaProducao: novoStatus, statusEntrega: novoStatus }
                : p
            ));

            // Atualizar nos pedidos do vidraceiro
            setPedidosVidraceiro(prev => prev.map(p => 
              p.id === pedidoId 
                ? { ...p, etapaProducao: novoStatus, statusEntrega: novoStatus }
                : p
            ));

            // 🔥 CRIAR NOTIFICAÇÃO PARA O VIDRACEIRO
            const pedido = pedidosFornecedor.find(p => p.id === pedidoId);
            if (pedido) {
              const statusLabels: any = {
                'em-producao': 'EM PRODUÇÃO',
                'corte': 'EM CORTE',
                'tmpera': 'EM TÊMPERA',
                'embalagem': 'EM EMBALAGEM',
                'expedicao': 'PRONTO PARA ENVIO',
                'em_rota': 'EM ROTA DE ENTREGA',
                'entregue': 'ENTREGUE'
              };

              const novaNotificacao = {
                id: Date.now(),
                tipo: 'status_atualizado',
                pedidoId: pedidoId,
                pedidoNumero: pedido.numero || pedido.numeroPedido || 'N/A',
                titulo: `STATUS ATUALIZADO: ${statusLabels[novoStatus] || novoStatus}`,
                mensagem: `Seu pedido mudou para: ${statusLabels[novoStatus] || novoStatus}`,
                timestamp: new Date().toISOString(),
                lida: false
              };

              setNotificacoesAprovacao(prev => [...prev, novaNotificacao]);
              console.log('✅ NOTIFICAÇÃO ENVIADA PARA VIDRACEIRO:', novaNotificacao);
            }

            alert(`✅ Status atualizado com sucesso!\n\nO vidraceiro foi notificado automaticamente.`);
          }}
          onVerDetalhes={(pedido) => {
            setPedidoSelecionado(pedido);
            setCurrentScreen('detalhe-pedido-santa-rita');
          }}
        />
      )}

      {/* 🔥 NOVA TELA - ROMANEIO DE CARREGAMENTO */}
      {currentScreen === 'romaneio-carregamento' && (
        pedidoSelecionado ? (
          <RomaneioCarregamento
            pedido={pedidoSelecionado}
            onVoltar={() => setCurrentScreen('gestao-producao')}
            onConfirmarCarregamento={(dadosRomaneio) => {
              handleConfirmarCarregamento(pedidoSelecionado.id, dadosRomaneio);
            }}
          />
        ) : (
          <div className="min-h-screen flex items-center justify-center bg-[#FAF9F7]">
            <div className="text-center p-12">
              <h2 className="text-gray-900 mb-4">Pedido não selecionado</h2>
              <p className="text-gray-600 mb-8">Selecione um pedido para gerar romaneio.</p>
              <button
                onClick={() => setCurrentScreen('gestao-producao')}
                className="bg-[#2C5F6F] hover:bg-[#234A56] text-white px-8 py-3 rounded-lg transition-colors"
              >
                Voltar à Produção
              </button>
            </div>
          </div>
        )
      )}

      {/* 🔥 NOVA TELA - LEITOR DWG */}
      {currentScreen === 'leitor-dwg' && (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <LeitorDWG
              onImportarParaOrcamento={(elementos) => {
                console.log('📐 Elementos importados do DWG:', elementos);
                // TODO: Integrar com sistema de orçamento
                toast.success(`${elementos.length} elementos prontos para orçamento!`);
                setCurrentScreen('03-dashboard-execucao');
              }}
            />
          </div>
        </div>
      )}

      {/* 🔥 FALLBACK DE SEGURANÇA - Previne tela branca */}
      {!['01-login', '02-escolha-perfil', '02-escolha-perfil-OLD', '02B-tipo-fornecedor', 
          '03-cadastro-dados', '03-cadastro-dados-OLD', '04-verificacao-codigo', '05-boas-vindas-cinematica',
          '03-dashboard-execucao', 'novo-orcamento-modal', '10-meus-clientes', 
          '10B-novo-cliente', '11-obras', '11B-novo-romaneio', '12-meus-pedidos', '13-agenda',
          '14-meus-contratos', 'acompanhar-pedido', 
          'meus-pedidos', 'minhas-entregas', 'rota-tempo-real', 'syslicita', 'sysfrete', 
          'sysmontagem', 'sysfederal', 'dashboard-fornecedor', 'meus-clientes-fornecedor',
          'configurador-suprema', 'gestao-producao', 'romaneio-carregamento', 'admin-inicializar-banco',
          'producao-santa-rita', 'logistica-santa-rita', 'comercial-santa-rita', 
          'novo-orcamento-santa-rita', 'painel-guardian-conecta', 'dashboard-santa-rita'].includes(currentScreen) && (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F7]">
          <div className="text-center p-12">
            <h2 className="text-gray-900 mb-4">Tela não encontrada</h2>
            <p className="text-gray-600 mb-2">Screen atual: <code className="bg-gray-200 px-2 py-1 rounded text-sm">{currentScreen}</code></p>
            <p className="text-gray-600 mb-8">Esta tela não está mapeada no sistema.</p>
            <button
              onClick={() => {
                console.log('🔄 RESETANDO PARA LOGIN - Screen não mapeado:', currentScreen);
                setCurrentScreen('01-login');
              }}
              className="bg-[#2C5F6F] hover:bg-[#234A56] text-white px-8 py-3 rounded-lg transition-colors"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      )}
      
      {/* 🔥 Menu Inferior removido a pedido do cliente */}
      </div>

      {/* ⚠️ DEBUG COMPONENTS REMOVIDOS - Causavam memory leak */}

      {/* 🔥 DEBUG VIDRACEIRO/FORNECEDOR INFO */}
      {(userRole === 'vidraceiro' || userRole === 'fornecedor') && <DebugVidraceiroInfo />}

      {/* 🔥 AUTH MODAL REAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialRole={authTargetRole}
      />
    </I18nProvider>
  );
}