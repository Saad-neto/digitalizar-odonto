-- =============================================
-- ANÁLISE DOS LEADS EXISTENTES
-- Revisão dos dados já coletados do formulário
-- =============================================

-- =============================================
-- 1. VISÃO GERAL DOS LEADS CADASTRADOS
-- =============================================

SELECT
  '=== TODOS OS LEADS CADASTRADOS ===' as info;

SELECT
  id,
  nome,
  email,
  whatsapp,
  status,
  created_at,
  updated_at,
  -- Extrair dados principais do briefing
  briefing_data->>'consultorio' as consultorio,
  briefing_data->>'cidade' as cidade,
  briefing_data->>'estado' as estado,
  briefing_data->'especialidades' as especialidades
FROM leads
ORDER BY created_at DESC;

-- =============================================
-- 2. ANÁLISE DETALHADA DE CADA LEAD
-- =============================================

SELECT
  '=== DETALHES COMPLETOS - LEAD 1 ===' as info;

SELECT
  -- Identificação
  id,
  nome,
  email,
  whatsapp,
  status,

  -- Valores (em reais formatado)
  CONCAT('R$ ', ROUND(valor_total::NUMERIC / 100, 2)) as valor_total,
  CONCAT('R$ ', ROUND(valor_entrada::NUMERIC / 100, 2)) as valor_entrada,
  CONCAT('R$ ', ROUND(valor_saldo::NUMERIC / 100, 2)) as valor_saldo,

  -- Stripe
  stripe_payment_intent_entrada,
  stripe_payment_intent_saldo,
  stripe_customer_id,

  -- URLs
  preview_url,
  site_final_url,

  -- Datas
  created_at,
  updated_at,
  pago_entrada_at,
  pago_saldo_at,
  aprovado_at,
  concluido_at,

  -- Briefing formatado
  jsonb_pretty(briefing_data) as briefing_completo
FROM leads
ORDER BY created_at DESC
LIMIT 1;

SELECT
  '=== DETALHES COMPLETOS - LEAD 2 ===' as info;

SELECT
  -- Identificação
  id,
  nome,
  email,
  whatsapp,
  status,

  -- Valores (em reais formatado)
  CONCAT('R$ ', ROUND(valor_total::NUMERIC / 100, 2)) as valor_total,
  CONCAT('R$ ', ROUND(valor_entrada::NUMERIC / 100, 2)) as valor_entrada,
  CONCAT('R$ ', ROUND(valor_saldo::NUMERIC / 100, 2)) as valor_saldo,

  -- Stripe
  stripe_payment_intent_entrada,
  stripe_payment_intent_saldo,
  stripe_customer_id,

  -- URLs
  preview_url,
  site_final_url,

  -- Datas
  created_at,
  updated_at,
  pago_entrada_at,
  pago_saldo_at,
  aprovado_at,
  concluido_at,

  -- Briefing formatado
  jsonb_pretty(briefing_data) as briefing_completo
FROM leads
ORDER BY created_at DESC
OFFSET 1
LIMIT 1;

-- =============================================
-- 3. ANÁLISE DOS CAMPOS DO BRIEFING
-- =============================================

SELECT
  '=== CAMPOS PREENCHIDOS NO BRIEFING ===' as info;

-- Verificar quais campos estão sendo enviados pelo formulário
SELECT
  nome,
  email,
  -- Listar todas as chaves do JSON briefing_data
  jsonb_object_keys(briefing_data) as campos_preenchidos,
  briefing_data
FROM leads
ORDER BY created_at DESC;

-- =============================================
-- 4. VERIFICAÇÃO DE QUALIDADE DOS DADOS
-- =============================================

SELECT
  '=== QUALIDADE E COMPLETUDE DOS DADOS ===' as info;

