# 📝 Primeiro Post do Blog - Instruções de Instalação

## 📋 Arquivos Criados

1. **`blog-post-site-2026.sql`** - Script SQL completo para inserir o post no banco
2. **`blog-post-content-reference.md`** - Conteúdo em Markdown para referência
3. **`BLOG_POST_README.md`** - Este arquivo (instruções)

---

## 🚀 Como Executar

### Passo 1: Acesse o Supabase Dashboard

1. Faça login em [supabase.com](https://supabase.com)
2. Acesse seu projeto **Digitalizar Odonto**
3. No menu lateral, clique em **SQL Editor**

### Passo 2: Execute o Script SQL

1. Clique em **"New query"** (+ New query)
2. Abra o arquivo `blog-post-site-2026.sql`
3. Copie **TODO** o conteúdo do arquivo
4. Cole no editor SQL
5. Clique em **"Run"** (ou pressione Ctrl/Cmd + Enter)

### Passo 3: Verifique a Execução

Você deve ver mensagens de sucesso no console:
```
NOTICE: Post criado com sucesso! ID: [uuid-gerado]
NOTICE: Slug: por-que-consultorio-odontologico-precisa-site-2026
NOTICE: Acesse: /blog/por-que-consultorio-odontologico-precisa-site-2026
```

### Passo 4: Confirme no Table Editor

1. No menu lateral, clique em **"Table Editor"**
2. Selecione a tabela **`blog_posts`**
3. Você deve ver o novo post com:
   - ✅ Título: "Por que consultórios com site captam 3x mais pacientes..."
   - ✅ Status: `published`
   - ✅ Categoria: Marketing Odontológico
   - ✅ 4 tags associadas

### Passo 5: Acesse no Frontend

No seu navegador, acesse:
```
http://localhost:8080/blog
```

Você deve ver o post listado. Clique nele para ver a página completa:
```
http://localhost:8080/blog/por-que-consultorio-odontologico-precisa-site-2026
```

---

## 📊 O que foi criado

### Categoria
- **Nome:** Marketing Odontológico
- **Slug:** `marketing-odontologico`
- **Descrição:** Estratégias de marketing digital e captação de pacientes

### Tags (6 tags)
1. presença digital
2. captação de pacientes
3. SEO para dentistas
4. site odontológico
5. marketing digital
6. Google

### Post
- **Título:** Por que consultórios com site captam 3x mais pacientes (e o seu pode estar perdendo dinheiro)
- **Slug:** `por-que-consultorio-odontologico-precisa-site-2026`
- **Status:** `published` (já está público)
- **Autor:** Equipe Digitalizar Odonto
- **Publicado em:** Data/hora da execução do script
- **Conteúdo:** ~7.000 palavras em formato Tiptap JSON
- **View count:** 0 (será incrementado quando visitarem)

### Estrutura do Conteúdo

O post inclui:
- ✅ Storytelling inicial (Dra. Amanda)
- ✅ Índice navegável
- ✅ Comparação Instagram vs Site (tabela)
- ✅ 7 motivos para ter um site
- ✅ Cálculo de ROI e perdas
- ✅ 3 objeções respondidas
- ✅ Checklist completo
- ✅ CTA para o serviço
- ✅ Formatação rica (negrito, listas, citações, headings)

---

## 🎨 Próximos Passos (Opcionais)

### 1. Adicionar Imagem Destacada

Você pode adicionar uma imagem de capa ao post:

1. Crie ou escolha uma imagem (recomendado: 1200x630px)
2. Faça upload em **Storage** > `blog-images`
3. Copie a URL pública da imagem
4. Atualize o post:

```sql
UPDATE blog_posts
SET featured_image = 'URL_DA_IMAGEM_AQUI'
WHERE slug = 'por-que-consultorio-odontologico-precisa-site-2026';
```

### 2. Adicionar Imagens no Conteúdo

O editor Tiptap suporta imagens inline. Você pode:
- Editar o post via `/admin/blog/editar/[id]`
- Usar o editor visual para adicionar imagens
- Fazer upload direto pelo editor

### 3. Criar Lead Magnet (PDF)

O conteúdo menciona um **checklist em PDF**. Para criar:

1. Use o conteúdo da seção "Checklist do site odontológico perfeito"
2. Crie um PDF em Canva, Figma ou similar
3. Faça upload para Supabase Storage
4. Adicione botão de download no post

### 4. Adicionar Schema Markup Adicional

Para melhorar SEO, considere adicionar no componente `SEO.tsx`:
- Breadcrumbs
- FAQ Schema (para as objeções)
- HowTo Schema (para o checklist)

### 5. Compartilhamento Social

Certifique-se que as meta tags Open Graph estão corretas:
- Título otimizado ✅
- Descrição persuasiva ✅
- Imagem destacada (adicionar depois)
- Twitter Cards configuradas

---

## 🔍 SEO - O que está otimizado

### On-Page SEO ✅
- [x] Título otimizado (palavra-chave + benefício)
- [x] Meta description persuasiva (< 160 caracteres)
- [x] URL amigável (slug curto e descritivo)
- [x] Estrutura de headings (H2, H3)
- [x] Conteúdo extenso (~7.000 palavras)
- [x] Palavras-chave naturalmente distribuídas
- [x] Links internos (podem ser adicionados depois)

### Palavras-chave alvo:
- **Primária:** site para consultório odontológico
- **Secundárias:**
  - marketing odontológico
  - captar pacientes para dentistas
  - SEO para dentistas
  - presença digital odontologia

### Estrutura para Ranqueamento:
- ✅ Conteúdo superior a 2.000 palavras
- ✅ Responde intenção de busca (informacional + comercial)
- ✅ Storytelling + dados + CTAs
- ✅ Formato escaneável (listas, negrito, tabelas)

---

## 🐛 Resolução de Problemas

### Erro: "relation blog_posts does not exist"
**Solução:** Execute primeiro o `blog-setup-fixed.sql` para criar as tabelas

### Erro: "duplicate key value violates unique constraint"
**Solução:** O post já existe. Para recriar:
```sql
DELETE FROM blog_posts WHERE slug = 'por-que-consultorio-odontologico-precisa-site-2026';
-- Depois execute o script novamente
```

### Post não aparece no frontend
**Possíveis causas:**
1. Status não está como `published`
2. `published_at` está NULL
3. RLS (Row Level Security) bloqueando
4. Cache do React Query

**Solução:**
```sql
UPDATE blog_posts
SET status = 'published',
    published_at = NOW()
WHERE slug = 'por-que-consultorio-odontologico-precisa-site-2026';
```

### Conteúdo aparece sem formatação
**Causa:** O Tiptap não está renderizando o JSON corretamente

**Solução:** Verifique se o componente `PostContent.tsx` está:
- Importando e usando `@tiptap/react`
- Configurando as extensões corretas
- Renderizando com `EditorContent` (modo read-only)

---

## 📈 Métricas para Monitorar

Depois que o post estiver publicado, monitore:

### Google Analytics
- Pageviews
- Tempo médio na página (ideal: > 4 minutos)
- Taxa de rejeição (ideal: < 60%)
- Fontes de tráfego

### Supabase (view_count)
```sql
SELECT title, view_count, published_at
FROM blog_posts
WHERE slug = 'por-que-consultorio-odontologico-precisa-site-2026';
```

### Google Search Console (depois de indexado)
- Impressões
- Cliques
- CTR
- Posição média

### Conversões
- Cliques no CTA "Quero meu site"
- Preenchimentos do briefing vindos do post
- Conversões diretas

---

## ✏️ Editando o Post Depois

### Via Admin CMS (Recomendado)
1. Acesse `/admin/blog`
2. Encontre o post na listagem
3. Clique em "Editar"
4. Use o editor visual Tiptap
5. Salve as alterações

### Via SQL (Para mudanças rápidas)
```sql
-- Atualizar título
UPDATE blog_posts
SET title = 'Novo Título',
    updated_at = NOW()
WHERE slug = 'por-que-consultorio-odontologico-precisa-site-2026';

-- Atualizar meta description
UPDATE blog_posts
SET meta_description = 'Nova descrição otimizada para SEO',
    updated_at = NOW()
WHERE slug = 'por-que-consultorio-odontologico-precisa-site-2026';
```

---

## 📚 Referências

- **Conteúdo completo em Markdown:** `blog-post-content-reference.md`
- **Documentação do blog:** `../CLAUDE.md` (seção Blog System)
- **Schema das tabelas:** `blog-setup-fixed.sql`

---

## 🎯 Checklist de Publicação

Antes de considerar o post 100% pronto:

- [ ] Script SQL executado com sucesso
- [ ] Post visível em `/blog`
- [ ] Post abre corretamente em `/blog/[slug]`
- [ ] Formatação está correta (negrito, listas, headings)
- [ ] Meta tags aparecem corretas (inspecionar com view-source)
- [ ] Imagem destacada adicionada (opcional mas recomendado)
- [ ] Links internos adicionados (para outras páginas do site)
- [ ] Post compartilhado nas redes sociais
- [ ] Google Search Console: submeter URL para indexação
- [ ] Analytics configurado e rastreando

---

## 🚀 Próximos Posts Sugeridos

Com base na estratégia de conteúdo, os próximos posts podem ser:

1. **"5 erros que afastam pacientes do seu consultório"**
   - Categoria: Gestão Odontológica
   - Foco: Pontos de dor + soluções

2. **"Checklist completo: O que seu site odontológico precisa ter em 2026"**
   - Categoria: Sites para Clínicas
   - Foco: Guia prático + download

3. **"Como conseguir mais pacientes através do Google"**
   - Categoria: Marketing para Dentistas
   - Foco: SEO local + Google Meu Negócio

4. **"Quanto custa um site odontológico profissional? Guia completo de preços"**
   - Categoria: Sites para Clínicas
   - Foco: Transparência + educação de mercado

---

**Dúvidas?** Consulte a documentação completa em `CLAUDE.md` ou edite este arquivo conforme necessário.

✅ Post pronto para publicação!
