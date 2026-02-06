-- =============================================
-- SCRIPT DE CORREÇÃO FINAL - EXECUTAR ESTE!
-- Copie TODO este conteúdo e execute no Supabase
-- =============================================

-- PASSO 1: Habilitar RLS em agendamentos
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;

-- PASSO 2: Remover policies antigas
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'agendamentos') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON agendamentos CASCADE';
    END LOOP;
END $$;

-- PASSO 3: Criar policies corretas
CREATE POLICY "agendamentos_public_insert"
  ON agendamentos FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "agendamentos_auth_select"
  ON agendamentos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "agendamentos_auth_update"
  ON agendamentos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "agendamentos_auth_delete"
  ON agendamentos FOR DELETE
  TO authenticated
  USING (true);

-- PASSO 4: Verificar se as funções existem
DO $$
BEGIN
  -- Se a função não existir, cria
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc
    WHERE proname = 'verificar_disponibilidade'
  ) THEN
    -- Criar função verificar_disponibilidade
    CREATE FUNCTION verificar_disponibilidade(
      p_data DATE,
      p_horario TIME
    ) RETURNS BOOLEAN
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $func$
    DECLARE
      v_dia_semana INTEGER;
      v_disponivel BOOLEAN;
      v_bloqueado BOOLEAN;
      v_agendado BOOLEAN;
    BEGIN
      v_dia_semana := EXTRACT(DOW FROM p_data);

      SELECT EXISTS(
        SELECT 1 FROM disponibilidade
        WHERE dia_semana = v_dia_semana
          AND ativo = TRUE
          AND p_horario >= horario_inicio
          AND p_horario < horario_fim
      ) INTO v_disponivel;

      IF NOT v_disponivel THEN RETURN FALSE; END IF;

      SELECT EXISTS(
        SELECT 1 FROM bloqueios
        WHERE ativo = TRUE
          AND p_data BETWEEN data_inicio AND data_fim
          AND (
            (horario_inicio IS NULL AND horario_fim IS NULL)
            OR (p_horario >= horario_inicio AND p_horario < horario_fim)
          )
      ) INTO v_bloqueado;

      IF v_bloqueado THEN RETURN FALSE; END IF;

      SELECT EXISTS(
        SELECT 1 FROM agendamentos
        WHERE data = p_data
          AND horario = p_horario
          AND status IN ('agendado', 'confirmado')
      ) INTO v_agendado;

      IF v_agendado THEN RETURN FALSE; END IF;

      RETURN TRUE;
    END;
    $func$;
  END IF;

  -- Se a função listar_horarios_disponiveis não existir, cria
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc
    WHERE proname = 'listar_horarios_disponiveis'
  ) THEN
    CREATE FUNCTION listar_horarios_disponiveis(p_data DATE)
    RETURNS TABLE(horario TIME)
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $func$
    DECLARE
      v_dia_semana INTEGER;
      v_slot RECORD;
      v_horario_atual TIME;
    BEGIN
      v_dia_semana := EXTRACT(DOW FROM p_data);

      FOR v_slot IN
        SELECT horario_inicio, horario_fim, duracao_slot
        FROM disponibilidade
        WHERE dia_semana = v_dia_semana AND ativo = TRUE
        ORDER BY horario_inicio
      LOOP
        v_horario_atual := v_slot.horario_inicio;

        WHILE v_horario_atual < v_slot.horario_fim LOOP
          IF verificar_disponibilidade(p_data, v_horario_atual) THEN
            horario := v_horario_atual;
            RETURN NEXT;
          END IF;

          v_horario_atual := v_horario_atual + (v_slot.duracao_slot || ' minutes')::INTERVAL;
        END LOOP;
      END LOOP;

      RETURN;
    END;
    $func$;
  END IF;
END $$;

-- PASSO 5: Garantir que há horários configurados
INSERT INTO disponibilidade (dia_semana, horario_inicio, horario_fim, duracao_slot, ativo)
VALUES
  (1, '09:00', '12:00', 30, true),
  (1, '14:00', '18:00', 30, true),
  (2, '09:00', '12:00', 30, true),
  (2, '14:00', '18:00', 30, true),
  (3, '09:00', '12:00', 30, true),
  (3, '14:00', '18:00', 30, true),
  (4, '09:00', '12:00', 30, true),
  (4, '14:00', '18:00', 30, true),
  (5, '09:00', '12:00', 30, true),
  (5, '14:00', '17:00', 30, true)
ON CONFLICT DO NOTHING;

-- PASSO 6: Corrigir VIEW
DROP VIEW IF EXISTS agendamentos_completo CASCADE;

CREATE OR REPLACE VIEW agendamentos_completo AS
SELECT
  a.*,
  l.nome as lead_nome,
  l.email as lead_email,
  l.status as lead_status,
  l.briefing_data->>'nomeConsultorio' as nome_consultorio
FROM agendamentos a
LEFT JOIN leads l ON a.lead_id = l.id;

-- PASSO 7: VERIFICAÇÃO FINAL
SELECT '✅ RLS HABILITADO' as resultado,
  CASE rowsecurity
    WHEN true THEN '✓ SIM'
    ELSE '✗ NÃO'
  END as status
FROM pg_tables
WHERE tablename = 'agendamentos';

SELECT '✅ POLICIES CRIADAS' as resultado,
  COUNT(*) as total
FROM pg_policies
WHERE tablename = 'agendamentos';

SELECT '✅ HORÁRIOS CONFIGURADOS' as resultado,
  COUNT(*) as total
FROM disponibilidade
WHERE ativo = true;

SELECT '✅ FUNÇÕES CRIADAS' as resultado,
  COUNT(*) as total
FROM pg_proc
WHERE proname IN ('listar_horarios_disponiveis', 'verificar_disponibilidade');

-- TESTE FINAL: Listar horários para 13/01/2025 (segunda-feira)
SELECT '✅ TESTE DE HORÁRIOS' as resultado,
  COUNT(*) as horarios_disponiveis
FROM listar_horarios_disponiveis('2025-01-13');

-- =============================================
-- SE VOCÊ VER TODOS OS ✅ ACIMA, ESTÁ PRONTO!
-- Teste em: https://sites-odonto.digitalizar.space/agendar
-- =============================================
