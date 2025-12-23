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

  // Status do lead (novo fluxo)
  status: 'novo' | 'em_producao' | 'aguardando_aprovacao' | 'aprovado_pagamento' |
          'em_ajustes' | 'aprovacao_final' | 'no_ar' | 'concluido';

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

  // IDs de pagamento Stripe (legado - manter por compatibilidade)
  stripe_payment_intent_entrada?: string;
  stripe_payment_intent_saldo?: string;

  // IDs de pagamento Mercado Pago (novo)
  mercadopago_preference_id?: string;
  mercadopago_payment_id?: string;
  mercadopago_payment_url?: string;

  // URLs
  preview_url?: string;
  site_final_url?: string;

  // Controle de aprovações e ajustes
  rodadas_ajustes_usadas: number; // máximo 2
  data_aprovacao_inicial?: string; // primeira aprovação
  data_aprovacao_final?: string; // aprovação após ajustes
  data_limite_publicacao?: string; // 24h após aprovação final

  // Controle (legado - manter por compatibilidade)
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
  tipo: 'entrada' | 'saldo' | 'total'; // 'total' = 100% parcelado
  valor: number; // em centavos
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';

  // Stripe (legado)
  stripe_payment_intent_id?: string;
  stripe_session_id?: string;
  stripe_customer_id?: string;

  // Mercado Pago (novo)
  mercadopago_payment_id?: string;
  mercadopago_preference_id?: string;
  payment_url?: string; // link para cliente pagar

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
/**
 * Criar lead parcial (captura silenciosa após página 1)
 * Status: 'lead_parcial' - para remarketing de abandonos
 */
export async function createPartialLead(data: {
  nome: string;
  email: string;
  whatsapp: string;
  nome_consultorio: string;
}) {
  try {
    const { data: lead, error } = await supabase
      .from('leads')
      .insert([
        {
          nome: data.nome,
          email: data.email,
          whatsapp: data.whatsapp,
          briefing_data: {
            nome_consultorio: data.nome_consultorio,
            nome: data.nome,
            email: data.email,
            whatsapp: data.whatsapp,
            capturado_em: new Date().toISOString(),
          },
          valor_total: 49700,
          valor_entrada: 24850,
          valor_saldo: 24850,
          status: 'lead_parcial',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar lead parcial:', error);
      return null;
    }

    return lead;
  } catch (error) {
    console.error('Erro ao criar lead parcial:', error);
    return null;
  }
}

/**
 * Atualizar lead parcial para completo
 * Marca origem como 'convertido_de_lead' para tracking de remarketing
 */
export async function updateLeadToComplete(leadId: string, data: {
  nome: string;
  email: string;
  whatsapp: string;
  briefing_data: any;
}) {
  try {
    const { data: lead, error } = await supabase
      .from('leads')
      .update({
        nome: data.nome,
        email: data.email,
        whatsapp: data.whatsapp,
        briefing_data: data.briefing_data,
        status: 'novo',
        origem: 'convertido_de_lead', // Tag para identificar leads convertidos
      })
      .eq('id', leadId)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar lead:', error);
      throw error;
    }

    return lead;
  } catch (error) {
    console.error('Erro ao atualizar lead:', error);
    throw error;
  }
}

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

// =============================================
// FUNÇÕES DE AGENDAMENTO
// =============================================

export interface Agendamento {
  id: string;
  created_at: string;
  updated_at: string;
  lead_id?: string;
  nome: string;
  email: string;
  whatsapp: string;
  empresa?: string;
  data: string; // formato YYYY-MM-DD
  horario: string; // formato HH:MM
  duracao: number;
  status: 'agendado' | 'confirmado' | 'realizado' | 'cancelado' | 'remarcado';
  tipo: 'comercial' | 'alinhamento' | 'aprovacao' | 'suporte';
  observacoes?: string;
  motivo_cancelamento?: string;
  link_reuniao?: string;
  lembrete_enviado: boolean;
  lembrete_enviado_at?: string;
  confirmado_at?: string;
  realizado_at?: string;
  cancelado_at?: string;
}

export interface Disponibilidade {
  id: string;
  dia_semana: number; // 0 = Domingo, 6 = Sábado
  horario_inicio: string;
  horario_fim: string;
  ativo: boolean;
  duracao_slot: number;
}

export interface HorarioDisponivel {
  horario: string;
}

/**
 * Criar novo agendamento
 */
export async function createAgendamento(data: {
  nome: string;
  email: string;
  whatsapp: string;
  empresa?: string;
  data: string;
  horario: string;
  tipo?: string;
  observacoes?: string;
  lead_id?: string;
}) {
  // Preparar dados para inserção
  const insertData: any = {
    nome: data.nome,
    email: data.email,
    whatsapp: data.whatsapp,
    data: data.data,
    horario: data.horario,
    tipo: data.tipo || 'comercial',
    status: 'agendado',
  };

  // Adicionar campos opcionais apenas se tiverem valor
  if (data.empresa) insertData.empresa = data.empresa;
  if (data.observacoes) insertData.observacoes = data.observacoes;
  if (data.lead_id) insertData.lead_id = data.lead_id;

  console.log('[DEBUG] Criando agendamento com dados:', insertData);

  // Tentar INSERT sem SELECT primeiro (o SELECT pode estar sendo bloqueado por RLS)
  const { data: agendamento, error } = await supabase
    .from('agendamentos')
    .insert(insertData);

  if (error) {
    console.error('[ERROR] Erro ao criar agendamento:', error);
    console.error('[ERROR] Detalhes completos:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      status: error.status,
    });
    throw error;
  }

  console.log('[SUCCESS] Agendamento criado (sem retorno de dados)');

  // Retornar um objeto básico sem fazer SELECT
  return {
    id: 'created',
    nome: insertData.nome,
    email: insertData.email,
    data: insertData.data,
    horario: insertData.horario,
  } as any;
}

