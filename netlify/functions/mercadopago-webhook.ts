/**
 * Mercado Pago Webhook Handler
 *
 * Processa notificações do Mercado Pago e atualiza status dos leads
 *
 * Eventos processados:
 * - payment.created: Pagamento criado
 * - payment.updated: Pagamento atualizado (aprovado, rejeitado, etc)
 */

import { Handler, HandlerEvent } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// Supabase setup (backend)
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mercado Pago config
const MERCADOPAGO_ACCESS_TOKEN = process.env.VITE_MERCADOPAGO_ACCESS_TOKEN || '';
const MERCADOPAGO_API_URL = 'https://api.mercadopago.com';

interface MercadoPagoWebhookPayload {
  id: number;
  live_mode: boolean;
  type: string; // "payment" ou "merchant_order"
  date_created: string;
  user_id: number;
  api_version: string;
  action: string; // "payment.created", "payment.updated"
  data: {
    id: string; // ID do pagamento ou order
  };
}

interface MercadoPagoPayment {
  id: number;
  status: string; // "approved", "pending", "rejected", "refunded", "cancelled"
  status_detail: string;
  external_reference?: string;
  transaction_amount: number;
  installments?: number;
  payment_method_id?: string;
  date_approved?: string;
  date_created: string;
  payer?: {
    email?: string;
    identification?: {
      type?: string;
      number?: string;
    };
  };
}

/**
 * Busca informações do pagamento na API do Mercado Pago
 */
