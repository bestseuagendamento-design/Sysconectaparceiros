// Email service usando Resend
// Para configurar: https://resend.com/

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(data: EmailData) {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  
  if (!RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY não configurada - Email não será enviado');
    console.log('📋 Dados do email (modo simulação):', {
      to: data.to,
      subject: data.subject,
      preview: 'Email HTML pronto para envio'
    });
    // Retorna sucesso simulado para não quebrar o fluxo
    return {
      success: true,
      message: 'Modo simulação - Email não enviado (configure RESEND_API_KEY para enviar)',
      simulated: true
    };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SysConecta <onboarding@resend.dev>',
        to: data.to,
        subject: data.subject,
        html: data.html,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro ao enviar email:', errorText);

      // 🔥 AUTO-FIX: Tratamento para limitação de plano gratuito (apenas email do dono)
      if (response.status === 403 && errorText.includes("only send testing emails to your own email address")) {
        console.warn('⚠️ Detectado bloqueio de teste do Resend. Redirecionando para o email do administrador...');
        
        // Extrair o email permitido da mensagem de erro se possível, ou usar um hardcoded seguro
        // Mensagem típica: "... to your own email address (leandrozaraa@gmail.com)..."
        const match = errorText.match(/\(([^)]+@\S+)\)/);
        const adminEmail = match ? match[1] : 'leandrozaraa@gmail.com';

        if (adminEmail) {
           console.log(`🔄 Reenviando para ${adminEmail} (Modo Debug)...`);
           
           const retryResponse = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: 'SysConecta <onboarding@resend.dev>',
                to: adminEmail,
                subject: `[MODO TESTE] Para: ${data.to} | ${data.subject}`,
                html: `<div style="background:#fff3cd; padding:10px; border:1px solid #ffeeba; color:#856404; margin-bottom:20px; font-family:sans-serif;">
                        <strong>⚠️ MODO TESTE ATIVO</strong><br/>
                        Este email foi redirecionado porque sua conta Resend é gratuita e só permite envios para o proprietário.<br/>
                        <strong>Destinatário Original:</strong> ${data.to}
                       </div>
                       <hr style="border:0; border-top:1px solid #eee; margin:20px 0;">
                       ${data.html}`,
              }),
           });

           if (retryResponse.ok) {
              const retryResult = await retryResponse.json();
              console.log('✅ Email redirecionado enviado com sucesso!');
              return {
                 success: true,
                 data: retryResult,
                 message: `Email redirecionado para ${adminEmail} (Modo Teste)`,
                 redirected: true
              };
           }
        }
      }

      // Não quebra o fluxo, apenas loga o erro
      return {
        success: false,
        error: errorText,
        message: 'Erro ao enviar email via Resend'
      };
    }

    const result = await response.json();
    console.log('✅ Email enviado com sucesso via Resend!', result);
    
    return {
      success: true,
      data: result,
      message: 'Email enviado com sucesso'
    };
  } catch (error) {
    console.error('❌ Erro crítico ao enviar email:', error);
    return {
      success: false,
      error: error.message,
      message: 'Erro crítico ao enviar email'
    };
  }
}

// ========================================
// COMPONENTES REUTILIZÁVEIS DE EMAIL
// ========================================

