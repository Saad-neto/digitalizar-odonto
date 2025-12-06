import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

interface Env {
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET?: string;
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Webhook só aceita POST
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      // Inicializar Stripe com httpClient para Workers
      const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-11-20.acacia',
        httpClient: Stripe.createFetchHttpClient(),
      });

      // Inicializar Supabase
      const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

      const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
      let stripeEvent: Stripe.Event;

      // Validar assinatura do Stripe
      if (webhookSecret) {
        const signature = request.headers.get('stripe-signature');

        if (!signature) {
          console.error('❌ Assinatura do Stripe não encontrada');
          return new Response(
            JSON.stringify({ error: 'Assinatura ausente' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }

        const body = await request.text();

        try {
          stripeEvent = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err: any) {
          console.error('❌ Erro ao validar webhook:', err.message);
          return new Response(
            JSON.stringify({ error: `Webhook validation failed: ${err.message}` }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
      } else {
        // Dev mode: sem validação
        console.warn('⚠️ STRIPE_WEBHOOK_SECRET não configurado');
        const body = await request.json();
        stripeEvent = body as Stripe.Event;
      }

      console.log('📥 Webhook recebido:', stripeEvent.type);

      // Processar eventos
      switch (stripeEvent.type) {
        case 'checkout.session.completed':
          await handleCheckoutCompleted(
            stripeEvent.data.object as Stripe.Checkout.Session,
            supabase
          );
          break;

        case 'payment_intent.succeeded':
          await handlePaymentSucceeded(
            stripeEvent.data.object as Stripe.PaymentIntent,
            supabase
          );
          break;

        case 'payment_intent.payment_failed':
          await handlePaymentFailed(
            stripeEvent.data.object as Stripe.PaymentIntent,
            supabase
          );
          break;

        default:
          console.log(`ℹ️ Evento não processado: ${stripeEvent.type}`);
      }

      return new Response(
        JSON.stringify({ received: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );

    } catch (error: any) {
      console.error('❌ Erro ao processar webhook:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  },
};

// Handler: Checkout completado
async function handleCheckoutCompleted(session: Stripe.Checkout.Session, supabase: any) {
  console.log('✅ Checkout completado:', session.id);

  const { leadId, tipo } = session.metadata || {};

  if (!leadId) {
    console.error('❌ leadId não encontrado');
    return;
  }

  console.log(`📊 Lead: ${leadId}, Tipo: ${tipo}`);

  try {
    const { error } = await supabase.from('payments').insert([
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

    if (error) {
      console.error('❌ Erro ao criar pagamento:', error);
    } else {
      console.log('✅ Pagamento registrado no Supabase');
    }
  } catch (err) {
    console.error('❌ Erro ao salvar pagamento:', err);
  }
}

// Handler: Pagamento bem-sucedido
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent, supabase: any) {
  console.log('💰 Pagamento bem-sucedido:', paymentIntent.id);

  try {
    // Buscar pagamento
    const { data: payment, error: findError } = await supabase
      .from('payments')
      .select('*, lead_id')
      .eq('stripe_payment_intent_id', paymentIntent.id)
      .single();

    if (findError || !payment) {
      console.error('❌ Pagamento não encontrado:', findError);
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
      console.log('✅ Pagamento atualizado para "succeeded"');
    }

    // Atualizar lead
    const tipo = payment.tipo;
    let updateFields: any = {
      updated_at: new Date().toISOString(),
    };

    if (tipo === 'entrada') {
      updateFields.status = 'pago_50';
      updateFields.pago_entrada_at = new Date().toISOString();
      updateFields.stripe_payment_intent_entrada = paymentIntent.id;
    } else {
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
      console.log(`✅ Lead atualizado para: ${updateFields.status}`);
    }

    // TODO: Enviar email
    console.log('📧 TODO: Enviar email de confirmação');

  } catch (err) {
    console.error('❌ Erro ao processar pagamento:', err);
  }
}

// Handler: Pagamento falhou
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent, supabase: any) {
  console.log('❌ Pagamento falhou:', paymentIntent.id);

  try {
    const { error } = await supabase
      .from('payments')
      .update({ status: 'failed' })
      .eq('stripe_payment_intent_id', paymentIntent.id);

    if (error) {
      console.error('❌ Erro ao atualizar pagamento falho:', error);
    } else {
      console.log('✅ Pagamento marcado como "failed"');
    }

    // TODO: Enviar email
    console.log('📧 TODO: Enviar email sobre falha');

  } catch (err) {
    console.error('❌ Erro:', err);
  }
}
