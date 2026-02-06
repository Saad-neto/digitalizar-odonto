-- =============================================
-- UPDATE: Atualizar imagem do post "Por que consultórios com site captam 3x mais"
-- =============================================

UPDATE blog_posts
SET
  featured_image = 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&q=80',
  updated_at = NOW()
WHERE slug = 'por-que-consultorio-odontologico-precisa-site-2026';

-- Verificar se foi atualizado
SELECT
  title,
  slug,
  featured_image,
  updated_at
FROM blog_posts
WHERE slug = 'por-que-consultorio-odontologico-precisa-site-2026';
