-- =============================================
-- MIGRATION: Adicionar campo 'origem' na tabela leads
-- Data: 2025-12-23
-- Descrição: Campo para rastrear origem do cliente:
--            - 'direto': Completou formulário de uma vez
--            - 'convertido_de_lead': Era lead_parcial e depois completou
-- =============================================

-- Adicionar coluna origem
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS origem TEXT DEFAULT 'direto'
CHECK (origem IN ('direto', 'convertido_de_lead'));

-- Comentário para documentar
COMMENT ON COLUMN leads.origem IS 'Origem do cliente: direto (completou tudo de uma vez) ou convertido_de_lead (começou como lead_parcial e depois completou)';

-- Atualizar leads existentes
-- Todos os leads atuais serão marcados como 'direto' por padrão
UPDATE leads SET origem = 'direto' WHERE origem IS NULL;
