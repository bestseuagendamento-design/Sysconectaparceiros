import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { initializeDatabase, checkTables } from "./database.tsx";
import { 
  sendEmail, 
  getWelcomeEmailTemplate, 
  getPasswordResetEmailTemplate,
  getSignupConfirmationEmailTemplate,
  getNotificationEmailTemplate,
  getSupplierVerificationCodeEmailTemplate
} from "./email.tsx";
import { TABELA_VIDROS_COMPLETA, getTabelaPlanar, getEstatisticasTabela } from "./tabela-precos-vidros.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-f33747ec/health", (c) => {
  return c.json({ status: "ok" });
});

// 🔥 NOVO: Endpoint para inicializar o banco de dados
app.post("/make-server-f33747ec/database/init", async (c) => {
  console.log('🚀 Recebida requisição para inicializar banco de dados');
  
  try {
    const result = await initializeDatabase();
    
    if (result.success) {
      console.log('✅ Banco de dados inicializado com sucesso!');
      return c.json({ 
        success: true, 
        message: '✅ Banco de dados inicializado com sucesso! Todas as tabelas foram criadas.',
        details: result
      }, 200);
    } else {
      console.error('❌ Erro ao inicializar banco:', result.error);
      return c.json({ 
        success: false, 
        message: '❌ Erro ao inicializar banco de dados', 
        error: result.error 
      }, 500);
    }
  } catch (error) {
    console.error('❌ Erro crítico:', error);
    return c.json({ 
      success: false, 
      message: '❌ Erro crítico ao inicializar banco', 
      error: error.message 
    }, 500);
  }
});

