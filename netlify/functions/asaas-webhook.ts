import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// Inicializar Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Token de validação do webhook Asaas
const ASAAS_WEBHOOK_TOKEN = process.env.ASAAS_WEBHOOK_TOKEN || '';

/**
 * Webhook do Asaas
 *
 * Eventos principais:
 * - PAYMENT_CREATED: Cobrança criada
 * - PAYMENT_UPDATED: Cobrança atualizada
 * - PAYMENT_CONFIRMED: Pagamento confirmado (pago)
 * - PAYMENT_RECEIVED: Pagamento recebido
 * - PAYMENT_OVERDUE: Cobrança vencida
 * - PAYMENT_DELETED: Cobrança deletada
 * - PAYMENT_RESTORED: Cobrança restaurada
 * - PAYMENT_REFUNDED: Pagamento estornado
 *
 * Documentação: https://docs.asaas.com/reference/webhooks
 */

interface AsaasWebhookPayload {
  event: string;
  payment?: {
    id: string;
    customer: string;
    value: number;
    netValue: number;
    dueDate: string;
    paymentDate?: string;
    billingType: string;
    status: string;
    description: string;
    externalReference?: string; // leadId
    confirmedDate?: string;
    installmentCount?: number;
    installmentValue?: number;
  };
}

export const handler: Handler = async (event) => {
  // Webhook só aceita POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Validar token do webhook (segurança)
    const token = event.headers['asaas-access-token'] || event.headers['x-asaas-token'];

    if (ASAAS_WEBHOOK_TOKEN && token !== ASAAS_WEBHOOK_TOKEN) {
      console.error('❌ Token de webhook inválido');
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    // Parsear payload
    const payload: AsaasWebhookPayload = JSON.parse(event.body || '{}');

    console.log('📥 Webhook Asaas recebido:', payload.event);

    // Processar diferentes tipos de eventos
    switch (payload.event) {
      case 'PAYMENT_CREATED':
        await handlePaymentCreated(payload);
        break;

      case 'PAYMENT_CONFIRMED':
      case 'PAYMENT_RECEIVED':
        await handlePaymentConfirmed(payload);
        break;

      case 'PAYMENT_OVERDUE':
        await handlePaymentOverdue(payload);
        break;

      case 'PAYMENT_REFUNDED':
        await handlePaymentRefunded(payload);
        break;

      default:
        console.log(`ℹ️ Evento não processado: ${payload.event}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };

  } catch (error: any) {
    console.error('❌ Erro ao processar webhook Asaas:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

/**
 * Handler: Pagamento criado
 */
async function handlePaymentCreated(payload: AsaasWebhookPayload) {
  const payment = payload.payment;
  if (!payment) return;

  console.log('📄 Pagamento criado no Asaas:', payment.id);

  const leadId = payment.externalReference;
  if (!leadId) {
    console.warn('⚠️ leadId não encontrado no externalReference');
    return;
  }

  try {
    // Registrar pagamento no banco
    const { error } = await supabase
      .from('payments')
      .insert([
        {
          lead_id: leadId,
          tipo: 'total', // Novo fluxo: pagamento único de 100%
          valor: payment.value * 100, // Converter para centavos
          status: 'pending',
          asaas_payment_id: payment.id,
          asaas_customer_id: payment.customer,
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error('❌ Erro ao registrar pagamento:', error);
    } else {
      console.log('✅ Pagamento registrado no Supabase');
    }
  } catch (err) {
    console.error('❌ Erro ao salvar pagamento:', err);
  }
}

/**
 * Handler: Pagamento confirmado (PAGO!)
 */
async function handlePaymentConfirmed(payload: AsaasWebhookPayload) {
  const payment = payload.payment;
  if (!payment) return;

  console.log('💰 Pagamento confirmado no Asaas:', payment.id);

  const leadId = payment.externalReference;
  if (!leadId) {
    console.warn('⚠️ leadId não encontrado no externalReference');
    return;
  }

  try {
    // 1. Atualizar registro de pagamento
    const { error: paymentError } = await supabase
      .from('payments')
      .update({
        status: 'succeeded',
        paid_at: payment.confirmedDate || payment.paymentDate || new Date().toISOString(),
      })
      .eq('asaas_payment_id', payment.id);

    if (paymentError) {
      console.error('❌ Erro ao atualizar pagamento:', paymentError);
    } else {
      console.log('✅ Pagamento marcado como "succeeded"');
    }

    // 2. Atualizar status do lead para "aprovado_pagamento"
    const { error: leadError } = await supabase
      .from('leads')
      .update({
        status: 'aprovado_pagamento',
        data_aprovacao_inicial: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadId);

    if (leadError) {
      console.error('❌ Erro ao atualizar lead:', leadError);
    } else {
      console.log('✅ Lead atualizado para "aprovado_pagamento"');
    }

    // 3. Registrar mudança de status no histórico
    const { error: historyError } = await supabase
      .from('lead_status_history')
      .insert([
        {
          lead_id: leadId,
          old_status: 'aguardando_aprovacao',
          new_status: 'aprovado_pagamento',
          changed_by: 'system',
          notes: `Pagamento confirmado via Asaas (${payment.id})`,
        },
      ]);

    if (historyError) {
      console.error('❌ Erro ao registrar histórico:', historyError);
    }

    // TODO: Enviar email de confirmação
    console.log('📧 TODO: Enviar email de confirmação de pagamento');

  } catch (err) {
    console.error('❌ Erro ao processar pagamento confirmado:', err);
  }
}

/**
 * Handler: Pagamento vencido
 */
async function handlePaymentOverdue(payload: AsaasWebhookPayload) {
  const payment = payload.payment;
  if (!payment) return;

  console.log('⏰ Pagamento vencido:', payment.id);

  try {
    // Atualizar status do pagamento
    const { error } = await supabase
      .from('payments')
      .update({
        status: 'failed',
      })
      .eq('asaas_payment_id', payment.id);

    if (error) {
      console.error('❌ Erro ao marcar pagamento como vencido:', error);
    } else {
      console.log('✅ Pagamento marcado como vencido');
    }

    // TODO: Notificar admin sobre pagamento vencido
    console.log('📧 TODO: Notificar sobre pagamento vencido');

  } catch (err) {
    console.error('❌ Erro ao processar pagamento vencido:', err);
  }
}

/**
 * Handler: Pagamento estornado
 */
async function handlePaymentRefunded(payload: AsaasWebhookPayload) {
  const payment = payload.payment;
  if (!payment) return;

  console.log('↩️ Pagamento estornado:', payment.id);

  const leadId = payment.externalReference;
  if (!leadId) return;

  try {
    // 1. Atualizar status do pagamento
    const { error: paymentError } = await supabase
      .from('payments')
      .update({
        status: 'refunded',
      })
      .eq('asaas_payment_id', payment.id);

    if (paymentError) {
      console.error('❌ Erro ao atualizar pagamento estornado:', paymentError);
    }

    // 2. Voltar lead para status anterior (aguardando_aprovacao)
    const { error: leadError } = await supabase
      .from('leads')
      .update({
        status: 'aguardando_aprovacao',
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadId);

    if (leadError) {
      console.error('❌ Erro ao atualizar lead:', leadError);
    } else {
      console.log('✅ Lead retornado para "aguardando_aprovacao"');
    }

    // TODO: Notificar admin sobre estorno
    console.log('📧 TODO: Notificar sobre estorno');

  } catch (err) {
    console.error('❌ Erro ao processar estorno:', err);
  }
}
