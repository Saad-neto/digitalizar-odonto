-- =====================================================
-- VISUALIZAR TODOS OS DADOS DOS LEADS
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- =====================================================
-- 1. LISTAGEM BÁSICA DE TODOS OS LEADS
-- =====================================================

SELECT
  '=== LEADS CADASTRADOS ===' as info;

SELECT
  id,
  nome,
  email,
  whatsapp,
  status,
  created_at,
  updated_at
FROM leads
ORDER BY created_at DESC;

-- =====================================================
-- 2. VER DADOS COMPLETOS DO PRIMEIRO LEAD
-- =====================================================

SELECT
  '=== LEAD 1 - DADOS COMPLETOS ===' as info;

SELECT
  -- Identificação
  id,
  nome,
  email,
  whatsapp,
  status,
  created_at,

  -- AQUI ESTÁ TODO O BRIEFING (JSON)
  -- Este campo contém TODAS as 8 páginas do formulário
  jsonb_pretty(briefing_data) as briefing_completo

FROM leads
ORDER BY created_at DESC
LIMIT 1;

-- =====================================================
-- 3. VER DADOS COMPLETOS DO SEGUNDO LEAD
-- =====================================================

SELECT
  '=== LEAD 2 - DADOS COMPLETOS ===' as info;

SELECT
  id,
  nome,
  email,
  whatsapp,
  status,
  created_at,
  jsonb_pretty(briefing_data) as briefing_completo
FROM leads
ORDER BY created_at DESC
OFFSET 1
LIMIT 1;

-- =====================================================
-- 4. EXTRAIR DADOS ESPECÍFICOS DE CADA SEÇÃO
-- =====================================================

SELECT
  '=== SEÇÃO 1: CABEÇALHO/HOMEPAGE ===' as info;

SELECT
  nome,
  briefing_data->>'nome_consultorio' as nome_consultorio,
  briefing_data->>'tem_slogan' as tem_slogan,
  briefing_data->>'slogan_texto' as slogan,
  briefing_data->'especialidades' as especialidades,
  briefing_data->>'outras_especialidades' as outras_especialidades
FROM leads
ORDER BY created_at DESC;

-- =====================================================

SELECT
  '=== SEÇÃO 2: EQUIPE ===' as info;

SELECT
  nome,
  briefing_data->>'numero_dentistas' as quantidade_dentistas,
  briefing_data->'profissionais' as profissionais_dados
FROM leads
ORDER BY created_at DESC;

-- =====================================================

SELECT
  '=== SEÇÃO 3: SERVIÇOS ===' as info;

SELECT
  nome,
  briefing_data->>'servicos_procurados' as servicos,
  briefing_data->>'convenios' as aceita_convenios,
  briefing_data->>'convenios_lista' as lista_convenios,
  briefing_data->>'emergencia_24h' as emergencia_24h
FROM leads
ORDER BY created_at DESC;

-- =====================================================

SELECT
  '=== SEÇÃO 4: TECNOLOGIA/EQUIPAMENTOS ===' as info;

SELECT
  nome,
  briefing_data->'equipamentos' as equipamentos,
  briefing_data->>'sedacao_consciente' as sedacao_consciente
FROM leads
ORDER BY created_at DESC;

-- =====================================================

SELECT
  '=== SEÇÃO 5: LOCALIZAÇÃO/CONTATO ===' as info;

SELECT
  nome,
  briefing_data->>'cep' as cep,
  briefing_data->>'rua' as rua,
  briefing_data->>'numero' as numero,
  briefing_data->>'bairro' as bairro,
  briefing_data->>'cidade' as cidade,
  briefing_data->>'uf' as estado,
  briefing_data->>'complemento' as complemento,
  briefing_data->>'estacionamento' as tem_estacionamento,
  briefing_data->'redes_sociais' as redes_sociais,
  briefing_data->>'link_facebook' as facebook,
  briefing_data->>'link_instagram' as instagram,
  briefing_data->>'link_youtube' as youtube,
  briefing_data->>'link_linkedin' as linkedin,
  briefing_data->>'link_tiktok' as tiktok,
  briefing_data->>'link_google_maps' as google_maps,
  briefing_data->>'link_google_avaliacoes' as google_avaliacoes
