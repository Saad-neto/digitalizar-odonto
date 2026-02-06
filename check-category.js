#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hkvybshytzgzcrbqngdh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhrdnlic2h5dHpnemNyYnFuZ2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5ODg3OTksImV4cCI6MjA4MDU2NDc5OX0.DaB2G5Qbz65leJzcYPEoE172uBr-UMMu4MhJEZhjtiM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  // 1. Buscar a categoria marketing-digital
  const { data: category, error: catError } = await supabase
    .from('blog_categories')
    .select('*')
    .eq('slug', 'marketing-digital')
    .maybeSingle();

  if (catError) {
    console.error('❌ Erro ao buscar categoria:', catError);
    return;
  }

  if (!category) {
    console.log('⚠️  Categoria "marketing-digital" não encontrada!');

    // Listar categorias existentes
    const { data: allCats } = await supabase
      .from('blog_categories')
      .select('id, name, slug')
      .order('name');

    console.log('\n📋 Categorias disponíveis:');
    allCats?.forEach(c => {
      console.log(`   - ${c.name} (${c.slug}) - ID: ${c.id}`);
    });
    return;
  }

  console.log('✅ Categoria encontrada:');
  console.log(`   ID: ${category.id}`);
  console.log(`   Nome: ${category.name}`);
  console.log(`   Slug: ${category.slug}\n`);

  // 2. Buscar o post
  const { data: post, error: postError } = await supabase
    .from('blog_posts')
    .select('id, title, category_id, status, published_at')
    .eq('slug', 'quanto-custa-site-para-dentista-2026')
    .maybeSingle();

  if (postError || !post) {
    console.error('❌ Post não encontrado');
    return;
  }

  console.log('✅ Post encontrado:');
  console.log(`   ID: ${post.id}`);
  console.log(`   Título: ${post.title}`);
  console.log(`   Category ID: ${post.category_id}`);
  console.log(`   Status: ${post.status}`);
  console.log(`   Published at: ${post.published_at}\n`);

  // 3. Verificar se category_id está correto
  if (post.category_id === category.id) {
    console.log('✅ Category ID está CORRETO!\n');
  } else {
    console.log(`⚠️  Category ID está INCORRETO!`);
    console.log(`   Esperado: ${category.id}`);
    console.log(`   Atual: ${post.category_id}\n`);
  }

  // 4. Testar a query exata que a aplicação faz
  console.log('🔍 Testando query da aplicação...\n');

  const { data: posts, count, error: queryError } = await supabase
    .from('blog_posts')
    .select(
      `
      *,
      category:blog_categories(*),
      tags:blog_post_tags(tag:blog_tags(*))
    `,
      { count: 'exact' }
    )
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .range(0, 8); // primeiros 9 posts (página 1)

  if (queryError) {
    console.error('❌ Erro na query:', queryError);
    return;
  }

  console.log(`📊 Total de posts publicados: ${count}`);
  console.log(`📄 Posts retornados: ${posts?.length || 0}\n`);

  if (posts && posts.length > 0) {
    console.log('📋 Posts encontrados:');
    posts.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.title}`);
      console.log(`      Slug: ${p.slug}`);
      console.log(`      Categoria: ${p.category?.name || 'N/A'}`);
      console.log(`      Published: ${p.published_at}`);
      console.log('');
    });

    const ourPost = posts.find(p => p.slug === 'quanto-custa-site-para-dentista-2026');
    if (ourPost) {
      console.log('🎉 NOSSO POST APARECE NA LISTAGEM!');
    } else {
      console.log('⚠️  Nosso post NÃO aparece na listagem (mas deveria...)');
    }
  } else {
    console.log('⚠️  Nenhum post retornado pela query da aplicação');
  }
}

check();
