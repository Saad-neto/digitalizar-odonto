-- Verificar quantos posts existem
SELECT COUNT(*) as total_posts FROM blog_posts;

-- Listar posts com tamanho do conteúdo
SELECT
  title,
  slug,
  status,
  LENGTH(content::text) as tamanho_conteudo,
  LENGTH(excerpt) as tamanho_resumo,
  published_at
FROM blog_posts
ORDER BY published_at DESC;
