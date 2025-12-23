-- =============================================
-- MIGRATION: Adicionar status 'lead_parcial'
-- Data: 2025-12-23
-- Descrição: Adiciona o status 'lead_parcial' para capturar leads
--            que abandonaram o formulário após a página 1
-- =============================================

-- Remover a constraint antiga
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_status_check;

-- Adicionar nova constraint com 'lead_parcial'
ALTER TABLE leads ADD CONSTRAINT leads_status_check
  CHECK (status IN (
    'lead_parcial',      -- Novo: Lead abandonou formulário após página 1
    'novo',              -- Lead completou formulário mas não pagou
    'pago_50',           -- Pagou 50% de entrada
    'em_producao',       -- Site em desenvolvimento
    'em_aprovacao',      -- Site aguardando aprovação do cliente
    'pago_100',          -- Pagou os 100%
    'concluido'          -- Projeto finalizado
  ));

-- Comentário para documentar
COMMENT ON COLUMN leads.status IS 'Status do lead: lead_parcial (abandonou formulário), novo (formulário completo), pago_50, em_producao, em_aprovacao, pago_100, concluido';
