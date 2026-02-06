-- =============================================
-- CORREÇÃO COMPLETA DO SISTEMA DE AGENDAMENTOS
-- Execute este script no SQL Editor do Supabase
-- Versão: 1.0 - 2026-01-08
-- =============================================

-- =============================================
-- PASSO 1: LIMPAR CONFIGURAÇÕES ANTIGAS
-- =============================================

-- Remover todas as policies antigas
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Remover policies de agendamentos
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'agendamentos') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON agendamentos CASCADE';
    END LOOP;

    -- Remover policies de disponibilidade
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'disponibilidade') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON disponibilidade CASCADE';
    END LOOP;

    -- Remover policies de bloqueios
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'bloqueios') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON bloqueios CASCADE';
    END LOOP;
END $$;

-- Remover funções antigas (se existirem)
DROP FUNCTION IF EXISTS listar_horarios_disponiveis(DATE) CASCADE;
DROP FUNCTION IF EXISTS verificar_disponibilidade(DATE, TIME) CASCADE;

-- =============================================
-- PASSO 2: CRIAR OU RECRIAR TABELAS
-- =============================================

-- Tabela: agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  empresa TEXT,
  data DATE NOT NULL,
  horario TIME NOT NULL,
  duracao INTEGER NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'agendado'
    CHECK (status IN ('agendado', 'confirmado', 'realizado', 'cancelado', 'remarcado')),
  tipo TEXT NOT NULL DEFAULT 'comercial'
    CHECK (tipo IN ('comercial', 'alinhamento', 'aprovacao', 'suporte')),
  observacoes TEXT,
  motivo_cancelamento TEXT,
  link_reuniao TEXT,
  lembrete_enviado BOOLEAN DEFAULT FALSE,
  lembrete_enviado_at TIMESTAMP WITH TIME ZONE,
  confirmado_at TIMESTAMP WITH TIME ZONE,
  realizado_at TIMESTAMP WITH TIME ZONE,
  cancelado_at TIMESTAMP WITH TIME ZONE
);

-- Tabela: disponibilidade
CREATE TABLE IF NOT EXISTS disponibilidade (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  dia_semana INTEGER NOT NULL CHECK (dia_semana >= 0 AND dia_semana <= 6),
  horario_inicio TIME NOT NULL,
  horario_fim TIME NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  duracao_slot INTEGER DEFAULT 30
);

-- Tabela: bloqueios
CREATE TABLE IF NOT EXISTS bloqueios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  horario_inicio TIME,
  horario_fim TIME,
  motivo TEXT NOT NULL,
  ativo BOOLEAN DEFAULT TRUE
);

