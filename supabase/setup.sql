-- =============================================
-- SETUP DO BANCO DE DADOS SUPABASE
-- Digitalizar Odonto - Sistema de Briefing e Pagamentos
-- =============================================

-- Habilitar UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABELA: leads
-- Armazena todos os leads (clientes potenciais/confirmados)
-- =============================================

CREATE TABLE IF NOT EXISTS leads (
  -- Identificação
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Status do lead
  status TEXT NOT NULL DEFAULT 'novo'
    CHECK (status IN ('novo', 'pago_50', 'em_producao', 'em_aprovacao', 'pago_100', 'concluido')),

  -- Informações pessoais/contato
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,

  -- Dados completos do briefing (JSON)
  briefing_data JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Valores (em centavos)
  valor_total INTEGER NOT NULL DEFAULT 49700, -- R$ 497,00
  valor_entrada INTEGER NOT NULL DEFAULT 24850, -- R$ 248,50 (50%)
  valor_saldo INTEGER NOT NULL DEFAULT 24850, -- R$ 248,50 (50%)

  -- IDs de pagamento do Stripe
  stripe_payment_intent_entrada TEXT,
  stripe_payment_intent_saldo TEXT,
  stripe_customer_id TEXT,

  -- URLs
  preview_url TEXT, -- URL do preview do site para aprovação
  site_final_url TEXT, -- URL do site publicado

  -- Timestamps de eventos
  pago_entrada_at TIMESTAMP WITH TIME ZONE,
  pago_saldo_at TIMESTAMP WITH TIME ZONE,
  aprovado_at TIMESTAMP WITH TIME ZONE,
  concluido_at TIMESTAMP WITH TIME ZONE
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_whatsapp ON leads(whatsapp);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- TABELA: payments
-- Armazena histórico de pagamentos
-- =============================================

CREATE TABLE IF NOT EXISTS payments (
  -- Identificação
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Relação com lead
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,

  -- Tipo de pagamento
  tipo TEXT NOT NULL CHECK (tipo IN ('entrada', 'saldo')),

  -- Valor (em centavos)
  valor INTEGER NOT NULL,

  -- Status
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled')),

  -- Stripe IDs
  stripe_payment_intent_id TEXT NOT NULL UNIQUE,
  stripe_session_id TEXT,
  stripe_customer_id TEXT,

  -- Metadados adicionais (JSON)
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  paid_at TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_payments_lead_id ON payments(lead_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent ON payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_session ON payments(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Políticas para acesso público (apenas leitura para o próprio lead)
-- Nota: Ajuste conforme necessário para seu caso de uso

-- Policy: Qualquer um pode criar um lead (cadastro público)
CREATE POLICY "Permitir insert público" ON leads
  FOR INSERT
  WITH CHECK (true);

-- Policy: Apenas admins autenticados podem ler todos os leads
-- (Para dashboard admin)
CREATE POLICY "Admins podem ler todos leads" ON leads
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Apenas admins autenticados podem atualizar leads
CREATE POLICY "Admins podem atualizar leads" ON leads
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy: Payments - apenas admins autenticados
CREATE POLICY "Admins podem ler todos payments" ON payments
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir insert público payments" ON payments
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins podem atualizar payments" ON payments
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- =============================================
-- STORAGE BUCKETS
-- Para upload de logos, fotos, depoimentos
-- =============================================

-- Criar buckets (execute via Dashboard do Supabase ou API)
-- Bucket: logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket: fotos
INSERT INTO storage.buckets (id, name, public)
VALUES ('fotos', 'fotos', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket: depoimentos
INSERT INTO storage.buckets (id, name, public)
VALUES ('depoimentos', 'depoimentos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage (permitir upload público, leitura pública)
CREATE POLICY "Permitir upload público logos" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'logos');

CREATE POLICY "Permitir leitura pública logos" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'logos');

CREATE POLICY "Permitir upload público fotos" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'fotos');

CREATE POLICY "Permitir leitura pública fotos" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'fotos');

CREATE POLICY "Permitir upload público depoimentos" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'depoimentos');

CREATE POLICY "Permitir leitura pública depoimentos" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'depoimentos');

-- =============================================
-- FUNCTIONS ÚTEIS
-- =============================================

-- Function: Contar leads por status
CREATE OR REPLACE FUNCTION count_leads_by_status()
RETURNS TABLE(status TEXT, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT l.status, COUNT(*)
  FROM leads l
  GROUP BY l.status
  ORDER BY l.status;
END;
$$ LANGUAGE plpgsql;

-- Function: Relatório de pagamentos por período
CREATE OR REPLACE FUNCTION payment_report(
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE(
  tipo TEXT,
  total_pagamentos BIGINT,
  valor_total_centavos BIGINT,
  valor_total_reais NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.tipo,
    COUNT(*) as total_pagamentos,
    SUM(p.valor) as valor_total_centavos,
    ROUND(SUM(p.valor)::NUMERIC / 100, 2) as valor_total_reais
  FROM payments p
  WHERE p.status = 'succeeded'
    AND p.created_at >= start_date
    AND p.created_at <= end_date
  GROUP BY p.tipo;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- DADOS DE TESTE (Opcional - remover em produção)
-- =============================================

-- Comentado por padrão - descomente para inserir dados de teste
/*
INSERT INTO leads (nome, email, whatsapp, briefing_data, status)
VALUES
  ('Dr. João Silva', 'joao@teste.com', '(18) 99999-9999',
   '{"consultorio": "Clínica Odonto Teste", "especialidades": ["Implantodontia"]}'::jsonb,
   'pago_50'),
  ('Dra. Maria Santos', 'maria@teste.com', '(11) 98888-8888',
   '{"consultorio": "Sorrisos Perfeitos", "especialidades": ["Ortodontia"]}'::jsonb,
   'novo');
*/

-- =============================================
-- FIM DO SCRIPT
-- =============================================

-- Para executar este script:
-- 1. Acesse seu projeto no Supabase Dashboard
-- 2. Vá em "SQL Editor"
-- 3. Cole todo este script
-- 4. Clique em "Run"
-- 5. Verifique se as tabelas foram criadas em "Table Editor"

-- Ou execute via CLI:
-- supabase db reset (se tiver CLI configurado)
