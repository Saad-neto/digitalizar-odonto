#!/usr/bin/env node

/**
 * Script simples para verificar o post do blog
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hkvybshytzgzcrbqngdh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhrdnlic2h5dHpnemNyYnFuZ2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5ODg3OTksImV4cCI6MjA4MDU2NDc5OX0.DaB2G5Qbz65leJzcYPEoE172uBr-UMMu4MhJEZhjtiM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPost() {
  console.log('🔍 Verificando post do blog...\n');

  try {
    // Buscar o post pelo slug
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, status, published_at, created_at, excerpt')
      .eq('slug', 'quanto-custa-site-para-dentista-2026')
      .maybeSingle();

    if (error) {
      console.error('❌ Erro ao buscar post:', error);
      return;
    }

    if (!post) {
      console.error('❌ Post não encontrado no banco de dados!');
      console.log('\n💡 Vou buscar todos os posts para verificar...\n');

      const { data: allPosts, error: allError } = await supabase
        .from('blog_posts')
        .select('id, slug, title, status')
        .order('created_at', { ascending: false })
        .limit(10);

      if (allError) {
        console.error('❌ Erro ao buscar posts:', allError);
      } else if (allPosts && allPosts.length > 0) {
        console.log('📋 Últimos posts no banco:');
        allPosts.forEach((p, i) => {
          console.log(`   ${i + 1}. "${p.title}"`);
          console.log(`      Slug: ${p.slug}`);
          console.log(`      Status: ${p.status}`);
          console.log('');
        });
      } else {
        console.log('⚠️  Nenhum post encontrado no banco de dados.');
      }
      return;
    }

    console.log('✅ Post encontrado no banco de dados!\n');
    console.log('📊 Informações do Post:');
    console.log(`   ID: ${post.id}`);
    console.log(`   Título: ${post.title}`);
    console.log(`   Slug: ${post.slug}`);
    console.log(`   Status: ${post.status}`);
    console.log(`   Excerpt: ${post.excerpt?.substring(0, 100)}...`);
    console.log(`   Publicado em: ${post.published_at || 'N/A'}`);
    console.log(`   Criado em: ${post.created_at}`);

    if (post.status === 'published') {
      console.log('\n🎉 Post está PUBLICADO!');
      console.log(`🔗 URL: https://sites-odonto.digitalizar.space/blog/${post.slug}`);
    } else {
      console.log(`\n⚠️  Post ainda está como: ${post.status}`);
      console.log('💡 O UPDATE pode não ter encontrado o registro.');
    }

    // Buscar tags associadas
    const { data: postTags, error: tagsError } = await supabase
      .from('blog_post_tags')
      .select('blog_tags(name, slug)')
      .eq('post_id', post.id);

    if (!tagsError && postTags && postTags.length > 0) {
      console.log('\n🏷️  Tags associadas:');
      postTags.forEach(t => {
        console.log(`   - ${t.blog_tags.name} (${t.blog_tags.slug})`);
      });
    } else {
      console.log('\n⚠️  Nenhuma tag associada ao post.');
    }

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

checkPost();
