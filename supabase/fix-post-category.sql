-- Corrigir categoria do post "Quanto Custa um Site para Dentista"
-- A categoria correta é "Marketing para Dentistas"

UPDATE blog_posts
SET category_id = (
  SELECT id
  FROM blog_categories
  WHERE slug = 'marketing-para-dentistas'
  LIMIT 1
)
WHERE slug = 'quanto-custa-site-para-dentista-2026';

-- Verificar se foi atualizado
SELECT
  bp.id,
  bp.title,
  bp.slug,
  bp.status,
  bc.name as categoria,
  bc.slug as categoria_slug
FROM blog_posts bp
LEFT JOIN blog_categories bc ON bp.category_id = bc.id
WHERE bp.slug = 'quanto-custa-site-para-dentista-2026';
