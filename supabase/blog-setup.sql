-- =============================================
-- SETUP DO BLOG INTEGRADO
-- Digitalizar Odonto - Sistema de Blog para SEO
-- =============================================

-- IMPORTANTE: Execute o setup.sql principal ANTES deste arquivo
-- (Este script depende da função update_updated_at_column() já existente)

-- =============================================
-- TABELA: blog_categories
-- Categorias hierárquicas para organização de posts
-- =============================================

CREATE TABLE IF NOT EXISTS blog_categories (
  -- Identificação
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Dados da categoria
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,

  -- Hierarquia (categoria pai)
  parent_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,

  -- Ordenação customizável
  display_order INTEGER DEFAULT 0
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_parent ON blog_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_blog_categories_order ON blog_categories(display_order);

-- =============================================
-- TABELA: blog_tags
-- Tags livres para categorização flexível
-- =============================================

CREATE TABLE IF NOT EXISTS blog_tags (
  -- Identificação
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Dados da tag
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON blog_tags(slug);
CREATE INDEX IF NOT EXISTS idx_blog_tags_name ON blog_tags(name);

-- =============================================
-- TABELA: blog_posts
-- Posts do blog
-- =============================================

CREATE TABLE IF NOT EXISTS blog_posts (
  -- Identificação
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Conteúdo principal
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT, -- Resumo curto para listagens e meta description padrão
  content JSONB NOT NULL, -- Conteúdo rico do Tiptap em formato JSON

  -- Imagem de capa
  featured_image TEXT, -- URL da imagem no storage

  -- SEO
  meta_title TEXT, -- Se NULL, usa title
  meta_description TEXT, -- Se NULL, usa excerpt

  -- Categorização
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,

  -- Autor
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,

  -- Status e publicação
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,

  -- Analytics
  view_count INTEGER DEFAULT 0
);

-- Índices para performance em queries comuns
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_view_count ON blog_posts(view_count DESC);

-- Trigger para atualizar updated_at automaticamente
-- (Reutiliza função já criada no setup.sql principal)
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- TABELA: blog_post_tags
-- Relação N:N entre posts e tags
-- =============================================

CREATE TABLE IF NOT EXISTS blog_post_tags (
  -- Chave composta
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Índices para queries bidirecionais
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_post ON blog_post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_tag ON blog_post_tags(tag_id);

-- =============================================
-- FUNCTIONS ÚTEIS
-- =============================================

-- Function: Incrementar contador de visualizações
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts
  SET view_count = view_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Function: Buscar posts relacionados (mesma categoria ou tags em comum)
CREATE OR REPLACE FUNCTION get_related_posts(
  p_post_id UUID,
  p_limit INTEGER DEFAULT 3
)
RETURNS TABLE(
  id UUID,
  title TEXT,
  slug TEXT,
  excerpt TEXT,
  featured_image TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH current_post AS (
    SELECT category_id
    FROM blog_posts
    WHERE blog_posts.id = p_post_id
  ),
  current_tags AS (
    SELECT tag_id
    FROM blog_post_tags
    WHERE post_id = p_post_id
  ),
  scored_posts AS (
    SELECT
      bp.id,
      bp.title,
      bp.slug,
      bp.excerpt,
      bp.featured_image,
      bp.published_at,
      bp.view_count,
      -- Score: +2 se mesma categoria, +1 por cada tag em comum
      (CASE WHEN bp.category_id = (SELECT category_id FROM current_post) THEN 2 ELSE 0 END +
       (SELECT COUNT(*) FROM blog_post_tags bpt
        WHERE bpt.post_id = bp.id AND bpt.tag_id IN (SELECT tag_id FROM current_tags))
      ) as relevance_score
    FROM blog_posts bp
    WHERE bp.id != p_post_id
      AND bp.status = 'published'
      AND bp.published_at IS NOT NULL
  )
  SELECT
    sp.id,
    sp.title,
    sp.slug,
    sp.excerpt,
    sp.featured_image,
    sp.published_at,
    sp.view_count
  FROM scored_posts sp
  WHERE sp.relevance_score > 0
  ORDER BY sp.relevance_score DESC, sp.view_count DESC, sp.published_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function: Estatísticas do blog
CREATE OR REPLACE FUNCTION blog_stats()
RETURNS TABLE(
  total_posts BIGINT,
  published_posts BIGINT,
  draft_posts BIGINT,
  total_views BIGINT,
  total_categories BIGINT,
  total_tags BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE status IN ('draft', 'published', 'archived')) as total_posts,
    COUNT(*) FILTER (WHERE status = 'published') as published_posts,
    COUNT(*) FILTER (WHERE status = 'draft') as draft_posts,
    COALESCE(SUM(view_count), 0) as total_views,
    (SELECT COUNT(*) FROM blog_categories) as total_categories,
    (SELECT COUNT(*) FROM blog_tags) as total_tags
  FROM blog_posts;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;

-- ===== BLOG_CATEGORIES =====

-- Policy: Leitura pública (qualquer um pode ver categorias)
CREATE POLICY "Leitura pública de categorias" ON blog_categories
  FOR SELECT
  USING (true);

-- Policy: Apenas admins autenticados podem criar/editar/deletar
CREATE POLICY "Admins podem gerenciar categorias" ON blog_categories
  FOR ALL
  USING (auth.role() = 'authenticated');

-- ===== BLOG_TAGS =====

-- Policy: Leitura pública (qualquer um pode ver tags)
CREATE POLICY "Leitura pública de tags" ON blog_tags
  FOR SELECT
  USING (true);

-- Policy: Apenas admins autenticados podem criar/editar/deletar
CREATE POLICY "Admins podem gerenciar tags" ON blog_tags
  FOR ALL
  USING (auth.role() = 'authenticated');

-- ===== BLOG_POSTS =====

-- Policy: Leitura pública de posts publicados
CREATE POLICY "Leitura pública de posts publicados" ON blog_posts
  FOR SELECT
  USING (status = 'published');

-- Policy: Admins podem ver todos os posts (incluindo drafts)
CREATE POLICY "Admins podem ver todos posts" ON blog_posts
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Admins podem criar posts
CREATE POLICY "Admins podem criar posts" ON blog_posts
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Admins podem editar posts
CREATE POLICY "Admins podem editar posts" ON blog_posts
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy: Admins podem deletar posts
CREATE POLICY "Admins podem deletar posts" ON blog_posts
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ===== BLOG_POST_TAGS =====

-- Policy: Leitura pública (para mostrar tags dos posts)
CREATE POLICY "Leitura pública de post_tags" ON blog_post_tags
  FOR SELECT
  USING (true);

-- Policy: Admins podem gerenciar relações post-tag
CREATE POLICY "Admins podem gerenciar post_tags" ON blog_post_tags
  FOR ALL
  USING (auth.role() = 'authenticated');

-- =============================================
-- STORAGE BUCKET
-- Para imagens do blog (featured images e imagens inline)
-- =============================================

-- Criar bucket blog-images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage
CREATE POLICY "Leitura pública de imagens do blog" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'blog-images');

CREATE POLICY "Admins podem fazer upload de imagens" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'blog-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Admins podem deletar imagens" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'blog-images' AND
    auth.role() = 'authenticated'
  );

-- =============================================
-- DADOS INICIAIS
-- Categorias otimizadas para SEO
-- =============================================

INSERT INTO blog_categories (name, slug, description, display_order)
VALUES
  (
    'Marketing para Dentistas',
    'marketing-para-dentistas',
    'Estratégias de marketing digital especializadas para profissionais da odontologia',
    1
  ),
  (
    'Sites para Clínicas',
    'sites-para-clinicas',
    'Dicas e boas práticas para criar sites odontológicos eficazes',
    2
  ),
  (
    'Gestão Odontológica',
    'gestao-odontologica',
    'Ferramentas e técnicas para gestão eficiente de clínicas odontológicas',
    3
  ),
  (
    'Casos de Sucesso',
    'casos-de-sucesso',
    'Histórias de clientes que transformaram seus negócios com sites profissionais',
    4
  )
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- FIM DO SCRIPT
-- =============================================

-- Para executar este script:
-- 1. Certifique-se de ter executado o setup.sql principal ANTES
-- 2. Acesse seu projeto no Supabase Dashboard
-- 3. Vá em "SQL Editor"
-- 4. Cole todo este script
-- 5. Clique em "Run"
-- 6. Verifique se as tabelas foram criadas em "Table Editor"
-- 7. Verifique se o bucket "blog-images" foi criado em "Storage"

-- Verificar criação das tabelas:
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public' AND table_name LIKE 'blog_%';

-- Verificar categorias iniciais:
-- SELECT * FROM blog_categories ORDER BY display_order;

-- Verificar estatísticas:
-- SELECT * FROM blog_stats();
