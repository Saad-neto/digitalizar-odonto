-- =============================================
-- CORREÇÃO DE RLS - AGENDAMENTOS
-- Este script corrige o problema de 401 ao criar agendamentos
-- =============================================

-- REMOVER POLICIES ANTIGAS (se existirem)
DROP POLICY IF EXISTS "Qualquer um pode criar agendamento" ON agendamentos;
DROP POLICY IF EXISTS "Admin pode ver todos agendamentos" ON agendamentos;
DROP POLICY IF EXISTS "Disponibilidade é pública para leitura" ON disponibilidade;
DROP POLICY IF EXISTS "Bloqueios são públicos para leitura" ON bloqueios;

-- GARANTIR QUE RLS ESTÁ HABILITADO
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE disponibilidade ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloqueios ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLICIES PARA AGENDAMENTOS
-- =============================================

-- Permitir INSERT PÚBLICO (usuários não autenticados podem criar agendamentos)
CREATE POLICY "Permitir criação pública de agendamentos"
  ON agendamentos
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Permitir SELECT apenas para ADMIN autenticado
CREATE POLICY "Admin pode ler agendamentos"
  ON agendamentos
  FOR SELECT
  TO authenticated
  USING (true);

-- Permitir UPDATE apenas para ADMIN autenticado
CREATE POLICY "Admin pode atualizar agendamentos"
  ON agendamentos
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Permitir DELETE apenas para ADMIN autenticado
CREATE POLICY "Admin pode deletar agendamentos"
  ON agendamentos
  FOR DELETE
  TO authenticated
  USING (true);

-- =============================================
-- POLICIES PARA DISPONIBILIDADE
-- =============================================

-- Permitir leitura PÚBLICA (necessário para mostrar horários disponíveis)
CREATE POLICY "Leitura pública de disponibilidade"
  ON disponibilidade
  FOR SELECT
  TO anon, authenticated
  USING (ativo = true);

-- Permitir escrita apenas para ADMIN
CREATE POLICY "Admin pode gerenciar disponibilidade"
  ON disponibilidade
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================
-- POLICIES PARA BLOQUEIOS
-- =============================================

-- Permitir leitura PÚBLICA de bloqueios ativos
CREATE POLICY "Leitura pública de bloqueios"
  ON bloqueios
  FOR SELECT
  TO anon, authenticated
  USING (ativo = true);

-- Permitir escrita apenas para ADMIN
CREATE POLICY "Admin pode gerenciar bloqueios"
  ON bloqueios
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================
-- VERIFICAR CONFIGURAÇÃO
-- =============================================

-- Query para verificar se as policies foram criadas:
-- SELECT schemaname, tablename, policyname, roles, cmd
-- FROM pg_policies
-- WHERE tablename IN ('agendamentos', 'disponibilidade', 'bloqueios')
-- ORDER BY tablename, policyname;
