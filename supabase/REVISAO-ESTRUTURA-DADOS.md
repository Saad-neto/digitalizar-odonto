# Revisão da Estrutura de Dados - Digitalizar Odonto

**Data:** 2025-12-07
**Objetivo:** Documentar estrutura das tabelas e planejar tratamento de dados

---

## 1. Estrutura das Tabelas

### 1.1 Tabela `leads`

**Propósito:** Armazenar informações de clientes potenciais e confirmados

**Campos Principais:**

| Campo | Tipo | Descrição | Validação |
|-------|------|-----------|-----------|
| `id` | UUID | Identificador único | PK, auto-gerado |
| `status` | TEXT | Status do lead | CHECK: 'novo', 'pago_50', 'em_producao', 'em_aprovacao', 'pago_100', 'concluido' |
| `nome` | TEXT | Nome do cliente | NOT NULL |
| `email` | TEXT | Email do cliente | NOT NULL, indexado |
| `whatsapp` | TEXT | WhatsApp do cliente | NOT NULL, indexado |
| `briefing_data` | JSONB | Dados completos do briefing | NOT NULL, default '{}' |
| `valor_total` | INTEGER | Valor total em centavos | NOT NULL, default 49700 (R$ 497,00) |
| `valor_entrada` | INTEGER | Valor da entrada (50%) | NOT NULL, default 24850 (R$ 248,50) |
| `valor_saldo` | INTEGER | Valor do saldo (50%) | NOT NULL, default 24850 (R$ 248,50) |
| `stripe_payment_intent_entrada` | TEXT | ID do pagamento de entrada | Opcional |
| `stripe_payment_intent_saldo` | TEXT | ID do pagamento do saldo | Opcional |
| `preview_url` | TEXT | URL do preview para aprovação | Opcional |
| `site_final_url` | TEXT | URL do site publicado | Opcional |
| `created_at` | TIMESTAMP | Data de criação | Auto, indexado DESC |
| `updated_at` | TIMESTAMP | Data de atualização | Auto (trigger) |

**Índices:**
- `idx_leads_status` - Performance em filtros por status
- `idx_leads_email` - Busca rápida por email
- `idx_leads_created_at` - Ordenação cronológica
- `idx_leads_whatsapp` - Busca por telefone

### 1.2 Tabela `payments`

**Propósito:** Histórico completo de pagamentos

| Campo | Tipo | Descrição | Validação |
|-------|------|-----------|-----------|
| `id` | UUID | Identificador único | PK, auto-gerado |
| `lead_id` | UUID | Referência ao lead | FK -> leads(id), CASCADE |
| `tipo` | TEXT | Tipo de pagamento | CHECK: 'entrada', 'saldo' |
| `valor` | INTEGER | Valor em centavos | NOT NULL |
| `status` | TEXT | Status do pagamento | CHECK: 'pending', 'succeeded', 'failed', 'canceled' |
| `stripe_payment_intent_id` | TEXT | ID do Stripe | NOT NULL, UNIQUE |
| `stripe_session_id` | TEXT | ID da sessão Stripe | Opcional |
| `metadata` | JSONB | Metadados adicionais | default '{}' |
| `created_at` | TIMESTAMP | Data de criação | Auto |
| `paid_at` | TIMESTAMP | Data do pagamento | Opcional |

**Índices:**
- `idx_payments_lead_id` - JOIN rápido com leads
- `idx_payments_stripe_payment_intent` - Webhook do Stripe
- `idx_payments_status` - Filtros por status

---

## 2. Campos JSONB e Estrutura de Dados

### 2.1 Campo `briefing_data` (leads)

**Estrutura esperada:**

```json
{
  "consultorio": "Nome da Clínica",
  "especialidades": ["Implantodontia", "Periodontia"],
  "anos_experiencia": "15",
  "crm": "CRO-SP 12345",
  "cidade": "Presidente Prudente",
  "estado": "SP",
  "tem_logo": true,
  "cores_preferidas": ["#0066CC", "#FFFFFF"],
  "site_referencia": "https://exemplo.com",
  "diferenciais": ["Diferencial 1", "Diferencial 2"],
  "horario_atendimento": "Segunda a Sexta: 8h às 18h",
  "aceita_convenio": true,
  "convenios": ["Unimed", "Bradesco Dental"]
}
```