-- =============================================
-- PASSO 3: CRIAR ÍNDICES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_agendamentos_data ON agendamentos(data);
CREATE INDEX IF NOT EXISTS idx_agendamentos_status ON agendamentos(status);
CREATE INDEX IF NOT EXISTS idx_agendamentos_lead_id ON agendamentos(lead_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_email ON agendamentos(email);
CREATE INDEX IF NOT EXISTS idx_disponibilidade_dia_semana ON disponibilidade(dia_semana);
CREATE INDEX IF NOT EXISTS idx_bloqueios_datas ON bloqueios(data_inicio, data_fim);

-- =============================================
-- PASSO 4: CRIAR FUNÇÕES SQL
-- =============================================

-- Função: verificar_disponibilidade
CREATE OR REPLACE FUNCTION verificar_disponibilidade(
  p_data DATE,
  p_horario TIME
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_dia_semana INTEGER;
  v_disponivel BOOLEAN;
  v_bloqueado BOOLEAN;
  v_agendado BOOLEAN;
BEGIN
  -- Extrair dia da semana (0 = Domingo)
  v_dia_semana := EXTRACT(DOW FROM p_data);

  -- Verificar se existe disponibilidade configurada
  SELECT EXISTS(
    SELECT 1
    FROM disponibilidade
    WHERE dia_semana = v_dia_semana
      AND ativo = TRUE
      AND p_horario >= horario_inicio
      AND p_horario < horario_fim
  ) INTO v_disponivel;

  IF NOT v_disponivel THEN
    RETURN FALSE;
  END IF;

  -- Verificar se está bloqueado
  SELECT EXISTS(
    SELECT 1
    FROM bloqueios
    WHERE ativo = TRUE
      AND p_data BETWEEN data_inicio AND data_fim
      AND (
        (horario_inicio IS NULL AND horario_fim IS NULL)
        OR (p_horario >= horario_inicio AND p_horario < horario_fim)
      )
  ) INTO v_bloqueado;

  IF v_bloqueado THEN
    RETURN FALSE;
  END IF;

  -- Verificar se já existe agendamento
  SELECT EXISTS(
    SELECT 1
    FROM agendamentos
    WHERE data = p_data
      AND horario = p_horario
      AND status IN ('agendado', 'confirmado')
  ) INTO v_agendado;

  IF v_agendado THEN
    RETURN FALSE;
  END IF;

  RETURN TRUE;
END;
$$;

-- Função: listar_horarios_disponiveis
CREATE OR REPLACE FUNCTION listar_horarios_disponiveis(p_data DATE)
RETURNS TABLE(horario TIME)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_dia_semana INTEGER;
  v_slot RECORD;
  v_horario_atual TIME;
BEGIN
  -- Extrair dia da semana
  v_dia_semana := EXTRACT(DOW FROM p_data);

  -- Iterar sobre as configurações de disponibilidade
  FOR v_slot IN
    SELECT horario_inicio, horario_fim, duracao_slot
    FROM disponibilidade
    WHERE dia_semana = v_dia_semana
      AND ativo = TRUE
    ORDER BY horario_inicio
  LOOP
    v_horario_atual := v_slot.horario_inicio;

    WHILE v_horario_atual < v_slot.horario_fim LOOP
      -- Verificar se o horário está disponível
      IF verificar_disponibilidade(p_data, v_horario_atual) THEN
        horario := v_horario_atual;
        RETURN NEXT;
      END IF;

      -- Avançar para o próximo slot
      v_horario_atual := v_horario_atual + (v_slot.duracao_slot || ' minutes')::INTERVAL;
    END LOOP;
  END LOOP;

  RETURN;
END;
$$;

-- =============================================
-- PASSO 5: INSERIR DISPONIBILIDADE PADRÃO
-- =============================================

-- Limpar disponibilidade existente
TRUNCATE TABLE disponibilidade;

-- Segunda-feira (1)
INSERT INTO disponibilidade (dia_semana, horario_inicio, horario_fim, duracao_slot, ativo) VALUES
  (1, '09:00', '12:00', 30, true),
  (1, '14:00', '18:00', 30, true);

-- Terça-feira (2)
INSERT INTO disponibilidade (dia_semana, horario_inicio, horario_fim, duracao_slot, ativo) VALUES
  (2, '09:00', '12:00', 30, true),
  (2, '14:00', '18:00', 30, true);

-- Quarta-feira (3)
INSERT INTO disponibilidade (dia_semana, horario_inicio, horario_fim, duracao_slot, ativo) VALUES
  (3, '09:00', '12:00', 30, true),
  (3, '14:00', '18:00', 30, true);

-- Quinta-feira (4)
INSERT INTO disponibilidade (dia_semana, horario_inicio, horario_fim, duracao_slot, ativo) VALUES
  (4, '09:00', '12:00', 30, true),
  (4, '14:00', '18:00', 30, true);

-- Sexta-feira (5)
INSERT INTO disponibilidade (dia_semana, horario_inicio, horario_fim, duracao_slot, ativo) VALUES
  (5, '09:00', '12:00', 30, true),
  (5, '14:00', '17:00', 30, true);

-- =============================================
-- PASSO 6: CONFIGURAR RLS (Row Level Security)
-- =============================================

-- Habilitar RLS
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE disponibilidade ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloqueios ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLICIES PARA AGENDAMENTOS
-- =============================================

-- INSERT: Permitir criação pública
CREATE POLICY "agendamentos_public_insert"
  ON agendamentos
  FOR INSERT
  TO public
  WITH CHECK (true);

-- SELECT: Apenas usuários autenticados (admin)
CREATE POLICY "agendamentos_auth_select"
  ON agendamentos
  FOR SELECT
  TO authenticated
  USING (true);

-- UPDATE: Apenas usuários autenticados
CREATE POLICY "agendamentos_auth_update"
  ON agendamentos
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- DELETE: Apenas usuários autenticados
CREATE POLICY "agendamentos_auth_delete"
  ON agendamentos
  FOR DELETE
  TO authenticated
  USING (true);

-- =============================================
-- POLICIES PARA DISPONIBILIDADE
-- =============================================

-- SELECT: Leitura pública (necessário para listar horários)
CREATE POLICY "disponibilidade_public_select"
  ON disponibilidade
  FOR SELECT
  TO public
  USING (ativo = true);

-- ALL: Usuários autenticados podem fazer tudo
CREATE POLICY "disponibilidade_auth_all"
  ON disponibilidade
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================
-- POLICIES PARA BLOQUEIOS
-- =============================================

-- SELECT: Leitura pública de bloqueios ativos
CREATE POLICY "bloqueios_public_select"
  ON bloqueios
  FOR SELECT
  TO public
  USING (ativo = true);

-- ALL: Usuários autenticados podem fazer tudo
CREATE POLICY "bloqueios_auth_all"
  ON bloqueios
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================
-- PASSO 7: CRIAR VIEWS ÚTEIS
-- =============================================

-- View: Agendamentos com informações do lead
CREATE OR REPLACE VIEW agendamentos_completo AS
SELECT
  a.*,
  l.nome as lead_nome,
  l.email as lead_email,
  l.status as lead_status,
  l.briefing_data->>'nomeConsultorio' as nome_consultorio
FROM agendamentos a
LEFT JOIN leads l ON a.lead_id = l.id;

-- View: Estatísticas de agendamentos
CREATE OR REPLACE VIEW stats_agendamentos AS
SELECT
  COUNT(*) FILTER (WHERE status = 'agendado') as total_agendados,
  COUNT(*) FILTER (WHERE status = 'confirmado') as total_confirmados,
  COUNT(*) FILTER (WHERE status = 'realizado') as total_realizados,
  COUNT(*) FILTER (WHERE status = 'cancelado') as total_cancelados,
  COUNT(*) FILTER (WHERE data = CURRENT_DATE) as agendamentos_hoje,
  COUNT(*) FILTER (WHERE data > CURRENT_DATE) as agendamentos_futuros
FROM agendamentos;

-- =============================================
-- PASSO 8: TESTAR TUDO
-- =============================================

-- Testar função de listar horários (20/01/2025 - segunda-feira)
SELECT 'TESTE: Listar horários disponíveis' as teste,
       COUNT(*) as total_horarios
FROM listar_horarios_disponiveis('2025-01-20');

-- Mostrar horários configurados
SELECT 'CONFIGURAÇÃO: Horários por dia da semana' as info,
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
       duracao_slot || ' min' as duracao
FROM disponibilidade
WHERE ativo = true
ORDER BY dia_semana, horario_inicio;

-- Verificar policies criadas
SELECT 'POLÍTICAS RLS CRIADAS' as info,
       tablename as tabela,
       policyname as policy,
       cmd as operacao
FROM pg_policies
WHERE tablename IN ('agendamentos', 'disponibilidade', 'bloqueios')
ORDER BY tablename, policyname;

-- =============================================
-- RESULTADO ESPERADO
-- =============================================
-- Se tudo funcionou:
-- ✓ Teste de listar horários deve retornar > 0 horários
-- ✓ Deve mostrar 8 configurações de disponibilidade (Segunda a Sexta, manhã e tarde)
-- ✓ Deve listar várias policies RLS
--
-- Agora você pode usar:
-- - Frontend: /agendar
-- - Admin: /admin/agendamentos
-- =============================================
