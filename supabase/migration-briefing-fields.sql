-- =============================================
-- MIGRAÇÃO: Atualização estrutura briefing_data
-- Data: 2025-12-26
-- Descrição: Adiciona índices e views para nova estrutura do briefing
-- =============================================

-- =============================================
-- PARTE 1: ÍNDICES PARA PERFORMANCE EM JSONB
-- =============================================

-- Índice GIN para busca em campos JSONB
CREATE INDEX IF NOT EXISTS idx_leads_briefing_data_gin
ON leads USING GIN (briefing_data);

-- Índices para campos específicos mais consultados
CREATE INDEX IF NOT EXISTS idx_leads_briefing_nome_consultorio
ON leads ((briefing_data->>'nome_consultorio'));

CREATE INDEX IF NOT EXISTS idx_leads_briefing_especialidade
ON leads ((briefing_data->>'especialidade_principal'));

-- =============================================
-- PARTE 2: VIEWS PARA FACILITAR CONSULTAS
-- =============================================

-- View: Dados essenciais dos leads
CREATE OR REPLACE VIEW v_leads_essenciais AS
SELECT
  l.id,
  l.status,
  l.created_at,
  l.nome,
  l.email,
  l.whatsapp,
  -- Campos do briefing
  l.briefing_data->>'nome_consultorio' as nome_consultorio,
  l.briefing_data->>'especialidade_principal' as especialidade_principal,
  -- URLs
  l.preview_url,
  l.site_final_url,
  -- Timestamps
  l.pago_entrada_at,
  l.pago_saldo_at,
  l.aprovado_at,
  l.concluido_at
FROM leads l;

-- View: Leads com dados de localização
CREATE OR REPLACE VIEW v_leads_localizacao AS
SELECT
  l.id,
  l.nome,
  l.briefing_data->>'nome_consultorio' as consultorio,
  l.briefing_data->>'cep' as cep,
  l.briefing_data->>'rua' as rua,
  l.briefing_data->>'numero' as numero,
  l.briefing_data->>'complemento' as complemento,
  l.briefing_data->>'bairro' as bairro,
  l.briefing_data->>'cidade' as cidade,
  l.briefing_data->>'estado' as estado,
  l.briefing_data->>'exibir_mapa' as exibir_mapa,
  l.briefing_data->>'link_mapa_embed' as link_mapa_embed
FROM leads l;

-- View: Leads com dados de contato
CREATE OR REPLACE VIEW v_leads_contato AS
SELECT
  l.id,
  l.nome,
  l.email,
  l.whatsapp,
  l.briefing_data->>'nome_consultorio' as consultorio,
  l.briefing_data->>'instagram' as instagram,
  l.briefing_data->>'facebook' as facebook,
  l.briefing_data->'redes_sociais' as redes_sociais_array,
  l.briefing_data->'horarios_atendimento_array' as horarios
FROM leads l;

-- =============================================
-- PARTE 3: FUNÇÕES ÚTEIS
-- =============================================

