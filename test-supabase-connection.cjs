// Script de teste para verificar conexão com Supabase e inserção de dados
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Ler variáveis de ambiente do arquivo .env
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};

  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      env[key] = value;
    }
  });

  return env;
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Testando conexão com Supabase...');
console.log('URL:', supabaseUrl);
console.log('Anon Key:', supabaseAnonKey ? 'Configurada ✅' : 'Não configurada ❌');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente não configuradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('\n📊 Testando leitura da tabela leads...');

    // Tentar ler leads
    const { data: leads, error: readError } = await supabase
      .from('leads')
      .select('id, nome, email, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (readError) {
      console.error('❌ Erro ao ler leads:', readError.message);
      console.error('Detalhes:', readError);
    } else {
      console.log('✅ Leitura bem-sucedida!');
      console.log(`📋 Total de leads encontrados: ${leads?.length || 0}`);
      if (leads && leads.length > 0) {
        console.log('Últimos leads:');
        leads.forEach(lead => {
          console.log(`  - ${lead.nome} (${lead.email}) - Status: ${lead.status} - ${new Date(lead.created_at).toLocaleString('pt-BR')}`);
        });
      }
    }

    console.log('\n📝 Testando inserção de lead parcial...');

    // Tentar criar lead parcial de teste
    const testData = {
      nome: 'Teste Script',
      email: `teste-${Date.now()}@example.com`,
      whatsapp: '11999999999',
      briefing_data: {
        nome_consultorio: 'Consultório Teste',
        nome: 'Teste Script',
        email: `teste-${Date.now()}@example.com`,
        whatsapp: '11999999999',
        capturado_em: new Date().toISOString(),
      },
      valor_total: 49700,
      valor_entrada: 24850,
      valor_saldo: 24850,
      status: 'lead_parcial',
    };

    const { data: newLead, error: insertError } = await supabase
      .from('leads')
      .insert([testData])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Erro ao inserir lead:', insertError.message);
      console.error('Código:', insertError.code);
      console.error('Detalhes:', insertError.details);
      console.error('Hint:', insertError.hint);
    } else {
      console.log('✅ Lead de teste criado com sucesso!');
      console.log('ID:', newLead.id);
      console.log('Nome:', newLead.nome);
      console.log('Email:', newLead.email);
      console.log('Status:', newLead.status);

      // Deletar o lead de teste
      console.log('\n🗑️  Deletando lead de teste...');
      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .eq('id', newLead.id);

      if (deleteError) {
        console.error('❌ Erro ao deletar lead de teste:', deleteError.message);
      } else {
        console.log('✅ Lead de teste deletado com sucesso!');
      }
    }

    console.log('\n✅ Teste completo!');

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

testConnection();
