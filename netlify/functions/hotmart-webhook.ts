import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// Inicializar Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Token de segurança do Hotmart (configurar no painel)
const HOTMART_WEBHOOK_SECRET = process.env.HOTMART_WEBHOOK_SECRET || '';

// Tipos de eventos do Hotmart
type HotmartEvent =
  | 'PURCHASE_COMPLETE'
  | 'PURCHASE_APPROVED'
  | 'PURCHASE_CANCELED'
  | 'PURCHASE_REFUNDED'
  | 'PURCHASE_CHARGEBACK'
  | 'PURCHASE_DELAYED'
  | 'PURCHASE_PROTEST'
  | 'PURCHASE_BILLET_PRINTED';

// Interface do payload do Hotmart
interface HotmartPayload {
  event: HotmartEvent;
  data: {
    product: {
      id: number;
      name: string;
    };
    purchase: {
      transaction: string;
      status: string;
      offer: {
        code: string;
      };
      price: {
        value: number;
        currency_value: string;
      };
      payment: {
        type: string;
        installments_number: number;
      };
      approved_date?: number;
    };
    buyer: {
      name: string;
      email: string;
      phone?: string;
      document?: string;
    };
    subscription?: {
      subscriber_code: string;
      status: string;
    };
  };
  hottok?: string;
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
    const payload: HotmartPayload = JSON.parse(event.body || '{}');

    console.log('📥 Hotmart Webhook recebido:', payload.event);
    console.log('📦 Transação:', payload.data?.purchase?.transaction);

