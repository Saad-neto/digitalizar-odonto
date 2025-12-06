import Stripe from 'stripe';
import { Handler } from '@netlify/functions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

export const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle OPTIONS request (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { leadId, tipo, valor } = body;

    // Validações
    if (!leadId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'leadId é obrigatório' }),
      };
    }

    if (!tipo || !['entrada', 'saldo'].includes(tipo)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'tipo deve ser "entrada" ou "saldo"' }),
      };
    }

    if (!valor || valor <= 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'valor inválido' }),
      };
    }

    // Obter URL base (produção ou dev)
    const siteUrl = process.env.URL || process.env.VITE_APP_URL || 'http://localhost:5173';

    console.log('Criando sessão Stripe:', { leadId, tipo, valor, siteUrl });

    // Criar sessão de checkout do Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',

      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: tipo === 'entrada'
                ? 'Site Odontológico - Entrada (50%)'
                : 'Site Odontológico - Saldo (50%)',
              description: tipo === 'entrada'
                ? 'Pagamento da entrada para criação do site profissional'
                : 'Pagamento do saldo após aprovação do site',
            },
            unit_amount: valor, // Valor em centavos
          },
          quantity: 1,
        },
      ],

      // Metadados para identificar no webhook
      metadata: {
        leadId,
        tipo,
      },

      // URLs de redirecionamento
      success_url: `${siteUrl}/obrigado?session_id={CHECKOUT_SESSION_ID}&leadId=${leadId}`,
      cancel_url: `${siteUrl}/pagamento?leadId=${leadId}&canceled=true`,

      // Permitir parcelamento (12x)
      payment_intent_data: {
        setup_future_usage: undefined,
      },
    });

    console.log('Sessão Stripe criada:', session.id);

    // Retornar session ID para o frontend
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
    };

  } catch (error: any) {
    console.error('Erro ao criar sessão Stripe:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Erro ao criar sessão de pagamento',
        message: error.message,
      }),
    };
  }
};
