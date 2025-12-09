/**
 * SISTEMA DE NOTIFICAÇÕES
 *
 * Este arquivo define os gatilhos e funções para envio de emails e WhatsApp.
 * As integrações reais (Resend, Twilio, etc.) serão implementadas posteriormente.
 *
 * Por enquanto, as funções apenas registram logs no console.
 */

import { Lead } from './supabase';

// ============================================
// INTERFACES
// ============================================

interface EmailData {
  to: string;
  subject: string;
  body: string;
  leadId?: string;
}

interface WhatsAppData {
  to: string; // Formato: +5511999999999
  message: string;
  leadId?: string;
}

// ============================================
// FUNÇÕES DE ENVIO (PLACEHOLDER)
// ============================================

/**
 * Envia email (a ser implementado com Resend, SendGrid, etc.)
 */
export async function sendEmail(data: EmailData): Promise<boolean> {
  console.log('📧 [EMAIL] Enviando email:', {
    to: data.to,
    subject: data.subject,
    leadId: data.leadId,
  });

  // TODO: Integrar com serviço de email
  // Exemplo com Resend:
  // const { data, error } = await resend.emails.send({
  //   from: 'Digitalizar Odonto <contato@digitalizarmkt.com.br>',
  //   to: data.to,
  //   subject: data.subject,
  //   html: data.body,
  // });

  return true;
}

/**
 * Envia WhatsApp (a ser implementado com Twilio, Evolution API, etc.)
 */
export async function sendWhatsApp(data: WhatsAppData): Promise<boolean> {
  console.log('💬 [WHATSAPP] Enviando mensagem:', {
    to: data.to,
    leadId: data.leadId,
  });

  // TODO: Integrar com serviço de WhatsApp
  // Exemplo com Evolution API:
  // await fetch('https://api.evolution.com/message/sendText', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     number: data.to,
  //     text: data.message,
  //   }),
  // });

  return true;
}

// ============================================
// GATILHOS POR STATUS DO LEAD
// ============================================

/**
 * GATILHO 1: Lead criado (novo)
 * Notifica admin sobre novo lead
 */
export async function notifyNewLead(lead: Lead): Promise<void> {
  console.log('🔔 GATILHO: Lead criado');

  // Email para admin
  await sendEmail({
    to: 'odonto@digitalizarmkt.com.br',
    subject: `🆕 Novo Lead: ${lead.briefing_data?.nome_consultorio || lead.nome}`,
    body: `
      <h2>Novo lead cadastrado!</h2>
      <p><strong>Nome:</strong> ${lead.nome}</p>
      <p><strong>Email:</strong> ${lead.email}</p>
      <p><strong>WhatsApp:</strong> ${lead.whatsapp}</p>
      <p><strong>Clínica:</strong> ${lead.briefing_data?.nome_consultorio || 'N/A'}</p>
      <p><a href="${process.env.VITE_APP_URL}/admin/lead/${lead.id}">Ver detalhes</a></p>
    `,
    leadId: lead.id,
  });
}

/**
 * GATILHO 2: Site pronto (aguardando_aprovacao)
 * Envia link do preview para o cliente aprovar
 */
export async function notifySiteReady(lead: Lead, previewUrl: string): Promise<void> {
  console.log('🔔 GATILHO: Site pronto para aprovação');

  // Email para cliente
  await sendEmail({
    to: lead.email,
    subject: `✨ Seu site está pronto! Confira e aprove`,
    body: `
      <h2>Olá, ${lead.nome}!</h2>
      <p>Temos ótimas notícias! Seu site está pronto e aguardando sua aprovação. 🎉</p>
      <p><a href="${previewUrl}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">👀 Ver Site</a></p>
      <p>Após visualizar, você terá 7 dias para aprovar ou solicitar ajustes.</p>
      <p><strong>Lembre-se:</strong> Só pagará se aprovar! Parcelamento em até 12x. 💳</p>
    `,
    leadId: lead.id,
  });

  // WhatsApp para cliente
  await sendWhatsApp({
    to: lead.whatsapp,
    message: `
🎉 *Seu site está pronto!*

Olá, ${lead.nome}!

Finalizamos seu site e ele está disponível para aprovação.

👀 *Confira aqui:* ${previewUrl}

✅ *Próximos passos:*
1. Visualize o site
2. Se gostar, aprove e pague (12x no cartão)
3. Solicite ajustes se necessário (até 2 rodadas grátis)

Qualquer dúvida, estou à disposição!

_Digitalizar Odonto_
    `.trim(),
    leadId: lead.id,
  });
}

