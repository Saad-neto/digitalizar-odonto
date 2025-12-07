-- =====================================================
-- VERIFICAÇÃO PRÁTICA: OS DADOS ESTÃO SENDO SALVOS?
-- Execute este script para confirmar
-- =====================================================

-- =====================================================
-- 1. VERIFICAR SE A TABELA EXISTE
-- =====================================================

SELECT
  '=== A TABELA LEADS EXISTE? ===' as verificacao;

SELECT
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'leads';

-- Se retornar 1 linha: ✅ Tabela existe
-- Se retornar 0 linhas: ❌ Tabela não existe

-- =====================================================
-- 2. QUANTOS LEADS FORAM CADASTRADOS?
-- =====================================================

SELECT
  '=== QUANTOS LEADS EXISTEM? ===' as verificacao;

SELECT COUNT(*) as total_leads
FROM leads;

-- Se retornar > 0: ✅ Tem leads salvos
-- Se retornar 0: ❌ Nenhum lead foi salvo

-- =====================================================
-- 3. LISTAR TODOS OS LEADS (RESUMO)
-- =====================================================

SELECT
  '=== LISTA DE TODOS OS LEADS ===' as verificacao;

SELECT
  id,
  nome,
  email,
  whatsapp,
  status,
  created_at,
  -- Verificar se briefing_data existe
  CASE
    WHEN briefing_data IS NOT NULL AND briefing_data != '{}'::jsonb
    THEN '✅ TEM DADOS'
    ELSE '❌ VAZIO'
  END as briefing_status,
  -- Tamanho aproximado dos dados
  ROUND(LENGTH(briefing_data::text) / 1024.0, 2) || ' KB' as tamanho_dados
FROM leads
ORDER BY created_at DESC;

-- =====================================================
-- 4. VER DADOS COMPLETOS DO ÚLTIMO LEAD
-- =====================================================

SELECT
  '=== ÚLTIMO LEAD CADASTRADO - DADOS COMPLETOS ===' as verificacao;

SELECT
  id,
  nome,
  email,
  whatsapp,
  created_at,
  -- Ver briefing formatado
  jsonb_pretty(briefing_data) as briefing_completo
FROM leads
ORDER BY created_at DESC
LIMIT 1;

-- =====================================================
-- 5. VERIFICAR CAMPOS ESPECÍFICOS
-- =====================================================

SELECT
  '=== VERIFICAR SE CAMPOS FORAM PREENCHIDOS ===' as verificacao;

SELECT
  nome,
  email,

  -- Seção 1: Homepage
  briefing_data->>'nome_consultorio' as consultorio,
  briefing_data->>'tem_slogan' as tem_slogan,
  briefing_data->>'slogan_texto' as slogan,

  -- Seção 2: Especialidades
  briefing_data->'especialidades' as especialidades,

  -- Seção 3: Serviços
  briefing_data->>'servicos_procurados' as servicos,

  -- Seção 4: Localização
  briefing_data->>'cidade' as cidade,
  briefing_data->>'uf' as estado,

  -- Verificar se tem arquivos
  CASE WHEN briefing_data->'logotipo_upload' IS NOT NULL THEN '✓' ELSE '✗' END as tem_logo,
  CASE WHEN briefing_data->'fotos_upload' IS NOT NULL THEN '✓' ELSE '✗' END as tem_fotos

FROM leads
ORDER BY created_at DESC;

-- =====================================================
-- 6. VERIFICAR ARQUIVOS (IMAGENS)
-- =====================================================

SELECT
  '=== VERIFICAR UPLOADS DE IMAGENS ===' as verificacao;

SELECT
  nome,

  -- Logo
  briefing_data->'logotipo_upload'->>'name' as logo_arquivo,
  CASE
    WHEN briefing_data->'logotipo_upload'->>'data' IS NOT NULL
    THEN '✅ ENVIADO (' || ROUND(LENGTH(briefing_data->'logotipo_upload'->>'data') / 1024.0, 2) || ' KB)'
    ELSE '❌ NÃO ENVIADO'
  END as logo_status,

  -- Fotos
  CASE
    WHEN briefing_data->'fotos_upload' IS NOT NULL
    THEN '✅ ' || jsonb_array_length(briefing_data->'fotos_upload') || ' foto(s)'
    ELSE '❌ SEM FOTOS'
  END as fotos_status,

  -- Depoimentos
  CASE
    WHEN briefing_data->'depoimentos_upload' IS NOT NULL
    THEN '✅ ' || jsonb_array_length(briefing_data->'depoimentos_upload') || ' depoimento(s)'
    ELSE '❌ SEM DEPOIMENTOS'
  END as depoimentos_status