/**
 * Listar horários disponíveis de uma data
 */
export async function listarHorariosDisponiveis(data: string): Promise<string[]> {
  const { data: horarios, error } = await supabase
    .rpc('listar_horarios_disponiveis', { p_data: data });

  if (error) {
    console.error('Erro ao listar horários disponíveis:', error);
    throw error;
  }

  return horarios.map((h: HorarioDisponivel) => h.horario);
}

/**
 * Verificar se um horário está disponível
 */
export async function verificarDisponibilidade(
  data: string,
  horario: string
): Promise<boolean> {
  const { data: disponivel, error } = await supabase
    .rpc('verificar_disponibilidade', {
      p_data: data,
      p_horario: horario,
    });

  if (error) {
    console.error('Erro ao verificar disponibilidade:', error);
    throw error;
  }

  return disponivel as boolean;
}

/**
 * Listar agendamentos
 */
export async function listarAgendamentos(filtros?: {
  status?: string;
  data_inicio?: string;
  data_fim?: string;
}): Promise<Agendamento[]> {
  let query = supabase
    .from('agendamentos')
    .select('*')
    .order('data', { ascending: true })
    .order('horario', { ascending: true });

  if (filtros?.status) {
    query = query.eq('status', filtros.status);
  }

  if (filtros?.data_inicio) {
    query = query.gte('data', filtros.data_inicio);
  }

  if (filtros?.data_fim) {
    query = query.lte('data', filtros.data_fim);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao listar agendamentos:', error);
    throw error;
  }

  return data as Agendamento[];
}

/**
 * Buscar agendamento por ID
 */
export async function getAgendamentoById(id: string): Promise<Agendamento> {
  const { data, error } = await supabase
    .from('agendamentos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar agendamento:', error);
    throw error;
  }

  return data as Agendamento;
}

/**
 * Atualizar status do agendamento
 */
