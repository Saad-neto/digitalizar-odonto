#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hkvybshytzgzcrbqngdh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhrdnlic2h5dHpnemNyYnFuZ2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5ODg3OTksImV4cCI6MjA4MDU2NDc5OX0.DaB2G5Qbz65leJzcYPEoE172uBr-UMMu4MhJEZhjtiM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixCategory() {
  console.log('🔧 Corrigindo categoria do post...\n');

  // 1. Buscar categoria "Marketing para Dentistas"
  const { data: category } = await supabase
    .from('blog_categories')
    .select('id, name, slug')
    .eq('slug', 'marketing-para-dentistas')
    .single();

  if (!category) {
    console.error('❌ Categoria não encontrada!');
    return;
  }

  console.log(`✅ Categoria encontrada: ${category.name} (${category.id})\n`);

  // 2. Atualizar o post
  const { data: updated, error } = await supabase
    .from('blog_posts')
    .update({ category_id: category.id })
    .eq('slug', 'quanto-custa-site-para-dentista-2026')
    .select()
    .single();

  if (error) {
    console.error('❌ Erro ao atualizar:', error);
    return;
  }

  console.log('✅ Post atualizado com sucesso!\n');

  // 3. Buscar o post com a categoria
  const { data: post } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(*)
    `)
    .eq('slug', 'quanto-custa-site-para-dentista-2026')
    .single();

  if (post) {
    console.log('📊 Dados atualizados:');
    console.log(`   Título: ${post.title}`);
    console.log(`   Categoria: ${post.category?.name} (${post.category?.slug})`);
    console.log(`   Status: ${post.status}`);
    console.log(`   Published at: ${post.published_at}\n`);
  }

  // 4. Testar a query da aplicação novamente
  console.log('🔍 Testando se o post aparece agora...\n');

  const { data: posts, count } = await supabase
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
    .range(0, 8);

  console.log(`📊 Total de posts publicados: ${count}`);

  if (posts) {
    const ourPost = posts.find(p => p.slug === 'quanto-custa-site-para-dentista-2026');
    if (ourPost) {
      console.log('🎉 SUCESSO! O post agora aparece na listagem!');
      console.log(`\n🔗 Acesse: https://sites-odonto.digitalizar.space/blog/${ourPost.slug}`);
    } else {
      console.log('⚠️  Post ainda não aparece (cache?)');
    }
  }
}

fixCategory();
