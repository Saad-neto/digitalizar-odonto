-- =====================================================
-- ADICIONAR CAMPOS PARA ASSINATURA DE MANUTENÇÃO
-- =====================================================
-- Este script adiciona campos na tabela leads para gerenciar
-- a assinatura de R$ 97/mês após o primeiro ano

-- Adicionar campos na tabela leads
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS data_inicio_servico TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS assinatura_manutencao_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS status_assinatura VARCHAR(50) DEFAULT 'nao_iniciada',
ADD COLUMN IF NOT EXISTS proxima_cobranca_manutencao TIMESTAMP WITH TIME ZONE;

-- Comentários para documentação
COMMENT ON COLUMN leads.data_inicio_servico IS 'Data que o site foi colocado no ar (após pagamento)';
COMMENT ON COLUMN leads.assinatura_manutencao_id IS 'ID da assinatura de manutenção no Asaas';
COMMENT ON COLUMN leads.status_assinatura IS 'Status: nao_iniciada, agendada, ativa, pausada, cancelada';
COMMENT ON COLUMN leads.proxima_cobranca_manutencao IS 'Data da próxima cobrança de manutenção (R$ 97/mês)';

-- Criar índice para performance em queries de assinatura
CREATE INDEX IF NOT EXISTS idx_leads_status_assinatura ON leads(status_assinatura);
CREATE INDEX IF NOT EXISTS idx_leads_proxima_cobranca ON leads(proxima_cobranca_manutencao);

-- Criar tabela de histórico de pagamentos de manutenção
CREATE TABLE IF NOT EXISTS maintenance_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Relação com lead
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,

  -- Dados do pagamento
  asaas_payment_id VARCHAR(255),
  valor DECIMAL(10,2) NOT NULL, -- R$ 97,00
  status VARCHAR(50) NOT NULL, -- pending, confirmed, overdue, refunded

  -- Datas
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE,

  -- Metadados
  billing_type VARCHAR(50), -- PIX, BOLETO, CREDIT_CARD
  invoice_url TEXT,

  CONSTRAINT fk_maintenance_lead FOREIGN KEY (lead_id) REFERENCES leads(id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_maintenance_lead_id ON maintenance_payments(lead_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance_payments(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_due_date ON maintenance_payments(due_date);

-- Comentário
COMMENT ON TABLE maintenance_payments IS 'Histórico de pagamentos mensais de manutenção (R$ 97/mês)';

-- =====================================================
-- CONSTRAINT PARA STATUS DE ASSINATURA
-- =====================================================
ALTER TABLE leads
DROP CONSTRAINT IF EXISTS check_status_assinatura;

ALTER TABLE leads
ADD CONSTRAINT check_status_assinatura
CHECK (status_assinatura IN ('nao_iniciada', 'agendada', 'ativa', 'pausada', 'cancelada'));

-- =====================================================
-- FUNCTION PARA AGENDAR ASSINATURA AUTOMATICAMENTE
-- =====================================================
CREATE OR REPLACE FUNCTION agendar_assinatura_apos_pagamento()
RETURNS TRIGGER AS $$
BEGIN
  -- Quando o lead muda para 'em_producao', agendar assinatura
  IF NEW.status = 'em_producao' AND OLD.status != 'em_producao' THEN
    -- Definir data de início do serviço (agora)
    NEW.data_inicio_servico := NOW();

    -- Calcular próxima cobrança (1 ano a partir de hoje)
    NEW.proxima_cobranca_manutencao := NOW() + INTERVAL '1 year';

    -- Status da assinatura: agendada
    NEW.status_assinatura := 'agendada';

    RAISE NOTICE 'Assinatura agendada para lead %: próxima cobrança em %',
      NEW.id, NEW.proxima_cobranca_manutencao;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger
DROP TRIGGER IF EXISTS trigger_agendar_assinatura ON leads;
CREATE TRIGGER trigger_agendar_assinatura
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION agendar_assinatura_apos_pagamento();

-- =====================================================
-- VISUALIZAÇÃO PARA MONITORAMENTO DE ASSINATURAS
-- =====================================================
CREATE OR REPLACE VIEW vw_assinaturas_pendentes AS
SELECT
  l.id,
  l.nome,
  l.email,
  l.whatsapp,
  l.data_inicio_servico,
  l.proxima_cobranca_manutencao,
  l.status_assinatura,
  l.assinatura_manutencao_id,
  EXTRACT(DAY FROM (l.proxima_cobranca_manutencao - NOW())) as dias_ate_cobranca
FROM leads l
WHERE l.status_assinatura IN ('agendada', 'ativa')
ORDER BY l.proxima_cobranca_manutencao ASC;

COMMENT ON VIEW vw_assinaturas_pendentes IS 'Visão de assinaturas que precisam ser processadas ou estão ativas';

-- =====================================================
-- FUNÇÃO PARA ATIVAR ASSINATURAS PENDENTES
-- =====================================================
CREATE OR REPLACE FUNCTION ativar_assinaturas_pendentes()
RETURNS TABLE(lead_id UUID, lead_nome VARCHAR, acao VARCHAR) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id,
    l.nome,
    'Assinatura pronta para ativação'::VARCHAR
  FROM leads l
  WHERE l.status_assinatura = 'agendada'
    AND l.proxima_cobranca_manutencao <= NOW()
  ORDER BY l.proxima_cobranca_manutencao ASC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION ativar_assinaturas_pendentes IS 'Retorna leads que precisam ter assinatura ativada hoje';

-- =====================================================
-- DADOS DE EXEMPLO (OPCIONAL - REMOVER EM PRODUÇÃO)
-- =====================================================
-- Descomentar apenas para testar

-- UPDATE leads
-- SET status = 'em_producao'
-- WHERE id = 'seu-lead-id-aqui';
-- -- Isso vai trigger a função de agendar assinatura automaticamente

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================
SELECT
  'Campos adicionados com sucesso!' as resultado,
  COUNT(*) as total_leads,
  COUNT(CASE WHEN status_assinatura = 'agendada' THEN 1 END) as assinaturas_agendadas,
  COUNT(CASE WHEN status_assinatura = 'ativa' THEN 1 END) as assinaturas_ativas
FROM leads;
