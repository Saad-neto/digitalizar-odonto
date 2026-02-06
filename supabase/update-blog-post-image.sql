-- =============================================
-- ATUALIZAR POST COM IMAGEM DESTACADA
-- =============================================

-- Atualizar o post com a URL da imagem destacada
UPDATE blog_posts
SET featured_image = '/blog-featured-image.png',
    updated_at = NOW()
WHERE slug = 'por-que-consultorio-odontologico-precisa-site-2026';

-- Verificar se foi atualizado
SELECT
  id,
  title,
  slug,
  featured_image,
  status,
  published_at
FROM blog_posts
WHERE slug = 'por-que-consultorio-odontologico-precisa-site-2026';
