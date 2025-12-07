-- =============================================
-- SCRIPT DE TESTE E REVISÃO DAS TABELAS
-- Digitalizar Odonto - Sistema de Briefing e Pagamentos
-- Data: 2025-12-07
-- =============================================

-- =============================================
-- 1. CRIAR LEAD DE TESTE
-- =============================================

INSERT INTO leads (
  nome,
  email,
  whatsapp,
  briefing_data,
  status
)
VALUES (
  'Dr. Pedro Henrique Almeida',
  'pedro.almeida@clinicaodonto.com',
  '(18) 99876-5432',
  '{
    "consultorio": "Clínica Odontológica Almeida",
    "especialidades": ["Implantodontia", "Periodontia", "Estética Dental"],
    "anos_experiencia": "15",
    "crm": "CRO-SP 12345",
    "cidade": "Presidente Prudente",
    "estado": "SP",
    "tem_logo": true,
    "cores_preferidas": ["#0066CC", "#FFFFFF"],
    "site_referencia": "https://exemplo.com",
    "diferenciais": ["Atendimento humanizado", "Tecnologia de ponta", "Equipe especializada"],
    "horario_atendimento": "Segunda a Sexta: 8h às 18h",
    "aceita_convenio": true,
    "convenios": ["Unimed", "Bradesco Dental", "SulAmérica"]
  }'::jsonb,
  'novo'
)
RETURNING id, nome, email, status, created_at;

-- =============================================
-- 2. REVISÃO COMPLETA DAS TABELAS
-- =============================================

-- --------------------------------------------
-- 2.1 ESTRUTURA DA TABELA LEADS
-- --------------------------------------------
SELECT
  '=== ESTRUTURA DA TABELA LEADS ===' as info;

SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'leads'
ORDER BY ordinal_position;

-- --------------------------------------------
-- 2.2 ESTRUTURA DA TABELA PAYMENTS
-- --------------------------------------------
SELECT
  '=== ESTRUTURA DA TABELA PAYMENTS ===' as info;

SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'payments'
ORDER BY ordinal_position;

-- --------------------------------------------
-- 2.3 ÍNDICES CRIADOS
-- --------------------------------------------
SELECT
  '=== ÍNDICES DAS TABELAS ===' as info;

SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('leads', 'payments')
ORDER BY tablename, indexname;

-- --------------------------------------------
-- 2.4 TRIGGERS ATIVOS
-- --------------------------------------------
SELECT
  '=== TRIGGERS ATIVOS ===' as info;

SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table IN ('leads', 'payments')
ORDER BY event_object_table, trigger_name;

-- --------------------------------------------
-- 2.5 CONSTRAINTS E CHECKS
-- --------------------------------------------
SELECT
  '=== CONSTRAINTS E VALIDAÇÕES ===' as info;

SELECT
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc
  ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name IN ('leads', 'payments')
ORDER BY tc.table_name, tc.constraint_type;

-- =============================================
-- 3. REVISÃO DOS DADOS
-- =============================================

-- --------------------------------------------
-- 3.1 TODOS OS LEADS
-- --------------------------------------------
SELECT
  '=== LISTAGEM DE TODOS OS LEADS ===' as info;

SELECT
  id,
  nome,
  email,
  whatsapp,
  status,
  valor_total,
  valor_entrada,
  valor_saldo,
  created_at,
  updated_at,
  briefing_data->>'consultorio' as consultorio,
  briefing_data->>'cidade' as cidade,
  briefing_data->>'estado' as estado
FROM leads
ORDER BY created_at DESC;

-- --------------------------------------------
-- 3.2 DETALHES COMPLETOS DO ÚLTIMO LEAD CRIADO
-- --------------------------------------------
SELECT
  '=== DETALHES DO ÚLTIMO LEAD CRIADO ===' as info;

