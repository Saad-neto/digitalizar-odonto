-- =====================================================
-- VERIFICAR SE TODAS AS INFORMAÇÕES DO BRIEFING ESTÃO LÁ
-- Execute no SQL Editor do Supabase
-- =====================================================

-- =====================================================
-- 1. VER O BRIEFING COMPLETO (JSON FORMATADO)
-- =====================================================

SELECT
  '=== BRIEFING COMPLETO DO PRIMEIRO LEAD ===' as titulo;

SELECT
  nome,
  email,
  created_at,
  -- Mostrar o JSON formatado e bonito
  jsonb_pretty(briefing_data) as briefing_completo
FROM leads
ORDER BY created_at DESC
LIMIT 1;

-- ⚠️ OLHE O RESULTADO ACIMA!
-- Você deve ver um JSON grande com TODOS os campos das 8 seções
-- Se estiver vazio {} ou com poucos campos, há um problema

-- =====================================================
-- 2. CONTAR QUANTOS CAMPOS TEM NO BRIEFING
-- =====================================================

SELECT
  '=== QUANTIDADE DE CAMPOS NO BRIEFING ===' as titulo;

SELECT
  nome,
  email,
  (SELECT COUNT(*) FROM jsonb_object_keys(briefing_data)) as total_campos_preenchidos,
  -- Esperado: pelo menos 20-30 campos se preencheu tudo
  CASE
    WHEN (SELECT COUNT(*) FROM jsonb_object_keys(briefing_data)) >= 20 THEN '✅ COMPLETO'
    WHEN (SELECT COUNT(*) FROM jsonb_object_keys(briefing_data)) >= 10 THEN '⚠️ PARCIAL'
    ELSE '❌ VAZIO OU INCOMPLETO'
  END as status
FROM leads
ORDER BY created_at DESC;

-- =====================================================
-- 3. LISTAR TODOS OS CAMPOS QUE FORAM SALVOS
-- =====================================================

SELECT
  '=== LISTA DE TODOS OS CAMPOS SALVOS ===' as titulo;

SELECT DISTINCT
  jsonb_object_keys(briefing_data) as campos_salvos
FROM leads
ORDER BY campos_salvos;

-- ⚠️ VOCÊ DEVE VER CAMPOS COMO:
-- - nome_consultorio
-- - tem_slogan
-- - slogan_texto
-- - especialidades
-- - servicos_procurados
-- - convenios
-- - equipamentos
-- - cep
-- - rua
-- - cidade
-- - logotipo_upload
-- - fotos_upload
-- - estilo_fonte
-- - tom_linguagem
-- ... etc

-- =====================================================
-- 4. VERIFICAR SEÇÃO POR SEÇÃO
-- =====================================================

SELECT
  '=== SEÇÃO 1: HOMEPAGE/CABEÇALHO ===' as titulo;

SELECT
  nome,
  briefing_data ? 'nome_consultorio' as tem_nome_consultorio,
  briefing_data ? 'tem_slogan' as tem_flag_slogan,
  briefing_data ? 'slogan_texto' as tem_slogan_texto,
  briefing_data ? 'especialidades' as tem_especialidades,
  -- Valores
  briefing_data->>'nome_consultorio' as consultorio,
  briefing_data->>'slogan_texto' as slogan,
  briefing_data->'especialidades' as especialidades
FROM leads
ORDER BY created_at DESC;

-- -----

SELECT
  '=== SEÇÃO 2: SOBRE NÓS/EQUIPE ===' as titulo;

SELECT
  nome,
  briefing_data ? 'numero_dentistas' as tem_numero_dentistas,
  briefing_data ? 'profissionais' as tem_profissionais,
  -- Valores
  briefing_data->>'numero_dentistas' as qtd_dentistas,
  briefing_data->'profissionais' as dados_profissionais
FROM leads
ORDER BY created_at DESC;

-- -----

SELECT
  '=== SEÇÃO 3: SERVIÇOS ===' as titulo;

SELECT
  nome,
  briefing_data ? 'servicos_procurados' as tem_servicos,
  briefing_data ? 'convenios' as tem_convenios,
  briefing_data ? 'convenios_lista' as tem_lista_convenios,
  briefing_data ? 'emergencia_24h' as tem_emergencia,
  -- Valores
  briefing_data->>'servicos_procurados' as servicos,
  briefing_data->>'convenios' as aceita_convenios,
  briefing_data->>'convenios_lista' as lista_convenios,
  briefing_data->>'emergencia_24h' as emergencia_24h
FROM leads
ORDER BY created_at DESC;

-- -----

SELECT
  '=== SEÇÃO 4: TECNOLOGIA/EQUIPAMENTOS ===' as titulo;

