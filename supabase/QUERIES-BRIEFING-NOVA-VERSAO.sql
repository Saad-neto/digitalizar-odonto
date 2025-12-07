-- =============================================
-- QUERIES ÚTEIS - BRIEFING NOVA VERSÃO (5 PÁGINAS)
-- =============================================

-- =============================================
-- 1. VISUALIZAÇÃO GERAL DOS LEADS
-- =============================================

-- Ver todos os leads com informações principais
SELECT
  id,
  nome,
  email,
  whatsapp,
  status,
  briefing_data->>'tipo_negocio' as tipo_negocio,
  briefing_data->>'nome_consultorio' as nome_consultorio,
  briefing_data->>'cidade' as cidade,
  briefing_data->>'estado' as estado,
  created_at,
  updated_at
FROM leads
ORDER BY created_at DESC;

-- =============================================
-- 2. FILTROS POR TIPO DE NEGÓCIO
-- =============================================

-- Consultórios Individuais
SELECT
  nome,
  briefing_data->>'nome_consultorio' as consultorio,
  briefing_data->>'profissional1_nome' as dentista,
  briefing_data->>'profissional1_especialidade' as especialidade,
  briefing_data->>'cidade' as cidade
FROM leads
WHERE briefing_data->>'tipo_negocio' = 'individual'
ORDER BY created_at DESC;

-- Consultórios em Parceria
SELECT
  nome,
  briefing_data->>'nome_consultorio' as consultorio,
  briefing_data->>'profissional1_nome' as dentista1,
  briefing_data->>'profissional2_nome' as dentista2,
  briefing_data->>'cidade' as cidade
FROM leads
WHERE briefing_data->>'tipo_negocio' = 'parceria'
ORDER BY created_at DESC;

-- Clínicas (3+ profissionais)
SELECT
  nome,
  briefing_data->>'nome_consultorio' as consultorio,
  briefing_data->>'diretor_nome' as diretor_tecnico,
  (briefing_data->>'num_profissionais')::int as num_profissionais,
  briefing_data->>'cidade' as cidade
FROM leads
WHERE briefing_data->>'tipo_negocio' = 'clinica'
ORDER BY created_at DESC;

-- =============================================
-- 3. ANÁLISE DE SERVIÇOS
-- =============================================

-- Serviços mais oferecidos (ranking)
SELECT
  servico,
  COUNT(*) as total_consultórios,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM leads WHERE briefing_data->'servicos' IS NOT NULL), 2) as percentual
FROM leads,
  jsonb_array_elements_text(briefing_data->'servicos') as servico
GROUP BY servico
ORDER BY total_consultórios DESC;

-- Leads que oferecem serviço específico
SELECT
  briefing_data->>'nome_consultorio' as consultorio,
  briefing_data->>'cidade' as cidade,
  briefing_data->>'whatsapp' as whatsapp,
  briefing_data->'servicos' as servicos_oferecidos
FROM leads
WHERE briefing_data->'servicos' ? 'implantes' -- Trocar 'implantes' pelo serviço desejado
ORDER BY created_at DESC;

-- Consultórios com mais de 4 serviços
SELECT
  briefing_data->>'nome_consultorio' as consultorio,
  jsonb_array_length(briefing_data->'servicos') as num_servicos,
  briefing_data->'servicos' as servicos
FROM leads
WHERE jsonb_array_length(briefing_data->'servicos') > 4
ORDER BY num_servicos DESC;

-- =============================================
-- 4. ANÁLISE DE CONVÊNIOS
-- =============================================

-- Convênios mais aceitos (ranking)
SELECT
  convenio,
  COUNT(*) as total_consultórios
FROM leads,
  jsonb_array_elements_text(briefing_data->'lista_convenios_array') as convenio
WHERE briefing_data->>'aceita_convenios' = 'sim'
GROUP BY convenio
ORDER BY total_consultórios DESC;

-- Leads que aceitam convênio específico
SELECT
  briefing_data->>'nome_consultorio' as consultorio,
  briefing_data->>'cidade' as cidade,
  briefing_data->>'whatsapp' as whatsapp,
  briefing_data->'lista_convenios_array' as convenios
FROM leads
WHERE briefing_data->'lista_convenios_array' ? 'unimed' -- Trocar pelo convênio desejado
ORDER BY created_at DESC;

-- Percentual que aceita convênios
SELECT
  briefing_data->>'aceita_convenios' as aceita,
  COUNT(*) as total,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM leads), 2) as percentual
