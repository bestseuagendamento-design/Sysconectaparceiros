// 🌍 SYSCONECTA - SISTEMA DE INTERNACIONALIZAÇÃO
// Suporte para 6 idiomas principais do mercado de vidros global

export type Language = 'pt' | 'en' | 'es' | 'fr' | 'de' | 'it';

export interface Translation {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const languages: Translation[] = [
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
];

export const translations: Record<Language, Record<string, any>> = {
  // 🇧🇷 PORTUGUÊS (Brasil) - Base
  pt: {
    app: {
      name: 'SysConecta',
      tagline: 'O ECOSSISTEMA DEFINITIVO DO VIDRO E ALUMÍNIO',
      description: 'Plataforma B2B Enterprise para o setor de vidros',
    },
    auth: {
      login: {
        title: 'Bem-vindo de volta',
        subtitle: 'Acesse o painel de controle',
        email: 'E-mail Corporativo',
        emailPlaceholder: 'seu@email.com',
        password: 'Senha de Acesso',
        passwordPlaceholder: 'Digite sua senha',
        rememberMe: 'Manter conectado',
        forgotPassword: 'Recuperar acesso?',
        loginButton: 'Acessar Sistema',
        loginButtonLoading: 'Autenticando...',
        orContinueWith: 'Acesso Alternativo',
        googleLogin: 'Entrar com Google',
        microsoftLogin: 'Entrar com Microsoft',
        noAccount: 'Sua empresa não está cadastrada?',
        createAccount: 'Solicitar credenciamento',
        invalidCredentials: 'Credenciais inválidas',
        accessDenied: 'Acesso restrito',
        onlyAuthorized: 'Apenas membros credenciados podem acessar',
      },
      profiles: {
        title: 'Escolha seu perfil de acesso',
        subtitle: 'Selecione o tipo de conta adequado à sua atividade profissional para ter acesso ao',
        ecosystem: 'ecossistema completo',
        enterAs: 'Entrar como',
        popular: 'Popular',
        benefits: {
          security: 'Segurança Enterprise',
          performance: 'Performance Extrema',
          analytics: 'Analytics Avançado',
          support: 'Suporte Premium'
        },
        vidraceiro: {
          title: 'Vidraceiro / Serralheiro',
          subtitle: 'O Poder da Gestão Completa',
          description: 'A ferramenta definitiva para sua vidraçaria. Organize suas obras, automate processos e conecte-se diretamente aos fornecedores.',
          f1: 'Orçamento Rápido (Tipologias Prontas)',
          f2: 'Compra Direta com Fornecedores',
          f3: 'Sobra Inteligente vira Estoque',
          f4: 'Romaneios de Entrega e Serviços',
          f5: 'Contratos e Propostas Configuradas',
          f6: 'Emissão de Nota Fiscal (NFe)',
          f7: 'Controle de Obras por Etapa',
          f8: 'Lista de Material Detalhada'
        },
        arquiteto: {
          title: 'Arquiteto / Engenheiro',
          subtitle: 'Visão Técnica Completa',
          description: 'Planeje e acompanhe obras com controle total. Acesso às especificações técnicas, fornecedores homologados e histórico de cada projeto.',
          f1: 'Planejamento de projetos',
          f2: 'Especificações técnicas',
          f3: 'Rede de fornecedores',
          f4: 'Histórico completo'
        },
        construtor: {
          title: 'Construtora',
          subtitle: 'Ecossistema Unificado',
          description: 'Gestão completa de vidros, alumínio, montagens, equipes e cronograma. Conexão direta com as maiores indústrias e fornecedores do estado em uma única plataforma.',
          f1: 'Gestão de Vidros e Alumínio',
          f2: 'Equipes e Montagens Certificadas',
          f3: 'Cronograma e Suporte Técnico',
          f4: 'Conexão Indústria-Fornecedor'
        },
        industria: {
          title: 'Indústria',
          subtitle: 'Inteligência de Abastecimento',
          description: 'Indústrias selecionadas para abastecer a rede nacional. Monitoramento em tempo real dos estoques dos fornecedores (Vidro, Alumínio, Acessórios) com reposição automática preditiva.',
          f1: 'Leitura de estoque dos fornecedores',
          f2: 'Solicitação automática de reposição',
          f3: 'Gestão de demanda nacional',
          f4: 'Líderes selecionados por segmento'
        },
        fornecedor: {
          title: 'Fornecedor / Distribuidor',
          subtitle: 'O Hub Comercial do Setor',
          description: 'Distribuição oficial da Indústria para todo o mercado. Venda Vidros, Alumínios e Acessórios para Vidraceiros, Construtoras e Arquitetos com logística unificada.',
          f1: 'Venda Multi-Canal (B2B/B2C)',
          f2: 'Conexão direta com a Indústria',
          f3: 'Estoque Inteligente Integrado',
          f4: 'Logística de Entrega Global'
        },
        parceiro: {
          title: 'ParceiroSys',
          subtitle: 'Divulgação Global',
          description: 'Sua marca (Varejo, Serviços, Alimentação, etc.) em destaque dentro do sistema. Alcance milhares de profissionais e empresas decision-makers.',
          f1: 'Mídia programática interna',
          f2: 'Banners premium',
          f3: 'Segmentação de público',
          f4: 'Visibilidade máxima'
        },
        parceirosys: {
          title: 'ParceiroSys',
          subtitle: 'Divulgação Global',
          description: 'Sua marca (Varejo, Serviços, Alimentação, etc.) em destaque dentro do sistema. Alcance milhares de profissionais e empresas decision-makers.',
          f1: 'Mídia programática interna',
          f2: 'Banners premium',
          f3: 'Segmentação de público',
          f4: 'Visibilidade máxima'
        }
      },
      features: {
        title: 'Confiado por líderes globais',
        guardian: 'Powered by Guardian Glass',
        countries: '25+ países no mundo',
        feature1: 'Gestão Completa de Orçamentos',
        feature2: 'Desenhos Técnicos CAD Paramétricos',
        feature3: 'Aproveitamento Otimizado de Chapas',
        feature4: 'Controle de Produção em Tempo Real',
        feature5: 'Sistema Multi-Fornecedor por Estado',
        feature6: 'Analytics e Relatórios Avançados',
      },
    },
    errors: {
      required: 'Campo obrigatório',
      invalidEmail: 'E-mail inválido',
      minLength: 'Mínimo de {count} caracteres',
      maxLength: 'Máximo de {count} caracteres',
      generic: 'Ocorreu um erro. Tente novamente.',
    },
  },

  // 🇺🇸 ENGLISH (International)
  en: {
    app: {
      name: 'SysConecta',
      tagline: 'Enterprise Glass Management System',
      description: 'B2B Enterprise Platform for the Glass Industry',
    },
    auth: {
      login: {
        title: 'Welcome back',
        subtitle: 'Sign in to your account to continue',
        email: 'Email',
        emailPlaceholder: 'your@email.com',
        password: 'Password',
        passwordPlaceholder: 'Enter your password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot password?',
        loginButton: 'Sign in',
        loginButtonLoading: 'Signing in...',
        orContinueWith: 'Or continue with',
        googleLogin: 'Continue with Google',
        microsoftLogin: 'Continue with Microsoft',
        noAccount: "Don't have an account?",
        createAccount: 'Create account',
        invalidCredentials: 'Invalid email or password',
        accessDenied: 'Access denied',
        onlyAuthorized: 'Only authorized users can access',
      },
      profiles: {
        title: 'Choose your access profile',
        subtitle: 'Select the account type suitable for your professional activity to access the',
        ecosystem: 'complete ecosystem',
        enterAs: 'Enter as',
        popular: 'Popular',
        benefits: {
          security: 'Enterprise Security',
          performance: 'Extreme Performance',
          analytics: 'Advanced Analytics',
          support: 'Premium Support'
        },
        vidraceiro: {
          title: 'Glazier / Locksmith',
          subtitle: 'Construction Professional',
          description: 'Create complete technical quotes with 2D CAD drawings, buy materials at negotiated prices, track works and deliveries in real time.',
          f1: 'Quotes with integrated CAD',
          f2: 'Purchase of negotiated materials',
          f3: 'Work monitoring',
          f4: 'Delivery tracking'
        },
        arquiteto: {
          title: 'Architect / Engineer',
          subtitle: 'Complete Technical Vision',
          description: 'Plan and monitor works with total control. Access to technical specifications, approved suppliers and history of each project.',
          f1: 'Project planning',
          f2: 'Technical specifications',
          f3: 'Supplier network',
          f4: 'Complete history'
        },
        construtor: {
          title: 'Developer / Builder',
          subtitle: 'Smart Management',
          description: 'Intelligence channel connecting quotes, glass, aluminum, accessories, assemblies and certified teams with the greatest savings.',
          f1: 'Multi-project management',
          f2: 'Integrated savings',
          f3: 'Certified teams',
          f4: 'Total cost control'
        },
        industria: {
          title: 'Industry',
          subtitle: 'National Control',
          description: 'Main industries of GLASS | ALUMINUM | ACCESSORIES with national inventory control, demand and promotional campaigns in real time.',
          f1: 'National inventory control',
          f2: 'Demand management',
          f3: 'Promotional campaigns',
          f4: 'Advanced analytics'
        },
        fornecedor: {
          title: 'Supplier',
          subtitle: 'Enterprise Partner',
          description: 'Manage orders, inventory and productions. Receive quote requests, control sheet utilization and optimize your operation.',
          f1: 'Order management',
          f2: 'Inventory control',
          f3: 'Sheet utilization',
          f4: 'Analytics dashboard'
        },
        parceiro: {
          title: 'ParceiroSys',
          subtitle: 'Premium Marketplace',
          description: 'Register products, banners and VIP plans to appear on all user dashboards. Maximize your visibility in the ecosystem.',
          f1: 'Integrated marketplace',
          f2: 'Premium banners',
          f3: 'VIP plans',
          f4: 'Maximum visibility'
        },
        parceirosys: {
          title: 'ParceiroSys',
          subtitle: 'Premium Marketplace',
          description: 'Register products, banners and VIP plans to appear on all user dashboards. Maximize your visibility in the ecosystem.',
          f1: 'Integrated marketplace',
          f2: 'Premium banners',
          f3: 'VIP plans',
          f4: 'Maximum visibility'
        }
      },
      features: {
        title: 'Trusted by global leaders',
        guardian: 'Powered by Guardian Glass',
        countries: '25+ countries worldwide',
        feature1: 'Complete Quote Management',
        feature2: 'Parametric CAD Technical Drawings',
        feature3: 'Optimized Sheet Utilization',
        feature4: 'Real-Time Production Control',
        feature5: 'Multi-Supplier System by State',
        feature6: 'Advanced Analytics & Reports',
      },
    },
    errors: {
      required: 'Required field',
      invalidEmail: 'Invalid email',
      minLength: 'Minimum {count} characters',
      maxLength: 'Maximum {count} characters',
      generic: 'An error occurred. Please try again.',
    },
  },

  // 🇪🇸 ESPAÑOL (América Latina)
  es: {
    app: {
      name: 'SysConecta',
      tagline: 'Sistema Empresarial de Gestión de Vidrios',
      description: 'Plataforma B2B Empresarial para la Industria del Vidrio',
    },
    auth: {
      login: {
        title: 'Bienvenido de nuevo',
        subtitle: 'Inicia sesión en tu cuenta para continuar',
        email: 'Correo electrónico',
        emailPlaceholder: 'tu@email.com',
        password: 'Contraseña',
        passwordPlaceholder: 'Ingresa tu contraseña',
        rememberMe: 'Recordarme',
        forgotPassword: '¿Olvidaste tu contraseña?',
        loginButton: 'Iniciar sesión',
        loginButtonLoading: 'Iniciando sesión...',
        orContinueWith: 'O continuar con',
        googleLogin: 'Continuar con Google',
        microsoftLogin: 'Continuar con Microsoft',
        noAccount: '¿No tienes una cuenta?',
        createAccount: 'Crear cuenta',
        invalidCredentials: 'Correo o contraseña inválidos',
        accessDenied: 'Acceso denegado',
        onlyAuthorized: 'Solo usuarios autorizados pueden acceder',
      },
      profiles: {
        title: 'Elige tu perfil de acceso',
        subtitle: 'Selecciona el tipo de cuenta adecuado a tu actividad profesional para acceder al',
        ecosystem: 'ecosistema completo',
        enterAs: 'Entrar como',
        popular: 'Popular',
        benefits: {
          security: 'Seguridad Enterprise',
          performance: 'Rendimiento Extremo',
          analytics: 'Analytics Avanzado',
          support: 'Soporte Premium'
        },
        vidraceiro: {
          title: 'Vidriero / Cerrajero',
          subtitle: 'Profesional de Obras',
          description: 'Crea presupuestos técnicos completos con dibujos CAD 2D, compra materiales con precios negociados, sigue obras y entregas en tiempo real.',
          f1: 'Presupuestos con CAD integrado',
          f2: 'Compra de materiales negociados',
          f3: 'Seguimiento de obras',
          f4: 'Rastreo de entregas'
        },
        arquiteto: {
          title: 'Arquitecto / Ingeniero',
          subtitle: 'Visión Técnica Completa',
          description: 'Planifica y sigue obras con control total. Acceso a especificaciones técnicas, proveedores homologados e historial de cada proyecto.',
          f1: 'Planificación de proyectos',
          f2: 'Especificaciones técnicas',
          f3: 'Red de proveedores',
          f4: 'Historial completo'
        },
        construtor: {
          title: 'Promotora / Constructora',
          subtitle: 'Gestión Inteligente',
          description: 'Canal de inteligencia conectando presupuesto, vidrio, aluminio, accesorios, montajes y equipos certificados con el mayor ahorro.',
          f1: 'Gestión multi-proyectos',
          f2: 'Ahorro integrado',
          f3: 'Equipos certificados',
          f4: 'Control total de costos'
        },
        industria: {
          title: 'Industria',
          subtitle: 'Control Nacional',
          description: 'Principales industrias de VIDRIO | ALUMINIO | ACCESORIOS con control nacional de stock, demanda y campañas promocionales en tiempo real.',
          f1: 'Control de stock nacional',
          f2: 'Gestión de demanda',
          f3: 'Campañas promocionales',
          f4: 'Analytics avanzado'
        },
        fornecedor: {
          title: 'Proveedor',
          subtitle: 'Socio Enterprise',
          description: 'Gestiona pedidos, stock y producciones. Recibe solicitudes de presupuestos, controla aprovechamiento de láminas y optimiza tu operación.',
          f1: 'Gestión de pedidos',
          f2: 'Control de stock',
          f3: 'Aprovechamiento de láminas',
          f4: 'Dashboard analytics'
        },
        parceiro: {
          title: 'SocioSys',
          subtitle: 'Marketplace Premium',
          description: 'Registra productos, banners y planes VIP para aparecer en todos los dashboards de los usuarios. Maximiza tu visibilidad en el ecosistema.',
          f1: 'Marketplace integrado',
          f2: 'Banners premium',
          f3: 'Planes VIP',
          f4: 'Visibilidad máxima'
        },
        parceirosys: {
          title: 'SocioSys',
          subtitle: 'Marketplace Premium',
          description: 'Registra productos, banners y planes VIP para aparecer en todos los dashboards de los usuarios. Maximiza tu visibilidad en el ecosistema.',
          f1: 'Marketplace integrado',
          f2: 'Banners premium',
          f3: 'Planes VIP',
          f4: 'Visibilidad máxima'
        }
      },
      features: {
        title: 'Confiado por líderes globales',
        guardian: 'Impulsado por Guardian Glass',
        countries: '25+ países en todo el mundo',
        feature1: 'Gestión Completa de Cotizaciones',
        feature2: 'Dibujos Técnicos CAD Paramétricos',
        feature3: 'Aprovechamiento Optimizado de Láminas',
        feature4: 'Control de Producción en Tiempo Real',
        feature5: 'Sistema Multi-Proveedor por Estado',
        feature6: 'Análisis y Reportes Avanzados',
      },
    },
    errors: {
      required: 'Campo obligatorio',
      invalidEmail: 'Correo inválido',
      minLength: 'Mínimo {count} caracteres',
      maxLength: 'Máximo {count} caracteres',
      generic: 'Ocurrió un error. Inténtalo de nuevo.',
    },
  },

  // 🇫🇷 FRANÇAIS (África + Europa)
  fr: {
    app: {
      name: 'SysConecta',
      tagline: 'Système Enterprise de Gestion du Verre',
      description: 'Plateforme B2B Enterprise pour l\'Industrie du Verre',
    },
    auth: {
      login: {
        title: 'Bon retour',
        subtitle: 'Connectez-vous à votre compte pour continuer',
        email: 'E-mail',
        emailPlaceholder: 'votre@email.com',
        password: 'Mot de passe',
        passwordPlaceholder: 'Entrez votre mot de passe',
        rememberMe: 'Se souvenir de moi',
        forgotPassword: 'Mot de passe oublié?',
        loginButton: 'Se connecter',
        loginButtonLoading: 'Connexion...',
        orContinueWith: 'Ou continuer avec',
        googleLogin: 'Continuer avec Google',
        microsoftLogin: 'Continuer avec Microsoft',
        noAccount: 'Pas de compte?',
        createAccount: 'Créer un compte',
        invalidCredentials: 'E-mail ou mot de passe invalide',
        accessDenied: 'Accès refusé',
        onlyAuthorized: 'Seuls les utilisateurs autorisés peuvent accéder',
      },
      profiles: {
        title: 'Choisissez votre profil d\'accès',
        subtitle: 'Sélectionnez le type de compte adapté à votre activité professionnelle pour accéder à',
        ecosystem: 'l\'écosystème complet',
        enterAs: 'Entrer comme',
        popular: 'Populaire',
        benefits: {
          security: 'Sécurité Enterprise',
          performance: 'Performance Extrême',
          analytics: 'Analyses Avancées',
          support: 'Support Premium'
        },
        vidraceiro: {
          title: 'Vitrier / Serrurier',
          subtitle: 'Professionnel du Bâtiment',
          description: 'Créez des devis techniques complets avec dessins CAO 2D, achetez des matériaux à prix négociés, suivez les chantiers et les livraisons en temps réel.',
          f1: 'Devis avec CAO intégrée',
          f2: 'Achat de matériaux négociés',
          f3: 'Suivi de chantier',
          f4: 'Suivi des livraisons'
        },
        arquiteto: {
          title: 'Architecte / Ingénieur',
          subtitle: 'Vision Technique Complète',
          description: 'Planifiez et suivez les chantiers avec un contrôle total. Accès aux spécifications techniques, fournisseurs agréés et historique de chaque projet.',
          f1: 'Planification de projet',
          f2: 'Spécifications techniques',
          f3: 'Réseau de fournisseurs',
          f4: 'Historique complet'
        },
        construtor: {
          title: 'Promoteur / Constructeur',
          subtitle: 'Gestion Intelligente',
          description: 'Canal d\'intelligence connectant devis, verre, aluminium, accessoires, assemblages et équipes certifiées avec les plus grandes économies.',
          f1: 'Gestion multi-projets',
          f2: 'Économies intégrées',
          f3: 'Équipes certifiées',
          f4: 'Contrôle total des coûts'
        },
        industria: {
          title: 'Industrie',
          subtitle: 'Contrôle National',
          description: 'Principales industries de VERRE | ALUMINIUM | ACCESSOIRES avec contrôle national des stocks, demande et campagnes promotionnelles en temps réel.',
          f1: 'Contrôle des stocks nationaux',
          f2: 'Gestion de la demande',
          f3: 'Campagnes promotionnelles',
          f4: 'Analyses avancées'
        },
        fornecedor: {
          title: 'Fournisseur',
          subtitle: 'Partenaire Enterprise',
          description: 'Gérez les commandes, les stocks et les productions. Recevez des demandes de devis, contrôlez l\'utilisation des feuilles et optimisez votre opération.',
          f1: 'Gestion des commandes',
          f2: 'Contrôle des stocks',
          f3: 'Utilisation des feuilles',
          f4: 'Tableau de bord analytique'
        },
        parceiro: {
          title: 'PartenaireSys',
          subtitle: 'Marketplace Premium',
          description: 'Enregistrez des produits, bannières et plans VIP pour apparaître sur tous les tableaux de bord des utilisateurs. Maximisez votre visibilité dans l\'écosystème.',
          f1: 'Marketplace intégré',
          f2: 'Bannières premium',
          f3: 'Plans VIP',
          f4: 'Visibilité maximale'
        },
        parceirosys: {
          title: 'PartenaireSys',
          subtitle: 'Marketplace Premium',
          description: 'Enregistrez des produits, bannières et plans VIP pour apparaître sur tous les tableaux de bord des utilisateurs. Maximisez votre visibilité dans l\'écosystème.',
          f1: 'Marketplace intégré',
          f2: 'Bannières premium',
          f3: 'Plans VIP',
          f4: 'Visibilité maximale'
        }
      },
      features: {
        title: 'Approuvé par les leaders mondiaux',
        guardian: 'Propulsé par Guardian Glass',
        countries: '25+ pays dans le monde',
        feature1: 'Gestion Complète des Devis',
        feature2: 'Dessins Techniques CAO Paramétriques',
        feature3: 'Utilisation Optimisée des Feuilles',
        feature4: 'Contrôle de Production en Temps Réel',
        feature5: 'Système Multi-Fournisseur par État',
        feature6: 'Analyses et Rapports Avancés',
      },
    },
    errors: {
      required: 'Champ obligatoire',
      invalidEmail: 'E-mail invalide',
      minLength: 'Minimum {count} caractères',
      maxLength: 'Maximum {count} caractères',
      generic: 'Une erreur est survenue. Réessayez.',
    },
  },

  // 🇩🇪 DEUTSCH (Alemanha - mercado premium)
  de: {
    app: {
      name: 'SysConecta',
      tagline: 'Enterprise-Glasverwaltungssystem',
      description: 'B2B Enterprise-Plattform für die Glasindustrie',
    },
    auth: {
      login: {
        title: 'Willkommen zurück',
        subtitle: 'Melden Sie sich bei Ihrem Konto an, um fortzufahren',
        email: 'E-Mail',
        emailPlaceholder: 'ihre@email.com',
        password: 'Passwort',
        passwordPlaceholder: 'Geben Sie Ihr Passwort ein',
        rememberMe: 'Angemeldet bleiben',
        forgotPassword: 'Passwort vergessen?',
        loginButton: 'Anmelden',
        loginButtonLoading: 'Anmelden...',
        orContinueWith: 'Oder fortfahren mit',
        googleLogin: 'Mit Google fortfahren',
        microsoftLogin: 'Mit Microsoft fortfahren',
        noAccount: 'Noch kein Konto?',
        createAccount: 'Konto erstellen',
        invalidCredentials: 'Ungültige E-Mail oder Passwort',
        accessDenied: 'Zugriff verweigert',
        onlyAuthorized: 'Nur autorisierte Benutzer können zugreifen',
      },
      profiles: {
        title: 'Wählen Sie Ihr Zugriffsprofil',
        subtitle: 'Wählen Sie den für Ihre berufliche Tätigkeit geeigneten Kontotyp, um auf das',
        ecosystem: 'gesamte Ökosystem zuzugreifen',
        enterAs: 'Eintreten als',
        popular: 'Beliebt',
        benefits: {
          security: 'Enterprise-Sicherheit',
          performance: 'Extreme Leistung',
          analytics: 'Erweiterte Analysen',
          support: 'Premium-Support'
        },
        vidraceiro: {
          title: 'Glaser / Schlosser',
          subtitle: 'Bauprofi',
          description: 'Erstellen Sie vollständige technische Angebote mit 2D-CAD-Zeichnungen, kaufen Sie Materialien zu ausgehandelten Preisen, verfolgen Sie Arbeiten und Lieferungen in Echtzeit.',
          f1: 'Angebote mit integriertem CAD',
          f2: 'Kauf von ausgehandelten Materialien',
          f3: 'Bauüberwachung',
          f4: 'Lieferverfolgung'
        },
        arquiteto: {
          title: 'Architekt / Ingenieur',
          subtitle: 'Vollständige technische Vision',
          description: 'Planen und überwachen Sie Arbeiten mit vollständiger Kontrolle. Zugriff auf technische Spezifikationen, zugelassene Lieferanten und Historie jedes Projekts.',
          f1: 'Projektplanung',
          f2: 'Technische Spezifikationen',
          f3: 'Lieferantennetzwerk',
          f4: 'Vollständige Historie'
        },
        construtor: {
          title: 'Bauträger / Bauunternehmer',
          subtitle: 'Intelligentes Management',
          description: 'Intelligenzkanal, der Angebote, Glas, Aluminium, Zubehör, Montagen und zertifizierte Teams mit den größten Einsparungen verbindet.',
          f1: 'Multi-Projekt-Management',
          f2: 'Integrierte Einsparungen',
          f3: 'Zertifizierte Teams',
          f4: 'Gesamtkostenkontrolle'
        },
        industria: {
          title: 'Industrie',
          subtitle: 'Nationale Kontrolle',
          description: 'Hauptindustrien von GLAS | ALUMINIUM | ZUBEHÖR mit nationaler Bestandsverwaltung, Nachfrage und Werbekampagnen in Echtzeit.',
          f1: 'Nationale Bestandsverwaltung',
          f2: 'Nachfragemanagement',
          f3: 'Werbekampagnen',
          f4: 'Erweiterte Analysen'
        },
        fornecedor: {
          title: 'Lieferant',
          subtitle: 'Enterprise-Partner',
          description: 'Verwalten Sie Bestellungen, Lagerbestand und Produktionen. Erhalten Sie Angebotsanfragen, kontrollieren Sie die Plattenausnutzung und optimieren Sie Ihren Betrieb.',
          f1: 'Bestellverwaltung',
          f2: 'Bestandsverwaltung',
          f3: 'Plattenausnutzung',
          f4: 'Analyse-Dashboard'
        },
        parceiro: {
          title: 'PartnerSys',
          subtitle: 'Premium-Marktplatz',
          description: 'Registrieren Sie Produkte, Banner und VIP-Pläne, um auf allen Benutzer-Dashboards zu erscheinen. Maximieren Sie Ihre Sichtbarkeit im Ökosystem.',
          f1: 'Integrierter Marktplatz',
          f2: 'Premium-Banner',
          f3: 'VIP-Pläne',
          f4: 'Maximale Sichtbarkeit'
        },
        parceirosys: {
          title: 'PartnerSys',
          subtitle: 'Premium-Marktplatz',
          description: 'Registrieren Sie Produkte, Banner und VIP-Pläne, um auf allen Benutzer-Dashboards zu erscheinen. Maximieren Sie Ihre Sichtbarkeit im Ökosystem.',
          f1: 'Integrierter Marktplatz',
          f2: 'Premium-Banner',
          f3: 'VIP-Pläne',
          f4: 'Maximale Sichtbarkeit'
        }
      },
      features: {
        title: 'Vertraut von globalen Führern',
        guardian: 'Angetrieben von Guardian Glass',
        countries: '25+ Länder weltweit',
        feature1: 'Vollständige Angebotsverwaltung',
        feature2: 'Parametrische CAD-Technische Zeichnungen',
        feature3: 'Optimierte Blechnutzung',
        feature4: 'Echtzeit-Produktionskontrolle',
        feature5: 'Multi-Lieferanten-System nach Bundesland',
        feature6: 'Erweiterte Analysen & Berichte',
      },
    },
    errors: {
      required: 'Pflichtfeld',
      invalidEmail: 'Ungültige E-Mail',
      minLength: 'Mindestens {count} Zeichen',
      maxLength: 'Maximal {count} Zeichen',
      generic: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    },
  },

  // 🇮🇹 ITALIANO (Itália - design)
  it: {
    app: {
      name: 'SysConecta',
      tagline: 'Sistema Enterprise di Gestione del Vetro',
      description: 'Piattaforma B2B Enterprise per l\'Industria del Vetro',
    },
    auth: {
      login: {
        title: 'Bentornato',
        subtitle: 'Accedi al tuo account per continuare',
        email: 'E-mail',
        emailPlaceholder: 'tua@email.com',
        password: 'Password',
        passwordPlaceholder: 'Inserisci la tua password',
        rememberMe: 'Ricordami',
        forgotPassword: 'Password dimenticata?',
        loginButton: 'Accedi',
        loginButtonLoading: 'Accesso...',
        orContinueWith: 'O continua con',
        googleLogin: 'Continua con Google',
        microsoftLogin: 'Continua con Microsoft',
        noAccount: 'Non hai un account?',
        createAccount: 'Crea account',
        invalidCredentials: 'E-mail o password non validi',
        accessDenied: 'Accesso negato',
        onlyAuthorized: 'Solo gli utenti autorizzati possono accedere',
      },
      profiles: {
        title: 'Scegli il tuo profilo di accesso',
        subtitle: 'Seleziona il tipo di account adatto alla tua attività professionale per accedere',
        ecosystem: 'all\'ecosistema completo',
        enterAs: 'Entra come',
        popular: 'Popolare',
        benefits: {
          security: 'Sicurezza Enterprise',
          performance: 'Prestazioni Estreme',
          analytics: 'Analisi Avanzate',
          support: 'Supporto Premium'
        },
        vidraceiro: {
          title: 'Vetraio / Fabbro',
          subtitle: 'Professionista Edile',
          description: 'Crea preventivi tecnici completi con disegni CAD 2D, acquista materiali a prezzi negoziati, monitora lavori e consegne in tempo reale.',
          f1: 'Preventivi con CAD integrato',
          f2: 'Acquisto di materiali negoziati',
          f3: 'Monitoraggio lavori',
          f4: 'Tracciamento consegne'
        },
        arquiteto: {
          title: 'Architetto / Ingegnere',
          subtitle: 'Visione Tecnica Completa',
          description: 'Pianifica e monitora i lavori con controllo totale. Accesso alle specifiche tecniche, fornitori approvati e cronologia di ogni progetto.',
          f1: 'Pianificazione progetti',
          f2: 'Specifiche tecniche',
          f3: 'Rete di fornitori',
          f4: 'Cronologia completa'
        },
        construtor: {
          title: 'Promotore / Costruttore',
          subtitle: 'Gestione Intelligente',
          description: 'Canale di intelligenza che collega preventivi, vetro, alluminio, accessori, montaggi e squadre certificate con il massimo risparmio.',
          f1: 'Gestione multi-progetto',
          f2: 'Risparmio integrato',
          f3: 'Squadre certificate',
          f4: 'Controllo totale dei costi'
        },
        industria: {
          title: 'Industria',
          subtitle: 'Controllo Nazionale',
          description: 'Principali industrie di VETRO | ALLUMINIO | ACCESSORI con controllo nazionale delle scorte, domanda e campagne promozionali in tempo reale.',
          f1: 'Controllo scorte nazionali',
          f2: 'Gestione della domanda',
          f3: 'Campagne promozionali',
          f4: 'Analisi avanzate'
        },
        fornecedor: {
          title: 'Fornitore',
          subtitle: 'Partner Enterprise',
          description: 'Gestisci ordini, scorte e produzioni. Ricevi richieste di preventivi, controlla l\'utilizzo delle lastre e ottimizza la tua operatività.',
          f1: 'Gestione ordini',
          f2: 'Controllo scorte',
          f3: 'Utilizzo lastre',
          f4: 'Dashboard analitica'
        },
        parceiro: {
          title: 'PartnerSys',
          subtitle: 'Marketplace Premium',
          description: 'Registra prodotti, banner e piani VIP per apparire su tutte le dashboard degli utenti. Massimizza la tua visibilità nell\'ecosistema.',
          f1: 'Marketplace integrato',
          f2: 'Banner premium',
          f3: 'Piani VIP',
          f4: 'Visibilità massima'
        },
        parceirosys: {
          title: 'PartnerSys',
          subtitle: 'Marketplace Premium',
          description: 'Registra prodotti, banner e piani VIP per apparire su tutte le dashboard degli utenti. Massimizza la tua visibilità nell\'ecosistema.',
          f1: 'Marketplace integrato',
          f2: 'Banner premium',
          f3: 'Piani VIP',
          f4: 'Visibilità massima'
        }
      },
      features: {
        title: 'Fidato dai leader globali',
        guardian: 'Alimentato da Guardian Glass',
        countries: '25+ paesi nel mondo',
        feature1: 'Gestione Completa dei Preventivi',
        feature2: 'Disegni Tecnici CAD Parametrici',
        feature3: 'Utilizzo Ottimizzato dei Fogli',
        feature4: 'Controllo della Produzione in Tempo Reale',
        feature5: 'Sistema Multi-Fornitore per Stato',
        feature6: 'Analisi e Report Avanzati',
      },
    },
    errors: {
      required: 'Campo obbligatorio',
      invalidEmail: 'E-mail non valida',
      minLength: 'Minimo {count} caratteri',
      maxLength: 'Massimo {count} caratteri',
      generic: 'Si è verificato un errore. Riprova.',
    },
  },
};

// Helper para interpolação de strings (ex: "Mínimo {count} caracteres")
export function interpolate(text: string, values: Record<string, any>): string {
  return text.replace(/{(\w+)}/g, (_, key) => values[key] || '');
}

// Hook customizado para tradução
export function useTranslation(lang: Language) {
  return {
    t: (key: string, values?: Record<string, any>) => {
      const keys = key.split('.');
      let value: any = translations[lang];
      
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) {
          console.warn(`Translation key not found: ${key} for language: ${lang}`);
          return key;
        }
      }
      
      if (typeof value === 'string' && values) {
        return interpolate(value, values);
      }
      
      return value;
    },
    lang,
  };
}
