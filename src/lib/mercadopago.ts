/**
 * Mercado Pago Integration Library
 *
 * Funções para integração com API do Mercado Pago
 * - Criar preferências de pagamento com parcelamento em até 12x
 * - Gerar links de pagamento
 * - Consultar status de pagamento
 */

import { supabase } from './supabase';

const MERCADOPAGO_ACCESS_TOKEN = import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN;
const MERCADOPAGO_API_URL = 'https://api.mercadopago.com';

interface MercadoPagoPreference {
  id: string;
  init_point: string; // Link de pagamento
  sandbox_init_point: string;
}

interface MercadoPagoPayment {
  id: number;
  status: string;
  status_detail: string;
  external_reference?: string;
  payment_method_id?: string;
  payment_type_id?: string;
  transaction_amount: number;
  installments?: number;
}

/**
 * Cria uma preferência de pagamento no Mercado Pago
 * Retorna o link de pagamento que pode ser enviado ao cliente
 */
export async function createMercadoPagoPreference(data: {
  title: string;
  description: string;
  price: number;
  quantity?: number;
  externalReference: string;
  payer?: {
    name?: string;
    email?: string;
    phone?: {
      area_code?: string;
      number?: string;
    };
  };
}): Promise<MercadoPagoPreference | null> {
  try {
    const response = await fetch(`${MERCADOPAGO_API_URL}/checkout/preferences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        items: [
          {
            title: data.title,
            description: data.description,
            quantity: data.quantity || 1,
            currency_id: 'BRL',
            unit_price: data.price,
          }
        ],
        payer: data.payer,
        external_reference: data.externalReference,
        payment_methods: {
          installments: 12, // Até 12x
          default_installments: 12,
        },
        back_urls: {
          success: `${window.location.origin}/obrigado`,
          failure: `${window.location.origin}/pagamento-erro`,
          pending: `${window.location.origin}/pagamento-pendente`,
        },
        auto_return: 'approved',
        statement_descriptor: 'DIGITALIZAR ODONTO',
        notification_url: `${window.location.origin}/.netlify/functions/mercadopago-webhook`,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro ao criar preferência MP:', response.status, errorText);
      return null;
    }

    const preference: MercadoPagoPreference = await response.json();
    console.log('✅ Preferência MP criada:', preference.id);

    return preference;
  } catch (error) {
    console.error('❌ Erro ao criar preferência MP:', error);
    return null;
  }
}

/**
 * Consulta informações de um pagamento específico
 */
export async function getMercadoPagoPayment(paymentId: string): Promise<MercadoPagoPayment | null> {
  try {
    const response = await fetch(`${MERCADOPAGO_API_URL}/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
      },
    });

    if (!response.ok) {
      console.error('Erro ao consultar pagamento MP:', response.status);
      return null;
    }

    const payment: MercadoPagoPayment = await response.json();
    return payment;
  } catch (error) {
    console.error('❌ Erro ao consultar pagamento MP:', error);
    return null;
  }
}

/**
 * Verifica se um pagamento foi aprovado
 */
export async function checkMercadoPagoPaymentStatus(paymentId: string): Promise<{
  approved: boolean;
  status: string;
  installments?: number;
}> {
  const payment = await getMercadoPagoPayment(paymentId);

  if (!payment) {
    return { approved: false, status: 'unknown' };
  }

  return {
    approved: payment.status === 'approved',
    status: payment.status,
    installments: payment.installments,
  };
}

/**
 * Helper: Cria pagamento para um lead específico
 * Integra com Supabase para salvar informações
 */
export async function createPaymentForLead(leadData: {
  leadId: string;
  nome: string;
  email: string;
  whatsapp: string;
  valor: number; // Valor em reais (ex: 497.00)
}): Promise<{ success: boolean; paymentUrl?: string; error?: string }> {
  try {
    console.log('🔄 Criando pagamento MP para lead:', leadData.leadId);

    // Formatar telefone para Mercado Pago (DDD + número)
    const phoneClean = leadData.whatsapp.replace(/\D/g, '');
    const areaCode = phoneClean.substring(0, 2);
    const phoneNumber = phoneClean.substring(2);

    // Criar preferência de pagamento
    const preference = await createMercadoPagoPreference({
      title: `Site Profissional - ${leadData.nome}`,
      description: 'Site profissional para dentista - Digitalizar Odonto',
      price: leadData.valor,
      quantity: 1,
      externalReference: leadData.leadId,
      payer: {
        name: leadData.nome,
        email: leadData.email,
        phone: {
          area_code: areaCode,
          number: phoneNumber,
        },
      },
    });

    if (!preference) {
      return {
        success: false,
        error: 'Não foi possível criar a preferência de pagamento no Mercado Pago',
      };
    }

    // Usar sandbox em desenvolvimento, produção em produção
    const paymentUrl = import.meta.env.DEV
      ? preference.sandbox_init_point
      : preference.init_point;

    // Salvar informações no Supabase
    const { error: updateError } = await supabase
      .from('leads')
      .update({
        mercadopago_preference_id: preference.id,
        mercadopago_payment_url: paymentUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadData.leadId);

    if (updateError) {
      console.error('❌ Erro ao salvar preferência no banco:', updateError);
      return {
        success: false,
        error: 'Pagamento criado, mas erro ao salvar no banco de dados',
      };
    }

    console.log('✅ Pagamento MP criado com sucesso!');
    console.log('🔗 Link de pagamento:', paymentUrl);

    return {
      success: true,
      paymentUrl,
    };
  } catch (error) {
    console.error('❌ Erro ao criar pagamento para lead:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

/**
 * Extrai external_reference de um pagamento MP
 */
export async function getLeadIdFromPayment(paymentId: string): Promise<string | null> {
  const payment = await getMercadoPagoPayment(paymentId);
  return payment?.external_reference || null;
}