**Queries úteis para acessar:**

```sql
-- Buscar consultório
SELECT briefing_data->>'consultorio' FROM leads;

-- Buscar especialidades (array)
SELECT briefing_data->'especialidades' FROM leads;

-- Filtrar por cidade
SELECT * FROM leads WHERE briefing_data->>'cidade' = 'Presidente Prudente';
```

### 2.2 Campo `metadata` (payments)

**Estrutura flexível para dados adicionais:**

```json
{
  "ip_address": "192.168.1.1",
  "user_agent": "...",
  "payment_method": "card",
  "last_4_digits": "4242",
  "installments": 1
}
```

---

## 3. Fluxo de Status do Lead

```
novo
  ↓ (pagamento entrada confirmado)
pago_50
  ↓ (site em desenvolvimento)
em_producao
  ↓ (site enviado para aprovação)
em_aprovacao
  ↓ (pagamento saldo confirmado)
pago_100
  ↓ (site publicado)
concluido
```

**Campos timestamp associados:**
- `pago_entrada_at` - Quando pagou entrada
- `aprovado_at` - Quando aprovou o site
- `pago_saldo_at` - Quando pagou saldo
- `concluido_at` - Quando foi concluído

---

## 4. Row Level Security (RLS)

### Políticas Configuradas:

**Tabela `leads`:**
- INSERT: Público (qualquer um pode criar lead)
- SELECT: Apenas admins autenticados
- UPDATE: Apenas admins autenticados

**Tabela `payments`:**
- INSERT: Público (webhook Stripe)
- SELECT: Apenas admins autenticados
- UPDATE: Apenas admins autenticados

---

## 5. Storage Buckets

### Buckets Criados:

| Bucket | Público | Uso |
|--------|---------|-----|
| `logos` | Sim | Upload de logos das clínicas |
| `fotos` | Sim | Fotos do dentista/equipe |
| `depoimentos` | Sim | Imagens de depoimentos |

**Políticas:**
- Upload público permitido
- Leitura pública permitida

---

## 6. Funções Úteis

### 6.1 `count_leads_by_status()`

Retorna contagem de leads agrupados por status.

**Uso:**
```sql
SELECT * FROM count_leads_by_status();
```

### 6.2 `payment_report(start_date, end_date)`

Relatório de pagamentos por período.

**Uso:**
```sql
SELECT * FROM payment_report('2025-01-01', '2025-12-31');
```

---

## 7. Análises e Queries Importantes

### 7.1 Dashboard - Métricas Principais

```sql
-- Total de leads por status
SELECT status, COUNT(*) FROM leads GROUP BY status;

-- Receita total
SELECT SUM(valor) / 100 as total_reais
FROM payments
WHERE status = 'succeeded';

-- Taxa de conversão
SELECT
  COUNT(*) FILTER (WHERE status != 'novo') * 100.0 / COUNT(*) as taxa_conversao
FROM leads;
```

### 7.2 Leads que Precisam Atenção

```sql
-- Novos há mais de 24h
SELECT * FROM leads
WHERE status = 'novo'
AND created_at < NOW() - INTERVAL '24 hours';

-- Em produção há muito tempo
SELECT * FROM leads
WHERE status IN ('em_producao', 'em_aprovacao')
AND updated_at < NOW() - INTERVAL '7 days';
```

### 7.3 Análise Financeira

```sql
-- Receita por mês
SELECT
  DATE_TRUNC('month', paid_at) as mes,
  tipo,
  COUNT(*) as qtd,
  SUM(valor) / 100 as total_reais
FROM payments
WHERE status = 'succeeded'
GROUP BY mes, tipo
ORDER BY mes DESC;
```

---

## 8. Pontos de Atenção e Melhorias

### 8.1 Validações Necessárias

