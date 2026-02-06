-- =====================================================
-- TABELA: afiliados_leads
-- Armazena leads de afiliados antes de redirecionar para Hotmart
-- =====================================================

CREATE TABLE IF NOT EXISTS afiliados_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Dados básicos
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  instagram VARCHAR(100),

  -- Permissões e interesses
  autoriza_uso_conteudo BOOLEAN DEFAULT false NOT NULL,
  interesse_collab BOOLEAN DEFAULT false,
  aceita_termos BOOLEAN DEFAULT false NOT NULL,

  -- Tracking
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),

  -- Status do afiliado
  status VARCHAR(50) DEFAULT 'novo' NOT NULL,
  -- Possíveis status: novo, contatado, ativo, inativo, site_criado

  -- Site grátis
  site_criado BOOLEAN DEFAULT false,
  site_url VARCHAR(255),

  -- Notas internas
  notas TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_afiliados_email ON afiliados_leads(email);
CREATE INDEX IF NOT EXISTS idx_afiliados_status ON afiliados_leads(status);
CREATE INDEX IF NOT EXISTS idx_afiliados_created ON afiliados_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_afiliados_interesse_collab ON afiliados_leads(interesse_collab);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_afiliados_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_afiliados_updated_at ON afiliados_leads;
CREATE TRIGGER trigger_afiliados_updated_at
  BEFORE UPDATE ON afiliados_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_afiliados_updated_at();

-- RLS (Row Level Security)
ALTER TABLE afiliados_leads ENABLE ROW LEVEL SECURITY;

-- Política para permitir INSERT público (formulário de cadastro)
DROP POLICY IF EXISTS "Permitir insert público de afiliados" ON afiliados_leads;
CREATE POLICY "Permitir insert público de afiliados"
  ON afiliados_leads
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Política para permitir SELECT (admin)
DROP POLICY IF EXISTS "Permitir select de afiliados" ON afiliados_leads;
CREATE POLICY "Permitir select de afiliados"
  ON afiliados_leads
  FOR SELECT
  TO public
  USING (true);

-- Política para permitir UPDATE (admin)
DROP POLICY IF EXISTS "Permitir update de afiliados" ON afiliados_leads;
CREATE POLICY "Permitir update de afiliados"
  ON afiliados_leads
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Comentários
COMMENT ON TABLE afiliados_leads IS 'Leads de afiliados capturados antes do redirecionamento para Hotmart';
COMMENT ON COLUMN afiliados_leads.autoriza_uso_conteudo IS 'Autoriza uso do conteúdo criado pelo afiliado';
COMMENT ON COLUMN afiliados_leads.interesse_collab IS 'Tem interesse em fazer posts em collab/parceria';
COMMENT ON COLUMN afiliados_leads.status IS 'Status: novo, contatado, ativo, inativo, site_criado';
