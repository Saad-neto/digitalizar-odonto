#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hkvybshytzgzcrbqngdh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhrdnlic2h5dHpnemNyYnFuZ2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5ODg3OTksImV4cCI6MjA4MDU2NDc5OX0.DaB2G5Qbz65leJzcYPEoE172uBr-UMMu4MhJEZhjtiM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixCategory() {
  console.log('🔧 Corrigindo categoria do post (v2)...\n');

  // 1. Buscar o post primeiro
  const { data: post, error: findError } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', 'quanto-custa-site-para-dentista-2026')
    .maybeSingle();

  if (findError) {
    console.error('❌ Erro ao buscar post:', findError);
    return;
  }

  if (!post) {
    console.error('❌ Post não encontrado!');
    return;
  }

  console.log('✅ Post encontrado:');
  console.log(`   ID: ${post.id}`);
  console.log(`   Título: ${post.title}`);
  console.log(`   Category ID atual: ${post.category_id}`);
  console.log(`   Status: ${post.status}\n`);

  // 2. Buscar categoria "Marketing para Dentistas"
  const { data: category } = await supabase
    .from('blog_categories')
    .select('id, name, slug')
    .eq('slug', 'marketing-para-dentistas')
    .single();

  if (!category) {
    console.error('❌ Categoria não encontrada!');
    return;
  }

  console.log(`✅ Categoria target: ${category.name} (${category.id})\n`);

  if (post.category_id === category.id) {
    console.log('✅ Categoria já está correta! Nada a fazer.\n');
  } else {
    console.log('🔄 Atualizando categoria...\n');

    // 3. Tentar update sem .select()
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ category_id: category.id })
      .eq('id', post.id);

    if (updateError) {
      console.error('❌ Erro ao atualizar:', updateError);
      console.log('\n⚠️  Provavelmente é um problema de RLS (Row Level Security)');
      console.log('💡 Execute este SQL no Supabase SQL Editor:\n');
      console.log(`UPDATE blog_posts`);
      console.log(`SET category_id = '${category.id}'`);
      console.log(`WHERE slug = 'quanto-custa-site-para-dentista-2026';`);
      return;
    }

    console.log('✅ Categoria atualizada com sucesso!\n');
  }

  // 4. Verificar resultado
  const { data: updated } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(*)
    `)
    .eq('slug', 'quanto-custa-site-para-dentista-2026')
    .single();

  if (updated) {
    console.log('📊 Estado final:');
    console.log(`   Categoria: ${updated.category?.name || 'N/A'}\n`);
  }

  // 5. Testar a query da aplicação
  console.log('🔍 Testando se o post aparece na listagem...\n');

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
      console.log('🎉 SUCESSO! O post aparece na listagem!\n');
      console.log(`🔗 Acesse: https://sites-odonto.digitalizar.space/blog/${ourPost.slug}`);
    } else {
      console.log('⚠️  Post NÃO aparece na listagem');
      console.log('\n📋 Posts retornados:');
      posts.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.title}`);
      });
    }
  }
}

fixCategory();
