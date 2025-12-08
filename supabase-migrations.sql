-- ================================================
-- MIGRATIONS PARA DASHBOARD ADMINISTRATIVO - FASE 2
-- Execute este SQL no Supabase SQL Editor
-- ================================================

-- 1. Criar tabela de histórico de status
CREATE TABLE IF NOT EXISTS public.lead_status_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar tabela de notas internas
CREATE TABLE IF NOT EXISTS public.lead_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Habilitar RLS (Row Level Security) para histórico
ALTER TABLE public.lead_status_history ENABLE ROW LEVEL SECURITY;

-- 4. Habilitar RLS para notas
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;

-- 5. Criar política de acesso para histórico (permitir leitura autenticada)
CREATE POLICY "Usuários autenticados podem ver histórico"
  ON public.lead_status_history
  FOR SELECT
  TO authenticated
  USING (true);

-- 6. Criar política de inserção para histórico
CREATE POLICY "Usuários autenticados podem adicionar histórico"
  ON public.lead_status_history
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 7. Criar política de acesso para notas (permitir leitura autenticada)
CREATE POLICY "Usuários autenticados podem ver notas"
  ON public.lead_notes
  FOR SELECT
  TO authenticated
  USING (true);

-- 8. Criar política de inserção para notas
CREATE POLICY "Usuários autenticados podem adicionar notas"
  ON public.lead_notes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 9. Criar política de atualização para notas
CREATE POLICY "Usuários autenticados podem atualizar notas"
  ON public.lead_notes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 10. Criar política de exclusão para notas
CREATE POLICY "Usuários autenticados podem excluir notas"
  ON public.lead_notes
  FOR DELETE
  TO authenticated
  USING (true);

-- 11. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_lead_status_history_lead_id ON public.lead_status_history(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_status_history_created_at ON public.lead_status_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_id ON public.lead_notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_notes_created_at ON public.lead_notes(created_at DESC);

-- 12. Criar função para registrar histórico automaticamente
CREATE OR REPLACE FUNCTION log_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.lead_status_history (lead_id, old_status, new_status)
    VALUES (NEW.id, OLD.status, NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 13. Criar trigger para registrar mudanças de status automaticamente
DROP TRIGGER IF EXISTS trigger_log_status_change ON public.leads;
CREATE TRIGGER trigger_log_status_change
  AFTER UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION log_status_change();

-- ================================================
-- FIM DAS MIGRATIONS
-- ================================================

-- VERIFICAÇÃO: Execute para ver se as tabelas foram criadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('lead_status_history', 'lead_notes');
