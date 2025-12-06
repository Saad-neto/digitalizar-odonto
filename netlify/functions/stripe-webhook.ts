import Stripe from 'stripe';
import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

// Inicializar Supabase (com variáveis do backend)
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export const handler: Handler = async (event) => {
  // Webhook só aceita POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Se não tiver webhook secret configurado, avisa mas deixa passar (dev mode)
  if (!webhookSecret) {
    console.warn('⚠️ STRIPE_WEBHOOK_SECRET não configurado - webhook não validado!');
  }

  try {
    let stripeEvent: Stripe.Event;

    // Validar assinatura do Stripe (segurança)
    if (webhookSecret) {
      const signature = event.headers['stripe-signature'];

      if (!signature) {
        console.error('❌ Assinatura do Stripe não encontrada');
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Assinatura ausente' }),
        };
      }

      try {
        stripeEvent = stripe.webhooks.constructEvent(
          event.body || '',
          signature,
          webhookSecret
        );
      } catch (err: any) {
        console.error('❌ Erro ao validar webhook:', err.message);
        return {
          statusCode: 400,
          body: JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }),
        };
      }
    } else {
      // Dev mode: apenas parseia o JSON (sem validação)
      stripeEvent = JSON.parse(event.body || '{}');
    }

    console.log('📥 Webhook recebido:', stripeEvent.type);

    // Processar diferentes tipos de eventos
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(stripeEvent.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(stripeEvent.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(stripeEvent.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`ℹ️ Evento não processado: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };

  } catch (error: any) {
    console.error('❌ Erro ao processar webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

// Handler: Checkout completado (usuário finalizou o checkout)
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('✅ Checkout completado:', session.id);

  const { leadId, tipo } = session.metadata || {};

  if (!leadId) {
    console.error('❌ leadId não encontrado nos metadados');
    return;
  }

  console.log(`📊 Lead: ${leadId}, Tipo: ${tipo}`);

  // Criar registro de pagamento no Supabase
  try {
    const { error: paymentError } = await supabase
      .from('payments')
      .insert([
        {
          lead_id: leadId,
          tipo: tipo || 'entrada',
          valor: session.amount_total || 0,
          status: 'pending',
          stripe_payment_intent_id: session.payment_intent as string,
          stripe_session_id: session.id,
          stripe_customer_id: session.customer as string,
        },
      ]);

    if (paymentError) {
      console.error('❌ Erro ao criar registro de pagamento:', paymentError);
    } else {
      console.log('✅ Registro de pagamento criado no Supabase');
    }
  } catch (err) {
    console.error('❌ Erro ao salvar pagamento:', err);
  }
}

// Handler: Pagamento bem-sucedido
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('💰 Pagamento bem-sucedido:', paymentIntent.id);

  try {
    // Atualizar status do pagamento no Supabase
    const { data: payment, error: findError } = await supabase
      .from('payments')
      .select('*, lead_id')
      .eq('stripe_payment_intent_id', paymentIntent.id)
      .single();

    if (findError || !payment) {
      console.error('❌ Pagamento não encontrado no Supabase:', findError);
      return;
    }

    // Atualizar status do pagamento
    const { error: updatePaymentError } = await supabase
      .from('payments')
      .update({
        status: 'succeeded',
        paid_at: new Date().toISOString(),
      })
      .eq('stripe_payment_intent_id', paymentIntent.id);

    if (updatePaymentError) {
      console.error('❌ Erro ao atualizar pagamento:', updatePaymentError);
    } else {
      console.log('✅ Status do pagamento atualizado para "succeeded"');
    }

    // Atualizar status do lead
    const tipo = payment.tipo;
    let newLeadStatus: string;
    let updateFields: any = {
      updated_at: new Date().toISOString(),
    };

    if (tipo === 'entrada') {
      newLeadStatus = 'pago_50';
      updateFields.status = 'pago_50';
      updateFields.pago_entrada_at = new Date().toISOString();
      updateFields.stripe_payment_intent_entrada = paymentIntent.id;
    } else {
      newLeadStatus = 'pago_100';
      updateFields.status = 'pago_100';
      updateFields.pago_saldo_at = new Date().toISOString();
      updateFields.stripe_payment_intent_saldo = paymentIntent.id;
    }

    const { error: updateLeadError } = await supabase
      .from('leads')
      .update(updateFields)
      .eq('id', payment.lead_id);

    if (updateLeadError) {
      console.error('❌ Erro ao atualizar lead:', updateLeadError);
    } else {
      console.log(`✅ Lead atualizado para status: ${newLeadStatus}`);
    }

    // TODO: Enviar email de confirmação via Resend
    console.log('📧 TODO: Enviar email de confirmação');

  } catch (err) {
    console.error('❌ Erro ao processar pagamento bem-sucedido:', err);
  }
}

// Handler: Pagamento falhou
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('❌ Pagamento falhou:', paymentIntent.id);

  try {
    // Atualizar status do pagamento no Supabase
    const { error } = await supabase
      .from('payments')
      .update({
        status: 'failed',
      })
      .eq('stripe_payment_intent_id', paymentIntent.id);

    if (error) {
      console.error('❌ Erro ao atualizar pagamento falho:', error);
    } else {
      console.log('✅ Status do pagamento atualizado para "failed"');
    }

    // TODO: Enviar email notificando sobre falha
    console.log('📧 TODO: Enviar email sobre pagamento falho');

  } catch (err) {
    console.error('❌ Erro ao processar pagamento falho:', err);
  }
}