// 🔥 NOVO: Endpoint para verificar status das tabelas
app.get("/make-server-f33747ec/database/check", async (c) => {
  console.log('🔍 Verificando status das tabelas...');
  
  try {
    const result = await checkTables();
    
    return c.json({
      success: true,
      message: '✅ Verificação concluída',
      tables: result.tables
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao verificar tabelas:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 🔥 NOVO: Endpoint para enviar email de boas-vindas VIP
app.post("/make-server-f33747ec/waitlist/welcome", async (c) => {
  console.log('📧 Recebida requisição para enviar email de boas-vindas VIP');
  
  try {
    const body = await c.req.json();
    const { nome, email, empresa } = body;

    if (!nome || !email || !empresa) {
      return c.json({
        success: false,
        error: 'Nome, email e empresa são obrigatórios'
      }, 400);
    }

    // Gerar template de email
    const htmlContent = getWelcomeEmailTemplate(nome, empresa);

    // Enviar email
    const result = await sendEmail({
      to: email,
      subject: '🎉 Bem-vindo à Lista VIP do SysConecta 2026!',
      html: htmlContent,
    });

    console.log(`✅ Email de boas-vindas enviado para: ${email}`);

    return c.json({
      success: true,
      message: 'Email enviado com sucesso!',
      ...result
    }, 200);

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 🔥 NOVO: Endpoint para enviar email de recuperação de senha
app.post("/make-server-f33747ec/auth/password-reset", async (c) => {
  console.log('📧 Recebida requisição para enviar email de recuperação de senha');
  
  try {
    const body = await c.req.json();
    const { nome, email, resetCode } = body;

    if (!nome || !email || !resetCode) {
      return c.json({
        success: false,
        error: 'Nome, email e código de reset são obrigatórios'
      }, 400);
    }

    // Gerar template de email
    const htmlContent = getPasswordResetEmailTemplate(nome, resetCode);

    // Enviar email
    const result = await sendEmail({
      to: email,
      subject: '🔐 Recuperação de Senha - SysConecta 2026',
      html: htmlContent,
    });

    console.log(`✅ Email de recuperação enviado para: ${email}`);

    return c.json({
      success: true,
      message: 'Email de recuperação enviado com sucesso!',
      ...result
    }, 200);

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 🔥 PROXY KV STORE (Bypass RLS para Frontend)
app.post("/make-server-f33747ec/kv/set", async (c) => {
  try {
    const body = await c.req.json();
    const { key, value } = body;
    
    if (!key || value === undefined) {
        return c.json({ success: false, error: 'Key e Value são obrigatórios' }, 400);
    }
    
    console.log(`🔑 KV Proxy Set: ${key}`);
    await kv.set(key, value);
    
    return c.json({ success: true, message: 'Salvo com sucesso via Server Proxy' });
  } catch (e) {
    console.error('❌ KV Proxy Error:', e);
    return c.json({ success: false, error: e.message }, 500);
  }
});

// 🔥 PROXY KV STORE GET (Bypass RLS para Frontend)
app.post("/make-server-f33747ec/kv/get", async (c) => {
  try {
    const body = await c.req.json();
    const { key } = body;
    
    if (!key) {
        return c.json({ success: false, error: 'Key é obrigatório' }, 400);
    }
    
    console.log(`🔍 KV Proxy Get: ${key}`);
    const value = await kv.get(key);
    
    return c.json({ success: true, value: value });
  } catch (e) {
    console.error('❌ KV Proxy Get Error:', e);
    return c.json({ success: false, error: e.message }, 500);
  }
});

// 🔥 NOVO: PROXY KV GET BY PREFIX (Busca por prefixo - Multi-tenancy)
app.get("/make-server-f33747ec/kv/get-by-prefix", async (c) => {
  try {
    const userId = c.req.query('userId');
    const tipo = c.req.query('tipo'); // 'cliente', 'pedido', 'orcamento'
    
    if (!userId || !tipo) {
        return c.json({ success: false, error: 'userId e tipo são obrigatórios' }, 400);
    }
    
    // Monta o prefixo baseado no tipo
    const prefix = `${tipo}:${userId}:`;
    
    console.log(`🔍 [KV GET-BY-PREFIX] Buscando: ${prefix}*`);
    const valores = await kv.getByPrefix(prefix);
    
    console.log(`✅ [KV GET-BY-PREFIX] ${valores.length} ${tipo}(s) encontrado(s)`);
    
    return c.json({ 
      success: true, 
      values: valores,
      count: valores.length,
      prefix: prefix 
    });
  } catch (e) {
    console.error('❌ KV Get-By-Prefix Error:', e);
    return c.json({ success: false, error: e.message }, 500);
  }
});

// 🔥 Rota de Cadastro de Usuário (com auto-confirmação)
app.post("/make-server-f33747ec/auth/signup", async (c) => {
  console.log('👤 Criando novo usuário...');
  
  let body;
  try {
    body = await c.req.json();
  } catch (e) {
    return c.json({ success: false, error: 'Invalid JSON body' }, 400);
  }

  const { email, password, nome, empresa, telefone, role, estado, cidade, cnpj, cpf, endereco, numero, bairro } = body;

  if (!email || !password) {
    return c.json({ success: false, error: 'Email e senha são obrigatórios' }, 400);
  }

  try {
    // Criar cliente Admin
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // 🔥 PULA A VERIFICAÇÃO DE EMAIL
      user_metadata: {
        full_name: nome,
        nome_empresa: empresa,
        phone: telefone,
        role: role || 'vidraceiro',
        state: estado,
        city: cidade,
        cnpj: cnpj,
        cpf: cpf,
        address: endereco,
        numero: numero,
        bairro: bairro
      }
    });

    if (error) throw error;

    console.log(`✅ Usuário criado e confirmado: ${email} (${data.user.id})`);

    return c.json({
      success: true,
      user: data.user,
      message: 'Usuário criado com sucesso'
    }, 200);

  } catch (error) {
    // 🔥 AUTO-FIX: Tentar resgatar usuário preso em "Email not confirmed"
    if (error.message?.includes("already registered") || error.code === 'email_exists') {
       try {
          console.log(`⚠️ Usuário já existe: ${email}. Verificando status...`);
          
          const supabaseAdmin = createClient(
             Deno.env.get('SUPABASE_URL') ?? '',
             Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
          );
          
          // Buscar usuário existente
          const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
          const existingUser = users?.find(u => u.email === email);
          
          if (existingUser) {
              // Só resgata se NÃO estiver confirmado (evita roubo de conta ativa)
              if (!existingUser.email_confirmed_at) {
                  console.log(`🔧 Resgatando conta não confirmada: ${existingUser.id}`);
                  
                  const { data: updated, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
                      existingUser.id,
                      {
                          password: password,
                          email_confirm: true,
                          user_metadata: {
                              full_name: nome,
                              nome_empresa: empresa,
                              phone: telefone,
                              role: role || 'vidraceiro',
                              state: estado
                          }
                      }
                  );
                  
                  if (updateError) throw updateError;
                  
                  return c.json({
                      success: true,
                      user: updated.user,
                      message: 'Conta recuperada e ativada com sucesso!'
                  }, 200);
              } else {
                  return c.json({
                      success: false,
                      error: 'Este email já está cadastrado e ativo. Por favor, faça login.'
                  }, 400);
              }
          }
       } catch (rescueError) {
           console.error('❌ Falha ao tentar resgatar conta:', rescueError);
       }
    }

    console.error('❌ Erro ao criar usuário:', error);
    return c.json({
      success: false,
      error: error.message || 'Erro ao criar usuário'
    }, 500);
  }
});

// 🔥 NOVO: Endpoint para enviar email de confirmação de cadastro
app.post("/make-server-f33747ec/auth/signup-confirmation", async (c) => {
  console.log('📧 Recebida requisição para enviar email de confirmação de cadastro');
  
  try {
    const body = await c.req.json();
    const { nome, email, empresa, perfil } = body;

    if (!nome || !email || !empresa || !perfil) {
      return c.json({
        success: false,
        error: 'Nome, email, empresa e perfil são obrigatórios'
      }, 400);
    }

    // Gerar template de email
    const htmlContent = getSignupConfirmationEmailTemplate(nome, empresa, perfil);

    // Enviar email
    const result = await sendEmail({
      to: email,
      subject: '🎉 Cadastro Realizado com Sucesso - SysConecta 2026',
      html: htmlContent,
    });

    console.log(`✅ Email de confirmação enviado para: ${email}`);

    return c.json({
      success: true,
      message: 'Email de confirmação enviado com sucesso!',
      ...result
    }, 200);

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 🔥 NOVO: Endpoint para enviar email de notificação genérica
app.post("/make-server-f33747ec/email/notification", async (c) => {
  console.log('📧 Recebida requisição para enviar email de notificação');
  
  try {
    const body = await c.req.json();
    const { email, titulo, mensagem, destacar, buttonText, buttonUrl } = body;

    if (!email || !titulo || !mensagem) {
      return c.json({
        success: false,
        error: 'Email, título e mensagem são obrigatórios'
      }, 400);
    }

    // Gerar template de email
    const htmlContent = getNotificationEmailTemplate(titulo, mensagem, destacar, buttonText, buttonUrl);

    // Enviar email
    const result = await sendEmail({
      to: email,
      subject: titulo,
      html: htmlContent,
    });

    console.log(`✅ Email de notificação enviado para: ${email}`);

    return c.json({
      success: true,
      message: 'Email de notificação enviado com sucesso!',
      ...result
    }, 200);

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 🔥 NOVO: Endpoint para gerar e enviar código de verificação para fornecedor
app.post("/make-server-f33747ec/fornecedor/send-code", async (c) => {
  console.log('📧 🏭 Recebida requisição para enviar código de verificação de fornecedor');
  
  try {
    const body = await c.req.json();
    const { nomeEmpresa, nomeResponsavel, email, codigo, estado } = body;

    if (!nomeEmpresa || !nomeResponsavel || !email || !codigo || !estado) {
      return c.json({
        success: false,
        error: 'nomeEmpresa, nomeResponsavel, email, codigo e estado são obrigatórios'
      }, 400);
    }
    
    // Armazenar código no KV com expiração de 30 minutos
    const chaveKV = `verification_code_${email}_${estado}`;
    await kv.set(chaveKV, {
      codigo: codigo,
      nomeEmpresa,
      nomeResponsavel,
      email,
      estado,
      criadoEm: new Date().toISOString(),
      expiraEm: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutos
    });

    console.log(`✅ Código gerado para ${nomeEmpresa} (${estado}): ${codigo}`);

    // Gerar template de email
    const htmlContent = getSupplierVerificationCodeEmailTemplate(
      nomeEmpresa,
      nomeResponsavel,
      codigo,
      estado
    );

    // ⚠️ MODO TESTE: Enviar apenas para leandrozaraa@gmail.com
    // Para enviar para outros emails, você precisa:
    // 1. Acessar https://resend.com/domains
    // 2. Adicionar e verificar um domínio
    // 3. Mudar o 'from' em email.tsx de 'onboarding@resend.dev' para 'noreply@seudominio.com'
    
    console.log(`📧 MODO TESTE: Enviando para leandrozaraa@gmail.com`);
    console.log(`📋 Email original era: ${email} (${nomeEmpresa})`);
    
    const result = await sendEmail({
      to: 'leandrozaraa@gmail.com',
      subject: `🏭 [TESTE] Código de Acesso - ${nomeEmpresa} (${email}) - SysConecta 2026`,
      html: htmlContent,
    });

    console.log(`✅ Email enviado com sucesso para: leandrozaraa@gmail.com`);

    return c.json({
      success: true,
      message: 'Código de verificação enviado!',
      emailDestino: email, // Email real da empresa (apenas para exibição)
      emailEnviado: 'leandrozaraa@gmail.com', // Email que realmente recebeu
      modoTeste: true,
      aviso: 'Para enviar para outros emails, configure um domínio verificado no Resend',
      ...result
    }, 200);

  } catch (error) {
    console.error('❌ Erro ao enviar código de verificação:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 🔥 NOVO: Endpoint para verificar código de fornecedor
app.post("/make-server-f33747ec/fornecedor/verify-code", async (c) => {
  console.log('🔍 Verificando código de fornecedor...');
  
  try {
    const body = await c.req.json();
    const { email, estado, codigo } = body;

    if (!email || !estado || !codigo) {
      return c.json({
        success: false,
        error: 'email, estado e codigo são obrigatórios'
      }, 400);
    }

    // Buscar código armazenado
    const chaveKV = `verification_code_${email}_${estado}`;
    const dadosArmazenados = await kv.get(chaveKV);

    if (!dadosArmazenados) {
      return c.json({
        success: false,
        error: 'Código não encontrado ou expirado'
      }, 404);
    }

    // Verificar expiração
    const agora = new Date();
    const expiraEm = new Date(dadosArmazenados.expiraEm);
    
    if (agora > expiraEm) {
      // Código expirado, remover do KV
      await kv.del(chaveKV);
      return c.json({
        success: false,
        error: 'Código expirado. Solicite um novo código.'
      }, 400);
    }

    // Verificar código
    if (dadosArmazenados.codigo !== codigo) {
      return c.json({
        success: false,
        error: 'Código incorreto'
      }, 400);
    }

    // Código correto! Remover do KV
    await kv.del(chaveKV);

    console.log(`✅ Código verificado com sucesso para ${dadosArmazenados.nomeEmpresa}`);

    return c.json({
      success: true,
      message: 'Código verificado com sucesso!',
      dadosEmpresa: {
        nomeEmpresa: dadosArmazenados.nomeEmpresa,
        nomeResponsavel: dadosArmazenados.nomeResponsavel,
        email: dadosArmazenados.email,
        estado: dadosArmazenados.estado
      }
    }, 200);

  } catch (error) {
    console.error('❌ Erro ao verificar código:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// =====================================================
// 💰 FORNECEDOR - PREÇOS DE VIDRO
// =====================================================

// GET - Buscar preços de vidro de um fornecedor
app.get("/make-server-f33747ec/fornecedor/precos-vidro/:fornecedorId", async (c) => {
  const fornecedorId = c.req.param("fornecedorId");
  console.log(`💰 Buscando preços de vidro do fornecedor: ${fornecedorId}`);
  
  try {
    const key = `precos-vidro:${fornecedorId}`;
    const dados = await kv.get(key);
    
    console.log(`✅ Preços encontrados para fornecedor ${fornecedorId}`);
    
    return c.json({ 
      success: true, 
      precos: dados?.precos || []
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao buscar preços de vidro:', error);
    return c.json({ 
      success: false, 
      error: 'Erro ao buscar preços de vidro' 
    }, 500);
  }
});

// 🔥 GET - Tabela de Preços Completa (Compatibilidade com ConfiguradorSupremaCompleto)
app.get("/make-server-f33747ec/tabela-precos/:fornecedorId", async (c) => {
  const fornecedorId = c.req.param("fornecedorId");
  console.log(`💰 [COMPAT] Buscando tabela completa para: ${fornecedorId}`);
  
  try {
    // 1. Buscar preços salvos (formato simples ou array)
    const key = `precos-vidro:${fornecedorId}`;
    let dados = await kv.get(key);
    let precosSalvos = dados?.precos || {};

    // 🔥 CONVERSÃO DE ARRAY PARA OBJETO (Se vier do PUT novo, vem como Array)
    if (Array.isArray(precosSalvos)) {
        console.log('🔄 Convertendo array de preços para objeto indexado...');
        const map = {};
        precosSalvos.forEach((p: any) => {
            if (p.id) map[p.id] = p;
        });
        precosSalvos = map;
    }

    // 🔥 AUTO-SEED SANTA RITA (SC) - RECUPERAÇÃO DE DADOS OFICIAIS
    // Se não encontrar tabela salva e for a Santa Rita, carrega a tabela oficial do sistema
    if (Object.keys(precosSalvos).length === 0 && (fornecedorId === 'santa-rita-vidros' || fornecedorId === 'santa-rita-sc')) {
        console.log('🏭 Recuperando Tabela Oficial Santa Rita (SC) do sistema...');
        
        const TABELA_OFICIAL_SC = {
            'temperado-incolor-6mm': { custoBase: 110.00, margemLucro: 50, precoVenda: 165.00, ativo: true },
            'temperado-incolor-8mm': { custoBase: 140.00, margemLucro: 50, precoVenda: 210.00, ativo: true },
            'temperado-incolor-10mm': { custoBase: 175.00, margemLucro: 50, precoVenda: 260.00, ativo: true },
            
            'temperado-fume-6mm': { custoBase: 145.00, margemLucro: 50, precoVenda: 220.00, ativo: true },
            'temperado-fume-8mm': { custoBase: 195.00, margemLucro: 50, precoVenda: 295.00, ativo: true },
            'temperado-fume-10mm': { custoBase: 250.00, margemLucro: 50, precoVenda: 380.00, ativo: true },
            
            'temperado-verde-6mm': { custoBase: 145.00, margemLucro: 50, precoVenda: 220.00, ativo: true },
            'temperado-verde-8mm': { custoBase: 195.00, margemLucro: 50, precoVenda: 295.00, ativo: true },
            'temperado-verde-10mm': { custoBase: 250.00, margemLucro: 50, precoVenda: 380.00, ativo: true },
            
            'temperado-bronze-6mm': { custoBase: 145.00, margemLucro: 50, precoVenda: 220.00, ativo: true },
            'temperado-bronze-8mm': { custoBase: 195.00, margemLucro: 50, precoVenda: 295.00, ativo: true },
            'temperado-bronze-10mm': { custoBase: 250.00, margemLucro: 50, precoVenda: 380.00, ativo: true },
            
            'laminado-incolor-6mm': { custoBase: 160.00, margemLucro: 50, precoVenda: 240.00, ativo: true },
            'laminado-incolor-8mm': { custoBase: 215.00, margemLucro: 50, precoVenda: 320.00, ativo: true },
            'laminado-incolor-10mm': { custoBase: 260.00, margemLucro: 50, precoVenda: 390.00, ativo: true },
            
            'decorativo-espelho-prata-4mm': { custoBase: 180.00, margemLucro: 50, precoVenda: 270.00, ativo: true },
        };
        
        precosSalvos = TABELA_OFICIAL_SC;
        
        // Salvar no banco para persistência futura (Auto-healing)
        await kv.set(key, {
            precos: TABELA_OFICIAL_SC,
            fornecedorId,
            dataAtualizacao: new Date().toISOString()
        });
    }
    
    // 2. Gerar tabela completa com preços salvos + fallbacks para itens não cadastrados
    const tabelaCompleta: Record<string, any> = {};
    
    // Helper para gerar ID compatível com o frontend
    const gerarId = (tipo: string, cor: string, esp: number) => {
      return `${tipo.toLowerCase().replace(/\s+/g, '-')}-${cor.toLowerCase().replace(/\s+/g, '-')}-${esp}mm`
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    // Helper para buscar preço
    const buscarPreco = (id: string, tipo: string, esp: number) => {
      // 1. Prioridade: Preço Salvo/Oficial
      if (precosSalvos[id]) {
          // Se o objeto salvo já tem estrutura completa (custoBase, etc), retorna o valor de venda ou o objeto
          return precosSalvos[id].precoVenda || precosSalvos[id];
      }
      
      // 2. Fallback: Seed simplificado (ex: temperado_8mm)
      const keySeed = `${tipo.toLowerCase()}_${esp}mm`;
      if (precosSalvos[keySeed]) return precosSalvos[keySeed];
      
      // 3. Último recurso: Cálculo base genérico (para itens raros)
      if (tipo === 'Temperado') return 150 + (esp * 10);
      if (tipo === 'Laminado') return 200 + (esp * 15);
      return 100 + (esp * 5);
    };

    // Lista simplificada de produtos comuns para garantir cobertura total
    const tipos = ['Float', 'Temperado', 'Laminado', 'Controle Solar', 'Decorativo'];
    const cores = ['Incolor', 'Verde', 'Fumê', 'Bronze', 'Cinza', 'Extraclaro'];
    const espessuras = [3, 4, 5, 6, 8, 10, 12, 15, 19];
    const espessurasLam = [6, 8, 10, 12, 16, 20];

    // Gerar tabela final mesclando dados salvos com estrutura completa
    tipos.forEach(tipo => {
      const esps = (tipo === 'Laminado') ? espessurasLam : espessuras;
      
      esps.forEach(esp => {
        cores.forEach(cor => {
           const id = gerarId(tipo, cor, esp);
           
           // Se já existe no precosSalvos com estrutura completa, usa ele
           if (precosSalvos[id] && typeof precosSalvos[id] === 'object' && precosSalvos[id].precoVenda) {
               tabelaCompleta[id] = precosSalvos[id];
           } else {
               // Senão calcula baseado no valor simples encontrado
               const valorBase = buscarPreco(id, tipo, esp);
               // Se valorBase for um objeto (caso raro onde faltou checagem acima), pega o precoVenda
               const valorNumerico = typeof valorBase === 'object' ? valorBase.precoVenda : valorBase;
               
               tabelaCompleta[id] = {
                 custoBase: valorNumerico * 0.6,
                 margemLucro: 50,
                 precoVenda: valorNumerico,
                 ativo: true
               };
           }
        });
      });
    });

    console.log(`✅ Tabela completa entregue: ${Object.keys(tabelaCompleta).length} itens`);

    return c.json({ 
      success: true, 
      tabela: tabelaCompleta
    }, 200);

  } catch (error) {
    console.error('❌ Erro ao gerar tabela de preços:', error);
    return c.json({ 
      success: false, 
      error: 'Erro ao gerar tabela' 
    }, 500);
  }
});

// PUT - Atualizar preços de vidro de um fornecedor
app.put("/make-server-f33747ec/fornecedor/precos-vidro/:fornecedorId", async (c) => {
  const fornecedorId = c.req.param("fornecedorId");
  console.log(`💰 Atualizando preços de vidro do fornecedor: ${fornecedorId}`);
  
  try {
    const body = await c.req.json();
    const { precos } = body;
    
    if (!Array.isArray(precos)) {
      return c.json({ 
        success: false, 
        error: 'Preços devem ser um array' 
      }, 400);
    }
    
    const key = `precos-vidro:${fornecedorId}`;
    const dados = {
      precos,
      fornecedorId,
      dataAtualizacao: new Date().toISOString()
    };
    
    await kv.set(key, dados);
    console.log(`✅ Preços de vidro salvos: ${precos.length} itens`);
    
    return c.json({ 
      success: true, 
      message: 'Preços salvos com sucesso',
      precos
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao salvar preços de vidro:', error);
    return c.json({ 
      success: false, 
      error: 'Erro ao salvar preços de vidro' 
    }, 500);
  }
});

// =====================================================
// 📦 FORNECEDOR - ESTOQUE DE VIDROS (NOVO!)
// =====================================================

// GET - Buscar estoque de vidros de um fornecedor
app.get("/make-server-f33747ec/fornecedor/estoque-vidros/:fornecedorId", async (c) => {
  const fornecedorId = c.req.param("fornecedorId");
  console.log(`📦 Buscando estoque de vidros do fornecedor: ${fornecedorId}`);
  
  try {
    const key = `estoque-vidros:${fornecedorId}`;
    const dados = await kv.get(key);
    
    console.log(`✅ Estoque encontrado para fornecedor ${fornecedorId}`);
    
    return c.json({ 
      success: true, 
      estoque: dados?.estoque || []
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao buscar estoque de vidros:', error);
    return c.json({ 
      success: false, 
      error: 'Erro ao buscar estoque de vidros' 
    }, 500);
  }
});

// PUT - Atualizar estoque de vidros de um fornecedor
app.put("/make-server-f33747ec/fornecedor/estoque-vidros/:fornecedorId", async (c) => {
  const fornecedorId = c.req.param("fornecedorId");
  console.log(`📦 Atualizando estoque de vidros do fornecedor: ${fornecedorId}`);
  
  try {
    const body = await c.req.json();
    const { estoque } = body;
    
    if (!Array.isArray(estoque)) {
      return c.json({ 
        success: false, 
        error: 'Estoque deve ser um array' 
      }, 400);
    }
    
    const key = `estoque-vidros:${fornecedorId}`;
    const dados = {
      estoque,
      fornecedorId,
      dataAtualizacao: new Date().toISOString()
    };
    
    await kv.set(key, dados);
    console.log(`✅ Estoque de vidros salvo: ${estoque.length} itens`);
    
    return c.json({ 
      success: true, 
      message: 'Estoque salvo com sucesso',
      estoque
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao salvar estoque de vidros:', error);
    return c.json({ 
      success: false, 
      error: 'Erro ao salvar estoque de vidros' 
    }, 500);
  }
});

// =====================================================
// 🏭 FORNECEDOR - ESTOQUE
// =====================================================

// 🔥 POST - Inicializar tabela de preços completa de vidros
app.post("/make-server-f33747ec/fornecedor/inicializar-tabela/:fornecedorId", async (c) => {
  const fornecedorId = c.req.param("fornecedorId");
  console.log(`🏭 Inicializando tabela de preços completa para fornecedor: ${fornecedorId}`);
  
  try {
    const key = `tabela_precos:${fornecedorId}`;
    
    // Salvar tabela completa
    await kv.set(key, {
      vidros: TABELA_VIDROS_COMPLETA,
      planar: getTabelaPlanar(),
      estatisticas: getEstatisticasTabela(),
      fornecedorId,
      dataAtualizacao: new Date().toISOString(),
      versao: '2026.1'
    });
    
    const stats = getEstatisticasTabela();
    console.log(`✅ Tabela de preços inicializada: ${stats.total} vidros`);
    
    return c.json({ 
      success: true, 
      message: '✅ Tabela de preços inicializada com sucesso!',
      estatisticas: stats
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao inicializar tabela de preços:', error);
    return c.json({ 
      success: false, 
      error: 'Erro ao inicializar tabela de preços' 
    }, 500);
  }
});

// GET - Buscar produtos do estoque de um fornecedor
app.get("/make-server-f33747ec/estoque/:fornecedorId", async (c) => {
  const fornecedorId = c.req.param("fornecedorId");
  console.log(`📦 Buscando estoque do fornecedor: ${fornecedorId}`);
  
  try {
    const produtos = await kv.getByPrefix(`estoque:${fornecedorId}:`);
    console.log(`✅ Encontrados ${produtos.length} produtos no estoque`);
    
    return c.json({ 
      success: true, 
      produtos: produtos
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao buscar estoque:', error);
    return c.json({ 
      success: false, 
      error: 'Erro ao buscar estoque' 
    }, 500);
  }
});

// POST - Adicionar produto ao estoque
app.post("/make-server-f33747ec/estoque", async (c) => {
  console.log('📦 Adicionando produto ao estoque');
  
  try {
    const produto = await c.req.json();
    const produtoId = Date.now().toString();
    const key = `estoque:${produto.fornecedorId}:${produtoId}`;
    
    const produtoCompleto = {
      ...produto,
      id: produtoId,
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString()
    };
    
    await kv.set(key, produtoCompleto);
    console.log(`✅ Produto adicionado: ${produtoId}`);
    
    return c.json({ 
      success: true, 
      produto: produtoCompleto 
    }, 201);
  } catch (error) {
    console.error('❌ Erro ao adicionar produto:', error);
    return c.json({ 
      success: false, 
      error: 'Erro ao adicionar produto' 
    }, 500);
  }
});

// PUT - Atualizar produto do estoque
app.put("/make-server-f33747ec/estoque/:produtoId", async (c) => {
  const produtoId = c.req.param("produtoId");
  console.log(`📦 Atualizando produto: ${produtoId}`);
  
  try {
    const dados = await c.req.json();
    
    // Buscar produto existente
    // Reconstruindo a chave pois getByPrefix retorna apenas valores
    const key = `estoque:${dados.fornecedorId}:${produtoId}`;
    const produtos = await kv.getByPrefix(`estoque:${dados.fornecedorId}:`);
    const produtoExistente = produtos.find(p => p.id === produtoId);
    
    if (!produtoExistente) {
      return c.json({ 
        success: false, 
        error: 'Produto não encontrado' 
      }, 404);
    }
    
    const produtoAtualizado = {
      ...produtoExistente,
      ...dados,
      dataAtualizacao: new Date().toISOString()
    };
    
    await kv.set(key, produtoAtualizado);
    console.log(`✅ Produto atualizado: ${produtoId}`);
    
    return c.json({ 
      success: true, 
      produto: produtoAtualizado 
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao atualizar produto:', error);
    return c.json({ 
      success: false, 
      error: 'Erro ao atualizar produto' 
    }, 500);
  }
});

// DELETE - Remover produto do estoque
app.delete("/make-server-f33747ec/estoque/:produtoId", async (c) => {
  const produtoId = c.req.param("produtoId");
  console.log(`📦 Removendo produto: ${produtoId}`);
  
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ success: false, error: 'Não autorizado' }, 401);
    }
    
    // Buscar e deletar produto
    const produtos = await kv.getByPrefix(`estoque:`);
    const produtoExistente = produtos.find(p => p.id === produtoId);
    
    if (!produtoExistente) {
      return c.json({ 
        success: false, 
        error: 'Produto não encontrado' 
      }, 404);
    }
    
    const key = `estoque:${produtoExistente.fornecedorId}:${produtoId}`;
    await kv.del(key);
    console.log(`✅ Produto removido: ${produtoId}`);
    
    return c.json({ success: true }, 200);
  } catch (error) {
    console.error('❌ Erro ao remover produto:', error);
    return c.json({ 
      success: false, 
      error: 'Erro ao remover produto' 
    }, 500);
  }
});

// =====================================================
// 🛒 FORNECEDOR - PEDIDOS
// =====================================================

// GET - Buscar pedidos recebidos de um fornecedor
app.get("/make-server-f33747ec/pedidos/:fornecedorId", async (c) => {
  const fornecedorId = c.req.param("fornecedorId");
  console.log(`🛒 Buscando pedidos do fornecedor: ${fornecedorId}`);
  
  try {
    const pedidos = await kv.getByPrefix(`pedido:${fornecedorId}:`);
    console.log(` Encontrados ${pedidos.length} pedidos`);
    
    return c.json({ 
      success: true, 
      pedidos: pedidos
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao buscar pedidos:', error);
    return c.json({ 
      success: false, 
      error: 'Erro ao buscar pedidos' 
    }, 500);
  }
});

// POST - Aprovar pedido
app.post("/make-server-f33747ec/pedidos/:pedidoId/aprovar", async (c) => {
  const pedidoId = c.req.param("pedidoId");
  console.log(`✅ Aprovando pedido: ${pedidoId}`);
  
  try {
    const { fornecedorId } = await c.req.json();
    
    // Buscar pedido
    // Tenta ambos os prefixos possíveis
    const pedidos1 = await kv.getByPrefix(`pedido:fornecedor:${fornecedorId}:`);
    const pedidos2 = await kv.getByPrefix(`pedido:${fornecedorId}:`);
    const pedidos = [...pedidos1, ...pedidos2];
    
    const pedidoExistente = pedidos.find(p => p.id === pedidoId);
    
    if (!pedidoExistente) {
      return c.json({ 
        success: false, 
        error: 'Pedido não encontrado' 
      }, 404);
    }
    
    // Atualizar status e mover para produção
    const pedidoAtualizado = {
      ...pedidoExistente,
      statusPagamento: 'aprovado',
      dataAprovacao: new Date().toISOString()
    };
    
    // Salvar em produção
    const keyProducao = `producao:${fornecedorId}:${pedidoId}`;
    await kv.set(keyProducao, {
      ...pedidoAtualizado,
      statusGeral: 'em_producao',
      dataInicio: new Date().toISOString()
    });
    
    // Remover de pedidos pendentes (Tenta remover dos dois lugares possíveis)
    await kv.del(`pedido:fornecedor:${fornecedorId}:${pedidoId}`);
    await kv.del(`pedido:${fornecedorId}:${pedidoId}`);
    
    console.log(`✅ Pedido aprovado e movido para produção: ${pedidoId}`);
    
    return c.json({ success: true }, 200);
  } catch (error) {
    console.error('❌ Erro ao aprovar pedido:', error);
    return c.json({ 
      success: false, 
      error: 'Erro ao aprovar pedido' 
    }, 500);
  }
});

// POST - Recusar pedido
app.post("/make-server-f33747ec/pedidos/:pedidoId/recusar", async (c) => {
  const pedidoId = c.req.param("pedidoId");
  console.log(`❌ Recusando pedido: ${pedidoId}`);
  
  try {
    const { fornecedorId, motivo } = await c.req.json();
    
    // Buscar pedido
    const pedidos1 = await kv.getByPrefix(`pedido:fornecedor:${fornecedorId}:`);
    const pedidos2 = await kv.getByPrefix(`pedido:${fornecedorId}:`);
    const pedidos = [...pedidos1, ...pedidos2];
    
    const pedidoExistente = pedidos.find(p => p.id === pedidoId);
    
    if (!pedidoExistente) {
      return c.json({ 
        success: false, 
        error: 'Pedido não encontrado' 
      }, 404);
    }
    
    // Atualizar status
    const pedidoAtualizado = {
      ...pedidoExistente,
      statusPagamento: 'recusado',
      motivoRecusa: motivo,
      dataRecusa: new Date().toISOString()
    };
    
    // Tenta atualizar em ambos os lugares se existirem (ou recria no correto)
    // Vamos salvar no prefixo mais específico para garantir
    await kv.set(`pedido:fornecedor:${fornecedorId}:${pedidoId}`, pedidoAtualizado);
    
    // Se existir no antigo, remove para não duplicar? Ou atualiza?
    // Melhor tentar remover do antigo para migrar para o novo
    await kv.del(`pedido:${fornecedorId}:${pedidoId}`);
    
    console.log(`✅ Pedido recusado: ${pedidoId}`);
    
    return c.json({ success: true }, 200);
  } catch (error) {
    console.error('❌ Erro ao recusar pedido:', error);
    return c.json({ 
      success: false, 
      error: 'Erro ao recusar pedido' 
    }, 500);
  }
});

// DELETE - Excluir pedido permanentemente
app.delete("/make-server-f33747ec/pedidos/:pedidoId/excluir", async (c) => {
  const pedidoId = c.req.param("pedidoId");
  console.log(`🗑️ EXCLUINDO PERMANENTEMENTE pedido: ${pedidoId}`);
  
  try {
    const { fornecedorId } = await c.req.json();
    
    // Buscar pedido em TODAS as fontes possíveis
    const pedidos1 = await kv.getByPrefix(`pedido:fornecedor:${fornecedorId}:`);
    const pedidos2 = await kv.getByPrefix(`pedido:${fornecedorId}:`);
    const pedidos = [...pedidos1, ...pedidos2];
    
    const pedidoKey = pedidos.find((p: any) => p.id === pedidoId);
    
    if (!pedidoKey) {
      console.error(`❌ Pedido ${pedidoId} não encontrado`);
      return c.json({ 
        success: false, 
        error: 'Pedido não encontrado' 
      }, 404);
    }
    
    // Deletar pedido
    const key = `pedido:fornecedor:${fornecedorId}:${pedidoId}`;
    await kv.del(key);
    
    console.log(`✅ Pedido ${pedidoId} EXCLUÍDO PERMANENTEMENTE`);
    
    return c.json({ success: true, message: 'Pedido excluído permanentemente' }, 200);
  } catch (error) {
    console.error('❌ Erro ao excluir pedido:', error);
    return c.json({ 
      success: false, 
      error: 'Erro ao excluir pedido' 
    }, 500);
  }
});

// =====================================================
// 📊 FORNECEDOR - ESTATÍSTICAS
// =====================================================

// GET - Buscar estatísticas de pedidos por fornecedor
app.get("/make-server-f33747ec/estatisticas/fornecedor/:nomeEmpresa", async (c) => {
  const nomeEmpresa = c.req.param("nomeEmpresa");
  console.log(`📊 Buscando estatísticas do fornecedor: ${nomeEmpresa}`);
  
  try {
    // Buscar todos os pedidos do fornecedor
    const pedidos = await kv.getByPrefix(`pedido:fornecedor:${nomeEmpresa}:`);
    
    console.log(`📊 Total de pedidos encontrados: ${pedidos.length}`);
    
    // Calcular estatísticas por status
    const estatisticas = {
      pendente: 0,      // aguardando_aprovacao
      aprovado: 0,      // aprovado
      producao: 0,      // producao + corte + lapidacao + tempera + embalando + carregando
      entrega: 0,       // saiu_entrega
      entregue: 0       // entregue
    };
    
    pedidos.forEach((pedido: any) => {
      const status = pedido.status || 'aguardando_aprovacao';
      
      if (status === 'aguardando_aprovacao') {
        estatisticas.pendente++;
      } else if (status === 'aprovado') {
        estatisticas.aprovado++;
      } else if (['producao', 'corte', 'lapidacao', 'tempera', 'embalando', 'carregando'].includes(status)) {
        estatisticas.producao++;
      } else if (status === 'saiu_entrega') {
        estatisticas.entrega++;
      } else if (status === 'entregue') {
        estatisticas.entregue++;
      }
    });
    
    console.log(`✅ Estatísticas calculadas:`, estatisticas);
    
    return c.json({ 
      success: true, 
      estatisticas: estatisticas
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error);
    return c.json({ 
      success: false, 
      error: 'Erro ao buscar estatísticas' 
    }, 500);
  }
});

// =====================================================
// 🏭 FORNECEDOR - PRODUÇÃO
// =====================================================

// GET - Buscar pedidos em produção
app.get("/make-server-f33747ec/producao/:fornecedorId", async (c) => {
  const fornecedorId = c.req.param("fornecedorId");
  console.log(`🏭 Buscando produção do fornecedor: ${fornecedorId}`);
  
  try {
    const pedidos = await kv.getByPrefix(`producao:${fornecedorId}:`);
    console.log(`✅ Encontrados ${pedidos.length} pedidos em produção`);
    
    return c.json({ 
      success: true, 
      pedidos: pedidos
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao buscar produção:', error);
    return c.json({ 
      success: false, 
      error: 'Erro ao buscar produção' 
    }, 500);
  }
});

// PUT - Atualizar status de item em produção
app.put("/make-server-f33747ec/producao/item/:itemId/status", async (c) => {
  const itemId = c.req.param("itemId");
  console.log(`🏭 Atualizando status do item: ${itemId}`);
  
  try {
    const { status, fornecedorId } = await c.req.json();
    
    // Buscar todos pedidos em produção
    const pedidos = await kv.getByPrefix(`producao:${fornecedorId}:`);
    
    // Encontrar pedido que contém o item
    for (const pedido of pedidos) {
      if (!pedido || !pedido.itens) continue;
      
      const itemIndex = pedido.itens.findIndex((i: any) => i.id === itemId);
      
      if (itemIndex !== -1) {
        // Atualizar status do item
        pedido.itens[itemIndex].status = status;
        
        // Verificar se todos itens foram finalizados
        const todosFinalizados = pedido.itens.every((i: any) => i.status === 'finalizado');
        if (todosFinalizados) {
          pedido.statusGeral = 'finalizado';
        }
        
        const key = `producao:${fornecedorId}:${pedido.id}`;
        await kv.set(key, pedido);
        console.log(`✅ Status do item atualizado: ${itemId} → ${status}`);
        
        return c.json({ success: true }, 200);
      }
    }
    
    return c.json({ 
      success: false, 
      error: 'Item não encontrado' 
    }, 404);
  } catch (error) {
    console.error('❌ Erro ao atualizar status do item:', error);
    return c.json({ 
      success: false, 
      error: 'Erro ao atualizar status' 
    }, 500);
  }
});

// POST - Finalizar pedido (marcar como pronto para carregar)
app.post("/make-server-f33747ec/producao/:pedidoId/finalizar", async (c) => {
  const pedidoId = c.req.param("pedidoId");
  console.log(`✅ Finalizando pedido: ${pedidoId}`);
  
  try {
    const { fornecedorId } = await c.req.json();
    
    const pedidos = await kv.getByPrefix(`producao:${fornecedorId}:`);
    const pedidoExistente = pedidos.find(p => p.id === pedidoId);
    
    if (!pedidoExistente) {
      return c.json({ 
        success: false, 
        error: 'Pedido não encontrado' 
      }, 404);
    }
    
    // Atualizar status
    const pedidoAtualizado = {
      ...pedidoExistente,
      statusGeral: 'pronto_carregar',
      dataFinalizacao: new Date().toISOString()
    };
    
    const key = `producao:${fornecedorId}:${pedidoId}`;
    await kv.set(key, pedidoAtualizado);
    console.log(`✅ Pedido finalizado: ${pedidoId}`);
    
    return c.json({ success: true }, 200);
  } catch (error) {
    console.error('❌ Erro ao finalizar pedido:', error);
    return c.json({ 
      success: false, 
      error: 'Erro ao finalizar pedido' 
    }, 500);
  }
});

// =====================================================
// 📊 DASHBOARD - STATS
// =====================================================

// GET - Buscar estatísticas do dashboard
app.get("/make-server-f33747ec/stats/:fornecedorId", async (c) => {
  const fornecedorId = c.req.param("fornecedorId");
  console.log(`📊 Buscando stats do fornecedor: ${fornecedorId}`);
  
  try {
    // Buscar pedidos
    // Tenta prefixos possíveis (pedido:fornecedor:ID ou pedido:ID)
    const pedidosFornecedor = await kv.getByPrefix(`pedido:fornecedor:${fornecedorId}:`);
    const pedidosSimples = await kv.getByPrefix(`pedido:${fornecedorId}:`);
    const pedidos = [...pedidosFornecedor, ...pedidosSimples];

    const pedidosProducao = await kv.getByPrefix(`producao:${fornecedorId}:`);
    const estoque = await kv.getByPrefix(`estoque:${fornecedorId}:`);
    
    // Calcular stats
    const pedidosNovos = pedidos.filter(p => p && p.status === 'aguardando_aprovacao').length;
    const emProducao = pedidosProducao.length;
    const produtosEstoque = estoque.length;
    
    // Calcular faturamento (soma dos pedidos confirmados do mês atual)
    const hoje = new Date();
    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const faturamentoMes = pedidos
      .filter(p => {
        if (!p || !p.dataCriacao) return false;
        const dataPedido = new Date(p.dataCriacao);
        return dataPedido >= primeiroDiaMes && p.statusPagamento === 'confirmado';
      })
      .reduce((sum, p) => sum + (p.valorTotal || 0), 0);
    
    return c.json({
      pedidosNovos,
      emProducao,
      faturamentoMes,
      produtosEstoque
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao buscar stats:', error);
    return c.json({ 
      pedidosNovos: 0,
      emProducao: 0,
      faturamentoMes: 0,
      produtosEstoque: 0
    }, 200);
  }
});

// =====================================================
// 🎨 BANNER PERSONALIZADO
// =====================================================

// GET - Buscar banner do fornecedor
app.get("/make-server-f33747ec/banner/:fornecedorId", async (c) => {
  const fornecedorId = c.req.param("fornecedorId");
  console.log(`🎨 Buscando banner do fornecedor: ${fornecedorId}`);
  
  try {
    const key = `banner:${fornecedorId}`;
    const banner = await kv.get(key);
    
    if (banner) {
      return c.json({ bannerUrl: banner.value.url }, 200);
    } else {
      return c.json({ bannerUrl: null }, 200);
    }
  } catch (error) {
    console.error('❌ Erro ao buscar banner:', error);
    return c.json({ bannerUrl: null }, 200);
  }
});

// PUT - Atualizar banner do fornecedor
app.put("/make-server-f33747ec/banner/:fornecedorId", async (c) => {
  const fornecedorId = c.req.param("fornecedorId");
  console.log(`🎨 Atualizando banner do fornecedor: ${fornecedorId}`);
  
  try {
    const { bannerUrl } = await c.req.json();
    const key = `banner:${fornecedorId}`;
    
    await kv.set(key, {
      url: bannerUrl,
      dataAtualizacao: new Date().toISOString()
    });
    
    console.log(`✅ Banner atualizado com sucesso`);
    return c.json({ success: true }, 200);
  } catch (error) {
    console.error('❌ Erro ao atualizar banner:', error);
    return c.json({ 
      success: false, 
      error: 'Erro ao atualizar banner' 
    }, 500);
  }
});

// =====================================================
// 📦 INICIALIZAR ESTOQUE COM PRODUTOS BASE
// =====================================================

app.post("/make-server-f33747ec/estoque/inicializar", async (c) => {
  console.log('🚀 Inicializando estoque com produtos base');
  
  try {
    const { fornecedorId, tipoFornecedor } = await c.req.json();
    
    // Verificar se já existem produtos
    const produtosExistentes = await kv.getByPrefix(`estoque:${fornecedorId}:`);
    
    if (produtosExistentes.length > 0) {
      console.log(`ℹ️ Estoque já possui ${produtosExistentes.length} produtos`);
      return c.json({ 
        success: true, 
        message: 'Estoque já inicializado',
        produtos: produtosExistentes.length
      }, 200);
    }
    
    let produtosBase = [];
    
    // Produtos base para VIDROS
    if (tipoFornecedor === 'vidros') {
      produtosBase = [
        { categoria: 'Float Incolor', nome: 'Vidro Float Incolor', espessura: '4mm' },
        { categoria: 'Float Incolor', nome: 'Vidro Float Incolor', espessura: '6mm' },
        { categoria: 'Float Incolor', nome: 'Vidro Float Incolor', espessura: '8mm' },
        { categoria: 'Float Incolor', nome: 'Vidro Float Incolor', espessura: '10mm' },
        { categoria: 'Float Incolor', nome: 'Vidro Float Incolor', espessura: '12mm' },
        { categoria: 'Float Fumê', nome: 'Vidro Float Fumê', espessura: '6mm' },
        { categoria: 'Float Fumê', nome: 'Vidro Float Fumê', espessura: '8mm' },
        { categoria: 'Float Fumê', nome: 'Vidro Float Fumê', espessura: '10mm' },
        { categoria: 'Float Verde', nome: 'Vidro Float Verde', espessura: '6mm' },
        { categoria: 'Float Verde', nome: 'Vidro Float Verde', espessura: '8mm' },
        { categoria: 'Float Verde', nome: 'Vidro Float Verde', espessura: '10mm' },
        { categoria: 'Extra Clear', nome: 'Vidro Extra Clear', espessura: '6mm' },
        { categoria: 'Extra Clear', nome: 'Vidro Extra Clear', espessura: '8mm' },
        { categoria: 'Extra Clear', nome: 'Vidro Extra Clear', espessura: '10mm' },
        { categoria: 'Extra Clear', nome: 'Vidro Extra Clear', espessura: '12mm' },
        { categoria: 'Laminado Incolor', nome: 'Vidro Laminado Incolor', espessura: '6mm (3+3)' },
        { categoria: 'Laminado Incolor', nome: 'Vidro Laminado Incolor', espessura: '8mm (4+4)' },
        { categoria: 'Laminado Incolor', nome: 'Vidro Laminado Incolor', espessura: '10mm (5+5)' },
        { categoria: 'Laminado Colorido', nome: 'Vidro Laminado Verde', espessura: '8mm (4+4)' },
        { categoria: 'Laminado Colorido', nome: 'Vidro Laminado Fumê', espessura: '8mm (4+4)' },
        { categoria: 'Laminado Acústico', nome: 'Vidro Laminado Acústico', espessura: '8mm' },
        { categoria: 'Laminado Acústico', nome: 'Vidro Laminado Acústico', espessura: '10mm' },
        { categoria: 'Controle Solar', nome: 'Vidro Controle Solar Prata', espessura: '6mm' },
        { categoria: 'Controle Solar', nome: 'Vidro Controle Solar Verde', espessura: '8mm' },
        { categoria: 'Low-E', nome: 'Vidro Low-E', espessura: '6mm' },
        { categoria: 'Low-E', nome: 'Vidro Low-E', espessura: '8mm' },
        { categoria: 'DVH / Insulado', nome: 'DVH Incolor', espessura: '20mm (6+8+6)' },
        { categoria: 'DVH / Insulado', nome: 'DVH Extra Clear', espessura: '24mm (8+8+8)' }
      ];
    }
    
    // Produtos base para ALUMÍNIO
    if (tipoFornecedor === 'aluminio') {
      produtosBase = [
        { categoria: 'Perfil Linha 25', nome: 'Perfil 25 Batente', tipo: 'Batente' },
        { categoria: 'Perfil Linha 25', nome: 'Perfil 25 Folha Fixa', tipo: 'Folha' },
        { categoria: 'Perfil Linha 25', nome: 'Perfil 25 Folha Móvel', tipo: 'Folha' },
        { categoria: 'Perfil Linha 30', nome: 'Perfil 30 Batente', tipo: 'Batente' },
        { categoria: 'Perfil Linha 30', nome: 'Perfil 30 Folha Fixa', tipo: 'Folha' },
        { categoria: 'Perfil Linha 30', nome: 'Perfil 30 Folha Móvel', tipo: 'Folha' },
        { categoria: 'Perfil Linha 30', nome: 'Perfil 30 Travessa', tipo: 'Travessa' },
        { categoria: 'Perfil Linha Esquadria', nome: 'Perfil Esquadria 50x20', dimensao: '50x20mm' },
        { categoria: 'Perfil Linha Esquadria', nome: 'Perfil Esquadria 50x30', dimensao: '50x30mm' },
        { categoria: 'Perfil Linha Esquadria', nome: 'Perfil Esquadria 60x20', dimensao: '60x20mm' },
        { categoria: 'Perfil Box', nome: 'Perfil Box U 8mm', dimensao: '8mm' },
        { categoria: 'Perfil Box', nome: 'Perfil Box U 10mm', dimensao: '10mm' },
        { categoria: 'Perfil Box', nome: 'Perfil Box H 8mm', dimensao: '8mm' },
        { categoria: 'Perfil Box', nome: 'Perfil Box H 10mm', dimensao: '10mm' },
        { categoria: 'Cantoneira', nome: 'Cantoneira Alumínio 1" x 1/8"', dimensao: '1" x 1/8"' },
        { categoria: 'Cantoneira', nome: 'Cantoneira Alumínio 1.1/4" x 1/8"', dimensao: '1.1/4" x 1/8"' },
        { categoria: 'Cantoneira', nome: 'Cantoneira Alumínio 1.1/2" x 1/8"', dimensao: '1.1/2" x 1/8"' },
        { categoria: 'Tubo Quadrado', nome: 'Tubo Quadrado 20x20mm', dimensao: '20x20mm' },
        { categoria: 'Tubo Quadrado', nome: 'Tubo Quadrado 25x25mm', dimensao: '25x25mm' },
        { categoria: 'Tubo Quadrado', nome: 'Tubo Quadrado 30x30mm', dimensao: '30x30mm' },
        { categoria: 'Tubo Retangular', nome: 'Tubo Retangular 20x40mm', dimensao: '20x40mm' },
        { categoria: 'Tubo Retangular', nome: 'Tubo Retangular 30x50mm', dimensao: '30x50mm' },
        { categoria: 'Barra Chata', nome: 'Barra Chata 1" x 1/8"', dimensao: '1" x 1/8"' },
        { categoria: 'Barra Chata', nome: 'Barra Chata 1.1/2" x 1/8"', dimensao: '1.1/2" x 1/8"' }
      ];
    }
    
    // Produtos base para ACESSÓRIOS
    if (tipoFornecedor === 'acessorios') {
      produtosBase = [
        { categoria: 'Puxadores', nome: 'Puxador Reto Inox 30cm', material: 'Inox', tamanho: '30cm' },
        { categoria: 'Puxadores', nome: 'Puxador Reto Inox 40cm', material: 'Inox', tamanho: '40cm' },
        { categoria: 'Puxadores', nome: 'Puxador Reto Inox 50cm', material: 'Inox', tamanho: '50cm' },
        { categoria: 'Puxadores', nome: 'Puxador H Inox 30cm', material: 'Inox', tamanho: '30cm' },
        { categoria: 'Puxadores', nome: 'Puxador H Inox 40cm', material: 'Inox', tamanho: '40cm' },
        { categoria: 'Puxadores', nome: 'Puxador Alumínio 30cm', material: 'Alumínio', tamanho: '30cm' },
        { categoria: 'Puxadores', nome: 'Puxador Alumínio 40cm', material: 'Alumínio', tamanho: '40cm' },
        { categoria: 'Fechaduras', nome: 'Fechadura Banheiro Cromada', tipo: 'Banheiro' },
        { categoria: 'Fechaduras', nome: 'Fechadura Interna Cromada', tipo: 'Interna' },
        { categoria: 'Fechaduras', nome: 'Fechadura Externa Cromada', tipo: 'Externa' },
        { categoria: 'Fechaduras', nome: 'Fechadura Tetra Inox', tipo: 'Tetra' },
        { categoria: 'Dobradiças', nome: 'Dobradiça Vai-Vem Inox', tipo: 'Vai-Vem' },
        { categoria: 'Dobradiças', nome: 'Dobradiça Pivotante Superior', tipo: 'Pivotante' },
        { categoria: 'Dobradiças', nome: 'Dobradiça Pivotante Inferior', tipo: 'Pivotante' },
        { categoria: 'Dobradiças', nome: 'Dobradiça 180° Inox', tipo: '180°' },
        { categoria: 'Roldanas', nome: 'Roldana Nylon 8mm', material: 'Nylon', dimensao: '8mm' },
        { categoria: 'Roldanas', nome: 'Roldana Nylon 10mm', material: 'Nylon', dimensao: '10mm' },
        { categoria: 'Roldanas', nome: 'Roldana Nylon 12mm', material: 'Nylon', dimensao: '12mm' },
        { categoria: 'Roldanas', nome: 'Roldana Rolamento 8mm', material: 'Rolamento', dimensao: '8mm' },
        { categoria: 'Roldanas', nome: 'Roldana Rolamento 10mm', material: 'Rolamento', dimensao: '10mm' },
        { categoria: 'Trincos', nome: 'Trinco Magnético Inox', tipo: 'Magnético' },
        { categoria: 'Trincos', nome: 'Trinco Magnético Plástico', tipo: 'Magnético' },
        { categoria: 'Trincos', nome: 'Trinco Pressão Simples', tipo: 'Pressão' },
        { categoria: 'Trincos', nome: 'Trinco Pressão Duplo', tipo: 'Pressão' },
        { categoria: 'Borrachas', nome: 'Borracha U 6mm', tipo: 'U', dimensao: '6mm' },
        { categoria: 'Borrachas', nome: 'Borracha U 8mm', tipo: 'U', dimensao: '8mm' },
        { categoria: 'Borrachas', nome: 'Borracha U 10mm', tipo: 'U', dimensao: '10mm' },
        { categoria: 'Borrachas', nome: 'Borracha Trilho Inferior', tipo: 'Trilho' },
        { categoria: 'Silicone', nome: 'Silicone Incolor', cor: 'Incolor' },
        { categoria: 'Silicone', nome: 'Silicone Preto', cor: 'Preto' },
        { categoria: 'Silicone', nome: 'Silicone Branco', cor: 'Branco' }
      ];
    }
    
    // Adicionar produtos ao KV Store
    for (const produtoBase of produtosBase) {
      const produtoId = Date.now().toString() + Math.random().toString(36).substring(7);
      const key = `estoque:${fornecedorId}:${produtoId}`;
      
      const produto = {
        id: produtoId,
        fornecedorId,
        ...produtoBase,
        quantidade: 0, // Fornecedor vai preencher
        preco: 0, // Fornecedor vai preencher
        precoFuracao: 0,
        precoRecorte: 0,
        precoLapidacao: 0,
        dataCriacao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString()
      };
      
      await kv.set(key, produto);
    }
    
    console.log(`✅ Estoque inicializado com ${produtosBase.length} produtos`);
    
    return c.json({ 
      success: true, 
      message: `Estoque inicializado com ${produtosBase.length} produtos`,
      produtos: produtosBase.length
    }, 200);
    
  } catch (error) {
    console.error('❌ Erro ao inicializar estoque:', error);
    return c.json({ 
      success: false, 
      error: 'Erro ao inicializar estoque' 
    }, 500);
  }
});

// =====================================================
// 🔥 NOVO ORÇAMENTO - SISTEMA COMPLETO
// =====================================================

// POST - Buscar clientes
app.get("/make-server-f33747ec/clientes/buscar", async (c) => {
  const q = c.req.query('q') || '';
  const usuario_id = c.req.query('usuario_id') || '';
  
  console.log(`🔍 Buscando clientes: q="${q}", usuario="${usuario_id}"`);
  
  try {
    // Buscar todos os clientes do usuário
    // Tenta formato novo (user:cliente:id) e legado (cliente:user:id)
    const clientes1 = await kv.getByPrefix(`${usuario_id}:cliente:`);
    const clientes2 = await kv.getByPrefix(`cliente:${usuario_id}:`);
    const clientesRaw = [...clientes1, ...clientes2];
    
    // Filtrar itens nulos ou mal formados ANTES de processar
    // kv.getByPrefix já retorna os valores, não precisa de .map(k => k.value)
    const clientes = clientesRaw.filter(val => val && typeof val === 'object');
    
    // Filtrar por query (ULTRA DEFENSIVO)
    const clientesFiltrados = clientes.filter((c: any) => {
      try {
        // Proteção contra objetos vazios ou sem nome
        if (!c) return false;
        
        const termo = q.toLowerCase();
        
        // Garante strings seguras
        const nome = c.nome ? String(c.nome).toLowerCase() : '';
        const cpf = c.cpf_cnpj ? String(c.cpf_cnpj) : '';
        const telefone = c.telefone ? String(c.telefone) : '';
        const email = c.email ? String(c.email).toLowerCase() : '';
        
        return nome.includes(termo) || 
               cpf.includes(termo) || 
               telefone.includes(termo) ||
               email.includes(termo);
      } catch (err) {
        return false; // Se der erro num item, ignora ele
      }
    });
    
    console.log(`✅ Encontrados ${clientesFiltrados.length} clientes`);
    
    return c.json({ 
      success: true, 
      clientes: clientesFiltrados 
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao buscar clientes:', error);
    return c.json({ 
      success: false, 
      error: 'Erro ao buscar clientes',
      details: error.message
    }, 500);
  }
});

// POST - Cadastrar novo cliente
app.post("/make-server-f33747ec/clientes", async (c) => {
  console.log('📝 Cadastrando novo cliente');
  
  try {
    const body = await c.req.json();
    const { usuario_id, nome, cpf_cnpj, telefone, email, endereco, cidade, estado } = body;
    
    if (!usuario_id || !nome || !cpf_cnpj) {
      return c.json({ 
        success: false, 
        error: 'Dados obrigatórios faltando' 
      }, 400);
    }
    
    const cliente_id = `cliente-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    // Padronizando com o frontend: user:cliente:id
    const key = `${usuario_id}:cliente:${cliente_id}`;
    
    const cliente = {
      id: cliente_id,
      usuario_id,
      nome,
      cpf_cnpj,
      telefone,
      email,
      endereco,
      cidade,
      estado,
      data_cadastro: new Date().toISOString()
    };
    
    await kv.set(key, cliente);
    console.log(`✅ Cliente cadastrado: ${cliente_id}`);
    
    return c.json({ 
      success: true, 
      cliente 
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao cadastrar cliente:', error);
    return c.json({ 
      success: false, 
      error: 'Erro ao cadastrar cliente' 
    }, 500);
  }
});

// POST - Criar orçamento
app.post("/make-server-f33747ec/orcamentos", async (c) => {
  console.log('💰 Criando novo orçamento');
  
  try {
    const body = await c.req.json();
    const { usuario_id, cliente_id, linha, produto, configuracao, materiais, status } = body;
    
    const orcamento_id = `orcamento-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const key = `orcamento:${usuario_id}:${orcamento_id}`;
    
    const orcamento = {
      id: orcamento_id,
      usuario_id,
      cliente_id,
      linha,
      produto,
      configuracao,
      materiais,
      status: status || 'rascunho',
      data_criacao: new Date().toISOString(),
      data_atualizacao: new Date().toISOString()
    };
    
    await kv.set(key, orcamento);
    console.log(`✅ Orçamento criado: ${orcamento_id}`);
    
    return c.json({ 
      success: true, 
      orcamento_id,
      orcamento 
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao criar orçamento:', error);
    return c.json({ 
      success: false, 
      error: 'Erro ao criar orçamento' 
    }, 500);
  }
});

// GET - Buscar fornecedores por estado
app.get("/make-server-f33747ec/fornecedores/estado/:estado", async (c) => {
  const estado = c.req.param("estado");
  console.log(`🏭 Buscando fornecedores no estado: ${estado}`);
  
  try {
    // Buscar todos os fornecedores
    const keys = await kv.getByPrefix('fornecedor:');
    const todosFornecedores = keys.map(k => k.value);
    
    // Filtrar por estado
    const fornecedoresEstado = todosFornecedores.filter((f: any) => f && f.estado === estado);
    
    console.log(`✅ Encontrados ${fornecedoresEstado.length} fornecedores em ${estado}`);
    
    return c.json({ 
      success: true, 
      fornecedores: fornecedoresEstado 
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao buscar fornecedores:', error);
    return c.json({ 
      success: false, 
      error: 'Erro ao buscar fornecedores' 
    }, 500);
  }
});

// GET - Buscar pedidos do fornecedor
app.get("/make-server-f33747ec/pedidos/fornecedor/:fornecedorId", async (c) => {
  const fornecedorId = c.req.param("fornecedorId");
  console.log(`📦 Buscando pedidos do fornecedor: ${fornecedorId}`);
  
  try {
    // 🔥 BUSCAR COM O PADRÃO CORRETO: pedido:fornecedor:FORNECEDOR_ID:
    const pedidos = await kv.getByPrefix(`pedido:fornecedor:${fornecedorId}:`);
    
    console.log(`✅ Encontrados ${pedidos.length} pedidos para ${fornecedorId}`);
    console.log(`🔍 Buscando com padrão: pedido:fornecedor:${fornecedorId}:`);
    
    // 🔥 DEBUG: Log cada pedido encontrado
    if (pedidos && pedidos.length > 0) {
      pedidos.forEach((p, idx) => {
        console.log(`  📦 Pedido ${idx + 1}:`, {
          id: p?.id?.slice(0, 8),
          status: p?.status,
          vidraceiro: p?.vidraceiro_nome,
          valor: p?.valor_total
        });
      });
    } else {
      console.log(`⚠️ Nenhum pedido encontrado com o padrão: pedido:fornecedor:${fornecedorId}:`);
    }
    
    return c.json({ 
      success: true, 
      pedidos: pedidos || []
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao buscar pedidos:', error);
    console.error('❌ Stack trace:', error.stack);
    console.error('❌ Fornecedor ID:', fornecedorId);
    
    return c.json({ 
      success: false, 
      error: `Erro ao buscar pedidos: ${error.message}`,
      pedidos: [] // 🔥 Retorna array vazio em vez de undefined
    }, 500);
  }
});

// PUT - Atualizar status do pedido (fornecedor)
app.put("/make-server-f33747ec/pedidos/:pedidoId/status", async (c) => {
  const pedidoId = c.req.param("pedidoId");
  console.log(`🔄 Atualizando status do pedido: ${pedidoId}`);
  
  try {
    const body = await c.req.json();
    const { status, fornecedor_id } = body;
    
    // 🔥 USAR O PADRÃO CORRETO
    const key = `pedido:fornecedor:${fornecedor_id}:${pedidoId}`;
    const pedido = await kv.get(key);
    
    if (!pedido) {
      return c.json({ 
        success: false, 
        error: 'Pedido não encontrado' 
      }, 404);
    }
    
    const pedidoAtualizado = {
      ...pedido,
      status,
      data_atualizacao: new Date().toISOString()
    };
    
    await kv.set(key, pedidoAtualizado);
    console.log(`✅ Status atualizado: ${status}`);
    
    return c.json({ 
      success: true, 
      pedido: pedidoAtualizado 
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao atualizar status:', error);
    return c.json({ 
      success: false, 
      error: 'Erro ao atualizar status' 
    }, 500);
  }
});

// 🏭 SEED - Popular fornecedores de exemplo (SC)
app.post("/make-server-f33747ec/fornecedores/seed", async (c) => {
  console.log('🌱 Populando fornecedores de exemplo...');
  
  try {
    // Tabela detalhada para Santa Rita (SC)
    const PRECOS_SANTA_RITA = {
        'temperado-incolor-6mm': { custoBase: 110.00, margemLucro: 50, precoVenda: 165.00, ativo: true },
        'temperado-incolor-8mm': { custoBase: 140.00, margemLucro: 50, precoVenda: 210.00, ativo: true },
        'temperado-incolor-10mm': { custoBase: 175.00, margemLucro: 50, precoVenda: 260.00, ativo: true },
        'temperado-fume-6mm': { custoBase: 145.00, margemLucro: 50, precoVenda: 220.00, ativo: true },
        'temperado-fume-8mm': { custoBase: 195.00, margemLucro: 50, precoVenda: 295.00, ativo: true },
        'temperado-fume-10mm': { custoBase: 250.00, margemLucro: 50, precoVenda: 380.00, ativo: true },
        'laminado-incolor-6mm': { custoBase: 160.00, margemLucro: 50, precoVenda: 240.00, ativo: true },
        'laminado-incolor-8mm': { custoBase: 215.00, margemLucro: 50, precoVenda: 320.00, ativo: true },
        // Fallbacks simples
        'temperado_8mm': 210,
        'laminado_8mm': 320,
        'comum_6mm': 120
    };

    const fornecedoresExemplo = [
      {
        id: 'santa-rita-vidros', // ID oficial usado no frontend
        nomeEmpresa: 'SANTA RITA VIDROS',
        cnpj: '12.345.678/0001-99',
        email: 'contato@santarita.com.br',
        telefone: '(48) 3333-4444',
        endereco: 'Rua das Vidraçarias, 100',
        cidade: 'Florianópolis',
        estado: 'SC',
        tipoFornecedor: 'vidros',
        pix_key: 'santarita@pix.com.br',
        tem_perfil: true,
        precos: PRECOS_SANTA_RITA,
        ativo: true,
        exclusividade_territorial: true,
        data_cadastro: new Date().toISOString()
      },
      {
        id: 'alusupra-aluminio-sc',
        nomeEmpresa: 'ALUSUPRA',
        cnpj: '98.765.432/0001-00',
        email: 'contato@alusupra.com.br',
        telefone: '(48) 3555-6666',
        endereco: 'Av. dos Perfis, 500',
        cidade: 'Joinville',
        estado: 'SC',
        tipoFornecedor: 'aluminio',
        pix_key: 'alusupra@pix.com.br',
        tem_perfil: true,
        precos: {
          'perfil_kg': 45,
          'barra_6m': 120
        },
        ativo: true,
        exclusividade_territorial: true,
        data_cadastro: new Date().toISOString()
      },
      {
        id: 'alusupra-acessorios-sc',
        nomeEmpresa: 'ALUSUPRA',
        cnpj: '98.765.432/0001-00',
        email: 'contato@alusupra.com.br',
        telefone: '(48) 3555-6666',
        endereco: 'Av. dos Perfis, 500',
        cidade: 'Joinville',
        estado: 'SC',
        tipoFornecedor: 'acessorios',
        pix_key: 'alusupra@pix.com.br',
        tem_perfil: true,
        precos: {
          'roldana': 15,
          'trinco': 25,
          'fechadura': 45,
          'puxador': 35
        },
        ativo: true,
        exclusividade_territorial: true,
        data_cadastro: new Date().toISOString()
      }
    ];

    for (const fornecedor of fornecedoresExemplo) {
      // 1. Salvar perfil do fornecedor
      const key = `fornecedor:${fornecedor.id}`;
      await kv.set(key, fornecedor);
      
      // 2. Sincronizar tabela de preços especializada (para o configurador)
      if (fornecedor.tipoFornecedor === 'vidros') {
          const keyPrecos = `precos-vidro:${fornecedor.id}`;
          // Verifica se já existe para não sobrepor edições manuais, ou força atualização
          // Aqui forçamos para garantir o seed correto
          await kv.set(keyPrecos, {
              precos: fornecedor.precos,
              fornecedorId: fornecedor.id,
              dataAtualizacao: new Date().toISOString()
          });
      }
      
      console.log(`✅ Fornecedor cadastrado e tabelas sincronizadas: ${fornecedor.nomeEmpresa} (${fornecedor.id})`);
    }

    return c.json({
      success: true,
      message: '✅ Fornecedores de exemplo e tabelas de preços populados com sucesso!',
      fornecedores: fornecedoresExemplo.length
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao popular fornecedores:', error);
    return c.json({
      success: false,
      error: 'Erro ao popular fornecedores'
    }, 500);
  }
});

// ============================================
// 📦 GESTÃO DE PEDIDOS - FORNECEDOR
// ============================================
// OBS: Rota de busca já existe na linha 1679

// Aprovar pedido
app.post("/make-server-f33747ec/pedidos/:pedidoId/aprovar", async (c) => {
  try {
    const pedidoId = c.req.param('pedidoId');
    const body = await c.req.json();
    const { fornecedor_id } = body;

    const key = `pedido:fornecedor:${fornecedor_id}:${pedidoId}`;
    const pedido = await kv.get(key);

    if (!pedido) {
      return c.json({ success: false, error: 'Pedido não encontrado' }, 404);
    }

    pedido.status = 'aprovado';
    pedido.data_aprovacao = new Date().toISOString();
    await kv.set(key, pedido);

    console.log(`✅ Pedido ${pedidoId} aprovado`);

    return c.json({ success: true, pedido }, 200);
  } catch (error) {
    console.error('❌ Erro ao aprovar pedido:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Recusar pedido
app.post("/make-server-f33747ec/pedidos/:pedidoId/recusar", async (c) => {
  try {
    const pedidoId = c.req.param('pedidoId');
    const body = await c.req.json();
    const { fornecedor_id, motivo } = body;

    const key = `pedido:fornecedor:${fornecedor_id}:${pedidoId}`;
    const pedido = await kv.get(key);

    if (!pedido) {
      return c.json({ success: false, error: 'Pedido não encontrado' }, 404);
    }

    pedido.status = 'recusado';
    pedido.motivo_recusa = motivo;
    pedido.data_recusa = new Date().toISOString();
    await kv.set(key, pedido);

    console.log(`❌ Pedido ${pedidoId} recusado: ${motivo}`);

    return c.json({ success: true, pedido }, 200);
  } catch (error) {
    console.error('❌ Erro ao recusar pedido:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Atualizar status de produção
app.post("/make-server-f33747ec/pedidos/:pedidoId/status", async (c) => {
  try {
    const pedidoId = c.req.param('pedidoId');
    const body = await c.req.json();
    const { status, fornecedor_id } = body;

    const key = `pedido:fornecedor:${fornecedor_id}:${pedidoId}`;
    const pedido = await kv.get(key);

    if (!pedido) {
      return c.json({ success: false, error: 'Pedido não encontrado' }, 404);
    }

    pedido.status = status;
    pedido.data_atualizacao = new Date().toISOString();

    if (status === 'producao' && !pedido.data_producao_inicio) {
      pedido.data_producao_inicio = new Date().toISOString();
    }

    if (status === 'entregue') {
      pedido.data_entrega = new Date().toISOString();
      
      // Calcular tempo de produção
      if (pedido.data_producao_inicio) {
        const inicio = new Date(pedido.data_producao_inicio);
        const fim = new Date();
        pedido.tempo_producao_dias = Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
      }
    }

    await kv.set(key, pedido);

    // Salvar também na chave do vidraceiro
    const keyVidraceiro = `pedido:vidraceiro:${pedido.vidraceiro_id}:${pedidoId}`;
    await kv.set(keyVidraceiro, pedido);

    console.log(`✅ Status do pedido ${pedidoId} atualizado para: ${status}`);

    return c.json({ success: true, pedido }, 200);
  } catch (error) {
    console.error('❌ Erro ao atualizar status:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// 📦 PEDIDOS - VIDRACEIRO
// ============================================

// Buscar pedidos do vidraceiro
app.get("/make-server-f33747ec/pedidos/vidraceiro/:vidraceiroId", async (c) => {
  try {
    const vidraceiroId = c.req.param('vidraceiroId');
    const pedidos = await kv.getByPrefix(`pedido:vidraceiro:${vidraceiroId}`);
    
    return c.json({
      success: true,
      pedidos: pedidos || []
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao buscar pedidos do vidraceiro:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Confirmar recebimento
app.post("/make-server-f33747ec/pedidos/:pedidoId/confirmar-recebimento", async (c) => {
  try {
    const pedidoId = c.req.param('pedidoId');
    const body = await c.req.json();
    const { vidraceiro_id } = body;

    const key = `pedido:vidraceiro:${vidraceiro_id}:${pedidoId}`;
    const pedido = await kv.get(key);

    if (!pedido) {
      return c.json({ success: false, error: 'Pedido não encontrado' }, 404);
    }

    pedido.status = 'entregue';
    pedido.data_recebimento = new Date().toISOString();
    await kv.set(key, pedido);

    console.log(`✅ Recebimento confirmado para pedido ${pedidoId}`);

    return c.json({ success: true, pedido }, 200);
  } catch (error) {
    console.error('❌ Erro ao confirmar recebimento:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Avaliar fornecedor
app.post("/make-server-f33747ec/pedidos/:pedidoId/avaliar", async (c) => {
  try {
    const pedidoId = c.req.param('pedidoId');
    const body = await c.req.json();
    const { vidraceiro_id, avaliacao, comentario } = body;

    const key = `pedido:vidraceiro:${vidraceiro_id}:${pedidoId}`;
    const pedido = await kv.get(key);

    if (!pedido) {
      return c.json({ success: false, error: 'Pedido não encontrado' }, 404);
    }

    pedido.avaliacao = avaliacao;
    pedido.comentario_avaliacao = comentario;
    pedido.data_avaliacao = new Date().toISOString();
    await kv.set(key, pedido);

    console.log(`✅ Avaliação registrada: ${avaliacao} estrelas para pedido ${pedidoId}`);

    return c.json({ success: true, pedido }, 200);
  } catch (error) {
    console.error('❌ Erro ao avaliar:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// 🔔 NOTIFICAÇÕES
// ============================================

// Enviar notificação de entrega
app.post("/make-server-f33747ec/notificacoes/entrega", async (c) => {
  try {
    const body = await c.req.json();
    const { pedido_id, tipo } = body;

    const key = `notificacao:${pedido_id}`;
    await kv.set(key, {
      pedido_id,
      tipo,
      data: new Date().toISOString(),
      lida: false
    });

    console.log(`🔔 Notificação criada para pedido ${pedido_id}`);

    return c.json({ success: true }, 200);
  } catch (error) {
    console.error('❌ Erro ao criar notificação:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Buscar notificações do vidraceiro
app.get("/make-server-f33747ec/notificacoes/vidraceiro/:vidraceiroId", async (c) => {
  try {
    const vidraceiroId = c.req.param('vidraceiroId');
    
    // Buscar todos os pedidos do vidraceiro que estão em saiu_entrega
    const pedidos = await kv.getByPrefix(`pedido:vidraceiro:${vidraceiroId}`);
    const notificacoes = pedidos
      .filter((p: any) => p.status === 'saiu_entrega' || p.status === 'entregue')
      .map((p: any) => p.id);
    
    return c.json({
      success: true,
      notificacoes: notificacoes
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao buscar notificações:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 📦 Enviar pedidos para fornecedores
app.post("/make-server-f33747ec/pedidos/enviar", async (c) => {
  console.log('📦 ========== ENVIANDO PEDIDOS PARA FORNECEDORES ==========');
  
  try {
    const body = await c.req.json();
    const { orcamento_id, pedidos, usuario_id } = body;
    
    console.log(`📋 Orçamento ID: ${orcamento_id}`);
    console.log(`👤 Usuário ID: ${usuario_id}`);
    console.log(`📦 Total de pedidos: ${pedidos.length}`);

    for (const pedido of pedidos) {
      console.log(`\n🔹 PROCESSANDO PEDIDO ${pedido.id}`);
      console.log(`   Fornecedor: ${pedido.fornecedor_nome} (${pedido.fornecedor_id})`);
      console.log(`   Categoria: ${pedido.categoria}`);
      console.log(`   Valor Total: R$ ${pedido.valor_total}`);
      console.log(`   Items: ${pedido.items?.length || 0}`);
      
      // Salvar na chave do fornecedor
      const keyFornecedor = `pedido:fornecedor:${pedido.fornecedor_id}:${pedido.id}`;
      const pedidoCompleto = {
        ...pedido,
        orcamento_id,
        vidraceiro_id: usuario_id,
        data_pedido: new Date().toISOString(),
        status: pedido.status || 'aguardando_aprovacao'
      };
      
      await kv.set(keyFornecedor, pedidoCompleto);
      console.log(`   ✅ Salvo na chave do fornecedor: ${keyFornecedor}`);

      // Salvar também na chave do vidraceiro (SISTEMA ANTIGO)
      const keyVidraceiro = `pedido:vidraceiro:${usuario_id}:${pedido.id}`;
      await kv.set(keyVidraceiro, pedidoCompleto);
      console.log(`   ✅ Salvo na chave do vidraceiro: ${keyVidraceiro}`);
    }
    
    // 🔥 SALVAR TAMBÉM NO SISTEMA NOVO (Array completo)
    const keyNovoSistema = `pedidos:${usuario_id}`;
    const dadosAtuais = await kv.get(keyNovoSistema) || { pedidos: [] };
    const pedidosCompletos = pedidos.map((p: any) => ({
      ...p,
      orcamento_id,
      vidraceiro_id: usuario_id,
      data_pedido: new Date().toISOString(),
      status: p.status || 'aguardando_aprovacao'
    }));
    const novosPedidos = [...pedidosCompletos, ...dadosAtuais.pedidos];
    await kv.set(keyNovoSistema, { pedidos: novosPedidos });
    console.log(`   ✅ Salvos também no sistema novo: ${keyNovoSistema}`);

    console.log(`\n✅ ========== TODOS OS ${pedidos.length} PEDIDOS SALVOS COM SUCESSO! ==========\n`);

    return c.json({
      success: true,
      message: 'Pedidos enviados com sucesso!',
      pedidos_salvos: pedidos.length
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao enviar pedidos:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ════════════════════════════════════════════════════════════════════
// 🗄️ SYSCONECTA - API DO BANCO DE DADOS DE FORNECEDORES
// ════════════════════════════════════════════════════════════════════
import * as db from './sysconecta-database.tsx';

// 🎬 Inicializar banco de dados SysConecta
app.post("/make-server-f33747ec/sysconecta/init", async (c) => {
  console.log('🚀 Inicializando banco de dados SysConecta...');
  
  try {
    await db.inicializarBancoDados();
    
    return c.json({
      success: true,
      message: '✅ Banco de dados SysConecta inicializado com sucesso!',
      info: {
        fornecedores: 1, // Santa Rita (SC)
        industrias: 1, // Guardian Glass
        vagasDisponiveis: 80, // 81 - 1
        totalVagas: 81 // 27 estados × 3 tipos
      }
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao inicializar:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 📊 Estatísticas gerais do sistema
app.get("/make-server-f33747ec/sysconecta/estatisticas", async (c) => {
  console.log('📊 Buscando estatísticas do SysConecta...');
  
  try {
    const stats = await db.getEstatisticas();
    
    return c.json({
      success: true,
      estatisticas: stats
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 📋 Relatório completo do sistema
app.get("/make-server-f33747ec/sysconecta/relatorio", async (c) => {
  console.log('📋 Gerando relatório completo...');
  
  try {
    const relatorio = await db.getRelatorioCompleto();
    
    return c.json({
      success: true,
      relatorio
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao gerar relatório:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 🏭 Listar todas as indústrias
app.get("/make-server-f33747ec/sysconecta/industrias", async (c) => {
  console.log('🏭 Listando indústrias...');
  
  try {
    const industrias = await db.getAllIndustrias();
    
    return c.json({
      success: true,
      industrias
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao listar indústrias:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 🏢 Listar todos os fornecedores
app.get("/make-server-f33747ec/sysconecta/fornecedores", async (c) => {
  console.log('🏢 Listando fornecedores...');
  
  try {
    const fornecedores = await db.getAllFornecedores();
    
    return c.json({
      success: true,
      total: fornecedores.length,
      fornecedores
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao listar fornecedores:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 🏢 Buscar fornecedor específico
app.get("/make-server-f33747ec/sysconecta/fornecedor/:id", async (c) => {
  const id = c.req.param("id");
  console.log(`🏢 Buscando fornecedor: ${id}`);
  
  try {
    const fornecedor = await db.getFornecedor(id);
    
    if (!fornecedor) {
      return c.json({
        success: false,
        error: 'Fornecedor não encontrado'
      }, 404);
    }
    
    return c.json({
      success: true,
      fornecedor
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao buscar fornecedor:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 🏢 Criar novo fornecedor
app.post("/make-server-f33747ec/sysconecta/fornecedor", async (c) => {
  console.log('🏢 Criando novo fornecedor...');
  
  try {
    const fornecedor = await c.req.json();
    
    // Validar se já existe fornecedor no estado/tipo
    const vagaDisponivel = await db.verificarVagaDisponivel(fornecedor.estado, fornecedor.tipo);
    
    if (!vagaDisponivel) {
      return c.json({
        success: false,
        error: `Já existe um fornecedor de ${fornecedor.tipo} em ${db.ESTADOS_BR[fornecedor.estado]} (${fornecedor.estado})`
      }, 400);
    }
    
    // Validar se CNPJ já existe
    const fornecedorExistente = await db.getFornecedorPorCNPJ(fornecedor.cnpj);
    if (fornecedorExistente) {
      return c.json({
        success: false,
        error: `CNPJ ${fornecedor.cnpj} já cadastrado`
      }, 400);
    }
    
    // Criar fornecedor
    await db.saveFornecedor(fornecedor);
    
    console.log(`✅ Fornecedor criado: ${fornecedor.nomeFantasia}`);
    
    return c.json({
      success: true,
      message: 'Fornecedor criado com sucesso!',
      fornecedor
    }, 201);
  } catch (error) {
    console.error('❌ Erro ao criar fornecedor:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 🏢 Atualizar fornecedor
app.put("/make-server-f33747ec/sysconecta/fornecedor/:id", async (c) => {
  const id = c.req.param("id");
  console.log(`🏢 Atualizando fornecedor: ${id}`);
  
  try {
    const dados = await c.req.json();
    
    const fornecedor = await db.getFornecedor(id);
    if (!fornecedor) {
      return c.json({
        success: false,
        error: 'Fornecedor não encontrado'
      }, 404);
    }
    
    // Atualizar dados
    const fornecedorAtualizado = {
      ...fornecedor,
      ...dados,
      id // Manter ID original
    };
    
    await db.saveFornecedor(fornecedorAtualizado);
    
    console.log(`✅ Fornecedor atualizado: ${fornecedorAtualizado.nomeFantasia}`);
    
    return c.json({
      success: true,
      message: 'Fornecedor atualizado com sucesso!',
      fornecedor: fornecedorAtualizado
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao atualizar fornecedor:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 🏢 Inativar fornecedor
app.delete("/make-server-f33747ec/sysconecta/fornecedor/:id", async (c) => {
  const id = c.req.param("id");
  console.log(`🏢 Inativando fornecedor: ${id}`);
  
  try {
    await db.inativarFornecedor(id);
    
    console.log(`✅ Fornecedor inativado: ${id}`);
    
    return c.json({
      success: true,
      message: 'Fornecedor inativado com sucesso!'
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao inativar fornecedor:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// ════════════════════════════════════════════════════════════════════
// 📋 ROTAS DE TIPOLOGIAS
// ════════════════════════════════════════════════════════════════════

// 📋 Listar todas as tipologias
app.get("/make-server-f33747ec/sysconecta/tipologias", async (c) => {
  console.log('📋 Listando tipologias...');
  
  try {
    const tipologias = await kv.getByPrefix('tipologia_');
    
    console.log(`✅ ${tipologias.length} tipologias encontradas`);
    
    return c.json({
      success: true,
      tipologias: tipologias
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao listar tipologias:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 📋 Obter tipologia por ID
app.get("/make-server-f33747ec/sysconecta/tipologia/:id", async (c) => {
  const id = c.req.param("id");
  console.log(`📋 Buscando tipologia: ${id}`);
  
  try {
    const tipologia = await kv.get(`tipologia_${id}`);
    
    if (!tipologia) {
      return c.json({
        success: false,
        error: 'Tipologia não encontrada'
      }, 404);
    }
    
    console.log(`✅ Tipologia encontrada: ${tipologia.nome}`);
    
    return c.json({
      success: true,
      tipologia
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao buscar tipologia:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 📋 Criar ou atualizar tipologia
app.post("/make-server-f33747ec/sysconecta/tipologia", async (c) => {
  console.log('📋 Salvando tipologia...');
  
  try {
    const tipologia = await c.req.json();
    
    // Validações
    if (!tipologia.codigo || !tipologia.nome) {
      return c.json({
        success: false,
        error: 'Código e nome são obrigatórios'
      }, 400);
    }
    
    if (!tipologia.perfisAluminio || tipologia.perfisAluminio.length === 0) {
      return c.json({
        success: false,
        error: 'Adicione pelo menos um perfil de alumínio'
      }, 400);
    }
    
    // Salvar tipologia
    await kv.set(`tipologia_${tipologia.id}`, tipologia);
    
    console.log(`✅ Tipologia salva: ${tipologia.codigo} - ${tipologia.nome}`);
    
    return c.json({
      success: true,
      message: 'Tipologia salva com sucesso!',
      tipologia
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao salvar tipologia:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 📋 Deletar tipologia
app.delete("/make-server-f33747ec/sysconecta/tipologia/:id", async (c) => {
  const id = c.req.param("id");
  console.log(`📋 Deletando tipologia: ${id}`);
  
  try {
    await kv.del(`tipologia_${id}`);
    
    console.log(`✅ Tipologia deletada: ${id}`);
    
    return c.json({
      success: true,
      message: 'Tipologia deletada com sucesso!'
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao deletar tipologia:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// ════════════════════════════════════════════════════════════════════
// 📋 ROTAS DE TIPOLOGIAS COM LINHAS E FÓRMULAS DINÂMICAS
// ════════════════════════════════════════════════════════════════════

// 📋 Listar tipologias agrupadas por linha
app.get("/make-server-f33747ec/sysconecta/tipologias/linhas", async (c) => {
  console.log('📋 Listando tipologias agrupadas por linha...');
  
  try {
    const tipologias = await kv.getByPrefix('tipologia_linha_');
    
    // Agrupar por linha
    const linhasMap = new Map();
    
    for (const item of tipologias) {
      // Validar se item existe
      if (!item) {
        console.warn('⚠️ Item de tipologia inválido encontrado, ignorando...');
        continue;
      }
      
      const tipologia = item;
      const linha = tipologia.linha || 'LINHA SUPREMA';
      
      if (!linhasMap.has(linha)) {
        linhasMap.set(linha, {
          nome: linha,
          descricao: '',
          tipologias: []
        });
      }
      
      linhasMap.get(linha).tipologias.push(tipologia);
    }
    
    const linhas = Array.from(linhasMap.values());
    
    console.log(`✅ ${linhas.length} linhas encontradas`);
    
    return c.json({
      success: true,
      linhas
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao listar tipologias por linha:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 📋 Salvar tipologia com fórmulas dinâmicas
app.post("/make-server-f33747ec/sysconecta/tipologia/linha", async (c) => {
  console.log('📋 Salvando tipologia com fórmulas...');
  
  try {
    const tipologia = await c.req.json();
    
    // Validações
    if (!tipologia.codigo || !tipologia.nome || !tipologia.linha) {
      return c.json({
        success: false,
        error: 'Código, nome e linha são obrigatórios'
      }, 400);
    }
    
    if (!tipologia.perfis || tipologia.perfis.length === 0) {
      return c.json({
        success: false,
        error: 'Adicione pelo menos um perfil de alumínio'
      }, 400);
    }
    
    if (!tipologia.vidros || tipologia.vidros.length === 0) {
      return c.json({
        success: false,
        error: 'Adicione pelo menos uma especificação de vidro'
      }, 400);
    }
    
    // Validar fórmulas dos perfis
    for (const perfil of tipologia.perfis) {
      if (!perfil.codigo || !perfil.nome || !perfil.formula) {
        return c.json({
          success: false,
          error: `Perfil incompleto: ${perfil.codigo || 'sem código'}`
        }, 400);
      }
    }
    
    // Salvar tipologia
    await kv.set(`tipologia_linha_${tipologia.id}`, tipologia);
    
    console.log(`✅ Tipologia salva: ${tipologia.codigo} - ${tipologia.nome} (${tipologia.linha})`);
    
    return c.json({
      success: true,
      message: 'Tipologia salva com sucesso!',
      tipologia
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao salvar tipologia com fórmulas:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 📋 Aprovar tipologia
app.post("/make-server-f33747ec/sysconecta/tipologia/:id/aprovar", async (c) => {
  const id = c.req.param("id");
  console.log(`📋 Aprovando tipologia: ${id}`);
  
  try {
    const tipologia = await kv.get(`tipologia_linha_${id}`);
    
    if (!tipologia) {
      return c.json({
        success: false,
        error: 'Tipologia não encontrada'
      }, 404);
    }
    
    tipologia.status = 'APROVADO';
    tipologia.dataAprovacao = new Date().toISOString();
    
    await kv.set(`tipologia_linha_${id}`, tipologia);
    
    console.log(`✅ Tipologia aprovada: ${tipologia.codigo} - ${tipologia.nome}`);
    
    return c.json({
      success: true,
      message: 'Tipologia aprovada com sucesso!',
      tipologia
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao aprovar tipologia:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 🗺️ Verificar vaga disponível
app.get("/make-server-f33747ec/sysconecta/exclusividade/:estado/:tipo", async (c) => {
  const estado = c.req.param("estado") as db.EstadoBR;
  const tipo = c.req.param("tipo") as db.TipoFornecedor;
  
  console.log(`🗺️ Verificando vaga: ${estado} - ${tipo}`);
  
  try {
    const vagaDisponivel = await db.verificarVagaDisponivel(estado, tipo);
    const exclusividade = await db.getExclusividade(estado, tipo);
    
    let fornecedor = null;
    if (exclusividade?.fornecedorId) {
      fornecedor = await db.getFornecedor(exclusividade.fornecedorId);
    }
    
    return c.json({
      success: true,
      estado,
      tipo,
      vagaDisponivel,
      exclusividade,
      fornecedor
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao verificar vaga:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 🗺️ Mapa completo de exclusividade
app.get("/make-server-f33747ec/sysconecta/exclusividade/mapa", async (c) => {
  console.log('🗺️ Gerando mapa de exclusividade...');
  
  try {
    const mapa = await db.getMapaExclusividade();
    
    return c.json({
      success: true,
      mapa
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao gerar mapa:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 🎯 Rotear pedido para fornecedor correto
app.post("/make-server-f33747ec/sysconecta/rotear-pedido", async (c) => {
  console.log('🎯 Roteando pedido...');
  
  try {
    const { estadoVidraceiro, tipo } = await c.req.json();
    
    if (!estadoVidraceiro || !tipo) {
      return c.json({
        success: false,
        error: 'estadoVidraceiro e tipo são obrigatórios'
      }, 400);
    }
    
    const validacao = await db.validarPedido(estadoVidraceiro, tipo);
    
    if (!validacao.valido) {
      return c.json({
        success: false,
        error: validacao.mensagem
      }, 400);
    }
    
    return c.json({
      success: true,
      message: validacao.mensagem,
      fornecedor: validacao.fornecedor
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao rotear pedido:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 🏢 Buscar fornecedores por estado
app.get("/make-server-f33747ec/sysconecta/fornecedores/estado/:estado", async (c) => {
  const estado = c.req.param("estado") as db.EstadoBR;
  console.log(`🏢 Buscando fornecedores do estado: ${estado}`);
  
  try {
    const fornecedores = await db.getFornecedoresPorEstado(estado);
    
    return c.json({
      success: true,
      estado,
      total: fornecedores.length,
      fornecedores
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao buscar fornecedores:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 🏢 Buscar fornecedor por estado e tipo
app.get("/make-server-f33747ec/sysconecta/fornecedor/estado/:estado/tipo/:tipo", async (c) => {
  const estado = c.req.param("estado") as db.EstadoBR;
  const tipo = c.req.param("tipo") as db.TipoFornecedor;
  console.log(`🏢 Buscando fornecedor: ${estado} - ${tipo}`);
  
  try {
    const fornecedor = await db.getFornecedorPorEstadoTipo(estado, tipo);
    
    if (!fornecedor) {
      return c.json({
        success: false,
        error: `Nenhum fornecedor de ${tipo} disponível em ${db.ESTADOS_BR[estado]} (${estado})`
      }, 404);
    }
    
    return c.json({
      success: true,
      fornecedor
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao buscar fornecedor:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// ════════════════════════════════════════════════════════════════════
// 🔐 ADMIN - LISTAR TODOS OS COMPROVANTES DE PAGAMENTO
// ════════════════════════════════════════════════════════════════════

app.get("/make-server-f33747ec/admin/comprovantes", async (c) => {
  console.log('💰 [ADMIN] Buscando todos os comprovantes de pagamento...');
  
  try {
    // Buscar todos os pedidos de todos os fornecedores
    const todosPedidos = await kv.getByPrefix('pedido:fornecedor:');
    
    const comprovantes = [];
    
    for (const pedidoData of todosPedidos) {
      // Verificar se tem comprovante anexado
      if (pedidoData && pedidoData.comprovante_pix) {
        comprovantes.push({
          id: pedidoData.id,
          pedido_id: pedidoData.id,
          fornecedor_id: pedidoData.fornecedor_id,
          fornecedor_nome: pedidoData.fornecedor_nome,
          vidraceiro_id: pedidoData.vidraceiro_id,
          vidraceiro_nome: pedidoData.vidraceiro_nome || 'N/A',
          valor: pedidoData.valor_total,
          data_pedido: pedidoData.data_pedido,
          data_pagamento: pedidoData.data_pagamento || pedidoData.data_pedido,
          comprovante_url: pedidoData.comprovante_pix,
          comprovante_nome: pedidoData.comprovante_nome || 'Comprovante PIX',
          status: pedidoData.status,
          statusPagamento: pedidoData.statusPagamento || 'pendente',
          categoria: pedidoData.categoria,
          comissao_sysconecta: (pedidoData.valor_total || 0) * 0.05 // 5% de comissão
        });
      }
    }
    
    // Ordenar por data mais recente
    comprovantes.sort((a, b) => {
      return new Date(b.data_pagamento).getTime() - new Date(a.data_pagamento).getTime();
    });
    
    console.log(`✅ [ADMIN] Encontrados ${comprovantes.length} comprovantes`);
    
    return c.json({
      success: true,
      total: comprovantes.length,
      comprovantes
    }, 200);
  } catch (error) {
    console.error('❌ [ADMIN] Erro ao buscar comprovantes:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 🔐 ADMIN - Listar todas as empresas conectadas
app.get("/make-server-f33747ec/admin/empresas", async (c) => {
  console.log('🏢 [ADMIN] Buscando todas as empresas conectadas...');
  
  try {
    // Buscar fornecedores
    const fornecedores = await db.getAllFornecedores();
    
    // TODO: Buscar vidraceiros do sistema de auth quando implementado
    const vidraceiros = []; // Placeholder
    
    return c.json({
      success: true,
      fornecedores: {
        total: fornecedores.length,
        ativos: fornecedores.filter(f => f.ativo).length,
        inativos: fornecedores.filter(f => !f.ativo).length,
        porTipo: {
          VIDRO: fornecedores.filter(f => f.tipo === 'VIDRO' && f.ativo),
          ALUMINIO: fornecedores.filter(f => f.tipo === 'ALUMINIO' && f.ativo),
          ACESSORIOS: fornecedores.filter(f => f.tipo === 'ACESSORIOS' && f.ativo)
        }
      },
      vidraceiros: {
        total: vidraceiros.length,
        lista: vidraceiros
      }
    }, 200);
  } catch (error) {
    console.error('❌ [ADMIN] Erro ao buscar empresas:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// =====================================================
// 💰 FORNECEDOR - TABELA DE PREÇOS COMPLETA (OBJETO)
// =====================================================

// GET - Buscar tabela completa
app.get("/make-server-f33747ec/tabela-precos/:fornecedorId", async (c) => {
  const fornecedorId = c.req.param("fornecedorId");
  console.log(`💰 Buscando tabela de preços completa: ${fornecedorId}`);
  
  try {
    const key = `tabela_precos_${fornecedorId}`;
    const dados = await kv.get(key);
    
    // Se não encontrar, retorna objeto vazio mas com sucesso
    const tabela = dados?.value || {};
    
    return c.json({ 
      success: true, 
      tabela
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao buscar tabela de preços:', error);
    return c.json({ 
      success: false, 
      error: 'Erro ao buscar tabela de preços' 
    }, 500);
  }
});

// POST - Salvar tabela completa
app.post("/make-server-f33747ec/tabela-precos/salvar", async (c) => {
  console.log('💰 Salvando tabela de preços via API Segura');
  
  try {
    const body = await c.req.json();
    const { fornecedorId, tabela } = body;

    if (!fornecedorId || !tabela) {
      return c.json({ success: false, error: 'Dados incompletos' }, 400);
    }

    // 🔥 CORREÇÃO: Usar a mesma chave do GET (precos-vidro)
    const key = `precos-vidro:${fornecedorId}`;
    
    // Formato compatível com o GET /tabela-precos/:id
    const payload = {
        precos: tabela,
        fornecedorId: fornecedorId,
        dataAtualizacao: new Date().toISOString()
    };
    
    await kv.set(key, payload);

    console.log(`✅ Tabela sincronizada com sucesso para ${fornecedorId} (Chave: ${key})`);
    
    return c.json({ 
      success: true, 
      message: 'Tabela salva com sucesso'
    }, 200);

  } catch (error) {
    console.error('❌ Erro crítico ao salvar tabela:', error);
    return c.json({ 
      success: false, 
      error: error.message 
    }, 500);
  }
});

// =====================================================
// 📦 PEDIDOS - Multi-tenancy com user_id
// =====================================================

// POST - Criar pedido (Vidraceiro)
app.post("/make-server-f33747ec/pedidos/criar", async (c) => {
  console.log('📦 Criando novo pedido...');
  
  try {
    const body = await c.req.json();
    const { userId, pedido } = body;

    if (!userId) {
      return c.json({ success: false, error: 'userId é obrigatório' }, 400);
    }

    if (!pedido) {
      return c.json({ success: false, error: 'Dados do pedido são obrigatórios' }, 400);
    }

    // 🔥 LIMPAR objeto para evitar DataCloneError
    const pedidoLimpo = JSON.parse(JSON.stringify(pedido));

    // Salvar no KV com chave baseada em user_id
    const key = `pedidos:${userId}`;
    
    // Buscar pedidos existentes
    const pedidosExistentes = await kv.get(key) || { pedidos: [] };
    
    // Adicionar novo pedido
    const novaLista = [pedidoLimpo, ...pedidosExistentes.pedidos];
    
    // Salvar
    await kv.set(key, { pedidos: novaLista });

    console.log(`✅ Pedido ${pedido.id} salvo para user ${userId}`);
    
    return c.json({ 
      success: true, 
      pedidoId: pedido.id,
      message: 'Pedido salvo com sucesso'
    }, 200);

  } catch (error) {
    console.error('❌ Erro ao criar pedido:', error);
    return c.json({ 
      success: false, 
      error: error.message 
    }, 500);
  }
});

// GET - Buscar pedidos do usuário
app.get("/make-server-f33747ec/pedidos/listar/:userId", async (c) => {
  const userId = c.req.param("userId");
  console.log(`📦 Buscando pedidos do usuário: ${userId}`);
  
  try {
    // 🔥 BUSCAR DO SISTEMA NOVO (Array completo)
    const keyNovo = `pedidos:${userId}`;
    const dadosNovo = await kv.get(keyNovo);
    const pedidosNovos = dadosNovo?.pedidos || [];
    
    // 🔥 BUSCAR DO SISTEMA ANTIGO (Chaves individuais)
    const prefixoAntigo = `pedido:vidraceiro:${userId}:`;
    const pedidosAntigos = await kv.getByPrefix(prefixoAntigo);
    
    // Mesclar os dois sistemas
    const todosPedidos = [...pedidosNovos, ...pedidosAntigos];
    
    // Remover duplicatas (por id)
    const pedidosUnicos = todosPedidos.reduce((acc: any[], pedido: any) => {
      const existe = acc.find((p: any) => p.id === pedido.id);
      if (!existe) {
        acc.push(pedido);
      }
      return acc;
    }, []);
    
    // Ordenar por data (mais recente primeiro)
    pedidosUnicos.sort((a: any, b: any) => {
      const dataA = new Date(a.data_pedido || a.data || 0).getTime();
      const dataB = new Date(b.data_pedido || b.data || 0).getTime();
      return dataB - dataA;
    });
    
    console.log(`✅ ${pedidosUnicos.length} pedidos encontrados para ${userId} (${pedidosNovos.length} novos + ${pedidosAntigos.length} antigos)`);
    
    return c.json({ 
      success: true, 
      pedidos: pedidosUnicos
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao buscar pedidos:', error);
    return c.json({ 
      success: false, 
      error: error.message 
    }, 500);
  }
});

// 🔥 NOVA ROTA - Buscar pedidos por FORNECEDOR_ID (OTIMIZADO)
app.get("/make-server-f33747ec/pedidos/fornecedor/:fornecedorId", async (c) => {
  const fornecedorId = c.req.param("fornecedorId");
  console.log(`📦 Buscando pedidos do fornecedor: ${fornecedorId}`);
  
  try {
    // Buscar TODOS os pedidos (sistema antigo)
    const prefixoAntigo = 'pedido:vidraceiro:';
    const todosPedidos = await kv.getByPrefix(prefixoAntigo);
    
    console.log(`📦 Total de pedidos no banco: ${todosPedidos.length}`);
    
    // Filtrar por fornecedor_id E otimizar campos (remover dados pesados)
    const pedidosDoFornecedor = todosPedidos
      .filter((p: any) => p.fornecedor_id === fornecedorId)
      .map((p: any) => ({
        // Apenas campos essenciais
        id: p.id,
        numeroPedido: p.numeroPedido,
        cliente_nome: p.cliente_nome,
        vidraceiro_nome: p.vidraceiro_nome,
        vidraceiro_cidade: p.vidraceiro_cidade,
        vidraceiro_id: p.vidraceiro_id,
        fornecedor_id: p.fornecedor_id,
        valor_total: p.valor_total,
        data_pedido: p.data_pedido || p.data,
        status: p.status || 'pendente',
        statusFornecedor: p.statusFornecedor,
        etapaProducao: p.etapaProducao,
        // Items simplificados (sem dados pesados)
        items: (p.items || []).map((item: any) => ({
          id: item.id,
          tipo: item.tipo,
          largura: item.largura,
          altura: item.altura,
          quantidade: item.quantidade || 1,
          valor_total: item.valor_total
        })),
        // Histórico e datas
        historicoStatus: p.historicoStatus || [],
        observacoesStatus: p.observacoesStatus,
        dataAprovacao: p.dataAprovacao,
        dataDespachado: p.dataDespachado,
        dataEntregue: p.dataEntregue
      }));
    
    // Ordenar por data (mais recente primeiro)
    pedidosDoFornecedor.sort((a: any, b: any) => {
      const dataA = new Date(a.data_pedido || 0).getTime();
      const dataB = new Date(b.data_pedido || 0).getTime();
      return dataB - dataA;
    });
    
    console.log(`✅ ${pedidosDoFornecedor.length} pedidos do fornecedor ${fornecedorId}`);
    
    return c.json({ 
      success: true, 
      total: pedidosDoFornecedor.length,
      pedidos: pedidosDoFornecedor
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao buscar pedidos do fornecedor:', error);
    return c.json({ 
      success: false, 
      error: String(error?.message || error)
    }, 500);
  }
});

// =====================================================
// 📄 ORÇAMENTOS - Multi-tenancy com user_id
// =====================================================

// POST - Criar orçamento
app.post("/make-server-f33747ec/orcamentos/criar", async (c) => {
  console.log('📄 Criando novo orçamento...');
  
  try {
    const body = await c.req.json();
    const { userId, orcamento } = body;

    if (!userId) {
      return c.json({ success: false, error: 'userId é obrigatório' }, 400);
    }

    if (!orcamento) {
      return c.json({ success: false, error: 'Dados do orçamento são obrigatórios' }, 400);
    }

    // 🔥 LIMPAR objeto para evitar DataCloneError
    const orcamentoLimpo = JSON.parse(JSON.stringify(orcamento));

    // Salvar no KV com chave baseada em user_id
    const key = `orcamentos:${userId}`;
    
    // Buscar orçamentos existentes
    const orcamentosExistentes = await kv.get(key) || { orcamentos: [] };
    
    // Adicionar novo orçamento
    const novaLista = [orcamentoLimpo, ...orcamentosExistentes.orcamentos];
    
    // Salvar
    await kv.set(key, { orcamentos: novaLista });

    console.log(`✅ Orçamento ${orcamento.id} salvo para user ${userId}`);
    
    return c.json({ 
      success: true, 
      orcamentoId: orcamento.id,
      message: 'Orçamento salvo com sucesso'
    }, 200);

  } catch (error) {
    console.error('❌ Erro ao criar orçamento:', error);
    return c.json({ 
      success: false, 
      error: error.message 
    }, 500);
  }
});

// GET - Buscar orçamentos do usuário
app.get("/make-server-f33747ec/orcamentos/listar/:userId", async (c) => {
  const userId = c.req.param("userId");
  console.log(`📄 Buscando orçamentos do usuário: ${userId}`);
  
  try {
    const key = `orcamentos:${userId}`;
    const dados = await kv.get(key);
    
    const orcamentos = dados?.orcamentos || [];
    
    console.log(`✅ ${orcamentos.length} orçamentos encontrados para ${userId}`);
    
    return c.json({ 
      success: true, 
      orcamentos 
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao buscar orçamentos:', error);
    return c.json({ 
      success: false, 
      error: error.message 
    }, 500);
  }
});

// 🔥🔥🔥 DEBUG - LISTAR TODOS OS PEDIDOS NO KV (TODAS AS CHAVES)
app.get("/make-server-f33747ec/debug/pedidos-all", async (c) => {
  console.log('🔍 DEBUG: Listando TODOS os pedidos no KV Store...');
  
  try {
    // Buscar todas as chaves com prefixo "pedido"
    const pedidosPrefixo1 = await kv.getByPrefix('pedido:');
    const pedidosPrefixo2 = await kv.getByPrefix('pedidos:');
    
    console.log(`📦 Chaves com "pedido:": ${pedidosPrefixo1.length}`);
    console.log(`📦 Chaves com "pedidos:": ${pedidosPrefixo2.length}`);
    
    // Analisar estrutura dos pedidos
    const analise = {
      antigos: pedidosPrefixo1.slice(0, 3).map((p: any) => ({
        id: p.id,
        vidraceiro_id: p.vidraceiro_id,
        fornecedor_id: p.fornecedor_id,
        status: p.status
      })),
      novos: pedidosPrefixo2.slice(0, 3).map((item: any) => ({
        total_pedidos: item.pedidos?.length || 0,
        primeiro_pedido: item.pedidos?.[0]?.id || 'N/A'
      }))
    };
    
    console.log('📊 ESTRUTURA:', JSON.stringify(analise, null, 2));
    
    return c.json({
      success: true,
      total: pedidosPrefixo1.length + pedidosPrefixo2.length,
      pedidos_antigos: pedidosPrefixo1,
      pedidos_novos: pedidosPrefixo2.map((item: any) => item.pedidos || []).flat(),
      analise
    }, 200);
  } catch (error) {
    console.error('❌ Erro ao listar pedidos:', error);
    return c.json({ 
      success: false, 
      error: error.message 
    }, 500);
  }
});

// 🔥🔥🔥 MIGRAR PEDIDOS DE UM USERID PARA OUTRO
app.post("/make-server-f33747ec/debug/migrar-pedidos", async (c) => {
  console.log('🔄 MIGRAÇÃO: Iniciando migração de pedidos...');
  
  try {
    const { userId_antigo, userId_novo } = await c.req.json();
    
    if (!userId_antigo || !userId_novo) {
      return c.json({ success: false, error: 'userId_antigo e userId_novo são obrigatórios' }, 400);
    }
    
    console.log(`🔄 Migrando de ${userId_antigo} para ${userId_novo}`);
    
    // 1. Buscar todos os pedidos do userId antigo
    const prefixoAntigo = `pedido:vidraceiro:${userId_antigo}:`;
    const pedidosAntigos = await kv.getByPrefix(prefixoAntigo);
    
    console.log(`📦 ${pedidosAntigos.length} pedidos encontrados com userId antigo`);
    
    if (pedidosAntigos.length === 0) {
      return c.json({ 
        success: false, 
        message: 'Nenhum pedido encontrado com o userId antigo' 
      }, 404);
    }
    
    // 2. Atualizar o vidraceiro_id de cada pedido
    const pedidosMigrados = pedidosAntigos.map((pedido: any) => ({
      ...pedido,
      vidraceiro_id: userId_novo
    }));
    
    // 3. Salvar no sistema NOVO (array completo)
    const chaveNova = `pedidos:${userId_novo}`;
    
    // Buscar pedidos existentes do userId novo (se houver)
    const dadosExistentes = await kv.get(chaveNova);
    const pedidosExistentes = dadosExistentes?.pedidos || [];
    
    // Mesclar sem duplicatas
    const todosPedidos = [...pedidosExistentes, ...pedidosMigrados];
    const pedidosUnicos = todosPedidos.reduce((acc: any[], pedido: any) => {
      const existe = acc.find((p: any) => p.id === pedido.id);
      if (!existe) {
        acc.push(pedido);
      }
      return acc;
    }, []);
    
    // Salvar no novo formato
    await kv.set(chaveNova, { pedidos: pedidosUnicos });
    
    console.log(`✅ ${pedidosMigrados.length} pedidos migrados com sucesso!`);
    
    // 4. OPCIONAL: Deletar chaves antigas (comentado por segurança)
    // for (const pedido of pedidosAntigos) {
    //   const chaveAntiga = `pedido:vidraceiro:${userId_antigo}:${pedido.id}`;
    //   await kv.del(chaveAntiga);
    // }
    
    return c.json({
      success: true,
      message: `${pedidosMigrados.length} pedidos migrados com sucesso`,
      userId_antigo,
      userId_novo,
      total_migrado: pedidosMigrados.length,
      total_final: pedidosUnicos.length
    }, 200);
    
  } catch (error) {
    console.error('❌ Erro ao migrar pedidos:', error);
    return c.json({ 
      success: false, 
      error: error.message 
    }, 500);
  }
});

// 🔥🔥🔥 DEBUG - ANALISAR UM PEDIDO ESPECÍFICO (Ver todos os campos)
app.get("/make-server-f33747ec/debug/pedido/:pedidoId", async (c) => {
  const pedidoId = c.req.param("pedidoId");
  console.log(`🔍 DEBUG: Analisando pedido ${pedidoId}...`);
  
  try {
    // Buscar em TODAS as chaves possíveis
    const pedidosAntigos = await kv.getByPrefix('pedido:');
    const pedidoEncontrado = pedidosAntigos.find((p: any) => p.id === pedidoId);
    
    if (!pedidoEncontrado) {
      return c.json({
        success: false,
        error: `Pedido ${pedidoId} não encontrado`
      }, 404);
    }
    
    // Analisar TODOS os campos de vidraceiro
    const analise = {
      id: pedidoEncontrado.id,
      // Campos de Vidraceiro
      vidraceiro_id: pedidoEncontrado.vidraceiro_id,
      vidraceiro_nome: pedidoEncontrado.vidraceiro_nome,
      vidraceiro_email: pedidoEncontrado.vidraceiro_email,
      vidraceiro_telefone: pedidoEncontrado.vidraceiro_telefone,
      vidraceiro_cidade: pedidoEncontrado.vidraceiro_cidade,
      vidraceiro_estado: pedidoEncontrado.vidraceiro_estado,
      vidraceiro_cnpj: pedidoEncontrado.vidraceiro_cnpj,
      // Campos de Cliente
      cliente_nome: pedidoEncontrado.cliente_nome,
      cliente_endereco: pedidoEncontrado.cliente_endereco,
      // Campos de Fornecedor
      fornecedor_id: pedidoEncontrado.fornecedor_id,
      fornecedor_nome: pedidoEncontrado.fornecedor_nome,
      // Status
      status: pedidoEncontrado.status,
      statusFornecedor: pedidoEncontrado.statusFornecedor,
      // Problema comum: nome vem como "Vidraçaria Parceira"?
      problema_nome: pedidoEncontrado.vidraceiro_nome === 'Vidraçaria Parceira' ? '⚠️ SIM!' : '✅ Nome OK',
      // Dados completos
      dados_completos: pedidoEncontrado
    };
    
    console.log('✅ Análise do pedido:', JSON.stringify(analise, null, 2));
    
    return c.json({
      success: true,
      analise
    }, 200);
    
  } catch (error) {
    console.error('❌ Erro ao analisar pedido:', error);
    return c.json({
      success: false,
      error: String(error?.message || error)
    }, 500);
  }
});

Deno.serve(app.fetch);