FROM leads
ORDER BY created_at DESC;

-- =====================================================

SELECT
  '=== SEÇÃO 6: DEPOIMENTOS ===' as info;

SELECT
  nome,
  briefing_data->>'tem_depoimentos' as tem_depoimentos,
  briefing_data->'depoimentos_upload' as depoimentos_arquivos,
  briefing_data->>'avaliacoes_google' as avaliacoes_google
FROM leads
ORDER BY created_at DESC;

-- =====================================================

SELECT
  '=== SEÇÃO 7: IDENTIDADE VISUAL ===' as info;

SELECT
  nome,
  briefing_data->>'logotipo_existente' as tem_logo,
  briefing_data->'logotipo_upload' as logo_arquivo,
  briefing_data->>'manual_marca' as tem_manual_marca,
  briefing_data->>'fotos_consultorio' as tem_fotos,
  briefing_data->'fotos_upload' as fotos_arquivos,
  briefing_data->>'estilo_fonte' as estilo_fonte,
  briefing_data->>'tom_linguagem' as tom_linguagem,
  briefing_data->>'textos_existentes' as textos_customizados
FROM leads
ORDER BY created_at DESC;

-- =====================================================
-- 5. VERIFICAR ARQUIVOS (IMAGENS) ENVIADOS
-- =====================================================

SELECT
  '=== ARQUIVOS ENVIADOS (BASE64) ===' as info;

-- Verificar se tem logo
SELECT
  nome,
  CASE
    WHEN briefing_data->'logotipo_upload' IS NOT NULL THEN '✓ SIM'
    ELSE '✗ NÃO'
  END as tem_logo_enviado,

  -- Verificar tamanho aproximado do logo (em KB)
  CASE
    WHEN briefing_data->'logotipo_upload'->>'data' IS NOT NULL
    THEN ROUND(LENGTH(briefing_data->'logotipo_upload'->>'data') / 1024.0, 2) || ' KB'
    ELSE 'N/A'
  END as tamanho_logo,

  -- Nome do arquivo
  briefing_data->'logotipo_upload'->>'name' as nome_arquivo_logo
FROM leads
ORDER BY created_at DESC;

-- =====================================================

-- Verificar fotos do consultório
SELECT
  nome,
  CASE
    WHEN briefing_data->'fotos_upload' IS NOT NULL THEN '✓ SIM'
    ELSE '✗ NÃO'
  END as tem_fotos_enviadas,

  -- Quantidade de fotos
  CASE
    WHEN briefing_data->'fotos_upload' IS NOT NULL
    THEN jsonb_array_length(briefing_data->'fotos_upload')
    ELSE 0
  END as quantidade_fotos,

  -- Tamanho total aproximado (em MB)
  CASE
    WHEN briefing_data->'fotos_upload' IS NOT NULL
    THEN ROUND(
      (
        SELECT SUM(LENGTH(foto->>'data'))
        FROM jsonb_array_elements(briefing_data->'fotos_upload') as foto
      ) / 1024.0 / 1024.0, 2
    ) || ' MB'
    ELSE 'N/A'
  END as tamanho_total_fotos
FROM leads
ORDER BY created_at DESC;

-- =====================================================

-- Verificar depoimentos
SELECT
  nome,
  CASE
    WHEN briefing_data->'depoimentos_upload' IS NOT NULL THEN '✓ SIM'
    ELSE '✗ NÃO'
  END as tem_depoimentos_enviados,

  CASE
    WHEN briefing_data->'depoimentos_upload' IS NOT NULL
    THEN jsonb_array_length(briefing_data->'depoimentos_upload')
    ELSE 0
  END as quantidade_depoimentos
FROM leads
ORDER BY created_at DESC;

-- =====================================================