SELECT
  nome,
  briefing_data ? 'equipamentos' as tem_equipamentos,
  briefing_data ? 'sedacao_consciente' as tem_sedacao,
  -- Valores
  briefing_data->'equipamentos' as equipamentos,
  briefing_data->>'sedacao_consciente' as sedacao
FROM leads
ORDER BY created_at DESC;

-- -----

SELECT
  '=== SEÇÃO 5: LOCALIZAÇÃO/CONTATO ===' as titulo;

SELECT
  nome,
  briefing_data ? 'cep' as tem_cep,
  briefing_data ? 'rua' as tem_rua,
  briefing_data ? 'cidade' as tem_cidade,
  briefing_data ? 'uf' as tem_uf,
  briefing_data ? 'estacionamento' as tem_estacionamento,
  briefing_data ? 'redes_sociais' as tem_redes_sociais,
  -- Valores
  briefing_data->>'cep' as cep,
  briefing_data->>'rua' as rua,
  briefing_data->>'numero' as numero,
  briefing_data->>'cidade' as cidade,
  briefing_data->>'uf' as uf,
  briefing_data->'redes_sociais' as redes_sociais,
  briefing_data->>'link_facebook' as facebook,
  briefing_data->>'link_instagram' as instagram
FROM leads
ORDER BY created_at DESC;

-- -----

SELECT
  '=== SEÇÃO 6: DEPOIMENTOS ===' as titulo;

SELECT
  nome,
  briefing_data ? 'tem_depoimentos' as tem_flag_depoimentos,
  briefing_data ? 'depoimentos_upload' as tem_arquivos_depoimentos,
  briefing_data ? 'avaliacoes_google' as tem_avaliacoes_google,
  -- Valores
  briefing_data->>'tem_depoimentos' as depoimentos,
  briefing_data->>'avaliacoes_google' as google_reviews,
  CASE
    WHEN briefing_data->'depoimentos_upload' IS NOT NULL
    THEN jsonb_array_length(briefing_data->'depoimentos_upload')
    ELSE 0
  END as qtd_depoimentos_upload
FROM leads
ORDER BY created_at DESC;

-- -----

SELECT
  '=== SEÇÃO 7: IDENTIDADE VISUAL ===' as titulo;

SELECT
  nome,
  briefing_data ? 'logotipo_existente' as tem_flag_logo,
  briefing_data ? 'logotipo_upload' as tem_arquivo_logo,
  briefing_data ? 'manual_marca' as tem_manual_marca,
  briefing_data ? 'fotos_consultorio' as tem_flag_fotos,
  briefing_data ? 'fotos_upload' as tem_arquivos_fotos,
  briefing_data ? 'estilo_fonte' as tem_estilo,
  briefing_data ? 'tom_linguagem' as tem_tom,
  -- Valores
  briefing_data->>'logotipo_existente' as logo_existente,
  briefing_data->>'estilo_fonte' as estilo,
  briefing_data->>'tom_linguagem' as tom,
  briefing_data->>'textos_existentes' as textos_customizados,
  CASE
    WHEN briefing_data->'fotos_upload' IS NOT NULL
    THEN jsonb_array_length(briefing_data->'fotos_upload')
    ELSE 0
  END as qtd_fotos_upload
FROM leads
ORDER BY created_at DESC;

-- =====================================================
-- 5. VERIFICAR SE OS ARQUIVOS (IMAGENS) ESTÃO LÁ
-- =====================================================

SELECT
  '=== VERIFICAR UPLOADS DE IMAGENS ===' as titulo;

SELECT
  nome,
  -- Logo
  CASE
    WHEN briefing_data->'logotipo_upload' IS NOT NULL THEN '✅ TEM LOGO'
    ELSE '❌ SEM LOGO'
  END as status_logo,
  briefing_data->'logotipo_upload'->>'name' as nome_arquivo_logo,
  CASE
    WHEN briefing_data->'logotipo_upload'->>'data' IS NOT NULL
    THEN ROUND(LENGTH(briefing_data->'logotipo_upload'->>'data') / 1024.0, 2) || ' KB'
    ELSE 'N/A'
  END as tamanho_logo,

  -- Fotos
  CASE
    WHEN briefing_data->'fotos_upload' IS NOT NULL THEN '✅ TEM FOTOS'
    ELSE '❌ SEM FOTOS'
  END as status_fotos,
  COALESCE(jsonb_array_length(briefing_data->'fotos_upload'), 0) as quantidade_fotos,

  -- Depoimentos
  CASE
    WHEN briefing_data->'depoimentos_upload' IS NOT NULL THEN '✅ TEM DEPOIMENTOS'
    ELSE '❌ SEM DEPOIMENTOS'
  END as status_depoimentos,
  COALESCE(jsonb_array_length(briefing_data->'depoimentos_upload'), 0) as quantidade_depoimentos

FROM leads
ORDER BY created_at DESC;

-- =====================================================
-- 6. CAMPOS QUE FALTAM (COMPARAÇÃO)
-- =====================================================

