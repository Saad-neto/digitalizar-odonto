/**
 * Asaas Payment Integration Library
 *
 * Integração com API do Asaas para:
 * - Criar cobranças (PIX, Boleto, Cartão)
 * - Gerar QR Code PIX
 * - Consultar status de pagamento
 *
 * Documentação: https://docs.asaas.com/
 */

import { supabase } from './supabase';

// Configuração - usar variáveis de ambiente
const ASAAS_API_KEY = import.meta.env.VITE_ASAAS_API_KEY;
const ASAAS_ENV = import.meta.env.VITE_ASAAS_ENV || 'sandbox'; // 'sandbox' ou 'production'

// URLs da API
const ASAAS_API_URL = ASAAS_ENV === 'production'
  ? 'https://api.asaas.com/v3'
  : 'https://sandbox.asaas.com/api/v3';

// Tipos
export interface AsaasCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  mobilePhone?: string;
  cpfCnpj?: string;
}

export interface AsaasPayment {
  id: string;
  customer: string;
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' | 'UNDEFINED';
  value: number;
  netValue: number;
  status: 'PENDING' | 'RECEIVED' | 'CONFIRMED' | 'OVERDUE' | 'REFUNDED' | 'RECEIVED_IN_CASH' | 'REFUND_REQUESTED' | 'CHARGEBACK_REQUESTED' | 'CHARGEBACK_DISPUTE' | 'AWAITING_CHARGEBACK_REVERSAL' | 'DUNNING_REQUESTED' | 'DUNNING_RECEIVED' | 'AWAITING_RISK_ANALYSIS';
  dueDate: string;
  invoiceUrl?: string;
  bankSlipUrl?: string;
  invoiceNumber?: string;
  externalReference?: string;
  description?: string;
}

export interface AsaasPixQrCode {
  encodedImage: string; // Base64 do QR Code
  payload: string; // Código PIX copia e cola
  expirationDate: string;
}

export interface AsaasPaymentLink {
  id: string;
  url: string;
}

/**
 * Headers padrão para requisições à API
 */
function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'access_token': ASAAS_API_KEY,
  };
}

/**
 * Busca ou cria um cliente no Asaas
 */
export async function findOrCreateCustomer(data: {
  name: string;
  email: string;
  phone?: string;
  cpfCnpj?: string;
}): Promise<AsaasCustomer | null> {
  try {
    // Primeiro, tentar encontrar pelo email
    const searchResponse = await fetch(
      `${ASAAS_API_URL}/customers?email=${encodeURIComponent(data.email)}`,
      { headers: getHeaders() }
    );

    if (searchResponse.ok) {
      const searchResult = await searchResponse.json();
      if (searchResult.data && searchResult.data.length > 0) {
        console.log('✅ Cliente encontrado no Asaas:', searchResult.data[0].id);
        return searchResult.data[0];
      }
    }

    // Se não encontrou, criar novo cliente
    const createResponse = await fetch(`${ASAAS_API_URL}/customers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        mobilePhone: data.phone,
        cpfCnpj: data.cpfCnpj,
        notificationDisabled: false,
      }),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('❌ Erro ao criar cliente Asaas:', createResponse.status, errorText);
      return null;
    }

    const customer: AsaasCustomer = await createResponse.json();
    console.log('✅ Cliente criado no Asaas:', customer.id);
    return customer;
  } catch (error) {
    console.error('❌ Erro ao buscar/criar cliente Asaas:', error);
    return null;
  }
}

/**
 * Cria uma cobrança no Asaas
 */
export async function createPayment(data: {
  customerId: string;
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' | 'UNDEFINED';
  value: number;
  dueDate: string; // YYYY-MM-DD
  description?: string;
  externalReference?: string;
}): Promise<AsaasPayment | null> {
  try {
    const response = await fetch(`${ASAAS_API_URL}/payments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        customer: data.customerId,
        billingType: data.billingType,
        value: data.value,
        dueDate: data.dueDate,
        description: data.description || 'Site Profissional - Clínica Na Web',
        externalReference: data.externalReference,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro ao criar cobrança Asaas:', response.status, errorText);
      return null;
    }

    const payment: AsaasPayment = await response.json();
    console.log('✅ Cobrança criada no Asaas:', payment.id);
    return payment;
  } catch (error) {
    console.error('❌ Erro ao criar cobrança Asaas:', error);
    return null;
  }
}

/**
 * Obtém o QR Code PIX de uma cobrança
 */
export async function getPixQrCode(paymentId: string): Promise<AsaasPixQrCode | null> {
  try {
    const response = await fetch(`${ASAAS_API_URL}/payments/${paymentId}/pixQrCode`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro ao obter QR Code PIX:', response.status, errorText);
      return null;
    }

    const qrCode: AsaasPixQrCode = await response.json();
    return qrCode;
  } catch (error) {
    console.error('❌ Erro ao obter QR Code PIX:', error);
    return null;
  }
}

