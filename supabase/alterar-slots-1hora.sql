-- =============================================
-- ALTERAR SLOTS DE 30 MINUTOS PARA 1 HORA
-- Execute este script no SQL Editor do Supabase
-- =============================================

-- Atualizar todos os slots para 60 minutos
UPDATE disponibilidade
SET duracao_slot = 60
WHERE duracao_slot = 30;

-- Verificar a alteração
SELECT
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
  duracao_slot || ' minutos' as duracao,
  ativo
FROM disponibilidade
WHERE ativo = true
ORDER BY dia_semana, horario_inicio;

-- Testar horários disponíveis (deve retornar 7 horários ao invés de 14)
-- Para segunda-feira, 13/01/2025
SELECT
  'HORÁRIOS DISPONÍVEIS (1h em 1h)' as info,
  COUNT(*) as total_horarios
FROM listar_horarios_disponiveis('2025-01-13');

-- Listar os horários
SELECT
  'HORÁRIOS PARA 13/01/2025' as info,
  horario::text as horario_disponivel
FROM listar_horarios_disponiveis('2025-01-13')
ORDER BY horario;

-- =============================================
-- RESULTADO ESPERADO:
-- Segunda a Quinta: 7 horários (9h, 10h, 11h, 14h, 15h, 16h, 17h)
-- Sexta: 6 horários (9h, 10h, 11h, 14h, 15h, 16h)
-- =============================================