SELECT
  '=== CAMPOS ESPERADOS vs CAMPOS SALVOS ===' as titulo;

-- Campos que DEVERIAM existir (se preencheu tudo)
WITH campos_esperados AS (
  SELECT unnest(ARRAY[
    'nome_consultorio',
    'tem_slogan',
    'slogan_texto',
    'especialidades',
    'outras_especialidades',
    'numero_dentistas',
    'profissionais',
    'servicos_procurados',
    'convenios',
    'convenios_lista',
    'emergencia_24h',
    'equipamentos',
    'sedacao_consciente',
    'cep',
    'rua',
    'bairro',
    'cidade',
    'uf',
    'numero',
    'complemento',
    'estacionamento',
    'redes_sociais',
    'link_facebook',
    'link_instagram',
    'link_youtube',
    'link_linkedin',
    'link_tiktok',
    'incorporarMapa',
    'link_google_maps',
    'link_google_avaliacoes',
    'tem_depoimentos',
    'depoimentos_upload',
    'avaliacoes_google',
    'logotipo_existente',
    'logotipo_upload',
    'manual_marca',
    'fotos_consultorio',
    'fotos_upload',
    'estilo_fonte',
    'tom_linguagem',
    'textos_existentes'
  ]) as campo
),
campos_salvos AS (
  SELECT DISTINCT jsonb_object_keys(briefing_data) as campo
  FROM leads
)
SELECT
  e.campo as campo_esperado,
  CASE
    WHEN s.campo IS NOT NULL THEN '✅ SALVO'
    ELSE '❌ FALTANDO'
  END as status
FROM campos_esperados e
LEFT JOIN campos_salvos s ON e.campo = s.campo
ORDER BY status, campo_esperado;

-- =====================================================
-- 7. RESUMO FINAL - DIAGNÓSTICO
-- =====================================================

SELECT
  '=== DIAGNÓSTICO FINAL ===' as titulo;

WITH dados AS (
  SELECT
    COUNT(*) as total_leads,
    AVG((SELECT COUNT(*) FROM jsonb_object_keys(briefing_data))) as media_campos,
    MAX((SELECT COUNT(*) FROM jsonb_object_keys(briefing_data))) as max_campos,
    MIN((SELECT COUNT(*) FROM jsonb_object_keys(briefing_data))) as min_campos
  FROM leads
)
SELECT
  total_leads,
  ROUND(media_campos::numeric, 0) as media_campos_preenchidos,
  max_campos,
  min_campos,
  CASE
    WHEN media_campos >= 30 THEN '✅ BRIEFING COMPLETO - Tudo OK!'
    WHEN media_campos >= 15 THEN '⚠️ BRIEFING PARCIAL - Faltam alguns campos'
    WHEN media_campos >= 5 THEN '⚠️ BRIEFING BÁSICO - Muitos campos faltando'
    ELSE '❌ BRIEFING VAZIO OU QUASE VAZIO'
  END as diagnostico
FROM dados;

-- =====================================================
-- 8. VER UM EXEMPLO REAL DE CADA TIPO DE DADO
-- =====================================================

SELECT
  '=== AMOSTRA DE DADOS REAIS ===' as titulo;

SELECT
  nome as lead_nome,
  -- Texto simples
  briefing_data->>'nome_consultorio' as exemplo_texto_simples,
  -- Array
  briefing_data->'especialidades' as exemplo_array,
  -- Objeto (logo)
  briefing_data->'logotipo_upload' as exemplo_objeto,
  -- Booleano/Radio
  briefing_data->>'convenios' as exemplo_sim_nao
FROM leads
ORDER BY created_at DESC
LIMIT 1;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================

/*
COMO INTERPRETAR OS RESULTADOS:

✅ TUDO OK:
   - Query 1: Mostra JSON grande com muitos campos
   - Query 2: total_campos_preenchidos >= 20
   - Query 6: Maioria dos campos marcados como "✅ SALVO"
   - Query 7: Diagnóstico = "✅ BRIEFING COMPLETO"

⚠️ DADOS PARCIAIS:
   - Query 1: JSON pequeno
   - Query 2: total_campos entre 5-15
   - Query 6: Muitos campos "❌ FALTANDO"
   - Query 7: Diagnóstico = "⚠️ BRIEFING PARCIAL"

❌ PROBLEMA:
   - Query 1: briefing_data = {} ou quase vazio
   - Query 2: total_campos < 5
   - Query 6: Quase tudo "❌ FALTANDO"
   - Query 7: Diagnóstico = "❌ BRIEFING VAZIO"

AÇÃO RECOMENDADA:
   Se estiver vazio/parcial:
   1. Abra DevTools (F12) ao preencher o formulário
   2. Veja console ao clicar "Finalizar"
   3. Verifique se há erros
   4. Teste o formulário novamente
*/
