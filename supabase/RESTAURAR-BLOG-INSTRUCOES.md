# Instruções para Restaurar o Blog

## Passo 1: Restaurar Categorias

Execute no **Supabase SQL Editor**:

```sql
-- Arquivo: restaurar-blog-categorias.sql
```

Isso irá criar as 4 categorias principais do blog.

## Passo 2: Restaurar Posts (8 posts)

Execute os arquivos SQL dos posts **na ordem abaixo**, um por vez no Supabase SQL Editor:

1. ✅ `post-quanto-custa-site-dentista.sql` - Quanto Custa um Site para Dentista em 2026?
2. ✅ `post-como-criar-site-dentista-2026.sql` - Como Criar um Site para Dentista em 2026
3. ✅ `post-sites-prontos-dentistas-2026.sql` - Sites Prontos para Dentistas 2026
4. ✅ `post-google-meu-negocio-dentistas-2026.sql` - Google Meu Negócio para Dentistas
5. ✅ `post-marketing-digital-dentistas-2026.sql` - Marketing Digital para Dentistas
6. ✅ `post-site-profissional-dentistas-2026.sql` - Site Profissional para Dentistas
7. ✅ `post-instagram-dentistas-2026.sql` - Instagram para Dentistas
8. ✅ `post-whatsapp-business-dentistas-2026.sql` - WhatsApp Business para Dentistas

## Passo 3: Verificar

Execute no Supabase SQL Editor:

```sql
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
```

Deve mostrar **8 posts publicados**.

## Passo 4: Ajustar category_id (se necessário)

Se algum post estiver sem categoria, execute:

```sql
-- Arquivo: fix-category-final.sql
```

## Método Alternativo: Script Automático (Opcional)

Se preferir, pode executar todos de uma vez com este comando bash (na pasta do projeto):

```bash
cd swift-dent-studio-16/supabase

# Este comando NÃO funciona no Supabase Dashboard
# Funciona apenas se você tiver a CLI do Supabase instalada:
# supabase db push --file restaurar-blog-categorias.sql
# supabase db push --file post-quanto-custa-site-dentista.sql
# ... (repetir para cada post)
```

**RECOMENDADO:** Execute manualmente no Dashboard, um arquivo por vez.
