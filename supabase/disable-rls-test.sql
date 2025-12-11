-- =============================================
-- TESTE: DESABILITAR RLS TEMPORARIAMENTE
-- ATENÇÃO: Isso é apenas para teste! NÃO use em produção permanentemente
-- =============================================

-- Desabilitar RLS na tabela agendamentos (TEMPORÁRIO - APENAS PARA TESTE)
ALTER TABLE agendamentos DISABLE ROW LEVEL SECURITY;

-- Verificar status
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'agendamentos';

-- Para RE-HABILITAR depois do teste, execute:
-- ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