export async function updateAgendamentoStatus(
  id: string,
  status: 'agendado' | 'confirmado' | 'realizado' | 'cancelado' | 'remarcado',
  motivoCancelamento?: string
) {
  const updateData: any = { status };

  if (status === 'confirmado') {
    updateData.confirmado_at = new Date().toISOString();
  } else if (status === 'realizado') {
    updateData.realizado_at = new Date().toISOString();
  } else if (status === 'cancelado') {
    updateData.cancelado_at = new Date().toISOString();
    updateData.motivo_cancelamento = motivoCancelamento;
  }

  const { data, error } = await supabase
    .from('agendamentos')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar status do agendamento:', error);
    throw error;
  }

  return data as Agendamento;
}

/**
 * Remarcar agendamento
 */
export async function remarcarAgendamento(
  id: string,
  novaData: string,
  novoHorario: string
) {
  const { data, error } = await supabase
    .from('agendamentos')
    .update({
      data: novaData,
      horario: novoHorario,
      status: 'agendado',
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao remarcar agendamento:', error);
    throw error;
  }

  return data as Agendamento;
}

/**
 * Listar disponibilidade configurada
 */
export async function listarDisponibilidade(): Promise<Disponibilidade[]> {
  const { data, error } = await supabase
    .from('disponibilidade')
    .select('*')
    .eq('ativo', true)
    .order('dia_semana', { ascending: true })
    .order('horario_inicio', { ascending: true });

  if (error) {
    console.error('Erro ao listar disponibilidade:', error);
    throw error;
  }

  return data as Disponibilidade[];
}

// =============================================
// FUNÇÕES DO BLOG
// =============================================

export interface BlogPost {
  id: string;
  created_at: string;
  updated_at: string;

  // Conteúdo
  title: string;
  slug: string;
  excerpt: string | null;
  content: any; // JSON do Tiptap
  featured_image: string | null;

  // SEO
  meta_title: string | null;
  meta_description: string | null;

  // Categorização
  category_id: string | null;
  category?: BlogCategory; // Join opcional

  // Tags (quando incluído com join)
  tags?: BlogTag[];

  // Autor
  author_id: string | null;
  author_name: string;

  // Status
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;

  // Analytics
  view_count: number;
}

export interface BlogCategory {
  id: string;
  created_at: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  display_order: number;
}

export interface BlogTag {
  id: string;
  created_at: string;
  name: string;
  slug: string;
}

/**
 * Listar posts do blog (frontend público)
 * Retorna apenas posts publicados
 */
export async function listBlogPosts(params?: {
  page?: number;
  limit?: number;
  categorySlug?: string;
  tagSlug?: string;
  search?: string;
}) {
  const { page = 1, limit = 10, categorySlug, tagSlug, search } = params || {};
  const offset = (page - 1) * limit;

  let query = supabase
    .from('blog_posts')
    .select(
      `
      *,
      category:blog_categories(*),
      tags:blog_post_tags(tag:blog_tags(*))
    `,
      { count: 'exact' }
    )
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  // Filtro por categoria
  if (categorySlug) {
    const { data: category } = await supabase
      .from('blog_categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();

    if (category) {
      query = query.eq('category_id', category.id);
    }
  }

  // Filtro por tag
  if (tagSlug) {
    const { data: tag } = await supabase
      .from('blog_tags')
      .select('id')
      .eq('slug', tagSlug)
      .single();

    if (tag) {
      const { data: postIds } = await supabase
        .from('blog_post_tags')
        .select('post_id')
        .eq('tag_id', tag.id);

      if (postIds && postIds.length > 0) {
        query = query.in(
          'id',
          postIds.map((p) => p.post_id)
        );
      }
    }
  }

  // Busca textual
  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Erro ao listar posts:', error);
    throw error;
  }

  return {
    posts: data || [],
    total: count || 0,
    pages: Math.ceil((count || 0) / limit),
    currentPage: page,
  };
}

/**
 * Buscar post por slug (frontend público)
 * Incrementa contador de visualizações automaticamente
 */
export async function getBlogPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(
      `
      *,
      category:blog_categories(*),
      tags:blog_post_tags(tag:blog_tags(*))
    `
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    console.error('Erro ao buscar post:', error);
    throw error;
  }

  // Incrementar view_count (chamada assíncrona, não espera)
  supabase.rpc('increment_post_views', { post_id: data.id }).then(() => {
    // Silenciosamente incrementa, não afeta o retorno
  });

  return data as BlogPost;
}

