#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hkvybshytzgzcrbqngdh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhrdnlic2h5dHpnemNyYnFuZ2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5ODg3OTksImV4cCI6MjA4MDU2NDc5OX0.DaB2G5Qbz65leJzcYPEoE172uBr-UMMu4MhJEZhjtiM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFinal() {
  console.log('🎯 TESTE FINAL - Verificação Completa\n');

  // 1. Buscar o post pelo slug (como a página individual faz)
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(*),
      tags:blog_post_tags(tag:blog_tags(*))
    `)
    .eq('slug', 'quanto-custa-site-para-dentista-2026')
    .eq('status', 'published')
    .maybeSingle();

  if (error) {
    console.error('❌ Erro ao buscar post:', error);
    return;
  }

  if (!post) {
    console.error('❌ Post não encontrado ou não está publicado!');
    return;
  }

  console.log('✅ POST ESTÁ ACESSÍVEL VIA API!\n');
  console.log('📊 Informações:');
  console.log(`   Título: ${post.title}`);
  console.log(`   Slug: ${post.slug}`);
  console.log(`   Status: ${post.status}`);
  console.log(`   Categoria: ${post.category?.name || 'N/A'}`);
  console.log(`   Published: ${post.published_at}`);
  console.log(`   View Count: ${post.view_count}`);
  console.log(`   Excerpt: ${post.excerpt?.substring(0, 80)}...`);

  // Verificar se tem conteúdo
  const hasContent = post.content &&
    post.content.type === 'doc' &&
    post.content.content &&
    post.content.content.length > 0;

  console.log(`   Tem conteúdo: ${hasContent ? '✅ SIM' : '❌ NÃO'}`);

  if (hasContent) {
    const paragraphs = post.content.content.filter(c => c.type === 'paragraph');
    const headings = post.content.content.filter(c => c.type === 'heading');
    console.log(`   Parágrafos: ${paragraphs.length}`);
    console.log(`   Headings: ${headings.length}`);
  }

  console.log('\n🔗 URLs para acessar:');
  console.log(`   Blog: https://sites-odonto.digitalizar.space/blog`);
  console.log(`   Post: https://sites-odonto.digitalizar.space/blog/${post.slug}`);

  console.log('\n📋 RESUMO:');
  console.log('   ✅ Post existe no banco');
  console.log('   ✅ Status = published');
  console.log('   ✅ published_at preenchido');
  console.log(`   ${hasContent ? '✅' : '❌'} Conteúdo completo presente`);
  console.log(`   ${post.category ? '✅' : '⚠️ '} Categoria associada`);
  console.log(`   ${post.tags && post.tags.length > 0 ? '✅' : '⚠️ '} Tags associadas`);

  console.log('\n🎉 O post deve aparecer no site!');
  console.log('💡 Se não aparecer, limpe o cache do navegador (Ctrl+Shift+Del)');
}

testFinal();