SELECT
  id,
  nome,
  email,
  whatsapp,
  status,
  -- Valores em centavos
  valor_total as valor_total_centavos,
  valor_entrada as valor_entrada_centavos,
  valor_saldo as valor_saldo_centavos,
  -- Valores em reais (formatado)
  CONCAT('R$ ', ROUND(valor_total::NUMERIC / 100, 2)) as valor_total_reais,
  CONCAT('R$ ', ROUND(valor_entrada::NUMERIC / 100, 2)) as valor_entrada_reais,
  CONCAT('R$ ', ROUND(valor_saldo::NUMERIC / 100, 2)) as valor_saldo_reais,
  -- Stripe IDs
  stripe_payment_intent_entrada,
  stripe_payment_intent_saldo,
  stripe_customer_id,
  -- URLs
  preview_url,
  site_final_url,
  -- Timestamps
  created_at,
  updated_at,
  pago_entrada_at,
  pago_saldo_at,
  aprovado_at,
  concluido_at,
  -- Briefing completo (JSON formatado)
  jsonb_pretty(briefing_data) as briefing_completo
FROM leads
ORDER BY created_at DESC
LIMIT 1;

-- --------------------------------------------
-- 3.3 TODOS OS PAGAMENTOS
-- --------------------------------------------
SELECT
  '=== LISTAGEM DE TODOS OS PAGAMENTOS ===' as info;

SELECT
  p.id,
  l.nome as lead_nome,
  p.tipo,
  p.status,
  p.valor as valor_centavos,
  CONCAT('R$ ', ROUND(p.valor::NUMERIC / 100, 2)) as valor_reais,
  p.stripe_payment_intent_id,
  p.stripe_session_id,
  p.created_at,
  p.paid_at
FROM payments p
JOIN leads l ON p.lead_id = l.id
ORDER BY p.created_at DESC;

-- =============================================
-- 4. ESTATÍSTICAS E ANÁLISES
-- =============================================

-- --------------------------------------------
-- 4.1 CONTAGEM DE LEADS POR STATUS
-- --------------------------------------------
SELECT
  '=== LEADS POR STATUS ===' as info;

SELECT
  status,
  COUNT(*) as quantidade,
  CONCAT('R$ ', ROUND(SUM(valor_total)::NUMERIC / 100, 2)) as valor_total_acumulado
FROM leads
GROUP BY status
ORDER BY
  CASE status
    WHEN 'novo' THEN 1
    WHEN 'pago_50' THEN 2
    WHEN 'em_producao' THEN 3
    WHEN 'em_aprovacao' THEN 4
    WHEN 'pago_100' THEN 5
    WHEN 'concluido' THEN 6
  END;

-- --------------------------------------------
-- 4.2 RESUMO GERAL DO SISTEMA
-- --------------------------------------------
SELECT
  '=== RESUMO GERAL DO SISTEMA ===' as info;

SELECT
  (SELECT COUNT(*) FROM leads) as total_leads,
  (SELECT COUNT(*) FROM leads WHERE status = 'novo') as leads_novos,
  (SELECT COUNT(*) FROM leads WHERE status = 'pago_50') as leads_pago_50,
  (SELECT COUNT(*) FROM leads WHERE status IN ('em_producao', 'em_aprovacao')) as leads_em_andamento,
  (SELECT COUNT(*) FROM leads WHERE status = 'concluido') as leads_concluidos,
  (SELECT COUNT(*) FROM payments) as total_pagamentos,
  (SELECT COUNT(*) FROM payments WHERE status = 'succeeded') as pagamentos_sucesso,
  (SELECT CONCAT('R$ ', ROUND(SUM(valor)::NUMERIC / 100, 2)) FROM payments WHERE status = 'succeeded') as total_recebido;

-- --------------------------------------------
-- 4.3 ANÁLISE DE CONVERSÃO E FUNIL
-- --------------------------------------------
SELECT
  '=== FUNIL DE CONVERSÃO ===' as info;

WITH stats AS (
  SELECT
    COUNT(*) FILTER (WHERE status = 'novo') as novos,
    COUNT(*) FILTER (WHERE status IN ('pago_50', 'em_producao', 'em_aprovacao', 'pago_100', 'concluido')) as convertidos_entrada,
    COUNT(*) FILTER (WHERE status IN ('pago_100', 'concluido')) as pagos_completo,
    COUNT(*) FILTER (WHERE status = 'concluido') as concluidos,
    COUNT(*) as total
  FROM leads
)
SELECT
  total as total_leads,
  novos as leads_novos,
  convertidos_entrada,
  CASE WHEN total > 0
    THEN CONCAT(ROUND(convertidos_entrada::NUMERIC / total * 100, 2), '%')
    ELSE '0%'
  END as taxa_conversao_entrada,
  pagos_completo,
  CASE WHEN total > 0
    THEN CONCAT(ROUND(pagos_completo::NUMERIC / total * 100, 2), '%')
    ELSE '0%'
  END as taxa_conversao_completa,
  concluidos,
  CASE WHEN total > 0
    THEN CONCAT(ROUND(concluidos::NUMERIC / total * 100, 2), '%')
    ELSE '0%'
  END as taxa_conclusao
