import Stripe from 'stripe';

interface Env {
  STRIPE_SECRET_KEY: string;
  VITE_APP_URL: string;
  URL?: string;
}

// Cloudflare Pages Function formato
export async function onRequest(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      // Parse request body
      const body = await request.json() as {
        leadId: string;
        tipo: 'entrada' | 'saldo';
        valor: number;
      };

      const { leadId, tipo, valor } = body;

      // Validações
      if (!leadId) {
        return new Response(
          JSON.stringify({ error: 'leadId é obrigatório' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!tipo || !['entrada', 'saldo'].includes(tipo)) {
        return new Response(
          JSON.stringify({ error: 'tipo deve ser "entrada" ou "saldo"' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!valor || valor <= 0) {
        return new Response(
          JSON.stringify({ error: 'valor inválido' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Inicializar Stripe com httpClient para Workers
      const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-11-20.acacia',
        httpClient: Stripe.createFetchHttpClient(),
      });

      // URL base do site
      const siteUrl = env.URL || env.VITE_APP_URL || 'http://localhost:5173';

      console.log('Criando sessão Stripe:', { leadId, tipo, valor, siteUrl });

      // Criar sessão de checkout
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
              unit_amount: valor,
            },
            quantity: 1,
          },
        ],

        metadata: {
          leadId,
          tipo,
        },

        success_url: `${siteUrl}/obrigado?session_id={CHECKOUT_SESSION_ID}&leadId=${leadId}`,
        cancel_url: `${siteUrl}/pagamento?leadId=${leadId}&canceled=true`,

        payment_intent_data: {
          setup_future_usage: undefined,
        },
      });

      console.log('✅ Sessão Stripe criada:', session.id);

      return new Response(
        JSON.stringify({
          sessionId: session.id,
          url: session.url,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );

    } catch (error: any) {
      console.error('❌ Erro ao criar sessão Stripe:', error);

      return new Response(
        JSON.stringify({
          error: 'Erro ao criar sessão de pagamento',
          message: error.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
}
