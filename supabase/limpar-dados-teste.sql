-- =============================================
-- SCRIPT DE LIMPEZA DE DADOS DE TESTE
-- Sites Odonto 24H - Preparação para Produção
-- =============================================
--
-- ATENÇÃO: Este script irá DELETAR TODOS os dados das tabelas
-- Use APENAS quando tiver certeza de que quer limpar tudo
--
-- Data de criação: 2026-01-06
-- =============================================

-- IMPORTANTE: Execute este script no Supabase SQL Editor
-- Certifique-se de ter backup se houver dados importantes

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
-- 2. LIMPAR DADOS DO BLOG
-- =============================================

-- Deletar relações post-tag (tabela junction)
DELETE FROM blog_post_tags;

-- Deletar posts do blog
DELETE FROM blog_posts;

-- Deletar tags
DELETE FROM blog_tags;

-- Deletar categorias
DELETE FROM blog_categories;

-- =============================================
-- 3. LIMPAR DADOS DE LEADS E PAGAMENTOS
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
-- 5. LIMPAR STORAGE BUCKETS (ARQUIVOS)
-- =============================================

-- ATENÇÃO: Supabase Storage não pode ser limpo via SQL
-- Você precisa fazer isso manualmente no Dashboard do Supabase
--
-- Para limpar os arquivos:
-- 1. Acesse o Supabase Dashboard
-- 2. Vá em Storage
-- 3. Para cada bucket (logos, fotos, depoimentos, blog-images):
--    - Selecione todos os arquivos
--    - Clique em Delete
--
-- OU use a CLI do Supabase se tiver configurado:
-- supabase storage rm logos/* --recursive
-- supabase storage rm fotos/* --recursive
-- supabase storage rm depoimentos/* --recursive
-- supabase storage rm blog-images/* --recursive

-- =============================================
-- 6. VERIFICAR LIMPEZA
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
  RAISE NOTICE 'Blog Posts: %', count_blog_posts;
  RAISE NOTICE 'Blog Categories: %', count_blog_categories;
  RAISE NOTICE 'Blog Tags: %', count_blog_tags;
  RAISE NOTICE '===========================================';

  IF count_leads = 0 AND count_payments = 0 AND count_agendamentos = 0 THEN
    RAISE NOTICE '✓ Limpeza concluída com sucesso!';
  ELSE
    RAISE NOTICE '⚠ Ainda existem registros nas tabelas';
  END IF;
END $$;

-- =============================================
-- FIM DO SCRIPT
-- =============================================

-- PRÓXIMOS PASSOS APÓS EXECUTAR ESTE SCRIPT:
--
-- 1. Limpar arquivos dos buckets de storage (via Dashboard)
-- 2. Verificar se todas as tabelas estão vazias
-- 3. Criar categorias iniciais do blog (se necessário)
-- 4. Fazer backup deste estado limpo
-- 5. Começar a divulgação! 🚀