FROM stats;

-- --------------------------------------------
-- 4.4 TEMPO MÉDIO ENTRE STATUS
-- --------------------------------------------
SELECT
  '=== TEMPO MÉDIO DE PROCESSAMENTO ===' as info;

SELECT
  ROUND(AVG(EXTRACT(EPOCH FROM (pago_entrada_at - created_at)) / 3600), 2) as horas_ate_primeira_conversao,
  ROUND(AVG(EXTRACT(EPOCH FROM (pago_saldo_at - pago_entrada_at)) / 3600), 2) as horas_entre_pagamentos,
  ROUND(AVG(EXTRACT(EPOCH FROM (concluido_at - created_at)) / 3600), 2) as horas_ate_conclusao
FROM leads
WHERE pago_entrada_at IS NOT NULL;

-- --------------------------------------------
-- 4.5 VERIFICAR INTEGRIDADE DOS DADOS
-- --------------------------------------------
SELECT
  '=== VERIFICAÇÃO DE INTEGRIDADE ===' as info;

SELECT
  'Leads sem email' as verificacao,
  COUNT(*) as quantidade
FROM leads
WHERE email IS NULL OR email = ''
UNION ALL
SELECT
  'Leads sem WhatsApp' as verificacao,
  COUNT(*) as quantidade
FROM leads
WHERE whatsapp IS NULL OR whatsapp = ''
UNION ALL
SELECT
  'Leads com briefing vazio' as verificacao,
  COUNT(*) as quantidade
FROM leads
WHERE briefing_data = '{}'::jsonb
UNION ALL
SELECT
  'Pagamentos sem lead vinculado' as verificacao,
  COUNT(*) as quantidade
FROM payments p
WHERE NOT EXISTS (SELECT 1 FROM leads l WHERE l.id = p.lead_id);

-- =============================================
-- 5. QUERIES ÚTEIS PARA ADMINISTRAÇÃO
-- =============================================

-- --------------------------------------------
-- 5.1 LEADS QUE PRECISAM DE ATENÇÃO
-- --------------------------------------------
SELECT
  '=== LEADS QUE PRECISAM DE ATENÇÃO ===' as info;

-- Leads novos há mais de 24 horas sem conversão
SELECT
  'Novos há mais de 24h' as alerta,
  id,
  nome,
  email,
  whatsapp,
  status,
  created_at,
  EXTRACT(HOUR FROM (NOW() - created_at)) as horas_desde_criacao
FROM leads
WHERE status = 'novo'
  AND created_at < NOW() - INTERVAL '24 hours'
ORDER BY created_at;

-- --------------------------------------------
-- 5.2 BUCKETS DE STORAGE
-- --------------------------------------------
SELECT
  '=== BUCKETS DE STORAGE CRIADOS ===' as info;

SELECT
  id,
  name,
  public,
  created_at
FROM storage.buckets
WHERE id IN ('logos', 'fotos', 'depoimentos')
ORDER BY name;

-- --------------------------------------------
-- 5.3 POLÍTICAS RLS ATIVAS
-- --------------------------------------------
SELECT
  '=== POLÍTICAS RLS (ROW LEVEL SECURITY) ===' as info;

SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('leads', 'payments')
ORDER BY tablename, policyname;

-- =============================================
-- FIM DO SCRIPT DE REVISÃO
-- =============================================

-- COMO USAR ESTE SCRIPT:
-- 1. Execute no SQL Editor do Supabase
-- 2. Revise cada seção para conferir a estrutura
-- 3. Analise os dados inseridos
-- 4. Use as queries de análise para entender o estado do sistema
