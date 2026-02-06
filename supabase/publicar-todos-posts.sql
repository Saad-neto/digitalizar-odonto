-- Publicar todos os posts do blog
UPDATE blog_posts
SET status = 'published',
    published_at = COALESCE(published_at, NOW())
WHERE status = 'draft';

-- Verificar resultado
SELECT
  title,
  slug,
  status,
  published_at
FROM blog_posts
ORDER BY published_at DESC;
