-- =============================================
-- CORREÇÃO DEFINITIVA DE RLS - AGENDAMENTOS
-- Versão 2: Remove todas as policies e recria do zero
-- =============================================

-- 1. REMOVER TODAS AS POLICIES ANTIGAS
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'agendamentos') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON agendamentos';
    END LOOP;

    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'disponibilidade') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON disponibilidade';
    END LOOP;

    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'bloqueios') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON bloqueios';
    END LOOP;
END $$;

-- 2. GARANTIR QUE RLS ESTÁ HABILITADO
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE disponibilidade ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloqueios ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLICIES PARA AGENDAMENTOS
-- =============================================

-- INSERT: Permitir criação pública (anônimos e autenticados)
CREATE POLICY "agendamentos_insert_public"
  ON agendamentos
  FOR INSERT
  TO public
  WITH CHECK (true);

-- SELECT: Apenas admin autenticado pode ler
CREATE POLICY "agendamentos_select_admin"
  ON agendamentos
  FOR SELECT
  TO authenticated
  USING (true);

-- UPDATE: Apenas admin autenticado pode atualizar
CREATE POLICY "agendamentos_update_admin"
  ON agendamentos
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- DELETE: Apenas admin autenticado pode deletar
CREATE POLICY "agendamentos_delete_admin"
  ON agendamentos
  FOR DELETE
  TO authenticated
  USING (true);

-- =============================================
-- POLICIES PARA DISPONIBILIDADE
-- =============================================

-- SELECT: Leitura pública (para mostrar horários disponíveis)
CREATE POLICY "disponibilidade_select_public"
  ON disponibilidade
  FOR SELECT
  TO public
  USING (ativo = true);

-- ALL: Admin pode fazer tudo
CREATE POLICY "disponibilidade_all_admin"
  ON disponibilidade
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================
-- POLICIES PARA BLOQUEIOS
-- =============================================

-- SELECT: Leitura pública de bloqueios ativos
CREATE POLICY "bloqueios_select_public"
  ON bloqueios
  FOR SELECT
  TO public
  USING (ativo = true);

-- ALL: Admin pode fazer tudo
CREATE POLICY "bloqueios_all_admin"
  ON bloqueios
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================
-- VERIFICAÇÃO FINAL
-- =============================================

-- Listar todas as policies criadas
SELECT
  schemaname,
  tablename,
  policyname,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('agendamentos', 'disponibilidade', 'bloqueios')
ORDER BY tablename, policyname;

-- Testar se um usuário anônimo pode inserir
-- (Execute isso para confirmar que funciona):
/*
SET ROLE anon;
INSERT INTO agendamentos (nome, email, whatsapp, data, horario, tipo, status)
VALUES ('Teste', 'teste@example.com', '11999999999', '2025-12-15', '09:00', 'comercial', 'agendado')
RETURNING id;
RESET ROLE;
*/