function getEmailHeader() {
  return `
    <!-- Header Dourado -->
    <tr>
      <td style="background: linear-gradient(90deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%); padding: 2px;"></td>
    </tr>
    
    <!-- Logo e Título -->
    <tr>
      <td style="padding: 60px 40px 40px; text-align: center;">
        
        <!-- Logo -->
        <div style="margin-bottom: 30px;">
          <svg width="80" height="80" viewBox="0 0 100 100" style="display: inline-block;">
            <defs>
              <linearGradient id="hexGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#FFD700" />
                <stop offset="50%" style="stop-color:#D4AF37" />
                <stop offset="100%" style="stop-color:#B8860B" />
              </linearGradient>
            </defs>
            <polygon points="50,2 95,27.5 95,72.5 50,98 5,72.5 5,27.5" fill="none" stroke="url(#hexGold)" stroke-width="3" />
            <polygon points="50,15 82,32.5 82,67.5 50,85 18,67.5 18,32.5" fill="url(#hexGold)" opacity="0.3" />
          </svg>
        </div>
        
        <!-- Título -->
        <h1 style="margin: 0 0 10px; font-size: 48px; font-weight: 900; background: linear-gradient(90deg, #FFD700 0%, #D4AF37 50%, #B8860B 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          SysConecta 2026
        </h1>
        
        <!-- Subtítulo -->
        <p style="margin: 0; font-size: 12px; letter-spacing: 3px; color: #9CA3AF; text-transform: uppercase;">
          SYSVIDRO | SYSCONSTRUÇÃO
        </p>
      </td>
    </tr>
  `;
}

function getEmailFooter(empresa?: string) {
  return `
    <!-- Footer -->
    <tr>
      <td style="padding: 40px; background: rgba(0, 0, 0, 0.3); text-align: center; border-top: 1px solid #374151;">
        ${empresa ? `
          <p style="margin: 0 0 10px; font-size: 14px; color: #9CA3AF;">
            <strong style="color: #D4AF37;">${empresa}</strong>
          </p>
        ` : ''}
        <p style="margin: 0 0 20px; font-size: 12px; color: #6B7280;">
          Você está recebendo este email do SysConecta 2026.
        </p>
        <p style="margin: 0; font-size: 12px; color: #4B5563;">
          © 2026 SysConecta - Todos os direitos reservados<br>
          SYSVIDRO | SYSCONSTRUÇÃO
        </p>
      </td>
    </tr>
  `;
}