/**
 * Consulta status de uma cobrança
 */
export async function getPaymentStatus(paymentId: string): Promise<AsaasPayment | null> {
  try {
    const response = await fetch(`${ASAAS_API_URL}/payments/${paymentId}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      console.error('❌ Erro ao consultar cobrança Asaas:', response.status);
      return null;
    }

    const payment: AsaasPayment = await response.json();
    return payment;
  } catch (error) {
    console.error('❌ Erro ao consultar cobrança Asaas:', error);
    return null;
  }
}

/**
 * Cria um link de pagamento (checkout Asaas)
 * Permite que o cliente escolha a forma de pagamento
 */
export async function createPaymentLink(data: {
  name: string;
  description?: string;
  value: number;
  billingType: 'UNDEFINED'; // UNDEFINED permite escolher no checkout
  chargeType: 'DETACHED'; // Cobrança avulsa
  dueDateLimitDays?: number;
  externalReference?: string;
}): Promise<AsaasPaymentLink | null> {
  try {
    const response = await fetch(`${ASAAS_API_URL}/paymentLinks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        value: data.value,
        billingType: data.billingType,
        chargeType: data.chargeType,
        dueDateLimitDays: data.dueDateLimitDays || 7,
        externalReference: data.externalReference,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro ao criar link de pagamento Asaas:', response.status, errorText);
      return null;
    }

    const paymentLink: AsaasPaymentLink = await response.json();
    console.log('✅ Link de pagamento criado:', paymentLink.url);
    return paymentLink;
  } catch (error) {
    console.error('❌ Erro ao criar link de pagamento Asaas:', error);
    return null;
  }
}

/**
 * Helper: Cria pagamento completo para um lead
 * Integra com Supabase para salvar informações
 */
export async function createAsaasPaymentForLead(leadData: {
  leadId: string;
  nome: string;
  email: string;
  whatsapp: string;
  valor: number; // Valor em reais (ex: 997.00)
  billingType?: 'PIX' | 'BOLETO' | 'CREDIT_CARD' | 'UNDEFINED';
}): Promise<{
  success: boolean;
  payment?: AsaasPayment;
  pixQrCode?: AsaasPixQrCode;
  invoiceUrl?: string;
  error?: string;
}> {
  try {
    console.log('🔄 Criando pagamento Asaas para lead:', leadData.leadId);

    // 1. Buscar ou criar cliente
    const customer = await findOrCreateCustomer({
      name: leadData.nome,
      email: leadData.email,
      phone: leadData.whatsapp.replace(/\D/g, ''),
    });

    if (!customer) {
      return {
        success: false,
        error: 'Não foi possível criar/encontrar cliente no Asaas',
      };
    }

    // 2. Calcular data de vencimento (7 dias)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    const dueDateStr = dueDate.toISOString().split('T')[0];

    // 3. Criar cobrança
    const billingType = leadData.billingType || 'PIX';
    const payment = await createPayment({
      customerId: customer.id,
      billingType,
      value: leadData.valor,
      dueDate: dueDateStr,
      description: `Site Profissional - ${leadData.nome}`,
      externalReference: leadData.leadId,
    });

    if (!payment) {
      return {
        success: false,
        error: 'Não foi possível criar a cobrança no Asaas',
      };
    }

    // 4. Se for PIX, obter QR Code
    let pixQrCode: AsaasPixQrCode | null = null;
    if (billingType === 'PIX') {
      pixQrCode = await getPixQrCode(payment.id);
    }

    // 5. Salvar informações no Supabase
    const { error: updateError } = await supabase
      .from('leads')
      .update({
        asaas_customer_id: customer.id,
        asaas_payment_id: payment.id,
        asaas_invoice_url: payment.invoiceUrl,
        asaas_billing_type: billingType,
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadData.leadId);

    if (updateError) {
      console.error('❌ Erro ao salvar no banco:', updateError);
      // Não retornar erro aqui, pois o pagamento foi criado
    }

    console.log('✅ Pagamento Asaas criado com sucesso!');

    return {
      success: true,
      payment,
      pixQrCode: pixQrCode || undefined,
      invoiceUrl: payment.invoiceUrl,
    };
  } catch (error) {
    console.error('❌ Erro ao criar pagamento Asaas:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

/**
 * Verifica se a API Key está configurada
 */
export function isAsaasConfigured(): boolean {
  return !!ASAAS_API_KEY && ASAAS_API_KEY.length > 0;
}

/**
 * Retorna o ambiente atual (sandbox ou production)
 */
export function getAsaasEnvironment(): string {
  return ASAAS_ENV;
}