FROM leads
WHERE briefing_data->>'aceita_convenios' IS NOT NULL
GROUP BY briefing_data->>'aceita_convenios';

-- =============================================
-- 5. ANÁLISE GEOGRÁFICA
-- =============================================

-- Leads por estado
SELECT
  briefing_data->>'estado' as estado,
  COUNT(*) as total
FROM leads
WHERE briefing_data->>'estado' IS NOT NULL
GROUP BY estado
ORDER BY total DESC;

-- Leads por cidade (top 10)
SELECT
  briefing_data->>'cidade' as cidade,
  briefing_data->>'estado' as estado,
  COUNT(*) as total
FROM leads
WHERE briefing_data->>'cidade' IS NOT NULL
GROUP BY cidade, estado
ORDER BY total DESC
LIMIT 10;

-- Leads em cidade específica
SELECT
  briefing_data->>'nome_consultorio' as consultorio,
  nome,
  whatsapp,
  briefing_data->>'rua' as endereco,
  briefing_data->>'bairro' as bairro
FROM leads
WHERE briefing_data->>'cidade' ILIKE '%São Paulo%'
  AND briefing_data->>'estado' = 'SP'
ORDER BY created_at DESC;

-- =============================================
-- 6. ANÁLISE DE DEPOIMENTOS
-- =============================================

-- Estratégias de depoimentos
SELECT
  briefing_data->>'estrategia_depoimentos' as estrategia,
  COUNT(*) as total,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM leads WHERE briefing_data->>'estrategia_depoimentos' IS NOT NULL), 2) as percentual
FROM leads
WHERE briefing_data->>'estrategia_depoimentos' IS NOT NULL
GROUP BY estrategia
ORDER BY total DESC;

-- Leads com Google Meu Negócio
SELECT
  briefing_data->>'nome_consultorio' as consultorio,
  briefing_data->>'link_google_maps' as google_maps,
  briefing_data->>'cidade' as cidade
FROM leads
WHERE briefing_data->>'estrategia_depoimentos' = 'google'
  AND briefing_data->>'link_google_maps' IS NOT NULL
ORDER BY created_at DESC;

-- Leads com depoimentos em texto
SELECT
  briefing_data->>'nome_consultorio' as consultorio,
  LEFT(briefing_data->>'depoimentos_texto', 100) as preview_depoimentos
FROM leads
WHERE briefing_data->>'estrategia_depoimentos' = 'texto'
  AND briefing_data->>'depoimentos_texto' IS NOT NULL
ORDER BY created_at DESC;

-- =============================================
-- 7. ANÁLISE DE TECNOLOGIAS
-- =============================================

-- Tecnologias mais oferecidas
SELECT
  tecnologia,
  COUNT(*) as total
FROM leads,
  jsonb_array_elements_text(briefing_data->'tecnologias') as tecnologia
GROUP BY tecnologia
ORDER BY total DESC;

-- Leads com tecnologia específica
SELECT
  briefing_data->>'nome_consultorio' as consultorio,
  briefing_data->>'cidade' as cidade,
  briefing_data->'tecnologias' as tecnologias
FROM leads
WHERE briefing_data->'tecnologias' ? 'implante' -- Trocar pela tecnologia desejada
ORDER BY created_at DESC;

-- Consultórios mais tecnológicos (5+ tecnologias)
SELECT
  briefing_data->>'nome_consultorio' as consultorio,
  jsonb_array_length(briefing_data->'tecnologias') as num_tecnologias,
  briefing_data->'tecnologias' as tecnologias
FROM leads
WHERE jsonb_array_length(briefing_data->'tecnologias') >= 5
ORDER BY num_tecnologias DESC;

-- =============================================
-- 8. ANÁLISE DE HORÁRIOS
-- =============================================

-- Horários de atendimento mais comuns
SELECT
  horario,
  COUNT(*) as total
FROM leads,
  jsonb_array_elements_text(briefing_data->'horarios_atendimento') as horario
GROUP BY horario
ORDER BY total DESC;

-- Leads que atendem 24h
SELECT
  briefing_data->>'nome_consultorio' as consultorio,
  briefing_data->>'cidade' as cidade,
  briefing_data->>'whatsapp' as whatsapp
FROM leads
WHERE briefing_data->>'atende_emergencia' = 'sim_24h'
ORDER BY created_at DESC;

-- Leads que atendem aos sábados
SELECT
  briefing_data->>'nome_consultorio' as consultorio,
  briefing_data->>'cidade' as cidade,
  briefing_data->'horarios_atendimento' as horarios
FROM leads
WHERE briefing_data->'horarios_atendimento' ? 'sabado'
ORDER BY created_at DESC;

