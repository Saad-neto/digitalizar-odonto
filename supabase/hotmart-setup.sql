-- =============================================
-- TABELA: hotmart_vendas
-- Armazena vendas vindas do Hotmart
-- =============================================

CREATE TABLE IF NOT EXISTS hotmart_vendas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identificação da transação Hotmart
  transaction_id VARCHAR(100) UNIQUE NOT NULL,

  -- Status da venda
  status VARCHAR(50) NOT NULL DEFAULT 'pendente',
  -- Valores possíveis: pendente, aprovado, cancelado, reembolsado, chargeback

  -- Plano comprado
  plano VARCHAR(50) NOT NULL DEFAULT 'site',
  -- Valores: site, site_blog

  -- Valor da compra
  valor DECIMAL(10, 2) NOT NULL,

  -- Dados do cliente
  cliente_nome VARCHAR(255) NOT NULL,
  cliente_email VARCHAR(255) NOT NULL,
  cliente_telefone VARCHAR(50),
  cliente_documento VARCHAR(50),

  -- Dados do produto
  produto_id INTEGER,
  produto_nome VARCHAR(255),
  oferta_codigo VARCHAR(100),

  -- Dados do pagamento
  pagamento_tipo VARCHAR(50),
  pagamento_parcelas INTEGER DEFAULT 1,

  -- Data de aprovação
  data_aprovacao TIMESTAMP WITH TIME ZONE,

  -- Relacionamento com lead (quando o cliente preencher o briefing)
  lead_id UUID REFERENCES leads(id),

  -- Payload completo do webhook (para debug)
  payload_completo JSONB,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para busca rápida
CREATE INDEX IF NOT EXISTS idx_hotmart_vendas_email ON hotmart_vendas(cliente_email);
CREATE INDEX IF NOT EXISTS idx_hotmart_vendas_status ON hotmart_vendas(status);
CREATE INDEX IF NOT EXISTS idx_hotmart_vendas_transaction ON hotmart_vendas(transaction_id);
CREATE INDEX IF NOT EXISTS idx_hotmart_vendas_created ON hotmart_vendas(created_at DESC);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_hotmart_vendas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_hotmart_vendas_updated_at ON hotmart_vendas;
CREATE TRIGGER trigger_hotmart_vendas_updated_at
  BEFORE UPDATE ON hotmart_vendas
  FOR EACH ROW
  EXECUTE FUNCTION update_hotmart_vendas_updated_at();

-- Habilitar RLS (Row Level Security)
ALTER TABLE hotmart_vendas ENABLE ROW LEVEL SECURITY;

-- Política: Permitir inserção via webhook (sem autenticação)
CREATE POLICY "Allow webhook insert" ON hotmart_vendas
  FOR INSERT
  WITH CHECK (true);

-- Política: Permitir leitura para usuários autenticados (admin)
CREATE POLICY "Allow authenticated read" ON hotmart_vendas
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Política: Permitir atualização via webhook
CREATE POLICY "Allow webhook update" ON hotmart_vendas
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- =============================================
-- COMENTÁRIOS
-- =============================================
COMMENT ON TABLE hotmart_vendas IS 'Vendas recebidas via webhook do Hotmart';
COMMENT ON COLUMN hotmart_vendas.transaction_id IS 'ID único da transação no Hotmart';
COMMENT ON COLUMN hotmart_vendas.status IS 'Status: pendente, aprovado, cancelado, reembolsado, chargeback';
COMMENT ON COLUMN hotmart_vendas.plano IS 'Plano comprado: site ou site_blog';
COMMENT ON COLUMN hotmart_vendas.lead_id IS 'Referência ao lead quando o cliente preencher o briefing';