async function getMercadoPagoPayment(paymentId: string): Promise<MercadoPagoPayment | null> {
  try {
    const response = await fetch(`${MERCADOPAGO_API_URL}/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
      },
    });

    if (!response.ok) {
      console.error('❌ Erro ao buscar pagamento MP:', response.status);
      return null;
    }

    const payment: MercadoPagoPayment = await response.json();
    return payment;
  } catch (error) {
    console.error('❌ Erro ao buscar pagamento MP:', error);
    return null;
  }
}

/**
 * Processa pagamento aprovado
 */
async function handlePaymentApproved(payment: MercadoPagoPayment) {
  const leadId = payment.external_reference;

  if (!leadId) {
    console.error('❌ Pagamento sem external_reference:', payment.id);
    return;
  }

  console.log('✅ Pagamento aprovado para lead:', leadId);

  // Buscar lead no banco
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single();

  if (leadError || !lead) {
    console.error('❌ Lead não encontrado:', leadId);
    return;
  }

  // Registrar pagamento na tabela payments
  const { error: paymentError } = await supabase
    .from('payments')
    .insert({
      lead_id: leadId,
      amount: payment.transaction_amount * 100, // Converter para centavos
      currency: 'BRL',
      status: 'succeeded',
      payment_method: payment.payment_method_id || 'mercadopago',
      mercadopago_payment_id: payment.id.toString(),
      metadata: {
        installments: payment.installments,
        status_detail: payment.status_detail,
        payer_email: payment.payer?.email,
      },
      created_at: new Date().toISOString(),
    });

  if (paymentError) {
    console.error('❌ Erro ao registrar pagamento:', paymentError);
  }

  // Atualizar status do lead para "aprovado_pagamento"
  const { error: updateError } = await supabase
    .from('leads')
    .update({
      status: 'aprovado_pagamento',
      mercadopago_payment_id: payment.id.toString(),
      data_aprovacao_inicial: payment.date_approved || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', leadId);

  if (updateError) {
    console.error('❌ Erro ao atualizar status do lead:', updateError);
    return;
  }

  // Registrar no histórico
  await supabase.from('lead_status_history').insert({
    lead_id: leadId,
    status: 'aprovado_pagamento',
    changed_by: 'system',
    notes: `Pagamento aprovado via Mercado Pago (${payment.installments}x de R$ ${(payment.transaction_amount / (payment.installments || 1)).toFixed(2)})`,
    created_at: new Date().toISOString(),
  });

  console.log('✅ Lead atualizado para "aprovado_pagamento"');

  // TODO: Enviar email de confirmação para cliente e admin
  // await notifyPaymentConfirmed(lead);
}

/**
 * Processa pagamento pendente
 */
async function handlePaymentPending(payment: MercadoPagoPayment) {
  const leadId = payment.external_reference;

  if (!leadId) {
    console.error('❌ Pagamento sem external_reference:', payment.id);
    return;
  }

  console.log('⏳ Pagamento pendente para lead:', leadId);

  // Registrar pagamento como pendente
  await supabase.from('payments').insert({
    lead_id: leadId,
    amount: payment.transaction_amount * 100,
    currency: 'BRL',
    status: 'pending',
    payment_method: payment.payment_method_id || 'mercadopago',
    mercadopago_payment_id: payment.id.toString(),
    metadata: {
      status_detail: payment.status_detail,
    },
    created_at: new Date().toISOString(),
  });

  console.log('✅ Pagamento registrado como pendente');
}

/**
 * Processa pagamento rejeitado
 */
async function handlePaymentRejected(payment: MercadoPagoPayment) {
  const leadId = payment.external_reference;

  if (!leadId) {
    console.error('❌ Pagamento sem external_reference:', payment.id);
    return;
  }

  console.log('❌ Pagamento rejeitado para lead:', leadId);

  // Registrar pagamento como falho
  await supabase.from('payments').insert({
    lead_id: leadId,
    amount: payment.transaction_amount * 100,
    currency: 'BRL',
    status: 'failed',
    payment_method: payment.payment_method_id || 'mercadopago',
    mercadopago_payment_id: payment.id.toString(),
    metadata: {
      status_detail: payment.status_detail,
    },
    created_at: new Date().toISOString(),
  });

  console.log('✅ Pagamento registrado como falho');

  // TODO: Notificar admin sobre pagamento rejeitado
}

/**
 * Processa pagamento reembolsado
 */
async function handlePaymentRefunded(payment: MercadoPagoPayment) {
  const leadId = payment.external_reference;

  if (!leadId) {
    console.error('❌ Pagamento sem external_reference:', payment.id);
    return;
  }

  console.log('🔄 Pagamento reembolsado para lead:', leadId);

  // Registrar reembolso
  await supabase.from('payments').insert({
    lead_id: leadId,
    amount: -(payment.transaction_amount * 100), // Negativo para indicar reembolso
    currency: 'BRL',
    status: 'refunded',
    payment_method: payment.payment_method_id || 'mercadopago',
    mercadopago_payment_id: payment.id.toString(),
    metadata: {
      status_detail: payment.status_detail,
    },
    created_at: new Date().toISOString(),
  });

  // Voltar lead para "aguardando_aprovacao"
  await supabase
    .from('leads')
    .update({
      status: 'aguardando_aprovacao',
      updated_at: new Date().toISOString(),
    })
    .eq('id', leadId);

  console.log('✅ Lead voltado para "aguardando_aprovacao"');
}

/**
 * Handler principal do webhook
 */
export const handler: Handler = async (event: HandlerEvent) => {
  console.log('🔔 Webhook Mercado Pago recebido');

  // Apenas aceitar POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const payload: MercadoPagoWebhookPayload = JSON.parse(event.body || '{}');

    console.log('📦 Tipo de notificação:', payload.type);
    console.log('🔄 Ação:', payload.action);
    console.log('🆔 Data ID:', payload.data?.id);

    // Ignorar notificações que não são de pagamento
    if (payload.type !== 'payment') {
      console.log('⏭️ Ignorando notificação não relacionada a pagamento');
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Notification ignored' }),
      };
    }

    // Buscar detalhes do pagamento
    const payment = await getMercadoPagoPayment(payload.data.id);

    if (!payment) {
      console.error('❌ Não foi possível buscar dados do pagamento');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to fetch payment' }),
      };
    }

    console.log('💳 Status do pagamento:', payment.status);
    console.log('📄 External Reference (Lead ID):', payment.external_reference);

    // Processar conforme status
    switch (payment.status) {
      case 'approved':
        await handlePaymentApproved(payment);
        break;

      case 'pending':
      case 'in_process':
      case 'in_mediation':
        await handlePaymentPending(payment);
        break;

      case 'rejected':
      case 'cancelled':
        await handlePaymentRejected(payment);
        break;

      case 'refunded':
      case 'charged_back':
        await handlePaymentRefunded(payment);
        break;

      default:
        console.log('⚠️ Status desconhecido:', payment.status);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Webhook processed successfully' }),
    };
  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
