-- ======================================
-- SISTEMA DE CUPONS E AFILIADOS
-- ======================================

-- Adicionar colunas na tabela leads para rastreamento
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS cupom_usado VARCHAR(50),
ADD COLUMN IF NOT EXISTS cupom_desconto DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS afiliado_ref VARCHAR(100),
ADD COLUMN IF NOT EXISTS origem_pagamento VARCHAR(20) DEFAULT 'asaas'; -- 'asaas' ou 'hotmart'

-- Criar tabela de cupons
CREATE TABLE IF NOT EXISTS cupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  descricao TEXT,
  tipo VARCHAR(20) NOT NULL, -- 'percentual' ou 'fixo'
  valor DECIMAL(10,2) NOT NULL, -- Se percentual: 10 = 10%, Se fixo: 100 = R$ 100
  ativo BOOLEAN DEFAULT true,
  data_inicio TIMESTAMP DEFAULT NOW(),
  data_fim TIMESTAMP,
  usos_maximos INTEGER, -- NULL = ilimitado
  usos_atuais INTEGER DEFAULT 0,
  afiliado_nome VARCHAR(255), -- Nome do afiliado dono do cupom
  afiliado_email VARCHAR(255),
  afiliado_comissao DECIMAL(5,2), -- Percentual de comissão (ex: 10 = 10%)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_cupons_codigo ON cupons(codigo);
CREATE INDEX IF NOT EXISTS idx_cupons_ativo ON cupons(ativo);
CREATE INDEX IF NOT EXISTS idx_leads_cupom ON leads(cupom_usado);
CREATE INDEX IF NOT EXISTS idx_leads_afiliado ON leads(afiliado_ref);

-- Criar tabela de uso de cupons (para auditoria)
CREATE TABLE IF NOT EXISTS cupons_uso (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cupom_id UUID REFERENCES cupons(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  codigo_usado VARCHAR(50) NOT NULL,
  desconto_aplicado DECIMAL(10,2) NOT NULL,
  valor_original DECIMAL(10,2) NOT NULL,
  valor_final DECIMAL(10,2) NOT NULL,
  usado_em TIMESTAMP DEFAULT NOW()
);

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_cupons_uso_cupom ON cupons_uso(cupom_id);
CREATE INDEX IF NOT EXISTS idx_cupons_uso_lead ON cupons_uso(lead_id);

-- Função para atualizar contador de uso
CREATE OR REPLACE FUNCTION incrementar_uso_cupom()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE cupons
  SET usos_atuais = usos_atuais + 1,
      updated_at = NOW()
  WHERE id = NEW.cupom_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para incrementar automaticamente
DROP TRIGGER IF EXISTS trigger_incrementar_uso ON cupons_uso;
CREATE TRIGGER trigger_incrementar_uso
  AFTER INSERT ON cupons_uso
  FOR EACH ROW
  EXECUTE FUNCTION incrementar_uso_cupom();

-- Inserir alguns cupons de exemplo (SANDBOX)
INSERT INTO cupons (codigo, descricao, tipo, valor, ativo, afiliado_nome, afiliado_comissao)
VALUES
  ('BEMVINDO10', 'Desconto de 10% para novos clientes', 'percentual', 10, true, NULL, NULL),
  ('PRIMEIRASVENDAS', 'R$ 50 de desconto no primeiro site', 'fixo', 50, true, NULL, NULL),
  ('AFILIADO_JOAO', 'Cupom do afiliado João (5% desconto)', 'percentual', 5, true, 'João Silva', 10),
  ('AFILIADO_MARIA', 'Cupom da afiliada Maria (10% desconto)', 'percentual', 10, true, 'Maria Santos', 15)
ON CONFLICT (codigo) DO NOTHING;

-- Comentários nas tabelas
COMMENT ON TABLE cupons IS 'Tabela de cupons de desconto e rastreamento de afiliados';
COMMENT ON TABLE cupons_uso IS 'Histórico de uso de cupons para auditoria';
COMMENT ON COLUMN leads.cupom_usado IS 'Código do cupom utilizado pelo cliente';
COMMENT ON COLUMN leads.cupom_desconto IS 'Valor do desconto aplicado em reais';
COMMENT ON COLUMN leads.afiliado_ref IS 'Identificador do afiliado (ex: nome, email, ou código)';
COMMENT ON COLUMN leads.origem_pagamento IS 'Gateway usado: asaas ou hotmart';

-- Exibir cupons criados
SELECT * FROM cupons;
