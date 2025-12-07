# Planejamento: Tratamento de Dados Coletados

**Data:** 2025-12-07
**Status:** Planejamento Inicial

---

## 1. Situação Atual

- ✅ Tabelas criadas e funcionando
- ✅ Formulário capturando dados
- ✅ 2 leads já cadastrados via formulário
- ⏳ Próximo passo: Definir como processar e usar esses dados

---

## 2. Fluxo de Dados - Do Cadastro ao Site Publicado

```
┌─────────────────────────────────────────────────────────────┐
│ ETAPA 1: CAPTURA (Formulário)                                │
├─────────────────────────────────────────────────────────────┤
│ ✓ Cliente preenche formulário                                │
│ ✓ Dados salvos em leads.briefing_data (JSONB)               │
│ ✓ Status: "novo"                                             │
│ ✓ Email confirmação enviado ao cliente                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ ETAPA 2: PAGAMENTO ENTRADA (50%)                             │
├─────────────────────────────────────────────────────────────┤
│ • Cliente recebe link de pagamento                           │
│ • Processa pagamento via Stripe (R$ 248,50)                 │
│ • Webhook atualiza: status → "pago_50"                       │
│ • Registra: pago_entrada_at, stripe_payment_intent_entrada   │
│ • Cria registro em "payments" table                          │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ ETAPA 3: PRODUÇÃO DO SITE                                    │
├─────────────────────────────────────────────────────────────┤
│ • Admin recebe notificação de novo pedido                    │
│ • Lê briefing_data e cria site                               │
│ • Status atualizado: "em_producao"                           │
│ • Usa dados do briefing para preencher template              │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ ETAPA 4: APROVAÇÃO                                           │
├─────────────────────────────────────────────────────────────┤
│ • Site publicado em preview_url (temporário)                 │
│ • Status: "em_aprovacao"                                     │
│ • Cliente recebe link para visualizar                        │
│ • Cliente solicita ajustes ou aprova                         │
│ • Quando aprovado: aprovado_at = NOW()                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ ETAPA 5: PAGAMENTO SALDO (50%)                               │
├─────────────────────────────────────────────────────────────┤
│ • Cliente recebe link de pagamento do saldo                  │
│ • Processa pagamento (R$ 248,50)                            │
│ • Webhook atualiza: status → "pago_100"                      │
│ • Registra: pago_saldo_at, stripe_payment_intent_saldo      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ ETAPA 6: PUBLICAÇÃO FINAL                                    │
├─────────────────────────────────────────────────────────────┤
│ • Site publicado em domínio definitivo                       │
│ • site_final_url preenchido                                  │
│ • Status: "concluido"                                        │
│ • concluido_at = NOW()                                       │
│ • Email de entrega enviado                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Tratamento de Dados do Briefing

### 3.1 Dados Obrigatórios (Validação no Frontend)

```javascript
// Campos que DEVEM existir
const camposObrigatorios = {
  // Contato
  nome: string,              // Nome do dentista
  email: string,             // Email de contato
  whatsapp: string,          // WhatsApp formatado

  // Profissional
  consultorio: string,       // Nome da clínica
  especialidades: array,     // Array de especialidades
  cidade: string,            // Cidade de atuação
  estado: string,            // Estado (UF)
}
```

### 3.2 Dados Opcionais (Enriquecem o site)

```javascript
const camposOpcionais = {
  // Profissional
  anos_experiencia: string,
  crm: string,               // CRO + número

  // Branding
  tem_logo: boolean,
  cores_preferidas: array,   // Array de cores hex
  site_referencia: string,   // URL de inspiração

  // Serviços
  horario_atendimento: string,
  aceita_convenio: boolean,
  convenios: array,          // Se aceita

  // Conteúdo
  diferenciais: array,       // Diferenciais da clínica
  sobre: text,               // Texto sobre o dentista
  formacao: array,           // Formações acadêmicas
}
```

### 3.3 Processamento e Uso dos Dados

**a) Geração Automática do Site**

```javascript
// Exemplo: src/lib/generateSite.js

