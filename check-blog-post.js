#!/usr/bin/env node

/**
 * Script para verificar se o post do blog foi publicado
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente
dotenv.config({ path: join(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY devem estar definidos no .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPost() {
  console.log('🔍 Verificando post do blog...\n');

  try {
    // Buscar o post pelo slug
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, status, published_at, created_at')
      .eq('slug', 'quanto-custa-site-para-dentista-2026')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.error('❌ Post não encontrado no banco de dados!');
        console.log('\n💡 Possíveis causas:');
        console.log('   1. O INSERT inicial não funcionou');
        console.log('   2. O slug está diferente do esperado');
        console.log('\n🔧 Vou buscar todos os posts para verificar...\n');

        const { data: allPosts, error: allError } = await supabase
          .from('blog_posts')
          .select('id, slug, title, status')
          .order('created_at', { ascending: false })
          .limit(5);

        if (allError) {
          console.error('❌ Erro ao buscar posts:', allError);
        } else {
          console.log('📋 Últimos 5 posts no banco:');
          allPosts?.forEach((p, i) => {
            console.log(`   ${i + 1}. "${p.title}"`);
            console.log(`      Slug: ${p.slug}`);
            console.log(`      Status: ${p.status}`);
            console.log('');
          });
        }
        return;
      }

      console.error('❌ Erro ao buscar post:', error);
      return;
    }

    console.log('✅ Post encontrado no banco de dados!\n');
    console.log('📊 Informações do Post:');
    console.log(`   ID: ${post.id}`);
    console.log(`   Título: ${post.title}`);
    console.log(`   Slug: ${post.slug}`);
    console.log(`   Status: ${post.status}`);
    console.log(`   Publicado em: ${post.published_at}`);
    console.log(`   Criado em: ${post.created_at}`);

    if (post.status === 'published') {
      console.log('\n🎉 Post está PUBLICADO!');
      console.log(`🔗 URL: https://sites-odonto.digitalizar.space/blog/${post.slug}`);
    } else {
      console.log(`\n⚠️  Post ainda está como: ${post.status}`);
      console.log('💡 Execute o UPDATE novamente para publicar.');
    }

    // Buscar tags associadas
    const { data: tags, error: tagsError } = await supabase
      .from('blog_post_tags')
      .select('tag_id, blog_tags(name, slug)')
      .eq('post_id', post.id);

    if (!tagsError && tags && tags.length > 0) {
      console.log('\n🏷️  Tags associadas:');
      tags.forEach(t => {
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
