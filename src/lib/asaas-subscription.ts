/**
 * Asaas Subscription Management
 *
 * Gerenciamento de assinaturas recorrentes para manutenção mensal
 * (R$ 97/mês após o primeiro ano)
 */

import { supabase } from './supabase';

// Configuração - usar variáveis de ambiente
const ASAAS_API_KEY = import.meta.env.VITE_ASAAS_API_KEY;
const ASAAS_ENV = import.meta.env.VITE_ASAAS_ENV || 'sandbox';

// URLs da API
const ASAAS_API_URL = ASAAS_ENV === 'production'
  ? 'https://api.asaas.com/v3'
  : 'https://sandbox.asaas.com/api/v3';

// Tipos
export interface AsaasSubscription {
  id: string;
  customer: string;
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' | 'UNDEFINED';
  value: number;
  nextDueDate: string;
  cycle: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'BIMONTHLY' | 'QUARTERLY' | 'SEMIANNUALLY' | 'YEARLY';
  description?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'INACTIVE';
  externalReference?: string;
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
 * Criar assinatura recorrente de manutenção
 *
 * @param data - Dados da assinatura
 * @returns Assinatura criada ou null
 */
export async function createMaintenanceSubscription(data: {
  customerId: string;
  value: number; // Valor mensal (ex: 97.00)
  nextDueDate: string; // Data da primeira cobrança (YYYY-MM-DD)
  description?: string;
  externalReference?: string; // leadId
}): Promise<AsaasSubscription | null> {
  try {
    console.log('🔄 Criando assinatura de manutenção no Asaas...');

    const response = await fetch(`${ASAAS_API_URL}/subscriptions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        customer: data.customerId,
        billingType: 'UNDEFINED', // Cliente pode escolher forma de pagamento
        value: data.value,
        nextDueDate: data.nextDueDate,
        cycle: 'MONTHLY', // Cobrança mensal
        description: data.description || 'Manutenção Mensal - Hospedagem + Domínio + Suporte',
        externalReference: data.externalReference,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro ao criar assinatura:', response.status, errorText);
      return null;
    }

    const subscription: AsaasSubscription = await response.json();
    console.log('✅ Assinatura criada:', subscription.id);
    return subscription;
  } catch (error) {
    console.error('❌ Erro ao criar assinatura:', error);
    return null;
  }
}

/**
 * Agendar criação de assinatura após 1 ano
 *
 * Esta função calcula a data de início da manutenção (1 ano após site no ar)
 * e salva no banco para ser processada depois
 */
export async function scheduleMaintenanceSubscription(data: {
  leadId: string;
  customerId: string;
  dataInicioServico: string; // Data que o site foi ao ar
  valorMensal: number; // R$ 97,00
}): Promise<boolean> {
  try {
    console.log('📅 Agendando assinatura de manutenção para lead:', data.leadId);

    // Calcular data de início da manutenção (1 ano após site no ar)
    const dataInicio = new Date(data.dataInicioServico);
    const dataInicioManutencao = new Date(dataInicio);
    dataInicioManutencao.setFullYear(dataInicio.getFullYear() + 1);

    // Atualizar lead com informações da assinatura agendada
    const { error } = await supabase
      .from('leads')
      .update({
        data_inicio_servico: data.dataInicioServico,
        proxima_cobranca_manutencao: dataInicioManutencao.toISOString(),
        status_assinatura: 'agendada',
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.leadId);

    if (error) {
      console.error('❌ Erro ao agendar assinatura:', error);
      return false;
    }

    console.log('✅ Assinatura agendada para:', dataInicioManutencao.toISOString().split('T')[0]);
    return true;
  } catch (error) {
    console.error('❌ Erro ao agendar assinatura:', error);
    return false;
  }
}

/**
 * Ativar assinatura de manutenção
 *
 * Chamada quando chega a data de iniciar a manutenção (1 ano após site no ar)
 */
export async function activateMaintenanceSubscription(data: {
  leadId: string;
  customerId: string;
  valorMensal: number;
}): Promise<{
  success: boolean;
  subscription?: AsaasSubscription;
  error?: string;
}> {
  try {
    console.log('🔄 Ativando assinatura de manutenção para lead:', data.leadId);

    // Buscar informações do lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', data.leadId)
      .single();

    if (leadError || !lead) {
      return {
        success: false,
        error: 'Lead não encontrado',
      };
    }

    // Calcular próxima data de cobrança (hoje + 1 mês)
    const proximaCobranca = new Date();
    proximaCobranca.setMonth(proximaCobranca.getMonth() + 1);
    const proximaCobrancaStr = proximaCobranca.toISOString().split('T')[0];

    // Criar assinatura no Asaas
    const subscription = await createMaintenanceSubscription({
      customerId: data.customerId,
      value: data.valorMensal,
      nextDueDate: proximaCobrancaStr,
      description: `Manutenção Mensal - ${lead.nome}`,
      externalReference: data.leadId,
    });

    if (!subscription) {
      return {
        success: false,
        error: 'Não foi possível criar a assinatura no Asaas',
      };
    }

    // Atualizar lead com ID da assinatura
    const { error: updateError } = await supabase
      .from('leads')
      .update({
        assinatura_manutencao_id: subscription.id,
        status_assinatura: 'ativa',
        proxima_cobranca_manutencao: proximaCobranca.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.leadId);

    if (updateError) {
      console.error('❌ Erro ao atualizar lead:', updateError);
      // Não retornar erro aqui, pois a assinatura foi criada
    }

    console.log('✅ Assinatura ativada com sucesso!');

    return {
      success: true,
      subscription,
    };
  } catch (error) {
    console.error('❌ Erro ao ativar assinatura:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

/**
 * Cancelar assinatura de manutenção
 */
export async function cancelMaintenanceSubscription(subscriptionId: string): Promise<boolean> {
  try {
    console.log('🔄 Cancelando assinatura:', subscriptionId);

    const response = await fetch(`${ASAAS_API_URL}/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro ao cancelar assinatura:', response.status, errorText);
      return false;
    }

    console.log('✅ Assinatura cancelada com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao cancelar assinatura:', error);
    return false;
  }
}

/**
 * Consultar status de uma assinatura
 */
export async function getSubscriptionStatus(subscriptionId: string): Promise<AsaasSubscription | null> {
  try {
    const response = await fetch(`${ASAAS_API_URL}/subscriptions/${subscriptionId}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      console.error('❌ Erro ao consultar assinatura:', response.status);
      return null;
    }

    const subscription: AsaasSubscription = await response.json();
    return subscription;
  } catch (error) {
    console.error('❌ Erro ao consultar assinatura:', error);
    return null;
  }
}

/**
 * Verificar assinaturas que precisam ser ativadas
 * (chamado por cron job ou manualmente)
 */
export async function checkPendingSubscriptions(): Promise<void> {
  try {
    console.log('🔍 Verificando assinaturas pendentes...');

    // Buscar leads que precisam ativar assinatura
    const hoje = new Date().toISOString().split('T')[0];

    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .eq('status_assinatura', 'agendada')
      .lte('proxima_cobranca_manutencao', hoje);

    if (error) {
      console.error('❌ Erro ao buscar leads:', error);
      return;
    }

    if (!leads || leads.length === 0) {
      console.log('ℹ️ Nenhuma assinatura pendente');
      return;
    }

    console.log(`📊 Encontradas ${leads.length} assinatura(s) para ativar`);

    // Ativar cada assinatura
    for (const lead of leads) {
      console.log(`🔄 Processando lead: ${lead.nome} (${lead.id})`);

      await activateMaintenanceSubscription({
        leadId: lead.id,
        customerId: lead.asaas_customer_id,
        valorMensal: 97, // R$ 97,00
      });
    }

    console.log('✅ Verificação de assinaturas concluída');
  } catch (error) {
    console.error('❌ Erro ao verificar assinaturas pendentes:', error);
  }
}
