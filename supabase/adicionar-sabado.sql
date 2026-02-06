-- =============================================
-- ADICIONAR SÁBADO AO HORÁRIO DE ATENDIMENTO
-- Sábado: 9h às 20h (mesmo horário da semana)
-- Execute este script no SQL Editor do Supabase
-- =============================================

-- Adicionar Sábado (dia 6)
INSERT INTO disponibilidade (dia_semana, horario_inicio, horario_fim, duracao_slot, ativo)
VALUES (6, '09:00', '20:00', 60, true);

-- Verificar configuração completa
SELECT
  'CONFIGURAÇÃO ATUALIZADA' as info,
  CASE dia_semana
    WHEN 0 THEN 'Domingo'
    WHEN 1 THEN 'Segunda-feira'
    WHEN 2 THEN 'Terça-feira'
    WHEN 3 THEN 'Quarta-feira'
    WHEN 4 THEN 'Quinta-feira'
    WHEN 5 THEN 'Sexta-feira'
    WHEN 6 THEN 'Sábado'
  END as dia,
  horario_inicio,
  horario_fim,
  duracao_slot || ' minutos' as intervalo,
  (EXTRACT(HOUR FROM horario_fim) - EXTRACT(HOUR FROM horario_inicio)) as horas_totais,
  ativo
FROM disponibilidade
WHERE ativo = true
ORDER BY dia_semana, horario_inicio;

-- Testar horários para sábado, 18/01/2025
SELECT
  'TESTE: Horários do Sábado' as info,
  COUNT(*) as total_horarios
FROM listar_horarios_disponiveis('2025-01-18');

-- Listar horários de sábado
SELECT
  'HORÁRIOS PARA 18/01/2025 (Sábado)' as info,
  horario::text as horario
FROM listar_horarios_disponiveis('2025-01-18')
ORDER BY horario;

-- =============================================
-- RESULTADO ESPERADO:
-- =============================================
-- Segunda a Sábado: 11 horários contínuos
-- 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00, 18:00, 19:00
--
-- Domingo: Sem atendimento
-- =============================================