-- Função: Buscar leads por cidade
CREATE OR REPLACE FUNCTION get_leads_by_cidade(cidade_param TEXT)
RETURNS TABLE(
  id UUID,
  nome TEXT,
  consultorio TEXT,
  cidade TEXT,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id,
    l.nome,
    l.briefing_data->>'nome_consultorio' as consultorio,
    l.briefing_data->>'cidade' as cidade,
    l.status
  FROM leads l
  WHERE l.briefing_data->>'cidade' ILIKE cidade_param;
END;
$$ LANGUAGE plpgsql;

-- Função: Buscar leads por especialidade
CREATE OR REPLACE FUNCTION get_leads_by_especialidade(especialidade_param TEXT)
RETURNS TABLE(
  id UUID,
  nome TEXT,
  consultorio TEXT,
  especialidade TEXT,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id,
    l.nome,
    l.briefing_data->>'nome_consultorio' as consultorio,
    l.briefing_data->>'especialidade_principal' as especialidade,
    l.status
  FROM leads l
  WHERE l.briefing_data->>'especialidade_principal' = especialidade_param;
END;
$$ LANGUAGE plpgsql;

-- Função: Extrair array de profissionais
CREATE OR REPLACE FUNCTION get_profissionais(lead_id_param UUID)
RETURNS JSONB AS $$
DECLARE
  profissionais_data JSONB;
BEGIN
  SELECT briefing_data->'profissionais'
  INTO profissionais_data
  FROM leads
  WHERE id = lead_id_param;

  RETURN COALESCE(profissionais_data, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- Função: Extrair array de serviços
CREATE OR REPLACE FUNCTION get_servicos(lead_id_param UUID)
RETURNS JSONB AS $$
DECLARE
  servicos_data JSONB;
BEGIN
  SELECT briefing_data->'servicos'
  INTO servicos_data
  FROM leads
  WHERE id = lead_id_param;

  RETURN COALESCE(servicos_data, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- Função: Extrair array de horários
CREATE OR REPLACE FUNCTION get_horarios(lead_id_param UUID)
RETURNS JSONB AS $$
DECLARE
  horarios_data JSONB;
BEGIN
  SELECT briefing_data->'horarios_atendimento_array'
  INTO horarios_data
  FROM leads
  WHERE id = lead_id_param;

  RETURN COALESCE(horarios_data, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- Função: Extrair paleta de cores
CREATE OR REPLACE FUNCTION get_cores_personalizadas(lead_id_param UUID)
RETURNS JSONB AS $$
DECLARE
  cores_data JSONB;
BEGIN
  SELECT briefing_data->'cores_personalizadas'
  INTO cores_data
  FROM leads
  WHERE id = lead_id_param;

  RETURN COALESCE(cores_data, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- PARTE 4: DOCUMENTAÇÃO DA ESTRUTURA JSONB
-- =============================================

-- A tabela 'leads' armazena todos os dados do briefing no campo 'briefing_data' (JSONB)
-- Estrutura completa esperada do briefing_data:

COMMENT ON COLUMN leads.briefing_data IS
'Estrutura JSONB completa do briefing:

SEÇÃO 1: INFORMAÇÕES ESSENCIAIS
- nome_consultorio: TEXT
- nome: TEXT
- whatsapp: TEXT
- email: TEXT
- especialidade_principal: TEXT

SEÇÃO 2: HERO / BANNER PRINCIPAL
- hero_titulo_tipo: TEXT (opcao1|opcao2|opcao3|custom)
- hero_titulo: TEXT (60 chars)
- hero_subtitulo_tipo: TEXT (opcao1|opcao2|opcao3|custom)
- hero_subtitulo: TEXT (120 chars)
- hero_cta_tipo: TEXT (agendar|whatsapp|telefone|custom)
- hero_cta_texto: TEXT (40 chars)
- widget1_numero, widget1_label: TEXT
- widget2_numero, widget2_label: TEXT
- widget3_numero, widget3_label: TEXT
- widget4_numero, widget4_label: TEXT
- ocultar_widgets: BOOLEAN

SEÇÃO 3: SOBRE A CLÍNICA
- sobre_titulo_tipo: TEXT (sobre_nos|sobre_clinica|nossa_historia|custom)
- sobre_titulo: TEXT (60 chars)
- sobre_texto: TEXT (300-800 chars recomendado)
- redes_sociais: ARRAY[{tipo: TEXT, url: TEXT, usuario: TEXT}]
- anos_experiencia: TEXT
- missao: TEXT
- visao: TEXT
- valores: TEXT

SEÇÃO 4: EQUIPE
- profissionais: ARRAY[{
    nome: TEXT,
    registro: TEXT (CRO),
    especialidade: TEXT,
    descricao: TEXT,
    foto: TEXT (base64),
    redesSociais: ARRAY[{tipo, url, usuario}]
  }]

SEÇÃO 5: SERVIÇOS E DIFERENCIAIS
- servicos: ARRAY[TEXT]
- servico_customizando: BOOLEAN
- servico_outro_temp: TEXT
- servico_outro: TEXT
- aceita_convenios: TEXT (sim|nao)
- lista_convenios: TEXT
- diferenciais: ARRAY[TEXT]
- diferencial_customizando: BOOLEAN
- diferencial_outro_temp: TEXT
- diferencial_outro: TEXT

SEÇÃO 6: IDENTIDADE VISUAL
- cores_personalizadas: ARRAY[{
    tipo: TEXT (primaria|secundaria|texto|fundo|destaque),
    valor: TEXT (hex color)
  }]
- sites_referencia_array: ARRAY[{
    url: TEXT,
    motivo: TEXT
  }]

SEÇÃO 7: LOCALIZAÇÃO E CONTATO
- estrategia_depoimentos: TEXT (google|texto|nao)
- link_google_maps: TEXT
- depoimentos_texto: TEXT
- cep: TEXT
- rua: TEXT
- numero: TEXT
- complemento: TEXT
- bairro: TEXT
- cidade: TEXT
- estado: TEXT
- horarios_atendimento_array: ARRAY[{
    dia: TEXT (segunda|terca|quarta|quinta|sexta|sabado|domingo),
    inicio: TEXT (HH:MM),
    fim: TEXT (HH:MM)
  }]
- tem_estacionamento: TEXT (sim|nao)
- tem_acessibilidade: TEXT (sim|nao)
- exibir_mapa: TEXT (sim|nao)
- link_mapa_embed: TEXT

SEÇÃO 8: RASTREAMENTO E INTEGRAÇÕES
- ga4_id: TEXT
- meta_pixel_id: TEXT
- gtm_id: TEXT
- google_ads_conversion: TEXT
- outras_tags: TEXT

SEÇÃO 9: REVISÃO FINAL
- observacoes_revisao: TEXT
';

-- =============================================
-- PARTE 5: QUERIES ÚTEIS PARA TESTES
-- =============================================

-- Exemplos de queries úteis:

-- 1. Buscar leads por cidade
-- SELECT * FROM get_leads_by_cidade('São Paulo');

-- 2. Contar leads por especialidade
-- SELECT
--   briefing_data->>'especialidade_principal' as especialidade,
--   COUNT(*) as total
-- FROM leads
-- WHERE briefing_data->>'especialidade_principal' IS NOT NULL
-- GROUP BY especialidade
-- ORDER BY total DESC;

-- 3. Leads que aceitam convênios
-- SELECT
--   id,
--   nome,
--   briefing_data->>'nome_consultorio' as consultorio,
--   briefing_data->>'lista_convenios' as convenios
-- FROM leads
-- WHERE briefing_data->>'aceita_convenios' = 'sim';

-- 4. Leads com horário de atendimento aos sábados
-- SELECT
--   id,
--   nome,
--   briefing_data->>'nome_consultorio' as consultorio
-- FROM leads
-- WHERE briefing_data->'horarios_atendimento_array' @> '[{"dia": "sabado"}]'::jsonb;

-- 5. Extrair profissionais de um lead específico
-- SELECT get_profissionais('UUID-DO-LEAD');

-- 6. Buscar leads com paleta de cores personalizada
-- SELECT
--   id,
--   nome,
--   briefing_data->>'nome_consultorio' as consultorio,
--   jsonb_array_length(briefing_data->'cores_personalizadas') as num_cores
-- FROM leads
-- WHERE briefing_data->'cores_personalizadas' IS NOT NULL
--   AND jsonb_array_length(briefing_data->'cores_personalizadas') > 0;

-- =============================================
-- FIM DA MIGRAÇÃO
-- =============================================

-- Para executar:
-- 1. Acesse Supabase Dashboard > SQL Editor
-- 2. Cole este script
-- 3. Execute (Run)
-- 4. Verifique no Table Editor e em Database > Views