SELECT
  nome,
  email,
  whatsapp,
  -- Verificar campos obrigatórios
  CASE WHEN nome IS NOT NULL AND nome != '' THEN '✓' ELSE '✗' END as tem_nome,
  CASE WHEN email IS NOT NULL AND email != '' THEN '✓' ELSE '✗' END as tem_email,
  CASE WHEN whatsapp IS NOT NULL AND whatsapp != '' THEN '✓' ELSE '✗' END as tem_whatsapp,
  CASE WHEN briefing_data != '{}'::jsonb THEN '✓' ELSE '✗' END as tem_briefing,

  -- Validar email (básico)
  CASE WHEN email LIKE '%@%' AND email LIKE '%.%' THEN '✓' ELSE '✗' END as email_valido,

  -- Contar campos no briefing
  jsonb_object_keys(briefing_data) as total_campos_briefing,

  -- Verificar campos específicos importantes
  CASE WHEN briefing_data ? 'consultorio' THEN '✓' ELSE '✗' END as tem_consultorio,
  CASE WHEN briefing_data ? 'especialidades' THEN '✓' ELSE '✗' END as tem_especialidades,
  CASE WHEN briefing_data ? 'cidade' THEN '✓' ELSE '✗' END as tem_cidade,
  CASE WHEN briefing_data ? 'estado' THEN '✓' ELSE '✗' END as tem_estado
FROM leads
ORDER BY created_at DESC;

-- =============================================
-- 5. ANÁLISE DE ESPECIALIDADES
-- =============================================

SELECT
  '=== ESPECIALIDADES MAIS COMUNS ===' as info;

-- Expandir array de especialidades e contar
SELECT
  especialidade,
  COUNT(*) as quantidade
FROM leads,
  jsonb_array_elements_text(briefing_data->'especialidades') as especialidade
GROUP BY especialidade
ORDER BY quantidade DESC;

-- =============================================
-- 6. ANÁLISE GEOGRÁFICA
-- =============================================

SELECT
  '=== DISTRIBUIÇÃO GEOGRÁFICA ===' as info;

SELECT
  briefing_data->>'estado' as estado,
  briefing_data->>'cidade' as cidade,
  COUNT(*) as quantidade
FROM leads
WHERE briefing_data ? 'estado'
GROUP BY estado, cidade
ORDER BY quantidade DESC;

-- =============================================
-- 7. CAMPOS DO BRIEFING - ESTRUTURA DETALHADA
-- =============================================

SELECT
  '=== ESTRUTURA COMPLETA DO BRIEFING ===' as info;

-- Analisar TODOS os campos que aparecem em qualquer lead
SELECT DISTINCT
  key as campo_briefing,
  jsonb_typeof(value) as tipo_dado,
  COUNT(*) OVER (PARTITION BY key) as aparece_em_quantos_leads
FROM leads,
  jsonb_each(briefing_data)
ORDER BY campo_briefing;

-- =============================================
-- 8. TIMELINE DOS LEADS
-- =============================================

SELECT
  '=== TIMELINE DE CADASTROS ===' as info;

SELECT
  nome,
  email,
  status,
  created_at,
  -- Calcular tempo desde criação
  EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600 as horas_desde_criacao,
  EXTRACT(EPOCH FROM (NOW() - created_at)) / 86400 as dias_desde_criacao,
  -- Status de acompanhamento
  CASE
    WHEN status = 'novo' AND created_at < NOW() - INTERVAL '24 hours' THEN '⚠️ Precisa atenção'
    WHEN status = 'novo' AND created_at < NOW() - INTERVAL '2 hours' THEN '⏰ Acompanhar'
    WHEN status = 'novo' THEN '🆕 Recente'
    ELSE '✓ Em andamento'
  END as urgencia
FROM leads
ORDER BY created_at DESC;

-- =============================================
-- 9. COMPARAÇÃO ENTRE OS DOIS LEADS
-- =============================================

SELECT
  '=== COMPARAÇÃO ENTRE LEADS ===' as info;

WITH lead_data AS (
  SELECT
    ROW_NUMBER() OVER (ORDER BY created_at DESC) as numero,
    nome,
    briefing_data->>'consultorio' as consultorio,
    jsonb_array_length(briefing_data->'especialidades') as qtd_especialidades,
    briefing_data->>'cidade' as cidade,
    briefing_data->>'estado' as estado,
    CASE WHEN briefing_data ? 'tem_logo' THEN briefing_data->>'tem_logo' ELSE 'não informado' END as tem_logo,
    CASE WHEN briefing_data ? 'aceita_convenio' THEN briefing_data->>'aceita_convenio' ELSE 'não informado' END as aceita_convenio,
    status,
    created_at
  FROM leads
)
SELECT * FROM lead_data ORDER BY numero;

