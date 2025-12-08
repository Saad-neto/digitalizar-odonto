import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Configuração do Supabase incompleta. ' +
    'Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env'
  );
}

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Tipos TypeScript para as tabelas

export interface Lead {
  id: string;
  created_at: string;
  updated_at: string;

  // Status do lead
  status: 'novo' | 'pago_50' | 'em_producao' | 'em_aprovacao' | 'pago_100' | 'concluido';

  // Informações pessoais
  nome: string;
  email: string;
  whatsapp: string;

  // Dados do briefing (JSONB)
  briefing_data: any;

  // Valores
  valor_total: number; // em centavos
  valor_entrada: number; // 50%
  valor_saldo: number; // 50%

  // IDs de pagamento Stripe
  stripe_payment_intent_entrada?: string;
  stripe_payment_intent_saldo?: string;

  // URLs
  preview_url?: string;
  site_final_url?: string;

  // Controle
  pago_entrada_at?: string;
  pago_saldo_at?: string;
  aprovado_at?: string;
  concluido_at?: string;
}

export interface Payment {
  id: string;
  created_at: string;

  // Relação com lead
  lead_id: string;

  // Dados do pagamento
  tipo: 'entrada' | 'saldo';
  valor: number; // em centavos
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';

  // Stripe
  stripe_payment_intent_id: string;
  stripe_session_id?: string;
  stripe_customer_id?: string;

  // Metadados
  metadata?: any;

  // Timestamps
  paid_at?: string;
  canceled_at?: string;
}

export interface LeadStatusHistory {
  id: string;
  lead_id: string;
  old_status: string | null;
  new_status: string;
  changed_by: string | null;
  changed_at: string;
  created_at: string;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  note: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// Funções auxiliares para trabalhar com leads

/**
 * Criar um novo lead no Supabase
 */
export async function createLead(data: {
  nome: string;
  email: string;
  whatsapp: string;
  briefing_data: any;
  valor_total?: number;
  valor_entrada?: number;
  valor_saldo?: number;
}) {
  const { data: lead, error } = await supabase
    .from('leads')
    .insert([
      {
        nome: data.nome,
        email: data.email,
        whatsapp: data.whatsapp,
        briefing_data: data.briefing_data,
        valor_total: data.valor_total || 49700, // R$ 497,00
        valor_entrada: data.valor_entrada || 24850, // R$ 248,50
        valor_saldo: data.valor_saldo || 24850, // R$ 248,50
        status: 'novo',
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar lead:', error);
    throw error;
  }

  return lead;
}

/**
 * Buscar lead por ID
 */
export async function getLeadById(id: string) {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar lead:', error);
    throw error;
  }

  return data as Lead;
}

/**
 * Atualizar status do lead
 */
export async function updateLeadStatus(
  id: string,
  status: Lead['status'],
  extraData?: Partial<Lead>
) {
  const { data, error } = await supabase
    .from('leads')
    .update({
      status,
      updated_at: new Date().toISOString(),
      ...extraData,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar status do lead:', error);
    throw error;
  }

  return data as Lead;
}

/**
 * Criar registro de pagamento
 */
export async function createPayment(data: {
  lead_id: string;
  tipo: 'entrada' | 'saldo';
  valor: number;
  stripe_payment_intent_id: string;
  stripe_session_id?: string;
  status?: 'pending' | 'succeeded' | 'failed';
}) {
  const { data: payment, error } = await supabase
    .from('payments')
    .insert([
      {
        lead_id: data.lead_id,
        tipo: data.tipo,
        valor: data.valor,
        stripe_payment_intent_id: data.stripe_payment_intent_id,
        stripe_session_id: data.stripe_session_id,
        status: data.status || 'pending',
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar pagamento:', error);
    throw error;
  }

  return payment as Payment;
}

/**
 * Atualizar status de pagamento
 */
export async function updatePaymentStatus(
  paymentIntentId: string,
  status: 'succeeded' | 'failed' | 'canceled'
) {
  const updateData: any = {
    status,
  };

  if (status === 'succeeded') {
    updateData.paid_at = new Date().toISOString();
  } else if (status === 'canceled') {
    updateData.canceled_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('payments')
    .update(updateData)
    .eq('stripe_payment_intent_id', paymentIntentId)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar pagamento:', error);
    throw error;
  }

  return data as Payment;
}

/**
 * Listar todos os leads com filtros opcionais
 */
export async function listLeads(filters?: {
  status?: Lead['status'];
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from('leads')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Erro ao listar leads:', error);
    throw error;
  }

  return { leads: data as Lead[], count };
}

/**
 * Upload de arquivo para o storage do Supabase
 */
export async function uploadFile(
  bucket: 'logos' | 'fotos' | 'depoimentos',
  leadId: string,
  file: File
) {
  const fileName = `${leadId}/${Date.now()}_${file.name}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Erro ao fazer upload do arquivo:', error);
    throw error;
  }

  // Obter URL pública do arquivo
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return {
    path: data.path,
    url: urlData.publicUrl,
  };
}

/**
 * Buscar histórico de mudanças de status de um lead
 */
export async function getLeadStatusHistory(leadId: string) {
  const { data, error } = await supabase
    .from('lead_status_history')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar histórico:', error);
    throw error;
  }

  return data as LeadStatusHistory[];
}

/**
 * Buscar notas de um lead
 */
export async function getLeadNotes(leadId: string) {
  const { data, error } = await supabase
    .from('lead_notes')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar notas:', error);
    throw error;
  }

  return data as LeadNote[];
}

/**
 * Adicionar nota a um lead
 */
export async function addLeadNote(leadId: string, note: string) {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('lead_notes')
    .insert([
      {
        lead_id: leadId,
        note,
        created_by: user?.id,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Erro ao adicionar nota:', error);
    throw error;
  }

  return data as LeadNote;
}

/**
 * Deletar nota
 */
export async function deleteLeadNote(noteId: string) {
  const { error } = await supabase
    .from('lead_notes')
    .delete()
    .eq('id', noteId);

  if (error) {
    console.error('Erro ao deletar nota:', error);
    throw error;
  }

  return true;
}
