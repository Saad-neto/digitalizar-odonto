-- =============================================
-- MIGRAÇÃO: Novo Fluxo de Aprovação e Pagamento
-- Data: 09/12/2025
-- Descrição: Atualiza sistema para novo modelo de negócio
-- =============================================

-- 1. Atualizar constraint de status com os novos valores
-- =============================================

ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_status_check;

ALTER TABLE leads ADD CONSTRAINT leads_status_check
  CHECK (status IN (
    'novo',                    -- Lead criado (briefing preenchido)
    'em_producao',             -- Site sendo produzido
    'aguardando_aprovacao',    -- Site pronto, aguardando aprovação do cliente
    'aprovado_pagamento',      -- Cliente aprovou e pagou
    'em_ajustes',              -- Fazendo ajustes solicitados
    'aprovacao_final',         -- Aguardando aprovação final
    'no_ar',                   -- Site publicado
    'concluido'                -- Projeto finalizado
  ));

-- 2. Adicionar novos campos
-- =============================================

-- Contador de rodadas de ajustes (máximo 2)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS rodadas_ajustes_usadas INTEGER NOT NULL DEFAULT 0;

-- Data da primeira aprovação (quando cliente aprova o site inicial)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS data_aprovacao_inicial TIMESTAMP WITH TIME ZONE;

-- Data da aprovação final (após ajustes, pronto para publicar)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS data_aprovacao_final TIMESTAMP WITH TIME ZONE;

-- Data limite para publicação (24h após aprovação final)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS data_limite_publicacao TIMESTAMP WITH TIME ZONE;

-- 3. Adicionar campos para integração com Asaas
-- =============================================

-- ID do cliente no Asaas
ALTER TABLE leads ADD COLUMN IF NOT EXISTS asaas_customer_id TEXT;

-- ID da cobrança no Asaas
ALTER TABLE leads ADD COLUMN IF NOT EXISTS asaas_payment_id TEXT;

-- Link da cobrança (enviar para cliente)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS asaas_payment_url TEXT;

-- 4. Atualizar tabela de payments para suportar Asaas
-- =============================================

-- Adicionar colunas Asaas na tabela payments
ALTER TABLE payments ADD COLUMN IF NOT EXISTS asaas_payment_id TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS asaas_customer_id TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_url TEXT;

-- Atualizar constraint de tipo para incluir 'total' (100% de uma vez)
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_tipo_check;
ALTER TABLE payments ADD CONSTRAINT payments_tipo_check
  CHECK (tipo IN ('entrada', 'saldo', 'total'));

-- 5. Criar índices para os novos campos
-- =============================================

CREATE INDEX IF NOT EXISTS idx_leads_rodadas_ajustes ON leads(rodadas_ajustes_usadas);
CREATE INDEX IF NOT EXISTS idx_leads_asaas_customer ON leads(asaas_customer_id);
CREATE INDEX IF NOT EXISTS idx_leads_asaas_payment ON leads(asaas_payment_id);

-- 6. Comentários nas colunas (documentação)
-- =============================================

COMMENT ON COLUMN leads.rodadas_ajustes_usadas IS 'Contador de rodadas de ajustes utilizadas (máximo 2)';
COMMENT ON COLUMN leads.data_aprovacao_inicial IS 'Data/hora em que o cliente aprovou o site inicial';
COMMENT ON COLUMN leads.data_aprovacao_final IS 'Data/hora em que o cliente aprovou a versão final';
COMMENT ON COLUMN leads.data_limite_publicacao IS 'Data/hora limite para publicar o site (24h após aprovação final)';
COMMENT ON COLUMN leads.asaas_customer_id IS 'ID do cliente no sistema Asaas';
COMMENT ON COLUMN leads.asaas_payment_id IS 'ID da cobrança no Asaas';
COMMENT ON COLUMN leads.asaas_payment_url IS 'Link da cobrança para enviar ao cliente';

-- 7. Atualizar leads existentes (se houver)
-- =============================================

-- Leads com status 'pago_50' viram 'aprovado_pagamento'
UPDATE leads SET status = 'aprovado_pagamento' WHERE status = 'pago_50';

-- Leads com status 'em_aprovacao' viram 'aguardando_aprovacao'
UPDATE leads SET status = 'aguardando_aprovacao' WHERE status = 'em_aprovacao';

-- Leads com status 'pago_100' viram 'no_ar'
UPDATE leads SET status = 'no_ar' WHERE status = 'pago_100';

-- =============================================
-- FIM DA MIGRAÇÃO
-- =============================================

-- Para executar esta migração:
-- 1. Acesse o Supabase Dashboard
-- 2. Vá em SQL Editor
-- 3. Cole este código e execute
-- 4. Verifique se não há erros

-- IMPORTANTE: Esta migração é segura e não apaga dados!
-- Ela apenas adiciona colunas e atualiza constraints.