/**
 * GATILHO 3: Pagamento confirmado (aprovado_pagamento)
 * Confirma pagamento e inicia rodada de ajustes
 */
export async function notifyPaymentConfirmed(lead: Lead): Promise<void> {
  console.log('🔔 GATILHO: Pagamento confirmado');

  // Email para cliente
  await sendEmail({
    to: lead.email,
    subject: `✅ Pagamento confirmado! Seu site está quase no ar`,
    body: `
      <h2>Pagamento confirmado! 🎉</h2>
      <p>Olá, ${lead.nome}!</p>
      <p>Seu pagamento foi confirmado com sucesso. Obrigado pela confiança!</p>
      <p><strong>Próximos passos:</strong></p>
      <ul>
        <li>Se desejar ajustes, nos informe (até 2 rodadas incluídas)</li>
        <li>Após aprovação final, seu site estará no ar em até 24h</li>
      </ul>
      <p>Qualquer dúvida, estamos à disposição.</p>
    `,
    leadId: lead.id,
  });

  // Email para admin
  await sendEmail({
    to: 'odonto@digitalizarmkt.com.br',
    subject: `💰 Pagamento confirmado: ${lead.briefing_data?.nome_consultorio || lead.nome}`,
    body: `
      <h2>Pagamento confirmado!</h2>
      <p><strong>Cliente:</strong> ${lead.nome}</p>
      <p><strong>Valor:</strong> R$ ${(lead.valor_total / 100).toFixed(2)}</p>
      <p>Cliente está pronto para solicitar ajustes ou aprovar final.</p>
      <p><a href="${process.env.VITE_APP_URL}/admin/lead/${lead.id}">Ver detalhes</a></p>
    `,
    leadId: lead.id,
  });
}

/**
 * GATILHO 4: Cliente solicitou ajustes (em_ajustes)
 * Notifica admin sobre nova rodada de ajustes
 */
export async function notifyAdjustmentsRequested(lead: Lead, rodada: number): Promise<void> {
  console.log('🔔 GATILHO: Ajustes solicitados');

  // Email para admin
  await sendEmail({
    to: 'odonto@digitalizarmkt.com.br',
    subject: `🔧 Ajustes solicitados (${rodada}/2): ${lead.briefing_data?.nome_consultorio || lead.nome}`,
    body: `
      <h2>Cliente solicitou ajustes - Rodada ${rodada}/2</h2>
      <p><strong>Cliente:</strong> ${lead.nome}</p>
      <p><strong>WhatsApp:</strong> ${lead.whatsapp}</p>
      ${rodada === 2 ? '<p style="color: orange;"><strong>⚠️ ATENÇÃO:</strong> Esta é a 2ª (última) rodada de ajustes incluída!</p>' : ''}
      <p>Entre em contato para entender os ajustes necessários.</p>
      <p><a href="${process.env.VITE_APP_URL}/admin/lead/${lead.id}">Ver detalhes</a></p>
    `,
    leadId: lead.id,
  });
}

/**
 * GATILHO 5: Aprovação final recebida (aprovacao_final)
 * Confirma que site será publicado em 24h
 */
