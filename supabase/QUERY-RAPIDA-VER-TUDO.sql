-- =====================================================
-- QUERY SUPER RÁPIDA: VER SE TEM TUDO!
-- Execute esta query AGORA no SQL Editor
-- =====================================================

-- Esta query mostra o JSON COMPLETO formatado
-- Se tiver tudo, você vai ver um JSON ENORME com todas as 8 seções

SELECT
  nome,
  email,
  created_at,
  jsonb_pretty(briefing_data) as BRIEFING_COMPLETO
FROM leads
ORDER BY created_at DESC
LIMIT 1;

-- ⬆️ OLHE O RESULTADO ACIMA! ⬆️
--
-- ✅ SE VER:
-- {
--   "nome_consultorio": "...",
--   "tem_slogan": "sim",
--   "slogan_texto": "...",
--   "especialidades": [...],
--   "servicos_procurados": "...",
--   "equipamentos": [...],
--   "cep": "...",
--   "rua": "...",
--   "cidade": "...",
--   "logotipo_upload": { ... },
--   "fotos_upload": [...],
--   ... (muito mais)
-- }
-- → ESTÁ TUDO LÁ! ✅
--
-- ❌ SE VER:
-- {} (vazio)
-- ou apenas 2-3 campos
-- → NÃO ESTÁ SALVANDO TUDO! ❌

-- =====================================================
-- CONTAGEM RÁPIDA: Quantos campos tem?
-- =====================================================

SELECT
  nome,
  (SELECT COUNT(*) FROM jsonb_object_keys(briefing_data)) as campos_preenchidos,
  CASE
    WHEN (SELECT COUNT(*) FROM jsonb_object_keys(briefing_data)) >= 25 THEN '✅ COMPLETO'
    WHEN (SELECT COUNT(*) FROM jsonb_object_keys(briefing_data)) >= 10 THEN '⚠️ PARCIAL'
    ELSE '❌ VAZIO'
  END as status
FROM leads
ORDER BY created_at DESC;

-- Esperado: >= 25 campos se preencheu todas as 8 seções
