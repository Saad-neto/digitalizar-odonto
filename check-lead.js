// Script temporário para verificar lead no Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hkvybshytzgzcrbqngdh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhrdnlic2h5dHpnemNyYnFuZ2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5ODg3OTksImV4cCI6MjA4MDU2NDc5OX0.DaB2G5Qbz65leJzcYPEoE172uBr-UMMu4MhJEZhjtiM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLatestLead() {
  console.log('🔍 Buscando lead mais recente...\n');

  // Buscar o lead mais recente
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error('❌ Erro ao buscar lead:', error);
    return;
  }

  if (!leads || leads.length === 0) {
    console.log('⚠️ Nenhum lead encontrado no banco de dados');
    return;
  }

  const lead = leads[0];

  console.log('✅ Lead encontrado!\n');
  console.log('📋 INFORMAÇÕES BÁSICAS DA TABELA:');
  console.log('- ID:', lead.id);
  console.log('- Status:', lead.status);
  console.log('- Criado em:', new Date(lead.created_at).toLocaleString('pt-BR'));
  console.log('- Nome (campo tabela):', lead.nome || 'N/A');
  console.log('- Email (campo tabela):', lead.email || 'N/A');
  console.log('- WhatsApp (campo tabela):', lead.whatsapp || 'N/A');

  console.log('\n📊 DADOS DO BRIEFING (briefing_data):');
  if (lead.briefing_data) {
    const briefing = lead.briefing_data;

    // Seção 1 - Informações Essenciais
    console.log('\n  1️⃣ INFORMAÇÕES ESSENCIAIS:');
    console.log('  - Tipo negócio:', briefing.tipo_negocio || 'N/A');
    console.log('  - Nome consultório:', briefing.nome_consultorio || 'N/A');
    console.log('  - Nome do titular:', briefing.nome || 'N/A');
    console.log('  - WhatsApp:', briefing.whatsapp || 'N/A');
    console.log('  - Email:', briefing.email || 'N/A');
    console.log('  - Slogan:', briefing.slogan_opcao || 'N/A');
    if (briefing.slogan_opcao === 'custom' && briefing.slogan_custom) {
      console.log('  - Slogan customizado:', briefing.slogan_custom);
    }
    console.log('  - Ano início:', briefing.ano_inicio || 'N/A');
    console.log('  - Número de pacientes:', briefing.num_pacientes || 'N/A');
    console.log('  - Google Meu Negócio:', briefing.tem_google_negocio || 'N/A');
    if (briefing.tem_google_negocio === 'sim' && briefing.link_google_negocio) {
      console.log('  - Link GMN:', briefing.link_google_negocio);
    }

    // Seção 2 - Profissionais
    console.log('\n  2️⃣ PROFISSIONAIS:');

    // Verificar dados do diretor
    if (briefing.diretor_nome) {
      console.log('  📌 DIRETOR TÉCNICO:');
      console.log('  - Nome:', briefing.diretor_nome);
      console.log('  - CRO:', briefing.diretor_cro || 'N/A');
      console.log('  - UF:', briefing.diretor_uf || 'N/A');
      console.log('  - Destacado no site:', briefing.diretor_destacado ? 'Sim ✅' : 'Não');
    }

    // Verificar quantos profissionais foram destacados
    if (briefing.num_profissionais_destacar) {
      const numProf = parseInt(briefing.num_profissionais_destacar);
      console.log(`\n  👥 PROFISSIONAIS DESTACADOS: ${numProf}`);

      for (let i = 1; i <= numProf; i++) {
        const nome = briefing[`profissional${i}_nome`];
        const cro = briefing[`profissional${i}_cro`];
        const uf = briefing[`profissional${i}_uf`];
        const apresentacao = briefing[`profissional${i}_apresentacao`];
        const especialidade = briefing[`profissional${i}_especialidade`];
        const formacao = briefing[`profissional${i}_formacao`];
        const hasFoto = briefing.arquivos?.[`foto_profissional_${i}`] !== undefined;

        console.log(`\n  - Profissional ${i}:`);
        console.log(`    Nome: ${nome || 'N/A'}`);
        console.log(`    Apresentação: ${apresentacao || 'N/A'}`);
        console.log(`    CRO: ${cro || 'N/A'} / ${uf || 'N/A'}`);
        console.log(`    Especialidade: ${especialidade || 'N/A'}`);
        console.log(`    Formação: ${formacao || 'N/A'}`);
        console.log(`    Foto: ${hasFoto ? 'Enviada ✅' : 'Não enviada ❌'}`);
      }
    } else {
      console.log('  - Nenhum profissional destacado');
    }

    // Informação sobre equipe (para clínicas)
    if (briefing.num_profissionais) {
      console.log(`\n  👨‍⚕️ TAMANHO DA EQUIPE: ${briefing.num_profissionais} profissionais`);
    }

    // Seção 3 - Serviços
    console.log('\n  3️⃣ SERVIÇOS E DIFERENCIAIS:');
    console.log('  - Serviços:', briefing.servicos?.length || 0, 'selecionados');
    if (briefing.servicos?.includes('outro') && briefing.servico_outro) {
      console.log('  - Outro serviço:', briefing.servico_outro);
    }
    console.log('  - Aceita convênios:', briefing.aceita_convenios || 'N/A');
    if (briefing.aceita_convenios === 'sim' && briefing.lista_convenios_array) {
      console.log('  - Convênios:', briefing.lista_convenios_array.length, 'selecionados');
      if (briefing.lista_convenios_array.includes('outro_convenio') && briefing.outro_convenio) {
        console.log('  - Outro convênio:', briefing.outro_convenio);
      }
    }
    console.log('  - Atendimento emergência:', briefing.atende_emergencia || 'N/A');
    console.log('  - Tecnologias:', briefing.tecnologias?.length || 0);
    console.log('  - Oferece sedação:', briefing.oferece_sedacao || 'N/A');

    // Seção 4 - Localização
    console.log('\n  4️⃣ LOCALIZAÇÃO E CONTATO:');
    console.log('  - CEP:', briefing.cep || 'N/A');
    console.log('  - Rua:', briefing.rua || 'N/A');
    console.log('  - Número:', briefing.numero || 'N/A');
    console.log('  - Bairro:', briefing.bairro || 'N/A');
    console.log('  - Cidade:', briefing.cidade || 'N/A');
    console.log('  - Estado:', briefing.estado || 'N/A');
    console.log('  - Tem estacionamento:', briefing.tem_estacionamento ? 'Sim' : 'Não');
    console.log('  - Horários de atendimento:', briefing.horarios_atendimento?.length || 0);
    console.log('  - Quer mapa no site:', briefing.quer_mapa_no_site ? 'Sim' : 'Não');
    console.log('  - Tem redes sociais:', briefing.tem_redes_sociais ? 'Sim' : 'Não');
    if (briefing.instagram) console.log('  - Instagram:', briefing.instagram);
    if (briefing.facebook) console.log('  - Facebook:', briefing.facebook);
    if (briefing.linkedin) console.log('  - LinkedIn:', briefing.linkedin);

    // Seção 5 - Materiais Visuais
    console.log('\n  5️⃣ MATERIAIS VISUAIS:');
    console.log('  - Logo:', briefing.arquivos?.logo ? 'Enviado ✅' : 'Não enviado ❌');
    console.log('  - Imagem principal (desktop):', briefing.arquivos?.hero_desktop ? 'Enviada ✅' : 'Não enviada ❌');
    console.log('  - Imagem principal (mobile):', briefing.arquivos?.hero_mobile ? 'Enviada ✅' : 'Não enviada ❌');
    console.log('  - Fotos da clínica:', briefing.arquivos?.fotos_espaco?.length || 0);
    console.log('  - Cor preferida:', briefing.cor_preferida || 'N/A');
    console.log('  - Estilo visual:', briefing.estilo_site || 'N/A');
    console.log('  - Sites de referência:', briefing.sites_referencia || 'N/A');
    console.log('  - Prazo de entrega:', briefing.prazo_desejado || 'N/A');

    // Seção 6 - Rastreamento
    console.log('\n  6️⃣ RASTREAMENTO:');
    console.log('  - Google Analytics 4:', briefing.ga4_id || 'N/A');
    console.log('  - Meta Pixel:', briefing.meta_pixel_id || 'N/A');
    console.log('  - Google Tag Manager:', briefing.gtm_id || 'N/A');
    console.log('  - Google Ads Conversão:', briefing.google_ads_conversion || 'N/A');
    console.log('  - Outras tags:', briefing.outras_tags ? 'Preenchido ✅' : 'N/A');

    // Seção 7 - Depoimentos
    console.log('\n  7️⃣ DEPOIMENTOS:');
    console.log('  - Estratégia depoimentos:', briefing.estrategia_depoimentos || 'N/A');
    if (briefing.estrategia_depoimentos === 'google' && briefing.link_google_maps) {
      console.log('  - Link Google Maps:', briefing.link_google_maps);
    }
    if (briefing.estrategia_depoimentos === 'texto' && briefing.depoimentos_texto) {
      console.log('  - Depoimentos em texto: Preenchido ✅');
    }
    console.log('  - Observações finais:', briefing.observacoes_finais || 'N/A');

  } else {
    console.log('  ⚠️ briefing_data está vazio ou null');
  }

  console.log('\n' + '='.repeat(80));
  console.log('✅ VERIFICAÇÃO CONCLUÍDA!');
  console.log('='.repeat(80));
}

checkLatestLead().catch(console.error);