-- =============================================
-- 10. DADOS FALTANTES OU OPCIONAIS
-- =============================================

SELECT
  '=== ANÁLISE DE CAMPOS OPCIONAIS ===' as info;

SELECT
  nome,
  -- Verificar campos opcionais comuns
  CASE WHEN briefing_data ? 'anos_experiencia' THEN briefing_data->>'anos_experiencia' ELSE 'Não informado' END as anos_experiencia,
  CASE WHEN briefing_data ? 'crm' THEN briefing_data->>'crm' ELSE 'Não informado' END as crm,
  CASE WHEN briefing_data ? 'tem_logo' THEN briefing_data->>'tem_logo' ELSE 'Não informado' END as tem_logo,
  CASE WHEN briefing_data ? 'cores_preferidas' THEN briefing_data->>'cores_preferidas' ELSE 'Não informado' END as cores_preferidas,
  CASE WHEN briefing_data ? 'site_referencia' THEN briefing_data->>'site_referencia' ELSE 'Não informado' END as site_referencia,
  CASE WHEN briefing_data ? 'horario_atendimento' THEN briefing_data->>'horario_atendimento' ELSE 'Não informado' END as horario_atendimento,
  CASE WHEN briefing_data ? 'aceita_convenio' THEN briefing_data->>'aceita_convenio' ELSE 'Não informado' END as aceita_convenio,
  CASE WHEN briefing_data ? 'convenios' THEN briefing_data->'convenios' ELSE 'Não informado'::jsonb END as convenios
FROM leads
ORDER BY created_at DESC;

-- =============================================
-- 11. SUGESTÕES PARA MELHORIA DO FORMULÁRIO
-- =============================================

SELECT
  '=== SUGESTÕES DE MELHORIA ===' as info;

-- Campos que aparecem em todos os leads (obrigatórios de fato)
SELECT
  'Campos presentes em TODOS os leads' as categoria,
  key as campo,
  COUNT(*) as presente_em
FROM leads,
  jsonb_each(briefing_data)
GROUP BY key
HAVING COUNT(*) = (SELECT COUNT(*) FROM leads)
ORDER BY campo;

-- Campos que aparecem em alguns leads (opcionais ou inconsistentes)
SELECT
  'Campos presentes em ALGUNS leads' as categoria,
  key as campo,
  COUNT(*) as presente_em,
  (SELECT COUNT(*) FROM leads) - COUNT(*) as ausente_em,
  ROUND(COUNT(*)::NUMERIC / (SELECT COUNT(*) FROM leads) * 100, 2) || '%' as percentual_preenchimento
FROM leads,
  jsonb_each(briefing_data)
GROUP BY key
HAVING COUNT(*) < (SELECT COUNT(*) FROM leads)
ORDER BY COUNT(*) DESC;

-- =============================================
-- 12. EXPORT PARA ANÁLISE EXTERNA
-- =============================================

SELECT
  '=== DADOS COMPLETOS PARA EXPORT ===' as info;

-- Formato CSV-friendly
SELECT
  id::TEXT,
  nome,
  email,
  whatsapp,
  status,
  briefing_data->>'consultorio' as consultorio,
  briefing_data->>'cidade' as cidade,
  briefing_data->>'estado' as estado,
  briefing_data->'especialidades'::TEXT as especialidades,
  valor_total / 100.0 as valor_total_reais,
  created_at::TEXT,
  updated_at::TEXT
FROM leads
ORDER BY created_at DESC;

-- =============================================
-- FIM DA ANÁLISE
-- =============================================

-- RESUMO:
-- Este script analisa em profundidade os leads já cadastrados
-- Identifica padrões, campos preenchidos, qualidade dos dados
-- Oferece insights para melhorias no formulário e processo