async function generateSiteFromBriefing(leadId) {
  // 1. Buscar dados do lead
  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single();

  const briefing = lead.briefing_data;

  // 2. Preencher template com dados
  const siteData = {
    hero: {
      title: `${briefing.consultorio}`,
      subtitle: `${briefing.especialidades.join(' | ')}`,
      location: `${briefing.cidade} - ${briefing.estado}`,
      ctaText: 'Agende sua consulta',
      ctaLink: `https://wa.me/${sanitizePhone(lead.whatsapp)}`,
    },

    about: {
      name: lead.nome,
      experience: briefing.anos_experiencia,
      crm: briefing.crm,
      bio: briefing.sobre || 'Dentista especializado...',
    },

    services: {
      specialties: briefing.especialidades.map(esp => ({
        name: esp,
        description: getServiceDescription(esp),
        icon: getServiceIcon(esp),
      })),
    },

    contact: {
      whatsapp: lead.whatsapp,
      email: lead.email,
      address: `${briefing.cidade} - ${briefing.estado}`,
      schedule: briefing.horario_atendimento,
    },

    branding: {
      colors: {
        primary: briefing.cores_preferidas?.[0] || '#0066CC',
        secondary: briefing.cores_preferidas?.[1] || '#00AAFF',
      },
      logo: briefing.logo_url || null,
    },
  };

  // 3. Gerar site estático
  await buildStaticSite(siteData, leadId);

  // 4. Deploy em preview
  const previewUrl = await deployToPreview(leadId);

  // 5. Atualizar banco
  await supabase
    .from('leads')
    .update({
      status: 'em_aprovacao',
      preview_url: previewUrl,
    })
    .eq('id', leadId);

  return previewUrl;
}
```

**b) Validação e Sanitização**

```javascript
// src/lib/dataValidation.js

function sanitizeBriefingData(rawData) {
  return {
    // Sanitizar texto (prevenir XSS)
    consultorio: sanitizeHTML(rawData.consultorio),
    nome: sanitizeHTML(rawData.nome),

    // Normalizar telefone
    whatsapp: normalizePhone(rawData.whatsapp), // Remove formatação

    // Validar email
    email: validateEmail(rawData.email) ? rawData.email.toLowerCase() : null,

    // Validar URLs
    site_referencia: isValidURL(rawData.site_referencia) ? rawData.site_referencia : null,

    // Garantir arrays
    especialidades: Array.isArray(rawData.especialidades)
      ? rawData.especialidades
      : [],

    // Sanitizar cores
    cores_preferidas: rawData.cores_preferidas?.map(cor =>
      isValidHexColor(cor) ? cor : null
    ).filter(Boolean),
  };
}
```

**c) Enriquecimento Automático**

```javascript
// Adicionar dados automáticos baseado em inputs

function enrichBriefingData(briefing) {
  return {
    ...briefing,

    // Gerar slug para URL
    slug: generateSlug(briefing.consultorio),

    // Inferir região
    regiao: inferRegiao(briefing.estado),

    // Gerar meta tags SEO
    seo: {
      title: `${briefing.consultorio} - ${briefing.cidade}`,
      description: `${briefing.especialidades.join(', ')} em ${briefing.cidade}. Agende sua consulta!`,
      keywords: [...briefing.especialidades, briefing.cidade, 'dentista'].join(', '),
    },

    // Buscar dados adicionais (ex: CEP da cidade)
    geocoding: await fetchCityData(briefing.cidade, briefing.estado),
  };
}
```

---

## 4. Automações Necessárias

### 4.1 Email Marketing (Transacional)

**Triggers de Email:**

| Evento | Destinatário | Template | Dados Necessários |
|--------|--------------|----------|-------------------|
| Lead criado | Cliente | Bem-vindo + Próximos passos | nome, email |
| Pagamento entrada | Cliente | Confirmação + Prazo entrega | nome, preview_url (futura) |
| Site em aprovação | Cliente | Link preview + Instruções | preview_url |
| Aprovação confirmada | Admin | Notificação | nome, preview_url |
| Pagamento saldo | Cliente | Confirmação | site_final_url |
| Site concluído | Cliente | Entrega final + Tutorial | site_final_url, credenciais |
| Lead 24h sem ação | Admin | Alerta follow-up | nome, email, whatsapp |

**Implementação:**

```javascript
// src/lib/emailAutomation.js

