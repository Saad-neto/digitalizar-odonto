import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// Inicializar Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Webhook Secret (opcional, para validação adicional)
const ASAAS_WEBHOOK_SECRET = process.env.ASAAS_WEBHOOK_SECRET;

/**
 * Webhook do Asaas - Processa eventos de pagamento
 *
 * Documentação: https://docs.asaas.com/docs/webhooks
 *
 * Eventos principais:
 * - PAYMENT_CREATED: Cobrança criada
 * - PAYMENT_UPDATED: Cobrança atualizada
 * - PAYMENT_CONFIRMED: Pagamento confirmado (PIX/Boleto)
 * - PAYMENT_RECEIVED: Pagamento recebido (Cartão)
 * - PAYMENT_OVERDUE: Cobrança vencida
 * - PAYMENT_DELETED: Cobrança deletada
 * - PAYMENT_RESTORED: Cobrança restaurada
 * - PAYMENT_REFUNDED: Pagamento estornado
 * - PAYMENT_RECEIVED_IN_CASH: Recebido em dinheiro
 * - PAYMENT_CHARGEBACK_REQUESTED: Chargeback solicitado
 * - PAYMENT_CHARGEBACK_DISPUTE: Contestação de chargeback
 * - PAYMENT_AWAITING_CHARGEBACK_REVERSAL: Aguardando reversão
 * - PAYMENT_DUNNING_RECEIVED: Cobrança recuperada
 * - PAYMENT_DUNNING_REQUESTED: Cobrança em recuperação
 * - PAYMENT_BANK_SLIP_VIEWED: Boleto visualizado
 * - PAYMENT_CHECKOUT_VIEWED: Checkout visualizado
 */

export const handler: Handler = async (event) => {
  // Apenas aceitar POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse do body
    const body = JSON.parse(event.body || '{}');

    console.log('📥 Webhook Asaas recebido:', {
      event: body.event,
      paymentId: body.payment?.id,
    });

    // Validação adicional (se tiver secret configurado)
    if (ASAAS_WEBHOOK_SECRET) {
      const token = event.headers['asaas-access-token'];
      if (token !== ASAAS_WEBHOOK_SECRET) {
        console.error('❌ Token de webhook inválido');
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized' }),
        };
      }
    }

    // Processar evento
    const eventType = body.event;
    const payment = body.payment;

    if (!payment || !payment.id) {
      console.error('❌ Dados de pagamento ausentes');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Payment data missing' }),
      };
    }

    // Buscar lead pelo asaas_payment_id
    const { data: lead, error: findError } = await supabase
      .from('leads')
      .select('*')
      .eq('asaas_payment_id', payment.id)
      .single();

    if (findError || !lead) {
      console.error('❌ Lead não encontrado para payment:', payment.id);
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Lead not found' }),
      };
    }

    console.log(`📊 Lead encontrado: ${lead.id} (${lead.nome})`);

    // Processar evento baseado no tipo
    switch (eventType) {
      case 'PAYMENT_CONFIRMED':
      case 'PAYMENT_RECEIVED':
        await handlePaymentSuccess(lead, payment);
        break;

      case 'PAYMENT_OVERDUE':
        await handlePaymentOverdue(lead, payment);
        break;

      case 'PAYMENT_REFUNDED':
        await handlePaymentRefunded(lead, payment);
        break;

      case 'PAYMENT_UPDATED':
        await handlePaymentUpdated(lead, payment);
        break;

      default:
        console.log(`ℹ️ Evento não processado: ${eventType}`);
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
 * Pagamento confirmado/recebido com sucesso
 */
async function handlePaymentSuccess(lead: any, payment: any) {
  console.log('✅ Processando pagamento bem-sucedido:', payment.id);

  try {
    // Determinar novo status do lead
    let newStatus = 'em_producao'; // Status padrão após pagamento

    const updateData: any = {
      status: newStatus,
      pago_entrada_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Atualizar lead
    const { error: updateError } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', lead.id);

    if (updateError) {
      console.error('❌ Erro ao atualizar lead:', updateError);
      return;
    }

    console.log(`✅ Lead ${lead.id} atualizado para status: ${newStatus}`);

    // Registrar histórico de status
    const { error: historyError } = await supabase
      .from('lead_status_history')
      .insert({
        lead_id: lead.id,
        status_anterior: lead.status,
        status_novo: newStatus,
        observacao: `Pagamento confirmado via Asaas - ${payment.billingType} - R$ ${payment.value}`,
      });

    if (historyError) {
      console.error('❌ Erro ao registrar histórico:', historyError);
    }

    // TODO: Enviar email de confirmação para o cliente
    console.log('📧 TODO: Enviar email de confirmação');

    // TODO: Notificar admin sobre novo pagamento
    console.log('📧 TODO: Notificar admin');

  } catch (err) {
    console.error('❌ Erro ao processar sucesso:', err);
  }
}

/**
 * Pagamento vencido
 */
async function handlePaymentOverdue(lead: any, payment: any) {
  console.log('⏰ Processando pagamento vencido:', payment.id);

  try {
    // Registrar nota no lead
    const { error } = await supabase
      .from('lead_notes')
      .insert({
        lead_id: lead.id,
        note: `⚠️ Pagamento vencido - ${payment.billingType} - Vencimento: ${payment.dueDate}`,
        created_by: 'Sistema (Webhook Asaas)',
      });

    if (error) {
      console.error('❌ Erro ao registrar nota de vencimento:', error);
    }

    // TODO: Enviar email de lembrete para o cliente
    console.log('📧 TODO: Enviar lembrete de pagamento vencido');

  } catch (err) {
    console.error('❌ Erro ao processar vencimento:', err);
  }
}

/**
 * Pagamento estornado
 */
async function handlePaymentRefunded(lead: any, payment: any) {
  console.log('💸 Processando estorno:', payment.id);

  try {
    // Atualizar lead para status que indica estorno
    const { error: updateError } = await supabase
      .from('leads')
      .update({
        status: 'cancelado',
        updated_at: new Date().toISOString(),
      })
      .eq('id', lead.id);

    if (updateError) {
      console.error('❌ Erro ao atualizar lead estornado:', updateError);
      return;
    }

    // Registrar histórico
    const { error: historyError } = await supabase
      .from('lead_status_history')
      .insert({
        lead_id: lead.id,
        status_anterior: lead.status,
        status_novo: 'cancelado',
        observacao: `Pagamento estornado via Asaas - ${payment.billingType} - R$ ${payment.value}`,
      });

    if (historyError) {
      console.error('❌ Erro ao registrar histórico de estorno:', historyError);
    }

    // TODO: Notificar admin sobre estorno
    console.log('📧 TODO: Notificar admin sobre estorno');

  } catch (err) {
    console.error('❌ Erro ao processar estorno:', err);
  }
}

/**
 * Pagamento atualizado (mudança de status)
 */
async function handlePaymentUpdated(lead: any, payment: any) {
  console.log('🔄 Pagamento atualizado:', payment.id, 'Status:', payment.status);

  try {
    // Apenas registrar nota sobre a atualização
    const { error } = await supabase
      .from('lead_notes')
      .insert({
        lead_id: lead.id,
        note: `ℹ️ Status de pagamento atualizado: ${payment.status}`,
        created_by: 'Sistema (Webhook Asaas)',
      });

    if (error) {
      console.error('❌ Erro ao registrar nota de atualização:', error);
    }

  } catch (err) {
    console.error('❌ Erro ao processar atualização:', err);
  }
}