function getEmailContainer(content: string) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0A0A0A;">
  
  <!-- Container Principal -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0A0A; padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <!-- Card Principal -->
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1A1A1A 0%, #0F0F0F 100%); border: 1px solid #D4AF37; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(212, 175, 55, 0.3);">
          ${content}
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
  `;
}

// ========================================
// TEMPLATES DE EMAIL
// ========================================

// Template de email de boas-vindas VIP
export function getWelcomeEmailTemplate(nome: string, empresa: string) {
  const content = `
    ${getEmailHeader()}
    
    <!-- Badge VIP -->
    <tr>
      <td style="padding: 0 40px 40px; text-align: center;">
        <div style="display: inline-block; background: linear-gradient(90deg, #D4AF37 0%, #FFD700 100%); padding: 8px 24px; border-radius: 50px;">
          <span style="font-size: 14px; font-weight: 700; color: #000; letter-spacing: 2px;">✨ MEMBRO VIP ✨</span>
        </div>
      </td>
    </tr>
    
    <!-- Conteúdo -->
    <tr>
      <td style="padding: 0 40px 40px;">
        
        <!-- Saudação -->
        <h2 style="margin: 0 0 20px; font-size: 28px; font-weight: 700; color: #FFFFFF; text-align: center;">
          🎉 Parabéns, ${nome}!
        </h2>
        
        <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #D1D5DB; text-align: center;">
          Você agora faz parte do grupo <strong style="color: #D4AF37;">seleto de pioneiros VIP</strong> do SysConecta 2026. Seja muito bem-vindo(a) à revolução da construção civil!
        </p>
        
        <!-- Linha divisória -->
        <div style="height: 1px; background: linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%); margin: 40px 0;"></div>
        
        <!-- O que o SysConecta faz -->
        <h3 style="margin: 0 0 20px; font-size: 22px; font-weight: 700; color: #D4AF37; text-align: center;">
          🚀 O que o SysConecta vai fazer por você:
        </h3>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
          <tr>
            <td style="padding: 20px; background: rgba(212, 175, 55, 0.05); border-left: 3px solid #D4AF37; border-radius: 8px;">
              <p style="margin: 0 0 5px; font-size: 16px; font-weight: 700; color: #D4AF37;">
                ⚡ Orçamentos Instantâneos
              </p>
              <p style="margin: 0; font-size: 14px; color: #9CA3AF; line-height: 1.5;">
                Crie orçamentos técnicos completos com desenho CAD 2D integrado em minutos, não em horas.
              </p>
            </td>
          </tr>
        </table>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
          <tr>
            <td style="padding: 20px; background: rgba(212, 175, 55, 0.05); border-left: 3px solid #D4AF37; border-radius: 8px;">
              <p style="margin: 0 0 5px; font-size: 16px; font-weight: 700; color: #D4AF37;">
                💰 Economia Garantida
              </p>
              <p style="margin: 0; font-size: 14px; color: #9CA3AF; line-height: 1.5;">
                Compre materiais com preços negociados diretamente com fornecedores homologados. Até 30% de economia.
              </p>
            </td>
          </tr>
        </table>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
          <tr>
            <td style="padding: 20px; background: rgba(212, 175, 55, 0.05); border-left: 3px solid #D4AF37; border-radius: 8px;">
              <p style="margin: 0 0 5px; font-size: 16px; font-weight: 700; color: #D4AF37;">
                📦 Aproveitamento Inteligente
              </p>
              <p style="margin: 0; font-size: 14px; color: #9CA3AF; line-height: 1.5;">
                Sistema automático de aproveitamento de chapas 3400x2400mm. Zero desperdício, máximo lucro.
              </p>
            </td>
          </tr>
        </table>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
          <tr>
            <td style="padding: 20px; background: rgba(212, 175, 55, 0.05); border-left: 3px solid #D4AF37; border-radius: 8px;">
              <p style="margin: 0 0 5px; font-size: 16px; font-weight: 700; color: #D4AF37;">
                🚚 Rastreamento em Tempo Real
              </p>
              <p style="margin: 0; font-size: 14px; color: #9CA3AF; line-height: 1.5;">
                Acompanhe pedidos, produções e entregas em tempo real com GPS integrado.
              </p>
            </td>
          </tr>
        </table>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
          <tr>
            <td style="padding: 20px; background: rgba(212, 175, 55, 0.05); border-left: 3px solid #D4AF37; border-radius: 8px;">
              <p style="margin: 0 0 5px; font-size: 16px; font-weight: 700; color: #D4AF37;">
                🌍 Operação Global
              </p>
              <p style="margin: 0; font-size: 14px; color: #9CA3AF; line-height: 1.5;">
                Plataforma preparada para expansão em 25+ países. Multi-idioma e multi-moeda nativos.
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Linha divisória -->
        <div style="height: 1px; background: linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%); margin: 40px 0;"></div>
        
        <!-- Stats -->
        <h3 style="margin: 0 0 20px; font-size: 22px; font-weight: 700; color: #D4AF37; text-align: center;">
          📊 Números que impressionam:
        </h3>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 40px;">
          <tr>
            <td width="33%" align="center" style="padding: 20px;">
              <p style="margin: 0 0 5px; font-size: 36px; font-weight: 900; color: #D4AF37;">25+</p>
              <p style="margin: 0; font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 1px;">Países</p>
            </td>
            <td width="33%" align="center" style="padding: 20px; border-left: 1px solid #374151; border-right: 1px solid #374151;">
              <p style="margin: 0 0 5px; font-size: 36px; font-weight: 900; color: #D4AF37;">10K+</p>
              <p style="margin: 0; font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 1px;">Usuários</p>
            </td>
            <td width="33%" align="center" style="padding: 20px;">
              <p style="margin: 0 0 5px; font-size: 36px; font-weight: 900; color: #D4AF37;">R$1B+</p>
              <p style="margin: 0; font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 1px;">Volume</p>
            </td>
          </tr>
        </table>
        
        <!-- CTA -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <p style="margin: 0; font-size: 16px; color: #D1D5DB;">
                <strong style="color: #FFFFFF;">Próximos passos:</strong> Nossa equipe entrará em contato em breve com seus <span style="color: #D4AF37;">benefícios exclusivos VIP</span>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    ${getEmailFooter(empresa)}
  `;
  
  return getEmailContainer(content);
}

// Template de recuperação de senha
export function getPasswordResetEmailTemplate(nome: string, resetCode: string) {
  const content = `
    ${getEmailHeader()}
    
    <!-- Conteúdo -->
    <tr>
      <td style="padding: 40px;">
        
        <!-- Título -->
        <h2 style="margin: 0 0 20px; font-size: 28px; font-weight: 700; color: #FFFFFF; text-align: center;">
          🔐 Recuperação de Senha
        </h2>
        
        <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #D1D5DB; text-align: center;">
          Olá, <strong style="color: #D4AF37;">${nome}</strong>! Recebemos uma solicitação para redefinir sua senha.
        </p>
        
        <!-- Código de Verificação -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
          <tr>
            <td align="center" style="padding: 30px; background: rgba(212, 175, 55, 0.1); border: 2px dashed #D4AF37; border-radius: 12px;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 2px;">
                Seu código de verificação
              </p>
              <p style="margin: 0; font-size: 48px; font-weight: 900; color: #D4AF37; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                ${resetCode}
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Instruções -->
        <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #9CA3AF; text-align: center;">
          Insira este código na tela de recuperação de senha para criar uma nova senha.
        </p>
        
        <p style="margin: 0 0 30px; font-size: 14px; line-height: 1.6; color: #9CA3AF; text-align: center;">
          ⏰ Este código expira em <strong style="color: #D4AF37;">15 minutos</strong>.
        </p>
        
        <!-- Linha divisória -->
        <div style="height: 1px; background: linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%); margin: 30px 0;"></div>
        
        <!-- Aviso de segurança -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 20px; background: rgba(239, 68, 68, 0.1); border-left: 3px solid #EF4444; border-radius: 8px;">
              <p style="margin: 0 0 10px; font-size: 14px; font-weight: 700; color: #EF4444;">
                ⚠️ Importante!
              </p>
              <p style="margin: 0; font-size: 13px; color: #9CA3AF; line-height: 1.5;">
                Se você não solicitou a recuperação de senha, ignore este email. Sua conta permanecerá segura.
              </p>
            </td>
          </tr>
        </table>
        
      </td>
    </tr>
    
    ${getEmailFooter()}
  `;
  
  return getEmailContainer(content);
}

// Template de confirmação de cadastro
export function getSignupConfirmationEmailTemplate(nome: string, empresa: string, perfil: string) {
  const perfilEmoji = perfil === 'fornecedor' ? '🏭' : perfil === 'cliente' ? '🏗️' : '⚙️';
  const perfilNome = perfil === 'fornecedor' ? 'Fornecedor' : perfil === 'cliente' ? 'Cliente' : 'Produção';
  
  const content = `
    ${getEmailHeader()}
    
    <!-- Badge Perfil -->
    <tr>
      <td style="padding: 0 40px 40px; text-align: center;">
        <div style="display: inline-block; background: linear-gradient(90deg, #D4AF37 0%, #FFD700 100%); padding: 8px 24px; border-radius: 50px;">
          <span style="font-size: 14px; font-weight: 700; color: #000; letter-spacing: 2px;">${perfilEmoji} ${perfilNome.toUpperCase()} ${perfilEmoji}</span>
        </div>
      </td>
    </tr>
    
    <!-- Conteúdo -->
    <tr>
      <td style="padding: 0 40px 40px;">
        
        <!-- Título -->
        <h2 style="margin: 0 0 20px; font-size: 28px; font-weight: 700; color: #FFFFFF; text-align: center;">
          🎉 Cadastro Realizado com Sucesso!
        </h2>
        
        <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #D1D5DB; text-align: center;">
          Parabéns, <strong style="color: #D4AF37;">${nome}</strong>! Sua conta foi criada e você já pode começar a usar o SysConecta 2026.
        </p>
        
        <!-- Informações da Conta -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
          <tr>
            <td style="padding: 25px; background: rgba(212, 175, 55, 0.05); border: 1px solid #D4AF37; border-radius: 12px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 10px 0;">
                    <p style="margin: 0; font-size: 13px; color: #6B7280; text-transform: uppercase; letter-spacing: 1px;">Nome</p>
                    <p style="margin: 5px 0 0; font-size: 16px; color: #FFFFFF; font-weight: 600;">${nome}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-top: 1px solid #374151;">
                    <p style="margin: 0; font-size: 13px; color: #6B7280; text-transform: uppercase; letter-spacing: 1px;">Empresa</p>
                    <p style="margin: 5px 0 0; font-size: 16px; color: #FFFFFF; font-weight: 600;">${empresa}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-top: 1px solid #374151;">
                    <p style="margin: 0; font-size: 13px; color: #6B7280; text-transform: uppercase; letter-spacing: 1px;">Perfil</p>
                    <p style="margin: 5px 0 0; font-size: 16px; color: #D4AF37; font-weight: 600;">${perfilEmoji} ${perfilNome}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Linha divisória -->
        <div style="height: 1px; background: linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%); margin: 30px 0;"></div>
        
        <!-- Próximos Passos -->
        <h3 style="margin: 0 0 20px; font-size: 20px; font-weight: 700; color: #D4AF37; text-align: center;">
          🚀 Próximos Passos
        </h3>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
          <tr>
            <td style="padding: 15px; background: rgba(212, 175, 55, 0.05); border-left: 3px solid #D4AF37; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #D1D5DB; line-height: 1.5;">
                <strong style="color: #D4AF37;">1.</strong> Faça login com suas credenciais
              </p>
            </td>
          </tr>
        </table>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
          <tr>
            <td style="padding: 15px; background: rgba(212, 175, 55, 0.05); border-left: 3px solid #D4AF37; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #D1D5DB; line-height: 1.5;">
                <strong style="color: #D4AF37;">2.</strong> Complete seu perfil com informações adicionais
              </p>
            </td>
          </tr>
        </table>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
          <tr>
            <td style="padding: 15px; background: rgba(212, 175, 55, 0.05); border-left: 3px solid #D4AF37; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #D1D5DB; line-height: 1.5;">
                <strong style="color: #D4AF37;">3.</strong> Explore o dashboard e descubra todos os recursos
              </p>
            </td>
          </tr>
        </table>
        
        <!-- CTA -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #9CA3AF;">
                Dúvidas? Nossa equipe está pronta para ajudar!
              </p>
            </td>
          </tr>
        </table>
        
      </td>
    </tr>
    
    ${getEmailFooter(empresa)}
  `;
  
  return getEmailContainer(content);
}

// Template genérico de notificação
export function getNotificationEmailTemplate(
  titulo: string, 
  mensagem: string, 
  destacar?: string,
  buttonText?: string,
  buttonUrl?: string
) {
  const content = `
    ${getEmailHeader()}
    
    <!-- Conteúdo -->
    <tr>
      <td style="padding: 40px;">
        
        <!-- Título -->
        <h2 style="margin: 0 0 20px; font-size: 28px; font-weight: 700; color: #FFFFFF; text-align: center;">
          ${titulo}
        </h2>
        
        <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #D1D5DB; text-align: center;">
          ${mensagem}
        </p>
        
        ${destacar ? `
        <!-- Destaque -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
          <tr>
            <td align="center" style="padding: 25px; background: rgba(212, 175, 55, 0.1); border: 2px solid #D4AF37; border-radius: 12px;">
              <p style="margin: 0; font-size: 18px; color: #D4AF37; font-weight: 600; line-height: 1.5;">
                ${destacar}
              </p>
            </td>
          </tr>
        </table>
        ` : ''}
        
        ${buttonText && buttonUrl ? `
        <!-- Botão CTA -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
          <tr>
            <td align="center">
              <a href="${buttonUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(90deg, #D4AF37 0%, #FFD700 100%); color: #000; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 700; letter-spacing: 1px;">
                ${buttonText}
              </a>
            </td>
          </tr>
        </table>
        ` : ''}
        
      </td>
    </tr>
    
    ${getEmailFooter()}
  `;
  
  return getEmailContainer(content);
}

// 🏭 Template de código de verificação para fornecedor
export function getSupplierVerificationCodeEmailTemplate(
  nomeEmpresa: string,
  nomeResponsavel: string,
  codigoVerificacao: string,
  estado: string
) {
  const content = `
    ${getEmailHeader()}
    
    <!-- Badge Fornecedor -->
    <tr>
      <td style="padding: 0 40px 40px; text-align: center;">
        <div style="display: inline-block; background: linear-gradient(90deg, #D4AF37 0%, #FFD700 100%); padding: 8px 24px; border-radius: 50px;">
          <span style="font-size: 14px; font-weight: 700; color: #000; letter-spacing: 2px;">🏭 FORNECEDOR EXCLUSIVO - ${estado} 🏭</span>
        </div>
      </td>
    </tr>
    
    <!-- Conteúdo -->
    <tr>
      <td style="padding: 0 40px 40px;">
        
        <!-- Título -->
        <h2 style="margin: 0 0 20px; font-size: 32px; font-weight: 900; color: #FFFFFF; text-align: center;">
          🔐 Código de Acesso
        </h2>
        
        <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #D1D5DB; text-align: center;">
          Olá, <strong style="color: #D4AF37;">${nomeResponsavel}</strong>!<br>
          Bem-vindo(a) ao <strong style="color: #FFD700;">SysConecta 2026</strong>.
        </p>
        
        <p style="margin: 0 0 40px; font-size: 14px; line-height: 1.6; color: #9CA3AF; text-align: center;">
          A <strong style="color: #D4AF37;">${nomeEmpresa}</strong> foi selecionada como <strong style="color: #FFD700;">fornecedor exclusivo</strong> do estado de <strong style="color: #D4AF37;">${estado}</strong>.
        </p>
        
        <!-- Código de Verificação -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 40px;">
          <tr>
            <td align="center" style="padding: 40px 30px; background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(255, 215, 0, 0.1) 100%); border: 3px solid #D4AF37; border-radius: 16px; box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);">
              <p style="margin: 0 0 15px; font-size: 14px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 3px; font-weight: 600;">
                SEU CÓDIGO DE VERIFICAÇÃO
              </p>
              <p style="margin: 0; font-size: 64px; font-weight: 900; color: #FFD700; letter-spacing: 12px; font-family: 'Courier New', monospace; text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);">
                ${codigoVerificacao}
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Linha divisória -->
        <div style="height: 1px; background: linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%); margin: 40px 0;"></div>
        
        <!-- Instruções -->
        <h3 style="margin: 0 0 20px; font-size: 20px; font-weight: 700; color: #D4AF37; text-align: center;">
          📋 Como usar este código:
        </h3>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
          <tr>
            <td style="padding: 18px; background: rgba(212, 175, 55, 0.05); border-left: 3px solid #D4AF37; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #D1D5DB; line-height: 1.6;">
                <strong style="color: #D4AF37;">1.</strong> Acesse a plataforma SysConecta 2026
              </p>
            </td>
          </tr>
        </table>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
          <tr>
            <td style="padding: 18px; background: rgba(212, 175, 55, 0.05); border-left: 3px solid #D4AF37; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #D1D5DB; line-height: 1.6;">
                <strong style="color: #D4AF37;">2.</strong> Selecione <strong>"Fornecedor de Vidros"</strong>
              </p>
            </td>
          </tr>
        </table>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
          <tr>
            <td style="padding: 18px; background: rgba(212, 175, 55, 0.05); border-left: 3px solid #D4AF37; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #D1D5DB; line-height: 1.6;">
                <strong style="color: #D4AF37;">3.</strong> Escolha o estado <strong>${estado}</strong>
              </p>
            </td>
          </tr>
        </table>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
          <tr>
            <td style="padding: 18px; background: rgba(212, 175, 55, 0.05); border-left: 3px solid #D4AF37; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #D1D5DB; line-height: 1.6;">
                <strong style="color: #D4AF37;">4.</strong> Insira o código de 6 dígitos acima
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Tempo de validade -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
          <tr>
            <td align="center" style="padding: 20px; background: rgba(255, 215, 0, 0.05); border: 2px dashed #D4AF37; border-radius: 12px;">
              <p style="margin: 0; font-size: 14px; color: #D1D5DB;">
                ⏰ Este código é válido por <strong style="color: #FFD700;">30 minutos</strong>
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Linha divisória -->
        <div style="height: 1px; background: linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%); margin: 40px 0;"></div>
        
        <!-- Benefícios exclusivos -->
        <h3 style="margin: 0 0 20px; font-size: 22px; font-weight: 700; color: #D4AF37; text-align: center;">
          ✨ Benefícios Exclusivos para Fornecedores:
        </h3>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
          <tr>
            <td style="padding: 20px; background: rgba(212, 175, 55, 0.05); border-left: 3px solid #D4AF37; border-radius: 8px;">
              <p style="margin: 0 0 5px; font-size: 16px; font-weight: 700; color: #D4AF37;">
                🏆 Exclusividade Territorial
              </p>
              <p style="margin: 0; font-size: 14px; color: #9CA3AF; line-height: 1.5;">
                Você é o ÚNICO fornecedor de vidros do estado de ${estado} na plataforma.
              </p>
            </td>
          </tr>
        </table>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
          <tr>
            <td style="padding: 20px; background: rgba(212, 175, 55, 0.05); border-left: 3px solid #D4AF37; border-radius: 8px;">
              <p style="margin: 0 0 5px; font-size: 16px; font-weight: 700; color: #D4AF37;">
                📊 Dashboard Analytics
              </p>
              <p style="margin: 0; font-size: 14px; color: #9CA3AF; line-height: 1.5;">
                Acompanhe pedidos, estoque, demanda e produções em tempo real.
              </p>
            </td>
          </tr>
        </table>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
          <tr>
            <td style="padding: 20px; background: rgba(212, 175, 55, 0.05); border-left: 3px solid #D4AF37; border-radius: 8px;">
              <p style="margin: 0 0 5px; font-size: 16px; font-weight: 700; color: #D4AF37;">
                💰 ROI Maximizado
              </p>
              <p style="margin: 0; font-size: 14px; color: #9CA3AF; line-height: 1.5;">
                Sem concorrência direta. Todos os clientes da região são seus!
              </p>
            </td>
          </tr>
        </table>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
          <tr>
            <td style="padding: 20px; background: rgba(212, 175, 55, 0.05); border-left: 3px solid #D4AF37; border-radius: 8px;">
              <p style="margin: 0 0 5px; font-size: 16px; font-weight: 700; color: #D4AF37;">
                📦 Aproveitamento de Chapas
              </p>
              <p style="margin: 0; font-size: 14px; color: #9CA3AF; line-height: 1.5;">
                Sistema inteligente de otimização de chapas 3400x2400mm. Zero desperdício!
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Linha divisória -->
        <div style="height: 1px; background: linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%); margin: 40px 0;"></div>
        
        <!-- Aviso de segurança -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 20px; background: rgba(239, 68, 68, 0.1); border-left: 3px solid #EF4444; border-radius: 8px;">
              <p style="margin: 0 0 10px; font-size: 14px; font-weight: 700; color: #EF4444;">
                ⚠️ Importante!
              </p>
              <p style="margin: 0; font-size: 13px; color: #9CA3AF; line-height: 1.5;">
                Este código é confidencial e pessoal. Não compartilhe com terceiros. Se você não solicitou este acesso, entre em contato imediatamente.
              </p>
            </td>
          </tr>
        </table>
        
      </td>
    </tr>
    
    ${getEmailFooter(nomeEmpresa)}
  `;
  
  return getEmailContainer(content);
}