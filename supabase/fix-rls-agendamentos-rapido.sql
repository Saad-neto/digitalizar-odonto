-- =============================================
-- CORREÇÃO RÁPIDA: Habilitar RLS em agendamentos
-- Execute este script no SQL Editor do Supabase
-- =============================================

-- PASSO 1: Habilitar RLS na tabela agendamentos
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;

-- PASSO 2: Remover policies antigas (se existirem)
DROP POLICY IF EXISTS "agendamentos_public_insert" ON agendamentos;
DROP POLICY IF EXISTS "agendamentos_auth_select" ON agendamentos;
DROP POLICY IF EXISTS "agendamentos_auth_update" ON agendamentos;
DROP POLICY IF EXISTS "agendamentos_auth_delete" ON agendamentos;
DROP POLICY IF EXISTS "Qualquer um pode criar agendamento" ON agendamentos;
DROP POLICY IF EXISTS "Admin pode ver todos agendamentos" ON agendamentos;
DROP POLICY IF EXISTS "Permitir criação pública de agendamentos" ON agendamentos;
DROP POLICY IF EXISTS "Admin pode ler agendamentos" ON agendamentos;
DROP POLICY IF EXISTS "Admin pode atualizar agendamentos" ON agendamentos;
DROP POLICY IF EXISTS "Admin pode deletar agendamentos" ON agendamentos;

-- PASSO 3: Criar policies corretas

-- INSERT: Permitir que QUALQUER PESSOA (anônima ou autenticada) crie agendamentos
CREATE POLICY "agendamentos_public_insert"
  ON agendamentos
  FOR INSERT
  TO public
  WITH CHECK (true);

-- SELECT: Apenas usuários autenticados (admin) podem ver agendamentos
CREATE POLICY "agendamentos_auth_select"
  ON agendamentos
  FOR SELECT
  TO authenticated
  USING (true);

-- UPDATE: Apenas usuários autenticados podem atualizar
CREATE POLICY "agendamentos_auth_update"
  ON agendamentos
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- DELETE: Apenas usuários autenticados podem deletar
CREATE POLICY "agendamentos_auth_delete"
  ON agendamentos
  FOR DELETE
  TO authenticated
  USING (true);

-- PASSO 4: Verificar se funcionou
SELECT
  'STATUS FINAL' as info,
  tablename as tabela,
  CASE rowsecurity
    WHEN true THEN '✓ RLS Habilitado'
    ELSE '✗ RLS Desabilitado'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'agendamentos';

-- PASSO 5: Listar policies criadas
SELECT
  'POLICIES CRIADAS' as info,
  policyname as nome_policy,
  cmd as operacao,
  roles as funcoes
FROM pg_policies
WHERE tablename = 'agendamentos'
ORDER BY policyname;

-- =============================================
-- RESULTADO ESPERADO:
-- ✓ RLS Habilitado na tabela agendamentos
-- ✓ 4 policies criadas (INSERT public, SELECT/UPDATE/DELETE authenticated)
-- =============================================