const emailTemplates = {
  leadCriado: (lead) => ({
    to: lead.email,
    subject: `Bem-vindo, ${lead.nome.split(' ')[0]}! Vamos criar seu site`,
    template: 'welcome',
    data: {
      nome: lead.nome,
      proximo_passo: 'Realizar pagamento da entrada (50%)',
      link_pagamento: generatePaymentLink(lead.id, 'entrada'),
    },
  }),

  pagoEntrada: (lead) => ({
    to: lead.email,
    subject: 'Pagamento confirmado! Seu site está em produção',
    template: 'payment-confirmed',
    data: {
      nome: lead.nome,
      prazo_entrega: '24 horas',
      valor_pago: 'R$ 248,50',
    },
  }),

  emAprovacao: (lead) => ({
    to: lead.email,
    subject: 'Seu site está pronto para aprovação!',
    template: 'approval-ready',
    data: {
      nome: lead.nome,
      preview_url: lead.preview_url,
      instrucoes: 'Clique no link acima para visualizar...',
    },
  }),

  // ... outros templates
};
```

### 4.2 Webhooks Stripe

**Eventos a processar:**

```javascript
// src/api/webhooks/stripe.js

async function handleStripeWebhook(event) {
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object);
      break;

    case 'payment_intent.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;

    case 'charge.refunded':
      await handleRefund(event.data.object);
      break;
  }
}

async function handlePaymentSuccess(paymentIntent) {
  const leadId = paymentIntent.metadata.lead_id;
  const tipo = paymentIntent.metadata.tipo; // 'entrada' ou 'saldo'

  // 1. Criar registro de pagamento
  await supabase.from('payments').insert({
    lead_id: leadId,
    tipo: tipo,
    valor: paymentIntent.amount,
    status: 'succeeded',
    stripe_payment_intent_id: paymentIntent.id,
    paid_at: new Date(),
  });

  // 2. Atualizar lead
  const updates = {
    [`stripe_payment_intent_${tipo}`]: paymentIntent.id,
    [`pago_${tipo}_at`]: new Date(),
  };

  if (tipo === 'entrada') {
    updates.status = 'pago_50';
  } else if (tipo === 'saldo') {
    updates.status = 'pago_100';
  }

  await supabase
    .from('leads')
    .update(updates)
    .eq('id', leadId);

  // 3. Disparar email
  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single();

  if (tipo === 'entrada') {
    await sendEmail(emailTemplates.pagoEntrada(lead));
    // Iniciar produção automaticamente
    await queueSiteGeneration(leadId);
  } else {
    await sendEmail(emailTemplates.pagoSaldo(lead));
  }
}
```

### 4.3 Dashboard Admin - Ações Necessárias

**Interface para gerenciar leads:**

```javascript
// Funcionalidades necessárias no dashboard

