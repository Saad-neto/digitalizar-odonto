const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Token de segurança do Hotmart
const HOTMART_SECRET = process.env.HOTMART_WEBHOOK_SECRET || '';

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Webhook do Hotmart
app.post('/hotmart', async (req, res) => {
  console.log('📥 Webhook Hotmart recebido:', new Date().toISOString());

  try {
    const payload = req.body;

    console.log('📦 Evento:', payload.event);
    console.log('📦 Transação:', payload.data?.purchase?.transaction);

    // Validar token (hottok) - opcional
    if (HOTMART_SECRET && payload.hottok && payload.hottok !== HOTMART_SECRET) {
      console.error('❌ Token inválido');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Processar evento
    switch (payload.event) {
      case 'PURCHASE_COMPLETE':
      case 'PURCHASE_APPROVED':
        await handlePurchaseComplete(payload);
        break;

      case 'PURCHASE_CANCELED':
        await handleStatusUpdate(payload, 'cancelado');
        break;

      case 'PURCHASE_REFUNDED':
        await handleStatusUpdate(payload, 'reembolsado');
        break;

      case 'PURCHASE_CHARGEBACK':
        await handleStatusUpdate(payload, 'chargeback');
        break;

      case 'PURCHASE_DELAYED':
      case 'PURCHASE_BILLET_PRINTED':
        await handlePurchasePending(payload);
        break;

      default:
        console.log(`ℹ️ Evento não processado: ${payload.event}`);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handler: Compra aprovada
async function handlePurchaseComplete(payload) {
  const { buyer, purchase, product } = payload.data;

  console.log('✅ Compra aprovada!');
  console.log(`👤 Cliente: ${buyer.name} (${buyer.email})`);
  console.log(`💰 Valor: R$ ${purchase.price.value}`);

  try {
    const valor = purchase.price.value;
    const plano = valor >= 1400 ? 'site_blog' : 'site';

    // Usar UPSERT para atualizar se já existe (ex: pagamento pendente que foi aprovado)
    const { data, error } = await supabase
      .from('hotmart_vendas')
      .upsert([{
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
        updated_at: new Date().toISOString()
      }], { onConflict: 'transaction_id' })
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao salvar:', error);
    } else {
      console.log('✅ Venda salva/atualizada:', data?.id);
      console.log(`🔗 Link briefing: https://sites-odonto.digitalizarmkt.com.br/briefing?source=hotmart&email=${encodeURIComponent(buyer.email)}`);
    }
  } catch (err) {
    console.error('❌ Erro:', err);
  }
}

// Handler: Atualizar status
async function handleStatusUpdate(payload, newStatus) {
  const { purchase } = payload.data;

  console.log(`📝 Atualizando status para: ${newStatus}`);

  try {
    const { error } = await supabase
      .from('hotmart_vendas')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('transaction_id', purchase.transaction);

    if (error) {
      console.error('❌ Erro ao atualizar:', error);
    } else {
      console.log('✅ Status atualizado');
    }
  } catch (err) {
    console.error('❌ Erro:', err);
  }
}

// Handler: Compra pendente
async function handlePurchasePending(payload) {
  const { buyer, purchase, product } = payload.data;

  console.log('⏳ Compra pendente (aguardando pagamento)');

  try {
    const valor = purchase.price.value;
    const plano = valor >= 1400 ? 'site_blog' : 'site';

    const { error } = await supabase
      .from('hotmart_vendas')
      .upsert([{
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
        payload_completo: payload
      }], { onConflict: 'transaction_id' });

    if (error) {
      console.error('❌ Erro:', error);
    }
  } catch (err) {
    console.error('❌ Erro:', err);
  }
}

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Webhook server rodando na porta ${PORT}`);
  console.log(`📡 Endpoints:`);
  console.log(`   GET  /health - Health check`);
  console.log(`   POST /hotmart - Webhook Hotmart`);
});