/**
 * Buscar posts relacionados (mesma categoria ou tags em comum)
 */
export async function getRelatedPosts(postId: string, limit = 3) {
  const { data, error } = await supabase.rpc('get_related_posts', {
    p_post_id: postId,
    p_limit: limit,
  });

  if (error) {
    console.error('Erro ao buscar posts relacionados:', error);
    throw error;
  }

  return data || [];
}

/**
 * Admin: Listar todos os posts (incluindo drafts)
 */
export async function listAllBlogPosts(params?: {
  status?: 'draft' | 'published' | 'archived';
  limit?: number;
  offset?: number;
}) {
  const { status, limit = 50, offset = 0 } = params || {};

  let query = supabase
    .from('blog_posts')
    .select(
      `
      *,
      category:blog_categories(name, slug)
    `,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Erro ao listar posts (admin):', error);
    throw error;
  }

  return {
    posts: data || [],
    total: count || 0,
  };
}

/**
 * Admin: Buscar post por ID (incluindo drafts)
 */
export async function getBlogPostById(id: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(
      `
      *,
      category:blog_categories(*),
      tags:blog_post_tags(tag:blog_tags(*))
    `
    )
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar post por ID:', error);
    throw error;
  }

  return data as BlogPost;
}

/**
 * Admin: Criar novo post
 */
export async function createBlogPost(
  post: {
    title: string;
    slug: string;
    excerpt?: string;
    content: any;
    featured_image?: string;
    meta_title?: string;
    meta_description?: string;
    category_id?: string;
    author_name: string;
    status?: 'draft' | 'published';
  },
  tagIds: string[] = []
) {
  const { data: { user } } = await supabase.auth.getUser();

  const postData: any = {
    title: post.title,
    slug: post.slug,
    content: post.content,
    author_name: post.author_name,
    author_id: user?.id || null,
    status: post.status || 'draft',
  };

  if (post.excerpt) postData.excerpt = post.excerpt;
  if (post.featured_image) postData.featured_image = post.featured_image;
  if (post.meta_title) postData.meta_title = post.meta_title;
  if (post.meta_description) postData.meta_description = post.meta_description;
  if (post.category_id) postData.category_id = post.category_id;

  if (post.status === 'published') {
    postData.published_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .insert([postData])
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar post:', error);
    throw error;
  }

  // Associar tags
  if (tagIds.length > 0) {
    const { error: tagError } = await supabase.from('blog_post_tags').insert(
      tagIds.map((tagId) => ({
        post_id: data.id,
        tag_id: tagId,
      }))
    );

    if (tagError) {
      console.error('Erro ao associar tags:', tagError);
    }
  }

  return data as BlogPost;
}

/**
 * Admin: Atualizar post existente
 */
export async function updateBlogPost(
  id: string,
  updates: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: any;
    featured_image?: string;
    meta_title?: string;
    meta_description?: string;
    category_id?: string;
    status?: 'draft' | 'published' | 'archived';
  },
  tagIds?: string[]
) {
  const updateData: any = { ...updates };

  // Se mudar para published e ainda não tem published_at, definir agora
  if (updates.status === 'published') {
    const { data: currentPost } = await supabase
      .from('blog_posts')
      .select('published_at')
      .eq('id', id)
      .single();

    if (currentPost && !currentPost.published_at) {
      updateData.published_at = new Date().toISOString();
    }
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar post:', error);
    throw error;
  }

  // Atualizar tags se fornecidas
  if (tagIds !== undefined) {
    // Remover tags antigas
    await supabase.from('blog_post_tags').delete().eq('post_id', id);

    // Adicionar novas tags
    if (tagIds.length > 0) {
      await supabase.from('blog_post_tags').insert(
        tagIds.map((tagId) => ({
          post_id: id,
          tag_id: tagId,
        }))
      );
    }
  }

  return data as BlogPost;
}

