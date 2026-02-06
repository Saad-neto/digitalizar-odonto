-- =============================================
-- RESTAURAR CATEGORIAS DO BLOG
-- Sites Odonto 24H
-- =============================================

-- Inserir categorias (idempotente - não dá erro se já existir)
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

-- Verificar categorias criadas
SELECT id, name, slug, display_order
FROM blog_categories
ORDER BY display_order;
