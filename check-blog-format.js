const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkFormat() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug, content')
    .limit(1);

  if (error) {
    console.error('Erro:', error);
    return;
  }

  console.log('FORMATO DO CONTEÚDO:');
  console.log('Tipo:', typeof data[0].content);
  console.log('\nPrimeiros 500 caracteres:');
  console.log(JSON.stringify(data[0].content, null, 2).substring(0, 500));
}

checkFormat();
