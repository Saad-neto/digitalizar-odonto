-- Contar posts restaurados
SELECT
  COUNT(*) as total_posts,
  COUNT(*) FILTER (WHERE status = 'published') as publicados
FROM blog_posts;

-- Listar todos os posts
SELECT
  bp.title,
  bp.slug,
  bp.status,
  bc.name as categoria,
  bp.published_at
FROM blog_posts bp
LEFT JOIN blog_categories bc ON bp.category_id = bc.id
ORDER BY bp.published_at DESC;