/**
 * Admin: Deletar post
 */
export async function deleteBlogPost(id: string) {
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);

  if (error) {
    console.error('Erro ao deletar post:', error);
    throw error;
  }

  return true;
}

/**
 * Listar todas as categorias
 */
export async function listCategories() {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Erro ao listar categorias:', error);
    throw error;
  }

  return data as BlogCategory[];
}

/**
 * Buscar categoria por slug
 */
export async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Erro ao buscar categoria:', error);
    throw error;
  }

  return data as BlogCategory;
}

/**
 * Admin: Criar categoria
 */
export async function createCategory(category: {
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  display_order?: number;
}) {
  const { data, error } = await supabase
    .from('blog_categories')
    .insert([category])
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar categoria:', error);
    throw error;
  }

  return data as BlogCategory;
}

/**
 * Admin: Atualizar categoria
 */
export async function updateCategory(id: string, updates: Partial<BlogCategory>) {
  const { data, error } = await supabase
    .from('blog_categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar categoria:', error);
    throw error;
  }

  return data as BlogCategory;
}

/**
 * Admin: Deletar categoria
 */
export async function deleteCategory(id: string) {
  const { error } = await supabase
    .from('blog_categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar categoria:', error);
    throw error;
  }

  return true;
}

/**
 * Listar todas as tags
 */
export async function listTags() {
  const { data, error } = await supabase
    .from('blog_tags')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Erro ao listar tags:', error);
    throw error;
  }

  return data as BlogTag[];
}

/**
 * Buscar tag por slug
 */
export async function getTagBySlug(slug: string) {
  const { data, error } = await supabase
    .from('blog_tags')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Erro ao buscar tag:', error);
    throw error;
  }

  return data as BlogTag;
}

/**
 * Admin: Criar tag
 */
export async function createTag(tag: { name: string; slug: string }) {
  const { data, error } = await supabase
    .from('blog_tags')
    .insert([tag])
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar tag:', error);
    throw error;
  }

  return data as BlogTag;
}

/**
 * Admin: Atualizar tag
 */
export async function updateTag(id: string, updates: { name?: string; slug?: string }) {
  const { data, error } = await supabase
    .from('blog_tags')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar tag:', error);
    throw error;
  }

  return data as BlogTag;
}

/**
 * Admin: Deletar tag
 */
export async function deleteTag(id: string) {
  const { error } = await supabase.from('blog_tags').delete().eq('id', id);

  if (error) {
    console.error('Erro ao deletar tag:', error);
    throw error;
  }

  return true;
}

/**
 * Upload de imagem do blog para o storage
 */
export async function uploadBlogImage(file: File, postId?: string) {
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const folder = postId || 'temp';
  const fileName = `${folder}/${timestamp}-${sanitizedName}`;

  const { data, error } = await supabase.storage
    .from('blog-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Erro ao fazer upload de imagem do blog:', error);
    throw error;
  }

  // Obter URL pública
  const {
    data: { publicUrl },
  } = supabase.storage.from('blog-images').getPublicUrl(fileName);

  return {
    path: data.path,
    url: publicUrl,
  };
}

/**
 * Buscar estatísticas do blog
 */
export async function getBlogStats() {
  const { data, error } = await supabase.rpc('blog_stats');

  if (error) {
    console.error('Erro ao buscar estatísticas do blog:', error);
    throw error;
  }

  return data && data.length > 0 ? data[0] : null;
}
