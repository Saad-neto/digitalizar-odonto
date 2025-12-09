// Script para mostrar TODOS os dados do briefing_data (formato completo)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hkvybshytzgzcrbqngdh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhrdnlic2h5dHpnemNyYnFuZ2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5ODg3OTksImV4cCI6MjA4MDU2NDc5OX0.DaB2G5Qbz65leJzcYPEoE172uBr-UMMu4MhJEZhjtiM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function showFullData() {
  console.log('🔍 Buscando lead mais recente...\n');

  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error || !leads || leads.length === 0) {
    console.error('Erro ou nenhum lead encontrado');
    return;
  }

  const lead = leads[0];

  console.log('📋 BRIEFING_DATA COMPLETO (JSON):');
  console.log('================================================================================');
  console.log(JSON.stringify(lead.briefing_data, null, 2));
  console.log('================================================================================');

  // Procurar campos de profissionais
  console.log('\n🔍 PROCURANDO CAMPOS DE PROFISSIONAIS:');
  const briefing = lead.briefing_data;
  const profKeys = Object.keys(briefing).filter(key => key.includes('profissional'));

  if (profKeys.length > 0) {
    console.log(`\n✅ Encontrados ${profKeys.length} campos relacionados a profissionais:`);
    profKeys.forEach(key => {
      console.log(`  - ${key}: ${briefing[key]}`);
    });
  } else {
    console.log('\n❌ NENHUM campo de profissional encontrado!');
  }

  // Procurar campos de diretor
  console.log('\n🔍 PROCURANDO CAMPOS DE DIRETOR:');
  const diretorKeys = Object.keys(briefing).filter(key => key.includes('diretor'));

  if (diretorKeys.length > 0) {
    console.log(`\n✅ Encontrados ${diretorKeys.length} campos relacionados ao diretor:`);
    diretorKeys.forEach(key => {
      console.log(`  - ${key}: ${briefing[key]}`);
    });
  } else {
    console.log('\n❌ NENHUM campo de diretor encontrado!');
  }
}

showFullData().catch(console.error);
