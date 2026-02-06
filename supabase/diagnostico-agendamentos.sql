-- =============================================
-- DIAGNÓSTICO DO SISTEMA DE AGENDAMENTOS
-- Execute este script no SQL Editor do Supabase
-- =============================================

-- 1. VERIFICAR SE AS TABELAS EXISTEM
SELECT
  'TABELAS EXISTENTES' as secao,
  table_name as nome,
  CASE
    WHEN table_name = 'agendamentos' THEN '✓'
    WHEN table_name = 'disponibilidade' THEN '✓'
    WHEN table_name = 'bloqueios' THEN '✓'
    ELSE '✗'
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('agendamentos', 'disponibilidade', 'bloqueios')
ORDER BY table_name;

-- 2. VERIFICAR SE AS FUNÇÕES EXISTEM
SELECT
  'FUNÇÕES EXISTENTES' as secao,
  proname as nome_funcao,
  pg_get_function_arguments(oid) as argumentos
FROM pg_proc
WHERE proname IN ('listar_horarios_disponiveis', 'verificar_disponibilidade')
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- 3. VERIFICAR POLICIES RLS
SELECT
  'POLICIES RLS' as secao,
  tablename as tabela,
  policyname as policy,
  cmd as comando,
  roles as funcoes
FROM pg_policies
WHERE tablename IN ('agendamentos', 'disponibilidade', 'bloqueios')
ORDER BY tablename, policyname;

-- 4. VERIFICAR SE HÁ DADOS NA TABELA DISPONIBILIDADE
SELECT
  'DISPONIBILIDADE CONFIGURADA' as secao,
  COUNT(*) as total_registros,
  COUNT(*) FILTER (WHERE ativo = true) as registros_ativos
FROM disponibilidade;

-- 5. MOSTRAR HORÁRIOS CONFIGURADOS (se existirem)
SELECT
  'HORÁRIOS POR DIA' as secao,
  CASE dia_semana
    WHEN 0 THEN 'Domingo'
    WHEN 1 THEN 'Segunda-feira'
    WHEN 2 THEN 'Terça-feira'
    WHEN 3 THEN 'Quarta-feira'
    WHEN 4 THEN 'Quinta-feira'
    WHEN 5 THEN 'Sexta-feira'
    WHEN 6 THEN 'Sábado'
  END as dia,
  horario_inicio,
  horario_fim,
  duracao_slot as duracao_minutos,
  ativo
FROM disponibilidade
ORDER BY dia_semana, horario_inicio;

-- 6. VERIFICAR STATUS DO RLS
SELECT
  'STATUS RLS' as secao,
  tablename as tabela,
  CASE rowsecurity
    WHEN true THEN '✓ Habilitado'
    ELSE '✗ Desabilitado'
  END as status_rls
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('agendamentos', 'disponibilidade', 'bloqueios')
ORDER BY tablename;

-- 7. TESTAR FUNÇÃO DE LISTAR HORÁRIOS (se existir)
-- Testa para segunda-feira, 20/01/2025
DO $$
BEGIN
  BEGIN
    RAISE NOTICE 'Tentando executar listar_horarios_disponiveis...';
    PERFORM listar_horarios_disponiveis('2025-01-20');
    RAISE NOTICE '✓ Função listar_horarios_disponiveis FUNCIONA';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '✗ ERRO ao executar função: %', SQLERRM;
  END;
END $$;

-- =============================================
-- RESULTADOS ESPERADOS:
-- =============================================
-- Se tudo estiver correto, você deve ver:
-- ✓ 3 tabelas existentes (agendamentos, disponibilidade, bloqueios)
-- ✓ 2 funções criadas (listar_horarios_disponiveis, verificar_disponibilidade)
-- ✓ Várias policies RLS configuradas
-- ✓ Pelo menos 8 registros de disponibilidade (Segunda a Sexta, manhã e tarde)
-- ✓ RLS habilitado nas 3 tabelas
-- ✓ Função de listar horários funciona sem erro