export async function notifyFinalApproval(lead: Lead): Promise<void> {
  console.log('🔔 GATILHO: Aprovação final');

  // Email para cliente
  await sendEmail({
    to: lead.email,
    subject: `🚀 Seu site será publicado em 24h!`,
    body: `
      <h2>Aprovação final confirmada! 🎉</h2>
      <p>Olá, ${lead.nome}!</p>
      <p>Ótimas notícias! Você aprovou a versão final do seu site.</p>
      <p><strong>Seu site estará no ar em até 24 horas! 🚀</strong></p>
      <p>Você receberá uma nova mensagem assim que estiver publicado.</p>
      <p>Obrigado pela confiança!</p>
    `,
    leadId: lead.id,
  });

  // WhatsApp para cliente
  await sendWhatsApp({
    to: lead.whatsapp,
    message: `
🚀 *Seu site vai ao ar em 24h!*

Olá, ${lead.nome}!

Confirmamos a aprovação final do seu site! 🎉

⏰ *Publicação:* Até 24 horas
📱 Você receberá o link assim que estiver no ar

Obrigado pela confiança!

_Digitalizar Odonto_
    `.trim(),
    leadId: lead.id,
  });

  // Email para admin
  await sendEmail({
    to: 'odonto@digitalizarmkt.com.br',
    subject: `✨ Aprovação final: ${lead.briefing_data?.nome_consultorio || lead.nome}`,
    body: `
      <h2>Cliente aprovou versão final!</h2>
      <p><strong>Cliente:</strong> ${lead.nome}</p>
      <p><strong>⏰ PRAZO:</strong> Site deve estar no ar em 24h</p>
      <p>Providencie a publicação do site.</p>
      <p><a href="${process.env.VITE_APP_URL}/admin/lead/${lead.id}">Ver detalhes</a></p>
    `,
    leadId: lead.id,
  });
}

/**
 * GATILHO 6: Site publicado (no_ar)
 * Envia link final do site para o cliente
 */
export async function notifySitePublished(lead: Lead, siteUrl: string): Promise<void> {
  console.log('🔔 GATILHO: Site publicado');

  // Email para cliente
  await sendEmail({
    to: lead.email,
    subject: `🎉 Seu site está no ar!`,
    body: `
      <h2>Parabéns! Seu site está no ar! 🎉</h2>
      <p>Olá, ${lead.nome}!</p>
      <p>É com grande satisfação que informamos: seu site está oficialmente publicado e acessível!</p>
      <p><a href="${siteUrl}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">🌐 Acessar Meu Site</a></p>
      <p><strong>Próximos passos:</strong></p>
      <ul>
        <li>Compartilhe seu novo site nas redes sociais</li>
        <li>Atualize seus perfis com o novo link</li>
        <li>Monitore suas conversões no Google Analytics</li>
      </ul>
      <p>Obrigado por confiar na Digitalizar Odonto!</p>
    `,
    leadId: lead.id,
  });

  // WhatsApp para cliente
  await sendWhatsApp({
    to: lead.whatsapp,
    message: `
🎉 *SEU SITE ESTÁ NO AR!*

Olá, ${lead.nome}!

Parabéns! Seu site profissional está oficialmente publicado! 🚀

🌐 *Acesse aqui:* ${siteUrl}

Agora é hora de divulgar e começar a receber novos pacientes!

Sucesso na sua jornada digital! 💪

_Digitalizar Odonto_
    `.trim(),
    leadId: lead.id,
  });
}

// ============================================
// FUNÇÃO AUXILIAR PARA CHAMAR GATILHOS
// ============================================

/**
 * Chama o gatilho correto baseado no status do lead
 * Usar após updateLeadStatus() no webhook ou admin
 */
export async function triggerNotificationByStatus(
  lead: Lead,
  additionalData?: {
    previewUrl?: string;
    siteUrl?: string;
    rodada?: number;
  }
): Promise<void> {
  switch (lead.status) {
    case 'novo':
      await notifyNewLead(lead);
      break;

    case 'aguardando_aprovacao':
      if (additionalData?.previewUrl) {
        await notifySiteReady(lead, additionalData.previewUrl);
      }
      break;

    case 'aprovado_pagamento':
      await notifyPaymentConfirmed(lead);
      break;

    case 'em_ajustes':
      await notifyAdjustmentsRequested(lead, additionalData?.rodada || 1);
      break;

    case 'aprovacao_final':
      await notifyFinalApproval(lead);
      break;

    case 'no_ar':
      if (additionalData?.siteUrl) {
        await notifySitePublished(lead, additionalData.siteUrl);
      }
      break;

    default:
      console.log(`ℹ️ Sem gatilho configurado para status: ${lead.status}`);
  }
}

// Exportar tipos
export type { EmailData, WhatsAppData };