-- Listar TODOS os arquivos enviados
SELECT
  nome,
  'Logo' as tipo_arquivo,
  briefing_data->'logotipo_upload'->>'name' as nome_arquivo,
  briefing_data->'logotipo_upload'->>'type' as tipo_mime,
  ROUND((briefing_data->'logotipo_upload'->>'size')::numeric / 1024.0, 2) || ' KB' as tamanho_original
FROM leads
WHERE briefing_data->'logotipo_upload' IS NOT NULL

UNION ALL

SELECT
  l.nome,
  'Foto Consultório' as tipo_arquivo,
  foto->>'name' as nome_arquivo,
  foto->>'type' as tipo_mime,
  ROUND((foto->>'size')::numeric / 1024.0, 2) || ' KB' as tamanho_original
FROM leads l,
  jsonb_array_elements(l.briefing_data->'fotos_upload') as foto
WHERE l.briefing_data->'fotos_upload' IS NOT NULL

UNION ALL

SELECT
  l.nome,
  'Depoimento' as tipo_arquivo,
  depo->>'name' as nome_arquivo,
  depo->>'type' as tipo_mime,
  ROUND((depo->>'size')::numeric / 1024.0, 2) || ' KB' as tamanho_original
FROM leads l,
  jsonb_array_elements(l.briefing_data->'depoimentos_upload') as depo
WHERE l.briefing_data->'depoimentos_upload' IS NOT NULL

ORDER BY nome, tipo_arquivo;

-- =====================================================
-- 6. TAMANHO TOTAL DOS DADOS
-- =====================================================

SELECT
  '=== TAMANHO TOTAL DOS DADOS ===' as info;

SELECT
  nome,

  -- Tamanho do briefing_data (em KB)
  ROUND(LENGTH(briefing_data::text) / 1024.0, 2) || ' KB' as tamanho_briefing,

  -- Tamanho em MB
  ROUND(LENGTH(briefing_data::text) / 1024.0 / 1024.0, 2) || ' MB' as tamanho_briefing_mb,

  -- Quantidade de campos no JSON
  (SELECT COUNT(*) FROM jsonb_object_keys(briefing_data)) as total_campos
FROM leads
ORDER BY created_at DESC;

-- =====================================================
-- 7. RESUMO EXECUTIVO
-- =====================================================

SELECT
  '=== RESUMO EXECUTIVO ===' as info;

WITH dados_agregados AS (
  SELECT
    COUNT(*) as total_leads,

    -- Contar quantos têm logo
    COUNT(*) FILTER (WHERE briefing_data->'logotipo_upload' IS NOT NULL) as com_logo,

    -- Contar quantos têm fotos
    COUNT(*) FILTER (WHERE briefing_data->'fotos_upload' IS NOT NULL) as com_fotos,

    -- Contar quantos têm depoimentos
    COUNT(*) FILTER (WHERE briefing_data->'depoimentos_upload' IS NOT NULL) as com_depoimentos,

    -- Total de arquivos
    (
      SELECT SUM(
        COALESCE(jsonb_array_length(briefing_data->'fotos_upload'), 0) +
        COALESCE(jsonb_array_length(briefing_data->'depoimentos_upload'), 0) +
        CASE WHEN briefing_data->'logotipo_upload' IS NOT NULL THEN 1 ELSE 0 END
      )
      FROM leads
    ) as total_arquivos,

    -- Tamanho total de todos os briefings
    ROUND(SUM(LENGTH(briefing_data::text)) / 1024.0 / 1024.0, 2) as tamanho_total_mb
  FROM leads
)
SELECT * FROM dados_agregados;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================

/*
IMPORTANTE:
Os dados estão armazenados na tabela 'leads', coluna 'briefing_data' (JSONB).

briefing_data contém TUDO que o cliente preencheu:
- Todas as 8 seções do formulário
- Todos os textos e respostas
- Todos os arquivos (logo, fotos, depoimentos) em formato base64

Para acessar:
1. Via SQL Editor do Supabase
2. Via código TypeScript usando supabase.from('leads').select('*')
3. Via dataProcessor.ts para dados estruturados
*/
