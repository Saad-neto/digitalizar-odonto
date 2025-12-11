-- SISTEMA DE AGENDAMENTO DE REUNIOES
-- Digitalizar Odonto

-- TABELA: agendamentos
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
  status TEXT NOT NULL DEFAULT 'agendado' CHECK (status IN ('agendado', 'confirmado', 'realizado', 'cancelado', 'remarcado')),
  tipo TEXT NOT NULL DEFAULT 'comercial' CHECK (tipo IN ('comercial', 'alinhamento', 'aprovacao', 'suporte')),
  observacoes TEXT,
  motivo_cancelamento TEXT,
  link_reuniao TEXT,
  lembrete_enviado BOOLEAN DEFAULT FALSE,
  lembrete_enviado_at TIMESTAMP WITH TIME ZONE,
  confirmado_at TIMESTAMP WITH TIME ZONE,
  realizado_at TIMESTAMP WITH TIME ZONE,
  cancelado_at TIMESTAMP WITH TIME ZONE
);

-- TABELA: disponibilidade
CREATE TABLE IF NOT EXISTS disponibilidade (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  dia_semana INTEGER NOT NULL CHECK (dia_semana >= 0 AND dia_semana <= 6),
  horario_inicio TIME NOT NULL,
  horario_fim TIME NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  duracao_slot INTEGER DEFAULT 30
);

-- TABELA: bloqueios
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

-- INDICES
CREATE INDEX IF NOT EXISTS idx_agendamentos_data ON agendamentos(data);
CREATE INDEX IF NOT EXISTS idx_agendamentos_status ON agendamentos(status);
CREATE INDEX IF NOT EXISTS idx_agendamentos_lead_id ON agendamentos(lead_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_email ON agendamentos(email);
CREATE INDEX IF NOT EXISTS idx_disponibilidade_dia_semana ON disponibilidade(dia_semana);
CREATE INDEX IF NOT EXISTS idx_bloqueios_datas ON bloqueios(data_inicio, data_fim);

-- TRIGGERS
CREATE TRIGGER update_agendamentos_updated_at BEFORE UPDATE ON agendamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- FUNCAO: Verificar disponibilidade de horario
CREATE OR REPLACE FUNCTION verificar_disponibilidade(p_data DATE, p_horario TIME) RETURNS BOOLEAN AS $$
DECLARE
  v_dia_semana INTEGER;
  v_disponivel BOOLEAN;
  v_bloqueado BOOLEAN;
  v_agendado BOOLEAN;
BEGIN
  v_dia_semana := EXTRACT(DOW FROM p_data);
  SELECT EXISTS(SELECT 1 FROM disponibilidade WHERE dia_semana = v_dia_semana AND ativo = TRUE AND p_horario >= horario_inicio AND p_horario < horario_fim) INTO v_disponivel;
  IF NOT v_disponivel THEN RETURN FALSE; END IF;
  SELECT EXISTS(SELECT 1 FROM bloqueios WHERE ativo = TRUE AND p_data BETWEEN data_inicio AND data_fim AND ((horario_inicio IS NULL AND horario_fim IS NULL) OR (p_horario >= horario_inicio AND p_horario < horario_fim))) INTO v_bloqueado;
  IF v_bloqueado THEN RETURN FALSE; END IF;
  SELECT EXISTS(SELECT 1 FROM agendamentos WHERE data = p_data AND horario = p_horario AND status IN ('agendado', 'confirmado')) INTO v_agendado;
  IF v_agendado THEN RETURN FALSE; END IF;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- FUNCAO: Listar horarios disponiveis de um dia
CREATE OR REPLACE FUNCTION listar_horarios_disponiveis(p_data DATE) RETURNS TABLE(horario TIME) AS $$
DECLARE
  v_dia_semana INTEGER;
  v_slot RECORD;
  v_horario_atual TIME;
BEGIN
  v_dia_semana := EXTRACT(DOW FROM p_data);
  FOR v_slot IN SELECT horario_inicio, horario_fim, duracao_slot FROM disponibilidade WHERE dia_semana = v_dia_semana AND ativo = TRUE ORDER BY horario_inicio LOOP
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
$$ LANGUAGE plpgsql;

-- INSERIR DISPONIBILIDADE PADRAO
TRUNCATE TABLE disponibilidade;

INSERT INTO disponibilidade (dia_semana, horario_inicio, horario_fim, duracao_slot) VALUES (1, '09:00', '12:00', 30), (1, '14:00', '18:00', 30);
INSERT INTO disponibilidade (dia_semana, horario_inicio, horario_fim, duracao_slot) VALUES (2, '09:00', '12:00', 30), (2, '14:00', '18:00', 30);
INSERT INTO disponibilidade (dia_semana, horario_inicio, horario_fim, duracao_slot) VALUES (3, '09:00', '12:00', 30), (3, '14:00', '18:00', 30);
INSERT INTO disponibilidade (dia_semana, horario_inicio, horario_fim, duracao_slot) VALUES (4, '09:00', '12:00', 30), (4, '14:00', '18:00', 30);
INSERT INTO disponibilidade (dia_semana, horario_inicio, horario_fim, duracao_slot) VALUES (5, '09:00', '12:00', 30), (5, '14:00', '17:00', 30);

-- POLITICAS RLS
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE disponibilidade ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloqueios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Disponibilidade e publica para leitura" ON disponibilidade FOR SELECT USING (true);
CREATE POLICY "Bloqueios sao publicos para leitura" ON bloqueios FOR SELECT USING (ativo = true);
CREATE POLICY "Qualquer um pode criar agendamento" ON agendamentos FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin pode ver todos agendamentos" ON agendamentos FOR SELECT USING (auth.role() = 'authenticated');

-- VIEWS UTEIS
CREATE OR REPLACE VIEW agendamentos_completo AS SELECT a.*, l.nome as lead_nome, l.email as lead_email, l.status as lead_status FROM agendamentos a LEFT JOIN leads l ON a.lead_id = l.id;

CREATE OR REPLACE VIEW stats_agendamentos AS SELECT COUNT(*) FILTER (WHERE status = 'agendado') as total_agendados, COUNT(*) FILTER (WHERE status = 'confirmado') as total_confirmados, COUNT(*) FILTER (WHERE status = 'realizado') as total_realizados, COUNT(*) FILTER (WHERE status = 'cancelado') as total_cancelados, COUNT(*) FILTER (WHERE data = CURRENT_DATE) as agendamentos_hoje, COUNT(*) FILTER (WHERE data > CURRENT_DATE) as agendamentos_futuros FROM agendamentos;