- [ ] Validar formato de email (regex)
- [ ] Validar formato de WhatsApp
- [ ] Garantir que briefing_data tenha campos obrigatórios
- [ ] Validar URLs de preview/site final

### 8.2 Integridade de Dados

- [ ] Verificar se leads pagos têm payment records
- [ ] Validar que status reflete timestamps
  - `pago_50` deve ter `pago_entrada_at`
  - `pago_100` deve ter `pago_saldo_at`
  - `concluido` deve ter `concluido_at`

### 8.3 Performance

- [ ] Monitorar queries lentas
- [ ] Considerar índices adicionais se necessário
- [ ] Analisar uso de JSONB (pode criar índices GIN se necessário)

### 8.4 Segurança

- [ ] Revisar políticas RLS regularmente
- [ ] Implementar rate limiting em INSERT público
- [ ] Adicionar logs de auditoria para alterações sensíveis

---

## 9. Próximos Passos - Planejamento

### 9.1 Tratamento de Dados de Entrada

**Validações no Frontend:**
```typescript
// Exemplo de validação Zod
const briefingSchema = z.object({
  consultorio: z.string().min(3),
  email: z.string().email(),
  whatsapp: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/),
  especialidades: z.array(z.string()).min(1),
  // ... outros campos
});
```

**Sanitização:**
- Remover caracteres especiais de telefones
- Normalizar emails (lowercase, trim)
- Validar URLs antes de salvar

### 9.2 Processamento de Webhooks Stripe

```typescript
// Estrutura para processar webhook
async function handleStripeWebhook(event) {
  switch (event.type) {
    case 'payment_intent.succeeded':
      // Atualizar lead status
      // Criar registro em payments
      // Enviar emails
      break;
    case 'payment_intent.failed':
      // Notificar cliente
      // Registrar falha
      break;
  }
}
```

### 9.3 Automações Necessárias

- [ ] Email automático quando lead é criado
- [ ] Email quando pagamento é confirmado
- [ ] Notificação quando site está em aprovação
- [ ] Email de conclusão com link do site

### 9.4 Dashboard Admin

**Componentes principais:**
- Listagem de leads com filtros
- Métricas em cards (total, conversão, receita)
- Gráficos de evolução
- Timeline de cada lead
- Ações rápidas (atualizar status, enviar email)

### 9.5 Relatórios

- [ ] Relatório mensal de vendas
- [ ] Relatório de conversão por origem
- [ ] Análise de tempo médio por etapa
- [ ] Previsão de receita baseada em pipeline

---

## 10. Exemplos de Uso

### Criar Lead

```sql
INSERT INTO leads (nome, email, whatsapp, briefing_data)
VALUES (
  'Dr. João Silva',
  'joao@clinica.com',
  '(18) 99999-9999',
  '{"consultorio": "Clínica Exemplo", "especialidades": ["Implante"]}'::jsonb
);
```

### Atualizar Status após Pagamento

```sql
UPDATE leads
SET
  status = 'pago_50',
  pago_entrada_at = NOW(),
  stripe_payment_intent_entrada = 'pi_xxxxx'
WHERE id = 'uuid-do-lead';
```

### Buscar Leads para Dashboard

```sql
SELECT
  l.id,
  l.nome,
  l.email,
  l.status,
  l.created_at,
  l.briefing_data->>'consultorio' as consultorio,
  COALESCE(
    (SELECT COUNT(*) FROM payments p WHERE p.lead_id = l.id AND p.status = 'succeeded'),
    0
  ) as pagamentos_confirmados
FROM leads l
ORDER BY l.created_at DESC
LIMIT 50;
```

---

## Conclusão

A estrutura está bem organizada e pronta para:
- Capturar leads do formulário
- Processar pagamentos via Stripe
- Gerenciar workflow de produção
- Gerar relatórios e análises

**Principais vantagens:**
- JSONB permite flexibilidade no briefing
- Índices otimizam queries comuns
- RLS protege dados sensíveis
- Triggers mantêm dados atualizados automaticamente
- Functions facilitam análises

**Execute o script `teste-revisao-tabelas.sql` para conferir tudo!**
