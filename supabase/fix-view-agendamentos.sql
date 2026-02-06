-- =============================================
-- CORREÇÃO: VIEW agendamentos_completo
-- Remove coluna inexistente nome_consultorio
-- =============================================

-- Remover view antiga (se existir)
DROP VIEW IF EXISTS agendamentos_completo CASCADE;

-- Recriar view corrigida
CREATE OR REPLACE VIEW agendamentos_completo AS
SELECT
  a.*,
  l.nome as lead_nome,
  l.email as lead_email,
  l.status as lead_status,
  l.briefing_data->>'nomeConsultorio' as nome_consultorio
FROM agendamentos a
LEFT JOIN leads l ON a.lead_id = l.id;

-- Verificar se a view foi criada
SELECT 'VIEW CRIADA COM SUCESSO' as info;

-- Testar a view
SELECT COUNT(*) as total_agendamentos FROM agendamentos_completo;

-- =============================================
-- Pronto! Agora execute o fix-agendamentos-completo.sql
-- =============================================