-- =============================================
-- 9. ESTATÍSTICAS GERAIS
-- =============================================

-- Dashboard geral
SELECT
  COUNT(*) as total_leads,
  COUNT(*) FILTER (WHERE briefing_data->>'tipo_negocio' = 'individual') as individuais,
  COUNT(*) FILTER (WHERE briefing_data->>'tipo_negocio' = 'parceria') as parcerias,
  COUNT(*) FILTER (WHERE briefing_data->>'tipo_negocio' = 'clinica') as clinicas,
  COUNT(*) FILTER (WHERE briefing_data->>'aceita_convenios' = 'sim') as aceitam_convenios,
  COUNT(*) FILTER (WHERE briefing_data->>'oferece_sedacao' = 'sim') as oferecem_sedacao,
  COUNT(*) FILTER (WHERE briefing_data->>'tem_google_negocio' = 'sim') as tem_google,
  AVG((briefing_data->>'ano_inicio')::int) as ano_medio_inicio
FROM leads;

-- Média de serviços oferecidos
SELECT
  AVG(jsonb_array_length(briefing_data->'servicos')) as media_servicos,
  MIN(jsonb_array_length(briefing_data->'servicos')) as min_servicos,
  MAX(jsonb_array_length(briefing_data->'servicos')) as max_servicos
FROM leads
WHERE briefing_data->'servicos' IS NOT NULL;

-- =============================================
-- 10. VALIDAÇÃO DE DADOS
-- =============================================

-- Verificar leads com dados incompletos
SELECT
  id,
  nome,
  email,
  CASE
    WHEN briefing_data = '{}'::jsonb THEN 'Briefing vazio'
    WHEN briefing_data->>'tipo_negocio' IS NULL THEN 'Falta tipo_negocio'
    WHEN briefing_data->>'nome_consultorio' IS NULL THEN 'Falta nome_consultorio'
    WHEN briefing_data->>'estrategia_depoimentos' IS NULL THEN 'Falta estrategia_depoimentos'
    WHEN briefing_data->>'cep' IS NULL THEN 'Falta endereço'
    ELSE 'OK'
  END as status_validacao,
  created_at
FROM leads
ORDER BY created_at DESC;

-- Leads sem briefing completo
SELECT
  id,
  nome,
  email,
  status,
  created_at
FROM leads
WHERE briefing_data = '{}'::jsonb
   OR briefing_data IS NULL
ORDER BY created_at DESC;

-- =============================================
-- 11. EXPORTAÇÃO DE DADOS
-- =============================================

-- Exportar dados completos para CSV (use no Supabase Dashboard)
SELECT
  -- Dados básicos
  id,
  nome,
  email,
  whatsapp,
  status,
  created_at,

  -- Briefing - Página 1
  briefing_data->>'tipo_negocio' as tipo_negocio,
  briefing_data->>'nome_consultorio' as nome_consultorio,
  briefing_data->>'slogan_opcao' as slogan,
  briefing_data->>'ano_inicio' as ano_inicio,

  -- Briefing - Página 2
  briefing_data->>'profissional1_nome' as profissional,
  briefing_data->>'profissional1_especialidade' as especialidade,

  -- Briefing - Página 3
  briefing_data->'servicos' as servicos,
  briefing_data->>'aceita_convenios' as aceita_convenios,

  -- Briefing - Página 4
  briefing_data->>'cidade' as cidade,
  briefing_data->>'estado' as estado,

  -- Briefing - Página 5
  briefing_data->>'estrategia_depoimentos' as depoimentos

FROM leads
ORDER BY created_at DESC;

-- =============================================
-- 12. ÍNDICES PARA PERFORMANCE
-- =============================================

-- Criar índices GIN para buscas rápidas em JSONB
CREATE INDEX IF NOT EXISTS idx_leads_briefing_gin
  ON leads USING GIN (briefing_data);

-- Índices para campos específicos muito usados
CREATE INDEX IF NOT EXISTS idx_leads_tipo_negocio
  ON leads ((briefing_data->>'tipo_negocio'));

CREATE INDEX IF NOT EXISTS idx_leads_cidade
  ON leads ((briefing_data->>'cidade'));

CREATE INDEX IF NOT EXISTS idx_leads_estado
  ON leads ((briefing_data->>'estado'));

CREATE INDEX IF NOT EXISTS idx_leads_aceita_convenios
  ON leads ((briefing_data->>'aceita_convenios'));

-- =============================================
-- FIM DAS QUERIES
-- =============================================
