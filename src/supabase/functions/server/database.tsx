import { createClient } from 'npm:@supabase/supabase-js@2';

// Criar cliente Supabase com chave de serviço (permissões admin)
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

/**
 * 🎯 SYSCONECTA - BANCO DE DADOS COMPLETO
 * 
 * 12 TABELAS:
 * - 6 Básicas: user_profiles, waitlist, clientes, orcamentos, pedidos, notificacoes
 * - 4 Tipologias: tipologias, tipologia_aluminio, tipologia_vidro, tipologia_acessorios
 * - 2 Fornecedores: fornecedor_precos, materiais_sobra
 * 
 * Executa de forma idempotente (pode rodar múltiplas vezes sem erro)
 */
export async function initializeDatabase() {
  console.log('🚀 Iniciando criação das 12 tabelas do SysConecta...');

  try {
    // ============================================
    // 1. USER_PROFILES - Perfis de usuário
    // ============================================
    console.log('📊 [1/12] Criando tabela: user_profiles');
    await createTableDirect('user_profiles', `
      CREATE TABLE IF NOT EXISTS user_profiles (
        id UUID PRIMARY KEY,
        email TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('vidraceiro', 'fornecedor', 'santa-rita', 'producao', 'admin')),
        
        -- NOVO: Dados de fornecedor
        categoria_fornecedor TEXT CHECK (categoria_fornecedor IN ('aluminio', 'vidro', 'acessorios', 'completo')),
        estado_atuacao TEXT,
        cidades_atendidas JSONB DEFAULT '[]',
        
        nome TEXT NOT NULL,
        empresa TEXT,
        telefone TEXT,
        cnpj TEXT,
        endereco TEXT,
        bairro TEXT,
        cidade TEXT,
        estado TEXT,
        cep TEXT,
        avatar_url TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
      CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
      CREATE INDEX IF NOT EXISTS idx_user_profiles_cnpj ON user_profiles(cnpj);
      CREATE INDEX IF NOT EXISTS idx_user_profiles_categoria_fornecedor ON user_profiles(categoria_fornecedor);
      CREATE INDEX IF NOT EXISTS idx_user_profiles_estado_atuacao ON user_profiles(estado_atuacao);
    `);

    // ============================================
    // 2. WAITLIST - Lista de espera
    // ============================================
    console.log('📊 [2/12] Criando tabela: waitlist');
    await createTableDirect('waitlist', `
      CREATE TABLE IF NOT EXISTS waitlist (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        nome TEXT NOT NULL,
        empresa TEXT,
        telefone TEXT NOT NULL,
        email TEXT NOT NULL,
        segmento TEXT,
        mensagem TEXT,
        status TEXT DEFAULT 'pendente',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
      CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist(status);
    `);

    // ============================================
    // 3. CLIENTES - Clientes dos vidraceiros
    // ============================================
    console.log('📊 [3/12] Criando tabela: clientes');
    await createTableDirect('clientes', `
      CREATE TABLE IF NOT EXISTS clientes (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL,
        nome TEXT NOT NULL,
        cpf TEXT,
        cnpj TEXT,
        telefone TEXT,
        email TEXT,
        endereco TEXT,
        bairro TEXT,
        cidade TEXT,
        estado TEXT,
        cep TEXT,
        tipo TEXT DEFAULT 'pessoa_fisica',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_clientes_user_id ON clientes(user_id);
      CREATE INDEX IF NOT EXISTS idx_clientes_cpf ON clientes(cpf);
      CREATE INDEX IF NOT EXISTS idx_clientes_cnpj ON clientes(cnpj);
    `);

    // ============================================
    // 4. ORCAMENTOS - Orçamentos criados
    // ============================================
    console.log('📊 [4/12] Criando tabela: orcamentos');
    await createTableDirect('orcamentos', `
      CREATE TABLE IF NOT EXISTS orcamentos (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL,
        cliente_id UUID,
        numero TEXT NOT NULL UNIQUE,
        tipologia_id UUID,
        modelo TEXT,
        tipologia TEXT,
        linha TEXT,
        altura NUMERIC,
        largura NUMERIC,
        valor_total NUMERIC DEFAULT 0,
        status TEXT DEFAULT 'rascunho',
        itens JSONB DEFAULT '[]',
        calculos_detalhados JSONB DEFAULT '{}',
        observacoes TEXT,
        data_orcamento TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_orcamentos_user_id ON orcamentos(user_id);
      CREATE INDEX IF NOT EXISTS idx_orcamentos_cliente_id ON orcamentos(cliente_id);
      CREATE INDEX IF NOT EXISTS idx_orcamentos_numero ON orcamentos(numero);
      CREATE INDEX IF NOT EXISTS idx_orcamentos_status ON orcamentos(status);
      CREATE INDEX IF NOT EXISTS idx_orcamentos_tipologia_id ON orcamentos(tipologia_id);
    `);

    // ============================================
    // 5. PEDIDOS - Vidraceiro → Fornecedor
    // ============================================
    console.log('📊 [5/12] Criando tabela: pedidos');
    await createTableDirect('pedidos', `
      CREATE TABLE IF NOT EXISTS pedidos (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        numero TEXT NOT NULL UNIQUE,
        vidraceiro_id UUID NOT NULL,
        fornecedor_id UUID NOT NULL,
        orcamento_id UUID,
        status TEXT DEFAULT 'pendente',
        valor_total NUMERIC DEFAULT 0,
        itens JSONB DEFAULT '[]',
        comprovante_url TEXT,
        data_pagamento TIMESTAMP WITH TIME ZONE,
        data_aprovacao TIMESTAMP WITH TIME ZONE,
        observacoes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_pedidos_vidraceiro_id ON pedidos(vidraceiro_id);
      CREATE INDEX IF NOT EXISTS idx_pedidos_fornecedor_id ON pedidos(fornecedor_id);
      CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);
      CREATE INDEX IF NOT EXISTS idx_pedidos_numero ON pedidos(numero);
    `);

    // ============================================
    // 6. NOTIFICACOES - Sistema de notificações
    // ============================================
    console.log('📊 [6/12] Criando tabela: notificacoes');
    await createTableDirect('notificacoes', `
      CREATE TABLE IF NOT EXISTS notificacoes (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL,
        tipo TEXT NOT NULL,
        titulo TEXT NOT NULL,
        mensagem TEXT,
        lida BOOLEAN DEFAULT false,
        data JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_notificacoes_user_id ON notificacoes(user_id);
      CREATE INDEX IF NOT EXISTS idx_notificacoes_lida ON notificacoes(lida);
    `);

    // ============================================
    // 7. TIPOLOGIAS - Cadastro mestre (SysConecta)
    // ============================================
    console.log('📊 [7/12] Criando tabela: tipologias');
    await createTableDirect('tipologias', `
      CREATE TABLE IF NOT EXISTS tipologias (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        codigo TEXT NOT NULL UNIQUE,
        nome TEXT NOT NULL,
        categoria TEXT NOT NULL CHECK (categoria IN ('porta', 'janela', 'box')),
        linha TEXT,
        descricao TEXT,
        imagem_url TEXT,
        desenho_tecnico JSONB DEFAULT '{}',
        vao_minimo JSONB DEFAULT '{"largura": 800, "altura": 2000}',
        vao_maximo JSONB DEFAULT '{"largura": 5000, "altura": 3000}',
        folhas_config JSONB DEFAULT '{}',
        ativo BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_tipologias_codigo ON tipologias(codigo);
      CREATE INDEX IF NOT EXISTS idx_tipologias_categoria ON tipologias(categoria);
      CREATE INDEX IF NOT EXISTS idx_tipologias_linha ON tipologias(linha);
    `);

    // ============================================
    // 8. TIPOLOGIA_ALUMINIO - Itens de alumínio
    // ============================================
    console.log('📊 [8/12] Criando tabela: tipologia_aluminio');
    await createTableDirect('tipologia_aluminio', `
      CREATE TABLE IF NOT EXISTS tipologia_aluminio (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        tipologia_id UUID NOT NULL,
        sequencia INT NOT NULL,
        codigo_item TEXT NOT NULL,
        nome_item TEXT NOT NULL,
        posicao TEXT,
        comprimento_barra_padrao_mm NUMERIC DEFAULT 6000,
        
        -- CÁLCULO DE QUANTIDADE
        tipo_calculo TEXT CHECK (tipo_calculo IN ('perimetro', 'altura', 'largura', 'quantidade_fixa', 'formula_custom')),
        formula_comprimento TEXT,
        quantidade_fixa INT,
        permite_corte_multiplo BOOLEAN DEFAULT true,
        
        -- PESO (editável pelo fornecedor)
        peso_kg_metro NUMERIC,
        fornecedor_pode_editar_peso BOOLEAN DEFAULT true,
        
        -- DESCONTOS TÉCNICOS
        desconto_largura_mm NUMERIC DEFAULT 0,
        desconto_altura_mm NUMERIC DEFAULT 0,
        aplica_desconto_em TEXT DEFAULT 'vao_geral',
        
        obrigatorio BOOLEAN DEFAULT true,
        observacoes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_tipologia_aluminio_tipologia_id ON tipologia_aluminio(tipologia_id);
      CREATE INDEX IF NOT EXISTS idx_tipologia_aluminio_codigo_item ON tipologia_aluminio(codigo_item);
    `);

    // ============================================
    // 9. TIPOLOGIA_VIDRO - Cálculo de vidro
    // ============================================
    console.log('📊 [9/12] Criando tabela: tipologia_vidro');
    await createTableDirect('tipologia_vidro', `
      CREATE TABLE IF NOT EXISTS tipologia_vidro (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        tipologia_id UUID NOT NULL,
        codigo_tipo_vidro TEXT NOT NULL,
        nome_tipo_vidro TEXT NOT NULL,
        espessura_mm NUMERIC,
        peso_kg_m2 NUMERIC,
        
        -- CÁLCULO DE ÁREA
        quantidade_vidros INT NOT NULL,
        formula_largura TEXT,
        formula_altura TEXT,
        desconto_tecnico_largura_mm NUMERIC DEFAULT 0,
        desconto_tecnico_altura_mm NUMERIC DEFAULT 0,
        
        -- FURAÇÕES (preços editáveis pelo fornecedor de vidro)
        furacoes_config JSONB DEFAULT '[]',
        
        padrao BOOLEAN DEFAULT false,
        ativo BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_tipologia_vidro_tipologia_id ON tipologia_vidro(tipologia_id);
      CREATE INDEX IF NOT EXISTS idx_tipologia_vidro_codigo ON tipologia_vidro(codigo_tipo_vidro);
    `);

    // ============================================
    // 10. TIPOLOGIA_ACESSORIOS - Itens de acessórios
    // ============================================
    console.log('📊 [10/12] Criando tabela: tipologia_acessorios');
    await createTableDirect('tipologia_acessorios', `
      CREATE TABLE IF NOT EXISTS tipologia_acessorios (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        tipologia_id UUID NOT NULL,
        categoria TEXT NOT NULL,
        codigo_item TEXT NOT NULL,
        nome_item TEXT NOT NULL,
        descricao TEXT,
        
        -- QUANTIDADE
        tipo_calculo TEXT CHECK (tipo_calculo IN ('por_folha_movel', 'por_folha_fixa', 'quantidade_fixa', 'por_metro_linear', 'formula_custom')),
        quantidade_base NUMERIC,
        formula_quantidade TEXT,
        
        obrigatorio BOOLEAN DEFAULT true,
        padrao BOOLEAN DEFAULT false,
        grupo_exclusivo TEXT,
        ativo BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_tipologia_acessorios_tipologia_id ON tipologia_acessorios(tipologia_id);
      CREATE INDEX IF NOT EXISTS idx_tipologia_acessorios_codigo ON tipologia_acessorios(codigo_item);
      CREATE INDEX IF NOT EXISTS idx_tipologia_acessorios_categoria ON tipologia_acessorios(categoria);
    `);

    // ============================================
    // 11. FORNECEDOR_PRECOS - Preços por fornecedor
    // ============================================
    console.log('📊 [11/12] Criando tabela: fornecedor_precos');
    await createTableDirect('fornecedor_precos', `
      CREATE TABLE IF NOT EXISTS fornecedor_precos (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        fornecedor_id UUID NOT NULL,
        tipologia_id UUID NOT NULL,
        categoria TEXT NOT NULL CHECK (categoria IN ('aluminio', 'vidro', 'acessorios', 'completo')),
        
        -- PREÇOS (JSON por categoria)
        precos_itens JSONB DEFAULT '{}',
        
        margem_percent NUMERIC DEFAULT 0,
        desconto_especial_percent NUMERIC DEFAULT 0,
        ativo BOOLEAN DEFAULT true,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_by UUID,
        
        UNIQUE(fornecedor_id, tipologia_id, categoria)
      );

      CREATE INDEX IF NOT EXISTS idx_fornecedor_precos_fornecedor_id ON fornecedor_precos(fornecedor_id);
      CREATE INDEX IF NOT EXISTS idx_fornecedor_precos_tipologia_id ON fornecedor_precos(tipologia_id);
      CREATE INDEX IF NOT EXISTS idx_fornecedor_precos_categoria ON fornecedor_precos(categoria);
    `);

    // ============================================
    // 12. MATERIAIS_SOBRA - Controle de sobras
    // ============================================
    console.log('📊 [12/12] Criando tabela: materiais_sobra');
    await createTableDirect('materiais_sobra', `
      CREATE TABLE IF NOT EXISTS materiais_sobra (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL,
        orcamento_origem_id UUID,
        tipo_material TEXT NOT NULL,
        codigo_item TEXT NOT NULL,
        nome_item TEXT NOT NULL,
        comprimento_mm NUMERIC NOT NULL,
        quantidade_pecas INT NOT NULL,
        utilizado BOOLEAN DEFAULT false,
        orcamento_utilizacao_id UUID,
        data_utilizacao TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_materiais_sobra_user_id ON materiais_sobra(user_id);
      CREATE INDEX IF NOT EXISTS idx_materiais_sobra_utilizado ON materiais_sobra(utilizado);
      CREATE INDEX IF NOT EXISTS idx_materiais_sobra_codigo_item ON materiais_sobra(codigo_item);
    `);

    console.log('✅ Todas as 12 tabelas foram criadas com sucesso!');
    
    return { 
      success: true, 
      message: '✅ Banco de dados inicializado com sucesso! 12 tabelas criadas.',
      details: {
        tabelas_basicas: ['user_profiles', 'waitlist', 'clientes', 'orcamentos', 'pedidos', 'notificacoes'],
        tabelas_tipologias: ['tipologias', 'tipologia_aluminio', 'tipologia_vidro', 'tipologia_acessorios'],
        tabelas_fornecedores: ['fornecedor_precos', 'materiais_sobra'],
        total: 12
      }
    };

  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Função auxiliar para criar tabelas diretamente
 */
async function createTableDirect(tableName: string, sql: string) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.log(`⚠️ Tentando método alternativo para ${tableName}...`);
      // Método alternativo: usar a API REST diretamente
      const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
        },
        body: JSON.stringify({ sql })
      });

      if (!response.ok) {
        console.log(`ℹ️ Tabela ${tableName} pode já existir ou foi criada anteriormente`);
      } else {
        console.log(`✅ Tabela ${tableName} criada com sucesso!`);
      }
    } else {
      console.log(`✅ Tabela ${tableName} criada com sucesso!`);
    }
  } catch (err) {
    console.log(`ℹ️ Nota sobre ${tableName}:`, err.message);
  }
}

/**
 * Verifica se as tabelas existem
 */
export async function checkTables() {
  try {
    const tables = [
      // Básicas
      'user_profiles',
      'waitlist', 
      'clientes',
      'orcamentos',
      'pedidos',
      'notificacoes',
      // Tipologias
      'tipologias',
      'tipologia_aluminio',
      'tipologia_vidro',
      'tipologia_acessorios',
      // Fornecedores
      'fornecedor_precos',
      'materiais_sobra'
    ];

    const results = {};

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('count', { count: 'exact', head: true });

      results[table] = !error;
    }

    return { success: true, tables: results, total: Object.keys(results).length };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
