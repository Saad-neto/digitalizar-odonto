-- =============================================
-- MIGRATION: Adicionar campo 'origem' na tabela leads (CORRIGIDO)
-- Data: 2025-12-23
-- Descrição: Campo para rastrear origem do cliente:
--            - 'direto': Completou formulário de uma vez
--            - 'convertido_de_lead': Era lead_parcial e depois completou
-- =============================================

-- 1. Adicionar coluna origem (se não existir)
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS origem TEXT DEFAULT 'direto';

-- 2. Atualizar leads existentes com valor padrão
UPDATE leads
SET origem = 'direto'
WHERE origem IS NULL;

-- 3. Adicionar constraint para validar valores
ALTER TABLE leads
DROP CONSTRAINT IF EXISTS leads_origem_check;

ALTER TABLE leads
ADD CONSTRAINT leads_origem_check
CHECK (origem IN ('direto', 'convertido_de_lead'));

-- 4. Comentário para documentar
COMMENT ON COLUMN leads.origem IS 'Origem do cliente: direto (completou tudo de uma vez) ou convertido_de_lead (começou como lead_parcial e depois completou)';

-- Verificar se deu certo
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'leads' AND column_name = 'origem';
