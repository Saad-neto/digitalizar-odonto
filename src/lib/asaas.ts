/**
 * ASAAS API Integration
 *
 * Documentação: https://docs.asaas.com/
 *
 * Fluxo de pagamento:
 * 1. Criar cliente no Asaas (se não existir)
 * 2. Criar cobrança com parcelamento (até 12x)
 * 3. Gerar link de pagamento
 * 4. Receber webhook quando pago
 */

const ASAAS_API_URL = import.meta.env.VITE_ASAAS_API_URL || 'https://api.asaas.com/v3';
const ASAAS_API_KEY = import.meta.env.VITE_ASAAS_API_KEY || '';

interface AsaasCustomer {
  id: string;
  name: string;
  email: string;
  mobilePhone: string;
  cpfCnpj?: string;
}

interface AsaasCharge {
  id: string;
  customer: string;
  value: number;
  dueDate: string;
  description: string;
  installmentCount?: number;
  installmentValue?: number;
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' | 'UNDEFINED';
  status: 'PENDING' | 'RECEIVED' | 'CONFIRMED' | 'OVERDUE' | 'REFUNDED' | 'RECEIVED_IN_CASH' | 'REFUND_REQUESTED';
  invoiceUrl?: string;
  bankSlipUrl?: string;
  pixQrCode?: string;
}

/**
 * Cria ou atualiza um cliente no Asaas
 */
export async function createAsaasCustomer(data: {
  name: string;
  email: string;
  phone: string;
  cpfCnpj?: string;
  externalReference?: string; // leadId para referência
}): Promise<AsaasCustomer | null> {
  try {
    const response = await fetch(`${ASAAS_API_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        mobilePhone: data.phone.replace(/\D/g, ''), // Remove formatação
        cpfCnpj: data.cpfCnpj?.replace(/\D/g, ''),
        externalReference: data.externalReference,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao criar cliente no Asaas:', errorData);
      return null;
    }

    const customer = await response.json();
    console.log('✅ Cliente criado no Asaas:', customer.id);
    return customer;
  } catch (error) {
    console.error('Erro na requisição para Asaas:', error);
    return null;
  }
}

/**
 * Cria uma cobrança no Asaas com parcelamento
 */
export async function createAsaasCharge(data: {
  customerId: string;
  value: number; // Valor em reais (ex: 497.00)
  description: string;
  installmentCount?: number; // Número de parcelas (1 a 12)
  dueDate?: string; // Data de vencimento (YYYY-MM-DD)
  externalReference?: string; // leadId para referência
}): Promise<AsaasCharge | null> {
  try {
    // Calcular data de vencimento (7 dias a partir de hoje se não informado)
    const dueDate = data.dueDate || calculateDueDate(7);

    const payload: any = {
      customer: data.customerId,
      value: data.value,
      dueDate: dueDate,
      description: data.description,
      billingType: 'CREDIT_CARD', // Permite cartão e outras formas
      externalReference: data.externalReference,
    };

    // Adicionar parcelamento se solicitado
    if (data.installmentCount && data.installmentCount > 1) {
      payload.installmentCount = data.installmentCount;
      payload.installmentValue = parseFloat((data.value / data.installmentCount).toFixed(2));
    }

    const response = await fetch(`${ASAAS_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao criar cobrança no Asaas:', errorData);
      return null;
    }

    const charge = await response.json();
    console.log('✅ Cobrança criada no Asaas:', charge.id);
    return charge;
  } catch (error) {
    console.error('Erro na requisição para Asaas:', error);
    return null;
  }
}

/**
 * Busca uma cobrança pelo ID
 */
export async function getAsaasCharge(chargeId: string): Promise<AsaasCharge | null> {
  try {
    const response = await fetch(`${ASAAS_API_URL}/payments/${chargeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      },
    });

    if (!response.ok) {
      console.error('Erro ao buscar cobrança no Asaas');
      return null;
    }

    const charge = await response.json();
    return charge;
  } catch (error) {
    console.error('Erro na requisição para Asaas:', error);
    return null;
  }
}

/**
 * Gera link de pagamento para o cliente
 * O Asaas retorna diferentes URLs dependendo do tipo de pagamento
 */
export function getAsaasPaymentUrl(charge: AsaasCharge): string {
  // URL padrão da fatura (permite escolher forma de pagamento)
  if (charge.invoiceUrl) {
    return charge.invoiceUrl;
  }

  // Fallback: construir URL baseada no ID
  return `https://www.asaas.com/c/${charge.id}`;
}

/**
 * Verifica se um pagamento foi confirmado
 */
export async function checkAsaasPaymentStatus(chargeId: string): Promise<boolean> {
  const charge = await getAsaasCharge(chargeId);

  if (!charge) {
    return false;
  }

  // Status que indicam pagamento confirmado
  return ['RECEIVED', 'CONFIRMED', 'RECEIVED_IN_CASH'].includes(charge.status);
}

/**
 * Calcula data de vencimento (dias a partir de hoje)
 */
function calculateDueDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
}

/**
 * Formata valor em reais para exibição
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Função auxiliar: cria cliente + cobrança em uma única chamada
 * Ideal para usar no admin ao enviar link de pagamento
 */
export async function createPaymentForLead(leadData: {
  leadId: string;
  nome: string;
  email: string;
  whatsapp: string;
  valor: number; // Valor total em reais (ex: 497.00)
  installments?: number; // Padrão: 12x
}): Promise<{ success: boolean; paymentUrl?: string; error?: string }> {
  try {
    // 1. Criar cliente no Asaas
    const customer = await createAsaasCustomer({
      name: leadData.nome,
      email: leadData.email,
      phone: leadData.whatsapp,
      externalReference: leadData.leadId,
    });

    if (!customer) {
      return { success: false, error: 'Erro ao criar cliente no Asaas' };
    }

    // 2. Criar cobrança com parcelamento
    const charge = await createAsaasCharge({
      customerId: customer.id,
      value: leadData.valor,
      description: `Site Profissional - ${leadData.nome}`,
      installmentCount: leadData.installments || 12,
      externalReference: leadData.leadId,
    });

    if (!charge) {
      return { success: false, error: 'Erro ao criar cobrança no Asaas' };
    }

    // 3. Gerar link de pagamento
    const paymentUrl = getAsaasPaymentUrl(charge);

    return {
      success: true,
      paymentUrl: paymentUrl,
    };
  } catch (error) {
    console.error('Erro em createPaymentForLead:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// Tipos exportados
export type { AsaasCustomer, AsaasCharge };