FROM leads
ORDER BY created_at DESC;

-- =====================================================
-- 7. TESTAR SE CONSEGUE BUSCAR POR ID
-- =====================================================

SELECT
  '=== TESTAR BUSCA POR ID ===' as verificacao;

-- Primeiro, pegar o ID do último lead
WITH ultimo_lead AS (
  SELECT id FROM leads ORDER BY created_at DESC LIMIT 1
)
-- Depois buscar por esse ID
SELECT
  l.id,
  l.nome,
  l.email,
  'Se você está vendo isso, a busca por ID funciona! ✅' as resultado
FROM leads l
WHERE l.id = (SELECT id FROM ultimo_lead);

-- =====================================================
-- 8. VERIFICAR INTEGRIDADE DOS DADOS
-- =====================================================

SELECT
  '=== VERIFICAÇÃO DE INTEGRIDADE ===' as verificacao;

SELECT
  nome,

  -- Campos obrigatórios preenchidos?
  CASE WHEN nome IS NOT NULL AND nome != '' THEN '✓' ELSE '✗' END as tem_nome,
  CASE WHEN email IS NOT NULL AND email != '' THEN '✓' ELSE '✗' END as tem_email,
  CASE WHEN whatsapp IS NOT NULL AND whatsapp != '' THEN '✓' ELSE '✗' END as tem_whatsapp,

  -- Briefing preenchido?
  CASE
    WHEN briefing_data IS NOT NULL AND briefing_data != '{}'::jsonb
    THEN '✓ COMPLETO'
    ELSE '✗ VAZIO'
  END as briefing_ok,

  -- Quantos campos no briefing?
  (SELECT COUNT(*) FROM jsonb_object_keys(briefing_data)) as campos_preenchidos,

  -- Status
  status,

  -- Quando foi criado
  created_at,
  EXTRACT(HOUR FROM (NOW() - created_at)) || ' horas atrás' as tempo_desde_criacao

FROM leads
ORDER BY created_at DESC;

-- =====================================================
-- 9. RESUMO FINAL
-- =====================================================

SELECT
  '=== RESUMO FINAL ===' as verificacao;

SELECT
  (SELECT COUNT(*) FROM leads) as total_leads_cadastrados,

  (SELECT COUNT(*) FROM leads WHERE briefing_data IS NOT NULL AND briefing_data != '{}'::jsonb) as leads_com_dados,

  (SELECT COUNT(*) FROM leads WHERE briefing_data->'logotipo_upload' IS NOT NULL) as leads_com_logo,

  (SELECT COUNT(*) FROM leads WHERE briefing_data->'fotos_upload' IS NOT NULL) as leads_com_fotos,

  (SELECT ROUND(AVG(LENGTH(briefing_data::text)) / 1024.0, 2) FROM leads) as tamanho_medio_kb,

  (SELECT MAX(created_at) FROM leads) as ultimo_cadastro,

  CASE
    WHEN (SELECT COUNT(*) FROM leads) > 0 THEN '✅ DADOS ESTÃO SENDO SALVOS!'
    ELSE '❌ NENHUM DADO SALVO'
  END as conclusao;

-- =====================================================
-- FIM DA VERIFICAÇÃO
-- =====================================================

/*
COMO INTERPRETAR OS RESULTADOS:

✅ TUDO FUNCIONANDO:
- total_leads_cadastrados > 0
- leads_com_dados > 0
- Última verificação mostra: "✅ DADOS ESTÃO SENDO SALVOS!"

❌ PROBLEMA:
- total_leads_cadastrados = 0
- Tabela existe mas não tem dados
- Verificar se o formulário está enviando para o Supabase correto

⚠️ DADOS INCOMPLETOS:
- total_leads > 0 mas leads_com_dados = 0
- briefing_data está vazio
- Verificar se a função createLead() está funcionando
*/