const dashboardActions = {
  // Visualizar todos os leads
  listLeads: async (filters) => {
    return await supabase
      .from('leads')
      .select('*')
      .eq('status', filters.status)
      .order('created_at', { ascending: false });
  },

  // Atualizar status manualmente
  updateStatus: async (leadId, newStatus) => {
    return await supabase
      .from('leads')
      .update({
        status: newStatus,
        [`${newStatus}_at`]: new Date(),
      })
      .eq('id', leadId);
  },

  // Enviar link de pagamento
  sendPaymentLink: async (leadId, tipo) => {
    const link = await createStripeCheckout(leadId, tipo);
    // Enviar por email ou WhatsApp
  },

  // Adicionar preview URL
  setPreviewUrl: async (leadId, url) => {
    return await supabase
      .from('leads')
      .update({
        preview_url: url,
        status: 'em_aprovacao',
      })
      .eq('id', leadId);
  },

  // Publicar site final
  publishSite: async (leadId, finalUrl) => {
    return await supabase
      .from('leads')
      .update({
        site_final_url: finalUrl,
        status: 'concluido',
        concluido_at: new Date(),
      })
      .eq('id', leadId);
  },

  // Ver histórico de pagamentos
  getPaymentHistory: async (leadId) => {
    return await supabase
      .from('payments')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
  },
};
```

---

## 5. Estrutura de Arquivos Recomendada

```
src/
├── lib/
│   ├── supabase/
│   │   ├── client.js              # Cliente Supabase
│   │   ├── queries.js             # Queries reutilizáveis
│   │   └── types.ts               # TypeScript types
│   │
│   ├── stripe/
│   │   ├── client.js              # Cliente Stripe
│   │   ├── checkout.js            # Criar sessões de pagamento
│   │   └── webhooks.js            # Processar webhooks
│   │
│   ├── email/
│   │   ├── sender.js              # Enviar emails (Resend/SendGrid)
│   │   ├── templates/             # Templates de email
│   │   └── automation.js          # Automações de email
│   │
│   ├── siteGenerator/
│   │   ├── builder.js             # Gerar site do briefing
│   │   ├── templates/             # Templates de site
│   │   ├── deployer.js            # Deploy (Vercel/Netlify)
│   │   └── assets.js              # Processar imagens/assets
│   │
│   └── utils/
│       ├── validation.js          # Validações
│       ├── sanitization.js        # Sanitização de dados
│       └── formatting.js          # Formatação (telefone, etc)
│
├── api/
│   ├── webhooks/
│   │   ├── stripe.js              # POST /api/webhooks/stripe
│   │   └── supabase.js            # Triggers do Supabase
│   │
│   └── admin/
│       ├── leads.js               # CRUD de leads
│       ├── payments.js            # Consultar pagamentos
│       └── dashboard.js           # Métricas
│
└── pages/ (ou app/)
    ├── admin/
    │   ├── dashboard.jsx          # Dashboard principal
    │   ├── leads/
    │   │   ├── index.jsx          # Lista de leads
    │   │   └── [id].jsx           # Detalhes do lead
    │   └── settings.jsx
    │
    └── api/
        └── ... (rotas API)
```

---

## 6. Próximos Passos Práticos

### Fase 1: Automação Básica ⏱️ Imediato

- [ ] Criar endpoint webhook Stripe
- [ ] Implementar atualização automática de status após pagamento
- [ ] Configurar envio de emails transacionais básicos
- [ ] Criar página de visualização de leads no admin

### Fase 2: Geração de Sites 📅 1-2 semanas

- [ ] Desenvolver template base do site
- [ ] Criar função de geração automática do site
- [ ] Implementar sistema de preview (subdomínio temporário)
- [ ] Sistema de aprovação (botão "aprovar" no preview)

### Fase 3: Dashboard Completo 📅 2-4 semanas

- [ ] Dashboard com métricas (conversão, receita, etc)
- [ ] Visualização de funil de vendas
- [ ] Edição manual de leads
- [ ] Sistema de notas/comentários por lead
- [ ] Histórico de alterações

### Fase 4: Otimizações 📅 Contínuo

- [ ] Analytics e tracking
- [ ] A/B testing no formulário
- [ ] Relatórios automáticos por email
- [ ] Integração com CRM (opcional)
- [ ] WhatsApp API para automações

---

## 7. Métricas para Acompanhar

### KPIs Principais:

```sql
-- Taxa de conversão (novo → pago_50)
SELECT
  COUNT(*) FILTER (WHERE status != 'novo')::FLOAT / COUNT(*) * 100 as taxa_conversao
FROM leads;

-- Ticket médio
SELECT AVG(valor_total) / 100 as ticket_medio FROM leads;

-- Tempo médio até primeira conversão
SELECT AVG(EXTRACT(EPOCH FROM (pago_entrada_at - created_at)) / 3600) as horas
FROM leads
WHERE pago_entrada_at IS NOT NULL;

-- Receita total
SELECT SUM(valor) / 100 as receita_total
FROM payments
WHERE status = 'succeeded';

-- Leads perdidos (mais de 7 dias sem ação)
SELECT COUNT(*)
FROM leads
WHERE status = 'novo'
AND created_at < NOW() - INTERVAL '7 days';
```

---

## Conclusão

O sistema está estruturado para:
1. ✅ Capturar dados do formulário
2. ⏳ Processar pagamentos automaticamente
3. ⏳ Gerar sites baseados no briefing
4. ⏳ Gerenciar aprovações
5. ⏳ Entregar produto final

**Próximo passo sugerido:** Implementar webhook Stripe e emails transacionais (Fase 1)
