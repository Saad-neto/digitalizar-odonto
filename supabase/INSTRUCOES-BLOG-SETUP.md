# Instruções para Configurar o Banco de Dados do Blog

## ✅ Passo a Passo

### 1. Acessar o Supabase Dashboard

1. Abra: https://supabase.com/dashboard
2. Faça login
3. Selecione o projeto: **hkvybshytzgzcrbqngdh**

### 2. Executar o Script SQL

1. No menu lateral esquerdo, clique em **SQL Editor** (ícone de banco de dados)
2. Clique em **+ New Query** (botão verde no canto superior direito)
3. Copie **TODO** o conteúdo do arquivo `blog-setup.sql`
4. Cole no editor SQL
5. Clique em **Run** (ou pressione Ctrl+Enter)

### 3. Verificar se Funcionou

**Checar Tabelas**:
1. No menu lateral, clique em **Table Editor**
2. Você deve ver 4 novas tabelas:
   - ✅ `blog_categories`
   - ✅ `blog_posts`
   - ✅ `blog_tags`
   - ✅ `blog_post_tags`

**Checar Categorias Iniciais**:
1. Clique na tabela `blog_categories`
2. Você deve ver 4 categorias criadas:
   - Marketing para Dentistas
   - Sites para Clínicas
   - Gestão Odontológica
   - Casos de Sucesso

**Checar Storage Bucket**:
1. No menu lateral, clique em **Storage**
2. Você deve ver um novo bucket: `blog-images`
3. Ele deve estar configurado como **Public**

### 4. Testar Funções SQL (Opcional)

No SQL Editor, execute:

```sql
-- Ver estatísticas do blog
SELECT * FROM blog_stats();

-- Listar categorias
SELECT * FROM blog_categories ORDER BY display_order;
```

## ❌ Caso dê Erro

Se aparecer erro sobre a função `update_updated_at_column()` não existir:

1. Primeiro execute o arquivo `setup.sql` (o setup principal do projeto)
2. Depois execute o `blog-setup.sql`

## ✅ Próximos Passos Após Executar

Quando o SQL rodar com sucesso, avise e continuaremos com:
- Fase 2: Implementar funções TypeScript em `src/lib/supabase.ts`
- Fase 3: Instalar e testar o Rich Text Editor (Tiptap)

---

**URL do Projeto Supabase**: https://hkvybshytzgzcrbqngdh.supabase.co
