-- =============================================
-- SCRIPT DE LIMPEZA - APENAS LEADS E AGENDAMENTOS
-- Sites Odonto 24H - Preparação para Produção
-- =============================================
--
-- ATENÇÃO: Este script deleta APENAS:
-- - Leads e dados relacionados (payments, notas, histórico)
-- - Agendamentos e dados relacionados (bloqueios, disponibilidade)
--
-- NÃO DELETA: Blog (posts, categorias, tags)
--
-- Data de criação: 2026-01-06
-- =============================================

-- =============================================
-- 1. LIMPAR DADOS DE AGENDAMENTOS
-- =============================================

-- Deletar bloqueios de horário
DELETE FROM bloqueios;

-- Deletar agendamentos
DELETE FROM agendamentos;

-- Deletar disponibilidade
DELETE FROM disponibilidade;

-- =============================================
-- 2. LIMPAR DADOS DE LEADS E PAGAMENTOS
-- =============================================

-- Deletar histórico de status dos leads
DELETE FROM lead_status_history;

-- Deletar notas dos leads
DELETE FROM lead_notes;

-- Deletar pagamentos (deve vir antes de leads por causa do FK)
DELETE FROM payments;

-- Deletar leads
DELETE FROM leads;

-- =============================================
-- 3. LIMPAR STORAGE BUCKETS (ARQUIVOS DE LEADS)
-- =============================================

-- ATENÇÃO: Supabase Storage não pode ser limpo via SQL
-- Você precisa fazer isso manualmente no Dashboard do Supabase
--
-- Para limpar os arquivos DE LEADS:
-- 1. Acesse o Supabase Dashboard
-- 2. Vá em Storage
-- 3. Para cada bucket:
--    - logos (limpar)
--    - fotos (limpar)
--    - depoimentos (limpar)
--    - blog-images (NÃO DELETAR - manter as imagens do blog!)
--
-- OU use a CLI do Supabase se tiver configurado:
-- supabase storage rm logos/* --recursive
-- supabase storage rm fotos/* --recursive
-- supabase storage rm depoimentos/* --recursive

-- =============================================
-- 4. VERIFICAR LIMPEZA
-- =============================================

-- Contar registros restantes em cada tabela
DO $$
DECLARE
  count_leads INTEGER;
  count_payments INTEGER;
  count_agendamentos INTEGER;
  count_blog_posts INTEGER;
  count_blog_categories INTEGER;
  count_blog_tags INTEGER;
BEGIN
  SELECT COUNT(*) INTO count_leads FROM leads;
  SELECT COUNT(*) INTO count_payments FROM payments;
  SELECT COUNT(*) INTO count_agendamentos FROM agendamentos;
  SELECT COUNT(*) INTO count_blog_posts FROM blog_posts;
  SELECT COUNT(*) INTO count_blog_categories FROM blog_categories;
  SELECT COUNT(*) INTO count_blog_tags FROM blog_tags;

  RAISE NOTICE '===========================================';
  RAISE NOTICE 'VERIFICAÇÃO PÓS-LIMPEZA:';
  RAISE NOTICE 'Leads: %', count_leads;
  RAISE NOTICE 'Payments: %', count_payments;
  RAISE NOTICE 'Agendamentos: %', count_agendamentos;
  RAISE NOTICE '--- Blog (deve estar intacto) ---';
  RAISE NOTICE 'Blog Posts: %', count_blog_posts;
  RAISE NOTICE 'Blog Categories: %', count_blog_categories;
  RAISE NOTICE 'Blog Tags: %', count_blog_tags;
  RAISE NOTICE '===========================================';

  IF count_leads = 0 AND count_payments = 0 AND count_agendamentos = 0 THEN
    RAISE NOTICE '✓ Limpeza de leads e agendamentos concluída!';
    IF count_blog_posts > 0 THEN
      RAISE NOTICE '✓ Blog mantido intacto com % posts', count_blog_posts;
    END IF;
  ELSE
    RAISE NOTICE '⚠ Ainda existem registros nas tabelas';
  END IF;
END $$;

-- =============================================
-- FIM DO SCRIPT
-- =============================================