    // Validar token de segurança (hottok)
    if (HOTMART_WEBHOOK_SECRET && payload.hottok !== HOTMART_WEBHOOK_SECRET) {
      console.error('❌ Token de segurança inválido');
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    // Processar diferentes tipos de eventos
    switch (payload.event) {
      case 'PURCHASE_COMPLETE':
      case 'PURCHASE_APPROVED':
        await handlePurchaseComplete(payload);
        break;

      case 'PURCHASE_CANCELED':
        await handlePurchaseCanceled(payload);
        break;

      case 'PURCHASE_REFUNDED':
        await handlePurchaseRefunded(payload);
        break;

      case 'PURCHASE_CHARGEBACK':
        await handlePurchaseChargeback(payload);
        break;

      case 'PURCHASE_DELAYED':
        await handlePurchaseDelayed(payload);
        break;

      default:
        console.log(`ℹ️ Evento não processado: ${payload.event}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };

  } catch (error: any) {
    console.error('❌ Erro ao processar webhook Hotmart:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

// Handler: Compra aprovada
async function handlePurchaseComplete(payload: HotmartPayload) {
  const { buyer, purchase, product } = payload.data;

  console.log('✅ Compra aprovada no Hotmart!');
  console.log(`👤 Cliente: ${buyer.name} (${buyer.email})`);
  console.log(`💰 Valor: R$ ${purchase.price.value}`);
  console.log(`📦 Produto: ${product.name}`);

  try {
    // Determinar o plano com base no valor
    const valor = purchase.price.value;
    const plano = valor >= 1400 ? 'site_blog' : 'site';

    // Criar registro da venda no Supabase
    const { data: venda, error: vendaError } = await supabase
      .from('hotmart_vendas')
      .insert([
        {
          transaction_id: purchase.transaction,
          status: 'aprovado',
          plano: plano,
          valor: valor,
          cliente_nome: buyer.name,
          cliente_email: buyer.email,
          cliente_telefone: buyer.phone || null,
          cliente_documento: buyer.document || null,
          produto_id: product.id,
          produto_nome: product.name,
          oferta_codigo: purchase.offer?.code || null,
          pagamento_tipo: purchase.payment?.type || null,
          pagamento_parcelas: purchase.payment?.installments_number || 1,
          data_aprovacao: purchase.approved_date
            ? new Date(purchase.approved_date).toISOString()
            : new Date().toISOString(),
          payload_completo: payload,
        },
      ])
      .select()
      .single();

    if (vendaError) {
      console.error('❌ Erro ao salvar venda:', vendaError);

      // Se a tabela não existir, apenas loga (será criada depois)
      if (vendaError.code === '42P01') {
        console.warn('⚠️ Tabela hotmart_vendas não existe. Execute o SQL de setup.');
      }
    } else {
      console.log('✅ Venda registrada no Supabase:', venda?.id);
    }

    // TODO: Enviar email de boas-vindas com link do briefing
    console.log('📧 TODO: Enviar email com link do briefing');
    console.log(`🔗 Link do briefing: https://sites-odonto.digitalizarmkt.com.br/briefing?source=hotmart&email=${encodeURIComponent(buyer.email)}`);

  } catch (err) {
    console.error('❌ Erro ao processar compra:', err);
  }
}

// Handler: Compra cancelada
async function handlePurchaseCanceled(payload: HotmartPayload) {
  const { purchase, buyer } = payload.data;

  console.log('❌ Compra cancelada:', purchase.transaction);

  try {
    const { error } = await supabase
      .from('hotmart_vendas')
      .update({
        status: 'cancelado',
        updated_at: new Date().toISOString(),
      })
      .eq('transaction_id', purchase.transaction);

    if (error) {
      console.error('❌ Erro ao atualizar venda cancelada:', error);
    } else {
      console.log('✅ Venda atualizada para cancelada');
    }
  } catch (err) {
    console.error('❌ Erro ao processar cancelamento:', err);
  }
}

// Handler: Reembolso
async function handlePurchaseRefunded(payload: HotmartPayload) {
  const { purchase, buyer } = payload.data;

  console.log('💸 Reembolso processado:', purchase.transaction);

  try {
    const { error } = await supabase
      .from('hotmart_vendas')
      .update({
        status: 'reembolsado',
        updated_at: new Date().toISOString(),
      })
      .eq('transaction_id', purchase.transaction);

    if (error) {
      console.error('❌ Erro ao atualizar venda reembolsada:', error);
    } else {
      console.log('✅ Venda atualizada para reembolsada');
    }
  } catch (err) {
    console.error('❌ Erro ao processar reembolso:', err);
  }
}

// Handler: Chargeback
async function handlePurchaseChargeback(payload: HotmartPayload) {
  const { purchase } = payload.data;

  console.log('⚠️ Chargeback recebido:', purchase.transaction);

  try {
    const { error } = await supabase
      .from('hotmart_vendas')
      .update({
        status: 'chargeback',
        updated_at: new Date().toISOString(),
      })
      .eq('transaction_id', purchase.transaction);

    if (error) {
      console.error('❌ Erro ao atualizar chargeback:', error);
    }
  } catch (err) {
    console.error('❌ Erro ao processar chargeback:', err);
  }
}

// Handler: Compra pendente (boleto impresso, aguardando pagamento)
async function handlePurchaseDelayed(payload: HotmartPayload) {
  const { purchase, buyer, product } = payload.data;

  console.log('⏳ Compra pendente (aguardando pagamento):', purchase.transaction);

  try {
    // Determinar o plano com base no valor
    const valor = purchase.price.value;
    const plano = valor >= 1400 ? 'site_blog' : 'site';

    const { error } = await supabase
      .from('hotmart_vendas')
      .insert([
        {
          transaction_id: purchase.transaction,
          status: 'pendente',
          plano: plano,
          valor: valor,
          cliente_nome: buyer.name,
          cliente_email: buyer.email,
          cliente_telefone: buyer.phone || null,
          produto_id: product.id,
          produto_nome: product.name,
          pagamento_tipo: purchase.payment?.type || 'billet',
          payload_completo: payload,
        },
      ]);

    if (error && error.code !== '23505') { // Ignora duplicata
      console.error('❌ Erro ao salvar venda pendente:', error);
    }
  } catch (err) {
    console.error('❌ Erro ao processar compra pendente:', err);
  }
}
