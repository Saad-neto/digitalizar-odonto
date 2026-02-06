-- Corrigir categoria do post definitivamente
UPDATE blog_posts
SET category_id = (
  SELECT id FROM blog_categories
  WHERE slug = 'marketing-para-dentistas'
  LIMIT 1
)
WHERE slug = 'quanto-custa-site-para-dentista-2026'
  AND category_id IS NULL;

-- Verificar resultado
SELECT
  bp.title,
  bp.slug,
  bp.status,
  bc.name as categoria,
  bp.published_at
FROM blog_posts bp
LEFT JOIN blog_categories bc ON bp.category_id = bc.id
WHERE bp.slug = 'quanto-custa-site-para-dentista-2026';
