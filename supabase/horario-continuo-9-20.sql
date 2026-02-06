-- =============================================
-- ALTERAR HORÁRIO DE ATENDIMENTO
-- Das 9h às 20h SEM INTERVALO (contínuo)
-- Execute este script no SQL Editor do Supabase
-- =============================================

-- PASSO 1: Remover todos os horários antigos
DELETE FROM disponibilidade;

-- PASSO 2: Adicionar horário contínuo das 9h às 20h
-- Segunda-feira a Sexta-feira (dias 1 a 5)

-- Segunda-feira (1)
INSERT INTO disponibilidade (dia_semana, horario_inicio, horario_fim, duracao_slot, ativo)
VALUES (1, '09:00', '20:00', 60, true);

-- Terça-feira (2)
INSERT INTO disponibilidade (dia_semana, horario_inicio, horario_fim, duracao_slot, ativo)
VALUES (2, '09:00', '20:00', 60, true);

-- Quarta-feira (3)
INSERT INTO disponibilidade (dia_semana, horario_inicio, horario_fim, duracao_slot, ativo)
VALUES (3, '09:00', '20:00', 60, true);

-- Quinta-feira (4)
INSERT INTO disponibilidade (dia_semana, horario_inicio, horario_fim, duracao_slot, ativo)
VALUES (4, '09:00', '20:00', 60, true);

-- Sexta-feira (5)
INSERT INTO disponibilidade (dia_semana, horario_inicio, horario_fim, duracao_slot, ativo)
VALUES (5, '09:00', '20:00', 60, true);

-- PASSO 3: Verificar configuração
SELECT
  'CONFIGURAÇÃO ATUALIZADA' as info,
  CASE dia_semana
    WHEN 1 THEN 'Segunda-feira'
    WHEN 2 THEN 'Terça-feira'
    WHEN 3 THEN 'Quarta-feira'
    WHEN 4 THEN 'Quinta-feira'
    WHEN 5 THEN 'Sexta-feira'
    WHEN 6 THEN 'Sábado'
    WHEN 0 THEN 'Domingo'
  END as dia,
  horario_inicio,
  horario_fim,
  duracao_slot || ' minutos' as intervalo,
  (EXTRACT(HOUR FROM horario_fim) - EXTRACT(HOUR FROM horario_inicio)) as horas_totais,
  ativo
FROM disponibilidade
WHERE ativo = true
ORDER BY dia_semana, horario_inicio;

-- PASSO 4: Testar horários disponíveis
-- Para segunda-feira, 13/01/2025
SELECT
  'TESTE: Total de horários' as info,
  COUNT(*) as total_horarios
FROM listar_horarios_disponiveis('2025-01-13');

-- PASSO 5: Listar todos os horários disponíveis
SELECT
  'HORÁRIOS DISPONÍVEIS (13/01/2025)' as info,
  horario::text as horario
FROM listar_horarios_disponiveis('2025-01-13')
ORDER BY horario;

-- =============================================
-- RESULTADO ESPERADO:
-- =============================================
-- Segunda a Sexta: 11 horários contínuos
-- 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00, 18:00, 19:00
--
-- Total: 11 horários por dia
-- Horário: 9h às 20h (11 horas de atendimento)
-- =============================================
